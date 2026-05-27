import {
  LOGIN_USER,
  LOGIN_SUCCESS,
  LOGOUT_USER,
  LOGOUT_USER_SUCCESS,
  API_ERROR,
  LOGIN_SET_VERIFICATION_STEP,
  LOGIN_CLEAR_ERROR,
} from "./action-types"

const initialState = {
  error: "",
  loading: false,
  success: false,
  verificationStep: null,
}

const login = (state = initialState, action) => {
  switch (action.type) {
    case LOGIN_USER:
      return { ...state, loading: true, error: "", verificationStep: null };
    case LOGIN_SET_VERIFICATION_STEP:
      return { ...state, verificationStep: action.payload };
    case LOGIN_SUCCESS:
      return { ...state, loading: false, success: true, token: action.payload, verificationStep: null };
    case LOGOUT_USER:
      return { ...state };
    case LOGOUT_USER_SUCCESS:
      return { ...state, loading: false, success: false, token: undefined, verificationStep: null };
    case API_ERROR:
      return { ...state, error: action.payload, loading: false, verificationStep: null };
    case LOGIN_CLEAR_ERROR:
      return { ...state, error: "" };
    default:
      return state;
  }
}

export default login;
