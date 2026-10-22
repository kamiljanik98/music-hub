# Changelog

**Bugfixes**

## [Unreleased] - Responsive pass, and a Discover shelf that means what it says (2026-08-23)

The app stopped being desktop-only. Five passes, in order of how badly each
broke on a phone.

The navbar collapses to icons under `md`: the wordmark hides below `sm`, Feed
and Library become `Disc3` and `FileMusic`, and a search icon swaps the whole
row for a full-width input with a close button rather than trying to fit a
search box beside everything else. Upload becomes an icon too. Desktop is
untouched, and the nav links carry a separate `navLink` class that strips the
circular chip at `md` so they stay plain text that goes lime on hover.

The player bar runs `grid-cols-[minmax(0,1fr)_auto]` on mobile and
`md:grid-cols-3` above it, with `md:contents` dissolving the mobile wrapper so
`Controls` and the right cluster become direct grid children again at desktop.
Volume moves into the expander panel on phones, where the hardware buttons own
it anyway.

Everything else was fixed sizes meeting a 375px viewport: seven display headers
went `text-4xl md:text-6xl`, the waveform card stacks below `sm` with a 96px
cover instead of 152px, shelf cards narrow to 160px, and row gaps and padding
tighten across `LikedRow`, `FeedRow` and `search-row`. Profile, playlist and
following avatars all halve on mobile.

The Discover shelf was showing tracks from a month ago under a heading that says
"this week". It sliced the whole catalogue newest-first and took ten, so a thin
week got padded with old uploads while the counter reported the weekly number —
content and count describing different sets. It now filters on the existing
`isNew` flag before slicing, and carries an empty state for a week with no
uploads. Its header picked up the library treatment: a mono eyebrow counting
today's uploads, the display title, and a `[003]` counter. `useGetSongs` gained
an `isToday` flag to feed that eyebrow.

`InfoSection` was restyled to the same header block, so the two lower sections
of the landing page share one shape. Both landing CTAs now seed
`/search?query=synthwave` — the "See how artists use it" link was still going to
a bare `/search` and landing on an empty prompt. Banners grew: the promo banner
takes a `min-h` that scales to 460px rather than being sized by its own text,
and the profile banner went `h-72 md:h-96`. The navbar's bottom border dropped
to `white/6` and lost the inset highlight that was drawing a second hairline,
while the search input gained a visible border, a darker fill, and a lime
focus ring.

## [Unreleased] - Promo banner, seeded search, and a home page with room to breathe (2026-08-23)

The landing page gained a promo banner for a featured playlist —
`getPromoPlaylist` takes `NEXT_PUBLIC_PROMO_PLAYLIST_ID` when set, otherwise the
newest public playlist owned by a `pro` or `admin` user *that has at least one
track*. That last clause is load-bearing: without it the query picked an empty
playlist and the banner silently hid itself. Artwork is `public/banner.jpg` with
an optional looping video over it, and the rounded corners needed their own
`overflow-hidden rounded-[inherit]` plus a `translateZ(0)` on the media wrapper.
Video elements composite on the GPU, and a rounded *ancestor* clips a composited
layer without antialiasing — that is the stair-stepped corner, not a bad radius.

Search stopped pretending to be the home page. The empty `/search` state was
briefly showing the same "Fresh tracks" shelf as the landing page, which made
the two pages indistinguishable. It is back to a plain prompt, and the landing
CTA now seeds a real query (`/search?query=synthwave`, the largest genre in the
catalogue) so a signed-out visitor lands on results rather than an empty box.
`SearchInput` reads the `query` param to prefill, and it syncs during render
rather than in an effect, because the navbar lives in the layout and stays
mounted across client navigations — a `useState` initialiser alone would never
re-run.

Home page spacing moved onto the `--mh-section-gap` token instead of per-section
padding that had been set three different ways. The hero now fills the fold
(`min-h-[calc(100vh-9rem)]`), so the promo banner is something you scroll to.

Smaller corrections, all from looking at the thing rather than the code: the
grid card's play button moved to the bottom-left and grew, its details row was
cut back to genre and a bare relative time (`21h ago`, no "posted") justified to
opposite edges, the title and nickname tightened up, and copy-link left the card
via a `showCopyLink` prop on `Actions` — defaulted true, so no other surface
changed. Search result rows lost their card background and gained column spacing.
Playlist visibility became a `Switch` rather than a checkbox, which needed a new
`ui/switch.tsx` on `radix-ui`'s already-installed `Switch`. Playlist boxes were
restyled to match the Following tab's cards, the playlist detail page gained a
back link to the owner's collection, and "Add to playlist" was added to the song
details page, where it had been missing entirely. Navbar dropped the icons from
the Feed and Library links.

The player bar's timestamps now align with the controls above them: elapsed time
is left-aligned to the cover art's edge, duration right-aligned to the repeat
button's. The earlier fix for this inset the transport row by `px-12` instead,
which solved the alignment from the wrong end and made the row narrower than the
bar.

