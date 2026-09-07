import fs from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { isDeepStrictEqual } from "node:util";
import { assert, loadRegistryItems, registryRoot } from "./registry-utils.mjs";

export async function validateRegistry(options = {}) {
  const outputDir = options.outputDir || path.join(registryRoot, "generated");
  const expectedItems = await loadRegistryItems(options);
  const registry = JSON.parse(await fs.readFile(path.join(outputDir, "registry.json"), "utf8"));
  assert(registry.$schema === "https://ui.shadcn.com/schema/registry.json", "Invalid registry index schema URL.");
  assert(typeof registry.name === "string" && registry.name.length > 0, "Registry name is required.");
  assert(["http:", "https:"].includes(new URL(registry.homepage).protocol), "Invalid registry homepage URL.");
  assert(Array.isArray(registry.items) && registry.items.length === expectedItems.length, "Registry index must contain exactly the manifest items.");

  for (const [index, expected] of expectedItems.entries()) {
    const expectedIndex = { ...expected, files: expected.files.map(({ content, ...file }) => file) };
    assert(isDeepStrictEqual(registry.items[index], expectedIndex), `Registry index does not match source for '${expected.name}'.`);
    const payload = JSON.parse(await fs.readFile(path.join(outputDir, `${expected.name}.json`), "utf8"));
    assert(payload.$schema === "https://ui.shadcn.com/schema/registry-item.json", `Invalid item schema URL for '${expected.name}'.`);
    for (const file of payload.files || []) {
      assert(typeof file.content === "string" && file.content.length > 0, `Missing inline file content in '${expected.name}'.`);
      if (file.type === "registry:file") assert(file.target?.startsWith("public/_convertfast/"), `Invalid asset target in '${expected.name}'.`);
    }
    const { $schema, ...item } = payload;
    assert(isDeepStrictEqual(item, expected), `Installable payload does not match source for '${expected.name}'.`);
    for (const file of expected.files) {
      const generatedContent = await fs.readFile(path.join(outputDir, file.path), "utf8");
      assert(generatedContent === file.content, `Generated source is stale: '${file.path}'.`);
    }
  }
  const jsonFiles = (await fs.readdir(outputDir)).filter((file) => file.endsWith(".json")).sort();
  const expectedFiles = ["registry.json", ...expectedItems.map((item) => `${item.name}.json`)].sort();
  assert(isDeepStrictEqual(jsonFiles, expectedFiles), "Unexpected or missing registry item JSON files.");
  return { count: expectedItems.length };
}

if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  validateRegistry().then(({ count }) => console.log(`Validated ${count} installable registry items against their source.`)).catch((error) => {
    console.error(error.message);
    process.exitCode = 1;
  });
}
