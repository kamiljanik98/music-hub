## Rozjazd z `docs/` (przeczytaj, zanim zaufasz czemukolwiek innemu w `docs/`)

`docs/` jest objęte `.gitignore` i nic nie wymusza jego aktualizacji przy
commicie, więc odstaje od aplikacji — obecnie o jakieś sześć tygodni.
Konkretnie:

- `app/auth/confirm/route.ts` został usunięty (2026-10-08);
  `docs/reference/ARCHITECTURE.md` i `CONVENTIONS.md` wciąż opisują go jako
  jeden z "czterech" Route Handlerów. Jego usunięcie osierociło też
  `supabase/templates/recovery.html`, który nadal do niego linkuje — mail z
  resetem hasła prowadzi dziś do martwego linku w produkcji.
- `proxy.ts` / `PROTECTED_PATHS` pilnują dziś tylko `/upload`; docs nadal
  piszą `/upload` + `/auth/update-password`.
- Zunifikowany `Card` opisywany w docs nie istnieje (patrz sekcja Player
  wyżej) — docs cytują nawet zły ADR (ADR-016 to schemat społecznościowy,
  nie decyzja o playerze/kartach — tą jest ADR-019).
- Domeny akcji `playlists/` i `auth/` istnieją w kodzie i nie są wymienione
  na liście domen w `ARCHITECTURE.md`.
- `docs/reference/DESIGN.md` odwołuje się do tokenów (`--mh-lime`,
  `--sidebar`, `--chart-1…5`, rozszerzona skala promieni), których nie ma w
  `globals.css`.

Traktuj `docs/adr/ADR-019.md` (ostatnia aktualizacja 2026-10-09) jako
najbardziej aktualny pojedynczy dokument w tym folderze — prowadzi własną
historię zmian zamiast być cicho nadpisywanym.