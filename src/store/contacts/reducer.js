import {
  GET_CONTACTS_SUCCESS,
  GET_CONTACTS_FAIL,
  ADD_CONTACT_SUCCESS,
  ADD_CONTACT_FAIL,
  UPDATE_CONTACT_SUCCESS,
  UPDATE_CONTACT_FAIL,
  DELETE_CONTACT_SUCCESS,
  DELETE_CONTACT_FAIL,
  GET_USER_PROFILE_SUCCESS,
  GET_USER_PROFILE_FAIL,
} from "./actionTypes"

const INIT_STATE = {
  users: [],
  userProfile: {},
  error: {},
}

const contacts = (state = INIT_STATE, action) => {
  switch (action.type) {
    case GET_CONTACTS_SUCCESS:
      return {
        ...state,
        users: action.payload,
      }

    case GET_CONTACTS_FAIL:
      return {
        ...state,
        error: action.payload,
      }

    case ADD_CONTACT_SUCCESS:

      return {
        ...state,
        users: [...state.users, action.payload],
      }

    case ADD_CONTACT_FAIL:
      return {
        ...state,
        error: action.payload,
      }

    case GET_USER_PROFILE_SUCCESS:
      return {
        ...state,
        userProfile: action.payload,
      }

      case UPDATE_CONTACT_SUCCESS:
        return {
          ...state,
          users: state.users.map(user =>
            user.id.toString() === action.payload.id.toString()
              ? { user, ...action.payload }
              : user
          ),
        }
  
      case UPDATE_CONTACT_FAIL:
        return {
          ...state,
          error: action.payload,
        }
  
      case DELETE_CONTACT_SUCCESS:
        return {
          ...state,
          users: state.users.filter(
            user => user.id.toString() !== action.payload.toString()
          ),
        }
  
      case DELETE_CONTACT_FAIL:
        return {
          ...state,
          error: action.payload,
        }

    case GET_USER_PROFILE_FAIL:
      return {
        ...state,
        error: action.payload,
      }

    default:
      return state
  }
}

export default contacts
