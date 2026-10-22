# MusicHub — mapa projektu

**Spis treści:** 
- Co to jest 
- Stack  
- Mapa domen 
- Pliki i storage
- Route Handlery 
- Logowanie i dostęp 
- Player 
- Pobieranie danych
- Konwencje 
- Decyzje w skrócie 
- Testy 
- Rozjazd z `docs/`

---

## Co to jest

Aplikacja do publikowania i słuchania muzyki, w stylu SoundClouda. Artysta
wrzuca utwór (opcjonalnie też osobne stemsy), utwór dostaje waveform,
słuchacze znajdują go przez wyszukiwarkę albo obserwując artystę, mogą go
polubić, dodać do playlisty i odtworzyć przez jeden, zawsze widoczny pasek
playera. Logowanie e-mailem/hasłem albo przez Discorda.

---

## Stack

| Warstwa | Wybór |
|---|---|
| Framework | Next.js 16 (App Router, Turbopack), React 19 |
| Baza danych / Auth | Supabase (Postgres + RLS + GoTrue) |
| Pliki | Cloudflare R2 (API kompatybilne z S3, zero kosztów za pobieranie) |
| Stan klienta | Zustand (żadnego React Contextu dla stanu globalnego) |
| Formularze | react-hook-form + Zod |
| Waveform | wavesurfer.js |
| Testy | Vitest |
| UI | shadcn jako bilbioteka komponentów, TailwindCSS |

---

## Mapa modułów

`src/actions/<module>/` — jeden plik = jedna server action:

| Moduł | Co obsługuje |
|---|---|
| `songs/` | CRUD utworów, wyszukiwanie, feed, polubienia, historia odtworzeń, resolve song URL |
| `stems/` | dodawanie/usuwanie/odczyt — ownership sprawdzany względem utworu-rodzica |
| `profile/` | odczyt po nicku, edycja profilu, avatar/banner |
| `social/` | follow/unfollow, like/unlike, followersi/following/sugerowani użytkownicy |
| `playlists/` | tworzenie/usuwanie, dodawanie/usuwanie utworu, odczyt playlisty |
| `auth/` | zmiana hasła |

`src/hooks/<module>/` ma ten sam podział, plus dodatkowo `player/`,
`search/`, `upload/`.

Strony (`src/app/(pages)/...`): strona główna, `/search`, `/feed`,
`/library`, `/song/[id]`, `/profile/[nickname]` (+ zakładki: polubienia,
obserwujący, obserwowani, playlisty, historia, ustawienia), `/playlists/[id]`.
`src/app/(focused)/upload` to osobna grupa layoutu (bez navbara i playera) —
tylko na czas uploadu.

---

## Pliki i storage — zrozum to najpierw

Supabase trzyma **tylko wiersze w bazie**: `profiles`, `songs`, `stems`,
`follows`, `likes`, `plays`, `playlists`, `playlist_songs` + auth. **Każdy
plik leży w R2**, nigdy w Supabase Storage — powód: zero kosztów za transfer
(ADR-001).

| Bucket | Dostęp | Jak się do niego dostajemy |
|---|---|---|
| `songs`, `stems` | prywatny | presigned URL ważny 1h, tylko po stronie serwera |
| `covers`, `avatars`, `banners` | publiczny | `NEXT_PUBLIC_R2_*_URL` + ścieżka zapisana w bazie |

Supabase i R2 nie dzielą jednej transakcji, więc kolejność operacji jest
odwrócona między tworzeniem a usuwaniem:

- **Upload:** najpierw plik do R2 → potem wiersz do Supabase. Błąd zapisu do
  bazy → cofamy to, co właśnie trafiło do R2.
- **Usuwanie:** najpierw czytamy ścieżki z wiersza w bazie → usuwamy pliki z
  R2 → na końcu usuwamy sam wiersz. (Wiersz to jedyny ślad po tym, co trzeba
  posprzątać — usunięty za wcześnie zostawia sierotę w R2, której nikt już
  nie znajdzie.)
