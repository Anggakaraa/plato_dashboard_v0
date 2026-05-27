import {
  /**
   * Plato users
   */
  GET_PLATO_COUNTRIES,
  GET_PLATO_COUNTRIES_SUCCESS,
  GET_PLATO_COUNTRIES_FAIL,
  ADD_PLATO_COUNTRY_FAIL,
  ADD_PLATO_COUNTRY_SUCCESS,
  UPDATE_PLATO_COUNTRY,
  UPDATE_PLATO_COUNTRY_SUCCESS,
  UPDATE_PLATO_COUNTRY_FAIL,
  DISABLE_PLATO_COUNTRY,
  DISABLE_PLATO_COUNTRY_SUCCESS,
  DISABLE_PLATO_COUNTRY_FAIL,
  ENABLE_PLATO_COUNTRY,
  ENABLE_PLATO_COUNTRY_SUCCESS,
  ENABLE_PLATO_COUNTRY_FAIL,
  ADD_PLATO_COUNTRY,

} from "./actionTypes";


//PLATO USERS
export const getPlatoCountries = () => ({type: GET_PLATO_COUNTRIES});

export const getPlatoCountriesSuccess = countries => ({
  type: GET_PLATO_COUNTRIES_SUCCESS,
  payload: countries,
});

export const getPlatoCountriesFail = error => ({
  type: GET_PLATO_COUNTRIES_FAIL,
  payload: error,
});

export const addPlatoCountry = country => ({
  type: ADD_PLATO_COUNTRY,
  payload: country,
});

export const addPlatoCountrySuccess = country => ({
  type: ADD_PLATO_COUNTRY_SUCCESS,
  payload: country,
});

export const addPlatoCountryFail = error => ({
  type: ADD_PLATO_COUNTRY_FAIL,
  payload: error,
});

export const updatePlatoCountry = country => ({
  type: UPDATE_PLATO_COUNTRY,
  payload: country,
});

export const updatePlatoCountrySuccess = country => ({
    type: UPDATE_PLATO_COUNTRY_SUCCESS,
    payload: country,
});

export const updatePlatoCountryFail = error => ({
  type: UPDATE_PLATO_COUNTRY_FAIL,
  payload: error,
});

export const disablePlatoCountry = country => ({
  type: DISABLE_PLATO_COUNTRY,
  payload: country,
});

export const disablePlatoCountrySuccess = country => ({
  type: DISABLE_PLATO_COUNTRY_SUCCESS,
  payload: country,
});

export const disablePlatoCountryFail = error => ({
  type: DISABLE_PLATO_COUNTRY_FAIL,
  payload: error,
});

export const enablePlatoCountry = country => ({
  type: ENABLE_PLATO_COUNTRY,
  payload: country,
});

export const enablePlatoCountrySuccess = country => ({
  type: ENABLE_PLATO_COUNTRY_SUCCESS,
  payload: country,
});

export const enablePlatoCountryFail = error => ({
  type: ENABLE_PLATO_COUNTRY_FAIL,
  payload: error,
});



