import { call, put, takeEvery } from "redux-saga/effects"
import { 
  GET_USERS, 
  ADD_USER, 
  UPDATE_USER, 
  DISABLE_USER, 
  ENABLE_USER, 
  GET_USER_TYPES, 
  GET_PLATO_USERS, 
  ADD_PLATO_USER, 
  ENABLE_PLATO_USER, 
  DISABLE_PLATO_USER, 
  UPDATE_PLATO_USER, 
  GET_CLINICIANS, 
  ADD_CLINICIAN_USER, 
  UPDATE_CLINICIAN_USER, 
  DISABLE_CLINICIAN_USER, 
  ENABLE_CLINICIAN_USER, 
  GET_MY_CLINICIANS,
  ADD_MY_CLINICIAN,
  UPDATE_MY_CLINICIAN,
  DISABLE_MY_CLINICIAN,
  ENABLE_MY_CLINICIAN,
  CHECK_CLINICIAN_ADMIN,
  GET_CLINICIANS_BY_CLINIC,
  
} from "./actionTypes";

import { ServerFail } from '../../api/fail';

import {
  //USERS
  getUsersSuccess,
  getUsersFail,
  addUserSuccess,
  addUserFail,
  updateUserSuccess,
  updateUserFail,
  disableUserSuccess,
  disableUserFail,
  enableUserSuccess,
  enableUserFail,

  //USER TYPES
  getUserTypesSuccess,
  getUserTypesFail,

  //PLATO USERS
  getPlatoUsersSuccess,
  getPlatoUsersFail,
  addPlatoUserSuccess,
  addPlatoUserFail,
  updatePlatoUserSuccess,
  updatePlatoUserFail,
  disablePlatoUserSuccess,
  disablePlatoUserFail,
  enablePlatoUserSuccess,
  enablePlatoUserFail,
  getCliniciansSuccess,
  getCliniciansFail,
  getCliniciansByClinicSuccess,
  getCliniciansByClinicFail,
  addClinicianUserSuccess,
  addClinicianUserFail,
  updateClinicianUserSuccess,
  updateClinicianUserFail,
  disableClinicianUserSuccess,
  disableClinicianUserFail,
  enableClinicianUserSuccess,
  enableClinicianUserFail,
  getMyCliniciansSuccess,
  getMyCliniciansFail,
  addMyClinicianSuccess,
  addMyClinicianFail,
  updateMyClinicianSuccess,
  updateMyClinicianFail,
  disableMyClinicianSuccess,
  disableMyClinicianFail,
  enableMyClinicianSuccess,
  enableMyClinicianFail,
  checkClinicianAdminSuccess,
  checkClinicianAdminFail,
} from "./actions";

import { 
  getUserTypes,
  updateUser, 
  disableUser, 
  enableUser, 
  addUser, 
  getUsers,
  getPlatoUsers, 
  addPlatoUser, 
  updatePlatoUser, 
  disablePlatoUser, 
  enablePlatoUser, 
  getClinicians, 
  addClinician, 
  updateClinician, 
  disableClinician, 
  enableClinician, 
  getCliniciansByClinic
} from "../../api/plato";

import {
  isClinicianAdmin,
  addMyClinician, 
  disableMyClinician, 
  enableMyClinician, 
  getMyClinicians, 
  updateMyClinician
} from "../../api/clinician";

//USER TYPES
function* onGetUserTypes() {
  try {
    const response = yield call(getUserTypes);
    yield put(getUserTypesSuccess(response));
  } catch (error) {
    yield put(getUserTypesFail(error));
  }
}

//USERS
function* onGetUsers() {
  try {
    const response = yield call(getUsers);
    yield put(getUsersSuccess(response));
  } catch (error) {
    yield put(getUsersFail(error));
  }
}

function* onAddUser({ payload: user }) {
  try {
    const response = yield call(addUser, user);
    yield put(addUserSuccess(response));
  } catch (error) {
    yield put(addUserFail(error));
  }
}

function* onUpdateUser({ payload: user }) {
  try {
    const response = yield call(updateUser, user);
    if (response.success) yield put(updateUserSuccess(user));
    else yield put(updateUserFail(ServerFail.UNSUCCESS_UPDATE));
  } catch (error) {
    yield put(updateUserFail(error));
  }
}

