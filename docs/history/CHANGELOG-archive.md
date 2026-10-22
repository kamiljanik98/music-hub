# Changelog archive

Entries from 2026-08-13 and earlier, split out of `docs/history/CHANGELOG.md` on 2026-08-24 to keep the live file readable. Below the changelog entries, the milestone history that used to live in `MILESTONES.md`.

## [Unreleased] - Stems travel under indexed keys (2026-08-13)

The upload form appended every stem's file under one repeated key and every stem's category under another, and the route paired them by walking two `getAll()` arrays in parallel. Nothing was broken — both sides built their lists in a single loop, so the indices could not drift — but the correctness of the pairing rested on that coincidence rather than on anything in the payload.

Each stem now carries its index in the key itself: `stems[0].file` and `stems[0].category`. The route reads a pair per index, stops at the first index where both are absent, and bounds the loop with `MAX_STEMS`, checking `stems[10].file` to reject an over-limit submission. The `stemFiles.length !== stemCategories.length` guard was deleted rather than kept — a file and its category share an index now, so the mismatch it defended against is unrepresentable. Per-stem MIME, size and category validation is unchanged.

Also recorded: closing this exposed that `npx vitest run` cannot go green on a developer machine. `supabase/config.toml:199` caps local confirmation emails at two per hour, a limit lowered on purpose to stop dev-mail spam, and the four auth integration files need many more than two between them. They pass individually and time out together. That is a conflict between two deliberate choices, logged in `docs/TODO.md` under Tests rather than resolved here.

## [Unreleased] - Auth failures stop quoting GoTrue at the user (2026-08-13)

Every auth form surfaced `toast.error(error.message)`, so a rate-limited user read whatever GoTrue returned — "For security purposes, you can only request this after 46 seconds", or "Request rate limit reached". Server phrasing, no guidance, and it changes between GoTrue versions. Closes I4.

`lib/auth-error-message.ts` narrows with `isAuthApiError` and branches on the error code, following the `playErrorMessage`/`mediaErrorMessage` shape already in `components/player/controls.tsx`. Two distinct messages, because the two limits differ in kind: a request limit clears in seconds, an email-send limit in minutes, and telling someone to "try again" when the block is on sending mail is wrong advice. Anything that isn't an `AuthApiError` passes through untouched, so `use-register.ts`'s hand-built `new Error("Nickname already taken")` still reads exactly as written.

The `status === 429` fallback is not redundant with the code check. `AuthError.code` is documented as `undefined` for errors raised before a response is received, so matching on code alone would miss those.

Six call sites route through it: the four auth forms, plus `change-password-form.tsx` and `edit-profile-dialog.tsx`, both of which reach `updateUser`. Left raw on purpose: sign-out and the Discord OAuth path, which fail on configuration rather than throttling; the like and follow hooks, which since D7 receive a plain wrapped `Error` rather than an `AuthApiError`; and the upload form, whose errors come from R2.

Separately, `components/auth/auth-gate.tsx` stopped opening the sign-in dialog from a mount effect. Closes D6 (`#L1`). The effect meant a user who dismissed the dialog was left staring at the fallback message they had just rejected, and any re-mount — navigating `/feed` to `/library`, or React StrictMode in development — reopened it unasked. The Sign in button already covered the interaction. The trade is explicit: one extra click on arrival, in exchange for a dialog that stays dismissed.

## [Unreleased] - One home for end-of-track behaviour (2026-08-13)

`Controls` set the audio source and wired `onended` in the same effect, with `handleNext` in its dependency array. `handleNext` is a `useCallback` over `[ids, activeId, setActiveId]`, so it was a new function on every track change, so the effect re-ran and called `attemptPlay()` again each time — an extra `play()` on a source that had just started. Closes F1 (`#H7`).

The imperative `audioRef.current.onended = handleNext` is gone, and `handleNext` is out of the dependency array. The source effect now depends on `url` and `attemptPlay`, both stable, and runs once per track. End-of-track behaviour moved entirely into the declarative `onEnded` prop, which previously only reset `isPlaying` — it now resets it and advances the queue. That also gives J1's repeat button a single place to branch instead of two competing bindings.

One trap worth recording, since TypeScript was no help. An intermediate version wrote the handler as `onEnded={(() => setIsPlaying(false), () => handleNext())}`. That is the comma operator, not two handlers: it evaluates the first arrow, discards it, and passes only the second to React, so `setIsPlaying(false)` would never have run. The expression's type is a valid event handler, so `tsc --noEmit` stayed clean. A block body with two statements is the only form that does what it reads like.

## [Unreleased] - Profiles get likes/following/followers tabs, and Library stops duplicating them (2026-08-13)

Profiles gained three public sub-routes — `/profile/[nickname]/likes`, `/following`, `/followers` — grouped under a `(tabs)` route group whose `layout.tsx` renders the tab bar and nothing else. Closes L2.

The layout was first written holding the full profile header (avatar, bio, Edit/Follow buttons) and was cut back to the tab bar alone: the header stays on `/profile/[nickname]`, which sits outside the group. The tab bar deliberately has no "Tracks" entry — returning to the profile is the header, as on SoundCloud — which is also what lets the main profile page stay outside the group instead of moving into it and colliding on the same URL. A useful side effect: with no data fetching in the layout, `getProfileByNickname` runs once per page load rather than twice, so no `React.cache` wrapper is needed.

`getFollowers` is the mirror of `getFollowedUsers`: filter `follows` by `following_id`, embed `profiles!follower_id`. Both halves flip together — flipping only one produces a query that runs, returns rows, and hands back the wrong people, with no error and no type complaint.

`ProfileGrid` used to `return null` on an empty list, which is right for a section inside a larger page and wrong for a page that is nothing but the list. It now keys on `title`: passed means "I am a section", so an empty list still renders nothing; omitted means "I am the page", so an empty list renders an `emptyMessage` (default `"Nobody here yet."`). The `h2` is also now conditional, since the two tab pages were emitting an empty heading element.

`/library` was reduced to a redirect in the same pass. It rendered the signed-in user's likes and followed users, which is exactly what `/profile/[nickname]/likes` and `/following` now show for that same user — no privacy difference either, since both profile tabs are public. This reverses the Library Following tab shipped 2026-08-04. `AuthGate` still guards the signed-out case; signed-in users are redirected to their own likes tab, guarded against a null nickname. The route is kept rather than deleted because M1's play history is genuinely private and cannot become a public profile tab.

That reversal makes a correction necessary to two entries written earlier today. The D5 and D7 entries below name `/library` as a revalidation target; it no longer renders anything, so every `revalidatePath("/library")` was replaced rather than deleted. Next's documentation is explicit that a `"page"`-type revalidation "will *not* invalidate pages beneath the specific page", so `/profile/[nickname]` never covered the new sub-routes. The like actions now name `/profile/[nickname]/likes`, the follow actions name `/following` and `/followers`, and `update-profile.ts` names both of the latter, since a nickname or avatar change renders in every `ProfileGrid` on those pages.

## [Unreleased] - An expired confirmation link says so (2026-08-13)

`auth/confirm/route.ts` ended in a bare `redirect("/")`, which caught three distinct failures — missing `token_hash`/`type`, an expired token, and a malformed one — and dropped the user on the homepage with no explanation. Closes N3.

Failures now land on `/auth/error`, a public static page mirroring `auth/confirmed/page.tsx`. The three causes deliberately share one destination and one message: an expired link and a malformed link call for the same action from the user, and naming which one occurred tells an attacker more than it tells anyone else. The route stays out of `PROTECTED_PATHS` — a signed-out user with a dead link has to be able to read it.

## [Unreleased] - Likes and follows refresh the pages they change (2026-08-13)

The four social mutations wrote to `likes` or `follows` and revalidated nothing, so a like didn't appear in the library and a follow didn't change the feed until a reload. Closes D7, split from D5 during that task.

`like-song.ts` and `unlike-song.ts` name `/library`, `/search`, the concrete `/songs/${songId}` and `/profile/[nickname]`; `follow-user.ts` and `unfollow-user.ts` name `/library`, `/feed` and `/profile/[nickname]`. Follows deliberately omit `/search`, which renders like state but not follow state, and likes omit `/feed`. All four gained the error guard D5 established: wrap the Postgrest `.message`, return `{ error: null }` on success, and revalidate only after the write landed. Both consumers — `use-like.ts:15-19` and `use-follow.ts:15-23` — read `{ error }` and `.message` only, so the change from `PostgrestError` to `Error` is invisible to them.

One rule came out of the work and belongs on the record: **reads never revalidate.** Several read actions were given `revalidatePath` calls mid-task and every one was reverted. A read tells you which page is affected; the mutation is the only place where something actually changed. `attach-is-liked.ts` was the clearest case — a shared helper behind five read actions, it would have revalidated `/search` on every list fetch on every page.

## [Unreleased] - Mutations tell the router what went stale (2026-08-13)

`update-song.ts`, `update-song-cover.ts` and `update-profile.ts` wrote to the database and told Next nothing, so an edited title, a new cover or a changed nickname kept rendering the old value until a hard reload. Closes D5 (`#M6`).

A production build settles what `revalidatePath` is actually buying here: every affected route is `ƒ` dynamic, because each one reads auth cookies. There is no prerendered output and no full-route cache entry to purge. What fires instead is the client half — per the docs, a Server Function calling `revalidatePath` "updates the UI immediately (if viewing the affected path)" and currently also refreshes previously visited pages on next navigation. That immediate refresh is the entire fix; the server-cache semantics are irrelevant on these routes.

One rule now holds across all seven call sites: a path containing a dynamic segment passes `"page"`, a concrete interpolated path passes nothing. `update-profile.ts` names four routes rather than one, since a nickname or avatar change surfaces on `/feed` and `/library` through `ProfileList`/`ProfileGrid` and on `/songs/[id]` through the uploader byline. Relying on the "refreshes everything previously visited" behaviour was rejected — the docs mark it temporary.

`update-song.ts` needed an error guard before it could revalidate at all; it previously returned the raw Postgrest error with no check, so any revalidate placed there would have fired on failed writes. It now guards, preserves the underlying `.message` the way `delete-song.ts` does, and returns `{ error: null }` explicitly.

The four social mutations — like, unlike, follow, unfollow — have the same gap and are logged as D7 rather than folded in here.

## [Unreleased] - The image allow-list stops trusting every R2 account (2026-08-13)

`next.config.ts` allow-listed `hostname: "**.r2.dev"`, with `port`, `pathname` and `search` all omitted. Next treats each omitted key as an implicit `**`, and its own documentation warns against exactly this: "it may allow malicious actors to optimize urls you did not intend." The pattern matched every `r2.dev` subdomain in existence, not merely this project's two, so any Cloudflare account's public bucket was a legal image source. A request to `/_next/image?url=https://pub-<someone-else>.r2.dev/huge.jpg&w=3840` would have been fetched, optimized, cached and served from this app's own domain, on this app's bandwidth. Closes the Leftover item tagged `#L19`.

