# ConvertFast registry release checklist

## Build the npm candidate

- Run `yarn registry:build`, `yarn registry:validate`, and `yarn workspace @convertfast/registry test`.
- Confirm all 14 item JSONs exist in `packages/registry/generated` and every file entry contains inline `content`.
- Build and pack the CLI using the repository's release scripts. Inspect the tarball, not only the workspace.
- Confirm the packed `registry/` directory includes the index, 14 payloads, and the referenced component and SVG files.
- Confirm the tarball contains no local analytical documents, credentials, development dependencies, or unrelated project files.

The registry validator checks the output against current sources and metadata. It does not replace installation tests with the actual shadcn CLI.

## Test the packed artifact

Use temporary Next.js projects with shadcn initialized. Include the supported Next.js, router, source-directory, and alias configurations in the package's test matrix.

- Install each bundled block through the packed CLI. Cover both default and editorial variants.
- Confirm the generated files use the project's aliases and declared dependencies install successfully.
- Confirm the hero and CTA gradient SVG is written to `public/_convertfast/gradient-bg-0.svg`, including a standalone block installation before ConvertFast initialization.
- Build the generated pages for production. Exercise interactive UI and check that local assets return successfully.
- Test the local registry JSON directly with shadcn as well as through ConvertFast.
- Verify failures produce a nonzero exit code and do not report successful installation.
- Record the npm candidate version, tarball checksum, environment versions, commands, and results.

Stop after the candidate passes. The maintainer performs npm publication. Keep the tested tarball available so publication uses the validated artifact.

## Publish the hosted registry in the website phase

After npm release, deploy the generated registry with the documentation website. These endpoints must return JSON:

```text
/r/registry.json
/r/hero-section.json
/r/hero-section-editorial.json
```

Check every item endpoint, not only the index. Item payloads include source content; a separate public TSX endpoint is optional. If the index is distributed for consumers to rebuild, distribute its referenced source tree too.

Use the confirmed live host to configure `@convertfast` in `components.json`. Test namespace installation in a fresh project. Only describe automatic namespace discovery after the official registry directory entry is available and tested.

## Domain migration checkpoint

Stop for the maintainer when the deployed site is ready for domain rebinding. After the root domain is bound, update the registry homepage and hosted registry URLs, and verify that the old host redirects item paths to the equivalent new URLs. Repeat installation against the new canonical endpoints and old redirected endpoints.

Schema reference: [shadcn registry item specification](https://ui.shadcn.com/docs/registry/registry-item-json).
