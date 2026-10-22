# Conventions

## Work Order

Vertical slices — jeden flow end-to-end przed następnym.

---

## Naming

| Layer         | Pattern                                  | Przykład                        |
| ------------- | ---------------------------------------- | ------------------------------- |
| Hook          | `use-` kebab-case plik, camelCase export | `useLoadSongUrl`                |
| Server action | verb + noun                              | `resolveSongUrl`, `deleteSong`  |
| R2 lib helper | `get` / `upload` / `delete`              | `getPresignedUrl`, `uploadStem` |
| Route Handler | noun                                     | `app/api/upload/route.ts`       |
| Component     | feature prefix + role                    | `FeedSongItem`, `PlayerBar`     |

`resolveSongUrl` (server action, `src/actions/songs/resolve-song-url.ts`) wywołuje `getPresignedUrl` (lib helper, `lib/r2/storage.ts`) — `resolve` odróżnia server action od hooków (`use`), lib helperów (`get`) i Supabase query actions po samej nazwie, bez zaglądania do pliku.

**Server actions — jeden plik na jedną funkcję**, nawet gdy operują na tej samej tabeli (`delete-song.ts`, `update-song.ts`, nie zbiorczy `songs.ts`).

**`src/actions/` — podfoldery po kontekście, nie płasko:** `songs/`, `stems/`, `profile/`, `social/`. Import: `@/actions/songs/get-songs`, `@/actions/social/follow-user`, itd. Nazwy funkcji bez zmian względem pliku — tylko lokalizacja się grupuje po tym, jakiej domeny dotyczy akcja, nie po tym w jakiej kolejności powstała.

**Component naming — prefix zależny od kontekstu folderu:**

- Folder płaski, wiele niepowiązanych feature'ów (`components/ui/`, `components/`) → pełny prefix wymagany: `FeedSongItem`, `PlayerBar`
- Folder już nazwany po feature (`components/player/`, `components/upload/`) → folder daje kontekst, plik/export może pominąć prefix: `components/player/controls.tsx` (`Controls`), nie `components/player/player-controls.tsx` (`PlayerControls`) — powtórzenie nazwy folderu w nazwie pliku nic nie dodaje

---

## Layout

**Nigdy nie centruj `<body>` bezpośrednio (`mx-auto max-w-*` na `<body>`).** Radix-owe komponenty ze scroll-lockiem (`Dialog`, `DropdownMenu` z `modal={true}`, itd. — przez `react-remove-scroll`) mutują style bezpośrednio na zablokowanym elemencie, m.in. wymuszają `margin-right: 0 !important` żeby skompensować znikający scrollbar. Jeśli ten element ma własne centrowanie (`margin-inline: auto`), wymuszony `margin-right` psuje balans z `margin-left: auto` i całą stronę przesuwa w lewo przy każdym otwarciu overlay'a.

Container/max-width zawsze na wrapper `<div>` wewnątrz `<body>`, nigdy na `<html>` ani `<body>` — te dwa elementy są tym, co biblioteki scroll-lockujące aktywnie modyfikują, więc nie mogą nosić layoutowego stylingu.

```tsx
// app/layout.tsx — poprawnie
<body className="bg-background text-foreground">
  <div className="mx-auto max-w-6xl">
    <Navbar />
    {children}
  </div>
</body>

// źle — body jako target centrowania
<body className="mx-auto max-w-6xl bg-background text-foreground">
```

`scrollbar-gutter: stable` na `html` był planowany jako dobra praktyka (rezerwuje miejsce na scrollbar), ale nigdy nie trafił do `globals.css` — do dopisania. To nie jest fix na powyższy problem — to osobna, niezależna warstwa. Zob. `docs/history/CHANGELOG.md` "Layout Bugfix" dla pełnej historii debugowania.

---

## Dostępność

Ikona w przycisku z widocznym tekstem jest dekoracyjna — `alt=""`. Nazwa dostępna liczy się z zawartości przycisku, więc `alt` z treścią dokłada się do napisu: `alt="discord logo"` obok "Continue with Discord" daje "discord logo Continue with Discord, button".

Trzy stany: brak `alt` (zepsute — czytnik czyta nazwę pliku), `alt="tekst"` (obrazek niesie własną informację), `alt=""` (znika z drzewa dostępności). Test: usuń obrazek — jeśli tekst dookoła dalej mówi wszystko, obrazek jest dekoracyjny.

