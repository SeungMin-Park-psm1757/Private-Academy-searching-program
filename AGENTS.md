# AGENTS.md

## Development Rules

1. Follow Clean Architecture
2. Do not access database directly from route handlers
3. All write operations must generate audit events
4. All write operations on versioned aggregates must create a version snapshot
5. Rollback must create a new version instead of overwriting a past row
6. Recommendation engine must separate
   - LLM parsing
   - deterministic ranking
   - explanation formatting
7. LLM integrations must never write directly to the database
8. Public recommendation inputs must pass rate limiting and schema validation
9. Parent recommendations are anonymous sessions; messaging requires login
10. Billing domain must stay feature-flagged until commercial launch

## Architecture Guardrails

- `presentation` may call only `application`
- `application` may orchestrate `domain` and ports
- `domain` must not depend on frameworks
- `infrastructure` implements ports and external integrations
- Route handlers may validate input, apply guards, call use cases, and map
  responses only

## Modules

platform
identity
academy
recommendation
scheduling
messaging
audit
billing

## Security Rules

- public routes must have rate limit
- public inputs must use strict schema validation
- admin actions require role guard
- high-risk admin actions require re-auth or MFA
- payment secrets never exposed to client
- webhook handlers must be idempotent
- rollback, pricing, and role changes must be audited
