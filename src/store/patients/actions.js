import {
  /**
   * Patients
   */
  GET_PATIENTS,
  GET_PATIENTS_SUCCESS,
  GET_PATIENTS_FAIL,
  GET_PATIENT,
  GET_PATIENT_SUCCESS,
  GET_PATIENT_FAIL,
  ADD_PATIENT,
  ADD_PATIENT_SUCCESS,
  ADD_PATIENT_FAIL,
  UPDATE_PATIENT,
  UPDATE_PATIENT_SUCCESS,
  UPDATE_PATIENT_FAIL,
  DISABLE_PATIENT,
  DISABLE_PATIENT_SUCCESS,
  DISABLE_PATIENT_FAIL,
  ENABLE_PATIENT,
  ENABLE_PATIENT_SUCCESS,
  ENABLE_PATIENT_FAIL,
  CLEAR_PATIENTS_ERROR,

  /**
   * My patients
   */
  GET_MY_PATIENTS,
  GET_MY_PATIENTS_SUCCESS,
  GET_MY_PATIENTS_FAIL,
  GET_MY_PATIENT,
  GET_MY_PATIENT_SUCCESS,
  GET_MY_PATIENT_FAIL,
  ADD_MY_PATIENT,
  ADD_MY_PATIENT_SUCCESS,
  ADD_MY_PATIENT_FAIL,
  UPDATE_MY_PATIENT,
  UPDATE_MY_PATIENT_SUCCESS,
  UPDATE_MY_PATIENT_FAIL,
  DISABLE_MY_PATIENT,
  DISABLE_MY_PATIENT_SUCCESS,
  DISABLE_MY_PATIENT_FAIL,
  ENABLE_MY_PATIENT,
  ENABLE_MY_PATIENT_SUCCESS,
  ENABLE_MY_PATIENT_FAIL,

  /**
   * Patient treatments
   */
  GET_PATIENT_TREATMENTS,
  GET_PATIENT_TREATMENTS_SUCCESS,
  GET_PATIENT_TREATMENTS_FAIL,
  ADD_PATIENT_TREATMENT,
  ADD_PATIENT_TREATMENT_SUCCESS,
  ADD_PATIENT_TREATMENT_FAIL,
  RESET_PATIENT_GUID,
  DISABLE_PATIENT_TREATMENT,
  DISABLE_PATIENT_TREATMENT_SUCCESS,
  DISABLE_PATIENT_TREATMENT_FAIL,
  ENABLE_PATIENT_TREATMENT,
  ENABLE_PATIENT_TREATMENT_SUCCESS,
  ENABLE_PATIENT_TREATMENT_FAIL,
  START_PATIENT_TREATMENT,
  START_PATIENT_TREATMENT_SUCCESS,
  START_PATIENT_TREATMENT_FAIL,
  END_PATIENT_TREATMENT,
  END_PATIENT_TREATMENT_SUCCESS,
  END_PATIENT_TREATMENT_FAIL,
  GET_INTERVENTIONS_BY_TREATMENT,
  GET_INTERVENTIONS_BY_TREATMENT_SUCCESS,
  GET_INTERVENTIONS_BY_TREATMENT_FAIL,
} from "./actionTypes";

//PATIENTS
export const getPatients = (page = undefined, limit = undefined, search = undefined) => ({ 
  type: GET_PATIENTS,
  payload: { page, limit, search }
});

export const getPatientsSuccess = (patients) => ({
  type: GET_PATIENTS_SUCCESS,
  payload: patients,
});

export const getPatientsFail = (error) => ({
  type: GET_PATIENTS_FAIL,
  payload: error,
});

export const getPatient = (guid) => ({
  type: GET_PATIENT,
  payload: guid,
});

export const getPatientSuccess = (patients) => ({
  type: GET_PATIENT_SUCCESS,
  payload: patients,
});

export const getPatientFail = (error) => ({
  type: GET_PATIENT_FAIL,
  payload: error,
});

export const addPatient = (patient) => ({
  type: ADD_PATIENT,
  payload: patient,
});

export const addPatientSuccess = (patient) => ({
  type: ADD_PATIENT_SUCCESS,
  payload: patient,
});

export const resetPatientGuid = () => ({ type: RESET_PATIENT_GUID });

export const addPatientFail = (error) => ({
  type: ADD_PATIENT_FAIL,
  payload: error,
});

export const updatePatient = (patient) => ({
  type: UPDATE_PATIENT,
  payload: patient,
});

export const updatePatientSuccess = (patient) => ({
  type: UPDATE_PATIENT_SUCCESS,
  payload: patient,
});

export const updatePatientFail = (error) => ({
  type: UPDATE_PATIENT_FAIL,
  payload: error,
});

export const disablePatient = (guid) => ({
  type: DISABLE_PATIENT,
  payload: guid,
});

export const disablePatientSuccess = (patient) => ({
  type: DISABLE_PATIENT_SUCCESS,
  payload: patient,
});

export const disablePatientFail = (error) => ({
  type: DISABLE_PATIENT_FAIL,
  payload: error,
});

export const enablePatient = (guid) => ({
  type: ENABLE_PATIENT,
  payload: guid,
});

export const enablePatientSuccess = (patient) => ({
  type: ENABLE_PATIENT_SUCCESS,
  payload: patient,
});

export const enablePatientFail = (error) => ({
  type: ENABLE_PATIENT_FAIL,
  payload: error,
});

