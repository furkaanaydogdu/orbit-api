# ADR-003: Database & Caching — PostgreSQL + Redis

**Status:** Accepted

**Context**
The domain (orders, inventory, multi-vendor relationships) is inherently relational, and the project also requires background job processing (order confirmation emails, stock alerts).

**Decision**
PostgreSQL as the primary relational store; Redis paired with BullMQ for background job queues.

**Consequences**
- Postgres's relational integrity and transaction support suit inventory/order consistency requirements.
- Redis/BullMQ introduces an additional moving part in local development and deployment, managed via Docker Compose.
