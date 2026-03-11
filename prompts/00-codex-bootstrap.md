Build a production-oriented Next.js TypeScript web app on Vercel.

Business context

- Public anonymous parent-facing academy recommendation app
- Logged-in academy backoffice for branch, program, and schedule management
- Logged-in platform admin console for review, audit, approval, and rollback
- Single-city MVP with expansion-ready region modeling

Non-negotiable constraints

1. Use feature-first clean architecture modules.
2. Do not access the database directly from route handlers.
3. Every write use case must create an immutable audit event.
4. Versioned aggregates must create a new snapshot on every change.
5. Rollback must restore a past version by creating a new version.
6. Recommendation engine must separate:
   - LLM requirement parsing
   - deterministic filtering, ranking, and scheduling checks
   - explanation generation
7. Public users are anonymous sessions only.
8. Platform messaging requires login.
9. Billing domain must be prepared but billing UI must stay behind feature flags.
10. Public inputs must use rate limiting and schema validation.

Modules

- platform
- identity
- academy
- scheduling
- recommendation
- messaging
- audit
- billing

First tasks

1. Create the project scaffold and documentation structure.
2. Add CI, lint, test, env, and formatting setup.
3. Implement identity and RBAC foundations.
4. Implement academy, class, and scheduling domains.
5. Implement audit events and version snapshot strategy.
6. Implement the recommendation parsing, ranking, and result persistence flow.
7. Prepare billing schema and ports behind feature flags.
