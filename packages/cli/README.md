# ConvertFast UI

Generate editable landing pages and shadcn blocks in an existing Next.js project. The CLI copies source into your project, where you can change the content and design.

## Requirements

- Node.js 20.18.1 or newer.
- A TypeScript Next.js 14, 15, or 16 project with an App or Pages Router.
- Tailwind CSS 3 or 4 and a configured shadcn `components.json`.

The included Next.js starter uses Next.js 16.3.4, React 19, and Tailwind CSS 4. Both `app` / `pages` and `src/app` / `src/pages` layouts are supported. If both routers exist, initialization chooses App Router; use `--router pages` to select Pages Router.

## Create a landing page

Initialize shadcn first if the project does not already use it:

```sh
npx shadcn@latest init
```

Then initialize ConvertFast and generate a route:

```sh
npx convertfast-ui@latest init --yes
npx convertfast-ui@latest page create marketing
npx convertfast-ui@latest page create launch --template editorial
```

Use `.` as the page name to create the homepage. Existing pages and sections are preserved unless you pass `--force`. Replace the sample text, testimonials, prices, and links before publishing a generated page.

The `default` and `editorial` templates include hero, logo cloud, features, social proof, CTA, FAQ, and pricing sections. Missing shadcn components are installed automatically, which requires network access. `--skip-install` copies source without installing dependencies.

App Router sections live in the route's `_components` folder. Pages Router sections live under the configured components directory, outside `pages`, so Next.js does not register them as routes.

## Add or replace a section

```sh
npx convertfast-ui@latest page add marketing faq
npx convertfast-ui@latest page add marketing hero-section --template editorial --force
```

For a custom page, place `{/* convertfast:sections */}` where new sections should appear. Generated pages already have this marker.

## Install a standalone block

```sh
npx convertfast-ui@latest block add hero-section
npx convertfast-ui@latest block add faq --template editorial
```

Blocks use the registry JSON bundled in the npm package. No ConvertFast registry server or namespace setup is required. ConvertFast uses the tested shadcn CLI 4.21.0, which still downloads its dependencies. Blocks go into your configured components directory; import the installed component into a page. Bundled blocks require `--force` to replace; existing public assets and shared UI components are preserved.

To use a separately configured registry, pass `--namespace @your-registry`. With remote registries, `--force` follows shadcn overwrite behavior, including the registry's dependencies and assets. Page generation supports explicit `--registry auto` or `--registry only`; the default `off` uses bundled template source and installs only its missing UI dependencies.

## Configuration and upgrades

`init` records the detected Next.js version and router in `landing-pages.json`. It supports JSONC TypeScript configuration, inherited aliases, and custom `aliases.ui` and `aliases.utils`. Re-run `init --force` after moving your router, or select it explicitly:

```sh
npx convertfast-ui@latest init --yes --force --router pages
```

An existing router-only `landing-pages.json` remains supported. Running the CLI does not upgrade your application's Next.js dependencies.

Aliases must resolve within the current application directory. Shared component packages outside that directory are not supported by this release.

`--components path/to/components.json` can select a nonstandard configuration for source generation. Automatic shadcn installation requires `components.json` at the project root; otherwise install the UI dependencies yourself and use `--skip-install`.

## Development and release checks

```sh
yarn install --frozen-lockfile
yarn build
yarn typecheck
yarn test
yarn workspace @convertfast/registry test
yarn workspace template-app build
yarn workspace template-app lint
yarn workspace segments build
yarn workspace segments lint
yarn test:release
```

`test:release` packs the CLI, installs that tarball into six isolated Next.js projects, generates both templates, builds and serves the results, and checks routes and assets. The matrix covers Next.js 14/15/16, React 18/19, App/Pages Router, root/src directories, and Tailwind 3/4. Logs, the tarball manifest, and its SHA-256 are written to the ignored `.release` directory. Temporary fixture directories are retained for inspection and listed in `.release/validation.json`.

Packaging runs the build and stages only the CLI, template source, installable registry payloads, assets, and license. Publishing is a separate maintainer action after verification.

[Documentation](https://ui.convertfa.st) · [MIT license](LICENSE)
