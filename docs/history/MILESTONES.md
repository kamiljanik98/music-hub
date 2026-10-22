# Milestones

> Historical record — completed work only, v0.1 through v0.8. Everything
> unfinished or uncertain lives in `TODO.md`, which is where active work
> continues. Formerly named `TODO.md` itself, renamed when `TODO-2.md`
> took over that name.

## v0.1 Initial Setup

**Shadcn UI & Styles**
**5.06**

- [x] `npx shadcn@latest init`
- [x] `npx shadcn@latest add button input card`
- [x] Update `global.css`

**Supabase Local**

- [x] `supabase start` - start local instance
- [x] Open Supabase Studio - `http://localhost:54323`
- [x] Paste SQL queries to create `profiles` table with policies
- [x] Paste SQL queries to create `songs` table with policies
- [x] Paste SQL queries to create `stems` table with policies
- [x] `supabase gen types typescript --local > types/database.types.ts` - TS types for type-safe queries

**Supabase Client**

- [x] `npm install @supabase/supabase-js @supabase/ssr`
- [x] Set Supabase environment variables
- [x] `lib/supabase/client.ts` - browser client
- [x] `lib/supabase/server.ts` - server client (SSR)
- [x] `lib/supabase/proxy.ts` - middleware proxy

**Cloudflare R2**

> File storage for audio stems, WAV/MP3 and cover images - zero egress fees

- [x] Create Cloudflare account
- [x] Create R2 bucket `songs` - audio files (MP3, WAV)
- [x] Create R2 bucket `covers` - cover images
- [x] Generate R2 API token with Read & Write permissions for both buckets
- [x] Enable public access (`R2.dev subdomain`) on `covers` bucket
- [x] `npm install @aws-sdk/client-s3 @aws-sdk/s3-request-presigner`
- [x] Set R2 environment variables: `R2_ACCOUNT_ID`, `R2_ACCESS_KEY_ID`, `R2_SECRET_ACCESS_KEY`, `R2_BUCKET_SONGS`, `R2_BUCKET_COVERS`, `NEXT_PUBLIC_R2_COVERS_URL`
- [x] `lib/r2/client.ts` - S3-compatible R2 client with Cloudflare endpoint
- [x] `app/test/page.tsx` - infrastructure check page (delete after verification)
- [x] Verify Supabase and R2 connection at `http://localhost:3000/test`
- [x] Delete `app/test/` after verification
- [x] `docs/ADR-001.md` - Cloudflare R2 over Supabase Storage

**Tests**

- [x] Unit: all required env variables are defined and non-empty
- [x] Integration: Supabase client connects - `songs`, `profiles`, `stems` tables return empty array (not an error)
- [x] Integration: RLS on `songs` - unauthenticated client cannot insert a row
- [x] Integration: RLS on `songs` - unauthenticated client can select rows (public read)
- [x] Integration: RLS on `stems` - unauthenticated client cannot insert a row
- [x] Integration: RLS on `profiles` - unauthenticated client cannot insert a row
- [x] Integration: server Supabase client initializes without errors in a Next.js server context
- [x] Integration: R2 client initializes with correct endpoint - `ListBuckets` returns `songs` and `covers`

---

## v0.2 Auth

**Slice 1 - Sign Up (PKCE)**
**17.06**

- [x] `auth/confirm/route.ts` - PKCE token exchange endpoint, destination hardcoded, not parsed from `redirect_to`, see ADR-005
- [x] Enable email confirmation in `config.toml` for local Supabase
- [x] `hooks/use-register.ts` - handles sign up with email/password via Supabase
- [x] `types/auth.ts` - `EmailPasswordCredentials` type
- [x] `auth/confirm/route.ts` - success/failure redirect behavior, see ADR-005 Update
- [x] `app/(pages)/auth/confirmed/page.tsx` - static Server Component, email-link landing target (ADR-006)
- [x] `npx shadcn@latest add dialog` - modal primitive for auth UI, see ADR-006
- [x] `npx shadcn@latest add sonner` - toast component, app-wide
- [x] `<Toaster />` mounted in root `layout.tsx`
- [x] `hooks/use-auth-modal.ts` - Zustand store: `isOpen`, `view`, `open(view?)`, `close()`, `setView(view)`
- [x] `components/auth/auth-modal.tsx` - `Dialog` switching between `RegisterForm`/`LoginForm`
- [x] `components/auth/register-form.tsx` - registration form, calls `useRegister()`, Event A toast (ADR-006)
- [x] Navbar Sign in / Register triggers
- [x] Update signup confirmation email template in Supabase dashboard, versioned via `config.toml`

**18.06**

- [x] `npm install react-hook-form zod @hookform/resolvers`
- [x] `lib/validations/auth.ts` - `registerSchema`, `loginSchema`
- [x] Refactor `register-form.tsx`/`login-form.tsx` to `react-hook-form` + `zodResolver`
- [x] `components/form/FormInput.tsx` - thin `Controller`-based wrapper on shadcn `Field`/`FieldLabel`/`FieldError`
- [x] Decide: case-insensitive nickname via lowercase-on-write
- [x] `registerSchema` extended with required `nickname` field, see ADR-007
- [x] `register-form.tsx` - `nickname` `FormInput` field
- [x] `use-register.ts` - pre-signup `profiles` uniqueness check on `nickname`, see ADR-007
- [x] `use-register.ts` - `nickname` normalized to lowercase, see ADR-007 Update
- [x] `use-register.ts` - error contract standardized to `Error | null`, see ADR-008
- [x] `register-form.tsx`/`login-form.tsx` - both read `error.message`, ADR-008 contract
- [x] Resolve `RegisterCredentials` vs `RegisterFormValues` duplication
- [x] Integration: user can register, confirm email and sign in
- [x] Integration: PKCE confirmation link resolves correctly without redirect loop
- [x] Integration: Event A toast appears immediately after register submit
- [x] Integration: successful confirmation link lands on `/auth/confirmed`
- [x] Integration: expired/invalid confirmation token redirects silently to `/`
- [x] Unit: `registerSchema` rejects invalid email, rejects password under minimum length
- [x] Unit: `RegisterForm` shows inline field error on invalid input without submitting
- [x] Fix: `vitest.config.ts` missing `plugins: [react(), tsconfigPaths()]`
- [x] Fix: `vitest.setup.ts` created, registers `@testing-library/jest-dom/vitest` matchers
- [x] Fix: `register-form.tsx` - `useForm()` missing `mode: "onBlur"`
- [x] Fix: `register-flow.test.ts` - relative path assertions corrected

**Slice 2 — Sign In**

- [x] `hooks/use-login.ts` — handles sign in with email/password via Supabase
- [x] `components/auth/login-form.tsx` — sign in form, calls `useLogin()`
- [x] Fix: `LoginForm` missing `mode: "onBlur"` in `useForm()`
- [x] Unit: `loginSchema` rejects invalid/missing email, rejects empty/missing password
- [x] Unit: `LoginForm` — full behavior coverage
- [x] Integration: sign in with confirmed credentials, wrong password, unconfirmed account
- [x] Unit: `AuthModal` — full behavior coverage
- [x] Unit: `FormInput` — full behavior coverage

**Slice 3 - Social Auth (Discord)**

