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
            // Convert to string to avoid BigInt precision loss in JSON serialization
            const id = String(result.insertId);

            // 2. Trigger the Agent
            await tasks.trigger("research-company", { domain: input.domain, dbId: id });

            return { success: true, id };
        }),

    getResults: publicProcedure
        .input(z.object({ id: z.string() }))
        .query(async ({ input }) => {
            // Parse back to number for the database query
            const numericId = parseInt(input.id, 10);
            console.log('[getResults] Querying for id:', input.id, 'numericId:', numericId);
            const [record] = await db.select().from(companies).where(eq(companies.id, numericId));
            console.log('[getResults] Found record:', record ? { id: record.id, status: record.status, domain: record.domain } : 'undefined');
            return record;
        })
});
