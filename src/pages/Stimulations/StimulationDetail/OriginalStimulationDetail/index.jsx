import React, { useEffect, useMemo, useState } from "react";
import PropTypes from "prop-types";

import { FormFeedback, Input, Label } from "reactstrap";

import { useSelector, useDispatch } from "react-redux";
import {
  Card,
  CardBody,
  Col,
  Container,
  Row,
  CardTitle,
  Placeholder,
} from "reactstrap";
import withRouter from "../../../../components/Common/withRouter";
import { withTranslation } from "react-i18next";

import { showToast } from "../../../../util/toast";
import getErrorMessage from "../../../../api/error";
import profile from "/src/assets/images/verification-img.png";

import QuestionModal from "../../../../components/Common/QuestionItemModal";
import {
  updateStimulation,
  getStimulation,
  clearStimulationsError,
  clearStimulation,
} from "../../../../store/stimulations/actions";

import * as Yup from "yup";
import { useFormik } from "formik";

import { anodes, cathodes, currents, durations } from "../../data";
import { getClinics } from "../../../../store/actions";
import { use } from "i18next";
import DynamicDiv from "../../DynamicDiv.component";
import { StimualtionDictionary } from "../../../../util/stimulation.parser";

const OriginalStimulationDetail = (props) => {
  document.title = `${props.t("Stimulation Detail")} | ${props.t(
    "Platoscience"
  )}`;

  const { guid } = props.router.params;

  const dispatch = useDispatch();

  const [title, setTitle] = useState(undefined);
  const [name, setName] = useState(undefined);
  const [color, setColor] = useState("#0a808a");
  const [shortDescription, setShortDescription] = useState(undefined);
  const [description, setDescription] = useState(undefined);

  const [anode, setAnode] = useState(undefined);
  const [cathode, setCathode] = useState(undefined);
  const [stimulationId, setStimulationId] = useState(undefined);

  const [current, setCurrent] = useState(undefined);
  const [duration, setDuration] = useState(undefined);
  const [original, setOriginal] = useState(true);
  const [category, setCategory] = useState(undefined);

  const [question, setQuestion] = useState(false);
  const toogleSubmit = () => setQuestion(!question);

  const NO_CLINIC = props.t("THERE IS NO CLINIC!");

  const isValidClinic = (value) => value !== NO_CLINIC;
  const [selectedClinic, setSelectedClinic] = useState(undefined);
  const { clinics, errorClinics } = useSelector((state) => ({
    clinics: state.clinics.clinics,
    errorClinics: state.clinics.error,
  }));

  useEffect(() => {
    dispatch(getClinics());
  }, []);

  useEffect(() => {
    const types = StimualtionDictionary.findTypeAndColor(anode, cathode);
    setColor(types?.color || '#0a808a');
    setCategory(types?.type || 'default');
  }, [anode, cathode]);

  const { stimulation, loading, error } = useSelector((state) => ({
    stimulation: state.stimulations.stimulation,
    loading: state.stimulations.loading,
    error: state.stimulations.error,
  }));

  const getClinicsLabels = () => {
    return (
      <>
        {clinics.length > 0 ? (
          clinics.map((clinic) => (
            <option
              selected={clinic.guid === stimulation?.clinic}
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

  const validation = useFormik({
    enableReinitialize: true,
    initialValues: {
      title: title,
      name: name,
      shortDescription: shortDescription,
      description: description,
      category: category
    },
    validationSchema: Yup.object({
      title: Yup.string()
        .required(props.t("Please Enter Stimulation Title"))
        .min(2, props.t("Title must be contain 2 characters at least.")),
      name: Yup.string()
        .required(props.t("Please Enter Stimulation Display"))
        .min(2, props.t("Display name must be contain 2 characters at least.")),
      shortDescription: Yup.string()
        .required(props.t("Please Enter Stimulation Short Description"))
        .min(
          5,
          props.t("Short Description must be contain 5 characters at least.")
        ),
      description: Yup.string()
        .required(props.t("Please Enter Stimulation Description"))
        .min(
          5,
          props.t("Description must be contain 5 characters at least.")
        ),
    }),
    handleChange: () => {},
    onSubmit: async (values) => {
      const c = getCurrentClinic();
      const data = {
        guid: guid,
        type: stimulation.tes_type.name,
        title: values.title,
        name: values.name,
        description: values.description,
        short_description: values.shortDescription,
        color: color,
        category: values.category,
        clinic: await selectedClinic?.guid || c.guid,
        tdcs_parameter_id: stimulationId,
        stimulation: {
          anode: anode,
          cathode: cathode,
          current: parseInt(current),
          duration: parseInt(duration),
          alias: values.title,
        },
      };
      dispatch(updateStimulation(data, props.router.navigate));
    },
  });

  useEffect(() => {
    dispatch(getStimulation(guid));
    return () => dispatch(clearStimulation());
  }, []);

  useEffect(() => {
    
  }, [selectedClinic]);

  useEffect(() => {
    if (!stimulation) return;
    setStimulation();
  }, [stimulation]);

  const getCurrentClinic = () => {
    const selectedClinicLoad = clinics.find((clinic) => clinic.guid === stimulation?.clinic);
    return selectedClinicLoad;
  }

  const setStimulation = () => {
    setTitle(stimulation.title);
    setName(stimulation.name);
    setShortDescription(stimulation.short_description);
    setDescription(stimulation.description);
    setSelectedClinic(selectedClinic);
    setColor(stimulation.color);
    setCategory(stimulation.category);
    setStimulationId(stimulation.tes_stimulations_tdcs_parameters[0].tdcs_parameter.guid);
    setAnode(
      stimulation.tes_stimulations_tdcs_parameters[0].tdcs_parameter.anode
    );
    setCathode(
      stimulation.tes_stimulations_tdcs_parameters[0].tdcs_parameter.cathode
    );
    setCurrent(
      stimulation.tes_stimulations_tdcs_parameters[0].tdcs_parameter.current
    );
    setDuration(
      stimulation.tes_stimulations_tdcs_parameters[0].tdcs_parameter.duration
    );
    setOriginal(stimulation.original);
  };

  const onSaveStimulation = () => validation.submitForm();

  return (
    <React.Fragment>
      {
        <QuestionModal
          visible={question}
          positive={true}
          questionText={`${props.t(
            "Are you sure you want to update the stimulation?"
          )}`}
          onPositiveText={props.t("Save")}
          onPositiveClick={onSaveStimulation}
          onNegativeText={props.t("Close")}
          onNegativeClick={toogleSubmit}
        />
      }
      <div className="page-content">
        <Container fluid>
          {error
            ? showToast(
                props.t("Error"),
                getErrorMessage(props.t, error),
                () => {
                  dispatch(clearStimulationsError());
                }
              )
            : null}
          <Row>
            <Col xl={8}>
              <Card className="overflow-hidden">
                <div className="bg-primary bg-soft">
                  <Row>
                    <Col xs="7">
                      <div className="text-primary p-3">
                        <h5 className="text-primary">
                          {props.t("Stimulation detail")}
                        </h5>
                      </div>
                    </Col>
                    
                  </Row>
                </div>
              </Card>

              <Card>
                <CardBody>
                  <CardTitle className="h5">
                    {props.t("Stimulation information")}
                  </CardTitle>
                  <p className="card-title-desc">
                    {props.t(
                      "Please add/edit the stimulation information needed."
                    )}
                  </p>

                  <div className="form-floating mb-3">
                    <input
                      type="text"
                      className="form-control hidden"
                      disabled={true}
                      id="floatingnameInput"
                      value={original ? props.t("Original") : props.t("Custom")}
                    />
                    <label htmlFor="floatingnameInput">{props.t("Type")}</label>
                  </div>

                  <>
                  {loading ? (
                      <Placeholder />
                    ) : (
                      <div className="form-floating mb-3">
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
                        <Label htmlFor="floatingnameInput">
                          {props.t("Clinic")}
                        </Label>
                      </div>
                    )}
                    {loading ? (
                      <Placeholder />
                    ) : (
                      <div className="form-floating mb-3">
                        <Input
                          type="text"
                          className="form-control"
                          id="floatingnameInput"
                          placeholder={props.t("Enter Title")}
                          name="title"
                          value={validation.values.title}
                          onChange={validation.handleChange}
                          onBlur={validation.handleBlur}
                          invalid={
                            validation.touched.title && validation.errors.title
                              ? true
                              : false
                          }
                        />
                        <Label htmlFor="floatingnameInput">
                          {props.t("Title")}
                        </Label>
                        {validation.touched.title && validation.errors.title ? (
                          <FormFeedback type="invalid">
                            {validation.errors.title}
                          </FormFeedback>
                        ) : null}
                      </div>
                    )}
                    {loading ? (
                      <Placeholder />
                    ) : (
                      <div className="form-floating mb-3">
                        <Input
                          type="text"
                          className="form-control"
                          id="floatingnameInput"
                          placeholder={props.t("Enter Display Name")}
                          name="name"
                          value={validation.values.name}
                          onChange={validation.handleChange}
                          onBlur={validation.handleBlur}
                          invalid={
                            validation.touched.name && validation.errors.name
                              ? true
                              : false
                          }
                        />
                        <Label htmlFor="floatingnameInput">
                          {props.t("Display Name")}
                        </Label>
                        {validation.touched.name && validation.errors.name ? (
                          <FormFeedback type="invalid">
                            {validation.errors.name}
                          </FormFeedback>
                        ) : null}
                      </div>
                    )}
                  </>
                  <>
                    {loading ? (
                      <Placeholder />
                    ) : (
                      <div className="form-floating mb-3">
                        <Input
                          type="text"
                          className="form-control"
                          id="floatingnameInput"
                          placeholder={props.t("Enter Short Description")}
                          name="shortDescription"
                          value={validation.values.shortDescription}
                          onChange={validation.handleChange}
                          onBlur={validation.handleBlur}
                          invalid={
                            validation.touched.shortDescription &&
                            validation.errors.shortDescription
                              ? true
                              : false
                          }
                        />
                        <Label htmlFor="floatingnameInput">
                          {props.t("Short Description")}
                        </Label>
                        {validation.touched.shortDescription &&
                        validation.errors.shortDescription ? (
                          <FormFeedback type="invalid">
                            {validation.errors.shortDescription}
                          </FormFeedback>
                        ) : null}
                      </div>
                    )}
                  </>
                  <>
                    {loading ? (
                      <Placeholder />
                    ) : (
                      <div className="form-floating mb-3">
                        <Input
                          type="text"
                          className="form-control"
                          id="floatingnameInput"
                          placeholder={props.t("Enter Description")}
                          name="description"
                          value={validation.values.description}
                          onChange={validation.handleChange}
                          onBlur={validation.handleBlur}
                          invalid={
                            validation.touched.description &&
                            validation.errors.description
                              ? true
                              : false
                          }
                        />
                        <Label htmlFor="floatingnameInput">
                          {props.t("Description")}
                        </Label>
                        {validation.touched.description &&
                        validation.errors.description ? (
                          <FormFeedback type="invalid">
                            {validation.errors.description}
                          </FormFeedback>
                        ) : null}
                      </div>
                    )}
                  </>
                  <div className="hidden">
                    <Label htmlFor="floatingnameInput">
                      {props.t("Color")}
                    </Label>
                    <Input
                      className="form-control form-control-color mw-100"
                      type="color"
                      value={color}
                      onChange={(e) => setColor(e.target.value)}
                    />
                  </div>

                  <div style={{ marginTop: 16 }}>
                    <label htmlFor="floatingSelectGrid">
                      {props.t("Anode")}
                    </label>
                    <div className="d-flex">
                      <div className="mini-stat-icon avatar-sm align-self-center rounded-circle bg-primary">
                        <span className="avatar-title">
                          <i
                            className={"mdi mdi-electric-switch font-size-18"}
                          />
                        </span>
                      </div>

                      <select
                        value={anode}
                        onChange={(e) => setAnode(e.target.value)}
                        className="form-select"
                      >
                        {anodes.map((_anode) => (
                          <option disabled={_anode == cathode} key={_anode} value={_anode}>
                            {_anode}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div style={{ marginTop: 16 }}>
                    <label htmlFor="floatingSelectGrid">
                      {props.t("Cathode")}
                    </label>
                    <div className="d-flex">
                      <div className="mini-stat-icon avatar-sm align-self-center rounded-circle bg-primary">
                        <span className="avatar-title">
                          <i
                            className={
                              "mdi mdi-electric-switch-closed font-size-18"
                            }
                          />
                        </span>
                      </div>

                      <select
                        value={cathode}
                        onChange={(e) => setCathode(e.target.value)}
                        className="form-select"
                      >
                        {cathodes.map((_cathode) => (
                          <option disabled={_cathode == anode} key={_cathode} value={_cathode}>
                            {_cathode}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>
                  <div style={{ marginTop: 16 }}>
                    <label htmlFor="floatingSelectGrid">
                      {props.t(`Stimulation Color: ${color} - Type: ${category}`)}
                    </label>
                    <div className="d-flex">
                      <div className="mini-stat-icon avatar-sm align-self-center rounded-circle bg-primary">
                        <span className="avatar-title">
                          <i className={"mdi mdi-palette font-size-18"} />
                        </span>
                      </div>
                      <DynamicDiv width="100%" height="48px" bgColor={color} />
                    </div>
                  </div>
                  <div style={{ marginTop: 16 }}>
                    <label htmlFor="floatingSelectGrid">
                      {props.t("Current")}
                    </label>
                    <div className="d-flex">
                      <div className="mini-stat-icon avatar-sm align-self-center rounded-circle bg-primary">
                        <span className="avatar-title">
                          <i className={"mdi mdi-flash font-size-18"} />
                        </span>
                      </div>

                      <select
                        value={current}
                        onChange={(e) => setCurrent(e.target.value)}
                        className="form-select"
                      >
                        {currents.map((_current) => (
                          <option key={_current} value={_current}>
                            {_current / 100} mA
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div style={{ marginTop: 16 }}>
                    <label htmlFor="floatingSelectGrid">
                      {props.t("Duration")}
                    </label>
                    <div className="d-flex">
                      <div className="mini-stat-icon avatar-sm align-self-center rounded-circle bg-primary">
                        <span className="avatar-title">
                          <i className={"bx bx-hourglass font-size-18"} />
                        </span>
                      </div>

                      <select
                        value={duration}
                        onChange={(e) => setDuration(e.target.value)}
                        className="form-select"
                      >
                        {durations.map((_duration) => (
                          <option key={_duration} value={_duration}>
                            {_duration / 60 } min
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>
                </CardBody>
                <div className="form-floating mb-3">
                  <button
                    style={{ margin: 18 }}
                    type="submit"
                    onClick={() => {
                      if (validation.isValid) toogleSubmit();
                    }}
                    className="btn btn-primary w-md"
                  >
                    {props.t("Update")}
                  </button>
                </div>
              </Card>
            </Col>
          </Row>
        </Container>
      </div>
    </React.Fragment>
  );
};

OriginalStimulationDetail.propTypes = {
  router: PropTypes.any,
  t: PropTypes.any,
  guid: PropTypes.string,
  history: PropTypes.object,
};

export default withRouter(withTranslation()(OriginalStimulationDetail));
