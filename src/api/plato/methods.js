import { DISABLED_PARAM, GUID_PARAM } from "../methods";

/**
 * PLATO
 */
const PLATO = "/plato";

//USER TYPES
export const GET_USER_TYPES = `${PLATO}/user-types`;

//USERS
export const GET_USERS = `${PLATO}/users`;
export const GET_USERS_WITH = (disabled = undefined) => {
    if (disabled === undefined) {
        return GET_USERS;
    }

    return `${GET_USERS}?${DISABLED_PARAM}`.replace('$disabled', disabled);
}

export const DISABLE_USER = `${PLATO}/user/disable`;
export const ENABLE_USER = `${PLATO}/user/enable`;
export const UPDATE_USER = `${PLATO}/user`;
export const ADD_USER = `${PLATO}/user`;

//PLATO USERS
export const GET_PLATO_USERS = `${PLATO}/plato-users`;
export const GET_PLATO_USERS_WITH = (disabled = undefined) => {
    if (disabled === undefined) {
        return GET_PLATO_USERS;
    }

    return `${GET_PLATO_USERS}?${DISABLED_PARAM}`.replace('$disabled', disabled);
}

export const DISABLE_PLATO_USER = `${PLATO}/plato-user/disable`;
export const ENABLE_PLATO_USER = `${PLATO}/plato-user/enable`;
export const UPDATE_PLATO_USER = `${PLATO}/plato-user`;
export const ADD_PLATO_USER = `${PLATO}/plato-user`;

//Countries
export const ADD_COUNTRY = `${PLATO}/country`
export const GET_ALL_COUNTRIES = `${PLATO}/countries`
export const GET_ALL_AVAILABLE_COUNTRIES = `${PLATO}/countries/available`

export const GET_COUNT_USER_REPORTS = `${PLATO}/`

//CLINICIANS
export const GET_CLINICIANS = `${PLATO}/clinicians`;
export const GET_CLINICIANS_WITH = (disabled = undefined) => {
    if (disabled === undefined) {
        return GET_CLINICIANS;
    }

    return `${GET_CLINICIANS}?${DISABLED_PARAM}`.replace('$disabled', disabled);
}

export const GET_CLINICIANS_BY_CLINIC = (clinic) => {
    return `${GET_CLINICIANS}/clinic?${GUID_PARAM}`.replace('$guid', clinic);
}

export const DISABLE_CLINICIAN = `${PLATO}/clinician/disable`;
export const ENABLE_CLINICIAN = `${PLATO}/clinician/enable`;
export const UPDATE_CLINICIAN = `${PLATO}/clinician`;
export const ADD_CLINICIAN = `${PLATO}/clinician`;


//CLINICS
export const GET_CLINICS = `${PLATO}/clinics`;
export const GET_CLINICS_WITH = (disabled = undefined) => {
    if (disabled === undefined) {
        return GET_CLINICS;
    }

    return `${GET_CLINICS}?${DISABLED_PARAM}`.replace('$disabled', disabled);
}

export const DISABLE_CLINIC = `${PLATO}/clinic/disable`;
export const ENABLE_CLINIC = `${PLATO}/clinic/enable`;
export const UPDATE_CLINIC = `${PLATO}/clinic`;
export const ADD_CLINIC = `${PLATO}/clinic`;

//CLINICIAN CLINICS
export const GET_CLINICIAN_CLINICS_BY = (guid, disabled = undefined) => {
    if (disabled === undefined) {
        return `${PLATO}/clinician/clinics?${GUID_PARAM}`.replace('$guid', guid);
    }
    
    return `${PLATO}/clinician/clinics?${GUID_PARAM}&${DISABLED_PARAM}`.replace('$guid', guid).replace('$disabled', disabled);
}

export const GET_CLINICIAN_BY = (guid) => {
    return `${PLATO}/clinician?${GUID_PARAM}`.replace('$guid', guid);
}

export const ADD_CLINIC_CLINICIAN_RELATIONSHIP = `${PLATO}/clinic-clinician`;
export const UPDATE_ADMIN_CLINIC_CLINICIAN_RELATIONSHIP = `${PLATO}/clinic-clinician/admin`;
export const UPDATE_NO_ADMIN_CLINIC_CLINICIAN_RELATIONSHIP = `${PLATO}/clinic-clinician/no-admin`;
export const ENABLE_CLINIC_CLINICIAN_RELATIONSHIP = `${PLATO}/clinic-clinician/enable`;
export const DISABLE_CLINIC_CLINICIAN_RELATIONSHIP = `${PLATO}/clinic-clinician/disable`;

//PATIENTS
export const GET_PATIENT_WITH = (guid) => {
    return `${PLATO}/patient?${GUID_PARAM}`.replace('$guid', guid);
}

export const GET_PATIENTS = `${PLATO}/patients`;
export const GET_PATIENTS_WITH = (disabled = undefined, search = undefined) => {
    let url = GET_PATIENTS;
    const params = [];
    
    if (disabled !== undefined) {
        params.push(`disabled=${disabled}`);
    }
    if (search !== undefined && search.trim() !== '') {
        params.push(`search=${encodeURIComponent(search)}`);
    }
    
    if (params.length > 0) {
        url += `?${params.join('&')}`;
    }
    
    return url;
}

export const GET_PATIENTS_PAGINATED = (page, limit, disabled = undefined, search = undefined) => {
    let url = `${GET_PATIENTS}?page=${page}&limit=${limit}`;
    if (disabled !== undefined) {
        url += `&${DISABLED_PARAM}`.replace('$disabled', disabled);
    }
    if (search !== undefined && search.trim() !== '') {
        url += `&search=${encodeURIComponent(search)}`;
    }
    return url;
}

export const DISABLE_PATIENT = `${PLATO}/patient/disable`;
export const ENABLE_PATIENT = `${PLATO}/patient/enable`;
export const UPDATE_PATIENT = `${PLATO}/patient`;
export const ADD_PATIENT = `${PLATO}/patient`;

//STIMULATIONS
const STIMULATION = `${PLATO}/stimulation`;
export const GET_STIMULATION_WITH = (guid) => {
    return `${STIMULATION}?${GUID_PARAM}`.replace('$guid', guid);
}

export const GET_STIMULATIONS = `${STIMULATION}s`;
export const GET_STIMULATIONS_WITH = (disabled = undefined) => {
    if (disabled === undefined) return GET_STIMULATIONS;
    return `${GET_STIMULATIONS}?${DISABLED_PARAM}`.replace('$disabled', disabled);
}

export const DISABLE_STIMULATION = `${STIMULATION}/disable`;
export const ENABLE_STIMULATION = `${STIMULATION}/enable`;
export const UPDATE_STIMULATION = `${STIMULATION}`;
export const ADD_STIMULATION = `${STIMULATION}`;
