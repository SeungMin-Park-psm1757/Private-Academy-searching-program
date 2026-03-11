# Deployment

## Environment Strategy

- Local
- Preview
- Production

## Hosting Direction

- Next.js app on Vercel
- PostgreSQL on a managed provider with branch or restore support
- Environment variables injected per environment

## Release Flow

1. Develop locally
2. Open branch or PR
3. Verify in Preview deployment
4. Promote to Production
5. Roll back safely if a release or data change fails

## Scheduled Jobs

- Stale academy data flagging
- Recommendation cache cleanup
- Payment retry or renewal processing

## Job Safety

- Use locking where overlap is possible
- All cron handlers must be idempotent
- Separate operational metrics from recommendation quality metrics

## Observability

- Error logs
- Audit logs
- Recommendation quality dashboards
- Queue or job failure alerts
