// API route to check environment variable status (without exposing values)
import type { NextApiRequest, NextApiResponse } from 'next';

export default function handler(req: NextApiRequest, res: NextApiResponse) {
    const envStatus = {
        DATABASE_URL: !!process.env.DATABASE_URL,
        GROQ_API_KEY: !!process.env.GROQ_API_KEY,
        TRIGGER_DEV_SECRET_KEY: !!process.env.TRIGGER_DEV_SECRET_KEY,
        NODE_ENV: process.env.NODE_ENV,
        VERCEL: !!process.env.VERCEL,
        VERCEL_ENV: process.env.VERCEL_ENV,
    };

    const allSet = envStatus.DATABASE_URL && envStatus.GROQ_API_KEY;

    res.status(200).json({
        status: allSet ? 'OK' : 'MISSING_VARIABLES',
        environment: envStatus,
        message: allSet
            ? '✅ All required environment variables are set'
            : '❌ Some required environment variables are missing',
        timestamp: new Date().toISOString(),
    });
}
