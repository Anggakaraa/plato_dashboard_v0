/**
 * PlatoScience — Mock Data Universe
 * 2 clinics · 2 clinicians · 6 stimulations · 10 patients · 5 treatment groups
 *
 * All relationships are intentionally consistent:
 *   - Every patient belongs to a clinic
 *   - Patients start with no treatments — assign via /treatments-by-steps/details/:guid
 *   - Treatment groups are reusable protocols; assigning a patient creates a treatment entry
 *   - Clinic-created stimulations (original: false) reference the right clinic
 */

// ─── CLINICS ──────────────────────────────────────────────────────────────────

export const CLINICS = [
  {
    guid: "clinic-001",
    id: 1,
    name: "NeuroWell Sydney",
    email: "admin@neurowell.com.au",
    country: "Australia",
    signifier: "nws",
    signifier_count: 5,
    disabled: false,
    createdAt: "2024-06-01T09:00:00.000Z",
    updatedAt: "2025-01-10T11:00:00.000Z",
  },
  {
    guid: "clinic-002",
    id: 2,
    name: "MindBridge Melbourne",
    email: "admin@mindbridge.com.au",
    country: "Australia",
    signifier: "mbm",
    signifier_count: 5,
    disabled: false,
    createdAt: "2024-07-15T09:00:00.000Z",
    updatedAt: "2025-01-12T10:30:00.000Z",
  },
];

// ─── CLINICIANS ───────────────────────────────────────────────────────────────

export const CLINICIANS = [
  {
    guid: "cln-001",
    id: 1,
    name: "Dr. Sarah Chen",
    email: "sarah.chen@neurowell.com.au",
    disabled: false,
    createdAt: "2024-06-10T09:00:00.000Z",
    updatedAt: "2025-01-10T11:00:00.000Z",
    clinic_clinicians: [
      {
        guid: "cc-001",
        clinic_id: "clinic-001",
        clinician_id: "cln-001",
        admin: true,
        disabled: false,
        clinic: { guid: "clinic-001", name: "NeuroWell Sydney" },
      },
    ],
  },
  {
    guid: "cln-002",
    id: 2,
    name: "Dr. Marcus Webb",
    email: "marcus.webb@mindbridge.com.au",
    disabled: false,
    createdAt: "2024-07-20T09:00:00.000Z",
    updatedAt: "2025-01-12T10:30:00.000Z",
    clinic_clinicians: [
      {
        guid: "cc-002",
        clinic_id: "clinic-002",
        clinician_id: "cln-002",
        admin: true,
        disabled: false,
        clinic: { guid: "clinic-002", name: "MindBridge Melbourne" },
      },
    ],
  },
];

// ─── STIMULATIONS ─────────────────────────────────────────────────────────────
// Response must be { original: [...], clinic: [...] }
// original: true  → created by PlatoScience (platform-wide)
// original: false → created by clinic

const makeTdcs = (anode, cathode, current, durationMins) => ({
  tes_stimulations_tdcs_parameters: [
    {
      tdcs_parameter: {
        anode,
        cathode,
        current,
        duration: durationMins * 60, // stored in seconds, UI divides by 60
      },
    },
  ],
});

