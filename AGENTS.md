# PlatoScience Dashboard Agent Guide

This file is the starting point for AI agents working in this repository.

The user is a beginner at coding and software setup. Explain technical terms in simple language the first time they appear. Prefer small, maintainable changes over clever ones. When changing code, explain which file or tool is being changed and why.

## Always Do First

1. Confirm the current branch.
   - Torbjorn's active work should happen on `v1-torbjorn`.
   - Use `v1-anggakara` as a reference branch only unless asked otherwise.
   - Do not commit directly to `main`.
2. Read the relevant docs before editing:
   - `docs/design-system.md` before styling or SCSS work.
   - `docs/primitives-contract.md` before building or changing UI components.
   - `docs/chatgpt-context.md` for product, UX, branch, and backend context.
   - `docs/patient-treatment-assignment-product-direction.md` for Treatment Assignment strategy.
3. Check `git status --short --branch`.
   - There may be user or agent changes already in progress.
   - Do not revert changes you did not make unless explicitly asked.

## Current Product Direction

The dashboard is for PlatoScience, a medical neurostimulation company. Users are clinicians, clinic admins, and PlatoScience admins. They need clear, efficient, trustworthy workflows.

Core product rule:

```text
CREATE treatment protocol does not equal ASSIGN treatment to patient.
```

Treatment Protocol Management is for defining protocols. Treatment Assignment is for assigning existing patients to existing protocols, preferably in batches.

## Tech Stack

| Layer | Technology | Notes |
|---|---|---|
| App | React with Vite | Single-page app |
| UI | Reactstrap / Bootstrap 5 | Not Tailwind |
| Styling | SCSS | Bootstrap variable overrides plus custom SCSS |
| State | Redux + Redux Saga | Avoid changing unless necessary |
| Mock API | MSW | Mock Service Worker intercepts browser requests |
| Tables | `react-table` | Use shared table components where possible |
| Searchable select | `react-select` | Already installed; used in Treatment Assignment |
| Font | Raleway | Do not reintroduce Poppins |

Important files:

```text
src/assets/scss/_variables.scss
src/assets/scss/custom/components/
src/assets/scss/custom/pages/
src/mocks/data.js                           ← Seeder (VITE_MOCK_SEED_PRESET=small|large|stress)
src/mocks/handlers.js
src/util/treatment-signature.js             ← Compact protocol summary from stimulation params
src/pages/TreatmentAssignment/index.jsx     ← Treatment Assignment (paginated, select-all-matching)
src/routes/index.jsx
src/components/VerticalLayout/PlatoSidebarContent.jsx
src/components/Common/PlatoTableContainer.jsx
src/components/Common/LocalTableContainer.jsx
src/components/Common/EmptyState.jsx
```

## Coding Rules

- Make global visual changes at the token level first, usually in `src/assets/scss/_variables.scss`.
- Put component styling in SCSS files, not inline styles.
- Put page-specific styling under `src/assets/scss/custom/pages/`.
- Reuse existing Reactstrap and shared app components before inventing new ones.
- Keep JSX clean and readable.
- Avoid `!important` unless overriding a third-party style that cannot be reached another way.
- Avoid Redux/Saga changes for prototypes unless local state or direct API calls are clearly insufficient.
- Use MSW mock data and handlers for prototype API behavior.

## Design Guardrails

Follow `docs/design-system.md`.

Before finishing styling work, check for these regressions:

- No purple/violet template colors such as `#556ee6` or `#6f42c1`.
- No Bootstrap green `#34c38f` on primary CTAs.
- No Poppins font.
- No cold grey backgrounds such as `#eff2f7` or `#f8f9fa` for dashboard surfaces.
- No black text on Inner Strength `#57072F`.
- No white text on New Energy `#E0FFC2`.
- No ALL CAPS page titles, except small section labels.
- No search inputs inside table header cells.

## Local Development

Use the repo root:

```bash
cd "/Users/torbjornaksdal/Documents/Claude/Claude Code/Plato Dashboard/plato_dashboard_v0"
```

Common commands:

```bash
nvm use
npm run env:local
npm run dev
npm run build
```

If dependencies need to be installed, use:

```bash
npm install --legacy-peer-deps
```

`--legacy-peer-deps` tells npm to accept older package peer dependency rules. This project has older dependencies, so normal install can fail.

## Documentation Rules

- Keep `docs/chatgpt-context.md` as the strategic project context.
- Refresh the Google Doc mirror when project meaning changes. Instructions live in `docs/context-mirror-workflow.md`.
- Keep `AGENTS.md` short and operational. Put detailed design and component rules in docs.

