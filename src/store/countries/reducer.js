import {
  //PLATO USERS
  GET_PLATO_COUNTRIES,
  GET_PLATO_COUNTRIES_SUCCESS,
  GET_PLATO_COUNTRIES_FAIL,
  ADD_PLATO_COUNTRY,
  ADD_PLATO_COUNTRY_FAIL,
  UPDATE_PLATO_COUNTRY_SUCCESS,
  UPDATE_PLATO_COUNTRY_FAIL,
  DISABLE_PLATO_COUNTRY_SUCCESS,
  DISABLE_PLATO_COUNTRY_FAIL,
  ENABLE_PLATO_COUNTRY_SUCCESS,
  ENABLE_PLATO_COUNTRY_FAIL,
  ADD_PLATO_COUNTRY_SUCCESS,



 
} from "./actionTypes";

const INIT_STATE = {
  plato_countries: [],
  is_admin: false,
  loading: false,
  error: undefined,
};

const changeCountryAtState = (id, allCountries, disabled) => {
  return allCountries.map((country) => {
    if (country.id.toString() === id) {
      country.disabled = disabled;
    }
    return country;
  });
};

const updateCountryAtState = (countryUpdated, allCountries) => {
  return allCountries.map((country) => {
    if (country.id.toString() === countryUpdated.id) {
      return {
        ...country,
        ...countryUpdated,
      };
    }
    return country;
  });
};

const countries = (state = INIT_STATE, action) => {
  switch (action.type) {
    
    //PLATO COUNTRIES
    case GET_PLATO_COUNTRIES:
      return {
        ...state,
        loading: true,
      };

    case GET_PLATO_COUNTRIES_SUCCESS:
      return {
        ...state,
        plato_countries: action.payload,
        loading: false,
      };

    case GET_PLATO_COUNTRIES_FAIL:
      return {
        ...state,
        error: action.payload,
        loading: false,
      };

    case ADD_PLATO_COUNTRY_SUCCESS:
      return {
        ...state,
        plato_countries: [...state.plato_countries, action.payload],
      };

    case ADD_PLATO_COUNTRY_FAIL:
      return {
        ...state,
        error: action.payload,
      };

    case UPDATE_PLATO_COUNTRY_SUCCESS:
      return {
        ...state,
        plato_countries: updateCountryAtState(action.payload, state.plato_countries),
      };

    case UPDATE_PLATO_COUNTRY_FAIL:
      return {
        ...state,
        error: action.payload,
      };

    case DISABLE_PLATO_COUNTRY_SUCCESS:
      return {
        ...state,
        plato_countries: changeCountryAtState(
          action.payload.toString(),
          state.plato_countries,
          true
        ),
      };

    case DISABLE_PLATO_COUNTRY_FAIL:
      return {
        ...state,
        error: action.payload,
      };

    case ENABLE_PLATO_COUNTRY_SUCCESS:
      return {
        ...state,
        plato_countries: changeCountryAtState(
          action.payload.toString(),
          state.plato_countries,
          false
        ),
      };

    case ENABLE_PLATO_COUNTRY_FAIL:
      return {
        ...state,
        error: action.payload,
      };

    default:
      return state;
  }
};

export default countries;
