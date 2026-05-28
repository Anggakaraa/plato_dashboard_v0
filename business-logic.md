# PlatoScience — Product & Business Logic
*Reference document for anyone building on or designing for the dashboard. Read alongside `design-system.md` and `components.md`.*

---

## What the Product Does

PlatoScience makes a neurostimulation device (TES — Transcranial Electrical Stimulation). The dashboard is the management layer for clinics, clinicians, patients, and the stimulation protocols delivered to patients.

Think of it like this:
- **Stimulations** = individual songs
- **Treatments** = playlists (collections of stimulations)
- **Patients** = listeners assigned to a playlist
- **Clinics** = the organisations that manage everything

---

## Entity Hierarchy

```
PlatoScience (platform)
└── Clinic
    ├── Clinicians  (staff who manage patients)
    └── Patients
          └── Treatment (one active at a time)
                └── Stimulations (the playlist items)
```

Everything connects back to a **Clinic**. A patient without a clinic cannot exist. A treatment without a clinic cannot exist. A stimulation can be platform-wide or clinic-created.

---

## Layer 1 — Clinic

The top-level entity. All other entities belong to a clinic.

**Fields:**
| Field | Type | Notes |
|---|---|---|
| `guid` | string | Unique identifier |
| `name` | string | Clinic display name |
| `email` | string | Clinic contact email |
| `country` | string | Country of operation |
| `signifier` | string | Short code (2–12 chars) used as patient ID prefix e.g. `"nws"` |
| `signifier_count` | number | Auto-increments as patients are created |
| `disabled` | boolean | Soft-delete |

**Who creates clinics:** PlatoScience super-admins only.

**Rules:**
- Every clinic must have a unique `signifier`
- The signifier is used to generate patient email credentials (e.g. `nws001@platoscience.clinic`)

---

## Layer 2 — Clinician

Staff member belonging to a clinic. Can manage that clinic's patients and treatments.

**Fields:**
| Field | Type | Notes |
|---|---|---|
| `guid` | string | Unique identifier |
| `name` | string | Full name |
| `email` | string | Login email |
| `disabled` | boolean | Soft-delete |

**Relationship to clinic:** via `clinic_clinicians` junction
```
clinic_clinicians {
  guid
  clinic_id     → Clinic.guid
  clinician_id  → Clinician.guid
  admin: bool   → whether this clinician is a clinic admin
  disabled: bool
}
```

A clinician can belong to multiple clinics. A clinic can have multiple clinicians.

**Who creates clinicians:** PlatoScience super-admins.

---

## Layer 3 — Patient

A patient belongs to one clinic. They are assigned a treatment (but not required at creation time).

**Fields:**
| Field | Type | Notes |
|---|---|---|
| `guid` | string | Unique identifier |
| `id` | number | Numeric legacy ID |
| `name` | string | Patient display name |
| `email` | string | Login credential for the mobile app |
| `disabled` | boolean | Soft-delete |
| `native` / `legacy` / `migrated` | boolean | Firebase migration status flags |

**Patient types** (determined by email format):
| Type | Email pattern | Badge shown |
|---|---|---|
| Default | `xxx@platoscience.clinic` | Default (primary) |
| Regular | Any real email | Regular (info) |

**Relationship to clinic:** via `clinic_patients` junction
```
clinic_patients {
  clinic_id    → Clinic.guid
  patient_id   → Patient.guid
  clinic: {    → embedded clinic object
    name
    clinic_clinicians: [{ clinician_id }]
  }
}
```

**Relationship to treatments:** via `patient_treatments` array embedded on the patient object
```
patient_treatments: [
  { guid, disabled, started_at }
]
```

**Rules:**
- A patient must be assigned to a clinic at creation time
- A patient does NOT need a treatment to be created
- A patient currently has one active treatment at a time (the non-disabled one)
- When a new treatment is added, previous treatments are disabled automatically

**Who creates patients:** PlatoScience super-admins or clinic admins.

---

## Layer 4 — Stimulation (the "Song")

A single stimulation protocol. Can be created at platform level (by PlatoScience) or at clinic level (by the clinic itself).

**Fields:**
| Field | Type | Notes |
|---|---|---|
| `guid` | string | Unique identifier |
| `title` | string | Internal/system title |
| `name` | string | Display name (falls back to `title` if empty) |
| `short_description` | string | Brief description |
| `color` | string | Hex color for visual identity in the app |
| `original` | boolean | `true` = platform-created, `false` = clinic-created custom |
| `key` | string | `"default"` for legacy stimulations |
| `disabled` | boolean | Soft-delete |
| `intervention_treatment_tes` | number | Count of treatments using this stimulation |

**TDCS Parameters** (nested, defines the actual electrical stimulation):
```
tes_stimulations_tdcs_parameters: [
  {
    tdcs_parameter: {
      anode:    "L" | "R" | "B"   // Left / Right / Back electrode
      cathode:  "L" | "R" | "B"
      current:  number             // milliamps (mA)
      duration: number             // seconds (UI shows ÷ 60 = minutes)
    }
  }
]
```

**API response shape** — stimulations come back split into two buckets:
```json
{
  "original": [ ...platform stimulations (original: true) ],
  "clinic":   [ ...clinic-created stimulations (original: false) ]
}
```
The app merges these into a single `stimulations` array for display.

**Who creates stimulations:**
- PlatoScience super-admins (platform-wide, `original: true`)
- Clinic admins (clinic-specific, `original: false`)

