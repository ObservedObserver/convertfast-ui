import path from "path";
import fs from "fs/promises";

export async function resolveRouterPath() {
  const __dirname = process.cwd();
  const configPath = path.resolve(__dirname, "tsconfig.json");
  const res = await fs.readFile(configPath);
  const tsConfig = JSON.parse(res.toString());
  let rootDir = "./";
  // if (paths.includes("./*")) {
  //     rootDir = './'
  // }

  console.log(tsConfig.compilerOptions.paths);
  for (let [k, ps] of Object.entries<string[]>(tsConfig.compilerOptions.paths)) {
    if (ps.includes("./src/*")) {
      rootDir = "./src";
    }
  }
  const config = JSON.parse((await fs.readFile(path.resolve(rootDir, "landing-pages.json"))).toString());
  return path.resolve(rootDir, config.nextjs?.router);
}
