import {
  CREATE_PASSWORD,
  CREATE_PASSWORD_SUCCESS,
  CREATE_PASSWORD_ERROR,
} from "./action-types"

export const createPassword = (data, navigate) => {
  return {
    type: CREATE_PASSWORD,
    payload: { data, navigate },
  }
}

export const createPasswordSuccess = data => {
  return {
    type: CREATE_PASSWORD_SUCCESS,
    payload: data,
  }
}

export const createPasswordError = error => {
  return {
    type: CREATE_PASSWORD_ERROR,
    payload: error,
  }
}
