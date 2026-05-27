import { all, fork } from "redux-saga/effects";

//public
import AccountSaga from "./auth/register/saga";
import AuthSaga from "./auth/login/saga";
import forgetPasswordSaga from "./auth/forgetpwd/saga";
import resetPasswordSaga from "./auth/resetpwd/saga";
import CreatePasswordSaga from "./auth/createpwd/saga";
import ProfileSaga from "./auth/profile/saga";
import LayoutSaga from "./layout/saga";
import clinicsSaga from "./clinics/saga";
import clinicianSaga from "./clinician/saga";
import usersSaga from "./users/saga";
import countriesSaga from "./countries/saga";
import patientsSaga from "./patients/saga";
import stimulationsSaga from "./stimulations/saga";
import dashboardSaga from "./dashboard/saga";
import dashboardJobSaga from "./dashboard-jobs/saga";
import reportsSaga from "./reports/saga";

export default function* rootSaga() {
  yield all([
    //public
    fork(AccountSaga),
    fork(AuthSaga),
    fork(CreatePasswordSaga),
    fork(forgetPasswordSaga),
    fork(resetPasswordSaga),
    fork(ProfileSaga),
    fork(LayoutSaga),
    fork(clinicsSaga),
    fork(clinicianSaga),
    fork(usersSaga),
    fork(countriesSaga),
    fork(patientsSaga),
    fork(stimulationsSaga),
    fork(dashboardSaga),
    fork(dashboardJobSaga),
    fork(reportsSaga),
  ]);
}
