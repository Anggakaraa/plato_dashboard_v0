# PlatoScience Dashboard - ChatGPT Strategic Context

Last refreshed: 2026-06-02
Primary branch for Torbjorn's work: `v1-torbjorn`
Repository: `https://github.com/Anggakaraa/plato_dashboard_v0`
Local path: `/Users/torbjornaksdal/Documents/Claude/Claude Code/Plato Dashboard/plato_dashboard_v0`
Google Doc mirror: `https://docs.google.com/document/d/1tPsDE2zLgjiDUyt3URhZByfvG6oDded8EzeZa2xQOE0/edit?tab=t.0`

## Purpose Of This Document

This is the ChatGPT project-source context for strategic sparring while developing the PlatoScience dashboard. It should help ChatGPT understand the product, business logic, technical architecture, branch setup, UX goals, and how to collaborate with Codex.

Use this document to:

- reason about product and UX decisions before asking Codex to implement them
- generate precise prompts for Codex
- keep design, architecture, and business rules aligned
- preserve important discoveries from repo inspection, PM calls, or implementation work
- avoid re-explaining the same dashboard context in every conversation

When major changes, discoveries, or strategic directions emerge, this document should be refreshed and mirrored to the Google Doc.

## Product Context

PlatoScience is a Copenhagen-based medical neurostimulation company. The dashboard is used to manage clinics, clinicians, patient accounts, stimulation protocols, and treatment assignment workflows for tDCS/TES clinical use.

The operational users are internal customer-relations staff, PlatoScience super admins, clinic admins, and clinicians. They are professional, time-pressured users who need clarity, reliability, and fast batch workflows more than decorative UI.

PlatoScience makes the physical device that delivers tDCS brain stimulation and also provides the patient app that controls or guides treatment use. The field is still cutting edge, so many clinics use the product both for depression treatment and for clinical research. This means the dashboard has to support normal clinical operations and research workflows such as control groups, sham/low-effect protocols, clinic-specific protocol naming, and different treatment definitions for different patient groups.

The core product problem currently being explored is patient-to-treatment assignment at clinic scale. Clinics may order hundreds of patient accounts/devices at a time, for example 750 accounts. The older admin UI makes assignment too manual and encourages workarounds such as creating duplicate treatments.

Core product principle:

CREATE treatment protocol does not equal ASSIGN treatment to patient.

Those are separate workflows and should stay separate in the redesigned dashboard.

## Clinical Treatment Logic

A stimulation is one session configuration. It usually represents a roughly 30-minute tDCS session with a defined electrical strength, duration, electrode/montage parameters, and rules for whether the patient can adjust intensity themselves or whether it is fixed by the clinician/clinic.

Clinics can use system-default stimulations, but they also create clinic-specific stimulations with names meaningful to their own staff and research protocols. These clinic-defined names matter because clinicians may distinguish protocols by condition, patient group, research cohort, or study arm.

A treatment is a group of stimulations. It is the set of stimulation sessions a patient sees in their patient app. A clinic might have one treatment for depression, another for a different indication, or different treatments for different disease characteristics, age groups, or research cohorts. In research contexts, one treatment may intentionally be a control/sham group where the stimulation is too weak, too short, or otherwise configured not to produce the same clinical effect.

A patient should only have access to one treatment in the patient app at a time. This makes treatment assignment a high-importance operational workflow: PlatoScience customer-relations staff need to create or verify stimulations, create treatment groups/protocols, and assign patient accounts to the correct treatment.

Current assessment:

- creating and editing stimulations is not the main pain point
- creating and editing treatments/protocols is also relatively manageable
- the major pain point is assigning many patient accounts to a treatment
- the assignment workflow is currently one-patient-at-a-time and requires a confirmation popup for each assignment
- with hundreds of patient accounts, this becomes tedious and error-prone for PlatoScience personnel

## Core Entities And Business Logic

Entity hierarchy:

```text
PlatoScience platform
└── Clinic
    ├── Clinicians
    └── Patients
        └── Active Treatment
            └── Stimulations
```

Clinic:

- top-level organisational unit
- owns clinicians, patients, and treatments
- has fields such as `guid`, `name`, `email`, `country`, `signifier`, `signifier_count`, and `disabled`
- `signifier` is a short clinic code used to generate default patient credentials

