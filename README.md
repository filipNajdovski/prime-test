# Prime Casino Lobby

Full-stack casino game lobby built with Next.js App Router, Prisma, and PostgreSQL. Users can browse games, search/filter/sort, favorite games, and start sessions. Auth is JWT-based with credentials.

## Tech Stack

- Next.js (App Router) + React + TypeScript
- Tailwind CSS
- PostgreSQL
- Prisma ORM
- JWT auth (jsonwebtoken) + bcrypt password hashing

## Features

- Game lobby with search, filters, sort, and pagination
- Game sessions (Play starts a session, End closes it)
- Favorites (persisted in DB)
- JWT login/register with protected endpoints
- Local game thumbnails from `public/images/games/**`
- Recently played games section (bonus)
- Dark mode toggle (bonus)

## Project Structure

- `app/` - App Router pages, components, and API routes
- `app/api/` - Route Handlers (REST API)
- `prisma/` - Prisma schema, migrations, and seed script
- `public/images/games/` - Local game thumbnails
- `src/lib/` - Shared server utilities (db, auth, types)

## Setup

1. Install dependencies
	 ```bash
	 npm install
	 ```

2. Configure environment variables
	 ```bash
	 cp .env.example .env
	 ```
	 Update values as needed.

3. Run migrations
	 ```bash
	 npx prisma migrate dev
	 ```

4. Seed the database
	 ```bash
	 npm run seed
	 ```

5. Start the dev server
	 ```bash
	 npm run dev
	 ```

Open http://localhost:3000

## Environment Variables

See `.env.example` for the full list.

- `DATABASE_URL` - Pooled Postgres connection string (runtime)
- `DIRECT_URL` - Direct Postgres connection string (migrations)
- `JWT_SECRET` - Secret used to sign JWTs
- `NEXT_PUBLIC_API_URL` - Base URL for API calls (local dev: http://localhost:3000)

## Scripts

- `npm run dev` - Start dev server
- `npm run build` - Build for production (includes `prisma generate`)
- `npm run start` - Start production server
- `npm run lint` - Lint
- `npm run seed` - Seed database

## API Endpoints

All endpoints return JSON and proper HTTP status codes.

### Auth

- `POST /api/auth/register`
	- Body: `{ email, username, password, name? }`
	- Returns: `{ user, token }`
- `POST /api/auth/login`
	- Body: `{ email, password }`
	- Returns: `{ user, token }`

### Games

- `GET /api/games`
	- Query params: `search`, `category`, `provider`, `sort`, `page`, `limit`
	- Sort: `popularity` (default), `name`, `newest`
	- Response:
		```json
		{
			"data": [],
			"pagination": {
				"page": 1,
				"limit": 12,
				"total": 0,
				"totalPages": 0
			}
		}
		```
- `GET /api/games/:id` - Get game details
- `POST /api/games/:id/play` - Start a game session (auth required)
- `POST /api/games/:id/end` - End the latest open session (auth required)
- `GET /api/games/recent` - Recently played games (auth required)

### Favorites (Auth Required)

- `GET /api/favorites` - Get current user favorites
- `POST /api/favorites/:gameId` - Add favorite
- `DELETE /api/favorites/:gameId` - Remove favorite

## Auth Notes

- Passwords are hashed with bcrypt
- JWTs are created on login/register and must be sent as `Authorization: Bearer <token>`

## Seed Data

The seed script inserts:

- 20 games across Slots, Live, Table, Jackpot
- 5 providers
- 3 users with sample favorites and sessions

## Deployment (Vercel)

1. Push the repo to GitHub
2. Create a new Vercel project
3. Add a Postgres database (Vercel Postgres / Neon)
4. Set env vars in Vercel dashboard
	- `DATABASE_URL` = pooled connection string
	- `DIRECT_URL` = direct connection string
	- `JWT_SECRET` = strong random string
5. Run migrations locally against the direct URL
	```bash
	$env:DATABASE_URL=$env:DIRECT_URL
	npx prisma migrate deploy
	npm run seed
	```
6. Deploy

## Design Decisions

- App Router + Route Handlers for a clean full-stack structure
- Prisma for schema clarity and easy migrations
- JWT auth for simplicity and compatibility with Next.js Route Handlers

## Libraries Used

- `bcryptjs` for password hashing
- `jsonwebtoken` for JWT creation/verification
- `@prisma/adapter-pg` for Prisma + Postgres adapter usage

## Limitations

- Reviews are not implemented in this submission.

## Development Notes

See `NOTES.md` for time spent, challenges, and future improvements.
