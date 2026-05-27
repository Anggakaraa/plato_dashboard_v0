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

import {
  cleanClinicsError,
  getMyClinics,
} from "../../../../store/clinics/actions";

import { showToast } from "../../../../util/toast";
import getErrorMessage from "../../../../api/error";
import profile from "/src/assets/images/verification-img.png";

import QuestionModal from "../../../../components/Common/QuestionItemModal";
import {
  addClinicStimulation,
  getClinicStimulation,
  clearStimulationsError,
} from "../../../../store/stimulations/actions";

import * as Yup from "yup";
import { useFormik } from "formik";

import { anodes, cathodes, currents, durations } from "../../data";

const CustomStimulationDetail = (props) => {
  document.title = `${props.t("Custom Stimulation Detail")} | ${props.t(
    "Platoscience"
  )}`;

  const { guid } = props.router.params;

  const dispatch = useDispatch();

  const [selectedClinic, setSelectedClinic] = useState(undefined);

  const [title, setTitle] = useState(undefined);
  const [name, setName] = useState(undefined);
  const [color, setColor] = useState("#0a808a");
  const [shortDescription, setShortDescription] = useState(undefined);
  const [description, setDescription] = useState(undefined);

  const [anode, setAnode] = useState(undefined);
  const [cathode, setCathode] = useState(undefined);

  const [current, setCurrent] = useState(undefined);
  const [duration, setDuration] = useState(undefined);

  const [question, setQuestion] = useState(false);
  const toogleSubmit = () => setQuestion(!question);

  const { my_clinics, errorClinics } = useSelector((state) => ({
    my_clinics: state.clinics.my_clinics,
    errorClinics: state.clinics.error,
  }));

  const { clinic_stimulation, loading, error } = useSelector((state) => ({
    clinic_stimulation: state.stimulations.clinic_stimulation,
    loading: state.stimulations.loading,
    error: state.stimulations.error,
  }));

  const validation = useFormik({
    enableReinitialize: true,
    initialValues: {
      title: title,
      name: name,
      shortDescription: shortDescription,
      description: description,
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
      const data = {
        clinic: selectedClinic.guid,
        original: guid,
        type: clinic_stimulation.tes_type.name,
        title: values.title,
        name: values.name,
        description: values.description,
        short_description: values.shortDescription,
        color: color,
        stimulation: {
          anode: anode,
          cathode: cathode,
          current: parseInt(current),
          duration: parseInt(duration),
          alias: values.title,
        },
      };

      dispatch(addClinicStimulation(data, props.router.navigate));
    },
  });

  useEffect(() => {
    dispatch(getMyClinics());
    dispatch(getClinicStimulation(guid));
  }, []);

  useEffect(() => {
    if (!my_clinics || my_clinics.length == 0) return;
    setSelectedClinic(my_clinics[0]);
  }, [my_clinics]);

  useEffect(() => {
    if (!clinic_stimulation) return;
    setBaseStimulation();
  }, [clinic_stimulation]);

  const setBaseStimulation = () => {
    setTitle(clinic_stimulation.title);
    setName(stimulation.name);
    setShortDescription(clinic_stimulation.short_description);
    setDescription(clinic_stimulation.description);

    setColor(clinic_stimulation.color);
    setAnode(
      clinic_stimulation.tes_stimulations_tdcs_parameters[0].tdcs_parameter
        .anode
    );
    setCathode(
      clinic_stimulation.tes_stimulations_tdcs_parameters[0].tdcs_parameter
        .cathode
    );
    setCurrent(
      clinic_stimulation.tes_stimulations_tdcs_parameters[0].tdcs_parameter
        .current
    );
    setDuration(
      clinic_stimulation.tes_stimulations_tdcs_parameters[0].tdcs_parameter
        .duration
    );
  };

  const onSaveStimulation = () => validation.submitForm();

  return (
    <React.Fragment>
      {
        <QuestionModal
          visible={question}
          positive={true}
          questionText={`${props.t(
            "Are you sure you want to create a new stimulation?"
          )}`}
          onPositiveText={props.t("Save")}
          onPositiveClick={onSaveStimulation}
          onNegativeText={props.t("Close")}
          onNegativeClick={toogleSubmit}
        />
      }
      <div className="page-content">
        <Container fluid>
          {errorClinics
            ? showToast(
                props.t("Error"),
                getErrorMessage(props.t, errorClinics),
                () => {
                  dispatch(cleanClinicsError());
                }
              )
            : null}
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
                          {props.t("New stimulation")}
                        </h5>
                      </div>
                    </Col>
                    <Col xs="5" className="align-self-end">
                      <img src={profile} alt="" className="img-fluid" />
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
                      className="form-control"
                      disabled={true}
                      id="floatingnameInput"
                      defaultValue={props.t("Custom")}
                    />
                    <label htmlFor="floatingnameInput">{props.t("Type")}</label>
                  </div>

                  <div className="form-floating mb-3">
                    <select
                      defaultValue={selectedClinic}
                      className="form-select"
                      onChange={e => setSelectedClinic(JSON.parse(e.target.value))}
                    >
                      {my_clinics.map((_clinic) => (
                        <option key={_clinic.guid} value={JSON.stringify(_clinic)}>
                          {_clinic.name}
                        </option>
                      ))}
                    </select>
                    <label htmlFor="floatingSelectGrid">
                      {props.t("Clinic")}
                    </label>
                  </div>

                  <>
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
                          defaultValue={validation.values.title || ""}
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
                          defaultValue={
                            validation.values.shortDescription || ""
                          }
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
                          defaultValue={validation.values.description || ""}
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
                  <div>
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
                          <option key={_anode} value={_anode}>
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
                          <option key={_cathode} value={_cathode}>
                            {_cathode}
                          </option>
                        ))}
                      </select>
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
                            {_current}
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
                            {_duration}
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
                    {props.t("Save")}
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

CustomStimulationDetail.propTypes = {
  router: PropTypes.any,
  t: PropTypes.any,
  guid: PropTypes.string,
  history: PropTypes.object,
};

export default withRouter(withTranslation()(CustomStimulationDetail));
