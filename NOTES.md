# NOTES

## Time Spent
- Total: ~16 hours
- Breakdown:
  - Backend/API: ~6+ hours
  - Frontend/UI: ~4 hours
  - Database/Prisma: ~3 hours
  - Debugging/Polish: ~2 hours
  - Documentation: ~1 hour

## Most Challenging
- Connecting Prisma Client with Postgres due to missing dependencies and switching from TypeORM to Prisma.
- Getting local image paths to align with seeded data and public folder structure.
- Keeping auth flows simple while protecting favorites and play actions.
- Balancing UI polish with API completeness under time constraints.

## What I Would Improve With More Time
- Add lightweight tests for API routes and key UI components.
- Expand game detail view with session history and related games.
- Add caching for game list queries and improve performance.
- Improve error boundaries and offline/failure UX.
- Improve error messages and error UX across the app.

## Assumptions
- Local images are stored under `public/images/games/<category>/` and referenced by DB paths.
- JWT auth is sufficient for the scope (no OAuth/social login required).
- Single user session per device; token stored on client for simplicity.
- Seed data is acceptable for review and demo purposes.
