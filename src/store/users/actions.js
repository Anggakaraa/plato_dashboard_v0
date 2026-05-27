import {
  /**
   * Users
   */
  GET_USERS,
  GET_USERS_SUCCESS,
  GET_USERS_FAIL,
  ADD_USER,
  ADD_USER_SUCCESS,
  ADD_USER_FAIL,
  UPDATE_USER,
  UPDATE_USER_SUCCESS,
  UPDATE_USER_FAIL,
  DISABLE_USER,
  DISABLE_USER_SUCCESS,
  DISABLE_USER_FAIL,
  ENABLE_USER,
  ENABLE_USER_SUCCESS,
  ENABLE_USER_FAIL,

  /**
   * User types
   */
  GET_USER_TYPES,
  GET_USER_TYPES_SUCCESS,
  GET_USER_TYPES_FAIL,

  /**
   * Plato users
   */
  GET_PLATO_USERS,
  GET_PLATO_USERS_SUCCESS,
  GET_PLATO_USERS_FAIL,
  ADD_PLATO_USER,
  ADD_PLATO_USER_SUCCESS,
  ADD_PLATO_USER_FAIL,
  UPDATE_PLATO_USER,
  UPDATE_PLATO_USER_SUCCESS,
  UPDATE_PLATO_USER_FAIL,
  DISABLE_PLATO_USER,
  DISABLE_PLATO_USER_SUCCESS,
  DISABLE_PLATO_USER_FAIL,
  ENABLE_PLATO_USER,
  ENABLE_PLATO_USER_SUCCESS,
  ENABLE_PLATO_USER_FAIL,
  /**
   * Clinician users
   */
  GET_CLINICIANS,
  GET_CLINICIANS_SUCCESS,
  GET_CLINICIANS_FAIL,
  GET_CLINICIANS_BY_CLINIC,
  GET_CLINICIANS_BY_CLINIC_SUCCESS,
  GET_CLINICIANS_BY_CLINIC_FAIL,
  ADD_CLINICIAN_USER,
  ADD_CLINICIAN_USER_SUCCESS,
  ADD_CLINICIAN_USER_FAIL,
  UPDATE_CLINICIAN_USER,
  UPDATE_CLINICIAN_USER_SUCCESS,
  UPDATE_CLINICIAN_USER_FAIL,
  DISABLE_CLINICIAN_USER,
  DISABLE_CLINICIAN_USER_SUCCESS,
  DISABLE_CLINICIAN_USER_FAIL,
  ENABLE_CLINICIAN_USER,
  ENABLE_CLINICIAN_USER_SUCCESS,
  ENABLE_CLINICIAN_USER_FAIL,

  GET_MY_CLINICIANS,
  GET_MY_CLINICIANS_SUCCESS,
  GET_MY_CLINICIANS_FAIL,
  CLEAR_USERS_ERROR,
  ADD_MY_CLINICIAN,
  ADD_MY_CLINICIAN_SUCCESS,
  ADD_MY_CLINICIAN_FAIL,
  UPDATE_MY_CLINICIAN,
  UPDATE_MY_CLINICIAN_SUCCESS,
  UPDATE_MY_CLINICIAN_FAIL,
  DISABLE_MY_CLINICIAN,
  DISABLE_MY_CLINICIAN_SUCCESS,
  DISABLE_MY_CLINICIAN_FAIL,
  ENABLE_MY_CLINICIAN,
  ENABLE_MY_CLINICIAN_SUCCESS,
  ENABLE_MY_CLINICIAN_FAIL,

  CHECK_CLINICIAN_ADMIN,
  CHECK_CLINICIAN_ADMIN_SUCCESS,
  CHECK_CLINICIAN_ADMIN_FAIL,
  CLEAR_CLINICIANS,

} from "./actionTypes";

export const checkClinicianAdmin = () => ({ type: CHECK_CLINICIAN_ADMIN });

export const checkClinicianAdminSuccess = data => ({
  type: CHECK_CLINICIAN_ADMIN_SUCCESS,
  payload: data,
});

