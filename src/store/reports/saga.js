import { call, put, takeEvery } from "redux-saga/effects"
import { 
  GET_CHART_REPORTS_LIST,
  GET_USER_REPORTS,
  GET_USER_REPORTS_LIST
  
} from "./actionTypes";

import { ServerFail } from '../../api/fail';

import {

  getUserReportsSuccess,
  getUserReportsFail,
  getUserReportsListSuccess,
  getUserReportsListFail,
  getSessionReportsListSuccess,
  getSessionReportsListFail
  
} from "./actions";

import { 
  getCountUserReports,
  getSessionReports,
  getUserReports
} from "../../api/plato";



//Count Reports
function* onGetUserReports({payload: guid}) {
  try {
    const response = yield call(getCountUserReports, guid);
    yield put(getUserReportsSuccess(response));
  } catch (error) {
    yield put(getUserReportsFail(error));
  }
}

//Reports List
function* onGetUserReportsList({payload: guid}) {
  try {
    const response = yield call(getUserReports, guid);
    yield put(getUserReportsListSuccess(response));
  } catch (error) {
    yield put(getUserReportsListFail(error));
  }
}

//Sessions Reports List
function* onGetSessionReportsList({payload: guid}) {
  try {
    const response = yield call(getSessionReports, guid);
    yield put(getSessionReportsListSuccess(response));
  } catch (error) {
    yield put(getSessionReportsListFail(error));
  }
}


function* reportsSaga() {
  //REPORTS
  yield takeEvery(GET_USER_REPORTS, onGetUserReports);
  yield takeEvery(GET_USER_REPORTS_LIST, onGetUserReportsList);
  yield takeEvery(GET_CHART_REPORTS_LIST, onGetSessionReportsList)
}

export default reportsSaga;
