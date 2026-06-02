/**
 * PlatoScience — Mock Data Universe (generated)
 *
 * Preset controlled by VITE_MOCK_SEED_PRESET env var (default: "large"):
 *   small  — 2 clinics, ~20 patients/clinic, 6 groups/clinic  (dev sanity)
 *   large  — 4 clinics, ~250 patients/clinic, 35 groups/clinic (demo-safe default)
 *   stress — 4 clinics, Clinic A 1,500 patients / 120 groups   (stress test)
 *
 * All data is deterministic — same seed produces identical output on every reload.
 * Field shapes are preserved from the original hand-written data to avoid breaking
 * existing handlers, components, and helper functions.
 */

// ─── SEED PRESET ──────────────────────────────────────────────────────────────

const SEED_PRESET = (typeof import.meta !== "undefined" && import.meta.env?.VITE_MOCK_SEED_PRESET) || "large"

const PRESET = {
  small:  { clinicCount: 2, patientsPerClinic: {}, defaultPatients: 20,   stimTotal: 12,  groupsPerClinic: {}, defaultGroups: 6   },
  large:  { clinicCount: 4, patientsPerClinic: {}, defaultPatients: 250,  stimTotal: 60,  groupsPerClinic: {}, defaultGroups: 35  },
  stress: { clinicCount: 4, patientsPerClinic: { "clinic-001": 1500 }, defaultPatients: 400, stimTotal: 200, groupsPerClinic: { "clinic-001": 120 }, defaultGroups: 50 },
}[SEED_PRESET] || {
  clinicCount: 4, patientsPerClinic: {}, defaultPatients: 250, stimTotal: 60, groupsPerClinic: {}, defaultGroups: 35,
}

// ─── DETERMINISTIC SEEDED RNG (LCG) ──────────────────────────────────────────

function makeRng(seed = 42) {
  let s = seed >>> 0
  return () => { s = (Math.imul(1664525, s) + 1013904223) >>> 0; return s / 0xffffffff }
}
const rng = makeRng(42)
const pick = (arr) => arr[Math.floor(rng() * arr.length)]
const randInt = (min, max) => Math.floor(rng() * (max - min + 1)) + min
const pickN = (arr, n) => {
  const copy = [...arr]
  const result = []
  for (let i = 0; i < Math.min(n, copy.length); i++) {
    const idx = Math.floor(rng() * (copy.length - i))
    result.push(copy[idx])
    copy[idx] = copy[copy.length - i - 1]
  }
  return result
}

// ─── NAME POOLS ───────────────────────────────────────────────────────────────

const FIRST_NAMES = [
  "James","Maria","Thomas","Sophie","Oliver","Priya","Lucas","Emma","Noah","Anna",
  "Ben","Chloe","Ryan","Isla","David","Laura","Michael","Sara","Daniel","Amy",
  "Alexander","Charlotte","William","Freya","Samuel","Grace","Joseph","Hannah","Henry","Lily",
  "George","Alice","Charlie","Mia","Jack","Zoe","Leo","Natalie","Harry","Ella",
  "Oscar","Olivia","Ethan","Ava","Liam","Isabella","Mason","Sophia","Logan","Emily",
]
const LAST_NAMES = [
  "Kowalski","Fischer","Richardson","Webb","Chen","Patel","Watts","Grant","Lopez","Moran",
  "Tan","Brown","White","Adams","Wilson","Taylor","Anderson","Harris","Clark","Lewis",
  "Walker","Hall","Allen","Young","King","Wright","Scott","Green","Baker","Hill",
  "Nelson","Carter","Mitchell","Roberts","Turner","Phillips","Campbell","Parker","Evans","Edwards",
  "Collins","Stewart","Sanchez","Morris","Rogers","Reed","Cook","Morgan","Bell","Murphy",
  "Bailey","Rivera","Cooper","Richardson","Cox","Howard","Ward","Torres","Peterson","Gray",
]

// Deterministic name for patient index i within a clinic (no repeats up to 3,000)
const patientName = (i) => {
  const first = FIRST_NAMES[i % FIRST_NAMES.length]
  const last = LAST_NAMES[Math.floor(i / FIRST_NAMES.length) % LAST_NAMES.length]
  return `${first} ${last}`
}

// ─── CLINICS ──────────────────────────────────────────────────────────────────

