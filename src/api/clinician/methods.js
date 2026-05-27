import { ADMIN_PARAM, GUID_PARAM, DISABLED_PARAM } from "../methods";

/**
 * CLINICIAN
 */
const CLINICIAN = "/clinician";

//CLINICS
export const GET_CLINICS = `${CLINICIAN}/clinics`;
export const GET_CLINICS_WITH = (admin = undefined) => {
  if (admin === undefined) {
    return GET_CLINICS;
  }

  if (admin !== undefined) {
    return `${GET_CLINICS_WITH}?${ADMIN_PARAM}`.replace("$admin", admin);
  }
};

//CLINICIANS
export const GET_CLINICIANS = `${CLINICIAN}/clinicians`;

export const DISABLE_CLINICIAN = `${CLINICIAN}/clinician/disable`;
export const ENABLE_CLINICIAN = `${CLINICIAN}/clinician/enable`;
export const UPDATE_CLINICIAN = `${CLINICIAN}/clinician`;
export const ADD_CLINICIAN = `${CLINICIAN}/clinician`;

export const IS_ADMIN = `${CLINICIAN}/is-admin`;

export const GET_CLINICIAN_BY_ADMIN = (guid) => {
  return `${CLINICIAN}/clinician?${GUID_PARAM}`.replace("$guid", guid);
};

//CLINICIAN CLINICS
export const GET_CLINICIAN_CLINICS_BY_ADMIN = (guid, disabled = undefined) => {
  if (disabled === undefined) {
    return `${CLINICIAN}/clinic-clinician?${GUID_PARAM}`.replace("$guid", guid);
  }

  return `${CLINICIAN}/clinic-clinician?${GUID_PARAM}&${DISABLED_PARAM}`
    .replace("$guid", guid)
    .replace("$disabled", disabled);
};

export const ADD_CLINIC_CLINICIAN_RELATIONSHIP = `${CLINICIAN}/clinic-clinician`;
export const ENABLE_CLINIC_CLINICIAN_RELATIONSHIP = `${CLINICIAN}/clinic-clinician/enable`;
export const DISABLE_CLINIC_CLINICIAN_RELATIONSHIP = `${CLINICIAN}/clinic-clinician/disable`;

//MY PATIENTS
export const GET_MY_PATIENT_WITH = (guid) => {
  return `${CLINICIAN}/patient?${GUID_PARAM}`.replace("$guid", guid);
};

export const GET_MY_PATIENTS = `${CLINICIAN}/patients`;
export const GET_MY_PATIENTS_WITH = (disabled = undefined) => {
  if (disabled === undefined) return GET_MY_PATIENTS;
  return `${GET_MY_PATIENTS}?${DISABLED_PARAM}`.replace("$disabled", disabled);
};

export const GET_MY_PATIENTS_PAGINATED = (page, limit, search = undefined) => {
  let url = `${GET_MY_PATIENTS}?page=${page}&limit=${limit}`;
  if (search !== undefined && search.trim() !== '') {
    url += `&search=${encodeURIComponent(search)}`;
  }
  return url;
};

export const DISABLE_MY_PATIENT = `${CLINICIAN}/patient/disable`;
export const ENABLE_MY_PATIENT = `${CLINICIAN}/patient/enable`;
export const UPDATE_MY_PATIENT = `${CLINICIAN}/patient`;
export const ADD_MY_PATIENT = `${CLINICIAN}/patient`;