## [Unreleased] - Playlists, listening history, and a feed that stands on its own (2026-08-23)

Playlists shipped end to end. `playlists` and `playlist_songs` land in
`20260823193000_playlists.sql`, with the owner FK pointing at `public.profiles`
rather than `auth.users` — ADR-017's rule, and the reason a profile embed on the
table resolves instead of failing with `PGRST200`. Ordering is a plain `position`
integer with a non-unique `(playlist_id, position)` index: adding appends at
`max(position) + 1`, and reordering is deliberately not built, because a unique
index would have made any future swap need a deferrable constraint. RLS follows
the `plays` shape, with `(select auth.uid())` wrapped so it evaluates once per
query rather than once per row. Playlist covers were considered and dropped —
no R2 work, no second upload path.

The player needed nothing. `usePlayer` already held an ordered `ids` queue and
`useOnPlay` already loaded arbitrary song arrays into it, so "play this playlist"
was free.

Listening history finally has a surface. The `plays` table has existed since
`20260823020000`, and `recordPlay` was already writing to it; what was missing
was anywhere to read it. `/profile/[nickname]/history` is owner-only in both
directions — the tab hides for other viewers, and the page re-checks server-side,
because the table's `select own` policy is the real boundary.

Nicknames stopped breaking profile and library loads. Next 16 hands
`params.nickname` to the page still percent-encoded, so `sukama$ter` arrived as
`sukama%24ter` and `.eq("nickname", ...)` matched nothing — `PGRST116`, rendered
as "Failed to load profile". Two changes, because either alone is insufficient:
`getProfileByNickname` decodes at the boundary, covering all five param call
sites at once; and `nicknameSchema` dropped `!@#$%&` from its regex, because no
amount of decoding recovers a nickname containing `#` — the browser treats it as
a fragment and never sends the tail. `20260823190000_nickname_url_safe.sql`
normalises existing rows and adds a matching CHECK.

The feed became a real page. Following nobody no longer shows an apology: a new
`pro` role — treated as `admin` for now, since `profiles.role` is plain text with
no CHECK — backs a featured-posts fallback. Suggested users moved out of that
empty state into a permanently sticky rail. Posts gained a density toggle
persisted in `localStorage` through `useSyncExternalStore`, which is what a
`useState` + effect pair could not do without either a hydration mismatch or a
setState-in-effect that eslint rejects. Compact mode uses a purpose-built
`FeedRow` rather than the borrowed `LikedRow` it started as, so row density loses
the cover size and wraps description and tags, but loses no information.

Gated actions now behave consistently for signed-out visitors. `useRequireAuth`
sits inside `use-like` and `use-follow`, which covers every `LikeButton` and
`FollowButton` call site at once rather than per component, and the landing
page's "I make music" opens the register dialog instead of bouncing off the
`/upload` redirect guard.

Two overlay bugs turned out to share a cause and a fix. Toasts were invisible
under the navbar and the auth modal not because sonner's z-index is too low — it
is `999999999` — but because `<Toaster>` sat inside a `relative z-10` wrapper
that capped it. It moved out of that stacking context in both layouts. The
track owner menu shifted the whole page left when opened, which is Radix's
scroll-lock compensation landing on top of the `scrollbar-gutter: stable` that
`globals.css` already sets; `modal={false}` removes the lock entirely, which is
correct for a menu that never needed one.

Unliking a track on the Likes tab, or unfollowing on the Following tab, no longer
makes the row vanish mid-decision. Both actions were revalidating the very page
the user was standing on. Those two `revalidatePath` calls are gone; the rest
stay, so the list is correct again on the next visit.

## [Unreleased] - Song rows split by surface, counts surfaced (2026-08-23)

The profile Likes tab and search results stopped sharing one `Row` component.
They are now `search-row.tsx` and `liked-row.tsx`, and the `variant`/`postedAt`
props are gone. Full reasoning, and why this does not contradict `Card`'s
variants, is in ADR-016's 2026-08-23 update.

Alongside the split, the read paths for two counts landed. `getLikedSongs` and
`getSongById` both carry a `likes(count)` aggregate in their existing select, so
no extra round trip; the array-of-one shape PostgREST returns for an aggregate
embed is flattened in the action rather than leaking into components. The song
details page shows plays and likes, the Likes tab shows both per row, and the
aside Likes panel dropped its metadata and posted-at line in favour of the same
pair, pinned right so a long nickname truncates instead of shoving them around.

Suggested users gained follower and track counts the same way — but that embed
needed `follows!following_id(count)` rather than `follows(count)`, because
`follows` has two foreign keys to `profiles` and the ambiguous form fails with
`PGRST201`. Worth remembering for any future aggregate on that table.

Artist names in both row components and the aside panel are now links to the
profile, styled like `TitleLink` — `hover:text-primary hover:underline`. They
were plain text before, which made the one interactive-looking thing in the row
the only thing that was not a link.

