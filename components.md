# PlatoScience — Component Specifications
*Pull this when building or touching UI components. Read alongside design-system.md.*

---

## 1. Sidebar

**Status: ✅ Implemented**

```scss
// Core
background: #57072F;  // Inner Strength
width: 220px;

// Nav items
color: rgba(#EAE4DA, 0.75);
font-size: 13px;
font-weight: 500;
padding: 12px 20px;

// Hover
background: rgba(255,255,255,0.05);
color: #EAE4DA;
transition: all 0.15s ease;

// Active item
color: #E0FFC2;           // New Energy text
background: rgba(255,255,255,0.08);
border-left: 3px solid #E0FFC2;  // Left accent bar

// Section labels (CLINICS, ADMINS, etc.)
font-size: 10px;
font-weight: 600;
text-transform: uppercase;
letter-spacing: 0.1em;
opacity: 0.6;
padding: 16px 20px 6px;
```

**Logo area — implemented in `PlatoSidebar.jsx`:**
- `background: transparent` — inherits maroon from sidebar, no separate bg box
- `logo-light.svg` (white strokes icon) at height 36px
- "PlatoScience" — Raleway 600, 15px, `#FFFFFF`, next to icon
- "MEDICAL" — Raleway 500, 11px, `rgba(234,228,218,0.6)`, uppercase, letter-spacing 0.08em
- Bottom border: `1px solid rgba(234,228,218,0.1)`
- ✅ Brand hexagonal icon: `plato-icon-white.svg` (white paths, transparent bg) — copied from `/Downloads/Logo/Icon-white (transparent).svg`

---

## 2. Topbar

**Status: ✅ Implemented**

```scss
background: #FFFFFF;
height: 64px;
border-bottom: 1px solid #EAE4DA;
box-shadow: 0 1px 4px rgba(87, 7, 47, 0.06);

// User avatar (admin: plato-icon-white.svg on #57072F bg)
background: #57072F;   // plato-admin role
color: #FFFFFF;
border-radius: 50%;
padding: 6px;

// Non-admin avatar
background: #EAE4DA;
color: #57072F;
border-radius: 50%;

// Breadcrumb
font-size: 12px;
// Parent items: #AC8599
// Current item: #57072F
```

**Mobile logo** (shown `d-lg-none`): 32px maroon rounded box with white icon + "PlatoScience" Raleway 600 text. Implemented in `PlatoHeader.jsx`.

---

## 3. Buttons

**Status: ✅ Implemented** — All green `#34c38f` buttons eliminated. `.btn-success` overridden globally in `_buttons.scss` to use `#57072F` (with `!important`) — covers both `color="success"` Reactstrap prop and `className="btn btn-success"` HTML.

### Primary (Add, Save, Create, Submit)
```scss
background: #57072F;
color: #FFFFFF;
border: none;
border-radius: 6px;
padding: 10px 24px;
font-family: 'Raleway', sans-serif;
font-size: 13px;
font-weight: 600;
transition: background 0.15s ease;

&:hover  { background: #6d0c3a; }
&:active { background: #420521; }
&:focus-visible { box-shadow: 0 0 0 3px rgba(87,7,47,0.3); }
```

### Secondary (Export, Research actions)
```scss
background: #053146;
color: #FFFFFF;
// Same structure as primary
&:hover { background: #074260; }
```

### Outline / Ghost
```scss
background: transparent;
color: #57072F;
border: 1.5px solid #57072F;
&:hover { background: rgba(87,7,47,0.06); }
```

### Danger (Disable, Delete)
```scss
background: #C84B4B;
color: #FFFFFF;
&:hover { background: #a83c3c; }
```

### Disabled (all variants)
```scss
opacity: 0.5;
cursor: not-allowed;
pointer-events: none;
```

---

## 4. Tables

**Status: ✅ Implemented** — Header, body row, hover, and border styles all applied. Column search inputs remain inside header cells (V0 scope — UX changes deferred to V1).

### Header
```scss
thead th {
  background: #F9F7F4;
  color: #57072F;
  font-size: 11px;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.07em;
  border-bottom: 2px solid #EAE4DA;
  padding: 10px 16px;
  font-variant-numeric: tabular-nums;
}
```

### Body rows
```scss
tbody td {
  padding: 12px 16px;
  font-size: 13px;
  color: #495057;
  border-bottom: 1px solid #F4F1EC;
  vertical-align: middle;
}

tbody tr:hover {
  background: rgba(87, 7, 47, 0.025);
}
```

### Filter row
Move column search inputs **above** the table in a dedicated filter row. Not inside `<th>` elements.

### Sort indicators
`#57072F` chevrons, visible only on sortable columns.

---

## 5. Badges / Status Chips

```scss
.badge {
  font-size: 11px;
  font-weight: 600;
  padding: 4px 10px;
  border-radius: 20px;
  letter-spacing: 0.04em;
}
```

