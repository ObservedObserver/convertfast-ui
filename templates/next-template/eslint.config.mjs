import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTypescript from "eslint-config-next/typescript";

export default defineConfig([
  ...nextVitals,
  ...nextTypescript,
  // The sample displays template assets without requiring a remote image service.
  { rules: { "@next/next/no-img-element": "off" } },
  globalIgnores([".next/**", "out/**", "next-env.d.ts"]),
]);