Clinician:

- staff member connected to one or more clinics through `clinic_clinicians`
- relationship can include an `admin` boolean
- can manage patients and treatments according to role/scope

Patient:

- belongs to a clinic through `clinic_patients`
- can be a default/placeholder patient or a regular patient with real email
- can exist without a treatment
- can have treatment history, but only one active treatment at a time
- patient app access appears through fields such as `access.email`, `access.credential`, and `patient_mobile_accesses`
- Firebase linkage appears through `firebase_patients[].firebase_uid`

Stimulation:

- an individual stimulation protocol, like a "song"
- can be platform-created or clinic-created
- tDCS parameters include `anode`, `cathode`, `current`, and `duration`
- may also involve business options such as sham/control status and whether the patient can adjust intensity
- clinic-created stimulations may have clinic-specific names tied to clinical or research logic
- current is displayed in mA and duration is displayed in minutes

Treatment / Treatment Protocol:

- a collection of stimulations, like a "playlist"
- clinic-defined treatment name and contents matter because they encode clinical, research, or patient-cohort logic
- should be created and edited independently of patient assignment
- assignment creates patient-treatment records
- the V1 direction is to make "Treatment Protocols" the protocol library and "Treatment Assignment" the dedicated assignment workflow

Device ID:

- repo inspection found traces of `device_id` in live session/reporting views, not as a direct patient assignment field
- likely telemetry path: patient/app user -> session/user id -> device id
- no clear evidence in the frontend of `patient.device_id`, serial number, IMEI, MAC address, or direct device inventory assignment
- V1 handover describes patient slots/default patients as having auto-generated IDs that may act as informal device IDs, with optional future hardware integration

Questions to keep alive:

- Does session `user_id` map to patient guid, Firebase UID, or mobile account ID?
- Are physical Plato devices tracked as inventory anywhere?
- Should device-to-patient assignment become a formal workflow or remain telemetry?
- Does "750 devices" mean physical devices, patient accounts, app credentials, or a bundle of all three?

## UX Direction

The dashboard should move from entity-centric navigation to workflow-centric navigation.

Target navigation:

```text
Super Admin
├── Dashboard
├── User Management
│   └── Clinics
│       └── Clinic Detail
│           ├── Clinicians tab
│           └── Patients tab
└── Treatment Management
    ├── Stimulations
    ├── Treatment Protocols
    └── Treatment Assignment
```

Clinic admin version:

```text
Clinic Admin
├── Dashboard
├── User Management
│   ├── Clinicians
│   └── Patients
└── Treatment Management
    ├── Stimulations
    ├── Treatment Protocols
    └── Treatment Assignment
```

Treatment assignment target flow:

1. Choose clinic or scope
2. Select patients with filtering and bulk selection
3. Choose action: assign protocol or remove treatment
4. Review and confirm once for the whole batch

Important UX rules:

- no per-patient confirmation dialogs in batch assignment
- do not create duplicate treatments as an assignment workaround
- treatment creation should not live inside patient detail
- patient detail can show active treatment read-only and link to Treatment Assignment
- clinics should support bulk patient slot creation
- clinical users need speed and confidence, not marketing-style screens

Batch assignment problem detail:

- clinics may bulk-buy devices and empty patient accounts, for example 750
- current UI requires selecting a patient from the clinic patient list, assigning treatment, and confirming a popup
- a quick frontend-only "select all" may be unreliable if the app only loads 180 patients from Firebase at a time
- investigate whether the 180-record limit is frontend pagination, Firestore query limit, backend endpoint limit, or an accidental UI constraint
- a durable solution likely needs server-side batch assignment by query/filter or explicit patient ID list, not just selecting records currently loaded in the browser

Patient-centered treatment assignment product direction:

