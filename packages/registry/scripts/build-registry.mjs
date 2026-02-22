import fs from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const registryRoot = path.resolve(__dirname, "..");
const repoRoot = path.resolve(registryRoot, "..", "..");
const manifestPath = path.join(registryRoot, "manifest", "blocks.json");
const outputDir = path.join(registryRoot, "generated");

const REGISTRY_NAME = process.env.CONVERTFAST_REGISTRY_NAME || "convertfast";
const REGISTRY_HOMEPAGE = process.env.CONVERTFAST_REGISTRY_HOMEPAGE || "https://ui.convertfa.st";

function assert(condition, message) {
  if (!condition) {
    throw new Error(message);
  }
}

function toRegistryIndexItem(manifestItem, generatedSourceFile) {
  const item = {
    name: manifestItem.name,
    type: "registry:block",
    title: manifestItem.title,
    description: manifestItem.description || `${manifestItem.title} block from ConvertFast.`,
    registryDependencies: manifestItem.registryDependencies,
    files: [
      {
        path: generatedSourceFile,
        type: "registry:block"
      }
    ]
  };

  if (Array.isArray(manifestItem.dependencies) && manifestItem.dependencies.length > 0) {
    item.dependencies = manifestItem.dependencies;
  }

  return item;
}

async function ensureSourceFileExists(sourceFile) {
  const fullPath = path.join(repoRoot, sourceFile);
  await fs.access(fullPath);
  return fullPath;
}

async function build() {
  const rawManifest = await fs.readFile(manifestPath, "utf-8");
  const manifest = JSON.parse(rawManifest);
  const items = manifest.items;

  assert(Array.isArray(items), "manifest.items must be an array.");

  const seenNames = new Set();
  const indexItems = [];

  await fs.mkdir(outputDir, { recursive: true });

  for (const item of items) {
    assert(typeof item.name === "string" && item.name.length > 0, "Each item must have a non-empty name.");
    assert(!seenNames.has(item.name), `Duplicate item name found: '${item.name}'.`);
    seenNames.add(item.name);

    assert(typeof item.title === "string" && item.title.length > 0, `Item '${item.name}' must have a title.`);
    assert(typeof item.sourceFile === "string" && item.sourceFile.length > 0, `Item '${item.name}' must have sourceFile.`);
    assert(
      Array.isArray(item.registryDependencies),
      `Item '${item.name}' must include registryDependencies as an array.`
    );

    const sourcePath = await ensureSourceFileExists(item.sourceFile);
    const extension = path.extname(item.sourceFile) || ".tsx";
    const generatedSourceFile = `${item.name}${extension}`;
    const generatedSourcePath = path.join(outputDir, generatedSourceFile);

    const sourceContent = await fs.readFile(sourcePath, "utf-8");
    await fs.writeFile(generatedSourcePath, sourceContent);

    const indexItem = toRegistryIndexItem(item, generatedSourceFile);
    indexItems.push(indexItem);

    const itemPayload = {
      $schema: "https://ui.shadcn.com/schema/registry-item.json",
      ...indexItem
    };

    await fs.writeFile(path.join(outputDir, `${item.name}.json`), `${JSON.stringify(itemPayload, null, 2)}\n`);
  }

  const registryPayload = {
    $schema: "https://ui.shadcn.com/schema/registry.json",
    name: REGISTRY_NAME,
    homepage: REGISTRY_HOMEPAGE,
    items: indexItems
  };

  await fs.writeFile(path.join(outputDir, "registry.json"), `${JSON.stringify(registryPayload, null, 2)}\n`);

  console.log(`Generated ${indexItems.length} registry items in '${outputDir}'.`);
}

build().catch((error) => {
  console.error(error);
  process.exit(1);
});
