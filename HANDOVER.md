# PlatoScience Dashboard — Developer Handover Notes
*Living document. Updated as work progresses. Read alongside `CLAUDE.md`, `design-system.md`, `components.md`, and `business-logic.md`.*

---

## Quick Start (Fresh Clone)

```bash
# 1. Clone the repo
git clone https://github.com/Anggakaraa/plato_dashboard_v0.git
cd plato_dashboard_v0

# 2. Checkout the branch you're working on
git checkout v1-anggakara   # UX prototype (Angga)
git checkout v2-partner     # Partner's branch
# main = V0 baseline, do not work directly on main

# 3. Install dependencies — the --legacy-peer-deps flag is REQUIRED
npm install --legacy-peer-deps

# 4. Start dev server
npm run dev
# → http://localhost:5173

# 5. Login bypass (no backend required for UI/prototype work)
# Paste into browser console after app loads:
const payload = btoa(JSON.stringify({"user":{"type":"plato-admin"},"exp":9999999999}));
const fakeToken = `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.${payload}.fakeSignature`;
localStorage.setItem('authUser', fakeToken);
location.reload();
# Run once per session. Use type "plato-admin" for full admin access.
```

---

## Repository & Deployment

### GitHub
```
Repo:     https://github.com/Anggakaraa/plato_dashboard_v0
Branches:
  main           → V0 baseline (stable, do not commit directly)
  v1-anggakara   → V1 UX prototype (Angga's iteration)
  v2-partner     → Partner's iteration
```

### Vercel (client preview — V0 only)
```
URL:     https://plato-dashboard-chi.vercel.app
Method:  Deployed via Vercel CLI (not connected to GitHub)
Trigger: Manual — run `vercel --prod` from local machine when ready to update
```
This is a static preview for client review. It uses mock data (MSW) — not connected to Firebase.

---

## How the App Works Without a Backend (Mock Data)

This codebase uses **MSW (Mock Service Worker)** to simulate a real backend entirely in the browser. There is no server running — all API calls are intercepted and served from in-memory data.

**How it's activated:**
```
VITE_ENV=mock    ← this env var must be set for MSW to start
```

Locally this lives in `.env.local` (not committed). On Vercel it's set as an environment variable in project settings.

**Where mock data lives:**
```
src/mocks/data.js       ← seed data (clinics, patients, stimulations, etc.)
src/mocks/handlers.js   ← API route definitions + response logic
src/mocks/browser.js    ← MSW worker setup
public/mockServiceWorker.js  ← MSW service worker (must stay in /public)
```

**API base URL:**
```
VITE_APP_API_URL=       ← intentionally empty string for Vercel
                           (makes requests relative → same origin → MSW intercepts)
                           Locally set to http://localhost:3000 or leave empty
```

**When connecting to real Firebase:**
- Remove or ignore MSW entirely (`src/mocks/` can be deleted or bypassed)
- Set `VITE_ENV=production` (or anything other than `mock`)
- Set `VITE_APP_API_URL` to your Firebase base URL
- Every API call in the codebase maps to a handler in `handlers.js` — use that as your endpoint map

---

## Install Requirements

### `--legacy-peer-deps` is mandatory
`google-maps-react@2.0.6` has a peer dependency conflict with React 18. Without the flag, `npm install` throws `ERESOLVE`. The flag is safe to use.

### `node-sass` has been removed
The template originally shipped with `node-sass` which fails on Node 18+ and Apple Silicon. Replaced with Dart `sass` (already in `devDependencies`). No action needed.

### Raleway font — Google Fonts dependency
```html
<!-- index.html -->
<link href="https://fonts.googleapis.com/css2?family=Raleway:wght@300;400;500;600;700&display=swap" rel="stylesheet">
```
If the live environment has no internet access, self-host the font files instead.

---

## Branch Overview & What's Built Where

