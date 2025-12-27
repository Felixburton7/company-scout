import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  reactCompiler: true,
  reactStrictMode: true,

  // Map Vercel environment variable to what Trigger.dev SDK expects
  env: {
    TRIGGER_SECRET_KEY: process.env.TRIGGER_DEV_SECRET_KEY || process.env.TRIGGER_SECRET_KEY || '',
  },
};

export default nextConfig;
