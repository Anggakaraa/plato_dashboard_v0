import {
  GET_CLINICIAN_BY,
  GET_CLINICIAN_BY_SUCCESS,
  GET_CLINICIAN_BY_FAIL,

  GET_CLINICIAN_CLINICS_BY,
  GET_CLINICIAN_CLINICS_BY_FAIL,
  GET_CLINICIAN_CLINICS_BY_SUCCESS,

  ENABLE_CLINICIAN_BY,
  ENABLE_CLINICIAN_BY_FAIL,
  ENABLE_CLINICIAN_BY_SUCCESS,

  DISABLE_CLINICIAN_BY,
  DISABLE_CLINICIAN_BY_FAIL,
  DISABLE_CLINICIAN_BY_SUCCESS,

  CREATE_CLINIC_CLINICIAN_RELATIONSHIP_BY,
  CREATE_CLINIC_CLINICIAN_RELATIONSHIP_BY_SUCCESS,
  CREATE_CLINIC_CLINICIAN_RELATIONSHIP_BY_FAIL,

  ACTIVATE_CLINIC_CLINICIAN_RELATIONSHIP_BY,
  ACTIVATE_CLINIC_CLINICIAN_RELATIONSHIP_BY_SUCCESS,
  ACTIVATE_CLINIC_CLINICIAN_RELATIONSHIP_BY_FAIL,

  ADMIN_CLINIC_CLINICIAN_RELATIONSHIP_BY,
  ADMIN_CLINIC_CLINICIAN_RELATIONSHIP_BY_SUCCESS,
  ADMIN_CLINIC_CLINICIAN_RELATIONSHIP_BY_FAIL,

  GET_CLINICIAN_BY_ADMIN,
  GET_CLINICIAN_BY_ADMIN_FAIL,
  GET_CLINICIAN_BY_ADMIN_SUCCESS,

  GET_CLINICIAN_CLINICS_BY_ADMIN,
  GET_CLINICIAN_CLINICS_BY_ADMIN_FAIL,
  GET_CLINICIAN_CLINICS_BY_ADMIN_SUCCESS,
  
  CREATE_CLINIC_CLINICIAN_RELATIONSHIP_BY_ADMIN,
  CREATE_CLINIC_CLINICIAN_RELATIONSHIP_BY_ADMIN_SUCCESS,
  CREATE_CLINIC_CLINICIAN_RELATIONSHIP_BY_ADMIN_FAIL,

  ACTIVATE_CLINIC_CLINICIAN_RELATIONSHIP_BY_ADMIN,
  ACTIVATE_CLINIC_CLINICIAN_RELATIONSHIP_BY_ADMIN_SUCCESS,
  ACTIVATE_CLINIC_CLINICIAN_RELATIONSHIP_BY_ADMIN_FAIL,
  
  CLEAN_CLINICIAN_ERROR,
} from "./actionTypes";

const INIT_STATE = {
  /*MOCK VALUES*/
  patients: Math.round(Math.random() * 10),
  treatments: Math.round(Math.random() * 10),
  others: Math.round(Math.random() * 10), 
  /*MOCK VALUES*/
  clinician: undefined,
  clinician_clinics: [],
  loading: false,
  error: undefined,
};

const changeClinicianAtState = (guid, disabled, clinician) => {
  if (clinician.guid === guid) {
    clinician.disabled = disabled;
  }

  return clinician;
};

const changeClinicianClinicsAtState = (guid, disabled, clinician_clinics) => {
  return clinician_clinics.map(item => {
    if (item.clinic_clinicians[0].guid === guid) {
      item.clinic_clinicians[0].disabled = disabled;
    }
    return item;
  });
};

const changeAdminClinicianClinicsAtState = (guid, admin, clinician_clinics) => {
  return clinician_clinics.map(item => {
    if (item.clinic_clinicians[0].guid === guid) {
      item.clinic_clinicians[0].admin = admin;
    }
    return item;
  });
};

