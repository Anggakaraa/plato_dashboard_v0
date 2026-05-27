import { success } from "toastr";
import {
  //PATIENTS
  GET_PATIENTS,
  GET_PATIENTS_SUCCESS,
  GET_PATIENTS_FAIL,
  ADD_PATIENT,
  ADD_PATIENT_SUCCESS,
  ADD_PATIENT_FAIL,
  UPDATE_PATIENT,
  UPDATE_PATIENT_SUCCESS,
  UPDATE_PATIENT_FAIL,
  DISABLE_PATIENT,
  DISABLE_PATIENT_SUCCESS,
  DISABLE_PATIENT_FAIL,
  ENABLE_PATIENT,
  ENABLE_PATIENT_SUCCESS,
  ENABLE_PATIENT_FAIL,
  GET_PATIENT,
  GET_PATIENT_SUCCESS,
  GET_PATIENT_FAIL,

  //MY PATIENTS
  GET_MY_PATIENTS,
  GET_MY_PATIENTS_SUCCESS,
  GET_MY_PATIENTS_FAIL,
  ADD_MY_PATIENT,
  ADD_MY_PATIENT_SUCCESS,
  ADD_MY_PATIENT_FAIL,
  UPDATE_MY_PATIENT,
  UPDATE_MY_PATIENT_SUCCESS,
  UPDATE_MY_PATIENT_FAIL,
  DISABLE_MY_PATIENT,
  DISABLE_MY_PATIENT_SUCCESS,
  DISABLE_MY_PATIENT_FAIL,
  ENABLE_MY_PATIENT,
  ENABLE_MY_PATIENT_SUCCESS,
  ENABLE_MY_PATIENT_FAIL,
  GET_MY_PATIENT,
  GET_MY_PATIENT_SUCCESS,
  GET_MY_PATIENT_FAIL,
  CLEAR_PATIENTS_ERROR,

  //PATIENT TREATMENTS
  GET_PATIENT_TREATMENTS,
  GET_PATIENT_TREATMENTS_SUCCESS,
  GET_PATIENT_TREATMENTS_FAIL,
  ADD_PATIENT_TREATMENT,
  ADD_PATIENT_TREATMENT_SUCCESS,
  ADD_PATIENT_TREATMENT_FAIL,
  RESET_PATIENT_GUID,
  DISABLE_PATIENT_TREATMENT,
  DISABLE_PATIENT_TREATMENT_SUCCESS,
  DISABLE_PATIENT_TREATMENT_FAIL,
  ENABLE_PATIENT_TREATMENT,
  ENABLE_PATIENT_TREATMENT_SUCCESS,
  ENABLE_PATIENT_TREATMENT_FAIL,
  END_PATIENT_TREATMENT,
  END_PATIENT_TREATMENT_SUCCESS,
  END_PATIENT_TREATMENT_FAIL,
  START_PATIENT_TREATMENT,
  START_PATIENT_TREATMENT_SUCCESS,
  START_PATIENT_TREATMENT_FAIL,
  GET_INTERVENTIONS_BY_TREATMENT,
  GET_INTERVENTIONS_BY_TREATMENT_SUCCESS,
  GET_INTERVENTIONS_BY_TREATMENT_FAIL,
} from "./actionTypes";

const INIT_STATE = {
  patient: undefined,
  patient_treatments: [],
  interventions: [],
  patients: [],
  pagination: undefined,
  my_patient: undefined,
  my_patients: [],
  my_pagination: undefined,
  loading: false,
  error: undefined,
};

const changePatientAtState = (guid, patient, disabled) => {
  if (patient === undefined) return undefined;
  if (patient.guid === guid) {
    patient.disabled = disabled;
    return patient;
  }

  return patient;
};

const changePatientsAtState = (guid, allPatients, disabled) => {
  return allPatients.map((patient) => {
    if (patient.guid.toString() === guid) {
      patient.disabled = disabled;
    }
    return patient;
  });
};

const changePatientTreatmentsAtState = (guid, allTreatments, disabled) => {
  return allTreatments.map((treatment) => {
    if (treatment.guid.toString() === guid) {
      treatment.disabled = disabled;
    }
    return treatment;
  });
};

