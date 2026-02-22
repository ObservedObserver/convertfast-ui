import { Command } from "commander";
import fs from "fs/promises";
import path from "path";
import { fileURLToPath } from 'url';
import { resolveRouterPath } from '../utils/get-config.ts';
import { DEFAULT_SEGMENTS } from "../utils/segments.ts";
import { getTemplatePageCode } from "../utils/templates.ts";
import { installSegmentDeps } from "../utils/install-deps.ts";
import { DEFAULT_TEMPLATE_NAME, TEMPLATE_NAMES, resolveTemplateConfig } from "../utils/template-options.ts";
import { RegistryMode, installConvertfastRegistryBlock, resolveRegistryMode } from "../utils/registry.ts";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const PROJECT_ROOT = path.resolve(__dirname, '..');

type PageCommandOptions = {
  template: string;
  registry: string;
  namespace: string;
};

type RegistryInstallState = {
  enabled: boolean;
};

async function installDepsWithRegistryFallback(params: {
  segmentName: string;
  segmentFilePath: string;
  templateName: string;
  registryMode: RegistryMode;
  namespace: string;
  registryState?: RegistryInstallState;
}) {
  const { segmentName, segmentFilePath, templateName, registryMode, namespace, registryState } = params;
  const canUseRegistry = registryMode !== "off" && (registryState ? registryState.enabled : true);

  if (canUseRegistry) {
    const registryResult = await installConvertfastRegistryBlock({
      blockName: segmentName,
      templateName,
      namespace,
      mode: registryMode
    });

    if (registryResult.ok) {
      console.log(`Installed section '${segmentName}' from registry '${registryResult.target}'.`);
      return;
    }

    if (registryMode === "auto") {
      const reason = registryResult.error ? registryResult.error.message : "unknown error";
      console.warn(`Registry install skipped for '${segmentName}' (${reason}). Falling back to local dependency install.`);
      if (registryState) {
        registryState.enabled = false;
      }
    }
  }

  await installSegmentDeps(segmentFilePath);
}

export const page = new Command();

page
  .name("page")
  .description("CLI to manage landing pages and segments");

page.command("create")
  .description("Create a new landing page")
  .argument("<page>", "the page name to create (can be a relative path)")
  .option(
    "-t, --template <template>",
    `template style (${TEMPLATE_NAMES.join(", ")})`,
    DEFAULT_TEMPLATE_NAME,
  )
  .option("--registry <mode>", "registry mode (auto, only, off)", "auto")
  .option("-n, --namespace <namespace>", "registry namespace", "@convertfast")
  .action(async (pagePath: string, options: PageCommandOptions) => {
    try {
      console.log(`Creating new landing page: ${pagePath}`);
      const selectedTemplate = options.template || DEFAULT_TEMPLATE_NAME;
      const registryMode = resolveRegistryMode(options.registry || "auto");
      const { segmentsDir } = resolveTemplateConfig(PROJECT_ROOT, selectedTemplate);
      console.log(`Using template: ${selectedTemplate}`);
      console.log(`Registry mode: ${registryMode}`);

      const registryState: RegistryInstallState = { enabled: true };

      const { rootDir: pagesRootDir, pageFileName } = await resolveRouterPath();
      const fullPagePath = path.join(pagesRootDir, pagePath);

      console.log(`Creating directory: ${fullPagePath}`);
      await fs.mkdir(fullPagePath, { recursive: true });

      const code = getTemplatePageCode(DEFAULT_SEGMENTS);
      const pageFilePath = path.join(fullPagePath, pageFileName);
      console.log(`Writing page file: ${pageFilePath}`);
      await fs.writeFile(pageFilePath, code);

      for (let seg of DEFAULT_SEGMENTS) {
        const sourceFile = path.join(segmentsDir, `${seg.file}.tsx`);
        const destFile = path.join(fullPagePath, `${seg.file}.tsx`);
        console.log(`Copying segment file: ${destFile}`);
        await fs.copyFile(sourceFile, destFile);

        await installDepsWithRegistryFallback({
          segmentName: seg.file,
          segmentFilePath: destFile,
          templateName: selectedTemplate,
          registryMode,
          namespace: options.namespace,
          registryState
        });
      }

      console.log(`Landing page '${pagePath}' has been successfully created.`);
    } catch (error) {
      if (error instanceof Error) {
        console.error(`Error creating landing page: ${error.message}`);
      } else {
        console.error(`An unknown error occurred while creating the landing page.`);
      }
      process.exit(1);
    }
  });

