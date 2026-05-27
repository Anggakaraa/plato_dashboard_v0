import {
  //PLATO USERS
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

const INIT_STATE = {
  count_reports: 0,
  reports_list: [],
  chart_reports: [],
  is_admin: false,
  loading: false,
  error: undefined,
};



const user_reports = (state = INIT_STATE, action) => {
  switch (action.type) {
    
    case GET_USER_REPORTS:
      return {
        ...state,
        loading: true,
      };

    case GET_USER_REPORTS_SUCCESS:
      return {
        ...state,
        count_reports: action.payload,
        loading: false,
      };

    case GET_USER_REPORTS_FAIL:
      return {
        ...state,
        error: action.payload,
        loading: false,
      };

      case GET_USER_REPORTS_LIST:
        return {
          ...state,
          loading: true,
        };
  
      case GET_USER_REPORTS_LIST_SUCCESS:
        return {
          ...state,
          reports_list: action.payload,
          loading: false,
        };
  
      case GET_USER_REPORTS_LIST_FAIL:
        return {
          ...state,
          error: action.payload,
          loading: false,
        };

      case GET_CHART_REPORTS_LIST:
        return {
          ...state,
          loading: true,
        };
  
      case GET_CHART_REPORTS_LIST_SUCCESS:
        return {
          ...state,
          chart_reports: action.payload,
          loading: false,
        };
  
      case GET_CHART_REPORTS_LIST_FAIL:
        return {
          ...state,
          error: action.payload,
          loading: false,
        };


    default:
      return state;
  }
};

export default user_reports;
