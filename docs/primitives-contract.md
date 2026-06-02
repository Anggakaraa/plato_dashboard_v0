# PlatoScience Dashboard Primitives Contract

This document defines the UI building blocks agents should reuse when changing the dashboard.

A **primitive** is a basic reusable UI piece, like a table, button, badge, empty state, card, or layout pattern. A **contract** is the agreement for how to use those pieces so new screens feel consistent and remain maintainable.

## Core Contract

- Use Reactstrap and Bootstrap components as the base UI layer.
- Use SCSS for styling, not inline styles, unless the value is truly dynamic.
- Put global visual decisions in `src/assets/scss/_variables.scss`.
- Put reusable component overrides in `src/assets/scss/custom/components/`.
- Put page-only styling in `src/assets/scss/custom/pages/`.
- Reuse shared components before creating new ones.
- Keep component JSX focused on structure and behavior.

## Shared Table Primitives

### `PlatoTableContainer`

Path:

```text
src/components/Common/PlatoTableContainer.jsx
```

Use for table screens that behave like server/API-backed lists: pagination, search, and data fetched through API-shaped calls.

Expected behavior:

- One global search control above the table.
- Pagination below the table.
- Empty state through shared empty-state props or component.
- No search inputs inside `<th>` header cells.

### `LocalTableContainer`

Path:

```text
src/components/Common/LocalTableContainer.jsx
```

Use for smaller local datasets where filtering and pagination can happen in the browser.

Same visual rules as `PlatoTableContainer`:

- Warm table header.
- Clear row hover.
- Consistent pagination.
- Shared empty state.

### Selection Tables

For patient-selection and batch workflows:

- Use explicit checkboxes.
- Copy must distinguish visible rows from all matching rows.
- Say `Select visible patients` when only loaded rows are selected.
- Only say `Select all filtered patients` if the backend truly includes unloaded matching rows.
- Review and confirm once for the whole batch, not once per patient.

## Empty State Primitive

Path:

```text
src/components/Common/EmptyState.jsx
```

Use whenever a table, list, or panel has no results.

Preferred props:

```jsx
<EmptyState
  title="No patients yet."
  message="Add your first patient or adjust your search."
  actionText="+ Add Patient"
  onAction={() => setModal(true)}
/>
```

Rules:

- Keep titles short and human.
- Use one helpful supporting sentence.
- Include a primary action only when the next action is obvious.
- Use the Plato dot texture and warm neutral styling from the design system.

## Buttons

Use Reactstrap `Button` where possible.

| Variant | Use | Visual |
|---|---|---|
| Primary | Add, Save, Create, Confirm | `#57072F`, white text |
| Secondary | Export, research/admin secondary actions | `#053146`, white text |
| Outline | Low-emphasis secondary actions | transparent, maroon border/text |
| Danger | Delete, disable, destructive actions | `#C84B4B`, white text |

Rules:

- Primary CTAs should not be green.
- Do not force equal button widths unless the layout requires it.
- Destructive actions should not be placed as the main top-right action.
- Prefer text labels that say the action directly, like `Assign Treatment`.

## Badges And Status Chips

Prefer semantic CSS classes over one-off colors.

| Class | Use |
|---|---|
| `.ps-badge-active` | Active, online, enabled |
| `.ps-badge-inactive` | Disabled, inactive, none |
| `.ps-badge-position` | Electrode position such as L/R/Back |
| `.ps-badge-secondary` | Custom or secondary label |

Rules:

- Active status uses New Energy `#E0FFC2` with dark text.
- Do not use teal/cyan for Active boolean status.
- Do not use white text on New Energy.

## Cards

Use cards for individual panels, repeated items, modals, and table containers.

Default:

- White background.
- `8px` radius.
- Warm maroon-tinted shadow.
- `20px 24px` body padding.

Rules:

- Do not nest cards inside cards unless the inner card is a repeated item.
- Keep dashboard cards equal height within the same row.
- Use warm page background between cards to create separation.

## Forms

Use Reactstrap form primitives when possible.

Rules:

- Inputs use warm border `#E8E2D9`.
- Focus state uses maroon border and subtle maroon focus ring.
- Labels are concise and clear.
- Avoid page-level inline styles for form spacing.
- On phones, inputs/selects should use `16px` font size to prevent iOS Safari auto-zoom.

## Modals And Drawers

Use modals for focused decisions and drawers/offcanvas panels for contextual editing or assignment choices.

Rules:

- One primary action in the footer.
- One cancel/close path.
- Destructive actions should be visually separated.
- Batch assignment confirmation should summarize count, target treatment, and current-treatment impact.

## Page Layout Primitive

Standard page shape:

```text
Page title + optional subtitle
Breadcrumb or context line
Primary content card/table
Supporting panels only when needed
```

Rules:

- Page titles use Title Case.
- Content starts directly with the useful workflow, not marketing copy.
- Use `24px` page padding on desktop and `16px` on smaller screens.
- Keep workflow pages dense but calm.

## Navigation Primitive

Current target navigation:

```text
Dashboard
User Management
  Clinics
  Clinicians
  Patients
Treatment Management
  Stimulations
  Treatment Protocols
  Treatment Assignment
```

Rules:

- Sidebar active item uses New Energy accent.
- Group labels may be uppercase, but page titles should not be.
- Keep clinician/admin workflows organized by real user tasks, not database table names.

## Treatment Assignment Contract

Treatment Assignment is a dedicated workflow, separate from protocol creation.

Expected flow:

1. Choose clinic or scope.
2. Select patients with search/filtering and visible-row selection.
3. Choose action: assign protocol or remove treatment.
4. Review impact.
5. Confirm once.

Rules:

- Do not create duplicate treatment protocols as an assignment workaround.
- Do not put treatment creation inside patient detail.
- Patient detail may show active treatment read-only and link to Treatment Assignment.
- Warn when selected patients already have active treatments.
- Be clear about visible-row selection vs all filtered patients.

## Mock API Contract

Prototype behavior should usually be implemented in MSW first.

Important files:

```text
src/mocks/data.js
src/mocks/handlers.js
```

Batch assignment endpoint used by the prototype:

```json
POST /bulk-assign-treatment
{
  "treatment_group_guid": "tg-001",
  "patient_guids": ["pat-001", "pat-002"]
}
```

Expected mock behavior:

- Disable previous active patient treatment records.
- Append a new active treatment record.
- Return updated patient objects or enough data for the UI to refresh.

## Styling Review Checklist

Before finishing UI work, verify:

- Existing shared primitives were reused where practical.
- New colors match `docs/design-system.md`.
- No purple, cold grey, Poppins, or Bootstrap green CTA regressions.
- Tables use global search above the table.
- Empty lists use `EmptyState`.
- Batch workflows confirm once per batch.
- Mobile input text remains large enough to avoid iOS zoom.

