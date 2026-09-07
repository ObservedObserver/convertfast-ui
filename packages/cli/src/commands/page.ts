import { Command } from "commander";
import fs from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { pathExists, resolveAliasesPath, resolveRouterPath, safeProjectPath } from "../utils/get-config.ts";
import { DEFAULT_SEGMENTS } from "../utils/segments.ts";
import { getTemplatePageCode, SECTION_MARKER } from "../utils/templates.ts";
import { installSegmentsDeps, rewriteSegmentImports } from "../utils/install-deps.ts";
import { DEFAULT_TEMPLATE_NAME, TEMPLATE_NAMES, resolveTemplateConfig } from "../utils/template-options.ts";
import { installConvertfastRegistryBlock, resolveRegistryMode } from "../utils/registry.ts";

const PACKAGE_ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
type Options = { template: string; registry: string; namespace?: string; force?: boolean; skipInstall?: boolean };

async function locations(pagePath: string) {
  if (pagePath !== "." && (!pagePath || pagePath.split("/").some(part => !/^[a-zA-Z0-9_()[\]@-]+$/.test(part)))) {
    throw new Error("Page must be '.' or a relative route such as marketing/pricing, with no '..', backslashes or absolute path.");
  }
  const router = await resolveRouterPath();
  const pageDir = await safeProjectPath(router.rootDir, pagePath);
  const aliases = await resolveAliasesPath();
  const componentDir = router.routerType === "app"
    ? path.join(pageDir, "_components")
    : path.join(aliases.components, "convertfast", "pages", pagePath);
  if (router.routerType === "pages" && !path.relative(router.rootDir, componentDir).startsWith("..")) {
    throw new Error("aliases.components must be outside the pages directory so sections are not registered as routes.");
  }
  await safeProjectPath(process.cwd(), path.relative(process.cwd(), componentDir));
  const pageFile = await safeProjectPath(process.cwd(), path.relative(process.cwd(), path.join(pageDir, router.pageFileName)));
  let importDir = path.relative(pageDir, componentDir).split(path.sep).join("/");
  if (!importDir.startsWith(".")) importDir = `./${importDir}`;
  return { pageDir, componentDir, pageFile, importDir, routerType: router.routerType };
}

async function prepareSegments(names: string[], options: Options) {
  const { segmentsDir } = resolveTemplateConfig(PACKAGE_ROOT, options.template);
  return Promise.all(names.map(async name => ({ name, code: await rewriteSegmentImports(await fs.readFile(path.join(segmentsDir, `${name}.tsx`), "utf8")) })));
}

async function installDependencies(segments: { name: string; code: string }[], options: Options) {
  const mode = resolveRegistryMode(options.registry);
  if (options.skipInstall) {
    if (mode !== "off") throw new Error("--skip-install requires --registry off.");
    console.log("Dependency installation skipped. Ensure the imported shadcn components are installed.");
    return;
  }
  if (mode !== "off") {
    for (const segment of segments) {
      const result = await installConvertfastRegistryBlock({ blockName: segment.name, templateName: options.template, namespace: options.namespace, mode, force: options.force });
      if (!result.ok) { console.warn("Registry installation failed. Installing local template dependencies."); break; }
    }
  }
  await installSegmentsDeps(segments.map(segment => segment.code));
}

function withOptions(command: Command) {
  return command
    .option("-t, --template <template>", `template style (${TEMPLATE_NAMES.join(", ")})`, DEFAULT_TEMPLATE_NAME)
    .option("--registry <mode>", "registry mode (auto, only, off); templates work locally by default", "off")
    .option("-n, --namespace <namespace>", "use a configured remote registry namespace instead of bundled blocks")
    .option("--skip-install", "generate files without installing dependencies")
    .option("--force", "replace existing generated files");
}

export const page = new Command("page").description("Create landing pages and add sections");

