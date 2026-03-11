# ADR-002: Use PostgreSQL With Explicit Version Snapshots

## Status

Accepted

## Context

The product requires auditability, reviewer control, and rollback without losing
history.

## Decision

Use PostgreSQL as the source of truth and keep live aggregate tables plus
aggregate-specific version snapshot tables.

## Consequences

- Reads stay simple from live tables
- Rollback can create a new live state from a past snapshot
- Audit and version history stay queryable without rebuilding state from events
