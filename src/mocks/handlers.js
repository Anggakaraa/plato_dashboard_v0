import { http, HttpResponse } from "msw";
import {
  CLINICS,
  CLINICIANS,
  ORIGINAL_STIMULATIONS,
  CLINIC_STIMULATIONS,
  PATIENTS,
  TREATMENTS,
  TREATMENT_GROUPS,
  INTERVENTIONS,
} from "./data";

const API = import.meta.env.VITE_APP_API_URL;         // http://localhost:3000
const GW  = import.meta.env.VITE_APP_GATEWAY_URL;     // http://localhost:3002

// ─── In-memory stores (survive page nav, reset on dev server restart) ─────────
let patients = [...PATIENTS];
let clinics = [...CLINICS];
let clinicians = [...CLINICIANS];
let originalStims = [...ORIGINAL_STIMULATIONS];
let clinicStims = [...CLINIC_STIMULATIONS];
// Starts empty — populated via POST /add-patient-treatment-group
let treatments = [...TREATMENTS];
// Mutable interventions map: treatmentGuid → intervention[]
let interventions = Object.fromEntries(
  Object.entries(INTERVENTIONS).map(([k, v]) => [k, [...v]])
);
// Treatment groups with mutable patient_treatment array so assignments persist
// during the session and pre-select correctly when revisiting a detail page.
let treatmentGroups = TREATMENT_GROUPS.map((g) => ({ ...g, patient_treatment: [] }));
let nextPatientId = patients.length + 1;

// ─── Helpers ──────────────────────────────────────────────────────────────────
const ok = (data) => HttpResponse.json(data);
const notFound = () => new HttpResponse(null, { status: 404 });
const success = () => ok({ success: true });

const paginate = (items, page = 1, limit = 10) => {
  const total = items.length;
  const data = items.slice((page - 1) * limit, page * limit);
  return { data, pagination: { total, page: Number(page), limit: Number(limit), pages: Math.ceil(total / limit) } };
};

// Build the clinician_clinics format the app expects:
// each item = clinic object with embedded clinic_clinicians array
const buildClinicianClinics = (clinicianGuid) => {
  const clinician = clinicians.find((c) => c.guid === clinicianGuid);
  if (!clinician) return [];
  return clinician.clinic_clinicians.map((rel) => {
    const clinic = clinics.find((c) => c.guid === rel.clinic_id) || {};
    return {
      ...clinic,
      clinic_clinicians: [{
        guid: rel.guid,
        clinic_id: rel.clinic_id,
        clinician_id: rel.clinician_id,
        admin: rel.admin,
        disabled: rel.disabled,
      }],
    };
  });
};