**Rules:**
- Clinics can create their own stimulations using the same form fields
- Stimulations exist independently — they are not tied to a patient or treatment
- The "In Treatments" column shows how many treatments reference this stimulation

---

## Layer 5 — Treatment (the "Playlist")

A treatment is a collection of stimulations assigned to a patient. It is the core clinical protocol.

**Fields:**
| Field | Type | Notes |
|---|---|---|
| `guid` | string | Unique identifier |
| `disabled` | boolean | Soft-delete (old treatments are disabled when new one added) |
| `started_at` | datetime or null | `null` = not yet started; set when patient begins |

**Relationship to stimulations:** via `interventions` array
```
interventions: [
  { guid, stimulation_guid, order }   // each item = one stimulation in the playlist
]
```

**Treatment creation flow (current — known UX issue):**
1. Select clinic
2. Select stimulations to include (the playlist)
3. Assign to a patient — **on the same form** ← this is the UX flaw (see below)

**Rules:**
- A treatment must belong to a clinic
- A treatment references existing stimulations — it does not create new ones
- A patient can have multiple treatments in history but only one active (non-disabled) at a time
- When a new treatment is created for a patient, previous treatments are set to `disabled: true`

---

## Known UX Problems → V1 Decisions

These were confirmed product issues. V1 redesign decisions are documented here.

| # | Problem | V1 Decision |
|---|---|---|
| 1 | **Treatment + patient assignment in one flow** | Separated completely. Treatment Protocols page = create/edit only. Treatment Assignment = dedicated separate page. |
| 2 | **Three broken entry points for assignment** | All removed. One dedicated Treatment Assignment flow replaces all three. |
| 3 | **No bulk assignment** | Treatment Assignment supports multi-select + select-all-filtered. One confirm for the whole batch, no per-patient dialogs. |
| 4 | **Database polluted with duplicate treatments** | Root cause was users creating new treatments as assignment workaround. Fixed by providing a proper assignment flow. |
| 5 | **Flat entity hierarchy (no clinic context)** | V1 is hierarchical: Clinic → Clinicians + Patients. Super admin drills into a clinic; clinic admin lands directly in their clinic view. |
| 6 | **Treatment creation on patient dashboard** | Removed. Patient page is read-only for treatment — shows active treatment only. Assignment is done via the Assignment flow. |

## V1 Navigation Structure

```
SUPER ADMIN
├── Dashboard
├── User Management
│   └── Clinics (list + Add Clinic)
│       └── Clinic Detail
│           ├── Tab: Clinicians
│           └── Tab: Patients (incl. bulk slot creation)
└── Treatment Management
    ├── Stimulations
    ├── Treatment Protocols
    └── Treatment Assignment

CLINIC ADMIN
├── Dashboard
├── User Management
│   ├── Clinicians
│   └── Patients
└── Treatment Management (same, filtered to their clinic)
```

---

## User Roles

| Role | Access | Key permissions |
|---|---|---|
| `plato-admin` | Full platform access | Create clinics, clinicians, all patients, all stimulations |
| `clinic-admin` | Own clinic only | Create patients, clinicians, stimulations, treatments for their clinic |
| `clinician` | Own patients only | View and manage their assigned patients and treatments |

---

## Data Relationships — Quick Reference

```
Clinic ──────────────────┐
  │                      │
  ├── Clinician (M:M via clinic_clinicians)
  │     └── admin: bool
  │
  └── Patient (1:M via clinic_patients)
        │
        └── Treatment (1:M, only 1 active)
              │
              └── Stimulation (M:M via interventions)
                    └── TDCS Parameters (anode, cathode, current, duration)
```

---

## Mock Data Universe (for prototype / demo)

Designed to exercise every relationship and show every badge/status variant.

### Clinics (2)
| guid | Name | Country | Signifier |
|---|---|---|---|
| `clinic-001` | NeuroWell Sydney | Australia | `nws` |
| `clinic-002` | MindBridge Melbourne | Australia | `mbm` |

### Clinicians (2, one per clinic)
| guid | Name | Email | Clinic |
|---|---|---|---|
| `cln-001` | Dr. Sarah Chen | sarah.chen@neurowell.com.au | NeuroWell Sydney |
| `cln-002` | Dr. Marcus Webb | marcus.webb@mindbridge.com.au | MindBridge Melbourne |

### Stimulations (6 total — 4 platform originals, 2 clinic-created)
| guid | Title | Original | Anode | Cathode | Current | Duration |
|---|---|---|---|---|---|---|
| `stim-001` | Alpha Calm | ✅ | L | R | 1.5 mA | 20 min |
| `stim-002` | Focus Boost | ✅ | R | L | 2.0 mA | 15 min |
| `stim-003` | Deep Restore | ✅ | B | L | 1.0 mA | 30 min |
| `stim-004` | Energy Reset | ✅ | L | B | 1.5 mA | 25 min |
| `stim-005` | NeuroWell Relax | ❌ (NeuroWell) | R | B | 1.2 mA | 20 min |
| `stim-006` | MindBridge Focus+ | ❌ (MindBridge) | L | R | 2.0 mA | 18 min |

### Patients (10 — 5 per clinic)
**NeuroWell Sydney (5):**
James Kowalski, Maria Lopez, Tom Richardson, Priya Sharma, Ben Watts

**MindBridge Melbourne (5):**
Anna Fischer, David Moran, Chloe Tan, Ryan Patel, Isla Grant

### Treatments (10 — 1 per patient)
Each treatment is a playlist of 2–3 stimulations from the list above.

---

*Last updated: 2026-05-28 — V1 UX decisions added; known problems resolved with design decisions*
