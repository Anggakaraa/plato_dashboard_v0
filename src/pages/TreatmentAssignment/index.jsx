import React, { useEffect, useState } from "react";
import PropTypes from "prop-types";
import { withTranslation } from "react-i18next";
import {
  Alert,
  Badge,
  Button,
  Card,
  CardBody,
  Col,
  Container,
  FormGroup,
  Input,
  Label,
  Row,
  Table,
} from "reactstrap";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

import Breadcrumbs from "../../components/Common/Breadcrumb";
import { get, post } from "../../api/manager";
import { getClinics, getPatients } from "../../store/actions";

const STEPS = ["Choose Clinic", "Select Patients", "Choose Action", "Confirm"];

// ── Small step indicator ──────────────────────────────────────────────────────
const StepBar = ({ step }) => (
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
                    width: 32, height: 32, borderRadius: "50%",
                    display: "flex", alignItems: "center", justifyContent: "center",
                    fontWeight: 600, fontSize: 14, flexShrink: 0,
                    backgroundColor: isDone || isActive ? "#57072F" : "#EAE4DA",
                    color: isDone || isActive ? "#fff" : "#57072F",
                  }}
                >
                  {isDone ? "✓" : num}
                </div>
                <span style={{ fontWeight: isActive ? 600 : 400, color: isActive ? "#57072F" : "#6c757d", fontSize: 14 }}>
                  {label}
                </span>
              </div>
              {idx < STEPS.length - 1 && (
                <div style={{ flex: 1, height: 1, backgroundColor: step > num ? "#57072F" : "#EAE4DA", maxWidth: 48 }} />
              )}
            </React.Fragment>
          );
        })}
      </div>
    </Col>
  </Row>
);

// ── Active treatment label for a patient ─────────────────────────────────────
const activeTreatmentName = (patient) => {
  const active = patient.patient_treatments?.find((t) => !t.disabled && !t.completed);
  return active?.treatment_group?.name ?? active?.name ?? null;
};

