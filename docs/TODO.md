# TODO

Only hazards live here: anything that can lose data, break against the hosted database, or
ship a silent failure. Everything else was cleared on 2026-08-24 — a fresh review
regenerates what still matters.

## Hazards

- [ ] GitHub Actions CI — designed 2026-08-04, deliberately not applied; the user wants to cover it further before it lands. Two jobs: `check` (typecheck + lint + `__tests__/unit`, no environment) and `integration` (local Supabase via `supabase/setup-cli@v3`, then `__tests__/integration`). Blocked on one decision — whether `integration/infra/r2.test.ts` belongs in CI at all, given it goes red on a Cloudflare outage or an expired token rather than on broken code. If it stays, it needs a separate `Object Read only` R2 token scoped to `songs`/`covers`, verified locally against `HeadBucket` before the keys reach GitHub secrets. Full design in memory (`ci-workflow-pending`)
D8. [ ] `delete-song.ts` — no automatic recovery for a song row that outlives its R2 files. Two candidates: a reverse-direction pass in `api/cron/cleanup/route.ts` (find rows whose paths no longer exist) or a soft-delete column set before the R2 deletes. Both were judged larger than the bug when D3 was closed
D9. [ ] `delete-song.ts:65` — if the session expires between the ownership check and the delete, RLS makes the delete match zero rows and PostgREST returns success, so the row survives with no error and no log. Needs a row-count check, not an error check
O6. [ ] Genre `z.enum(GENRES)` applies on write only — existing rows may hold off-list genres; decide whether to backfill or map on read
P2. [ ] Playlist write paths never exercised signed-in — create, add and remove all run under `authenticated` RLS and have only been typechecked
P4. [ ] Neither 2026-08-23 migration is applied to the hosted project — local only

## Tests (still needed — nothing here is done)


Coverage today is auth and infra only: 23 files under `__tests__/`, none of them
touching actions, hooks, player, songs or social. Three rows below are already
the red test for an open bug in Leftover and are marked **[bug]** — those are the
ones to write test-first.

- [ ] The auth integration suite cannot pass in a full `npx vitest run`. `supabase/config.toml:199` sets `email_sent = 2` (deliberately lowered from 100 to stop dev-mail spam), and every `signUp` across the four auth files sends a confirmation email, so most of them time out at 30s waiting on a throttled GoTrue. Each file passes alone. Needs a decision, not a patch: raise the limit under a test profile, stub the mail send, or split auth tests out of the default run

**v0.5 Song Management**

- [ ] Integration: `deleteSong` — removes Supabase record, audio, cover and all stems from R2
- [ ] Integration: `deleteSong` — logs orphaned paths if any R2 delete fails
- [ ] Integration: `updateSong` — updates metadata fields, does not touch R2
- [ ] Integration: `updateSongCover` — old cover removed, new one uploaded, `image_path` updated
- [ ] Integration: `updateSongCover` — DB update failure rolls back the newly uploaded cover
- [ ] Integration: `addStem` — file uploaded to R2, record inserted with correct `category`
- [ ] Integration: `deleteStem` — file removed from R2, record deleted
- [ ] Unit: `addStem`/`deleteStem` — errors when caller doesn't own the parent song

**v0.6 Search**

- [ ] Integration: `getSongs()` — returns all songs ordered by `created_at` desc
- [ ] Integration: `getSongs(title)` — matches title, genre, scale or tags
- [ ] Integration: `getSongs(title)` — empty array on no match
- [ ] Unit: `useDebounce` — returns debounced value after delay
- [ ] Unit: `useSearchSuggestions` — matching titles after debounce, empty array for blank query
- [ ] Unit: `useSearchSuggestions` — a slow earlier response can't overwrite a newer one; the `cancelled` flag guard ADR-015 requires
- [ ] Unit: `SearchInput` — dropdown on match, correct `?title=` push, closes on Escape/blur
- [ ] Unit: `Card` (`row` variant) — renders avatar, nickname and meta correctly (this row previously named `Row`, a component that no longer exists — search results go through `Card`)

**v0.7 Account**

- [ ] Unit: `useUser` store — `setUser`/`setIsLoading` update state correctly
- [ ] Unit: `UserProvider` — `setUser` on auth, `setUser(null)` on sign out, unsubscribes on unmount
- [ ] Unit: `UserProfileButton` — renders nothing without user, dropdown + sign out with user
- [ ] Integration: own-profile edit view redirects unauthenticated users
- [ ] Unit: `EditProfileDialog` — resets on open, submits nickname/bio/avatar together, closes on success
- [ ] Unit: `updateProfile` — rejects duplicate nickname, normalizes empty bio to `null`, rolls back R2 avatar on DB failure
- [ ] Unit: `changePassword` (`actions/auth/change-password.ts`) — re-auth fails on wrong old password, succeeds and calls `updateUser` on correct old password
- [ ] Unit: `ChangePasswordForm` — requires both fields, surfaces the action's error, resets on success
- [ ] Integration: password change requires correct current password, rejects with wrong one
- [ ] Integration: avatar/bio/nickname change persists and reflects in `useUser` store without a second fetch
- [ ] Blocked: email change sends confirmation link, doesn't update `auth.users` until confirmed — the feature itself is undecided (see Leftover → Polish / Deferred), so this test can't be written yet

**v0.8 Feed**

- [ ] Integration: feed renders all songs including `profiles.nickname`
- [ ] Unit: `SongList` — renders title, nickname, cover and play button per row (this row and the next previously named `FeedSongItem`, a component that was never built — Feed, Library and profile-likes all share `components/songs/song-list.tsx`)
- [ ] Unit: `SongList` — play on a row calls `useOnPlay` with the correct song id

**Other**

- [ ] Unit: `Navbar` — Sign in / Register call `useAuthModal().open()` with correct arg
- [ ] Integration: `useSocialLogin` — popup opens, Discord flow completes, resolves `{ error: null }` (manual, not automatable)
- [ ] **[bug]** Unit: `useSocialLogin` — a blocked popup (`window.open()` returns `null`) still resolves and resets `isLoading`, rather than hanging forever

**v0.9 Social**

- [ ] Integration: `followUser`/`unfollowUser` — insert/delete correctly, rejects self-follow
- [ ] Integration: `likeSong`/`unlikeSong` — insert/delete correctly
- [ ] Integration: `getFollowedArtistsSongs` — only followed artists, empty when following nobody
- [ ] Integration: `getLikedSongs` — only current user's likes
- [ ] Integration: `getUserSongs` — only specified user's uploads
- [ ] Integration: `getFollowing` — returns followed profiles with `nickname`/`avatar_url`, empty when following nobody
- [ ] **[bug]** Unit: `FollowButton`/`LikeButton` — toggles state, calls the correct action, optimistic update; `LikeButton` reflects `isLikedInitially` on first render
- [ ] Unit: RLS — user cannot insert a `follows`/`likes` row on another user's behalf

**Waveform / Player Rebuild**

- [ ] Integration: `Card` (waveform variant) — mounts wavesurfer only after intersection, destroys on unmount
- [ ] **[bug]** Integration: click-to-seek — `requestSeek` correctly moves `audio.currentTime` in `Controls`
- [ ] **[bug]** Unit: `Volume` — mute/unmute restores the previous volume, including after a manual drag to zero, not a hardcoded value
