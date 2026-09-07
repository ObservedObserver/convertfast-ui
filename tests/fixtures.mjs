import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

export const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
export const matrix = [
  { id: 'next16-app-root', next: '16.3.4', react: '19.2.8', router: 'app', src: false, tailwind: 4, freshUI: true },
  { id: 'next16-pages-src', next: '16.3.4', react: '19.2.8', router: 'pages', src: true, tailwind: 4 },
  { id: 'next15-app-src', next: '15.5.25', react: '19.2.8', router: 'app', src: true, tailwind: 3 },
  { id: 'next15-pages-root', next: '15.5.25', react: '19.2.8', router: 'pages', src: false, tailwind: 3 },
  { id: 'next14-app-root', next: '14.2.35', react: '18.3.1', router: 'app', src: false, tailwind: 3 },
  { id: 'next14-pages-src', next: '14.2.35', react: '18.3.1', router: 'pages', src: true, tailwind: 3 },
];

export async function write(directory, file, content) {
  const target = path.join(directory, file);
  await fs.mkdir(path.dirname(target), { recursive: true });
  await fs.writeFile(target, typeof content === 'string' ? content : JSON.stringify(content, null, 2) + '\n');
}

export async function createFixture(directory, config, tarball) {
  const prefix = config.src ? 'src/' : '';
  const modern = config.tailwind === 4;
  const dependencies = {
    next: config.next, react: config.react, 'react-dom': config.react,
    clsx: '^2.1.1', 'tailwind-merge': modern ? '^3.6.0' : '^2.6.0',
    'class-variance-authority': '^0.7.1', 'tailwindcss-animate': '^1.0.7',
  };
  if (tarball) dependencies['convertfast-ui'] = `file:${tarball}`;
  // Most cases represent existing shadcn projects; one starts without UI files
  // and exercises actual dependency installation from the public registry.
  if (!config.freshUI) Object.assign(dependencies, {
    '@radix-ui/react-accordion': '^1.2.0', '@radix-ui/react-avatar': '^1.1.2',
    '@radix-ui/react-slot': '^1.1.0', '@radix-ui/react-icons': '^1.3.2', 'lucide-react': '^1.41.0',
  });
  await write(directory, 'package.json', {
    name: `convertfast-test-${config.id}`, private: true,
    scripts: { build: 'next build', start: 'next start' }, dependencies,
    devDependencies: {
      typescript: '^5.9.3', '@types/node': '^20',
      '@types/react': config.react.startsWith('18.') ? '^18' : '^19',
      '@types/react-dom': config.react.startsWith('18.') ? '^18' : '^19',
      postcss: '^8', tailwindcss: modern ? '^4.3.3' : '^3.4.17',
      ...(modern ? { '@tailwindcss/postcss': '^4.3.3' } : { autoprefixer: '^10.4.21' }),
    },
  });
  const tsconfig = {
    compilerOptions: {
      target: 'ES2017', lib: ['dom', 'dom.iterable', 'esnext'], allowJs: true, skipLibCheck: true,
      strict: true, noEmit: true, esModuleInterop: true, module: 'esnext', moduleResolution: 'bundler',
      resolveJsonModule: true, isolatedModules: true, jsx: 'preserve', incremental: true,
      plugins: [{ name: 'next' }], paths: { '@/*': [`./${prefix}*`] },
    },
    include: ['next-env.d.ts', '**/*.ts', '**/*.tsx', '.next/types/**/*.ts'], exclude: ['node_modules'],
  };
  // JSONC is accepted by TypeScript and create-next-app configurations.
  await write(directory, 'tsconfig.json', '// Next.js project configuration\n' + JSON.stringify(tsconfig, null, 2));
  await write(directory, 'components.json', {
    $schema: 'https://ui.shadcn.com/schema.json', style: 'new-york', rsc: config.router === 'app', tsx: true,
    tailwind: { config: modern ? '' : 'tailwind.config.mjs', css: `${prefix}globals.css`, baseColor: 'neutral', cssVariables: true },
    aliases: { components: '@/components', utils: '@/lib/utils', ui: '@/components/ui', lib: '@/lib', hooks: '@/hooks' },
  });
  await write(directory, 'next.config.mjs', 'export default { experimental: { cpus: 2 } };\n');
  await write(directory, 'postcss.config.mjs', modern
    ? 'export default { plugins: { "@tailwindcss/postcss": {} } };\n'
    : 'export default { plugins: { tailwindcss: {}, autoprefixer: {} } };\n');
  if (!modern) await fs.copyFile(path.join(root, 'packages/segments/tailwind.config.js'), path.join(directory, 'tailwind.config.mjs'));
  const css = await fs.readFile(path.join(root, modern ? 'templates/next-template/app/globals.css' : 'packages/segments/src/index.css'), 'utf8');
  await write(directory, `${prefix}globals.css`, css);
  await write(directory, `${prefix}lib/utils.ts`, 'import { clsx, type ClassValue } from "clsx";\nimport { twMerge } from "tailwind-merge";\nexport function cn(...inputs: ClassValue[]) { return twMerge(clsx(inputs)); }\n');
  await fs.mkdir(path.join(directory, prefix, config.router), { recursive: true });
  await fs.mkdir(path.join(directory, prefix, 'components/ui'), { recursive: true });
  if (!config.freshUI) for (const name of ['button', 'card', 'avatar', 'accordion']) {
    await fs.copyFile(path.join(root, 'packages/segments/src/components/ui', `${name}.tsx`), path.join(directory, prefix, 'components/ui', `${name}.tsx`));
  }
  if (config.router === 'app') {
    await write(directory, `${prefix}app/layout.tsx`, 'import "../globals.css";\nexport default function Layout({children}: {children: React.ReactNode}) { return <html lang="en"><body>{children}</body></html>; }\n');
  } else {
    await write(directory, `${prefix}pages/_app.tsx`, 'import "../globals.css";\nimport type { AppProps } from "next/app";\nexport default function App({Component, pageProps}: AppProps) { return <Component {...pageProps} />; }\n');
  }
}
