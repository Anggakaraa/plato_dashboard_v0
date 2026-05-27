import {
  RESET_PASSWORD,
  RESET_PASSWORD_SUCCESS,
  RESET_PASSWORD_ERROR,
  CLEAN_RESET_PASSWORD,
} from "./actionTypes"

export const resetPassword = (token, password, history) => {
  return {
    type: RESET_PASSWORD,
    payload: { token, password, history },
  }
}

export const resetPasswordSuccess = success => {
  return {
    type: RESET_PASSWORD_SUCCESS,
    payload: success,
  }
}

export const resetPasswordError = error => {
  return {
    type: RESET_PASSWORD_ERROR,
    payload: error,
  }
}

export const cleanResetPassword = () => {
  return { type: CLEAN_RESET_PASSWORD };
}
