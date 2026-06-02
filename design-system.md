# PlatoScience — Design System
*Tokens, philosophy, and brand rules for the dashboard. Pull every session.*

---

## 1. Design Philosophy

PlatoScience sits at a rare intersection: **clinical credibility** and **human warmth**. The dashboard serves clinicians who need data clarity and efficiency — but the brand explicitly rejects the cold, blue-and-white aesthetic common in health-tech.

The design direction is: **warm precision.**

**Three tensions to hold in balance:**
1. Data density vs. visual breathing room
2. Brand color boldness vs. interface usability
3. Clinical seriousness vs. approachable tone

---

## 2. Color System

### Brand Colors (from Brand Book)

| Token | Hex | Name | Usage |
|---|---|---|---|
| `--ps-primary` | `#57072F` | Inner Strength | CTAs, active nav, primary actions |
| `--ps-secondary` | `#053146` | Deep Mind | Secondary actions, data viz |
| `--ps-accent` | `#E0FFC2` | New Energy | Highlights, active badges, success |
| `--ps-platocare-1` | `#89516D` | Inner Strength #2 | PlatoCare mid-tone |
| `--ps-platocare-2` | `#AC8599` | Inner Strength #3 | Muted text, placeholders |
| `--ps-platowork-1` | `#506F7E` | Deep Mind #2 | PlatoWork mid-tone |
| `--ps-platowork-2` | `#859AA5` | Deep Mind #3 | Inactive badges |
| `--ps-clay` | `#EAE4DA` | Clay | Warm background base |
| `--ps-white` | `#FFFFFF` | White | Card surfaces |

### Dashboard Functional Palette

| Role | Hex | Notes |
|---|---|---|
| Page background | `#F4F1EC` | Lighter Clay — warm without heaviness |
| Card / panel bg | `#FFFFFF` | White on warm bg creates depth |
| Sidebar bg | `#57072F` | Brand primary — identity anchor |
| Sidebar text | `#EAE4DA` | Clay on primary — passes contrast |
| Topbar bg | `#FFFFFF` | Clean, light |
| Border / divider | `#E8E2D9` | Warm grey-beige, never cold grey |
| Table header bg | `#F9F7F4` | Warm off-white |

### Semantic Colors

| Role | Hex | Notes |
|---|---|---|
| Success | `#2A9D6E` | Warm green — not Bootstrap default |
| Danger | `#C84B4B` | Muted red |
| Warning | `#D4870A` | Amber |
| Info | `#2D7B9E` | Desaturated blue, pulls from Deep Mind |

### Accessibility Rules (from Brand Book)

**Forbidden combinations:**
- Black text on Inner Strength `#57072F` ❌
- Inner Strength text on Deep Mind ❌
- White text on New Energy `#E0FFC2` ❌
- Black text on Deep Mind `#053146` ❌

**Approved combinations:**
- White text on Inner Strength ✅ — sidebar, primary buttons
- White text on Deep Mind ✅ — secondary buttons
- Dark `#2D2D2D` on Clay/White ✅ — body text
- Inner Strength text on White ✅ — links, active labels
- Dark text on New Energy ✅ — accent badges

### Accent Usage Rule

New Energy (`#E0FFC2`) = **max 10%** of any screen's visual surface. Use for small badges, positive indicators, active states. Never as a large panel background.

---

## 3. Typography

### Typeface

**Raleway** is the sole brand typeface (replaces current Poppins which is a template default).

```html
<link href="https://fonts.googleapis.com/css2?family=Raleway:wght@300;400;500;600;700&display=swap" rel="stylesheet">
```

```scss
// _variables.scss override
$font-family-sans-serif: 'Raleway', sans-serif;
```

### Type Scale (Golden Ratio 1.618, base 13px)

| Role | Size | Weight | Usage |
|---|---|---|---|
| Display | 34px / 2.125rem | 600 | Page heroes, empty states |
| H1 | 21px / 1.3125rem | 600 | Major page titles |
| H2 | 18px / 1.125rem | 600 | Section headers |
| H3 | 16px / 1rem | 500 | Card titles |
| Subhead | 14px / 0.875rem | 500 | Table column headers, labels |
| Body | 13px / 0.8125rem | 400 | Default text, table rows |
| Caption | 11px / 0.6875rem | 300 | Timestamps, helper text |

