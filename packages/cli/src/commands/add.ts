import { Command } from "commander";
import fs from "fs/promises";
import path from "path";
import { resolveRouterPath } from '../utils/get-config'
import { ISegment } from "../interfaces";
import { DEFAULT_SEGMETS } from "../utils/segments";

function getTemplatePageCode(segments: ISegment[]) {
	return `${segments.map(seg => `import { ${seg.name} } from './${seg.file}'`).join('\n')}

function LandingPage() {

	return (
		<>
			${segments.map(seg => `<${seg.name} />`).join('\n\t\t\t')}
		</>
	)
}

export default LandingPage`
}

export const add = new Command()
  .name("add")
  .argument("[page...]", "the page name to add")
  .action(async (page, option) => {
    try {
      console.log("page name", page);
      const __dirname = process.cwd();
			console.log(__dirname)

      // const sourcePath = path.resolve(__dirname, "../segments/src/");
			const pagesRootDir = await resolveRouterPath()
      fs.mkdir(`${pagesRootDir}/${page[0]}`);
			const code = getTemplatePageCode(DEFAULT_SEGMETS)
			await fs.writeFile(`${pagesRootDir}/${page[0]}/page.tsx`, code)
			for (let seg of DEFAULT_SEGMETS) {
				fs.copyFile(path.resolve(__dirname, "../segments/src/segments", seg.file + '.tsx'), `${pagesRootDir}/${page[0]}/${seg.file}.tsx`)
			}

    } catch (error) {
			console.error(error)
		}
  });
