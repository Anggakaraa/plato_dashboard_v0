import { takeEvery, put, call } from "redux-saga/effects"

import { RESET_PASSWORD } from "./actionTypes";

import { 
  resetPasswordSuccess, 
  resetPasswordError 
} from "./actions";

import { ServerFail } from "../../../api/fail";
import { resetPassword } from "../../../api";

function* onResetPassword({ payload: { token, password, history } }) {
  console.log({ token, password } )
  try {
    const response = yield call(resetPassword, { token, password });
    //TODO remove
    //yield sleep(5000);
    if (response.success) { 
      yield put(resetPasswordSuccess(true))  
      //history('/login');  
    }
    else yield put(resetPasswordError(ServerFail.UNSUCCESS_POST));
  } catch (error) {
    yield put(resetPasswordError(error));
  }
}

function* resetPasswordSaga() {
  yield takeEvery(RESET_PASSWORD, onResetPassword);
}

export default resetPasswordSaga;
