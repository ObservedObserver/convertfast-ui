# ConvertFast x shadcn Registry Migration

## 1. Background

The current section distribution model in `convertfast-ui` is:

1. The CLI copies section source files directly into the user project.
2. The CLI runs `shadcn add` based on hardcoded dependencies.

Relevant code:

- `/Users/observedobserver/Documents/GitHub/convertfast-ui/packages/cli/src/commands/page.ts`
- `/Users/observedobserver/Documents/GitHub/convertfast-ui/packages/cli/src/utils/install-deps.ts`
- `/Users/observedobserver/Documents/GitHub/convertfast-ui/packages/cli/src/utils/segments.ts`

Compared to the current shadcn ecosystem model (registry-first), this causes:

1. Users cannot directly install ConvertFast blocks with `shadcn add @convertfast/...`.
2. Section metadata is scattered in CLI code and cannot be reused for docs or distribution.
3. Dependency resolution, template variants, and publishing are tightly coupled in the CLI.

## 2. Goals

### 2.1 Product Goals

1. Let users install ConvertFast blocks via shadcn CLI.
2. Build a unified block metadata source that powers CLI, registry, and docs.
3. Move ConvertFast CLI from “file copier” to “thin wrapper.”

### 2.2 Technical Goals

1. Publish a public, schema-compliant flat shadcn registry.
2. Support template variants (`default`, `editorial`) as separate registry items.
3. Keep backward compatibility during migration, then deprecate old flows.

## 3. Target Architecture

### 3.1 Core Principles

1. Single source of truth: one block manifest drives all downstream outputs.
2. Flat registry: publish only `/registry.json` and `/<item>.json`.
3. CLI delegation: prefer `shadcn add` instead of custom dependency copy logic.

### 3.2 Recommended Directory

```text
/Users/observedobserver/Documents/GitHub/convertfast-ui/packages/registry
  /manifest
    blocks.json               # canonical metadata source
  /generated                  # build output (publishable)
    registry.json
    hero-section.json
    hero-section-editorial.json
    ...
  /scripts
    build-registry.ts         # manifest -> generated
    validate-registry.ts      # schema checks
```

Suggested publish endpoints:

1. `https://ui.convertfa.st/r/registry.json`
2. `https://ui.convertfa.st/r/<item>.json`

## 4. Naming and Installation Conventions

### 4.1 Naming Rules

1. Default template: `<block-name>`, e.g. `hero-section`.
2. Variant template: `<block-name>-<variant>`, e.g. `hero-section-editorial`.
3. shadcn install target: `@convertfast/<item-name>`.

### 4.2 Installation Examples

```bash
npx shadcn@latest add @convertfast/hero-section
npx shadcn@latest add @convertfast/hero-section-editorial
```

## 5. Recommended First Batch of Blocks

These blocks have simple dependencies and are ideal for first rollout:

1. `hero-section` (deps: `button`)
2. `logo-cloud` (deps: `card`)
3. `feature-section` (deps: `button`)
4. `social-proof` (deps: `card`, `avatar`)
5. `cta` (deps: `button`)
6. `faq` (deps: `accordion`)
7. `pricing` (deps: `button`, `card`)
8. `hero-section-editorial` (deps: `button`)
9. `logo-cloud-editorial` (deps: `card`)
10. `feature-section-editorial` (deps: `button`)
11. `social-proof-editorial` (deps: `card`, `avatar`)
12. `cta-editorial` (deps: `button`)
13. `faq-editorial` (deps: `accordion`)
14. `pricing-editorial` (deps: `button`, `card`)

Dependency source files:

- `/Users/observedobserver/Documents/GitHub/convertfast-ui/packages/segments/src/segments`
- `/Users/observedobserver/Documents/GitHub/convertfast-ui/packages/segments/src/editorial/segments`

## 6. Migration Phases

### Phase 1: Registry MVP

1. Create `packages/registry` and adopt a single `blocks.json`.
2. Publish only the first 14 items.
3. Each item must declare:
   - block title and description
   - file paths (path-only, no inline content)
   - `registryDependencies` (shadcn dependencies)
   - `dependencies` (npm dependencies, if needed)
4. Add schema validation in CI.

Acceptance criteria:

1. `registry.json` and each item JSON are publicly accessible.
2. `npx shadcn@latest add @convertfast/hero-section` works in a clean project.

### Phase 2: CLI Becomes Registry-Driven

1. Add command:
   - `convertfast add <block> --template <variant>`
2. Refactor old logic:
   - `/Users/observedobserver/Documents/GitHub/convertfast-ui/packages/cli/src/utils/install-deps.ts` moves from hardcoded dependency install to registry install calls.
3. Change `page create` from section file copy to block preset install + page skeleton generation.

Acceptance criteria:

1. CLI no longer maintains hardcoded section dependency lists.
2. CLI output is consistent with direct `shadcn add`.

### Phase 3: Community Directory Integration

1. Submit PR to shadcn UI registry index directory.
2. After review, ConvertFast appears in the official list.

Acceptance criteria:

1. New users can install by namespace without manual registry setup.

### Phase 4: Legacy Flow Sunset

1. Remove “copy section + hardcoded dependency install” flow.
2. Update README and CLI help docs.

Acceptance criteria:

1. `page/add` internally uses registry-only flow.
2. Docs use `shadcn add @convertfast/...` as primary path.

## 7. Compatibility Items to Prioritize

1. Asset dependency:
   - `hero-section` and `cta` use `/_convertfast/gradient-bg-0.svg`.
   - Files:
     - `/Users/observedobserver/Documents/GitHub/convertfast-ui/packages/segments/src/segments/hero-section.tsx`
     - `/Users/observedobserver/Documents/GitHub/convertfast-ui/packages/segments/src/segments/cta.tsx`
   - Recommendation: replace with pure CSS gradient or include assets in block files so users do not need to run `init` first.
2. Path conventions:
   - Sections use `@/components/ui/*` and `@/lib/utils`; keep alignment with shadcn defaults.
3. Variant strategy:
   - Keep `editorial` as separate items instead of runtime options in one item for easier search/install.

## 8. Risks and Mitigations

1. Risk: schema changes break validation.
   - Mitigation: enforce schema checks in CI and sync regularly with shadcn docs.
2. Risk: behavior changes for legacy CLI users.
   - Mitigation: keep compatible commands first, then deprecate with warnings.
3. Risk: block content and dependency mismatch.
   - Mitigation: generate dependency lists from source imports instead of manual mapping.

## 9. Milestones

1. M1 (1 week): Registry MVP + 3 smoke test blocks (hero/feature/pricing).
2. M2 (1 week): Expand to all 14 blocks + registry-driven CLI `add`.
3. M3 (0.5 week): Docs switch + shadcn directory PR.
4. M4 (0.5 week): Cleanup and legacy path sunset.

## 10. Recommended Execution Order

Minimal closed-loop path:

1. Build `packages/registry` + `blocks.json`.
2. Migrate and validate `hero-section` + `hero-section-editorial` first.
3. Batch migrate remaining blocks after validation passes.

This order minimizes rework and validates real shadcn ecosystem installation early.