export const checkClinicianAdminFail = error => ({
  type: CHECK_CLINICIAN_ADMIN_FAIL,
  payload: error,
});

//MY CLINICIAN
export const getMyClinicians = () => ({ type: GET_MY_CLINICIANS });

export const getMyCliniciansSuccess = users => ({
  type: GET_MY_CLINICIANS_SUCCESS,
  payload: users,
});

export const getMyCliniciansFail = error => ({
  type: GET_MY_CLINICIANS_FAIL,
  payload: error,
});

export const addMyClinician = user => ({
  type: ADD_MY_CLINICIAN,
  payload: user,
});

export const addMyClinicianSuccess = user => ({
  type: ADD_MY_CLINICIAN_SUCCESS,
  payload: user,
});

export const addMyClinicianFail = error => ({
  type: ADD_MY_CLINICIAN_FAIL,
  payload: error,
});

export const updateMyClinician = user => ({
  type: UPDATE_MY_CLINICIAN,
  payload: user,
});

export const updateMyClinicianSuccess = user => ({
    type: UPDATE_MY_CLINICIAN_SUCCESS,
    payload: user,
});

export const updateMyClinicianFail = error => ({
  type: UPDATE_MY_CLINICIAN_FAIL,
  payload: error,
});

export const disableMyClinician = user => ({
  type: DISABLE_MY_CLINICIAN,
  payload: user,
});

export const disableMyClinicianSuccess = user => ({
  type: DISABLE_MY_CLINICIAN_SUCCESS,
  payload: user,
});

export const disableMyClinicianFail = error => ({
  type: DISABLE_MY_CLINICIAN_FAIL,
  payload: error,
});

export const enableMyClinician = user => ({
  type: ENABLE_MY_CLINICIAN,
  payload: user,
});

export const enableMyClinicianSuccess = user => ({
  type: ENABLE_MY_CLINICIAN_SUCCESS,
  payload: user,
});

export const enableMyClinicianFail = error => ({
  type: ENABLE_MY_CLINICIAN_FAIL,
  payload: error,
});

//CLINICIAN
export const getClinicians = () => ({type: GET_CLINICIANS});

export const getCliniciansSuccess = users => ({
  type: GET_CLINICIANS_SUCCESS,
  payload: users,
});

export const getCliniciansFail = error => ({
  type: GET_CLINICIANS_FAIL,
  payload: error,
});

export const getCliniciansByClinic = (clinic) => ({
  type: GET_CLINICIANS_BY_CLINIC,
  payload: clinic
});

export const getCliniciansByClinicSuccess = clinicians => ({
  type: GET_CLINICIANS_BY_CLINIC_SUCCESS,
  payload: clinicians,
});

export const getCliniciansByClinicFail = error => ({
  type: GET_CLINICIANS_BY_CLINIC_FAIL,
  payload: error,
});

export const addClinicianUser = user => ({
  type: ADD_CLINICIAN_USER,
  payload: user,
});

export const addClinicianUserSuccess = user => ({
  type: ADD_CLINICIAN_USER_SUCCESS,
  payload: user,
});

export const addClinicianUserFail = error => ({
  type: ADD_CLINICIAN_USER_FAIL,
  payload: error,
});

export const updateClinicianUser = user => ({
  type: UPDATE_CLINICIAN_USER,
  payload: user,
});

export const updateClinicianUserSuccess = user => ({
    type: UPDATE_CLINICIAN_USER_SUCCESS,
    payload: user,
});

export const updateClinicianUserFail = error => ({
  type: UPDATE_CLINICIAN_USER_FAIL,
  payload: error,
});

export const disableClinicianUser = user => ({
  type: DISABLE_CLINICIAN_USER,
  payload: user,
});

export const disableClinicianUserSuccess = user => ({
  type: DISABLE_CLINICIAN_USER_SUCCESS,
  payload: user,
});

export const disableClinicianUserFail = error => ({
  type: DISABLE_CLINICIAN_USER_FAIL,
  payload: error,
});

export const enableClinicianUser = user => ({
  type: ENABLE_CLINICIAN_USER,
  payload: user,
});

