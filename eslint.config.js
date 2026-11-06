import js from "@eslint/js";
import globals from "globals";

export default [
  { ignores: ["dist"] },
  js.configs.recommended,
  { files: ["src/**/*.js"], languageOptions: { ecmaVersion: "latest", sourceType: "module", globals: globals.browser } },
  { files: ["*.js"], languageOptions: { ecmaVersion: "latest", sourceType: "module", globals: globals.node } },
  // Cloudflare Pages Functions run in the Workers runtime.
  { files: ["functions/**/*.js", "lib/**/*.js"], languageOptions: { ecmaVersion: "latest", sourceType: "module", globals: globals.serviceworker } },
];
