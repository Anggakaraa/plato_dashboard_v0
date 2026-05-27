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

//STIMULATIONS

export const getLiveStimulations = () => ({ type: GET_LIVE_STIMULATION });

export const getLiveStimulationsSuccess = (live_events) => ({
  type: GET_LIVE_STIMULATION_SUCCESS,
  payload: live_events,
});

export const getLiveStimulationsFail = (error) => ({
  type: GET_LIVE_STIMULATION_FAIL,
  payload: error,
});

export const getStimulations = () => ({ type: GET_STIMULATIONS });

export const getStimulationsSuccess = (stimulations) => ({
  type: GET_STIMULATIONS_SUCCESS,
  payload: stimulations,
});

export const getStimulationsFail = (error) => ({
  type: GET_STIMULATIONS_FAIL,
  payload: error,
});

export const getStimulation = (guid) => ({ 
  type: GET_STIMULATION,
  payload: guid
});

export const getStimulationSuccess = (stimulation) => ({
  type: GET_STIMULATION_SUCCESS,
  payload: stimulation,
});

export const getStimulationFail = (error) => ({
  type: GET_STIMULATION_FAIL,
  payload: error,
});

export const addStimulation = (stimulation, history) => ({
  type: ADD_STIMULATION,
  payload: { stimulation, history },
});

export const addStimulationSuccess = (stimulation) => ({
  type: ADD_STIMULATION_SUCCESS,
  payload: stimulation,
});

export const addStimulationFail = (error) => ({
  type: ADD_STIMULATION_FAIL,
  payload: error,
});

export const updateStimulation = (stimulation, history) => ({
  type: UPDATE_STIMULATION,
  payload: { stimulation, history },
});

export const updateStimulationSuccess = (stimulation) => ({
  type: UPDATE_STIMULATION_SUCCESS,
  payload: stimulation,
});

export const updateStimulationFail = (error) => ({
  type: UPDATE_STIMULATION_FAIL,
  payload: error,
});

export const disableStimulation = (guid) => ({
  type: DISABLE_STIMULATION,
  payload: guid,
});

export const disableStimulationSuccess = (stimulation) => ({
  type: DISABLE_STIMULATION_SUCCESS,
  payload: stimulation,
});

export const disableStimulationFail = (error) => ({
  type: DISABLE_STIMULATION_FAIL,
  payload: error,
});

export const enableStimulation = (guid) => ({
  type: ENABLE_STIMULATION,
  payload: guid,
});

export const enableStimulationSuccess = (stimulation) => ({
  type: ENABLE_STIMULATION_SUCCESS,
  payload: stimulation,
});

export const enableStimulationFail = (error) => ({
  type: ENABLE_STIMULATION_FAIL,
  payload: error,
});

//CLINIC STIMULATIONS
export const getClinicStimulations = (clinic) => ({
  type: GET_CLINIC_STIMULATIONS,
  payload: clinic,
});

export const getClinicStimulationsSuccess = (stimulations) => ({
  type: GET_CLINIC_STIMULATIONS_SUCCESS,
  payload: stimulations,
});

export const getClinicStimulationsFail = (error) => ({
  type: GET_CLINIC_STIMULATIONS_FAIL,
  payload: error,
});

export const getClinicStimulation = (guid) => ({ 
  type: GET_CLINIC_STIMULATION,
  payload: guid,
});

export const getClinicStimulationSuccess = (stimulations) => ({
  type: GET_CLINIC_STIMULATION_SUCCESS,
  payload: stimulations,
});

export const getClinicStimulationFail = (error) => ({
  type: GET_CLINIC_STIMULATION_FAIL,
  payload: error,
});

export const addClinicStimulation = (stimulation, history) => ({
  type: ADD_CLINIC_STIMULATION,
  payload: { stimulation, history },
});

export const addClinicStimulationSuccess = (stimulation) => ({
  type: ADD_CLINIC_STIMULATION_SUCCESS,
  payload: stimulation,
});

export const addClinicStimulationFail = (error) => ({
  type: ADD_CLINIC_STIMULATION_FAIL,
  payload: error,
});

export const updateClinicStimulation = (stimulation, history) => ({
  type: UPDATE_CLINIC_STIMULATION,
  payload: { stimulation, history },
});

export const updateClinicStimulationSuccess = (stimulation) => ({
  type: UPDATE_CLINIC_STIMULATION_SUCCESS,
  payload: stimulation,
});

export const updateClinicStimulationFail = (error) => ({
  type: UPDATE_CLINIC_STIMULATION_FAIL,
  payload: error,
});

export const disableClinicStimulation = (guid, clinic) => ({
  type: DISABLE_CLINIC_STIMULATION,
  payload: { guid, clinic },
});

export const disableClinicStimulationSuccess = (stimulation) => ({
  type: DISABLE_CLINIC_STIMULATION_SUCCESS,
  payload: stimulation,
});

export const disableClinicStimulationFail = (error) => ({
  type: DISABLE_CLINIC_STIMULATION_FAIL,
  payload: error,
});

export const enableClinicStimulation = (guid, clinic) => ({
  type: ENABLE_CLINIC_STIMULATION,
  payload: { guid, clinic },
});

export const enableClinicStimulationSuccess = (stimulation) => ({
  type: ENABLE_CLINIC_STIMULATION_SUCCESS,
  payload: stimulation,
});

export const enableClinicStimulationFail = (error) => ({
  type: ENABLE_CLINIC_STIMULATION_FAIL,
  payload: error,
});

export const clearClinicStimulations = () => ({
  type: CLEAR_CLINIC_STIMULATIONS,
});

export const clearStimulationsError = () => ({
  type: CLEAR_STIMULATIONS_ERROR,
});

export const clearStimulation = () => ({
  type: CLEAR_STIMULATION,
});
