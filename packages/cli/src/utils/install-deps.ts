import { execa } from "execa";
import { DEFAULT_SEGMENTS } from "./segments.ts";
import path from "path";
import fs from "fs/promises";
import { IComponent } from "@/interfaces.ts";
import { resolveAliasesPath } from "./get-config.ts"
import { resolveRouterPath } from "./get-config.ts";

function resolveComponentDeps(component: string): IComponent[] | undefined {
  const segment = DEFAULT_SEGMENTS.find((seg) => seg.file === component);
  if (!segment) {
    throw new Error(`Segment '${component}' is not a valid segment.`);
  }
  return segment.components;
}

async function isShadcnComponentInstalled(component: string, uiComponentsPath: string): Promise<boolean> {
  const componentPath = path.join(uiComponentsPath, `${component}.tsx`);
  console.log(componentPath)
  try {
    await fs.access(componentPath);
    return true;
  } catch {
    return false;
  }
}

async function copyConvertUiComponent(component: string, sourcePath: string, destPath: string): Promise<void> {
  await fs.copyFile(
    path.join(sourcePath, `${component}.tsx`),
    path.join(destPath, `${component}.tsx`)
  );
}

export async function installSegmentDeps(segment: string) {
  const components = resolveComponentDeps(segment);

  if (!components) {
    throw new Error(`Segment '${segment}' does not exist.`);
  }

  const shadcnComponentsToInstall: string[] = [];
  const npmPackagesToInstall: string[] = [];

  // Resolve aliases and paths
  const aliases = await resolveAliasesPath();
  const routerPath = await resolveRouterPath();

  // Assuming 'components' is a key in the aliases object
  const componentsPath = aliases['components'] || path.join(process.cwd(), 'components');
  const uiComponentsPath = path.join(componentsPath, 'ui');

  for (const component of components) {
    if (component.source === "shadcn") {
      if (!(await isShadcnComponentInstalled(component.file, uiComponentsPath))) {
        shadcnComponentsToInstall.push(component.file);
      }
    } else if (component.source === "convertfast") {
      await copyConvertUiComponent(
        component.file,
        path.join(routerPath, '..', 'components'),
        componentsPath
      );
    } else {
      npmPackagesToInstall.push(component.name);
    }
  }

  // Install shadcn components
  for (const component of shadcnComponentsToInstall) {
    console.log(`Installing shadcn component: ${component}`);
    await execa("npx", ["shadcn-ui@latest", "add", component], { cwd: process.cwd() });
  }

  // Install npm packages
  if (npmPackagesToInstall.length > 0) {
    console.log(`Installing npm packages: ${npmPackagesToInstall.join(", ")}`);
    await execa("npm", ["install", ...npmPackagesToInstall], { cwd: process.cwd() });
  }

  console.log(`Finished installing dependencies for segment '${segment}'`);
}