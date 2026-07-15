# ADR-005: Prisma Client — Explicit Driver Adapter (`@prisma/adapter-pg`)

**Status:** Accepted

**Context**
As of Prisma 7, the query engine no longer bundles database drivers internally. `PrismaClient` requires an explicitly constructed driver adapter to connect to a database.

**Decision**
Installed `@prisma/adapter-pg` (wrapping the standard `pg` package) and passed it explicitly into `PrismaClient`'s constructor within a dedicated `PrismaService`, which also implements NestJS's `OnModuleInit`/`OnModuleDestroy` lifecycle hooks to connect/disconnect explicitly at application boot and shutdown.

**Consequences**
- Slightly more setup than pre-v7 Prisma, but results in a lighter production Docker image (no bundled Rust query-engine binary tied to a specific DB driver).
- Explicit `$connect()` at startup is intended to surface database connectivity failures immediately at boot rather than on first request — though a known Prisma 7 limitation currently means `$connect()` does not reliably throw on an unreachable database when using the `pg` adapter. A DB-querying `/health` endpoint is the planned mitigation (not yet implemented).
- Mid-lifecycle connection loss on in-flight queries is not automatically retried by Prisma; this is accepted as a known gap to be hardened later (retry wrapper, connection pool tuning) rather than solved during initial setup.
