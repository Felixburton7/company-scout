import { drizzle } from 'drizzle-orm/mysql2';
import mysql from 'mysql2/promise';
import * as schema from './schema';

// Validate DATABASE_URL exists
if (!process.env.DATABASE_URL) {
    throw new Error(
        '❌ DATABASE_URL environment variable is not set!\n' +
        'Please add it to your Vercel environment variables:\n' +
        'https://vercel.com/dashboard → Your Project → Settings → Environment Variables'
    );
}

const poolConnection = mysql.createPool({
    uri: process.env.DATABASE_URL
});

export const db = drizzle(poolConnection, { schema, mode: "default" });