### Typography Rules

- **Headers:** letter-spacing `0.02em`, line-height `1.2`
- **Body:** line-height `1.6`, default letter-spacing
- **Uppercase section labels** (sidebar groups): `10px`, `letter-spacing: 0.1em`, `font-weight: 600`, `opacity: 0.6`
- **Table numbers:** `font-variant-numeric: tabular-nums`
- **Page titles:** Title Case only — never ALL CAPS (reserve uppercase for section labels)

---

## 4. Spacing System

Bootstrap spacer system extended:

```scss
$spacer: 1rem; // 16px

$spacers: (
  0: 0,
  1: 0.25rem,   // 4px  — icon-to-label gaps
  2: 0.5rem,    // 8px  — tight padding
  3: 1rem,      // 16px — default
  4: 1.5rem,    // 24px — card padding, section gaps
  5: 2rem,      // 32px — major section spacing
  6: 3rem,      // 48px — page-level breathing room
);
```

**Component spacing reference:**

| Component | Padding |
|---|---|
| Sidebar nav item | `12px 20px` |
| Sidebar section label | `16px 20px 6px` |
| Card body | `20px 24px` |
| Table cell | `12px 16px` |
| Table header cell | `10px 16px` |
| Page content area | `24px` all sides |
| Modal body | `24px` |
| Form field | `9px 12px` |
| Button default | `8px 20px` |
| Button primary CTA | `10px 24px` |

---

## 5. Layout & Grid

### Dashboard Shell

```
┌──────────────────────────────────────────────┐
│  Sidebar (220px)  │  Topbar (64px)            │
│                   ├──────────────────────────  │
│                   │  Page content (24px pad)   │
└──────────────────────────────────────────────┘
```

- Sidebar: `220px` (down from 250px — gains content space)
- Sidebar collapsed: `60px`
- Topbar: `64px` (down from 70px)
- Content max-width: `1400px`
- Content padding: `24px` all sides

### Common Grid Patterns

| View | Column split |
|---|---|
| Stats row | 4 cards × 3 col each |
| Table views | Full 12 col |
| Detail + sidebar | 8 col + 4 col |
| Step wizard | Full width, max `860px` centered |

### Border Radius

| Element | Radius |
|---|---|
| Cards | `8px` |
| Buttons | `6px` |
| Inputs | `6px` |
| Badges / pills | `20px` |
| Modals | `12px` |
| Avatars | `50%` |

---

## 6. Brand Elements in UI

### Dot Matrix ("5th Element")

CSS-only implementation — no SVG files needed:

```scss
// Standalone utility class (dark variant — for light backgrounds)
.ps-dot-texture {
  background-image: radial-gradient(
    circle,
    rgba(87, 7, 47, 0.12) 1px,
    transparent 1px
  );
  background-size: 16px 16px;
}
```

**Hero banner variant** (light dots on dark maroon background):
```scss
background-image: radial-gradient(circle, rgba(234,228,218,0.15) 1px, transparent 1px);
background-size: 12px 12px;
```

Use as: hero card decoration (right 40%, absolutely positioned), empty state corner accents, sidebar bottom.

> **Note:** The spec originally called for 14px/1.5px — the implementation uses 12px/1px for the hero (finer feel) and 16px/1px for the standalone utility class. Both are acceptable.

### Brand Gradient (Transition Element)

Formula from brand book — two stops of `#57072F`:
```scss
background: linear-gradient(135deg, #57072F 0%, rgba(87,7,47,0) 100%);
```
Use for: section dividers, sidebar bottom border, loading bar.

### Logo Usage

| Location | Variant | Background |
|---|---|---|
| Sidebar top | Horizontal (icon + wordmark) | White on `#57072F` |
| Topbar (mobile) | Icon + "PlatoScience" text | `#57072F` icon box on white |
| Login page | Vertical | On Clay `#EAE4DA` |

**Brand icon file:** `src/assets/images/plato-icon-white.svg`
- White hexagonal paths on transparent background
- Use at 20px inside a 32px maroon rounded box for mobile topbar
- Use at 36px directly in sidebar (sidebar bg provides the maroon field)
- Source: `/Downloads/Logo/Icon-white (transparent).svg`