const clinician = (state = INIT_STATE, action) => {
  switch (action.type) {
    case GET_CLINICIAN_BY_SUCCESS:
      return {
        ...state,
        clinician: action.payload,
      };

    case GET_CLINICIAN_BY_FAIL:
      return {
        ...state,
        error: action.payload,
      };

    case GET_CLINICIAN_CLINICS_BY_SUCCESS:
      return {
        ...state,
        clinician_clinics: action.payload,
      };
    
    case GET_CLINICIAN_CLINICS_BY_FAIL:
      return {
        ...state,
        error: action.payload,
      };
      
    case ENABLE_CLINICIAN_BY_SUCCESS:
      return {
        ...state,
        clinician: changeClinicianAtState(action.payload, false, state.clinician),
      };
      
    case ENABLE_CLINICIAN_BY_FAIL:
      return {
        ...state,
        error: action.payload,
      };

    case DISABLE_CLINICIAN_BY_SUCCESS:
      return {
        ...state,
        clinician: changeClinicianAtState(action.payload, true, state.clinician),
      };
        
    case DISABLE_CLINICIAN_BY_FAIL:
      return {
        ...state,
        error: action.payload,
      };     

    case ACTIVATE_CLINIC_CLINICIAN_RELATIONSHIP_BY_SUCCESS:
      return {
        ...state,
        clinician_clinics: changeClinicianClinicsAtState(action.payload.guid, action.payload.disabled, state.clinician_clinics),
      };
        
    case ACTIVATE_CLINIC_CLINICIAN_RELATIONSHIP_BY_FAIL:
      return {
        ...state,
        error: action.payload,
      };
      
    case CREATE_CLINIC_CLINICIAN_RELATIONSHIP_BY_SUCCESS:
      return {
        ...state,
        clinician_clinics: [...state.clinician_clinics, ...action.payload],
      };
          
    case CREATE_CLINIC_CLINICIAN_RELATIONSHIP_BY_FAIL:
      return {
        ...state,
        error: action.payload,
      };  

    case ADMIN_CLINIC_CLINICIAN_RELATIONSHIP_BY_SUCCESS:
      return {
        ...state,
        clinician_clinics: changeAdminClinicianClinicsAtState(action.payload.guid, action.payload.admin, state.clinician_clinics),
      };
            
    case ADMIN_CLINIC_CLINICIAN_RELATIONSHIP_BY_FAIL:
      return {
        ...state,
        error: action.payload,
      };

    case GET_CLINICIAN_BY_ADMIN_SUCCESS:
      return {
        ...state,
        clinician: action.payload,
      };
  
    case GET_CLINICIAN_BY_ADMIN_FAIL:
      return {
        ...state,
        error: action.payload,
      };  

    case GET_CLINICIAN_CLINICS_BY_ADMIN_SUCCESS:
      return {
        ...state,
        clinician_clinics: action.payload,
      };
      
    case GET_CLINICIAN_CLINICS_BY_ADMIN_FAIL:
      return {
        ...state,
        error: action.payload,
      }; 
      
    case CREATE_CLINIC_CLINICIAN_RELATIONSHIP_BY_ADMIN_SUCCESS:
      return {
        ...state,
        clinician_clinics: [...state.clinician_clinics, ...action.payload],
      };
            
    case CREATE_CLINIC_CLINICIAN_RELATIONSHIP_BY_ADMIN_FAIL:
      return {
        ...state,
        error: action.payload,
      };  

    case CLEAN_CLINICIAN_ERROR:
      return {
        ...state,
        error: undefined,
      }  

    case ACTIVATE_CLINIC_CLINICIAN_RELATIONSHIP_BY_ADMIN_SUCCESS:
      return {
        ...state,
        clinician_clinics: changeClinicianClinicsAtState(action.payload.guid, action.payload.disabled, state.clinician_clinics),
      };
        
    case ACTIVATE_CLINIC_CLINICIAN_RELATIONSHIP_BY_ADMIN_FAIL:
      return {
        ...state,
        error: action.payload,
      };

    default:
      return state
  }
}

export default clinician;