- [x] `auth/callback/route.ts` - popup-only, self-closing HTML, see ADR-009
- [x] Discord provider configured
- [x] Add Discord SVG icon to `public/discord.svg`
- [x] `hooks/auth/use-social-login.ts` - popup OAuth, provider-agnostic, see ADR-009
- [x] `hooks/auth/use-discord-login.ts` - UI-glue hook wrapping `useSocialLogin("discord")`
- [x] `components/auth/social-button.tsx` - provider button with SVG icon
- [x] Wire `social-button.tsx` into `RegisterForm`/`LoginForm`
- [x] `handle_new_user()` trigger updated for Discord nickname sourcing, see ADR-007 Update
- [x] `registerSchema` nickname constraints relaxed for Discord username format
- [x] Unit: `useSocialLogin` - full behavior coverage
- [x] Unit: `useDiscordLogin` - full behavior coverage
- [x] Unit: `SocialButton` - full behavior coverage

**Slice 3.5 - Temporary `useUser`**

- [x] `hooks/auth/use-user-temp.ts` - throwaway, replaced in v0.7
- [x] `components/navbar.tsx` - consumed `useUserTemp()` (since migrated, see v0.7)

**Slice 4 - Forgot / Update Password**

- [x] `hooks/use-forgot-password.ts` - sends password reset email, ADR-008 contract
- [x] `forgotPasswordSchema` (email only)
- [x] `components/auth/forgot-password-form.tsx` - modal-based, resolves ADR-006 open question
- [x] `use-auth-modal.ts` - extend `view` union to include `"forgot-password"`
- [x] `auth-modal.tsx` - render `ForgotPasswordForm`
- [x] `login-form.tsx` - "Forgot password?" link
- [x] Verified `resetPasswordForEmail`'s `redirectTo` behavior, hardcoded destination
- [x] Updated Supabase email template for password recovery
- [x] `hooks/use-update-password.ts` - updates password after email link redirect
- [x] `app/(pages)/auth/update-password/page.tsx`
- [x] Integration + Unit test coverage for forgot/update password flow
- [x] Unit: missing form unit tests backfill — `RegisterForm`, `LoginForm`, `ForgotPasswordForm`

**Fixes**

- [x] Fix: `use-register.ts` - `setIsLoading(false)` missing after real `signUp()` call
- [x] Fix: `use-register.ts` - remove leftover `console.log` calls

---

## v0.3 Upload

**R2 — storage + upload helpers**

- [x] `lib/r2/storage.ts` - `getPresignedUrl(path)`
- [x] `lib/r2/upload.ts` - `uploadSong`, `uploadCover`, `uploadStem`, `deleteFromR2`

**Route Handler**

- [x] `app/api/upload/route.ts` - auth, upload order, rollback, MIME/size validation, ADR-002 comment

**Schema + Hook + Form**

- [x] `lib/validations/upload-schema.ts` - `title`, `bpm`, `scale`, `genre`, `tags`, later `description`
- [x] `hooks/use-upload.ts` - fetch wrapper, `isLoading`/`error`
- [x] `components/upload/upload-form.tsx` - full form
- [x] `app/(pages)/upload/page.tsx`
- [x] `app/(pages)/upload/success/[id]/page.tsx`
- [x] `components/ui/copy-button.tsx`
- [x] `npm install react-dropzone`
- [x] `components/upload/form-input-file-audio.tsx`
- [x] `components/upload/form-input-file.types.ts`

**Tests**

- [x] Unit: `uploadSchema` - accepts valid data, rejects missing title, rejects `bpm < 0`

---

## v0.4 Player

**R2**

- [x] `lib/r2/storage.ts` - `getPresignedUrl(path)`
- [x] `lib/r2/public.ts` - `getCoverUrl(path)`

**Server Actions**

- [x] `src/actions/resolve-song-url.ts` - `resolveSongUrl(path)`

**Zustand Store**

- [x] `hooks/use-player.ts` - full player store

**Hooks**

- [x] `hooks/use-on-play.ts`
- [x] `hooks/use-get-songs.ts`
- [x] `hooks/use-get-song-by-id.ts`
- [x] `hooks/use-load-song-url.ts`

**Player Components**

- [x] `components/player/controls.tsx`
- [x] `components/player/player-track-info.tsx`
- [x] `components/player/player-volume.tsx`
- [x] `components/player/player-bar.tsx`

---

## v0.5 Song Management

**R2**

- [x] Delete song flow with R2 rollback
- [x] Orphaned file reconciliation — Vercel Cron job, log-only, ADR-002 Update 2026-07-10
- [x] `CRON_SECRET` + `vercel.json` crons section

**Song Operations**

- [x] `src/actions/delete-song.ts`
- [x] `src/actions/update-song.ts`
- [x] `src/actions/update-song-cover.ts`
- [x] `src/actions/add-stem.ts`
- [x] `src/actions/delete-stem.ts`

**Schema change — `stems` table**

- [x] `stems.name` dropped, replaced with `stems.category` enum, see ADR-012

**Upload Flow Integration (ADR-002 Update 2026-07-22)**

- [x] `upload-schema.ts` - `stems` field added
- [x] `app/api/upload/route.ts` - stem upload + rollback extension
- [x] `components/upload/form/form-input-file-stem.tsx`
- [x] `components/upload/upload-form.tsx` - `useFieldArray` for stem rows
- [x] Fix: R2 API token bucket permissions for `stems`

---

## v0.6 Search

- [x] `src/actions/get-songs.ts` - `getSongs(title?)`, see ADR-013
- [x] `hooks/use-debounce.ts`
- [x] `hooks/use-search-suggestions.ts`
- [x] `components/search/search-input.tsx`
- [x] `app/(pages)/search/page.tsx`
- [x] `components/search/search-content.tsx`

---

## v0.7 Account

**useUser Store**

- [x] `hooks/account/use-user.ts` - Zustand store, per ADR-004
- [x] `components/providers/user-provider.tsx` - single subscription, ADR-004, see CONVENTIONS.md ("Global state" section) for the `init()`/`onAuthStateChange` rationale
- [x] Mount `<UserProvider />` once in root `layout.tsx`
- [x] Migrate `navbar.tsx` to Zustand selector syntax
- [x] Delete old temp hook file

**User Profile Button**

- [x] `npx shadcn@latest add dropdown-menu`
- [x] `components/account/user-profile-button.tsx`
- [x] Replace navbar's inline user block with `<UserProfileButton />`
- [x] `app/(pages)/account/me/page.tsx` - profile page (avatar, nickname, email, password rows) — path settled as `/account/me`, not `/account/settings`

---

## v0.8 Feed

**Fix shared hook**

- [x] `hooks/use-get-songs.ts` - add `profiles!uploaded_by(nickname)` join, fixes `nickname` undefined in cards

## v0.9 Reviews and hardening

