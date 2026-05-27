import { call, put, takeEvery } from "redux-saga/effects";

import { LOGIN_USER, LOGOUT_USER } from "./action-types";
import { apiError, loginSuccess, logoutUserSuccess, setVerificationStep } from "./actions";

import { signIn, signOut } from "../../../api";
import { removeToken, setToken, getDecodedToken } from "../../../storage/token";
import { setFirstAccess } from "../../../storage/session";
import { isClinicianUser, isPlatoUser } from "../../../model/user-type";

// Helper function to create a delay
const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

const STEPS = {
  AUTHENTICATING: { message: "Authenticating credentials...", index: 1, total: 3 },
  VERIFYING_TYPE:  { message: "Verifying access type...", index: 2, total: 3 },
  PLATO_ENV:       { message: "Setting up Plato environment...", index: 3, total: 3 },
  CLINIC_ENV:      { message: "Preparing clinical access...", index: 3, total: 3 },
};

function* loginUser({ payload: { user, history } }) {
  try {
    // Step 1 — before API call
    yield put(setVerificationStep(STEPS.AUTHENTICATING));
    const response = yield call(signIn, { 
      email: user.email,
      password: user.password,
    });
    
    const { token, firstAccess } = response;
    
    setToken(token);
    setFirstAccess(firstAccess);
    
    yield put(loginSuccess(token));

    // Step 2 — token received, decoding user type
    yield put(setVerificationStep(STEPS.VERIFYING_TYPE));
    yield call(delay, 1500);
    
    const decodedToken = getDecodedToken();
    const userType = decodedToken?.user?.type;

    // Step 3 — personalised message by user type
    if (isClinicianUser(userType)) {
      yield put(setVerificationStep(STEPS.CLINIC_ENV));
    } else {
      yield put(setVerificationStep(STEPS.PLATO_ENV));
    }
    yield call(delay, 1100);
    
    // Redirect based on user type
    if (isClinicianUser(userType)) {
      history('/gate/home');
    } else if (isPlatoUser(userType)) {
      history('/dashboard');
    } else {
      history('/dashboard');
    }
  } catch (error) {
    yield put(apiError(error));
  }
}

function* logoutUser({ payload: { history } }) {
  try {
    const response = yield call(signOut);
    
    removeToken();
    yield put(logoutUserSuccess(response));

    // Delay para transição suave no logout
    yield call(delay, 300);
    
    history('/login');
  } catch (error) {
    yield put(apiError(error));
  }
}

function* authSaga() {
  yield takeEvery(LOGIN_USER, loginUser);
  yield takeEvery(LOGOUT_USER, logoutUser);
}

export default authSaga;
