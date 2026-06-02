# PlatoScience Dashboard Design System

This is the canonical design reference for the PlatoScience dashboard.

The design direction is **warm precision**: clinically credible, efficient, and warmer than generic blue-and-white health tech.

## Design Philosophy

PlatoScience sits between clinical seriousness and human warmth. The dashboard should help time-pressured clinical and operations users work quickly and confidently.

Balance these tensions:

- Data density vs. visual breathing room.
- Brand color boldness vs. interface usability.
- Clinical credibility vs. approachable tone.

The UI should be clear and efficient first, branded second.

## Color System

### Brand Colors

| Token | Hex | Name | Usage |
|---|---|---|---|
| `--ps-primary` | `#57072F` | Inner Strength | Primary actions, active nav, key brand moments |
| `--ps-secondary` | `#053146` | Deep Mind | Secondary actions, data visualization |
| `--ps-accent` | `#E0FFC2` | New Energy | Small highlights, active badges, success accents |
| `--ps-platocare-1` | `#89516D` | Inner Strength 2 | Mid-tone brand support |
| `--ps-platocare-2` | `#AC8599` | Inner Strength 3 | Muted text, placeholders |
| `--ps-platowork-1` | `#506F7E` | Deep Mind 2 | Secondary labels, position badges |
| `--ps-platowork-2` | `#859AA5` | Deep Mind 3 | Inactive/support text |
| `--ps-clay` | `#EAE4DA` | Clay | Warm neutral base |
| `--ps-white` | `#FFFFFF` | White | Cards and panels |

### Dashboard Palette

| Role | Hex | Notes |
|---|---|---|
| Page background | `#F4F1EC` | Warm off-white |
| Card / panel background | `#FFFFFF` | Clean readable surface |
| Sidebar background | `#57072F` | Brand anchor |
| Sidebar text | `#EAE4DA` | Clay on primary |
| Topbar background | `#FFFFFF` | Quiet and clean |
| Border / divider | `#E8E2D9` | Warm grey-beige |
| Table header background | `#F9F7F4` | Warm off-white |

### Semantic Colors

| Role | Hex | Notes |
|---|---|---|
| Success | `#2A9D6E` | Warm green, not Bootstrap default |
| Danger | `#C84B4B` | Muted red |
| Warning | `#D4870A` | Amber |
| Info | `#2D7B9E` | Desaturated blue from Deep Mind family |

## Accessibility Rules

Forbidden combinations:

- Black text on Inner Strength `#57072F`.
- Inner Strength text on Deep Mind `#053146`.
- White text on New Energy `#E0FFC2`.
- Black text on Deep Mind `#053146`.

Approved combinations:

- White text on Inner Strength.
- White text on Deep Mind.
- Dark `#2D2D2D` text on Clay or White.
- Inner Strength text on White.
- Dark text on New Energy.

New Energy `#E0FFC2` should be used sparingly, around 10% or less of a screen. It works best for small badges and positive indicators, not large panels.

## Typography

Use **Raleway** as the sole brand typeface.

```scss
$font-family-sans-serif: 'Raleway', sans-serif;
```

| Role | Size | Weight | Usage |
|---|---|---|---|
| Display | `34px` | 600 | Empty states, major feature moments |
| H1 | `21px` | 600 | Major page titles |
| H2 | `18px` | 600 | Section headers |
| H3 | `16px` | 500 | Card titles |
| Subhead | `14px` | 500 | Labels and table headings |
| Body | `13px` | 400 | Default text and table rows |
| Caption | `11px` | 300 | Helper text and timestamps |

Typography rules:

- Page titles use Title Case, not ALL CAPS.
- Small section labels may be uppercase.
- Body text uses line-height around `1.6`.
- Table numbers use `font-variant-numeric: tabular-nums`.
- Do not reintroduce Poppins.

## Spacing

Use Bootstrap's spacer system as the baseline:

| Token | Size | Use |
|---|---|---|
| `1` | `4px` | Icon-to-label gaps |
| `2` | `8px` | Tight padding |
| `3` | `16px` | Default spacing |
| `4` | `24px` | Card padding, section gaps |
| `5` | `32px` | Major section spacing |
| `6` | `48px` | Page-level breathing room |

Component spacing reference:

| Component | Padding |
|---|---|
| Sidebar nav item | `12px 20px` |
| Sidebar section label | `16px 20px 6px` |
| Card body | `20px 24px` |
| Table cell | `12px 16px` |
| Table header cell | `10px 16px` |
| Page content area | `24px` |
| Modal body | `24px` |
| Form field | `9px 12px` |
| Button default | `8px 20px` |
| Primary CTA | `10px 24px` |