Completed items moved out of `TODO.md` on 2026-08-24. Wave letters and `#tag` back-references are preserved as written.
**Auth / Security**
- [x] `service_role`/`authenticated`/`anon` grants for `songs`/`stems`/`profiles`/`follows`/`likes` — no longer ad hoc, bundled into `supabase/migrations/20260731081353_social_schema.sql` 2026-07-31
- [x] `{ error: Error | null }` added to `useGetSongs`, `useGetSongById`
- [x] `stems` category picker — shadcn `Select`
- [x] Stem row errors routed through `FormInput`'s error display convention
- [x] `deleteSong` — wrong bucket path in rollback logging fixed, error wrapping + `revalidatePath` added
- [x] Old per-field account components (`EditableField`, `EditableTextareaField`, `EditAvatarButton`, `update-nickname.ts`, `update-bio.ts`, `update-avatar.ts`) — confirmed deleted
- [x] Navbar typo fixes (`bg-bacground`→`bg-background` etc.), logo wrapped in `Link`, Upload button wired to `router.push` — confirmed applied
**R2 / Cron**
- [x] Cron endpoint tested locally against real orphaned-file data
- [x] Vercel Cron plan limit checked — no action needed
- [x] `DeleteObjectCommand` wired in, cron verified stable (ADR-002 Update 2026-07-24)
- [x] `lib/r2/upload.ts` — `uploadAvatar`, `avatars` bucket added
- [x] `lib/r2/client.ts` — `R2_AVATARS_URL`
- [x] `getCoverUrl`/`getAvatarUrl` — `null`-safe, reference `IMAGE_PLACEHOLDER`
- [x] Placeholder files renamed and confirmed on disk
**ADR-016 (Waveform / Card Architecture)**
- [x] Written, plus Update 2026-07-28 covering the later reversal to one `Card` + `variant` prop and the second stem-audio channel decision
**v0.9 Social — Schema, actions, hooks, components**
- [x] `follows` table (composite PK, `CHECK (follower_id != following_id)`), RLS: insert/delete own row, public read
- [x] `likes` table (composite PK), same RLS shape
- [x] `supabase gen types` regenerated — this entry was stale, the checked-in `database.types.ts` still predated the `likes` table; actually regenerated 2026-07-31
- [x] Server actions shipped: `follow-user`, `unfollow-user`, `like-song`, `unlike-song`, `get-liked-songs` (`src/actions/social/` + `src/actions/songs/`) — `get-followed-artists-songs` and `get-following` were previously marked done here but do not exist in the repo (confirmed 2026-07-29 review); moved to "Up Next" below, not forgotten
- [x] `hooks/social/use-like.ts` / `use-follow.ts` — optimistic toggle
- [x] Follow state for `SuggestedUsers` — no dedicated hook needed, `getIsFollowing()` called directly per-card
- [x] `components/social/like-button.tsx`, `follow-button.tsx` (real, no mock), `share-button.tsx`, `suggested-users.tsx`
- [x] `components/songs/actions.tsx` — `Actions` wrapper (`LikeButton`+`ShareButton`), used inside every `Card` variant
- [x] `FollowButton` wired into `/profile/[nickname]`
- [x] `likes` table + RLS + grant, all Likes actions/hooks shipped
- [x] Own-profile "Tracks" via `getUserSongs(currentUserId)` on `/profile/[nickname]` (`isOwnProfile`), not a separate page
**Public Profile**
- [x] `get-user-songs.ts` — `profiles` join + `isLiked` attachment; moved from `actions/profile/` to `actions/songs/` per the table-ownership convention, confirmed in place 2026-08-03
- [x] `app/(pages)/profile/[nickname]/page.tsx` — public Server Component, nickname→id resolution, `notFound()` on miss
- [x] `components/profile/track-list.tsx` — supersedes the old `profile-song-grid.tsx`; `ProfileSongCard` and `waveform-card.tsx` both deleted (not relocated) as part of Card unification
- [x] `/account/me` removed entirely, merged into `/profile/[nickname]` via server-side `isOwnProfile` check (ADR-004 Update 2026-07-28)
- [x] `EditProfileDialog` — `Tabs` (Profile / Password), `EditPasswordField` moved inside
- [x] `UserProfileButton` — "Account settings" link → `/profile/[nickname]`
- [x] `proxy.ts` matcher — `/upload` and `/auth/update-password` guarded, both `matcher` and `PROTECTED_PATHS` in sync
- [x] `components/social/share-button.tsx` — copies profile URL, toast confirmation
**Waveform / Player**
- [x] `wavesurfer.js` installed, per-card waveform viz shipped (`interact: false`, lazy-mounted, click-to-seek, metadata) — since superseded by Card unification, same behavior now lives in `Card`'s `"waveform"` variant
- [x] `hooks/player/use-player.ts` — `isPlaying`/`progress`/`duration`/`seekTo`/`requestSeek`/`clearSeekRequest`
- [x] `Controls` — publishes state to store, consumes `seekTo`
- [x] R2 `songs` bucket CORS policy fixed
- [x] Fake hash-based `lib/waveform.ts` fallback — confirmed deleted
- [x] `Controls` — lucide icons, `<audio>` element, `isPlaying` synced
- [x] `TrackInfo` — cover fallback, avatar+nickname row
- [x] `Volume` — icon-by-level, click-to-mute
- [x] `Bar` — `bg-card` fix, hides on `/upload`
**Account Profile Redesign**
- [x] `EditProfileDialog` — single RHF modal (nickname/bio/avatar)
- [x] `app/actions/profile/update-profile.ts` — replaces old `update-nickname`/`update-bio`/`update-avatar` (see CHANGELOG)
- [x] `hooks/account/use-update-profile.ts`, `use-change-password.ts` (renamed to `hooks/profile/` 2026-07-30, see Structure/naming above)
- [x] `components/account/edit-password-field.tsx`, `form-input-avatar.tsx`, `components/form/form-textarea.tsx` (these two now live under `components/profile/edit/`)
- [x] shadcn `textarea.tsx`, `dialog.tsx` added
- [x] Own-profile edit view rebuilt around `EditProfileDialog` + `EditPasswordField`
**Search**
- [x] `Row` — compact horizontal result item, replaces list-in-`Card`
- [x] `components/search/content.tsx` wired to `Row`
- [x] `Row` shows artist avatar — `Song.profiles` type extended with `avatar_url`, kept permanently
- [x] `get-songs.ts` — `select` extended to include `avatar_url`
- [x] `components/ui/input.tsx` — `cva` variants (`underline`/`filled`), search icon added
- [x] Stray trailing quote in `input.tsx` — checked, not present
**Songs**
- [x] `Card` — hover play overlay, artist nickname links to profile
- [x] `Grid` — simplified, scroll-arrow tracking removed
- [x] `use-get-song-by-id.ts` — `profiles` join added, stray `.ts` in import path confirmed fixed
- [x] Nested `group`/`group-hover` collision fixed via named groups
**Dev Tooling**
- [x] `seed/seed.ts` — clears R2+DB+auth, seeds 3 profiles + 30 tracks, confirmed working
- [x] `globals.css` dark mode token fix — `:root` holds `DESIGN.md` hex values
- [x] `-hover` token _variables_ added to `:root` (wiring into `@theme inline` still missing, see Leftover)
**Dead code confirmed removed**
- [x] `ProfileSongCard` — confirmed deleted (Card unification)
**Code review pass (2026-07-29 → 2026-07-30)**
- [x] Full doc → files → app review completed by user across 3 stages; 29 structure/naming/feature questions answered in `docs/reviews/2026-07-30-code-review.md`
- [x] Live bug found and fixed: `ShareButton` on songs used `/song/${id}` (singular), real route is `/songs/${id}` (plural) — every song Share click was copying a broken link
**Design token cleanup & Navbar fix (2026-07-29)**
- [x] ADR-017 written — `follows`/`likes` schema + RLS + suggested-users algorithm decisions
- [x] `bg-black`/`text-white` hardcoded colors removed from `EditProfileDialog`/`EditPasswordField`
- [x] Dead `-hover` CSS variables deleted from `:root` (confirmed unused anywhere)
- [x] `--sidebar-primary-foreground` unified with `--primary-foreground` (`#131313`)
- [x] `Navbar` moved outside `layout.tsx`'s `max-w-6xl` wrapper — its `bg-card` background is now actually full-width, matching `Bar`'s pattern
- [x] `Navbar` background corrected to `bg-card`/`neutral-900`; `DESIGN.md`'s internal contradiction (neutral-800 vs neutral-900 for navbar) resolved in favor of neutral-900
- [x] `SuggestedUsers` rewritten as a vertical list — fits the `w-72` profile sidebar instead of clipping a horizontal-scroll row
**Review remediation, day 1 (2026-07-31)**
- [x] `supabase/migrations/20260731081353_social_schema.sql` — `follows`, `likes`, `stem_category` + `stems.category`, `profiles.bio`, RLS, all grants. `supabase db diff` now reports no schema changes
- [x] `follows` FKs repointed `auth.users` → `public.profiles`, fixing `getFollowing()`'s `PGRST200` (ADR-017 Update 2026-07-31)
- [x] `service_role` DML grants — existed only in the local DB, never in a migration; a fresh deploy would have broken `npm run seed`
- [x] `delete-stem.ts` — `stem.songs[0]` → `stem.songs` (PostgREST returns a to-one embed as an object). Note it has no call sites, so nothing user-facing was broken; its dead `revalidatePath("/account/me")` now points at `/songs/${stem.song_id}`
- [x] Cron cleanup no longer authenticates `Bearer undefined` when `CRON_SECRET` is unset — returns 500 instead
- [x] Cron cleanup 24h age filter — the 03:00 job could delete in-flight uploads, since R2 writes precede the DB insert (ADR-002)
- [x] `<Database>` generic added to all three Supabase client factories — every query was `any`, which is why the `delete-stem` bug typechecked clean. Cost 3 errors, not the estimated 2-3h
- [x] `useGetSongs`/`useGetSongById` selected `profiles(nickname)` while `Song` promises `avatar_url` — the player's `TrackInfo` artist avatar was always falling back to the placeholder. Found by the generic above, not by the review
- [x] `cancelled` guards added to `use-load-song-url.ts` and `use-get-song-by-id.ts` (ADR-015)
- [x] Upload success page — `NEXT_PUBLIC_R2_PUBLIC_URL` (exists nowhere) replaced with `getCoverUrl()`; `NEXT_PUBLIC_APP_URL` was never set at all, so the share field and Send button rendered `undefined/songs/<id>`
- [x] `.env.example` completed — documented 8 of the 15 variables actually read
- [x] Suite green and deterministic: `testTimeout: 30000`, stale `/account` proxy test replaced with a public-path assertion, `stems.name` test updated to `category`. `tsc` 1 error → 0, tests 99/100 → 100/100
**Agent tooling (2026-07-31)**
- [x] `.mcp.json` — Supabase MCP server against the **local** stack (`localhost:54321/mcp`, `read_only=true`); requires `supabase start`
- [x] `npx skills add supabase/agent-skills` — `supabase` + `supabase-postgres-best-practices` installed to `.agents/skills/`, symlinked into Claude Code
- [x] Decided 2026-07-31: `.mcp.json` + `skills-lock.json` committed, `/.agents/` gitignored — config and pinned hashes are shared, vendored third-party skill bodies are not
**Confirmed already done during the 2026-08-03 TODO audit**
- [x] `actions/profile/get-user-songs.ts` → `actions/songs/get-user-songs.ts` — the move was carried as open work; the file is already in its new home and `actions/profile/` holds only `get-profile-by-nickname.ts` + `update-profile.ts`
- [x] `components/social/share-button.tsx` stale header comment — no comment is present; the repo-wide comment purge already removed it
**Waveform/Card reuse & play-pause fix (2026-08-04)**
- [x] `Waveform` (`components/songs/waveform.tsx`) rebuilt to accept `height`/`barWidth`/`barRadius`/`lazyMount`/`onActivate` as props instead of hardcoding them; `Card`'s `"waveform"` variant now composes it instead of calling `useWaveform` inline
- [x] `hooks/songs/use-waveform.ts:36` unconditional `Card` subscription to `progress` — resolved as a side effect of the above: `useWaveform` now only runs inside `Waveform`, mounted only for the `"waveform"` variant, so `grid`/`row` cards no longer subscribe to a 4 Hz tick for nothing (`#M14`)
- [x] `usePlayer` gained `playPauseRequested`/`requestPlayPause`/`clearPlayPauseRequest`, mirroring the existing `seekTo` request/consume shape; `Controls` consumes it against the real `<audio>` element
- [x] `use-on-play.ts`'s `onPlay` now branches on `id === activeId` — re-clicking the already-active song requests play/pause instead of re-running `setSongs`/`setIds`/`setActiveId`, which was silently restarting playback from 0:00 (`#H7`, partially — the effect-structure half of that item stays open, see Up Next)
- [x] `resolve-stem-url.ts` — table fix, was checking `songs` instead of `stems`, stem existence check always failed
- [x] `actions/social/` and `components/social/` flattened back to one level, `follows/`/`suggestions/` subfolders removed
**Small cleanups & tooling (2026-08-04)**
- [x] `components/player/bar.tsx` — background swapped to `bg-black`, `z-index` added
- [x] `.mcp.json`/`skills-lock.json` untracked from git, added to `.gitignore` — no AI-tool trace stays in the repo going forward, doesn't remove them from already-pushed history
- [x] `vite.config.ts` — stray `// vitest.config.ts` header comment removed
- [x] Husky pre-commit hook + `lint-staged` added; `env.test.ts` moved from `__tests__/unit/infra/` to `__tests__/integration/infra/`
**Likes UX (2026-08-05)**
- [x] `SongList`'s `removeOnUnlike` mechanism removed entirely (`components/songs/song-list.tsx`, `app/(pages)/profile/[nickname]/page.tsx`) — decided to follow SoundCloud's pattern instead, unliked songs stay visible until next reload rather than vanishing instantly; supersedes the `removeOnUnlike` half of Up Next item 7 below
- [x] Now-dead `onLikeToggle`/`onToggle` thread stripped from `components/songs/card.tsx`, `components/songs/actions.tsx`, `components/social/like-button.tsx`, `hooks/social/use-like.ts` — `SongList` was the only caller
**Error handling unification (2026-08-05)**
- [x] `FollowedProfile` → `ProfileSummary` (`types.ts:18`) — the name implied "someone you follow", but suggested users share the same 3-field shape
- [x] `getSuggestedUsers` → `{ data, error }` + named `GetSuggestedUsersResult`; both queries now propagate errors, the `follows` lookup at `:21` had been discarding its error entirely
- [x] `feed/page.tsx` — suggestions fetch moved inside the empty-songs branch (previously fetched on every visit, rendered in one branch); its error now scoped to that section instead of replacing the whole page
- [x] `profile/[nickname]/page.tsx` — all four fetchers error-checked; `getProfileByNickname` failure now distinct from `notFound()`
- [x] `songs/[id]/page.tsx` — error check + `notFound()` split; `song.profiles` null-safety (`?? ""` in the href, `null` into `getAvatarUrl`, `?? "Unknown"` only for display text)
- [x] `get-song-by-id.ts` — `stems(id, category, path)` widened to `stems(*)`; the narrow select contradicted `Song["stems"]`, hidden until the return type was annotated
- [x] `card.tsx:16` — `SongCardProps` un-exported, nothing imported it
**Library error handling & Following list (2026-08-05)**
- [x] `app/(pages)/library/page.tsx` — `getLikedSongs()` and `getFollowedUsers()` errors both checked now, page renders a failure message instead of an empty list on a broken fetch (closes item 7b)
- [x] `actions/social/get-following.ts` → `get-followed-users.ts` — `getFollowing` → `getFollowedUsers`, `GetFollowingResult` → `GetFollowedUsersResult`, matches the `Get<Fn>Result` convention (`GetLikedSongsResult`, `GetSongsResult`); `getFollowers` name kept free for the not-yet-built reverse-relation function in Feature Backlog
- [x] `components/social/followed-users-list.tsx` — converted from a self-fetching Server Component (`userId` prop) to a dumb list component (`users: FollowedProfile[]` prop), matching `SongList`'s pattern; `FollowedProfile` moved to `@/types` so both files can import it
- [x] Full `UserList`/`UserCard` unification with `SuggestedUsersList` (same self-fetch, same discarded-error pattern) considered and deliberately deferred — stays scoped to item 11 below, not bundled here
**v1.0 Playlists, History & Feed (2026-08-23)**
- [x] `playlists` + `playlist_songs` tables, RLS, FK indexes — `supabase/migrations/20260823193000_playlists.sql`, applied locally 2026-08-23
- [x] Playlist actions: `create-playlist`, `get-user-playlists`, `get-playlist-by-id`, `add-song-to-playlist`, `remove-song-from-playlist`, `delete-playlist` (`src/actions/playlists/`)
- [x] `Playlists` profile tab, `/playlists/[id]` detail page, create dialog, owner delete menu, and an "Add to playlist" entry in the `Actions` cluster
- [x] Listening history read path — `get-play-history`, owner-only `/profile/[nickname]/history` tab, plus a dropdown entry
- [x] Nickname URL decode at the lookup boundary + `nicknameSchema` narrowed to `[a-zA-Z0-9_.-]`, with `20260823190000_nickname_url_safe.sql` normalising existing rows and adding a CHECK
- [x] `pro` role treated alongside `admin` — `get-pro-songs` backs the featured-posts fallback when the user follows nobody
- [x] Suggested users moved to a permanently sticky feed rail, out of the empty state
- [x] Feed density toggle (cards/rows) persisted via `useSyncExternalStore` + `localStorage`, with a purpose-built `FeedRow`
- [x] `useRequireAuth` wired into `use-like`/`use-follow`; landing "I make music" opens the register dialog
- [x] `<Toaster>` hoisted out of the `relative z-10` stacking context in both layouts; track owner menu set `modal={false}`
- [x] Likes/Following rows survive an unlike/unfollow until reload — self-revalidating `revalidatePath` calls dropped
- [x] Player bar: lime repeat button, transport row aligned to the seekbar, clickable title and nickname
- [x] Promo playlist banner on the landing page — `get-promo-playlist` + `promo-banner.tsx`, artwork `public/banner.jpg`
- [x] Landing "Start listening free" seeds `/search?query=synthwave`; `SearchInput` prefills from the param; "Fresh tracks" shelf removed from the empty search state
- [x] Home sections moved onto `--mh-section-gap`; hero fills the fold at `min-h-[calc(100vh-9rem)]`
- [x] Grid card: play button bottom-left and larger, details row cut to genre + bare relative time justified between, title/nickname gap tightened, copy-link hidden via `showCopyLink` on `Actions`
- [x] Search result rows lost their card background, columns gained `gap-2.5`
- [x] Playlist visibility switched from checkbox to `ui/switch.tsx`; playlist boxes restyled to match the Following cards; back link added to the playlist detail page
- [x] "Add to playlist" added to the song details page
- [x] Navbar icons dropped from the Feed and Library links
- [x] Player bar timestamps aligned to the controls above (elapsed left, duration right); the earlier `px-12` transport inset reverted
- [x] Responsive pass — navbar icon mode with expanding search, player bar mobile grid, seven display headers scaled, rows/cards/avatars sized down below `sm`
- [x] Discover shelf filtered to the last 7 days, capped at 10 cards, weekly counter, "N uploaded today" eyebrow via a new `isToday` flag, empty state for a quiet week
- [x] `InfoSection` restyled to the shelf's header block; "See how artists use it" now seeds a search query
- [x] Promo banner `min-h` up to 460px, profile banner `h-72 md:h-96`
- [x] Navbar bottom border softened to `white/6` (inset highlight dropped); search input given a border, darker fill and lime focus state
- [x] Landing section order settled: hero, promo banner, info section, Discover shelf last

