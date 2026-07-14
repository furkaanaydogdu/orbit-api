# ADR-009: Explicit `compilerOptions.types` Array for Ambient-Global Type Packages

**Status:** Accepted

**Context**
Running `tsc --noEmit` failed with `TS2593: Cannot find name 'describe'` (and `it`, `beforeEach`, `afterEach`, `expect`) across all spec files, despite `@types/jest` being correctly installed and version-matched with `jest`. ESLint's typed-linting rules (`@typescript-eslint/no-unsafe-call`, `no-unsafe-member-access`) surfaced the same underlying problem indirectly, since they rely on the same TypeScript program via `projectService`.

With no explicit `compilerOptions.types` array set, TypeScript defaults to auto-scanning every package under `node_modules/@types` (`typeRoots` default) and merging their ambient global declarations into scope — this is how `@types/node`'s globals (`process`, `Buffer`, `__dirname`) have always worked in this project without any `import` statement. `@types/jest` relies on the same ambient-merge mechanism to expose `describe`/`it`/`expect` globally.

Under `"moduleResolution": "nodenext"`, this auto-scan applies stricter, spec-accurate Node.js resolution rules when resolving each `@types/*` package's own entry point. `@types/jest`'s `package.json` shape does not resolve cleanly under these stricter rules, causing the auto-scan to silently skip it — the package is present and correctly installed, but never enters the global type scope. This is the same category of failure as ADR-004's Prisma module-format issue: `nodenext` demands packages describe themselves precisely, and silently excludes ones that don't match, rather than raising a dependency-level error.

Critically, this only affects **ambient-global** packages (those that inject identifiers into global scope with no `import`, e.g. `@types/jest`, `@types/node`). Import-resolved packages (Express types, Prisma's generated client, class-validator, etc.) are unaffected regardless of this setting, since they resolve through ordinary module resolution, not the ambient-scan mechanism.

**Decision**
Added an explicit `compilerOptions.types` array to `tsconfig.json`:

```jsonc
"types": ["node", "jest"]
```

This bypasses the unreliable auto-scan and tells TypeScript to load exactly these packages' ambient declarations directly and unambiguously. `@types/node` must be listed alongside `@types/jest` — setting `types` explicitly does not add to the auto-scan, it **replaces it entirely**, so every ambient-global package the project actually relies on (not just the one that broke) must be listed, or it silently stops being available.

**Consequences**

- Resolves the `TS2593`/`no-unsafe-call` errors at the source (TypeScript's program), which also resolves the equivalent ESLint typed-linting errors, since both share the same underlying TS program.
- Any _future_ ambient-global-only package added to the project (e.g. a different assertion library, or a browser-global shim) must be added to this `types` array manually — the wildcard auto-scan is now off. Import-resolved packages require no such action and are unaffected.
- Consistent with the precedent set in ADR-004: rather than reverting `nodenext` to a looser resolution mode, the specific package-level friction point is fixed directly and explicitly, preserving alignment with NestJS's current default module configuration.