//MY PATIENTS
export const getMyPatients = (page = undefined, limit = undefined, search = undefined) => ({
  type: GET_MY_PATIENTS,
  payload: { page, limit, search },
});

export const getMyPatientsSuccess = (patients) => ({
  type: GET_MY_PATIENTS_SUCCESS,
  payload: patients,
});

export const getMyPatientsFail = (error) => ({
  type: GET_MY_PATIENTS_FAIL,
  payload: error,
});

export const getMyPatient = (guid) => ({
  type: GET_MY_PATIENT,
  payload: guid,
});

export const getMyPatientSuccess = (patients) => ({
  type: GET_MY_PATIENT_SUCCESS,
  payload: patients,
});

export const getMyPatientFail = (error) => ({
  type: GET_MY_PATIENT_FAIL,
  payload: error,
});

export const addMyPatient = (patient) => ({
  type: ADD_MY_PATIENT,
  payload: patient,
});

export const addMyPatientSuccess = (patient) => ({
  type: ADD_MY_PATIENT_SUCCESS,
  payload: patient,
});

export const addMyPatientFail = (error) => ({
  type: ADD_MY_PATIENT_FAIL,
  payload: error,
});

export const updateMyPatient = (patient) => ({
  type: UPDATE_MY_PATIENT,
  payload: patient,
});

export const updateMyPatientSuccess = (patient) => ({
  type: UPDATE_MY_PATIENT_SUCCESS,
  payload: patient,
});

export const updateMyPatientFail = (error) => ({
  type: UPDATE_MY_PATIENT_FAIL,
  payload: error,
});

export const disableMyPatient = (guid) => ({
  type: DISABLE_MY_PATIENT,
  payload: guid,
});

export const disableMyPatientSuccess = (patient) => ({
  type: DISABLE_MY_PATIENT_SUCCESS,
  payload: patient,
});

export const disableMyPatientFail = (error) => ({
  type: DISABLE_MY_PATIENT_FAIL,
  payload: error,
});

export const enableMyPatient = (guid) => ({
  type: ENABLE_MY_PATIENT,
  payload: guid,
});

export const enableMyPatientSuccess = (patient) => ({
  type: ENABLE_MY_PATIENT_SUCCESS,
  payload: patient,
});

export const enableMyPatientFail = (error) => ({
  type: ENABLE_MY_PATIENT_FAIL,
  payload: error,
});

//PATIENT TREATMENTS
export const getPatientTreatments = (patient) => ({ 
  type: GET_PATIENT_TREATMENTS,
  payload: patient,
 });

export const getPatientTreatmentsSuccess = (patients) => ({
  type: GET_PATIENT_TREATMENTS_SUCCESS,
  payload: patients,
});

export const getPatientTreatmentsFail = (error) => ({
  type: GET_PATIENT_TREATMENTS_FAIL,
  payload: error,
});

export const addPatientTreatment = (patient) => ({
  type: ADD_PATIENT_TREATMENT,
  payload: patient,
});

export const addPatientTreatmentSuccess = (patient) => ({
  type: ADD_PATIENT_TREATMENT_SUCCESS,
  payload: patient,
});

export const addPatientTreatmentFail = (error) => ({
  type: ADD_PATIENT_TREATMENT_FAIL,
  payload: error,
});

export const disablePatientTreatment = (guid) => ({
  type: DISABLE_PATIENT_TREATMENT,
  payload: guid,
});

export const disablePatientTreatmentSuccess = (patient) => ({
  type: DISABLE_PATIENT_TREATMENT_SUCCESS,
  payload: patient,
});

export const disablePatientTreatmentFail = (error) => ({
  type: DISABLE_PATIENT_TREATMENT_FAIL,
  payload: error,
});

export const enablePatientTreatment = (guid) => ({
  type: ENABLE_PATIENT_TREATMENT,
  payload: guid,
});

export const enablePatientTreatmentSuccess = (patient) => ({
  type: ENABLE_PATIENT_TREATMENT_SUCCESS,
  payload: patient,
});

export const enablePatientTreatmentFail = (error) => ({
  type: ENABLE_PATIENT_TREATMENT_FAIL,
  payload: error,
});

export const startPatientTreatment = (guid) => ({
  type: START_PATIENT_TREATMENT,
  payload: guid,
});

export const startPatientTreatmentSuccess = (patient) => ({
  type: START_PATIENT_TREATMENT_SUCCESS,
  payload: patient,
});

export const startPatientTreatmentFail = (error) => ({
  type: START_PATIENT_TREATMENT_FAIL,
  payload: error,
});

export const endPatientTreatment = (guid) => ({
  type: END_PATIENT_TREATMENT,
  payload: guid,
});

export const endPatientTreatmentSuccess = (patient) => ({
  type: END_PATIENT_TREATMENT_SUCCESS,
  payload: patient,
});

export const endPatientTreatmentFail = (error) => ({
  type: END_PATIENT_TREATMENT_FAIL,
  payload: error,
});

export const getInterventionsByTreatment = (treatment) => ({ 
  type: GET_INTERVENTIONS_BY_TREATMENT,
  payload: treatment,
 });

export const getInterventionsByTreatmentSuccess = (interventions) => ({
  type: GET_INTERVENTIONS_BY_TREATMENT_SUCCESS,
  payload: interventions,
});

export const getInterventionsByTreatmentFail = (error) => ({
  type: GET_INTERVENTIONS_BY_TREATMENT_FAIL,
  payload: error,
});

export const clearPatientsError = () => ({
  type: CLEAR_PATIENTS_ERROR,
});
