# Meeting Notes — Product Review
**Date:** 2026-06-04
**Attendees:** Torbjørn (design/prototype), Ed (customer relations / superuser), Lasse (product manager)

---

## 1. Documentation direction

We will start maintaining structured documentation for the dashboard to track decisions and rationale. A key goal is to clearly differentiate features and views that are relevant to **internal Plato administrators** vs those that are for **clinic customers**.

---

## 2. Patient view — column-level notes

### Type column
- **Default** = generic reusable clinic account. Credentials like `clinicA01`, `clinicA02` are given to a patient for the duration of their treatment, then recycled for the next patient.
- Clinics manage these accounts in batches and refer to them by account number (e.g. "accounts 1–50", "account 150–400"). Clinics often have their own internal classification of account ranges (e.g. accounts 1–50 = children under 13, accounts 100–300 = treatment-resistant depression).
- When customer relations receives a request, clinics say things like "can you assign accounts 50–200 to 2mA". The `name` column is the primary identifier for finding these accounts.

**Pain point — sort order:** The name column does not sort alphanumerically. Results appear as `gc007, gc006, gc009` instead of `gc006, gc007, gc009`. This makes batch user management painful.

**Idea (Torbjørn):** Since clinics assign their own classifications to account ranges anyway, consider supporting admin-applied tags on accounts. Examples: `children u/13`, `personal account`, `generic/reusable`. This would make batch filtering by classification explicit and structured rather than relying on name-range conventions.

- **Regular** = patient signed up independently via the Plato app. *[Confirm with Lasse: are regular accounts automatically linked to a clinic/clinician? Current understanding is they are not.]*
- Some patients mistakenly create a personal account even when given generic login credentials by their clinic. This is a known onboarding confusion.

**Open question — generic vs personal accounts (important):** If/when we start surfacing patient-specific treatment outcomes, the generic account model creates unresolved problems:
- Where is personal data stored if the account is generic and will be reused?
- What does consent and privacy look like if a clinician has access to a previous patient's session history on a shared account?
- What does an account reset process look like — and does it fully clear prior patient data?
- This needs a formal policy decision before treatment outcomes become a dashboard feature.

### Clinic column
- Shows which clinic the account belongs to.
- Currently shows 'No Clinic' in the admin dashboard — confirmed as a known bug being fixed.

### Active Treatment column
- Shows `Left/Right` for standard stimulation, `Custom` if the admin has customised the stimulations.
- **Conflict:** From the patient detail screen, an admin can click "Add Treatment" (which doubles as edit) and modify stimulations directly — but without the ability to select from pre-defined treatment groups. This conflicts with the Treatments by Group page, which organises stimulations into named, described groups.
- The core mental model conflict: **are patients assigned treatments, or assigned stimulations?** This needs a design decision (see section 4).

### Created At / Updated At columns
- These are system metadata fields. Torbjørn's view: they should be demoted or hidden by default. They are low-value for routine admin tasks and currently take up prominent table space.

### Check R/N Link column
- Purpose unknown to Torbjørn. *[Lasse to clarify what this field represents.]*

### Active column
- Assumed to indicate whether the patient account is active.
- Open question: does the Patients view currently filter out inactive accounts, or show all? Should there be an explicit filter toggle?

### Detail column
- Links to the patient detail screen where an admin can: view/change the account password, disable/activate the account, and add/edit stimulations.

---

## 3. Patients view vs Treatment Assignment — redundancy

**Conclusion:** The current prototype's dedicated Treatment Assignment page is largely redundant with the Patients view. Customer relations staff, when editing a single patient's treatment, naturally go to the Patients view → Patient Detail and edit from there. There is no strong reason to send them to a separate stripped-down patient list just to do the same thing.

**Decision: treatment assignment should live inside the Patients view**, not on a separate page.

---

## 4. Current batch assignment workflow (existing production system)

The current production batch flow is:
1. Go to Treatments by Group
2. Create or edit a treatment (name, description, assign to clinic/clinician, edit stimulations)
3. In step 4 of the wizard: select patients and assign them to the treatment

**Critical pain point:** When **creating** a new treatment, the system allows Select All and multi-select. When **editing** an existing treatment, assigning a patient requires confirming a popup for each individual patient — making batch reassignment of 50+ patients impractical. This has led to customer relations routinely creating duplicate identical treatments as a workaround, creating data pollution.

**Decision:**
- Move patient-to-treatment assignment **out of** the treatment management flow entirely
- Patient assignment becomes a workflow **in the Patients view**
- "Treatments by Group" is renamed to something like **"Manage Treatments"** and focuses only on defining and editing treatments + stimulations, with no patient assignment in that flow

---

## 5. Stimulations — separate page still needed

Stimulations should keep their own admin page, because a single stimulation can belong to multiple treatments. If stimulations were only manageable nested within treatments, identical stimulations would need to be recreated per treatment — creating the same pollution problem.

---

## 6. Stimulation naming and clinic scoping — critical pain point (Ed / customer relations)

**Problem 1 — duplicate names not allowed:** The system does not allow two stimulations to share the same name. If Ed creates a "2mA Stimulation" for one clinic, he cannot create another "2mA Stimulation" for a different clinic. He has to introduce minor naming variations (trailing space, underscore) as workarounds.

**Problem 2 — stimulations are clinic-scoped:** A stimulation cannot be assigned to multiple clinics. Each clinic that needs a 2mA stimulation requires its own uniquely-named version, even if the parameters are identical.

**Short-term fix agreed:** Promote commonly requested stimulations (especially 2mA variants) to the platform-default / system stimulation set, making them available across all clinics without per-clinic duplication.

**Context:** Approximately 90% of day-to-day customer relations work in the admin dashboard relates to a single product limitation: the default Plato mobile app caps stimulations at 1.8mA, but clinicians frequently prescribe 2mA. Customer relations must manually create and assign 2mA stimulations for each clinic that requests it. *[Lasse to confirm 1.8mA default cap.]*

---

## 7. Future direction — treatments as time-based programs

Treatments are expected to evolve from "a group of stimulations" into **full protocols/programs** that run over a pre-defined time period (e.g. 8 weeks, 3 sessions per week). The current data model and UI decisions should not block this future expansion. Keep this in mind when renaming and restructuring treatment-related pages.

---

## Open questions / confirm with Lasse

- [ ] Do 'Regular' (non-generic) patient accounts automatically link to a clinic/clinician when they sign up via the app?
- [ ] What does the 'Check R/N Link' column in the patient view represent?
- [ ] Is the default Plato app stimulation cap 1.8mA? Confirm.
- [ ] Does the Patients view currently filter inactive accounts, or show all?
- [ ] What is the current data/privacy policy for generic accounts being reused across patients?
