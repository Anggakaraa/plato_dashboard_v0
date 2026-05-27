import { get, post, put } from "../manager";
import * as url from "./methods";
import { getEventSource, getExternal } from '../managerExternal'

//Clinics
const getClinics = (disabled = undefined) =>
  get(url.GET_CLINICS_WITH(disabled));
const addClinic = (data) => post(url.ADD_CLINIC, data);
const disableClinic = (data) => put(url.DISABLE_CLINIC, data);
const enableClinic = (data) => put(url.ENABLE_CLINIC, data);
const updateClinic = (data) => put(url.UPDATE_CLINIC, data);

//User Types
const getUserTypes = () => get(url.GET_USER_TYPES);

//Users
const getUsers = (disabled = undefined) => get(url.GET_USERS_WITH(disabled));
const addUser = (data) => post(url.ADD_USER, data);
const disableUser = (data) => put(url.DISABLE_USER, data);
const enableUser = (data) => put(url.ENABLE_USER, data);
const updateUser = (data) => put(url.UPDATE_USER, data);

//Countries
const getCountries = (disabled = undefined) => get(url.GET_ALL_COUNTRIES);
const getAvailableCountries = (disabled = undefined) => get(url.GET_ALL_AVAILABLE_COUNTRIES);
const addCountry = (data) => post(url.ADD_COUNTRY, data);
//const disableCountry = (data) => put(url.DISABLE_USER, data);
//const enableCountry = (data) => put(url.ENABLE_USER, data);
//const updateCountry = (data) => put(url.UPDATE_USER, data);

//Reports
const getCountUserReports = (guid) => getExternal(`/bigquery/reports/count/${guid}`);
const getUserReports = (guid) => getExternal(`/bigquery/reports/${guid}`);
const getLiveEvents = () => getEventSource('/notifications/sse/subscribe/plato/sessions')
const getLiveEventsList = (guid) => getExternal(`/bigquery/realtime/sessions`);
const getSessionReports = () => getExternal(`/bigquery/load/datachart`);

//PlatoUsers
const getPlatoUsers = (disabled = undefined) =>
  get(url.GET_PLATO_USERS_WITH(disabled));
const addPlatoUser = (data) => post(url.ADD_PLATO_USER, data);
const disablePlatoUser = (data) => put(url.DISABLE_PLATO_USER, data);
const enablePlatoUser = (data) => put(url.ENABLE_PLATO_USER, data);
const updatePlatoUser = (data) => put(url.UPDATE_PLATO_USER, data);

//Clinician
const getClinicians = (disabled = undefined) =>
  get(url.GET_CLINICIANS_WITH(disabled));
const addClinician = (data) => post(url.ADD_CLINICIAN, data);
const disableClinician = (data) => put(url.DISABLE_CLINICIAN, data);
const enableClinician = (data) => put(url.ENABLE_CLINICIAN, data);
const updateClinician = (data) => put(url.UPDATE_CLINICIAN, data);

const getCliniciansByClinic = (clinic) => get(url.GET_CLINICIANS_BY_CLINIC(clinic));

//Clinician clinics
const getClinicianBy = (guid) => get(url.GET_CLINICIAN_BY(guid));
const getClinicianClinicsBy = (data) =>
  get(url.GET_CLINICIAN_CLINICS_BY(data.guid, data.disabled));

const addClinicClinicianBy = (data) =>
  post(url.ADD_CLINIC_CLINICIAN_RELATIONSHIP, data);
const enableClinicClinicianBy = (data) =>
  put(url.ENABLE_CLINIC_CLINICIAN_RELATIONSHIP, data);
const disableClinicClinicianBy = (data) =>
  put(url.DISABLE_CLINIC_CLINICIAN_RELATIONSHIP, data);
const updateAdminClinicClinicianBy = (data) =>
  put(url.UPDATE_ADMIN_CLINIC_CLINICIAN_RELATIONSHIP, data);
const updateNoAdminClinicClinicianBy = (data) =>
  put(url.UPDATE_NO_ADMIN_CLINIC_CLINICIAN_RELATIONSHIP, data);

//Patients
const getPatient = (guid) => get(url.GET_PATIENT_WITH(guid));
const getPatients = (disabled = undefined, page = undefined, limit = undefined, search = undefined) => {
  // If pagination parameters are provided, use paginated endpoint
  if (page !== undefined && limit !== undefined) {
    return get(url.GET_PATIENTS_PAGINATED(page, limit, disabled, search));
  }
  // Otherwise use the original endpoint with search support
  return get(url.GET_PATIENTS_WITH(disabled, search));
}
const addPatient = async (data) => await post(url.ADD_PATIENT, data);
const disablePatient = (data) => put(url.DISABLE_PATIENT, data);
const enablePatient = (data) => put(url.ENABLE_PATIENT, data);
const updatePatient = (data) => put(url.UPDATE_PATIENT, data);

//Stimulations
const getStimulation = (guid) => get(url.GET_STIMULATION_WITH(guid));
const getStimulations = (disabled = undefined) =>
  get(url.GET_STIMULATIONS_WITH(disabled));
const addStimulation = (data) => post(url.ADD_STIMULATION, data);
const disableStimulation = (data) => put(url.DISABLE_STIMULATION, data);
const enableStimulation = (data) => put(url.ENABLE_STIMULATION, data);
const updateStimulation = (data) => put(url.UPDATE_STIMULATION, data);

export {
  /**
   * Clinics
   */
  getClinics,
  addClinic,
  disableClinic,
  enableClinic,
  updateClinic,
  /**
   * Users
   */
  getUserTypes,
  getUsers,
  addUser,
  disableUser,
  enableUser,
  updateUser,
  /**
   * PlatoUsers
   */
  getPlatoUsers,
  addPlatoUser,
  disablePlatoUser,
  enablePlatoUser,
  updatePlatoUser,
  /**
   * Clinicians
   */
  getClinicians,
  addClinician,
  disableClinician,
  enableClinician,
  updateClinician,
  getClinicianBy,
  getClinicianClinicsBy,
  addClinicClinicianBy,
  enableClinicClinicianBy,
  disableClinicClinicianBy,
  updateAdminClinicClinicianBy,
  updateNoAdminClinicClinicianBy,
  getCliniciansByClinic,

  /**
   * Patients
   */
  getPatient,
  getPatients,
  addPatient,
  disablePatient,
  enablePatient,
  updatePatient,

  /**
   * Stimulations
   */
  getStimulation,
  getStimulations,
  addStimulation,
  disableStimulation,
  enableStimulation,
  updateStimulation,

  /**
   * Countries
   */
  getAvailableCountries,
  getCountries,
  addCountry, 

  /**
   * Reports
   */
  getCountUserReports,
  getUserReports,
  getLiveEvents,
  getLiveEventsList,
  getSessionReports
};
