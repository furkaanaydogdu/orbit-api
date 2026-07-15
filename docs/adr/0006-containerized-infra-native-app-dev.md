# ADR-006: Local Development — Containerized Infrastructure, Native Application

**Status:** Accepted

**Context**
The application depends on PostgreSQL and Redis. A fully containerized `docker compose up` workflow (API included) was evaluated against running the API natively while only containerizing infrastructure.

**Decision**
Postgres and Redis run via Docker Compose during development; the NestJS application itself runs natively (`npm run start:dev`) against those containerized services. The full containerized stack (API included) is reserved for pre-deployment verification and CI, not day-to-day development.

**Consequences**
- Faster hot-reload and simpler debugging during active development, avoiding file-watch performance issues across the Windows/WSL2/Docker boundary.
- Requires maintaining two effectively equivalent but distinct `DATABASE_URL` values — one for host-native access (`localhost`), one for fully containerized access (Docker Compose service name) — resolved via Compose's `environment:` override taking precedence over `.env`-sourced values for the containerized `api` service.
- `docker compose up -d --wait` (leveraging service healthchecks) is used in place of custom polling scripts, keeping developer tooling shell-agnostic for anyone forking the repository.