`aria-label` to wersja awaryjna dla kontrolek bez widocznego tekstu; przy widocznym napisie jest zbędny. Pusty `aria-label=""` jest pomijany, nie czyści nazwy. Tailwindowe `capitalize` nie zmienia nazwy dostępnej — liczy się tekst w DOM.

---

## Layer Boundaries

**Global state — Zustand, nie Context.** Player, auth modal, useUser — wszystko Zustand (ADR-004). Context tylko dla stanu scoped do subtree.

Store (np. `useUser`) istnieje sam z siebie od importu pliku — nic go automatycznie nie wypełnia. `UserProvider` to jedyny komponent, który woła `setUser(...)`. Dlatego wywalenie `<UserProvider />` z layoutu nie rzuca błędu — po prostu store zostaje na wartości startowej (`user: null, isLoading: true` na zawsze), navbar pokazuje "Sign in" nawet dla zalogowanego usera. Z tego samego powodu `UserProvider` woła `init()` (ręczny check usera na starcie) osobno od `onAuthStateChange` — ten drugi łapie tylko _nowe_ zdarzenia (login/logout/refresh); odświeżenie strony z już ważnym cookie sesji nie jest nowym zdarzeniem, więc bez `init()` store zostałby pusty mimo aktywnej sesji.

**Forms — `FormInput` + RHF `Controller`.** Shadcn `Field`/`FieldLabel`/`FieldError`. Stary stack `Form/FormField/FormItem` — nie używany.

- `useForm()` zawsze z `mode: "onBlur"`
- `value={field.value ?? ""}` na każdym `<Input>` — bez tego "uncontrolled to controlled" warning
- Numeryczne pola (np. `bpm`) — `z.string()` + `.refine()`, nie `z.coerce.number()`/`z.preprocess` — te produkują `unknown` input type i psują `Resolver` generic
- Brak try/catch w Supabase-calling hookach — SDK zwraca błędy jako wartości, nie rzuca. Wyjątek: `fetch`-based hooki (np. `useUpload`) i wywołania AWS SDK (np. `resolveSongUrl` → `getPresignedUrl`) — te rzucają, try/catch wymagany
- **Error display:** czerwony border + tekst pod polem dla walidacji formularzy (nie toast). Toast (sonner) tylko dla błędów serwerowych i potwierdzeń akcji
- **Auth Modal:** trzy widoki — Login, Register, Forgot Password (`useAuthModal().view`, ADR-006)
- Każda zmiana `FormInput` wymaga odpalenia testów jednostkowych
- **Inline-edit pola bez pełnego RHF** (`EditableField`, `EditableTextareaField`) — lokalny `useState`, bez `Controller`; walidacja przez ręczne `schema.safeParse()` w `save()` zamiast `zodResolver`, server action zostaje backstopem niezależnie od walidacji klienta

**Auth gating:**

- Middleware (`proxy.ts`) — tylko `/upload`, jedyna strona bez publicznego wariantu (`/account/*` przestał istnieć jako route, zmergowany w `/profile/[nickname]`, zob. ADR-004 Update 2026-07-28)
- `useAuthModal` — gated actions na publicznych stronach (like, save, manage songs)

**Data fetching:**

| Co                                | Gdzie                                                                                                                                                      |
| --------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Song list, metadata (cards, Feed) | Hook → Supabase directly                                                                                                                                   |
| Search results (SSR, filtered)    | Server action (`getSongs`) → Supabase, called directly from Server Component — not `useGetSongs`, see ADR-013                                              |
| Presigned audio URL               | Hook → server action (`resolve*`) → `lib/r2/`                                                                                                              |
| Cover URL                         | `NEXT_PUBLIC_R2_COVERS_URL` + path (public bucket)                                                                                                         |
| Avatar URL                        | `getAvatarUrl(path)` in `lib/r2/public.ts` — `NEXT_PUBLIC_R2_AVATARS_URL` + path, falls back to `public/avatar-placeholder.jpg` when `path` is `null`      |
| Banner URL                        | `getBannerUrl(path)` in `lib/r2/public.ts` — `NEXT_PUBLIC_R2_BANNERS_URL` + path; brak bannera = gradientowy fallback w komponencie, nie plik placeholdera      |
| Mutacje (delete, update)          | Server actions `src/actions/`                                                                                                                             |
| File upload                       | Route Handler `app/api/upload/route.ts`                                                                                                                    |
| Orphaned file cleanup             | Route Handler `app/api/cron/cleanup/route.ts`                                                                                                              |

