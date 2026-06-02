# Patient-Centered Treatment Assignment - Product Direction

Date: 2026-05-29
Primary branch: `v1-torbjorn`
Repository area: PlatoScience dashboard prototype

## Purpose

This document defines the product direction for a new dashboard prototype workflow: patient-centered treatment assignment.

The goal is to create shared product understanding before implementation planning. This is not an implementation plan and does not specify final component architecture, route structure, API behavior, or backend changes.

## Product Problem

The current "Treatments by Group" workflow is awkward for a common admin task: assigning or reassigning many patient accounts to an existing treatment.

The workflow is centered on the treatment object, while the real admin task is often centered on patient assignment. Admins usually already know that a clinic needs a group of patients updated. They should not need to step through treatment setup details just to assign an existing treatment.

Current pain points:

- Admins often have to open a treatment first.
- They may need to step through treatment details, clinic or clinician selection, and stimulation review before reaching patient assignment.
- Editing an existing treatment can trigger confirmation per selected patient.
- Per-patient confirmation makes batch assignment of 50+ patients slow, repetitive, and error-prone.
- Some admins work around this by creating a duplicate treatment and assigning patients through the new-treatment flow.

That workaround is a signal that the product is mixing two different jobs: defining treatment protocols and assigning those protocols to patients.

## Target User Mental Model

Admins usually think about the assignment task in this order:

1. Which clinic is requesting the change?
2. Which patients need updating?
3. Which active treatment should those patients have?

The prototype should therefore be:

- clinic-first
- patient-centered
- batch-oriented

The workflow should help the admin start from the group of patients they need to change, then choose the treatment those patients should receive.

## Core Product Principle

Treatment Protocol Management and Treatment Assignment should be separate workflows.

Treatment Protocol Management is for creating and editing treatment definitions. In simple terms, this is where admins manage the treatment "recipe": the treatment name, included stimulations, stimulation grouping, and protocol-level details.

Treatment Assignment is for assigning or reassigning existing patients to existing treatment protocols. In simple terms, this is where admins decide which patients should receive which already-defined treatment.

This separation should reduce confusion and discourage duplicate-treatment workarounds.

## Proposed Prototype Concept

Create a patient-centered Treatment Assignment view.

In this view, an admin can:

- filter by clinic
- search and filter patients
- see each patient's current active treatment
- select multiple patients
- batch assign a new existing treatment
- confirm the assignment once for the whole batch

The prototype should avoid one confirmation per patient. Batch assignment should use one clear review and confirmation step.

## Success Criteria

The prototype is successful if an admin can:

- select a clinic
- find and select relevant patient accounts
- understand each selected patient's current active treatment
- choose the correct new treatment using both treatment name and treatment parameters
- confirm the assignment once
- see the updated active treatment in the patient table

## Proposed Primary Workflow

1. Select clinic.
2. Review, search, or filter patients.
3. Select patients.
4. Click "Assign Treatment".
5. Open an assignment drawer or modal.
6. Choose treatment.
7. Review selected patient count, current treatment distribution, and new treatment summary.
8. Confirm once.
9. Table updates with the new active treatment.

The workflow should make it obvious what will change before the admin confirms.

## Current Vs New Treatment Clarity

The assignment review should clearly distinguish three things:

- the current treatment distribution among selected patients
- the newly selected treatment
- what will change after confirmation

For example, if 40 selected patients currently have Treatment A, 10 have Treatment B, and all 50 will be assigned Treatment C, the review should make that before-and-after state easy to understand.

## Active Treatment History Assumption

The prototype should assume reassignment changes the patient's active treatment while preserving previous treatment history if supported by the backend. UI copy should avoid implying that historical treatment records are deleted.

## Treatment Parameter Visibility

Admins may not remember what each treatment name means. Treatment names can be clinic-specific, ambiguous, or tied to research terminology that is not obvious outside that clinic.

The assignment flow should show a compact treatment "signature" derived from the stimulations included in the treatment.

Example signature:

```text
5 stimulations · 1.6 mA · 30 min · Slide on · Not sham · L/R variants
```

This signature should appear in:

