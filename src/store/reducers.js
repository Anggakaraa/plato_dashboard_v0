import { combineReducers } from "redux";

// Front
import Layout from "./layout/reducer";

// Authentication
import Login from "./auth/login/reducer";
import Account from "./auth/register/reducer";
import ForgetPassword from "./auth/forgetpwd/reducer";
import ResetPassword from "./auth/resetpwd/reducer";
import CreatePassword from "./auth/createpwd/reducer";
import Profile from "./auth/profile/reducer";

//E-commerce

//Calendar

//chat

//crypto

//invoices

//jobs

//projects


//tasks

//contacts

//clinics
import clinics from "./clinics/reducer";

//clinics
import clinician from "./clinician/reducer";

//users
import users from "./users/reducer";

//patients
import patients from "./patients/reducer";

//stimulations
import stimulations from "./stimulations/reducer";

//mails

//Dashboard 
import Dashboard from "./dashboard/reducer";

//Dasboard saas
//Dasboard crypto
//Dasboard blog

//Dasboard job
import DashboardJob from "./dashboard-jobs/reducer";

import countries from "./countries/reducer"

import Reports from './reports/reducer'

const rootReducer = combineReducers({
  // public
  Layout,
  Login,
  Account,
  ForgetPassword,
  ResetPassword,
  CreatePassword,
  Profile,
  clinics,
  clinician,
  users,
  countries,
  patients,
  stimulations,
  Dashboard,
  DashboardJob,
  Reports,
});

export default rootReducer;
