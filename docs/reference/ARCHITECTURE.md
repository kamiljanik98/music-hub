# Architecture

Moved out of `CLAUDE.md` 2026-08-24 to keep the always-loaded
preamble small. Read this before touching storage, auth gating, the player,
or data fetching.

Next.js 16 (App Router, Turbopack) + Supabase (Postgres, Auth, RLS) + Cloudflare R2 (file storage) + Zustand (client state). Server actions live in `src/actions/`, grouped by domain, not flat: `songs/`, `stems/`, `profile/`, `social/` (e.g. `@/actions/songs/get-songs`, `@/actions/social/follow-user`). One file per function even within a domain folder.

### Storage split: Supabase vs R2

Supabase holds `profiles`/`songs`/`stems`/`follows`/`likes` + auth only. All files (audio, stems, covers, avatars) live in Cloudflare R2 (zero egress cost — the reason Supabase Storage was rejected, see ADR-001). `songs`/`stems` buckets are private (1h presigned URLs, server-side only); `covers`/`avatars` are public (`NEXT_PUBLIC_R2_*_URL` + relative path stored in DB).

R2 and Supabase have no shared transaction. The pattern (ADR-002) is: **write to R2 first, then insert/update Supabase; on DB failure, roll back the R2 writes.** Deletes go the other direction — delete R2 first, DB record last — because the DB row is the only record of which R2 paths need cleaning up. A scheduled cron (`app/api/cron/cleanup/route.ts`) reconciles any orphans that survive a failed rollback.

The app has **four Route Handlers**, and every one of them exists because something outside the app must reach an HTTP address: `app/api/upload/route.ts` (200MB bodies), `app/api/cron/cleanup/route.ts` (Vercel Cron needs an HTTP-callable endpoint), `app/auth/callback/route.ts` (Discord OAuth redirects back with `?code=`) and `app/auth/confirm/route.ts` (links clicked from an email client). Every other mutation is a Server Action. Their justification lives in `docs/reference/CONVENTIONS.md` and ADR-002, not in a comment in either file — this codebase carries **no explanatory comments at all**, by standing rule (`docs/reference/CONVENTIONS.md` → "Komentarze"): the reasoning for a change belongs in an ADR, `docs/history/CHANGELOG.md` or here, never inline. Don't add a fifth Route Handler without the same kind of documented, non-convenience justification, and document it in those two places before writing the file.

### Auth gating

Two auth surfaces, not one: `proxy.ts` (Next's renamed `middleware.ts` — this project targets Next 16) redirect-guards the two routes with no public variant, `/upload` and `/auth/update-password` — both `src/proxy.ts`'s `matcher` and `src/lib/supabase/proxy.ts`'s `PROTECTED_PATHS` list exactly these two, and must stay in sync (adding a route to the matcher alone guards nothing). Feed and library are gated a different way: the Server Component itself calls `supabase.auth.getUser()` and renders `<AuthGate>` in place of page content when signed out — no redirect, no matcher entry, sign-in dialog opens automatically. Everything else (search, profile, player) is public; gated actions (like, follow, upload) open a sign-in modal via `useAuthModal().open()` instead of redirecting — see ADR-004/006.

All global client state (player, auth modal, current user) is Zustand, never React Context — see ADR-004 for why. A store only holds what's explicitly pushed into it; e.g. `useUser` stays empty unless `<UserProvider>` is mounted and calls `setUser()`.

### Audio playback: one real source

`components/player/controls.tsx` (`Controls`) owns the only real `<audio>` element in the app. Every other component that shows waveform/play state (`components/songs/card.tsx`) reads `isPlaying`/`progress`/`duration` from the `usePlayer` Zustand store and requests changes (`requestSeek`) rather than creating its own audio element — see ADR-016. A second, independent audio channel for stem preview was designed but is **not implemented** (verify before assuming otherwise; check `docs/TODO.md`'s Leftover → Waveform/Stems section for current status).

`components/songs/card.tsx` is a single component with a `variant: "grid" | "row" | "waveform"` prop (grid/feed cards, search-result rows, profile waveform list) — this replaced an earlier four-separate-file design; see ADR-016 Update for the reasoning both ways. `components/songs/waveform.tsx` is a separate, unrelated component (bare waveform + play button for the `/song/[id]` page header), not a fourth `Card` variant.

### Data fetching — which mechanism to use

Not one rule for everything; `docs/reference/CONVENTIONS.md` has the full table. Summary: client-mounted lists (Discover/Feed cards) go through a hook calling Supabase directly; SSR'd/filterable pages (`/search`) call a Server Action directly from the Server Component instead of extending the hook (ADR-013) — different consumer shape, not a rule violation. Mutations are always Server Actions except the two Route Handler exceptions above.

All three client factories (`lib/supabase/server.ts`, `client.ts`, `proxy.ts`) pass the `<Database>` generic, so query results are typed from `types/database.types.ts` — run `npm run gen-types` after any schema change or the types silently drift from the DB. Two PostgREST behaviours the types now enforce but which are worth knowing directly, because both have already caused live bugs: a **to-one embed comes back as an object, not a single-element array** (`stem.songs.uploaded_by`, never `stem.songs[0]`); and an embed like `profiles!following_id(...)` **resolves only along a declared foreign key to the embedded table** — this is why `follows`' FKs reference `public.profiles` rather than `auth.users` (ADR-017 Update 2026-07-31). Pointing a new social table's FK at `auth.users` will make any profile embed on it fail with `PGRST200`.

### Testing conventions worth knowing before writing a test

- `useEffect`-based fetch hooks (e.g. search suggestions) need the `cancelled`-flag pattern to guard against out-of-order network responses — see ADR-015 and `docs/reference/CONVENTIONS.md`.
- Mock default-exported hooks as `vi.mock("...", () => ({ default: () => ({...}) }))`, not named export.
- `vi.mock()`'s path must exactly match the import path in the component under test — a mismatched path silently loads the real module instead of erroring (symptom: a test that's unexpectedly slow, ~1s+).
- Container tests mock child components, not their hooks.

