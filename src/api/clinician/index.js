import { get, post, put } from "../manager";
import { gateAxios } from "../../pages/Gate/components/Layout/GateGuard";
import * as url from "./methods";

const BASE = import.meta.env.VITE_APP_API_URL;

/**
 * Clinician
 */
const getMyClinics = async () => {
  const resp = await gateAxios.get(`${BASE}/clinician/clinics`);
  return resp.data;
};
const getMyClinicians = () => get(url.GET_CLINICIANS);

const addMyClinician = (data) => post(url.ADD_CLINICIAN, data);
const disableMyClinician = (data) => put(url.DISABLE_CLINICIAN, data);
const enableMyClinician = (data) => put(url.ENABLE_CLINICIAN, data);
const updateMyClinician = (data) => put(url.UPDATE_CLINICIAN, data);
const isClinicianAdmin = () => get(url.IS_ADMIN);
const getClinicianByAdmin = (guid) => get(url.GET_CLINICIAN_BY_ADMIN(guid));

const getClinicianClinicsByAdmin = (data) =>
  get(url.GET_CLINICIAN_CLINICS_BY_ADMIN(data.guid, data.disabled));
const addClinicClinicianByAdmin = (data) =>
  post(url.ADD_CLINIC_CLINICIAN_RELATIONSHIP, data);
const enableClinicClinicianByAdmin = (data) =>
  put(url.ENABLE_CLINIC_CLINICIAN_RELATIONSHIP, data);
const disableClinicClinicianByAdmin = (data) =>
  put(url.DISABLE_CLINIC_CLINICIAN_RELATIONSHIP, data);

// ─── My Patients ─────────────────────────────────────────────────────────────
const getMyPatient = (guid) => get(url.GET_MY_PATIENT_WITH(guid));
const getMyPatients = async (page = undefined, limit = undefined, search = undefined) => {
  let queryUrl = `${BASE}/clinician/patients`;
  if (page !== undefined && limit !== undefined) {
    queryUrl += `?page=${page}&limit=${limit}&asc=false`;
    if (search) queryUrl += `&search=${search}`;
  }
  const resp = await gateAxios.get(queryUrl);
  return resp.data;
};
const addMyPatient = (data) => post(url.ADD_MY_PATIENT, data);
const disableMyPatient = (data) => put(url.DISABLE_MY_PATIENT, data);
const enableMyPatient = (data) => put(url.ENABLE_MY_PATIENT, data);
const updateMyPatient = (data) => put(url.UPDATE_MY_PATIENT, data);

// ─── Patient Stimulations ─────────────────────────────────────────────────────

/**
 * GET active treatment + stimulations for a patient.
 * Returns { treatment, stimulations[] }
 * stimulations[].tes_stimulation.tes_stimulations_tdcs_parameters[].tdcs_parameter
 *   → { anode, cathode, current (µA ÷100=mA), duration (s ÷60=min) }
 */
const getPatientStimulations = async (patientGuid) => {
  const resp = await gateAxios.get(
    `${BASE}/clinician/patient/stimulations?patientGuid=${patientGuid}`
  );
  return resp.data;
};

/**
 * GET all clinic stimulations.
 */
const getClinicStimulations = async (clinic) => {
  const resp = await gateAxios.get(`${BASE}/clinic-stimulations?clinic=${clinic}`);
  return resp.data;
};

/**
 * Add a stimulation to the patient's active treatment.
 * Body: { treatmentGuid, stimulationGuid }
 */
const addPatientStimulation = async (data) => {
  const resp = await gateAxios.post(`${BASE}/clinician/patient/stimulations`, data);
  return resp.data;
};

/**
 * Update stimulation properties (disabled, slider).
 * Body: { guid, ...values }
 */
const updatePatientStimulation = async (guid, values) => {
  const resp = await gateAxios.put(`${BASE}/clinician/patient/stimulations/status`, {
    guid,
    ...values,
  });
  return resp.data;
};

/**
 * Hard-remove a stimulation intervention from a treatment.
 * Query: ?guid=<intervention_guid>
 */
const removePatientStimulation = async (guid) => {
  const resp = await gateAxios.delete(
    `${BASE}/clinician/patient/stimulations?guid=${guid}`
  );
  return resp.data;
};

/**
 * Create a new patient treatment.
 * Body: { patient, clinic, stimulations, is_sham, allow_update_electric_current, sessions_by_day }
 * Returns the created treatment object (with .guid).
 */
const createPatientTreatment = async (data) => {
  const resp = await gateAxios.post(`${BASE}/patient-treatment`, data);
  return resp.data;
};

export {
  isClinicianAdmin,
  getMyClinics,
  getMyClinicians,
  addMyClinician,
  disableMyClinician,
  enableMyClinician,
  updateMyClinician,
  getClinicianByAdmin,
  getClinicianClinicsByAdmin,
  addClinicClinicianByAdmin,
  disableClinicClinicianByAdmin,
  enableClinicClinicianByAdmin,

  // My patients
  getMyPatient,
  getMyPatients,
  addMyPatient,
  disableMyPatient,
  enableMyPatient,
  updateMyPatient,

  // Patient stimulations (active treatment)
  getClinicStimulations,
  getPatientStimulations,
  addPatientStimulation,
  updatePatientStimulation,
  removePatientStimulation,
  createPatientTreatment,
};
