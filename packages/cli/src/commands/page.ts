import { Command } from "commander";
import fs from "fs/promises";
import path from "path";
import { fileURLToPath } from 'url';
import { resolveRouterPath } from '../utils/get-config.ts';
import { DEFAULT_SEGMENTS } from "../utils/segments.ts";
import { getTemplatePageCode } from "../utils/templates.ts";

// Define the path to your project root
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const PROJECT_ROOT = path.resolve(__dirname, '..');

const SEGMENT_SOURCE_DIR = path.join(PROJECT_ROOT, "../segments/src");

export const page = new Command();

page
  .name("page")
  .description("CLI to manage landing pages and segments");

page.command("create")
  .description("Create a new landing page")
  .argument("<page>", "the page name to create")
  .action(async (page: string) => {
    try {
      console.log(`Creating new landing page: ${page}`);

      const pagesRootDir = await resolveRouterPath();
      const pageDir = path.join(pagesRootDir, page);

      console.log(`Creating directory: ${pageDir}`);
      await fs.mkdir(pageDir, { recursive: true });

      const code = getTemplatePageCode(DEFAULT_SEGMENTS);
      const pageFilePath = path.join(pageDir, 'page.tsx');
      console.log(`Writing page file: ${pageFilePath}`);
      await fs.writeFile(pageFilePath, code);

      for (let seg of DEFAULT_SEGMENTS) {
        const sourceFile = path.join(SEGMENT_SOURCE_DIR, "segments", `${seg.file}.tsx`);
        const destFile = path.join(pageDir, `${seg.file}.tsx`);
        console.log(`Copying segment file: ${destFile}`);
        await fs.copyFile(sourceFile, destFile);
      }

      console.log(`Landing page '${page}' has been successfully created.`);
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
  .argument("<page>", "the page name to add the segment to")
  .argument("<segment>", "the segment to add (e.g., cta, hero-section)")
  .action(async (page: string, segmentFile: string) => {
    try {
      console.log(`Adding segment '${segmentFile}' to page '${page}'`);

      const pagesRootDir = await resolveRouterPath();
      const pageDir = path.join(pagesRootDir, page);

      // Check if the page exists
      if (!await fs.stat(pageDir).catch(() => false)) {
        throw new Error(`Page '${page}' does not exist.`);
      }

      // Find the segment in DEFAULT_SEGMENTS
      const segment = DEFAULT_SEGMENTS.find(seg => seg.file === segmentFile);
      if (!segment) {
        throw new Error(`Segment '${segmentFile}' is not a valid segment.`);
      }

      // Copy segment file
      const sourceFile = path.join(SEGMENT_SOURCE_DIR, "segments", `${segment.file}.tsx`);
      const destFile = path.join(pageDir, `${segment.file}.tsx`);
      console.log(`Copying segment file: ${destFile}`);
      await fs.copyFile(sourceFile, destFile);

      // Update page.tsx to include the new segment
      const pageFilePath = path.join(pageDir, 'page.tsx');
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

      console.log(`Segment '${segment.name}' has been successfully added to page '${page}'.`);
    } catch (error) {
      if (error instanceof Error) {
        console.error(`Error adding segment: ${error.message}`);
      } else {
        console.error(`An unknown error occurred while adding the segment.`);
      }
      process.exit(1);
    }
  });