export const handlers = [

  // ── AUTH ─────────────────────────────────────────────────────────────────
  // Real fake JWT so decodeToken(token.split('.')[1] |> atob |> JSON.parse) works
  // Payload: { user: { type: "plato-admin", username: "Demo Admin" }, exp: 9999999999 }
  http.post(`${API}/sign-in`, () =>
    ok({
      token: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjp7InR5cGUiOiJwbGF0by1hZG1pbiIsInVzZXJuYW1lIjoiRGVtbyBBZG1pbiJ9LCJleHAiOjk5OTk5OTk5OTl9.fakeSignature",
      user: { type: "plato-admin", username: "Demo Admin" },
      firstAccess: false,
    })
  ),

  // ── CLINICS ──────────────────────────────────────────────────────────────
  http.get(`${API}/plato/clinics`, () => ok(clinics)),

  // Single clinic by guid: GET /plato/clinic?guid=clinic-001
  http.get(`${API}/plato/clinic`, ({ request }) => {
    const guid = new URL(request.url).searchParams.get("guid");
    const clinic = clinics.find((c) => c.guid === guid);
    return clinic ? ok(clinic) : notFound();
  }),

  http.post(`${API}/plato/clinic`, async ({ request }) => {
    const body = await request.json();
    const newClinic = { ...body, guid: `clinic-${Date.now()}`, id: Date.now(), disabled: false, signifier_count: 0, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() };
    clinics.push(newClinic);
    return ok(newClinic);
  }),

  http.put(`${API}/plato/clinic`, async ({ request }) => {
    const body = await request.json();
    const idx = clinics.findIndex((c) => c.guid === body.guid);
    if (idx !== -1) clinics[idx] = { ...clinics[idx], ...body, updatedAt: new Date().toISOString() };
    return success();
  }),

  http.put(`${API}/plato/clinic/disable`, async ({ request }) => {
    const { guid } = await request.json();
    const c = clinics.find((c) => c.guid === guid);
    if (c) c.disabled = true;
    return success();
  }),

  http.put(`${API}/plato/clinic/enable`, async ({ request }) => {
    const { guid } = await request.json();
    const c = clinics.find((c) => c.guid === guid);
    if (c) c.disabled = false;
    return success();
  }),

  // ── USERS (Plato admins) ──────────────────────────────────────────────────
  http.get(`${API}/plato/plato-users`, () =>
    ok([{ guid: "admin-001", id: 1, name: "Demo Admin", email: "admin@platoscience.com", disabled: false, type: "plato-admin", user_type: { id: 1, type: "plato-admin" }, createdAt: "2024-01-01T00:00:00.000Z", updatedAt: "2024-01-01T00:00:00.000Z" }])
  ),

  http.get(`${API}/plato/users`, () =>
    ok([{ guid: "admin-001", id: 1, name: "Demo Admin", email: "admin@platoscience.com", disabled: false, type: "plato-admin", user_type: { id: 1, type: "plato-admin" }, createdAt: "2024-01-01T00:00:00.000Z", updatedAt: "2024-01-01T00:00:00.000Z" }])
  ),

  http.post(`${API}/plato/plato-user`, async ({ request }) => {
    const body = await request.json();
    return ok({ ...body, guid: `admin-${Date.now()}`, disabled: false });
  }),

  http.put(`${API}/plato/plato-user`, async ({ request }) => success()),
  http.put(`${API}/plato/plato-user/disable`, async ({ request }) => success()),
  http.put(`${API}/plato/plato-user/enable`, async ({ request }) => success()),

  http.get(`${API}/plato/user-types`, () =>
    ok([{ id: 1, type: "plato-admin" }, { id: 2, type: "clinic-admin" }, { id: 3, type: "clinician" }])
  ),

  // ── CLINICIANS (plato-admin view) ─────────────────────────────────────────
  http.get(`${API}/plato/clinicians`, () => ok(clinicians)),

  // Clinicians filtered by clinic: GET /plato/clinicians/clinic?guid=clinic-001
  http.get(`${API}/plato/clinicians/clinic`, ({ request }) => {
    const clinicGuid = new URL(request.url).searchParams.get("guid");
    const filtered = clinicians.filter((c) =>
      c.clinic_clinicians.some((rel) => rel.clinic_id === clinicGuid)
    );
    return ok(filtered);
  }),

  // Single clinician by guid: GET /plato/clinician?guid=cln-001
  http.get(`${API}/plato/clinician`, ({ request }) => {
    const guid = new URL(request.url).searchParams.get("guid");
    // Avoid matching /plato/clinician/clinics
    const path = new URL(request.url).pathname;
    if (path.includes("/clinics")) return; // let the clinics handler below handle it
    const clinician = clinicians.find((c) => c.guid === guid);
    return clinician ? ok(clinician) : notFound();
  }),

  // Clinician's clinic relationships: GET /plato/clinician/clinics?guid=cln-001
  // Returns array of clinic objects with embedded clinic_clinicians
  http.get(`${API}/plato/clinician/clinics`, ({ request }) => {
    const guid = new URL(request.url).searchParams.get("guid");
    return ok(buildClinicianClinics(guid));
  }),

  http.post(`${API}/plato/clinician`, async ({ request }) => {
    const body = await request.json();
    const newClinician = { ...body, guid: `cln-${Date.now()}`, id: Date.now(), disabled: false, clinic_clinicians: [], createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() };
    clinicians.push(newClinician);
    return ok(newClinician);
  }),

  http.put(`${API}/plato/clinician`, async ({ request }) => success()),
  http.put(`${API}/plato/clinician/disable`, async ({ request }) => success()),
  http.put(`${API}/plato/clinician/enable`, async ({ request }) => success()),

  // Clinic-clinician relationships (admin management)
  http.post(`${API}/plato/clinic-clinician`, async ({ request }) => {
    const body = await request.json();
    return ok([{ guid: `cc-${Date.now()}`, ...body, disabled: false }]);
  }),
  http.put(`${API}/plato/clinic-clinician/admin`, async ({ request }) => success()),
  http.put(`${API}/plato/clinic-clinician/no-admin`, async ({ request }) => success()),
  http.put(`${API}/plato/clinic-clinician/enable`, async ({ request }) => success()),
  http.put(`${API}/plato/clinic-clinician/disable`, async ({ request }) => success()),

  // ── CLINICIAN API (clinician user type — /clinician/* routes) ─────────────
  // These are called when user type is "clinician" rather than "plato-admin"
  http.get(`${API}/clinician/clinics`, () => ok(clinics)),
  http.get(`${API}/clinician/is-admin`, () => ok({ success: false })),
  http.get(`${API}/clinician/clinicians`, () => ok(clinicians)),

  http.get(`${API}/clinician/clinician`, ({ request }) => {
    const guid = new URL(request.url).searchParams.get("guid");
    const c = clinicians.find((c) => c.guid === guid);
    return c ? ok(c) : notFound();
  }),

  http.get(`${API}/clinician/clinic-clinician`, ({ request }) => {
    const guid = new URL(request.url).searchParams.get("guid");
    return ok(buildClinicianClinics(guid));
  }),

  // My patients (clinician view)
  http.get(`${API}/clinician/patients`, ({ request }) => {
    const url = new URL(request.url);
    const page = url.searchParams.get("page");
    const limit = url.searchParams.get("limit");
    if (page && limit) return ok(paginate(patients, Number(page), Number(limit)));
    return ok(patients);
  }),

  http.get(`${API}/clinician/patient`, ({ request }) => {
    const guid = new URL(request.url).searchParams.get("guid");
    const p = patients.find((p) => p.guid === guid);
    return p ? ok(p) : notFound();
  }),

  http.post(`${API}/clinician/patient`, async ({ request }) => {
    const body = await request.json();
    const newPatient = { ...body, guid: `pat-${Date.now()}`, id: nextPatientId++, disabled: false, clinic_patients: [], patient_treatments: [], firebase_patients: [], patient_mobile_accesses: [{ credential: "123456" }], createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() };
    patients.push(newPatient);
    return ok(newPatient);
  }),

  http.put(`${API}/clinician/patient`, async ({ request }) => success()),
  http.put(`${API}/clinician/patient/disable`, async ({ request }) => success()),
  http.put(`${API}/clinician/patient/enable`, async ({ request }) => success()),

  // ── PATIENTS (plato-admin view) ───────────────────────────────────────────
  http.get(`${API}/plato/patients`, ({ request }) => {
    const url = new URL(request.url);
    const page = url.searchParams.get("page");
    const limit = url.searchParams.get("limit");
    const search = url.searchParams.get("search") || "";
    const clinicGuid = url.searchParams.get("clinic_guid") || "";
    let results = patients;
    // Filter by clinic if requested
    if (clinicGuid) {
      results = results.filter((p) =>
        p.clinic_patients?.some((cp) => cp.clinic_id === clinicGuid)
      );
    }
    // Text search
    if (search) {
      const q = search.toLowerCase();
      results = results.filter((p) => {
        const clinicName = p.clinic_patients?.[0]?.clinic?.name?.toLowerCase() ?? "";
        return (
          p.name.toLowerCase().includes(q) ||
          p.email.toLowerCase().includes(q) ||
          clinicName.includes(q)
        );
      });
    }
    if (page !== null && limit !== null) return ok(paginate(results, Number(page), Number(limit)));
    return ok(results);
  }),

  http.get(`${API}/plato/patient`, ({ request }) => {
    const guid = new URL(request.url).searchParams.get("guid");
    const p = patients.find((p) => p.guid === guid);
    return p ? ok(p) : notFound();
  }),

  http.post(`${API}/plato/patient`, async ({ request }) => {
    const body = await request.json();
    const clinic = clinics.find((c) => c.guid === body.clinic);
    const clinicLink = clinic
      ? [{ clinic_id: clinic.guid, clinic: { guid: clinic.guid, name: clinic.name, clinic_clinicians: [] } }]
      : [];

    // ── Bulk "Default" patient creation (Add Default Patient modal) ──────────
    // Payload shape: { totalPatient, clinic, type: "custom", signifier }
    if (body.type === "custom" || body.totalPatient) {
      const total = parseInt(body.totalPatient) || 1;
      const sig = body.signifier || clinic?.signifier || "pat";
      // Start counter from current signifier_count + 1
      let startCount = (clinic?.signifier_count ?? 0) + 1;
      const created = [];
      for (let i = 0; i < total; i++) {
        const counter = String(startCount + i).padStart(3, "0");
        const email = `${sig}${counter}@platoscience.clinic`;
        const name = `${sig.toUpperCase()} ${counter}`;
        const newPat = {
          guid: `pat-${Date.now()}-${i}`, id: nextPatientId++,
          name, email,
          disabled: false, native: false, legacy: false, migrated: false,
          createdAt: new Date().toISOString(), updatedAt: new Date().toISOString(),
          clinic_patients: clinicLink,
          patient_treatments: [],
          firebase_patients: [{ firebase_uid: `firebase-default-${Date.now()}-${i}` }],
          patient_mobile_accesses: [{ credential: "123456" }],
        };
        patients.push(newPat);
        created.push(newPat);
      }
      // Update the clinic's signifier_count so next batch continues from here
      if (clinic) clinic.signifier_count = (clinic.signifier_count ?? 0) + total;
      return ok(created);
    }

    // ── Single regular patient creation (Add Patient modal / Clinic Detail) ──
    const newPatient = {
      guid: `pat-${Date.now()}`, id: nextPatientId++,
      name: body.name, email: body.email,
      disabled: false, native: false, legacy: false, migrated: false,
      createdAt: new Date().toISOString(), updatedAt: new Date().toISOString(),
      clinic_patients: clinicLink,
      patient_treatments: [],
      firebase_patients: [{ firebase_uid: `firebase-new-${Date.now()}` }],
      patient_mobile_accesses: [{ credential: "123456" }],
    };
    patients.push(newPatient);
    return ok(newPatient);
  }),

  http.put(`${API}/plato/patient`, async ({ request }) => {
    const body = await request.json();
    const idx = patients.findIndex((p) => p.guid === body.guid);
    if (idx !== -1) patients[idx] = { ...patients[idx], ...body, updatedAt: new Date().toISOString() };
    return success();
  }),

  http.put(`${API}/plato/patient/disable`, async ({ request }) => {
    const { guid } = await request.json();
    const p = patients.find((p) => p.guid === guid);
    if (p) p.disabled = true;
    return success();
  }),

  http.put(`${API}/plato/patient/enable`, async ({ request }) => {
    const { guid } = await request.json();
    const p = patients.find((p) => p.guid === guid);
    if (p) p.disabled = false;
    return success();
  }),

  // ── STIMULATIONS ──────────────────────────────────────────────────────────
  http.get(`${API}/plato/stimulations`, () =>
    ok({ original: originalStims, clinic: clinicStims })
  ),

  http.get(`${API}/plato/stimulation`, ({ request }) => {
    const guid = new URL(request.url).searchParams.get("guid");
    const s = [...originalStims, ...clinicStims].find((s) => s.guid === guid);
    return s ? ok(s) : notFound();
  }),

  http.post(`${API}/plato/stimulation`, async ({ request }) => {
    const body = await request.json();
    // The form submits body.stimulation: { anode, cathode, current, duration }.
    // The treatment creation UI reads tes_stimulations_tdcs_parameters[0].tdcs_parameter,
    // so we transform into that shape here.
    const newStim = {
      ...body,
      guid: `stim-${Date.now()}`,
      id: Date.now(),
      original: true,
      disabled: false,
      intervention_treatment_tes: 0,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      tes_stimulations_tdcs_parameters: body.stimulation
        ? [{ tdcs_parameter: {
            anode:    body.stimulation.anode    ?? "L",
            cathode:  body.stimulation.cathode  ?? "R",
            current:  body.stimulation.current  ?? 0,
            duration: body.stimulation.duration ?? 0,
          }}]
        : [],
    };
    originalStims.push(newStim);
    return ok(newStim);
  }),

  http.put(`${API}/plato/stimulation`, async ({ request }) => {
    const body = await request.json();
    const idx = originalStims.findIndex((s) => s.guid === body.guid);
    if (idx !== -1) originalStims[idx] = { ...originalStims[idx], ...body };
    return success();
  }),

  http.put(`${API}/plato/stimulation/disable`, async ({ request }) => {
    const { guid } = await request.json();
    const s = [...originalStims, ...clinicStims].find((s) => s.guid === guid);
    if (s) s.disabled = true;
    return success();
  }),

  http.put(`${API}/plato/stimulation/enable`, async ({ request }) => {
    const { guid } = await request.json();
    const s = [...originalStims, ...clinicStims].find((s) => s.guid === guid);
    if (s) s.disabled = false;
    return success();
  }),

  // ── CLINIC STIMULATIONS ───────────────────────────────────────────────────
  http.get(`${API}/clinic-stimulations`, ({ request }) => {
    const clinicGuid = new URL(request.url).searchParams.get("clinic");
    return ok({
      original: originalStims,
      clinic: clinicGuid ? clinicStims.filter((s) => s.clinic_id === clinicGuid) : clinicStims,
    });
  }),

  http.get(`${API}/clinic-stimulation`, ({ request }) => {
    const guid = new URL(request.url).searchParams.get("guid");
    const s = clinicStims.find((s) => s.guid === guid);
    return s ? ok(s) : notFound();
  }),

  http.post(`${API}/clinic-stimulation`, async ({ request }) => {
    const body = await request.json();
    const newStim = { ...body, guid: `stim-${Date.now()}`, id: Date.now(), original: false, disabled: false, intervention_treatment_tes: 0, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() };
    clinicStims.push(newStim);
    return ok(newStim);
  }),

  http.put(`${API}/clinic-stimulation`, async ({ request }) => {
    const body = await request.json();
    const idx = clinicStims.findIndex((s) => s.guid === body.guid);
    if (idx !== -1) clinicStims[idx] = { ...clinicStims[idx], ...body };
    return success();
  }),

  http.put(`${API}/clinic-stimulation/disable`, async ({ request }) => {
    const { guid } = await request.json();
    const s = clinicStims.find((s) => s.guid === guid);
    if (s) s.disabled = true;
    return success();
  }),

  http.put(`${API}/clinic-stimulation/enable`, async ({ request }) => {
    const { guid } = await request.json();
    const s = clinicStims.find((s) => s.guid === guid);
    if (s) s.disabled = false;
    return success();
  }),

  // ── PATIENT TREATMENTS ────────────────────────────────────────────────────
  http.get(`${API}/patient-treatments`, ({ request }) => {
    const patientGuid = new URL(request.url).searchParams.get("guid");
    return ok(treatments.filter((t) => t.patient_guid === patientGuid));
  }),

  http.post(`${API}/patient-treatment`, async ({ request }) => {
    const body = await request.json();

    // If body.treatment.name is provided (from the "new treatment" wizard),
    // also create a treatment GROUP so it appears in /treatments-by-steps list.
    if (body.treatment?.name) {
      const clinic = clinics.find((c) => c.guid === body.clinic);
      const alreadyExists = treatmentGroups.some(
        (g) => g.name === body.treatment.name && g.clinic?.guid === body.clinic
      );
      if (!alreadyExists) {
        treatmentGroups.push({
          guid: `tg-${Date.now()}`,
          id: Date.now(),
          name: body.treatment.name,
          description: body.treatment.details ?? "",
          clinic_id: clinic?.id ?? null,
          clinic: clinic
            ? { guid: clinic.guid, name: clinic.name, country: clinic.country ?? "" }
            : null,
          interventions: [],
          patient_treatment: [],
        });
      }
    }

    const newTreatment = {
      guid: `treat-${Date.now()}`,
      id: Date.now(),
      name: body.treatment?.name ?? null,
      disabled: false,
      started_at: null,
      patient_guid: body.patient,
      research_treatment: body.research_treatment ?? 0,
      is_sham: Array.isArray(body.is_sham) ? false : !!body.is_sham,
      allow_update_electric_current: !!body.allow_update_electric_current,
      one_session_by_day: body.sessions_by_day === 1,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      clinic_clinician: {
        clinic: clinics.find((c) => c.guid === body.clinic)
          ? { guid: body.clinic, name: clinics.find((c) => c.guid === body.clinic).name }
          : { guid: body.clinic, name: body.clinic },
        clinician: { email: clinicians.find((c) => c.guid === body.clinician)?.email ?? body.clinician },
      },
    };

    // Disable previous treatments for this patient
    treatments.forEach((t) => { if (t.patient_guid === body.patient && !t.disabled) t.disabled = true; });
    treatments.push(newTreatment);

    // Keep patient.patient_treatments in sync
    const patient = patients.find((p) => p.guid === body.patient);
    if (patient) {
      patient.patient_treatments.forEach((t) => { t.disabled = true; });
      patient.patient_treatments.push({ guid: newTreatment.guid, disabled: false, started_at: null });
    }
    return ok(newTreatment);
  }),

  http.put(`${API}/patient-treatment/disable`, async ({ request }) => {
    const { guid } = await request.json();
    const t = treatments.find((t) => t.guid === guid);
    if (t) t.disabled = true;
    return success();
  }),

  http.put(`${API}/patient-treatment/enable`, async ({ request }) => {
    const { guid } = await request.json();
    const t = treatments.find((t) => t.guid === guid);
    if (t) t.disabled = false;
    return success();
  }),

  http.put(`${API}/patient-treatment/start`, async ({ request }) => {
    const { guid } = await request.json();
    const t = treatments.find((t) => t.guid === guid);
    if (t) t.started_at = new Date().toISOString();
    return ok({ guid, started_at: new Date().toISOString(), disabled: false });
  }),

  http.put(`${API}/patient-treatment/end`, async ({ request }) => {
    const { guid } = await request.json();
    const t = treatments.find((t) => t.guid === guid);
    if (t) { t.started_at = null; t.disabled = true; }
    return ok({ guid, started_at: null, disabled: true });
  }),

  // ── INTERVENTIONS (stimulation playlist per treatment) ────────────────────
  http.get(`${API}/patient-treatment/interventions`, ({ request }) => {
    const treatmentGuid = new URL(request.url).searchParams.get("guid");
    return ok(interventions[treatmentGuid] ?? []);
  }),

  http.post(`${API}/patient-treatment/interventions`, async ({ request }) => {
    const body = await request.json();
    // body: [{ treatment_id, stimulation_id }] — find the stim and append
    const entries = Array.isArray(body) ? body : [body];
    const treatmentGuid = entries.length > 0
      ? treatments.find((t) => t.id === entries[0].treatment_id)?.guid
      : null;
    if (treatmentGuid) {
      if (!interventions[treatmentGuid]) interventions[treatmentGuid] = [];
      entries.forEach((entry) => {
        const stim = [...originalStims, ...clinicStims].find((s) => s.id === entry.stimulation_id);
        if (stim) {
          interventions[treatmentGuid].push({
            guid: `iv-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
            order: interventions[treatmentGuid].length + 1,
            stimulation_guid: stim.guid,
            tes_stimulation: stim,
            confirmed: true,
          });
        }
      });
    }
    return ok(interventions[treatmentGuid] ?? []);
  }),

  http.delete(`${API}/patient-treatment/interventions`, ({ request }) => {
    const ivGuid = new URL(request.url).searchParams.get("guid");
    for (const key of Object.keys(interventions)) {
      interventions[key] = interventions[key].filter((iv) => iv.guid !== ivGuid);
    }
    return success();
  }),

  // Update treatment group name/description/stimulations (protocol-only save)
  http.post(`${API}/treatments-group/update`, async ({ request }) => {
    const body = await request.json();
    const idx = treatmentGroups.findIndex((g) => g.guid === body.guid);
    if (idx !== -1) {
      if (body.name) treatmentGroups[idx].name = body.name;
      if (body.description !== undefined) treatmentGroups[idx].description = body.description;
    }
    return success();
  }),

  // ── COUNTRIES ─────────────────────────────────────────────────────────────
  http.get(`${API}/plato/countries`, () =>
    ok([{ guid: "country-001", name: "Australia", code: "AU", disabled: false }])
  ),
  http.get(`${API}/plato/countries/available`, () =>
    ok([{ guid: "country-001", name: "Australia", code: "AU" }])
  ),
  http.post(`${API}/plato/country`, async ({ request }) => {
    const body = await request.json();
    return ok({ ...body, guid: `country-${Date.now()}` });
  }),

  // ── TREATMENT GROUPS (treatment templates / protocols) ───────────────────
  // List view — /treatments-by-steps. clinic_id is integer (matches clinic.id).
  http.get(`${API}/treatments-group`, () =>
    ok(treatmentGroups.map(({ guid, name, description, clinic_id }) => ({
      guid, name, description, clinic_id,
    })))
  ),

  // Plural path with guid param (some pages call this)
  http.get(`${API}/treatments-group/:guid`, ({ params }) => {
    const g = treatmentGroups.find((g) => g.guid === params.guid);
    return g ? ok(g) : notFound();
  }),

  http.post(`${API}/treatments-group`, async ({ request }) => {
    const body = await request.json();
    const newGroup = {
      ...body,
      guid: `tg-${Date.now()}`,
      id: Date.now(),
      interventions: [],
      patient_treatment: [],
    };
    treatmentGroups.push(newGroup);
    return ok(newGroup);
  }),

  // Single treatment group by guid — used by Treatment-Details.jsx.
  // Must include embedded `clinic` object (getTreatmentsDetails calls data.clinic.guid),
  // `interventions` array, and `patient_treatment` array (for pre-selecting patients).
  http.get(`${API}/treatment-group`, ({ request }) => {
    const guid = new URL(request.url).searchParams.get("guid");
    const g = treatmentGroups.find((g) => g.guid === guid);
    return g ? ok(g) : notFound();
  }),

  // Assign a patient to a treatment group.
  // body: { patient: <int id>, clinic: <guid>, clinician: <guid>,
  //         stimulations: [<guid>,...], treatment: <tg-guid>,
  //         is_sham, allow_update_electric_current, sessions_by_day }
  // Creates a real treatment entry so it shows on /patient/:guid.
  http.post(`${API}/add-patient-treatment-group`, async ({ request }) => {
    const body = await request.json();

    // Resolve entities
    const patient   = patients.find((p) => p.id === body.patient);
    const clinic    = clinics.find((c) => c.guid === body.clinic);
    const clinician = clinicians.find((c) => c.guid === body.clinician);
    const tgIdx     = treatmentGroups.findIndex((g) => g.guid === body.treatment);

    if (!patient || tgIdx === -1) return ok({ success: false, error: "patient or treatment group not found" });

    // Build the treatment entry (shape expected by patient-treatment-item-list.jsx)
    const newTreatment = {
      guid: `treat-${Date.now()}`,
      id: Date.now(),
      name: treatmentGroups[tgIdx].name,   // treatment group name — shown on patient detail
      disabled: false,
      started_at: null,
      patient_guid: patient.guid,
      research_treatment: body.research_treatment ?? 0,
      is_sham: Array.isArray(body.is_sham) ? false : !!body.is_sham,
      allow_update_electric_current: !!body.allow_update_electric_current,
      one_session_by_day: body.sessions_by_day === 1,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      clinic_clinician: {
        clinic:    { guid: clinic?.guid ?? body.clinic, name: clinic?.name ?? body.clinic },
        clinician: { email: clinician?.email ?? body.clinician },
      },
    };

    // Disable previous active treatments for this patient
    treatments.forEach((t) => { if (t.patient_guid === patient.guid && !t.disabled) t.disabled = true; });
    treatments.push(newTreatment);

    // Keep patient.patient_treatments in sync (used by patient detail page)
    patient.patient_treatments.forEach((t) => { t.disabled = true; });
    patient.patient_treatments.push({ guid: newTreatment.guid, disabled: false, started_at: null });

    // Track assignment in the treatment group so revisiting the detail page
    // pre-selects this patient (preSelectPatients checks patient_id).
    const alreadyAssigned = treatmentGroups[tgIdx].patient_treatment.some((pt) => pt.patient_id === body.patient);
    if (!alreadyAssigned) {
      treatmentGroups[tgIdx].patient_treatment.push({
        patient_id: body.patient,           // integer — matched by preSelectPatients
        patient_guid: patient.guid,
        treatment_guid: newTreatment.guid,
        sessions_by_day: body.sessions_by_day ?? 0,
        research_treatment: body.research_treatment ?? 0,
      });
    }

    return ok({ success: true, ...newTreatment });
  }),

  // Bulk-assign a treatment protocol to multiple patients at once.
  // Body: { treatment_group_guid: string, patient_guids: string[] }
  http.post(`${API}/bulk-assign-treatment`, async ({ request }) => {
    const body = await request.json();
    const { treatment_group_guid, patient_guids } = body;

    const tgIdx = treatmentGroups.findIndex((g) => g.guid === treatment_group_guid);
    if (tgIdx === -1) return ok({ success: false, error: "treatment group not found" });

    const results = [];
    for (const patientGuid of patient_guids) {
      const patient = patients.find((p) => p.guid === patientGuid);
      if (!patient) continue;

      // Disable previous active treatments for this patient
      treatments.forEach((t) => { if (t.patient_guid === patientGuid && !t.disabled) t.disabled = true; });
      patient.patient_treatments.forEach((t) => { t.disabled = true; });

      const newTreatment = {
        guid: `treat-${Date.now()}-${patientGuid}`,
        id: Date.now(),
        name: treatmentGroups[tgIdx].name,
        disabled: false,
        started_at: null,
        patient_guid: patientGuid,
        research_treatment: 0,
        is_sham: false,
        allow_update_electric_current: false,
        one_session_by_day: false,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        clinic_clinician: {
          clinic:    treatmentGroups[tgIdx].clinic ?? { guid: "", name: "" },
          clinician: { email: "" },
        },
      };

      treatments.push(newTreatment);
      patient.patient_treatments.push({ guid: newTreatment.guid, name: newTreatment.name, disabled: false, started_at: null });

      const alreadyAssigned = treatmentGroups[tgIdx].patient_treatment.some((pt) => pt.patient_guid === patientGuid);
      if (!alreadyAssigned) {
        treatmentGroups[tgIdx].patient_treatment.push({
          patient_id: patient.id,
          patient_guid: patientGuid,
          treatment_guid: newTreatment.guid,
          sessions_by_day: 0,
          research_treatment: 0,
        });
      }

      results.push(newTreatment.guid);
    }

    return ok({ success: true, assigned: results.length, treatment_guids: results });
  }),

  // Remove a patient from a treatment group.
  // Query params: ?patient=<int>&treatment=<int id of group>
  http.delete(`${API}/remove-patient-treatment-group`, ({ request }) => {
    const url = new URL(request.url);
    const patientId  = Number.parseInt(url.searchParams.get("patient"), 10);
    const treatmentIntId = Number.parseInt(url.searchParams.get("treatment"), 10);

    const patient = patients.find((p) => p.id === patientId);
    const tgIdx   = treatmentGroups.findIndex((g) => g.id === treatmentIntId);

    if (patient) {
      // Disable the active treatment for this patient
      const activeTreat = treatments.find((t) => t.patient_guid === patient.guid && !t.disabled);
      if (activeTreat) activeTreat.disabled = true;
      patient.patient_treatments.forEach((t) => { t.disabled = true; });
    }

    if (tgIdx !== -1) {
      treatmentGroups[tgIdx].patient_treatment = treatmentGroups[tgIdx].patient_treatment
        .filter((pt) => pt.patient_id !== patientId);
    }

    return success();
  }),

  // ── CLINIC SIGNIFIER CHECK ────────────────────────────────────────────────
  http.get(`${API}/plato/clinic/signifier`, () => ok(null)), // null = signifier is available

  // ── GATEWAY (BigQuery / Reports) — return empty data to avoid console errors ─
  http.get(`${GW}/bigquery/reports/count/:guid`, () => ok({ count: 0 })),
  http.get(`${GW}/bigquery/reports/:guid`, () => ok([])),
  http.get(`${GW}/bigquery/realtime/sessions`, () => ok([])),
  http.get(`${GW}/bigquery/load/datachart`, () => ok([])),

  // ── GATEWAY: Clinic patients summary page ─────────────────────────────────
  // GET /patients/from-clinic/:clinicId — used by /clinics/patients/summary/:id
  http.get(`${GW}/patients/from-clinic/:clinicId`, ({ params }) => {
    const { clinicId } = params;
    const clinic = clinics.find((c) => c.guid === clinicId);
    const clinicPatients = patients.filter((p) =>
      p.clinic_patients?.some((cp) => cp.clinic_id === clinicId)
    );
    return ok(
      clinicPatients.map((p) => ({
        id: p.id,
        name: p.name,
        email: p.email,
        firebaseId: p.firebase_patients?.[0]?.firebase_uid ?? null,
        clinic: clinic?.name ?? clinicId,
        disabled: p.disabled,
        createdAt: p.createdAt,
      }))
    );
  }),

  // GET /patients/from-patient/:firebaseId — patient classification detail
  http.get(`${GW}/patients/from-patient/:firebaseId`, () => ok([])),
];
