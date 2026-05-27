import { call, put, takeEvery } from "redux-saga/effects";
import {
  GET_PATIENTS,
  GET_PATIENT,
  ADD_PATIENT,
  UPDATE_PATIENT,
  DISABLE_PATIENT,
  ENABLE_PATIENT,
  GET_MY_PATIENTS,
  GET_MY_PATIENT,
  ADD_MY_PATIENT,
  UPDATE_MY_PATIENT,
  DISABLE_MY_PATIENT,
  ENABLE_MY_PATIENT,
  GET_PATIENT_TREATMENTS,
  ADD_PATIENT_TREATMENT,
  DISABLE_PATIENT_TREATMENT,
  ENABLE_PATIENT_TREATMENT,
  START_PATIENT_TREATMENT,
  END_PATIENT_TREATMENT,
  GET_INTERVENTIONS_BY_TREATMENT,
} from "./actionTypes";

import { ServerFail } from "../../api/fail";

import {
  //PATIENTS
  getPatientSuccess,
  getPatientFail,
  getPatientsSuccess,
  getPatientsFail,
  addPatientSuccess,
  addPatientFail,
  updatePatientSuccess,
  updatePatientFail,
  disablePatientSuccess,
  disablePatientFail,
  enablePatientSuccess,
  enablePatientFail,

  //MY PATIENTS
  getMyPatientSuccess,
  getMyPatientFail,
  getMyPatientsSuccess,
  getMyPatientsFail,
  addMyPatientSuccess,
  addMyPatientFail,
  updateMyPatientSuccess,
  updateMyPatientFail,
  disableMyPatientSuccess,
  disableMyPatientFail,
  enableMyPatientSuccess,
  enableMyPatientFail,
  getPatientTreatmentsSuccess,
  getPatientTreatmentsFail,
  addPatientTreatmentSuccess,
  addPatientTreatmentFail,
  disablePatientTreatmentSuccess,
  disablePatientTreatmentFail,
  enablePatientTreatmentSuccess,
  enablePatientTreatmentFail,
  endPatientTreatmentFail,
  endPatientTreatmentSuccess,
  startPatientTreatmentFail,
  startPatientTreatmentSuccess,
  getInterventionsByTreatmentSuccess,
  getInterventionsByTreatmentFail,
} from "./actions";

import {
  getMyPatients,
  getMyPatient,
  addMyPatient,
  updateMyPatient,
  disableMyPatient,
  enableMyPatient,
} from "../../api/clinician";

import {
  getPatients,
  getPatient,
  addPatient,
  updatePatient,
  disablePatient,
  enablePatient,
} from "../../api/plato";

import { 
  getPatientTreatments,
  disablePatientTreatment,
  enablePatientTreatment,
  startPatientTreatment,
  endPatientTreatment,
  addPatientTreatment,
  getInterventionsByTreatment
 } from "../../api";

//PATIENTS
function* onGetPatients({ payload }) {
  try {
    const { page, limit, search } = payload || {};
    // Only use paginated endpoint when page AND limit are explicitly provided
    // (i.e., called from /patients). Otherwise return all records so that
    // other pages using client-side pagination receive the full dataset.
    const usePagination = page !== undefined && limit !== undefined;
    const response = yield call(
      getPatients,
      undefined,
      usePagination ? page : undefined,
      usePagination ? limit : undefined,
      search,
    );
    yield put(getPatientsSuccess(response));
  } catch (error) {
    yield put(getPatientsFail(error));
  }
}

function* onGetPatient({ payload: guid }) {
  try {
    const response = yield call(getPatient, guid);
    yield put(getPatientSuccess(response));
  } catch (error) {
    yield put(getPatientFail(error));
  }
}



function* onAddPatient({ payload: patient }) {
  try {
    const response = yield call(addPatient, patient);
    yield put( addPatientSuccess(response));
  } catch (error) {
    yield put(addPatientFail(error));
  }
}

function* onUpdatePatient({ payload: patient }) {
  try {
    const response = yield call(updatePatient, patient);
    if (response.success) yield put(updatePatientSuccess(patient));
    else yield put(updatePatientFail(ServerFail.UNSUCCESS_UPDATE));
  } catch (error) {
    yield put(updatePatientFail(error));
  }
}

function* onDisablePatient({ payload: guid }) {
  try {
    const response = yield call(disablePatient, { guid });
    if (response.success) yield put(disablePatientSuccess(guid));
    else yield put(disablePatientFail(ServerFail.UNSUCCESS_UPDATE));
  } catch (error) {
    yield put(disablePatientFail(error));
  }
}

function* onEnablePatient({ payload: guid }) {
  try {
    const response = yield call(enablePatient, { guid });
    if (response.success) yield put(enablePatientSuccess(guid));
    else put(enablePatientFail(ServerFail.UNSUCCESS_UPDATE));
  } catch (error) {
    yield put(enablePatientFail(error));
  }
}

//MY PATIENTS
function* onGetMyPatients({ payload }) {
  try {
    const { page, limit, search } = payload || {};
    // Only use paginated endpoint when page AND limit are explicitly provided
    const usePagination = page !== undefined && limit !== undefined;
    const response = yield call(
      getMyPatients,
      usePagination ? page : undefined,
      usePagination ? limit : undefined,
      search,
    );
    yield put(getMyPatientsSuccess(response));
  } catch (error) {
    yield put(getMyPatientsFail(error));
  }
}

function* onGetMyPatient({ payload: guid }) {
  try {
    const response = yield call(getMyPatient, guid);
    yield put(getMyPatientSuccess(response));
  } catch (error) {
    yield put(getMyPatientFail(error));
  }
}

