# CLAUDE.md — PlatoScience Dashboard Build Rules
*Session instructions for Claude Code. Read this + HANDOVER.md every session.*

---

## Always Do First

1. Read `HANDOVER.md` to understand current state and what's in progress
2. Read `design-system.md` before touching any SCSS or styling
3. Read `components.md` before building or editing any UI component
4. Confirm which branch you're on — all V1 work goes on `v1-anggakara`

---

## Tech Stack

| Layer | Technology | Notes |
|---|---|---|
| Framework | React (Vite) | |
| UI library | Reactstrap (Bootstrap 5) | Not Tailwind |
| Styling | SCSS + Bootstrap variable overrides | All tokens go in `_variables.scss` |
| Navigation | MetisMenu | Sidebar only |
| Tables | react-table | `PlatoTableContainer.jsx` (server-side) / `LocalTableContainer.jsx` (client-side) |
| Font | Raleway via Google Fonts | Already applied |
| State | Redux + Redux Saga | Don't touch unless necessary |
| Icons | Dripicons + FontAwesome | Already wired |
| Mock API | MSW (Mock Service Worker) | `src/mocks/handlers.js` |

**Key files to know:**
```
src/assets/scss/_variables.scss              ← All global tokens (already set)
src/assets/scss/custom/components/           ← Component-level overrides
src/mocks/handlers.js                        ← All API routes + mock responses
src/mocks/data.js                            ← Seed data
src/components/VerticalLayout/PlatoSidebar.jsx
src/components/VerticalLayout/PlatoSidebarContent.jsx
src/components/VerticalLayout/PlatoHeader.jsx
src/components/Common/PlatoTableContainer.jsx
src/components/Common/LocalTableContainer.jsx
```

---

## Current Phase — V1 UX Prototype

V0 is complete. All visual reskin work and functional fixes are done and committed to `main`.

**V1 goal:** Rebuild the navigation structure and page flows to match the redesigned UX plan. This is a prototype — it uses MSW mock data, not Firebase. A developer will connect it to the real backend later.

### V1 Build Order

Work in this sequence:

#### Phase 1 — Navigation restructure
- [ ] Update sidebar to new structure (User Management / Treatment Management)
- [ ] Add new routes for new pages
- [ ] Remove or redirect deprecated routes (Treatments by Group as primary flow)

#### Phase 2 — User Management
- [ ] Clinics list page (with Add Clinic)
- [ ] Clinic Detail page — tabbed layout (Clinicians tab + Patients tab)
- [ ] Wire bulk patient slot creation into Patients tab

#### Phase 3 — Treatment Management
- [ ] Stimulations page (minor restructure, keep mostly as-is)
- [ ] Treatment Protocols page — renamed, edit removes patient assignment
- [ ] Treatment Assignment page (new — the most important new build)
  - Step 1: Select protocol
  - Step 2: Select patients (filterable, multi-select, select-all)
  - Step 3: Review + single confirm

#### Phase 4 — Patient Detail cleanup
- [ ] Remove treatment creation from patient dashboard
- [ ] Patient page becomes read-only for treatment (shows active treatment only)

---

## V1 Scope Rules

**Do:**
- Restructure navigation and routing
- Build new pages using existing components and patterns
- Add new MSW handlers for new flows (e.g. bulk assignment)
- Keep using mock data — no Firebase connection needed

**Do not:**
- Touch Redux store or sagas
- Change the data model in `data.js` unless necessary for new flows
- Build role-based auth (super admin view only for now)
- Add Firebase connection (developer's job, not prototype scope)

---

## V0 Scope (completed — reference only)

V0 was a **visual reskin + functional fixes**. Everything in V0 is done:
- ✅ Brand tokens in `_variables.scss`
- ✅ All component styling (buttons, tables, badges, forms, wizard, cards)
- ✅ Sidebar and topbar brand styling
- ✅ Treatment assignment flow wired in MSW
- ✅ Dashboard patient count fix
- ✅ Global search on Clinics page
- ✅ Allow Slide toggle fix
- ✅ New treatments appearing in list
- ✅ New stimulations connecting to treatments
- ✅ Patient search filtering by clinic
- ✅ Treatment name showing on patient page

---

## Anti-Regression Checklist

Before finishing any session, verify none of these exist:

- ❌ Purple/violet gradient anywhere (`#6f42c1`, `#556ee6` family)
- ❌ Green `#34c38f` on any button or CTA
- ❌ Poppins font anywhere
- ❌ Cold grey backgrounds (`#eff2f7`, `#f8f9fa`) — replace with warm Clay variants
- ❌ ALL CAPS page titles (Title Case only)
- ❌ Teal/cyan for "Active" boolean status
- ❌ Search inputs embedded inside table `<th>` cells
- ❌ Black text on Inner Strength `#57072F` background
- ❌ White text on New Energy `#E0FFC2`

---

## Code Style Rules

- Make changes at the **token level first** (`_variables.scss`) before touching component files
- Prefer SCSS overrides over inline styles
- Never use `!important` except to override a third-party library that can't be reached otherwise
- Keep component JSX clean — styling belongs in SCSS files
- When adding new pages, follow the existing pattern: page component → register route in App.js → add to sidebar menu

---

## What This Dashboard Does (Context)

PlatoScience is a medical neurostimulation company. The dashboard is used by:
- **Super admins** — manage clinics, clinicians, patients, stimulations globally
- **Clinic admins** — manage their clinic's patients and treatments
- **Clinicians** — view and manage their assigned patients

Core entities: Clinics → Clinicians → Patients → Treatment Protocols → Stimulations

The primary user is a clinician or clinic admin — professional, expert, time-pressured. The UI must be **clear and efficient first**, branded second.

See `business-logic.md` for full entity relationships and data shapes.
See `HANDOVER.md` for full V1 plan and Firebase handoff guide.