**Wave A — Security**
- [x] `actions/songs/update-song-cover.ts`, `actions/profile/update-profile.ts`, `api/upload/route.ts` — MIME/size validation unified via new `lib/validations/files.ts` (`validateImageFile`, `safeImageExtension`); extension no longer parsed from `file.name`, closing the path-injection risk (`#H5`) (2026-08-06)
- [x] `actions/songs/get-songs.ts` → `get-searched-songs.ts` (only caller is `/search`), `title` → `query` end-to-end (URL param, prop, function arg); search filter value now escaped/quoted per PostgREST reserved-char rules; `tags.cs.{...}` moved out of the `.or()` string into its own `.contains()` query, merged and deduped by `id` (`#H8`) (2026-08-06)
- [x] `actions/social/get-suggested-users.ts:34` — escaped values before building `not.in` filter string, matching postgrest-js's own `.in()` quoting logic (2026-08-06)
- [x] `app/(pages)/(focused)/upload/success/[id]/page.tsx:19-29` — added owner check via `getUser()` + `uploaded_by` comparison, collapsed into existing `notFound()` (2026-08-06)
- [x] Include `/auth/confirmed` in proxy's protected paths, alongside `/auth/update-password` — already present in `src/proxy.ts:9` and `src/lib/supabase/proxy.ts:5`, no code change needed (2026-08-06)
- [x] Moved re-auth server-side into `src/actions/auth/change-password.ts` — still verifies via `signInWithPassword` (GoTrue's `current_password` field was the cleaner option but the Supabase CLI has no `config.toml` key to enable it locally, so it's a no-op there — see CHANGELOG). No client session clobbered anymore (2026-08-06)