function* onAddMyPatient({ payload: patient }) {
  try {
    const response = yield call(addMyPatient, patient);
    yield put(addMyPatientSuccess(response));
  } catch (error) {
    yield put(addMyPatientFail(error));
  }
}

function* onUpdateMyPatient({ payload: patient }) {
  try {
    const response = yield call(updateMyPatient, patient);
    if (response.success) yield put(updateMyPatientSuccess(patient));
    else yield put(updateMyPatientFail(ServerFail.UNSUCCESS_UPDATE));
  } catch (error) {
    yield put(updateMyPatientFail(error));
  }
}

function* onDisableMyPatient({ payload: guid }) {
  try {
    const response = yield call(disableMyPatient, { guid });
    if (response.success) yield put(disableMyPatientSuccess(guid));
    else yield put(disableMyPatientFail(ServerFail.UNSUCCESS_UPDATE));
  } catch (error) {
    yield put(disableMyPatientFail(error));
  }
}

function* onEnableMyPatient({ payload: guid }) {
  try {
    const response = yield call(enableMyPatient, { guid });
    if (response.success) yield put(enableMyPatientSuccess(guid));
    else put(enableMyPatientFail(ServerFail.UNSUCCESS_UPDATE));
  } catch (error) {
    yield put(enableMyPatientFail(error));
  }
}

//PATIENT TREATMENTS
function* onGetPatietTreatments({ payload: patient }) {
  try {
    const response = yield call(getPatientTreatments, patient);
    yield put(getPatientTreatmentsSuccess(response));
  } catch (error) {
    yield put(getPatientTreatmentsFail(error));
  }
}

function* onAddPatientTreatment({ payload: patient }) {
  try {
    const response = yield call(addPatientTreatment, patient);
    yield put(addPatientTreatmentSuccess(response));
  } catch (error) {
    yield put(addPatientTreatmentFail(error));
  }
}

function* onDisablePatientTreatment({ payload: guid }) {
  try {
    const response = yield call(disablePatientTreatment, { guid });
    if (response.success) yield put(disablePatientTreatmentSuccess(guid));
    else yield put(disablePatientTreatmentFail(ServerFail.UNSUCCESS_UPDATE));
  } catch (error) {
    yield put(disablePatientTreatmentFail(error));
  }
}

function* onEnablePatientTreatment({ payload: guid }) {
  try {
    const response = yield call(enablePatientTreatment, { guid });
    if (response.success) yield put(enablePatientTreatmentSuccess(guid));
    else put(enablePatientTreatmentFail(ServerFail.UNSUCCESS_UPDATE));
  } catch (error) {
    yield put(enablePatientTreatmentFail(error));
  }
}

function* onEndPatientTreatment({ payload: guid }) {
  try {
    const response = yield call(endPatientTreatment, { guid });
    if (response) yield put(endPatientTreatmentSuccess(response));
    else yield put(endPatientTreatmentFail(ServerFail.UNSUCCESS_UPDATE));
  } catch (error) {
    yield put(endPatientTreatmentFail(error));
  }
}

function* onStartPatientTreatment({ payload: guid }) {
  try {
    const response = yield call(startPatientTreatment, { guid });
    if (response) yield put(startPatientTreatmentSuccess(response));
    else put(startPatientTreatmentFail(ServerFail.UNSUCCESS_UPDATE));
  } catch (error) {
    yield put(startPatientTreatmentFail(error));
  }
}

function* onGetInterventionsByTreatment({ payload: treatment }) {
  try {
    const response = yield call(getInterventionsByTreatment, treatment);
    yield put(getInterventionsByTreatmentSuccess(response));
  } catch (error) {
    yield put(getInterventionsByTreatmentFail(error));
  }
}

function* patientsSaga() {
  //PATIENTS
  yield takeEvery(GET_PATIENT, onGetPatient);
  yield takeEvery(GET_PATIENTS, onGetPatients);
  yield takeEvery(ADD_PATIENT, onAddPatient);
  yield takeEvery(UPDATE_PATIENT, onUpdatePatient);
  yield takeEvery(DISABLE_PATIENT, onDisablePatient);
  yield takeEvery(ENABLE_PATIENT, onEnablePatient);

  //MY PATIENTS
  yield takeEvery(GET_MY_PATIENT, onGetMyPatient);
  yield takeEvery(GET_MY_PATIENTS, onGetMyPatients);
  yield takeEvery(ADD_MY_PATIENT, onAddMyPatient);
  yield takeEvery(UPDATE_MY_PATIENT, onUpdateMyPatient);
  yield takeEvery(DISABLE_MY_PATIENT, onDisableMyPatient);
  yield takeEvery(ENABLE_MY_PATIENT, onEnableMyPatient);

  //PATIENTS TREATMENTS
  yield takeEvery(GET_PATIENT_TREATMENTS, onGetPatietTreatments);
  yield takeEvery(ADD_PATIENT_TREATMENT, onAddPatientTreatment);
  yield takeEvery(DISABLE_PATIENT_TREATMENT, onDisablePatientTreatment);
  yield takeEvery(ENABLE_PATIENT_TREATMENT, onEnablePatientTreatment);
  yield takeEvery(END_PATIENT_TREATMENT, onEndPatientTreatment);
  yield takeEvery(START_PATIENT_TREATMENT, onStartPatientTreatment);
  yield takeEvery(GET_INTERVENTIONS_BY_TREATMENT, onGetInterventionsByTreatment);
}

export default patientsSaga;