- Zadanie cron (`app/api/cron/cleanup/route.ts`) co jakiś czas porównuje
  pliki w R2 z wierszami w bazie i samodzielnie usuwa potwierdzone sieroty —
  to siatka bezpieczeństwa na wypadek, gdyby powyższy rollback też zawiódł.

---

## Route Handlery — wyjątek, nie reguła

Każda mutacja to Server Action, **poza trzema wyjątkami** — bo w tych
miejscach coś spoza aplikacji musi trafić pod konkretny adres HTTP:

1. `app/api/upload/route.ts` — body pliku do 200MB
2. `app/api/cron/cleanup/route.ts` — Vercel Cron potrzebuje wywoływalnego
   URL-a, chronionego nagłówkiem `Authorization: Bearer $CRON_SECRET`
3. `app/auth/callback/route.ts` — Discord OAuth wraca redirectem z `?code=`

---

## Logowanie i dostęp — dwa różne mechanizmy, celowo

- **Twarde przekierowanie:** `src/proxy.ts` (middleware, w Next 16
  przemianowane) pilnuje tylko `/upload` — to jedyna strona bez publicznego
  wariantu.
- **Miękka blokada:** Feed i Library to Server Componenty, które same
  sprawdzają `supabase.auth.getUser()` i w razie braku sesji renderują
  `<AuthGate>` zamiast treści — bez przekierowania, modal logowania otwiera
  się sam.
- **Wszystko inne jest publiczne** — akcje wymagające logowania (polub,
  obserwuj, wrzuć utwór) po prostu otwierają modal logowania
  (`useAuthModal().open()`), zamiast przekierowywać gdziekolwiek.

Cały globalny stan klienta (player, modal logowania, zalogowany użytkownik)
to Zustand. Store nic sam z siebie nie wypełnia — `useUser` zostaje pusty,
dopóki `<UserProvider>` się nie zamontuje i nie wywoła `setUser()`.

---

## Player — jeden prawdziwy element `<audio>`

Rozbity na trzy części (ADR-019, aktualne na 2026-10-09):

- `components/player/audio.tsx` — jedyny prawdziwy `<audio>` w całej
  aplikacji; odpowiada za odtwarzanie i zapisuje odsłuchanie (`recordPlay`)
  po przekroczeniu 15 sekund.
- `components/player/bar.tsx` — powłoka layoutu, przełącza się między...
- `components/player/view/compact.tsx` i `.../expanded.tsx` — dwoma
  widokami interfejsu. Oba czytają wspólny stan ze store'a `usePlayer`
  (`isPlaying`, `progress`, `duration`) i zgłaszają żądania
  (`requestSeek`/`requestPlayPause`), zamiast samemu dotykać audio.

Karty utworów **nie są** jednym wspólnym komponentem — każdy konsument ma
swój: `shelf-card.tsx` (strona główna), `waveform-card.tsx` (profil),
`feed-row.tsx` / `song-post.tsx` (feed), `search-row.tsx` (wyszukiwarka),
`song-row.tsx` (playlisty, biblioteka, polubienia, historia). Jeden wspólny
`Card` z wariantami `grid`/`row`/`waveform` istniał krótko (2026-07-28 →
2026-08-23) i został świadomie rozdzielony z powrotem, gdy `SearchRow` i
lista polubień zaczęły potrzebować innych danych (szczegóły w historii zmian
ADR-019). `waveform.tsx` to czwarty, osobny komponent — sam waveform +
przycisk play na stronie szczegółów utworu.

wavesurfer.js tylko rysuje waveform, nie odtwarza dźwięku, i inicjalizuje
się leniwie (dopiero gdy wejdzie w pole widoku) — żeby lista 50 utworów nie
ściągała 50 plików audio naraz. Odsłuch stemów (drugi, niezależny kanał
audio) był zaprojektowany, nigdy niezbudowany, i świadomie pozostaje
nierozstrzygnięty (ADR-019, "otwarte decyzje").

