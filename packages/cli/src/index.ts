#!/usr/bin/env node
import { Command } from "commander";
import fs from "node:fs";
import { fileURLToPath } from "node:url";
import { init } from "./commands/init.ts";
import { page } from "./commands/page.ts";
import { block } from "./commands/block.ts";

const { version } = JSON.parse(fs.readFileSync(fileURLToPath(new URL("../package.json", import.meta.url)), "utf8"));
const program = new Command()
  .name("convertfast-ui")
  .version(version)
  .description("Generate landing pages and install ConvertFast blocks in Next.js projects")
  .addCommand(init)
  .addCommand(page)
  .addCommand(block);

program.parseAsync().catch((error: unknown) => {
  console.error(`Error: ${error instanceof Error ? error.message : String(error)}`);
  process.exitCode = 1;
});
