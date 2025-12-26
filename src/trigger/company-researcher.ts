import { task } from "@trigger.dev/sdk/v3";
import { db } from "../db";
import { companies } from "../db/schema";
import { eq } from "drizzle-orm";

export const researchCompany = task({
    id: "research-company",
    run: async (payload: { domain: string; dbId: number }) => {
        const { GoogleGenerativeAI } = await import("@google/generative-ai");

        const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);
        const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

        const prompt = `
            Analyze the company with the domain: ${payload.domain}.
            Provide a JSON response with the following fields:
            - summary: A brief summary of what the company does (max 2 sentences).
            - score: A lead score from 0-100 based on how likely they are to be a high-growth tech company.
            
            Return ONLY valid JSON.
        `;

        const result = await model.generateContent(prompt);
        const response = result.response;
        const text = response.text().replace(/```json/g, "").replace(/```/g, "").trim();

        // Default values in case parsing fails
        let score = 50;
        let summary = `Could not analyze ${payload.domain}`;

        try {
            const data = JSON.parse(text);
            score = data.score || 50;
            summary = data.summary || summary;
        } catch (e) {
            console.error("Failed to parse Gemini response:", e);
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
