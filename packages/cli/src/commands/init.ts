import { Command } from "commander";
import fs from "fs/promises";
import path from "path";
import { fileURLToPath } from 'url';
import prompts from 'prompts';
import { execa } from "execa";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const PROJECT_ROOT = path.resolve(__dirname, '..');

const SEGMENT_ASSETS_DIR = path.join(PROJECT_ROOT, "./assets/_convertfast");

async function fileExists(filePath: string): Promise<boolean> {
  try {
    await fs.access(filePath);
    return true;
  } catch {
    return false;
  }
}

async function detectNextJsConfig(rootDir: string): Promise<{ router: 'app' | 'pages' } | null> {
  const appRouterPath = path.join(rootDir, 'app');
  const pagesRouterPath = path.join(rootDir, 'pages');

  if (await fileExists(appRouterPath)) {
    return { router: 'app' };
  } else if (await fileExists(pagesRouterPath)) {
    return { router: 'pages' };
  }

  return null;
}

async function findComponentsJsonPath(rootDir: string): Promise<string | null> {
  const commonPaths = [
    'components.json',
    'src/components.json',
    'lib/components.json',
  ];

  for (const relativePath of commonPaths) {
    const fullPath = path.join(rootDir, relativePath);
    if (await fileExists(fullPath)) {
      return relativePath;
    }
  }

  return null;
}

export const init = new Command();

init
  .name("init")
  .description("Initialize landing-pages.json configuration file")
  .action(async () => {
    console.log("Initializing landing-pages.json configuration...");

    const config: any = {};
    const __dirname = process.cwd();

    // Detect NextJS configuration
    const nextJsConfig = await detectNextJsConfig(__dirname);
    if (nextJsConfig) {
      config.nextjs = nextJsConfig;
    } else {
      const { useNextJs } = await prompts({
        type: 'confirm',
        name: 'useNextJs',
        message: 'Are you using Next.js?',
        initial: false
      });

      if (useNextJs) {
        const { routerType } = await prompts({
          type: 'select',
          name: 'routerType',
          message: 'Which Next.js router are you using?',
          choices: [
            { title: 'App Router', value: 'app' },
            { title: 'Pages Router', value: 'pages' }
          ],
          initial: 0
        });
        config.nextjs = { router: routerType };
      }
    }

    // Find components.json
    const componentsJsonPath = await findComponentsJsonPath(__dirname);
    if (componentsJsonPath) {
      config.components = { path: componentsJsonPath };
    } else {
      const { componentsPath } = await prompts({
        type: 'text',
        name: 'componentsPath',
        message: 'Enter the path to your components.json file:',
        initial: 'components.json'
      });
      config.components = { path: componentsPath };
    }

    // Write the configuration to landing-pages.json
    let configPath = path.join(__dirname, 'landing-pages.json');
    const tsConfigPath = path.resolve(__dirname, 'tsconfig.json');
    const res = await fs.readFile(tsConfigPath);
    const tsConfig = JSON.parse(res.toString());
    console.log(tsConfig.compilerOptions.paths);
    for (let [_, ps] of Object.entries<string[]>(tsConfig.compilerOptions.paths)) {
      if (ps.includes('./src/*')) {
        configPath = path.resolve(__dirname, './src/', 'landing-pages.json');
      }
    }
    await fs.writeFile(configPath, JSON.stringify(config, null, 2));

    // copy static assets
    await execa('cp', ['-r', SEGMENT_ASSETS_DIR, path.join(__dirname, 'public')]);

    console.log("landing-pages.json has been created successfully!");
  });
