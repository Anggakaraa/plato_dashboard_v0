import { call, put, takeEvery } from "redux-saga/effects"
import { 
  ACTIVATE_CLINIC_CLINICIAN_RELATIONSHIP_BY,
  ADMIN_CLINIC_CLINICIAN_RELATIONSHIP_BY,
  CREATE_CLINIC_CLINICIAN_RELATIONSHIP_BY,
  DISABLE_CLINICIAN_BY, 
  ENABLE_CLINICIAN_BY, 
  GET_CLINICIAN_BY, 
  GET_CLINICIAN_CLINICS_BY,

  GET_CLINICIAN_BY_ADMIN,
  GET_CLINICIAN_CLINICS_BY_ADMIN,
  CREATE_CLINIC_CLINICIAN_RELATIONSHIP_BY_ADMIN,
  ACTIVATE_CLINIC_CLINICIAN_RELATIONSHIP_BY_ADMIN
} from "./actionTypes";

import {
  getClinicianSuccess,
  getClinicianFail,
  
  getClinicianClinicsBySuccess,
  getClinicianClinicsByFail,

  enableClinicianBySuccess,
  enableClinicianByFail,

  disableClinicianBySuccess,
  disableClinicianByFail,
  createClinicClinicianBySuccess,
  createClinicClinicianByFail,
  activateClinicClinicianBySuccess,
  activateClinicClinicianByFail,
  adminClinicClinicianBySuccess,
  adminClinicClinicianByFail,
  
  getClinicianByAdminSuccess,
  getClinicianByAdminFail,
  getClinicianClinicsByAdminSuccess,
  getClinicianClinicsByAdminFail,
  createClinicClinicianByAdminFail,
  createClinicClinicianByAdminSuccess,
  activateClinicClinicianByAdminFail,
  activateClinicClinicianByAdminSuccess,
} from "./actions";

import {
  ServerFail
} from "../../api/fail";

import { 
  addClinicClinicianBy, 
  disableClinicClinicianBy, 
  disableClinician,
  enableClinicClinicianBy,
  enableClinician, 
  getClinicianBy, 
  getClinicianClinicsBy,
  updateAdminClinicClinicianBy,
  updateNoAdminClinicClinicianBy  
} from "../../api/plato";

import {
  getClinicianByAdmin,
  getClinicianClinicsByAdmin,
  addClinicClinicianByAdmin,
  disableClinicClinicianByAdmin,
  enableClinicClinicianByAdmin
} from "../../api/clinician";

function* onGetClinician({ payload: guid }) {
  try {
    const response = yield call(getClinicianBy, guid);
    yield put(getClinicianSuccess(response));
  } catch (error) {
    yield put(getClinicianFail(error));
  }
}

function* onGetClinicianClinicsBy({ payload: data }) {
  try {
    const response = yield call(getClinicianClinicsBy, data);
    yield put(getClinicianClinicsBySuccess(response));
  } catch (error) {
    yield put(getClinicianClinicsByFail(error));
  }
}

function* onDisableClinicianBy({ payload: guid }) {
  try {
    const response = yield call(disableClinician, { guid });
    if (response.success) yield put(disableClinicianBySuccess(guid));
    else yield put(disableClinicianByFail(ServerFail.UNSUCCESS_UPDATE));
  } catch (error) {
    yield put(disableClinicianByFail(error));
  }
}

function* onEnableClinicianBy({ payload: guid }) {
  try {
    const response = yield call(enableClinician, { guid });
    if (response.success) yield put(enableClinicianBySuccess(guid));
    else yield put(enableClinicianByFail(ServerFail.UNSUCCESS_UPDATE));
  } catch (error) {
    yield put(enableClinicianByFail(error));
  }
}

function* onCreateClinicClinicianBy({ payload: data }) {
  try {
    const response = yield call(addClinicClinicianBy, data);
    yield put(createClinicClinicianBySuccess(response));
  } catch (error) {
    yield put(createClinicClinicianByFail(error));
  }
}

