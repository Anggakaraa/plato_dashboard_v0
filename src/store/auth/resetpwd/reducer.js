import {
  RESET_PASSWORD,
  RESET_PASSWORD_SUCCESS,
  RESET_PASSWORD_ERROR,
  CLEAN_RESET_PASSWORD,
} from "./actionTypes"

const initialState = {
  success: undefined,
  loading: false,
  error: undefined,
}

const resetPassword = (state = initialState, action) => {
  switch (action.type) {
    case RESET_PASSWORD:
      state = {
        ...state,
        loading: true,
        success: undefined,
        error: undefined,
      }
      break;
    case RESET_PASSWORD_SUCCESS:
      state = {
        ...state,
        success: action.payload,
        loading: false,
      }
      break
    case RESET_PASSWORD_ERROR:
      state = { 
        ...state, 
        error: action.payload,
        loading: false,
      }
      break;

    case CLEAN_RESET_PASSWORD:
      state = {
        ...state,
        success: undefined,
        loading: false,
        error: undefined,
      }; 

    default:
      state = { ...state }
      break;
  }
  return state;
}

export default resetPassword;
