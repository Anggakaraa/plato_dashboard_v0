import { Errors } from '../error';
export const UserType = {
	PLATO: "plato-admin",
	CLINICIAN: "clinician",
	SUPER: "admin",
}

export const isClinicianUser = (type) => type === UserType.CLINICIAN;
export const isPlatoUser = (type) => type === UserType.PLATO;
export const isSuperUser = (type) => type === UserType.SUPER;

export const getId = (type) => {
	switch (type) {
		case UserType.PLATO:
		  return 1;
		case UserType.CLINICIAN:
		  return 2;
		case UserType.SUPER:
		  return 3;	
		default:
		  throw Error(Errors.UNKNOWN_USER_TYPE);
	}
}
