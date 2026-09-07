import fs from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

export const registryRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
export const repoRoot = path.resolve(registryRoot, "../..");

export function assert(condition, message) {
  if (!condition) throw new Error(message);
}

function safeRelativePath(value) {
  return typeof value === "string" && value.length > 0 && !path.isAbsolute(value)
    && !value.includes("\\") && !value.split("/").some((part) => part === ".." || part === "." || !part);
}

export function sourceDependencies(source) {
  const registryDependencies = new Set();
  const dependencies = new Set();
  const imports = source.matchAll(/^\s*import\s+(?:[^;]*?\s+from\s+)?["']([^"']+)["']/gm);
  for (const [, specifier] of imports) {
    if (specifier.startsWith("@/components/ui/")) {
      registryDependencies.add(specifier.slice("@/components/ui/".length));
    } else if (specifier === "@/lib/utils") {
      // utils is supplied by shadcn init and uses the configured utils alias.
    } else if (specifier.startsWith(".") || specifier.startsWith("@/")) {
      throw new Error(`Unbundled local import '${specifier}'. Add the file to the registry builder.`);
    } else {
      const packageName = specifier.startsWith("@") ? specifier.split("/").slice(0, 2).join("/") : specifier.split("/")[0];
      if (!["react", "react-dom", "next"].includes(packageName)) dependencies.add(packageName);
    }
  }
  return { registryDependencies: [...registryDependencies].sort(), dependencies: [...dependencies].sort() };
}

export async function loadRegistryItems(options = {}) {
  const root = options.repoRoot || repoRoot;
  const manifestPath = options.manifestPath || path.join(registryRoot, "manifest/blocks.json");
  const manifest = JSON.parse(await fs.readFile(manifestPath, "utf8"));
  assert(Array.isArray(manifest.items) && manifest.items.length > 0, "manifest.items must be a non-empty array.");
  const names = new Set();
  const items = [];
  for (const item of manifest.items) {
    assert(typeof item.name === "string" && /^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(item.name), "Invalid registry item name.");
    assert(!names.has(item.name), `Duplicate item name '${item.name}'.`);
    names.add(item.name);
    assert(typeof item.title === "string" && item.title.trim(), `Item '${item.name}' needs a title.`);
    assert(safeRelativePath(item.sourceFile), `Unsafe sourceFile for '${item.name}'.`);
    const content = await fs.readFile(path.join(root, item.sourceFile), "utf8");
    const { registryDependencies, dependencies } = sourceDependencies(content);
    // Optional declarations are checked rather than silently overriding imports.
    for (const [key, actual] of Object.entries({ registryDependencies, dependencies })) {
      if (item[key] !== undefined) {
        assert(Array.isArray(item[key]) && JSON.stringify([...item[key]].sort()) === JSON.stringify(actual),
          `Manifest ${key} mismatch for '${item.name}': expected ${JSON.stringify(actual)}.`);
      }
    }
    const files = [{ path: `components/${item.name}.tsx`, type: "registry:component", content }];
    const assets = [...new Set(content.match(/\/_convertfast\/[a-zA-Z0-9_./-]+/g) || [])].sort();
    for (const asset of assets) {
      assert(safeRelativePath(asset.slice(1)) && path.extname(asset) === ".svg", `Unsupported local asset '${asset}'. Only text SVG assets can be inlined.`);
      const target = `public${asset}`;
      files.push({ path: target, type: "registry:file", target,
        content: await fs.readFile(path.join(root, "packages/segments", target), "utf8") });
    }
    items.push({ name: item.name, type: "registry:block", title: item.title,
      description: item.description || `${item.title} block from ConvertFast.`,
      registryDependencies, ...(dependencies.length ? { dependencies } : {}), files });
  }
  return items;
}