- treatment dropdowns
- assignment review
- selected treatment preview
- possibly the current treatment column
- possibly a hover or detail state for current treatment

The signature is meant to give admins enough confidence to choose the right treatment without forcing them to open a full treatment editor.

## Treatment Signature Logic

The treatment signature should summarize the stimulations included in the treatment.

Recommended summary dimensions:

- number of stimulations
- current or intensity
- duration
- slide or patient-adjustable setting
- sham, placebo, or control status
- montage or side variants

If values are consistent across all stimulations, show the single value.

Examples:

- `1.6 mA`
- `30 min`
- `Slide on`
- `Not sham`
- `L/R variants`

If values differ across included stimulations, show a mixed or range state.

Examples:

- `Mixed current`
- `20-30 min`
- `Includes sham`
- `Mixed montages`

The prototype should include at least one mock treatment with mixed parameters so this summary logic can be tested visually and behaviorally.

## Recommended UI Structure

The main view should be a patient table with enough information to support confident batch assignment.

Recommended patient table columns:

- checkbox
- patient name
- email or account identifier
- clinic
- current treatment
- treatment signature
- patient type
- active status
- last updated

When patients are selected, show a batch action bar. The batch action bar should make the next action clear without taking over the page.

Recommended assignment drawer or modal content:

- selected patient count
- current treatment distribution
- treatment selector
- selected treatment preview
- compact treatment signature
- collapsible stimulation details
- one final confirmation button

## "Not A Treatment Editor" Rule

The assignment drawer or modal is only for selecting and previewing treatments. It should not allow admins to edit treatment definitions, included stimulations, stimulation parameters, names, durations, currents, sham status, or montage settings.

Treatment Assignment should preview treatment protocol details so the admin can choose confidently.

Treatment Protocol Management is where treatment definitions are edited.

If an admin sees that a treatment definition is wrong, they should leave the assignment workflow and edit it in the protocol-management workflow.

## Safety And Edge Cases

The first prototype should probably require selected patients to belong to one clinic. This keeps treatment selection safer because treatment names and availability may be clinic-specific.

Recommended safety behavior:

- If selected patients span multiple clinics, disable assignment or show a clear warning.
- Show a warning when selected patients already have active treatments.
- Clearly show patients with no active treatment.
- Include at least one mock treatment with mixed parameters to test summary logic.
- Be careful with "select all" language if the frontend only selects currently loaded or visible patients.

Recommended wording distinction:

- "Select visible patients" means only rows currently loaded in the table.
- "Select all filtered patients" should only be used if the implementation truly includes every matching patient, including patients not currently loaded on screen.

This distinction matters because admins may work with large clinic batches.

## Prototype Scope

In scope for this product direction:

- documentation of the product direction
- proposed UX structure
- assumptions
- open questions

Out of scope for this documentation task:

- code implementation
- route creation
- UI components
- MSW handler changes
- backend or Firebase writes
- XLSX import
- full treatment creation redesign

## Assumptions

- The primary user for this workflow is an admin assigning or reassigning patient accounts at clinic scale.
- A patient should have one active treatment visible in the patient app at a time.
- Existing treatment protocols are already created before this workflow begins.
- Treatment names alone are not reliable enough for confident assignment.
- A compact treatment signature can be derived from available treatment and stimulation data in the prototype.
- The first prototype can prioritize one-clinic batch assignment before supporting cross-clinic workflows.
- The implementation may initially use mock data behavior before backend batch assignment is confirmed.

## Open Questions For Later Planning

- Should this become a new route or a mode/tab inside Patients?
- Which existing components or routes are safest to reuse?
- How is current active treatment represented in the frontend data model?
- Can treatment signatures be derived from existing mock treatment and stimulation data?
- Does the backend support batch assignment, or will the prototype need MSW-only behavior first?
- Is patient selection limited by pagination or loaded rows?
- What should "select all filtered patients" mean in the real implementation?

## Next Step: Prototype Planning

After this product direction is approved, the next task is to inspect the current frontend, mock data, routes, and MSW handlers, then propose an implementation plan.

That planning step should happen separately. This document should remain product-oriented and should not become a detailed implementation plan.
