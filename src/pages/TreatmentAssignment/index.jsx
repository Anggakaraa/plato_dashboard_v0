import React, { useEffect, useRef, useState } from "react"
import PropTypes from "prop-types"
import { withTranslation } from "react-i18next"
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
  Pagination,
  PaginationItem,
  PaginationLink,
  Row,
  Spinner,
  Table,
} from "reactstrap"
import Select from "react-select"
import { useDispatch, useSelector } from "react-redux"
import { useNavigate } from "react-router-dom"

import Breadcrumbs from "../../components/Common/Breadcrumb"
import { get, post } from "../../api/manager"
import { getClinics, getPatients } from "../../store/actions"
import { buildTreatmentSignature } from "../../util/treatment-signature"

// ── Active treatment label for a patient ──────────────────────────────────────
const activeTreatmentName = (patient) => {
  const active = patient.patient_treatments?.find(t => !t.disabled && !t.completed)
  return active?.treatment_group?.name ?? active?.name ?? null
}

// ── react-select Plato token styles ───────────────────────────────────────────
const selectStyles = {
  control: (base, state) => ({
    ...base,
    borderColor: state.isFocused ? "#57072F" : "#E8E2D9",
    boxShadow: state.isFocused ? "0 0 0 3px rgba(87,7,47,0.1)" : "none",
    "&:hover": { borderColor: "#57072F" },
    fontFamily: "Raleway, sans-serif",
    fontSize: 13,
  }),
  option: (base, state) => ({
    ...base,
    backgroundColor: state.isSelected ? "#57072F" : state.isFocused ? "rgba(87,7,47,0.05)" : "white",
    color: state.isSelected ? "#fff" : "#495057",
    fontSize: 13,
  }),
  placeholder: base => ({ ...base, color: "#AC8599", fontSize: 13 }),
  singleValue: base => ({ ...base, fontSize: 13 }),
  menu: base => ({ ...base, zIndex: 9999 }),
}

const PAGE_SIZE = 50

// ─────────────────────────────────────────────────────────────────────────────