export const ORIGINAL_STIMULATIONS = [
  {
    guid: "stim-001",
    id: 1,
    title: "Stimulation 1",
    name: "Stimulation 1",
    short_description: "Gentle low-intensity tDCS — anode left, cathode right, 1.5 mA, 20 min.",
    color: "#4A90D9",
    original: true,
    key: null,
    disabled: false,
    intervention_treatment_tes: 4,
    createdAt: "2024-01-01T09:00:00.000Z",
    updatedAt: "2024-06-01T09:00:00.000Z",
    ...makeTdcs("L", "R", 1.5, 20),
  },
  {
    guid: "stim-002",
    id: 2,
    title: "Stimulation 2",
    name: "Stimulation 2",
    short_description: "Medium-intensity tDCS — anode right, cathode left, 2.0 mA, 15 min.",
    color: "#E8A838",
    original: true,
    key: null,
    disabled: false,
    intervention_treatment_tes: 3,
    createdAt: "2024-01-01T09:00:00.000Z",
    updatedAt: "2024-06-01T09:00:00.000Z",
    ...makeTdcs("R", "L", 2.0, 15),
  },
  {
    guid: "stim-003",
    id: 3,
    title: "Stimulation 3",
    name: "Stimulation 3",
    short_description: "Low-intensity tDCS — anode bilateral, cathode left, 1.0 mA, 30 min.",
    color: "#57072F",
    original: true,
    key: null,
    disabled: false,
    intervention_treatment_tes: 3,
    createdAt: "2024-01-01T09:00:00.000Z",
    updatedAt: "2024-06-01T09:00:00.000Z",
    ...makeTdcs("B", "L", 1.0, 30),
  },
  {
    guid: "stim-004",
    id: 4,
    title: "Stimulation 4",
    name: "Stimulation 4",
    short_description: "Medium-intensity tDCS — anode left, cathode bilateral, 1.5 mA, 25 min.",
    color: "#2A9D6E",
    original: true,
    key: null,
    disabled: false,
    intervention_treatment_tes: 3,
    createdAt: "2024-01-01T09:00:00.000Z",
    updatedAt: "2024-06-01T09:00:00.000Z",
    ...makeTdcs("L", "B", 1.5, 25),
  },
];

export const CLINIC_STIMULATIONS = [
  {
    guid: "stim-005",
    id: 5,
    title: "Stimulation 5",
    name: "Stimulation 5",
    short_description: "Clinic-custom tDCS — anode right, cathode bilateral, 1.2 mA, 20 min.",
    color: "#89516D",
    original: false,
    key: null,
    disabled: false,
    intervention_treatment_tes: 2,
    clinic_id: "clinic-001",
    createdAt: "2024-09-01T09:00:00.000Z",
    updatedAt: "2025-01-10T11:00:00.000Z",
    ...makeTdcs("R", "B", 1.2, 20),
  },
  {
    guid: "stim-006",
    id: 6,
    title: "Stimulation 6",
    name: "Stimulation 6",
    short_description: "Clinic-custom tDCS — anode left, cathode right, 2.0 mA, 18 min.",
    color: "#053146",
    original: false,
    key: null,
    disabled: false,
    intervention_treatment_tes: 3,
    clinic_id: "clinic-002",
    createdAt: "2024-10-01T09:00:00.000Z",
    updatedAt: "2025-01-12T10:30:00.000Z",
    ...makeTdcs("L", "R", 2.0, 18),
  },
];

export const ALL_STIMULATIONS = {
  original: ORIGINAL_STIMULATIONS,
  clinic: CLINIC_STIMULATIONS,
};

// ─── TREATMENT GROUPS (reusable named protocols) ──────────────────────────────
// These are the templates shown on /treatments-by-steps.
// Assigning a patient to one creates an entry in the mutable treatments store.
// The `clinic` object is embedded so Treatment-Details.jsx can call
// getPatientsSummary(data.clinic.guid) without extra lookups.

