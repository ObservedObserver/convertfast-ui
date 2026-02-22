import { execa } from "execa";
import { DEFAULT_TEMPLATE_NAME, TEMPLATE_NAMES } from "./template-options.ts";

export const REGISTRY_MODES = ["auto", "only", "off"] as const;
export type RegistryMode = (typeof REGISTRY_MODES)[number];

type InstallRegistryBlockOptions = {
  blockName: string;
  templateName: string;
  namespace: string;
  mode: RegistryMode;
  verbose?: boolean;
  cwd?: string;
};

export function resolveRegistryMode(mode: string): RegistryMode {
  if (!REGISTRY_MODES.includes(mode as RegistryMode)) {
    throw new Error(`Registry mode '${mode}' is invalid. Available modes: ${REGISTRY_MODES.join(", ")}.`);
  }

  return mode as RegistryMode;
}

export function resolveRegistryItemName(blockName: string, templateName: string): string {
  if (!TEMPLATE_NAMES.includes(templateName as (typeof TEMPLATE_NAMES)[number])) {
    const available = TEMPLATE_NAMES.join(", ");
    throw new Error(`Template '${templateName}' is not valid. Available templates: ${available}.`);
  }

  if (templateName === DEFAULT_TEMPLATE_NAME) {
    return blockName;
  }

  return `${blockName}-${templateName}`;
}

export async function installConvertfastRegistryBlock(options: InstallRegistryBlockOptions): Promise<{
  ok: boolean;
  target: string;
  error?: Error;
}> {
  if (options.mode === "off") {
    return { ok: false, target: "" };
  }

  if (!options.namespace.startsWith("@")) {
    throw new Error(`Registry namespace '${options.namespace}' is invalid. Namespace must start with '@'.`);
  }

  const itemName = resolveRegistryItemName(options.blockName, options.templateName);
  const target = `${options.namespace}/${itemName}`;

  try {
    await execa("npx", ["shadcn@latest", "add", target], {
      cwd: options.cwd || process.cwd(),
      stdio: options.verbose ? "inherit" : "pipe"
    });
    return { ok: true, target };
  } catch (error) {
    const normalizedError = error instanceof Error ? error : new Error(String(error));
    if (options.mode === "only") {
      throw new Error(`Failed to install '${target}' from registry: ${normalizedError.message}`);
    }

    return { ok: false, target, error: normalizedError };
  }
}
