import { Command } from "commander";
import fs from "fs/promises";
import path from "path";

export const add = new Command()
  .name("add")
  .argument("[page...]", "the page name to add")
  .action(async (page, option) => {
    try {
      console.log("page name", page);
      const __dirname = process.cwd();
			console.log(__dirname)

      const sourcePath = path.resolve(__dirname, "../segments/src/App.tsx");
      fs.mkdir(page[0]);
      fs.copyFile(sourcePath, `${page[0]}/page.tsx`);
    } catch (error) {
			console.error(error)
		}
  });