export const TREATMENT_GROUPS = [
  {
    guid: "tg-001", id: 1,
    name: "Alpha Calm Protocol",
    description: "Anxiety reduction and calm focus protocol using tDCS.",
    clinic_id: 1,
    clinic: { guid: "clinic-001", name: "NeuroWell Sydney", country: "Australia" },
    interventions: [
      { guid: "tgiv-001-1", order: 1, stimulation_guid: "stim-001", tes_stimulation: ORIGINAL_STIMULATIONS[0] },
      { guid: "tgiv-001-2", order: 2, stimulation_guid: "stim-002", tes_stimulation: ORIGINAL_STIMULATIONS[1] },
      { guid: "tgiv-001-3", order: 3, stimulation_guid: "stim-003", tes_stimulation: ORIGINAL_STIMULATIONS[2] },
    ],
    patient_treatment: [],
  },
  {
    guid: "tg-002", id: 2,
    name: "Focus Boost Protocol",
    description: "Cognitive enhancement protocol for concentration and memory.",
    clinic_id: 1,
    clinic: { guid: "clinic-001", name: "NeuroWell Sydney", country: "Australia" },
    interventions: [
      { guid: "tgiv-002-1", order: 1, stimulation_guid: "stim-002", tes_stimulation: ORIGINAL_STIMULATIONS[1] },
      { guid: "tgiv-002-2", order: 2, stimulation_guid: "stim-004", tes_stimulation: ORIGINAL_STIMULATIONS[3] },
    ],
    patient_treatment: [],
  },
  {
    guid: "tg-003", id: 3,
    name: "Deep Restore Protocol",
    description: "Low-intensity recovery protocol for post-session restoration.",
    clinic_id: 1,
    clinic: { guid: "clinic-001", name: "NeuroWell Sydney", country: "Australia" },
    interventions: [
      { guid: "tgiv-003-1", order: 1, stimulation_guid: "stim-001", tes_stimulation: ORIGINAL_STIMULATIONS[0] },
      { guid: "tgiv-003-2", order: 2, stimulation_guid: "stim-003", tes_stimulation: ORIGINAL_STIMULATIONS[2] },
      { guid: "tgiv-003-3", order: 3, stimulation_guid: "stim-005", tes_stimulation: CLINIC_STIMULATIONS[0] },
    ],
    patient_treatment: [],
  },
  {
    guid: "tg-004", id: 4,
    name: "MindBridge Standard",
    description: "Standard MindBridge neurostimulation protocol.",
    clinic_id: 2,
    clinic: { guid: "clinic-002", name: "MindBridge Melbourne", country: "Australia" },
    interventions: [
      { guid: "tgiv-004-1", order: 1, stimulation_guid: "stim-002", tes_stimulation: ORIGINAL_STIMULATIONS[1] },
      { guid: "tgiv-004-2", order: 2, stimulation_guid: "stim-004", tes_stimulation: ORIGINAL_STIMULATIONS[3] },
    ],
    patient_treatment: [],
  },
  {
    guid: "tg-005", id: 5,
    name: "MindBridge Intensive",
    description: "Extended focus protocol with clinic-custom stimulation for MindBridge Melbourne.",
    clinic_id: 2,
    clinic: { guid: "clinic-002", name: "MindBridge Melbourne", country: "Australia" },
    interventions: [
      { guid: "tgiv-005-1", order: 1, stimulation_guid: "stim-005", tes_stimulation: CLINIC_STIMULATIONS[0] },
      { guid: "tgiv-005-2", order: 2, stimulation_guid: "stim-001", tes_stimulation: ORIGINAL_STIMULATIONS[0] },
      { guid: "tgiv-005-3", order: 3, stimulation_guid: "stim-006", tes_stimulation: CLINIC_STIMULATIONS[1] },
    ],
    patient_treatment: [],
  },
];

// ─── TREATMENTS (per-patient instances) ───────────────────────────────────────
// Starts empty. Populated at runtime when a patient is assigned to a
// treatment group via POST /add-patient-treatment-group.

const makeTreatment = (guid, id, patientGuid, clinicGuid, clinicName, clinicianEmail, startedAt, createdAt) => ({
  guid,
  id,
  disabled: false,
  started_at: startedAt,
  patient_guid: patientGuid,
  research_treatment: 0,
  is_sham: false,
  allow_update_electric_current: false,
  one_session_by_day: false,
  createdAt,
  updatedAt: startedAt,
  clinic_clinician: {
    clinic: { guid: clinicGuid, name: clinicName },
    clinician: { email: clinicianEmail },
  },
});

// Starts empty — treatments are created at runtime when a patient is assigned
// to a treatment group via POST /add-patient-treatment-group on the detail page.
export const TREATMENTS = [];

// ─── INTERVENTIONS (treatment → stimulation playlist) ─────────────────────────

