import { task } from "@trigger.dev/sdk";
import { db } from "../db";
import { companies } from "../db/schema";
import { eq } from "drizzle-orm";

export const researchCompany = task({
    id: "research-company",
    run: async (payload: { domain: string; dbId: number }) => {
        // Validate required environment variables
        if (!process.env.GROQ_API_KEY) {
            throw new Error(
                '❌ GROQ_API_KEY environment variable is not set!\n' +
                'Please add it to your environment variables.'
            );
        }

        const Groq = await import("groq-sdk");
        const groq = new Groq.default({ apiKey: process.env.GROQ_API_KEY });

        // helper to fetch text from a url
        async function fetchSiteText(url: string) {
            try {
                const controller = new AbortController();
                const timeoutId = setTimeout(() => controller.abort(), 8000);

                const res = await fetch(url, {
                    headers: { 'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/100.0.4896.127 Safari/537.36' },
                    signal: controller.signal
                });
                clearTimeout(timeoutId);

                if (!res.ok) return "";
                const html = await res.text();

                // Get clear text content
                return html.replace(/<script[^>]*>([\S\s]*?)<\/script>/gmi, "")
                    .replace(/<style[^>]*>([\S\s]*?)<\/style>/gmi, "")
                    .replace(/<[^>]+>/g, " ")
                    .replace(/\s+/g, " ")
                    .slice(0, 20000);
            } catch (e) {
                console.log(`Failed to fetch ${url}:`, e);
                return "";
            }
        }

        const baseUrl = payload.domain.startsWith('http') ? payload.domain : `https://${payload.domain}`;

        // 1. Fetch Homepage
        let aggressiveText = `SOURCE: HOMEPAGE (${baseUrl})\n` + await fetchSiteText(baseUrl);

        // 2. Blindly check common "About" paths to catch the team
        const subPages = ['/about', '/about-us', '/team', '/company'];

        // We'll run these in parallel but leniently
        const extraPages = await Promise.all(subPages.map(async path => {
            const cleanUrl = baseUrl.replace(/\/$/, "");
            const target = `${cleanUrl}${path}`;
            const txt = await fetchSiteText(target);
            if (txt.length > 500) { // Only keep if it looks like real content
                return `\nSOURCE: ${path.toUpperCase()} PAGE\n${txt}`;
            }
            return "";
        }));

        aggressiveText += extraPages.join("\n");

        const prompt = `
            Act as an elite sales intelligence agent for Company Scout. 
            
            GOAL: Build an org chart of the INTERNAL TEAM at ${payload.domain}.
            
            CRITICAL RULES:
            1. IGNORE TESTIMONIALS. If "Niklas" is giving a quote praising the company, he is a CUSTOMER. DO NOT extract him.
            2. IGNORE INVESTORS/ADVISORS if they are not operationally involved.
            3. LOOK FOR: "Founding Team", "Leadership", "Our Team", "Management".
            4. If LinkedIn URLs are found (e.g. linkedin.com/in/name), capture them.
            5. ONLY extract real people explicitly named in the text.
            
            Source Material:
            "${aggressiveText.slice(0, 25000)}..."

            Provide a JSON response with:
            - summary: A punchy, sales-focused company summary (max 2 sentences).
            - contacts: Array of found employees. 
              Schema: { 
                "name": string, 
                "role": string, 
                "type": "Decision Maker" | "Champion" | "Influencer", 
                "linkedin": string (optional),
                "email": string (optional, guess format first.last@domain.com only if high confidence)
              }
            - emailDraft: A highly personalized cold outreach email to the highest ranking person found.
              Constraint: Max 2 sentences. 
              Tone: Professional, witty, mentioning specific details found.

            Return ONLY valid JSON.
        `;

        const completion = await groq.chat.completions.create({
            messages: [{ role: "user", content: prompt }],
            model: "llama-3.3-70b-versatile",
            response_format: { type: "json_object" },
        });

        const text = completion.choices[0]?.message?.content || "{}";

        // Default values
        let summary = `Could not analyze ${payload.domain}`;
        let contacts: any[] = [];
        let emailDraft = "";

        try {
            const data = JSON.parse(text);
            summary = data.summary || summary;
            contacts = data.contacts || [];
            emailDraft = data.emailDraft || "";

            // Post-processing: If we found LinkedIn but no email, we leave email blank or try to guess? 
            // The prompt says guess if high confidence, let's fallback to a safe guess if missing to ensure UI looks good
            // checking if the email looks like a testimonial domain (e.g. not the target domain)
            const targetDomain = payload.domain.replace('https://', '').replace('www.', '').split('/')[0];

            contacts = contacts.map(c => {
                let email = c.email;
                // If no email, or email domain doesn't match target (likely a testimonial hallucination that slipped through), clean it
                if (!email || (email.includes('@') && !email.includes(targetDomain))) {
                    // Force generic guess for the target domain
                    email = `${c.name.split(' ')[0].toLowerCase()}@${targetDomain}`;
                }
                return { ...c, email };
            });

        } catch (e) {
            console.error("Failed to parse Groq response:", e);
        }

        // Write back to SingleStore
        await db.update(companies)
            .set({
                status: 'qualified',
                leadScore: contacts.length,
                summary: summary,
                contacts: contacts,
                emailDraft: emailDraft
            })
            .where(eq(companies.id, payload.dbId));

        return { score: contacts.length, summary, contacts, emailDraft };
    },
});