## [Unreleased] - Auth forms validate on submit, not on blur (2026-08-23)

Login, register and forgot-password moved from `mode: "onBlur"` to `mode: "onSubmit"` with `reValidateMode: "onChange"`. Opening the sign-in dialog and tabbing past an untouched field no longer paints it red, which is what it did before: the browser's saved-value dropdown appears over an empty email input, the user dismisses it, focus leaves, and an "Invalid email address" error lands on a field they never filled in.

The new contract is the ordinary one — nothing complains until you ask it to, and once you have asked, the error clears the moment you fix it. The three unit test files were rewritten to match; they had encoded the blur behaviour as the specification.

Rewriting them turned up something the old tests had hidden. The email inputs are `type="email"`, so an invalid address is caught by the browser's own constraint validation before the form ever submits, which means zod's `"Invalid email address"` message in `lib/validations/auth.ts:11` is now unreachable for that field — the user gets the native bubble instead. Confirmed in jsdom: `validity.typeMismatch` is `true`, `aria-invalid` stays `false`, no error text renders. It was reachable under `onBlur` because blur validation does not go through form submission at all. Whether to keep the native bubble or add `noValidate` and let zod own the message is an open decision, tracked in `docs/TODO.md`.

This deviates from `docs/reference/CONVENTIONS.md`, which says `useForm()` is always `mode: "onBlur"`. The rule stands for forms whose fields are filled in deliberately; these three are entered through a dialog that can open focused and empty, and that is the case the rule did not anticipate.

## [Unreleased] - Search results are capped (2026-08-23)

`getSearchedSongs` takes an optional `limit`, defaulting to `SEARCH_LIMIT = 24`, applied after the song and tag result sets are merged and deduplicated. An empty query short-circuits and returns nothing instead of falling through to an unfiltered select.

Before this, `/search` returned every matching row. With 32 songs in the local database that looked fine; a single letter matched 31 of them, and nothing about the query got slower as the table grew — it just returned more.

The cap is applied after the merge rather than as a `.limit()` on each query, because two capped queries merged and deduplicated give an unpredictable total. Profile matches count against the same budget, which is what makes the number on screen match the number promised — a single letter returning "more than 24" turned out to be 24 songs plus 8 users, each capped separately.

What this does not add is paging. Rows past the cap are unreachable rather than on a second page, and tag matching is still whole-tag, so `ana` never finds `analog`. Both are in `docs/TODO.md`.

## [Unreleased] - Playback speed, a draggable seekbar and play recording (2026-08-23)

The player bar became two tiers. Compact holds cover, title, artist, controls and the seekbar; the expandable strip holds the speed control. The old details panel was removed rather than moved — it showed metadata nobody was reading mid-track.

Playback rate had a control but no effect: nothing ever assigned to the audio element. `Controls` now sets both `defaultPlaybackRate` and `playbackRate` in an effect keyed on `[playbackRate, url]`. Both, because setting only `playbackRate` is lost when the element loads a new source, which is exactly what happens on the next track.

`recordPlay` and the `plays` table landed alongside, with a 15-second threshold so a skipped track does not count as a listen. The write path is **not** wired up: `startPlayTimer` and `clearPlayTimer` in `controls.tsx` are defined and never called, so no play is currently recorded. The read side — a listening history surface and a visible play count — is not built either. M1 and M2 stay open.

## [Unreleased] - Focus mode stops inheriting the app chrome (2026-08-23)

`/upload` and its success page moved out of `(pages)` into a new `(focused)` route group. Everything that was in the root `app/layout.tsx` — navbar, footer, player bar, auth modal, toaster, user provider — moved down into `app/(pages)/layout.tsx`, so the root layout is now html/body plus the two atmosphere blobs and nothing else. `(focused)/layout.tsx` opts into its own centred column instead.

The reason is that upload is a form you finish, not a page you browse from. A player bar pinned to the bottom of a five-field form is a distraction, and the navbar's search input invites you to leave halfway through.

Getting the scroll right took longer than the split did. Three separate elements were suspected before the actual culprit turned up: `(focused)/upload/view.tsx` still carried `min-h-screen` plus its own background and padding from when it was a standalone page, which fought the layout above it and produced both a dark panel over the step gradients and a second scrollbar. It is now a bare `flex w-full flex-1 flex-col` wrapper and the layout owns the sizing. The lesson worth keeping: when a layout change misbehaves, read every file in the route segment before theorising about the ones you already know.

`scrollbar-gutter: stable` on `html` stops the page shifting horizontally when a scrollbar appears and disappears between routes. `both-edges` was tried first and reserved a visible band on the left — wrong tool.

## [Unreleased] - Genre is a closed list, tags stay open but capped (2026-08-23)

Genre became a select over sixteen values in `lib/constants.ts`; tags stay free text, capped at eight per track and twenty-four characters each, lowercased and de-duplicated on parse. Both the upload route and the edit dialog validate against the same schema.

