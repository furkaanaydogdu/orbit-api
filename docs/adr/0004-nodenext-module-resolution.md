# ADR-004: Module System — Kept ESM-aware `nodenext` resolution; fixed Prisma output format explicitly

**Status:** Accepted

**Context**
NestJS's current CLI scaffolds new projects with `"module": "nodenext"` and `"moduleResolution": "nodenext"` by default, reflecting the broader Node.js ecosystem's gradual shift toward ESM. Initially, Prisma's generated client output did not correctly declare its own module format in a way `nodenext` resolution could interpret, producing runtime `ReferenceError: exports is not defined in ES module scope` failures. A temporary revert to `"module": "commonjs"` / `"moduleResolution": "node10"` was evaluated as a workaround, but introduced its own friction (TypeScript's `node10` deprecation warnings, and version-specific `ignoreDeprecations` value requirements).

**Decision**
Kept NestJS's default `"module": "nodenext"` / `"moduleResolution": "nodenext"` configuration rather than reverting to the legacy resolver. The actual root cause — Prisma's generated client not declaring itself as CommonJS — was fixed directly at the source, by adding `moduleFormat = "cjs"` to the Prisma `generator client` block in `schema.prisma`, forcing Prisma to emit correctly self-declared CommonJS output that `nodenext` resolution can interpret without ambiguity.

TypeScript itself is pinned to the latest stable **6.x** release (not 7.0+), after an attempted upgrade to TypeScript 7.0.2 broke NestJS CLI's build process — TypeScript 7 is a native Go-based compiler rewrite with a different internal API surface, and NestJS CLI's compiler integration does not yet support it.

**Consequences**
- Stays aligned with NestJS's current official scaffold and documentation, avoiding future drift from `nest generate` defaults.
- The fix is isolated to Prisma's own generator configuration, rather than a project-wide resolution strategy change — a more targeted fix for what was, in effect, a Prisma tooling gap rather than a NestJS or TypeScript misconfiguration.
- TypeScript is intentionally held below 7.0 until NestJS CLI's tooling adds compatibility with the native compiler rewrite; this should be revisited periodically rather than upgraded reflexively.
