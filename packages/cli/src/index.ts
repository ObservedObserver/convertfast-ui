import { Command } from "commander";
import { init } from "./commands/init.ts";
import { page } from "./commands/page.ts";

async function main() {
  const program = new Command().name("convertfast").description("add components and dependencies to your project");
  program.addCommand(init);
  program.addCommand(page);

  program.parse();
}

main();
