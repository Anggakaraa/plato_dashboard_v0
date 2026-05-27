import { takeEvery, put, call } from "redux-saga/effects"

import { FORGET_PASSWORD } from "./actionTypes";

import { 
  forgetPasswordSuccess, 
  forgetPasswordError 
} from "./actions";

import { ServerFail } from "../../../api/fail";
import { forgetPassword } from "../../../api";

function* onForgetPassword({ payload: { email } }) {
  try {
    const response = yield call(forgetPassword, { email });
    if (response.success) yield put(forgetPasswordSuccess(true));
    else yield put(forgetPasswordError(ServerFail.UNSUCCESS_POST));
  } catch (error) {
    yield put(forgetPasswordError(error));
  }
}

function* forgetPasswordSaga() {
  yield takeEvery(FORGET_PASSWORD, onForgetPassword);
}

export default forgetPasswordSaga;
