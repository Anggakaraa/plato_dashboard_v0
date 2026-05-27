const ServerErrors = {
    GENERIC: 'GENERIC',
    REQUIRED_PARAMS: 'REQUIRED_PARAMS',
    INVALID_PARAMETER: 'INVALID_PARAMETER',
    UNKNOWN_SERVER_ERROR: 'UNKNOWN_SERVER_ERROR',
    UNKNOWN_USER_TYPE: 'UNKNOWN_USER_TYPE',
    UNKNOWN_USER_EVENT_TYPE: 'UNKNOWN_USER_EVENT_TYPE',
    UNKNOWN_USER_PATIENT_EVENT_TYPE: 'UNKNOWN_USER_PATIENT_EVENT_TYPE',

    /**
     * Sign/User
     */
    INVALID_USER_OR_PASSWORD: 'INVALID_USER_OR_PASSWORD',
    INVALID_USER: 'INVALID_USER',
    INVALID_PASSWORD: 'INVALID_PASSWORD',
    USER_DISABLED: 'USER_DISABLED',
    USER_NOT_FOUND: 'USER_NOT_FOUND',

    /**
     * Clinic
     */
    INVALID_CLINIC: 'INVALID_CLINIC',
    CLINIC_NOT_FOUND: 'CLINIC_NOT_FOUND',

    /**
     * Clinician
     */
    CLINICIAN_NOT_FOUND: 'CLINICIAN_NOT_FOUND',
    CLINICIAN_NOT_ADMIN: 'CLINICIAN_NOT_ADMIN',
    CLINICIAN_NOT_AUTHORIZED: 'CLINICIAN_NOT_AUTHORIZED',

    PLATO_USER_NOT_FOUND: 'PLATO_USER_NOT_FOUND',
    PLATO_USER_EMAIL_INVALID: 'PLATO_USER_EMAIL_INVALID',
    

    /**
     * Patient
     */
    PATIENT_NOT_FOUND: 'PATIENT_NOT_FOUND',
    PATIENT_DISABLED: 'PATIENT_DISABLED',

    /**
     * Patient treatment
     */
    PATIENT_TREATMENT_NOT_FOUND: 'PATIENT_TREATMENT_NOT_FOUND',
    PATIENT_TREATMENT_DISABLED: 'PATIENT_TREATMENT_DISABLED',

    /**
     * Intervention treatment
     */
    INTERVENTION_TREATMENT_NOT_FOUND: 'INTERVENTION_TREATMENT_NOT_FOUND',
    INTERVENTION_TREATMENT_DISABLED: 'INTERVENTION_TREATMENT_DISABLED',
    INTERVENTION_TREATMENT: 'INTERVENTION_TREATMENT',



    /**
     * Clinic patient relationship
     */
    CLINIC_PATIENT_RELATIONSHIP_NOT_FOUND: 'CLINIC_PATIENT_RELATIONSHIP_NOT_FOUND',
    CLINIC_PATIENT_RELATIONSHIP_ALREADY_CREATED: 'CLINIC_PATIENT_RELATIONSHIP_ALREADY_CREATED',
    CLINIC_PATIENT_RELATIONSHIP: 'CLINIC_PATIENT_RELATIONSHIP',

    /**
     * Clinic clinician relationship
     */
    CLINIC_CLINICIAN_RELATIONSHIP_NOT_FOUND: 'CLINIC_CLINICIAN_RELATIONSHIP_NOT_FOUND',
    CLINIC_CLINICIAN_RELATIONSHIP_ALREADY_CREATED: 'CLINIC_CLINICIAN_RELATIONSHIP_ALREADY_CREATED',

    /**
     * Stimulation
     */
    STIMULATION_NOT_FOUND: 'STIMULATION_NOT_FOUND',
    ORIGINAL_STIMULATION_NOT_FOUND: 'ORIGINAL_STIMULATION_NOT_FOUND',
    STIMULATION_NOT_VALID: 'STIMULATION_NOT_VALID',
    STIMULATION_DISABLED: 'STIMULATION_DISABLED',
    PARAMETER_NOT_FOUND: 'STIMULATION_NOT_FOUND',
    TDCS_RELATIONSHIP_NOT_FOUND: 'TDCS_RELATIONSHIP_NOT_FOUND',
    TES_NAME_REQUIRED: 'TES_NAME_REQUIRED',
    TES_TYPE_NOT_FOUND: 'TES_TYPE_NOT_FOUND',
    TACS_NOT_IMPLEMENTED: 'TACS_NOT_IMPLEMENTED',
    CLINIC_STIMULATION_NOT_FOUND: 'CLINIC_STIMULATION_NOT_FOUND',
    STIMULATION_DO_NOT_BELONGS_TO_CLINIC: 'STIMULATION_DO_NOT_BELONGS_TO_CLINIC',
    
    /**
     * Token
    */
    AUTHENTICATION_FAILED: 'AUTHENTICATION_FAILED',
    TOKEN_GENERATION: 'TOKEN_GENERATION',
    INVALID_TOKEN: 'INVALID_TOKEN',
    REQUIRED_TOKEN: 'REQUIRED_TOKEN',
    REQUIRED_PLATO_ADMIN_PRIVILEGE: 'REQUIRED_PLATO_ADMIN_PRIVILEGE',
    REQUIRED_CLINICIAN_PRIVILEGE: 'REQUIRED_CLINICIAN_PRIVILEGE',
    REQUIRED_ADMIN_PRIVILEGE: 'REQUIRED_ADMIN_PRIVILEGE',
    REQUIRED_DIFFERENT_PRIVILEGE: 'REQUIRED_DIFFERENT_PRIVILEGE',
    EXPIRED_TOKEN: 'EXPIRED_TOKEN',

    /**
     * User
     */
    USER_TYPE_NAME_REQUIRED: 'USER_TYPE_NAME_REQUIRED',
    USER_TYPE_NOT_FOUND: 'USER_TYPE_NOT_FOUND',

    /**
     * Password creation
     */
    PASSWORD_CREATION_REQUIRED: 'PASSWORD_CREATION_REQUIRED',
    PASSWORD_CREATION_ERROR: 'PASSWORD_CREATION_ERROR',
    PASSWORD_CREATED_BEFORE: 'PASSWORD_CREATED_BEFORE',
};

