import {
  GET_CLINICS,
  GET_CLINICS_SUCCESS,
  GET_CLINICS_FAIL,
  ADD_CLINIC,
  ADD_CLINIC_SUCCESS,
  ADD_CLINIC_FAIL,
  UPDATE_CLINIC,
  UPDATE_CLINIC_SUCCESS,
  UPDATE_CLINIC_FAIL,
  DISABLE_CLINIC,
  DISABLE_CLINIC_SUCCESS,
  DISABLE_CLINIC_FAIL,
  ENABLE_CLINIC,
  ENABLE_CLINIC_SUCCESS,
  ENABLE_CLINIC_FAIL,
  CLEAN_CLINICS_ERROR,
  GET_MY_CLINICS_SUCCESS,
  GET_MY_CLINICS_FAIL,
  GET_MY_CLINICS
} from "./actionTypes";

export const getClinics = (disabled = undefined) => ({ 
  type: GET_CLINICS,
  payload: disabled
});

export const getClinicsSuccess = clinics => ({
  type: GET_CLINICS_SUCCESS,
  payload: clinics,
});

export const getClinicsFail = error => ({
  type: GET_CLINICS_FAIL,
  payload: error,
});

export const addClinic = clinic => ({
  type: ADD_CLINIC,
  payload: clinic,
});

export const addClinicSuccess = clinic => ({
  type: ADD_CLINIC_SUCCESS,
  payload: clinic,
});

export const addClinicFail = error => ({
  type: ADD_CLINIC_FAIL,
  payload: error,
});

export const updateClinic = clinic => ({
  type: UPDATE_CLINIC,
  payload: clinic,
});

export const updateClinicSuccess = clinic => ({
  type: UPDATE_CLINIC_SUCCESS,
  payload: clinic,
});

export const updateClinicFail = error => ({
  type: UPDATE_CLINIC_FAIL,
  payload: error,
});

export const disableClinic = clinic => ({
  type: DISABLE_CLINIC,
  payload: clinic,
});

export const disableClinicSuccess = clinic => ({
  type: DISABLE_CLINIC_SUCCESS,
  payload: clinic,
});

export const disableClinicFail = error => ({
  type: DISABLE_CLINIC_FAIL,
  payload: error,
});

export const enableClinic = clinic => ({
  type: ENABLE_CLINIC,
  payload: clinic,
});

export const enableClinicSuccess = clinic => ({
  type: ENABLE_CLINIC_SUCCESS,
  payload: clinic,
});

export const enableClinicFail = error => ({
  type: ENABLE_CLINIC_FAIL,
  payload: error,
});

export const getMyClinics = () => ({ type: GET_MY_CLINICS });

export const getMyClinicsSuccess = clinics => ({
  type: GET_MY_CLINICS_SUCCESS,
  payload: clinics,
});

export const getMyClinicsFail = error => ({
  type: GET_MY_CLINICS_FAIL,
  payload: error,
});

export const cleanClinicsError = () => ({
  type: CLEAN_CLINICS_ERROR,
});