The question was whether to leave tags fully open, allow exactly one, or split the field. Splitting won because the two jobs are different: genre is the axis you browse and filter by, and it only works if everyone spells it the same way, while tags are the long tail — "lofi", "made-on-a-phone", "for-my-dog" — and their value is precisely that nobody governs them.

`tags` is validated with `.refine()` rather than `.transform()`. A transform changes the schema's output type, which changes `SongFormValues`, which breaks the react-hook-form `defaultValues` shape the two forms already share. The normalising lives in `parseTags`, called at the boundary instead.

The database backs the cap independently. A `CHECK` constraint cannot contain a subquery, so `tags_within_limits(text[])` is an immutable helper function the constraint calls — `supabase/migrations/20260823001500_song_tags_limits.sql`. Client validation is a courtesy; this is the guarantee.

`lib/validations/upload.ts` still keeps its own private `stemCategories` list rather than importing from `lib/constants.ts`. That duplication is known and tracked in `docs/TODO.md`.

## [Unreleased] - Upload form split into components (2026-08-23)

`upload-form.tsx` went from 342 lines to 106. The pieces it shed are `upload-header.tsx`, `upload-footer.tsx`, `form/stem-row.tsx`, `form/stems-field.tsx`, `steps/audio-step.tsx` and `steps/details-step.tsx`. Closes N4.

The split follows what the form actually is rather than what would be evenly sized: the container keeps form setup, `onSubmit` and composition, each step owns its own fields, and the stems array — the only part with its own add/remove behaviour — became a field component with a row component under it. Nothing in the form's behaviour changed; this is a move, not a rewrite.

The UI was restyled to match the rest of the app in the same pass, which is why the diff is larger than a pure extraction would be. Second-step fields stack rather than sitting side by side, on the grounds that a narrow focused column reads better than two columns of half-width inputs.

`form/form-select.tsx` landed here too — a react-hook-form wrapper over `ui/select.tsx` taking `options: readonly string[]`, so the genre list and any future closed list get the same `Controller` treatment `FormInput` already gives text fields.

## [Unreleased] - Profile banner images (2026-08-23)

`profiles.banner_url` plus a `banners` R2 bucket. The profile page renders it full-bleed above the header, with "Edit profile" moved inside the banner, and the page below it became tracks on the left, likes and follows on the right. Closes L6.

`updateProfile` now returns `{ error, avatarUrl, bannerUrl }` and handles the banner exactly the way it already handled the avatar: upload to R2 first, then update the row, and delete the new object if the row update fails. The old object is deleted only after the row is committed. That ordering is ADR-002's, and it is the reason a failed write leaves the profile with its previous banner rather than none.

Image validation became shared rather than per-field. `lib/validations/profile.ts` exports one `imageFile` schema — MIME allow-list plus a size ceiling — that both `avatar` and `banner` use, and `lib/validations/upload.ts` applies the same rule to song covers. Before this, an oversized cover was caught only by R2 refusing it.

Two environment variables are now required for a build: `R2_BUCKET_BANNERS` and `NEXT_PUBLIC_R2_BANNERS_URL`. The public base URL also needs a matching `remotePatterns` entry in `next.config.ts`, the same as covers and avatars — a public R2 bucket that is not listed there fails at render, not at build.

## [Unreleased] - Follower count on the profile header (2026-08-22)

The profile header shows a follower count beside the nickname, linking to the followers list that L2 already built. Closes L1.

L1 was written expecting to need a new `getFollowers` action; it turned out to exist already, having landed with L2, so this was one file. The count joins the existing `Promise.all` rather than being awaited separately, so it costs no extra round trip, and `follows` is public-read (ADR-017) — no RLS change was needed.

## [Unreleased] - Social links on profiles (2026-08-22)

`profiles.social_links jsonb` holds a fixed set — instagram, twitch, spotify — with a check constraint that accepts `null` or an object containing only those three keys. A separate table was rejected as overkill for three optional strings. Part of L3, which stays open for the page reorder.

`updateProfile` normalises before writing: blank fields are dropped, and an object with nothing left in it becomes `null` rather than `{}`, which is what keeps the constraint satisfied. `EditProfileDialog` gained three URL fields, validated by a new `socialLinksSchema` using zod 4's `z.url()` rather than the deprecated `z.string().url()`. `social-links.tsx` renders only populated entries.

Two things worth knowing. `use-update-profile.ts` kept its own copy of `UpdateProfileInput` rather than importing the action's, so adding a field meant editing both; the duplication is still there. And this version of lucide-react no longer exports `Instagram` or `Twitch` icons, so `Camera` and `Video` stand in — placeholders, not a design decision.

## [Unreleased] - Owners can delete their own tracks (2026-08-22)

`deleteSong` was in the same position `updateSong` was: correct, and unreachable. The owner-only dropdown from K1 now carries a destructive "Delete track" item below "Edit track". Closes K2 apart from its first subtask.