**Wave B — Quick wins**
- [x] `app/layout.tsx` metadata set to real `title`/`description` (2026-08-06)
- [x] Dead `geistSans`/`geistMono` font loading removed from `app/layout.tsx`, landed alongside B1 (2026-08-06)
- [x] Removed unused `use` import from `hooks/search/use-search-suggestions.ts` (2026-08-06)
- [x] Renamed `exisitng` → `existing` in `hooks/auth/use-register.ts` (2026-08-06)
- [x] `revalidatePath` now targets `/profile/[nickname]` (dynamic-route pattern form, `"page"` type) instead of the dead `/account/me` route (2026-08-06)
- [x] Deleted `get-is-liked.ts` — dead, unused, and its export collided with `like-song.ts`'s real mutation name; `lib/attach-is-liked.ts` already covers the same check in batch form (2026-08-06)
- [x] Removed `field-sizing-content` from `components/ui/textarea.tsx:10` — box no longer grows wider while typing (2026-08-06)

**Wave C — Bugs**
- [x] `hooks/auth/use-social-login.ts` — blocked pop-up now caught right after `window.open`, with a user-readable message. Same pass added a `settle` helper (clears interval and a two-minute timeout, resets loading, resolves once) and a `try/catch` around `JSON.parse`, so a pop-up left open no longer hangs the promise either (2026-08-22)
- [x] `components/player/volume.tsx` — `onPointerDown` on the `Slider` captures the pre-drag volume, so unmuting after a drag to zero restores what the user had before the drag. Test not written yet, still open under Tests → Waveform / Player Rebuild (2026-08-06)
- [x] `components/upload/form/image-preview.tsx` — blob URL now derived via `useMemo` on `[file]` and revoked in a `useEffect` cleanup keyed on the URL; render body no longer mints one per re-render (2026-08-06)
- [x] `components/profile/edit/form-input-avatar.tsx` — swapped `next/image` for a plain `<img>` and added a `useEffect` on `[preview]` that revokes the blob URL on change/unmount (2026-08-06). Was: two problems, one fix: the preview feeds a `blob:` URL to `next/image`, which takes a path, a configured remote pattern or `unoptimized`, and `next.config.ts` only allow-lists `**.r2.dev` ("Invalid src prop" at runtime); and the object URL is never `revokeObjectURL`'d, so each re-selection leaks. Use a plain `<img>` and revoke on change/unmount (`#M18`)
- [x] `hooks/songs/use-waveform.ts:85` — cleanup now nulls `wavesurferRef.current` after `destroy()`, so the seek effect's `?.` short-circuits instead of calling `seekTo` on a destroyed instance (`#L10`, 2026-08-06)
- [x] `components/songs/song-list.tsx:17` — wrapper now carries `flex flex-col gap-2.5 w-fit`; rows no longer render flush against each other (2026-08-06)
- [x] First click on a waveform now seeks to the clicked position. Three faults on one path: `setActiveId` did not reset `progress`/`duration`, `useWaveform`'s handler discarded the click position when activating, and `Controls`' seek effect dropped a request made before metadata loaded. Race split out as C8 (2026-08-22)
- [x] `seekTo` now carries a `SeekRequest` (`use-player.ts:5`) — song id plus fraction — and `Controls` clears and drops any request whose `songId` isn't the active one, so a click can no longer land on the song that loads next (2026-08-22)