export const CLINICS = [
  {
    guid: "clinic-001", id: 1,
    name: "NeuroWell Sydney",
    email: "admin@neurowell.com.au",
    country: "Australia",
    signifier: "nws", signifier_count: 5,
    disabled: false,
    createdAt: "2024-06-01T09:00:00.000Z",
    updatedAt: "2025-01-10T11:00:00.000Z",
  },
  {
    guid: "clinic-002", id: 2,
    name: "MindBridge Melbourne",
    email: "admin@mindbridge.com.au",
    country: "Australia",
    signifier: "mbm", signifier_count: 5,
    disabled: false,
    createdAt: "2024-07-15T09:00:00.000Z",
    updatedAt: "2025-01-12T10:30:00.000Z",
  },
  {
    guid: "clinic-003", id: 3,
    name: "Copenhagen Neural Clinic",
    email: "admin@copenhagenneural.dk",
    country: "Denmark",
    signifier: "cnc", signifier_count: 0,
    disabled: false,
    createdAt: "2024-09-01T09:00:00.000Z",
    updatedAt: "2025-02-01T09:00:00.000Z",
  },
  {
    guid: "clinic-004", id: 4,
    name: "Bergen Neurology Centre",
    email: "admin@bergenneurology.no",
    country: "Norway",
    signifier: "bnc", signifier_count: 0,
    disabled: false,
    createdAt: "2024-10-01T09:00:00.000Z",
    updatedAt: "2025-02-15T09:00:00.000Z",
  },
].slice(0, PRESET.clinicCount)

// ─── CLINICIANS ───────────────────────────────────────────────────────────────

export const CLINICIANS = [
  {
    guid: "cln-001", id: 1,
    name: "Dr. Sarah Chen",
    email: "sarah.chen@neurowell.com.au",
    disabled: false,
    createdAt: "2024-06-10T09:00:00.000Z",
    updatedAt: "2025-01-10T11:00:00.000Z",
    clinic_clinicians: [{ guid: "cc-001", clinic_id: "clinic-001", clinician_id: "cln-001", admin: true, disabled: false, clinic: { guid: "clinic-001", name: "NeuroWell Sydney" } }],
  },
  {
    guid: "cln-002", id: 2,
    name: "Dr. Marcus Webb",
    email: "marcus.webb@mindbridge.com.au",
    disabled: false,
    createdAt: "2024-07-20T09:00:00.000Z",
    updatedAt: "2025-01-12T10:30:00.000Z",
    clinic_clinicians: [{ guid: "cc-002", clinic_id: "clinic-002", clinician_id: "cln-002", admin: true, disabled: false, clinic: { guid: "clinic-002", name: "MindBridge Melbourne" } }],
  },
]

// ─── STIMULATION GENERATORS ───────────────────────────────────────────────────

const CURRENTS = [0.5, 1.0, 1.2, 1.5, 1.6, 1.8, 2.0]
const DURATIONS_MIN = [20, 25, 30, 35, 40]
const ANODES = ["L", "R", "B"]
const CATHODES = ["L", "R", "B"]
const STIM_COLORS = ["#4A90D9","#E8A838","#57072F","#2A9D6E","#89516D","#053146","#506F7E","#AC8599","#C84B4B","#D4870A"]

const makeTdcs = (anode, cathode, current, durationMins) => ({
  tes_stimulations_tdcs_parameters: [{ tdcs_parameter: { anode, cathode, current, duration: durationMins * 60 } }],
})

let _stimIdCounter = 1
const makeStim = (guid, isOriginal, clinicId, isSham, isSlide) => {
  const id = _stimIdCounter++
  const anode = pick(ANODES)
  const cathode = pick(CATHODES.filter(c => c !== anode).concat([anode])) // allow same for Back
  const current = pick(CURRENTS)
  const duration = pick(DURATIONS_MIN)
  const n = id
  return {
    guid,
    id,
    title: `Stimulation ${n}`,
    name: `Stimulation ${n}`,
    short_description: `${isSham ? "Sham " : ""}tDCS — anode ${anode}, cathode ${cathode}, ${current} mA, ${duration} min.${isSlide ? " Patient-adjustable." : ""}`,
    color: STIM_COLORS[id % STIM_COLORS.length],
    original: isOriginal,
    key: null,
    disabled: false,
    is_sham: isSham,
    allow_update_electric_current: isSlide,
    intervention_treatment_tes: randInt(2, 5),
    ...(isOriginal ? {} : { clinic_id: clinicId }),
    createdAt: "2024-01-01T09:00:00.000Z",
    updatedAt: "2024-06-01T09:00:00.000Z",
    ...makeTdcs(anode, cathode, current, duration),
  }
}