- canonical local product direction doc: `docs/patient-treatment-assignment-product-direction.md`
- prototype direction is clinic-first, patient-centered, and batch-oriented
- target admin mental model is: choose clinic, choose patients, choose existing active treatment
- Treatment Protocol Management and Treatment Assignment should be separate workflows
- protocol management is for creating/editing treatment definitions and stimulation groupings
- assignment is for assigning/reassigning existing patients to existing treatment protocols
- primary assignment flow: select clinic, review/search/filter patients, select patients, click Assign Treatment, choose treatment in a drawer/modal, review patient count/current treatment distribution/new treatment summary, confirm once, then update the table
- batch assignment should use one confirmation for the whole selected group, not one confirmation per patient
- the first prototype should probably require selected patients to belong to one clinic; if selections span clinics, disable assignment or show a clear warning
- show warnings when selected patients already have active treatments, and clearly distinguish patients with no active treatment
- be precise with selection wording: "Select visible patients" means loaded rows; "Select all filtered patients" should only be used if all matching patients are truly included, including unloaded rows

Treatment signature direction:

- admins may not remember what treatment names mean, and names can be clinic-specific or ambiguous
- the assignment flow should show a compact treatment signature derived from included stimulations
- example signature: `5 stimulations · 1.6 mA · 30 min · Slide on · Not sham · L/R variants`
- signatures should appear in treatment dropdowns, assignment review, selected treatment preview, and possibly the current treatment column or hover/detail state
- signature dimensions: number of stimulations, current/intensity, duration, slide or patient-adjustable setting, sham/placebo/control status, and montage/side variants
- if values are consistent, show the single value; if values differ, show mixed or range states such as `Mixed current`, `20-30 min`, `Includes sham`, or `Mixed montages`
- include at least one mock treatment with mixed parameters when the prototype is planned, so the summary logic can be tested

Patient-centered Treatment Assignment prototype implementation (current state as of 2026-06-02):

- prototype route: `/treatment-assignment`
- route registered in `src/routes/index.jsx`
- sidebar link in `src/components/VerticalLayout/PlatoSidebarContent.jsx`
- page implementation: `src/pages/TreatmentAssignment/index.jsx`
- treatment signature utility: `src/util/treatment-signature.js`
- mock data: `src/mocks/data.js` — deterministic seeder with `VITE_MOCK_SEED_PRESET=small|large|stress`
- mock API: `src/mocks/handlers.js`

Patient loading (implemented):
- server-side paginated: `GET /plato/patients?clinic_guid=...&page=N&limit=50&search=...`
- PAGE_SIZE is 50; debounced search triggers a new server call
- table header shows "Showing N of Total patients"
- pagination controls navigate between pages

Selection modes (implemented):
- `"none"` — nothing selected
- `"explicit"` — individual checkboxes checked; may span pages; label is `"N patients selected"` (never says "visible")
- `"all-matching"` — all active (non-disabled) patients matching current clinic + search filter; label is `"All N active patients in [Clinic] selected"`
- "Select all matching" banner appears when all rows on current page are selected but total > selected count
- clicking banner calls `GET /plato/patients/ids` to fetch all matching guids + summary metadata

Disabled patients:
- rendered in table (greyed row, disabled checkbox)
- not selectable; excluded from all-matching selection and from `/ids` results
- shown as `disabledCount` in `/ids` response (informational only)

Protocol picker:
- `react-select` searchable dropdown (already installed, used in Ecommerce pages)
- treatment signature shown below selected protocol: `"5 stimulations · 1.6 mA · 30 min · Slide on · Not sham · L/R variants"`
- option-level signatures not yet shown in dropdown list (future enhancement)

Confirmation modal:
- for explicit mode: shows patient count + replacement warning from known/cached patient objects
- for all-matching mode: shows clinic name, search term, activeTreatmentCount, noTreatmentCount, disabledCount from `/ids` response; shows scope note "applies to all matching patients, not only those visible"

MSW endpoints relevant to this flow:
- `GET /plato/patients` — paginated, clinic-filtered, searchable ✅
- `GET /plato/patients/ids` — guid list + summary metadata (MSW prototype bridge only) ✅
- `POST /bulk-assign-treatment` — `{ treatment_group_guid, patient_guids }` ✅
- `POST /bulk-unassign-treatment` — `{ patient_guids }` ✅

Known limitations:
- `GET /plato/patients/ids` is MSW-only; real backend must build this endpoint
- "Select all matching" loads all guids into browser memory — fine for prototype, not for 100k+ production
- CSV upload matches only patients cached across visited pages (not all clinic patients)
- treatment signatures in dropdown option labels not yet implemented
- real backend pagination/search behavior not yet confirmed (MSW-only)

