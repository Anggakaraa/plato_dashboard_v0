import React, { useEffect, useState, useMemo } from "react";
import PropTypes from "prop-types";
import { useSelector, useDispatch } from "react-redux";
import {
  Card,
  CardBody,
  Col,
  Container,
  Row,
  Modal,
  ModalHeader,
  ModalBody,
  Label,
  Input,
  CardTitle,
  Table,
  Alert,
  UncontrolledTooltip,
  Placeholder,
  Spinner,
  Form,
  FormFeedback,
  Button,
} from "reactstrap";
import withRouter from "../../../../components/Common/withRouter";
import { withTranslation } from "react-i18next";

import {
  getPatient,
  disablePatient,
  enablePatient,
  clearPatientsError,
  getPatientTreatments,
  startPatientTreatment,
  endPatientTreatment,
  addPatientTreatment,
  disablePatientTreatment,
  enablePatientTreatment,
  getInterventionsByTreatment,
  updatePatient,
} from "../../../../store/patients/actions";
import { getClinics } from "../../../../store/clinics/actions";

import { Link } from "react-router-dom";
import {
  Clinic,
  Clinician,
  EndedAt,
  StartedAt,
  TreatmentType,
} from "../patient-treatment-item-list";
import { showToast } from "../../../../util/toast";

import getErrorMessage from "../../../../api/error";

import LocalTableContainer from "../../../../components/Common/LocalTableContainer";
import DebugSidebar from "./DebugSidebar";

import QuestionModal from "../../../../components/Common/QuestionItemModal";
import {
  getClinicStimulations,
  clearClinicStimulations,
} from "../../../../store/stimulations/actions";
import {
  clearClinicians,
  getCliniciansByClinic,
} from "../../../../store/users/actions";
import { getUserReports } from "../../../../store/actions";
import { useFormik } from "formik";
import * as Yup from "yup";
import { del, post, put } from "../../../../api/manager";
import ShowLearnCreate from "../show-learn-create";
import ShowLeftRight from "../show-left-right";

