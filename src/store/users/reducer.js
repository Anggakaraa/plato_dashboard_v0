import {
  //USERS
  GET_USERS,
  GET_USERS_SUCCESS,
  GET_USERS_FAIL,
  ADD_USER,
  ADD_USER_SUCCESS,
  ADD_USER_FAIL,
  UPDATE_USER,
  UPDATE_USER_SUCCESS,
  UPDATE_USER_FAIL,
  DISABLE_USER,
  DISABLE_USER_SUCCESS,
  DISABLE_USER_FAIL,
  ENABLE_USER,
  ENABLE_USER_SUCCESS,
  ENABLE_USER_FAIL,

  //USER TYPES
  GET_USER_TYPES,
  GET_USER_TYPES_SUCCESS,
  GET_USER_TYPES_FAIL,

  //PLATO USERS
  GET_PLATO_USERS,
  GET_PLATO_USERS_SUCCESS,
  GET_PLATO_USERS_FAIL,
  ADD_PLATO_USER_SUCCESS,
  ADD_PLATO_USER_FAIL,
  UPDATE_PLATO_USER_SUCCESS,
  UPDATE_PLATO_USER_FAIL,
  DISABLE_PLATO_USER_SUCCESS,
  DISABLE_PLATO_USER_FAIL,
  ENABLE_PLATO_USER_SUCCESS,
  ENABLE_PLATO_USER_FAIL,

  //CLINICIAN USERS
  GET_CLINICIANS,
  GET_CLINICIANS_SUCCESS,
  GET_CLINICIANS_FAIL,
  ADD_CLINICIAN_USER_SUCCESS,
  ADD_CLINICIAN_USER_FAIL,
  UPDATE_CLINICIAN_USER_SUCCESS,
  UPDATE_CLINICIAN_USER_FAIL,
  DISABLE_CLINICIAN_USER_SUCCESS,
  DISABLE_CLINICIAN_USER_FAIL,
  ENABLE_CLINICIAN_USER_SUCCESS,
  ENABLE_CLINICIAN_USER_FAIL,

  //MY CLINICIANS
  GET_MY_CLINICIANS,
  GET_MY_CLINICIANS_SUCCESS,
  GET_MY_CLINICIANS_FAIL,
  ADD_MY_CLINICIAN_SUCCESS,
  ADD_MY_CLINICIAN_FAIL,
  UPDATE_MY_CLINICIAN_SUCCESS,
  UPDATE_MY_CLINICIAN_FAIL,
  DISABLE_MY_CLINICIAN_SUCCESS,
  DISABLE_MY_CLINICIAN_FAIL,
  ENABLE_MY_CLINICIAN_SUCCESS,
  ENABLE_MY_CLINICIAN_FAIL,
  CHECK_CLINICIAN_ADMIN,
  CHECK_CLINICIAN_ADMIN_SUCCESS,
  CHECK_CLINICIAN_ADMIN_FAIL,
  GET_CLINICIANS_BY_CLINIC,
  GET_CLINICIANS_BY_CLINIC_SUCCESS,
  GET_CLINICIANS_BY_CLINIC_FAIL,
  CLEAR_USERS_ERROR,
  CLEAR_CLINICIANS,
} from "./actionTypes";

const INIT_STATE = {
  user_types: [],
  users: [],
  plato_users: [],
  clinician_users: [],
  my_clinicians: [],
  is_admin: false,
  loading: false,
  error: undefined,
};

const changeUserAtState = (guid, allUsers, disabled) => {
  return allUsers.map((user) => {
    if (user.guid.toString() === guid) {
      user.disabled = disabled;
    }
    return user;
  });
};

const updateUserAtState = (userUpdated, allUsers) => {
  return allUsers.map((user) => {
    if (user.guid.toString() === userUpdated.guid) {
      return {
        ...user,
        ...userUpdated,
      };
    }
    return user;
  });
};

