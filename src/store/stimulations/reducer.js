import {
  /**
   * Stimulations
   */
  GET_STIMULATIONS,
  GET_STIMULATIONS_SUCCESS,
  GET_STIMULATIONS_FAIL,
  ADD_STIMULATION,
  ADD_STIMULATION_SUCCESS,
  ADD_STIMULATION_FAIL,
  UPDATE_STIMULATION,
  UPDATE_STIMULATION_SUCCESS,
  UPDATE_STIMULATION_FAIL,
  DISABLE_STIMULATION,
  DISABLE_STIMULATION_SUCCESS,
  DISABLE_STIMULATION_FAIL,
  ENABLE_STIMULATION,
  ENABLE_STIMULATION_SUCCESS,
  ENABLE_STIMULATION_FAIL,
  CLEAR_STIMULATIONS_ERROR,

  /**
   * Clinic Stimulations
   */
  GET_CLINIC_STIMULATIONS,
  GET_CLINIC_STIMULATIONS_SUCCESS,
  GET_CLINIC_STIMULATIONS_FAIL,
  ADD_CLINIC_STIMULATION,
  ADD_CLINIC_STIMULATION_SUCCESS,
  ADD_CLINIC_STIMULATION_FAIL,
  UPDATE_CLINIC_STIMULATION,
  UPDATE_CLINIC_STIMULATION_SUCCESS,
  UPDATE_CLINIC_STIMULATION_FAIL,
  DISABLE_CLINIC_STIMULATION,
  DISABLE_CLINIC_STIMULATION_SUCCESS,
  DISABLE_CLINIC_STIMULATION_FAIL,
  ENABLE_CLINIC_STIMULATION,
  ENABLE_CLINIC_STIMULATION_SUCCESS,
  ENABLE_CLINIC_STIMULATION_FAIL,
  GET_STIMULATION,
  GET_STIMULATION_SUCCESS,
  GET_STIMULATION_FAIL,
  GET_CLINIC_STIMULATION,
  GET_CLINIC_STIMULATION_SUCCESS,
  GET_CLINIC_STIMULATION_FAIL,
  CLEAR_STIMULATION,
  CLEAR_CLINIC_STIMULATIONS,
  GET_LIVE_STIMULATION,
  GET_LIVE_STIMULATION_SUCCESS,
  GET_LIVE_STIMULATION_FAIL
} from "./actionTypes";

const INIT_STATE = {
  stimulation: undefined,
  stimulations: [],
  live_events: [],
  clinic_stimulation: undefined,
  clinic_stimulations: [],
  original_stimulations: [],
  customized_stimulations: [],
  loading: false,
  error: undefined,
};

const getAllStimulations = (stimulations) => {
  if (stimulations === undefined) return [];
  const clinicStimulations = stimulations.clinic ? stimulations.clinic : [];
  const originalStimulations = stimulations.original
    ? stimulations.original
    : [];
  return originalStimulations.concat(clinicStimulations);
};

const changeStimulationAtState = (guid, stimulation, disabled) => {
  if (stimulation === undefined) return undefined;
  if (stimulation.guid === guid) {
    stimulation.disabled = disabled;
    return stimulation;
  }

  return stimulation;
};

const changeStimulationsAtState = (guid, allStimulations, disabled) => {
  return allStimulations.map((stimulation) => {
    if (stimulation.guid.toString() === guid) {
      stimulation.disabled = disabled;
    }
    return stimulation;
  });
};

const updateStimulationAtState = (stimulationUpdated, stimulation) => {
  if (stimulation === undefined) return undefined;
  if (stimulation.guid === stimulationUpdated.guid) {
    return {
      ...stimulation,
      ...stimulationUpdated,
    };
  }
  return stimulation;
};

const updateStimulationsAtState = (stimulationUpdated, allStimulations) => {
  return allStimulations.map((stimulation) => {
    if (stimulation.guid === stimulationUpdated.guid) {
      return {
        ...stimulation,
        ...stimulationUpdated,
      };
    }
    return stimulation;
  });
};