`getCoverUrl`/`getAvatarUrl` (`lib/r2/public.ts`) nigdy nie chodzą do Supabase — dostają gotową ścieżkę (`song.image_path`, `profile.avatar_url`) i doklejają do niej R2 base URL. Jeśli `select()` zapytania nie ma danej kolumny, pole jest `undefined` i helper po cichu zwraca placeholder — brakujący kawałek zawsze jest w `select()`, nie w tych funkcjach.

**Route Handlers — cztery świadome wyjątki od "wszystko server actions":**

1. `app/api/upload/route.ts` — pliki do 200MB, wymaga explicit body parser config, czego Server Actions nie dają tak czysto (ADR-002)
2. `app/api/cron/cleanup/route.ts` — Vercel Cron wymaga wywoływalnego HTTP endpointu, server actions nie są wywoływalne przez cron scheduler (ADR-002 Update 2026-07-10)
3. `app/auth/callback/route.ts` — Discord OAuth wraca redirectem z `?code=`, więc docelowy adres musi być zwykłym URL-em, który przeglądarka potrafi otworzyć; server action nie ma URL-a. Wymienia kod na sesję (`exchangeCodeForSession`) i zwraca HTML zamykający popup
4. `app/auth/confirm/route.ts` — linki z maili (rejestracja, reset hasła, zmiana maila) prowadzą pod `{{ .SiteURL }}/auth/confirm?token_hash=…`, klikane z klienta pocztowego. Ten sam powód: to musi być adres, nie akcja. Weryfikuje OTP i przekierowuje na `/auth/update-password`, `/auth/confirmed` albo `/auth/error`

Wspólny mianownik wszystkich czterech: coś spoza aplikacji (przeglądarka z plikiem, cron, OAuth provider, klient pocztowy) musi trafić pod adres HTTP. Piąty Route Handler wymaga tego samego rodzaju uzasadnienia, opisanego tutaj i w ADR-002 **przed** napisaniem pliku.

Uzasadnienie obu żyje tutaj i w ADR-002 — nie w komentarzu w kodzie (zob. "Komentarze" niżej). Żadnych kolejnych Route Handlerów bez analogicznego, udokumentowanego uzasadnienia — platform requirement albo file size limit, nie wygoda. Nowy Route Handler = nowy wiersz na tej liście plus wpis w ADR-002, zanim powstanie plik.

**Gatunek i tagi.** Gatunek to zamknięta lista — `GENRES` w `lib/constants.ts`, renderowana przez `form/form-select.tsx`. Tagi zostają otwarte, ale limitowane: `MAX_TAGS = 8`, `MAX_TAG_LENGTH = 24`, lowercase + deduplikacja w `parseTags` (`lib/validations/song.ts`). Rozdział jest celowy — po gatunku się filtruje, więc musi być pisany tak samo przez wszystkich; tagi to długi ogon i ich wartość polega właśnie na tym, że nikt ich nie kontroluje.

- Tagi waliduje `.refine()`, **nigdy** `.transform()` — transform zmienia output type schematu, a przez to `SongFormValues` i kształt `defaultValues` współdzielony przez upload i edit dialog. Normalizacja idzie przez `parseTags` na granicy, nie w schemacie
- Limit egzekwuje także baza: `CHECK` nie może zawierać subquery, więc constraint woła immutable funkcję `tags_within_limits(text[])` (`supabase/migrations/20260823001500_song_tags_limits.sql`). Walidacja kliencka to uprzejmość, gwarancja jest w bazie
- Nowa zamknięta lista (np. przyszły `mood`) idzie do `lib/constants.ts` + `FormSelect`, nie do własnego `<select>`

**Walidacja plików graficznych.** Lokalny schemat `imageFile` w `lib/validations/profile.ts` (nieeksportowany) — allow-lista MIME + górny limit rozmiaru — obsługuje `avatar` i `banner`; `lib/validations/upload.ts` powtarza tę samą regułę dla coveru utworu. Reguła jest jedna, ale żyje w dwóch plikach — wyciągnięcie jej do wspólnego modułu jest w `docs/TODO.md`. Nowe pole na obrazek trzyma się tych samych limitów, nie wymyśla własnych. Publiczny bucket R2 wymaga też wpisu w `remotePatterns` w `next.config.ts` — brak wpisu wywala się dopiero przy renderze, nie przy buildzie.