const PlatoPatientDetail = (props) => {
  document.title = `${props.t("My Patient")} | ${props.t("Platoscience")}`;
  const dispatch = useDispatch();

  const { guid } = props;

  const NO_CLINIC = props.t("THERE IS NO CLINIC!");
  const NO_CLINICIAN = props.t("THERE IS NO CLINICIAN!");

  const isValidClinic = (value) => value !== NO_CLINIC;

  const [selectedClinician, setSelectedClinician] = useState(undefined);
  const { clinician_users, loadingClinicians, errorClinicians } = useSelector(
    (state) => ({
      clinician_users: state.users.clinician_users,
      loadingClinicians: state.users.loading,
      errorClinicians: state.users.error,
    }),
  );

  const [selectedStimulations, setSelectedStimulations] = useState([]);
  const { clinic_stimulations, loadingStimulations, errorStimulations } =
    useSelector((state) => ({
      clinic_stimulations: state.stimulations.clinic_stimulations,
      loadingStimulations: state.stimulations.loading,
      errorStimulations: state.stimulations.error,
    }));

  const [selectedClinic, setSelectedClinic] = useState(undefined);
  const { clinics, errorClinics } = useSelector((state) => ({
    clinics: state.clinics.clinics,
    errorClinics: state.clinics.error,
  }));

  const { patient, patient_treatments, interventions, error, loading } =
    useSelector((state) => ({
      patient: state.patients.patient,
      patient_treatments: state.patients.patient_treatments,
      interventions: state.patients.interventions,
      error: state.patients.error,
      loading: state.patients.loading,
    }));

  const {
    count_reports,
    loading: loading_reports,
    error: error_reports,
  } = useSelector((state) => ({
    count_reports: state.Reports.count_reports,
  }));

  const [treatment, setTreatment] = useState(undefined);

  const [addTreatmentModal, setAddTreatmentModal] = useState(false);

  const resetPayloadState = () => {
    setShamList([]);
    setSlideList([]);
    setSelectedStimulations([]);
    setShamState(false);
    setAllowUpdateCurrentState(false);
    setOneSessionByDayState(false);
    setResearchTreatmentState(false);
  };

  const toggleTreatmentModal = () => {
    if (addTreatmentModal) resetPayloadState();
    setAddTreatmentModal(!addTreatmentModal);
  };

  const [addResearchTreatmentModal, setAddResearchTreatmentModal] =
    useState(false);
  const toggleResearchTreatmentModal = () => {
    if (addResearchTreatmentModal) resetPayloadState();
    setAddResearchTreatmentModal(!addResearchTreatmentModal);
  };

  const [interventionsModal, setInterventionsModal] = useState(false);
  const toggleInterventionsModal = () =>
    setInterventionsModal(!interventionsModal);

  const [disablePatientModal, setDisablePatientModal] = useState(false);
  const [enablePatientModal, setEnablePatientModal] = useState(false);

  const [disableTreatmentModal, setDisableTreatmentModal] = useState(false);
  const [enableTreatmentModal, setEnableTreatmentModal] = useState(false);
  const [canAddTreatment, setCanAddTreatment] = useState(false);

  const [isShamState, setShamState] = useState(false);
  const [allowUpdateCurrentState, setAllowUpdateCurrentState] = useState(false);
  const [oneSessionByDayState, setOneSessionByDayState] = useState(false);
  const [researchTreatmentState, setResearchTreatmentState] = useState(false);

  const [modal, setModal] = useState(false);
  const [patientItem, setPatient] = useState(undefined);
  const [editMode, setEditMode] = useState(false);

  const [selectedTreatment, setSelectedTreatment] = useState(null);
  const [interventionsList, setInterventionsList] = useState([]);
  const [isSaveLoading, setIsSaveLoading] = useState("hidden");
  const [isDeleteLoading, setIsDeleteLoading] = useState("hidden");
  const [isUpdatePasswordLoading, setIsUpdatePasswordLoading] =
    useState("hidden");
  const [isOptionSelected, setIsOptionSelected] = useState(false);
  const [message, setMessage] = useState("");
  const [shamList, setShamList] = useState([]);
  const [slideList, setSlideList] = useState([]);

  const [isShamActive, setIsShamActive] = useState(false);

  // Debug Sidebar State
  const [debugSidebarOpen, setDebugSidebarOpen] = useState(false);
  const [debugMode, setDebugMode] = useState(null); // 'standard' | 'research'

  const toggleDebugSidebar = () => setDebugSidebarOpen(!debugSidebarOpen);

  const removeIntervention = async (intervention) => {
    setIsDeleteLoading("");
    const baseurl = import.meta.env.VITE_APP_API_URL;
    const [data] = await Promise.all([
      await del(
        `${baseurl}/patient-treatment/interventions?guid=${intervention}`,
        true,
        {},
      ),
    ]);
    dispatch(getInterventionsByTreatment(selectedTreatment.guid));
    setIsDeleteLoading("hidden");
    return data;
  };

  const addNewIntervention = async () => {
    setIsSaveLoading("");
    const baseurl = import.meta.env.VITE_APP_API_URL;
    const newInterventions = interventionsList.filter(
      (intervention) => intervention.confirmed == false,
    );
    const toSave = [];
    newInterventions.map((intervention) => {
      const obj = {
        treatment_id: selectedTreatment.id,
        stimulation_id: intervention.tes_stimulation.id,
      };
      toSave.push(obj);
    });
    const [data] = await Promise.all([
      await post(
        `${baseurl}/patient-treatment/new-interventions`,
        { payload: toSave },
        true,
        {},
      ),
    ]);
    dispatch(getInterventionsByTreatment(selectedTreatment.guid));
    setIsSaveLoading("hidden");
    setIsOptionSelected(false);
    const checkboxes = document.querySelectorAll(".form-check-input");
    checkboxes.forEach((checkbox) => {
      checkbox.checked = false;
    });
    return data;
  };

  const updateIntervention = async (intervention, status) => {
    setIsDeleteLoading("");
    const baseurl = import.meta.env.VITE_APP_API_URL;
    const [data] = await Promise.all([
      await put(
        `${baseurl}/patient-treatment/update-intervention?guid=${intervention}`,
        { payload: { status: status } },
        true,
        {},
      ),
    ]);
    dispatch(getInterventionsByTreatment(selectedTreatment.guid));
    setIsDeleteLoading("hidden");
    return data;
  };

  useEffect(() => {
    setInterventionsList(interventions);
  }, [interventions]);

  useEffect(() => {
    const filtered = selectedStimulations.filter(
      (stimulation) => stimulation.selected,
    );
    if (filtered.length === 0) {
      setCanAddTreatment(false);
      return;
    }

    setCanAddTreatment(true);
  }, [selectedStimulations]);

  useEffect(() => {
    if (!selectedClinic) {
      setSelectedStimulations([]);
      return;
    }

    setSelectedStimulations([]);
    dispatch(getCliniciansByClinic(selectedClinic.guid));
    dispatch(getClinicStimulations(selectedClinic.guid));
  }, [selectedClinic]);

  useEffect(() => {
    if (!clinic_stimulations || clinic_stimulations.length === 0) {
      setSelectedStimulations([]);
      return;
    }

    const originalValues = clinic_stimulations.filter(
      (value) => value.original,
    );

    const values = originalValues.map((value) => {
      return { guid: value.guid, selected: false };
    });

    setSelectedStimulations(values);
  }, [clinic_stimulations]);

  useEffect(() => {
    dispatch(getClinics());
    dispatch(getPatient(guid));
    dispatch(getPatientTreatments(guid));
    dispatch(getUserReports(guid));
    //<button onClick={() => dispatch(getUserReports(guid))}>Load</button>
    //setInterventionsList(interventions)
  }, []);

  useEffect(() => {
    if (!clinics || clinics.length === 0) return;
    setSelectedClinic(clinics[0]);
  }, [clinics]);

  useEffect(() => {
    if (!clinician_users || clinician_users.length === 0) return;
    setSelectedClinician(clinician_users[0]);
  }, [clinician_users]);

  const isSelectedStimulation = (guid, stimulation) => {
    const value = selectedStimulations.find((value) => value.guid === guid);
    if (!value) return false;
    return value.selected;
  };

  const isSelectedStimulationForEdition = (stimulation) => {
    const value = selectedStimulations.find(
      (value) => value.guid === stimulation.guid,
    );
    if (!value) return false;
    return value.selected;
  };

  const switchStimulation = (guid) => {
    const previous = selectedStimulations.find((value) => value.guid === guid);
    if (!previous) {
      setSelectedStimulations([
        ...selectedStimulations,
        { guid: guid, selected: true },
      ]);
      return;
    }

    const values = selectedStimulations.map((value) => {
      if (value.guid === guid) {
        return { ...value, selected: !value.selected };
      }
      return value;
    });
    setSelectedStimulations(values);
  };

  /**
   * Function to set the sham value for the selected stimulation
   * @param {*} guid
   * @param {*} isChecked
   */
  const setForSham = (guid, isChecked, current) => {
    const slideSwitch = document.getElementById(`slideSwitch-${guid}`);
    //const researchTreatment = document.getElementById(`researchTreatment`)
    if (isChecked) {
      if (slideSwitch) {
        slideSwitch.disabled = true;
        slideSwitch.checked = false;
        //researchTreatment.disabled = false
        //researchTreatment.checked = true
        //setResearchTreatmentState(true)
        setForSlide(guid, false);
      }
    } else {
      if (slideSwitch && current === 120) {
        slideSwitch.disabled = false;
      }
    }

    const localShamList = [...shamList];
    const previous = shamList.find((value) => value === guid);
    if (isChecked) {
      if (!previous) {
        localShamList.push(guid);
        setShamList(localShamList);
      }
    } else {
      if (previous) {
        const index = localShamList.indexOf(guid);
        localShamList.splice(index, 1);
        setShamList(localShamList);
      }
    }
  };

  /**
   * Function to set the slide value for the selected stimulation
   * @param {*} guid
   * @param {*} isChecked
   */
  const setForSlide = (guid, isChecked) => {
    const localSlideList = [...slideList];
    const previous = slideList.find((value) => value === guid);
    if (isChecked) {
      if (!previous) {
        localSlideList.push(guid);
        setSlideList(localSlideList);
      }
    } else {
      if (previous) {
        const index = localSlideList.indexOf(guid);
        localSlideList.splice(index, 1);
        setSlideList(localSlideList);
      }
    }
  };

  const isMostRecentTreatment = (_treatment) => {
    if (
      patient_treatments.length > 0 &&
      _treatment.guid === patient_treatments[patient_treatments.length - 1].guid
    ) {
      return true;
    }

    return false;
  };

  const columns = useMemo(
    () => [
      {
        Header: props.t("Treatment Name"),
        accessor: "name",
        disableFilters: true,
        filterable: false,
        Cell: (cellProps) => {
          return cellProps.value ? cellProps.value : "-";
        },
      },
      {
        Header: props.t("Treatment Type"),
        disableFilters: true,
        filterable: false,
        Cell: (cellProps) => {
          const item = cellProps.row.original;
          return <TreatmentType {...item} />;
        },
      },
      {
        Header: props.t("Clinic"),
        disableFilters: true,
        filterable: false,
        Cell: (cellProps) => {
          const item = cellProps.row.original;
          return <Clinic {...item} />;
        },
      },
      {
        Header: props.t("Clinician"),
        disableFilters: true,
        filterable: false,
        Cell: (cellProps) => {
          const item = cellProps.row.original;
          return <Clinician {...item} />;
        },
      },
      {
        Header: props.t("StartedAt"),
        accessor: "started_at",
        disableFilters: true,
        filterable: true,
        Cell: (cellProps) => {
          const item = cellProps.row.original;
          if (item.disabled) {
            if (item.started_at) return <StartedAt {...cellProps} />;
            return "-";
          }

          if (!item.started_at) return props.t("Not started");
          return <StartedAt {...cellProps} />;
        },
      },
      {
        Header: props.t("Start"),
        disableFilters: true,
        Cell: (cellProps) => {
          const item = cellProps.row.original;
          if (item.disabled) return "-";
          const disabled = item.started_at ? true : false;
          return (
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <button
                disabled={disabled}
                className="btn btn-success save-user"
                onClick={() => dispatch(startPatientTreatment(item.guid))}
              >
                {props.t("Start")}
              </button>
            </div>
          );
        },
      },
      {
        Header: props.t("EndedAt"),
        accessor: "ended_at",
        disableFilters: true,
        filterable: true,
        Cell: (cellProps) => {
          const item = cellProps.row.original;
          if (item.disabled) {
            if (item.ended_at) return <EndedAt {...cellProps} />;
            return "-";
          }

          if (item.started_at && !item.ended_at) return props.t("Ongoing");
          return "-";
        },
      },
      {
        Header: props.t("End"),
        disableFilters: true,
        Cell: (cellProps) => {
          const item = cellProps.row.original;
          if (item.disabled) return "-";

          const disabled = !item.started_at || item.ended_at ? true : false;
          return (
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <button
                disabled={disabled}
                className="btn btn-success save-user"
                onClick={() => dispatch(endPatientTreatment(item.guid))}
              >
                {props.t("End")}
              </button>
            </div>
          );
        },
      },
      {
        Header: props.t("Active"),
        Cell: (cellProps) => {
          const item = cellProps.row.original;
          const isActive = () => item.disabled === false;

          const getColor = () => (isActive() ? "text" : "text-danger");
          const getIcon = () =>
            isActive()
              ? "mdi mdi-check-circle font-size-18"
              : "mdi mdi-close-circle font-size-18";

          const showEnableDisable = () => {
            return (
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <Link
                  to="#"
                  className={getColor()}
                  onClick={() =>
                    isActive()
                      ? onClickDisableTreatment(item)
                      : onClickEnableTreatment(item)
                  }
                >
                  <i className={getIcon()} id="activetooltip" />
                  <UncontrolledTooltip placement="top" target="activetooltip">
                    {`${props.t("Enable/Disable")} ${props.t("Treatment")}`}
                  </UncontrolledTooltip>
                </Link>
              </div>
            );
          };

          if (isMostRecentTreatment(item)) {
            if (item.started_at && item.ended_at) return "-";
            if (!item.started_at && !item.ended_at) return "-";
            return showEnableDisable();
          }

          if (item.disabled) {
            if (item.started_at && item.ended_at) return "-";
            if (!item.started_at && !item.ended_at) return "-";
          }

          return showEnableDisable();
        },
      },

      {
        Header: props.t("Sham"),
        Cell: (cellProps) => {
          const item = cellProps.row.original;

          const getColor = () =>
            item.is_sham ? "text-success" : "text-danger";
          const getIcon = () =>
            item.is_sham
              ? "mdi mdi-check-circle font-size-18"
              : "mdi mdi-close-circle font-size-18";

          const showEnableDisable = () => {
            return (
              <div
                className={getColor()}
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <i className={getIcon()} />
              </div>
            );
          };

          return showEnableDisable();
        },
      },
      {
        Header: props.t("Allow Update Current"),
        Cell: (cellProps) => {
          const item = cellProps.row.original;

          const getColor = () =>
            item.allow_update_electric_current ? "text-success" : "text-danger";
          const getIcon = () =>
            item.allow_update_electric_current
              ? "mdi mdi-check-circle font-size-18"
              : "mdi mdi-close-circle font-size-18";

          const showEnableDisable = () => {
            return (
              <div
                className={getColor()}
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <i className={getIcon()} />
              </div>
            );
          };

          return showEnableDisable();
        },
      },

      {
        Header: "Interventions",
        Cell: (cellProps) => {
          const item = cellProps.row.original;
          return (
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Link
                to="#"
                className={`text-success ${item.disabled ? "text-muted" : ""}`}
                onClick={() => {
                  setSelectedTreatment(item);
                  dispatch(getInterventionsByTreatment(item.guid));
                  setSelectedClinic(item.clinic_clinician.clinic);
                  if (
                    item.clinic_clinician.clinic &&
                    item.clinic_clinician.clinic.guid
                  ) {
                    dispatch(
                      getCliniciansByClinic(item.clinic_clinician.clinic.guid),
                    );
                  }
                  setSelectedClinician(item.clinic_clinician.clinician);
                  toggleInterventionsModal();
                }}
              >
                <i
                  className="mdi mdi-clipboard-text-outline font-size-18"
                  id="edittooltip"
                />
                <UncontrolledTooltip placement="top" target="edittooltip">
                  {props.t("Show interventions")}
                </UncontrolledTooltip>
              </Link>
            </div>
          );
        },
      },
    ],
    [],
  );

  const onAddTreatment = () => {
    setTreatment(undefined);
    setShamState(false);
    toggleTreatmentModal();
  };

  const onAddResearchTreatment = () => {
    setTreatment(undefined);
    setShamState(false);
    toggleResearchTreatmentModal();
  };

  const onClickDisableTreatment = (_treatment) => {
    setTreatment(_treatment);
    setDisableTreatmentModal(true);
  };

  const onClickEnableTreatment = (_treatment) => {
    setTreatment(_treatment);
    setEnableTreatmentModal(true);
  };

  const handleDisableTreatment = () => {
    if (treatment) {
      dispatch(disablePatientTreatment(treatment.guid));
    }

    setDisableTreatmentModal(false);
  };

  const handleEnableTreatment = () => {
    if (treatment) {
      dispatch(enablePatientTreatment(treatment.guid));
    }

    setEnableTreatmentModal(false);
  };

  const onClickEnable = () => {
    setEnablePatientModal(true);
  };

  const onClickDisable = () => {
    setDisablePatientModal(true);
  };

  const handleDisablePatient = () => {
    if (patient && patient.guid) {
      dispatch(disablePatient(patient.guid));
    }

    setDisablePatientModal(false);
  };

  const handleEnablePatient = () => {
    if (patient && patient.guid) {
      dispatch(enablePatient(patient.guid));
    }

    setEnablePatientModal(false);
  };

  const showActions = () => {
    const active = patient?.disabled == false;
    if (active) {
      return (
        <>
          {loading ? (
            <>
              <Alert color="info" role="alert">
                {props.t("Loading...")}
              </Alert>
            </>
          ) : (
            ""
          )}

          <button
            type="button"
            disabled={loading}
            onClick={onClickDisable}
            className="btn btn-danger "
          >
            <i className="bx bx-block font-size-16 align-middle me-2"></i>{" "}
            {props.t("Disable")}
          </button>
        </>
      );
    }

    return (
      <>
        <button
          type="button"
          disabled={loading}
          onClick={onClickEnable}
          className="btn btn-success "
        >
          <i className="bx bx-check-double font-size-16 align-middle me-2"></i>{" "}
          {props.t("Enable")}
        </button>
      </>
    );
  };

  const getClinicsLabels = () => {
    return (
      <>
        {clinics.length > 0 ? (
          clinics.map((clinic) => (
            <option
              key={clinic.guid}
              value={isValidClinic(clinic) ? clinic.guid : undefined}
            >{`${clinic.name} | ${clinic.country}`}</option>
          ))
        ) : (
          <option value={undefined}>{NO_CLINIC}</option>
        )}
      </>
    );
  };

  const addSelectedStimulations = async (stimulation, status) => {
    if (status) {
      const check = interventions.some(
        (intervention) =>
          intervention.tes_stimulation.guid === stimulation.guid,
      );
      if (check) {
        setMessage("This stimulation is already added");
        setTimeout(() => {
          setMessage("");
        }, 3000);
        return;
      }
      const tes_stimulation = {
        disabled: stimulation.disabled,
        guid: stimulation.guid,
        tes_stimulation: stimulation,
        confirmed: false,
      };
      interventions.push(tes_stimulation);
    } else {
      const index = interventions.findIndex(
        (intervention) =>
          intervention.tes_stimulation.guid === stimulation.guid,
      );
      interventions.findIndex((intervention) => {
        if (
          intervention.tes_stimulation.guid === stimulation.guid &&
          intervention.confirmed === false
        ) {
          interventions.splice(index, 1);
          return;
        }
      });
    }
    setInterventionsList(interventions);
  };

  const createStimulationRow = (stimulation) => {
    return (
      <tr key={stimulation.guid}>
        <td>{stimulation.title}</td>
        <td>
          {
            stimulation.tes_stimulations_tdcs_parameters[0]?.tdcs_parameter
              .anode
          }
        </td>
        <td>
          {
            stimulation.tes_stimulations_tdcs_parameters[0]?.tdcs_parameter
              .cathode
          }
        </td>
        <td>
          {stimulation.tes_stimulations_tdcs_parameters[0]?.tdcs_parameter
            .current / 100}{" "}
          mA
        </td>
        <td>
          {stimulation.tes_stimulations_tdcs_parameters[0]?.tdcs_parameter
            .duration / 60}{" "}
          min
        </td>
        <td>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <div
              style={{
                backgroundColor: stimulation.color,
                height: 20,
                width: 20,
              }}
            ></div>
          </div>
        </td>
        <td>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            {stimulation.original.toString()}
          </div>
        </td>
        <td className={addResearchTreatmentModal ? "hidden" : ""}>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <div className="form-check form-switch ">
              <input
                type="checkbox"
                className="form-check-input"
                id={`slideSwitch-${stimulation.guid}`}
                onChange={(e) => {
                  setForSlide(stimulation.guid, e.target.checked);
                }}
                onBlur={(e) => {
                  setForSlide(stimulation.guid, e.target.checked);
                }}
                disabled={
                  stimulation.tes_stimulations_tdcs_parameters[0]
                    ?.tdcs_parameter.current !== 120
                }
              />
            </div>
          </div>
        </td>
        <td className={addTreatmentModal ? "hidden" : ""}>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <div className="form-check form-switch">
              <input
                type="checkbox"
                className="form-check-input"
                id={`shamSwitch-${stimulation.guid}`}
                onChange={(e) => {
                  setForSham(
                    stimulation.guid,
                    e.target.checked,
                    stimulation.tes_stimulations_tdcs_parameters[0]
                      ?.tdcs_parameter.current,
                  );
                }}
                onBlur={(e) => {
                  setForSham(
                    stimulation.guid,
                    e.target.checked,
                    stimulation.tes_stimulations_tdcs_parameters[0]
                      ?.tdcs_parameter.current,
                  );
                }}
              />
            </div>
          </div>
        </td>
        <td>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <div className="form-check form-switch">
              <input
                type="checkbox"
                className="form-check-input"
                id="customSwitch2"
                checked={isSelectedStimulation(stimulation.guid, stimulation)}
                onChange={(e) => {}}
                onClick={(e) => switchStimulation(stimulation.guid)}
              />
            </div>
          </div>
        </td>
      </tr>
    );
  };

  const createStimulationRowForEdition = (stimulation) => {
    return (
      <tr key={stimulation.guid}>
        <td>{stimulation.title}</td>
        <td>
          {
            stimulation.tes_stimulations_tdcs_parameters[0].tdcs_parameter.anode
          }{" "}
        </td>
        <td>
          {
            stimulation.tes_stimulations_tdcs_parameters[0].tdcs_parameter
              .cathode
          }{" "}
        </td>
        <td>
          {stimulation.tes_stimulations_tdcs_parameters[0].tdcs_parameter
            .current / 100}{" "}
          mA
        </td>
        <td>
          {stimulation.tes_stimulations_tdcs_parameters[0].tdcs_parameter
            .duration / 60}{" "}
          min
        </td>
        <td>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <div
              style={{
                backgroundColor: stimulation.color,
                height: 20,
                width: 20,
              }}
            ></div>
          </div>
        </td>
        <td>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            {stimulation.original.toString()}
          </div>
        </td>
        <td>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <div className="form-check form-switch">
              <input
                type="checkbox"
                className="form-check-input"
                id="customSwitchEdition"
                selected={isOptionSelected}
                onClick={(e) =>
                  addSelectedStimulations(stimulation, e.target.checked)
                }
                onChange={(e) => {}}
                //onClick={(e) => switchStimulation(stimulation.guid)}
              />
            </div>
          </div>
        </td>
      </tr>
    );
  };

  const showClinicians = () => {
    if (loadingClinicians) {
      return (
        <Row>
          <Col>
            <Spinner size={"sm"} color="primary" />
          </Col>
        </Row>
      );
    }
    if (!clinician_users || clinician_users.length === 0) {
      return (
        <Alert color="info">
          {props.t("The selected clinic has no clinicians")}
        </Alert>
      );
    }

    return (
      <Row>
        <Col>
          <div className="mb-3">
            <Label className="form-label">{props.t("Clinician")}</Label>
            <Input
              type="select"
              name="clinician"
              className="form-select"
              multiple={false}
              onChange={(e) => setSelectedClinician(JSON.parse(e.target.value))}
              value={selectedClinician ? JSON.stringify(selectedClinician) : ""}
            >
              <>
                {clinician_users.length > 0 ? (
                  clinician_users.map((clinician) => (
                    <option
                      key={clinician.guid}
                      value={JSON.stringify(clinician)}
                    >{`${clinician.name} | ${clinician.email}`}</option>
                  ))
                ) : (
                  <option value={undefined}>{NO_CLINICIAN}</option>
                )}
              </>
            </Input>
          </div>
        </Col>
        {loadingClinicians ? (
          <Col xl={1}>
            <Spinner size={"sm"} color="primary" />
          </Col>
        ) : null}
      </Row>
    );
  };

  const showStimulations = () => {
    if (
      !selectedClinic ||
      !clinic_stimulations ||
      clinic_stimulations.length === 0
    ) {
      return <>{props.t("Please select the clinic")}</>;
    }

    return (
      <>
        <Col lg={12}>
          <div className="mb-3">
            <Label className="form-label">{props.t("Stimulations")}</Label>
            <div
              style={{
                maxHeight: "250px",
                overflowY: "auto",
              }}
            >
              <Table bordered>
                <thead className="table-light">
                  <tr>
                    <th>{props.t("Title")}</th>
                    <th>Anode</th>
                    <th>Cathode</th>
                    <th>Current</th>
                    <th>Duration</th>
                    <th>
                      <div
                        style={{
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                        }}
                      >
                        {props.t("Color")}
                      </div>
                    </th>
                    <th>
                      <div
                        style={{
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                        }}
                      >
                        {props.t("Original")}
                      </div>
                    </th>
                    <th className={addResearchTreatmentModal ? "hidden" : ""}>
                      <div
                        style={{
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                        }}
                      >
                        {props.t("Allow Slide")}
                      </div>
                    </th>
                    <th className={addTreatmentModal ? "hidden" : ""}>
                      <div
                        style={{
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                        }}
                      >
                        {props.t("Allow Sham")}
                      </div>
                    </th>
                    <th>
                      <div
                        style={{
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                        }}
                      >
                        {props.t("Active")}
                      </div>
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {clinic_stimulations.map((stimulation, index) => {
                    // Adiciona a propriedade 'sham' ao objeto de estimulação
                    const updatedStimulation = { ...stimulation, sham: false };
                    return createStimulationRow(updatedStimulation);
                  })}
                </tbody>
              </Table>
            </div>
          </div>
        </Col>
      </>
    );
  };

  const showStimulationsEdition = () => {
    if (
      !selectedClinic ||
      !clinic_stimulations ||
      clinic_stimulations.length === 0
    ) {
      return <>{props.t("Please select the clinic")}</>;
    }

    return (
      <>
        <Col lg={12}>
          <div className="mb-3">
            <Label className="form-label">{props.t("Stimulations")}</Label>
            <div
              style={{
                maxHeight: "250px",
                overflowY: "auto",
              }}
            >
              <Table bordered>
                <thead className="table-light">
                  <tr>
                    <th>{props.t("Title")}</th>
                    <th>Anode</th>
                    <th>Cathode</th>
                    <th>Current</th>
                    <th>Duration</th>
                    <th>
                      <div
                        style={{
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                        }}
                      >
                        {props.t("Color")}
                      </div>
                    </th>
                    <th>
                      <div
                        style={{
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                        }}
                      >
                        {props.t("Original")}
                      </div>
                    </th>
                    <th>
                      <div
                        style={{
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                        }}
                      >
                        {props.t("Active")}
                      </div>
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {clinic_stimulations.map((stimulation) =>
                    createStimulationRowForEdition(stimulation),
                  )}
                </tbody>
              </Table>
            </div>
          </div>
        </Col>
      </>
    );
  };

  const createInterventionRow = (intervention) => {
    const stimulation = intervention.tes_stimulation;
    return (
      <tr key={intervention.guid}>
        <td>{stimulation.title}</td>
        <td>
          {
            stimulation.tes_stimulations_tdcs_parameters[0]?.tdcs_parameter
              .anode
          }
        </td>
        <td>
          {
            stimulation.tes_stimulations_tdcs_parameters[0]?.tdcs_parameter
              .cathode
          }
        </td>
        <td>
          {stimulation.tes_stimulations_tdcs_parameters[0]?.tdcs_parameter
            .current / 100}{" "}
          mA
        </td>
        <td>
          {stimulation.tes_stimulations_tdcs_parameters[0]?.tdcs_parameter
            .duration / 60}{" "}
          min
        </td>
        <td>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <div
              style={{
                backgroundColor: stimulation.color,
                height: 20,
                width: 20,
              }}
            ></div>
          </div>
        </td>
        <td>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            {stimulation.original.toString()}
          </div>
        </td>
        <td>
          {intervention.sham ? (
            <i className="mdi mdi-shield-check font-size-18 text-success" />
          ) : (
            <i className="mdi mdi-shield-check font-size-18 text-danger" />
          )}
        </td>
        <td>
          {intervention.slider ? (
            <i className="mdi mdi-tune-variant font-size-18 text-success" />
          ) : (
            <i className="mdi mdi-tune-variant font-size-18 text-danger" />
          )}
        </td>
        <td className="">
          {intervention.hasOwnProperty("confirmed") ? (
            <Link onClick={() => {}}>
              <i className="mdi mdi-check font-size-18 text-info" />
            </Link>
          ) : intervention.disabled === true ? (
            <Link onClick={() => updateIntervention(intervention.guid, false)}>
              <i className="mdi mdi-close-box font-size-18 text-danger" />
            </Link>
          ) : (
            <Link onClick={() => updateIntervention(intervention.guid, true)}>
              <i className="mdi mdi-check font-size-18 text-info" />
            </Link>
          )}
        </td>
        <td className="">
          <Link
            className="hidden btn btn-info btn-sm"
            to={`/stimulation/${stimulation.guid}`}
          >
            Edit
          </Link>
          {intervention.hasOwnProperty("confirmed") ? (
            <Link onClick={() => addNewIntervention(intervention)}>
              <i className="mdi mdi-check font-size-18 text-info" />
            </Link>
          ) : (
            <Link onClick={() => removeIntervention(intervention.guid)}>
              <i className="mdi mdi-close-box font-size-18 text-danger" />
            </Link>
          )}
        </td>
      </tr>
    );
  };

  const showInterventions = () => {
    if (!interventionsList || interventionsList.length === 0) {
      return <Spinner size={"sm"} color="primary" />;
    }

    return (
      <>
        <Col lg={12}>
          <div className="mb-3">
            <Label className="form-label">
              {props.t("Active Stimulations")}
            </Label>
            <div
              style={{
                maxHeight: "500px",
                overflowY: "auto",
                overflowX: "hidden",
              }}
            >
              <Table bordered>
                <thead className="table-light">
                  <tr>
                    <th>{props.t("Title")}</th>
                    <th>{"Anode"}</th>
                    <th>Cathode</th>
                    <th>Current</th>
                    <th>Duration</th>
                    <th>
                      <div
                        style={{
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                        }}
                      >
                        {props.t("Color")}
                      </div>
                    </th>
                    <th>
                      <div
                        style={{
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                        }}
                      >
                        {props.t("Original")}
                      </div>
                    </th>
                    <th>Sham</th>
                    <th>Slider</th>
                    <th>Active</th>
                    <th>Delete</th>
                  </tr>
                </thead>
                <tbody>
                  {interventionsList.map((_intervention) =>
                    createInterventionRow(_intervention),
                  )}
                </tbody>
              </Table>
            </div>
            <div className="d-flex flex-row-reverse bd-highlight">
              <i
                className={`bx bx-loader-circle bx-spin font-size-24 ${isDeleteLoading}`}
              ></i>
            </div>
          </div>
        </Col>
      </>
    );
  };

  const getPayload = (overrides = {}) => {
    if (!selectedClinic) return { error: "No selected clinic" };
    if (!selectedClinician)
      return { error: "No selected clinician", clinic: selectedClinic };

    const filtered = selectedStimulations.filter(
      (stimulation) => stimulation.selected,
    );

    let filteredWithSham = [];
    const isShamSlider = [...shamList, ...slideList];
    if (isShamSlider.length > 0) {
      filteredWithSham = filtered.map((value) => {
        if (shamList.includes(value.guid)) {
          return { ...value, is_sham: true };
        } else {
          return { ...value, is_sham: false };
        }
      });
    }

    const filteredWithShamSlide = filteredWithSham.map((value) => {
      if (slideList.includes(value.guid)) {
        return { ...value, allow_slide: true };
      }
      return { ...value, allow_slide: false };
    });

    const guids = filtered.map((value) => value.guid);
    const data = {
      patient: guid,
      clinic: selectedClinic.guid,
      clinician: selectedClinician.guid,
      stimulations: guids,
      is_sham:
        filteredWithShamSlide.length > 0 ? filteredWithShamSlide : isShamState,
      research_treatment:
        overrides.research_treatment !== undefined
          ? overrides.research_treatment
          : researchTreatmentState === true
            ? 1
            : 0,
      allow_update_electric_current: isShamState
        ? false
        : allowUpdateCurrentState,
      sessions_by_day: oneSessionByDayState == true ? 1 : 0,
    };

    return data;
  };

  function setSham(isChecked) {
    setShamState(isChecked);
    if (isChecked) {
      setAllowUpdateCurrentState(false);
    }
  }

  const showAddTreatmentModal = () => {
    return (
      <Modal
        size="xl"
        isOpen={addTreatmentModal}
        style={{
          transform: debugSidebarOpen ? "translateX(-200px)" : "none",
          transition: "transform 0.3s ease-in-out",
        }}
        onOpened={() => {
          if (!clinics || clinics.length === 0) return;
          setSelectedClinic(clinics[0]);

          if (!clinician_users || clinician_users.length === 0) return;
          setSelectedClinician(clinician_users[0]);
        }}
        onClosed={() => {
          setSelectedClinic(undefined);
          dispatch(clearClinicStimulations());
          dispatch(clearClinicians());
          setDebugSidebarOpen(false);
        }}
        toggle={toggleTreatmentModal}
      >
        <ModalHeader toggle={toggleTreatmentModal} tag="h4">
          {props.t("Add Treatment")}
        </ModalHeader>
        <ModalBody>
          <>
            <Row>
              <Col>
                <div className="mb-3">
                  <Label className="form-label">{props.t("Clinic")}</Label>
                  <Input
                    type="select"
                    name="clinic"
                    className="form-select"
                    multiple={false}
                    onChange={(e) =>
                      setSelectedClinic(
                        clinics.find((c) => c.guid === e.target.value),
                      )
                    }
                    value={selectedClinic ? selectedClinic.guid : ""}
                  >
                    {getClinicsLabels()}
                  </Input>
                </div>
              </Col>
              {loadingStimulations ? (
                <Col xl={1}>
                  <Spinner size={"sm"} color="primary" />
                </Col>
              ) : null}
            </Row>
            {showClinicians()}
            {showStimulations()}
            <Row>
              <Col className="hidden">
                <div className="form-check form-switch mb-3 ">
                  <label
                    className="form-check-label"
                    htmlFor="setCurrentUpdateState"
                  >
                    Allow patient to adjust stimulation intensity
                  </label>
                  <input
                    className="form-check-input"
                    type="checkbox"
                    id="setCurrentUpdateState"
                    onClick={(e) =>
                      setAllowUpdateCurrentState(e.target.checked)
                    }
                    disabled={isShamState}
                  />
                </div>
              </Col>
              <Col className="hidden">
                <div className="form-check form-switch mb-3 ">
                  <label className="form-check-label" htmlFor="setShamState">
                    Sham for all stimulation
                  </label>
                  <input
                    className="form-check-input"
                    type="checkbox"
                    id="setShamState"
                    onClick={(e) => setSham(e.target.checked)}
                  />
                </div>
              </Col>
              <Col className={"hidden"}>
                <div className="form-check form-switch mb-3">
                  <label
                    className="form-check-label"
                    htmlFor="oneSessionByDayState"
                  >
                    One session per day
                  </label>
                  <input
                    className="form-check-input"
                    type="checkbox"
                    id="oneSessionByDayState"
                    onClick={(e) => setOneSessionByDayState(e.target.checked)}
                  />
                </div>
              </Col>
            </Row>
            <Row>
              <Col className={"hidden"}>
                <div className="form-check form-switch mb-3">
                  <label
                    className="form-check-label"
                    htmlFor="researchTreatment"
                  >
                    Research Treatment
                  </label>
                  <input
                    className="form-check-input"
                    type="checkbox"
                    id="researchTreatment"
                    //disabled={shamList.length === 0}
                    onClick={(e) => setResearchTreatmentState(e.target.checked)}
                  />
                </div>
              </Col>
            </Row>
            <Row>
              <Col className="d-flex justify-content-between align-items-center">
                <Button
                  color="link"
                  className="text-muted p-0 text-decoration-none"
                  size="sm"
                  onClick={() => {
                    setDebugMode("standard");
                    setDebugSidebarOpen(true);
                  }}
                >
                  <i className="mdi mdi-code-tags me-1"></i>Debug
                </Button>
                <div className="text-end">
                  <button
                    disabled={!canAddTreatment}
                    className="btn btn-success save-user"
                    onClick={() => {
                      const data = getPayload();
                      if (
                        !data.stimulations ||
                        data.stimulations.length === 0
                      ) {
                        showToast(
                          "Please select at least one stimulation",
                          "error",
                        );
                        return;
                      }

                      dispatch(addPatientTreatment(data));
                      setResearchTreatmentState(false);
                      setAllowUpdateCurrentState(false);
                      setOneSessionByDayState(false);
                      toggleTreatmentModal();
                    }}
                  >
                    {props.t("Save")}
                  </button>
                </div>
              </Col>
            </Row>
          </>
        </ModalBody>
      </Modal>
    );
  };

  const showAddResearchTreatmentModal = () => {
    return (
      <Modal
        size="xl"
        isOpen={addResearchTreatmentModal}
        style={{
          transform: debugSidebarOpen ? "translateX(-200px)" : "none",
          transition: "transform 0.3s ease-in-out",
        }}
        onOpened={() => {
          if (!clinics || clinics.length === 0) return;
          setSelectedClinic(clinics[0]);

          if (!clinician_users || clinician_users.length === 0) return;
          setSelectedClinician(clinician_users[0]);
        }}
        onClosed={() => {
          setSelectedClinic(undefined);
          dispatch(clearClinicStimulations());
          dispatch(clearClinicians());
          setDebugSidebarOpen(false);
        }}
        toggle={toggleResearchTreatmentModal}
      >
        <ModalHeader toggle={toggleResearchTreatmentModal} tag="h4">
          {props.t("Add Research Treatment")}
          <small className="text-muted fs-6">
            <p>
              Note: Activing sham means patients will not get actual treatment.
              Slider is not available for Research Treatment as this risk
              breaking blinding.
            </p>
          </small>
        </ModalHeader>
        <ModalBody>
          <>
            <Row>
              <Col>
                <div className="mb-3">
                  <Label className="form-label">{props.t("Clinic")}</Label>
                  <Input
                    type="select"
                    name="clinic"
                    className="form-select"
                    multiple={false}
                    onChange={(e) =>
                      setSelectedClinic(
                        clinics.find((c) => c.guid === e.target.value),
                      )
                    }
                    value={selectedClinic ? selectedClinic.guid : ""}
                  >
                    {getClinicsLabels()}
                  </Input>
                </div>
              </Col>
              {loadingStimulations ? (
                <Col xl={1}>
                  <Spinner size={"sm"} color="primary" />
                </Col>
              ) : null}
            </Row>
            {showClinicians()}
            {showStimulations()}
            <Row>
              <Col className="hidden">
                <div className="form-check form-switch mb-3 ">
                  <label
                    className="form-check-label"
                    htmlFor="setCurrentUpdateState"
                  >
                    Allow patient to adjust stimulation intensity
                  </label>
                  <input
                    className="form-check-input"
                    type="checkbox"
                    id="setCurrentUpdateState"
                    onClick={(e) =>
                      setAllowUpdateCurrentState(e.target.checked)
                    }
                    disabled={isShamState}
                  />
                </div>
              </Col>
              <Col className="hidden">
                <div className="form-check form-switch mb-3 ">
                  <label className="form-check-label" htmlFor="setShamState">
                    Sham for all stimulation
                  </label>
                  <input
                    className="form-check-input"
                    type="checkbox"
                    id="setShamState"
                    onClick={(e) => setSham(e.target.checked)}
                  />
                </div>
              </Col>
              <Col className="hidden">
                <div className="form-check form-switch mb-3">
                  <label
                    className="form-check-label"
                    htmlFor="oneSessionByDayState"
                  >
                    One session per day
                  </label>
                  <input
                    className="form-check-input"
                    type="checkbox"
                    id="oneSessionByDayState"
                    onClick={(e) => setOneSessionByDayState(e.target.checked)}
                  />
                </div>
              </Col>
            </Row>
            <Row>
              <Col className="hidden">
                <div className="form-check form-switch mb-3">
                  <label
                    className="form-check-label"
                    htmlFor="researchTreatment"
                  >
                    Research Treatment
                  </label>
                  <input
                    className="form-check-input"
                    type="checkbox"
                    id="researchTreatment"
                    //disabled={shamList.length === 0}
                    onClick={(e) => setResearchTreatmentState(e.target.checked)}
                  />
                </div>
              </Col>
            </Row>
            <Row>
              <Col className="d-flex justify-content-between align-items-center">
                <Button
                  color="link"
                  className="text-muted p-0 text-decoration-none"
                  size="sm"
                  onClick={() => {
                    setDebugMode("research");
                    setDebugSidebarOpen(true);
                  }}
                >
                  <i className="mdi mdi-code-tags me-1"></i>Debug
                </Button>
                <div className="text-end">
                  <button
                    disabled={!canAddTreatment}
                    className="btn btn-success save-user"
                    onClick={() => {
                      const data = getPayload({ research_treatment: 1 });
                      if (
                        !data.stimulations ||
                        data.stimulations.length === 0
                      ) {
                        showToast(
                          "Please select at least one stimulation",
                          "error",
                        );
                        return;
                      }

                      dispatch(addPatientTreatment(data));
                      setResearchTreatmentState(false);
                      setAllowUpdateCurrentState(false);
                      setOneSessionByDayState(false);
                      toggleResearchTreatmentModal();
                    }}
                  >
                    {props.t("Save")}
                  </button>
                </div>
              </Col>
            </Row>
          </>
        </ModalBody>
      </Modal>
    );
  };

  const showInverventionsModal = () => {
    return (
      <Modal
        size="xl"
        isOpen={interventionsModal}
        toggle={toggleInterventionsModal}
      >
        <ModalHeader toggle={toggleInterventionsModal} tag="h4">
          {props.t("Interventions")}
        </ModalHeader>
        <ModalBody>
          <Row>
            <Col>
              <div className="mb-3">
                <Label className="form-label">{props.t("Clinic")}</Label>
                <Input
                  type="select"
                  name="clinic"
                  className="form-select"
                  multiple={false}
                  onChange={(e) =>
                    setSelectedClinic(JSON.parse(e.target.value))
                  }
                  value={selectedClinic ? selectedClinic.guid : ""}
                >
                  {getClinicsLabels()}
                </Input>
              </div>
            </Col>
            {loadingStimulations ? (
              <Col xl={1}>
                <Spinner size={"sm"} color="primary" />
              </Col>
            ) : null}
          </Row>
          <>{showClinicians()}</>
          <>{showStimulationsEdition()}</>
          <div className="row">
            <div className="col-sm-2"></div>
            <div className="col-sm-10">
              <div className="d-flex flex-row-reverse bd-highlight">
                <div className="dropdown">
                  <button
                    type="button"
                    className="btn btn-secondary dropdown-toggle btn-success"
                    onClick={() => {
                      addNewIntervention();
                    }}
                  >
                    Save
                  </button>
                </div>
                <i
                  className={`bx bx-loader-circle bx-spin font-size-24 mb-1 mr-10 mt-5 ${isSaveLoading}`}
                ></i>
                <div className="text-info p-2">{message}</div>
              </div>
            </div>
          </div>
          <hr className="" />
          <>{showInterventions()}</>
        </ModalBody>
      </Modal>
    );
  };

  const showPlaceholder = () => {
    return (
      <>
        <div>
          <p className="placeholder-glow mb-0">
            <span className="placeholder col-12"></span>
          </p>
          <p className="placeholder-glow mb-0">
            <span className="placeholder col-12"></span>
          </p>
          <p className="placeholder-glow mb-0">
            <span className="placeholder col-12"></span>
          </p>
          <p className="placeholder-glow mb-0">
            <span className="placeholder col-12"></span>
          </p>
        </div>
      </>
    );
  };

  const [edit, setEdit] = useState(true);
  const [editIcon, setEditIcon] = useState("mdi mdi-pencil font-size-18");

  const onActiveInlineEdtion = () => {
    if (edit === true) {
      setEdit(false);
      setEditIcon("mdi mdi-check-circle font-size-18");
    } else {
      setEdit(true);
      setEditIcon("mdi mdi-pencil font-size-18");
    }
  };

  const [password, setPassword] = useState("");
  const [type, setType] = useState("password");
  const [icon, setIcon] = useState("mdi mdi-eye-off");
  const [iconEdit, setIconEdit] = useState("mdi mdi-pencil");
  const [editIsDisabled, setEditIsDisabled] = useState(true);
  const [newPassword, setNewPassword] = useState("");
  const [msgPassword, setMsgPassword] = useState("hidden");

  const handleToggle = () => {
    if (type === "password") {
      setIcon("mdi mdi-eye");
      setType("text");
      setEditIsDisabled(false);
    } else {
      setIcon("mdi mdi-eye-off");
      setType("password");
      setEditIsDisabled(true);
    }
  };

  const validation = useFormik({
    enableReinitialize: true,

    initialValues: {
      name: (patientItem && patientItem.name) || undefined,
      email: (patientItem && patientItem.email) || undefined,
      clinic: (patientItem && patientItem.clinic) || undefined,
      password: newPassword,
    },
    validationSchema: Yup.object({
      name: Yup.string().required(props.t("Please Enter Your Name")),
      email: Yup.string()
        .matches(
          /^[\w-\.]+@([\w-]+\.)+[\w-]{2,8}$/,
          props.t("Please Enter Valid Email"),
        )
        .required(props.t("Please Enter Your Email")),
    }),

    onSubmit: (values) => {
      const { name, email, clinic, password } = values;
      let data = { name, email, clinic };

      if (editMode) {
        data = {
          guid: patientItem.guid,
          name: data.name,
          email: data.email,
        };

        const passwordData = {
          email: data.email,
          password: password,
        };

        if (password) {
          if (password.length < 6 || password.length > 30) {
            setMsgPassword("");
            setTimeout(() => {
              setMsgPassword("hidden");
            }, 3000);
            return;
          }
          const changePass = postUpdatePassword(passwordData);
          patient.access.credential = password;
        }

        dispatch(updatePatient(data));
        validation.resetForm();

        return;
      }
    },
  });

  const postUpdatePassword = async (dataPayload) => {
    const baseurl = import.meta.env.VITE_APP_GATEWAY_URL;
    setIsUpdatePasswordLoading("");
    try {
      const [data] = await Promise.all([
        await post(`${baseurl}/api/accounts/change-password`, dataPayload, true),
      ]);

      if (data) {
        setEditMode(false);
        toggleModal();
        setIsUpdatePasswordLoading("hidden");
        return data;
      }
    } catch (e) {
      setIsUpdatePasswordLoading("hidden");
    }
  };

  const toggleModal = () => setModal(!modal);

  const onClickEdit = (_patient) => {
    setPatient(_patient);
    setEditMode(true);

    toggleModal();
  };

  const showAddEditModal = () => {
    return (
      <Modal isOpen={modal} toggle={toggleModal}>
        <ModalHeader toggle={toggleModal} tag="h4">
          {editMode ? props.t("Edit Patient") : props.t("Add Patient")}
        </ModalHeader>
        <ModalBody>
          <Form
            onSubmit={(e) => {
              e.preventDefault();
              validation.handleSubmit();
              return false;
            }}
          >
            <Row>
              <Col xs={12}>
                <div className="mb-3">
                  <Label className="form-label">{props.t("Name")}</Label>
                  <Input
                    name="name"
                    type="text"
                    placeholder={props.t("Insert Name")}
                    onChange={validation.handleChange}
                    onBlur={validation.handleBlur}
                    value={validation.values.name || ""}
                    invalid={
                      validation.touched.name && validation.errors.name
                        ? true
                        : false
                    }
                  />
                  {validation.touched.name && validation.errors.name ? (
                    <FormFeedback type="invalid">
                      {validation.errors.name}
                    </FormFeedback>
                  ) : null}
                </div>
                <div className="mb-3">
                  <Label className="form-label">{props.t("Email")}</Label>
                  <Input
                    name="email"
                    label="Email"
                    type="email"
                    placeholder={props.t("Insert Email")}
                    onChange={validation.handleChange}
                    onBlur={validation.handleBlur}
                    value={validation.values.email || ""}
                    invalid={
                      validation.touched.email && validation.errors.email
                        ? true
                        : false
                    }
                  />
                  {validation.touched.email && validation.errors.email ? (
                    <FormFeedback type="invalid">
                      {validation.errors.email}
                    </FormFeedback>
                  ) : null}
                </div>
                <div className="mb-3">
                  <Label className="form-label">{props.t("Password")}</Label>
                  <Input
                    name="password"
                    label="Password"
                    type="text"
                    placeholder={props.t("Insert Password")}
                    onChange={validation.handleChange}
                    onBlur={validation.handleBlur}
                    value={validation.values.password || ""}
                  />

                  <p className={` font-size-8 text-danger ${msgPassword} `}>
                    Password must be at least 6 characters and no more than 30
                    characters long.
                  </p>
                </div>
                {!editMode ? (
                  <div className="mb-3">
                    <Label className="form-label">{props.t("Clinics")}</Label>
                    <Input
                      type="select"
                      name="clinic"
                      className="form-select"
                      multiple={false}
                      onChange={validation.handleChange}
                      onBlur={validation.handleBlur}
                      value={validation.values.clinic}
                      invalid={
                        validation.touched.clinic && validation.errors.clinic
                          ? true
                          : false
                      }
                    >
                      {getClinicsLabels()}
                    </Input>
                    {validation.touched.clinic && validation.errors.clinic ? (
                      <FormFeedback type="invalid">
                        {validation.errors.clinic}
                      </FormFeedback>
                    ) : null}
                  </div>
                ) : null}
              </Col>
            </Row>
            <Row>
              <Col>
                <div className=" text-end">
                  <i
                    className={`bx bx-loader-circle bx-spin font-size-24 me-2 ${isUpdatePasswordLoading}`}
                  ></i>
                  <button type="submit" className="btn btn-success save-user">
                    {props.t("Save")}
                  </button>
                </div>
              </Col>
            </Row>
          </Form>
        </ModalBody>
      </Modal>
    );
  };

  return (
    <React.Fragment>
      <QuestionModal
        visible={disablePatientModal}
        positive={false}
        questionText={`${props.t(
          "Are you sure you want to disable the patient",
        )}: ${patient?.email}`}
        onPositiveText={props.t("Disable Now")}
        onPositiveClick={handleDisablePatient}
        onNegativeText={props.t("Close")}
        onNegativeClick={() => setDisablePatientModal(false)}
      />
      <QuestionModal
        visible={enablePatientModal}
        positive={true}
        questionText={`${props.t(
          "Are you sure you want to enable the patient",
        )}: ${patient?.email}`}
        onPositiveText={props.t("Enable Now")}
        onPositiveClick={handleEnablePatient}
        onNegativeText={props.t("Close")}
        onNegativeClick={() => setEnablePatientModal(false)}
      />
      <QuestionModal
        visible={disableTreatmentModal}
        positive={false}
        questionText={`${props.t(
          "Are you sure you want to disable the treatment",
        )}: ${patient?.email}`}
        onPositiveText={props.t("Disable Now")}
        onPositiveClick={handleDisableTreatment}
        onNegativeText={props.t("Close")}
        onNegativeClick={() => setDisableTreatmentModal(false)}
      />
      <QuestionModal
        visible={enableTreatmentModal}
        positive={true}
        questionText={`${props.t(
          "Are you sure you want to enable the treatment",
        )}: ${patient?.email}`}
        onPositiveText={props.t("Enable Now")}
        onPositiveClick={handleEnableTreatment}
        onNegativeText={props.t("Close")}
        onNegativeClick={() => setEnableTreatmentModal(false)}
      />
      <div className="page-content">
        <Container fluid>
          {error
            ? showToast(
                props.t("Error"),
                getErrorMessage(props.t, error),
                () => {
                  dispatch(clearPatientsError());
                },
              )
            : null}
          {errorClinics
            ? showToast(
                props.t("Error"),
                getErrorMessage(props.t, errorClinics),
                () => {
                  dispatch(cleanClinicsError());
                },
              )
            : null}
          <Row>
            <Col xl="12">
              <Card className="overflow-hidden">
                <div className="bg-primary bg-soft">
                  <Row>
                    <Col xs="7">
                      <div className="text-primary p-3">
                        <h5 className="text-primary">
                          {props.t("Patient Details")}
                        </h5>
                      </div>
                    </Col>
                  </Row>
                </div>
              </Card>

              <Card>
                <CardBody>
                  <CardTitle className="">
                    <div className="row">
                      <div className="col-sm-2"></div>
                      <div className="col-sm-10">
                        <div className="d-flex flex-row-reverse bd-highlight">
                          <div className="dropdown">
                            <button
                              type="button"
                              className="btn btn-secondary dropdown-toggle btn-sm btn-success"
                              onClick={() => {
                                onClickEdit(patient);
                              }}
                            >
                              Edit
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardTitle>
                  <div className="table-responsive">
                    {loading ? (
                      <>
                        <Placeholder size="lg" xs={12} />
                        <Placeholder size="lg" xs={12} />
                      </>
                    ) : null}

                    <Table className="table-hover">
                      <tbody>
                        {loading ? null : (
                          <tr>
                            <th scope="row">{props.t("Name")}</th>
                            <td>{patient?.name}</td>
                          </tr>
                        )}
                        {loading ? null : (
                          <tr className="hidden">
                            <th scope="row">{props.t("Personal Email")}</th>
                            <td>{patient?.email}</td>
                          </tr>
                        )}
                        {loading ? null : (
                          <tr>
                            <th scope="row">{props.t("App Login")}</th>
                            <td className="hidden">
                              {patient?.access
                                ? patient.access.email
                                : `patient${patient?.id}@plato.dashboard`}
                            </td>
                            <td>
                              {patient?.access
                                ? patient.access.email
                                : patient?.email}
                            </td>
                          </tr>
                        )}
                        {loading ? null : (
                          <tr>
                            <th scope="row">{props.t("App Password")}</th>
                            <td>
                              <div className="input-group">
                                <Input
                                  name="password"
                                  value={
                                    patient?.access
                                      ? patient.access.credential
                                      : ""
                                  }
                                  type={type}
                                />
                                <span
                                  className="input-group-text"
                                  onClick={handleToggle}
                                >
                                  {/*<Icon class="absolute mr-10" icon={icon} size={25}/>*/}
                                  <i className={icon} />
                                </span>
                              </div>
                            </td>
                          </tr>
                        )}
                      </tbody>
                    </Table>
                  </div>
                </CardBody>
                <CardBody>{showActions()}</CardBody>
              </Card>
              {showAddEditModal()}
            </Col>

            <Col xl="12">
              <Card>
                <CardBody>
                  <CardTitle className="mb-4">
                    {patient_treatments.length > 0
                      ? props.t("Patient Treatments")
                      : patient?.migrated || patient?.legacy || patient?.native
                        ? props.t("Default Treatment")
                        : props.t("Original Treatment")}
                  </CardTitle>
                  {patient_treatments.length > 0 ? (
                    <LocalTableContainer
                      columns={columns}
                      data={patient_treatments}
                      onAddItemClick={onAddTreatment}
                      onAddItemText={props.t("Add treatment")}
                      onAddCustomItemClick={onAddResearchTreatment}
                      onAddCustomItemText={props.t("Add Research Treatment")}
                      isGlobalFilter={false}
                      customPageSize={5}
                      customPageSizeOptions={true}
                    />
                  ) : (
                    <>
                      <div className="table-responsive react-table">
                        <div className="d-flex justify-content-end mb-3">
                          <button
                            type="button"
                            className="btn btn-secondary btn btn-danger me-2"
                            onClick={() => onAddResearchTreatment()}
                          >
                            <i className="mdi mdi-plus me-1" />
                            Add Research Treatment
                          </button>

                          <button
                            type="button"
                            className="btn btn-secondary btn btn-success"
                            onClick={() => onAddTreatment()}
                          >
                            <i className="mdi mdi-plus me-1" />
                            Add Treatment
                          </button>
                        </div>
                        {patient?.migrated ||
                        patient?.legacy ||
                        patient?.native ? (
                          <ShowLearnCreate />
                        ) : (
                          <ShowLeftRight />
                        )}
                      </div>
                    </>
                  )}
                </CardBody>
              </Card>
            </Col>
          </Row>
          {showAddTreatmentModal()}
          {showAddResearchTreatmentModal()}
          {showInverventionsModal()}
        </Container>
      </div>
      <DebugSidebar
        isOpen={debugSidebarOpen}
        toggle={toggleDebugSidebar}
        data={
          debugMode === "research"
            ? getPayload({ research_treatment: 1 })
            : getPayload()
        }
      />
    </React.Fragment>
  );
};

PlatoPatientDetail.propTypes = {
  router: PropTypes.any,
  t: PropTypes.any,
  guid: PropTypes.string,
};

export default withRouter(withTranslation()(PlatoPatientDetail));