function* onActivateClinicClinicianBy({ payload: data }) {
  try {
    let response = null;
    if (data.disabled) {
      response = yield call(disableClinicClinicianBy, { guid: data.guid });
    } else {
      response = yield call(enableClinicClinicianBy, { guid: data.guid });
    }
    
    if (response.success) yield put(activateClinicClinicianBySuccess(data));
    else yield put(activateClinicClinicianByFail(ServerFail.UNSUCCESS_UPDATE));
  } catch (error) {
    yield put(activateClinicClinicianByFail(error));
  }
}

function* onAdminClinicClinicianBy({ payload: data }) {
  try {
    let response = null;
    if (data.admin) {
      response = yield call(updateAdminClinicClinicianBy, { guid: data.guid });
    } else {
      response = yield call(updateNoAdminClinicClinicianBy, { guid: data.guid });
    }
    
    if (response.success) yield put(adminClinicClinicianBySuccess(data));
    else yield put(adminClinicClinicianByFail(ServerFail.UNSUCCESS_UPDATE));
  } catch (error) {
    yield put(adminClinicClinicianByFail(error));
  }
}

/**
 * Clinician admin
 */
function* onGetClinicianByAdmin({ payload: guid }) {
  try {
    const response = yield call(getClinicianByAdmin, guid);
    yield put(getClinicianByAdminSuccess(response));
  } catch (error) {
    yield put(getClinicianByAdminFail(error));
  }
}

function* onGetClinicianClinicsByAdmin({ payload: data }) {
  try {
    const response = yield call(getClinicianClinicsByAdmin, data);
    yield put(getClinicianClinicsByAdminSuccess(response));
  } catch (error) {
    yield put(getClinicianClinicsByAdminFail(error));
  }
}

function* onCreateClinicClinicianByAdmin({ payload: data }) {
  try {
    const response = yield call(addClinicClinicianByAdmin, data);
    yield put(createClinicClinicianByAdminSuccess(response));
  } catch (error) {
    yield put(createClinicClinicianByAdminFail(error));
  }
}

function* onActivateClinicClinicianByAdmin({ payload: data }) {
  try {
    let response = null;
    if (data.disabled) {
      response = yield call(disableClinicClinicianByAdmin, { guid: data.guid });
    } else {
      response = yield call(enableClinicClinicianByAdmin, { guid: data.guid });
    }
    
    if (response.success) yield put(activateClinicClinicianByAdminSuccess(data));
    else yield put(activateClinicClinicianByAdminFail(ServerFail.UNSUCCESS_UPDATE));
  } catch (error) {
    yield put(activateClinicClinicianByAdminFail(error));
  }
}

function* clinicsSaga() {
  yield takeEvery(GET_CLINICIAN_BY, onGetClinician);
  yield takeEvery(GET_CLINICIAN_CLINICS_BY, onGetClinicianClinicsBy);
  yield takeEvery(DISABLE_CLINICIAN_BY, onDisableClinicianBy);
  yield takeEvery(ENABLE_CLINICIAN_BY, onEnableClinicianBy);

  yield takeEvery(CREATE_CLINIC_CLINICIAN_RELATIONSHIP_BY, onCreateClinicClinicianBy);
  yield takeEvery(ACTIVATE_CLINIC_CLINICIAN_RELATIONSHIP_BY, onActivateClinicClinicianBy);
  yield takeEvery(ADMIN_CLINIC_CLINICIAN_RELATIONSHIP_BY, onAdminClinicClinicianBy);

  yield takeEvery(GET_CLINICIAN_BY_ADMIN, onGetClinicianByAdmin);
  yield takeEvery(GET_CLINICIAN_CLINICS_BY_ADMIN, onGetClinicianClinicsByAdmin);
  yield takeEvery(CREATE_CLINIC_CLINICIAN_RELATIONSHIP_BY_ADMIN, onCreateClinicClinicianByAdmin);
  yield takeEvery(ACTIVATE_CLINIC_CLINICIAN_RELATIONSHIP_BY_ADMIN, onActivateClinicClinicianByAdmin);
}

export default clinicsSaga;