The allow-list is now two explicit entries, one per public bucket, with the hostname parsed out of the environment at config load: `new URL(process.env.NEXT_PUBLIC_R2_COVERS_URL!).hostname` and the avatars equivalent. `.hostname` rather than `.host` because the latter appends `:port` when a port is present — irrelevant for R2 today, wrong the moment it isn't. Deriving from the environment rather than hardcoding the `pub-<hash>` strings means each deployment pins its own buckets, and a missing variable throws `ERR_INVALID_URL` at config load rather than serving broken images at runtime. Both entries also pin `pathname: "/**"` and `search: ""`, so query-string variants are rejected outright.

Verified against a running dev server through `/_next/image`: both bucket hosts return `404 "url" parameter is valid but upstream response is invalid` — the allow-list clears, then the invented test path 404s upstream — while a foreign `pub-*.r2.dev` host and a covers URL carrying `?x=1` both return `400 "url" parameter is not allowed`.

One consequence pulled in rather than left implicit: `NEXT_PUBLIC_R2_AVATARS_URL` is now build-critical, and `__tests__/integration/infra/env.test.ts` did not check it. That array listed six of the nine R2 variables `lib/r2/client.ts` dereferences with `!`; it now lists all nine.

This narrows the surface but does not make it production-grade. Cloudflare documents `r2.dev` public access as rate-limited and "intended for non-production traffic", so the correct end state is a custom domain on each bucket, collapsing both entries into one. Logged as H17.

## [Unreleased] - The last four eslint errors (2026-08-12)

`npm run lint` carried four errors that `npm run typecheck` cannot see, since both rules are React-semantic rather than type-level. Closes H15 (was six; the two `upload-form.tsx` apostrophes closed 2026-08-07 as H16).

`form-input-file-audio.tsx` and `form-input-file-image.tsx` each called `useDropzone` inside the arrow function passed to `<Controller render={...}>`. `react-hooks/rules-of-hooks` only recognises hook calls inside a capitalised component or a `use*`-named function, and an inline lowercase render-prop callback is neither — even though it returns JSX and React runs it as a component. Both now extract that body into a named `AudioDropzoneField`/`ImageDropzoneField`, leaving the render prop as a single element.

Those two components take one `DropzoneFieldProps<T>`, defined as `Omit<FormInputFileProps<T>, "name" | "control"> & { field, fieldState }`. The first attempt declared two separate but field-for-field identical prop types, which would have reintroduced exactly the duplication the E-bucket work removed earlier the same day.

The two `react-hooks/set-state-in-effect` errors — `use-search-suggestions.ts` and `use-get-song-by-id.ts` — were both an early-return branch resetting state synchronously (`setSuggestions([])`, `setSong(null)`) before the async fetch. The fix follows the rule's own linked guidance: stop writing the empty case to state at all, and derive it at the return line (`suggestions: trimmed ? suggestions : []`). One caveat worth recording: `use-load-song-url.ts` has the same reset-then-return shape and passes lint, which was verified by isolated `eslint --stdin` runs to be a false negative — an unrelated `finally` block in that effect defeats the compiler's flow analysis. It is not a sanctioned pattern and was deliberately not copied.

## [Unreleased] - One BUCKETS map instead of three (2026-08-12)

R2 bucket names existed in three independently-written places: `lib/r2/upload.ts` built its own `BUCKETS` map from `process.env` (the only one with `avatars`), `api/cron/cleanup/route.ts` built a second, narrower one (no `avatars`), and `lib/r2/client.ts` exported `BUCKET_SONGS`/`BUCKET_STEMS`/`BUCKET_COVERS` as separate constants read by `storage.ts`. Closes E2.

`client.ts` now exports one `BUCKETS` map (`songs`/`stems`/`covers`/`avatars`) and a `Bucket` type; `upload.ts`, `storage.ts`, and the cleanup route all import it instead of reading `process.env` themselves.

The cleanup route needed one behavioral adjustment, not just an import swap. Its orphan-scan loop iterated `Object.entries(BUCKETS)`; once `BUCKETS` gained `avatars`, that loop would have hit a bucket with no matching entry in `dbPaths` (which only tracks `songs`/`covers`/`stems` from the DB) and crashed on `validPaths.has(...)` against `undefined`. The loop now iterates `Object.entries(dbPaths)` and looks up the bucket name from `BUCKETS` per key, so `avatars` is excluded — deliberately, not silently: avatar orphan cleanup was never implemented and adding it was out of scope here.

## [Unreleased] - ACCEPTED_AUDIO/ACCEPTED_IMAGE bind to react-dropzone's Accept (2026-08-12)

`lib/constants.ts` used `satisfies Record<string, readonly string[]>` for both accepted-file maps — a structural stand-in for `react-dropzone`'s exported `Accept` type, identical shape but hand-restated rather than imported. Deferred 2026-08-07 (E5) over one concern: `api/upload/route.ts`, a server Route Handler, also reads `lib/constants.ts`, and binding to `Accept` meant importing a UI library into that file.

Resolved by importing the type only: `import type { Accept } from "react-dropzone"`. A type-only import is erased at compile time, so the server route never sees the package at runtime — the dependency-direction cost was never real, only a formal one in the module graph. Both `ACCEPTED_AUDIO` and `ACCEPTED_IMAGE` now `satisfies Accept` instead of the hand-written equivalent, so a future change to dropzone's `Accept` shape would be caught at compile time instead of silently passing a stale structural check.

## [Unreleased] - One nickname schema instead of two (2026-08-12)

`lib/validations/auth.ts`'s `registerSchema.nickname` and `lib/validations/profile.ts`'s `nicknameSchema` had matching length bounds but independently-written character sets — auth allowed `/^[a-zA-Z0-9_.-]+$/`, profile allowed the wider `/^[a-zA-Z0-9_.!@#$%&-]+$/`. A nickname valid at profile-edit time would have been rejected at registration. Closes E3 (`#H9`).

`auth.ts` now imports `nicknameSchema` from `./profile` instead of declaring its own regex — one schema, one place. The wider set was kept rather than narrowed to the intersection: Discord sign-up can hand back nicknames with characters outside the narrow set, and as a music platform, artist names benefit from the extra punctuation. No rule in `docs/reference/CONVENTIONS.md` restricts `lib/validations/` cross-domain imports, so `auth.ts` depending on `profile.ts` was left as-is.

## [Unreleased] - ACCEPTED_IMAGE gets the E1 treatment (2026-08-12)

E1 fixed the audio contract but left `ACCEPTED_IMAGE` (`lib/constants.ts:13`) untouched — no `as const`, no `satisfies`, no mime union, no size constant. `lib/validations/files.ts` kept its own `IMAGE_EXTENSION_BY_MIME`/`ALLOWED_IMAGE_TYPES`, a second source of truth the same three-way drift E1 closed for audio could still open for covers and avatars. Closes E4.

`ACCEPTED_IMAGE` now carries `as const satisfies Record<string, readonly string[]>` and exports `AcceptedImageMimeType`; `MAX_IMAGE_SIZE_MB`/`MAX_IMAGE_SIZE_BYTES` sit beside it, mirroring `MAX_AUDIO_SIZE_MB`/`MAX_AUDIO_SIZE_BYTES`. `files.ts` dropped its independent map and array for an `isAcceptedImageMime(type): type is AcceptedImageMimeType` predicate, the same shape as `isAcceptedAudioMime`. `safeImageExtension` now derives its extension from `ACCEPTED_IMAGE[mime][0]` instead of a separate lookup.

`.webp` was in the old `IMAGE_EXTENSION_BY_MIME` map but not in `ACCEPTED_IMAGE`; rather than add it silently, it was dropped. `ACCEPTED_IMAGE` now accepts only `.jpg`/`.jpeg` and `.png`, matching what dropzone actually offers — re-adding `.webp` support is a separate, deliberate decision, not a byproduct of this cleanup.

## [Unreleased] - One audio contract instead of three (2026-08-07)

The accepted-audio rules existed in three places and no two agreed. `lib/constants.ts`'s `ACCEPTED_AUDIO` listed mpeg/wav/flac/ogg and fed the dropzone; `api/upload/route.ts` kept its own `ALLOWED_AUDIO_TYPES` listing mpeg/wav/flac/**aac** and fed the server check; `upload-form.tsx` told the user to use WAV, FLAC, AIFF or ALAC with a 4GB limit, against an enforced 200MB. A `.ogg` therefore passed the dropzone and failed after a full upload, AIFF and ALAC were advertised and rejected, and the stated size limit was twenty times the real one. Closes E1.

`lib/constants.ts` is now the only source. `ACCEPTED_AUDIO` carries `as const satisfies Record<string, readonly string[]>` and exports an `AcceptedAudioMimeType` union derived from its keys; `MAX_AUDIO_SIZE_MB` and `MAX_AUDIO_SIZE_BYTES` sit alongside it, the second derived from the first so the number appears once.

The route's check is a type predicate rather than an annotated array. `isAcceptedAudioMime(type): type is AcceptedAudioMimeType` narrows `audioFile.type` at both guard sites, which an `Object.keys(...)` array could not do — `Object.keys` returns `string[]` regardless of how the object is declared, so the union would have been decorative. The 413 responses interpolate `MAX_AUDIO_SIZE_MB` instead of hardcoding "200 MB".

Worth being honest about the limit of this: none of it catches a mistyped MIME string. TypeScript has no concept of a valid MIME type, so `"audio/mp3"` in place of `"audio/mpeg"` compiles cleanly and fails only at runtime. What `satisfies` buys is shape validation — a bare string where an array belongs is caught at the constant.

`satisfies Record<string, readonly string[]>` is a structural stand-in for `react-dropzone`'s `Accept`, which has the identical shape. Binding directly to `Accept` was rejected for now because `lib/constants.ts` is read by `api/upload/route.ts`, and importing a UI library into a server route's dependency graph is a worse trade than restating four words. Logged as E5. `ACCEPTED_IMAGE` has none of this treatment yet and is logged as E4.

## [Unreleased] - ShareButton becomes CopyLinkButton, and there is only one of them (2026-08-07)

Two components wrote to the clipboard with no guard: `share-button.tsx:22` and `ui/copy-button.tsx:12`. Both awaited `navigator.clipboard.writeText(...)` and then toasted success unconditionally, so a failure produced an unhandled rejection and a "Link copied" message that was untrue. Neither `onClick` awaited its handler, so nothing surfaced the rejection either. Closes G5 (`#L3`) and H2.

The guard is a `try`/`catch` rather than a `.catch()`, because there are two distinct failure modes and only one of them is a rejection. On an insecure context `navigator.clipboard` is `undefined` per spec, so the expression throws a `TypeError` synchronously; TypeScript gives no warning, since the DOM lib types `clipboard` as always present. On a secure context with permission denied, `writeText` rejects with `NotAllowedError`. A sync throw inside an `async` function becomes a rejected promise, so one `try`/`catch` covers both.

Only one component needed guarding in the end, because the other was deleted. `ShareButton` never called the Web Share API — it built a URL and copied it, which is what `CopyButton` did too, with different chrome. The two were collapsed into `components/social/copy-link-button.tsx`, keeping `ShareButton`'s implementation and taking `CopyButton`'s name. The `Share2` icon became lucide's `Link`, and the label reads "Link".