export const enableClinicianUserSuccess = user => ({
  type: ENABLE_CLINICIAN_USER_SUCCESS,
  payload: user,
});

export const enableClinicianUserFail = error => ({
  type: ENABLE_CLINICIAN_USER_FAIL,
  payload: error,
});

//PLATO USERS
export const getPlatoUsers = () => ({type: GET_PLATO_USERS});

export const getPlatoUsersSuccess = users => ({
  type: GET_PLATO_USERS_SUCCESS,
  payload: users,
});

export const getPlatoUsersFail = error => ({
  type: GET_PLATO_USERS_FAIL,
  payload: error,
});

export const addPlatoUser = user => ({
  type: ADD_PLATO_USER,
  payload: user,
});

export const addPlatoUserSuccess = user => ({
  type: ADD_PLATO_USER_SUCCESS,
  payload: user,
});

export const addPlatoUserFail = error => ({
  type: ADD_PLATO_USER_FAIL,
  payload: error,
});

export const updatePlatoUser = user => ({
  type: UPDATE_PLATO_USER,
  payload: user,
});

export const updatePlatoUserSuccess = user => ({
    type: UPDATE_PLATO_USER_SUCCESS,
    payload: user,
});

export const updatePlatoUserFail = error => ({
  type: UPDATE_PLATO_USER_FAIL,
  payload: error,
});

export const disablePlatoUser = user => ({
  type: DISABLE_PLATO_USER,
  payload: user,
});

export const disablePlatoUserSuccess = user => ({
  type: DISABLE_PLATO_USER_SUCCESS,
  payload: user,
});

export const disablePlatoUserFail = error => ({
  type: DISABLE_PLATO_USER_FAIL,
  payload: error,
});

export const enablePlatoUser = user => ({
  type: ENABLE_PLATO_USER,
  payload: user,
});

export const enablePlatoUserSuccess = user => ({
  type: ENABLE_PLATO_USER_SUCCESS,
  payload: user,
});

export const enablePlatoUserFail = error => ({
  type: ENABLE_PLATO_USER_FAIL,
  payload: error,
});

//USER TYPES
export const getUserTypes = () => ({type: GET_USER_TYPES});

export const getUserTypesSuccess = users => ({
  type: GET_USER_TYPES_SUCCESS,
  payload: users,
});

export const getUserTypesFail = error => ({
  type: GET_USER_TYPES_FAIL,
  payload: error,
});

//USERS
export const getUsers = () => ({ type: GET_USERS });

export const getUsersSuccess = users => ({
  type: GET_USERS_SUCCESS,
  payload: users,
});

export const getUsersFail = error => ({
  type: GET_USERS_FAIL,
  payload: error,
});

export const addUser = user => ({
  type: ADD_USER,
  payload: user,
});

export const addUserSuccess = user => ({
  type: ADD_USER_SUCCESS,
  payload: user,
});

export const addUserFail = error => ({
  type: ADD_USER_FAIL,
  payload: error,
});

export const updateUser = user => ({
  type: UPDATE_USER,
  payload: user,
});

export const updateUserSuccess = user => ({
    type: UPDATE_USER_SUCCESS,
    payload: user,
});

export const updateUserFail = error => ({
  type: UPDATE_USER_FAIL,
  payload: error,
});

export const disableUser = user => ({
  type: DISABLE_USER,
  payload: user,
});

export const disableUserSuccess = user => ({
  type: DISABLE_USER_SUCCESS,
  payload: user,
});

export const disableUserFail = error => ({
  type: DISABLE_USER_FAIL,
  payload: error,
});

export const enableUser = user => ({
  type: ENABLE_USER,
  payload: user,
});

export const enableUserSuccess = user => ({
  type: ENABLE_USER_SUCCESS,
  payload: user,
});

export const enableUserFail = error => ({
  type: ENABLE_USER_FAIL,
  payload: error,
});

export const clearUsersError = () => ({
  type: CLEAR_USERS_ERROR,
});

export const clearClinicians = () => ({
  type: CLEAR_CLINICIANS,
})

