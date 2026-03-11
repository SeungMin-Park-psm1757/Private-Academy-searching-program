# Security

## Threat Model Baseline

### Spoofing

- Risk: academy or admin account takeover
- Controls: MFA for high-risk actions, short session TTL, device and IP review

### Tampering

- Risk: price, capacity, or review-state manipulation
- Controls: audit events, version snapshots, reviewer approval for risky fields

### Repudiation

- Risk: user denies making a change
- Controls: immutable audit log with actor, timestamp, and diff metadata

### Information Disclosure

- Risk: parent location or child details leak
- Controls: minimum data collection, masked logs, coarse location storage

### Denial of Service

- Risk: abuse of public recommendation endpoint
- Controls: rate limiting, CAPTCHA or bot checks, input validation, caching

### Elevation of Privilege

- Risk: academy user reaches admin-only functionality
- Controls: strict RBAC, server-side guards, audit review for role changes

## Authentication and Authorization

- Parents may browse and receive recommendations anonymously
- Platform messaging requires member login
- Academy staff and admins require authenticated sessions
- High-risk actions require step-up auth or MFA

## Required Roles

- `parent_member`
- `academy_editor`
- `academy_owner`
- `platform_reviewer`
- `platform_admin`
- `support_readonly`

## Public Endpoint Controls

- Rate limiting
- Schema validation
- Output sanitization
- Prompt-injection defensive parsing

## Operational Controls

- All write flows emit audit events
- All rollback flows create new versions
- High-risk fields may require two-step approval
- Admin activity should be anomaly-monitored
