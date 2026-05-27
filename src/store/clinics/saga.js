import { call, put, takeEvery } from "redux-saga/effects"
import { 
  GET_CLINICS, 
  ADD_CLINIC , 
  DISABLE_CLINIC, 
  UPDATE_CLINIC, 
  ENABLE_CLINIC, 
  GET_MY_CLINICS 
} from "./actionTypes";
import { ServerFail } from '../../api/fail';
import {
  getClinicsSuccess,
  getClinicsFail,
  addClinicSuccess,
  addClinicFail,
  updateClinicSuccess,
  updateClinicFail,
  disableClinicSuccess,
  disableClinicFail,
  enableClinicSuccess,
  enableClinicFail,
  getMyClinicsSuccess,
  getMyClinicsFail,
} from "./actions";

import { addClinic, disableClinic, updateClinic, enableClinic, getClinics } from "../../api/plato";
import { getMyClinics } from "../../api/clinician";

function* onGetClinics({ payload: disabled = undefined }) {
  try {
    const response = yield call(getClinics, disabled);
    yield put(getClinicsSuccess(response));
  } catch (error) {
    yield put(getClinicsFail(error));
  }
}

function* onAddClinic({ payload: clinic }) {
  try {
    const response = yield call(addClinic, clinic);
    yield put(addClinicSuccess(response));
  } catch (error) {
    yield put(addClinicFail(error));
  }
}

function* onUpdateClinic({ payload: clinic }) {
  try {
    const response = yield call(updateClinic, clinic);
    if (response.success) yield put(updateClinicSuccess(clinic));
    else yield put(updateClinicFail(ServerFail.UNSUCCESS_UPDATE));
  } catch (error) {
    yield put(updateClinicFail(error));
  }
}

function* onDisableClinic({ payload: guid }) {
  try {
    const response = yield call(disableClinic, { guid });
    if (response.success) yield put(disableClinicSuccess(guid));
    else yield put(disableClinicFail(ServerFail.UNSUCCESS_UPDATE));
  } catch (error) {
    yield put(disableClinicFail(error));
  }
}

function* onEnableClinic({ payload: guid }) {
  try {
    const response = yield call(enableClinic, { guid });
    if (response.success) yield put(enableClinicSuccess(guid));
    else put(enableClinicFail(ServerFail.UNSUCCESS_UPDATE));
  } catch (error) {
    yield put(enableClinicFail(error));
  }
}

function* onGetMyClinics() {
  try {
    const response = yield call(getMyClinics);
    yield put(getMyClinicsSuccess(response));
  } catch (error) {
    yield put(getMyClinicsFail(error));
  }
}

function* clinicsSaga() {
  yield takeEvery(GET_CLINICS, onGetClinics);
  yield takeEvery(ADD_CLINIC, onAddClinic);
  yield takeEvery(UPDATE_CLINIC, onUpdateClinic);
  yield takeEvery(DISABLE_CLINIC, onDisableClinic);
  yield takeEvery(ENABLE_CLINIC, onEnableClinic);
  yield takeEvery(GET_MY_CLINICS, onGetMyClinics);
}

export default clinicsSaga;