const addStimulationBy = (stimulationToBeAdded, allStimulations, original) => {
  if (stimulationToBeAdded.original === original) {
    return [...allStimulations, stimulationToBeAdded];
  }

  return allStimulations;
};

const stimulations = (state = INIT_STATE, action) => {
  switch (action.type) {
    //Stimulations

    case GET_LIVE_STIMULATION:
      return {
        ...state,
        loading: true,
      };

    case GET_LIVE_STIMULATION_SUCCESS:
      return {
        ...state,
        live_events: action.payload,
        loading: false,
      };
    
    case GET_LIVE_STIMULATION_FAIL:
      return {
        ...state,
        error: action.payload,
        loading: false,
      };

    case GET_STIMULATIONS:
      return {
        ...state,
        loading: true,
      };

    case GET_STIMULATIONS_SUCCESS:
      return {
        ...state,
        stimulations: getAllStimulations(action.payload),
        original_stimulations: action.payload.original,
        customized_stimulations: action.payload.clinic,
        loading: false,
      };

    case GET_STIMULATIONS_FAIL:
      return {
        ...state,
        error: action.payload,
        loading: false,
      };

    case GET_STIMULATION:
      return {
        ...state,
        loading: true,
      };

    case GET_STIMULATION_SUCCESS:
      return {
        ...state,
        stimulation: action.payload,
        loading: false,
      };

    case GET_STIMULATION_FAIL:
      return {
        ...state,
        error: action.payload,
        loading: false,
      };

    case ADD_STIMULATION_SUCCESS:
      return {
        ...state,
        stimulations: [...state.stimulations, action.payload],
        original_stimulations: addStimulationBy(
          action.payload,
          state.original_stimulations,
          true
        ),
        customized_stimulations: addStimulationBy(
          action.payload,
          state.customized_stimulations,
          false
        ),
      };

    case ADD_STIMULATION_FAIL:
      return {
        ...state,
        error: action.payload,
      };

    case UPDATE_STIMULATION_SUCCESS:
      return {
        ...state,
        stimulation: updateStimulationAtState(
          action.payload,
          state.stimulation
        ),
        stimulations: updateStimulationsAtState(
          action.payload,
          state.stimulations
        ),
        original_stimulations: updateStimulationsAtState(
          action.payload,
          state.original_stimulations
        ),
        customized_stimulations: updateStimulationsAtState(
          action.payload,
          state.customized_stimulations
        ),
      };

    case UPDATE_STIMULATION_FAIL:
      return {
        ...state,
        error: action.payload,
      };

    case DISABLE_STIMULATION_SUCCESS:
      return {
        ...state,
        stimulation: changeStimulationAtState(
          action.payload.toString(),
          state.stimulation,
          true
        ),
        stimulations: changeStimulationsAtState(
          action.payload.toString(),
          state.stimulations,
          true
        ),
        original_stimulations: changeStimulationsAtState(
          action.payload.toString(),
          state.original_stimulations,
          true
        ),
        customized_stimulations: changeStimulationsAtState(
          action.payload.toString(),
          state.customized_stimulations,
          true
        ),
      };

    case DISABLE_STIMULATION_FAIL:
      return {
        ...state,
        error: action.payload,
      };

    case ENABLE_STIMULATION_SUCCESS:
      return {
        ...state,
        stimulation: changeStimulationAtState(
          action.payload.toString(),
          state.stimulation,
          false
        ),
        stimulations: changeStimulationsAtState(
          action.payload.toString(),
          state.stimulations,
          false
        ),
        original_stimulations: changeStimulationsAtState(
          action.payload.toString(),
          state.original_stimulations,
          false
        ),
        customized_stimulations: changeStimulationsAtState(
          action.payload.toString(),
          state.customized_stimulations,
          false
        ),
      };

    case ENABLE_STIMULATION_FAIL:
      return {
        ...state,
        error: action.payload,
      };

    //CLINIC STIMULATIONS
    case GET_CLINIC_STIMULATION:
      return {
        ...state,
        loading: true,
      };

    case GET_CLINIC_STIMULATION_SUCCESS:
      return {
        ...state,
        clinic_stimulation: action.payload,
        loading: false,
      };

    case GET_CLINIC_STIMULATION_FAIL:
      return {
        ...state,
        error: action.payload,
        loading: false,
      };

    case GET_CLINIC_STIMULATIONS:
      return {
        ...state,
        loading: true,
      };

    case GET_CLINIC_STIMULATIONS_SUCCESS:
      return {
        ...state,
        clinic_stimulations: getAllStimulations(action.payload),
        original_stimulations: action.payload.original,
        customized_stimulations: action.payload.clinic,
        loading: false,
      };

    case GET_CLINIC_STIMULATIONS_FAIL:
      return {
        ...state,
        error: action.payload,
        loading: false,
      };

    case ADD_CLINIC_STIMULATION_SUCCESS:
      return {
        ...state,
        clinic_stimulations: [...state.clinic_stimulations, action.payload],
        original_stimulations: addStimulationBy(
          action.payload,
          state.original_stimulations,
          true
        ),
        customized_stimulations: addStimulationBy(
          action.payload,
          state.customized_stimulations,
          false
        ),
      };

    case ADD_CLINIC_STIMULATION_FAIL:
      return {
        ...state,
        error: action.payload,
      };

    case UPDATE_CLINIC_STIMULATION_SUCCESS:
      return {
        ...state,
        clinic_stimulation: updateStimulationAtState(
          action.payload,
          state.clinic_stimulation
        ),
        clinic_stimulations: updateStimulationsAtState(
          action.payload,
          state.clinic_stimulations
        ),
        original_stimulations: updateStimulationsAtState(
          action.payload,
          state.original_stimulations
        ),
        customized_stimulations: updateStimulationsAtState(
          action.payload,
          state.customized_stimulations
        ),
      };

    case UPDATE_CLINIC_STIMULATION_FAIL:
      return {
        ...state,
        error: action.payload,
      };

    case DISABLE_CLINIC_STIMULATION_SUCCESS:
      return {
        ...state,
        clinic_stimulation: changeStimulationAtState(
          action.payload.toString(),
          state.clinic_stimulation,
          true
        ),
        clinic_stimulations: changeStimulationsAtState(
          action.payload.toString(),
          state.clinic_stimulations,
          true
        ),
        original_stimulations: changeStimulationsAtState(
          action.payload.toString(),
          state.original_stimulations,
          true
        ),
        customized_stimulations: changeStimulationsAtState(
          action.payload.toString(),
          state.customized_stimulations,
          true
        ),
      };

    case DISABLE_CLINIC_STIMULATION_FAIL:
      return {
        ...state,
        error: action.payload,
      };

    case ENABLE_CLINIC_STIMULATION_SUCCESS:
      return {
        ...state,
        clinic_stimulation: changeStimulationAtState(
          action.payload.toString(),
          state.clinic_stimulation,
          false
        ),
        clinic_stimulations: changeStimulationsAtState(
          action.payload.toString(),
          state.clinic_stimulations,
          false
        ),
        original_stimulations: changeStimulationsAtState(
          action.payload.toString(),
          state.original_stimulations,
          false
        ),
        customized_stimulations: changeStimulationsAtState(
          action.payload.toString(),
          state.customized_stimulations,
          false
        ),
      };

    case ENABLE_CLINIC_STIMULATION_FAIL:
      return {
        ...state,
        error: action.payload,
      };

    case CLEAR_STIMULATIONS_ERROR:
      return {
        ...state,
        error: undefined,
      };
    case CLEAR_STIMULATION:
      return {
        ...state,
        stimulation: undefined,
      };
    case CLEAR_CLINIC_STIMULATIONS:
      return {
        ...state,
        clinic_stimulations: [],
        original_stimulations: [],
        customized_stimulations: [],
      };
    default:
      return state;
  }
};

export default stimulations;