// Generate platform-wide and clinic stimulations
const origCount = Math.floor(PRESET.stimTotal * 0.4)
export const ORIGINAL_STIMULATIONS = Array.from({ length: origCount }, (_, i) => {
  const isSham = i % 5 === 4           // every 5th is sham
  const isSlide = i % 3 === 2          // every 3rd is slide
  return makeStim(`stim-orig-${String(i + 1).padStart(3, "0")}`, true, null, isSham, isSlide)
})

// Clinic stimulations: distribute remaining across clinics + dedicated sham pool
const clinicStimCount = PRESET.stimTotal - origCount
const perClinicRegular = Math.floor(clinicStimCount / CLINICS.length)

export const CLINIC_STIMULATIONS = []
// Per-clinic sham pools (ensure enough sham stims for pure-sham groups)
const CLINIC_SHAM_STIMS = {} // clinicGuid → stim[]

CLINICS.forEach((clinic) => {
  const groupCount = PRESET.groupsPerClinic[clinic.guid] ?? PRESET.defaultGroups
  const shamGroupCount = Math.ceil(groupCount * 0.15)
  const shamPoolSize = Math.max(8, shamGroupCount * 3) // at least 8, enough for ~3 stims per sham group

  // Regular clinic stims
  for (let i = 0; i < perClinicRegular; i++) {
    const isSham = i % 6 === 5
    const isSlide = i % 4 === 3
    const s = makeStim(`stim-${clinic.signifier}-${String(i + 1).padStart(3, "0")}`, false, clinic.guid, isSham, isSlide)
    CLINIC_STIMULATIONS.push(s)
  }

  // Dedicated sham pool for this clinic
  const shamPool = []
  for (let i = 0; i < shamPoolSize; i++) {
    const s = makeStim(`stim-${clinic.signifier}-sham-${String(i + 1).padStart(3, "0")}`, false, clinic.guid, true, false)
    shamPool.push(s)
    CLINIC_STIMULATIONS.push(s)
  }
  CLINIC_SHAM_STIMS[clinic.guid] = shamPool
})

export const ALL_STIMULATIONS = {
  original: ORIGINAL_STIMULATIONS,
  clinic: CLINIC_STIMULATIONS,
}

const getClinicStims = (clinicGuid) =>
  [...ORIGINAL_STIMULATIONS, ...CLINIC_STIMULATIONS.filter(s => s.clinic_id === clinicGuid)]

// ─── TREATMENT GROUPS ─────────────────────────────────────────────────────────

const GROUP_NAME_ROOTS = [
  "Alpha Calm", "Deep Focus", "Precision Low", "MindBridge", "Daily Maintenance",
  "Recovery", "Intensive", "Gentle Onset", "Research Arm", "Cognitive Boost",
  "Neuro Restore", "Standard Care", "Active Recovery", "Control", "Baseline",
  "Extended Session", "Short Burst", "High Intensity", "Low Dose", "Adaptive",
  "Morning Protocol", "Evening Protocol", "Weekly Reset", "Monthly Calibration", "Phase One",
  "Phase Two", "Phase Three", "Open Label", "Crossover", "Maintenance",
]
const GROUP_NAME_SUFFIXES = ["Protocol", "Series", "Programme", "Standard", "Track"]

let _groupIdCounter = 1

const generateTreatmentGroups = (clinic, count) => {
  const availableStims = getClinicStims(clinic.guid)
  const shamPool = CLINIC_SHAM_STIMS[clinic.guid] || []
  const groups = []
  let shamGroupsLeft = Math.ceil(count * 0.15)

  for (let i = 0; i < count; i++) {
    const id = _groupIdCounter++
    const isSham = shamGroupsLeft > 0 && (i % Math.floor(count / (Math.ceil(count * 0.15) + 1)) === Math.floor(count / (Math.ceil(count * 0.15) + 1)) - 1 || i === count - shamGroupsLeft)
    if (isSham) shamGroupsLeft--

    const rootName = GROUP_NAME_ROOTS[i % GROUP_NAME_ROOTS.length]
    const suffix = GROUP_NAME_SUFFIXES[Math.floor(i / GROUP_NAME_ROOTS.length) % GROUP_NAME_SUFFIXES.length]
    const variant = i >= GROUP_NAME_ROOTS.length ? ` ${Math.floor(i / GROUP_NAME_ROOTS.length) + 1}` : ""
    const baseName = `${rootName}${variant} ${suffix}`
    const name = isSham
      ? `${baseName} (Sham)`
      : i % 10 === 8 ? `${baseName} — ${clinic.signifier.toUpperCase()} Series`
      : baseName

    const ivCount = randInt(3, 8)
    let stimPool = isSham
      ? (shamPool.length >= ivCount ? shamPool : [...shamPool, ...availableStims.filter(s => s.is_sham)])
      : availableStims.filter(s => !s.is_sham)

    if (stimPool.length === 0) stimPool = availableStims
    const chosenStims = pickN(stimPool, ivCount)

    const interventions = chosenStims.map((stim, order) => ({
      guid: `tgiv-${clinic.signifier}-${String(id).padStart(3, "0")}-${order + 1}`,
      order: order + 1,
      stimulation_guid: stim.guid,
      tes_stimulation: stim,
    }))

    groups.push({
      guid: `tg-${clinic.signifier}-${String(i + 1).padStart(3, "0")}`,
      id,
      name,
      description: `${name} — ${clinic.name}`,
      clinic_id: clinic.id,           // integer — preserve existing shape
      clinic: { guid: clinic.guid, name: clinic.name, country: clinic.country },
      interventions,
      patient_treatment: [],
    })
  }
  return groups
}

