# MusicHub

A SoundCloud-style web app for publishing and streaming music. Artists upload
tracks (optionally with separate stems), each track gets a rendered waveform,
and listeners discover music through search or by following artists — liking,
adding to playlists, and playing everything through a single, always-visible
player bar. Sign in with email/password or Discord.

> **Status:** work in progress (`v0.1.0`). Core flows — auth, upload, player,
> search, social (follow/like), playlists, feed, and listening history — are
> implemented.

---

## Features

- **Upload** audio (MP3/WAV) with cover art, genre, BPM, scale, tags, and
  optional per-stem files (categorized by an enum).
- **Streaming player** — one real `<audio>` element app-wide, compact and
  expanded views, seekbar, volume (persisted), and a three-mode repeat.
- **Waveforms** rendered with `wavesurfer.js`, lazy-mounted so a list of 50
  tracks doesn't fetch 50 audio files at once; click-to-seek.
- **Search** with debounced suggestions sourced from existing track titles.
- **Social** — follow/unfollow artists, like/unlike tracks (optimistic UI),
  suggested users, followers/following lists.
- **Playlists** — create, add/remove tracks, public/private, owner controls.
- **Feed** of tracks from followed artists, with a cards/rows density toggle.
- **Profiles** — public pages with tabs for tracks, likes, followers,
  following, playlists, and owner-only history and settings.
- **Listening history** per user.
- **Auth** — email/password (PKCE email confirmation), password reset, and
  Discord OAuth via popup.

---

## Tech Stack

| Layer            | Choice                                                     |
| ---------------- | --------------------------------------------------------- |
| Framework        | Next.js 16 (App Router, Turbopack), React 19              |
| Database / Auth  | Supabase (Postgres + RLS + GoTrue)                        |
| File storage     | Cloudflare R2 (S3-compatible, zero egress fees)           |
| Client state     | Zustand (no React Context for global state)               |
| Forms            | react-hook-form + Zod                                     |
| Waveforms        | wavesurfer.js                                             |
| UI               | shadcn/ui + Tailwind CSS v4                               |
| Testing          | Vitest + Testing Library                                  |
| Hosting / Cron   | Vercel (Vercel Cron for orphaned-file cleanup)            |

---

## Architecture

### Storage split: Supabase vs R2

Supabase holds only database rows (`profiles`, `songs`, `stems`, `follows`,
`likes`, `plays`, `playlists`, `playlist_songs`) plus auth. **Every file lives
in Cloudflare R2**, never in Supabase Storage — chosen for zero egress cost
(ADR-001).

| Bucket                        | Access  | Access method                               |
| ----------------------------- | ------- | ------------------------------------------- |
| `songs`, `stems`              | Private | Presigned URL (1h), server-side only        |
| `covers`, `avatars`, `banners`| Public  | `NEXT_PUBLIC_R2_*_URL` + path stored in DB   |

R2 and Supabase share no transaction, so write order is deliberate (ADR-002):

- **Upload:** write to R2 first → insert the DB row. On DB failure, roll back
  the R2 writes.
- **Delete:** read paths from the DB row → delete from R2 → delete the row
  last (the row is the only record of which R2 paths need cleaning up).
- A scheduled Vercel Cron job (`app/api/cron/cleanup/route.ts`) reconciles any
  orphaned files that survive a failed rollback.

### Server Actions, with four Route Handler exceptions

Every mutation is a Server Action except four Route Handlers, each justified by
something **outside** the app needing to reach an HTTP address:

1. `app/api/upload/route.ts` — file bodies up to 200MB.
2. `app/api/cron/cleanup/route.ts` — Vercel Cron needs a callable URL
   (guarded by `Authorization: Bearer $CRON_SECRET`).
3. `app/auth/callback/route.ts` — Discord OAuth redirects back with `?code=`.
4. `app/auth/confirm/route.ts` — email links (confirm, reset, email change).

### Auth gating — two mechanisms

