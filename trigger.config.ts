import { defineConfig } from "@trigger.dev/sdk/v3";

export default defineConfig({
  project: "proj_placeholder",
  // Your Next.js project is configured with a 300s (5min) maxDuration by default.
  // You can mistakenly override this in your `vercel.json` or in the Vercel dashboard.
  maxDuration: 300, 
  triggerDirectories: ["src/trigger"],
});
