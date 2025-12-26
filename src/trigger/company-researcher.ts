import { task } from "@trigger.dev/sdk/v3";
import { db } from "../db";
import { companies } from "../db/schema";
import { eq } from "drizzle-orm";

export const researchCompany = task({
    id: "research-company",
    run: async (payload: { domain: string; dbId: number }) => {
        const Groq = await import("groq-sdk");
        const groq = new Groq.default({ apiKey: process.env.GROQ_API_KEY });

        const prompt = `
            Analyze the company with the domain: ${payload.domain}.
            Provide a JSON response with the following fields:
            - summary: A brief summary of what the company does (max 2 sentences).
            - score: A lead score from 0-100 based on how likely they are to be a high-growth tech company.
            
            Return ONLY valid JSON.
        `;

        const completion = await groq.chat.completions.create({
            messages: [{ role: "user", content: prompt }],
            model: "llama3-70b-8192",
            response_format: { type: "json_object" },
        });

        const text = completion.choices[0]?.message?.content || "{}";

        // Default values
        let score = 50;
        let summary = `Could not analyze ${payload.domain}`;

        try {
            const data = JSON.parse(text);
            score = data.score || 50;
            summary = data.summary || summary;
        } catch (e) {
            console.error("Failed to parse Groq response:", e);
        }

        // Write back to SingleStore
        await db.update(companies)
            .set({
                status: 'qualified',
                leadScore: score,
                summary: summary
            })
            .where(eq(companies.id, payload.dbId));

        return { score, summary };
    },
});