---

## Pobieranie danych — co, kiedy

| Potrzeba | Mechanizm |
|---|---|
| Lista utworów w widoku klienckim (karty, Feed) | Hook → Supabase bezpośrednio |
| Wyniki wyszukiwania (SSR, filtrowalne) | Server Action wywołana wprost z Server Componentu |
| Presigned URL do audio/stemu | Hook → Server Action → `lib/r2/` |
| URL okładki/avatara/bannera | Publiczny base URL bucketu + zapisana ścieżka, bez zapytania sieciowego |
| Każda mutacja | Server Action (poza dwoma wyjątkami Route Handlerów wyżej) |

Dwie rzeczy o PostgREST, które warto znać na pamięć:

- **Embed typu to-one wraca jako obiekt, nigdy jako tablica
  jednoelementowa** (`stem.songs.uploaded_by`, nie `stem.songs[0]`).
- **Embed (`profiles!following_id(...)`) działa tylko wzdłuż zadeklarowanego
  klucza obcego** do embedowanej tabeli — dlatego klucze obce tabel
  społecznościowych wskazują na `public.profiles`, nie na `auth.users`.
  Wskaż `auth.users` i embed wywali się z `PGRST200`.

---

## Konwencje warte powtórzenia na rozmowie

- **Zero komentarzy wyjaśniających w kodzie, z zasady.** Uzasadnienie
  zmiany żyje w `docs/adr/`, `docs/history/CHANGELOG.md` albo
  `.claude/CLAUDE.md` — nigdy jako `//` obok linijki. Powód: komentarz
  dubluje dokumentację i prędzej czy później zaczyna się z nią rozjeżdżać.
- **Server actions sprawdzają właściciela podwójnie**: RLS na poziomie
  bazy + jawny `supabase.auth.getUser()` + sprawdzenie ownership na
  poziomie aplikacji. (!!!??? Akcje odczytu traktują brak użytkownika jako stan
  normalny (`error: null`, personalizacja po prostu pominięta); mutacje
  traktują to jako realny błąd.)
- **Optimistic UI** (`use-follow.ts`, pierwotnie też `use-like.ts`): klik →
  natychmiastowa zmiana UI → wywołanie Server Action w tle → błąd cofa
  zmianę i pokazuje toast, sukces pokazuje inny toast, nigdy
  `router.refresh()` po mutacji (bo odpaliłby ponownie wszystkie zapytania
  na stronie). (!!!??? `use-like.ts` od pewnego czasu trzyma ten sam stan w
  globalnym store Zustand zamiast lokalnego `useState` — czyli dziś ten sam
  kontrakt mają dwie różne implementacje stanu. Warto to wiedzieć, jeśli
  ruszasz którykolwiek z tych hooków.)
- **Gatunek vs. tagi:** gatunek to zamknięta lista `GENRES`
  (`lib/constants.ts`); tagi są otwarte, ale ograniczone — maks. 8 tagów,
  24 znaki każdy, małe litery + deduplikacja po stronie klienta, i to samo
  ograniczenie wymuszone jeszcze raz w Postgresie (`CHECK` wołający
  niemutowalną funkcję). Walidacja kliencka to uprzejmość, gwarancja jest w
  bazie.

---

## Decyzje w skrócie

Pełne uzasadnienie w `docs/adr/`, tu wersja jednolinijkowa do szybkiego
przypomnienia.