The confirm names the track and says what goes with it — audio, cover and stems — because the action deletes the R2 objects before the row and none of that comes back. Both buttons disable while the delete is in flight, and the dialog refuses to close mid-delete, so the action cannot be fired twice from one open dialog.

A failure keeps the dialog open and toasts the action's own message rather than a generic one. That matters for the two distinct failures `deleteSong` can report: an R2 delete failing leaves the row intact and says so, while a row delete failing after the files are gone returns the "try deleting it again" message added earlier today.

It landed on `Dialog` first and was swapped to `AlertDialog` the same day, which is what a destructive confirm should be: `role="alertdialog"`, and no dismissal by clicking outside. The shadcn CLI added `ui/alert-dialog.tsx` without adding a dependency — it imports from the umbrella `radix-ui` package already in `package.json:34`, so the reason the swap had been deferred turned out not to exist. `AlertDialogAction` closes the dialog on click by default, so the handler calls `event.preventDefault()` and lets the pending state close it instead; otherwise the confirm would vanish while the delete was still running.

Confirmed working in a browser by the human, not by an automated test.

## [Unreleased] - Owners can edit their own tracks (2026-08-22)

`updateSong` has done the ownership check and the update correctly since it was written, and was never reachable from the UI. It is now. Closes K1.

Ownership is derived once per page — `isOwnProfile` already existed in the profile page — and threaded down as an `isOwner` prop through `TrackList` into `Card` and on into `Actions`. No card queries ownership for itself, which was the point of doing it as a prop rather than a per-card lookup. That prop is shared with K2, which still needs it.

`Actions` previously rendered `LikeButton` and `CopyLinkButton` for everyone regardless of ownership. An owner now also gets a dropdown with "Edit track", which opens a new `edit-song-dialog.tsx` built on `EditProfileDialog`'s pattern: controlled `open`, react-hook-form with `zodResolver`, defaults seeded from the song and re-seeded each time the dialog opens.

`lib/validations/song.ts` covers exactly the six fields `UpdateSongInput` accepts and no others, and reuses the BPM rule from `validations/upload.ts` verbatim. The dialog converts at the boundary the same way `api/upload/route.ts:189-198` does — BPM to a number or `null`, tags split on commas and trimmed — so a track edited here and a track uploaded there store identical shapes.

`Actions.song` is optional rather than required. `Actions` is used by all three `Card` variants and by callers that have no reason to pass a whole song, so the dropdown renders only when `isOwner && song` are both present rather than forcing every call site to change.

Typecheck and eslint are clean; this has not been exercised in a browser.

## [Unreleased] - The landing page meets the reference (2026-08-22)

`app/page.tsx` was replaced wholesale. The old two-column hero — "Your sound, out there."
beside a 56-bar waveform generated by a seeded `mulberry32` PRNG — is gone, along with the
generator, the bar markup and its keyframes. In its place is the reference hero: a glass
badge pill with a pulsing lime dot, an Anton headline at `clamp(52px, 8.4vw, 128px)` on a
`0.92` line-height, a 20px sub-line capped at 600px, and two large pill CTAs. The section
breathes at `140px` top and `160px` bottom, matching the reference's rhythm.

Two numbers from the reference were deliberately not carried over. Its badge reads "1,284
tracks uploaded today" and its social-proof line claims "92,000 artists and a few million
ears already here". Both are invented figures in a mockup, and presenting them as fact on
a running site is a different thing from copying a layout, so the badge now carries
non-numeric copy and the avatar stack was dropped. They can come back the moment there are
real counters behind them.

The song card's grid variant was rebuilt against a screenshot rather than an artifact —
none of the three published references contains a song grid card, which is why the earlier
token-only pass left it looking untouched. It is now a glass surface at 20px radius with
the cover inset at 16px, a lime genre pill drawn from `songs.genre`, a `New` badge, and a
lime play button anchored bottom-right instead of a hover-only overlay. `shelf.tsx` was the
real cause of the cards being too narrow: it wrapped each one in a hardcoded `w-40`, now
`w-[220px]`, with `items-stretch` and real horizontal scrolling through the `.mh-scroll`
utility. Cards with no bpm, scale or genre render "No track details yet" so a shelf of
mixed-completeness tracks lines up instead of stair-stepping.

The `New` badge took three attempts because of the React Compiler. `Date.now()` called
during render is an impure call and was rejected; moving it into `useState` plus a
`useEffect` traded that for "Calling setState synchronously within an effect". The flag is
now stamped once per fetch in `use-get-songs.ts`, which exports a `SongWithFlags = Song &
{ isNew: boolean }`, and `Card` reads it as a plain prop. The lesson generalises: anything
time-relative belongs at the fetch boundary, not in a component body.

`CopyLinkButton` lost its visible "Link" label and became an icon-only ghost button with an
`aria-label`, so removing the word costs screen-reader users nothing. This touches four
call sites, not just the card — the song page, the profile page, the upload-success page
and `songs/actions.tsx`. The upload-success one deserves a second look, since a bare icon
is a weaker affordance on a screen whose whole purpose is handing over a link.

