import { Command } from "commander";
import { DEFAULT_TEMPLATE_NAME, TEMPLATE_NAMES } from "../utils/template-options.ts";
import { installConvertfastRegistryBlock } from "../utils/registry.ts";

export const block = new Command("block").description("Install ConvertFast blocks with shadcn");
block.command("add")
  .description("Install a bundled ConvertFast block and its dependencies")
  .argument("<block>", "block name, e.g. hero-section")
  .option("-t, --template <template>", `template style (${TEMPLATE_NAMES.join(", ")})`, DEFAULT_TEMPLATE_NAME)
  .option("-n, --namespace <namespace>", "use a configured remote registry namespace")
  .option("--force", "overwrite existing block files")
  .action(async (blockName: string, options) => {
    const result = await installConvertfastRegistryBlock({ blockName, templateName: options.template, namespace: options.namespace, force: options.force, mode: "only" });
    console.log(`Installed ${blockName} from ${result.target}.`);
  });
