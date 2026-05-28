import React from "react";
import { Navigate } from "react-router-dom";

// // Profile
import UserProfile from "../pages/Authentication/user-profile";

// // Authentication related pages
import Login from "../pages/Authentication/v2/Login";
import Logout from "../pages/Authentication/Logout";
import Register from "../pages/Authentication/Register";
import RegisterContact from "../pages/Authentication/RegisterContact";
import ForgetPwd from "../pages/Authentication/v2/ForgotPassword";
import ChangePwd from "../pages/Authentication/v2/ChangePassword";
import CreatePassword from "../pages/Authentication/v2/CreatePassword";

// //Pages

// //Contacts
import DashboardUser from "../pages/Dashboard-user";

import Clinics from "../pages/Clinics";

import PlatoUsers from "../pages/Users/PlatoUsers";
import ClinicianUsers from "../pages/Users/ClinicianUsers";
import ClinicianDetail from "../pages/Users/ClinicianDetail";

import Patients from "../pages/Patients";
import PatientDetail from "../pages/Patients/PatientDetail";
import Stimulations from "../pages/Stimulations";
import StimulationDetail from "../pages/Stimulations/StimulationDetail";
import NewStimulation from "../pages/Stimulations/NewStimulation";

import Countries from "../pages/Settings/Countries";

import Reports from "../pages/Reports/index";
import ReportsDetails from "../pages/Reports/details";
import PatientSummary from "../pages/Clinics/Patients";
import NewCustomStimulation from "../pages/Stimulations/NewStimulation/NewCustomStimulation";
import NewClinicStimulation from "../pages/Stimulations/NewStimulation/NewClinicStimulation";
import ClinicStimulationDetail from "../pages/Stimulations/StimulationDetail/ClinicStimulationDetail";
import Treatments from "../pages/Treatments";
import TreatmentsSteps from "../pages/Treatments/treatment-steps";
import TreatmentDetails from "../pages/Treatments/Treatment-Details";
import TreatmentList from "../pages/Treatments/Treatment-List";
import TreatmentProtocols from "../pages/TreatmentProtocols";
import TreatmentAssignment from "../pages/TreatmentAssignment";
import ResourcesPage from "../pages/Resources";

// Gate Pages
import GateHome from "../pages/Gate/Home";
import GatePatients from "../pages/Gate/Patients";
import GateStimulations from "../pages/Gate/Stimulations";
import GateResources from "../pages/Gate/Resources";
import GateDesignSystem from "../pages/Gate/DesignSystem";

// Shared Routes
const sharedAuthRoutes = [
  { path: "/logout", component: <Logout /> },
  { path: "/create-password", component: <CreatePassword /> },
  { path: "/profile", component: <UserProfile /> },
];

// Admin Only Routes
const adminProtectedRoutes = [
  { path: "/dashboard", component: <DashboardUser /> },

  //clinics
  { path: "/clinics", component: <Clinics /> },

  //users
  { path: "/users", component: <PlatoUsers /> },
  { path: "/clinicians", component: <ClinicianUsers /> },
  { path: "/clinician/:guid", component: <ClinicianDetail /> },

  //Patients
  { path: "/patients", component: <Patients /> },
  { path: "/patient/:guid", component: <PatientDetail /> },

  //Treatments
  { path: "/treatments-by-clinic", component: <Treatments /> },

  { path: "/treatments-by-steps", component: <TreatmentList /> },
  { path: "/treatments-by-steps/new", component: <TreatmentsSteps /> },
  {
    path: "/treatments-by-steps/details/:guid",
    component: <TreatmentDetails />,
  },

  //Reports
  { path: "/patient/reports/:guid", component: <Reports /> },
  {
    path: "/patient/report/details/:session_id",
    component: <ReportsDetails />,
  },

  //Patients Summary by Clinic
  {
    path: "/clinics/patients/summary/:clinic_id",
    component: <PatientSummary />,
  },

  //Countries
  { path: "/settings/countries", component: <Countries /> },

  //Stimulations
  { path: "/stimulations", component: <Stimulations /> },
  { path: "/stimulation/:guid", component: <StimulationDetail /> },
  { path: "/stimulation/new/:guid", component: <NewStimulation /> },
  {
    path: "/stimulation/clinic/new/:guid",
    component: <NewClinicStimulation />,
  },
  {
    path: "/stimulation/clinic/detail/:guid",
    component: <ClinicStimulationDetail />,
  },

  // V1 — Treatment Management
  { path: "/treatment-protocols", component: <TreatmentProtocols /> },
  { path: "/treatment-assignment", component: <TreatmentAssignment /> },

  //Resources
  { path: "/resources", component: <ResourcesPage /> },
];

// Clinician Only Routes
const clinicianProtectedRoutes = [
  { path: "/gate/home",          component: <GateHome /> },
  { path: "/gate/patients",      component: <GatePatients /> },
  { path: "/gate/stimulations",  component: <GateStimulations /> },
  { path: "/gate/resources",     component: <GateResources /> },
  { path: "/gate/design",        component: <GateDesignSystem /> },
  { path: "/stimulation/clinic/new/:guid",    component: <NewClinicStimulation /> },
  { path: "/stimulation/clinic/detail/:guid", component: <ClinicStimulationDetail /> },
  { path: "/stimulation/new/:guid",           component: <NewStimulation /> },
  { path: "/patient/:guid",                   component: <PatientDetail /> },
];

const publicRoutes = [
  { path: "/login",            component: <Login /> },
  { path: "/forgot-password",  component: <ForgetPwd /> },
  { path: "/reset-password",   component: <ChangePwd /> },
  { path: "/register",         component: <Register /> },
  { path: "/register-contact", component: <RegisterContact /> },
  { path: "/plato/ui",         component: <GateDesignSystem />, noLayout: true },
];

export { sharedAuthRoutes, adminProtectedRoutes, clinicianProtectedRoutes, publicRoutes };
