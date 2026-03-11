# ADR-005: Prepare Billing Domain and Use Toss Payments Later

## Status

Accepted

## Context

The platform expects future monetization but should not let payment complexity
block MVP delivery.

## Decision

Create the billing domain, schema, and integration ports now, but keep billing
UI feature-flagged until the commercial phase. Use Toss Payments as the payment
provider.

## Consequences

- MVP remains focused
- Domain boundaries are preserved before payment code arrives
- Future one-time payments and subscriptions can evolve independently
