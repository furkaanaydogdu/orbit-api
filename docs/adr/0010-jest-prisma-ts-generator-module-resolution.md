# ADR-010: Jest Module Resolution — Prisma 7 TS-Output Generator vs. `ts-jest`

**Status:** Accepted

**Context**
Prisma 7's default generator (`provider = "prisma-client"`) emits its client as TypeScript source (`.ts` files) rather than pre-compiled JavaScript. Internally, the generated files import each other using `nodenext`-style relative specifiers that end in `.js` (e.g. `./internal/class.js`), even though only the corresponding `.ts` file exists on disk. This is valid under TypeScript's `nodenext` module resolution, where a `.js` specifier is understood to resolve to a sibling `.ts` file at compile time.

The application itself runs fine under this scheme, since `nest start` (via `ts-node`/`tsc`) implements this `nodenext` extension-rewriting correctly. However, `ts-jest` resolves modules through Jest's runtime `require()` mechanism, which does not perform this rewrite. Any test that imports the generated Prisma client (directly, or transitively through `PrismaService`) fails at runtime with:

```
Cannot find module './internal/class.js' from '../generated/prisma/client.ts'
```

This was not caught by an initial local `npm test` run because the local `generated/prisma` output was stale relative to the currently installed Prisma version. It surfaced only in CI, where `npm ci` triggers a fresh `prisma generate`, and was reproduced locally only after manually regenerating the client. It is a deterministic consequence of the Prisma 7 TS-generator output paired with `ts-jest`, not an environment-specific or flaky failure.

**Decision**
Added a `moduleNameMapper` entry to the Jest configuration in `package.json` that strips a trailing `.js` from relative import specifiers, allowing Jest to resolve them to their actual `.ts` files:

```json
"moduleNameMapper": {
  "^(\\.{1,2}/.*)\\.js$": "$1"
}
```

**Consequences**

- Test runs now correctly resolve Prisma's generated internal modules under `ts-jest`, matching the resolution behavior already present in the native `nest start` runtime path.
- The mapping is scoped to relative specifiers only (`./` or `../`), so it does not affect bare package imports.
- This is a targeted fix for a Jest/`ts-jest`-specific runtime gap, not a change to the project's module resolution strategy (`nodenext`) established in ADR-004 — consistent with this project's general preference for fixing issues at their source rather than working around them elsewhere.
- Any future regeneration of the Prisma client (after a schema change or a Prisma version bump) should be followed by a local `npm test` run before pushing, since a stale `generated/prisma` directory can mask this class of issue until CI performs a fresh generate.
