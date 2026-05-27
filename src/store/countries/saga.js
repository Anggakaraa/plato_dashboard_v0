import { call, put, takeEvery } from "redux-saga/effects"
import { 
  GET_PLATO_COUNTRIES,
  ADD_PLATO_COUNTRY,
  
} from "./actionTypes";

import { ServerFail } from '../../api/fail';

import {


  //PLATO USERS
  getPlatoCountriesSuccess,
  getPlatoCountriesFail,
  addPlatoCountrySuccess,
  addPlatoCountryFail,
  //updatePlatoUserSuccess,
  //updatePlatoUserFail,
  //disablePlatoUserSuccess,
  //disablePlatoUserFail,
  //enablePlatoUserSuccess,
  //enablePlatoUserFail,
} from "./actions";

import { 
  getCountries,
  getAvailableCountries,
  addCountry
} from "../../api/plato";



//USERS
function* onGetCountries() {
  try {
    const response = yield call(getCountries);
    yield put(getPlatoCountriesSuccess(response));
  } catch (error) {
    yield put(getPlatoCountriesFail(error));
  }
}

function* onAddCountry({ payload: country }) {
  try {
    const response = yield call(addCountry, country);
    yield put(addPlatoCountrySuccess(response));
  } catch (error) {
    yield put(addPlatoCountryFail(error));
  }
}

function* countriesSaga() {
  //USER TYPES
  //yield takeEvery(GET_USER_TYPES, onGetUserTypes);
  
  
  //PLATO USERS
  yield takeEvery(GET_PLATO_COUNTRIES, onGetCountries);
  yield takeEvery(ADD_PLATO_COUNTRY, onAddCountry);
  //yield takeEvery(UPDATE_PLATO_USER, onUpdatePlatoUser);
  //yield takeEvery(DISABLE_PLATO_USER, onDisablePlatoUser);
  //yield takeEvery(ENABLE_PLATO_USER, onEnablePlatoUser);

  
}

export default countriesSaga;
