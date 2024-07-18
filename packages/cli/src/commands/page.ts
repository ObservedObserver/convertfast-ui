import { Command } from "commander";
import fs from "fs/promises";
import path from "path";
import { fileURLToPath } from 'url';
import { resolveRouterPath } from '../utils/get-config.ts';
import { DEFAULT_SEGMENTS } from "../utils/segments.ts";
import { getTemplatePageCode } from "../utils/templates.ts";
import { installSegmentDeps } from "../utils/install-deps.ts";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const PROJECT_ROOT = path.resolve(__dirname, '..');

const SEGMENT_SOURCE_DIR = path.join(PROJECT_ROOT, "./templates/src");

export const page = new Command();

page
  .name("page")
  .description("CLI to manage landing pages and segments");

page.command("create")
  .description("Create a new landing page")
  .argument("<page>", "the page name to create (can be a relative path)")
  .action(async (pagePath: string) => {
    try {
      console.log(`Creating new landing page: ${pagePath}`);

      const pagesRootDir = await resolveRouterPath();
      const fullPagePath = path.join(pagesRootDir, pagePath);

      console.log(`Creating directory: ${fullPagePath}`);
      await fs.mkdir(fullPagePath, { recursive: true });

      const code = getTemplatePageCode(DEFAULT_SEGMENTS);
      const pageFilePath = path.join(fullPagePath, 'page.tsx');
      console.log(`Writing page file: ${pageFilePath}`);
      await fs.writeFile(pageFilePath, code);

      for (let seg of DEFAULT_SEGMENTS) {
        const sourceFile = path.join(SEGMENT_SOURCE_DIR, "segments", `${seg.file}.tsx`);
        const destFile = path.join(fullPagePath, `${seg.file}.tsx`);
        console.log(`Copying segment file: ${destFile}`);
        await fs.copyFile(sourceFile, destFile);

        // Install dependencies for each segment
        await installSegmentDeps(seg.file);
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
  .action(async (pagePath: string, segmentFile: string) => {
    try {
      console.log(`Adding segment '${segmentFile}' to page '${pagePath}'`);

      const pagesRootDir = await resolveRouterPath();
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
      const sourceFile = path.join(SEGMENT_SOURCE_DIR, "segments", `${segment.file}.tsx`);
      const destFile = path.join(fullPagePath, `${segment.file}.tsx`);
      console.log(`Copying segment file: ${destFile}`);
      await fs.copyFile(sourceFile, destFile);

      // Update page.tsx to include the new segment
      const pageFilePath = path.join(fullPagePath, 'page.tsx');
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

      // Install dependencies for the added segment
      await installSegmentDeps(segment.file);

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