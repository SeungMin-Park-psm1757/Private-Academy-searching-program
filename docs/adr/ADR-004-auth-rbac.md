# ADR-004: Anonymous Parent Recommendation With RBAC for Staff and Admins

## Status

Accepted

## Context

Parents need low-friction entry, while staff and admins need controlled access
to operational workflows.

## Decision

Keep recommendation entry anonymous. Require authenticated accounts for academy
staff, admins, and member-only messaging. Enforce server-side RBAC.

## Consequences

- Parent conversion can happen later at the messaging boundary
- Backoffice and admin actions remain role-gated
- Public usage analytics must rely on anonymous sessions, not user accounts
