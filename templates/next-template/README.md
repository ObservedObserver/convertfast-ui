# ConvertFast Next.js sample

This sample uses Next.js 16.3.4, React 19 and Tailwind CSS 4. Node.js 20.9 or newer is required. Install workspace dependencies from the repository root, then run:

```sh
yarn workspace template-app dev
yarn workspace template-app lint
yarn workspace template-app typecheck
yarn workspace template-app build
```

Open http://localhost:3000 to preview the sample. Edit `app/page.tsx` and its adjacent sections to change it. The sample content and links are placeholders; replace them before using it for a product.

The Tailwind theme lives in `app/globals.css`. `components.json` uses the Tailwind 4 convention of an empty configuration path. The sample uses system fonts, so its build does not download fonts.

The component development workspace in `packages/segments` retains Tailwind 3. The CLI installs sections into the host application's shadcn setup and supports both Tailwind versions.

Upgrade references: [Next.js 16 migration](https://nextjs.org/docs/app/guides/upgrading/version-16) and [Tailwind CSS 4 migration](https://tailwindcss.com/docs/upgrade-guide).
