# ADR-002: ORM — Prisma over TypeORM

**Status:** Accepted

**Context**
The project needed an ORM to manage a relational schema (users, products, orders, inventory) with moderate relational complexity. Candidates considered: Prisma and TypeORM (NestJS's officially-supported ORM package).

**Decision**
Chose Prisma for its stronger compile-time type safety, cleaner auto-generated migrations, and more approachable schema definition syntax. TypeORM's tighter official NestJS integration was outweighed by Prisma's lower day-to-day friction for a solo-maintained, incrementally-built project.

**Consequences**
- Strong type safety on every database query reduces a class of runtime bugs.
- Migrations are simpler to author and reason about during active schema iteration.
- Introduced additional setup complexity under Prisma 7 (see ADR-0005), which TypeORM would not have required.
