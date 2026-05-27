import { call, put, take, takeEvery, takeLatest } from "redux-saga/effects";
import {
  GET_STIMULATIONS,
  GET_STIMULATION,
  ADD_STIMULATION,
  UPDATE_STIMULATION,
  DISABLE_STIMULATION,
  ENABLE_STIMULATION,
  GET_CLINIC_STIMULATIONS,
  GET_CLINIC_STIMULATION,
  ADD_CLINIC_STIMULATION,
  UPDATE_CLINIC_STIMULATION,
  DISABLE_CLINIC_STIMULATION,
  ENABLE_CLINIC_STIMULATION,
  GET_LIVE_STIMULATION
} from "./actionTypes";

import { ServerFail } from "../../api/fail";

import {
  //STIMULATIONS
  getStimulationSuccess,
  getStimulationFail,
  getStimulationsSuccess,
  getStimulationsFail,
  addStimulationSuccess,
  addStimulationFail,
  updateStimulationSuccess,
  updateStimulationFail,
  disableStimulationSuccess,
  disableStimulationFail,
  enableStimulationSuccess,
  enableStimulationFail,

  //CLINIC STIMULATIONS
  getClinicStimulationSuccess,
  getClinicStimulationFail,
  getClinicStimulationsSuccess,
  getClinicStimulationsFail,
  addClinicStimulationSuccess,
  addClinicStimulationFail,
  updateClinicStimulationSuccess,
  updateClinicStimulationFail,
  disableClinicStimulationSuccess,
  disableClinicStimulationFail,
  enableClinicStimulationSuccess,
  enableClinicStimulationFail,
  getLiveStimulationsSuccess,
  getLiveStimulationsFail,
  getLiveStimulations
} from "./actions";

import {
  getClinicStimulations,
  getClinicStimulation,
  addClinicStimulation,
  updateClinicStimulation,
  disableClinicStimulation,
  enableClinicStimulation,
} from "../../api";

import {
  getStimulations,
  getStimulation,
  addStimulation,
  updateStimulation,
  disableStimulation,
  enableStimulation,
  getLiveEventsList
} from "../../api/plato";
import { subscribeToSSE } from "../../util/sse.util";
//import { sleep } from "../../util/time";

//STIMULATIONS

function* onGetLiveStimulations() {
  try {
    //yield put(getLiveStimulations);
    const url = import.meta.env.VITE_APP_GATEWAY_URL;
    //const eventSrc = new EventSource(url+'/notifications/sse/subscribe/plato/sessions/all')
    const response = yield call(getLiveEventsList, eventSrc);
    while (true) {
      const event = yield take(response);
      if(event.data){
        const data = JSON.parse(event.data);
        yield put(getLiveStimulationsSuccess(data));
      }
    }
  } catch (error) {
    yield put(getLiveStimulationsFail(error));
  }
}

function* onGetLiveStimulationsList() {
  try {
    const response = yield call(getLiveEventsList);
    yield put(getLiveStimulationsSuccess(response));
  } catch (error) {
    yield put(getLiveStimulationsFail(error));
  }
}

function* onGetStimulations() {
  try {
    const response = yield call(getStimulations);
    yield put(getStimulationsSuccess(response));
  } catch (error) {
    yield put(getStimulationsFail(error));
  }
}

function* onGetStimulation({ payload: guid }) {
  try {
    const response = yield call(getStimulation, guid);
    yield put(getStimulationSuccess(response));
  } catch (error) {
    yield put(getStimulationFail(error));
  }
}

function* onAddStimulation({ payload: { stimulation, history } }) {
  try {
    const response = yield call(addStimulation, stimulation);
    yield put(addStimulationSuccess(response));

    history('/stimulations');
  } catch (error) {
    yield put(addStimulationFail(error));
  }
}

function* onUpdateStimulation({ payload: { stimulation, history } }) {
  try {
    const response = yield call(updateStimulation, stimulation);
    if (response.success) yield put(updateStimulationSuccess(stimulation));
    else yield put(updateStimulationFail(ServerFail.UNSUCCESS_UPDATE));

    history('/stimulations');
  } catch (error) {
    yield put(updateStimulationFail(error));
  }
}

