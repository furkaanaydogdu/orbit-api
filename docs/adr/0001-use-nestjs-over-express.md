# ADR-001: Framework — NestJS over Express / Fastify

**Status:** Accepted

**Context**
The API needed a backend framework capable of supporting a moderately complex domain (multi-vendor orders, inventory, payments) with room to grow. Prior experience included IBM LoopBack, which uses a structured, decorator-based, dependency-injection-driven architecture.

**Decision**
Chose NestJS as the primary framework. It offers the same architectural philosophy as LoopBack (DI, decorators, modular structure), while having a significantly larger ecosystem, more active maintenance, and stronger alignment with current enterprise Node.js conventions.

**Consequences**
- Enforced module/controller/service/provider structure improves long-term maintainability, especially valuable given the project will be reviewed by external parties (clients, collaborators).
- Slightly more setup overhead than a minimal Express app, which is acceptable given the project's scope.
- NestJS can run on either an Express or Fastify adapter under the hood, preserving flexibility if raw throughput ever becomes a real constraint.
