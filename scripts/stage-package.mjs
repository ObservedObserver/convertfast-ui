import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { execFileSync } from 'node:child_process';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const cli = path.join(root, 'packages/cli');
// Recreate the payload so removed templates cannot survive a later release.
for (const directory of ['templates', 'assets', 'registry']) {
  await fs.rm(path.join(cli, directory), { recursive: true, force: true });
}
for (const script of ['build-registry.mjs', 'validate-registry.mjs']) {
  execFileSync(process.execPath, [path.join(root, 'packages/registry/scripts', script)], { stdio: 'inherit' });
}
const manifest = JSON.parse(await fs.readFile(path.join(root, 'packages/registry/manifest/blocks.json'), 'utf8'));
for (const item of manifest.items) {
  const relative = path.relative(path.join(root, 'packages/segments'), path.join(root, item.sourceFile));
  const target = path.join(cli, 'templates', relative);
  await fs.mkdir(path.dirname(target), { recursive: true });
  await fs.copyFile(path.join(root, item.sourceFile), target);
}
await fs.cp(path.join(root, 'packages/segments/public/_convertfast'), path.join(cli, 'assets/_convertfast'), { recursive: true });
await fs.cp(path.join(root, 'packages/registry/generated'), path.join(cli, 'registry'), { recursive: true });
await fs.copyFile(path.join(root, 'LICENSE'), path.join(cli, 'LICENSE'));
await fs.chmod(path.join(cli, 'dist/index.js'), 0o755);
console.log('Staged CLI, templates, registry, assets, and license.');
