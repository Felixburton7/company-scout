import { publicProcedure, router } from '../trpc';
import { z } from 'zod';
import { tasks } from "@trigger.dev/sdk/v3";
import { db } from "../../db";
import { companies } from "../../db/schema";
import { eq } from "drizzle-orm";

export const companyRouter = router({
    analyze: publicProcedure
        .input(z.object({ domain: z.string() }))
        .mutation(async ({ input }) => {
            // 1. Create record in DB as "researching"
            const [result] = await db.insert(companies).values({ domain: input.domain });
            // MySQL2 returns ResultSetHeader at index 0
            const id = result.insertId;

            // 2. Trigger the Agent
            await tasks.trigger("research-company", { domain: input.domain, dbId: id });

            return { success: true, id };
        }),

    getResults: publicProcedure
        .input(z.object({ id: z.number() }))
        .query(async ({ input }) => {
            const [record] = await db.select().from(companies).where(eq(companies.id, input.id));
            return record;
        })
});