Follow-up backend questions (still open):
- does the real backend support `page`/`limit`/`search` on patient list?
- does `POST /bulk-assign-treatment` already exist and match the expected body shape?
- how does the real backend preserve treatment history on reassignment?
- is a filter-based bulk assignment endpoint feasible? (recommended over two-step fetch for large clinics)

Potential solution directions:

- Batch Assign UI: filter patient accounts by clinic/status/type, select many, choose treatment, review, confirm once
- Server-side endpoint: create/replace patient-treatment assignments in one operation
- Select-all-filtered: should mean all matching patients, not only visible page records, if the backend can support it
- XLSX import: useful if clinics already send patient/account lists in Excel during onboarding
- XLSX template: PlatoScience could provide a clinic onboarding spreadsheet template; customer relations imports it to create/update patient slots and treatment assignment
- Import validation: show row-level errors, duplicate accounts, missing clinic identifiers, unknown treatments, and preview before commit

## Design System Direction

The design direction is warm precision: clinically credible, efficient, and warmer than generic blue-and-white health tech.

Canonical local docs:

- `AGENTS.md`: short working rules for Codex/agents in this repo
- `docs/design-system.md`: detailed PlatoScience dashboard design system
- `docs/primitives-contract.md`: reusable UI building blocks and rules for tables, empty states, buttons, badges, cards, forms, navigation, and Treatment Assignment

Stack styling:

- Reactstrap / Bootstrap 5
- SCSS
- Bootstrap variable overrides
- tokens should live in `src/assets/scss/_variables.scss`
- component-level overrides live under `src/assets/scss/custom/components/`
- avoid inline styles unless necessary

Core brand colors:

- Inner Strength: `#57072F`
- Deep Mind: `#053146`
- New Energy: `#E0FFC2`
- Clay: `#EAE4DA`
- warm page background: `#F4F1EC`
- table header background: `#F9F7F4`
- warm border: `#E8E2D9`

Typography:

- Raleway
- page titles should be Title Case
- avoid Poppins
- avoid all-caps page titles except small section labels

Anti-regression checklist:

- no purple/violet template colors such as `#556ee6` or `#6f42c1`
- no Bootstrap green `#34c38f` on primary CTAs
- no cold grey dashboard backgrounds such as `#eff2f7` or `#f8f9fa`
- no black text on `#57072F`
- no white text on `#E0FFC2`
- do not put search inputs inside table header cells

## Technical Architecture

The dashboard is a React single-page app built with Vite.

Primary stack:

- React 18
- Vite 3
- React Router
- Redux and Redux Saga
- Axios
- Reactstrap / Bootstrap 5
- SCSS
- MSW for mock API
- Firebase SDK is present in dependencies, but the prototype uses MSW, not live Firebase

Technical discovery priorities for future repo/backend inspection:

- whether Firestore queries support `limit`/`startAfter` cursor pagination or snapshots (frontend now calls with page+limit; backend must match)
- whether there is already a backend endpoint for batch patient-treatment assignment (`POST /bulk-assign-treatment`)
- whether treatment assignment is expressed as treatment group IDs, patient treatment records, Firebase documents, or a mixed legacy shape
- whether XLSX import dependencies already exist or should be added
- how much TypeScript is present and whether new code should be JS/JSX or TS/TSX
- where the current CSS design tokens live and how much styling is hardcoded versus tokenized

Important scripts:

```bash
npm run env:local
npm run dev
npm run build
```

Local Node version:

```text
19.6.0
```

Use `nvm use` in the repo root.

Local development:

```bash
cd "/Users/torbjornaksdal/Documents/Claude/Claude Code/Plato Dashboard/plato_dashboard_v0"
source "$HOME/.nvm/nvm.sh"
nvm use
npm run env:local
NPM_CONFIG_CACHE=/tmp/plato-dashboard-v0-npm-cache npm run dev
```

Local URL:

```text
http://localhost:5173/
```

Mock setup:

