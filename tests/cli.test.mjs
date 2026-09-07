import assert from 'node:assert/strict';
import { test } from 'node:test';
import fs from 'node:fs/promises';
import os from 'node:os';
import path from 'node:path';
import { spawnSync } from 'node:child_process';
import { root, matrix, createFixture, write } from './fixtures.mjs';

const cli = process.env.CONVERTFAST_TEST_CLI || path.join(root, 'packages/cli/dist/index.js');
function run(cwd, args, success = true) {
  const result = spawnSync(process.execPath, [cli, ...args], { cwd, encoding: 'utf8', timeout: 15_000 });
  assert.ifError(result.error);
  assert.equal(result.status === 0, success, `${args.join(' ')}\n${result.stdout}\n${result.stderr}`);
  return result.stdout + result.stderr;
}
async function fixture(t, config = matrix[0]) {
  const directory = await fs.mkdtemp(path.join(os.tmpdir(), 'convertfast-unit-'));
  t.after(() => fs.rm(directory, { recursive: true, force: true }));
  await createFixture(directory, config);
  // Unit cases model an already installed UI dependency. The release matrix
  // installs real packages and separately covers missing icon dependencies.
  for (const name of ['lucide-react', '@radix-ui/react-icons']) {
    await write(directory, `node_modules/${name}/package.json`, { name, main: 'index.js' });
    await write(directory, `node_modules/${name}/index.js`, 'module.exports = {};');
  }
  return directory;
}

test('CLI reports the candidate version and rejects unknown commands', () => {
  assert.match(run(root, ['--version']), /0\.2\.0/);
  run(root, ['does-not-exist'], false);
});

for (const config of matrix) test(`detect and generate both templates: ${config.id}`, async t => {
  const cwd = await fixture(t, config);
  run(cwd, ['init', '--yes']);
  const settings = JSON.parse(await fs.readFile(path.join(cwd, 'landing-pages.json'), 'utf8'));
  assert.equal(settings.nextjs.router, config.router);
  assert.equal(settings.nextjs.directory, `${config.src ? 'src/' : ''}${config.router}`);
  assert.equal(settings.nextjs.version, config.next);
  const routerRoot = path.join(cwd, settings.nextjs.directory);
  for (const template of ['default', 'editorial']) {
    run(cwd, ['page', 'create', `marketing/${template}`, '--template', template, '--skip-install']);
    const page = path.join(routerRoot, 'marketing', template, config.router === 'app' ? 'page.tsx' : 'index.tsx');
    const code = await fs.readFile(page, 'utf8');
    assert.match(code, /<HeroSection \/>/);
    assert.match(code, /<FAQ \/>/);
    const files = await fs.readdir(path.dirname(page));
    if (config.router === 'pages') assert.deepEqual(files, ['index.tsx']);
    else assert.deepEqual(files.sort(), ['_components', 'page.tsx']);
    run(cwd, ['page', 'create', `marketing/${template}`, '--skip-install'], false);
    assert.equal(await fs.readFile(page, 'utf8'), code, 'refused overwrite must preserve the page');
  }
});

test('init preserves assets and config unless explicitly forced', async t => {
  const cwd = await fixture(t);
  await write(cwd, 'public/_convertfast/gradient-bg-0.svg', 'custom asset');
  run(cwd, ['init', '--yes']);
  const original = await fs.readFile(path.join(cwd, 'landing-pages.json'), 'utf8');
  run(cwd, ['init', '--yes'], false);
  assert.equal(await fs.readFile(path.join(cwd, 'landing-pages.json'), 'utf8'), original);
  run(cwd, ['init', '--yes', '--force']);
  assert.equal(await fs.readFile(path.join(cwd, 'public/_convertfast/gradient-bg-0.svg'), 'utf8'), 'custom asset');
});

test('custom aliases and JSONC extends work for generated imports', async t => {
  const cwd = await fixture(t, matrix[1]);
  await write(cwd, 'tsconfig.base.json', '// shared aliases\n{"compilerOptions":{"baseUrl":".","paths":{"~/*":["./src/*"]}}}');
  await write(cwd, 'tsconfig.json', '{"extends":"./tsconfig.base.json", "compilerOptions": {"strict":true,},}');
  const components = JSON.parse(await fs.readFile(path.join(cwd, 'components.json'), 'utf8'));
  components.aliases = { components: '~/widgets', ui: '~/design/ui', utils: '~/shared/cn' };
  await write(cwd, 'components.json', components);
  run(cwd, ['init', '--yes']);
  run(cwd, ['page', 'create', '.', '--skip-install']);
  const section = await fs.readFile(path.join(cwd, 'src/widgets/convertfast/pages/pricing.tsx'), 'utf8');
  assert.match(section, /~\/design\/ui\/button/);
  assert.match(section, /~\/shared\/cn/);
});

test('multiple tsconfig parents retain aliases when later parents only set strictness', async t => {
  const cwd = await fixture(t, matrix[2]);
  await write(cwd, 'config/paths.json', { compilerOptions: { baseUrl: '..', paths: { '@/*': ['./src/*'] } } });
  await write(cwd, 'config/strict.json', { compilerOptions: { strict: true } });
  await write(cwd, 'tsconfig.json', { extends: ['./config/paths.json', './config/strict.json'] });
  run(cwd, ['init', '--yes']);
  run(cwd, ['page', 'create', 'inherited', '--skip-install']);
  await fs.access(path.join(cwd, 'src/app/inherited/_components/pricing.tsx'));
});