Three consequences worth recording. The `iconOnly` variant was dropped, so every `Card` now renders the full outline button where a bare round icon used to be — deliberate, not a regression. `ui/copy-button.tsx`'s copy→check animation went with it, judged not worth carrying. And `upload/success/[id]/page.tsx:59` now passes `path={`/songs/${song.id}`}` rather than the page's absolute `songUrl`: the component prepends `window.location.origin` itself, so passing a full URL produced a doubled origin. Both values are `string`, so this was invisible to the typechecker and only caught by reading the call site.

Real sharing is not gone, it was never there. It is now logged as N5.

## [Unreleased] - Stem downloads survive the popup blocker (2026-08-07)

`List` awaited `resolveStemUrl` and then called `window.open`, by which point the user gesture had expired and Chromium and Safari treated the new tab as an unsolicited popup — the same root cause ADR-009 documents for OAuth. The call is now a synthesised anchor: create an `a`, set `href`, click it, remove it. Anchor clicks are not subject to the popup blocker, so the position after the `await` no longer matters. Closes G2 (`#M17`).

The anchor alone is not sufficient, which is why this change reaches into `lib/r2/storage.ts` as well. The `download` attribute is ignored for cross-origin URLs — Firefox and Safari navigate to the resource instead of saving it, and Chrome saves it but discards the supplied filename. Since every stem lives on R2 under a different origin, the attribute was never going to do the work on its own. The fix is `ResponseContentDisposition`, signed into the presigned URL so the header arrives from the file's own origin.

`getPresignedUrl`'s positional `bucket` argument became a `PresignOptions` object carrying `bucket` and `asAttachment`, both optional with a defaulted `{}`. A third positional boolean was written first and rejected at the call site: `getPresignedUrl(path, "stems", true)` says nothing about what `true` means without opening the definition. `resolve-song-url.ts` is untouched — the player must keep streaming inline, and the defaults preserve exactly its old behaviour.

Filename derivation lives server-side only. `list.tsx` sets a bare `download=""` rather than splitting the R2 key itself, so the name is computed in one place; the attribute stays as a fallback if the header is ever absent.

Verified that the SDK emits the parameter only when asked — a presign without the option produces no `response-content-disposition` in the query string, one with it produces `attachment; filename="stem-drums.wav"`. A stem was then downloaded manually in Brave and played back correctly. Brave is Chromium, so the Firefox and Safari behaviour that motivated the header remains unverified.

## [Unreleased] - Optimistic toggles confirm success instead of refreshing (2026-08-07)

`useLike` called `router.refresh()` after every heart click, re-running `getUserSongs`, `getLikedSongs`, `getSuggestedUsers` and `getFollowStatus` on a profile page to redraw a heart the hook had already filled in locally. `useFollow` never did this, so the two halves of the project's one optimistic pattern disagreed. Closes F3 (`#M20`, `#D10`).

The refresh is gone and, by decision, success is no longer silent: both hooks now end on a `toast.success` branched on the toggle direction. This reverses step 3 of the contract in `docs/reference/CONVENTIONS.md:113`, which had read `sukces → nic się nie dzieje, UI już było poprawne` — the reasoning being that optimistic UI has already confirmed the action visually and a toast re-states it. That argument is recorded here rather than silently dropped; the call was that explicit confirmation is worth the redundancy.

Copy is generic — "Added to your library" / "Removed from library", "Following" / "Unfollowed". Named copy was rejected: `useLike` and `useFollow` receive only a `songId` and a `targetUserId`, so a title or nickname would have meant widening both hook signatures and both call-site prop types for cosmetics. An earlier draft interpolated the raw `songId`, rendering a UUID into user-facing text.

`useFollow`'s error branch was missing a `return`, so with a success toast appended a failed follow would have shown the error and "Following" back to back. Both hooks now share the same shape: revert, toast error, return.

## [Unreleased] - The active song is fetched once, not twice (2026-08-07)

`Bar` and `Controls` each called `useGetSongById(activeId)` — two identical Supabase round-trips on every track change, and two independent copies of the same state that could disagree while both were in flight. `Bar` already renders `Controls` and already held the song, so the second fetch became a prop. Closes F2 (`#M16`).

The prop is a required, non-nullable `Song` rather than `Song | null`. `bar.tsx:15` returns `null` unless `activeId && song`, so `Controls` cannot mount without one, and an optional prop would push a guard into a component that has no case to guard against. This also retired the `song?.path ?? null` argument to `useLoadSongUrl` — with a non-nullable prop the optional chain and the fallback both cover nothing.

An early `if (!song) return` above the hooks was tried first and rejected. It placed a conditional return ahead of `useLoadSongUrl` and every `useCallback`/`useEffect` in the component, which ESLint flagged as `react-hooks/rules-of-hooks` in six places. A guard that must sit below every hook to be legal, in a component whose prop cannot be null, is worth deleting rather than relocating.

## [Unreleased] - Playback failures now say what went wrong (2026-08-06)

`Controls` swallowed every `play()` rejection into `setIsPlaying(false)`, so a presign failure, a CORS error and a 404 all presented identically as "the play button does nothing". Closes G4.

Three separate channels report a failure and each needed its own treatment. A rejected `play()` promise is handled by `attemptPlay`, which replaced three bare `.play().catch()` sites; `NotAllowedError` and `NotSupportedError` are silenced there, because the first is the browser refusing autoplay without a gesture — normal, not a fault — and the second is already covered by the element's own error event. `<audio onError>` reads `MediaError.code` and distinguishes network, decode and format, while `MEDIA_ERR_ABORTED` stays silent because it fires when the user themselves changes track. The third is `useLoadSongUrl`'s `error`, which means the presigned URL never arrived and the element was never given a source at all.

The task list estimated two lines. It was five times that, because "a playback failure" is not one condition.

## [Unreleased] - useOnPlay returns a stable callback (2026-08-06)

`useOnPlay` built a new `onPlay` function on every render and passed it to every `Card`. Wrapped in `useCallback`. Closes H5.

No behaviour changes today — the progress-ticker problem this used to cause was fixed separately on 2026-08-04. It is a precondition: `Card` cannot usefully take a `React.memo` while one of its props is a fresh function each render.

## [Unreleased] - Player volume persists across page loads (2026-08-06)

`usePlayer` reset `volume` to `1` on every load. The store is now wrapped in `zustand/middleware`'s `persist`, keyed `musichub-player` in `localStorage`. Closes H11.

`partialize` is the substance of the change, not an optimisation. Its default is `(state) => state`, which would have persisted the whole store. `activeId`, `songs` and `ids` must not survive a reload: song URLs are presigned for one hour (ADR-001), so a restored id resolves to a dead URL. `isPlaying: true` cannot be honoured either, because browsers reject `play()` without a user gesture. `seekTo` and `playPauseRequested` are request flags consumed then cleared, and persisting one fires a phantom seek on the next load. Only `volume` is written.

Hydration mismatch was considered and does not apply. `bar.tsx:15` returns `null` until `activeId && song`, and `activeId` no longer rehydrates, so the volume slider never renders in the server pass.

## [Unreleased] - IMAGE_PLACEHOLDER.COVER is the single cover fallback (2026-08-06)

`getCoverUrl` has been null-safe since it was written, returning `IMAGE_PLACEHOLDER.COVER` for a null path, but two call sites still guarded on `song.image_path` and rendered their own fallback instead — a `Music2` icon in a muted box in `TrackInfo`, and `/no-photos.png` at `opacity-10 grayscale` on the upload success page. Both guards are gone. Closes H12.

This was a design decision rather than the mechanical deletion the task list implied: removing the guards changes what those two surfaces render when a song has no cover. One fallback image across the app was chosen over three different treatments. `public/no-photos.png` is now referenced nowhere; deleting the asset is a separate call.

## [Unreleased] - Discord sign-in button gets a visible label (2026-08-06)

`SocialButton` rendered nothing but an icon, so the button's accessible name fell through to the image's `alt="discord logo"` — a screen reader announced the filename's subject, not the action. `DESIGN.md:78` had specified "Continue with Discord" since the component was written and recorded it as unimplemented. Closes G3 (`#D18`).

Two routes existed. `aria-label="Continue with Discord"` on the `Button` would have fixed the accessible name in one attribute and left the UI untouched. A visible text node fixes the same thing and closes the DESIGN.md gap at once, so that is what shipped: `aria-label` appears nowhere in the final component. `aria-label` is the fallback for controls that genuinely have no visible text, and this one no longer qualifies.

The icon's `alt` went to `""` in the same change, which reads like removing accessibility but is the opposite. With text inside the button, the accessible name is computed by concatenating its contents — leaving the old `alt` in place produced "discord logo Continue with Discord, button". An empty `alt` marks the image decorative and drops it from the accessibility tree, so only the label is announced. This is now a standing rule in `docs/reference/CONVENTIONS.md` → "Dostępność", along with the empty-`aria-label` trap: `aria-label=""` is skipped by the name computation rather than clearing it, which is why an earlier attempt to place it on the `Button` changed nothing.

The provider name comes from a `providerLabels` map rather than interpolation, because Supabase's `Provider` union is lowercase and `Continue with ${provider}` renders "Continue with discord". Tailwind's `capitalize` was rejected: it paints the capital but the DOM text stays lowercase, and the accessible name is computed from the DOM.

`__tests__/unit/auth/social-button.test.tsx` asserted the old `alt` and went red. It now checks the two things that matter — the icon carries `alt=""` and is absent from the accessibility tree, and the button's accessible name is "Continue with Discord". Suite is 101 tests, up one.

`DESIGN.md:78` is updated, and its "Outline variant" line is now marked unimplemented: the component still uses `variant="ghost"`. Out of scope for G3, not fixed here.

## [Unreleased] - songs/Grid renamed to Shelf (2026-08-06)

`components/songs/grid.tsx` rendered a horizontally scrolling strip of cards with arrow buttons — `flex gap-6 overflow-x-hidden`, no grid anywhere — so the name described the wrong layout. Renamed to `shelf.tsx` / `Shelf`, with the one call site in `app/page.tsx` updated. Closes H14.

`row` was the first candidate and was rejected: `card.tsx:20` already uses `"row"` for the search-result list variant, the opposite layout, and two meanings of the word inside `components/songs/` is worse than one wrong one. `carousel` was the runner-up and matches shadcn/ui's vocabulary, but implies looping or auto-advance that this component does not do. `shelf` is Spotify's own term for this exact pattern and collides with nothing in the codebase.

## [Unreleased] - delete-song no longer deletes stems rows explicitly (2026-08-06)

`deleteSong` issued a `stems` delete keyed on `song_id` before deleting the song row. Postgres already does that: the cascade is declared on the foreign key itself, in `create table public.stems` — `song_id uuid not null references public.songs(id) on delete cascade` (`create_tables.sql:27`). It is a property of the constraint, not a trigger or a policy, so it fires automatically whenever the parent row goes. Closes D4 (`#M7`).

Three reasons to drop the explicit call rather than keep it as belt-and-braces. It is a second place to keep in sync — change the cascade in a migration and the application code silently diverges. It is an extra round-trip and an extra failure path that can leave the delete half-done. And the cascade is the more reliable of the two: it runs inside Postgres as part of deleting the parent row, not as a separate client query subject to RLS.