### `main` — V0 Baseline (complete)
The current production state of the app with:
- Full visual rebrand (brand colors, Raleway font, component styling)
- All functional fixes applied (see V0 fixes section below)
- Mock data wired for all core flows
- **Not connected to Firebase**

### `v1-anggakara` — V1 UX Prototype (in progress)
A high-fidelity prototype of the redesigned UX. Built on top of V0.
- Same mock data, same tech stack
- Restructured navigation and page flows
- New Treatment Assignment feature
- Intended as a handoff to the developer to connect to Firebase
- See V1 Plan section below for full scope

### `v2-partner` — Partner iteration (TBD)

---

## V0 — What Was Built

### Visual Reskin (brand tokens already applied)
- `$primary: #57072F` (Inner Strength maroon)
- `$body-bg: #F4F1EC` (warm off-white)
- `$font-family-sans-serif: 'Raleway', sans-serif`
- Full component SCSS overrides: buttons, tables, badges, pagination, forms, cards, modals, wizard
- Sidebar: brand colors, logo area, active state left accent bar
- See `design-system.md` and `components.md` for full token reference

### Functional Fixes Applied to V0
These were bugs and broken flows in the original codebase, fixed before V1 work began:

| Fix | File(s) | What changed |
|---|---|---|
| Treatment assignment flow | `handlers.js` | `POST /add-patient-treatment-group` fully wired — creates treatment entry, updates patient record and treatment group simultaneously |
| Treatment creation not appearing in list | `Treatment-List.jsx` | Race condition fixed — clinics now load before treatments are fetched |
| New stimulations not showing in treatment wizard | `handlers.js` | `POST /plato/stimulation` now transforms form body into `tes_stimulations_tdcs_parameters` shape the UI reads |
| Allow Slide toggle always disabled | `Treatment-Details.jsx` | Removed hardcoded `disabled={true}` |
| Dashboard patient count showing zero | `mini-widget.jsx` | Replaced Redux pagination dependency with direct API fetch |
| Per-column search filters on Clinics page | `LocalTableContainer.jsx` | Replaced with single global search bar above table |
| Patient search not filtering by clinic | `handlers.js` | Search now filters name, email, AND clinic name |
| "Regular" showing instead of treatment name on patient page | `handlers.js` + patient detail component | Added `name` field to treatment object; added Treatment Name column |
| Font/icons not loading on Vercel | `_dripicons.scss`, `_fontawesome-all.scss` | Changed paths to `/src/assets/fonts/` (Vite-compatible) |
| API calls failing on Vercel | `.env` + Vercel settings | `VITE_APP_API_URL` set to empty string so MSW can intercept same-origin requests |

---

## V1 — UX Redesign Plan

### The Problem Being Solved
The current dashboard is **entity-centric** (organised around database tables). The redesign makes it **workflow-centric** (organised around what users actually do).

Three specific broken flows being fixed:
1. **Treatment assignment has 3 broken entry points** — users resort to creating duplicate treatments as a workaround, causing database pollution
2. **No separation between creating a treatment protocol and assigning it to patients** — these should be completely separate actions
3. **User management is flat** — patients, clinicians, and clinics exist on the same level with no hierarchy, making cross-reference confusing

### Core Principle
```
CREATE treatment protocol  ≠  ASSIGN treatment to patient
```
These are two separate flows that never mix.

### New Navigation Structure

```
SUPER ADMIN
├── Dashboard (overview cards)
├── User Management
│   └── Clinics (list + Add Clinic)
│       └── Clinic Detail
│           ├── Tab: Clinicians (add / edit / remove)
│           └── Tab: Patients (add single / add bulk slots)
└── Treatment Management
    ├── Stimulations (global library)
    ├── Treatment Protocols (create/edit/delete — no patient assignment here)
    └── Treatment Assignment ← dedicated flow, separate from creation

CLINIC ADMIN (same structure, no Clinics list — lands directly on their clinic)
├── Dashboard
├── User Management
│   ├── Clinicians
│   └── Patients
└── Treatment Management
    ├── Stimulations (filtered to their clinic)
    ├── Treatment Protocols (filtered to their clinic)
    └── Treatment Assignment (their patients only)
```

