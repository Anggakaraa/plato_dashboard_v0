import {
  GET_CLINICS,
  GET_CLINICS_SUCCESS,
  GET_CLINICS_FAIL,
  ADD_CLINIC,
  ADD_CLINIC_SUCCESS,
  ADD_CLINIC_FAIL,
  UPDATE_CLINIC,
  UPDATE_CLINIC_SUCCESS,
  UPDATE_CLINIC_FAIL,
  DISABLE_CLINIC,
  DISABLE_CLINIC_SUCCESS,
  DISABLE_CLINIC_FAIL,
  ENABLE_CLINIC,
  ENABLE_CLINIC_SUCCESS,
  ENABLE_CLINIC_FAIL,
  CLEAN_CLINICS_ERROR,
  GET_MY_CLINICS_FAIL,
  GET_MY_CLINICS_SUCCESS,
  GET_MY_CLINICS,
} from "./actionTypes";

const INIT_STATE = {
  clinics: [],
  my_clinics: [],
  loading: false,
  error: undefined,
};

const changeClinicAtState = (guid, allClinics, disabled) => {
  return allClinics.map(clinic => {
    if (clinic.guid.toString() === guid) {
      clinic.disabled = disabled;
    }
    return clinic
  });
};

const updateClinicAtState = (clinicUpdated, allClinics) => {
  return allClinics.map(clinic => {
    if (clinic.guid.toString() === clinicUpdated.guid) {
      return {
        ...clinic, 
        ...clinicUpdated
      };
    }
    return clinic;
  });
}

const clinics = (state = INIT_STATE, action) => {
  switch (action.type) {
    case GET_CLINICS: 
      return {
        ...state,
        loading: true,
      };

    case GET_CLINICS_SUCCESS:
      return {
        ...state,
        loading: false,
        clinics: action.payload,
      };

    case GET_CLINICS_FAIL:
      return {
        ...state,
        loading: false,
        error: action.payload,
      };

    case ADD_CLINIC_SUCCESS:
      return {
        ...state,
        clinics: [...state.clinics, action.payload],
      };

    case ADD_CLINIC_FAIL:
      return {
        ...state,
        error: action.payload,
      };

    case UPDATE_CLINIC_SUCCESS:
      return {
        ...state,
        clinics: updateClinicAtState(action.payload, state.clinics),
      };
  
    case UPDATE_CLINIC_FAIL:
      return {
        ...state,
        error: action.payload,
      }
  
    case DISABLE_CLINIC_SUCCESS:
      return {
        ...state,
        clinics: changeClinicAtState(action.payload.toString(), state.clinics, true),
      }
  
    case DISABLE_CLINIC_FAIL:
      return {
        ...state,
        error: action.payload,
      }

    case ENABLE_CLINIC_SUCCESS:
      return {
        ...state,
        clinics: changeClinicAtState(action.payload.toString(), state.clinics, false),
      }
    
    case ENABLE_CLINIC_FAIL:
      return {
        ...state,
        error: action.payload,
      }
    
    case GET_MY_CLINICS:
      return {
        ...state,
        loading: true,
      }  
      
    case GET_MY_CLINICS_SUCCESS:
      return {
        ...state,
        my_clinics: action.payload,
        loading: false,
      };
  
    case GET_MY_CLINICS_FAIL:
      return {
        ...state,
        error: action.payload,
        loading: false,
      };

    case CLEAN_CLINICS_ERROR:
      return {
        ...state,
        error: undefined,
      }  

    default:
      return state
  }
}

export default clinics
