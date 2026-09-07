import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs/promises";
import os from "node:os";
import path from "node:path";
import { buildRegistry } from "../scripts/build-registry.mjs";
import { validateRegistry } from "../scripts/validate-registry.mjs";
import { sourceDependencies } from "../scripts/registry-utils.mjs";

async function fixture(t) {
  const outputDir = await fs.mkdtemp(path.join(os.tmpdir(), "convertfast-registry-test-"));
  t.after(() => fs.rm(outputDir, { recursive: true, force: true }));
  await buildRegistry({ outputDir });
  return outputDir;
}

async function editJson(outputDir, filename, mutate) {
  const file = path.join(outputDir, filename);
  const payload = JSON.parse(await fs.readFile(file, "utf8"));
  mutate(payload);
  await fs.writeFile(file, JSON.stringify(payload));
}

test("all 14 blocks are installable payloads, with assets inlined", async (t) => {
  const outputDir = await fixture(t);
  assert.equal((await validateRegistry({ outputDir })).count, 14);
  const hero = JSON.parse(await fs.readFile(path.join(outputDir, "hero-section.json"), "utf8"));
  assert.equal(hero.files[0].type, "registry:component");
  assert.match(hero.files[0].content, /export const HeroSection/);
  const asset = hero.files.find((file) => file.type === "registry:file");
  assert.equal(asset.target, "public/_convertfast/gradient-bg-0.svg");
  assert.match(asset.content, /<svg/);
  const editorial = JSON.parse(await fs.readFile(path.join(outputDir, "hero-section-editorial.json"), "utf8"));
  assert.equal(editorial.files[0].path, "components/hero-section-editorial.tsx");
});

test("validation rejects the previous path-only installation payload", async (t) => {
  const outputDir = await fixture(t);
  await editJson(outputDir, "hero-section.json", (item) => delete item.files[0].content);
  await assert.rejects(validateRegistry({ outputDir }), /Missing inline file content/);
});

test("validation rejects missing dependencies and incorrect asset targets", async (t) => {
  const outputDir = await fixture(t);
  await editJson(outputDir, "hero-section.json", (item) => { item.registryDependencies = []; });
  await assert.rejects(validateRegistry({ outputDir }), /payload does not match source/);
  await buildRegistry({ outputDir });
  await editJson(outputDir, "hero-section.json", (item) => { item.files[1].target = "../outside.svg"; });
  await assert.rejects(validateRegistry({ outputDir }), /Invalid asset target/);
});

test("validation detects stale generated source and index entries", async (t) => {
  const outputDir = await fixture(t);
  await fs.writeFile(path.join(outputDir, "components/hero-section.tsx"), "stale");
  await assert.rejects(validateRegistry({ outputDir }), /Generated source is stale/);
  await buildRegistry({ outputDir });
  await editJson(outputDir, "registry.json", (registry) => registry.items.pop());
  await assert.rejects(validateRegistry({ outputDir }), /exactly the manifest items/);
});

test("rebuild removes retired items so they cannot enter the npm package", async (t) => {
  const outputDir = await fixture(t);
  await fs.writeFile(path.join(outputDir, "retired.json"), "{}");
  await assert.rejects(validateRegistry({ outputDir }), /Unexpected or missing/);
  await buildRegistry({ outputDir });
  await assert.rejects(fs.access(path.join(outputDir, "retired.json")), { code: "ENOENT" });
  await validateRegistry({ outputDir });
});

test("imports determine dependencies, excluding comments and framework imports", () => {
  assert.deepEqual(sourceDependencies(`
// import { Unknown } from "@/components/not-shipped";
import type { FC } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
} from "@/components/ui/card";
import { Icon } from "lucide-react";
import { Arrow } from "@radix-ui/react-icons";
import { cn } from "@/lib/utils";
`), { registryDependencies: ["button", "card"], dependencies: ["@radix-ui/react-icons", "lucide-react"] });
  assert.throws(() => sourceDependencies('import { Missing } from "./missing";'), /Unbundled local import/);
});