### Treatment Assignment Flow (new page — most important)
```
Step 1: Select protocol    → dropdown of existing protocols
Step 2: Select patients    → filterable table, checkboxes, select-all-filtered
Step 3: Review & confirm   → X patients → Protocol name, ONE confirm button
                             No per-patient confirmation dialogs
```

### Patient Slots / Default Patients
Clinics are allocated a pool of patient slots (e.g. 300). The "Add X patient slots" bulk action creates placeholder patients tied to that clinic, each with an auto-generated ID (acts as informal device ID). Real patient info is filled in later.

Device ID is designed as an optional field on the patient record — not required for the platform to function, but the data model supports it for future hardware integration.

### What's Being Removed
- ❌ Treatment creation from the patient dashboard
- ❌ Per-patient confirmation dialogs during assignment
- ❌ "Treatments by Group" as the primary assignment mechanism

### What Stays
- ✅ Stimulations page (minor structural tweaks)
- ✅ All patient/clinician forms
- ✅ Mock data and MSW
- ✅ All Redux/Saga/API call patterns

### Role-Based Views (deferred — not in V1 scope)
Role differentiation is handled purely by navigation filtering. Same pages, same components — clinic admin just doesn't see the Clinics list and all data is scoped to their clinic. Build super admin view first; add role gating in a later phase.

---

## V1 Feasibility Analysis — Applying Prototype Changes to the Original Codebase

