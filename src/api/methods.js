export const DISABLED_PARAM = "disabled=$disabled";
export const GUID_PARAM = "guid=$guid";
export const CLINIC_PARAM = "clinic=$clinic";
export const ADMIN_PARAM = "admin=$admin";

//AUTH
export const SIGN_IN = "/sign-in";
export const SIGN_UP_CONTACT = "/sign-up-contact";
export const SIGN_OUT = "/sign-out";
export const CREATE_PASSWORD = "/create-password";
export const FORGET_PASSWORD = "/forget-password";
export const RESET_PASSWORD = "/reset-password";


//CLINIC STIMULATIONS
const CLINIC_STIMULATION = `/clinic-stimulation`;
export const GET_CLINIC_STIMULATION_WITH = (guid) => {
    return `${CLINIC_STIMULATION}?${GUID_PARAM}`.replace('$guid', guid);
}

export const GET_CLINIC_STIMULATIONS = `${CLINIC_STIMULATION}s`;
export const GET_CLINIC_STIMULATIONS_WITH = (clinic) => {
    return `${GET_CLINIC_STIMULATIONS}?${CLINIC_PARAM}`.replace('$clinic', clinic);
}

export const DISABLE_CLINIC_STIMULATION = `${CLINIC_STIMULATION}/disable`;
export const ENABLE_CLINIC_STIMULATION = `${CLINIC_STIMULATION}/enable`;
export const UPDATE_CLINIC_STIMULATION = `${CLINIC_STIMULATION}`;
export const ADD_CLINIC_STIMULATION = `${CLINIC_STIMULATION}`;

//PATIENT TREATMENT
const PATIENT_TREATMENT = `/patient-treatment`;
export const PATIENT_TREATMENTS = `${PATIENT_TREATMENT}s`;
export const GET_PATIENT_TREATMENTS_WITH = (clinic) => {
    return `${PATIENT_TREATMENTS}?${GUID_PARAM}`.replace('$guid', clinic);
}

export const DISABLE_PATIENT_TREATMENT = `${PATIENT_TREATMENT}/disable`;
export const ENABLE_PATIENT_TREATMENT = `${PATIENT_TREATMENT}/enable`;
export const START_PATIENT_TREATMENT = `${PATIENT_TREATMENT}/start`;
export const END_PATIENT_TREATMENT = `${PATIENT_TREATMENT}/end`;
export const ADD_PATIENT_TREATMENT = `${PATIENT_TREATMENT}`;

export const GET_INTERVENTIONS_BY_TREATMENT = `${PATIENT_TREATMENT}/interventions`;
export const GET_INTERVENTIONS_BY_TREATMENT_WITH = (treatment) => {
    return `${GET_INTERVENTIONS_BY_TREATMENT}?${GUID_PARAM}`.replace('$guid', treatment);
}