import React, { useEffect, useMemo, useState } from "react";
import PropTypes from "prop-types";
import { useSelector, useDispatch } from "react-redux";
import {
  Badge,
  Card,
  CardBody,
  CardTitle,
  Col,
  Container,
  Form,
  FormFeedback,
  Input,
  Label,
  Modal,
  ModalBody,
  ModalHeader,
  Placeholder,
  Row,
  Table,
} from "reactstrap";
import withRouter from "../../../../components/Common/withRouter";
import { withTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { useFormik } from "formik";
import * as Yup from "yup";

import {
  getPatient,
  disablePatient,
  enablePatient,
  updatePatient,
  clearPatientsError,
  getPatientTreatments,
} from "../../../../store/patients/actions";

import { showToast } from "../../../../util/toast";
import getErrorMessage from "../../../../api/error";
import LocalTableContainer from "../../../../components/Common/LocalTableContainer";
import QuestionModal from "../../../../components/Common/QuestionItemModal";

const PlatoPatientDetail = (props) => {
  document.title = `${props.t("Patient Detail")} | ${props.t("Platoscience")}`;

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { guid } = props;

  const { patient, patient_treatments, error, loading } = useSelector((state) => ({
    patient: state.patients.patient,
    patient_treatments: state.patients.patient_treatments,
    error: state.patients.error,
    loading: state.patients.loading,
  }));

  // ── UI state ───────────────────────────────────────────────────────────────
  const [disablePatientModal, setDisablePatientModal] = useState(false);
  const [enablePatientModal, setEnablePatientModal] = useState(false);
  const [editModal, setEditModal] = useState(false);
  const [patientItem, setPatientItem] = useState(undefined);

  // Password visibility toggle
  const [pwType, setPwType] = useState("password");
  const [pwIcon, setPwIcon] = useState("mdi mdi-eye-off");
  const handleTogglePw = () => {
    if (pwType === "password") { setPwIcon("mdi mdi-eye"); setPwType("text"); }
    else { setPwIcon("mdi mdi-eye-off"); setPwType("password"); }
  };

  // ── Init ──────────────────────────────────────────────────────────────────
  useEffect(() => {
    dispatch(getPatient(guid));
    dispatch(getPatientTreatments(guid));
  }, []);

  // ── Patient enable / disable ──────────────────────────────────────────────
  const onClickDisable = () => setDisablePatientModal(true);
  const onClickEnable  = () => setEnablePatientModal(true);

  const handleDisablePatient = () => {
    if (patient?.guid) dispatch(disablePatient(patient.guid));
    setDisablePatientModal(false);
  };
  const handleEnablePatient = () => {
    if (patient?.guid) dispatch(enablePatient(patient.guid));
    setEnablePatientModal(false);
  };

  // ── Edit patient formik ───────────────────────────────────────────────────
  const validation = useFormik({
    enableReinitialize: true,
    initialValues: {
      name:  patientItem?.name  ?? "",
      email: patientItem?.email ?? "",
    },
    validationSchema: Yup.object({
      name:  Yup.string().required(props.t("Please Enter Your Name")),
      email: Yup.string()
        .matches(/^[\w-.]+@([\w-]+\.)+[\w-]{2,8}$/, props.t("Please Enter Valid Email"))
        .required(props.t("Please Enter Your Email")),
    }),
    onSubmit: (values) => {
      dispatch(updatePatient({ guid: patientItem.guid, name: values.name, email: values.email }));
      validation.resetForm();
      setEditModal(false);
    },
  });

  // ── Treatment table columns (read-only) ──────────────────────────────────
  const columns = useMemo(() => [
    {
      Header: props.t("Protocol"),
      accessor: "name",
      Cell: ({ value }) => value || "—",
    },
    {
      Header: props.t("Clinic"),
      id: "clinic",
      Cell: ({ row }) => row.original.clinic_clinician?.clinic?.name ?? "—",
    },
    {
      Header: props.t("Status"),
      id: "status",
      Cell: ({ row }) => {
        const item = row.original;
        if (item.disabled) return <Badge color="danger">Ended</Badge>;
        if (!item.started_at) return <Badge color="warning">Assigned</Badge>;
        return <Badge color="success">Active</Badge>;
      },
    },
  ], []);

  // ── Active treatment ──────────────────────────────────────────────────────
  const activeTreatment = patient_treatments?.find((t) => !t.disabled);

  return (
    <React.Fragment>
      {/* Confirm modals */}
      <QuestionModal
        visible={disablePatientModal}
        positive={false}
        questionText={`${props.t("Are you sure you want to disable the patient")}: ${patient?.email}`}
        onPositiveText={props.t("Disable Now")}
        onPositiveClick={handleDisablePatient}
        onNegativeText={props.t("Close")}
        onNegativeClick={() => setDisablePatientModal(false)}
      />
      <QuestionModal
        visible={enablePatientModal}
        positive={true}
        questionText={`${props.t("Are you sure you want to enable the patient")}: ${patient?.email}`}
        onPositiveText={props.t("Enable Now")}
        onPositiveClick={handleEnablePatient}
        onNegativeText={props.t("Close")}
        onNegativeClick={() => setEnablePatientModal(false)}
      />

      <div className="page-content">
        <Container fluid>
          {error && showToast(props.t("Error"), getErrorMessage(props.t, error), () => dispatch(clearPatientsError()))}

          <Row>
            {/* ── Patient info card ──────────────────────────────────── */}
            <Col xl={12}>
              <Card>
                <CardBody>
                  <CardTitle className="mb-4 d-flex justify-content-between align-items-center">
                    <span>{props.t("Patient Details")}</span>
                    <button
                      className="btn btn-outline-primary btn-sm"
                      onClick={() => { setPatientItem(patient); setEditModal(true); }}
                    >
                      <i className="bx bx-edit me-1" />{props.t("Edit")}
                    </button>
                  </CardTitle>

                  {loading ? (
                    <>
                      <Placeholder size="lg" xs={12} className="mb-2" />
                      <Placeholder size="lg" xs={8} />
                    </>
                  ) : (
                    <Table className="table-nowrap mb-0">
                      <tbody>
                        <tr>
                          <th scope="row" style={{ width: "160px" }}>{props.t("Name")}</th>
                          <td>{patient?.name}</td>
                        </tr>
                        <tr>
                          <th scope="row">{props.t("Email")}</th>
                          <td>{patient?.email}</td>
                        </tr>
                        <tr>
                          <th scope="row">{props.t("App Login")}</th>
                          <td>{patient?.access?.email ?? patient?.email}</td>
                        </tr>
                        <tr>
                          <th scope="row">{props.t("App Password")}</th>
                          <td>
                            <div className="input-group" style={{ maxWidth: 280 }}>
                              <Input
                                value={patient?.access?.credential ?? patient?.patient_mobile_accesses?.[0]?.credential ?? ""}
                                type={pwType}
                                disabled
                                readOnly
                              />
                              <span className="input-group-text" style={{ cursor: "pointer" }} onClick={handleTogglePw}>
                                <i className={pwIcon} />
                              </span>
                            </div>
                          </td>
                        </tr>
                        <tr>
                          <th scope="row">{props.t("Status")}</th>
                          <td>
                            {patient?.disabled
                              ? <Badge color="danger">{props.t("Inactive")}</Badge>
                              : <Badge color="success">{props.t("Active")}</Badge>}
                          </td>
                        </tr>
                      </tbody>
                    </Table>
                  )}

                  <div className="mt-3">
                    {patient?.disabled
                      ? <button className="btn btn-success btn-sm" disabled={loading} onClick={onClickEnable}>
                          <i className="bx bx-check-double me-1" />{props.t("Enable Patient")}
                        </button>
                      : <button className="btn btn-danger btn-sm" disabled={loading} onClick={onClickDisable}>
                          <i className="bx bx-block me-1" />{props.t("Disable Patient")}
                        </button>
                    }
                  </div>
                </CardBody>
              </Card>
            </Col>

            {/* ── Treatment section ──────────────────────────────────── */}
            <Col xl={12}>
              <Card>
                <CardBody>
                  <div className="d-flex justify-content-between align-items-center mb-3">
                    <CardTitle className="mb-0">{props.t("Treatment")}</CardTitle>
                    <button
                      className="btn btn-primary btn-sm"
                      onClick={() => navigate("/treatment-assignment")}
                    >
                      <i className="bx bx-transfer me-1" />
                      {props.t("Manage via Treatment Assignment")}
                    </button>
                  </div>

                  {/* Active treatment callout */}
                  {activeTreatment ? (
                    <div
                      className="p-3 rounded mb-3"
                      style={{ backgroundColor: "#F9F7F4", border: "1px solid #EAE4DA" }}
                    >
                      <p className="mb-1 small text-muted text-uppercase" style={{ letterSpacing: "0.05em" }}>
                        {props.t("Currently On")}
                      </p>
                      <p className="mb-0 fw-semibold">{activeTreatment.name}</p>
                      {activeTreatment.clinic_clinician?.clinic?.name && (
                        <p className="mb-0 small text-muted">
                          <i className="bx bx-building me-1" />
                          {activeTreatment.clinic_clinician.clinic.name}
                        </p>
                      )}
                    </div>
                  ) : (
                    <div
                      className="p-3 rounded mb-3"
                      style={{ backgroundColor: "#F9F7F4", border: "1px solid #EAE4DA" }}
                    >
                      <p className="mb-0 text-muted small">
                        <i className="bx bx-info-circle me-1" />
                        {props.t("No active treatment. Use Treatment Assignment to enroll this patient.")}
                      </p>
                    </div>
                  )}

                  {/* Full treatment history */}
                  <LocalTableContainer
                    columns={columns}
                    data={patient_treatments ?? []}
                    isGlobalFilter={false}
                    customPageSize={5}
                    className="custom-header-css"
                  />
                </CardBody>
              </Card>
            </Col>
          </Row>

          {/* ── Edit patient modal ────────────────────────────────────── */}
          <Modal isOpen={editModal} toggle={() => setEditModal(false)}>
            <ModalHeader toggle={() => setEditModal(false)} tag="h4">
              {props.t("Edit Patient")}
            </ModalHeader>
            <ModalBody>
              <Form onSubmit={(e) => { e.preventDefault(); validation.handleSubmit(); }}>
                <div className="mb-3">
                  <Label>{props.t("Name")}</Label>
                  <Input
                    name="name"
                    type="text"
                    placeholder={props.t("Patient full name")}
                    onChange={validation.handleChange}
                    onBlur={validation.handleBlur}
                    value={validation.values.name}
                    invalid={!!(validation.touched.name && validation.errors.name)}
                  />
                  {validation.touched.name && validation.errors.name && (
                    <FormFeedback>{validation.errors.name}</FormFeedback>
                  )}
                </div>
                <div className="mb-3">
                  <Label>{props.t("Email")}</Label>
                  <Input
                    name="email"
                    type="email"
                    placeholder={props.t("patient@email.com")}
                    onChange={validation.handleChange}
                    onBlur={validation.handleBlur}
                    value={validation.values.email}
                    invalid={!!(validation.touched.email && validation.errors.email)}
                  />
                  {validation.touched.email && validation.errors.email && (
                    <FormFeedback>{validation.errors.email}</FormFeedback>
                  )}
                </div>
                <div className="text-end">
                  <button type="button" className="btn btn-light me-2" onClick={() => setEditModal(false)}>
                    {props.t("Cancel")}
                  </button>
                  <button type="submit" className="btn btn-primary">
                    {props.t("Save")}
                  </button>
                </div>
              </Form>
            </ModalBody>
          </Modal>

        </Container>
      </div>
    </React.Fragment>
  );
};

PlatoPatientDetail.propTypes = {
  router: PropTypes.any,
  t: PropTypes.any,
  guid: PropTypes.string,
};

export default withRouter(withTranslation()(PlatoPatientDetail));