- **Hard redirect:** `src/proxy.ts` (Next 16's renamed middleware) guards the
  routes with no public variant (`/upload`, `/auth/update-password`).
- **Soft gate:** Feed and Library are Server Components that check
  `supabase.auth.getUser()` and render `<AuthGate>` instead of content when
  signed out — no redirect.
- **Everything else is public:** gated actions (like, follow, upload) open a
  sign-in modal via `useAuthModal().open()` instead of redirecting.

All global client state (player, auth modal, current user) is Zustand, never
React Context (ADR-004).

---

## Project Structure

```
src/
  actions/        Server Actions, grouped by domain (one file per function)
    songs/ stems/ profile/ social/ playlists/ auth/
  app/            App Router pages + route handlers
  components/     UI, grouped by feature (player/, upload/, songs/, ...)
  hooks/          Client hooks, mirroring the actions domains + player/ search/ upload/
  lib/            r2/, supabase/, validations/, constants, formatters
  types/          database.types.ts (generated) + shared types
supabase/         Migrations, config
seed/             Local seed script
docs/             ADRs, architecture/conventions/design references, history
```

See [`PROJECT-MAP.md`](./PROJECT-MAP.md) for a full tour and
[`docs/reference/`](./docs/reference) for architecture, conventions, and the
design system.

---

## Getting Started

### Prerequisites

- Node.js 20+
- [Supabase CLI](https://supabase.com/docs/guides/cli) (local stack)
- A Cloudflare R2 account with buckets for songs, stems, covers, avatars, banners
- (Optional) a Discord OAuth application for social login

### Setup

```bash
# 1. Install dependencies
npm install

# 2. Start the local Supabase stack
supabase start

# 3. Generate TypeScript types from the DB schema
npm run gen-types

# 4. Configure environment variables (see below)
cp .env.example .env.local
# fill in the values

# 5. (Optional) seed local data: 18 profiles + 60 tracks
npm run seed

# 6. Run the dev server
npm run dev
```

The app runs at `http://localhost:3000`; Supabase Studio at
`http://localhost:54323`.

### Environment variables

Copy `.env.example` to `.env.local` and fill in:

```
NEXT_PUBLIC_SITE_URL

NEXT_PUBLIC_SUPABASE_URL
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY
SUPABASE_SERVICE_ROLE_KEY

R2_ACCOUNT_ID
R2_ACCESS_KEY_ID
R2_SECRET_ACCESS_KEY
R2_BUCKET_SONGS
R2_BUCKET_STEMS
R2_BUCKET_COVERS
R2_BUCKET_AVATARS
R2_BUCKET_BANNERS
NEXT_PUBLIC_R2_COVERS_URL
NEXT_PUBLIC_R2_AVATARS_URL
NEXT_PUBLIC_R2_BANNERS_URL

DISCORD_CLIENT_ID
DISCORD_CLIENT_SECRET

CRON_SECRET
```

> **Note:** after any schema change, re-run `npm run gen-types` or the
> generated types silently drift from the database.

---

## Scripts

| Command             | Description                                        |
| ------------------- | -------------------------------------------------- |
| `npm run dev`       | Start the dev server (Turbopack)                   |
| `npm run build`     | Production build                                    |
| `npm start`         | Serve the production build                          |
| `npm test`          | Run Vitest in watch mode                           |
| `npm run test:run`  | Run the test suite once                            |
| `npm run typecheck` | `tsc --noEmit`                                      |
| `npm run lint`      | ESLint                                              |
| `npm run gen-types` | Regenerate DB types from the local Supabase schema |
| `npm run seed`      | Seed the local database and R2                      |

---

## Conventions

A few project-wide rules worth knowing before contributing (full detail in
[`docs/reference/CONVENTIONS.md`](./docs/reference/CONVENTIONS.md)):

- **No explanatory code comments** — reasoning lives in ADRs, the changelog,
  or the reference docs, never inline.
- **One Server Action per file**, grouped by domain folder.
- **Zustand for global state**, Context only for subtree-scoped state.
- **DB types are generated**, never hand-written.
- **Dual ownership checks** — RLS at the database layer plus an explicit
  `supabase.auth.getUser()` check in every mutation.
- **Conventional commits:** `type(scope): description` (e.g.
  `feat(player): add auto-advance on track end`).

Architecture and design decisions are recorded as ADRs in
[`docs/adr/`](./docs/adr).

---

## Testing

Vitest with `environment: "node"` globally and `// @vitest-environment jsdom`
per component file. Run with `npm run test:run`. A husky pre-commit hook runs
`eslint --fix` and related tests on staged files.

---

## License

[MIT](./LICENSE).