---

## 7. Bootstrap Variable Overrides

Paste this block at the top of `src/assets/scss/_variables.scss`:

```scss
// ==============================
// PLATOSCIENCE BRAND OVERRIDES
// ==============================

// Core colors
$primary:       #57072F;
$secondary:     #053146;
$success:       #2A9D6E;
$danger:        #C84B4B;
$warning:       #D4870A;
$info:          #2D7B9E;

// Body
$body-bg:       #F4F1EC;
$body-color:    #495057;

// Typography
$font-family-sans-serif: 'Raleway', sans-serif;
$font-size-base: 0.8125rem;

// Sidebar
$sidebar-dark-bg:                    #57072F;
$sidebar-dark-menu-item-color:       rgba(#EAE4DA, 0.75);
$sidebar-dark-menu-item-hover-color: #EAE4DA;
$sidebar-dark-menu-item-active-color: #E0FFC2;
$sidebar-dark-menu-item-icon-color:  rgba(#EAE4DA, 0.6);
$sidebar-width: 220px;

// Cards
$card-border-width:  0;
$card-border-radius: 8px;
$card-box-shadow:    0 1px 3px rgba(87,7,47,0.06), 0 4px 12px rgba(87,7,47,0.03);

// Borders
$border-color:     #E8E2D9;
$border-radius:    6px;
$border-radius-lg: 8px;

// Tables
$table-head-bg:       #F9F7F4;
$table-cell-padding-y: .75rem;
$table-cell-padding-x: 1rem;

// Inputs
$input-border-color:       #E8E2D9;
$input-focus-border-color: #57072F;
$input-focus-box-shadow:   0 0 0 3px rgba(87,7,47,0.1);

// Header
$header-height: 64px;
$header-bg:     #FFFFFF;

// Pagination
$pagination-active-bg:           #57072F;
$pagination-active-border-color: #57072F;

// Cards — spacing
$card-spacer-x: 1.5rem;   // 24px horizontal card body padding
$card-spacer-y: 1.25rem;  // 20px vertical card body padding

// Sidebar active item color — override template purple (#556ee6)
$sidebar-menu-item-active-color: #57072F;
$menu-item-active-color:         #57072F;
```

---

## 8. Utility Classes

Custom classes added in `src/assets/scss/custom/components/` — use these in JSX instead of inline styles.

### Section label — `.ps-section-label`
Defined in `_card.scss`. Use above content groups (e.g. "Platform overview", "Quick access").
```scss
.ps-section-label {
  font-size: 11px;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.1em;
  color: #AC8599;
  margin-bottom: 12px;
}
```
Usage: `<p className="ps-section-label">Platform overview</p>`

### Dot texture — `.ps-dot-texture`
Defined in `_helper.scss`. Decorative background for panels, empty states.
```scss
.ps-dot-texture {
  background-image: radial-gradient(circle, rgba(87,7,47,0.12) 1px, transparent 1px);
  background-size: 16px 16px;
}
```

### Badge semantic variants
Defined in `_badge.scss`. Use instead of Bootstrap color props on `<Badge>`.

| Class | Background | Text | Meaning |
|---|---|---|---|
| `.ps-badge-active` | `#E0FFC2` | `#2A4A1F` | Active, online, enabled |
| `.ps-badge-inactive` | `#F4F1EC` | `#AC8599` | Inactive, disabled, none |
| `.ps-badge-position` | `#506F7E` | `#FFFFFF` | Electrode position (L/R/Back) |
| `.ps-badge-secondary` | `#053146` | `#FFFFFF` | Custom type, secondary label |

Usage: `<span className="badge ps-badge-active">Active</span>`

### Empty state block — `.ps-empty-state`
Defined in `_helper.scss`. Full-width centered empty state with texture. See Section 9 (Empty States) for the React component.

---

## 9. Empty States

**Status: ✅ Implemented**

React component at `src/components/Common/EmptyState.jsx`:

```jsx
<EmptyState
  title="No patients yet."
  message="Add your first patient or adjust your search."
  actionText="+ Add Patient"
  onAction={() => setModal(true)}
/>
```

