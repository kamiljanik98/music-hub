# MusicHub

A SoundCloud-style web app for publishing and streaming music. Artists upload
tracks (optionally with separate stems), each track gets a rendered waveform,
and listeners discover music through search or by following artists — liking,
adding to playlists, and playing everything through a single, always-visible
player bar. Sign in with email/password or Discord.

Core flows are in place: auth, upload, streaming player, search, social
(follow/like), playlists, feed, and listening history.

## Tech Stack

- **Next.js 16** (App Router, Turbopack) + **React 19**
- **Supabase** — Postgres, Auth (GoTrue), RLS
- **Cloudflare R2** — file storage (S3-compatible, zero egress)
- **Zustand** — client state · **react-hook-form + Zod** — forms
- **wavesurfer.js** — waveforms
- **shadcn/ui + Tailwind CSS v4** · **Vitest** — testing

Database rows live in Supabase; every file (audio, stems, covers, avatars,
banners) lives in R2. Mutations are Server Actions, with a few deliberate Route
Handler exceptions. See [`docs/reference/`](./docs/reference) and
[`docs/adr/`](./docs/adr) for the reasoning behind these choices.

## Contributing

1. Read [`PROJECT-MAP.md`](./PROJECT-MAP.md) for the lay of the land and
   [`docs/reference/CONVENTIONS.md`](./docs/reference/CONVENTIONS.md) before
   writing code.
2. Architectural decisions are recorded as ADRs in [`docs/adr/`](./docs/adr) —
   add one when you make a decision worth remembering. **Code carries no
   explanatory comments**; the "why" belongs in docs.
3. Commits follow `type(scope): description` (e.g.
   `feat(player): add auto-advance on track end`).
4. Keep the suite green: `npm run test:run`, `npm run lint`, `npm run typecheck`.

Local setup: `npm install`, `supabase start`, copy `.env.example` →
`.env.local`, `npm run gen-types`, then `npm run dev`. Optional sample data via
`npm run seed`.

## License

[MIT](./LICENSE).