const updatePatientAtState = (patientUpdated, patient) => {
  if (patient === undefined) return undefined;
  if (patient.guid === patientUpdated.guid) {
    return {
      ...patient,
      ...patientUpdated,
    };
  }
  return patient;
};

const updatePatientsAtState = (patientUpdated, allPatients) => {
  return allPatients.map((patient) => {
    if (patient.guid === patientUpdated.guid) {
      return {
        ...patient,
        ...patientUpdated,
      };
    }
    return patient;
  });
};

const updatePatientTreatmentAtState = (treatmentUpdated, allTreatments) => {
  return allTreatments.map((treatment) => {
    if (treatment.guid === treatmentUpdated.guid) {
      return {
        ...treatment,
        ...treatmentUpdated,
      };
    }
    return treatment;
  });
};

const disablePatientTreatmentsAtState = (allTreatments, disable) => {
  return allTreatments.map((treatment) => {
    return {
      ...treatment,
      disabled: disable,
    };
  });
};

const patients = (state = INIT_STATE, action) => {
  switch (action.type) {
    //PATIENTS
    case GET_PATIENT:
      return {
        ...state,
      };

    case GET_PATIENT_SUCCESS:
      return {
        ...state,
        patient: action.payload,
      };

    case GET_PATIENT_FAIL:
      return {
        ...state,
        error: action.payload,
      };

    case GET_PATIENTS:
      return {
        ...state,
        loading: true,
      };

    case GET_PATIENTS_SUCCESS:
      // Handle both paginated and non-paginated responses
      const isPaginated = action.payload && action.payload.data && action.payload.pagination;
      return {
        ...state,
        patients: isPaginated ? action.payload.data : action.payload,
        pagination: isPaginated ? action.payload.pagination : undefined,
        loading: false,
      };

    case GET_PATIENTS_FAIL:
      return {
        ...state,
        error: action.payload,
        loading: false,
      };

    case ADD_PATIENT_SUCCESS:
      return {
        ...state,
        patients: [...state.patients, action.payload],
        guid_sucess: action.payload.guid
      };

    case RESET_PATIENT_GUID:
      return {
        ...state,
        guid_sucess: undefined
      }

    case ADD_PATIENT_FAIL:
      return {
        ...state,
        error: action.payload,
      };

    case UPDATE_PATIENT_SUCCESS:
      return {
        ...state,
        patient: updatePatientAtState(action.payload, state.patient),
        patients: updatePatientsAtState(action.payload, state.patients),
      };

    case UPDATE_PATIENT_FAIL:
      return {
        ...state,
        error: action.payload,
      };

    case DISABLE_PATIENT_SUCCESS:
      return {
        ...state,
        patient: changePatientAtState(
          action.payload.toString(),
          state.patient,
          true
        ),
        patients: changePatientsAtState(
          action.payload.toString(),
          state.patients,
          true
        ),
      };

    case DISABLE_PATIENT_FAIL:
      return {
        ...state,
        error: action.payload,
      };

    case ENABLE_PATIENT_SUCCESS:
      return {
        ...state,
        patient: changePatientAtState(
          action.payload.toString(),
          state.patient,
          false
        ),
        patients: changePatientsAtState(
          action.payload.toString(),
          state.patients,
          false
        ),
      };

    case ENABLE_PATIENT_FAIL:
      return {
        ...state,
        error: action.payload,
      };

    //MY PATIENTS
    case GET_MY_PATIENT:
      return {
        ...state,
        loading: true,
      };

    case GET_MY_PATIENT_SUCCESS:
      return {
        ...state,
        my_patient: action.payload,
        loading: false,
      };

    case GET_MY_PATIENT_FAIL:
      return {
        ...state,
        error: action.payload,
        loading: false,
      };

    case GET_MY_PATIENTS:
      return {
        ...state,
        loading: true,
      };

    case GET_MY_PATIENTS_SUCCESS: {
      // Handle both paginated and non-paginated responses
      const isMyPaginated = action.payload && action.payload.data && action.payload.pagination;
      return {
        ...state,
        my_patients: isMyPaginated ? action.payload.data : action.payload,
        my_pagination: isMyPaginated ? action.payload.pagination : undefined,
        loading: false,
      };
    }

    case GET_MY_PATIENTS_FAIL:
      return {
        ...state,
        error: action.payload,
        loading: false,
      };

    case ADD_MY_PATIENT_SUCCESS:
      return {
        ...state,
        my_patients: [...state.my_patients, action.payload],
        guid_sucess: action.payload.guid
      };

    case ADD_MY_PATIENT_FAIL:
      return {
        ...state,
        error: action.payload,
      };

    case UPDATE_MY_PATIENT_SUCCESS:
      return {
        ...state,
        my_patient: updatePatientAtState(action.payload, state.my_patient),
        my_patients: updatePatientsAtState(action.payload, state.my_patients),
      };

    case UPDATE_MY_PATIENT_FAIL:
      return {
        ...state,
        error: action.payload,
      };

    case DISABLE_MY_PATIENT_SUCCESS:
      return {
        ...state,
        my_patient: changePatientAtState(
          action.payload.toString(),
          state.my_patient,
          true
        ),
        my_patients: changePatientsAtState(
          action.payload.toString(),
          state.my_patients,
          true
        ),
      };

    case DISABLE_MY_PATIENT_FAIL:
      return {
        ...state,
        error: action.payload,
      };

    case ENABLE_MY_PATIENT_SUCCESS:
      return {
        ...state,
        my_patient: changePatientAtState(
          action.payload.toString(),
          state.my_patient,
          false
        ),
        patients: changePatientsAtState(
          action.payload.toString(),
          state.my_patients,
          false
        ),
      };

    case ENABLE_MY_PATIENT_FAIL:
      return {
        ...state,
        error: action.payload,
      };

    case GET_PATIENT_TREATMENTS:
      return {
        ...state,
      };

    case GET_PATIENT_TREATMENTS_SUCCESS:
      return {
        ...state,
        patient_treatments: action.payload,
      };

    case GET_PATIENT_TREATMENTS_FAIL:
      return {
        ...state,
        error: action.payload,
      };

    case ADD_PATIENT_TREATMENT_SUCCESS:
      return {
        ...state,
        patient_treatments: [
          ...disablePatientTreatmentsAtState(state.patient_treatments, true),
          action.payload,
        ],
      };

    case ADD_PATIENT_TREATMENT_FAIL:
      return {
        ...state,
        error: action.payload,
      };

    case DISABLE_PATIENT_TREATMENT_SUCCESS:
      return {
        ...state,
        patient_treatments: changePatientTreatmentsAtState(
          action.payload.toString(),
          state.patient_treatments,
          true
        ),
      };

    case DISABLE_PATIENT_TREATMENT_FAIL:
      return {
        ...state,
        error: action.payload,
      };

    case ENABLE_PATIENT_TREATMENT_SUCCESS:
      return {
        ...state,
        patients: changePatientTreatmentsAtState(
          action.payload.toString(),
          state.patient_treatments,
          false
        ),
      };

    case ENABLE_PATIENT_TREATMENT_FAIL:
      return {
        ...state,
        error: action.payload,
      };

    case END_PATIENT_TREATMENT_SUCCESS:
      return {
        ...state,
        patient_treatments: updatePatientTreatmentAtState(
          action.payload,
          state.patient_treatments
        ),
      };

    case END_PATIENT_TREATMENT_FAIL:
      return {
        ...state,
        error: action.payload,
      };

    case START_PATIENT_TREATMENT_SUCCESS:
      return {
        ...state,
        patient_treatments: updatePatientTreatmentAtState(
          action.payload,
          state.patient_treatments
        ),
      };

    case START_PATIENT_TREATMENT_FAIL:
      return {
        ...state,
        error: action.payload,
      };

    case GET_INTERVENTIONS_BY_TREATMENT:
      return {
        ...state,
      };

    case GET_INTERVENTIONS_BY_TREATMENT_SUCCESS:
      return {
        ...state,
        interventions: action.payload,
      };

    case GET_INTERVENTIONS_BY_TREATMENT_FAIL:
      return {
        ...state,
        error: action.payload,
      };
    case CLEAR_PATIENTS_ERROR:
      return {
        ...state,
        error: undefined,
      };

    default:
      return state;
  }
};

export default patients;