The R2 stem loop is untouched and still required — R2 has no cascade, so the files must be deleted explicitly, which is also why the select at `:24` still pulls `stems(path)`. Order is unchanged and still matters: R2 files first, DB row last, per ADR-002.

## [Unreleased] - add-stem rolls back its R2 upload when the insert fails (2026-08-06)

`addStem` uploaded the stem file to R2 and then inserted the `stems` row, but a failed insert returned without touching R2 — leaving a file no DB row referenced, against the write-R2-then-DB-with-rollback pattern ADR-002 sets out. Closes D2. The typo `"Faile to save stem record"` on the same line went with it.

The shape is copied verbatim from `update-song-cover.ts:54-61`, the closest existing rollback: attempt `deleteFromR2("stems", path)` inside the failure branch, and return the original `insertError` regardless of whether the delete worked. A failed rollback is logged with the orphaned path rather than surfaced, because the delete error is not the one the caller needs — the insert error is — and the cleanup cron reconciles whatever survives.

Two wrong shapes were tried on the way and are worth recording. Putting the rollback after the `if (insertError)` block deletes the file on the success path, leaving a live DB row pointing at nothing. Putting the `return` inside the `catch` means a *successful* rollback falls through and reports `{ error: null }`, so the caller believes the stem saved.

## [Unreleased] - WaveSurfer ref nulled on cleanup (2026-08-06)

`useWaveform`'s init effect destroyed its WaveSurfer instance in cleanup but left `wavesurferRef.current` pointing at the destroyed object. The seek effect guards with `wavesurferRef.current?.seekTo(...)`, and optional chaining only short-circuits on `null`/`undefined` — a destroyed instance is neither, so `seekTo` was still called on it. Closes C5 (`#L10`).

The window is wider than unmount alone. That effect's deps include `height`, `barWidth`, `barGap` and `barRadius`, so any of those changing tears the instance down and rebuilds it, and the rebuild awaits `resolveSongUrl` before assigning a new instance. For the length of that round-trip the ref held a destroyed object while the seek effect stayed live. Nulling in cleanup covers both paths with one line — no separate handling for the rebuild case.

## [Unreleased] - Avatar preview no longer feeds a blob URL to next/image (2026-08-06)

`FormInputAvatar` rendered the newly selected avatar through `next/image` with a `blob:` source. `next/image` needs a local path, an allow-listed remote pattern or `unoptimized`, and `next.config.ts` only allow-lists `**.r2.dev`, so selecting a file threw "Invalid src prop" at runtime. The same object URL was also never revoked, leaking one blob per re-selection and one more on unmount. Closes C4.

Both die with one shape: a plain `<img>` for the preview, and a `useEffect` keyed on `[preview]` whose only job is to return `() => URL.revokeObjectURL(preview)`. The `@next/next/no-img-element` warning is accepted here for the same reason as C3 — a blob URL is not optimisable, so `next/image` buys nothing.

Unlike C3, the URL is not derived with `useMemo`. The `File` lives in the `Controller` render prop's `field.value`, where hooks cannot be called, so `setPreview` stays in the `onChange` event handler — a legal place for `setState` — and the effect carries only the cleanup.

## [Unreleased] - Upload cover preview stops leaking blob URLs (2026-08-06)

`ImagePreview` called `URL.createObjectURL(file)` inside the render body, so every re-render while a file was selected minted another blob URL, and nothing ever revoked them. Each one pins its `File` in memory until the page unloads. Closes C3.

First attempt held the URL in `useState` and did the create/revoke in a `useEffect` on `[file]`, with a `setUrl(null)` reset for the cleared-file case. It worked, but `react-hooks/set-state-in-effect` rejects synchronous `setState` inside an effect body, and the reset line made that unavoidable.

Shipped instead: the URL is derived with `useMemo` on `[file]` — a ternary returning `null` when there is no file, which removes the need for a state reset entirely — and a `useEffect` keyed on that URL does nothing but return `() => URL.revokeObjectURL(url)`. React runs that cleanup before the next memo value is used and on unmount, so exactly one live URL exists at a time.

`next/image` was tried for the preview and reverted: it cannot take a `blob:` source, and `next.config.ts` only allow-lists `**.r2.dev`. The plain `<img>` stays, with its `@next/next/no-img-element` warning accepted — the same conclusion C4 records for the avatar preview.

## [Unreleased] - Volume unmute restores the pre-drag level (2026-08-06)

`Volume` kept the pre-mute level in a `previousVolume` ref that was only ever written inside `toggleMute`. Dragging the slider to zero bypassed that write entirely, so the ref still held whatever the volume was at the last icon click — often the `1` it was initialised with — and clicking unmute jumped to that stale value instead of the level the user had just left. Closes C2.

Two candidate semantics. The first, "last non-zero volume", updates the ref from an effect on every `volume` change and skips zeros; it covers every source of change with a single writer, but the slider fires `onValueChange` per step, so a slow drag to zero leaves the ref on the last intermediate value — restoring `0.01` and appearing not to work at all. Rejected for that reason.

