import {
  GET_CLINICIAN_CLINICS_BY_FAIL,
  GET_CLINICIAN_CLINICS_BY_SUCCESS,
  GET_CLINICIAN_CLINICS_BY,
  
  GET_CLINICIAN_BY,
  GET_CLINICIAN_BY_SUCCESS,
  GET_CLINICIAN_BY_FAIL,

  GET_CLINICIAN_BY_ADMIN,
  GET_CLINICIAN_BY_ADMIN_SUCCESS,
  GET_CLINICIAN_BY_ADMIN_FAIL,

  GET_CLINICIAN_CLINICS_BY_ADMIN,
  GET_CLINICIAN_CLINICS_BY_ADMIN_SUCCESS,
  GET_CLINICIAN_CLINICS_BY_ADMIN_FAIL,

  CREATE_CLINIC_CLINICIAN_RELATIONSHIP_BY_ADMIN,
  CREATE_CLINIC_CLINICIAN_RELATIONSHIP_BY_ADMIN_SUCCESS,
  CREATE_CLINIC_CLINICIAN_RELATIONSHIP_BY_ADMIN_FAIL,

  DISABLE_CLINICIAN_BY,
  DISABLE_CLINICIAN_BY_FAIL,
  DISABLE_CLINICIAN_BY_SUCCESS,

  ENABLE_CLINICIAN_BY,
  ENABLE_CLINICIAN_BY_FAIL,
  ENABLE_CLINICIAN_BY_SUCCESS,
  
  CREATE_CLINIC_CLINICIAN_RELATIONSHIP_BY,
  CREATE_CLINIC_CLINICIAN_RELATIONSHIP_BY_SUCCESS,
  CREATE_CLINIC_CLINICIAN_RELATIONSHIP_BY_FAIL,
  
  ACTIVATE_CLINIC_CLINICIAN_RELATIONSHIP_BY,
  ACTIVATE_CLINIC_CLINICIAN_RELATIONSHIP_BY_SUCCESS,
  ACTIVATE_CLINIC_CLINICIAN_RELATIONSHIP_BY_FAIL,

  ADMIN_CLINIC_CLINICIAN_RELATIONSHIP_BY,
  ADMIN_CLINIC_CLINICIAN_RELATIONSHIP_BY_SUCCESS,
  ADMIN_CLINIC_CLINICIAN_RELATIONSHIP_BY_FAIL,

  CLEAN_CLINICIAN_ERROR,
  
  ACTIVATE_CLINIC_CLINICIAN_RELATIONSHIP_BY_ADMIN,
  ACTIVATE_CLINIC_CLINICIAN_RELATIONSHIP_BY_ADMIN_SUCCESS,
  ACTIVATE_CLINIC_CLINICIAN_RELATIONSHIP_BY_ADMIN_FAIL,
} from "./actionTypes";

export const cleanClinicianError = () => ({
  type: CLEAN_CLINICIAN_ERROR
});

export const getClinicianBy = guid => ({ 
  type: GET_CLINICIAN_BY,
  payload: guid
});

export const getClinicianSuccess = clinician => ({
  type: GET_CLINICIAN_BY_SUCCESS,
  payload: clinician,
});

export const getClinicianFail = error => ({
  type: GET_CLINICIAN_BY_FAIL,
  payload: error,
});

export const getClinicianClinicsBy = data => ({ 
  type: GET_CLINICIAN_CLINICS_BY, 
  payload: data 
});

export const getClinicianClinicsBySuccess = clinics => ({
  type: GET_CLINICIAN_CLINICS_BY_SUCCESS,
  payload: clinics,
});

export const getClinicianClinicsByFail = error => ({
  type: GET_CLINICIAN_CLINICS_BY_FAIL,
  payload: error,
});

export const disableClinicianBy = guid => ({
  type: DISABLE_CLINICIAN_BY,
  payload: guid,
});

export const disableClinicianBySuccess = guid => ({
  type: DISABLE_CLINICIAN_BY_SUCCESS,
  payload: guid,
});

export const disableClinicianByFail = error => ({
  type: DISABLE_CLINICIAN_BY_FAIL,
  payload: error,
});

