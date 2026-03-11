# ADR-001: Use Next.js App Router on Vercel

## Status

Accepted

## Context

The platform needs one codebase that can serve public recommendation flows,
academy backoffice, admin console, and BFF-style APIs.

## Decision

Use Next.js App Router for presentation and BFF endpoints, and deploy the app on
Vercel.

## Consequences

- Public pages, admin pages, and route handlers stay in one deployment unit
- Preview environments fit the review-heavy product workflow
- Domain logic must remain outside `src/app` to avoid framework leakage
