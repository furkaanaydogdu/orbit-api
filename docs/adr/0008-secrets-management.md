# ADR-008: Secrets Management

**Status:** Accepted

**Context**
`.env` files are convenient for local development but are not a viable mechanism for production deployment, and must never be committed to version control.

**Decision**
- `.env` is git-ignored; `.env.example` is committed with placeholder values and documents all required variables, including the intentional duplication between split Postgres credentials (`POSTGRES_USER`/`PASSWORD`/`DB`, required by the Postgres image itself) and the assembled `DATABASE_URL` (required by Prisma).
- In CI, only the ephemeral, disposable test-database credentials are inlined directly in workflow YAML, since that database exists solely for the duration of a single job run and holds no real data.
- Any future credential tied to a persistent, external system (deployment tokens, production database URLs) will be stored exclusively via GitHub Actions Secrets (`${{ secrets.X }}`) or the hosting platform's environment variable configuration — never hardcoded, never committed.

**Consequences**
- Clear, consistent rule for contributors (including future collaborators or clients) about what belongs in version control versus what must be injected at runtime.
- Deployment platforms (e.g., Railway, Render) are expected to inject environment variables directly via their own dashboard/secrets mechanism, requiring no code changes from local development — the application always reads from `process.env` regardless of source.
