import { get, post, put } from "./manager";
import { gateAxios } from "../pages/Gate/components/Layout/GateGuard";
import * as url from "./methods";

const getLoggedInUser = () => {
  const user = localStorage.getItem("user");
  if (user) return JSON.parse(user);

  return null;
};

const isUserAuthenticated = () => getLoggedInUser() !== null;

const signIn = (data) => post(url.SIGN_IN, data, false);
const signOut = (data) => get(url.SIGN_OUT, data);
const createPassword = (data) => put(url.CREATE_PASSWORD, data);
const forgetPassword = (data) => post(url.FORGET_PASSWORD, data);
const resetPassword = async (data) => { 
  const resp = await post(url.RESET_PASSWORD, data) 
  return resp
};


//Clinic Stimulations
const getClinicStimulation = (guid) =>
  get(url.GET_CLINIC_STIMULATION_WITH(guid));
  
const getClinicStimulations = async (clinic) => {
  const resp = await gateAxios.get(`${import.meta.env.VITE_APP_API_URL}/clinic-stimulations?clinic=${clinic}`);
  return resp.data;
};
const addClinicStimulation = async (data) => {
  const resp = await gateAxios.post(`${import.meta.env.VITE_APP_API_URL}/clinic-stimulation`, data);
  return resp; // Keeping it as full response due to how Some older Redux actions expect it (if they use it), but for our sidebar we'll await directly.
};
const disableClinicStimulation = (data) =>
  put(url.DISABLE_CLINIC_STIMULATION, data);
const enableClinicStimulation = (data) =>
  put(url.ENABLE_CLINIC_STIMULATION, data);

const updateClinicStimulation = async (data) => {
  const resp = await gateAxios.put(`${import.meta.env.VITE_APP_API_URL}/clinic-stimulation`, data);
  return resp.data;
};

//Patient treatments
const getPatientTreatments = (patient) =>
  get(url.GET_PATIENT_TREATMENTS_WITH(patient));
const addPatientTreatment = (data) => post(url.ADD_PATIENT_TREATMENT, data);
const disablePatientTreatment = (data) =>
  put(url.DISABLE_PATIENT_TREATMENT, data);
const enablePatientTreatment = (data) =>
  put(url.ENABLE_PATIENT_TREATMENT, data);
const startPatientTreatment = (data) =>
  put(url.START_PATIENT_TREATMENT, data);
const endPatientTreatment = (data) =>
  put(url.END_PATIENT_TREATMENT, data);

const getInterventionsByTreatment = (treatment) =>
  get(url.GET_INTERVENTIONS_BY_TREATMENT_WITH(treatment));

export {
  getLoggedInUser,
  isUserAuthenticated,
  signIn,
  signOut,
  createPassword,
  forgetPassword,
  resetPassword,

  /**
   * Clinic stimulations
   */
  getClinicStimulation,
  getClinicStimulations,
  addClinicStimulation,
  disableClinicStimulation,
  enableClinicStimulation,
  updateClinicStimulation,

  /**
   * Patient treatments
   */
  getPatientTreatments,
  addPatientTreatment,
  disablePatientTreatment,
  enablePatientTreatment,
  startPatientTreatment,
  endPatientTreatment,
  getInterventionsByTreatment
};
