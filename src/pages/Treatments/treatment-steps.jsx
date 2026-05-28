import React, { useEffect, useState } from "react"
import { Swiper, SwiperSlide } from 'swiper/react';
import { Pagination, Navigation } from "swiper";
import "../../../node_modules/swiper/swiper.scss";
import {
  Alert,
  Button,
  Card,
  CardBody,
  Col,
  Container,
  Form,
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

import Breadcrumbs from "../../components/Common/Breadcrumb"
import { useFormik } from "formik"
import * as Yup from "yup";
import { useDispatch, useSelector } from "react-redux"
import { withTranslation } from "react-i18next"
import { getCliniciansByClinic, getClinics, getClinicStimulations } from "../../store/actions";
import { post } from "../../api/manager";

const TreatmentSteps = (props) => {

  document.title = "New Treatment Protocol | Plato Dashboard";
  const navigate = useNavigate();
  const baseurl = import.meta.env.VITE_APP_API_URL;

  const [activeTab, setactiveTab] = useState(1)
  const [passedSteps, setPassedSteps] = useState([1])
  const [tabMessage, setTabMessage] = useState("");
  const [isLoadingForCreateTreatment, setIsLoadingForCreateTreatment] = useState(false)

  const [treatmentName, setTreatmentName] = useState("")
  const [treatmentDetails, setTreatmentDetails] = useState("")
  const { clinics } = useSelector((state) => ({
    clinics: state.clinics.clinics,
  }));
  const NO_CLINIC = props.t("THERE IS NO CLINIC!");
  const NO_CLINICIAN = props.t("THERE IS NO CLINICIAN!");

  const isValidClinic = (value) => value !== NO_CLINIC;
  const [selectedStimulations, setSelectedStimulations] = useState([]);
  const { clinic_stimulations } = useSelector((state) => ({
    clinic_stimulations: state.stimulations.clinic_stimulations,
  }));

  const [selectedClinic, setSelectedClinic] = useState(undefined);
  const [selectedClinician, setSelectedClinician] = useState(undefined);
  const { clinician_users } = useSelector((state) => ({
    clinician_users: state.users.clinician_users,
  }));

  const [isShamState, setShamState] = useState(false)
  const [shamList, setShamList] = useState([])
  const [slideList, setSlideList] = useState([])
  const [allowUpdateCurrentState, setAllowUpdateCurrentState] = useState(false)
  const [oneSessionByDayState, setOneSessionByDayState] = useState(false)
  const [researchTreatmentState, setResearchTreatmentState] = useState(false)

  const dispatch = useDispatch();

  // ─── Helpers ──────────────────────────────────────────────────────────────

  const getClinicsLabels = () => (
    <>
      {clinics.length > 0 ? (
        clinics.map((clinic) => (
          <option key={clinic.guid} value={JSON.stringify(clinic)}>
            {`${clinic.name} | ${clinic.country}`}
          </option>
        ))
      ) : (
        <option value={undefined}>{NO_CLINIC}</option>
      )}
    </>
  );

  const showClinicians = () => (
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
            {clinician_users.length > 0 ? (
              clinician_users.map((clinician) => (
                <option key={clinician.guid} value={JSON.stringify(clinician)}>
                  {`${clinician.name} | ${clinician.email}`}
                </option>
              ))
            ) : (
              <option value={undefined}>{NO_CLINICIAN}</option>
            )}
          </Input>
        </div>
      </Col>
    </Row>
  );

  const switchStimulation = (guid) => {
    const previous = selectedStimulations.find((v) => v.guid === guid);
    if (!previous) {
      setSelectedStimulations([...selectedStimulations, { guid, selected: true }]);
      return;
    }
    setSelectedStimulations(
      selectedStimulations.map((v) =>
        v.guid === guid ? { ...v, selected: !v.selected } : v
      )
    );
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
      if (slideSwitch && current === 120) slideSwitch.disabled = false
    }
    const localShamList = [...shamList]
    const previous = shamList.find((v) => v === guid);
    if (isChecked && !previous) localShamList.push(guid)
    else if (!isChecked && previous) localShamList.splice(localShamList.indexOf(guid), 1)
    setShamList(localShamList)
  }

  const setForSlide = (guid, isChecked) => {
    const localSlideList = [...slideList]
    const previous = slideList.find((v) => v === guid);
    if (isChecked && !previous) localSlideList.push(guid)
    else if (!isChecked && previous) localSlideList.splice(localSlideList.indexOf(guid), 1)
    setSlideList(localSlideList)
  }

  const isSelectedStimulation = (guid) => {
    const value = selectedStimulations.find((v) => v.guid === guid);
    return value ? value.selected : false;
  };

  const showStimulations = () => {
    if (!selectedClinic || !clinic_stimulations || clinic_stimulations.length === 0) {
      return <>{props.t("Please select the clinic first")}</>;
    }
    return (
      <Col lg={12}>
        <div className="mb-3">
          <Label className="form-label">{props.t("Stimulations")}</Label>
          <div style={{ maxHeight: "450px", overflowY: "auto" }}>
            <Table bordered>
              <thead className="table-light">
                <tr>
                  <th>{props.t("Title")}</th>
                  <th>Anode</th>
                  <th>Cathode</th>
                  <th>Current</th>
                  <th>Duration</th>
                  <th><div style={{ display: "flex", alignItems: "center", justifyContent: "center" }}>{props.t("Color")}</div></th>
                  <th><div style={{ display: "flex", alignItems: "center", justifyContent: "center" }}>{props.t("Original")}</div></th>
                  <th><div style={{ display: "flex", alignItems: "center", justifyContent: "center" }}>{props.t("Allow Slide")}</div></th>
                  <th><div style={{ display: "flex", alignItems: "center", justifyContent: "center" }}>{props.t("Sham")}</div></th>
                  <th><div style={{ display: "flex", alignItems: "center", justifyContent: "center" }}>{props.t("Active")}</div></th>
                </tr>
              </thead>
              <tbody>
                {clinic_stimulations.map((stimulation) =>
                  createStimulationRow({ ...stimulation, sham: false })
                )}
              </tbody>
            </Table>
          </div>
        </div>
      </Col>
    );
  };

  const createStimulationRow = (stimulation) => {
    const params = stimulation.tes_stimulations_tdcs_parameters[0]?.tdcs_parameter;
    return (
      <tr key={stimulation.guid}>
        <td>{stimulation.title}</td>
        <td>{params?.anode}</td>
        <td>{params?.cathode}</td>
        <td>{params?.current / 100} mA</td>
        <td>{params?.duration / 60} min</td>
        <td>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "center" }}>
            <div style={{ backgroundColor: stimulation.color, height: 20, width: 20 }} />
          </div>
        </td>
        <td><div style={{ display: "flex", alignItems: "center", justifyContent: "center" }}>{stimulation.original.toString()}</div></td>
        <td>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "center" }}>
            <div className="form-check form-switch">
              <input
                type="checkbox"
                className="form-check-input"
                id={`slideSwitch-${stimulation.guid}`}
                onChange={(e) => setForSlide(stimulation.guid, e.target.checked)}
                onBlur={(e) => setForSlide(stimulation.guid, e.target.checked)}
                disabled={params?.current !== 120}
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
                onChange={(e) => setForSham(stimulation.guid, e.target.checked, params?.current)}
                onBlur={(e) => setForSham(stimulation.guid, e.target.checked, params?.current)}
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
                id={`customSwitch-${stimulation.guid}`}
                checked={isSelectedStimulation(stimulation.guid)}
                onChange={() => {}}
                onClick={() => switchStimulation(stimulation.guid)}
              />
            </div>
          </div>
        </td>
      </tr>
    );
  };

  // ─── Submit ───────────────────────────────────────────────────────────────

  const validation = useFormik({
    enableReinitialize: true,
    initialValues: {
      treatmentName: treatmentName || "",
      treatmentDetails: treatmentDetails || "",
    },
    validationSchema: Yup.object({}),
    onSubmit: async (values) => {
      setIsLoadingForCreateTreatment(true);
      const filtered = selectedStimulations.filter((s) => s.selected);

      const filteredWithSham = filtered.map((s) => ({
        ...s,
        is_sham: shamList.includes(s.guid),
        allow_slide: slideList.includes(s.guid),
      }));

      const data = {
        clinic: selectedClinic?.guid,
        clinician: selectedClinician?.guid,
        name: values.treatmentName,
        description: values.treatmentDetails,
        stimulations: filteredWithSham,
        allow_update_electric_current: isShamState ? false : allowUpdateCurrentState,
        sessions_by_day: oneSessionByDayState ? 1 : 0,
        research_treatment: researchTreatmentState ? 1 : 0,
      };
      await post(`${baseurl}/treatments-group`, data, true, {});
      setTimeout(() => {
        setIsLoadingForCreateTreatment(false);
        navigate('/treatments-by-steps');
      }, 1000);
    },
  });

  // ─── Tab navigation ───────────────────────────────────────────────────────

  const handlerMessage = (message) => {
    setTabMessage(message);
    setTimeout(() => setTabMessage(""), 3000);
  }

  function toggleTab(tab, current) {
    switch (current) {
      case 1:
        if (!validation.values.treatmentName) {
          handlerMessage("Please enter the treatment name");
          return;
        }
        break;
      case 2:
        if (!selectedClinic) {
          handlerMessage("Please select the clinic");
          return;
        }
        break;
      default:
        break;
    }
    if (current !== tab) {
      const modifiedSteps = [...passedSteps, tab];
      if (tab >= 1 && tab <= 4) {
        setactiveTab(tab);
        setPassedSteps(modifiedSteps);
      }
    }
  }

  // ─── Effects ──────────────────────────────────────────────────────────────

  useEffect(() => { dispatch(getClinics()); }, []);

  useEffect(() => {
    if (!clinics || clinics.length === 0) return;
    setSelectedClinic(clinics[0]);
  }, [clinics]);

  useEffect(() => {
    if (!selectedClinic) { setSelectedStimulations([]); return; }
    setSelectedStimulations([]);
    dispatch(getCliniciansByClinic(selectedClinic.guid));
    dispatch(getClinicStimulations(selectedClinic.guid));
    setShamList([]);
    setSlideList([]);
    setShamState(false);
    setAllowUpdateCurrentState(false);
    setOneSessionByDayState(false);
  }, [selectedClinic]);

  useEffect(() => {
    if (!clinician_users || clinician_users.length === 0) return;
    setSelectedClinician(clinician_users[0]);
  }, [clinician_users]);

  // ─── Render ───────────────────────────────────────────────────────────────

  return (
    <React.Fragment>
      <div className="page-content">
        <Container fluid={true}>
          <Breadcrumbs title="Treatment Management" breadcrumbItem="New Protocol" />
          <Row>
            <Col lg="12">
              <Card>
                <CardBody>
                  <h4 className="card-title mb-4">
                    {validation.values.treatmentName || "Create a new Treatment Protocol"}
                  </h4>
                  <div className="wizard clearfix">
                    <div className="steps clearfix">
                      <ul>
                        <NavItem className={classnames({ current: activeTab === 1 })}>
                          <NavLink
                            className={classnames({ current: activeTab === 1 })}
                            onClick={() => setactiveTab(1)}
                            disabled={!passedSteps.includes(1)}
                          >
                            <span className="number">1.</span> Details
                          </NavLink>
                        </NavItem>
                        <NavItem className={classnames({ current: activeTab === 2 })}>
                          <NavLink
                            className={classnames({ active: activeTab === 2 })}
                            onClick={() => setactiveTab(2)}
                            disabled={!passedSteps.includes(2)}
                          >
                            <span className="number">2.</span> Clinic Selection
                          </NavLink>
                        </NavItem>
                        <NavItem className={classnames({ current: activeTab === 3 })}>
                          <NavLink
                            className={classnames({ active: activeTab === 3 })}
                            onClick={() => setactiveTab(3)}
                            disabled={!passedSteps.includes(3)}
                          >
                            <span className="number">3.</span> Stimulations
                          </NavLink>
                        </NavItem>
                        <NavItem className={classnames({ current: activeTab === 4 })}>
                          <NavLink
                            className={classnames({ active: activeTab === 4 })}
                            onClick={() => setactiveTab(4)}
                            disabled={!passedSteps.includes(4)}
                          >
                            <span className="number">4.</span> Confirmation
                          </NavLink>
                        </NavItem>
                      </ul>
                    </div>

                    <div className="content clearfix">
                      <TabContent activeTab={activeTab} className="body">

                        {/* Tab 1 — Details */}
                        <TabPane tabId={1}>
                          <Form>
                            <Row>
                              <Col lg="12">
                                <div className="mb-3">
                                  <Label htmlFor="basicpill-firstname-input1">Treatment Name</Label>
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
                                  <Label htmlFor="basicpill-address-input1">Details</Label>
                                  <textarea
                                    value={validation.values.treatmentDetails}
                                    onChange={validation.handleChange}
                                    onBlur={validation.handleBlur}
                                    name="treatmentDetails"
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

                        {/* Tab 2 — Clinic Selection */}
                        <TabPane tabId={2}>
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
                                    onChange={(e) => setSelectedClinic(JSON.parse(e.target.value))}
                                    defaultValue={selectedClinic}
                                  >
                                    {getClinicsLabels()}
                                  </Input>
                                </div>
                              </Col>
                              <Col>{showClinicians()}</Col>
                            </Row>
                          </Form>
                        </TabPane>

                        {/* Tab 3 — Stimulations */}
                        <TabPane tabId={3}>
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
                                        onClick={(e) => setResearchTreatmentState(e.target.checked)}
                                      />
                                    </div>
                                  </Col>
                                </Row>
                              </Col>
                            </Row>
                          </Form>
                        </TabPane>

                        {/* Tab 4 — Confirmation */}
                        <TabPane tabId={4}>
                          <Row>
                            <Col lg="12">
                              <Card>
                                <CardBody>
                                  <div className="hori-timeline">
                                    <Swiper
                                      slidesPerView={1}
                                      navigation
                                      pagination={{ clickable: true }}
                                      breakpoints={{
                                        678: { slidesPerView: 2 },
                                        992: { slidesPerView: 3 },
                                        1400: { slidesPerView: 3 },
                                      }}
                                      loop={true}
                                      modules={[Pagination, Navigation]}
                                      className="owl-carousel owl-theme navs-carousel events"
                                      id="timeline-carousel"
                                    >
                                      <SwiperSlide className="item event-list active" style={{ display: "inline-table" }}>
                                        <div>
                                          <div className="event-date">
                                            <h5 className="mb-4">Treatment Detail</h5>
                                          </div>
                                          <div className="event-down-icon">
                                            <i className={`bx bx-${validation.values.treatmentName ? 'check' : 'error'}-circle h1 text-${validation.values.treatmentName ? 'success' : 'danger'} mt-15`} />
                                          </div>
                                          <div className="mt-3 px-3">
                                            <p className="text-muted">{validation.values.treatmentName || "—"}</p>
                                          </div>
                                        </div>
                                      </SwiperSlide>

                                      <SwiperSlide className="item event-list active" style={{ display: "inline-table" }}>
                                        <div>
                                          <div className="event-date">
                                            <h5 className="mb-4">Clinic Selection</h5>
                                          </div>
                                          <div className="event-down-icon">
                                            <i className={`bx bx-${selectedClinic?.name ? 'check' : 'error'}-circle h1 text-${selectedClinic?.name ? 'success' : 'danger'} mt-15`} />
                                          </div>
                                          <div className="mt-3 px-3">
                                            <p className="text-muted">{selectedClinic?.name || "—"}</p>
                                          </div>
                                        </div>
                                      </SwiperSlide>

                                      <SwiperSlide className="item event-list active" style={{ display: "inline-table" }}>
                                        <div>
                                          <div className="event-date">
                                            <h5 className="mb-4">Stimulations</h5>
                                          </div>
                                          <div className="event-down-icon">
                                            <i className={`bx bx-${selectedStimulations.filter(s => s.selected).length ? 'check' : 'error'}-circle h1 text-${selectedStimulations.filter(s => s.selected).length ? 'success' : 'danger'} mt-15`} />
                                          </div>
                                          <div className="mt-3 px-3">
                                            {selectedStimulations.filter(s => s.selected).length === 0 ? (
                                              <p className="text-muted">No stimulations selected</p>
                                            ) : (
                                              selectedStimulations.filter(s => s.selected).map((s) => {
                                                const stim = clinic_stimulations.find((cs) => cs.guid === s.guid);
                                                return (
                                                  <p key={s.guid} className="text-muted mb-1">{stim?.title ?? s.guid}</p>
                                                );
                                              })
                                            )}
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
                                {isLoadingForCreateTreatment ? <Spinner /> : (
                                  <Button
                                    color="primary"
                                    className="btn btn-primary w-md waves-effect waves-light"
                                    onClick={validation.handleSubmit}
                                  >
                                    {props.t("Create Protocol")}
                                  </Button>
                                )}
                              </div>
                            </Col>
                          </Row>
                        </TabPane>

                      </TabContent>
                    </div>

                    <div className="actions clearfix">
                      {isLoadingForCreateTreatment ? (
                        <p className="text-center">Creating protocol…</p>
                      ) : (
                        <ul>
                          <li>
                            <Alert className="w-500" color="info" isOpen={!!tabMessage} toggle={() => setTabMessage("")}>
                              {tabMessage}
                            </Alert>
                          </li>
                          <li className={activeTab === 1 ? "previous disabled" : "previous"}>
                            <Link to="#" onClick={() => toggleTab(activeTab - 1, activeTab)}>
                              Previous
                            </Link>
                          </li>
                          <li className={activeTab === 4 ? "next disabled" : "next"}>
                            <Link to="#" onClick={() => toggleTab(activeTab + 1, activeTab)}>
                              Next
                            </Link>
                          </li>
                        </ul>
                      )}
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