- `VITE_ENV=mock` turns on MSW
- `src/main.jsx` starts MSW when `VITE_ENV === "mock"`
- `src/mocks/data.js` — deterministic seeder controlled by `VITE_MOCK_SEED_PRESET`:
  - `small`: 2 clinics, ~20 patients/clinic, 6 groups/clinic (dev sanity)
  - `large`: 4 clinics, ~250 patients/clinic, 35 groups/clinic (demo-safe default)
  - `stress`: 4 clinics, Clinic A 1,500 patients / 120 groups (stress test for Ed)
  - Start with stress: `VITE_MOCK_SEED_PRESET=stress npm run dev`
- `src/mocks/handlers.js` maps API endpoints to mock behavior
- `public/mockServiceWorker.js` must remain available

Recent setup fix:

- `v1-torbjorn` includes commit `276865f fix: enable mock login locally`
- this copied the mock-login fix from `v1-anggakara`
- local setup now produces `VITE_ENV=mock`
- MSW is not unregistered in mock mode
- login/network setup errors now show readable messages

## Branches

Repository branches:

- `main`: V0 baseline / stable reskin baseline
- `v1-anggakara`: colleague's UX prototype branch with larger V1 work
- `v2-partner`: experimental partner branch
- `v1-torbjorn`: Torbjorn's working branch, created from `main`

Current recommendation:

- do Torbjorn's implementation work on `v1-torbjorn`
- compare or cherry-pick selectively from `v1-anggakara`
- avoid committing directly to `main`

Useful git commands:

```bash
git status --short --branch
git switch v1-torbjorn
git pull
git push
git branch -a
```

## Known Implementation Risks

Dependency age:

- many dependencies are old and produce npm audit warnings
- do not run `npm audit fix --force` casually because it may break the app
- previous install issues were caused by Node version mismatch and old dependency constraints

Architecture fragility:

- Redux/Saga is used widely
- UI code and API shape are coupled in places
- many domain responses rely on nested legacy shapes such as `clinic_patients`, `patient_treatments`, and `intervention_treatment_tes`
- the safest prototype changes usually happen through existing components and MSW handlers

Mock vs backend:

- current prototype is not connected to live Firebase
- MSW endpoints are useful as an endpoint map for future backend integration
- real backend may differ on nested vs flat objects, `guid` vs `id`, and whether relationships are embedded or separate junction tables

## Backend / Firebase Handoff Notes

The frontend implies these backend concepts:

- clinics
- clinicians
- clinic-clinician junctions
- patients
- clinic-patient junctions
- mobile access credentials
- Firebase patient identities
- stimulations
- treatment groups / protocols
- patient treatments
- interventions connecting treatments to stimulations
- realtime or BigQuery session events with device telemetry

Important future backend endpoint:

```json
POST /bulk-assign-treatment
{
  "treatment_group_guid": "xxx",
  "patient_guids": ["pat-001", "pat-002", "pat-003"]
}
```

Expected behavior:

- create treatment records for each selected patient
- disable prior active treatment if required
- maintain treatment history
- return enough data for the UI to refresh patient list and active treatment status

Possible XLSX import endpoint or flow:

```json
POST /patient-treatment/import
{
  "clinic_guid": "clinic-001",
  "treatment_group_guid": "treatment-001",
  "rows": [
    {
      "patient_identifier": "nws001",
      "email": "nws001@platoscience.clinic"
    }
  ],
  "dry_run": true
}
```

The first pass should probably be a dry-run preview that validates the file before any patient or treatment changes are committed.

## How ChatGPT Should Help

ChatGPT should act as a strategic sparring partner, not just a code generator.

Good ChatGPT tasks:

- clarify product logic before implementation
- identify workflow risks and edge cases
- turn fuzzy goals into precise Codex prompts
- critique proposed UX flows from a clinical/admin user perspective
- help decide whether to change mock data, UI only, or API contracts
- prepare PM questions and developer handoff notes
- summarize code discoveries into this context document
- help decide whether batch assignment, XLSX import, or both are appropriate for a given phase
- ask whether a proposed UI change handles the 180-patient pagination limitation or only works on the visible page

When suggesting work for Codex, ChatGPT should provide direct prompts the user can paste into Codex.

Example prompt pattern:

