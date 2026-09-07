import { execa } from "execa";
import path from "node:path";
import fs from "node:fs/promises";
import { createRequire } from "node:module";
import { getComponentConfig, pathExists, readJson, resolveAliasesPath } from "./get-config.ts";

// Upgrade with the release matrix so a new upstream CLI cannot break published packages.
const SHADCN_CLI = "shadcn@4.21.0";

export async function rewriteSegmentImports(code: string): Promise<string> {
  const { components } = await getComponentConfig();
  const aliases = components.aliases;
  const ui = aliases.ui || `${aliases.components}/ui`;
  let result = code.replace(/(["'])@\/components\/ui\//g, `$1${ui}/`);
  if (result.includes("@/lib/utils")) {
    if (!aliases.utils) throw new Error("components.json must define aliases.utils for this template.");
    result = result.replace(/(["'])@\/lib\/utils\1/g, (_match, quote) => `${quote}${aliases.utils}${quote}`);
  }
  return result;
}

export async function runShadcnAdd(targets: string[], force = false, cwd = process.cwd()) {
  const { componentsFile } = await getComponentConfig();
  if (componentsFile !== path.join(cwd, "components.json")) {
    throw new Error("shadcn installs require components.json at the project root. Move the configuration there or install dependencies manually and use --skip-install.");
  }
  await execa("npx", ["--yes", SHADCN_CLI, "add", ...targets, "--yes", ...(force ? ["--overwrite"] : [])], {
    cwd,
    stdio: ["ignore", "inherit", "inherit"],
    timeout: 300_000,
  });
  await ensureIconDependencies(cwd);
}

export async function installSegmentDeps(segmentFilePath: string) {
  return installSegmentsDeps([await fs.readFile(segmentFilePath, "utf8")]);
}

export async function installSegmentsDeps(codes: string[]) {
  const aliases = await resolveAliasesPath();
  const { components } = await getComponentConfig();
  const ui = components.aliases.ui || `${components.aliases.components}/ui`;
  const requested = new Set<string>();
  for (const code of codes) {
    for (const match of code.matchAll(/from\s+["']([^"']+)["']/g)) {
      if (match[1].startsWith(`${ui}/`)) requested.add(match[1].slice(ui.length + 1));
    }
  }
  const missing = [];
  for (const component of requested) {
    if (!/^[a-z0-9-]+$/.test(component)) throw new Error(`Invalid component dependency: ${component}`);
    if (!await pathExists(path.join(aliases.ui, `${component}.tsx`)) && !await pathExists(path.join(aliases.ui, `${component}.jsx`))) missing.push(component);
  }
  if (missing.length) {
    console.log(`Installing shadcn dependencies: ${missing.join(", ")}`);
    await runShadcnAdd(missing);
  }
  if (!missing.length) await ensureIconDependencies();
  for (const component of missing) {
    if (!await pathExists(path.join(aliases.ui, `${component}.tsx`)) && !await pathExists(path.join(aliases.ui, `${component}.jsx`))) {
      throw new Error(`shadcn did not create '${component}'. Install it manually before retrying.`);
    }
  }
}

// shadcn 4 can emit icon imports without dependencies for older components.json files.
// Keep this allowlist aligned with the icon libraries supported by the pinned CLI.
const ICON_PACKAGES = new Set([
  "lucide-react", "@tabler/icons-react", "@hugeicons/react", "@hugeicons/core-free-icons",
  "@phosphor-icons/react", "@remixicon/react", "@radix-ui/react-icons",
]);
type PackageManager = "npm" | "yarn" | "pnpm" | "bun";

export async function detectPackageManager(cwd: string): Promise<PackageManager> {
  let directory = cwd;
  while (true) {
    const manifest = path.join(directory, "package.json");
    if (await pathExists(manifest)) {
      const declared = (await readJson(manifest)).packageManager;
      if (typeof declared === "string") {
        const manager = declared.split("@")[0];
        if (!["npm", "yarn", "pnpm", "bun"].includes(manager)) throw new Error(`Unsupported package manager '${declared}'. Install the missing icon packages manually.`);
        return manager as PackageManager;
      }
    }
    const locks: [PackageManager, string[]][] = [
      ["npm", ["package-lock.json", "npm-shrinkwrap.json"]], ["yarn", ["yarn.lock"]],
      ["pnpm", ["pnpm-lock.yaml"]], ["bun", ["bun.lock", "bun.lockb"]],
    ];
    const found: PackageManager[] = [];
    for (const [manager, files] of locks) {
      if ((await Promise.all(files.map(file => pathExists(path.join(directory, file))))).some(Boolean)) found.push(manager);
    }
    if (found.length > 1) throw new Error(`Multiple package-manager lockfiles found in ${directory}. Set package.json packageManager or remove obsolete lockfiles before installing icon dependencies.`);
    if (found.length === 1) return found[0];
    const parent = path.dirname(directory);
    if (parent === directory) return "npm";
    directory = parent;
  }
}

export async function ensureIconDependencies(cwd = process.cwd()) {
  const aliases = await resolveAliasesPath();
  const requested = new Set<string>();
  async function inspect(directory: string): Promise<void> {
    if (!await pathExists(directory)) return;
    for (const entry of await fs.readdir(directory, { withFileTypes: true })) {
      const file = path.join(directory, entry.name);
      if (entry.isDirectory()) await inspect(file);
      else if (entry.isFile() && /\.[cm]?[jt]sx?$/.test(entry.name)) {
        const code = await fs.readFile(file, "utf8");
        for (const match of code.matchAll(/(?:from\s+|(?:import|require)\s*\(\s*)["']([^"']+)["']/g)) {
          const specifier = match[1];
          const name = specifier.startsWith("@") ? specifier.split("/").slice(0, 2).join("/") : specifier.split("/")[0];
          if (ICON_PACKAGES.has(name)) requested.add(name);
        }
      }
    }
  }
  await inspect(aliases.ui);
  if (!requested.size) return;
  const packageFile = path.join(cwd, "package.json");
  const pkg = await readJson(packageFile);
  const require = createRequire(packageFile);
  const missing = [...requested].filter(name => {
    if (!pkg.dependencies?.[name] && !pkg.devDependencies?.[name]) return true;
    try { require.resolve(name); return false; } catch { return true; }
  });
  if (!missing.length) return;
  const specs = missing.map(name => {
    const version = pkg.dependencies?.[name] || pkg.devDependencies?.[name];
    return version ? `${name}@${version}` : name;
  });
  const manager = await detectPackageManager(cwd);
  console.log(`Installing icon dependencies referenced by shadcn components: ${missing.join(", ")}`);
  await execa(manager, [manager === "npm" ? "install" : "add", ...specs], {
    cwd, stdio: ["ignore", "inherit", "inherit"], timeout: 300_000,
  });
  const updated = await readJson(packageFile);
  for (const name of missing) {
    if (!updated.dependencies?.[name] && !updated.devDependencies?.[name]) throw new Error(`${manager} did not add ${name} to package.json. Install it manually before retrying.`);
    try { require.resolve(name); } catch { throw new Error(`${name} is still unavailable after installation. Run your package manager's install command and retry.`); }
  }
}