function* onDisableUser({ payload: guid }) {
  try {
    const response = yield call(disableUser, { guid });
    if (response.success) yield put(disableUserSuccess(guid));
    else yield put(disableUserFail(ServerFail.UNSUCCESS_UPDATE));
  } catch (error) {
    yield put(disableUserFail(error));
  }
}

function* onEnableUser({ payload: guid }) {
  try {
    const response = yield call(enableUser, { guid });
    if (response.success) yield put(enableUserSuccess(guid));
    else put(enableUserFail(ServerFail.UNSUCCESS_UPDATE));
  } catch (error) {
    yield put(enableUserFail(error));
  }
}

//PLATO USERS
function* onGetPlatoUsers() {
  try {
    const response = yield call(getPlatoUsers);
    yield put(getPlatoUsersSuccess(response));
  } catch (error) {
    yield put(getPlatoUsersFail(error));
  }
}

function* onAddPlatoUser({ payload: user }) {
  try {
    const response = yield call(addPlatoUser, user);
    yield put(addPlatoUserSuccess(response));
  } catch (error) {
    yield put(addPlatoUserFail(error));
  }
}

function* onUpdatePlatoUser({ payload: user }) {
  try {
    const response = yield call(updatePlatoUser, user);
    if (response.success) yield put(updatePlatoUserSuccess(user));
    else yield put(updatePlatoUserFail(ServerFail.UNSUCCESS_UPDATE));
  } catch (error) {
    yield put(updatePlatoUserFail(error));
  }
}

function* onDisablePlatoUser({ payload: guid }) {
  try {
    const response = yield call(disablePlatoUser, { guid });
    if (response.success) yield put(disablePlatoUserSuccess(guid));
    else yield put(disablePlatoUserFail(ServerFail.UNSUCCESS_UPDATE));
  } catch (error) {
    yield put(disablePlatoUserFail(error));
  }
}

function* onEnablePlatoUser({ payload: guid }) {
  try {
    const response = yield call(enablePlatoUser, { guid });
    if (response.success) yield put(enablePlatoUserSuccess(guid));
    else put(enablePlatoUserFail(ServerFail.UNSUCCESS_UPDATE));
  } catch (error) {
    yield put(enablePlatoUserFail(error));
  }
}

//USERS
function* onGetClinicians() {
  try {
    const response = yield call(getClinicians);
    yield put(getCliniciansSuccess(response));
  } catch (error) {
    yield put(getCliniciansFail(error));
  }
}

function* onGetCliniciansByClinic({ payload: clinic }) {
  try {
    const response = yield call(getCliniciansByClinic, clinic);
    yield put(getCliniciansByClinicSuccess(response));
  } catch (error) {
    yield put(getCliniciansByClinicFail(error));
  }
}

function* onAddClinicianUser({ payload: user }) {
  try {
    const response = yield call(addClinician, user);
    yield put(addClinicianUserSuccess(response));
  } catch (error) {
    yield put(addClinicianUserFail(error));
  }
}

function* onUpdateClinicianUser({ payload: user }) {
  try {
    const response = yield call(updateClinician, user);
    if (response.success) yield put(updateClinicianUserSuccess(user));
    else yield put(updateClinicianUserFail(ServerFail.UNSUCCESS_UPDATE));
  } catch (error) {
    yield put(updateClinicianUserFail(error));
  }
}

function* onDisableClinicianUser({ payload: guid }) {
  try {
    const response = yield call(disableClinician, { guid });
    if (response.success) yield put(disableClinicianUserSuccess(guid));
    else yield put(disableClinicianUserFail(ServerFail.UNSUCCESS_UPDATE));
  } catch (error) {
    yield put(disableClinicianUserFail(error));
  }
}

function* onEnableClinicianUser({ payload: guid }) {
  try {
    const response = yield call(enableClinician, { guid });
    if (response.success) yield put(enableClinicianUserSuccess(guid));
    else put(enableClinicianUserFail(ServerFail.UNSUCCESS_UPDATE));
  } catch (error) {
    yield put(enableClinicianUserFail(error));
  }
}

