# Architecture Decision Records — Orbit API

This directory records the key architectural and technical decisions made during the development of Orbit, a multi-vendor e-commerce order management API. Each entry follows a standard ADR (Architecture Decision Record) format: Context, Decision, and Consequences.

## Index

| ADR                                                         | Title                                                                    |
| ----------------------------------------------------------- | ------------------------------------------------------------------------ |
| [0001](./0001-use-nestjs-over-express.md)                   | Framework — NestJS over Express / Fastify                                |
| [0002](./0002-use-prisma-over-typeorm.md)                   | ORM — Prisma over TypeORM                                                |
| [0003](./0003-postgresql-and-redis.md)                      | Database & Caching — PostgreSQL + Redis                                  |
| [0004](./0004-nodenext-module-resolution.md)                | Module System — `nodenext` resolution, fixed via Prisma generator config |
| [0005](./0005-prisma-driver-adapter.md)                     | Prisma Client — Explicit Driver Adapter (`@prisma/adapter-pg`)           |
| [0006](./0006-containerized-infra-native-app-dev.md)        | Local Development — Containerized Infrastructure, Native Application     |
| [0007](./0007-ci-cd-security-tooling.md)                    | CI/CD & Supply Chain Security Tooling                                    |
| [0008](./0008-secrets-management.md)                        | Secrets Management                                                       |
| [0009](./0009-explicit-types-array-for-ambient-packages.md) | Explicit `types` Array for Ambient-Global Type Packages                  |
