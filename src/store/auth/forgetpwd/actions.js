import {
  FORGET_PASSWORD,
  FORGET_PASSWORD_SUCCESS,
  FORGET_PASSWORD_ERROR,
  CLEAN_FORGET_PASSWORD,
} from "./actionTypes"

export const forgetPassword = email => {
  return {
    type: FORGET_PASSWORD,
    payload: { email },
  }
}

export const forgetPasswordSuccess = success => {
  return {
    type: FORGET_PASSWORD_SUCCESS,
    payload: success,
  }
}

export const forgetPasswordError = error => {
  return {
    type: FORGET_PASSWORD_ERROR,
    payload: error,
  }
}

export const cleanForgetPassword = () => {
  return { type: CLEAN_FORGET_PASSWORD };
}