test('unsafe routes, symlinks, unsupported versions and invalid config fail before generating', async t => {
  const cwd = await fixture(t);
  run(cwd, ['init', '--yes']);
  for (const route of ['../escape', '/tmp/escape', 'x/../../escape', 'x\\escape']) {
    run(cwd, ['page', 'create', route, '--skip-install'], false);
  }
  const outside = await fs.mkdtemp(path.join(os.tmpdir(), 'convertfast-outside-'));
  t.after(() => fs.rm(outside, { recursive: true, force: true }));
  await fs.symlink(outside, path.join(cwd, 'app/linked'));
  run(cwd, ['page', 'create', 'linked', '--skip-install'], false);
  assert.deepEqual(await fs.readdir(outside), []);
  run(cwd, ['page', 'create', 'bad', '--template', 'unknown', '--skip-install'], false);
  run(cwd, ['page', 'create', 'bad', '--registry', 'invalid', '--skip-install'], false);
  await assert.rejects(fs.access(path.join(cwd, 'app/bad')));
  await write(cwd, 'landing-pages.json', { nextjs: { router: 'invalid' } });
  run(cwd, ['page', 'create', 'bad', '--skip-install'], false);
  await write(cwd, 'package.json', { dependencies: { next: '13.5.0' } });
  run(cwd, ['init', '--force'], false);
});

test('page add preserves client directives and refuses ambiguous insertion', async t => {
  const cwd = await fixture(t);
  run(cwd, ['init', '--yes']);
  await write(cwd, 'app/custom/page.tsx', '"use client";\nexport default function Page() { return <>{/* convertfast:sections */}</>; }\n');
  run(cwd, ['page', 'add', 'custom', 'faq', '--skip-install']);
  const code = await fs.readFile(path.join(cwd, 'app/custom/page.tsx'), 'utf8');
  assert.ok(code.startsWith('"use client";'));
  assert.match(code, /<FAQ \/>/);
  run(cwd, ['page', 'add', 'custom', 'faq', '--skip-install'], false);
  run(cwd, ['page', 'add', 'custom', 'faq', '--skip-install', '--force']);
  assert.equal(await fs.readFile(path.join(cwd, 'app/custom/page.tsx'), 'utf8'), code);
  await write(cwd, 'app/plain/page.tsx', 'export default function Page() { return <main>Hello</main>; }');
  run(cwd, ['page', 'add', 'plain', 'faq', '--skip-install'], false);
  await assert.rejects(fs.access(path.join(cwd, 'app/plain/_components/faq.tsx')));
});

test('old router-only config stays usable and invalid block names fail locally', async t => {
  const cwd = await fixture(t, matrix[5]);
  await write(cwd, 'landing-pages.json', { nextjs: { router: 'pages' }, components: { path: 'components.json' } });
  run(cwd, ['page', 'create', 'legacy', '--skip-install']);
  await fs.access(path.join(cwd, 'src/pages/legacy/index.tsx'));
  run(cwd, ['block', 'add', '../hero-section'], false);
  run(cwd, ['block', 'add', 'hero-section', '--template', 'unknown'], false);
});

test('registry auto falls back on a block conflict; only fails without touching the page', async t => {
  const cwd = await fixture(t, matrix[2]);
  run(cwd, ['init', '--yes']);
  await write(cwd, 'src/components/hero-section.tsx', 'user block');
  run(cwd, ['page', 'create', 'fallback', '--registry', 'auto']);
  assert.equal(await fs.readFile(path.join(cwd, 'src/components/hero-section.tsx'), 'utf8'), 'user block');
  run(cwd, ['page', 'create', 'strict', '--registry', 'only'], false);
  await assert.rejects(fs.access(path.join(cwd, 'src/app/strict/page.tsx')));
});

test('page add updates a legacy import without duplicate bindings', async t => {
  const cwd = await fixture(t);
  run(cwd, ['init', '--yes']);
  await write(cwd, 'app/legacy/page.tsx', "import { FAQ } from './faq';\nexport default function Page() { return <><FAQ /></>; }");
  run(cwd, ['page', 'add', 'legacy', 'faq', '--skip-install', '--force']);
  const code = await fs.readFile(path.join(cwd, 'app/legacy/page.tsx'), 'utf8');
  assert.equal([...code.matchAll(/import \{ FAQ \}/g)].length, 1);
  assert.match(code, /\.\/_components\/faq/);
});

test('flat Pages routes and alternate page extensions are preserved', async t => {
  for (const config of [matrix[0], matrix[1]]) {
    const cwd = await fixture(t, config);
    run(cwd, ['init', '--yes']);
    const target = config.router === 'app' ? 'app/about/page.jsx' : 'src/pages/about.tsx';
    await write(cwd, target, 'user route');
    run(cwd, ['page', 'create', 'about', '--force', '--skip-install'], false);
    assert.equal(await fs.readFile(path.join(cwd, target), 'utf8'), 'user route');
  }
});
