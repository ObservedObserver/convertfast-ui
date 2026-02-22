import fs from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const registryRoot = path.resolve(__dirname, "..");
const outputDir = path.join(registryRoot, "generated");
const registryPath = path.join(outputDir, "registry.json");

function assert(condition, message) {
  if (!condition) {
    throw new Error(message);
  }
}

async function readJson(filePath) {
  return JSON.parse(await fs.readFile(filePath, "utf-8"));
}

function ensureNoInlineFileContent(item, filePath) {
  if (!Array.isArray(item.files)) {
    return;
  }

  for (const file of item.files) {
    assert(!("content" in file), `Inline file content is not allowed in '${filePath}'.`);
  }
}

async function validate() {
  const registry = await readJson(registryPath);
  assert(Array.isArray(registry.items), "registry.json must contain an items array.");

  const seenNames = new Set();

  for (const item of registry.items) {
    assert(typeof item.name === "string" && item.name.length > 0, "Each registry item must include a name.");
    assert(!seenNames.has(item.name), `Duplicate item name in registry.json: '${item.name}'.`);
    seenNames.add(item.name);

    assert(Array.isArray(item.files) && item.files.length > 0, `Item '${item.name}' must have files.`);
    ensureNoInlineFileContent(item, "registry.json");

    const itemJsonPath = path.join(outputDir, `${item.name}.json`);
    const itemJson = await readJson(itemJsonPath);

    assert(itemJson.name === item.name, `Item payload mismatch for '${item.name}'.`);
    assert(itemJson.type === "registry:block", `Item '${item.name}' must have type 'registry:block'.`);
    ensureNoInlineFileContent(itemJson, `${item.name}.json`);

    for (const file of itemJson.files || []) {
      assert(typeof file.path === "string" && file.path.length > 0, `Invalid file.path in '${item.name}.json'.`);
      const sourceFilePath = path.join(outputDir, file.path);
      await fs.access(sourceFilePath);
    }
  }

  console.log(`Validated ${registry.items.length} registry items.`);
}

validate().catch((error) => {
  console.error(error);
  process.exit(1);
});
