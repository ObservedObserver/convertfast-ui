import path from "path";
import fs from "fs/promises";

async function pathExists(p: string): Promise<boolean> {
  try {
    await fs.access(p);
    return true;
  } catch {
    return false;
  }
}

export async function resolveRouterPath(): Promise<{
  rootDir: string;
  routerType: 'app' | 'pages';
  pageFileName: 'page.tsx' | 'index.tsx';
}> {
  const __dirname = process.cwd();
  let srcDir = "./";
  let config;

  try {
    // Read and parse tsconfig.json
    const configPath = path.resolve(__dirname, "tsconfig.json");
    const tsConfigContent = await fs.readFile(configPath, 'utf-8');
    const tsConfig = JSON.parse(tsConfigContent);

    // Check for src directory in paths
    const paths = tsConfig.compilerOptions?.paths;
    if (paths) {
      for (let [_, ps] of Object.entries<string[]>(paths)) {
        if (ps.some(p => p.startsWith('./src/'))) {
          srcDir = "./src";
          break;
        }
      }
    }

    // Read and parse landing-pages.json
    const landingPagesPath = path.resolve(__dirname, "landing-pages.json");
    const landingPagesContent = await fs.readFile(landingPagesPath, 'utf-8');
    config = JSON.parse(landingPagesContent);

  } catch (error) {
    console.error("Error reading configuration files:", error);
    throw error;
  }

  // Resolve the router path
  const routerType = config?.nextjs?.router as 'app' | 'pages' | undefined;

  if (!routerType) {
    throw new Error("Next.js router configuration not found in landing-pages.json");
  }

  const candidateDirs = [
    path.resolve(__dirname, routerType),
    path.resolve(__dirname, 'src', routerType),
    path.resolve(__dirname, srcDir, routerType)
  ];

  let routerRootDir: string | undefined;

  for (const candidate of candidateDirs) {
    if (await pathExists(candidate)) {
      routerRootDir = candidate;
      break;
    }
  }

  if (!routerRootDir) {
    throw new Error(`Unable to locate Next.js ${routerType} directory. Checked: ${candidateDirs.join(', ')}`);
  }

  const pageFileName = routerType === 'app' ? 'page.tsx' : 'index.tsx';

  return {
    rootDir: routerRootDir,
    routerType,
    pageFileName
  };
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