**Fetch-w-effekcie: `cancelled` flag.** Każdy `useEffect`-owy hook odpalający fetch przy zmieniającej się wartości (np. `useSearchSuggestions` przy debounced query) musi chronić się przed odpowiedziami wracającymi nie po kolei — sieć nie gwarantuje kolejności, nowsze zapytanie może wrócić przed starszym. Wzorzec: lokalny `cancelled` w domknięciu efektu, `cleanup` ustawia go na `true`, callback sprawdza `if (!cancelled)` przed `setState`. Zob. ADR-015 po pełny mechanizm. `useDebounce` (czekanie na ciszę we wpisywanym tekście, np. 300ms) redukuje liczbę requestów, ale sam w sobie nie gwarantuje kolejności odpowiedzi — oba mechanizmy działają razem, nie zamiast siebie.

**Jeden hook = jedno źródło prawdy dla danej tabeli.** Jeśli hook (np. `useGetSongs`) już fetchuje dane dla jednego kontekstu (cards), nowy feature potrzebujący tej samej tabeli z dodatkowym polem (np. Feed potrzebujący `profiles.nickname`) rozszerza ten sam hook — nie forkuje osobnego zapytania. Duplikat zapytania do tej samej tabeli w dwóch miejscach = sygnał że coś powinno być refaktoryzowane do wspólnego hooka.

**Optimistic UI (`use-like.ts`, `use-follow.ts`).** Jedyny wzorzec tego typu w projekcie, kontrakt: (1) klik → UI state zmienia się natychmiast (lokalny `useState`, nie globalny store — stan jest scoped do przycisku); (2) request leci w tle do server action; (3) błąd → cofnij UI state + toast błędu + `return` (bez `return` toast sukcesu poleci zaraz po błędzie); (4) sukces → toast potwierdzenia, treść rozgałęziona na kierunku toggle'a (`next ? ... : ...`), nigdy jedna wiadomość dla obu kierunków. Żadnego `router.refresh()` po mutacji — optimistic state jest już poprawny, a refresh re-runuje wszystkie zapytania strony. Treść toasta jest generyczna: hooki dostają tylko ID, nie tytuł ani nick. Każdy nowy toggle-style gated action (np. przyszły "save"/"bookmark") kopiuje ten sam kontrakt, nie wymyśla nowego.

**Read akcje: parametryzowany subject vs. hardcoded-na-viewera.** `getLikedSongs(profileUserId)`/`getUserSongs(userId)`/`getFollowing(userId)` przyjmują czyje dane pobrać jako parametr — bo "czyje" realnie się zmienia między call site'ami: własny profil, cudzy publiczny profil, `/library`. `getFollowedArtistsSongs()` nie przyjmuje nic — czyta `currentUser` przez `supabase.auth.getUser()` wewnątrz — bo Feed to z definicji zawsze "mój feed", nie ma (i nie planuje się) widoku "czyjś feed z zewnątrz". Zasada: jeśli subject query'ego może się różnić między wywołaniami, akcja go przyjmuje jako parametr; jeśli subject to zawsze bieżący zalogowany user, akcja czyta go sama, żaden caller nigdy nie ma czego przekazać. Nie mieszać wzorców — `get-liked-songs.ts` miał kiedyś naklejony viewer-check z tego drugiego wzorca (`if (!currentUser) return { data: [] }` przed właściwym query) i przez to publiczne polubienia znikały dla niezalogowanego widza, mimo że `likes` jest public-read (ADR-017) — usunięte 2026-07-30.

---

## Testing

- `vite.config.ts` (nie `vitest.config.ts` — Vitest czyta obie nazwy): `environment: "node"` globalnie, `// @vitest-environment jsdom` per-file dla komponentów
- `vite.config.ts` wymaga `plugins: [react(), tsconfigPaths()]` — bez tego `@/` aliasy nie działają
- Mock default-exported hooków: `vi.mock("...", () => ({ default: () => ({...}) }))` — nie named export
- `vi.mock()` path musi dokładnie matchować import path w komponencie pod testem — mismatch nie rzuca błędu, cicho ładuje prawdziwy moduł i może uderzyć w realną sieć (objaw: test wolny ~1s+). Zawsze zweryfikuj ścieżkę przed napisaniem mocka
- Container testy: mockuj child komponenty, nie ich hooki
- `FormInput` wymaga real `useForm()` host component w testach — `Controller` nie da się sensownie zmockować
- `redirect()` w Route Handler ustawia relative path w `Location` — nie pełny URL