| Variant | Background | Text | When to use |
|---|---|---|---|
| Primary / Default | `#57072F` | `#FFFFFF` | Patient type: Default |
| Secondary / Custom | `#053146` | `#FFFFFF` | Treatment type: Custom |
| Position | `#506F7E` | `#FFFFFF` | Electrode: Left/Right/Back |
| Active (boolean) | `#E0FFC2` | `#2A4A1F` | Status: Active, Online |
| Inactive | `#F4F1EC` | `#AC8599` | Status: Disabled, Inactive |

---

## 6. Cards

### Content card (default)
```scss
.card {
  background: #FFFFFF;
  border: none;
  border-radius: 8px;
  box-shadow: 0 1px 3px rgba(87,7,47,0.06),
              0 4px 12px rgba(87,7,47,0.03);
  padding: 20px 24px;
}
```

### Stat card
```scss
.stat-card {
  // Same base as .card

  .metric {
    font-size: 28px;
    font-weight: 700;
    color: #57072F;
    font-variant-numeric: tabular-nums;
    line-height: 1;
  }

  .label {
    font-size: 11px;
    font-weight: 600;
    text-transform: uppercase;
    letter-spacing: 0.07em;
    color: #AC8599;
    margin-top: 4px;
  }

  .icon-container {
    background: rgba(87,7,47,0.06);
    border-radius: 8px;
    padding: 10px;
    color: #57072F;
  }
}
```

### Dashboard hero / welcome banner
**Status: ✅ Implemented** — Brand maroon gradient, dot texture, personalized greeting.

**Layout:** Single hero card (no redundant welcome card below). `CardUser` component removed from `Dashboard-user/index.jsx`. Username pulled via `useUser()` hook with fallback chain: `user.username → user.email prefix → "Admin"`.

```scss
.dashboard-hero {
  background: linear-gradient(135deg, #57072F 0%, #7a1a46 100%);
  border-radius: 12px;
  padding: 32px 40px;
  position: relative;
  overflow: hidden;
  color: #FFFFFF;

  // Dot matrix texture (brand "5th Element")
  &::after {
    content: '';
    position: absolute;
    right: 0; top: 0; bottom: 0;
    width: 40%;
    background-image: radial-gradient(circle, rgba(234,228,218,0.15) 1px, transparent 1px);
    background-size: 12px 12px;
    pointer-events: none;
  }

  h2 {
    font-size: 22px;
    font-weight: 600;
    margin-bottom: 8px;
  }

  p {
    font-size: 13px;
    opacity: 0.8;
    margin: 0;
  }
}
```

---

## 7. Form Inputs

```scss
.form-control {
  border: 1.5px solid #E8E2D9;
  border-radius: 6px;
  background: #FFFFFF;
  color: #495057;
  font-family: 'Raleway', sans-serif;
  font-size: 13px;
  padding: 9px 12px;
  transition: border-color 0.15s ease, box-shadow 0.15s ease;

  &::placeholder { color: #AC8599; }

  &:focus {
    border-color: #57072F;
    box-shadow: 0 0 0 3px rgba(87, 7, 47, 0.1);
    outline: none;
  }

  &:disabled {
    background: #F9F7F4;
    opacity: 0.6;
    cursor: not-allowed;
  }
}

.form-label {
  font-size: 12px;
  font-weight: 600;
  color: #57072F;
  text-transform: uppercase;
  letter-spacing: 0.06em;
  margin-bottom: 6px;
}

.form-select {
  // Same as .form-control
  // Custom arrow: use #57072F chevron SVG
}
```

---

## 8. Modals

```scss
.modal-content {
  border-radius: 12px;
  border: none;
  box-shadow: 0 20px 60px rgba(87, 7, 47, 0.12);
}

.modal-header {
  border-bottom: 1px solid #EAE4DA;
  padding: 20px 24px;

  .modal-title {
    font-size: 16px;
    font-weight: 600;
    color: #57072F;
  }

  .btn-close {
    color: #AC8599;
    opacity: 0.6;
    &:hover { opacity: 1; }
  }
}

.modal-body  { padding: 24px; }

.modal-footer {
  border-top: 1px solid #EAE4DA;
  padding: 16px 24px;
}
```

---

## 9. Step Wizard (Treatment Creation Flow)

**Status: ✅ Implemented** — Brand step circles, single-row layout, Raleway labels.

**Step labels (shortened to prevent two-line wrapping):**
| Step | Label |
|---|---|
| 1 | Details *(was "Treatment Details")* |
| 2 | Session Info |
| 3 | Protocol |
| 4 | Montage |
| 5 | Confirmation *(was "Treatment Confirmation")* |

```scss
// Step indicator
.step {
  // Inactive
  .step-circle {
    width: 32px; height: 32px;
    border: 2px solid #EAE4DA;
    border-radius: 50%;
    color: #AC8599;
    font-size: 13px;
    font-weight: 600;
    background: #FFFFFF;
  }

  // Active
  &.active .step-circle {
    background: #57072F;
    border-color: #57072F;
    color: #FFFFFF;
  }

  // Completed
  &.completed .step-circle {
    background: #E0FFC2;
    border-color: #E0FFC2;
    color: #2A4A1F;
    // Show checkmark icon instead of number
  }

  // Label
  .step-label {
    font-size: 12px;
    font-weight: 500;
    color: #AC8599;
    margin-top: 6px;
  }

  &.active .step-label {
    color: #57072F;
    font-weight: 600;
  }
}

// Connector line
.step-connector {
  height: 2px;
  background: #EAE4DA;
  flex: 1;

  &.completed { background: #57072F; }
}
```

