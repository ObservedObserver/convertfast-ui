import fs from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { assert, loadRegistryItems, registryRoot } from "./registry-utils.mjs";

export async function buildRegistry(options = {}) {
  const outputDir = options.outputDir || path.join(registryRoot, "generated");
  const items = await loadRegistryItems(options);
  const homepage = options.homepage || process.env.CONVERTFAST_REGISTRY_HOMEPAGE || "https://ui.convertfa.st";
  assert(["http:", "https:"].includes(new URL(homepage).protocol), "Registry homepage must be an HTTP(S) URL.");

  // Read and validate all inputs before replacing the previous generated files.
  await fs.rm(outputDir, { recursive: true, force: true });
  await fs.mkdir(outputDir, { recursive: true });
  for (const item of items) {
    for (const file of item.files) {
      const sourcePath = path.join(outputDir, file.path);
      await fs.mkdir(path.dirname(sourcePath), { recursive: true });
      await fs.writeFile(sourcePath, file.content);
    }
    await fs.writeFile(path.join(outputDir, `${item.name}.json`), `${JSON.stringify({
      $schema: "https://ui.shadcn.com/schema/registry-item.json",
      ...item,
    }, null, 2)}\n`);
  }
  const registry = {
    $schema: "https://ui.shadcn.com/schema/registry.json",
    name: options.name || process.env.CONVERTFAST_REGISTRY_NAME || "convertfast",
    homepage,
    items: items.map((item) => ({
      ...item,
      // The index is a shadcn build input. Installable item JSONs contain
      // their file contents and need no separate source-file fetch.
      files: item.files.map(({ content, ...file }) => file),
    })),
  };
  await fs.writeFile(path.join(outputDir, "registry.json"), `${JSON.stringify(registry, null, 2)}\n`);
  return { count: items.length, outputDir };
}

if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  buildRegistry().then(({ count, outputDir }) => {
    console.log(`Generated ${count} installable registry items in '${outputDir}'.`);
  }).catch((error) => {
    console.error(error.message);
    process.exitCode = 1;
  });
}