export const TREATMENT_GROUPS = []
CLINICS.forEach(clinic => {
  const count = PRESET.groupsPerClinic[clinic.guid] ?? PRESET.defaultGroups
  TREATMENT_GROUPS.push(...generateTreatmentGroups(clinic, count))
})

// ─── TREATMENTS (per-patient instances, mutable) ──────────────────────────────
// Starts pre-seeded; also grows at runtime via POST handlers.

export const TREATMENTS = []

// ─── INTERVENTIONS (treatment → stimulation playlist) ─────────────────────────
// Legacy map for the 10 original treat-001..treat-010 entries used by
// GET /patient-treatment/interventions handler. Preserved unchanged.

export const INTERVENTIONS = {
  "treat-001": [
    { guid: "iv-001-1", order: 1, stimulation_guid: ORIGINAL_STIMULATIONS[0]?.guid, tes_stimulation: ORIGINAL_STIMULATIONS[0] },
    { guid: "iv-001-2", order: 2, stimulation_guid: ORIGINAL_STIMULATIONS[1]?.guid, tes_stimulation: ORIGINAL_STIMULATIONS[1] },
  ],
  "treat-002": [
    { guid: "iv-002-1", order: 1, stimulation_guid: ORIGINAL_STIMULATIONS[2]?.guid, tes_stimulation: ORIGINAL_STIMULATIONS[2] },
    { guid: "iv-002-2", order: 2, stimulation_guid: ORIGINAL_STIMULATIONS[3]?.guid, tes_stimulation: ORIGINAL_STIMULATIONS[3] },
  ],
  "treat-003": [
    { guid: "iv-003-1", order: 1, stimulation_guid: ORIGINAL_STIMULATIONS[0]?.guid, tes_stimulation: ORIGINAL_STIMULATIONS[0] },
    { guid: "iv-003-2", order: 2, stimulation_guid: ORIGINAL_STIMULATIONS[2]?.guid, tes_stimulation: ORIGINAL_STIMULATIONS[2] },
  ],
  "treat-004": [
    { guid: "iv-004-1", order: 1, stimulation_guid: ORIGINAL_STIMULATIONS[1]?.guid, tes_stimulation: ORIGINAL_STIMULATIONS[1] },
    { guid: "iv-004-2", order: 2, stimulation_guid: ORIGINAL_STIMULATIONS[3]?.guid, tes_stimulation: ORIGINAL_STIMULATIONS[3] },
  ],
  "treat-005": [
    { guid: "iv-005-1", order: 1, stimulation_guid: ORIGINAL_STIMULATIONS[0]?.guid, tes_stimulation: ORIGINAL_STIMULATIONS[0] },
    { guid: "iv-005-2", order: 2, stimulation_guid: ORIGINAL_STIMULATIONS[1]?.guid, tes_stimulation: ORIGINAL_STIMULATIONS[1] },
  ],
}

// ─── PATIENT GENERATOR ────────────────────────────────────────────────────────

let _patientIdCounter = 1
let _treatmentIdCounter = 1