/**MY CLINICS */
function* onGetMyClinicians() {
  try {
    const response = yield call(getMyClinicians);
    yield put(getMyCliniciansSuccess(response));
  } catch (error) {
    yield put(getMyCliniciansFail(error));
  }
}

function* onAddMyClinician({ payload: user }) {
  try {
    const response = yield call(addMyClinician, user);
    yield put(addMyClinicianSuccess(response));
  } catch (error) {
    yield put(addMyClinicianFail(error));
  }
}

function* onUpdateMyClinician({ payload: user }) {
  try {
    const response = yield call(updateMyClinician, user);
    if (response.success) yield put(updateMyClinicianSuccess(user));
    else yield put(updateMyClinicianFail(ServerFail.UNSUCCESS_UPDATE));
  } catch (error) {
    yield put(updateMyClinicianFail(error));
  }
}

function* onDisableMyClinician({ payload: guid }) {
  try {
    const response = yield call(disableMyClinician, { guid });
    if (response.success) yield put(disableMyClinicianSuccess(guid));
    else yield put(disableMyClinicianFail(ServerFail.UNSUCCESS_UPDATE));
  } catch (error) {
    yield put(disableMyClinicianFail(error));
  }
}

function* onEnableMyClinician({ payload: guid }) {
  try {
    const response = yield call(enableMyClinician, { guid });
    if (response.success) yield put(enableMyClinicianSuccess(guid));
    else put(enableMyClinicianFail(ServerFail.UNSUCCESS_UPDATE));
  } catch (error) {
    yield put(enableMyClinicianFail(error));
  }
}

function* onCheckClinicianAdmin() {
  try {
    const response = yield call(isClinicianAdmin);
    if (response.success) yield put(checkClinicianAdminSuccess(response.success));
    else yield put(checkClinicianAdminFail(ServerFail.UNSUCCESS_UPDATE));
  } catch (error) {
    yield put(checkClinicianAdminFail(error));
  }
}

function* usersSaga() {
  //USER TYPES
  yield takeEvery(GET_USER_TYPES, onGetUserTypes);
  
  //USERS
  yield takeEvery(GET_USERS, onGetUsers);
  yield takeEvery(ADD_USER, onAddUser);
  yield takeEvery(UPDATE_USER, onUpdateUser);
  yield takeEvery(DISABLE_USER, onDisableUser);
  yield takeEvery(ENABLE_USER, onEnableUser);
  
  //PLATO USERS
  yield takeEvery(GET_PLATO_USERS, onGetPlatoUsers);
  yield takeEvery(ADD_PLATO_USER, onAddPlatoUser);
  yield takeEvery(UPDATE_PLATO_USER, onUpdatePlatoUser);
  yield takeEvery(DISABLE_PLATO_USER, onDisablePlatoUser);
  yield takeEvery(ENABLE_PLATO_USER, onEnablePlatoUser);

  //CLINICIAN USERS
  yield takeEvery(GET_CLINICIANS, onGetClinicians);
  yield takeEvery(GET_CLINICIANS_BY_CLINIC, onGetCliniciansByClinic);
  yield takeEvery(ADD_CLINICIAN_USER, onAddClinicianUser);
  yield takeEvery(UPDATE_CLINICIAN_USER, onUpdateClinicianUser);
  yield takeEvery(DISABLE_CLINICIAN_USER, onDisableClinicianUser);
  yield takeEvery(ENABLE_CLINICIAN_USER, onEnableClinicianUser);

  //MY CLINICIANS
  yield takeEvery(GET_MY_CLINICIANS, onGetMyClinicians);
  yield takeEvery(ADD_MY_CLINICIAN, onAddMyClinician);
  yield takeEvery(UPDATE_MY_CLINICIAN, onUpdateMyClinician);
  yield takeEvery(DISABLE_MY_CLINICIAN, onDisableMyClinician);
  yield takeEvery(ENABLE_MY_CLINICIAN, onEnableMyClinician);

  yield takeEvery(CHECK_CLINICIAN_ADMIN, onCheckClinicianAdmin);
}

export default usersSaga;