export const INTERVENTIONS = {
  "treat-001": [
    { guid: "iv-001-1", order: 1, stimulation_guid: "stim-001", tes_stimulation: ORIGINAL_STIMULATIONS[0] },
    { guid: "iv-001-2", order: 2, stimulation_guid: "stim-002", tes_stimulation: ORIGINAL_STIMULATIONS[1] },
  ],
  "treat-002": [
    { guid: "iv-002-1", order: 1, stimulation_guid: "stim-003", tes_stimulation: ORIGINAL_STIMULATIONS[2] },
    { guid: "iv-002-2", order: 2, stimulation_guid: "stim-004", tes_stimulation: ORIGINAL_STIMULATIONS[3] },
  ],
  "treat-003": [
    { guid: "iv-003-1", order: 1, stimulation_guid: "stim-001", tes_stimulation: ORIGINAL_STIMULATIONS[0] },
    { guid: "iv-003-2", order: 2, stimulation_guid: "stim-003", tes_stimulation: ORIGINAL_STIMULATIONS[2] },
    { guid: "iv-003-3", order: 3, stimulation_guid: "stim-005", tes_stimulation: CLINIC_STIMULATIONS[0] },
  ],
  "treat-004": [
    { guid: "iv-004-1", order: 1, stimulation_guid: "stim-002", tes_stimulation: ORIGINAL_STIMULATIONS[1] },
    { guid: "iv-004-2", order: 2, stimulation_guid: "stim-004", tes_stimulation: ORIGINAL_STIMULATIONS[3] },
  ],
  "treat-005": [
    { guid: "iv-005-1", order: 1, stimulation_guid: "stim-005", tes_stimulation: CLINIC_STIMULATIONS[0] },
    { guid: "iv-005-2", order: 2, stimulation_guid: "stim-001", tes_stimulation: ORIGINAL_STIMULATIONS[0] },
  ],
  "treat-006": [
    { guid: "iv-006-1", order: 1, stimulation_guid: "stim-002", tes_stimulation: ORIGINAL_STIMULATIONS[1] },
    { guid: "iv-006-2", order: 2, stimulation_guid: "stim-006", tes_stimulation: CLINIC_STIMULATIONS[1] },
  ],
  "treat-007": [
    { guid: "iv-007-1", order: 1, stimulation_guid: "stim-003", tes_stimulation: ORIGINAL_STIMULATIONS[2] },
    { guid: "iv-007-2", order: 2, stimulation_guid: "stim-001", tes_stimulation: ORIGINAL_STIMULATIONS[0] },
  ],
  "treat-008": [
    { guid: "iv-008-1", order: 1, stimulation_guid: "stim-004", tes_stimulation: ORIGINAL_STIMULATIONS[3] },
    { guid: "iv-008-2", order: 2, stimulation_guid: "stim-006", tes_stimulation: CLINIC_STIMULATIONS[1] },
  ],
  "treat-009": [
    { guid: "iv-009-1", order: 1, stimulation_guid: "stim-001", tes_stimulation: ORIGINAL_STIMULATIONS[0] },
    { guid: "iv-009-2", order: 2, stimulation_guid: "stim-002", tes_stimulation: ORIGINAL_STIMULATIONS[1] },
    { guid: "iv-009-3", order: 3, stimulation_guid: "stim-003", tes_stimulation: ORIGINAL_STIMULATIONS[2] },
  ],
  "treat-010": [
    { guid: "iv-010-1", order: 1, stimulation_guid: "stim-006", tes_stimulation: CLINIC_STIMULATIONS[1] },
    { guid: "iv-010-2", order: 2, stimulation_guid: "stim-004", tes_stimulation: ORIGINAL_STIMULATIONS[3] },
  ],
};

// ─── PATIENTS ─────────────────────────────────────────────────────────────────
// Embed clinic_patients + patient_treatments so the list view renders correctly

