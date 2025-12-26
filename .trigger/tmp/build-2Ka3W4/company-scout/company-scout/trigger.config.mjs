import {
  defineConfig
} from "../../chunk-RCE2RBAL.mjs";
import "../../chunk-WZGQJWAS.mjs";
import {
  init_esm
} from "../../chunk-FUV6SSYK.mjs";

// trigger.config.ts
init_esm();
var trigger_config_default = defineConfig({
  project: "proj_amoougeubbocksquqycw",
  // Your Next.js project is configured with a 300s (5min) maxDuration by default.
  // You can mistakenly override this in your `vercel.json` or in the Vercel dashboard.
  maxDuration: 300,
  dirs: ["src/trigger"],
  build: {}
});
var resolveEnvVars = void 0;
export {
  trigger_config_default as default,
  resolveEnvVars
};
//# sourceMappingURL=trigger.config.mjs.map
