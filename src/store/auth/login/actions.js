import {
  LOGIN_USER,
  LOGIN_SUCCESS,
  LOGOUT_USER,
  LOGOUT_USER_SUCCESS,
  API_ERROR,
  LOGIN_SET_VERIFICATION_STEP,
  LOGIN_CLEAR_ERROR,
} from "./action-types"

export const loginUser = (user, history) => {
  return {
    type: LOGIN_USER,
    payload: { user, history },
  }
}

export const loginSuccess = user => {
  return {
    type: LOGIN_SUCCESS,
    payload: user,
  }
}

export const logoutUser = history => {
  return {
    type: LOGOUT_USER,
    payload: { history },
  }
}

export const logoutUserSuccess = () => {
  return {
    type: LOGOUT_USER_SUCCESS,
    payload: {},
  }
}

export const apiError = error => {
  return {
    type: API_ERROR,
    payload: error,
  }
}

/**
 * @param {{ message: string, index: number, total: number }} step
 */
export const setVerificationStep = (step) => {
  return {
    type: LOGIN_SET_VERIFICATION_STEP,
    payload: step,
  }
}

export const clearLoginError = () => {
  return {
    type: LOGIN_CLEAR_ERROR,
  }
}
