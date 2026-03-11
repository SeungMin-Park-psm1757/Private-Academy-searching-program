# ADR-003: Separate LLM Parsing From Deterministic Ranking

## Status

Accepted

## Context

Recommendation quality depends on explainability and predictable behavior under
product rules such as schedule fit, publication state, and seat status.

## Decision

Use LLMs only for requirement parsing and explanation support. Keep candidate
filtering, ranking, schedule checks, and seat-status decisions deterministic in
backend code.

## Consequences

- Ranking is easier to test and debug
- Recommendation behavior is easier to explain to parents and operators
- LLM regressions cannot silently change business-critical outcomes
