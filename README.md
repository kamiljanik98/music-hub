# MusicHub

A SoundCloud-style web app for publishing and streaming music. Artists upload
tracks (optionally with separate stems), each track gets a rendered waveform,
and listeners discover music through search or by following artists — liking,
adding to playlists, and playing through a single, always-visible player bar.
Auth via email/password or Discord.

Implemented: auth, upload, streaming player, search, social (follow/like),
playlists, feed, and listening history.

## Tech Stack

- **Next.js 16** (App Router, Turbopack) + **React 19**
- **Supabase** — Postgres, Auth, RLS
- **Cloudflare R2** — file storage (S3-compatible, zero egress)
- **Zustand** — client state · **react-hook-form + Zod** — forms
- **wavesurfer.js** — waveforms
- **shadcn/ui + Tailwind CSS v4** · **Vitest**

Rows live in Supabase, files in R2. Mutations are Server Actions, bar a few
deliberate Route Handler exceptions.

## Contributing

Read [`docs/reference/CONVENTIONS.md`](./docs/reference/CONVENTIONS.md) before
writing code; the rest of [`docs/reference/`](./docs/reference) and
[`docs/adr/`](./docs/adr) cover architecture and decision history.

- Code carries no explanatory comments — the "why" goes in an ADR.
- Commits follow `type(scope): description`.
- Keep it green: `npm run test:run`, `npm run lint`, `npm run typecheck`.

Setup: `npm install`, `supabase start`, `cp .env.example .env.local`,
`npm run gen-types`, `npm run dev` (sample data: `npm run seed`).

## License

[MIT](./LICENSE).