const DBErrors = {
    DB_ERROR: 'DB_ERROR',
    QUERY_ERROR: 'QUERY_ERROR',
    FIND_ERROR: 'FIND_ERROR',
    INSERT_UPDATE_ERROR: 'INSERT_UPDATE_ERROR',
    CREATE_ERROR: 'CREATE_ERROR',
    EMAIL_DUPLICATED: 'EMAIL_DUPLICATED',
};

const getErrorMessage = (t, error) => {
    if (!error || !error.response || !error.response.data || !error.response.data.error) return null;
    console.log("API Error: ", error);
    let type = error.response.data.error;
    let message = t("Unknown server error");
    let reqStatusCode = error.response.status;
   
    if(reqStatusCode == 401 && !window.location.pathname.includes('/login')) {
        localStorage.removeItem('authUser')
        window.location.replace('/login')
    }

    // On the login page, a 401 always means wrong credentials
    if (reqStatusCode == 401 && window.location.pathname.includes('/login')) {
        return t("Invalid email or password. Please try again.");
    }
    
    if (!type) return message;
    if (type.message !== undefined) type = type.message;
    
    switch (type) {
        case ServerErrors.INVALID_USER_OR_PASSWORD:
        case ServerErrors.INVALID_PASSWORD:
            message = t("Invalid email or password!");
            break;
        case ServerErrors.INVALID_USER:
        case ServerErrors.USER_NOT_FOUND:
            message = t("User not found!");
            break;
        case ServerErrors.USER_DISABLED:
            message = t("This account has been disabled!");
            break;
        case ServerErrors.PLATO_USER_EMAIL_INVALID:
            message = t("The email should be a valid PlatoScience email!");
            break;
        case ServerErrors.CLINIC_CLINICIAN_RELATIONSHIP_ALREADY_CREATED:
            message = t("This relationship has already created!");
            break;
        case ServerErrors.CLINICIAN_NOT_ADMIN:
            message = t("This user is not authorized!");
            break;
        case ServerErrors.CLINIC_CLINICIAN_RELATIONSHIP_NOT_FOUND:
            message = t("The clinician is not authorized to do this action!");
            break;
        case ServerErrors.STIMULATION_NOT_VALID:
            message = t("Stimulation not valid!");
            break;
        case DBErrors.EMAIL_DUPLICATED:
            message = t("This email is been been used!");
            break;
    }
    
    return message;
};

export default getErrorMessage;
