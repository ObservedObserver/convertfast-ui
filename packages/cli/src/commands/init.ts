import { Command } from "commander";
import fs from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { copyDir } from "../utils/copy.ts";
import { detectNextJsConfig, pathExists, readJson, safeProjectPath } from "../utils/get-config.ts";

const PACKAGE_ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");

export const init = new Command("init")
  .description("Detect the Next.js version, router and shadcn configuration")
  .option("-y, --yes", "run without prompts (configuration is detected automatically)")
  .option("--force", "replace an existing landing-pages.json")
  .option("--router <router>", "select app or pages when both exist")
  .option("--components <path>", "path to components.json")
  .action(async (options) => {
    const root = process.cwd();
    const configPath = await safeProjectPath(root, "landing-pages.json");
    if (await pathExists(configPath) && !options.force) throw new Error("landing-pages.json already exists. Use --force to replace it.");
    const nextjs = await detectNextJsConfig(root, options.router);
    let componentsPath = options.components;
    if (!componentsPath) {
      for (const candidate of ["components.json", "src/components.json", "lib/components.json"]) {
        if (await pathExists(path.join(root, candidate))) { componentsPath = candidate; break; }
      }
    }
    if (!componentsPath) throw new Error("components.json not found. Initialize shadcn first with npx shadcn@latest init.");
    const componentsFile = await safeProjectPath(root, componentsPath);
    const components = await readJson(componentsFile);
    if (!components.aliases?.components || components.tsx === false) throw new Error("A TypeScript shadcn configuration with aliases.components is required.");
    const assets = await safeProjectPath(root, "public/_convertfast");
    await copyDir(path.join(PACKAGE_ROOT, "assets/_convertfast"), assets);
    await fs.writeFile(configPath, JSON.stringify({ nextjs, components: { path: componentsPath } }, null, 2) + "\n");
    console.log(`Initialized Next.js ${nextjs.version}, ${nextjs.directory}, ${componentsPath}.`);
  });