function* onDisableStimulation({ payload: guid }) {
  try {
    const response = yield call(disableStimulation, { guid });
    if (response.success) yield put(disableStimulationSuccess(guid));
    else yield put(disableStimulationFail(ServerFail.UNSUCCESS_UPDATE));
  } catch (error) {
    yield put(disableStimulationFail(error));
  }
}

function* onEnableStimulation({ payload: guid }) {
  try {
    const response = yield call(enableStimulation, { guid });
    if (response.success) yield put(enableStimulationSuccess(guid));
    else put(enableStimulationFail(ServerFail.UNSUCCESS_UPDATE));
  } catch (error) {
    yield put(enableStimulationFail(error));
  }
}

//CLINIC STIMULATIONS
function* onGetClinicStimulations({ payload: clinic }) {
  try {
    const response = yield call(getClinicStimulations, clinic);
    yield put(getClinicStimulationsSuccess(response));
  } catch (error) {
    yield put(getClinicStimulationsFail(error));
  }
}

function* onGetClinicStimulation({ payload: guid }) {
  try {
    const response = yield call(getClinicStimulation, guid);
    yield put(getClinicStimulationSuccess(response));
  } catch (error) {
    yield put(getClinicStimulationFail(error));
  }
}

function* onAddClinicStimulation({ payload: { stimulation, history } }) {
  try {
    const response = yield call(addClinicStimulation, stimulation);
    yield put(addClinicStimulationSuccess(response));

    history('/stimulations');
  } catch (error) {
    yield put(addClinicStimulationFail(error));
  }
}

function* onUpdateClinicStimulation({ payload: { stimulation, history } }) {
  try {
    const response = yield call(updateClinicStimulation, stimulation);
    if (response.success) yield put(updateClinicStimulationSuccess(stimulation));
    else yield put(updateClinicStimulationFail(ServerFail.UNSUCCESS_UPDATE));
    history('/stimulations');
  } catch (error) {
    yield put(updateClinicStimulationFail(error));
  }
}

function* onDisableClinicStimulation({ payload: { guid, clinic } }) {
  try {
    const response = yield call(disableClinicStimulation, { guid, clinic });
    if (response.success) yield put(disableClinicStimulationSuccess(guid));
    else yield put(disableClinicStimulationFail(ServerFail.UNSUCCESS_UPDATE));
  } catch (error) {
    yield put(disableClinicStimulationFail(error));
  }
}

function* onEnableClinicStimulation({ payload: { guid, clinic } }) {
  try {
    const response = yield call(enableClinicStimulation, { guid, clinic });
    if (response.success) yield put(enableClinicStimulationSuccess(guid));
    else put(enableClinicStimulationFail(ServerFail.UNSUCCESS_UPDATE));
  } catch (error) {
    yield put(enableClinicStimulationFail(error));
  }
}

function* stimulationsSaga() {
  //STIMULATIONS
  yield takeEvery(GET_STIMULATIONS, onGetStimulations);
  yield takeEvery(GET_STIMULATION, onGetStimulation);
  yield takeLatest(GET_LIVE_STIMULATION, onGetLiveStimulations);
  yield takeLatest(GET_LIVE_STIMULATION, onGetLiveStimulationsList);
  yield takeEvery(ADD_STIMULATION, onAddStimulation);
  yield takeEvery(UPDATE_STIMULATION, onUpdateStimulation);
  yield takeEvery(DISABLE_STIMULATION, onDisableStimulation);
  yield takeEvery(ENABLE_STIMULATION, onEnableStimulation);

  //CLINIC STIMULATIONS
  yield takeEvery(GET_CLINIC_STIMULATIONS, onGetClinicStimulations);
  yield takeEvery(GET_CLINIC_STIMULATION, onGetClinicStimulation);
  yield takeEvery(ADD_CLINIC_STIMULATION, onAddClinicStimulation);
  yield takeEvery(UPDATE_CLINIC_STIMULATION, onUpdateClinicStimulation);
  yield takeEvery(DISABLE_CLINIC_STIMULATION, onDisableClinicStimulation);
  yield takeEvery(ENABLE_CLINIC_STIMULATION, onEnableClinicStimulation);
}

export default stimulationsSaga;