**Wave D — Correctness & contracts**
- [x] `ActionResult<T>` and `MutationResult` both live in `src/types/index.ts` — 8 reads and 10 mutations adopted them, all local result types deleted. The three outliers converted too: `get-user-songs.ts` (was bare `Song[]`), `get-profile-by-nickname.ts` (was `{ profile, error }`, payload now named `ProfileDetails`) and `get-follow-status.ts` (was `{ isFollowing }`, no error field). `update-profile.ts` and the two `resolve-*-url` actions stay out by design (`#M9`, 2026-08-22)
- [x] `actions/stems/add-stem.ts:57-63` — failed insert now deletes the uploaded stem from R2 and returns the real `insertError`; a failed rollback logs the orphaned path for the cleanup cron. Typo `"Faile to save stem record"` gone with it (2026-08-06)
- [x] `actions/songs/delete-song.ts:70-80` — the failed-row-delete branch now logs the song id and returns an honest message ("files removed, record not, try again") instead of a bare Postgrest message. Retry deliberately not added: a second Delete press already self-heals, since R2 deletes on missing keys are no-ops. Real fixes deferred as D8 (2026-08-22)
- [x] `actions/songs/delete-song.ts` — explicit `stems` delete removed; `create_tables.sql:27`'s `on delete cascade` handles it when the song row goes. The R2 stem loop stays, it still needs `stems(path)` from the select (`#M7`, 2026-08-06)
- [x] `update-song.ts`, `update-song-cover.ts` and `update-profile.ts` now revalidate after a successful write. Every target route is `ƒ` dynamic, so the payoff is the client refresh, not a server cache purge. Rule applied throughout: bracket in the path takes `"page"`, a concrete path takes nothing. `update-song.ts` also gained the missing error guard it needed to revalidate honestly. Social mutations split out as D7 (`#M6`) (2026-08-13)
- [x] `like-song.ts`, `unlike-song.ts`, `follow-user.ts`, `unfollow-user.ts` now guard on the write error, then revalidate. Likes name `/library`, `/search`, `` `/songs/${songId}` `` and `/profile/[nickname]`; follows name `/library`, `/feed` and `/profile/[nickname]`. All four return `{ error: null }` on success and wrap the Postgrest `.message` on failure (2026-08-13)
- [x] `components/auth/auth-gate.tsx` no longer calls `open()` in a mount effect, so a dismissed sign-in dialog stays dismissed and navigating between `/feed` and `/library` doesn't reopen it. The Sign in button is now the only trigger — one extra click on arrival, deliberately traded for the dialog being dismissable (`#L1`) (2026-08-13)

**Wave E — Single source of truth**
- [x] `lib/constants.ts` is now the single audio contract: `ACCEPTED_AUDIO` gained `as const satisfies Record<string, readonly string[]>` plus an `AcceptedAudioMimeType` union, and `MAX_AUDIO_SIZE_MB`/`MAX_AUDIO_SIZE_BYTES` live beside it. `api/upload/route.ts` dropped its own list and size constant for an `isAcceptedAudioMime` type predicate reading `ACCEPTED_AUDIO` — `.aac` gone, `.ogg` in, so dropzone and server agree — and its 413 messages interpolate the real limit. `upload-form.tsx:183-184` derives its copy from both constants, replacing the WAV/FLAC/AIFF/ALAC + 4GB text (2026-08-07)
- [x] `lib/r2/client.ts:13-20` is now the single `BUCKETS` map — `{songs, stems, covers, avatars}` plus an exported `Bucket` type. `upload.ts`, `storage.ts`, and `api/cron/cleanup/route.ts` all import it instead of building their own from `process.env`. Cleanup's orphan-scan loop now iterates its DB-tracked `dbPaths` keys (not `BUCKETS`'s), since `avatars` has no DB-path check yet — scanning it would crash on `validPaths.has(...)` (2026-08-12)
- [x] Nickname rules unified — `lib/validations/auth.ts`'s `registerSchema.nickname` now imports `nicknameSchema` from `./profile` instead of declaring its own regex. Wider set wins (`/^[a-zA-Z0-9_.!@#$%&-]+$/`, `profile.ts:15`'s) — deliberate, to leave room for Discord-sourced nicknames and creative artist names (2026-08-12)
- [x] `lib/constants.ts:12`'s `ACCEPTED_IMAGE` now has E1's treatment — `as const satisfies Record<string, readonly string[]>`, an `AcceptedImageMimeType` union, `MAX_IMAGE_SIZE_MB`/`MAX_IMAGE_SIZE_BYTES` beside it. `lib/validations/files.ts` dropped its own `IMAGE_EXTENSION_BY_MIME`/`ALLOWED_IMAGE_TYPES` for an `isAcceptedImageMime` predicate reading `ACCEPTED_IMAGE` — `.webp` dropped, `.jpg`/`.png` only, for now (2026-08-12)
- [x] `lib/constants.ts:1`'s `ACCEPTED_AUDIO`/`ACCEPTED_IMAGE` now `satisfies Accept` via `import type { Accept } from "react-dropzone"` — type-only, erased at compile time, so `api/upload/route.ts` never pulls the runtime package into its bundle. Decided: bind to the consumer's real type since the cost is zero at runtime (2026-08-12)

**Wave F — Performance**
- [x] `components/player/controls.tsx` — the imperative `onended` binding is gone and `handleNext` is out of the `src` effect's dependency array, so that effect now depends on `url` and the stable `attemptPlay` alone and stops re-running `play()` on every `activeId` change. End-of-track behaviour lives only in the declarative `onEnded`, which now calls `setIsPlaying(false)` then `handleNext()` — the single branch point J1's repeat button needs (`#H7`) (2026-08-13)
- [x] `components/player/bar.tsx:12` is now the only `useGetSongById(activeId)` call; `bar.tsx:22` passes `song` to `Controls` alongside the existing `TrackInfo` prop, and `controls.tsx:28-30` declares a required `ControlsProps { song: Song }`. One round-trip per track change, one copy of the state (`#M16`, 2026-08-07)
- [x] `hooks/social/use-like.ts` — `router.refresh()` and the now-dead `useRouter` import removed; both hooks end on a direction-branched `toast.success`, and `use-follow.ts:24` gained the missing `return` in its error branch that would otherwise have toasted success after a failure. `docs/reference/CONVENTIONS.md:113`'s step 3 rewritten: success now toasts rather than doing nothing (`#M20`, `#D10`, 2026-08-07)

