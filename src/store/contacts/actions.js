import {
  GET_USER_PROFILE,
  GET_USER_PROFILE_FAIL,
  GET_USER_PROFILE_SUCCESS,
  GET_CONTACTS,
  GET_CONTACTS_FAIL,
  GET_CONTACTS_SUCCESS,
  ADD_NEW_CONTACT,
  ADD_CONTACT_SUCCESS,
  ADD_CONTACT_FAIL,
  UPDATE_CONTACT,
  UPDATE_CONTACT_SUCCESS,
  UPDATE_CONTACT_FAIL,
  DELETE_CONTACT,
  DELETE_CONTACT_SUCCESS,
  DELETE_CONTACT_FAIL,
} from "./actionTypes"

export const getUsers = () => ({
  type: GET_CONTACTS,
})

export const getUsersSuccess = users => ({
  type: GET_CONTACTS_SUCCESS,
  payload: users,
})

export const addNewUser = user => ({
  type: ADD_NEW_CONTACT,
  payload: user,
})

export const addUserSuccess = user => ({
  type: ADD_CONTACT_SUCCESS,
  payload: user,
})

export const addUserFail = error => ({
  type: ADD_CONTACT_FAIL,
  payload: error,
})

export const getUsersFail = error => ({
  type: GET_CONTACTS_FAIL,
  payload: error,
})

export const getUserProfile = () => ({
  type: GET_USER_PROFILE,
})

export const getUserProfileSuccess = userProfile => ({
  type: GET_USER_PROFILE_SUCCESS,
  payload: userProfile,
})

export const getUserProfileFail = error => ({
  type: GET_USER_PROFILE_FAIL,
  payload: error,
})

export const updateUser = user => ({
  type: UPDATE_CONTACT,
  payload: user,
})

export const updateUserSuccess = user => ({
  type: UPDATE_CONTACT_SUCCESS,
  payload: user,
})

export const updateUserFail = error => ({
  type: UPDATE_CONTACT_FAIL,
  payload: error,
})

export const deleteUser = user => ({
  type: DELETE_CONTACT,
  payload: user,
})

export const deleteUserSuccess = user => ({
  type: DELETE_CONTACT_SUCCESS,
  payload: user,
})

export const deleteUserFail = error => ({
  type: DELETE_CONTACT_FAIL,
  payload: error,
})
