# ConvertFast registry distribution

ConvertFast ships 15 shadcn-compatible registry payloads with its npm package. Bundling the payloads lets the CLI install a block before a hosted registry or namespace is available.

## Files and installation

`packages/registry/manifest/blocks.json` defines block names, titles, variants, and source paths. The builder reads the current section source and creates:

```text
packages/registry/generated/
  registry.json
  hero-section.json
  hero-section-editorial.json
  ...
  components/
    hero-section.tsx
    hero-section-editorial.tsx
    ...
  public/_convertfast/
    gradient-bg-0.svg
```

The npm build copies this directory to the CLI package's `registry/` directory. Each `<item>.json` embeds its source files in `files[].content`. A payload can be installed directly with shadcn from an absolute local JSON path. Its component files use `registry:component`, which respects the components alias in the consuming project's `components.json`. Asset files specify a `public/_convertfast/…` target.

The generated `registry.json` uses paths without embedded content and retains source copies alongside it. This is a registry build definition, while each `<item>.json` is a ready-to-install artifact. Publishing path-only item JSONs leaves shadcn without component contents and is not a valid release process.

## Available blocks

| Section | Default item | Editorial item |
| --- | --- | --- |
| Hero | `hero-section` | `hero-section-editorial` |
| Logos | `logo-cloud` | `logo-cloud-editorial` |
| Features | `feature-section` | `feature-section-editorial` |
| Testimonials | `social-proof` | `social-proof-editorial` |
| Call to action | `cta` | `cta-editorial` |
| FAQ | `faq` | `faq-editorial` |
| Pricing | `pricing` | `pricing-editorial` |

Static imports determine `registryDependencies` and npm `dependencies`. The manifest's optional declarations are checked against those imports. Framework dependencies remain the responsibility of the Next.js project. A configured shadcn project provides `@/lib/utils` and the corresponding aliases. Referenced local SVG backgrounds are included in the payload.

## Release order

First, validate and ship the npm package, including installation tests against the packed artifact. Stop for the maintainer to publish the package.

Then update the documentation site and publish the hosted registry as part of that site's deployment. The hosted URL shape is `https://convertfa.st/r/registry.json` and `https://convertfa.st/r/<item>.json`. Confirm each endpoint serves the generated JSON, including embedded file content. The canonical site host is `convertfa.st`. Keep `ui.convertfa.st` attached as a permanent redirect to preserve existing links and assets used by the published 0.2.0 package.

A hosted registry can be configured explicitly in a consumer's `components.json`:

```json
{
  "registries": {
    "@convertfast": "https://convertfa.st/r/{name}.json"
  }
}
```

Namespace installation then takes this form:

```bash
npx shadcn@latest add @convertfast/hero-section
npx shadcn@latest add @convertfast/hero-section-editorial
```

An official shadcn directory entry is a later distribution task. Do not assume a namespace works in an unconfigured project until that entry has been accepted and verified.

## Validation

```bash
yarn registry:build
yarn registry:validate
yarn workspace @convertfast/registry test
```

Validation checks that every manifest item has the expected dependency declarations, inline source, file types, and asset targets. It also detects stale source copies and unexpected item JSONs. Tests deliberately corrupt those outputs to verify the checks fail. Real shadcn installation and a production Next.js build remain required for release.

References: [registry item schema](https://ui.shadcn.com/docs/registry/registry-item-json), [registry build definition](https://ui.shadcn.com/docs/registry/registry-json), [registry examples](https://ui.shadcn.com/docs/registry/examples).