Props:
| Prop | Type | Default | Notes |
|---|---|---|---|
| `title` | string | `"Nothing here yet."` | Short, friendly |
| `message` | string | — | Optional supporting sentence |
| `actionText` | string | — | Button label; requires `onAction` |
| `onAction` | function | — | Button click handler |

SCSS (in `_helper.scss`):
```scss
.ps-empty-state {
  position: relative;
  text-align: center;
  padding: 48px 24px;
  overflow: hidden;

  &__icon    { 40px maroon icon container }
  &__title   { 15px, #57072F, 600 weight }
  &__message { 13px, #AC8599, max-width 340px }
  &__texture { absolute, full cover, dot pattern, 4% opacity }
}
```

Wired into: `PlatoTableContainer`, `LocalTableContainer`, `PatientsTable`, Clinicians page, Stimulations page.

---

## 10. Mobile Responsive Rules

**Status: ✅ Implemented**

### Breakpoints used
Bootstrap 5 defaults — same as project uses throughout:
- `≤575px` — phones (xs)
- `≤767px` — phones + small tablets (sm)

### Component mobile overrides

| Component | Mobile rule | Breakpoint |
|---|---|---|
| Page content padding | `16px` all sides | `≤767px` |
| Stat cards | 2-column grid (`xs="6"`) | Always — `xs="6" sm="6" lg="3"` |
| Quick-access cards | Half-width (`sm={6}`) | `xs={12} sm={6} xl={3}` |
| Step wizard | `flex-wrap: wrap`, font 11px | `≤767px` |
| Mobile topbar logo | Icon + "PlatoScience" shown | `d-lg-none` |
| Hero icon decoration | Hidden below lg | `d-none d-lg-flex` |
| Table header | 10px font, 8px padding | `≤767px` |
| Table body cells | 12px font, 10px padding | `≤767px` |
| Form inputs / selects | `font-size: 16px` | `≤575px` (prevents iOS zoom) |
| Modals | Bottom-sheet (`border-radius: 12px 12px 0 0`) | `≤575px` |
| Card body | `padding: 16px` | `≤767px` |

### iOS zoom prevention
Safari auto-zooms when an input's `font-size` is below `16px`. Override is in `_forms.scss`:
```scss
@media (max-width: 575.98px) {
  .form-control, .form-select { font-size: 16px; }
}
```
This is intentional and must not be reverted.

### Mobile topbar logo
Rendered in `PlatoHeader.jsx` with class `d-lg-none d-md-block`:
```jsx
<div style={{ width:32, height:32, borderRadius:8, background:"#57072F", ... }}>
  <img src={logoIcon} height="20" />
</div>
<span style={{ fontWeight:600, fontSize:14, color:"#57072F" }}>PlatoScience</span>
```

---

## 11. Extended Rules (Brand Book Gaps)

Things the brand book doesn't specify — decisions made for the dashboard:

| Gap | Decision |
|---|---|
| Icon style | Outline, 18px, stroke 1.5px, color inherits from context |
| Loading states | Skeleton shimmer using Clay tones `#EAE4DA → #F4F1EC` |
| Error states | `#C84B4B` text on `#FDF2F2` warm background |
| Success toast | `#57072F` background, white text, top-center position |
| Row hover | `rgba(87,7,47,0.025)` — barely-there primary tint |
| Focus rings | `3px rgba(87,7,47,0.15)` on all interactive elements |
| Disabled state | `50%` opacity, `cursor: not-allowed` |
| Scrollbars | `#AC8599` thumb on `#EAE4DA` track (via SimpleBar) |
| Data viz colors | Primary → Secondary → PlatoCare-1 → PlatoWork-1 → Accent |
| Sort indicators | `#57072F` chevrons, sortable columns only |

---

## 12. Non-Canonical Gate Styles

`src/pages/Gate/design-system/theme.css` is **not** the PlatoScience design system. It uses separate Gate tokens: blue/purple colors, Inter font, cold greys, and gradients that conflict with the dashboard direction.

Treat Gate styles as legacy/local feature styles unless explicitly asked to work inside the Gate area.
