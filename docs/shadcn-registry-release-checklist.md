# ConvertFast Registry Release Checklist

## 1. Build and Validate

1. Run `yarn registry:build`.
2. Run `yarn registry:validate`.
3. Confirm files exist in `/Users/observedobserver/Documents/GitHub/convertfast-ui/packages/registry/generated`.

## 2. Publish Registry Files

Publish all files under:

- `/Users/observedobserver/Documents/GitHub/convertfast-ui/packages/registry/generated`

Target URL shape (flat):

1. `https://ui.convertfa.st/r/registry.json`
2. `https://ui.convertfa.st/r/<item>.json`
3. `https://ui.convertfa.st/r/<item>.tsx`

## 3. Smoke Tests

In a fresh Next.js project with shadcn initialized:

1. `npx shadcn@latest add @convertfast/hero-section`
2. `npx shadcn@latest add @convertfast/hero-section-editorial`
3. Ensure generated files compile with existing aliases and Tailwind setup.

## 4. Shadcn Open Source Directory Submission

Submit a PR to:

- `https://github.com/shadcn-ui/ui`
- file: `apps/v4/registry/directory.json`

Add ConvertFast registry entry pointing to:

- `https://ui.convertfa.st/r/registry.json`

Then run their documented registry build step and include generated changes in PR.

## 5. Post-Merge Verification

1. Run `npx shadcn@latest search @convertfast`.
2. Run `npx shadcn@latest add @convertfast/hero-section` in a clean project.
3. Verify item install works without manual registry URL edits.