const TreatmentAssignment = (props) => {
  document.title = "Treatment Assignment | Plato Dashboard"

  const dispatch = useDispatch()
  const navigate = useNavigate()
  const { clinics } = useSelector(state => ({ clinics: state.clinics.clinics }))
  const baseurl = import.meta.env.VITE_APP_API_URL

  // ── Clinic
  const [selectedClinic, setSelectedClinic] = useState(null)

  // ── Paginated patient loading
  const [page, setPage] = useState(1)
  const [totalPatients, setTotalPatients] = useState(0)
  const [totalPages, setTotalPages] = useState(0)
  const [loadedPatients, setLoadedPatients] = useState([])
  const [loadingPatients, setLoadingPatients] = useState(false)

  // ── Server-side search (debounced)
  const [searchInput, setSearchInput] = useState("")
  const [activeSearch, setActiveSearch] = useState("")

  // ── Selection
  // selectionMode: "none" | "explicit" | "all-matching"
  // "explicit": user has manually checked individual patients (may span pages)
  // "all-matching": all active guids matching current clinic+search filter
  const [selectedGuids, setSelectedGuids] = useState([])
  const [selectionMode, setSelectionMode] = useState("none")
  const [allMatchingMeta, setAllMatchingMeta] = useState(null)
  // { total, activeTreatmentCount, noTreatmentCount, disabledCount, clinicName, search }
  const [loadingAllGuids, setLoadingAllGuids] = useState(false)

  // Cache of patient objects seen across pages, for replacement count in explicit mode
  const knownPatientsRef = useRef({})

  // ── CSV upload
  const [inputMode, setInputMode] = useState("manual") // "manual" | "csv"
  const [csvMatched, setCsvMatched] = useState([])
  const [csvUnmatched, setCsvUnmatched] = useState([])
  const [csvFileName, setCsvFileName] = useState(null)

  // ── Action
  const [action, setAction] = useState(null) // "assign" | "remove"
  const [protocols, setProtocols] = useState([])
  const [selectedProtocol, setSelectedProtocol] = useState(null)

  // ── Submission
  const [confirmModal, setConfirmModal] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [success, setSuccess] = useState(false)
  const [successCount, setSuccessCount] = useState(0)
  const [error, setError] = useState(null)

  // ── Load clinics and protocols once
  useEffect(() => { dispatch(getClinics()) }, [])

  // ── Auto-select when only one clinic available
  useEffect(() => {
    if (clinics.length === 1 && !selectedClinic) handleClinicChange(clinics[0])
  }, [clinics])
  useEffect(() => {
    get(`${baseurl}/treatments-group`, true, {}).then(data => { if (data) setProtocols(data) })
  }, [])

  // ── Debounce search input → activeSearch
  useEffect(() => {
    const timer = setTimeout(() => {
      setActiveSearch(searchInput)
      setPage(1)
    }, 300)
    return () => clearTimeout(timer)
  }, [searchInput])

  // ── Fetch patients (server-side paginated + filtered)
  useEffect(() => {
    if (!selectedClinic) { setLoadedPatients([]); setTotalPatients(0); setTotalPages(0); return }
    setLoadingPatients(true)
    const url = `${baseurl}/plato/patients?clinic_guid=${selectedClinic.guid}&page=${page}&limit=${PAGE_SIZE}&search=${encodeURIComponent(activeSearch)}`
    get(url, true, {})
      .then(data => {
        const list = data?.data ?? (Array.isArray(data) ? data : [])
        setLoadedPatients(list)
        setTotalPatients(data?.pagination?.total ?? list.length)
        setTotalPages(data?.pagination?.totalPages ?? 1)
      })
      .finally(() => setLoadingPatients(false))
  }, [selectedClinic, page, activeSearch])

  // Cache loaded patients for replacement count in explicit mode
  useEffect(() => {
    loadedPatients.forEach(p => { knownPatientsRef.current[p.guid] = p })
  }, [loadedPatients])

  // ── Reset when action deselected
  useEffect(() => {
    if (selectedGuids.length === 0) { setAction(null); setSelectedProtocol(null) }
  }, [selectedGuids])

  // ── Clinic change: reset everything
  const handleClinicChange = (clinic) => {
    setSelectedClinic(clinic)
    setPage(1)
    setSearchInput("")
    setActiveSearch("")
    setSelectedGuids([])
    setSelectionMode("none")
    setAllMatchingMeta(null)
    setInputMode("manual")
    setCsvMatched([])
    setCsvUnmatched([])
    setCsvFileName(null)
    setAction(null)
    setSelectedProtocol(null)
    knownPatientsRef.current = {}
  }

  // ── Derived pagination range
  const firstPatient = totalPatients === 0 ? 0 : (page - 1) * PAGE_SIZE + 1
  const lastPatient = Math.min(page * PAGE_SIZE, totalPatients)

  // ── Derived selection state
  const activeLoadedPatients = loadedPatients.filter(p => !p.disabled)
  const allPageSelected = activeLoadedPatients.length > 0 && activeLoadedPatients.every(p => selectedGuids.includes(p.guid))
  const somePageSelected = activeLoadedPatients.some(p => selectedGuids.includes(p.guid))

  // Show "Select all matching" banner when all visible rows are selected but there are more total
  const showSelectAllBanner =
    selectionMode === "explicit" &&
    allPageSelected &&
    totalPatients > selectedGuids.length

  // Replacement count in explicit mode (from cached patient objects)
  const knownSelected = selectedGuids.filter(g => knownPatientsRef.current[g])
  const replacingCount = knownSelected.filter(g => activeTreatmentName(knownPatientsRef.current[g]) !== null).length
  const replacingUnknown = selectedGuids.length - knownSelected.length

  const canConfirm = selectedGuids.length > 0 && action && (action === "remove" || selectedProtocol)

  // ── Header checkbox toggle (current page only)
  const togglePageSelection = () => {
    const pageGuids = activeLoadedPatients.map(p => p.guid)
    if (allPageSelected) {
      setSelectedGuids(prev => prev.filter(g => !pageGuids.includes(g)))
      if (selectionMode === "all-matching") {
        setSelectionMode("explicit")
        setAllMatchingMeta(null)
      }
    } else {
      setSelectedGuids(prev => [...new Set([...prev, ...pageGuids])])
      setSelectionMode("explicit")
    }
  }

  // ── Toggle individual patient
  const togglePatient = (guid) => {
    setSelectionMode("explicit")
    setAllMatchingMeta(null)
    setSelectedGuids(prev =>
      prev.includes(guid) ? prev.filter(g => g !== guid) : [...prev, guid]
    )
  }

  // ── Select all matching patients (calls /ids endpoint)
  const handleSelectAllMatching = async () => {
    setLoadingAllGuids(true)
    try {
      const url = `${baseurl}/plato/patients/ids?clinic_guid=${selectedClinic.guid}&search=${encodeURIComponent(activeSearch)}`
      const data = await get(url, true, {})
      setSelectedGuids(data.guids ?? [])
      setSelectionMode("all-matching")
      setAllMatchingMeta({
        total: data.total,
        activeTreatmentCount: data.activeTreatmentCount,
        noTreatmentCount: data.noTreatmentCount,
        disabledCount: data.disabledCount,
        clinicName: selectedClinic.name,
        search: activeSearch,
      })
    } finally {
      setLoadingAllGuids(false)
    }
  }

  // ── Clear selection
  const clearSelection = () => {
    setSelectedGuids([])
    setSelectionMode("none")
    setAllMatchingMeta(null)
  }

  // ── CSV upload
  const handleCsvUpload = (e) => {
    const file = e.target.files?.[0]
    if (!file) return
    setCsvFileName(file.name)
    const reader = new FileReader()
    reader.onload = (evt) => {
      const rows = evt.target.result
        .split(/\r?\n/)
        .map(r => r.trim().toLowerCase())
        .filter(r => r && r !== "email")
      const allKnown = Object.values(knownPatientsRef.current)
      const matched = []
      const unmatched = []
      rows.forEach(email => {
        const patient = allKnown.find(p => p.email?.toLowerCase() === email)
        if (patient) matched.push(patient)
        else unmatched.push(email)
      })
      setCsvMatched(matched)
      setCsvUnmatched(unmatched)
      setSelectedGuids(matched.map(p => p.guid))
      setSelectionMode("explicit")
      setAllMatchingMeta(null)
    }
    reader.readAsText(file)
    e.target.value = ""
  }

  const handleClearCsv = () => { setCsvMatched([]); setCsvUnmatched([]); setCsvFileName(null); clearSelection() }

  // ── Submit
  const handleConfirm = async () => {
    setSubmitting(true)
    setError(null)
    try {
      if (action === "assign") {
        await post(`${baseurl}/bulk-assign-treatment`, { treatment_group_guid: selectedProtocol.guid, patient_guids: selectedGuids }, true, {})
      } else {
        await post(`${baseurl}/bulk-unassign-treatment`, { patient_guids: selectedGuids }, true, {})
      }
      setSuccessCount(selectedGuids.length)
      setConfirmModal(false)
      setSuccess(true)
      dispatch(getPatients())
    } catch {
      setError(props.t("Something went wrong. Please try again."))
    } finally {
      setSubmitting(false)
    }
  }

  const handleReset = () => {
    setSelectedClinic(null)
    setPage(1)
    setSearchInput("")
    setActiveSearch("")
    setLoadedPatients([])
    setTotalPatients(0)
    setTotalPages(0)
    setSelectedGuids([])
    setSelectionMode("none")
    setAllMatchingMeta(null)
    setInputMode("manual")
    setCsvMatched([]); setCsvUnmatched([]); setCsvFileName(null)
    setAction(null); setSelectedProtocol(null)
    setConfirmModal(false); setSuccess(false); setError(null); setSuccessCount(0)
    knownPatientsRef.current = {}
  }

  // ── Selection label text
  const selectionLabel = () => {
    if (selectionMode === "all-matching" && allMatchingMeta) {
      const suffix = allMatchingMeta.search ? `, matching "${allMatchingMeta.search}"` : ""
      return `All ${allMatchingMeta.total} active patients in ${allMatchingMeta.clinicName}${suffix} selected`
    }
    if (selectedGuids.length > 0) return `${selectedGuids.length} patients selected`
    return null
  }

  // ── Shared styles
  const infoBox = { backgroundColor: "#F9F7F4", border: "1px solid #EAE4DA" }
  const sectionLabel = { fontSize: "0.7rem", fontWeight: 600, letterSpacing: "0.07em", textTransform: "uppercase", color: "#6c757d", marginBottom: "0.75rem" }

  // ── Protocol options for react-select
  const protocolOptions = protocols.map(p => ({ value: p.guid, label: p.name, protocol: p }))
  const selectedProtocolOption = selectedProtocol ? { value: selectedProtocol.guid, label: selectedProtocol.name } : null
  const signature = selectedProtocol ? buildTreatmentSignature(selectedProtocol.interventions) : ""

  // ─────────────────────────────────────────────────────────────────────────────

  return (
    <React.Fragment>
      <div className="page-content" style={{ paddingBottom: canConfirm && !success ? 80 : undefined }}>
        <Container fluid>
          <Breadcrumbs title={props.t("Treatment Management")} breadcrumbItem={props.t("Treatment Assignment")} />

          {/* ── Success screen ─────────────────────────────────────────────── */}
          {success ? (
            <Card>
              <CardBody className="text-center py-5">
                <div style={{ width: 64, height: 64, borderRadius: "50%", backgroundColor: action === "remove" ? "#f8d7da" : "#E0FFC2", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 16px", fontSize: 28 }}>✓</div>
                <h5 style={{ color: "#57072F" }}>{action === "assign" ? props.t("Assignment complete") : props.t("Treatments removed")}</h5>
                <p className="text-muted mb-4">
                  {action === "assign" ? (
                    <><strong>{selectedProtocol?.name}</strong> {props.t("has been assigned to")} <strong>{successCount}</strong> {props.t("patients")}.</>
                  ) : (
                    <>{props.t("Active treatment has been removed from")} <strong>{successCount}</strong> {props.t("patients")}.</>
                  )}
                </p>
                <div className="d-flex gap-2 justify-content-center">
                  <Button color="primary" onClick={handleReset}>{props.t("Start Another Assignment")}</Button>
                  <Button color="secondary" outline onClick={() => navigate("/patients")}>{props.t("View Patients")} →</Button>
                </div>
              </CardBody>
            </Card>
          ) : (
            <Card>
              <CardBody>

                {/* ── Section 1: Clinic ──────────────────────────────────── */}
                <p style={sectionLabel}>{props.t("Clinic")}</p>
                <div style={{ maxWidth: 360 }}>
                  <Select
                    options={clinics.map(c => ({ value: c.guid, label: c.name, clinic: c }))}
                    value={selectedClinic ? { value: selectedClinic.guid, label: selectedClinic.name } : null}
                    onChange={opt => handleClinicChange(opt?.clinic ?? null)}
                    placeholder={props.t("Search for a clinic...")}
                    isClearable
                    styles={selectStyles}
                    noOptionsMessage={() => props.t("No clinics found")}
                    menuPortalTarget={document.body}
                    menuPosition="fixed"
                  />
                </div>

                {/* ── No clinic selected — empty state ─────────────────── */}
                {!selectedClinic && (
                  <div className="text-center py-5">
                    <i className="bx bx-building" style={{ fontSize: 36, display: "block", marginBottom: 12, color: "#EAE4DA" }} />
                    <p className="fw-semibold mb-1" style={{ color: "#57072F" }}>
                      {props.t("Select a clinic to manage treatment assignment")}
                    </p>
                    <p className="small mb-0" style={{ color: "#AC8599" }}>
                      {props.t("Search for a clinic above to load its patients and available treatment protocols.")}
                    </p>
                  </div>
                )}

                {/* ── Section 2: Patients ────────────────────────────────── */}
                {selectedClinic && (
                  <>
                    <hr style={{ borderColor: "#EAE4DA", margin: "1.5rem 0" }} />

                    {/* Header row */}
                    <div className="d-flex align-items-center justify-content-between mb-3">
                      <div className="d-flex align-items-center gap-2">
                        <p style={{ ...sectionLabel, marginBottom: 0 }}>{props.t("Patients")}</p>
                        {selectionLabel() && (
                          <Badge style={{ backgroundColor: "#57072F", fontSize: "0.7rem" }}>{selectionLabel()}</Badge>
                        )}
                        {selectedGuids.length > 0 && (
                          <button className="btn btn-link btn-sm p-0 text-muted small" onClick={clearSelection}>{props.t("Clear selection")}</button>
                        )}
                      </div>
                      <div className="d-flex gap-2">
                        <button className={`btn btn-sm ${inputMode === "manual" ? "btn-primary" : "btn-outline-secondary"}`} onClick={() => { setInputMode("manual"); handleClearCsv() }}>
                          <i className="bx bx-list-ul me-1" />{props.t("Select Manually")}
                        </button>
                        <button className={`btn btn-sm ${inputMode === "csv" ? "btn-primary" : "btn-outline-secondary"}`} onClick={() => { setInputMode("csv"); clearSelection(); setSearchInput("") }}>
                          <i className="bx bx-upload me-1" />{props.t("Upload CSV")}
                        </button>
                      </div>
                    </div>

                    {/* ── Manual selection ──────────────────────────────── */}
                    {inputMode === "manual" && (
                      <>
                        {/* Search + count row */}
                        <Row className="mb-2 g-2 align-items-center">
                          <Col md={5}>
                            <Input
                              type="text"
                              placeholder={props.t("Search name or email...")}
                              value={searchInput}
                              onChange={e => setSearchInput(e.target.value)}
                            />
                          </Col>
                          <Col className="text-muted small d-flex align-items-center gap-2">
                            {loadingPatients && <span><Spinner size="sm" className="me-1" />Loading…</span>}
                            {!loadingPatients && activeSearch && totalPatients > 0 && (
                              <span>{totalPatients} matching patients</span>
                            )}
                            {!loadingPatients && activeSearch && totalPatients === 0 && (
                              <span>No matching patients</span>
                            )}
                          </Col>
                        </Row>

                        {/* "Select all matching" banner */}
                        {showSelectAllBanner && (
                          <div className="px-3 py-2 mb-2 rounded d-flex align-items-center justify-content-between" style={{ backgroundColor: "#FFF5F8", border: "1px solid #f5c0d0" }}>
                            <span className="small" style={{ color: "#57072F" }}>
                              All {activeLoadedPatients.length} patients on this page are selected.{" "}
                              <strong>Select all {totalPatients} patients in {selectedClinic.name}{activeSearch ? `, matching "${activeSearch}"` : ""}?</strong>
                            </span>
                            <button
                              className="btn btn-sm ms-3"
                              style={{ backgroundColor: "#57072F", color: "#fff", whiteSpace: "nowrap", flexShrink: 0 }}
                              onClick={handleSelectAllMatching}
                              disabled={loadingAllGuids}
                            >
                              {loadingAllGuids ? <Spinner size="sm" /> : `Select all active patients`}
                            </button>
                          </div>
                        )}

                        {/* Patient table */}
                        <div style={{ maxHeight: 400, overflowY: "auto" }}>
                          <Table responsive hover className="mb-0">
                            <thead style={{ ...infoBox, position: "sticky", top: 0 }}>
                              <tr>
                                <th style={{ width: 40 }}>
                                  <input
                                    type="checkbox"
                                    ref={el => { if (el) { el.indeterminate = somePageSelected && !allPageSelected } }}
                                    checked={allPageSelected}
                                    onChange={() => {}}
                                    onClick={e => { e.stopPropagation(); togglePageSelection() }}
                                    disabled={activeLoadedPatients.length === 0}
                                  />
                                </th>
                                <th>{props.t("Name")}</th>
                                <th>{props.t("Email")}</th>
                                <th>{props.t("Active Treatment")}</th>
                              </tr>
                            </thead>
                            <tbody>
                              {loadedPatients.length === 0 && !loadingPatients && (
                                <tr>
                                  <td colSpan={4} className="text-center text-muted py-4">
                                    {activeSearch ? props.t("No results match your search") : props.t("No patients found for this clinic")}
                                  </td>
                                </tr>
                              )}
                              {loadedPatients.map(p => {
                                const checked = selectedGuids.includes(p.guid)
                                const treatment = activeTreatmentName(p)
                                const isDisabled = p.disabled
                                return (
                                  <tr
                                    key={p.guid}
                                    style={{ cursor: isDisabled ? "default" : "pointer", backgroundColor: checked ? "#FFF5F8" : undefined, opacity: isDisabled ? 0.45 : 1 }}
                                    onClick={() => { if (!isDisabled) togglePatient(p.guid) }}
                                  >
                                    <td onClick={e => e.stopPropagation()}>
                                      <input
                                        type="checkbox"
                                        checked={checked}
                                        disabled={isDisabled}
                                        onChange={() => {}}
                                        onClick={e => { e.stopPropagation(); if (!isDisabled) togglePatient(p.guid) }}
                                      />
                                    </td>
                                    <td>
                                      {p.name}
                                      {isDisabled && <Badge className="ms-2" style={{ backgroundColor: "#F4F1EC", color: "#AC8599", fontSize: "0.65rem" }}>Disabled</Badge>}
                                    </td>
                                    <td className="text-muted small">{p.email}</td>
                                    <td>
                                      {treatment
                                        ? <span style={{ display: "inline-block", maxWidth: 300, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", backgroundColor: "#FFF5F8", border: "1px solid #EAE4DA", borderRadius: 4, padding: "2px 8px", fontSize: 12, fontWeight: 500, color: "#57072F", verticalAlign: "middle" }} title={treatment}>{treatment}</span>
                                        : <span className="text-muted small">{props.t("None")}</span>}
                                    </td>
                                  </tr>
                                )
                              })}
                            </tbody>
                          </Table>
                        </div>

                        {/* Pagination */}
                        {totalPatients > 0 && (
                          <div className="d-flex justify-content-between align-items-center mt-3">
                            <span className="text-muted small">
                              {totalPatients > 0
                                ? `Showing patients ${firstPatient}–${lastPatient} of ${totalPatients}`
                                : ""}
                            </span>
                            {totalPages > 1 && (
                              <Pagination size="sm" className="mb-0">
                                <PaginationItem disabled={page <= 1 || loadingPatients}>
                                  <PaginationLink previous onClick={() => setPage(p => Math.max(1, p - 1))} />
                                </PaginationItem>
                                <PaginationItem disabled>
                                  <PaginationLink style={{ color: "#57072F" }}>Page {page} of {totalPages}</PaginationLink>
                                </PaginationItem>
                                <PaginationItem disabled={page >= totalPages || loadingPatients}>
                                  <PaginationLink next onClick={() => setPage(p => Math.min(totalPages, p + 1))} />
                                </PaginationItem>
                              </Pagination>
                            )}
                          </div>
                        )}
                      </>
                    )}

                    {/* ── CSV upload ────────────────────────────────────── */}
                    {inputMode === "csv" && (
                      <>
                        {!csvFileName ? (
                          <div className="p-5 rounded text-center" style={{ border: "2px dashed #EAE4DA", backgroundColor: "#F9F7F4", cursor: "pointer" }} onClick={() => document.getElementById("csv-upload-input").click()}>
                            <i className="bx bx-cloud-upload" style={{ fontSize: 36, color: "#57072F" }} />
                            <p className="mb-1 fw-semibold mt-2">{props.t("Click to upload a CSV file")}</p>
                            <p className="text-muted small mb-0">{props.t("One patient email per row. First row can be a header.")}</p>
                            <input id="csv-upload-input" type="file" accept=".csv,text/csv" style={{ display: "none" }} onChange={handleCsvUpload} />
                          </div>
                        ) : (
                          <>
                            <div className="p-3 rounded mb-3 d-flex align-items-center justify-content-between" style={infoBox}>
                              <div>
                                <i className="bx bx-file me-2" style={{ color: "#57072F" }} />
                                <strong>{csvFileName}</strong>
                                <span className="text-muted small ms-2">{csvMatched.length} {props.t("matched")} · {csvUnmatched.length} {props.t("not found")}</span>
                              </div>
                              <button className="btn btn-link btn-sm p-0 text-danger" onClick={handleClearCsv}>{props.t("Remove")}</button>
                            </div>
                            {csvMatched.length > 0 && (
                              <div className="mb-3">
                                <p className="small fw-semibold mb-2" style={{ color: "#57072F" }}>
                                  <i className="bx bx-check-circle me-1" />{csvMatched.length} {props.t("patients matched")}
                                </p>
                                <p className="text-muted small mb-2">
                                  {props.t("Note: CSV matching is limited to patients loaded in the current session. Patients on unloaded pages may not be matched.")}
                                </p>
                                <div style={{ maxHeight: 240, overflowY: "auto" }}>
                                  <Table responsive size="sm" className="mb-0">
                                    <thead style={infoBox}>
                                      <tr><th>{props.t("Name")}</th><th>{props.t("Email")}</th><th>{props.t("Active Treatment")}</th></tr>
                                    </thead>
                                    <tbody>
                                      {csvMatched.map(p => {
                                        const treatment = activeTreatmentName(p)
                                        return (
                                          <tr key={p.guid}>
                                            <td>{p.name}</td>
                                            <td className="text-muted small">{p.email}</td>
                                            <td>{treatment ? <span style={{ display: "inline-block", maxWidth: 300, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", backgroundColor: "#FFF5F8", border: "1px solid #EAE4DA", borderRadius: 4, padding: "2px 8px", fontSize: 12, fontWeight: 500, color: "#57072F", verticalAlign: "middle" }} title={treatment}>{treatment}</span> : <span className="text-muted small">{props.t("None")}</span>}</td>
                                          </tr>
                                        )
                                      })}
                                    </tbody>
                                  </Table>
                                </div>
                              </div>
                            )}
                            {csvUnmatched.length > 0 && (
                              <div className="p-3 rounded" style={{ backgroundColor: "#fff4f4", border: "1px solid #f5c6cb" }}>
                                <p className="small fw-semibold mb-2" style={{ color: "#721c24" }}>
                                  <i className="bx bx-error-circle me-1" />{csvUnmatched.length} {props.t("emails not found")}
                                </p>
                                <div className="d-flex flex-wrap gap-1">
                                  {csvUnmatched.map(email => (
                                    <span key={email} className="px-2 py-1 rounded small" style={{ backgroundColor: "#f8d7da", color: "#721c24" }}>{email}</span>
                                  ))}
                                </div>
                                <p className="small text-muted mt-2 mb-0">{props.t("These will be skipped. The patient may exist on an unloaded page — use manual search to confirm.")}</p>
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
                          style={{ ...infoBox, border: action === "assign" ? "2px solid #57072F" : "1px solid #EAE4DA", cursor: "pointer" }}
                          onClick={() => { setAction("assign"); setSelectedProtocol(null) }}
                        >
                          <div className="d-flex align-items-center gap-2 mb-2">
                            <div style={{ width: 36, height: 36, borderRadius: "50%", backgroundColor: action === "assign" ? "#57072F" : "#EAE4DA", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                              <i className="bx bx-plus" style={{ color: action === "assign" ? "#fff" : "#57072F", fontSize: 18 }} />
                            </div>
                            <strong style={{ color: "#57072F" }}>{props.t("Assign to Protocol")}</strong>
                          </div>
                          <p className="text-muted small mb-0">{props.t("Enrol selected patients into a protocol. Any existing treatment is automatically replaced.")}</p>

                          {action === "assign" && (
                            <div className="mt-3" onClick={e => e.stopPropagation()}>
                              <Label className="small fw-semibold">{props.t("Select Protocol")}</Label>
                              <Select
                                options={protocolOptions}
                                value={selectedProtocolOption}
                                placeholder={props.t("— Choose a protocol —")}
                                onChange={opt => setSelectedProtocol(opt?.protocol ?? null)}
                                isClearable
                                styles={selectStyles}
                                menuPortalTarget={document.body}
                                menuPosition="fixed"
                              />
                              {signature && (
                                <p className="small text-muted mt-2 mb-0" style={{ fontStyle: "italic" }}>{signature}</p>
                              )}
                            </div>
                          )}
                        </div>
                      </Col>

                      {/* Remove card */}
                      <Col md={6}>
                        <div
                          className="p-3 rounded h-100"
                          style={{ ...infoBox, border: action === "remove" ? "2px solid #57072F" : "1px solid #EAE4DA", cursor: "pointer" }}
                          onClick={() => { setAction("remove"); setSelectedProtocol(null) }}
                        >
                          <div className="d-flex align-items-center gap-2 mb-2">
                            <div style={{ width: 36, height: 36, borderRadius: "50%", backgroundColor: action === "remove" ? "#57072F" : "#EAE4DA", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                              <i className="bx bx-x" style={{ color: action === "remove" ? "#fff" : "#57072F", fontSize: 18 }} />
                            </div>
                            <strong style={{ color: "#57072F" }}>{props.t("Remove Treatment")}</strong>
                          </div>
                          <p className="text-muted small mb-0">{props.t("Remove the active treatment from selected patients without assigning a new one.")}</p>
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
        <div style={{ position: "fixed", bottom: 0, left: 0, right: 0, zIndex: 1040, backgroundColor: "#57072F", color: "#fff", padding: "14px 24px", display: "flex", alignItems: "center", justifyContent: "space-between", boxShadow: "0 -2px 16px rgba(0,0,0,0.2)" }}>
          <div className="small">
            {action === "assign" ? (
              <>
                <span style={{ opacity: 0.7 }}>{props.t("Assign")}</span> <strong>{selectedProtocol?.name}</strong>{" "}
                <span style={{ opacity: 0.7 }}>{props.t("to")}</span> <strong>{selectedGuids.length} {props.t("patients")}</strong>
                {selectionMode === "all-matching" && <span style={{ opacity: 0.6, marginLeft: 8 }}>· all matching {selectedClinic?.name}</span>}
                {selectionMode !== "all-matching" && replacingCount > 0 && (
                  <span style={{ opacity: 0.6, marginLeft: 8 }}>· {replacingCount} will have existing treatment replaced</span>
                )}
              </>
            ) : (
              <>
                <span style={{ opacity: 0.7 }}>{props.t("Remove treatment from")}</span> <strong>{selectedGuids.length} {props.t("patients")}</strong>
              </>
            )}
          </div>
          <Button style={{ backgroundColor: "#E0FFC2", color: "#57072F", border: "none", fontWeight: 600, flexShrink: 0 }} onClick={() => setConfirmModal(true)}>
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
          {/* Patient count summary */}
          <div className="p-3 rounded mb-3" style={infoBox}>
            <Row className="g-2">
              <Col sm={6}>
                <p className="mb-1 small text-muted text-uppercase" style={{ letterSpacing: "0.05em" }}>{props.t("Clinic")}</p>
                <p className="mb-0 fw-semibold">{selectedClinic?.name}</p>
              </Col>
              <Col sm={6}>
                <p className="mb-1 small text-muted text-uppercase" style={{ letterSpacing: "0.05em" }}>{props.t("Patients")}</p>
                {selectionMode === "all-matching" && allMatchingMeta ? (
                  <div>
                    <p className="mb-0 fw-semibold">All {allMatchingMeta.total} active patients{allMatchingMeta.search ? `, matching "${allMatchingMeta.search}"` : ""}</p>
                    <p className="mb-0 small text-muted">{allMatchingMeta.activeTreatmentCount} with active treatment · {allMatchingMeta.noTreatmentCount} with none{allMatchingMeta.disabledCount > 0 ? ` · ${allMatchingMeta.disabledCount} disabled (not included)` : ""}</p>
                  </div>
                ) : (
                  <p className="mb-0 fw-semibold">{selectedGuids.length}</p>
                )}
              </Col>
              {action === "assign" && (
                <Col sm={12}>
                  <p className="mb-1 small text-muted text-uppercase" style={{ letterSpacing: "0.05em" }}>{props.t("Protocol")}</p>
                  <p className="mb-0 fw-semibold">{selectedProtocol?.name}</p>
                  {signature && <p className="mb-0 small text-muted" style={{ fontStyle: "italic" }}>{signature}</p>}
                </Col>
              )}
            </Row>
          </div>

          {/* Replacement warning */}
          {action === "assign" && selectionMode === "all-matching" && allMatchingMeta?.activeTreatmentCount > 0 && (
            <Alert color="warning" className="mb-3">
              <i className="bx bx-info-circle me-1" />
              <strong>{allMatchingMeta.activeTreatmentCount}</strong> {props.t("patients already have an active treatment — it will be replaced.")}
            </Alert>
          )}
          {action === "assign" && selectionMode !== "all-matching" && replacingCount > 0 && (
            <Alert color="warning" className="mb-3">
              <i className="bx bx-info-circle me-1" />
              {replacingUnknown > 0
                ? <><strong>At least {replacingCount}</strong> {props.t("patients already have an active treatment — it will be replaced.")} {replacingUnknown} {props.t("patients on unloaded pages are not reflected in this count.")}</>
                : <><strong>{replacingCount}</strong> {props.t("patients already have an active treatment — it will be replaced.")}</>}
            </Alert>
          )}

          {/* All-matching scope note */}
          {selectionMode === "all-matching" && (
            <Alert color="info" className="mb-3">
              <i className="bx bx-globe me-1" />
              {props.t("This applies to all patients matching the current filter, not only those visible on screen.")}
            </Alert>
          )}

          {error && <Alert color="danger">{error}</Alert>}
          <p className="text-muted small mb-0">{props.t("This action cannot be undone.")}</p>
        </ModalBody>
        <ModalFooter>
          <Button color="light" onClick={() => setConfirmModal(false)} disabled={submitting}>{props.t("Cancel")}</Button>
          <Button color={action === "remove" ? "danger" : "primary"} onClick={handleConfirm} disabled={submitting}>
            {submitting ? props.t("Processing...") : props.t("Confirm")}
          </Button>
        </ModalFooter>
      </Modal>

    </React.Fragment>
  )
}

TreatmentAssignment.propTypes = { t: PropTypes.any }

export default withTranslation()(TreatmentAssignment)
