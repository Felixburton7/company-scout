import { task } from "@trigger.dev/sdk/v3";
import { db } from "../db";
import { companies } from "../db/schema";
import { eq } from "drizzle-orm";

export const researchCompany = task({
    id: "research-company",
    run: async (payload: { domain: string; dbId: number }) => {

        // Step 1: Simulate "AI Research"
        await new Promise((resolve) => setTimeout(resolve, 2000)); // Fake the delay

        const fakeScores: Record<string, number> = {
            "openai.com": 95,
            "throxy.io": 100,
            "random.com": 20
        };

        // Default to 50 if score is undefined
        const score = fakeScores[payload.domain] ?? 50;
        const summary = `Generated AI summary for ${payload.domain}. Identified high-growth signals.`;

        // Step 2: Write back to SingleStore (The "Closed Loop")
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