Shipped the second, "pre-drag volume": capture at the start of a gesture rather than on change. There are exactly two gestures that can zero the volume — a pointer press on the slider and a click on the mute icon — and each captures on its own entry point (`onPointerDown` and `toggleMute`'s else branch). Radix's Slider has no `onValueChangeStart`, but `SliderPrimitive.Root` forwards unrecognised props to the DOM, so a plain `onPointerDown` on `<Slider>` lands before the first value change. `onValueCommit` was checked and rejected: it fires with the new value, which is zero, exactly the value that is not wanted.

The `onPointerDown` capture is guarded on `volume !== 0` so that pressing the slider while already muted cannot overwrite the ref with zero and turn the unmute button into a dead click.

The unit test for this is still open under Tests → Waveform / Player Rebuild — `docs/TODO.md` claimed a red test already existed, which was wrong; no player test file has ever been written.

## [Unreleased] - Password re-auth moved server-side, settings route added (2026-08-06)

`use-change-password.ts` verified the old password by calling `signInWithPassword` client-side, which minted a fresh session as a side effect and burned a Supabase sign-in rate-limit slot on every attempt; if the subsequent `updateUser` failed, the user had been silently re-authenticated for nothing. Closes A6.

The intended fix was Supabase Auth's native `current_password` field on `updateUser()` — one atomic server call, no throwaway session. Confirmed against the current `supabase/auth` (GoTrue) source that this only takes effect behind `GOTRUE_SECURITY_UPDATE_PASSWORD_REQUIRE_CURRENT_PASSWORD` (default off), and confirmed against `supabase/cli` source that the CLI exposes no `config.toml` key for that flag — `secure_password_change` maps to the unrelated `GOTRUE_SECURITY_UPDATE_PASSWORD_REQUIRE_REAUTHENTICATION` nonce flow instead. With no local way to turn it on, `current_password` would silently be ignored by GoTrue and the check would do nothing.

Went with the fallback instead: the same `signInWithPassword` + `updateUser` sequence, moved into a new server action (`src/actions/auth/change-password.ts`) so the re-auth happens server-side rather than in the browser. Fixes the actual bug (session clobbering) without depending on a setting this repo can't enable locally.

Bundled with L5: password change moved out of `EditProfileDialog` into its own guarded route, `/profile/[nickname]/settings`, gated by auth + an ownership check (`currentUser.id === profile.id`, same pattern as the existing page's `isOwnProfile`, non-owner treated as `notFound()` — mirrors the fix in commit `8790933`). Linked from `UserProfileButton`. `use-change-password.ts` and `edit-password-field.tsx` are retired; `edit-profile-dialog.tsx` lost its now-single-tab `Tabs` wrapper along with the password tab.

## [Unreleased] - Search filter injection closed, get-songs renamed to get-searched-songs (2026-08-06)

`title` from `searchParams` was interpolated raw into a PostgREST `.or()` filter string — a DSL, not a parameterised value. A search containing a comma (e.g. `drum, bass`) returned HTTP 400 and rendered "Failed to load search results"; a crafted value like `x,uploaded_by.eq.<uuid>` injected an extra filter term into the request. Harmless for disclosure only because `songs` is public-read today; it would have become an authorization bypass the moment the `songs.is_public` toggle (Wave K) lands.

Fixed by wrapping the value in double quotes per PostgREST's reserved-character rule (confirmed against current PostgREST docs — a value containing a reserved character like a comma must be quoted to survive being split into separate filter terms) and escaping any literal `"` inside it first, so the quoting itself can't be broken out of.

`tags.cs.{...}` (the array-contains check for tag search) couldn't be fixed the same way — it's Postgres array-literal syntax with its own undocumented escaping rules, confirmed by checking PostgREST's URL grammar docs directly: there's no confirmed-safe way to embed an arbitrary string inside an array literal alongside the quoted `ilike` values in one `.or()` string. Moved it into its own `.contains("tags", [query])` call instead, which supabase-js serializes as a real array parameter with no manual escaping needed. Both queries run in parallel via `Promise.all` and are merged/deduped by `id` before `attachIsLiked`.

Renamed `get-songs.ts` → `get-searched-songs.ts` (`getSongs` → `getSearchedSongs`) — confirmed via grep that `/search` is its only caller, so the old generic name overstated what it does. `title` renamed to `query` throughout: the URL query key (`search-input.tsx`'s push, `search/page.tsx`'s `searchParams` type), the `Content` component's prop, and the function's parameter. The `songs` table's actual `title` column name inside the `.or()` string is unrelated and unchanged — the two `title`s only shared a name coincidentally.

## [Unreleased] - Image MIME/size validation extracted to lib/validations/files.ts (2026-08-06)

`update-song-cover.ts` and `update-profile.ts` wrote uploaded avatar/cover files straight to a public R2 bucket with no MIME or size check, unlike `api/upload/route.ts`, which already allow-listed both for the song-creation cover path. `image/svg+xml` would have been servable as scriptable content straight from the public `r2.dev` origin if it had slipped through either action.

Both actions also derived the R2 key's extension from `file.name.split(".").pop()` — attacker-controlled input — which let a crafted name like `"a.b/c"` inject a `/`-bearing segment into the key. Fixed by deriving the extension from the file's already-validated MIME type instead (`safeImageExtension`, a MIME→extension map) rather than trying to sanitize `file.name`; there was no legitimate reason to preserve the client's original filename in the first place, since the key is built from `randomUUID()` regardless.

New `lib/validations/files.ts` holds both: `validateImageFile(file)` returns `{ error: Error | null; code?: "FORMAT" | "SIZE" }` — the discriminated `code` lets `api/upload/route.ts` map back to the right HTTP status (415/413) without string-matching `error.message`, while the two server actions ignore `code` and just check `error`, matching their existing `{ error }` return shape. `ALLOWED_IMAGE_TYPES` is derived from `IMAGE_EXTENSION_BY_MIME`'s keys rather than declared as a second, independent list, so the two can't drift out of sync as image types are added later.

`api/upload/route.ts`'s inline `ALLOWED_IMAGE_TYPES`/`MAX_IMAGE_BYTES` consts and validation block were removed in favor of calling the shared function — pure refactor there, no behavior change. Audio validation in that route is untouched, out of scope.

## [Unreleased] - isLiked reaches Discover/Feed, attachIsLiked moved to lib (2026-08-05)

`hooks/songs/use-get-songs.ts` never called `attachIsLiked`, so every card rendered through `grid.tsx` received `isLiked: undefined` and started unliked regardless of the real state — the client-side half of the same gap the song detail page had. Fixed.

Moving `attach-is-liked.ts` from `actions/songs/` to `lib/` was the precondition: it carries no `"use server"` and takes the Supabase client as a parameter, so it was always a plain helper rather than an action, and a `"use client"` hook importing out of the server-actions folder reads as a mistake even though it bundles correctly. Five call sites updated.

Its `SupabaseClient` parameter also gained the `<Database>` generic. Every other client in the codebase carries it (`CLAUDE.md`); this one file had been running its `likes` query untyped since the helper was extracted on 2026-07-30.

The effect took an ADR-015 `cancelled` guard. Deps are `[]`, so out-of-order responses were never possible here — the reason is the second `await`, which widens the window for the component to unmount mid-fetch.

## [Unreleased] - ProfileCard unification, error-handling pass (2026-08-05)

`suggested-user-card.tsx` and `followed-user-card.tsx` were the same card at different sizes, and their two list wrappers differed only by a CSS class and a hardcoded heading. All four are replaced by `profile-card.tsx` (`ProfileCard`, `variant: "row" | "grid"`) plus `profile-list.tsx`/`profile-grid.tsx`, both dumb components taking `title` + `users`.

Named `Profile*` rather than `User*`. `docs/reference/CONVENTIONS.md` says a feature-named folder lets the file drop its prefix, which is why `songs/card.tsx` works — but `social/` names a *domain*, not the entity being carded, so a bare `Card` there would be ambiguous sitting next to follows, likes and shares. `FollowedProfile` was renamed `ProfileSummary` for the same reason: suggested users share that exact 3-field shape and are by definition *not* followed, so the old name lied at half its call sites.

`SuggestedUserCard` fetched `getFollowStatus` per card. `getSuggestedUsers` already excludes everyone the viewer follows when building the list, so every result was `isFollowing: false` by construction — the per-card query was pure waste (`#M13`).

The error-handling half started as one bug — `getSuggestedUsers` returning `{ users: [] }` with no error field — and turned into an audit. Read actions were already near-uniform on `{ data, error }`; the pages were the gap. `feed/page.tsx` let a failed sidebar query blank the entire feed, and fetched suggestions on every visit to render them in a single branch. `profile/[nickname]/page.tsx` had four fetchers and zero checks, with `notFound()` firing whether the profile was genuinely missing or the query had broken. `songs/[id]/page.tsx` had no check at all. All fixed.

Annotating `getSongById`'s return type surfaced two latent mismatches the missing annotation had been hiding: `stems(id, category, path)` contradicting `Song["stems"]` (widened to `stems(*)` — narrowing the shared type instead would have forced every other consumer down to three fields), and `song.profiles` being nullable at four call sites. Worth noting the rule that came out of fixing those: `?? "Unknown"` belongs only where a value is shown to a person, never where it becomes a URL, path or id — `/profile/Unknown` is a link to a 404, and `getAvatarUrl("Unknown")` builds a broken R2 URL when the function already returns a placeholder for `null`.

Still outside the convention and folded into `docs/TODO.md` Up Next #12 alongside the `ActionResult<T>` extraction: `get-user-songs.ts` (bare `Song[]`, no error), `get-profile-by-nickname.ts` (`{ profile, error }`) and `get-follow-status.ts` (`{ isFollowing }`, no error field).

## [Unreleased] - Library fetch errors, getFollowedUsers rename (2026-08-05)

`app/(pages)/library/page.tsx` discarded the `error` from both `getLikedSongs()` and (via `FollowedUsersList`'s self-fetch) `getFollowing()` — a failed fetch rendered identically to "you have no likes"/"you follow nobody" instead of surfacing anything. Both are now checked; the page renders a failure message on either.

Fixing that exposed a bug: `library/page.tsx` had started fetching `getFollowing` for the error check but never passed the result anywhere, while `FollowedUsersList` kept self-fetching the same data independently via a `userId` prop — two queries, and the new error check guarded a value nobody rendered. Fixed by converting `FollowedUsersList` from a self-fetching Server Component into a dumb list component (`users: FollowedProfile[]` prop), the same shape `SongList` already uses — `library/page.tsx` now fetches once and passes data down.

Renamed along the way: `getFollowing` → `getFollowedUsers` (`get-following.ts` → `get-followed-users.ts`, `GetFollowingResult` → `GetFollowedUsersResult`), matching the `Get<Fn>Result` convention used elsewhere (`GetLikedSongsResult`, `GetSongsResult`). `getFollowers` deliberately left unused — reserved for the not-yet-built reverse-relation function in the Feature Backlog. `FollowedProfile` moved to `@/types` so both the action and the list component can import it.

Considered folding `FollowedUsersList` and `suggested-users-list.tsx` (same self-fetch, same discarded-error pattern) into one generic `UserList`, mirroring `SongList`'s reuse across feed/library/profile — deliberately deferred, stays scoped to `docs/TODO.md` item 11 (`UserCard` unification) rather than bundled here.

## [Unreleased] - Likes UX: drop instant-remove-on-unlike (2026-08-05)

`SongList`'s `removeOnUnlike` mechanism (`components/songs/song-list.tsx`, only ever switched on for the liked-songs list at `app/(pages)/profile/[nickname]/page.tsx`) is removed. Previously, unliking a song while viewing your own liked-songs list filtered it out of the local React state immediately, no refetch. Decided against extending that same behavior to `library/page.tsx` too (as `docs/TODO.md` had logged it) — instead adopting SoundCloud's pattern: an unliked song stays visible in a liked-songs list until the next server render/reload, it doesn't vanish mid-session. Simpler mental model, one behavior instead of two inconsistent ones across `profile/[nickname]` and `library`.

Mechanically: `song-list.tsx` no longer needs a local `useState`/`useEffect` copy of its `songs` prop, since nothing ever mutates it — renders straight from the prop now. The `onLikeToggle`/`onToggle` callback thread that fed that filter is now fully removed as dead plumbing across `card.tsx` → `actions.tsx` → `like-button.tsx` → `use-like.ts` (`SongList` was the only caller).

## [Unreleased] - Waveform/Card reuse, play-pause fix, Following tab, small cleanups (2026-08-04)

**Waveform/Card reuse**

`components/songs/waveform.tsx`'s `height`/`barWidth`/`barRadius`/`lazyMount`/`onActivate` are now real props instead of hardcoded — `Card`'s `"waveform"` variant composes `<Waveform>` directly instead of calling `useWaveform` inline, reversing ADR-016's "kept deliberately separate" call (ADR-016 Update still pending, tracked in docs/TODO.md). Fixed along the way: `rootRef` was never attached to any DOM node, so `lazyMount={true}` silently never triggered the `IntersectionObserver` — waveforms never loaded at all under that setting. `Card`'s `"row"` variant's `isActive`/`isPlaying` (lost when the unconditional `useWaveform` call was removed from `Card`) restored via direct `usePlayer` selectors plus a real `song.id === activeId` comparison.

**Play/pause fix**

`usePlayer` gained `playPauseRequested`/`requestPlayPause`/`clearPlayPauseRequest`, mirroring the existing `seekTo` request/consume shape; `Controls` gained a matching effect that toggles the real `<audio>` element. `use-on-play.ts`'s `onPlay` now branches on `id === activeId` — re-clicking the already-active song requests play/pause instead of re-running `setSongs`/`setIds`/`setActiveId`, which was silently restarting playback from 0:00 every time (`docs/TODO.md` leftover `#H7` — the same-song-restart half is now fixed, the `src`-effect/`onended` split half stays open).

**Bug fix**

`resolve-stem-url.ts` was checking the `songs` table instead of `stems` — the DB existence check added to mirror `resolve-song-url.ts` always failed, meaning no stem ever actually resolved. Fixed.

**Auth**

`/auth/update-password` is now guarded in both `src/proxy.ts`'s `matcher` and `lib/supabase/proxy.ts`'s `PROTECTED_PATHS` — this had been reopened after an earlier "accepted risk" call; the decision is now "add the check," applied consistently in both places.

**Social**

`components/social/` flattened back to one level (`follows/`/`suggestions/` subfolders removed). `suggested-users.tsx` split into `suggested-user-card.tsx` + `suggested-users-list.tsx`; `followed-user-card.tsx` + `followed-users-list.tsx` added, wired into `library/page.tsx` as the Following tab.

**Small cleanups**

- `components/player/bar.tsx` — background swapped to `bg-black`, `z-index` added
- `vite.config.ts` — stray `// vitest.config.ts` header comment removed
- Husky pre-commit hook + `lint-staged` added (`eslint --fix` + `vitest related --run` on staged files, then a full `tsc --noEmit`); `env.test.ts` moved from `__tests__/unit/infra/` to `__tests__/integration/infra/`
- `.mcp.json`/`skills-lock.json` untracked from git and added to `.gitignore` — reverses the 2026-07-31 decision to commit them; no AI-tool trace stays in the repo going forward (doesn't remove them from prior history, `kamiljanik98/mh` is public and already has that history pushed)

## [Unreleased] - Review remediation, day 1: schema of record, typed queries, cron safety

First work off the adversarial review at `docs/reviews/2026-07-30-code-review.md` rather than off `docs/TODO.md`'s "Up Next" — the Library "Following" tab was blocked behind a `getFollowing()` that could never return data, so the review's §6 "Today" block came first.

**The migration (`#C2`, `#H1`) — `supabase/migrations/20260731081353_social_schema.sql`**

`follows`, `likes`, the `stem_category` enum + `stems.category`, `profiles.bio` and every grant existed only in the local Postgres; `supabase/migrations/` still created `stems.name text not null` and had never heard of the social tables. A fresh `db reset` or a first deploy produced a database this app cannot run against. All of it is now in one migration.

`follows`' foreign keys were repointed from `auth.users` to `public.profiles` in that same migration, which fixes `#H1` as a side effect — see `docs/adr/ADR-017.md`'s 2026-07-31 Update for why PostgREST embeds require it. `getFollowing()` returns rows now instead of `PGRST200`.

Applied to the local database surgically (FK swap + grants via `psql`, then recorded in `schema_migrations`) rather than via `db reset`, deliberately: the local DB held 27 profiles, 3 follows and 5 likes, and `npm run seed` only restores 3 profiles + 30 tracks — a reset would have destroyed `testuser1`–`testuser15`, hand-made for testing Follow/Feed at volume. The from-scratch replay was already proven by the shadow database `supabase db diff` builds. `db diff` now reports **no schema changes**.

**Everything the `<Database>` generic caught (`#H4`)**

`createServerClient`/`createBrowserClient` were called without the generic in all three factories, so every query in the app returned `any` — which is exactly why the `deleteStem` bug below typechecked clean. The review estimated 2–3 h of fallout; it was **3 errors**, so it was done immediately rather than deferred. What it surfaced:

- `useGetSongs` and `useGetSongById` both selected `profiles!uploaded_by(nickname)` while the `Song` type promises `Pick<UserProfile, "nickname" | "avatar_url">`. `avatar_url` was `undefined` at runtime everywhere those hooks feed a component — including the player's `TrackInfo`, whose artist avatar was silently falling back to the placeholder on every track. The matching server action `get-songs.ts` had been extended with `avatar_url` back on 2026-07-29; the hooks never were. This bug is not in the review — the generic found it.
- `deleteStem`'s fix (below) stopped needing a cast: with the generic, supabase-js knows `songs` is a to-one embed and types it as an object.
- An integration test still inserting `stems.name`, which the regenerated types rejected.

**Bugs fixed**

- `delete-stem.ts:32` read `stem.songs[0].uploaded_by`, but PostgREST returns a to-one embed as an **object**, not an array — verified against the live database. Every call threw `TypeError` before doing anything. Worth recording that the review rated this CRITICAL on the assumption it was reachable: `deleteStem` currently has **no call sites**, so nothing user-facing was broken. Its dead `revalidatePath("/account/me")` (route merged into `/profile/[nickname]` per ADR-004) now targets `/songs/${stem.song_id}`, where stems actually render.
- The cleanup cron authenticated the literal header `Bearer undefined` whenever `CRON_SECRET` was unset, because the value was interpolated straight into the comparison (`#H2`). The secret is now checked for presence first and the route returns 500 rather than running.
- The same cron deleted every R2 object with no matching DB row, with no age filter (`#H3`). Uploads write to R2 *before* inserting the Supabase row (ADR-002), so a file written seconds earlier was indistinguishable from an orphan — the 03:00 job could eat in-flight uploads. Objects younger than 24 h are now never treated as orphans, and an object with no `LastModified` is skipped rather than guessed at.
- The upload success page — the last screen of the main flow — built its cover URL from `NEXT_PUBLIC_R2_PUBLIC_URL`, a variable that exists nowhere in the project (`#M12`); now uses `getCoverUrl()`. Worse and not in the review: `NEXT_PUBLIC_APP_URL` was **never set at all**, so the shareable-link field and the Send button both rendered `undefined/songs/<id>`. Added to `.env.example` and to the local `.env.local`.
- `useLoadSongUrl` and `useGetSongById` had no `cancelled` flag, which ADR-015 and `docs/reference/CONVENTIONS.md` require on every effect-fetch (`#H6`) — fast track-skipping could load the wrong song's URL.

**Housekeeping**

- `.env.example` documented 8 of the 15 variables actually read (`#M11`). Now complete and grouped, with `SUPABASE_SERVICE_ROLE_KEY`, `CRON_SECRET`, `NEXT_PUBLIC_APP_URL`, the stem/avatar buckets and the avatars public URL added. `DISCORD_CLIENT_ID`/`SECRET` were kept despite no `process.env` reference — `supabase/config.toml:342` reads them. `SEED_USER_IDS`, present in `.env.local`, is read nowhere in the repo and was deliberately not documented.
- `npm run gen-types` — the checked-in `database.types.ts` predated the `likes` table (`#D6`).
- Suite green and deterministic: `testTimeout: 30000` in `vite.config.ts` (the auth integration tests round-trip through local Supabase and Mailpit, and blew the 5 s default on a cold run), and the stale proxy test asserting the deleted `/account` guard replaced with a public-path assertion rather than just deleted.

**Agent tooling — Supabase MCP + skills (2026-07-31)**

`.mcp.json` adds a Supabase MCP server pointed at the **local** stack (`http://localhost:54321/mcp`, `read_only=true`, features `development,debugging,database,docs`) — not the hosted Supabase management API, so it needs `supabase start` running and can't touch anything remote. Read-only was deliberate: schema changes stay in `supabase/migrations/`, where the day's `#C2` work just finished putting them, and an agent-issued `apply_migration` would reintroduce exactly the local-only-schema drift that migration fixed. WSL2 rule applies — `localhost`, never `127.0.0.1`.

`npx skills add supabase/agent-skills` installed two skills into `.agents/skills/` (`supabase`, `supabase-postgres-best-practices`), symlinked into Claude Code. Both are third-party and run with full agent permissions; scans were clean at install time (Socket 0 alerts, Snyk Med/Low). The Notion `Tasks` data source (under the `MusicHub` page) gained two properties: `Commit`, a URL, and `Doc ref`, plain text. Neither is written by anything yet — `/sync-notion` doesn't exist. They were added ahead of it because the `/commit` recap now emits a hash-to-task hand-off block that previously had nowhere to land: a Notion row could say a task was done but not which commit did it, so there was no way to verify an `[x]` without hunting the code by name. `Commit` holds a full GitHub URL rather than a bare hash — the repo is public, so a URL is clickable and a hash is not. The mapping is not one-to-one (`6293449` closes two `docs/TODO.md` items), which is a known rough edge. The Default view's `displayProperties` was not touched, so both columns are hidden in the table until someone unhides them. Mapping documented in `CLAUDE.md`.

`supabase/config.toml` — `[auth.rate_limit] email_sent` lowered from 100 to 2, per `docs/reference/CONVENTIONS.md:179`, to stop local auth-email spam. `config.toml` does not hot-reload; this needs `supabase stop && supabase start` to take effect.

`.mcp.json` and `skills-lock.json` are committed; `.agents/` itself is gitignored. The split is deliberate: the config and the lockfile are the reproducible record — anyone cloning gets the same MCP server and can re-run `npx skills add` to the same two pinned hashes — while the skill bodies are third-party vendored source that would otherwise land in a public repo under this project's name. `.mcp.json` carries no secret: it points at `http://localhost:54321/mcp` with `read_only=true`, so a clone without a local stack running simply gets nothing.

`tsc --noEmit` went from 1 error to 0, tests from 99/100 to 100/100, `npm run build` passes. Lint is unchanged at its pre-existing 6 errors / 14 warnings — none of them touched by this work.

## [Unreleased] - Feed & Library: dialog gating instead of redirect

`/feed` and `/library` switched from a hard `redirect("/")` (and, briefly, a middleware-level `PROTECTED_PATHS` bounce — see the entry below, superseded by this one) to the same public-page + gated-interaction pattern the rest of the app already uses (ADR-004/006). New `components/auth/auth-gate.tsx` (`AuthGate`): a small Client Component that auto-opens the sign-in dialog (`useAuthDialog().open()`) on mount and shows a message + "Sign in" button as a fallback if dismissed. Both pages render `<AuthGate />` when `!currentUser` instead of redirecting; `PROTECTED_PATHS` no longer lists either route. `src/proxy.ts`'s `matcher` still runs on both (session-cookie refresh), it just no longer redirects.

Also removed while touching `PROTECTED_PATHS`: the dead `/account` entry. That route hasn't existed since the `/account/me` → `/profile/[nickname]` merge (ADR-004 Update 2026-07-28) — the entry never matched a real request, `CLAUDE.md` already documented it as a known harmless leftover, now actually deleted rather than left as a marker.

## [Unreleased] - Feed & Library: shipped, then debugged

`getFollowedArtistsSongs` (`actions/songs/`), `getFollowing` (`actions/social/`), `/feed`, and `/library` all built out in one pass, plus a new shared `components/songs/song-list.tsx` (`SongList`) replacing the earlier `components/profile/liked-songs-list.tsx` and the originally-planned separate `FeedSongList` — one component for Feed/Library/profile-likes, `Card`'s `row` variant underneath, an optional `removeOnUnlike` prop for the two contexts that need to drop a song on unlike. `Card` itself gained a `postedAt` prop ("posted X ago", via new `lib/format/relative-time.ts`) and an active-playing highlight on the `row` variant, both previously missing. `lib/format-song-meta.ts` + the new relative-time formatter consolidated into `lib/format/`.

**Bugs found and fixed along the way, all 2026-07-30:**

- `lib/format-relative-time.ts` had no fallback for values under 60 seconds — `tsc` caught it (`Function lacks ending return statement`); anything posted less than a minute ago would have rendered `undefined`. Fixed with a `"just now"` fallback.
- `get-followed-artists-songs.ts` was written under `actions/social/` and returned `error: new Error("Not authenticated")` for a logged-out viewer. Both wrong: it returns `songs` rows (table-ownership convention → belongs in `actions/songs/`, moved), and Feed is a public route like Search/Profile — a logged-out visitor isn't an error case, every sibling read action (`get-songs.ts`, `get-liked-songs.ts`, `get-user-songs.ts`) already treats "no user" as `error: null`. Fixed both.
- `get-following.ts`'s return type was `UserProfile[]` (the full `profiles` row) but the query only selects `id`/`nickname`/`avatar_url` — a `.filter((p): p is UserProfile => ...)` type predicate cast past it silently. `tsc` didn't catch this one (predicates aren't checked against the source shape the way normal assignments are). Fixed with `Pick<UserProfile, "id" | "nickname" | "avatar_url">`, matching the same pattern already used for `Song.profiles`.
- `get-liked-songs.ts` picked up a stray `supabase.auth.getUser()` viewer-check that returned an empty list whenever the *viewer* wasn't logged in — but `getLikedSongs` answers "what has `profileUserId` liked," a public-read query (ADR-017) meant to work for anonymous visitors browsing someone else's profile. Removed; likes are public again regardless of who's looking.
- `library/page.tsx` failed the production build outright — `TypeError: e.default.useSyncExternalStore is not a function` — from calling the Zustand `useUser()` hook inside a Server Component (no `"use client"`). Rebuilt as an async Server Component reading the user via `supabase.auth.getUser()`, same pattern as `feed/page.tsx`. A later edit swapped in `@/lib/supabase/client`'s browser client by mistake, which can't read the session server-side either — every request looked logged-out and redirected to `/` regardless of actual auth state. Fixed back to `@/lib/supabase/server`.
- `/library` was added to `src/proxy.ts`'s `config.matcher`, which only controls which requests the middleware runs for — the actual allow/deny list, `PROTECTED_PATHS` in `lib/supabase/proxy.ts`, wasn't updated, so the guard was a no-op. Added `/library` there too.
- `/profile/[nickname]/page.tsx` still imported the deleted `components/profile/liked-songs-list.tsx` after the `SongList` consolidation above — build-breaking, fixed to import `SongList`.

See `docs/adr/ADR-018.md` for why `/library` (private, self-only) and `/profile/[nickname]/likes` (public, per-profile, not yet built) are deliberately two different routes sharing one action, not one route.

## [Unreleased] - 3-Stage Code Review (docs → files → app)

User ran an independent review pass (read docs, read files, tried the running app) rather than continuing feature work, then brought back 29 structure/naming/feature questions covering `actions/`, `types/`, `components/`, `hooks/`, `lib/`, plus a batch of new-feature asks (play history, play count, repeat button, seekbar, banner image, public/private songs, etc.). All 29 answered against the actual code (not against memory of past sessions) in `CODE-REVIEW-2026-07-29.md` — verdict + concrete recommendation + refactor cost per item, since this repo has no dedicated architecture-review doc and the answers didn't fit cleanly into TODO/CONVENTIONS/ADR without diluting all three.

**Found along the way, not part of the original 29 questions:**

- Live bug: every song's `ShareButton` copied `/song/${id}` (singular) — the real route is plural, `/songs/[id]`. Every Share click on a song copied a 404. Fixed by user.
- `docs/reference/CONVENTIONS.md` and this changelog both stated server actions live under `app/actions/` — they never did, the real path has always been `src/actions/`. Corrected throughout both files (and `MILESTONES.md`). Left the three ADRs that quote the same wrong path (`ADR-002`, `ADR-012`, `ADR-013`) untouched — ADRs are the permanent decision record, not living reference docs, so a path-quoting typo inside one doesn't get silently rewritten; if it matters, it gets a dated `## Update` section like every other ADR correction.
- `docs/TODO.md` marked `get-followed-artists-songs.ts` and `get-following.ts` as done (`[x]`) under "v0.9 Social" — neither exists anywhere in the repo. Corrected; both moved into "Up Next" as explicit tasks instead of an assumed-done dependency.
- `docs/TODO.md`'s `get-user-songs.ts` Done entry said "plain select, no `profiles` join" — the function grew a `profiles` join and `isLiked` attachment since that line was written and was never updated. Corrected.

Three concrete pieces of technical debt confirmed by this pass, not yet acted on: (1) `get-songs.ts`/`get-liked-songs.ts`/`get-user-songs.ts` all independently reimplement the same `isLiked`-attachment query — the docs/reference/CONVENTIONS.md "duplicate query = signal to refactor" rule was already being violated 3x; (2) `get-user-songs.ts` sits under `actions/profile/` despite returning `songs` rows, inconsistent with every sibling action's table-based grouping; (3) `hooks/account/` and `lib/validations/account.ts` are the last surviving "account" name in the codebase, a leftover from before `/account/me` was merged into `/profile/[nickname]` (ADR-004). All three, plus the full feature-request backlog (play history/count, repeat, seekbar, banner, public/private toggle, profile layout additions), are itemized with cost estimates in `CODE-REVIEW-2026-07-29.md`.

## [Unreleased] - Design Token Cleanup & Navbar Full-Width Fix

**Hardcoded colors removed**

- `EditProfileDialog`/`EditPasswordField` — removed hardcoded `bg-black`/`text-white` throughout; `DialogContent` now relies on shadcn's own `bg-popover`/`text-popover-foreground` defaults (same hex values as `bg-card`/`text-foreground` in this theme) instead of overriding them, buttons rely on their variant's own text color instead of a forced override

**Dead tokens removed**

- `-hover` CSS variables (`--primary-hover`, `--secondary-hover`, `--muted-hover`, `--accent-hover`, `--destructive-hover`, `--border-hover`) — confirmed unused anywhere in the codebase (never had matching `--color-*-hover` entries in `@theme inline`, so no Tailwind class was ever generated from them) — deleted from `:root` rather than wired up
- `--sidebar-primary-foreground` (`#0a0a0a`) unified with `--primary-foreground` (`#131313`) — the divergence was an oversight from the original dark-mode token fix, not intentional

**Navbar full-width background fix**

- Root cause of the "possibly double-constrained" note from the dark-mode token fix: `app/layout.tsx` wrapped `<Navbar />` inside the page's `max-w-6xl` content wrapper, so even after giving `<nav>` its own background, that background could never exceed 6xl width. Fixed by moving `<Navbar />` (and `<Bar />`) outside the wrapper div, matching the pattern `Bar` already used correctly (full-width outer element, `max-w-6xl` inner content)
- `Navbar`'s background color corrected from `bg-background` (same as the page, effectively invisible) to `bg-card` — `DESIGN.md` itself had an internal contradiction here (its dedicated Navbar section said `neutral-800`/`#262626`, but its general color reference table said `neutral-900`/`#171717` for "navbar, sidebar") — resolved in favor of matching the sidebar, `DESIGN.md` corrected to match

**`SuggestedUsers` layout fix**

- Rewritten from a horizontal-scrolling row of fixed 128px-wide tiles (built for a full-width page section) to a vertical list of compact rows (avatar + name + follow button inline), matching `LikedSongsList`'s pattern — the horizontal layout was clipped inside the profile page's `w-72` sidebar, only showing ~2 of 4 suggestions without an awkward nested scroll

---

## [Unreleased] - Social: Follow & Likes (Real Implementation)

**Schema**

- `follows` (`follower_id`, `following_id`, composite PK, `CHECK (follower_id != following_id)`) and `likes` (`user_id`, `song_id`, composite PK) tables, public-read RLS, insert/delete restricted to own row
- Self-follow blocked at the DB level, not just app-layer — same reasoning as ADR-002's "RLS = DB layer, ownership check = app layer, both required": a constraint in the DB doesn't trust the UI to have prevented it correctly. `follows` visibility is public-read by design (who-follows-who is meant to be visible, same as SoundCloud) — only insert/delete are owner-restricted
- Both tables initially hit `42501 permission denied` on insert — missing table-level `GRANT`, not an RLS violation (same root cause already tracked in Production Blockers for `songs`/`stems`/`profiles`) — fixed ad hoc, still needs bundling into one migration
- Likes shipped before Follow — smaller surface to validate the optimistic-UI pattern (see `docs/reference/CONVENTIONS.md`) on before copying it, since Likes doesn't need a new page the way Follow needs `/profile/[nickname]`

**Server actions / hooks / components** (`src/actions/social/`)

- `follow-user.ts`, `unfollow-user.ts`, `get-is-following.ts`, `get-suggested-users.ts` (random 4 suggestions, excludes self + already-followed, shuffled in JS not SQL `random()`)
- `like-song.ts`, `unlike-song.ts`, `get-is-liked.ts`; `get-liked-songs.ts` (`src/actions/songs/`) returns songs liked by a given profile with `isLiked` computed against the **viewer**, not the profile owner
- `hooks/social/use-follow.ts` / `use-like.ts` — optimistic toggle (local `useState`, revert on error); `use-like.ts` additionally takes an `onToggle` callback (removes from a local list without a refetch) and calls `router.refresh()` so server-rendered lists stay in sync
- `components/social/follow-button.tsx`, `like-button.tsx`, `share-button.tsx`, `suggested-users.tsx` — `follow-button.tsx` replaces the earlier mock (see "Account Settings Merged" entry below, now historical)
- `components/profile/liked-songs-list.tsx` — client list with local state, filters out unliked songs immediately, syncs to prop changes via `useEffect` (a plain `useState(initialSongs)` only initializes once, so without this effect a `router.refresh()` from elsewhere on the page would never reach this list)

**Bug found and fixed:** `getUserSongs`'s batch `isLiked` lookup used `.eq("song_id", songs.map(...))` instead of `.in(...)` — `.eq` against an array never matches, so `isLiked` was always `false` after a refresh even when the DB row existed, and clicking Like then hit `duplicate key value violates unique constraint`. Two reported symptoms (icon not showing liked state + duplicate-key error), one bug.

**Layout:** `/profile/[nickname]` is now two columns — `flex-1` tracklist left, `aside w-72` sidebar right containing `SuggestedUsers` then `LikedSongsList` stacked. Known issue: `SuggestedUsers` still uses a horizontal-scroll layout meant for full page width, doesn't fit the `w-72` column — see `docs/TODO.md`.

---

## [Unreleased] - Card Unification

`components/songs/card.tsx` — `Card`, `Row`, and `WaveformCard` merged into
one component with `variant: "grid" | "row" | "waveform"` (default `"grid"`),
reversing the four-separate-files decision in ADR-016 (see ADR-016 Update
2026-07-28 for full rationale). `components/songs/row.tsx` and
`components/profile/waveform-card.tsx` removed. `ProfileSongCard` is now
fully dead code.

Shared atoms extracted at the same time: `lib/format-song-meta.ts`
(`formatSongMeta`), `components/songs/title-link.tsx` (`TitleLink`),
`components/songs/types.ts` (`SongCardProps`), `components/songs/actions.tsx`
(`Actions` — `LikeButton` + `ShareButton` together).

`components/songs/waveform.tsx` (`Waveform`, used standalone on `/song/[id]`)
stays a separate component — different context, not a fifth `Card` variant.

---

## [Unreleased] - Server Actions Reorganized by Domain

`src/actions/` flattened list split into subfolders by domain: `songs/`,
`stems/`, `profile/`, `social/`. Function names and behavior unchanged,
only file location — e.g. `get-user-songs.ts` is now
`src/actions/profile/get-user-songs.ts`. Documented as a standing
convention in `docs/reference/CONVENTIONS.md`.

---

## [Unreleased] - Layout Bugfix

**Navbar/body shift on Radix overlay open**

- Symptom: opening `UserProfileButton`'s `DropdownMenu` or `EditProfileDialog` shifted the entire page left and clipped `SearchInput`
- Fix: moved `mx-auto max-w-6xl` off `<body>` onto a wrapper `<div>` inside it (`app/layout.tsx`); removed a dead, invalidly-nested `html[data-scroll-locked]` rule in `globals.css`. Full root-cause mechanism and the new standing rule ("never center `<body>`/`<html>` directly") are in `docs/reference/CONVENTIONS.md` → Layout, not repeated here

## [Unreleased] - Account Profile Redesign

**Components**

- `EditProfileDialog` — single RHF form + modal for nickname/bio/avatar, replaces per-field inline edit (`EditableField`, `EditableTextareaField`, `EditAvatarButton`) on `/account/me`
- `components/form/form-textarea.tsx`, `components/account/form-input-avatar.tsx` — new generic RHF-based inputs backing the dialog
- `components/ui/textarea.tsx`, `components/ui/dialog.tsx` — shadcn primitives added
- `components/account/edit-password-field.tsx`, `app/(pages)/account/me/page.tsx` rebuilt around the new dialog

**Server Actions**

- `src/actions/update-profile.ts` — single action handling nickname uniqueness check, bio empty-string-to-`null` normalization, and R2-first/DB-update/rollback avatar upload (ADR-002 pattern), consolidating what were three separate actions (`update-nickname`, `update-bio`, `update-avatar`)
- `hooks/account/use-update-profile.ts` — syncs `useUser` store optimistically, lowercases nickname client-side to mirror server normalization
- `hooks/account/use-change-password.ts` — re-authenticates via `signInWithPassword` before `updateUser({ password })`

**Known issues**

- Hardcoded `bg-black`/`text-white` in `EditProfileDialog` and several `text-white` instances in the rebuilt account page bypass design tokens — should be `bg-card`/`text-foreground`/`text-muted-foreground`
- Old per-field components/actions discussed as safe to delete (ownership scope is identical — `getUser()` + `eq("id", user.id)` in both old and new code) — **confirmed deleted**

**Documentation**

- `docs/reference/CONVENTIONS.md` — inline-edit pattern marked as superseded on `/account/me`, noted as still subject to change

---

## [Unreleased] - Waveform Card

**Components**

- `components/profile/waveform-card.tsx` — `wavesurfer.js`-based waveform, one independent instance per card for visualization only (`interact: false`); the single global `<audio>` in `Controls` remains the only element that plays sound
- Click-to-seek routes through the store (`requestSeek` → `Controls` consumes `seekTo`), active only when the card's song is currently playing
- Lazy-mounted via `IntersectionObserver` (`rootMargin: 200px`)
- **Note:** file lived in `components/profile/`, not `components/songs/` as originally scoped — resolved later by deleting it entirely, folded into `Card`'s `"waveform"` variant (see "Card Unification" above)

**Store (`hooks/player/use-player.ts`)**

- Added `isPlaying`, `progress`, `duration`, `seekTo`/`requestSeek`/`clearSeekRequest`
- `Controls` publishes all of the above from the native `<audio>` element (`onPlay`/`onPause`/`onEnded`/`onLoadedMetadata`/`onTimeUpdate`) and consumes `seekTo` requests

**Bugfixes**

- R2 bucket `songs` missing CORS policy — presigned URL fetch succeeded at network level but was blocked client-side by `fetch()`-based `fetchBlob` inside wavesurfer (native `<audio>` isn't subject to the same restriction). Fixed via `AllowedOrigins` in bucket CORS policy

**Rejected approaches**

- Mounting wavesurfer directly on `Controls`'s `<audio>` (`media` option) — only visualizes the one active track, not every list card
- Fully fake waveform (`lib/waveform.ts`, deterministic bars from `song.id` hash) — kept as fallback pattern, unused once wavesurfer proved viable

---

## [Unreleased] - Account Settings Merged Into Public Profile

**Decision**

- `/account/me` removed entirely, merged into `/profile/[nickname]` — see ADR-004 Update 2026-07-28
- `isOwnProfile` computed server-side in `page.tsx` (`currentUser?.id === profile.id`) via `supabase.auth.getUser()`, no client-side flash

**Components**

- `EditProfileDialog` — added `Tabs` (Profile / Password) via shadcn `tabs`; `EditPasswordField` now renders inside the Password tab instead of living on a separate page
- `components/social/share-button.tsx` — new, copies `/profile/[nickname]` to clipboard via `navigator.clipboard`, `sonner` toast confirmation
- `components/social/follow-button.tsx` — new, **mock only** at this point: local `useState` toggle, no server call, no revert logic. Props (`profileUserId`, `isFollowingInitially`) already match the intended `use-follow.ts` optimistic contract (see `docs/reference/CONVENTIONS.md`) — **superseded**, real implementation shipped in "Social: Follow & Likes" above
- `UserProfileButton` — "Account settings" link → `/profile/[nickname]` (was `/account/me`); `DropdownMenu` given `modal={false}` (see Layout Bugfix above)

**Routing**

- `proxy.ts` matcher — `/account/:path*` removed, only `/upload` remains guarded
- `app/(pages)/account/` deleted

---

## [Unreleased] - Public Profile Page

**Server Actions**

- `src/actions/get-user-songs.ts` — `getUserSongs(userId)`, plain select, no `profiles` join (profile info shown once at page top, not per-card)

**Pages / Components**

- `app/(pages)/profile/[nickname]/page.tsx` — public Server Component, resolves `nickname` → profile via lowercase match, `notFound()` on miss
- `components/profile/profile-song-grid.tsx` — client wrapper for `useOnPlay`, renders `WaveformCard`
- `components/profile/profile-song-card.tsx` — built as a non-waveform alternative, currently unused

**Decision**

- Route stays `/profile/[nickname]`, not `/account/[nickname]` — `proxy.ts` matcher guards the entire `/account` tree per ADR-004, a public route nested there would need a matcher exception

---

## [Unreleased] - Search Results Polish

**Components**

- `components/search/row.tsx` (`Row`) — compact horizontal result item (cover, hover-play, title, artist avatar+nickname, metadata), replaces rendering `Card` in a vertical list
- `components/search/content.tsx` — wired to `Row`
- `components/ui/input.tsx` — `cva` variants (`underline` default, `filled`), enables per-context styling without className collisions
- `SearchInput` — search icon added, `filled` variant, dropdown selection now correctly updates the input value (previously only navigated, leaving stale text in the field)

**Data**

- `Song.profiles` (shared type) extended with `avatar_url` (previously `nickname`-only by design, reversed after deciding search results should show artist avatars without a dedicated type)
- `src/actions/get-songs.ts` — `select` extended to `profiles!uploaded_by(nickname, avatar_url)`
- `hooks/songs/use-get-song-by-id.ts` — same join added, feeds `TrackInfo`

**Layout**

- `<body>` given `max-w-6xl mx-auto` — needs visual verification that `Navbar`/`PlayerBar` full-width backgrounds aren't now double-constrained by their own internal `max-w-6xl` wrappers

---

## [Unreleased] - Songs Components Polish

- `Card` — hover play overlay (`opacity-0` → `group-hover/card:opacity-100`), artist nickname as `Link` to `/profile/[nickname]` (avatar intentionally not shown here, kept in `Row`/`TrackInfo` only)
- `Grid` — simplified, removed scroll-arrow visibility tracking (`useState`, second `useEffect`, scroll listener) — arrows always render, clicking past the scroll bound is a no-op
- Nested `group`/`group-hover` collision fixed via named groups (`group/card`, `group/row`, `group/scroll`) — a shared unnamed `group` on a parent scroll container was triggering hover state on every card simultaneously

---

## [Unreleased] - Database Seeding

**Script**

- `seed/seed.ts` (`npm run seed`) — clears R2 buckets + `songs`/`stems` tables + all `auth.users`, recreates 3 fixed profiles (`admin`, `moderator`, `jukka`) via `auth.admin.createUser` + `profiles.upsert`, seeds 30 tracks with randomized metadata across the three users
- Requires `SUPABASE_SERVICE_ROLE_KEY` (not committed)

**Decisions**

- Profiles created via `auth.admin.createUser`, bypassing `use-register.ts`'s lowercase-on-write (ADR-007) — nicknames lowercased explicitly in `SEED_PROFILES`
- Titles from adjective+noun word lists; bpm/scale/genre randomized independently, not musically coherent — accepted at seed scale

**Bugfixes found during setup**

- `service_role` missing table-level grants (`42501`) — same root cause as uncommitted `handle_new_user()`, both should be one migration

---

## [Unreleased] - Player Rebuild (Spotify-style)

**Components**

- `Controls` — lucide icons, circular primary play button, `<audio>` element (previously missing from JSX despite `audioRef` usage), `isPlaying` synced via native audio events
- `TrackInfo` — cover fallback box, avatar+nickname row
- `Volume` — icon-by-level (`VolumeX`/`Volume1`/`Volume2`), click-to-mute remembering pre-mute volume via `useRef`
- `Bar` (formerly `PlayerBar`) — `bg-foreground` → `bg-card` fixed (was rendering as a white strip), hides on `/upload` via `usePathname`

---

## [Unreleased] - Dark Mode Token Fix

- Removed `.dark { ... }` block and `@custom-variant dark` — no light/dark toggle exists, DESIGN.md specifies dark-only. `:root` now holds DESIGN.md hex values directly instead of oklch approximations
- `-hover` token variables (`primary-hover`, `secondary-hover`, etc.) added to `:root` — currently dead, see `docs/TODO.md` Dev Tooling section for status
- `--primary-foreground` changed `#0a0a0a` → `#131313`; `--sidebar-primary-foreground` still `#0a0a0a` — divergence not yet confirmed intentional

---

## [Unreleased] - Image Placeholder Cleanup

- `lib/constants.ts` — `IMAGE_PLACEHOLDER` const (`COVER`, `AVATAR`)
- `getCoverUrl`/`getAvatarUrl` (`lib/r2/public.ts`) — `null`-safe, reference `IMAGE_PLACEHOLDER`
- `lib/r2/upload.ts` — `avatars` bucket added to `BUCKETS`, `uploadAvatar` helper
- `lib/r2/client.ts` — `R2_AVATARS_URL`
- Placeholder files renamed: `profile-img-placeholder.jpg` → `avatar-placeholder.jpg`, cover placeholder → `cover-placeholder.jpg`

---

## [Unreleased] - Delete Actions Fixes

- `deleteSong` — first `catch` block was logging the wrong bucket path (`covers/...` instead of `songs/...`) for R2 `songs` bucket delete failures — fixed; all catch blocks now log the underlying error, not just the path; error results wrapped consistently in `new Error(...)`
- `deleteStem` — same error-wrapping consistency fix, `revalidatePath` added (currently points at `/account/me` as a placeholder — no page yet renders per-song stem management)

---

## [Unreleased] - Account Editable Fields

**Nickname**

- `components/account/editable-field.tsx` — generic inline-edit, `src/actions/update-nickname.ts`, `hooks/account/use-update-nickname.ts` — **superseded by Account Profile Redesign above**

**Bio**

- `profiles.bio` column (`text`, nullable, `CHECK (char_length(bio) <= 800)`)
- `lib/validations/account.ts` — `bioSchema`
- `src/actions/update-bio.ts`, `hooks/account/use-update-bio.ts`, `components/account/editable-textarea-field.tsx` — **superseded by Account Profile Redesign above**

**Password**

- `hooks/account/use-change-password.ts` — re-authenticates via `signInWithPassword` before `updateUser({ password })`
- `components/account/edit-password-field.tsx`

**Email**

- Deferred — open decisions logged in `docs/TODO.md` (Polish / Deferred section)

**Avatar**

- R2 bucket `avatars`, `uploadAvatar`, `getAvatarUrl` with null-fallback — **`update-avatar.ts`/`use-update-avatar.ts`/`edit-avatar-button.tsx` superseded by Account Profile Redesign above**

**TypeScript**

- `Song`, `Stem`, `UserProfile` confirmed fully derived from `Database["public"]["Tables"]`

**Bugfix**

- `EditableTextareaField` Cancel button was missing — fixed (now superseded regardless)

---

## [Unreleased] - Upload Form Polish

- Stem category picker — native `<select>` → shadcn `Select`, inline `Controller`
- `FormInputFileStem` — dropzone removed, plain `<input type="file">`, see ADR-010 Update 2026-07-24
- Known trade-off: client-side stem file size validation lost, server-side only
- Upload button still uses `bg-emerald-500 text-black` — outside design tokens, not yet fixed

---

## [Unreleased] - Cron Cleanup

- Orphaned file cleanup upgraded log-only → active deletion, `DeleteObjectCommand`, see ADR-002 Update 2026-07-24
- `middleware.ts` matcher narrowed to `/account/:path*`, `/upload`
- `proxy.ts` redirect target fixed (`/auth/login` didn't exist) → `/`

---

## [Unreleased] - v0.6 Search

- ADR-013 — `getSongs(title?)` as server action + SSR, not an extension of `useGetSongs`

---

## [Unreleased] - v0.5 Song Management (Stems)

- `stems.category` enum replacing `stems.name`, see ADR-012
- `add-stem.ts`, `delete-stem.ts` server actions
- Stems folded into upload transaction, see ADR-002 Update 2026-07-22
- R2 token bucket permissions bugfix, recovery email template bugfix

---

**Testing backfill (v0.2 Auth)**

- Unit coverage for `UpdatePasswordForm`, `LoginForm`, `ForgotPasswordForm`, `RegisterForm`

---

## [0.4.0] - v0.4 Player

(unchanged — see prior entries)

---

## [0.3.0] - v0.3 Upload

(unchanged — see prior entries)

Milestone history v0.1–v0.8 lives in `docs/history/MILESTONES.md`.