page.command("add")
  .description("Add a segment to an existing landing page")
  .argument("<page>", "the page name to add the segment to (can be a relative path)")
  .argument("<segment>", "the segment to add (e.g., cta, hero-section)")
  .option(
    "-t, --template <template>",
    `template style (${TEMPLATE_NAMES.join(", ")})`,
    DEFAULT_TEMPLATE_NAME,
  )
  .option("--registry <mode>", "registry mode (auto, only, off)", "auto")
  .option("-n, --namespace <namespace>", "registry namespace", "@convertfast")
  .action(async (pagePath: string, segmentFile: string, options: PageCommandOptions) => {
    try {
      console.log(`Adding segment '${segmentFile}' to page '${pagePath}'`);
      const selectedTemplate = options.template || DEFAULT_TEMPLATE_NAME;
      const registryMode = resolveRegistryMode(options.registry || "auto");
      const { segmentsDir } = resolveTemplateConfig(PROJECT_ROOT, selectedTemplate);
      console.log(`Using template: ${selectedTemplate}`);
      console.log(`Registry mode: ${registryMode}`);

      const { rootDir: pagesRootDir, pageFileName } = await resolveRouterPath();
      const fullPagePath = path.join(pagesRootDir, pagePath);

      // Check if the page exists
      if (!await fs.stat(fullPagePath).catch(() => false)) {
        throw new Error(`Page '${pagePath}' does not exist.`);
      }

      // Find the segment in DEFAULT_SEGMENTS
      const segment = DEFAULT_SEGMENTS.find(seg => seg.file === segmentFile);
      if (!segment) {
        throw new Error(`Segment '${segmentFile}' is not a valid segment.`);
      }

      // Copy segment file
      const sourceFile = path.join(segmentsDir, `${segment.file}.tsx`);
      const destFile = path.join(fullPagePath, `${segment.file}.tsx`);
      console.log(`Copying segment file: ${destFile}`);
      await fs.copyFile(sourceFile, destFile);

      // Update page.tsx to include the new segment
      const pageFilePath = path.join(fullPagePath, pageFileName);
      let pageContent = await fs.readFile(pageFilePath, 'utf-8');
      
      // Add import statement if not already present
      const importStatement = `import { ${segment.name} } from './${segment.file}'`;
      if (!pageContent.includes(importStatement)) {
        pageContent = importStatement + '\n' + pageContent;
      }

      // Add component to JSX if not already present
      const componentString = `<${segment.name} />`;
      if (!pageContent.includes(componentString)) {
        const componentInsertionPoint = pageContent.lastIndexOf('</');
        pageContent = pageContent.slice(0, componentInsertionPoint) + 
                      `  ${componentString}\n` + 
                      pageContent.slice(componentInsertionPoint);
      }

      await fs.writeFile(pageFilePath, pageContent);

      await installDepsWithRegistryFallback({
        segmentName: segment.file,
        segmentFilePath: destFile,
        templateName: selectedTemplate,
        registryMode,
        namespace: options.namespace
      });

      console.log(`Segment '${segment.name}' has been successfully added to page '${pagePath}'.`);
    } catch (error) {
      if (error instanceof Error) {
        console.error(`Error adding segment: ${error.message}`);
      } else {
        console.error(`An unknown error occurred while adding the segment.`);
      }
      process.exit(1);
    }
  });
