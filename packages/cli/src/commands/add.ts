import { Command } from "commander";
import fs from "fs/promises";
import path from "path";
import { resolveRouterPath } from "../utils/get-config.ts";
import { ISegment } from "../interfaces.ts";
import { DEFAULT_SEGMENTS } from "../utils/segments.ts";

function getTemplatePageCode(segments: ISegment[]) {
  return `${segments.map((seg) => `import { ${seg.name} } from './${seg.file}'`).join("\n")}

function LandingPage() {

	return (
		<>
			${segments.map((seg) => `<${seg.name} />`).join("\n\t\t\t")}
		</>
	)
}

export default LandingPage`;
}

export const add = new Command()
  .name("add")
  .argument("<page>", "the page name to add")
  .action(async (page: string) => {
    try {
      console.log(`Adding page: ${page}`);
      const __dirname = process.cwd();

      const pagesRootDir = await resolveRouterPath();
      const pageDir = path.join(pagesRootDir, page);

      console.log(`Creating directory: ${pageDir}`);
      await fs.mkdir(pageDir, { recursive: true });

      const code = getTemplatePageCode(DEFAULT_SEGMENTS);
      const pageFilePath = path.join(pageDir, "page.tsx");
      console.log(`Writing page file: ${pageFilePath}`);
      await fs.writeFile(pageFilePath, code);

      for (let seg of DEFAULT_SEGMENTS) {
        const sourceFile = path.join(__dirname, "../segments/src/segments", `${seg.file}.tsx`);
        const destFile = path.join(pageDir, `${seg.file}.tsx`);
        console.log(`Copying segment file: ${destFile}`);
        await fs.copyFile(sourceFile, destFile);
      }

      console.log(`Page '${page}' has been successfully added.`);
    } catch (error) {
      if (error instanceof Error) {
        console.error(`Error adding page: ${error.message}`);
      } else {
        console.error(`An unknown error occurred while adding the page.`);
      }
      process.exit(1);
    }
  });