const makePatient = (guid, id, name, email, clinicGuid, clinicName, clinicianId) => ({
  guid,
  id,
  name,
  email,
  disabled: false,
  native: false,
  legacy: false,
  migrated: false,
  createdAt: "2025-01-15T09:00:00.000Z",
  updatedAt: "2025-03-20T14:30:00.000Z",
  clinic_patients: [
    {
      clinic_id: clinicGuid,
      clinic: {
        guid: clinicGuid,
        name: clinicName,
        clinic_clinicians: [{ clinician_id: clinicianId }],
      },
    },
  ],
  patient_treatments: [],   // starts empty — assign via treatment detail page
  firebase_patients: [{ firebase_uid: `firebase-${id}` }],
  patient_mobile_accesses: [{ credential: "123456" }],
});

export const PATIENTS = [
  // NeuroWell Sydney (clinic-001)
  makePatient("pat-001", 1, "James Kowalski",  "james.kowalski@gmail.com",  "clinic-001", "NeuroWell Sydney",     "cln-001"),
  makePatient("pat-002", 2, "Maria Lopez",     "maria.lopez@gmail.com",     "clinic-001", "NeuroWell Sydney",     "cln-001"),
  makePatient("pat-003", 3, "Tom Richardson",  "tom.richardson@gmail.com",  "clinic-001", "NeuroWell Sydney",     "cln-001"),
  makePatient("pat-004", 4, "Priya Sharma",    "priya.sharma@gmail.com",    "clinic-001", "NeuroWell Sydney",     "cln-001"),
  makePatient("pat-005", 5, "Ben Watts",       "nws001@platoscience.clinic","clinic-001", "NeuroWell Sydney",     "cln-001"),

  // MindBridge Melbourne (clinic-002)
  makePatient("pat-006", 6,  "Anna Fischer",   "anna.fischer@gmail.com",    "clinic-002", "MindBridge Melbourne", "cln-002"),
  makePatient("pat-007", 7,  "David Moran",    "david.moran@gmail.com",     "clinic-002", "MindBridge Melbourne", "cln-002"),
  makePatient("pat-008", 8,  "Chloe Tan",      "chloe.tan@gmail.com",       "clinic-002", "MindBridge Melbourne", "cln-002"),
  makePatient("pat-009", 9,  "Ryan Patel",     "ryan.patel@gmail.com",      "clinic-002", "MindBridge Melbourne", "cln-002"),
  makePatient("pat-010", 10, "Isla Grant",     "mbm001@platoscience.clinic","clinic-002", "MindBridge Melbourne", "cln-002"),

  // NeuroWell Sydney — extra slots (page 2 seed)
  makePatient("pat-011", 11, "Lucas White",    "nws002@platoscience.clinic","clinic-001", "NeuroWell Sydney",     "cln-001"),
  makePatient("pat-012", 12, "Sophie Adams",   "nws003@platoscience.clinic","clinic-001", "NeuroWell Sydney",     "cln-001"),
  makePatient("pat-013", 13, "Oliver Chen",    "oliver.chen@gmail.com",     "clinic-001", "NeuroWell Sydney",     "cln-001"),

  // MindBridge Melbourne — extra slots (page 2 seed)
  makePatient("pat-014", 14, "Emma Wilson",    "mbm002@platoscience.clinic","clinic-002", "MindBridge Melbourne", "cln-002"),
  makePatient("pat-015", 15, "Noah Brown",     "noah.brown@gmail.com",      "clinic-002", "MindBridge Melbourne", "cln-002"),
];

// ─── LOOKUP HELPERS ───────────────────────────────────────────────────────────

export const getPatientByGuid = (guid) =>
  PATIENTS.find((p) => p.guid === guid);

export const getTreatmentsByPatientGuid = (patientGuid) =>
  TREATMENTS.filter((t) => t.patient_guid === patientGuid);

export const getInterventionsByTreatmentGuid = (treatmentGuid) =>
  INTERVENTIONS[treatmentGuid] ?? [];

export const getClinicStimulationsByClinic = (clinicGuid) =>
  [...ORIGINAL_STIMULATIONS, ...CLINIC_STIMULATIONS].filter(
    (s) => s.original || s.clinic_id === clinicGuid
  );