---

## Security

- Server actions weryfikują ownership via `supabase.auth.getUser()` przed każdą mutacją
- RLS = warstwa DB; ownership check = warstwa aplikacji — oba wymagane
- **Brak zalogowanego usera: error w mutacjach, `null` w readach.** Mutacje (`follow-user.ts`, `like-song.ts`, `update-profile.ts`, `delete-song.ts` itd.) zwracają `{ error: new Error("Not authenticated") }` — bez usera write nie może się wykonać, to prawdziwy błąd. Read akcje na publicznych stronach (`get-songs.ts`, `get-liked-songs.ts`, `get-user-songs.ts`, `get-followed-artists-songs.ts`) traktują brak usera jako poprawny stan — `error: null`, po prostu personalizacja (`isLiked`) domyślnie `false`/pominięta, bo strona (Search, Profile, Feed) jest publiczna i ma się renderować także dla gościa. Nowa read akcja kopiuje ten drugi wzorzec, nie pierwszy.
- `app/api/cron/cleanup/route.ts` weryfikuje `Authorization: Bearer $CRON_SECRET` przed wykonaniem — nie chroniony przez `supabase.auth.getUser()` (brak usera, wywołanie systemowe od Vercel Cron), osobny sekret w env

**R2 access:**

| Bucket    | Access  | Metoda                              |
| --------- | ------- | ----------------------------------- |
| `songs`   | Private | Presigned URL 1h, server-side tylko |
| `stems`   | Private | Presigned URL 1h, server-side tylko |
| `covers`  | Public  | `NEXT_PUBLIC_R2_COVERS_URL` + path  |
| `avatars` | Public  | `NEXT_PUBLIC_R2_AVATARS_URL` + path |

---

## R2 + Supabase Transaction Safety

**Upload:** R2 first → Supabase insert → DB error: rollback wszystkich R2 writes (ADR-002).
**Delete:** fetch paths z DB → delete R2 → delete DB → R2 error: log orphaned path, abort DB delete (ADR-002).
**Orphaned file reconciliation:** scheduled Vercel Cron job (`app/api/cron/cleanup/route.ts`), diff R2 objects vs DB rows, auto-deletes confirmed orphans — zaimplementowane (ADR-002 Update 2026-07-10, upgraded log-only → auto-delete 2026-07-24).

**New bucket setup checklist:**

1. Create bucket in Cloudflare dashboard
2. Enable public access (R2.dev subdomain) — only if bucket is public
3. Add bucket to existing API token's bucket permissions — does not inherit automatically (known gotcha, see CHANGELOG v0.5 stems bucket)
4. Env vars: `R2_BUCKET_<NAME>`, plus `NEXT_PUBLIC_R2_<NAME>_URL` if public

---

## Komentarze

**Bez komentarzy wyjaśniających w kodzie.** Powód zmiany, odrzucone alternatywy i "dlaczego tak, a nie inaczej" idą do systemu dokumentacji — decyzje do `docs/adr/ADR-*.md`, narracja zmiany do `docs/history/CHANGELOG.md`, trwałe pułapki do `CLAUDE.md`, reguły tutaj. Kod zostaje goły.

Powód: ten repo prowadzi dokumentację świadomie i dla ludzi, i dla agentów. Komentarz inline duplikuje ten system, a potem rozjeżdża się z nim — to samo "dlaczego" zapisane w dwóch miejscach, które z czasem przestają się zgadzać. Jedno źródło prawdy dla "dlaczego" to docs.

Dotyczy `.ts`/`.tsx`, migracji SQL i `.env.example`. Jeśli linijka wymaga wyjaśnienia — wyjaśnienie idzie do właściwego dokumentu, nie nad linijkę.

Nie są komentarzami w tym sensie i zostają: dyrektywy wymagane przez narzędzia (`"use server"`, `"use client"`, `// @vitest-environment jsdom`, `eslint-disable`) oraz przykłady w tym pliku i w ADR-ach.

---

## TypeScript

- Bez `any`
- DB types z `types/database.types.ts` (generated via `supabase gen types typescript --local`)
- `Song`, `Stem`, `UserProfile` z `Database["public"]["Tables"]`, nigdy hand-written

---

## Supabase gotchas