const generatePatients = (clinic) => {
  const count = PRESET.patientsPerClinic[clinic.guid] ?? PRESET.defaultPatients
  const clinicGroups = TREATMENT_GROUPS.filter(g => g.clinic_id === clinic.id)
  const patients = []

  for (let i = 0; i < count; i++) {
    const id = _patientIdCounter++
    const isDisabled = (i % 20 === 19) // ~5%
    const isRealEmail = (i % 4 === 0)
    const name = patientName(i)
    const [firstName, ...lastParts] = name.split(" ")
    const lastName = lastParts.join("")
    const email = isRealEmail
      ? `${firstName.toLowerCase()}.${lastName.toLowerCase()}${i}@gmail.com`
      : `${clinic.signifier}${String(i + 1).padStart(4, "0")}@platoscience.clinic`

    const patient = {
      guid: `pat-${clinic.signifier}-${String(i + 1).padStart(5, "0")}`,
      id,
      name,
      email,
      disabled: isDisabled,
      native: false,
      legacy: false,
      migrated: false,
      createdAt: "2025-01-15T09:00:00.000Z",
      updatedAt: "2025-03-20T14:30:00.000Z",
      clinic_patients: [{
        clinic_id: clinic.guid,   // guid string — preserve existing shape
        clinic: { guid: clinic.guid, name: clinic.name, clinic_clinicians: [] },
      }],
      patient_treatments: [],
      firebase_patients: [{ firebase_uid: `fb-${clinic.signifier}-${i + 1}` }],
      patient_mobile_accesses: [{ credential: `${clinic.signifier}${String(i + 1).padStart(4, "0")}` }],
    }

    // Pre-assign treatments to active (non-disabled) patients
    if (!isDisabled && clinicGroups.length > 0) {
      const slot = i % 10  // 0-1: no treatment, 2-6: one active, 7-9: history + active
      if (slot >= 2) {
        const group = clinicGroups[i % clinicGroups.length]
        const treatId = _treatmentIdCounter++

        if (slot >= 7) {
          // Historical disabled treatment
          const histId = _treatmentIdCounter++
          const oldGroup = clinicGroups[(i + 3) % clinicGroups.length]
          const histTreat = {
            guid: `treat-${clinic.signifier}-hist-${histId}`,
            id: histId,
            disabled: true,
            started_at: "2024-10-01T09:00:00.000Z",
            patient_guid: patient.guid,
            research_treatment: 0,
            is_sham: oldGroup.interventions.some(iv => iv.tes_stimulation?.is_sham),
            allow_update_electric_current: oldGroup.interventions.some(iv => iv.tes_stimulation?.allow_update_electric_current),
            one_session_by_day: false,
            createdAt: "2024-10-01T09:00:00.000Z",
            updatedAt: "2025-01-01T09:00:00.000Z",
            clinic_clinician: { clinic: { guid: clinic.guid, name: clinic.name }, clinician: { email: "demo@platoscience.com" } },
            treatment_group: { name: oldGroup.name },
          }
          patient.patient_treatments.push(histTreat)
          TREATMENTS.push(histTreat)
        }

        // Active treatment
        const activeTreat = {
          guid: `treat-${clinic.signifier}-${String(treatId).padStart(5, "0")}`,
          id: treatId,
          disabled: false,
          started_at: "2025-02-01T09:00:00.000Z",
          patient_guid: patient.guid,
          research_treatment: 0,
          is_sham: group.interventions.some(iv => iv.tes_stimulation?.is_sham),
          allow_update_electric_current: group.interventions.some(iv => iv.tes_stimulation?.allow_update_electric_current),
          one_session_by_day: false,
          createdAt: "2025-02-01T09:00:00.000Z",
          updatedAt: "2025-03-20T14:30:00.000Z",
          clinic_clinician: { clinic: { guid: clinic.guid, name: clinic.name }, clinician: { email: "demo@platoscience.com" } },
          treatment_group: { name: group.name },
        }
        patient.patient_treatments.push(activeTreat)
        TREATMENTS.push(activeTreat)
        group.patient_treatment.push({ patient_guid: patient.guid, treatment_guid: activeTreat.guid })
      }
    }

    patients.push(patient)
  }
  return patients
}

export const PATIENTS = []
CLINICS.forEach(clinic => PATIENTS.push(...generatePatients(clinic)))

// ─── LOOKUP HELPERS ───────────────────────────────────────────────────────────

export const getPatientByGuid = (guid) =>
  PATIENTS.find((p) => p.guid === guid)

export const getTreatmentsByPatientGuid = (patientGuid) =>
  TREATMENTS.filter((t) => t.patient_guid === patientGuid)

export const getInterventionsByTreatmentGuid = (treatmentGuid) =>
  INTERVENTIONS[treatmentGuid] ?? []

export const getClinicStimulationsByClinic = (clinicGuid) =>
  [...ORIGINAL_STIMULATIONS, ...CLINIC_STIMULATIONS].filter(
    (s) => s.original || s.clinic_id === clinicGuid
  )
