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
  Nav,
  NavItem,
  NavLink,
  Row,
  Spinner,
  TabContent,
  Table,
  TabPane,
} from "reactstrap"

import classnames from "classnames"
import { Link, useNavigate } from "react-router-dom"
import PropTypes from "prop-types";

//Import Breadcrumb
import Breadcrumbs from "../../components/Common/Breadcrumb"
import { useFormik } from "formik"
import * as Yup from "yup";
import { useDispatch, useSelector } from "react-redux"
import { withTranslation } from "react-i18next"
import axios from "axios";
import { addPatientTreatment, getCliniciansByClinic, getClinics, getClinicStimulations } from "../../store/actions";

const TreatmentSteps = (props) => {

  //meta title
  document.title = "Treatment Steps | Plato Dashboard";
  const navigate = useNavigate();

  const [activeTab, setactiveTab] = useState(1)
  const [activeTabVartical, setogleTabVertical] = useState(1)

  const [passedSteps, setPassedSteps] = useState([1])
  const [passedStepsVertical, setPassedStepsVertical] = useState([1])

  //Treatment Settings
  const [treatmentName, setTreatmentName] = useState("")
  const [treatmentDetails, setTreatmentDetails] = useState("")
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
  const [researchTreatmentState, setResearchTreatmentState] = useState(false)
  const [isReadyToSubmit, setIsReadyToSubmit] = useState(false)
  const [isLoadingForCreateTreatment, setIsLoadingForCreateTreatment] = useState(false)
  const [tabMessage, setTabMessage] = useState("");

  const getClinicsLabels = () => {
    return (
      <>
        {clinics.length > 0 ? (
          clinics.map((clinic) => (
            <option
              key={clinic.guid}
              value={isValidClinic(clinic) ? JSON.stringify(clinic) : undefined}
            >{`${clinic.name} | ${clinic.country}`}</option>
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
    //const researchTreatment = document.getElementById(`researchTreatment`)
   
    if (isChecked) {
      if (slideSwitch) {
        slideSwitch.disabled = true
        slideSwitch.checked = false
        //researchTreatment.disabled = false
        //researchTreatment.checked = true
        //setResearchTreatmentState(true)
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
    const value = selectedStimulations.find((value) => value.guid === guid);
    if (!value) return false;
    return value.selected;
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
                disabled={stimulation.tes_stimulations_tdcs_parameters[0]?.tdcs_parameter.current !== 120}
              />
            </div>
          </div>
        </td>
        <td>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "center" }}>
            <div className="form-check form-switch">
              <input
                type="checkbox"
                className="form-check-input form-check-sham"
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
                type="checkbox"
                className="form-check-input"
                id="customSwitch2"
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
    setSelectedPatient((prevSelected) => {
      const isSelected = prevSelected.includes(patient.guid);
      const updatedSelection = isSelected
        ? prevSelected.filter((selected) => selected !== patient.guid)
        : [...prevSelected, patient.guid];

      const allPatientGuids = (searchTerm.trim().length > 0 ? searchResult : patients).map((p) => p.guid);
      const isAllSelected = updatedSelection.length === allPatientGuids.length;
      document.getElementById("select-all-patients").checked = isAllSelected;

      return updatedSelection;
    });
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
      setIsLoadingForCreateTreatment(true)
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
        patient: selectedPatient,
        clinic: selectedClinic.guid,
        clinician: selectedClinician.guid,
        stimulations: guids,
        is_sham: filteredWithShamSlide.length > 0 ? filteredWithShamSlide : isShamState,

        allow_update_electric_current: isShamState ? false : allowUpdateCurrentState,
        sessions_by_day: oneSessionByDayState === true ? 1 : 0,
        research_treatment: researchTreatmentState === true ? 1 : 0,
        treatment: {
          name: values.treatmentName,
          details: values.treatmentDetails,
        }
      };
      dispatch(addPatientTreatment(data));
      setResearchTreatmentState(false);
      setAllowUpdateCurrentState(false);
      setOneSessionByDayState(false);
      setTimeout(() => {
        setIsLoadingForCreateTreatment(false)
        navigate('/treatments-by-steps')
      }, 1500)
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
    dispatch(getClinics());
  }, []);

  useEffect(() => {
    if (!clinics || clinics.length === 0) return;
    setSelectedClinic(clinics[0]);
    getPatientsSummary(clinics[0].guid);
  }, [clinics]);

  useEffect(() => {
    if (!selectedClinic) {
      setSelectedStimulations([]);
      return;
    }
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

  useEffect(() => {
    const elements = document.querySelectorAll('.form-check-sham')
    /*if (researchTreatmentState) {
      elements.forEach(element => {
        element.disabled = true 
      })
    } else {
      elements.forEach(element => {
        element.disabled = false
      })
    }*/
  }, [researchTreatmentState])

  return (
    <React.Fragment>
      <div className="page-content">
        <Container fluid={true}>
          <Breadcrumbs title="Patients" breadcrumbItem="Treatments" />
          <Row>
            <Col lg="12">
              <Card>
                <CardBody>
                  <h4 className="card-title mb-4"> {validation.values.treatmentName ? validation.values.treatmentName : 'Create a new Treatment'} </h4>
                  <div className="wizard clearfix">
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
                            disabled={!(passedSteps || []).includes(1)}
                          >
                            <span className="number">1.</span> Details
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
                            disabled={!(passedSteps || []).includes(2)}
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
                            disabled={!(passedSteps || []).includes(3)}
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
                            disabled={!(passedSteps || []).includes(4)}
                          >
                            <span className="number">4.</span> Patients
                          </NavLink>
                        </NavItem>
                        <NavItem
                          className={classnames({ current: activeTab === 5 })}
                        >
                          <NavLink
                            className={classnames({ active: activeTab === 5 })}
                            onClick={() => {
                              setactiveTab(5)
                            }}
                            disabled={!(passedSteps || []).includes(5)}
                          >
                            <span className="number">5.</span> Confirmation
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
                                      defaultValue={selectedClinic}
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
                                          //disabled={shamList.length === 0}
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
                                                <input
                                                  type="checkbox"
                                                  id="select-all-patients"
                                                  onChange={(e) => handleSelectAllPatients(e.target.checked)}
                                                />
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
                          </div>
                        </TabPane>
                        <TabPane tabId={5}>
                          <Row>
                            <Col lg="12">
                              <Card>
                                <CardBody>
                                  <div className="hori-timeline">
                                    <Swiper
                                      slidesPerView={1}
                                      // spaceBetween={10}
                                      navigation
                                      pagination={{
                                        clickable: true,
                                      }}
                                      breakpoints={{
                                        678: {
                                          slidesPerView: 2,
                                        },
                                        992: {
                                          slidesPerView: 3,
                                        },
                                        1400: {
                                          slidesPerView: 4,
                                        }
                                      }}
                                      loop={true}
                                      modules={[Pagination, Navigation]}
                                      className="owl-carousel owl-theme  navs-carousel events"
                                      id="timeline-carousel"
                                    >
                                      <SwiperSlide
                                        className="item event-list active"
                                        style={{ display: "inline-table" }}
                                      >
                                        <div>
                                          <div className="event-date">
                                            <h5 className="mb-4">Treatment Detail</h5>
                                          </div>
                                          <div className="event-down-icon">
                                            <i className={`bx bx-${validation.values.treatmentName ? 'check' : 'error'}-circle h1 text-${validation.values.treatmentName ? 'success' : 'danger'} mt-15`} />
                                          </div>

                                          <div className="mt-3 px-3">
                                            <p className="text-muted">
                                              {validation.values.treatmentName}
                                            </p>
                                          </div>
                                        </div>
                                      </SwiperSlide>

                                      <SwiperSlide
                                        className="item event-list active"
                                        style={{ display: "inline-table" }}
                                      >
                                        <div>
                                          <div className="event-date">
                                            <h5 className="mb-4">Clinic Selection</h5>
                                          </div>
                                          <div className="event-down-icon">
                                            <i className={`bx bx-${selectedClinic?.name ? 'check' : 'error'}-circle h1 text-${selectedClinic?.name ? 'success' : 'danger'} mt-15`} />
                                          </div>

                                          <div className="mt-3 px-3">
                                            <p className="text-muted">
                                              {selectedClinic?.name}
                                            </p>
                                          </div>
                                        </div>
                                      </SwiperSlide>

                                      <SwiperSlide
                                        className="item event-list active"
                                        style={{ display: "inline-table" }}
                                      >
                                        <div>
                                          <div className="event-date">

                                            <h5 className="mb-4">Stimulations</h5>
                                          </div>
                                          <div className="event-down-icon">
                                            <i className={`bx bx-${selectedStimulations.length ? 'check' : 'error'}-circle h1 text-${selectedStimulations.length ? 'success' : 'danger'} mt-15`} />
                                          </div>

                                          <div className="mt-3 px-3">
                                            <p className="text-muted">
                                              {selectedStimulations.map((stimulation) => {
                                                const stim = clinic_stimulations.find((s) => s.guid === stimulation.guid);
                                                return (
                                                  <div key={stimulation.guid}>
                                                    <p className="text-muted">
                                                      {stim.title}
                                                    </p>
                                                  </div>
                                                )
                                              }
                                              )}
                                              {selectedPatient.length == 0 ? '0 stimulation selected' : ''}
                                            </p>
                                          </div>
                                        </div>
                                      </SwiperSlide>

                                      <SwiperSlide
                                        className="item event-list active"
                                        style={{ display: "inline-table" }}
                                      >
                                        <div>
                                          <div className="event-date">
                                            <h5 className="mb-4">Patients</h5>
                                          </div>
                                          <div className="event-down-icon">
                                            <i className={`bx bx-${selectedPatient.length ? 'check' : 'error'}-circle h1 text-${selectedPatient.length ? 'success' : 'danger'} mt-15`} />
                                          </div>

                                          <div className="mt-3 px-3">
                                            <p className="text-muted">
                                              {selectedPatient.length} patients selected
                                            </p>
                                          </div>
                                        </div>
                                      </SwiperSlide>

                                    </Swiper>
                                  </div>
                                </CardBody>
                              </Card>
                            </Col>
                          </Row>
                          <Row>
                            <Col lg="12">
                              <div className="text-center mt-4">
                                {isLoadingForCreateTreatment ? <Spinner /> :
                                <Button
                                  id="submit"
                                  color="primary"
                                  className="btn btn-primary w-md waves-effect waves-light"
                                  onClick={validation.handleSubmit}
                                  onBlur={validation.handleBlur}
                                  disabled={!isReadyToSubmit}
                                >
                                  {props.t("Create Treatment")}
                                  </Button>
                                }
                              </div>
                            </Col>
                          </Row>
                        </TabPane>
                      </TabContent>

                    </div>
                    <div className="actions clearfix">
                      {isLoadingForCreateTreatment ? <p className="text-center">creating treatment...</p> :
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
                      }
                    </div>

                  </div>
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