// ── Main component ────────────────────────────────────────────────────────────
const TreatmentAssignment = (props) => {
  document.title = "Treatment Assignment | Plato Dashboard";

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { clinics } = useSelector((state) => ({ clinics: state.clinics.clinics }));
  const baseurl = import.meta.env.VITE_APP_API_URL;

  // ── State ─────────────────────────────────────────────────────────────────
  const [step, setStep] = useState(1);

  // Step 1
  const [selectedClinic, setSelectedClinic] = useState(null);

  // Step 2
  const [allPatients, setAllPatients] = useState([]);
  const [filterSearch, setFilterSearch] = useState("");
  const [selectedGuids, setSelectedGuids] = useState([]);

  // Step 3
  const [action, setAction] = useState(null); // "assign" | "remove"
  const [protocols, setProtocols] = useState([]);
  const [selectedProtocol, setSelectedProtocol] = useState(null);

  // Step 4
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [successCount, setSuccessCount] = useState(0);
  const [error, setError] = useState(null);

  // ── Load ──────────────────────────────────────────────────────────────────
  useEffect(() => { dispatch(getClinics()); }, []);

  useEffect(() => {
    get(`${baseurl}/treatments-group`, true, {}).then((data) => {
      if (data) setProtocols(data);
    });
  }, []);

  // Reload patients whenever clinic changes
  useEffect(() => {
    if (!selectedClinic) { setAllPatients([]); return; }
    get(`${baseurl}/plato/patients?clinic_guid=${selectedClinic.guid}&page=1&limit=500`, true, {})
      .then((data) => {
        const list = data?.data ?? (Array.isArray(data) ? data : []);
        setAllPatients(list);
      });
    setSelectedGuids([]);
    setFilterSearch("");
  }, [selectedClinic]);

  // ── Derived ───────────────────────────────────────────────────────────────
  const filteredPatients = allPatients.filter((p) => {
    if (!filterSearch) return true;
    const q = filterSearch.toLowerCase();
    return p.name?.toLowerCase().includes(q) || p.email?.toLowerCase().includes(q);
  });

  const allFilteredSelected =
    filteredPatients.length > 0 &&
    filteredPatients.every((p) => selectedGuids.includes(p.guid));

  const selectedPatients = allPatients.filter((p) => selectedGuids.includes(p.guid));
  const replacingCount = selectedPatients.filter((p) => activeTreatmentName(p) !== null).length;

  // ── Patient selection ─────────────────────────────────────────────────────
  const togglePatient = (guid) =>
    setSelectedGuids((prev) =>
      prev.includes(guid) ? prev.filter((g) => g !== guid) : [...prev, guid]
    );

  const toggleAllFiltered = () => {
    const guids = filteredPatients.map((p) => p.guid);
    if (allFilteredSelected) {
      setSelectedGuids((prev) => prev.filter((g) => !guids.includes(g)));
    } else {
      setSelectedGuids((prev) => [...new Set([...prev, ...guids])]);
    }
  };

  // ── Confirm ───────────────────────────────────────────────────────────────
  const handleConfirm = async () => {
    setSubmitting(true);
    setError(null);
    try {
      if (action === "assign") {
        await post(`${baseurl}/bulk-assign-treatment`, {
          treatment_group_guid: selectedProtocol.guid,
          patient_guids: selectedGuids,
        }, true, {});
      } else {
        await post(`${baseurl}/bulk-unassign-treatment`, {
          patient_guids: selectedGuids,
        }, true, {});
      }
      setSuccessCount(selectedGuids.length);
      setSuccess(true);
      // Refresh the global patients list so the Patients page shows updated treatments
      dispatch(getPatients());
    } catch {
      setError(props.t("Something went wrong. Please try again."));
    } finally {
      setSubmitting(false);
    }
  };

  const handleReset = () => {
    setStep(1);
    setSelectedClinic(null);
    setSelectedGuids([]);
    setFilterSearch("");
    setAction(null);
    setSelectedProtocol(null);
    setSuccess(false);
    setError(null);
    setSuccessCount(0);
  };

  // ── Shared card style ─────────────────────────────────────────────────────
  const infoBox = { backgroundColor: "#F9F7F4", border: "1px solid #EAE4DA" };

  // ── Render ────────────────────────────────────────────────────────────────
  return (
    <React.Fragment>
      <div className="page-content">
        <Container fluid>
          <Breadcrumbs
            title={props.t("Treatment Management")}
            breadcrumbItem={props.t("Treatment Assignment")}
          />

          <StepBar step={step} />

          {/* ── Step 1 — Choose Clinic ──────────────────────────────────── */}
          {step === 1 && (
            <Card>
              <CardBody>
                <h5 className="mb-4" style={{ color: "#57072F" }}>
                  {props.t("Which clinic are you managing?")}
                </h5>
                <FormGroup>
                  <Label>{props.t("Clinic")}</Label>
                  <Input
                    type="select"
                    value={selectedClinic?.guid || ""}
                    onChange={(e) => {
                      const found = clinics.find((c) => c.guid === e.target.value);
                      setSelectedClinic(found || null);
                    }}
                  >
                    <option value="">{props.t("— Select a clinic —")}</option>
                    {clinics.map((c) => (
                      <option key={c.guid} value={c.guid}>{c.name}</option>
                    ))}
                  </Input>
                </FormGroup>
                <div className="mt-4 d-flex justify-content-end">
                  <Button color="primary" disabled={!selectedClinic} onClick={() => setStep(2)}>
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
                  {props.t("Clinic")}: <strong>{selectedClinic?.name}</strong>
                </p>

                <Row className="mb-3 g-2 align-items-center">
                  <Col md={5}>
                    <Input
                      type="text"
                      placeholder={props.t("Search name or email...")}
                      value={filterSearch}
                      onChange={(e) => setFilterSearch(e.target.value)}
                    />
                  </Col>
                  <Col className="text-muted small">
                    {selectedGuids.length > 0 && (
                      <>
                        <strong>{selectedGuids.length}</strong> {props.t("selected")}
                        <button className="btn btn-link btn-sm p-0 ms-2" onClick={() => setSelectedGuids([])}>
                          {props.t("Clear")}
                        </button>
                      </>
                    )}
                  </Col>
                </Row>

                <div style={{ maxHeight: 420, overflowY: "auto" }}>
                  <Table responsive hover className="mb-0">
                    <thead style={{ ...infoBox, position: "sticky", top: 0 }}>
                      <tr>
                        <th style={{ width: 40 }}>
                          <input
                            type="checkbox"
                            checked={allFilteredSelected}
                            onChange={() => {}}
                            onClick={(e) => { e.stopPropagation(); toggleAllFiltered(); }}
                            title={props.t("Select all")}
                          />
                        </th>
                        <th>{props.t("Name")}</th>
                        <th>{props.t("Email")}</th>
                        <th>{props.t("Active Treatment")}</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredPatients.length === 0 && (
                        <tr>
                          <td colSpan={4} className="text-center text-muted py-4">
                            {allPatients.length === 0
                              ? props.t("No patients found for this clinic")
                              : props.t("No results match your search")}
                          </td>
                        </tr>
                      )}
                      {filteredPatients.map((p) => {
                        const checked = selectedGuids.includes(p.guid);
                        const treatment = activeTreatmentName(p);
                        return (
                          <tr
                            key={p.guid}
                            style={{ cursor: "pointer", backgroundColor: checked ? "#FFF5F8" : undefined }}
                            onClick={() => togglePatient(p.guid)}
                          >
                            <td onClick={(e) => e.stopPropagation()}>
                              <input
                                type="checkbox"
                                checked={checked}
                                onChange={() => {}}
                                onClick={(e) => { e.stopPropagation(); togglePatient(p.guid); }}
                              />
                            </td>
                            <td>{p.name}</td>
                            <td className="text-muted small">{p.email}</td>
                            <td>
                              {treatment ? (
                                <Badge style={{ backgroundColor: "#EAE4DA", color: "#57072F", fontWeight: 500 }}>
                                  {treatment}
                                </Badge>
                              ) : (
                                <span className="text-muted small">{props.t("None")}</span>
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
                    disabled={selectedGuids.length === 0}
                    onClick={() => setStep(3)}
                  >
                    {props.t("Next: Choose Action")} →
                  </Button>
                </div>
              </CardBody>
            </Card>
          )}

          {/* ── Step 3 — Choose Action ──────────────────────────────────── */}
          {step === 3 && (
            <Card>
              <CardBody>
                <h5 className="mb-1" style={{ color: "#57072F" }}>
                  {props.t("What do you want to do?")}
                </h5>
                <p className="text-muted small mb-4">
                  {selectedGuids.length} {props.t("patients selected from")} <strong>{selectedClinic?.name}</strong>
                </p>

                <Row className="g-3 mb-4">
                  {/* Assign card */}
                  <Col md={6}>
                    <div
                      className="p-3 rounded h-100"
                      style={{
                        ...infoBox,
                        border: action === "assign" ? "2px solid #57072F" : "1px solid #EAE4DA",
                        cursor: "pointer",
                      }}
                      onClick={() => { setAction("assign"); setSelectedProtocol(null); }}
                    >
                      <div className="d-flex align-items-center gap-2 mb-2">
                        <div
                          style={{
                            width: 36, height: 36, borderRadius: "50%",
                            backgroundColor: action === "assign" ? "#57072F" : "#EAE4DA",
                            display: "flex", alignItems: "center", justifyContent: "center",
                            fontSize: 18, flexShrink: 0,
                          }}
                        >
                          <i className="bx bx-plus" style={{ color: action === "assign" ? "#fff" : "#57072F" }} />
                        </div>
                        <strong style={{ color: "#57072F" }}>{props.t("Assign to Protocol")}</strong>
                      </div>
                      <p className="text-muted small mb-0">
                        {props.t("Pick a treatment protocol. All selected patients will be enrolled. Any existing treatment is automatically replaced.")}
                      </p>

                      {action === "assign" && (
                        <div className="mt-3" onClick={(e) => e.stopPropagation()}>
                          <Label className="small fw-semibold">{props.t("Select Protocol")}</Label>
                          <Input
                            type="select"
                            value={selectedProtocol?.guid || ""}
                            onChange={(e) => {
                              const found = protocols.find((p) => p.guid === e.target.value);
                              setSelectedProtocol(found || null);
                            }}
                          >
                            <option value="">{props.t("— Choose a protocol —")}</option>
                            {protocols.map((p) => (
                              <option key={p.guid} value={p.guid}>
                                {p.name}{p.clinic?.name ? ` (${p.clinic.name})` : ""}
                              </option>
                            ))}
                          </Input>

                          {selectedProtocol && (
                            <div className="mt-2 p-2 rounded" style={{ backgroundColor: "#fff", border: "1px solid #EAE4DA" }}>
                              <p className="mb-1 small fw-semibold">{selectedProtocol.name}</p>
                              {selectedProtocol.description && (
                                <p className="mb-1 small text-muted">{selectedProtocol.description}</p>
                              )}
                              {(selectedProtocol.interventions ?? []).length > 0 && (
                                <div className="d-flex flex-wrap gap-1 mt-1">
                                  {(selectedProtocol.interventions ?? [])
                                    .sort((a, b) => a.order - b.order)
                                    .map((iv) => (
                                      <span
                                        key={iv.guid}
                                        className="d-inline-flex align-items-center gap-1 px-2 py-1 rounded"
                                        style={{ backgroundColor: "#F9F7F4", border: "1px solid #EAE4DA", fontSize: "0.75rem" }}
                                      >
                                        <span style={{ width: 8, height: 8, borderRadius: "50%", backgroundColor: iv.tes_stimulation?.color ?? "#ccc", display: "inline-block" }} />
                                        {iv.tes_stimulation?.name ?? iv.stimulation_guid}
                                      </span>
                                    ))}
                                </div>
                              )}
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  </Col>

                  {/* Remove card */}
                  <Col md={6}>
                    <div
                      className="p-3 rounded h-100"
                      style={{
                        ...infoBox,
                        border: action === "remove" ? "2px solid #57072F" : "1px solid #EAE4DA",
                        cursor: "pointer",
                      }}
                      onClick={() => { setAction("remove"); setSelectedProtocol(null); }}
                    >
                      <div className="d-flex align-items-center gap-2 mb-2">
                        <div
                          style={{
                            width: 36, height: 36, borderRadius: "50%",
                            backgroundColor: action === "remove" ? "#57072F" : "#EAE4DA",
                            display: "flex", alignItems: "center", justifyContent: "center",
                            fontSize: 18, flexShrink: 0,
                          }}
                        >
                          <i className="bx bx-x" style={{ color: action === "remove" ? "#fff" : "#57072F" }} />
                        </div>
                        <strong style={{ color: "#57072F" }}>{props.t("Remove Treatment")}</strong>
                      </div>
                      <p className="text-muted small mb-0">
                        {props.t("Remove the active treatment from all selected patients. No new treatment is assigned. Use this to clear patients before reassigning.")}
                      </p>
                      {action === "remove" && (
                        <div className="mt-3 p-2 rounded" style={{ backgroundColor: "#fff4f4", border: "1px solid #f5c6cb" }}>
                          <p className="mb-0 small" style={{ color: "#721c24" }}>
                            <i className="bx bx-error-circle me-1" />
                            {props.t("This will remove the active treatment from all")} <strong>{selectedGuids.length}</strong> {props.t("selected patients.")}
                          </p>
                        </div>
                      )}
                    </div>
                  </Col>
                </Row>

                <div className="d-flex justify-content-between">
                  <Button color="secondary" outline onClick={() => setStep(2)}>
                    ← {props.t("Back")}
                  </Button>
                  <Button
                    color="primary"
                    disabled={!action || (action === "assign" && !selectedProtocol)}
                    onClick={() => setStep(4)}
                  >
                    {props.t("Next: Review")} →
                  </Button>
                </div>
              </CardBody>
            </Card>
          )}

          {/* ── Step 4 — Review & Confirm ───────────────────────────────── */}
          {step === 4 && !success && (
            <Card>
              <CardBody>
                <h5 className="mb-1" style={{ color: "#57072F" }}>
                  {props.t("Review & Confirm")}
                </h5>
                <p className="text-muted small mb-4">
                  {props.t("Check the details below before confirming. This cannot be undone.")}
                </p>

                {/* Summary row */}
                <div className="p-3 rounded mb-4" style={infoBox}>
                  <Row className="g-3">
                    <Col sm={4}>
                      <p className="mb-1 small text-muted text-uppercase" style={{ letterSpacing: "0.05em" }}>{props.t("Clinic")}</p>
                      <p className="mb-0 fw-semibold">{selectedClinic?.name}</p>
                    </Col>
                    <Col sm={4}>
                      <p className="mb-1 small text-muted text-uppercase" style={{ letterSpacing: "0.05em" }}>{props.t("Action")}</p>
                      <p className="mb-0 fw-semibold">
                        {action === "assign"
                          ? `${props.t("Assign")} → ${selectedProtocol?.name}`
                          : props.t("Remove Treatment")}
                      </p>
                    </Col>
                    <Col sm={4}>
                      <p className="mb-1 small text-muted text-uppercase" style={{ letterSpacing: "0.05em" }}>{props.t("Patients")}</p>
                      <p className="mb-0 fw-semibold">{selectedGuids.length}</p>
                    </Col>
                  </Row>
                </div>

                {/* Replacing callout — only for assign with pre-existing treatments */}
                {action === "assign" && replacingCount > 0 && (
                  <Alert color="warning" className="mb-4">
                    <i className="bx bx-info-circle me-1" />
                    <strong>{replacingCount}</strong> {props.t("of these patients already have an active treatment — it will be replaced.")}
                  </Alert>
                )}

                {/* Patient list */}
                <div style={{ maxHeight: 320, overflowY: "auto" }} className="mb-4">
                  <Table responsive size="sm" className="mb-0">
                    <thead style={infoBox}>
                      <tr>
                        <th>{props.t("Name")}</th>
                        <th>{props.t("Email")}</th>
                        <th>{action === "assign" ? props.t("Replacing") : props.t("Removing")}</th>
                      </tr>
                    </thead>
                    <tbody>
                      {selectedPatients.map((p) => {
                        const treatment = activeTreatmentName(p);
                        return (
                          <tr key={p.guid}>
                            <td>{p.name}</td>
                            <td className="text-muted small">{p.email}</td>
                            <td>
                              {treatment ? (
                                <span className="text-muted small">{treatment}</span>
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
                  <Button color="secondary" outline onClick={() => setStep(3)}>
                    ← {props.t("Back")}
                  </Button>
                  <Button
                    color={action === "remove" ? "danger" : "primary"}
                    onClick={handleConfirm}
                    disabled={submitting}
                  >
                    {submitting ? props.t("Processing...") : (
                      action === "assign"
                        ? `${props.t("Assign")} ${selectedProtocol?.name} → ${selectedGuids.length} ${props.t("patients")}`
                        : `${props.t("Remove treatment from")} ${selectedGuids.length} ${props.t("patients")}`
                    )}
                  </Button>
                </div>
              </CardBody>
            </Card>
          )}

          {/* ── Success ─────────────────────────────────────────────────── */}
          {success && (
            <Card>
              <CardBody className="text-center py-5">
                <div
                  style={{
                    width: 64, height: 64, borderRadius: "50%",
                    backgroundColor: action === "remove" ? "#f8d7da" : "#E0FFC2",
                    display: "flex", alignItems: "center", justifyContent: "center",
                    margin: "0 auto 16px", fontSize: 28,
                  }}
                >
                  ✓
                </div>
                <h5 style={{ color: "#57072F" }}>
                  {action === "assign" ? props.t("Assignment complete") : props.t("Treatments removed")}
                </h5>
                <p className="text-muted mb-4">
                  {action === "assign" ? (
                    <>
                      <strong>{selectedProtocol?.name}</strong>{" "}
                      {props.t("has been assigned to")}{" "}
                      <strong>{successCount}</strong> {props.t("patients")}.
                    </>
                  ) : (
                    <>
                      {props.t("Active treatment has been removed from")}{" "}
                      <strong>{successCount}</strong> {props.t("patients")}.
                    </>
                  )}
                </p>
                <div className="d-flex gap-2 justify-content-center">
                  <Button color="primary" onClick={handleReset}>
                    {props.t("Start Another Assignment")}
                  </Button>
                  <Button color="secondary" outline onClick={() => navigate("/patients")}>
                    {props.t("View Patients")} →
                  </Button>
                </div>
              </CardBody>
            </Card>
          )}

        </Container>
      </div>
    </React.Fragment>
  );
};

TreatmentAssignment.propTypes = { t: PropTypes.any };

export default withTranslation()(TreatmentAssignment);