| # | Decyzja | Dlaczego |
|---|---|---|
| 001 | R2 zamiast Supabase Storage | koszt transferu audio |
| 002 | Route Handler + ręczny rollback przy upload/delete | body do 200MB, brak wspólnej transakcji |
| 003 | Vitest zamiast Jest | natywny ESM/TS, bez warstwy Babel/ts-jest |
| 004 | Zustand zamiast Context; dwupoziomowe bramkowanie logowania | (!!! ??? globalne singletony vs. stan lokalny; nie każda zablokowana akcja zasługuje na przekierowanie) |
???!!! | Natywna weryfikacja e-mail Supabase (bez własnej trasy `verifyOtp`) | lokalnie `redirect_to` w linku z maila ignorował `emailRedirectTo`; oddanie tego Supabase'owi to obchodzi — **dziś częściowo cofnięte**, patrz rozjazd niżej |
| 006 | Auth jako modal, nie osobne strony | logowanie/rejestracja to nie nawigacja |
| 007 | Nick wybierany przez użytkownika + pre-check, `UNIQUE` jako zabezpieczenie | nick generowany z e-maila był nieczytelny; surowy błąd ograniczenia cofał cały insert do `auth.users` |
| 008 | Hooki auth zawsze zwracają `{ error: Error \| null }` | mieszanka `string`/`AuthError` dawała niespójną obsługę w formularzach |
| 009 | Discord OAuth przez popup | pełny redirect kasował/migał błędami walidacji formularza w tle |
| 010 | `react-dropzone` + `Controller` dla audio, zwykły `<input>` + `Controller` dla stemsów | główny plik potrzebuje drag&drop i komunikatów o odrzuceniu; stemsy nie |
| 011 | `useCallback` z pełnymi zależnościami w handlerach next/prev playera | nieaktualne domknięcie w `audio.onended` mogło przejść do złego utworu |
| 012 | Kategoria stemu jako enum w Postgresie, nie dowolny tekst | `Vocals`/`vocal`/`Lead Vox` psuło filtrowanie |
| ???!!! | Search jako bezpośrednie wywołanie Server Action z Server Componentu, nie rozszerzenie `useGetSongs` | inny kształt konsumenta (SSR + filtrowanie vs. pełna lista montowana po stronie klienta) |
| 014 | Podpowiedzi wyszukiwania z istniejących tytułów utworów, nie z historii wyszukiwań | nie ma tabeli z historią wyszukiwań do przeszukania |
| 015 | Debounce (300ms) + flaga `cancelled` w `useSearchSuggestions` | mniej requestów; ochrona przed odpowiedziami wracającymi nie po kolei — dwa różne problemy, oba wymagane |
| 016 | RLS na `follows`/`likes` + `CHECK` przeciw self-follow; sugerowani użytkownicy losowani z ograniczonej puli, nie `ORDER BY random()` | sama walidacja w aplikacji nie wystarcza; unikamy sortowania całej tabeli przy każdym zapytaniu |
| 017 | `/library` jako osobna, prywatna trasa, nie alias `/profile/[nickname]` | prywatny hub  vs. publiczne przeglądanie profilu — te same parametryzowane akcje, inne strony |
| ??!! | Wspólny helper `attachIsLiked` zamiast embeda `likes!left(user_id)` | embed wymaga ponownego dopisania filtra viewera w każdym zapytaniu; jedno pominięcie i cudze polubienie wygląda jak Twoje |
| 019 | Jeden prawdziwy `<audio>`; karty utworów zostają osobne per-konsument, nie zunifikowane | zapobiega równoczesnemu odtwarzaniu; jeden `Card` z wariantami był próbą (2026-07-28) świadomie cofniętą (karty 2026-08-23, player 2026-10-09), gdy konsumenci zaczęli potrzebować różnych danych — ADR-019 to żywy dokument z własną historią zmian, nie jednorazowa decyzja |

---

## Testy

Vitest, globalnie `environment: "node"`, `// @vitest-environment jsdom` w
plikach z komponentami. Dziś 23 pliki, wszystkie dotyczą auth/infrastruktury
— akcje, hooki, player i logika społecznościowa nie mają jeszcze testów
(zapisane w `docs/TODO.md`).

---