- Delete bez sensownego filtra wymaga workaroundu: `delete().neq("id", "00000000-...")`
- Email templates: nigdy `{{ .ConfirmationURL }}` — routuje przez GoTrue verify endpoint, omija nasze route handlery. Zawsze budować ręcznie: `{{ .SiteURL }}/auth/confirm?token_hash={{ .TokenHash }}&type=...` (każdy nowy template — reset password, magic link, email change — ma tę samą pułapkę)
- Local dev nie ma `[auth.rate_limit]` domyślnie — GoTrue fallback jest luźny, spam `resetPasswordForEmail()`/innych auth-email calls nie jest blokowany jak w cloud Supabase. Ustawić explicit w `supabase/config.toml`: `[auth.rate_limit] email_sent = 2`, wymaga `supabase stop && supabase start` (config.toml nie hot-reloaduje)
- **`updateSession` (`lib/supabase/proxy.ts`) — cichy logout przy każdej edycji tego pliku.** Refresh tokeny są jednorazowe i rotują: `supabase.auth.getClaims()` wymienia wygasły access token na nową parę, stary refresh token natychmiast umiera po stronie serwera. Nowa para wraca callbackiem `setAll` i ląduje w `Set-Cookie` konkretnego obiektu `supabaseResponse`. Zwrócenie **innego** obiektu response gubi te nagłówki — przeglądarka zostaje ze zużytym tokenem i przy następnym requeście wylatuje z sesji. Bez błędu, bez logu, dopiero po ~1h od logowania, więc wygląda losowo i przechodzi lokalne testy. Zasady: zwracać `supabaseResponse` bez zmian; jeśli naprawdę trzeba inny response — `NextResponse.next({ request })` (samo `request` jest istotne, `setAll` mutuje `request.cookies`, żeby Server Components w tym samym renderze widziały świeży token) plus `myNewResponse.cookies.setAll(supabaseResponse.cookies.getAll())`, i nie ruszać ciasteczek. Nie wstawiać kodu między `createServerClient` a `getClaims()`. Nie usuwać `getClaims()` — bez niego sesja nie odświeża się wcale. Obecny early return (redirect na protected path) jest bezpieczny tylko przypadkiem: leci wyłącznie gdy `!user`, a udany refresh implikuje claims — każdy kolejny early return/rewrite w tej funkcji to już realny bug
- **Nowa tabela: RLS to nie wszystko — bez table-level `grant` leci `42501 permission denied`.** Postgres sprawdza dwie rzeczy po kolei: najpierw czy rola (`anon`, `authenticated`, `service_role`) w ogóle ma prawo dotknąć tabeli, i dopiero potem czy polityka RLS puszcza konkretne wiersze. Brak `grant` wywala na pierwszej bramce, więc polityka nigdy nie jest sprawdzana, a błąd wygląda jakby to ona była zepsuta. Rozróżnienie po komunikacie: `42501 permission denied` = brakujący `grant`; `new row violates row-level security policy` = polityka faktycznie odrzuciła wiersz. Zdarzyło się na `follows` i `likes` przy insertach, mimo poprawnych polityk (ADR-017). Wzorzec z migracji: `grant select on public.<tabela> to authenticated, anon;` plus `grant insert, update, delete on public.<tabela> to authenticated;` i komplet dla `service_role` (`20260706142856_rls_policies.sql`, `20260731081353_social_schema.sql`). Każda nowa tabela dostaje granty w tej samej migracji co polityki, nigdy „potem”

---

## Commit Conventions

Format: `type(scope): description` — jedna linia, bez bulletów.

**Scope obowiązkowy** = obszar milestone'a: `player`, `auth`, `upload`, itd.

**Typy:**

| Typ        | Kiedy                    |
| ---------- | ------------------------ |
| `feat`     | nowa funkcjonalność      |
| `test`     | testy (nigdy `refactor`) |
| `refactor` | zmiana behavior-neutral  |
| `chore`    | setup, config, porządki  |

Przykłady: `feat(player): add auto-advance on track end`, `test(player): cover usePlayer store`, `chore(auth): remove unused R2 public url env`.

Jeden commit na spójną zmianę — nie dziel unit/integration testów jeśli napisane razem dla tego samego slice'a.

Nigdy nie łącz zmiany funkcjonalnej z refaktorem w jednym commicie.

Bez trailerów `Co-Authored-By: Claude` i `Generated with` w wiadomościach commitów.

Push zawsze po potwierdzeniu przez człowieka, nigdy automatycznie.