const users = (state = INIT_STATE, action) => {
  switch (action.type) {
    case CHECK_CLINICIAN_ADMIN_SUCCESS:
      return {
        ...state,
        is_admin: action.payload,
      };

    case CHECK_CLINICIAN_ADMIN_FAIL:
      return {
        ...state,
        is_admin: false,
        error: action.payload,
      };

    //MY CLINICIANS
    case GET_MY_CLINICIANS:
      return {
        ...state,
        loading: true,
      };

    case GET_MY_CLINICIANS_SUCCESS:
      return {
        ...state,
        my_clinicians: action.payload,
        loading: false,
      };

    case GET_MY_CLINICIANS_FAIL:
      return {
        ...state,
        error: action.payload,
        loading: false,
      };

    case ADD_MY_CLINICIAN_SUCCESS:
      return {
        ...state,
        my_clinicians: [...state.my_clinicians, action.payload],
      };

    case ADD_MY_CLINICIAN_FAIL:
      return {
        ...state,
        error: action.payload,
      };

    case UPDATE_MY_CLINICIAN_SUCCESS:
      return {
        ...state,
        my_clinicians: updateUserAtState(action.payload, state.my_clinicians),
      };

    case UPDATE_MY_CLINICIAN_FAIL:
      return {
        ...state,
        error: action.payload,
      };

    case DISABLE_MY_CLINICIAN_SUCCESS:
      return {
        ...state,
        my_clinicians: changeUserAtState(
          action.payload.toString(),
          state.my_clinicians,
          true
        ),
      };

    case DISABLE_MY_CLINICIAN_FAIL:
      return {
        ...state,
        error: action.payload,
      };

    case ENABLE_MY_CLINICIAN_SUCCESS:
      return {
        ...state,
        my_clinicians: changeUserAtState(
          action.payload.toString(),
          state.my_clinicians,
          false
        ),
      };

    case ENABLE_MY_CLINICIAN_FAIL:
      return {
        ...state,
        error: action.payload,
      };

    //USER TYPES
    case GET_USER_TYPES_SUCCESS:
      return {
        ...state,
        user_types: action.payload,
      };

    case GET_USER_TYPES_FAIL:
      return {
        ...state,
        error: action.payload,
      };

    //CLINICIANS USERS
    case GET_CLINICIANS:
      return {
        ...state,
        loading: true,
      };

    case GET_CLINICIANS_SUCCESS:
      return {
        ...state,
        clinician_users: action.payload,
        loading: false,
      };

    case GET_CLINICIANS_FAIL:
      return {
        ...state,
        error: action.payload,
        loading: false,
      };

    case GET_CLINICIANS_BY_CLINIC:
      return {
        ...state,
        loading: true,
      };

    case GET_CLINICIANS_BY_CLINIC_SUCCESS:
      return {
        ...state,
        clinician_users: action.payload,
        loading: false,
      };

    case GET_CLINICIANS_BY_CLINIC_FAIL:
      return {
        ...state,
        error: action.payload,
        loading: false,
      };

    case ADD_CLINICIAN_USER_SUCCESS:
      return {
        ...state,
        clinician_users: [...state.clinician_users, action.payload],
      };

    case ADD_CLINICIAN_USER_FAIL:
      return {
        ...state,
        error: action.payload,
      };

    case UPDATE_CLINICIAN_USER_SUCCESS:
      return {
        ...state,
        clinician_users: updateUserAtState(
          action.payload,
          state.clinician_users
        ),
      };

    case UPDATE_CLINICIAN_USER_FAIL:
      return {
        ...state,
        error: action.payload,
      };

    case DISABLE_CLINICIAN_USER_SUCCESS:
      return {
        ...state,
        clinician_users: changeUserAtState(
          action.payload.toString(),
          state.clinician_users,
          true
        ),
      };

    case DISABLE_CLINICIAN_USER_FAIL:
      return {
        ...state,
        error: action.payload,
      };

    case ENABLE_CLINICIAN_USER_SUCCESS:
      return {
        ...state,
        clinician_users: changeUserAtState(
          action.payload.toString(),
          state.clinician_users,
          false
        ),
      };

    case ENABLE_CLINICIAN_USER_FAIL:
      return {
        ...state,
        error: action.payload,
      };

    //PLATO USERS
    case GET_PLATO_USERS:
      return {
        ...state,
        loading: true,
      };

    case GET_PLATO_USERS_SUCCESS:
      return {
        ...state,
        plato_users: action.payload,
        loading: false,
      };

    case GET_PLATO_USERS_FAIL:
      return {
        ...state,
        error: action.payload,
        loading: false,
      };

    case ADD_PLATO_USER_SUCCESS:
      return {
        ...state,
        plato_users: [...state.plato_users, action.payload],
      };

    case ADD_PLATO_USER_FAIL:
      return {
        ...state,
        error: action.payload,
      };

    case UPDATE_PLATO_USER_SUCCESS:
      return {
        ...state,
        plato_users: updateUserAtState(action.payload, state.plato_users),
      };

    case UPDATE_PLATO_USER_FAIL:
      return {
        ...state,
        error: action.payload,
      };

    case DISABLE_PLATO_USER_SUCCESS:
      return {
        ...state,
        plato_users: changeUserAtState(
          action.payload.toString(),
          state.plato_users,
          true
        ),
      };

    case DISABLE_PLATO_USER_FAIL:
      return {
        ...state,
        error: action.payload,
      };

    case ENABLE_PLATO_USER_SUCCESS:
      return {
        ...state,
        plato_users: changeUserAtState(
          action.payload.toString(),
          state.plato_users,
          false
        ),
      };

    case ENABLE_PLATO_USER_FAIL:
      return {
        ...state,
        error: action.payload,
      };

    //USERS
    case GET_USERS_SUCCESS:
      return {
        ...state,
        users: action.payload,
      };

    case GET_USERS_FAIL:
      return {
        ...state,
        error: action.payload,
      };

    case ADD_USER_SUCCESS:
      return {
        ...state,
        users: [...state.users, action.payload],
      };

    case ADD_USER_FAIL:
      return {
        ...state,
        error: action.payload,
      };

    case UPDATE_USER_SUCCESS:
      return {
        ...state,
        users: updateUserAtState(action.payload, state.users),
      };

    case UPDATE_USER_FAIL:
      return {
        ...state,
        error: action.payload,
      };

    case DISABLE_USER_SUCCESS:
      return {
        ...state,
        users: changeUserAtState(action.payload.toString(), state.users, true),
      };

    case DISABLE_USER_FAIL:
      return {
        ...state,
        error: action.payload,
      };

    case ENABLE_USER_SUCCESS:
      return {
        ...state,
        users: changeUserAtState(action.payload.toString(), state.users, false),
      };

    case ENABLE_USER_FAIL:
      return {
        ...state,
        error: action.payload,
      };

    case CLEAR_USERS_ERROR:
      return {
        ...state,
        error: undefined,
      };
      
    case CLEAR_CLINICIANS:
      return {
        ...state,
        clinician_users: [],
        loading: false,
      };

    default:
      return state;
  }
};

export default users;