export const enableClinicianBy = guid => ({
  type: ENABLE_CLINICIAN_BY,
  payload: guid,
});

export const enableClinicianBySuccess = guid => ({
  type: ENABLE_CLINICIAN_BY_SUCCESS,
  payload: guid,
});

export const enableClinicianByFail = error => ({
  type: ENABLE_CLINICIAN_BY_FAIL,
  payload: error,
});

export const createClinicClinicianBy = data => ({
  type: CREATE_CLINIC_CLINICIAN_RELATIONSHIP_BY,
  payload: data,
});

export const createClinicClinicianBySuccess = relationship => ({
  type: CREATE_CLINIC_CLINICIAN_RELATIONSHIP_BY_SUCCESS,
  payload: relationship,
});

export const createClinicClinicianByFail = error => ({
  type: CREATE_CLINIC_CLINICIAN_RELATIONSHIP_BY_FAIL,
  payload: error,
});

export const activateClinicClinicianBy = data => ({
  type: ACTIVATE_CLINIC_CLINICIAN_RELATIONSHIP_BY,
  payload: data,
});

export const activateClinicClinicianBySuccess = data => ({
  type: ACTIVATE_CLINIC_CLINICIAN_RELATIONSHIP_BY_SUCCESS,
  payload: data,
});

export const activateClinicClinicianByFail = error => ({
  type: ACTIVATE_CLINIC_CLINICIAN_RELATIONSHIP_BY_FAIL,
  payload: error,
});

export const adminClinicClinicianBy = data => ({
  type: ADMIN_CLINIC_CLINICIAN_RELATIONSHIP_BY,
  payload: data,
});

export const adminClinicClinicianBySuccess = data => ({
  type: ADMIN_CLINIC_CLINICIAN_RELATIONSHIP_BY_SUCCESS,
  payload: data,
});

export const adminClinicClinicianByFail = error => ({
  type: ADMIN_CLINIC_CLINICIAN_RELATIONSHIP_BY_FAIL,
  payload: error,
});

/**
 * Clinician admin
 */
export const getClinicianByAdmin = guid => ({ 
  type: GET_CLINICIAN_BY_ADMIN,
  payload: guid
});

export const getClinicianByAdminSuccess = clinician => ({
  type: GET_CLINICIAN_BY_ADMIN_SUCCESS,
  payload: clinician,
});

export const getClinicianByAdminFail = error => ({
  type: GET_CLINICIAN_BY_ADMIN_FAIL,
  payload: error,
});

export const getClinicianClinicsByAdmin = data => ({ 
  type: GET_CLINICIAN_CLINICS_BY_ADMIN, 
  payload: data 
});

export const getClinicianClinicsByAdminSuccess = clinics => ({
  type: GET_CLINICIAN_CLINICS_BY_ADMIN_SUCCESS,
  payload: clinics,
});

export const getClinicianClinicsByAdminFail = error => ({
  type: GET_CLINICIAN_CLINICS_BY_ADMIN_FAIL,
  payload: error,
});

export const createClinicClinicianByAdmin = data => ({
  type: CREATE_CLINIC_CLINICIAN_RELATIONSHIP_BY_ADMIN,
  payload: data,
});

export const createClinicClinicianByAdminSuccess = relationship => ({
  type: CREATE_CLINIC_CLINICIAN_RELATIONSHIP_BY_ADMIN_SUCCESS,
  payload: relationship,
});

export const createClinicClinicianByAdminFail = error => ({
  type: CREATE_CLINIC_CLINICIAN_RELATIONSHIP_BY_ADMIN_FAIL,
  payload: error,
});

export const activateClinicClinicianByAdmin = data => ({
  type: ACTIVATE_CLINIC_CLINICIAN_RELATIONSHIP_BY_ADMIN,
  payload: data,
});

export const activateClinicClinicianByAdminSuccess = data => ({
  type: ACTIVATE_CLINIC_CLINICIAN_RELATIONSHIP_BY_ADMIN_SUCCESS,
  payload: data,
});

export const activateClinicClinicianByAdminFail = error => ({
  type: ACTIVATE_CLINIC_CLINICIAN_RELATIONSHIP_BY_ADMIN_FAIL,
  payload: error,
});