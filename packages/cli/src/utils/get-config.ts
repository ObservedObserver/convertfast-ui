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

interface TsConfig {
  compilerOptions?: {
    paths?: Record<string, string[]>;
  };
}

interface ComponentConfig {
  aliases?: Record<string, string>;
}

export async function resolveAliasesPath(): Promise<Record<string, string>> {
  const __dirname = process.cwd();
  const configPath = path.resolve(__dirname, "tsconfig.json");
  const componentConfigPath = path.resolve(__dirname, "components.json");

  // 1. Get definition of @ in compilerOptions.paths
  let tsConfig: TsConfig;
  try {
    const tsConfigContent = await fs.readFile(configPath, 'utf-8');
    tsConfig = JSON.parse(tsConfigContent);
  } catch (error) {
    console.error("Error reading tsconfig.json:", error);
    return {};
  }

  const atAlias = tsConfig.compilerOptions?.paths?.["@/*"]?.[0] || "./";
  const basePath = path.resolve(__dirname, atAlias.replace("*", ""));

  // 2. Get aliases path from shadcn config
  let componentConfig: ComponentConfig;
  try {
    const componentConfigContent = await fs.readFile(componentConfigPath, 'utf-8');
    componentConfig = JSON.parse(componentConfigContent);
  } catch (error) {
    console.error("Error reading components.json:", error);
    return {};
  }

  const aliases = componentConfig.aliases || {};

  // Resolve full paths
  const resolvedAliases: Record<string, string> = {};
  for (const [alias, relativePath] of Object.entries(aliases)) {
    resolvedAliases[alias] = path.resolve(basePath, relativePath.replace('@/', ''));
  }

  return resolvedAliases;
}