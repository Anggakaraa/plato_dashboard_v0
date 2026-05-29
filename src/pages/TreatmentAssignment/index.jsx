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
  Input,
  Label,
  Modal,
  ModalBody,
  ModalFooter,
  ModalHeader,
  Row,
  Table,
} from "reactstrap";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

import Breadcrumbs from "../../components/Common/Breadcrumb";
import { get, post } from "../../api/manager";
import { getClinics, getPatients } from "../../store/actions";

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
  const [selectedClinic, setSelectedClinic] = useState(null);

  // Patient selection
  const [allPatients, setAllPatients] = useState([]);
  const [filterSearch, setFilterSearch] = useState("");
  const [selectedGuids, setSelectedGuids] = useState([]);

  // CSV upload
  const [inputMode, setInputMode] = useState("manual"); // "manual" | "csv"
  const [csvMatched, setCsvMatched] = useState([]);
  const [csvUnmatched, setCsvUnmatched] = useState([]);
  const [csvFileName, setCsvFileName] = useState(null);

  // Action
  const [action, setAction] = useState(null); // "assign" | "remove"
  const [protocols, setProtocols] = useState([]);
  const [selectedProtocol, setSelectedProtocol] = useState(null);

  // Submission
  const [confirmModal, setConfirmModal] = useState(false);
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

  // Reload patients when clinic changes, reset all downstream state
  useEffect(() => {
    if (!selectedClinic) { setAllPatients([]); return; }
    get(`${baseurl}/plato/patients?clinic_guid=${selectedClinic.guid}&page=1&limit=500`, true, {})
      .then((data) => {
        const list = data?.data ?? (Array.isArray(data) ? data : []);
        setAllPatients(list);
      });
    setSelectedGuids([]);
    setFilterSearch("");
    setInputMode("manual");
    setCsvMatched([]);
    setCsvUnmatched([]);
    setCsvFileName(null);
    setAction(null);
    setSelectedProtocol(null);
  }, [selectedClinic]);

  // Reset action when all patients are deselected
  useEffect(() => {
    if (selectedGuids.length === 0) {
      setAction(null);
      setSelectedProtocol(null);
    }
  }, [selectedGuids]);

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

  const canConfirm =
    selectedGuids.length > 0 &&
    action &&
    (action === "remove" || selectedProtocol);

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

  // ── CSV upload ────────────────────────────────────────────────────────────
  const handleCsvUpload = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setCsvFileName(file.name);
    const reader = new FileReader();
    reader.onload = (evt) => {
      const rows = evt.target.result
        .split(/\r?\n/)
        .map((r) => r.trim().toLowerCase())
        .filter((r) => r && r !== "email");
      const matched = [];
      const unmatched = [];
      rows.forEach((email) => {
        const patient = allPatients.find((p) => p.email?.toLowerCase() === email);
        if (patient) matched.push(patient);
        else unmatched.push(email);
      });
      setCsvMatched(matched);
      setCsvUnmatched(unmatched);
      setSelectedGuids(matched.map((p) => p.guid));
    };
    reader.readAsText(file);
    e.target.value = "";
  };

  const handleClearCsv = () => {
    setCsvMatched([]);
    setCsvUnmatched([]);
    setCsvFileName(null);
    setSelectedGuids([]);
  };

  // ── Submit ────────────────────────────────────────────────────────────────
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
      setConfirmModal(false);
      setSuccess(true);
      dispatch(getPatients());
    } catch {
      setError(props.t("Something went wrong. Please try again."));
    } finally {
      setSubmitting(false);
    }
  };

  const handleReset = () => {
    setSelectedClinic(null);
    setAllPatients([]);
    setSelectedGuids([]);
    setFilterSearch("");
    setInputMode("manual");
    setCsvMatched([]);
    setCsvUnmatched([]);
    setCsvFileName(null);
    setAction(null);
    setSelectedProtocol(null);
    setConfirmModal(false);
    setSuccess(false);
    setError(null);
    setSuccessCount(0);
  };

  // ── Shared styles ─────────────────────────────────────────────────────────
  const infoBox = { backgroundColor: "#F9F7F4", border: "1px solid #EAE4DA" };
  const sectionLabel = {
    fontSize: "0.7rem",
    fontWeight: 600,
    letterSpacing: "0.07em",
    textTransform: "uppercase",
    color: "#6c757d",
    marginBottom: "0.75rem",
  };

  // ── Render ────────────────────────────────────────────────────────────────
  return (
    <React.Fragment>
      <div className="page-content" style={{ paddingBottom: canConfirm && !success ? 80 : undefined }}>
        <Container fluid>
          <Breadcrumbs
            title={props.t("Treatment Management")}
            breadcrumbItem={props.t("Treatment Assignment")}
          />

          {/* ── Success screen ────────────────────────────────────────────── */}
          {success ? (
            <Card>
              <CardBody className="text-center py-5">
                <div style={{
                  width: 64, height: 64, borderRadius: "50%",
                  backgroundColor: action === "remove" ? "#f8d7da" : "#E0FFC2",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  margin: "0 auto 16px", fontSize: 28,
                }}>
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
          ) : (
            <Card>
              <CardBody>

                {/* ── Section 1: Clinic ──────────────────────────────────── */}
                <p style={sectionLabel}>{props.t("Clinic")}</p>
                <Input
                  type="select"
                  style={{ maxWidth: 360 }}
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

                {/* ── Section 2: Patients ────────────────────────────────── */}
                {selectedClinic && (
                  <>
                    <hr style={{ borderColor: "#EAE4DA", margin: "1.5rem 0" }} />

                    <div className="d-flex align-items-center justify-content-between mb-3">
                      <div className="d-flex align-items-center gap-2">
                        <p style={{ ...sectionLabel, marginBottom: 0 }}>{props.t("Patients")}</p>
                        {selectedGuids.length > 0 && (
                          <Badge style={{ backgroundColor: "#57072F", fontSize: "0.7rem" }}>
                            {selectedGuids.length} {props.t("selected")}
                          </Badge>
                        )}
                      </div>
                      <div className="d-flex gap-2">
                        <button
                          className={`btn btn-sm ${inputMode === "manual" ? "btn-primary" : "btn-outline-secondary"}`}
                          onClick={() => { setInputMode("manual"); handleClearCsv(); }}
                        >
                          <i className="bx bx-list-ul me-1" />{props.t("Select Manually")}
                        </button>
                        <button
                          className={`btn btn-sm ${inputMode === "csv" ? "btn-primary" : "btn-outline-secondary"}`}
                          onClick={() => { setInputMode("csv"); setSelectedGuids([]); setFilterSearch(""); }}
                        >
                          <i className="bx bx-upload me-1" />{props.t("Upload CSV")}
                        </button>
                      </div>
                    </div>

                    {/* Manual selection */}
                    {inputMode === "manual" && (
                      <>
                        <Row className="mb-2 g-2 align-items-center">
                          <Col md={5}>
                            <Input
                              type="text"
                              placeholder={props.t("Search name or email...")}
                              value={filterSearch}
                              onChange={(e) => setFilterSearch(e.target.value)}
                            />
                          </Col>
                          {selectedGuids.length > 0 && (
                            <Col className="text-muted small">
                              <button
                                className="btn btn-link btn-sm p-0"
                                onClick={() => setSelectedGuids([])}
                              >
                                {props.t("Clear selection")}
                              </button>
                            </Col>
                          )}
                        </Row>
                        <div style={{ maxHeight: 340, overflowY: "auto" }}>
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
                      </>
                    )}

                    {/* CSV upload */}
                    {inputMode === "csv" && (
                      <>
                        {!csvFileName ? (
                          <div
                            className="p-5 rounded text-center"
                            style={{ border: "2px dashed #EAE4DA", backgroundColor: "#F9F7F4", cursor: "pointer" }}
                            onClick={() => document.getElementById("csv-upload-input").click()}
                          >
                            <i className="bx bx-cloud-upload" style={{ fontSize: 36, color: "#57072F" }} />
                            <p className="mb-1 fw-semibold mt-2">{props.t("Click to upload a CSV file")}</p>
                            <p className="text-muted small mb-0">
                              {props.t("One patient email per row. First row can be a header.")}
                            </p>
                            <input
                              id="csv-upload-input"
                              type="file"
                              accept=".csv,text/csv"
                              style={{ display: "none" }}
                              onChange={handleCsvUpload}
                            />
                          </div>
                        ) : (
                          <>
                            <div className="p-3 rounded mb-3 d-flex align-items-center justify-content-between" style={infoBox}>
                              <div>
                                <i className="bx bx-file me-2" style={{ color: "#57072F" }} />
                                <strong>{csvFileName}</strong>
                                <span className="text-muted small ms-2">
                                  {csvMatched.length} {props.t("matched")} · {csvUnmatched.length} {props.t("not found")}
                                </span>
                              </div>
                              <button className="btn btn-link btn-sm p-0 text-danger" onClick={handleClearCsv}>
                                {props.t("Remove")}
                              </button>
                            </div>

                            {csvMatched.length > 0 && (
                              <div className="mb-3">
                                <p className="small fw-semibold mb-2" style={{ color: "#57072F" }}>
                                  <i className="bx bx-check-circle me-1" />
                                  {csvMatched.length} {props.t("patients matched")}
                                </p>
                                <div style={{ maxHeight: 240, overflowY: "auto" }}>
                                  <Table responsive size="sm" className="mb-0">
                                    <thead style={infoBox}>
                                      <tr>
                                        <th>{props.t("Name")}</th>
                                        <th>{props.t("Email")}</th>
                                        <th>{props.t("Active Treatment")}</th>
                                      </tr>
                                    </thead>
                                    <tbody>
                                      {csvMatched.map((p) => {
                                        const treatment = activeTreatmentName(p);
                                        return (
                                          <tr key={p.guid}>
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
                              </div>
                            )}

                            {csvUnmatched.length > 0 && (
                              <div className="p-3 rounded" style={{ backgroundColor: "#fff4f4", border: "1px solid #f5c6cb" }}>
                                <p className="small fw-semibold mb-2" style={{ color: "#721c24" }}>
                                  <i className="bx bx-error-circle me-1" />
                                  {csvUnmatched.length} {props.t("emails not found in this clinic")}
                                </p>
                                <div className="d-flex flex-wrap gap-1">
                                  {csvUnmatched.map((email) => (
                                    <span
                                      key={email}
                                      className="px-2 py-1 rounded small"
                                      style={{ backgroundColor: "#f8d7da", color: "#721c24" }}
                                    >
                                      {email}
                                    </span>
                                  ))}
                                </div>
                                <p className="small text-muted mt-2 mb-0">
                                  {props.t("These will be skipped. Check the email or confirm the patient belongs to this clinic.")}
                                </p>
                              </div>
                            )}
                          </>
                        )}
                      </>
                    )}
                  </>
                )}

                {/* ── Section 3: Action ──────────────────────────────────── */}
                {selectedGuids.length > 0 && (
                  <>
                    <hr style={{ borderColor: "#EAE4DA", margin: "1.5rem 0" }} />
                    <p style={sectionLabel}>{props.t("Action")}</p>
                    <Row className="g-3">

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
                            <div style={{
                              width: 36, height: 36, borderRadius: "50%",
                              backgroundColor: action === "assign" ? "#57072F" : "#EAE4DA",
                              display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0,
                            }}>
                              <i className="bx bx-plus" style={{ color: action === "assign" ? "#fff" : "#57072F", fontSize: 18 }} />
                            </div>
                            <strong style={{ color: "#57072F" }}>{props.t("Assign to Protocol")}</strong>
                          </div>
                          <p className="text-muted small mb-0">
                            {props.t("Enrol selected patients into a protocol. Any existing treatment is automatically replaced.")}
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
                                  <option key={p.guid} value={p.guid}>{p.name}</option>
                                ))}
                              </Input>
                              {selectedProtocol && (selectedProtocol.interventions ?? []).length > 0 && (
                                <div className="mt-2 d-flex flex-wrap gap-1">
                                  {(selectedProtocol.interventions ?? [])
                                    .sort((a, b) => a.order - b.order)
                                    .map((iv) => (
                                      <span
                                        key={iv.guid}
                                        className="px-2 py-1 rounded small"
                                        style={{ backgroundColor: "#fff", border: "1px solid #EAE4DA", fontSize: "0.75rem" }}
                                      >
                                        {iv.tes_stimulation?.name ?? iv.stimulation_guid}
                                      </span>
                                    ))}
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
                            <div style={{
                              width: 36, height: 36, borderRadius: "50%",
                              backgroundColor: action === "remove" ? "#57072F" : "#EAE4DA",
                              display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0,
                            }}>
                              <i className="bx bx-x" style={{ color: action === "remove" ? "#fff" : "#57072F", fontSize: 18 }} />
                            </div>
                            <strong style={{ color: "#57072F" }}>{props.t("Remove Treatment")}</strong>
                          </div>
                          <p className="text-muted small mb-0">
                            {props.t("Remove the active treatment from selected patients without assigning a new one.")}
                          </p>
                          {action === "remove" && (
                            <div className="mt-3 p-2 rounded" style={{ backgroundColor: "#fff4f4", border: "1px solid #f5c6cb" }}>
                              <p className="mb-0 small" style={{ color: "#721c24" }}>
                                <i className="bx bx-error-circle me-1" />
                                {props.t("This will remove treatment from")} <strong>{selectedGuids.length}</strong> {props.t("patients.")}
                              </p>
                            </div>
                          )}
                        </div>
                      </Col>
                    </Row>
                  </>
                )}

              </CardBody>
            </Card>
          )}
        </Container>
      </div>

      {/* ── Sticky confirm bar ────────────────────────────────────────────── */}
      {canConfirm && !success && (
        <div style={{
          position: "fixed", bottom: 0, left: 0, right: 0, zIndex: 1040,
          backgroundColor: "#57072F", color: "#fff",
          padding: "14px 24px",
          display: "flex", alignItems: "center", justifyContent: "space-between",
          boxShadow: "0 -2px 16px rgba(0,0,0,0.2)",
        }}>
          <div className="small">
            {action === "assign" ? (
              <>
                <span style={{ opacity: 0.7 }}>{props.t("Assign")}</span>
                {" "}<strong>{selectedProtocol?.name}</strong>
                {" "}<span style={{ opacity: 0.7 }}>{props.t("to")}</span>
                {" "}<strong>{selectedGuids.length} {props.t("patients")}</strong>
                {replacingCount > 0 && (
                  <span style={{ opacity: 0.6, marginLeft: 8 }}>
                    · {replacingCount} {props.t("will have existing treatment replaced")}
                  </span>
                )}
              </>
            ) : (
              <>
                <span style={{ opacity: 0.7 }}>{props.t("Remove treatment from")}</span>
                {" "}<strong>{selectedGuids.length} {props.t("patients")}</strong>
              </>
            )}
          </div>
          <Button
            style={{ backgroundColor: "#E0FFC2", color: "#57072F", border: "none", fontWeight: 600, flexShrink: 0 }}
            onClick={() => setConfirmModal(true)}
          >
            {props.t("Confirm")} →
          </Button>
        </div>
      )}

      {/* ── Confirm modal ─────────────────────────────────────────────────── */}
      <Modal isOpen={confirmModal} toggle={() => !submitting && setConfirmModal(false)}>
        <ModalHeader toggle={() => !submitting && setConfirmModal(false)} tag="h5">
          {action === "assign" ? props.t("Confirm Assignment") : props.t("Confirm Removal")}
        </ModalHeader>
        <ModalBody>
          <div className="p-3 rounded mb-3" style={infoBox}>
            <Row className="g-2">
              <Col sm={6}>
                <p className="mb-1 small text-muted text-uppercase" style={{ letterSpacing: "0.05em" }}>{props.t("Clinic")}</p>
                <p className="mb-0 fw-semibold">{selectedClinic?.name}</p>
              </Col>
              <Col sm={6}>
                <p className="mb-1 small text-muted text-uppercase" style={{ letterSpacing: "0.05em" }}>{props.t("Patients")}</p>
                <p className="mb-0 fw-semibold">{selectedGuids.length}</p>
              </Col>
              <Col sm={12}>
                <p className="mb-1 small text-muted text-uppercase" style={{ letterSpacing: "0.05em" }}>{props.t("Action")}</p>
                <p className="mb-0 fw-semibold">
                  {action === "assign"
                    ? `${props.t("Assign")} → ${selectedProtocol?.name}`
                    : props.t("Remove Treatment")}
                </p>
              </Col>
            </Row>
          </div>

          {action === "assign" && replacingCount > 0 && (
            <Alert color="warning" className="mb-3">
              <i className="bx bx-info-circle me-1" />
              <strong>{replacingCount}</strong> {props.t("patients already have an active treatment — it will be replaced.")}
            </Alert>
          )}

          {error && <Alert color="danger">{error}</Alert>}

          <p className="text-muted small mb-0">{props.t("This action cannot be undone.")}</p>
        </ModalBody>
        <ModalFooter>
          <Button color="light" onClick={() => setConfirmModal(false)} disabled={submitting}>
            {props.t("Cancel")}
          </Button>
          <Button
            color={action === "remove" ? "danger" : "primary"}
            onClick={handleConfirm}
            disabled={submitting}
          >
            {submitting ? props.t("Processing...") : props.t("Confirm")}
          </Button>
        </ModalFooter>
      </Modal>

    </React.Fragment>
  );
};

TreatmentAssignment.propTypes = { t: PropTypes.any };

export default withTranslation()(TreatmentAssignment);
