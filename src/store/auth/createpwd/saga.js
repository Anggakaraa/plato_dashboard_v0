import { call, put, takeEvery } from "redux-saga/effects";

import { CREATE_PASSWORD } from "./action-types";
import { createPasswordSuccess, createPasswordError } from "./actions";

import { createPassword } from "../../../api";
import { setToken } from "../../../storage/token";
import { removeFirstAccess } from "../../../storage/session";

function* createPwd({ payload: { data, navigate } }) {
  try {
    const response = yield call(createPassword, {
      password: data.password,
    });

    const { token } = response;

    // Update with a renewed token
    setToken(token);
    removeFirstAccess();
    yield put(createPasswordSuccess(token));

    navigate("/dashboard");
  } catch (error) {
    yield put(createPasswordError(error?.response?.data?.message || error?.message || "Failed to create password."));
  }
}

function* createPasswordSaga() {
  yield takeEvery(CREATE_PASSWORD, createPwd);
}

export default createPasswordSaga;
