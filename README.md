# Academy Recommendation Platform

Structured academy recommendation platform for Korean parents, academy operators,
and platform administrators.

## Service Identity

- Anonymous recommendation experience for parents
- Operations backoffice for academy staff
- Review, audit, and rollback console for platform admins

## Core Value

- Parents: find the right academy quickly with schedule-aware recommendations
- Academies: get discovered through accurate, reviewable data
- Operators: control data quality and recover safely when changes go wrong

## Product Direction

- The product is a structured matching engine, not a pure RAG app
- LLMs are used only for requirement parsing and explanation generation
- Deterministic backend logic decides ranking, schedule fit, seat status,
  minimum open threshold, freshness, and review state

## MVP Decisions

- Start with one launch city and keep expansion-ready region modeling
- Seed academy candidates from Kakao Local, then move to academy claim +
  admin review
- Collect parent location as map pin + radius
- Return only Top 3 results publicly
- Recommendation is anonymous, but messaging requires a logged-in member
- Counseling channel is platform messaging only
- Minimum open threshold mismatch becomes `waitlist_only`, not silent exclusion
- Initial operator team assumption: 3 admins
- Year 1 planning target: about 1,000 academies

## Tech Stack

### Frontend / BFF

- Next.js App Router
- TypeScript
- Tailwind CSS

### Backend

- Clean Architecture
- PostgreSQL
- Drizzle ORM

### Infrastructure

- Vercel
- Kakao Local API
- Toss Payments

## Homepage

- Live test app: [private-academy-searching-program.vercel.app](https://private-academy-searching-program.vercel.app/)
- Test repository: [Private-Academy-searching-program](https://github.com/SeungMin-Park-psm1757/Private-Academy-searching-program)

## Documentation Map

- [Product Overview](./docs/sdd/00-product-overview.md)
- [Personas and JTBD](./docs/sdd/01-personas-and-jtbd.md)
- [User Flows](./docs/sdd/02-user-flows.md)
- [Domain Model](./docs/sdd/03-domain-model.md)
- [Recommendation Engine](./docs/sdd/04-recommendation-engine.md)
- [Security](./docs/sdd/05-security.md)
- [Payments](./docs/sdd/06-payments.md)
- [Deployment](./docs/sdd/07-deployment.md)

## Architecture

`presentation -> application -> domain`

Infrastructure stays outside the core and is reached only through ports and
adapters.

## Local Run

```bash
npm install
npm run dev
```

Open these routes locally:

- `/`
- `/recommend`
- `/academy`
- `/admin`

Useful demo APIs:

- `GET /api/academy/branches`
- `GET /api/admin/audits`
- `GET /api/admin/claims`
- `POST /api/public/recommendations`
- `GET /api/public/recommendations/[sessionId]`

## Database Prep

- SQL source: [`db/schema.sql`](./db/schema.sql)
- Drizzle source: [`src/shared/db/schema.ts`](./src/shared/db/schema.ts)
- Example env: [`.env.example`](./.env.example)

## Auth Scaffold

- Current mode: provider-agnostic mock session scaffold
- Role types: [`src/modules/identity/domain/role.ts`](./src/modules/identity/domain/role.ts)
- Guard helpers: [`src/modules/identity/presentation/guards/role-guard.ts`](./src/modules/identity/presentation/guards/role-guard.ts)
- Remaining product decision: choose the real auth provider and session strategy