*Compared: `v1-anggakara` branch vs `plato-dashboard-frontend-master-ORIGINAL.zip` (client's current codebase). Analysis date: 2026-05-29.*

### Overall verdict: High feasibility, low risk

The core reason: the original codebase and the V1 prototype share the **same Redux store, the same API layer (`src/api/manager.js`), and the same component library (Reactstrap)**. All V1 changes are at the page level — isolated files that don't require touching the store, sagas, or infrastructure. A developer familiar with React can apply the full V1 in an afternoon.

---

### Change-by-change breakdown

#### 🟢 Drop-in (copy file, register route, done)

| What | Type | Notes |
|---|---|---|
| `src/pages/TreatmentAssignment/index.jsx` | **New page** | Doesn't exist in original. Copy the file, add the route `/treatment-assignment` to `routes/index.jsx`. Uses existing `get()`/`post()` from `api/manager.js` and existing Redux `getClinics` action — no new store work needed. |
| `src/components/Common/EmptyState.jsx` | **New component** | Used by `LocalTableContainer` for empty table states. Copy the file. |
| `src/assets/images/plato-icon-white.svg` | **New asset** | Logo used in the sidebar. Copy the file. |

#### 🟡 Surgical edits (modify existing file, changes are additive)

| What | Original | V1 | Risk |
|---|---|---|---|
| `Treatment-List.jsx` (159 → 184 lines) | No stimulations column, wrong breadcrumb, wrong title | Added stimulations column with Badge pills, corrected breadcrumb to "Treatment Management > Treatment Protocols" | **Low** — purely additive. No logic removed. |
| `Treatment-Details.jsx` (1157 → 789 lines) | No redirect after save; stimulations reset to 0 after first edit due to `selected` flag bug | Fixed `preSelectStimulations()` bug; added `navigate('/treatments-by-steps')` after save; corrected breadcrumb | **Low-medium** — two bug fixes + breadcrumb. The stimulations bug fix is the most important: change `data.push(intervention.tes_stimulation)` to `data.push({ ...intervention.tes_stimulation, selected: true })`. |
| `LocalTableContainer.jsx` (300 → 331 lines) | No empty state support | Added `emptyStateTitle` and `emptyStateMessage` props; imports new `EmptyState` component | **Low** — purely additive, backward-compatible. |
| `AllPatients/index.jsx` (989 → 973 lines) | CSV export showed wrong "Type" value | Fixed type detection: `@plato.dashboard` → `@platoscience.clinic` | **Low** — single string change. |
| `src/assets/scss/_variables.scss` (1710 lines both) | Bootstrap/template default colours | Brand tokens applied (maroon `#57072F`, warm clay backgrounds, Raleway, etc.) | **Low** — pure value overrides, same file structure. |
| `Dashboard/index.jsx` | Title: "Vite React Admin & Dashboard Template" | Title: "Dashboard \| Platoscience" | **Trivial** |

#### 🔴 Heavy replacement (replace whole file — original logic intentionally removed)

| What | Original | V1 | Notes |
|---|---|---|---|
| `AdminPatientDetail/index.jsx` (1649 → 363 lines) | Full treatment creation UI inside the patient page: add treatment, assign stimulations, manage interventions, disable/enable per-treatment | All treatment creation removed. Page is now read-only: shows patient info, active treatment callout, treatment history. "Manage via Treatment Assignment" button navigates to the new dedicated flow. | **Medium risk — intentional breaking change.** If the client still needs per-patient treatment creation (as a fallback), that feature is gone. Confirm this is acceptable before applying. The removed imports: `getClinicStimulations`, `clearClinicStimulations`, `getMyClinics`, `addPatientTreatment`, `getInterventionsByTreatment`, etc. All still exist in the Redux store — nothing was deleted from the store. |

#### ⚙️ Infrastructure changes (one-time setup)

| What | Original | V1 | Notes |
|---|---|---|---|
| `src/mocks/` folder | **Does not exist** | Added `browser.js`, `data.js`, `handlers.js` | MSW is the entire mock backend. If the real Firebase backend is ready, this folder can be skipped entirely. If using MSW for staging/demo: copy all three files and follow the MSW setup steps below. |
| `src/main.jsx` | No MSW startup | Conditionally starts MSW worker when `VITE_ENV=mock` | Single block added — safe to add alongside existing code. |
| `public/mockServiceWorker.js` | Not present | Required by MSW | Generated by MSW CLI: `npx msw init public/`. Must be in the `public/` folder. |
| New routes in `routes/index.jsx` | No `/treatment-assignment` route | Must add: `{ path: "/treatment-assignment", component: <TreatmentAssignment /> }` | Also add route for any other new pages used (ClinicDetail, etc.) |

---

### What the developer does NOT need to touch

- `src/store/` — entire Redux store, sagas, action types: **identical between original and V1**. No changes.
- `src/api/manager.js` — the HTTP client: **identical**. No changes.
- `src/api/plato/`, `src/api/clinician/` — API method files: **identical**. No changes.
- Authentication, routing guards, layout components: **untouched**.
- All other pages not listed above: **untouched**.

---

### New backend endpoints required (for real Firebase connection)

Only 2 endpoints need to be built that don't exist in the current backend:

```
POST /bulk-assign-treatment
Body:  { treatment_group_guid: string, patient_guids: string[] }
Effect: Creates or replaces a treatment record for each patient in the list

POST /bulk-unassign-treatment
Body:  { patient_guids: string[] }
Effect: Marks the active treatment as disabled for each patient in the list
```

Everything else the V1 calls already maps to endpoints that existed in the original backend. See `src/mocks/handlers.js` for the full endpoint map.

---

### Step-by-step migration checklist (for the developer)

```
INFRASTRUCTURE (do once)
□ Copy src/mocks/ folder → to original repo
□ Copy public/mockServiceWorker.js → or regenerate: npx msw init public/
□ Update src/main.jsx → add MSW conditional startup block (see our main.jsx)
□ Install MSW if not in package.json: npm install msw --save-dev

NEW FILES (copy-paste, no conflicts)
□ src/pages/TreatmentAssignment/index.jsx
□ src/components/Common/EmptyState.jsx
□ src/assets/images/plato-icon-white.svg

ROUTE REGISTRATION (add to src/routes/index.jsx)
□ import TreatmentAssignment from "../pages/TreatmentAssignment"
□ Add: { path: "/treatment-assignment", component: <TreatmentAssignment /> }

REPLACE WHOLE FILES (confirm intent before doing)
□ src/pages/Patients/PatientDetail/AdminPatientDetail/index.jsx
   → Confirm with stakeholder: treatment creation from patient page is removed

APPLY TARGETED EDITS
□ Treatment-List.jsx   → add Badge import, Stimulations column, breadcrumbs, emptyState props
□ Treatment-Details.jsx → fix preSelectStimulations (selected:true), add navigate after save, breadcrumbs
□ LocalTableContainer.jsx → add EmptyState import + emptyStateTitle/emptyStateMessage props
□ AllPatients/index.jsx → fix CSV type detection string
□ Dashboard/index.jsx → fix page title
□ src/assets/scss/_variables.scss → apply brand tokens

VERIFY
□ npm run dev → app loads
□ Hard refresh (Cmd+Shift+R) if MSW data doesn't appear
□ Test: Treatment Protocols list shows stimulations
□ Test: Edit protocol → save → redirects to list → stimulations still assigned
□ Test: Treatment Assignment 4-step flow (clinic → patients → action → confirm)
□ Test: Patient detail page → no treatment creation UI, active treatment shows
```

---

## Connecting V1 to Real Firebase (Developer Guide)

When the developer picks up this prototype to connect to the real backend:

### 1. Find all API endpoints
Every endpoint the app uses is defined in `src/mocks/handlers.js`. Each `http.get(...)` or `http.post(...)` call maps to one real Firebase endpoint. Use this file as your endpoint map.

### 2. Replace MSW with real calls
- Set `VITE_ENV=production` (or remove the mock check entirely)
- Set `VITE_APP_API_URL` to your Firebase base URL
- Each API call in the components uses `get()` / `post()` from `src/api/manager.js` — this is where you add auth headers etc.

### 3. New endpoint needed: Bulk Treatment Assignment
The V1 Treatment Assignment flow (`POST /bulk-assign-treatment`) doesn't exist in the current backend. This is the only genuinely new endpoint required. It takes:
```json
{
  "treatment_group_guid": "xxx",
  "patient_guids": ["pat-001", "pat-002", "pat-003"]
}
```
And creates treatment records for each patient in one operation.

### 4. Data shape differences
The mock data shapes in `handlers.js` were designed to match what the UI reads. If real Firebase responses differ slightly, the most common mismatch points are:
- Nested vs flat objects (e.g. `clinic_patients[0].clinic.name` vs `clinic.name`)
- `guid` vs `id` as the primary identifier
- Embedded vs separate junction table data

---

## Build & Deploy

```bash
# Local dev
npm run dev

# Production build
npm run build
# → output in dist/

# Deploy to Vercel preview (manual)
vercel --prod
# Requires Vercel CLI installed: npm install -g vercel
# Requires vercel login first
```

### Environment Variables (Vercel project settings)
| Variable | Value | Purpose |
|---|---|---|
| `VITE_ENV` | `mock` | Activates MSW mock data |
| `VITE_APP_API_URL` | *(empty)* | Makes API requests relative (same-origin for MSW) |
| `VITE_APP_GATEWAY_URL` | *(empty)* | Same reason |

---

## Design Reference Files

```
/Users/anggakara/Desktop/00_Projects/Plato Dashboard/
├── CLAUDE.md           ← Session rules for Claude Code
├── HANDOVER.md         ← This file
├── design-system.md    ← Brand tokens, colors, typography
├── components.md       ← Component-by-component specs
└── business-logic.md   ← Entity relationships, data shapes, UX issues
```

---

*Last updated: 2026-05-29 — V1 feasibility analysis added (comparison vs original client codebase); migration checklist added; new backend endpoints documented*