Smaller corrections in the same pass. The atmosphere blobs were invisible: they sat at
`-z-10` beneath a `relative` body that paints its own opaque background, so they could
never show. They are `z-0` now with the content wrapper lifted to `relative z-10`. The
player bar came down from a 40px radius to 20px and swapped its `bg-card` glass for
`rgba(23,23,23,0.72)` under an explicit backdrop filter, because a 5%-white fill over flat
ink reads as transparent rather than frosted. The waveform adopted the reference's bar
language — `rgba(255,255,255,0.16)` unplayed, `#d6f24b` played, 4px bars at 4px gaps and
radius — which affects both the song page and the card's waveform variant.

The shadcn.io registry entry needed one correction: the token authenticates as a query
parameter, not an `Authorization: Bearer` header. Both header forms answer `401`; `?token=`
answers `200`. The mesh-gradient component was installed, found to ship an import for a
`~/*` alias this project does not define, fixed, and then left unmounted — the CSS
atmosphere blobs already match the reference, cost no JavaScript and respect
`prefers-reduced-motion`, which the component's four keyframes do not.

Still outstanding: the button padding never moved to the reference's 1:2 ratio
(`12px 24px` / `16px 32px` / `18px 36px`, ghost at `17px 34px`), `layout.tsx` carries an
unused `cn` import introduced during the port, and none of this has been confirmed visually
— every claim above rests on typecheck, lint, build and DOM greps.

## [Unreleased] - Landing Page v2 tokens, and a registry that needs a key (2026-08-22)

The lime/Anton/glass system extracted from the Claude Design prototype now lives in
`app/globals.css` rather than only in `DESIGN.md`. `--primary` is `#d6f24b` on `#0a0a0a`
ink, `--card` is the glass fill `rgba(255,255,255,0.05)` paired with a `.bg-card`
utility that carries the `blur(24px) saturate(1.4)` backdrop filter, `--radius` is
`20px`, and the raw `--mh-*` tokens hold the values no shadcn token covers. `layout.tsx`
swapped Inter for DM Sans and added Anton as `--font-display`.

Eight shared components were ported onto those tokens in one pass: the button's four
pill variants, the sticky glass nav, the footer hairline, the floating player, all three
`songs/card.tsx` variants, and the search input — which changed shape rather than colour,
moving its surface onto a wrapper pill with a bare transparent input inside, the way the
prototype builds it. Its suggestion dropdown deliberately sits on the solid `#171717`
rather than the glass fill, because blur stacked on blur reads as mud.

One correction to that dropdown followed. A keyboard-selected suggestion was drawn with
`--mh-glass-hover` — `rgba(255,255,255,0.07)` over `#171717` — which is close to
invisible, so arrow-key navigation read as broken even though the keyboard handling was
working. Selection is now `bg-white/12` with `text-primary`, and `hover:` carries the
glass tint separately, so pointer hover and keyboard selection stop sharing one colour.

`components.json` gained a `@shadcnio` registry entry pointing at
`https://www.shadcn.io/r/{name}.json` with an `Authorization: Bearer
${SHADCN_REGISTRY_TOKEN}` header, and the token itself lives in `.env.local`. The
registry needs it because shadcn.io publishes its component source only to authenticated
accounts — the public page renders a preview and nothing else, and an unauthenticated
fetch answers `401 Unauthorized`. This was added to install a mesh-gradient background
component; that component is not installed yet.

Nothing in this port has been verified visually. `npm run build`, `npx tsc --noEmit` and
`npm run lint` all pass, which proves the CSS compiles and the classes emit, not that the
pages look right.

## [Unreleased] - Repeat, and a queue that actually loops (2026-08-22)

A `repeatMode` of `"off" | "all" | "one"` now lives in `usePlayer`, cycled by a new `components/player/repeat-button.tsx` mounted in the player bar. Closes J1.

The shape differs from the one J1 sketched. That item assumed a `repeatOne: boolean` was enough, because `handleNext` already wrapped the queue at the end — which meant "repeat all" was permanently on and could not be turned off. Three modes make the wrap conditional, so `"off"` genuinely stops at the end of the queue.

Two faults found reviewing it. The store's `partialize` persisted the mode under the key `repeat` while the store reads `repeatMode`, so rehydration restored a field nothing consumed and the setting was lost on every reload. And "repeat all" on a single-song queue re-set `activeId` to the id already active, which changes no `url` and therefore never restarts the audio — the track simply sat at its end. Both paths now run through one `restart` helper, shared with the `"one"` branch of `onEnded`.

The button dropped `aria-pressed`. A three-state cycle has no honest boolean pressed state, and both `"all"` and `"one"` were announcing identically; the label now always names the current mode instead.

## [Unreleased] - The search dropdown answers to the keyboard (2026-08-22)

