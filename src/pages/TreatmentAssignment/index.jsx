import React, { useEffect, useState } from "react";
import PropTypes from "prop-types";
import { withTranslation } from "react-i18next";
import {
  Card,
  CardBody,
  Container,
  Row,
  Col,
  FormGroup,
  Label,
  Input,
  Button,
  Table,
  Badge,
  Alert,
} from "reactstrap";
import { useDispatch, useSelector } from "react-redux";

import Breadcrumbs from "../../components/Common/Breadcrumb";
import { get, post } from "../../api/manager";
import { getClinics } from "../../store/actions";

const STEPS = ["Select Protocol", "Select Patients", "Review & Confirm"];

const TreatmentAssignment = (props) => {
  document.title = "Treatment Assignment | Plato Dashboard";

  const dispatch = useDispatch();
  const { clinics } = useSelector((state) => ({ clinics: state.clinics.clinics }));
  const baseurl = import.meta.env.VITE_APP_API_URL;

  // ── Step state ────────────────────────────────────────────────────────────
  const [step, setStep] = useState(1);

  // ── Step 1 — protocols ────────────────────────────────────────────────────
  const [protocols, setProtocols] = useState([]);
  const [selectedProtocol, setSelectedProtocol] = useState(null);

  // ── Step 2 — patients ─────────────────────────────────────────────────────
  const [patients, setPatients] = useState([]);
  const [filterClinic, setFilterClinic] = useState("");
  const [filterSearch, setFilterSearch] = useState("");
  const [selectedPatientGuids, setSelectedPatientGuids] = useState([]);

  // ── Step 3 — confirmation ─────────────────────────────────────────────────
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState(null);

  // ── Load data ─────────────────────────────────────────────────────────────
  useEffect(() => {
    dispatch(getClinics());
  }, []);

  useEffect(() => {
    get(`${baseurl}/treatments-group`, true, {}).then((data) => {
      if (data) setProtocols(data);
    });
    get(`${baseurl}/plato/patients?page=1&limit=500`, true, {}).then((data) => {
      if (data?.data) setPatients(data.data);
      else if (Array.isArray(data)) setPatients(data);
    });
  }, []);

  // ── Derived patient list (filtered) ───────────────────────────────────────
  const filteredPatients = patients.filter((p) => {
    const clinicName =
      p.clinic_patients?.[0]?.clinic?.name?.toLowerCase() ?? "";
    const matchClinic = filterClinic ? clinicName.includes(filterClinic.toLowerCase()) : true;
    const matchSearch = filterSearch
      ? p.name?.toLowerCase().includes(filterSearch.toLowerCase()) ||
        p.email?.toLowerCase().includes(filterSearch.toLowerCase())
      : true;
    return matchClinic && matchSearch;
  });

  const allFilteredSelected =
    filteredPatients.length > 0 &&
    filteredPatients.every((p) => selectedPatientGuids.includes(p.guid));

  const togglePatient = (guid) => {
    setSelectedPatientGuids((prev) =>
      prev.includes(guid) ? prev.filter((g) => g !== guid) : [...prev, guid]
    );
  };

  const toggleAllFiltered = () => {
    if (allFilteredSelected) {
      const filteredGuids = filteredPatients.map((p) => p.guid);
      setSelectedPatientGuids((prev) =>
        prev.filter((g) => !filteredGuids.includes(g))
      );
    } else {
      const filteredGuids = filteredPatients.map((p) => p.guid);
      setSelectedPatientGuids((prev) => [
        ...new Set([...prev, ...filteredGuids]),
      ]);
    }
  };

  // ── Step helpers ──────────────────────────────────────────────────────────
  const handleSelectProtocol = (guid) => {
    const found = protocols.find((p) => p.guid === guid);
    setSelectedProtocol(found || null);
  };

  const handleConfirm = async () => {
    setSubmitting(true);
    setError(null);
    try {
      await post(`${baseurl}/bulk-assign-treatment`, true, {
        treatment_group_guid: selectedProtocol.guid,
        patient_guids: selectedPatientGuids,
      });
      setSuccess(true);
    } catch (e) {
      setError(props.t("Something went wrong. Please try again."));
    } finally {
      setSubmitting(false);
    }
  };

  const handleReset = () => {
    setStep(1);
    setSelectedProtocol(null);
    setSelectedPatientGuids([]);
    setFilterClinic("");
    setFilterSearch("");
    setSuccess(false);
    setError(null);
  };

  // ── Selected patient objects (for review step) ────────────────────────────
  const selectedPatients = patients.filter((p) =>
    selectedPatientGuids.includes(p.guid)
  );

  // ── Render ────────────────────────────────────────────────────────────────
  return (
    <React.Fragment>
      <div className="page-content">
        <Container fluid>
          <Breadcrumbs
            title={props.t("Treatment Management")}
            breadcrumbItem={props.t("Treatment Assignment")}
          />

          {/* ── Step indicator ──────────────────────────────────────────── */}
          <Row className="mb-4">
            <Col>
              <div className="d-flex align-items-center gap-2">
                {STEPS.map((label, idx) => {
                  const num = idx + 1;
                  const isActive = step === num;
                  const isDone = step > num;
                  return (
                    <React.Fragment key={num}>
                      <div className="d-flex align-items-center gap-2">
                        <div
                          style={{
                            width: 32,
                            height: 32,
                            borderRadius: "50%",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            fontWeight: 600,
                            fontSize: 14,
                            backgroundColor: isDone
                              ? "#57072F"
                              : isActive
                              ? "#57072F"
                              : "#EAE4DA",
                            color: isDone || isActive ? "#fff" : "#57072F",
                            flexShrink: 0,
                          }}
                        >
                          {isDone ? "✓" : num}
                        </div>
                        <span
                          style={{
                            fontWeight: isActive ? 600 : 400,
                            color: isActive ? "#57072F" : "#6c757d",
                            fontSize: 14,
                          }}
                        >
                          {label}
                        </span>
                      </div>
                      {idx < STEPS.length - 1 && (
                        <div
                          style={{
                            flex: 1,
                            height: 1,
                            backgroundColor: step > num ? "#57072F" : "#EAE4DA",
                            maxWidth: 48,
                          }}
                        />
                      )}
                    </React.Fragment>
                  );
                })}
              </div>
            </Col>
          </Row>

          {/* ── Step 1 — Select Protocol ────────────────────────────────── */}
          {step === 1 && (
            <Card>
              <CardBody>
                <h5 className="mb-4" style={{ color: "#57072F" }}>
                  {props.t("Select a Treatment Protocol")}
                </h5>
                <FormGroup>
                  <Label>{props.t("Protocol")}</Label>
                  <Input
                    type="select"
                    value={selectedProtocol?.guid || ""}
                    onChange={(e) => handleSelectProtocol(e.target.value)}
                  >
                    <option value="">{props.t("— Choose a protocol —")}</option>
                    {protocols.map((p) => (
                      <option key={p.guid} value={p.guid}>
                        {p.name}
                        {p.clinic?.name ? ` (${p.clinic.name})` : ""}
                      </option>
                    ))}
                  </Input>
                </FormGroup>

                {selectedProtocol && (
                  <div
                    className="p-3 mt-3 rounded"
                    style={{ backgroundColor: "#F9F7F4", border: "1px solid #EAE4DA" }}
                  >
                    <strong>{selectedProtocol.name}</strong>
                    {selectedProtocol.description && (
                      <p className="mb-1 mt-1 text-muted small">
                        {selectedProtocol.description}
                      </p>
                    )}
                    <p className="mb-0 small">
                      <span className="text-muted">{props.t("Stimulations")}: </span>
                      {selectedProtocol.interventions?.length ?? 0}
                    </p>
                  </div>
                )}

                <div className="mt-4 d-flex justify-content-end">
                  <Button
                    color="primary"
                    disabled={!selectedProtocol}
                    onClick={() => setStep(2)}
                  >
                    {props.t("Next: Select Patients")} →
                  </Button>
                </div>
              </CardBody>
            </Card>
          )}

          {/* ── Step 2 — Select Patients ────────────────────────────────── */}
          {step === 2 && (
            <Card>
              <CardBody>
                <h5 className="mb-1" style={{ color: "#57072F" }}>
                  {props.t("Select Patients")}
                </h5>
                <p className="text-muted small mb-4">
                  {props.t("Assigning")}: <strong>{selectedProtocol?.name}</strong>
                </p>

                {/* Filters */}
                <Row className="mb-3 g-2">
                  <Col md={4}>
                    <Input
                      type="text"
                      placeholder={props.t("Search name or email...")}
                      value={filterSearch}
                      onChange={(e) => setFilterSearch(e.target.value)}
                    />
                  </Col>
                  <Col md={4}>
                    <Input
                      type="select"
                      value={filterClinic}
                      onChange={(e) => setFilterClinic(e.target.value)}
                    >
                      <option value="">{props.t("All Clinics")}</option>
                      {clinics.map((c) => (
                        <option key={c.guid} value={c.name}>
                          {c.name}
                        </option>
                      ))}
                    </Input>
                  </Col>
                  <Col md={4} className="d-flex align-items-center">
                    <span className="text-muted small">
                      {selectedPatientGuids.length} {props.t("selected")}
                      {selectedPatientGuids.length > 0 && (
                        <button
                          className="btn btn-link btn-sm p-0 ms-2"
                          onClick={() => setSelectedPatientGuids([])}
                        >
                          {props.t("Clear all")}
                        </button>
                      )}
                    </span>
                  </Col>
                </Row>

                {/* Patient table */}
                <div style={{ maxHeight: 420, overflowY: "auto" }}>
                  <Table responsive hover className="mb-0">
                    <thead style={{ backgroundColor: "#F9F7F4", position: "sticky", top: 0 }}>
                      <tr>
                        <th style={{ width: 40 }}>
                          <Input
                            type="checkbox"
                            checked={allFilteredSelected}
                            onChange={toggleAllFiltered}
                            title={props.t("Select all filtered")}
                          />
                        </th>
                        <th>{props.t("Name")}</th>
                        <th>{props.t("Email")}</th>
                        <th>{props.t("Clinic")}</th>
                        <th>{props.t("Active Treatment")}</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredPatients.length === 0 && (
                        <tr>
                          <td colSpan={5} className="text-center text-muted py-4">
                            {props.t("No patients found")}
                          </td>
                        </tr>
                      )}
                      {filteredPatients.map((p) => {
                        const checked = selectedPatientGuids.includes(p.guid);
                        const clinicName =
                          p.clinic_patients?.[0]?.clinic?.name ?? "—";
                        const activeTreatment =
                          p.patient_treatments?.find((t) => !t.disabled)
                            ?.name ?? null;
                        return (
                          <tr
                            key={p.guid}
                            style={{
                              cursor: "pointer",
                              backgroundColor: checked ? "#FFF5F8" : undefined,
                            }}
                            onClick={() => togglePatient(p.guid)}
                          >
                            <td onClick={(e) => e.stopPropagation()}>
                              <Input
                                type="checkbox"
                                checked={checked}
                                onChange={() => togglePatient(p.guid)}
                              />
                            </td>
                            <td>{p.name}</td>
                            <td className="text-muted small">{p.email}</td>
                            <td>{clinicName}</td>
                            <td>
                              {activeTreatment ? (
                                <Badge
                                  style={{
                                    backgroundColor: "#EAE4DA",
                                    color: "#57072F",
                                    fontWeight: 500,
                                  }}
                                >
                                  {activeTreatment}
                                </Badge>
                              ) : (
                                <span className="text-muted small">
                                  {props.t("None")}
                                </span>
                              )}
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </Table>
                </div>

                <div className="mt-4 d-flex justify-content-between">
                  <Button color="secondary" outline onClick={() => setStep(1)}>
                    ← {props.t("Back")}
                  </Button>
                  <Button
                    color="primary"
                    disabled={selectedPatientGuids.length === 0}
                    onClick={() => setStep(3)}
                  >
                    {props.t("Next: Review")} →
                  </Button>
                </div>
              </CardBody>
            </Card>
          )}

          {/* ── Step 3 — Review & Confirm ───────────────────────────────── */}
          {step === 3 && !success && (
            <Card>
              <CardBody>
                <h5 className="mb-1" style={{ color: "#57072F" }}>
                  {props.t("Review & Confirm")}
                </h5>
                <p className="text-muted small mb-4">
                  {props.t("Please review before confirming. This cannot be undone.")}
                </p>

                <div
                  className="p-3 rounded mb-4"
                  style={{ backgroundColor: "#F9F7F4", border: "1px solid #EAE4DA" }}
                >
                  <Row>
                    <Col sm={6}>
                      <p className="mb-1 small text-muted text-uppercase" style={{ letterSpacing: "0.05em" }}>
                        {props.t("Protocol")}
                      </p>
                      <p className="mb-0 fw-semibold">{selectedProtocol?.name}</p>
                    </Col>
                    <Col sm={6}>
                      <p className="mb-1 small text-muted text-uppercase" style={{ letterSpacing: "0.05em" }}>
                        {props.t("Patients to assign")}
                      </p>
                      <p className="mb-0 fw-semibold">{selectedPatients.length}</p>
                    </Col>
                  </Row>
                </div>

                {/* Patient list */}
                <div style={{ maxHeight: 300, overflowY: "auto" }} className="mb-4">
                  <Table responsive size="sm" className="mb-0">
                    <thead style={{ backgroundColor: "#F9F7F4" }}>
                      <tr>
                        <th>{props.t("Name")}</th>
                        <th>{props.t("Clinic")}</th>
                        <th>{props.t("Replacing")}</th>
                      </tr>
                    </thead>
                    <tbody>
                      {selectedPatients.map((p) => {
                        const clinicName =
                          p.clinic_patients?.[0]?.clinic?.name ?? "—";
                        const activeTreatment =
                          p.patient_treatments?.find((t) => !t.disabled)
                            ?.name ?? null;
                        return (
                          <tr key={p.guid}>
                            <td>{p.name}</td>
                            <td>{clinicName}</td>
                            <td>
                              {activeTreatment ? (
                                <span className="text-muted small">
                                  {activeTreatment}
                                </span>
                              ) : (
                                <span className="text-muted small">—</span>
                              )}
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </Table>
                </div>

                {error && <Alert color="danger">{error}</Alert>}

                <div className="d-flex justify-content-between">
                  <Button color="secondary" outline onClick={() => setStep(2)}>
                    ← {props.t("Back")}
                  </Button>
                  <Button
                    color="primary"
                    onClick={handleConfirm}
                    disabled={submitting}
                  >
                    {submitting
                      ? props.t("Assigning...")
                      : `${props.t("Assign")} ${selectedProtocol?.name} → ${selectedPatients.length} ${props.t("patients")}`}
                  </Button>
                </div>
              </CardBody>
            </Card>
          )}

          {/* ── Success state ────────────────────────────────────────────── */}
          {success && (
            <Card>
              <CardBody className="text-center py-5">
                <div
                  style={{
                    width: 64,
                    height: 64,
                    borderRadius: "50%",
                    backgroundColor: "#E0FFC2",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    margin: "0 auto 16px",
                    fontSize: 28,
                  }}
                >
                  ✓
                </div>
                <h5 style={{ color: "#57072F" }}>
                  {props.t("Assignment complete")}
                </h5>
                <p className="text-muted mb-4">
                  <strong>{selectedProtocol?.name}</strong>{" "}
                  {props.t("has been assigned to")}{" "}
                  <strong>{selectedPatients.length}</strong>{" "}
                  {props.t("patients")}.
                </p>
                <Button color="primary" onClick={handleReset}>
                  {props.t("Assign Another Protocol")}
                </Button>
              </CardBody>
            </Card>
          )}
        </Container>
      </div>
    </React.Fragment>
  );
};

TreatmentAssignment.propTypes = {
  t: PropTypes.any,
};

export default withTranslation()(TreatmentAssignment);
