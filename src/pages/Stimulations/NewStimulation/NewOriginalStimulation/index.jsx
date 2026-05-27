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
  addStimulation,
  clearStimulationsError,
} from "../../../../store/stimulations/actions";
import { Modal, ModalBody } from "reactstrap";
import * as Yup from "yup";
import { useFormik } from "formik";
import {
  colors,
  anodes,
  cathodes,
  currents,
  durations,
  type,
} from "../../data";
import { useNavigate } from "react-router-dom";
import { getClinics } from "../../../../store/actions";
//import { get } from "../../../../api/manager";
import { StimualtionDictionary } from "../../../../util/stimulation.parser";
import DynamicDiv from "../../DynamicDiv.component";

const NewOriginalStimulation = (props) => {
  document.title = `${props.t("New Stimulation")} | ${props.t(
    "Platoscience"
  )}`;

  const dispatch = useDispatch();
  const navigate = useNavigate()

  const [title, setTitle] = useState(undefined);
  const [name, setName] = useState(undefined);
  const [shortDescription, setShortDescription] = useState(undefined);
  const [description, setDescription] = useState(undefined);

  const [question, setQuestion] = useState(false);
  const toogleSubmit = () => setQuestion(!question);

  const [type, setType] = useState('');
  const [color, setColor] = useState(colors[0]);
  const [category, setCategory] = useState('default');
  const [current, setCurrent] = useState(currents[0]);
  const [duration, setDuration] = useState(durations[0]);
  const [anode, setAnode] = useState(anodes[0]);
  const [cathode, setCathode] = useState(anodes[1]);

  const [isPopupErrorVisible, setIsPopupErrorVisible] = useState(false);
  const [popupMessage, setPopupMessage] = useState('');

  const NO_CLINIC = props.t("THERE IS NO CLINIC!");

  const isValidClinic = (value) => value !== NO_CLINIC;

  const { clinics, errorClinics } = useSelector((state) => ({
    clinics: state.clinics.clinics,
    errorClinics: state.clinics.error,
  }));



  useEffect(() => {
    dispatch(getClinics());
  }, []);

  useEffect(() => {
    const types = StimualtionDictionary.findTypeAndColor(anode, cathode);
    setColor(types.color);
    setCategory(types.type || 'default');
  }, [anode, cathode]);

  const [selectedClinic, setSelectedClinic] = useState({});

  const { loading, error } = useSelector((state) => ({
    loading: state.stimulations.loading,
    error: state.stimulations.error,
  }));


  const validation = useFormik({
    enableReinitialize: true,
    initialValues: {
      title: title,
      name: name,
      category: category,
      shortDescription: shortDescription,
      description: description
    },
    validationSchema: Yup.object({
      title: Yup.string()
        .required(props.t("Please Enter Stimulation Title"))
        .min(2, props.t("Title must be contain 2 characters at least.")),
      name: Yup.string()
        .required(props.t("Please Enter Stimulation Display Name"))
        .min(2, props.t("Display Name must be contain 2 characters at least.")),
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
    handleChange: () => { },
    onSubmit: async (values) => {
      //const check = await checkStimulationName(values.title);
      //if (!check) return;
      const myclinic = !selectedClinic.guid ? clinics[0].guid : selectedClinic.guid;
      const data = {
        type: type || 'tdcs',
        title: values.title,
        name: values.name,
        description: values.description,
        short_description: values.shortDescription,
        color: color,
        category: category,
        clinic: myclinic,
        stimulation: {
          anode: anode,
          cathode: cathode,
          current: parseInt(current),
          duration: parseInt(duration),
          alias: values.title,
        },
      };
      dispatch(addStimulation(data, props.router.navigate));
    },
  });

  const checkStimulationName = async (name) => {
    /*try {
      const baseurl = import.meta.env.VITE_APP_API_URL;
      const [data] = await Promise.all([
        await get(`${baseurl}/plato/check-stimulation?name=${name}`, true, {}),
      ])
      if(data){
        setPopupMessage(`The stimulation ${data.title} already exists`);
        setIsPopupErrorVisible(true)
        return false;
      }
      return true;
    } catch (error) {
      console.error('Error checking stimulation name:', error);
      return false;
    }*/
  }

  const getClinicsLabels = () => {
    //
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

  const setCathodeEnsurance = (value) => {
    switch (value) {
      case "L":
        setCathode("R");
        break;
      case "R":
        setCathode("L");
        break;
    }
  }



  const onSaveStimulation = () => validation.submitForm();

  return (
    <React.Fragment>
      <>
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


      </>
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
                <div className="bg-primary bg-soft" >
                  <Row>
                    <Col xs="7">
                      <div className="text-primary p-3">
                        <h5 className="text-primary">
                          {props.t("New Stimulation")}
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
                    {props.t("Please set the stimulation information needed.")}
                  </p>

                  <div className="form-floating mb-3 hidden">
                    <input
                      type="text"
                      className="form-control"
                      disabled={true}
                      id="floatingnameInput"
                      defaultValue={props.t("Original")}
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
                          maxLength={32}
                          defaultValue={validation.values.title}
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
                          maxLength={32}
                          defaultValue={validation.values.name || ""}
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
                        onChange={(e) => { setAnode(e.target.value), setCathodeEnsurance(e.target.value) }}
                        className="form-select"
                      >teste RR clinic

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
                        invalid={
                          validation.touched.cathode &&
                            validation.errors.cathode
                            ? true
                            : false
                        }
                      >
                        {cathodes.map((_cathode) => (
                          <option disabled={_cathode == anode} key={_cathode} value={_cathode}>
                            {_cathode}
                          </option>
                        ))}
                      </select>
                      {validation.touched.cathode && validation.errors.cathode ? (
                        <FormFeedback type="invalid">
                          {validation.errors.cathode}
                        </FormFeedback>
                      ) : null}
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
                            {_duration / 60} min
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
      <Modal size="sm" isOpen={isPopupErrorVisible} toggle={() => setIsPopupErrorVisible(false)} centered={true}>
        <div className="modal-content">
          <ModalBody className="text-center">
            <div className="avatar-sm mb-4 mx-auto">
              <div className="avatar-title bg-danger text-danger bg-opacity-10 font-size-20 rounded-3">
                <i className="mdi mdi-close-circle-outline"></i>
              </div>
            </div>
            <p className="text-muted font-size-16 mb-4">{popupMessage}</p>
            <div className="hstack gap-2 justify-content-center mb-0">
              <button type="button" className="btn btn-danger" onClick={() => setIsPopupErrorVisible(false)}>{props.t("Close")}</button>
            </div>
          </ModalBody>
        </div>
      </Modal>
    </React.Fragment>
  );
};

NewOriginalStimulation.propTypes = {
  router: PropTypes.any,
  t: PropTypes.any,
  history: PropTypes.object,
};

export default withRouter(withTranslation()(NewOriginalStimulation));
