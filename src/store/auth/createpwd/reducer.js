import {
  CREATE_PASSWORD,
  CREATE_PASSWORD_SUCCESS,
  CREATE_PASSWORD_ERROR,
} from "./action-types"

const initialState = {
  loading: false,
  error: undefined,
}

const createPassword = (state = initialState, action) => {
  switch (action.type) {
    case CREATE_PASSWORD:
      state = {
        ...state,
        loading: true,
      }
      break
      
    case CREATE_PASSWORD_SUCCESS:
      state = {
        ...state,
        loading: false,
      }
      break

    case CREATE_PASSWORD_ERROR:
      state = { ...state, error: action.payload, loading: false }
      break

    default:
      state = { ...state }
      break
  }
  return state
}

export default createPassword