**Wave G — UX & accessibility**
- [x] `components/search/search-input.tsx` — arrow-key navigation, the full ARIA combobox pattern, Escape closing the list and Enter searching the typed text (`#M19`) (2026-08-22)
- [x] `components/stems/list.tsx:22-27` now synthesises an `<a>`, clicks it and removes it, instead of `window.open` — anchor clicks aren't popup-blocked, so the post-`await` position stops mattering. `lib/r2/storage.ts` gained a `PresignOptions` object (`bucket`, `asAttachment`) replacing the positional bucket argument; `asAttachment` signs `ResponseContentDisposition` so cross-origin R2 URLs download rather than navigate. Verified manually in Brave; the Firefox/Safari leg the header exists for is untested (`#M17`, 2026-08-07)
- [x] `components/auth/social-button.tsx` rendered an icon with no visible label — accessible name came from `alt="discord logo"`. Visible "Continue with Discord" added, icon flipped to `alt=""`, provider name capitalised via a `providerLabels` map; new `## Dostępność` section in `docs/reference/CONVENTIONS.md` records the rule (`#D18`) (2026-08-06)
- [x] `components/player/controls.tsx` — `play()` rejections and `<audio onError>` now raise toasts; `NotAllowedError`/`NotSupportedError` stay silent, `MEDIA_ERR_ABORTED` too (`#L12`) (2026-08-06)
- [x] Clipboard write wrapped in `try`/`catch` in the one surviving component (`components/social/copy-link-button.tsx:16-21`) — success toast moved inside the `try`, failure toasts "Failed to copy link". Covers both failure modes: an insecure context where `navigator.clipboard` is `undefined` and throws, and a denied permission where `writeText` rejects. `components/ui/copy-button.tsx` was deleted rather than guarded (`#L3`, 2026-08-07)

**Wave H — Cleanup, naming & config**
- [x] `src/types.ts` → `src/types/index.ts` — folder-consistency with `types/database.types.ts`, no import changes (2026-08-06)
- [x] `components/social/share-button.tsx` → `copy-link-button.tsx`, `ShareButton` → `CopyLinkButton`, `Share2` → lucide `Link`. Four call sites updated (`songs/actions.tsx`, `profile/[nickname]/page.tsx`, `songs/[id]/page.tsx`, and `upload/success/[id]/page.tsx`, which absorbed the deleted `components/ui/copy-button.tsx`). The `iconOnly` variant was dropped, so every `Card` now shows the full outline button (2026-08-07)
- [x] `components/songs/actions.tsx:6` declared a `size` prop, never destructured it (`:10`), and all three call sites passed `size="sm"`. Deleted rather than threaded — `LikeButton`/`ShareButton` never varied by size (`#L2`) (2026-08-06)
- [x] `components/ui/copy-button.tsx:23,33` positioned icons `absolute` inside `Button`, which never set `relative` — fixed by adding `relative` to the `Button`, spans stay `absolute` (`#L4`) (2026-08-06)
- [x] `hooks/player/use-on-play.ts:12` — `onPlay` wrapped in `useCallback`, so a `React.memo` on `Card` would hold (`#L9`) (2026-08-06)
- [x] `src/lib/supabase/.branches/_current_branch` and `src/lib/supabase/.temp/cli-latest` were tracked in git — Supabase CLI scratch files, in the wrong place too. Untracked and deleted; `.gitignore` patterns unanchored to `.branches`/`.temp` so any cwd is covered (`#L14`) (2026-08-06)
- [x] `.env.local` set `NEXT_PUBLIC_SUPABASE_URL=http://127.0.0.1:54321`, against the standing WSL2 rule in `CLAUDE.md` — now `localhost`; no commit, `.env.local` is gitignored (`#L18`) (2026-08-06)
- [x] `package.json` — `@testing-library/user-event` sat in `dependencies`; moved to `devDependencies`, version unchanged at `^14.6.1` (`#L15`) (2026-08-06)
- [x] `globals.css` has no `scrollbar-gutter: stable` on `html`; `docs/reference/CONVENTIONS.md:51` says it was planned and never landed — added to the `html` block, not `*`, so scroll containers do not each reserve a gutter (`#D13`) (2026-08-06)
- [x] `hooks/player/use-player.ts:29` — volume now survives page loads via `zustand/middleware`'s `persist`; `partialize` narrowed to `volume` alone (`#L11`) (2026-08-06)
- [x] Removed the `song.image_path` guards in `TrackInfo` and the upload success page — `getCoverUrl` is null-safe and `IMAGE_PLACEHOLDER.COVER` is now the single cover fallback (2026-08-06)
- [x] Seed script now builds 18 profiles (3 fixed + 15 generated from `PRODUCER_NICKNAMES`) and 60 tracks dealt round-robin across them, enough volume to exercise Follow/Suggested-users/Feed (2026-08-13)
- [x] `components/songs/grid.tsx` → `shelf.tsx`, `Grid` → `Shelf` — the component renders a horizontally scrolling strip of cards, not a grid; `row` was rejected because `card.tsx:20` already uses `"row"` for the search-result list variant. One call site, `app/page.tsx` (2026-08-06)
- [x] All 4 baseline eslint errors cleared — `npm run lint` now reports 0 errors, 11 warnings. The two dropzone files extract `Controller`'s render-prop body into a real `AudioDropzoneField`/`ImageDropzoneField` component so `useDropzone` runs somewhere ESLint recognises; both take one shared `DropzoneFieldProps<T>` derived from `FormInputFileProps<T>`. The two hooks stop writing their reset value to state and derive it at the return line instead (2026-08-12)
- [x] `upload-form.tsx:326` — two bare apostrophes escaped to `&apos;` (`react/no-unescaped-entities`). Split out of H15: the husky `pre-commit` hook rejected the E1 commit over them, because `lint-staged` only lints staged files and this was the first time `upload-form.tsx` had been staged since H15 was written (2026-08-07)

**Wave I — Docs & conventions**
- [x] Missing `"use server"` — `actions/songs/get-song-by-id.ts`, `actions/songs/get-user-songs.ts`, `actions/profile/get-profile-by-nickname.ts`. Every other file in those folders has it (2026-08-06)
- [x] All four Route Handlers documented in all three places: `docs/reference/CONVENTIONS.md` lists them as four deliberate exceptions with the auth pair's justification, `ADR-002` gained an Update 2026-08-22 retiring both halves of its "only Route Handler" consequence (including its now-forbidden "document with a comment" clause), and `CLAUDE.md`'s Architecture section names all four. Shared reason recorded: something outside the app must reach an HTTP address (2026-08-22)
- [x] RLS policy errors documented in `docs/reference/CONVENTIONS.md` → "Supabase gotchas": missing table-level `grant` gives `42501 permission denied` before the policy is ever evaluated, versus "new row violates row-level security policy" for a real policy rejection. Grants ship in the same migration as the policies (2026-08-22)
- [x] New `lib/auth-error-message.ts` maps Supabase auth errors to user-facing text — separate messages for `over_email_send_rate_limit` and `over_request_rate_limit`/HTTP 429, everything else passed through unchanged. Wired into all four auth forms plus `change-password-form.tsx` and `edit-profile-dialog.tsx` (2026-08-13)