---

## 10. Pagination

```scss
.pagination {

  .page-link {
    color: #57072F;
    border-color: #EAE4DA;
    border-radius: 6px;
    font-size: 13px;
    font-weight: 500;
    padding: 6px 12px;
    transition: background 0.15s ease;

    &:hover {
      background: rgba(87,7,47,0.06);
      border-color: #57072F;
    }
  }

  .page-item.active .page-link {
    background: #57072F;
    border-color: #57072F;
    color: #FFFFFF;
  }

  .page-item.disabled .page-link {
    color: #AC8599;
    border-color: #EAE4DA;
  }
}
```

---

## 11. Navigation (Sidebar Structure)

Retain existing nav sections. Style improvements only:

```
CLINICS          ← section label: 10px, uppercase, 60% opacity
  Clinics

ADMINS
  Admins
  Clinicians

PATIENTS
  Patients
  Treatments by Group

STIMULATIONS
  Stimulations
```

Icons: keep existing Dripicons set. Recolor to `rgba(#EAE4DA, 0.6)`, active to `#E0FFC2`.

---

## 12. Empty States

**Status: ✅ Implemented** — `EmptyState` component at `src/components/Common/EmptyState.jsx`.

```jsx
// Import
import EmptyState from "../../components/Common/EmptyState";

// Usage
<EmptyState
  title="No patients yet."
  message="Add your first patient or adjust your search to see results."
  actionText="+ Add Patient"
  onAction={() => setModal(true)}
/>
```

**Visual pattern:**
```
[Dot matrix texture — absolute, full cover, 4% opacity]

  [○]  ← mdi-inbox-outline, 24px, #AC8599, in 40px warm circle

No [items] yet.            ← 15px, #57072F, 600
[Short helpful message]    ← 13px, #AC8599, max-width 340px

[+ Add Item]               ← btn-primary
```

**Wired into:**
- `PlatoTableContainer` — via `emptyStateTitle` + `emptyStateMessage` props
- `LocalTableContainer` — same props
- `PatientsTable` (AllPatients) — direct render
- Clinicians (`index.jsx`) — via LocalTableContainer props
- Stimulations (`PlatoStimulations/index.jsx`) — via LocalTableContainer props

---

## 13. Page-Level Layout Pattern

### Page header
```
[Page Title — H2, Raleway 600, #57072F, Title Case]
[Optional subtitle — 13px, #AC8599]              [Breadcrumb — 12px, muted]
```

### Content wrapper
All content lives in white `.card` panels on the `#F4F1EC` warm background. The background peeks through between cards to create depth.

### Action button placement
- **Primary action** (Add, Create) → top-right of content card header, `btn-primary` (#57072F)
- **Secondary action** (Export, Add Default) → left of primary, `btn-secondary` (#053146)
- **Destructive action** (Disable, Delete) → bottom-left, after content, `btn-danger`
- Never place destructive actions at the top-right

### Button sizing rule
- Buttons use **consistent padding** (`10px 24px` for primary CTA, `8px 20px` for default)
- Do **not** force equal widths — buttons size to their content naturally
- This is intentional: visual weight comes from color and padding, not forced width

### Card height consistency rule
- Cards in the same grid row **must** be equal height
- Implementation: add `d-flex` class to the `<Col>` wrapper, and `height: "100%"` to the `<Card>`
- The `<Link>` wrapper (if present) also needs `width: "100%"` to fill the flex column
- Applied to: Dashboard quick-access cards, stat cards, any future card grid

---

## 14. Mobile Responsive Patterns

**Status: ✅ Implemented**

### Grid breakdowns
| Component | Desktop | Mobile |
|---|---|---|
| Stat cards | `lg="3"` (4-up) | `xs="6"` (2-up) |
| Quick-access cards | `xl={3}` (4-up) | `xs={12} sm={6}` (1-up → 2-up) |
| Step wizard | Single row, `flex-wrap: nowrap` | `flex-wrap: wrap` at `≤767px` |

### Touch / iOS
- All `<input>` and `<select>` elements: `font-size: 16px` at `≤575px` — prevents iOS Safari auto-zoom on focus. **Do not revert.**
- Modals become bottom sheets at `≤575px`: `border-radius: 12px 12px 0 0`, margin pinned to bottom

### Navigation
- Topbar shows brand logo (`d-lg-none`) at tablet/phone widths where sidebar is collapsed
- Sidebar collapses to hamburger (existing template behaviour, not modified)

---

## 15. Development Notes

### Local dev login bypass
The app requires a real backend JWT. With no backend running, inject a fake token via browser console:
```javascript
const payload = btoa(JSON.stringify({"user":{"type":"plato-admin"},"exp":9999999999}));
const fakeToken = `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.${payload}.fakeSignature`;
localStorage.setItem('authUser', fakeToken);
location.reload();
```
Run once per session. User type `"plato-admin"` gives full admin dashboard access.