```text
Codex, please inspect the current v1-torbjorn branch and implement [specific change].
Before editing, read the local project instructions and relevant docs.
Keep changes scoped to [files/area].
Use existing Reactstrap/SCSS/MSW patterns.
After implementation, run the build and summarize changed files.
```

For product/UX changes:

```text
Codex, please review the current Treatment Assignment flow on v1-torbjorn.
Compare it against the product rule that creating a protocol and assigning a protocol must remain separate.
Do not edit yet. Give me a short findings-first review with recommended implementation steps.
```

For implementation:

```text
Codex, please implement the agreed Treatment Assignment change on v1-torbjorn.
Use MSW mock data and handlers for any API behavior.
Avoid Redux/Saga changes unless necessary.
Run npm run build when done.
```

For investigating the pagination limit:

```text
Codex, please inspect v1-torbjorn and the available source history for patient-list loading and treatment assignment.
Find where patient lists are fetched, whether there are any `.limit`, pagination, cursor, or page-size constants, and whether assignment only operates on loaded rows.
Do not change code yet. Summarize the relevant files, request shapes, and what would block a reliable "select all filtered patients" workflow.
```

For exploring XLSX import:

```text
Codex, please inspect the repo for existing spreadsheet/XLSX dependencies or import/export patterns.
Then propose a simple maintainable XLSX import flow for assigning patient accounts to a treatment, using MSW mock handlers first.
Do not implement until I approve or ask for a regenerated plan.
```

For mirror refresh:

```text
Codex, please refresh docs/chatgpt-context.md with the discoveries from this session and mirror it to the Google Doc listed in docs/context-mirror-workflow.md.
Commit the local documentation change if it belongs in the repo.
```

Important Codex planning constraint:

- Codex plans cannot be approved with notes.
- The user can either approve and execute the plan as written, or ask Codex to regenerate the plan using notes.
- ChatGPT should not tell the user to "approve the plan with the following notes."
- Instead, ChatGPT should say either:
  - "Approve the plan as-is," or
  - "Ask Codex to regenerate the plan with these notes: ..."

## Mirror Documentation Workflow

The canonical local source for ChatGPT context is:

```text
docs/chatgpt-context.md
```

The mirror workflow instructions live in:

```text
docs/context-mirror-workflow.md
```

Target Google Doc:

```text
https://docs.google.com/document/d/1tPsDE2zLgjiDUyt3URhZByfvG6oDded8EzeZa2xQOE0/edit?tab=t.0
```

Refresh trigger:

- after major feature changes
- after discovering new backend/data model details
- after PM calls that change product direction
- after branch strategy changes
- after significant design-system decisions
- before using the Google Doc as a ChatGPT project source for a new phase

Codex should proactively remind Torbjorn to refresh the mirror when the project meaningfully changes.

## Current Open Questions

- What is the true backend data model for treatment groups vs patient treatments?
- Does the real backend support paginated patient loading with `page`/`limit`/`search`?
- Does `POST /bulk-assign-treatment` already exist in the real backend, and does it match the expected body shape?
- Does the real backend support a lightweight "get all matching patient guids" endpoint, or is filter-based bulk assignment more feasible?
- What exactly does a clinic order when it orders "750 devices"? (patient accounts, app credentials, physical devices, or all three?)
- Should device ID become a first-class patient/account field in V1?
- What role-based view is needed first: super admin only, or clinic admin too?
- Is XLSX import for bulk patient/treatment assignment a near-term priority?

## Resolved Questions (archived)

- ~~Should `v1-torbjorn` stay close to `main`, or selectively absorb more of `v1-anggakara`?~~ → Resolved: `v1-torbjorn` is now built on top of `v1-anggakara`, absorbing all V1 UX prototype work plus Torbjorn's additional context docs and the clinic-scale Treatment Assignment redesign.
- ~~Which V1 changes are product decisions vs just one designer's exploration?~~ → Core navigation restructure, Treatment Assignment flow, and patient detail cleanup are product decisions. The seeder and pagination redesign are Torbjorn's additions.
- ~~How does Firebase pagination currently limit patient selection?~~ → The old prototype hardcoded `limit=500` in one request. The redesigned page uses `PAGE_SIZE=50` with proper server-side pagination. The "select all matching" flow calls `GET /plato/patients/ids` to get all guids without loading full patient objects.
