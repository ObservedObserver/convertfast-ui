import { execa } from "execa";
import path from "path";
import fs from "fs/promises";
import { resolveAliasesPath } from "./get-config.ts";

async function isShadcnComponentInstalled(component: string, uiComponentsPath: string): Promise<boolean> {
  const componentPath = path.join(uiComponentsPath, `${component}.tsx`);
  try {
    await fs.access(componentPath);
    return true;
  } catch {
    return false;
  }
}

function resolveShadcnComponentDepsFromSource(code: string): string[] {
  const pattern = /from\s+["']@\/components\/ui\/([a-z0-9-]+)["']/g;
  const deps = new Set<string>();
  let match: RegExpExecArray | null = pattern.exec(code);

  while (match) {
    deps.add(match[1]);
    match = pattern.exec(code);
  }

  return [...deps];
}

export async function installSegmentDeps(segmentFilePath: string) {
  const shadcnComponentsToInstall: string[] = [];

  const aliases = await resolveAliasesPath();
  const componentsPath = aliases["components"] || path.join(process.cwd(), "components");
  const uiComponentsPath = path.join(componentsPath, "ui");

  const segmentCode = await fs.readFile(segmentFilePath, "utf-8");
  const shadcnDeps = resolveShadcnComponentDepsFromSource(segmentCode);

  for (const component of shadcnDeps) {
    if (!(await isShadcnComponentInstalled(component, uiComponentsPath))) {
      shadcnComponentsToInstall.push(component);
    }
  }

  for (const component of shadcnComponentsToInstall) {
    console.log(`Installing shadcn component: ${component}`);
    await execa("npx", ["shadcn@latest", "add", component], { cwd: process.cwd() });
  }

  const segmentName = path.basename(segmentFilePath, path.extname(segmentFilePath));
  console.log(`Finished installing dependencies for segment '${segmentName}'`);
}
