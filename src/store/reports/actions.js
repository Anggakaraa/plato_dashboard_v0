import {
  /**
   * USER REPORTS
   */
  GET_USER_REPORTS,
  GET_USER_REPORTS_SUCCESS,
  GET_USER_REPORTS_FAIL,

  GET_USER_REPORTS_LIST,
  GET_USER_REPORTS_LIST_SUCCESS,
  GET_USER_REPORTS_LIST_FAIL,

  GET_CHART_REPORTS_LIST,
  GET_CHART_REPORTS_LIST_SUCCESS,
  GET_CHART_REPORTS_LIST_FAIL
  

} from "./actionTypes";


//REPORTS
export const getUserReports = (guid) => ({type: GET_USER_REPORTS, payload: guid});

export const getUserReportsSuccess = reports => ({
  type: GET_USER_REPORTS_SUCCESS,
  payload: reports,
});

export const getUserReportsFail = error => ({
  type: GET_USER_REPORTS_FAIL,
  payload: error,
});

export const getUserReportsList = (guid) => ({type: GET_USER_REPORTS_LIST, payload: guid});

export const getUserReportsListSuccess = reports => ({
  type: GET_USER_REPORTS_LIST_SUCCESS,
  payload: reports,
});

export const getUserReportsListFail = error => ({
  type: GET_USER_REPORTS_LIST_FAIL,
  payload: error,
});

//Session Reports for Charts
export const getSessionReportsListSuccess = reports => ({
  type: GET_CHART_REPORTS_LIST_SUCCESS,
  payload: reports,
});

export const getSessionReportsListFail = error => ({
  type: GET_CHART_REPORTS_LIST_FAIL,
  payload: error,
});

export const getSessionReportsList = () => ({type: GET_CHART_REPORTS_LIST});