`hooks/search/use-search-keyboard.ts` adds arrow-key navigation with wrap-around over the suggestions, and `search-input.tsx` carries the ARIA combobox pattern: `role="combobox"` with `aria-expanded`/`aria-controls`/`aria-autocomplete` on the input, `role="listbox"` on the list, `role="option"` with `aria-selected` on each row, and `aria-activedescendant` pointing at the highlighted option's id. Closes G1 (`#M19`).

Keyboard movement alone is invisible to a screen reader — it reads the input, not the list. The ARIA attributes are what make the dropdown and the current highlight announceable at all; `aria-activedescendant` is left `undefined` rather than `""` when nothing is highlighted, so it never points at an element that does not exist.

Escape and Enter were both dead ends and are wired through optional callbacks, keeping the hook generic rather than teaching it about dropdown state. Escape cleared the highlight but left the list open; it now calls `onEscape`, which closes it. Enter did nothing at all unless a suggestion was highlighted — there is no `<form>` wrapper, so no native submit picked up the fallback — and now calls `onSubmit`, which searches the typed text. The `!items.length` early return moved onto the two arrow-key branches so that Enter still searches when the query returned no suggestions.

## [Unreleased] - A blocked pop-up no longer hangs Discord sign-in (2026-08-22)

`window.open` returns `null` when a browser blocks the pop-up, and the hook never checked. `popup?.closed` was then `undefined` on every tick, so the interval never cleared, `isSocialLoading` never reset and the promise never settled — the button span forever with no error. Closes C1.

A guard after the `window.open` call handles that case directly: loading resets and the caller gets "Pop-up blocked. Allow pop-ups for this site and try again", which `use-discord-login.ts:16` toasts as-is.

The same hang had a second cause, fixed in the same pass. A pop-up left open forever kept the 500 ms interval alive with nothing to resolve it. Every exit now runs through one `settle` function that clears the interval, clears a new two-minute timeout, resets loading and resolves once. `JSON.parse` on the stored OAuth result also gained a `try/catch` — corrupt storage previously threw inside the interval callback, where nothing could catch it.

## [Unreleased] - A failed song-row delete stops being invisible (2026-08-22)

`deleteSong` removes the R2 objects before the database row, per ADR-002's rule that deletes go in that order because the row is the only record of which paths need cleaning up. The consequence was never handled: if the row delete failed after the files were gone, the track stayed in the app with audio, cover and stems that all 404, and nothing recorded it. Closes D3.

The failure branch now logs the song id — the mirror of the `orphanedPaths` log above it, and the only way to find such a row afterwards — and returns a message that says what actually happened: the files were removed, the record was not, try again.

A retry of the delete was considered and dropped. Deleting an object that no longer exists is a no-op in S3, so a user pressing Delete a second time already walks through the R2 steps and removes the row; the retry only helps when nobody ever presses it again. Cloudflare's S3 compatibility page lists `DeleteObject` as implemented but documents nothing about missing keys, so R2 matching S3 here is an assumption, not a verified fact.

Two heavier fixes were rejected as larger than the bug: a reverse-direction pass in the cleanup cron (rows whose R2 paths no longer exist) and a soft-delete column. Both are logged as D8.

Worth recording while checking the blast radius: `stems.song_id` and `likes.song_id` are both `on delete cascade`, so a foreign-key block cannot cause this. What remains is a network or timeout blip — auth, existence and ownership are all checked earlier in the function.

## [Unreleased] - Every action states its result shape (2026-08-22)

Seven read actions each declared their own `{ data; error }` type, three more returned something else entirely, and ten mutations agreed on `{ error }` without ever saying so. Closes D1 (`#M9`).

`src/types/index.ts` now holds both shapes: `ActionResult<T>` for reads, `MutationResult` for writes. Eighteen actions adopted them and every local `Get…Result`/`…Result` declaration is gone.

Three read actions changed what callers destructure, which is the part that needed the call-site sweep first. `getUserSongs` returned a bare `Song[]` and swallowed failures as an empty list — it now returns `{ data: [], error }` on failure, so "this person has no songs" and "the query failed" are finally distinguishable. `getProfileByNickname` returned `{ profile, error }` with Supabase's raw error; it returns `{ data, error }` with a plain `Error`, and its five callers rename at the destructuring so nothing below those lines moved. `getFollowStatus` returned `{ isFollowing }` with no error field at all; it now returns `ActionResult<boolean>`, where signed-out stays a legitimate `false` with no error — only a failed query produces one, per `docs/reference/CONVENTIONS.md:135`.

The payload of `getProfileByNickname` had never been named, since it selects five columns rather than a whole row. It is now `ProfileDetails`, declared in the action file next to the query that produces it — a payload type, not another result wrapper.

Left out deliberately: `update-profile.ts` carries an extra `avatarUrl` alongside its error, and `resolve-song-url`/`resolve-stem-url` return `{ url, error }` — reads wearing a different key, worth revisiting as `ActionResult<string | null>` but not folded in here.

