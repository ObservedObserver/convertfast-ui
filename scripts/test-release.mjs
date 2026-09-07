import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import os from 'node:os';
import path from 'node:path';
import { createHash } from 'node:crypto';
import { spawn } from 'node:child_process';
import { once } from 'node:events';
import { createServer } from 'node:net';
import { root, matrix, createFixture, write } from '../tests/fixtures.mjs';

const release = path.join(root, '.release');
await fs.mkdir(release, { recursive: true });
const env = { ...process.env, NEXT_TELEMETRY_DISABLED: '1', CI: '1' };
async function run(command, args, cwd, logName, extraEnv = {}) {
  const child = spawn(command, args, { cwd, env: { ...env, ...extraEnv }, stdio: ['ignore', 'pipe', 'pipe'] });
  let output = '';
  child.stdout.on('data', data => { output += data; });
  child.stderr.on('data', data => { output += data; });
  const timer = setTimeout(() => child.kill('SIGTERM'), 600_000);
  let code;
  try { [code] = await once(child, 'exit'); } finally { clearTimeout(timer); }
  await fs.writeFile(path.join(release, `${logName}.log`), output);
  if (code !== 0) throw new Error(`${command} ${args.join(' ')} failed (${code}).\n${output.slice(-12_000)}`);
  return output;
}
async function availablePort() {
  const server = createServer();
  server.listen(0, '127.0.0.1');
  await once(server, 'listening');
  const port = server.address().port;
  await new Promise(resolve => server.close(resolve));
  return port;
}
async function verifyHTTP(directory, config) {
  const port = await availablePort();
  const child = spawn(process.execPath, [path.join(directory, 'node_modules/next/dist/bin/next'), 'start', '-p', String(port), '-H', '127.0.0.1'], { cwd: directory, env, stdio: ['ignore', 'pipe', 'pipe'] });
  let output = '';
  child.stdout.on('data', data => { output += data; });
  child.stderr.on('data', data => { output += data; });
  const base = `http://127.0.0.1:${port}`;
  try {
    let ready = false;
    for (let attempt = 0; attempt < 100; attempt++) {
      if (child.exitCode !== null) throw new Error(output);
      try { ready = (await fetch(`${base}/default`)).ok; } catch { /* server is starting */ }
      if (ready) break;
      await new Promise(resolve => setTimeout(resolve, 200));
    }
    assert.ok(ready, `Production server did not become ready: ${output}`);
    for (const route of ['default', 'editorial', ...(config.freshUI ? ['blocks'] : [])]) {
      const response = await fetch(`${base}/${route}`);
      assert.equal(response.status, 200, `${route} response`);
      const html = await response.text();
      assert.match(html, /<h1[\s>]/, `${route} contains server-rendered heading`);
      assert.match(html, /stylesheet/, `${route} includes CSS`);
    }
    assert.equal((await fetch(`${base}/_convertfast/gradient-bg-0.svg`)).status, 200);
    assert.equal((await fetch(`${base}/not-a-real-route`)).status, 404);
    if (config.router === 'pages') assert.equal((await fetch(`${base}/default/hero-section`)).status, 404);
    return { routes: ['default', 'editorial', ...(config.freshUI ? ['blocks'] : [])], assets: '200', missingRoute: '404' };
  } finally {
    child.kill('SIGTERM');
    await once(child, 'exit').catch(() => {});
    await fs.writeFile(path.join(release, `${config.id}-server.log`), output);
  }
}

