# Payments

## Positioning

Billing is not an MVP-facing feature, but the domain must exist early so later
launch does not force a redesign.

## Domain Separation

- `billing_products`
- `billing_plans`
- `payment_orders`
- `payment_transactions`
- `subscriptions`

## Product Model

- Product: commercial offering such as academy subscription
- Plan: priced option such as Basic or Pro
- Order: one purchase attempt
- Payment Transaction: provider-specific payment event
- Subscription: recurring agreement linked to an academy organization

## MVP Rule

- Billing UI stays behind a feature flag
- Billing schema and ports can be scaffolded now
- Only providers and webhooks should be prepared in infrastructure

## Toss Integration Policy

- Keep secret keys server-side only
- Trust provider webhook results, not client-only success callbacks
- Process webhooks idempotently
- Separate one-time payment flows from subscription flows
