import React, { useEffect, useState } from "react"
import { Swiper, SwiperSlide } from 'swiper/react';
import { Pagination, Navigation } from "swiper";
import "../../../node_modules/swiper/swiper.scss";
import {
  Alert,
  Button,
  Card,
  CardBody,
  CardTitle,
  Col,
  Container,
  Form,
  FormGroup,
  Input,
  Label,
  Modal,
  Nav,
  NavItem,
  NavLink,
  Row,
  TabContent,
  Table,
  TabPane,
} from "reactstrap"

import classnames from "classnames"
import { Link } from "react-router-dom"
import PropTypes from "prop-types";

//Import Breadcrumb
import Breadcrumbs from "../../components/Common/Breadcrumb"
import { useFormik } from "formik"
import * as Yup from "yup";
import { useDispatch, useSelector } from "react-redux"
import { withTranslation } from "react-i18next"
import axios from "axios";
import { addPatientTreatment, getCliniciansByClinic, getClinics, getClinicStimulations } from "../../store/actions";
import { del, get, post } from "../../api/manager";

const TreatmentSteps = (props) => {

  //meta title
  document.title = "Treatment Steps | Plato Dashboard";
  const treatmentId = window.location.pathname.split("/").pop()
  const baseurl = (import.meta).env.VITE_APP_API_URL;

  const [activeTab, setactiveTab] = useState(1)
  const [activeTabVartical, setogleTabVertical] = useState(1)

  const [passedSteps, setPassedSteps] = useState([1])
  const [passedStepsVertical, setPassedStepsVertical] = useState([1])

  //Treatment Settings
  const [treatmentName, setTreatmentName] = useState("")
  const [treatmentDetails, setTreatmentDetails] = useState("")
  const [treatments, setTreatments] = useState([])
  const [loadingTreatments, setLoadingTreatments] = useState(false)
  const [dispatchActionLoading, setDispatchActionLoading] = useState(false)

  const [interventions, setInterventions] = useState([])
  const [treatmentPatients, setTreatmentPatients] = useState([])

  const [clinic, setClinic] = useState(undefined);
  const { clinics, loading } = useSelector((state) => ({
    clinics: state.clinics.clinics,
    loading: state.clinics.loading,
  }));
  const NO_CLINIC = props.t("THERE IS NO CLINIC!");
  const NO_CLINICIAN = props.t("THERE IS NO CLINICIAN!");

  const isValidClinic = (value) => value !== NO_CLINIC;
  const [selectedStimulations, setSelectedStimulations] = useState([]);
  const { clinic_stimulations, loadingStimulations, errorStimulations } =
    useSelector((state) => ({
      clinic_stimulations: state.stimulations.clinic_stimulations,
      loadingStimulations: state.stimulations.loading,
      errorStimulations: state.stimulations.error,
    })
    );

  const [selectedClinic, setSelectedClinic] = useState(undefined);
  const [selectedClinician, setSelectedClinician] = useState(undefined);

  const { clinician_users, loadingClinicians, errorClinicians } = useSelector(
    (state) => ({
      clinician_users: state.users.clinician_users,
      loadingClinicians: state.users.loading,
      errorClinicians: state.users.error,
    })
  );

  const [patients, setPatients] = useState([]);
  const [selectedPatient, setSelectedPatient] = useState([])
  const [activePatient, setActivePatient] = useState(-1)
  const [searchTerm, setSearchTerm] = useState('');
  const [searchResult, setSearchResult] = useState([]);
  const [searchDefaults, setSeachDefaults] = useState([]);
  const [canAddTreatment, setCanAddTreatment] = useState(false);
  const [isShamState, setShamState] = useState(false)
  const [shamList, setShamList] = useState([])
  const [slideList, setSlideList] = useState([])
  const [allowUpdateCurrentState, setAllowUpdateCurrentState] = useState(false)
  const [oneSessionByDayState, setOneSessionByDayState] = useState(false)
  const [isReadyToSubmit, setIsReadyToSubmit] = useState(false)

  const [tabMessage, setTabMessage] = useState("");
  const [selectedPatientName, setSelectedPatientName] = useState("");
  const [patientAction, setPatientAction] = useState("");
  const [patientToAction, setPatientToAction] = useState({});
  const [modal_user, setmodal_user] = useState(false);

  function tog_user_popup() {
    setmodal_user(!modal_user);
  }

  async function getTreatmentsDetails() {
    setLoadingTreatments(true)
    const [data] = await Promise.all([
      await get(`${baseurl}/treatment-group?guid=${treatmentId}`, true, {
        headers: {
          "Content-Type": "application/json",
        },
      })
    ])
    setLoadingTreatments(false)
    setSelectedClinic(data.clinic)
    setTreatments(data);
    setTreatmentName(data.name)
    setTreatmentDetails(data.description)

    setSelectedClinic(data.clinic);
    getPatientsSummary(data.clinic.guid);
    setInterventions(data.interventions)
    setTreatmentPatients(data.patient_treatment)
    setSelectedStimulations(data.interventions)

  }

  const preSelectStimulations = () => {
    if (interventions.length > 0 && clinic_stimulations.length > 0) {
      const data = []
      interventions.map((intervention) => {
        data.push(intervention.tes_stimulation)
        clinic_stimulations.map((stimulation) => {
          if (intervention.tes_stimulation.guid === stimulation.guid) {
            const element = document.getElementById(`customSwitch-${stimulation.guid}`)
            if (element) {
              element.checked = true
            }
          }
          if (intervention.tes_stimulation.guid === stimulation.guid && intervention.sham === true) {
            const element = document.getElementById(`shamSwitch-${stimulation.guid}`)
            if (element) {
              element.checked = true
            }
          }
        })
      })
      setSelectedStimulations(data)
    }
  }

  const preSelectPatients = () => {
    if (treatmentPatients.length > 0) {
      treatmentPatients.map((patient) => {
        patients.map((p) => {
          if (p.id === patient.patient_id) {
            const element = document.getElementById(`select-patient-${p.id}`)
            if (element) {
              element.checked = true
            }
          }
          if (patient.research_treatment === 1) {
            const element = document.getElementById(`researchTreatment`)
            if (element) {
              element.checked = true
            }
          }
          if (patient.sessions_by_day === 1) {
            const element = document.getElementById(`oneSessionByDayState`)
            if (element) {
              element.checked = true
            }
          }
        })
      })
      const patientIds = treatmentPatients.map((patient) => { return patient.patient_id });
      console.log('treatmentPatients', patientIds)
      setSelectedPatient(patientIds);
    }
  }

  const getClinicsLabels = () => {
    return (
      <>
        {clinics.length > 0 ? (
          //console.log('clinics', clinics)
          clinics.map((clinic) => (
            <option
              key={clinic.guid}
              value={isValidClinic(clinic) ? JSON.stringify(clinic) : undefined}
              selected={selectedClinic?.guid === clinic.guid}
            >{`${clinic.name} | ${clinic.country}`}
            </option>
          ))
        ) : (
          <option value={undefined}>{NO_CLINIC}</option>
        )}
      </>
    );
  };

  const showClinicians = () => {
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
              defaultValue={selectedClinician}
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

      </Row>
    );
  };

  const getPatientsSummary = async (guid) => {

    const baseurl = import.meta.env.VITE_APP_GATEWAY_URL;
    const [data] = await Promise.all([
      await axios.get(`${baseurl}/patients/from-clinic/${guid}`)
    ])
    const sortedData = data.data //data.data.sort((a, b) => a.name.localeCompare(b.name));
    setPatients(sortedData);
    setSeachDefaults(sortedData);
  }

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

  const setForSham = (guid, isChecked, current) => {
    const slideSwitch = document.getElementById(`slideSwitch-${guid}`)
    if (isChecked) {
      if (slideSwitch) {
        slideSwitch.disabled = true
        slideSwitch.checked = false
        setForSlide(guid, false)
      }
    } else {
      if (slideSwitch && current === 120) {
        slideSwitch.disabled = false
      }
    }
    const localShamList = [...shamList]
    const previous = shamList.find((value) => value === guid);
    if (isChecked) {
      if (!previous) {
        localShamList.push(guid)
        setShamList(localShamList)
      }
    } else {
      if (previous) {
        const index = localShamList.indexOf(guid)
        localShamList.splice(index, 1)
        setShamList(localShamList)
      }
    }
  }

  const setForSlide = (guid, isChecked) => {
    const localSlideList = [...slideList]
    const previous = slideList.find((value) => value === guid);
    if (isChecked) {
      if (!previous) {
        localSlideList.push(guid)
        setSlideList(localSlideList)
      }
    } else {
      if (previous) {
        const index = localSlideList.indexOf(guid)
        localSlideList.splice(index, 1)
        setSlideList(localSlideList)
      }
    }
  }

  const isSelectedStimulation = (guid, stimulation) => {
    if (selectedStimulations.length > 0) {
      const value = selectedStimulations.find((value) => value.guid === guid);
      if (!value) return false;
      return value.selected;
    }
    return false
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
                maxHeight: "450px",
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
                    <th className="">
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
                    <th>
                      <div
                        style={{
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                        }}
                      >
                        {props.t("Sham")}
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

  const createStimulationRow = (stimulation) => {
    return (
      <tr key={stimulation.guid}>
        <td>{stimulation.title}</td>
        <td>{stimulation.tes_stimulations_tdcs_parameters[0]?.tdcs_parameter.anode}</td>
        <td>{stimulation.tes_stimulations_tdcs_parameters[0]?.tdcs_parameter.cathode}</td>
        <td>{stimulation.tes_stimulations_tdcs_parameters[0]?.tdcs_parameter.current / 100} mA</td>
        <td>{stimulation.tes_stimulations_tdcs_parameters[0]?.tdcs_parameter.duration / 60} min</td>
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
          <div style={{ display: "flex", alignItems: "center", justifyContent: "center" }}>
            {stimulation.original.toString()}
          </div>
        </td>
        <td className="">
          <div style={{ display: "flex", alignItems: "center", justifyContent: "center" }}>
            <div className="form-check form-switch ">
              <input
                type="checkbox"
                className="form-check-input"
                id={`slideSwitch-${stimulation.guid}`}
                onChange={(e) => { setForSlide(stimulation.guid, e.target.checked) }}
                onBlur={(e) => { setForSlide(stimulation.guid, e.target.checked) }}
              />
            </div>
          </div>
        </td>
        <td>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "center" }}>
            <div className="form-check form-switch">
              <input
                disabled
                type="checkbox"
                className="form-check-input"
                id={`shamSwitch-${stimulation.guid}`}
                onChange={(e) => {
                  setForSham(stimulation.guid, e.target.checked, stimulation.tes_stimulations_tdcs_parameters[0]?.tdcs_parameter.current)
                }}
                onBlur={(e) => {
                  setForSham(stimulation.guid, e.target.checked, stimulation.tes_stimulations_tdcs_parameters[0]?.tdcs_parameter.current)
                }}
              />
            </div>
          </div>
        </td>
        <td>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "center" }}>
            <div className="form-check form-switch">
              <input
                disabled
                type="checkbox"
                className="form-check-input"
                id={`customSwitch-${stimulation.guid}`}
                checked={isSelectedStimulation(stimulation.guid, stimulation)}
                onChange={(e) => { }}
                onClick={(e) => switchStimulation(stimulation.guid)}
              />
            </div>
          </div>
        </td>
      </tr>
    );
  };

  const searchByName = (event) => {
    const currentInput = event.target.value;
    setSearchTerm(currentInput);

    if (currentInput.trim().length > 0) {
      const result = searchDefaults.filter(patient =>
        patient.name && patient.name.toLowerCase().includes(currentInput.toLowerCase())
      );
      setSearchResult(result);
    } else {
      setSearchResult(searchDefaults);
    }
  };

  const handleSelectAllPatients = (isChecked) => {
    const allPatientGuids = (searchTerm.trim().length > 0 ? searchResult : patients).map((patient) => {
      document.getElementById("select-patient-" + patient.id).checked = isChecked;
      return patient.guid;
    });
    setSelectedPatient(isChecked ? allPatientGuids : []);
  };

  const addSelectedPatient = (patient) => {
    setPatientToAction(patient)
    setSelectedPatientName(patient.name)
    setSelectedPatient((prevSelected) => {
      const isSelected = prevSelected.includes(patient.id);
      if (isSelected) {
        setPatientAction("Remove")
      } else {
        setPatientAction("Add")
      }
      setmodal_user(!modal_user);

      return prevSelected;
    });
  }

  const removeOrAddSelectedPatientPopup = (patient, isRemove) => {

    let updatedSelection = null;
    const element = document.getElementById(`select-patient-${patient.id}`)
    setSelectedPatient((prevSelected) => {
      console.log('prevSelected', isRemove)
      // 
      /**
       * if selected. add the patient id to the array
       * Handler cancel actions for remove and add patient
       */
      if (patientAction === "Remove" && isRemove) {
        updatedSelection = prevSelected.filter((selected) => selected !== patient.id)
        element.checked = false
        console.log('remove patient from treatment', patient)
        handleDispatchSaveTreatment(patient, "remove")
      } else if (patientAction === "Add" && isRemove) {
        updatedSelection = [...prevSelected, patient.id]
        element.checked = true
        console.log('add patient to treatment', patient)
        handleDispatchSaveTreatment(patient, "add")
      } else if (patientAction === "Remove" && !isRemove) {
        updatedSelection = [...prevSelected, patient.id]
        element.checked = true
        setmodal_user(!modal_user);
      } else if (patientAction === "Add" && !isRemove) {
        updatedSelection = prevSelected.filter((selected) => selected !== patient.id)
        element.checked = false
        setmodal_user(!modal_user);
      }
      const allPatientGuids = (searchTerm.trim().length > 0 ? searchResult : patients).map((p) => p.id);
      const isAllSelected = updatedSelection.length === allPatientGuids.length;
      //document.getElementById("select-all-patients").checked = isAllSelected;
      return updatedSelection;
    });
  }

  const handleDispatchSaveTreatment = async (patient, action) => {
    const filtered = selectedStimulations.filter(
      (stimulation) => stimulation.selected
    );
    //here check if shamList items are in filtered and create a property is_sham to the filtered array items

    let filteredWithSham = [];
    const isShamSlider = [...shamList, ...slideList]
    if (isShamSlider.length > 0) {
      filteredWithSham = filtered.map((value) => {

        if (shamList.includes(value.guid)) {
          return { ...value, is_sham: true }
        } else {
          return { ...value, is_sham: false }
        }
      })
    }

    const filteredWithShamSlide = filteredWithSham.map((value) => {
      if (slideList.includes(value.guid)) {
        return { ...value, allow_slide: true }
      }
      return { ...value, allow_slide: false }
    })
    const objectData = {
      patient: patient.id,
      clinic: selectedClinic.guid,
      clinician: selectedClinician.guid,
      stimulations: selectedStimulations.map((stimulation) => stimulation.guid),
      treatment: treatmentId,
      is_sham: filteredWithShamSlide.length > 0 ? filteredWithShamSlide : isShamState,
      allow_update_electric_current: isShamState ? false : allowUpdateCurrentState,
      sessions_by_day: oneSessionByDayState === true ? 1 : 0,
    };
    if (action === "remove") {
      setDispatchActionLoading(true)
      const patientId = Number.parseInt(patient.id)
      const treatmentId = Number.parseInt(treatments.id)
      const [data] = await Promise.all([
        await del(`${baseurl}/remove-patient-treatment-group?patient=${patientId}&treatment=${treatmentId}`, true, {})
      ])
      console.log("removing using data", objectData)
      setDispatchActionLoading(false)
      setmodal_user(!modal_user);
      console.log("data", objectData)
    } else if (action === "add") {
      setDispatchActionLoading(true)
      const [data] = await Promise.all([
        await post(`${baseurl}/add-patient-treatment-group`, objectData, {})
      ])
      setDispatchActionLoading(false)
      setmodal_user(!modal_user);
      console.log("data", objectData)
    }
    console.log("action", action)

  }

  const validation = useFormik({
    enableReinitialize: true,

    initialValues: {
      treatmentName: (treatmentName) || "",
      treatmentDetails: (treatmentDetails) || "",

    },
    validationSchema: Yup.object({

    }),
    onSubmit: async (values) => {
      const filtered = selectedStimulations.filter(
        (stimulation) => stimulation.selected
      );
      //here check if shamList items are in filtered and create a property is_sham to the filtered array items

      let filteredWithSham = [];
      const isShamSlider = [...shamList, ...slideList]
      if (isShamSlider.length > 0) {
        filteredWithSham = filtered.map((value) => {

          if (shamList.includes(value.guid)) {
            return { ...value, is_sham: true }
          } else {
            return { ...value, is_sham: false }
          }
        })
      }

      const filteredWithShamSlide = filteredWithSham.map((value) => {
        if (slideList.includes(value.guid)) {
          return { ...value, allow_slide: true }
        }
        return { ...value, allow_slide: false }
      })

      const guids = filtered.map((value) => value.guid);
      const data = {
        patient: selectedPatient.length == 1 ? selectedPatient[0] : selectedPatient,
        clinic: selectedClinic.guid,
        clinician: selectedClinician.guid,
        stimulations: guids,
        is_sham: filteredWithShamSlide.length > 0 ? filteredWithShamSlide : isShamState,

        allow_update_electric_current: isShamState ? false : allowUpdateCurrentState,
        sessions_by_day: oneSessionByDayState == true ? 1 : 0,
        treatment: {
          name: values.treatmentName,
          details: values.treatmentDetails,
        }
      };
      console.log("data", data)
      dispatch(addPatientTreatment(data));
    },
  });

  const handlerMessage = (message) => {
    setTabMessage(message);
    setTimeout(() => {
      setTabMessage("");
    }, 3000);
  }

  function toggleTab(tab, activeTab) {
    switch (activeTab) {
      case 1:
        if (validation.values.treatmentName === "") {
          handlerMessage("Please enter the treatment name");
          setIsReadyToSubmit(false);
          return;
        }
        break
      case 2:
        if (selectedClinic === undefined) {
          handlerMessage("Please select the clinic");
          setIsReadyToSubmit(false);
          return;
        }
        break
      case 3:
        if (selectedStimulations.length === 0) {
          handlerMessage("Please select the stimulation");
          setIsReadyToSubmit(false);
          return;
        }
        break
      case 4:
        if (selectedPatient.length === 0) {
          handlerMessage("Please select the patients");
          setIsReadyToSubmit(false);
          return;
        }
        if (validation.values.treatmentName && selectedClinic && selectedStimulations.length > 0 && selectedPatient.length > 0) {
          setIsReadyToSubmit(true);
        } else {
          setIsReadyToSubmit(false);
        }

        break

    }
    if (activeTab !== tab) {
      var modifiedSteps = [...passedSteps, tab]
      if (tab >= 1 && tab <= 5) {
        setactiveTab(tab)
        setPassedSteps(modifiedSteps)
      }
    }
  }

  const dispatch = useDispatch();

  useEffect(() => {
    getTreatmentsDetails();
  }, []);

  useEffect(() => {
    dispatch(getClinics());
  }, []);

  useEffect(() => {
    if (!clinics || clinics.length === 0) return;

  }, [clinics]);

  useEffect(() => {
    if (!selectedClinic) {
      setSelectedStimulations([]);
      return;
    }

    setSelectedClinic(selectedClinic)
    setSelectedStimulations([]);
    dispatch(getCliniciansByClinic(selectedClinic.guid));
    dispatch(getClinicStimulations(selectedClinic.guid));
    getPatientsSummary(selectedClinic.guid);
    setSelectedPatient([]);
    setShamList([])
    setSlideList([])
    setShamState(false)
    setAllowUpdateCurrentState(false)
    setOneSessionByDayState(false)
    setSearchTerm('')
  }, [selectedClinic]);

  useEffect(() => {
    if (interventions.length > 0 && clinic_stimulations.length > 0) {
      preSelectStimulations()
    }
  }, [clinic_stimulations])

  useEffect(() => {
    if (treatmentPatients.length > 0) {
      preSelectPatients()
    }
  }, [patients])

  useEffect(() => {
    if (!clinician_users || clinician_users.length === 0) return;
    setSelectedClinician(clinician_users[0]);
  }, [clinician_users]);

  useEffect(() => {
    if (validation.values.treatmentName && selectedClinic && selectedStimulations.length > 0 && selectedPatient.length > 0) {
      setIsReadyToSubmit(true);
    } else {
      setIsReadyToSubmit(false);
    }
  }, [validation.values.treatmentName, selectedClinic, selectedStimulations, selectedPatient]);

  return (
    <React.Fragment>
      <div className="page-content">
        <Container fluid={true}>
          <Breadcrumbs title="Patients" breadcrumbItem="Treatments" />
          <Row>
            <Col lg="12">
              <Card>
                <CardBody>
                  <h4 className="card-title mb-4"> {validation.values.treatmentName ? validation.values.treatmentName : 'Loading Treatment...'} </h4>
                  {loadingTreatments && <div className="spinner-border text-primary d-flex justify-content-center align-items-center" role="status">
                    <span className="visually-hidden">Loading...</span>
                  </div>}
                  {!loadingTreatments && <div className="wizard clearfix">
                    <div className="steps clearfix">
                      <ul>
                        <NavItem
                          className={`${classnames({ current: activeTab === 1 })} `}
                        >
                          <NavLink
                            className={classnames({ current: activeTab === 1 })}
                            onClick={() => {
                              setactiveTab(1)
                            }}

                          >
                            <span className="number">1.</span> Treatment Details
                          </NavLink>
                        </NavItem>
                        <NavItem
                          className={classnames({ current: activeTab === 2 })}
                        >
                          <NavLink
                            className={classnames({ active: activeTab === 2 })}
                            onClick={() => {
                              setactiveTab(2)
                            }}

                          >
                            <span className="number">2.</span> Clinic Selection
                          </NavLink>
                        </NavItem>
                        <NavItem
                          className={classnames({ current: activeTab === 3 })}
                        >
                          <NavLink
                            className={classnames({ active: activeTab === 3 })}
                            onClick={() => {
                              setactiveTab(3)
                            }}

                          >
                            <span className="number">3.</span> Stimulations
                          </NavLink>
                        </NavItem>
                        <NavItem
                          className={classnames({ current: activeTab === 4 })}
                        >
                          <NavLink
                            className={classnames({ active: activeTab === 4 })}
                            onClick={() => {
                              setactiveTab(4)
                            }}

                          >
                            <span className="number">4.</span> Patients
                          </NavLink>
                        </NavItem>

                      </ul>
                    </div>
                    <div className="content clearfix">
                      <TabContent activeTab={activeTab} className="body">
                        <TabPane tabId={1}>
                          <Form>
                            <Row>
                              <Col lg="12">
                                <div className="mb-3">
                                  <Label for="basicpill-firstname-input1">
                                    Treatment Name
                                  </Label>
                                  <Input
                                    value={validation.values.treatmentName}
                                    onChange={validation.handleChange}
                                    onBlur={validation.handleBlur}
                                    name="treatmentName"
                                    type="text"
                                    className="form-control"
                                    id="basicpill-firstname-input1"
                                    placeholder="Enter the treatment name"
                                  />
                                </div>
                              </Col>

                            </Row>
                            <Row>
                              <Col lg="12">
                                <div className="mb-3">
                                  <Label for="basicpill-address-input1">
                                    Details
                                  </Label>
                                  <textarea
                                    value={validation.values.treatmentDetails}
                                    onChange={validation.handleChange}
                                    onBlur={validation.handleBlur}
                                    name="treatmentDetails"
                                    type="text"
                                    id="basicpill-address-input1"
                                    className="form-control"
                                    rows="2"
                                    placeholder="Detail text"
                                  />
                                </div>
                              </Col>
                            </Row>
                          </Form>
                        </TabPane>
                        <TabPane tabId={2}>
                          <div>
                            <Form>
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

                                    >
                                      {getClinicsLabels()}
                                    </Input>
                                  </div>
                                </Col>
                                <Col>
                                  {showClinicians()}
                                </Col>
                              </Row>
                            </Form>
                          </div>
                        </TabPane>
                        <TabPane tabId={3}>
                          <div>
                            <Form>
                              <Row className="mt-10">

                                <Col xs={12}>
                                  {showStimulations()}
                                  <Row>
                                    <Col>
                                      <div className="form-check form-switch mb-3">
                                        <label className="form-check-label" htmlFor="oneSessionByDayState">One session per day</label>
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
                                    <Col>
                                      <div className="form-check form-switch mb-3">
                                        <label className="form-check-label" htmlFor="researchTreatment">Research Treatment</label>
                                        <input
                                          className="form-check-input"
                                          type="checkbox"
                                          id="researchTreatment"
                                          disabled={shamList.length === 0}
                                          onClick={(e) => setResearchTreatmentState(e.target.checked)}
                                        />
                                      </div>
                                    </Col>
                                  </Row>
                                </Col>

                              </Row>
                            </Form>
                          </div>
                        </TabPane>
                        <TabPane tabId={4}>
                          <div>
                            <Form>
                              <Col xs={12}>
                                <Row>
                                  <Col xs="">
                                    <Label className="form-label">Patients {selectedPatient.length > 0 ? `( Selected ${selectedPatient.length})` : ''}</Label>
                                  </Col>
                                  <Col xs={12}>
                                    <Card className="">
                                      <Input type="text" className="form-control mb-2" placeholder="Search by name" value={searchTerm} onChange={searchByName} />
                                      <div className="" style={{ maxHeight: "500px", overflowY: "auto" }}>
                                        <Table bordered>
                                          <thead className="table-light">
                                            <tr>
                                              <th>

                                              </th>
                                              <th>{props.t("Name")}</th>
                                              <th>{props.t("Email")}</th>
                                            </tr>
                                          </thead>
                                          <tbody>
                                            {loading ? (
                                              <tr>
                                                <td colSpan="3" className="text-center">
                                                  <div className="spinner-border" role="status">
                                                    <span className="visually-hidden">Loading...</span>
                                                  </div>
                                                </td>
                                              </tr>
                                            ) : (searchTerm.trim().length > 0 ? searchResult : patients).length > 0 ? (
                                              (searchTerm.trim().length > 0 ? searchResult : patients).map((patient, index) => (
                                                <tr key={patient.guid} className={classnames({ 'active-background': activePatient === index })}>
                                                  <td>
                                                    <input
                                                      type="checkbox"
                                                      id={`select-patient-${patient.id}`}
                                                      onChange={() => addSelectedPatient(patient)}
                                                    //checked={selectedPatient.includes(patient.guid)}
                                                    />
                                                  </td>
                                                  <td>{patient.name}</td>
                                                  <td>{patient.email}</td>
                                                </tr>
                                              ))
                                            ) : (
                                              <tr>
                                                <td colSpan="3" className="text-center">
                                                  <Alert color="info">No patients available</Alert>
                                                </td>
                                              </tr>
                                            )}
                                          </tbody>
                                        </Table>
                                      </div>

                                    </Card>

                                  </Col>
                                </Row>
                              </Col>
                            </Form>
                            <Modal
                              isOpen={modal_user}
                              toggle={() => {
                                tog_user_popup();
                              }}
                              backdrop={'static'}
                              id="staticBackdrop"
                            >
                              <div className="modal-header">
                                <h5 className="modal-title" id="staticBackdropLabel">{patientAction} patient</h5>
                                <button type="button" className="btn-close"
                                  onClick={() => {
                                    setmodal_user(false);
                                  }} aria-label="Close"></button>
                              </div>
                              <div className="modal-body">
                                <p>Are you sure you want to {patientAction} {selectedPatientName} to the treatment?</p>
                              </div>
                              <div className="modal-footer">
                                {dispatchActionLoading && <div className="spinner-border text-primary d-flex justify-content-center align-items-center" role="status">
                                  <span className="visually-hidden">Loading...</span>
                                </div>}
                                <button disabled={dispatchActionLoading} type="button" className="btn btn-warning" onClick={() => {
                                  removeOrAddSelectedPatientPopup(patientToAction, false)
                                }}>Cancel</button>
                                <button disabled={dispatchActionLoading} type="button" onClick={() => {

                                  removeOrAddSelectedPatientPopup(patientToAction, true)

                                }} className="btn btn-success">Yes</button>
                              </div>
                            </Modal>
                          </div>
                        </TabPane>
                      </TabContent>

                    </div>
                    <div className="actions clearfix">
                      <ul>
                        <li>
                          <Alert className="w-500" color="info" isOpen={!!tabMessage} toggle={() => setTabMessage("")}>
                            {tabMessage}
                          </Alert>
                        </li>
                        <li
                          className={
                            activeTab === 1 ? "previous disabled" : "previous"
                          }
                        >
                          <Link
                            to="#"
                            onClick={() => {
                              toggleTab(activeTab - 1, activeTab)
                            }}
                          >
                            Previous
                          </Link>
                        </li>
                        <li
                          className={activeTab === 5 ? "next disabled" : "next"}
                        >
                          <Link
                            to="#"
                            onClick={() => {
                              toggleTab(activeTab + 1, activeTab)
                            }}
                          >
                            Next
                          </Link>
                        </li>
                      </ul>

                    </div>

                  </div>}
                </CardBody>
              </Card>
            </Col>
          </Row>
        </Container>
      </div>
    </React.Fragment>
  )
}

TreatmentSteps.propTypes = {
  t: PropTypes.any,
};
export default withTranslation()(TreatmentSteps)