const supplied = process.env.CONVERTFAST_TARBALL;
let tarball;
if (supplied) {
  tarball = path.resolve(supplied);
} else {
  const output = await run('npm', ['pack', '--json', '--pack-destination', release], path.join(root, 'packages/cli'), 'pack');
  const jsonStart = output.lastIndexOf('\n[');
  const metadata = JSON.parse(jsonStart >= 0 ? output.slice(jsonStart + 1) : output);
  tarball = path.join(release, metadata[0].filename);
  for (const file of metadata[0].files) {
    assert.ok(/^(dist\/|templates\/|assets\/|registry\/|package\.json$|README\.md$|LICENSE$)/.test(file.path), `Unexpected packaged file: ${file.path}`);
    assert.ok(!file.path.includes('.local-docs') && !file.path.includes('.env'));
  }
  await write(release, 'pack-manifest.json', metadata[0]);
}
const sha256 = createHash('sha256').update(await fs.readFile(tarball)).digest('hex');
const selected = process.env.CONVERTFAST_MATRIX ? matrix.filter(item => process.env.CONVERTFAST_MATRIX.split(',').includes(item.id)) : matrix;
assert.ok(selected.length, 'No matrix cases selected');
const results = { tarball, sha256, node: process.version, startedAt: new Date().toISOString(), cases: [] };
console.log(`Testing ${path.basename(tarball)} (${sha256})`);
try {
  for (const config of selected) {
    // Outside the repository: no workspace hoisting, Next dependency or config leakage.
    const directory = await fs.mkdtemp(path.join(os.tmpdir(), `convertfast-${config.id}-`));
    const entry = { ...config, directory, status: 'running' };
    results.cases.push(entry);
    await write(release, 'validation.json', results);
    console.log(`[${config.id}] Installing the actual tarball in ${directory}`);
    await createFixture(directory, config, tarball);
    await run('npm', ['install', '--no-audit', '--no-fund'], directory, `${config.id}-install`);
    const cli = path.join(directory, 'node_modules/convertfast-ui/dist/index.js');
    await run(process.execPath, [cli, '--version'], directory, `${config.id}-version`);
    if (config.freshUI) {
      // Standalone blocks must also work before ConvertFast initialization,
      // including installing their bundled public assets and missing UI dependencies.
      for (const [block, template] of [['hero-section', 'default'], ['faq', 'editorial']]) {
        await run(process.execPath, [cli, 'block', 'add', block, '--template', template], directory, `${config.id}-block-${block}`);
      }
      await fs.access(path.join(directory, 'public/_convertfast/gradient-bg-0.svg'));
    }
    await run(process.execPath, [cli, 'init', '--yes'], directory, `${config.id}-init`);
    const detected = JSON.parse(await fs.readFile(path.join(directory, 'landing-pages.json'), 'utf8'));
    assert.equal(detected.nextjs.version, config.next);
    assert.equal(detected.nextjs.router, config.router);
    for (const template of ['default', 'editorial']) {
      console.log(`[${config.id}] Generating ${template}`);
      await run(process.execPath, [cli, 'page', 'create', template, '--template', template], directory, `${config.id}-${template}`);
    }
    await run(process.execPath, [cli, 'page', 'add', 'editorial', 'faq', '--template', 'editorial', '--force'], directory, `${config.id}-add`);
    if (config.freshUI) {
      const asset = path.join(directory, 'public/_convertfast/gradient-bg-0.svg');
      const button = path.join(directory, 'components/ui/button.tsx');
      const assetContent = (await fs.readFile(asset, 'utf8')) + '\n<!-- user customization -->\n';
      const buttonContent = (await fs.readFile(button, 'utf8')) + '\n// user customization\n';
      await fs.writeFile(asset, assetContent);
      await fs.writeFile(button, buttonContent);
      await run(process.execPath, [cli, 'block', 'add', 'hero-section', '--force'], directory, `${config.id}-block-force`);
      assert.equal(await fs.readFile(asset, 'utf8'), assetContent, 'block overwrite must preserve public assets');
      assert.equal(await fs.readFile(button, 'utf8'), buttonContent, 'block overwrite must preserve shared UI');
      await run(process.execPath, [cli, 'page', 'create', 'registry-only', '--registry', 'only', '--force'], directory, `${config.id}-registry-only`);
      assert.equal(await fs.readFile(asset, 'utf8'), assetContent);
      assert.equal(await fs.readFile(button, 'utf8'), buttonContent);
      const manifest = JSON.parse(await fs.readFile(path.join(root, 'packages/registry/manifest/blocks.json'), 'utf8'));
      const imports = [];
      const components = [];
      for (const item of manifest.items) {
        if (item.variant === 'editorial' && item.name !== 'faq-editorial') {
          await run(process.execPath, [cli, 'block', 'add', item.name.replace(/-editorial$/, ''), '--template', 'editorial'], directory, `${config.id}-block-${item.name}`);
        }
        const source = await fs.readFile(path.join(directory, 'components', `${item.name}.tsx`), 'utf8');
        const exported = /export\s+(?:const|function)\s+(\w+)/.exec(source)?.[1];
        assert.ok(exported, `No component export in ${item.name}`);
        const binding = `${exported}${item.variant === 'editorial' ? 'Editorial' : 'Default'}`;
        imports.push(`import { ${exported} as ${binding} } from "@/components/${item.name}";`);
        components.push(`<${binding} />`);
      }
      await write(directory, 'app/blocks/page.tsx', `${imports.join('\n')}\nexport default function Page() { return <main>${components.join('')}</main>; }\n`);
      entry.installedBlocks = manifest.items.map(item => item.name);
      await run(process.execPath, ['--test', path.join(root, 'tests/cli.test.mjs')], root, 'packed-cli-regressions', { CONVERTFAST_TEST_CLI: cli });
    }
    console.log(`[${config.id}] Building and serving the generated pages`);
    await run('npm', ['run', 'build'], directory, `${config.id}-build`);
    entry.http = await verifyHTTP(directory, config);
    entry.status = 'passed';
    await write(release, 'validation.json', results);
    console.log(`[${config.id}] Passed`);
  }
  results.completedAt = new Date().toISOString();
  results.status = 'passed';
} catch (error) {
  results.status = 'failed';
  results.error = error.message;
  const current = results.cases.at(-1);
  if (current?.status === 'running') current.status = 'failed';
  throw error;
} finally {
  await write(release, 'validation.json', results);
}
console.log(`Release verification passed. Evidence: ${path.join(release, 'validation.json')}`);
