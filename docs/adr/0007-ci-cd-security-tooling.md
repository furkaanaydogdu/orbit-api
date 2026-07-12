# ADR-007: CI/CD & Supply Chain Security Tooling

**Status:** Accepted

**Context**
As a portfolio project intended to demonstrate production-readiness to prospective freelance clients, the project needed a credible, automated quality and security gate rather than relying solely on manual review.

**Decision**
Adopted a layered approach:
- **GitHub Actions** for CI (lint, build, test against an ephemeral Postgres service container, run on every push/PR).
- **Gitleaks** as a dedicated CI job to catch committed secrets, gating the rest of the pipeline.
- **Dependabot**, configured across three ecosystems (`npm`, `docker`, `github-actions`), to track vulnerable/outdated dependencies across the full stack, not just application code.
- **CodeQL** (default setup) for static application security analysis.
- **Branch protection ruleset** on `main`, requiring CI status checks to pass and blocking force-pushes, with pull requests required even for solo development to ensure CI always gates merges.
- Repository visibility set to **public**, which additionally enables GitHub's free secret scanning (unavailable on private repos without a paid Advanced Security license) and supports the project's purpose as a client-facing portfolio artifact.

**Consequences**
- Each tool addresses a distinct threat surface (leaked secrets, vulnerable dependencies, insecure code patterns) rather than relying on a single catch-all check.
- Known, low-risk transitive-dependency vulnerabilities (e.g., a pinned `@hono/node-server` version via Prisma's internal `@prisma/dev` package) are addressed via `npm overrides` where no direct fix is yet available upstream, with a note to revisit once the upstream dependency corrects its own pin.
- CI currently covers build/test/security scanning only; a deployment (CD) stage is intentionally deferred until the application reaches a deployable milestone.
