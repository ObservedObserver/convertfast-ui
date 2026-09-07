# ConvertFast registry

The manifest in `manifest/blocks.json` describes 15 registry items: seven landing-page sections in both `default` and `editorial` variants, plus the standalone color picker. Sources live in `packages/segments/src`.

Run these commands from the repository root:

```bash
yarn registry:build
yarn registry:validate
yarn workspace @convertfast/registry test
```

The build creates `generated/registry.json`, installable `<item-name>.json` files, and copies of the referenced sources. Each item payload embeds `files[].content`; consumers do not need to fetch separate TSX or SVG files. The index omits inline content and points to the generated sources, so it can also serve as input to `shadcn build`.

Component files use `registry:component` and install under the consumer's configured components alias. Local SVG assets use `registry:file` with an explicit `public/_convertfast/…` target. Hero and CTA therefore include their gradient background without requiring `convertfast-ui init` first.

The builder derives shadcn dependencies and npm package dependencies from static imports. React, React DOM, and Next.js are supplied by the consuming project. `@/lib/utils` comes from shadcn setup. Optional dependency lists in the manifest must match the imports. New local component imports fail the build until their files are included in the builder.

The validator compares generated metadata, embedded content, asset targets, and source copies against the manifest and current sources. Regression tests cover invalid and stale outputs. This validation checks our output contract; release verification must also install the payloads with the actual shadcn CLI and compile the resulting project.

The npm package bundles these generated payloads under `registry/`. Hosted URLs and the `@convertfast` namespace are separate distribution options and are not prerequisites for installing the bundled blocks. See `docs/shadcn-registry-release-checklist.md` for release checks.

Schema reference: [shadcn registry item specification](https://ui.shadcn.com/docs/registry/registry-item-json).
