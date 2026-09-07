import path from "node:path";
import fs from "node:fs/promises";
import { createRequire } from "node:module";
import { parseTsconfig, createPathsMatcher } from "get-tsconfig";
import { parse, type ParseError, printParseErrorCode } from "jsonc-parser";

export async function pathExists(file: string): Promise<boolean> {
  try { await fs.access(file); return true; } catch { return false; }
}

export async function readJson(file: string): Promise<any> {
  const errors: ParseError[] = [];
  const value = parse(await fs.readFile(file, "utf8"), errors, { allowTrailingComma: true });
  if (errors.length || !value || typeof value !== "object" || Array.isArray(value)) {
    throw new Error(`Invalid JSON configuration ${file}: ${errors.map(e => printParseErrorCode(e.error)).join(", ")}`);
  }
  return value;
}

export async function safeProjectPath(root: string, relative: string): Promise<string> {
  const destination = path.resolve(root, relative);
  const rel = path.relative(root, destination);
  if (rel === ".." || rel.startsWith(`..${path.sep}`) || path.isAbsolute(rel)) {
    throw new Error(`Path must stay inside the project: ${relative}`);
  }
  let current = root;
  for (const part of rel.split(path.sep).filter(Boolean)) {
    current = path.join(current, part);
    const stat = await fs.lstat(current).catch((error: NodeJS.ErrnoException) => {
      if (error.code === "ENOENT") return null;
      throw error;
    });
    if (stat?.isSymbolicLink()) throw new Error(`Refusing to write through symbolic link: ${current}`);
  }
  return destination;
}

export type Router = "app" | "pages";
export async function detectNextJsConfig(root: string, preferredRouter?: string) {
  if (preferredRouter && preferredRouter !== "app" && preferredRouter !== "pages") {
    throw new Error("Router must be app or pages.");
  }
  const pkg = await readJson(path.join(root, "package.json"));
  const requested = pkg.dependencies?.next || pkg.devDependencies?.next;
  if (!requested) throw new Error("Next.js dependency not found in package.json. Run this command from your Next.js project root.");
  let version: string = requested;
  try {
    const require = createRequire(path.join(root, "package.json"));
    version = (await readJson(require.resolve("next/package.json"))).version;
  } catch { /* An uninstalled project can still be initialized from its declared version. */ }
  const major = /^\D*(\d+)\./.exec(version)?.[1];
  if (!major) console.warn(`Could not identify the Next.js major version from '${version}'. Install dependencies before building.`);
  if (major && Number(major) > 16) console.warn(`Next.js ${version} has not been verified by this ConvertFast release.`);
  if (major && Number(major) < 14) throw new Error(`Next.js ${version} is unsupported. Use Next.js 14 or newer.`);
  for (const router of (preferredRouter ? [preferredRouter] : ["app", "pages"]) as Router[]) {
    for (const directory of [router, `src/${router}`]) {
      if ((await fs.stat(path.join(root, directory)).catch(() => null))?.isDirectory()) {
        await safeProjectPath(root, directory);
        return { router, directory, version };
      }
    }
  }
  throw new Error("No Next.js router directory found. Create app, src/app, pages, or src/pages first.");
}

export async function readLandingConfig() {
  const file = path.join(process.cwd(), "landing-pages.json");
  if (!await pathExists(file)) throw new Error("Run convertfast-ui init first to create landing-pages.json.");
  return readJson(file);
}

export async function resolveRouterPath(): Promise<{ rootDir: string; routerType: Router; pageFileName: "page.tsx" | "index.tsx" }> {
  const config = await readLandingConfig();
  const routerType = config.nextjs?.router;
  if (routerType !== "app" && routerType !== "pages") throw new Error("Invalid nextjs.router in landing-pages.json. Run init --force.");
  const detected = await detectNextJsConfig(process.cwd(), routerType);
  const directory = config.nextjs.directory || detected.directory;
  if (![routerType, `src/${routerType}`].includes(directory)) throw new Error("Invalid nextjs.directory in landing-pages.json.");
  const rootDir = await safeProjectPath(process.cwd(), directory);
  if (!(await fs.stat(rootDir).catch(() => null))?.isDirectory()) throw new Error(`Router directory does not exist: ${directory}`);
  return { rootDir, routerType, pageFileName: routerType === "app" ? "page.tsx" : "index.tsx" };
}

export async function getComponentConfig() {
  const landing = await pathExists(path.join(process.cwd(), "landing-pages.json")) ? await readLandingConfig() : {};
  const componentsFile = await safeProjectPath(process.cwd(), landing.components?.path || "components.json");
  if (!await pathExists(componentsFile)) throw new Error(`Missing ${componentsFile}. Initialize shadcn first with npx shadcn@latest init.`);
  const components = await readJson(componentsFile);
  if (components.tsx === false) throw new Error("ConvertFast generates TypeScript components. Set up a TypeScript Next.js project and shadcn tsx: true.");
  return { components, componentsFile };
}

export async function resolveAliasesPath(): Promise<Record<string, string>> {
  const root = process.cwd();
  const { components } = await getComponentConfig();
  const configFile = path.join(root, await pathExists(path.join(root, "tsconfig.json")) ? "tsconfig.json" : "jsconfig.json");
  const config = parseTsconfig(configFile);
  const matchPaths = createPathsMatcher({ path: configFile, config });
  const baseUrl = path.resolve(path.dirname(configFile), config.compilerOptions?.baseUrl || ".");
  const resolved: Record<string, string> = {};
  for (const [alias, raw] of Object.entries(components.aliases || {})) {
    if (typeof raw !== "string") throw new Error(`Invalid shadcn alias: ${alias}`);
    let target = matchPaths?.(raw)[0];
    if (!target && !raw.startsWith("@") && !raw.startsWith("~")) target = path.resolve(baseUrl, raw);
    if (!target) throw new Error(`Cannot resolve alias '${raw}' from ${configFile}.`);
    resolved[alias] = await safeProjectPath(root, path.relative(root, target));
  }
  if (!resolved.components) throw new Error("components.json must define aliases.components.");
  resolved.ui ||= path.join(resolved.components, "ui");
  return resolved;
}
