import { Command } from "commander";
import { DEFAULT_TEMPLATE_NAME, TEMPLATE_NAMES } from "../utils/template-options.ts";
import { installConvertfastRegistryBlock } from "../utils/registry.ts";

type BlockAddOptions = {
  template: string;
  namespace: string;
};

export const block = new Command();

block.name("block").description("Manage ConvertFast blocks through shadcn registry");

block
  .command("add")
  .description("Install a ConvertFast block into the current project using shadcn")
  .argument("<block>", "the block name, e.g. hero-section")
  .option(
    "-t, --template <template>",
    `template style (${TEMPLATE_NAMES.join(", ")})`,
    DEFAULT_TEMPLATE_NAME
  )
  .option("-n, --namespace <namespace>", "registry namespace", "@convertfast")
  .action(async (blockName: string, options: BlockAddOptions) => {
    try {
      const selectedTemplate = options.template || DEFAULT_TEMPLATE_NAME;
      if (!TEMPLATE_NAMES.includes(selectedTemplate as (typeof TEMPLATE_NAMES)[number])) {
        const available = TEMPLATE_NAMES.join(", ");
        throw new Error(`Template '${selectedTemplate}' is not valid. Available templates: ${available}.`);
      }

      const result = await installConvertfastRegistryBlock({
        blockName,
        templateName: selectedTemplate,
        namespace: options.namespace,
        mode: "only",
        verbose: true
      });
      console.log(`Block '${blockName}' has been installed successfully from '${result.target}'.`);
    } catch (error) {
      if (error instanceof Error) {
        console.error(`Error installing block: ${error.message}`);
      } else {
        console.error("An unknown error occurred while installing the block.");
      }
      process.exit(1);
    }
  });
