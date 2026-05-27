import {
  FORGET_PASSWORD,
  FORGET_PASSWORD_SUCCESS,
  FORGET_PASSWORD_ERROR,
  CLEAN_FORGET_PASSWORD,
} from "./actionTypes"

const initialState = {
  success: undefined,
  loading: false,
  error: undefined,
}

const forgetPassword = (state = initialState, action) => {
  switch (action.type) {
    case FORGET_PASSWORD:
      state = {
        ...state,
        loading: true,
        success: undefined,
        error: undefined,
      }
      break;
    case FORGET_PASSWORD_SUCCESS:
      state = {
        ...state,
        success: action.payload,
        loading: false,
      }
      break
    case FORGET_PASSWORD_ERROR:
      state = { 
        ...state, 
        error: action.payload,
        loading: false,
      }
      break;

    case CLEAN_FORGET_PASSWORD:
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

export default forgetPassword;
