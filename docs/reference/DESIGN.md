# Design System

Derived from `src/app/globals.css` and `src/app/layout.tsx` on 2026-08-24. The code is
authoritative — this file describes intent and names the tokens, it does not replace them.
Regenerate it from source rather than editing it to describe a change you plan to make.

## Philosophy

Landing Page v2: near-black ground, one acid-lime accent, translucent glass surfaces,
oversized condensed display type. Single theme — `globals.css` defines only `:root`, with no
`.dark` block and no `prefers-color-scheme` query. The app is dark, always.

## Typography

| Role      | Face    | Weights       | Variable                              |
| --------- | ------- | ------------- | ------------------------------------- |
| Body / UI | DM Sans | 400, 500, 700 | `--font-sans`                         |
| Display   | Anton   | 400           | `--font-display`, aliased `--font-heading` |

Both load via `next/font/google`. `html` carries `font-sans`, so Anton is opt-in per element.

## Color

| Token                                   | Value                     | Use                     |
| --------------------------------------- | ------------------------- | ----------------------- |
| `--background` / `--mh-ink`             | `#0a0a0a`                 | page ground             |
| `--foreground`                          | `#fafafa`                 | primary text            |
| `--primary` / `--ring` / `--mh-lime`    | `#d6f24b`                 | the single accent, and focus rings |
| `--primary-foreground`                  | `#0a0a0a`                 | text on lime            |
| `--popover` / `--sidebar` / `--mh-solid`| `#171717`                 | opaque panels           |
| `--card` / `--muted`                    | `rgba(255,255,255,0.05)`  | glass surfaces          |
| `--secondary` / `--accent`              | `rgba(255,255,255,0.08)`  | raised glass            |
| `--mh-glass-hover`                      | `rgba(255,255,255,0.07)`  | glass hover             |
| `--border` / `--input`                  | `rgba(255,255,255,0.09)`  | hairlines               |
| `--muted-foreground`                    | `#a3a3a3`                 | secondary text          |
| `--mh-text-lead`                        | `#d4d4d4`                 | lead paragraphs         |
| `--mh-text-meta`                        | `#737373`                 | metadata                |
| `--mh-text-mono`                        | `#525252`                 | monospaced detail       |
| `--destructive`                         | `#ef4444`                 | errors, delete          |

Surfaces are alpha-white over ink, not opaque greys. Anything opaque is `#171717`.

## Glass

`.bg-card` applies `--mh-glass-blur` = `blur(24px) saturate(1.4)`, prefixed for WebKit. A card
is a translucent fill plus that blur — never a solid panel.

## Radius

`--radius` is `20px`; the scale derives from it: `sm ×0.6`, `md ×0.8`, `lg ×1`, `xl ×1.4`,
`2xl ×1.8`, `3xl ×2.2`, `4xl ×2.6`. Two fixed exceptions: `--mh-radius-pill` `800px` and
`--mh-radius-card` `40px`.

## Layout

`--mh-content-max` `1280px`, `--mh-section-gap` `160px`. `html` sets `scrollbar-gutter: stable`
so page width doesn't shift. `.mh-scroll` hides scrollbars on horizontal shelves.

## Motion

`.mh-write-line` is the hero's write-on effect: a masked gradient sweep over 7s, easing in from
`blur(6px)`, holding legible from 18% to 82%, sweeping out. It is fully disabled under
`prefers-reduced-motion: reduce` — keep that guard on anything added here.

## Fixed details

Autofilled inputs are overridden to `--mh-ink` with a 9999s transition, so Chrome's blue never
appears. Charts step down through `--chart-1…5` (`#d4d4d4` → `#262626`), greyscale by design —
lime is never a data color.
