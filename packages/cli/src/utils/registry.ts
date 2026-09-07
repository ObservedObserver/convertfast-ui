import path from "node:path";
import fs from "node:fs/promises";
import os from "node:os";
import { fileURLToPath } from "node:url";
import { DEFAULT_TEMPLATE_NAME, TEMPLATE_NAMES } from "./template-options.ts";
import { DEFAULT_SEGMENTS } from "./segments.ts";
import { pathExists, readJson, safeProjectPath, resolveAliasesPath } from "./get-config.ts";
import { runShadcnAdd } from "./install-deps.ts";

export const REGISTRY_MODES = ["auto", "only", "off"] as const;
export type RegistryMode = (typeof REGISTRY_MODES)[number];
type InstallRegistryBlockOptions = { blockName: string; templateName: string; namespace?: string; mode: RegistryMode; force?: boolean; verbose?: boolean; cwd?: string };

export function resolveRegistryMode(mode: string): RegistryMode {
  if (!REGISTRY_MODES.includes(mode as RegistryMode)) throw new Error(`Invalid registry mode '${mode}'. Use auto, only, or off.`);
  return mode as RegistryMode;
}

export function resolveRegistryItemName(blockName: string, templateName: string): string {
  if (!DEFAULT_SEGMENTS.some(segment => segment.file === blockName)) throw new Error(`Unknown block '${blockName}'. Available: ${DEFAULT_SEGMENTS.map(segment => segment.file).join(", ")}.`);
  if (!TEMPLATE_NAMES.includes(templateName as (typeof TEMPLATE_NAMES)[number])) throw new Error(`Invalid template '${templateName}'. Available: ${TEMPLATE_NAMES.join(", ")}.`);
  return templateName === DEFAULT_TEMPLATE_NAME ? blockName : `${blockName}-${templateName}`;
}

export async function installConvertfastRegistryBlock(options: InstallRegistryBlockOptions): Promise<{ ok: boolean; target: string; error?: Error }> {
  if (options.mode === "off") return { ok: false, target: "" };
  const itemName = resolveRegistryItemName(options.blockName, options.templateName);
  if (options.namespace && !/^@[a-zA-Z0-9_-]+$/.test(options.namespace)) throw new Error("Registry namespace must have the form @name.");
  const target = options.namespace ? `${options.namespace}/${itemName}` : path.resolve(path.dirname(fileURLToPath(import.meta.url)), "../registry", `${itemName}.json`);
  let temporaryDirectory: string | undefined;
  try {
    const aliases = await resolveAliasesPath();
    let bundledItem: any;
    let expectedFile: string | undefined;
    if (!options.namespace) {
      if (!await pathExists(target)) throw new Error(`Bundled registry item missing: ${target}. Reinstall convertfast-ui.`);
      const item = await readJson(target);
      const files = [];
      for (const file of item.files || []) {
        const destination = file.target ? path.resolve(process.cwd(), file.target) : path.join(aliases.components, path.basename(file.path));
        await safeProjectPath(process.cwd(), path.relative(process.cwd(), destination));
        // shadcn can ask about conflicts even with --yes. Fail explicitly instead.
        const exists = await pathExists(destination);
        if (file.type === "registry:component") expectedFile = destination;
        if (exists && !options.force && file.type !== "registry:file") throw new Error(`Block file already exists: ${destination}. Use --force to overwrite it.`);
        // --force replaces blocks; public assets can contain user customizations.
        if (!exists || file.type !== "registry:file") files.push(file);
      }
      const registryDependencies = [];
      for (const dependency of item.registryDependencies || []) {
        // Preserve shared UI components even when the block is forcibly replaced.
        const installed = /^[a-z0-9-]+$/.test(dependency) && (
          await pathExists(path.join(aliases.ui, `${dependency}.tsx`)) ||
          await pathExists(path.join(aliases.ui, `${dependency}.jsx`))
        );
        if (!installed) registryDependencies.push(dependency);
      }
      bundledItem = { ...item, files, registryDependencies };
    }
    let installTarget = target;
    if (bundledItem) {
      temporaryDirectory = await fs.mkdtemp(path.join(os.tmpdir(), "convertfast-registry-"));
      installTarget = path.join(temporaryDirectory, `${itemName}.json`);
      await fs.writeFile(installTarget, JSON.stringify(bundledItem));
    }
    await runShadcnAdd([installTarget], options.force, options.cwd);
    if (expectedFile && !await pathExists(expectedFile)) throw new Error(`shadcn did not create ${expectedFile}.`);
    return { ok: true, target };
  } catch (error) {
    const normalized = error instanceof Error ? error : new Error(String(error));
    if (options.mode === "only") throw new Error(`Failed to install ${itemName}: ${normalized.message}`);
    return { ok: false, target, error: normalized };
  } finally {
    if (temporaryDirectory) await fs.rm(temporaryDirectory, { recursive: true, force: true });
  }
}