withOptions(page.command("create").description("Create a landing page").argument("<page>", "relative route, or . for the homepage"))
  .action(async (pagePath: string, options: Options) => {
    resolveRegistryMode(options.registry);
    const loc = await locations(pagePath);
    const basename = loc.routerType === "app" ? "page" : "index";
    const conflicts = ["js", "jsx", "ts", "mdx"].map(extension => path.join(loc.pageDir, `${basename}.${extension}`));
    if (loc.routerType === "pages" && pagePath !== ".") conflicts.push(...["tsx", "js", "jsx", "ts", "mdx"].map(extension => `${loc.pageDir}.${extension}`));
    for (const file of conflicts) if (await pathExists(file)) throw new Error(`This route already has a page at ${file}. Move or rename it before generating a TypeScript page.`);
    const segments = await prepareSegments(DEFAULT_SEGMENTS.map(segment => segment.file), options);
    const output = [{ file: loc.pageFile, code: getTemplatePageCode(DEFAULT_SEGMENTS, loc.importDir) }, ...segments.map(segment => ({ file: path.join(loc.componentDir, `${segment.name}.tsx`), code: segment.code }))];
    for (const { file } of output) {
      await safeProjectPath(process.cwd(), path.relative(process.cwd(), file));
      if (await pathExists(file) && !options.force) throw new Error(`File already exists: ${file}. Use --force to replace it.`);
    }
    await installDependencies(segments, options);
    // Write sections first so the route is only exposed once its imports exist.
    for (const { file, code } of [...output.slice(1), output[0]]) {
      await fs.mkdir(path.dirname(file), { recursive: true });
      await fs.writeFile(file, code, { flag: options.force ? "w" : "wx" });
    }
    console.log(`Created ${loc.pageFile} with the ${options.template} template.`);
  });

withOptions(page.command("add").description("Add a section to a ConvertFast landing page").argument("<page>", "relative route, or .").argument("<segment>", "section name, e.g. hero-section"))
  .action(async (pagePath: string, segmentName: string, options: Options) => {
    resolveRegistryMode(options.registry);
    const segment = DEFAULT_SEGMENTS.find(item => item.file === segmentName);
    if (!segment) throw new Error(`Unknown segment '${segmentName}'. Available: ${DEFAULT_SEGMENTS.map(item => item.file).join(", ")}.`);
    const loc = await locations(pagePath);
    if (!await pathExists(loc.pageFile)) throw new Error(`Page does not exist: ${loc.pageFile}`);
    const dest = await safeProjectPath(process.cwd(), path.relative(process.cwd(), path.join(loc.componentDir, `${segment.file}.tsx`)));
    if (await pathExists(dest) && !options.force) throw new Error(`Section already exists: ${dest}. Use --force to replace it.`);
    let content = await fs.readFile(loc.pageFile, "utf8");
    const component = `<${segment.name} />`;
    const importPath = `${loc.importDir}/${segment.file}`;
    const importLine = `import { ${segment.name} } from ${JSON.stringify(importPath)};`;
    if (!content.includes(component)) {
      if (content.includes(SECTION_MARKER)) content = content.replace(SECTION_MARKER, `${component}\n      ${SECTION_MARKER}`);
      else if (content.includes("</>")) {
        const position = content.lastIndexOf("</>");
        content = `${content.slice(0, position)}${component}\n${content.slice(position)}`;
      } else throw new Error("Cannot find a ConvertFast section insertion point. Add {/* convertfast:sections */} where the section should appear.");
    }
    const existingImport = new RegExp(`import\\s*\\{\\s*${segment.name}\\s*\\}\\s*from\\s*["\'][^"\']+["\'];?`);
    if (existingImport.test(content)) content = content.replace(existingImport, importLine);
    else if (!content.includes(importPath)) {
      // Keep a React client directive at the beginning of the module.
      const directive = /^(\s*["']use client["'];?\s*)/.exec(content);
      content = directive ? `${directive[0]}\n${importLine}\n${content.slice(directive[0].length)}` : `${importLine}\n${content}`;
    }
    const prepared = await prepareSegments([segment.file], options);
    await installDependencies(prepared, options);
    await fs.mkdir(loc.componentDir, { recursive: true });
    await fs.writeFile(dest, prepared[0].code, { flag: options.force ? "w" : "wx" });
    await fs.writeFile(loc.pageFile, content);
    console.log(`Added ${segment.file} to ${loc.pageFile}.`);
  });