One thing found while annotating: `update-song-cover.ts` called `validateImageFile(file)` twice, once at line 38 and again at line 47. The duplicate is deleted; the surviving call is unchanged.

## [Unreleased] - A seekbar you can actually drag (2026-08-22)

The player bar had play/pause, skip and volume but no way to move inside a track — the only scrubbing surface was a waveform, which exists on song and profile pages but not in the bar. Closes J2.

`components/player/seekbar.tsx` is a `Slider` driven by the store's `progress`/`duration`, following `volume.tsx`'s shape. The one non-obvious piece is that it cannot simply render `progress`: playback keeps writing that value while a drag is in flight, so the thumb would be pulled back under the user's finger on every `onTimeUpdate`. The component keeps its own scrub value and shows `scrubbing ?? progress * 100`, with `onValueChange` writing only to that local value and `onValueCommit` doing the actual `requestSeek`. `??` rather than `||` is deliberate: `0` is a legitimate scrub position, which is also why the state is `number | null` instead of a number plus a separate is-dragging flag.

`requestSeek` takes `(songId, progress)` since C8, so the seekbar passes `activeId` and is disabled until both a song and a duration exist — `duration` is `0` until `onLoadedMetadata` fires.

`lib/format/duration.ts` is new: seconds to `m:ss`, guarding `NaN`/`Infinity` because `audio.duration` is `NaN` before metadata loads and would otherwise render `NaN:NaN` in the bar.

`bar.tsx`'s inner element was doing two jobs — width/padding container and three-column grid. It now keeps the sizing and stacks two rows, with the grid moved into a child, so the seekbar spans the full bar rather than sharing a column.

## [Unreleased] - A seek request now names the song it was meant for (2026-08-22)

Closing C7 left a deliberate hole, recorded in the entry below: `setActiveId` does not clear a pending `seekTo`, so a click on one waveform followed quickly by activating a different song applied the first click's position to whichever track loaded next. Closes C8.

The store no longer carries a bare fraction. `seekTo` holds a `SeekRequest` — the song id and the fraction in one value — and `requestSeek` takes both, which made the compiler point at the single call site that had to change (`use-waveform.ts:99`). The alternative, a sibling `seekSongId` field, was rejected: two fields set by two writes can drift apart, while one object is set and cleared atomically and cannot be half-updated.

`Controls` gained the branch that does the actual work. A request whose `songId` doesn't match `activeId` is cleared and dropped rather than left pending, because nothing will ever re-target it — and leaving it in place is not inert: returning to that song later loads its metadata, the ids match again, and a click made minutes earlier moves the playhead. `activeId` joins the effect's dependency array, since the effect now reads it.

This supersedes the trade described at the end of the C7 entry. Clearing on mismatch costs one thing, knowingly: a click made a moment before switching tracks is discarded rather than honoured on return, which is the behaviour a user would expect anyway.

## [Unreleased] - The first click on a waveform seeks instead of snapping back (2026-08-22)

Clicking a waveform for a song that was not yet active flashed the highlight to a position, then dropped it back to the start. Closes C7.

Three separate faults sat on the same click path. `progress` and `duration` are global to the player store, and nothing reset them when the active song changed, so the newly activated waveform was painted against the previous song's position until the first `onTimeUpdate` from the freshly loaded audio pulled it to zero — that is the jump-then-snap the bug reported. `setActiveId` now zeroes both alongside the id. A grep of all four call sites (`controls.tsx:63`, `controls.tsx:70`, `waveform.tsx:30`, `use-on-play.ts:19`) confirmed every one of them is a genuine track switch, so no caller relied on progress surviving.

Second, `useWaveform`'s click handler returned immediately after activating, discarding the click's x-position, so the first click on a fresh waveform carried no seek intent at all. The `if (!isActive)` guard stays — `onActivate` is not idempotent, and on an already-active song it toggles play/pause — but the `return` is gone, and both paths now fall through to `requestSeek`.

Third, even a forwarded request died in `Controls`: the seek effect bailed when the newly set `src` had no duration yet, and bailed before `clearSeekRequest()`, leaving a request pending that nothing would retry. The effect now reads the store's `duration` rather than the element's and lists it as a dependency, so it re-runs the moment `onLoadedMetadata` publishes a real length.

Applying the pending seek directly inside `onLoadedMetadata` was the rejected alternative. It fires at exactly the right moment and needs no extra render, but it puts the seek-and-clear sequence in two places, and two copies of that sequence drift. Depending on `duration` keeps one code path, and — because the effect body now uses the value rather than merely listing it — satisfies `exhaustive-deps` without a suppression.

`seekTo` is deliberately not cleared by `setActiveId`. Clearing it would make the ordering of the two calls inside the click handler load-bearing, and the request is already cleared the instant it is applied. The cost is a race, logged as C8: a click on one waveform followed quickly by activating a third song will apply the first click's position to whichever song loads first.