## Layout

Dashboard shell:

```text
Sidebar: 220px
Collapsed sidebar: 60px
Topbar: 64px
Content padding: 24px
Content max-width: 1400px
```

Common layout patterns:

| View | Pattern |
|---|---|
| Stats row | Four cards on desktop, two columns on mobile |
| Table views | Full-width card |
| Detail + sidebar | 8 / 4 column split |
| Step wizard | Full width, max `860px`, centered |

## Radius

| Element | Radius |
|---|---|
| Cards | `8px` |
| Buttons | `6px` |
| Inputs | `6px` |
| Badges / pills | `20px` |
| Modals | `12px` |
| Avatars | `50%` |

## Brand Elements

### Dot Matrix

Use as a subtle texture on empty states, hero decoration, or sidebar bottom areas.

```scss
.ps-dot-texture {
  background-image: radial-gradient(
    circle,
    rgba(87, 7, 47, 0.12) 1px,
    transparent 1px
  );
  background-size: 16px 16px;
}
```

For dark maroon backgrounds:

```scss
background-image: radial-gradient(circle, rgba(234, 228, 218, 0.15) 1px, transparent 1px);
background-size: 12px 12px;
```

### Brand Gradient

Use sparingly for section dividers, loading bars, or hero treatment.

```scss
background: linear-gradient(135deg, #57072F 0%, rgba(87, 7, 47, 0) 100%);
```

## Bootstrap Variable Overrides

Global tokens belong in `src/assets/scss/_variables.scss`.

```scss
$primary:       #57072F;
$secondary:     #053146;
$success:       #2A9D6E;
$danger:        #C84B4B;
$warning:       #D4870A;
$info:          #2D7B9E;

$body-bg:       #F4F1EC;
$body-color:    #495057;

$font-family-sans-serif: 'Raleway', sans-serif;
$font-size-base: 0.8125rem;

$sidebar-dark-bg:                     #57072F;
$sidebar-dark-menu-item-color:        rgba(#EAE4DA, 0.75);
$sidebar-dark-menu-item-hover-color:  #EAE4DA;
$sidebar-dark-menu-item-active-color: #E0FFC2;
$sidebar-dark-menu-item-icon-color:   rgba(#EAE4DA, 0.6);
$sidebar-width: 220px;

$card-border-width: 0;
$card-border-radius: 8px;
$card-box-shadow: 0 1px 3px rgba(87, 7, 47, 0.06),
                  0 4px 12px rgba(87, 7, 47, 0.03);

$border-color:     #E8E2D9;
$border-radius:    6px;
$border-radius-lg: 8px;

$table-head-bg:       #F9F7F4;
$table-cell-padding-y: .75rem;
$table-cell-padding-x: 1rem;

$input-border-color:       #E8E2D9;
$input-focus-border-color: #57072F;
$input-focus-box-shadow:   0 0 0 3px rgba(87, 7, 47, 0.1);

$header-height: 64px;
$header-bg:     #FFFFFF;

$pagination-active-bg:           #57072F;
$pagination-active-border-color: #57072F;
```

## Component Rules

- Primary buttons use Inner Strength `#57072F`.
- Secondary buttons use Deep Mind `#053146`.
- Active boolean badges use New Energy with dark text.
- Table headers use warm off-white, not cold grey.
- Search inputs belong above tables, not inside table header cells.
- Empty states should use the shared `EmptyState` component.

## Mobile Rules

- Page content padding becomes `16px` on small screens.
- Stat cards become two columns on phones.
- Step wizards can wrap on small screens.
- Inputs and selects use `font-size: 16px` at phone sizes to prevent iOS Safari zoom.
- Modals can behave like bottom sheets on phones.

## Anti-Regression Checklist

Before finishing styling work, check:

- No purple/violet template colors such as `#556ee6`, `#6f42c1`, or `#667eea`.
- No Bootstrap green `#34c38f` on buttons or CTAs.
- No Poppins.
- No cold grey dashboard backgrounds such as `#eff2f7`, `#f8f9fa`, or `#e9ecef`.
- No black text on `#57072F`.
- No white text on `#E0FFC2`.
- No ALL CAPS page titles.
- No teal/cyan for Active boolean status.
- No search inputs embedded inside table header cells.

## Non-Canonical Gate Styles

`src/pages/Gate/design-system/theme.css` is not the canonical PlatoScience design system. It uses separate Gate tokens, blue/purple colors, Inter font, cold greys, and gradients that conflict with the Plato dashboard direction.

Treat Gate styles as legacy/local feature styles unless the user explicitly asks to work inside the Gate area.