**Wave J — Features: Player**
- [x] Repeat button — shipped as a three-mode `repeatMode` rather than the `repeatOne` boolean sketched here, so the queue wrap can be switched off; fixed a persist-key mismatch and a single-song queue that never restarted (2026-08-22)
- [x] Seekbar shipped — `components/player/seekbar.tsx`, a `Slider` on the store's `progress`/`duration` with a local scrub value so playback doesn't fight the drag, committing on release via `requestSeek(activeId, …)`. New `lib/format/duration.ts` for the `m:ss` labels; `bar.tsx` split into a stack so the bar spans full width (2026-08-22)

**Wave K — Features: Songs**
- [x] Wire up song edit — `edit-song-dialog.tsx` + `lib/validations/song.ts`, reached from an owner-only dropdown in `actions.tsx`; `isOwner` threaded from the page and shared with K2 (2026-08-22)
- [x] Wire up song delete — `AlertDialog` confirm wired to `deleteSong`, reached from K1's owner-only dropdown (2026-08-22)

**Wave L — Features: Profile**
- [x] Followers count beside the nickname linking to the followers list; `getFollowers` already existed from L2, so no new action was needed (2026-08-22)
- [x] Public sub-routes `/profile/[nickname]/likes`, `/followers`, `/following`, grouped under `(tabs)` with a shared `layout.tsx` holding only the `Tabs` bar — the profile header stays on `/profile/[nickname]` alone, and the tab bar lists the three sub-routes without a "Tracks" entry. New `getFollowers` mirrors `getFollowedUsers` (filter `following_id`, embed `profiles!follower_id`). `ProfileGrid` gained an empty state, keyed on whether `title` is passed (2026-08-13)
- [x] Bio capped at 150 words — `bioSchema` uses a word-splitting `.refine()` (not `.max()`, which only counts characters), `FormTextarea` gained a separate `maxWords` prop with its own word-count display, landed alongside B7 (2026-08-06)
- [x] Password change moved to `/profile/[nickname]/settings`, guarded by auth + ownership check (mirrors `isOwnProfile`), linked from `UserProfileButton` (2026-08-06)
- [x] Banner image shipped: `banners` bucket in `BUCKETS`, `uploadBanner`/`getBannerUrl`, `profiles.banner_url` migration, banner field in the edit dialog, full-bleed banner on the profile page with the actions overlaid, `next.config.ts` remote pattern, `.env.example` keys (2026-08-23)

**Wave N — Polish & unbuilt**
- [x] `/auth/confirm/route.ts:26` now redirects to `/auth/error`, a public page explaining the link expired or was already used. One destination for all three failure causes — missing params, expired token, malformed token — since the user's next action is the same in each case (2026-08-13)
- [x] Split 342 lines → 106: `upload/form/stem-row.tsx`, `stems-field.tsx`, `upload-header.tsx`, `upload-footer.tsx`, `steps/audio-step.tsx`, `steps/details-step.tsx`; `form.watch` → `useWatch`; emerald/neutral literals swapped for system variants (2026-08-23)
- [x] shadcn.io mesh-gradient installed at `components/ui/mesh-gradient.tsx` and then dropped — the `.mh-atmosphere-*` blobs match the artifact, cost no JS and are reduced-motion gated, so the component is unmounted. Registry access stays wired (`components.json` `@shadcnio`, token as a query param not a header). Delete the file if nothing claims it (2026-08-22)
- [x] `filled` rewritten as the v2 surface (`rounded-[var(--radius-md)] border-input bg-[rgba(0,0,0,0.3)]`, `focus:border-ring/60`) and made the default variant; `underline` retokenised to `border-input`/`focus:border-ring/60` (2026-08-23)
- [x] Button padding moved to the reference's 1:2 ratio in `ui/button.tsx:24-31` — sm `12px 24px`, default `16px 32px`, lg `18px 36px`, all at 16px text; fixed `h-*` heights dropped so the padding governs. The ghost/outline variant runs ~3px taller than the lime one because its 1.5px border sits outside the padding and cva size classes win over variant classes (2026-08-22)
- [x] Removed when the root layout was reduced to html/body + atmosphere blobs and the chrome moved to `(pages)/layout.tsx` (2026-08-23)

**Wave O — Opened 2026-08-23**
- [x] Docs write-back for 2026-08-23 — genre enum + tag caps to `docs/reference/CONVENTIONS.md`, banner bucket + focus-mode layout split to `docs/history/CHANGELOG.md` (2026-08-23)

**Wave P — Opened 2026-08-23 (evening)**
- [x] P2 partially closed — create and add-song verified by real signed-in use (3 playlists, 2 with tracks); remove and delete still unexercised

**Closed from the previous flat queue**
- [x] `actions/stems/resolve-stem-url.ts` — DB existence/ownership check mirrored from `resolve-song-url.ts` 2026-08-04
- [x] `/auth/update-password` — decided and locked down in both `src/proxy.ts`'s `matcher` and `PROTECTED_PATHS` 2026-08-04
- [x] Library "Following" tab shipped and wired into `library/page.tsx` 2026-08-04. Integration test still open (see Tests)
- [x] `isLiked` on the song detail page + `useGetSongs`, `attachIsLiked` moved to `lib/` with the `<Database>` generic 2026-08-05
- [x] `library/page.tsx` fetch errors surfaced; `removeOnUnlike` dropped in favour of the SoundCloud pattern 2026-08-05
- [x] `ProfileCard`/`ProfileList`/`ProfileGrid` built, four components deleted, per-card `getFollowStatus` gone (`#M13`) 2026-08-05
- [x] **Decided (2026-08-22):** `lib/attach-is-liked.ts` stays; the `likes!left(user_id)` embed is rejected. The embed saves one query rather than two — `auth.getUser()` is needed either way — and spreads the `.eq("likes.user_id", …)` filter across six `.select()` calls, where omitting it silently reports other users' likes as yours. Written up as ADR-019, summarised in `docs/TLDR.md`
- [x] Stems stay download-only — in-browser stem playback dropped 2026-08-07. The song page already carries a waveform, and downloading a stem is enough; the second audio channel from ADR-016's "Not adopted" note will not be built
- [x] `useWaveform` parametrization dropped 2026-08-07 — it only existed to serve stem playback, which is now decided against
- [x] Force nickname selection after Discord OAuth — decided against 2026-08-07. Current behaviour is fine; revisit only if collisions become a real problem
- [x] Indexed `FormData` keys — `upload-form.tsx` appends `stems[i].file`/`stems[i].category`, and `api/upload/route.ts` reads by index, breaking on the first absent pair and bounded by `MAX_STEMS`. The `stemFiles.length !== stemCategories.length` guard is gone; a file and its category now share an index and cannot desync. Defensive, not a fix for an observed bug — both sides always appended in one loop (2026-08-13)
- [x] `next.config.ts` image allow-list narrowed from `**.r2.dev` to the two `pub-*.r2.dev` hosts, derived from `NEXT_PUBLIC_R2_COVERS_URL`/`NEXT_PUBLIC_R2_AVATARS_URL`, with `pathname: "/**"` and `search: ""` pinned. `__tests__/integration/infra/env.test.ts` now guards all nine R2 vars, since a missing one is a build failure. Follow-up as H17 (`#L19`) (2026-08-13)
- [x] Click-to-seek confirmed working in-browser 2026-08-07. One defect found and split out as C7 (first click on a fresh waveform jumps then snaps back)
