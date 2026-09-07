import fs from "node:fs/promises";
import path from "node:path";
import { safeProjectPath } from "./get-config.ts";

export async function copyDir(src: string, dest: string) {
  await safeProjectPath(process.cwd(), path.relative(process.cwd(), dest));
  await fs.mkdir(dest, { recursive: true });
  for (const entry of await fs.readdir(src, { withFileTypes: true })) {
    const source = path.join(src, entry.name);
    const destination = path.join(dest, entry.name);
    await safeProjectPath(process.cwd(), path.relative(process.cwd(), destination));
    if (entry.isDirectory()) await copyDir(source, destination);
    else if (entry.isFile()) {
      // Assets may have been customized by the project owner.
      await fs.copyFile(source, destination, fs.constants.COPYFILE_EXCL).catch((error: NodeJS.ErrnoException) => {
        if (error.code !== "EEXIST") throw error;
      });
    }
  }
}
