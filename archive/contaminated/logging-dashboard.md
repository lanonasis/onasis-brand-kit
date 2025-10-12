# Shared Logging & Analytics Dashboard

## Centralized Logging

- All apps should log authentication, errors, and major events to the Supabase `control_room` schema.
- Use Supabase SQL dashboards or the Supabase UI to view logs.
- Example query:
  ```sql
  select * from control_room.logs order by created_at desc limit 100;
  ```

## Analytics (Optional)

- Integrate [PostHog](https://posthog.com/) or [Vercel Analytics](https://vercel.com/analytics) for front-end event tracking.
- Add your analytics keys to `.env.local` (see `.env.template`).

## Best Practices

- Never log secrets or PII.
- Use `.env.template` for onboarding, and `.env.local` for actual secrets.
- Document any new log event types in this file.

## Useful Links

- [Supabase Project Logs](https://app.supabase.com/project/YOUR_PROJECT_ID/logs)
- [PostHog Dashboard](https://app.posthog.com/)
- [Vercel Analytics](https://vercel.com/analytics)
