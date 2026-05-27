import React, { useState, useEffect, useMemo, useRef } from "react";
import { Link } from "react-router-dom";
import {
  Input,
  Button,
  Badge,
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Spinner,
} from "reactstrap";
import { pdf } from "@react-pdf/renderer";
import {
  getMyClinics,
  getMyPatients,
  getPatientStimulations,
  updatePatientStimulation,
  removePatientStimulation,
} from "../../../api/clinician";
import { formatDate } from "../../../util/time";
import GateTablePaginated from "../components/TablePaginated";
import AddUsersSidebar from "../components/AddUsersSidebar";
import ExportModal from "../components/ExportModal";
import PatientsPdfDocument from "../components/PatientsPdfDocument";
import EditStimulationsModal from "../components/EditStimulationsModal";

const Patients = () => {
  const [clinics, setClinics] = useState([]);
  const [selectedClinicId, setSelectedClinicId] = useState("");
  const [patients, setPatients] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isPatientsLoading, setIsPatientsLoading] = useState(true);
  const [error, setError] = useState(null);

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [searchTerm, setSearchTerm] = useState("");
  const [paginationData, setPaginationData] = useState(null);

  // Expanded rows state
  const [expandedRows, setExpandedRows] = useState({});

  // Password visibility per patient row
  const [visiblePasswords, setVisiblePasswords] = useState({});

  // Stimulations cache per patient guid: { [guid]: { loading, data, error } }
  const [stimulationsCache, setStimulationsCache] = useState({});

  // Sidebar state
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  // Export Modal state
  const [isExportModalOpen, setIsExportModalOpen] = useState(false);
  const [isExporting, setIsExporting] = useState(false);

  // Edit Stimulations Modal state
  const [isEditStimsOpen, setIsEditStimsOpen] = useState(false);
  const [editContext, setEditContext] = useState(null); // { patient, treatmentGuid, currentStimulations }

  // Stim action state
  const [stimActionMenu, setStimActionMenu] = useState(null); // { guid, x, y }
  const [stimConfirm, setStimConfirm] = useState(null); // { type: 'disable'|'enable'|'delete', stim, patientGuid }
  const [isStimActionLoading, setIsStimActionLoading] = useState(false);
  const menuRef = useRef(null);

  // Default stimulations shown as fallback when patient has no active treatment
  const DEFAULT_STIMULATIONS = [
    {
      guid: "default-1",
      title: "Left [Standard]",
      anode: "left",
      cathode: "right",
      current: "1.2 mA",
      duration: "30 min",
    },
    {
      guid: "default-2",
      title: "Right [Standard]",
      anode: "right",
      cathode: "left",
      current: "1.2 mA",
      duration: "30 min",
    },
    {
      guid: "default-3",
      title: "Left [Alternative]",
      anode: "left",
      cathode: "back",
      current: "1.2 mA",
      duration: "30 min",
    },
    {
      guid: "default-4",
      title: "Right [Alternative]",
      anode: "right",
      cathode: "back",
      current: "1.2 mA",
      duration: "30 min",
    },
  ];

  // Fetch clinics on mount
  useEffect(() => {
    const fetchClinics = async () => {
      try {
        setIsLoading(true);
        const res = await getMyClinics();
        const clinicData = res?.data || res || [];
        setClinics(clinicData);
        if (clinicData.length > 0) {
          setSelectedClinicId(clinicData[0].guid);
        }
      } catch (err) {
        console.error("Error fetching clinics:", err);
        setError("Failed to load clinics.");
      } finally {
        setIsLoading(false);
      }
    };
    fetchClinics();
  }, []);

  // Fetch patients when clinic, page, pageSize, or search changes
  useEffect(() => {
    const fetchPatients = async () => {
      if (!selectedClinicId) return;

      try {
        setIsPatientsLoading(true);
        const response = await getMyPatients(currentPage, pageSize, searchTerm);
        const patientsData = response?.data || [];
        const pagination = response?.pagination || null;

        setPatients(patientsData);
        setPaginationData(pagination);
        setError(null);
      } catch (err) {
        console.error("Error fetching patients:", err);
        setError("Failed to load patients.");
        setPatients([]);
      } finally {
        setIsPatientsLoading(false);
      }
    };

    fetchPatients();
  }, [selectedClinicId, currentPage, pageSize, searchTerm]);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setStimActionMenu(null);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleClinicChange = (e) => {
    setSelectedClinicId(e.target.value);
    setCurrentPage(1);
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const handlePageSizeChange = (size) => {
    setPageSize(size);
    setCurrentPage(1);
  };

  const handleSearchSubmit = (value) => {
    setSearchTerm(value);
    setCurrentPage(1);
  };

  const togglePasswordVisibility = (patientGuid) => {
    setVisiblePasswords((prev) => ({
      ...prev,
      [patientGuid]: !prev[patientGuid],
    }));
  };

  const toggleRowExpanded = async (patientGuid, forceRefresh = false) => {
    const isCurrentlyExpanded = !!expandedRows[patientGuid];
    const willBeExpanded = forceRefresh ? true : !isCurrentlyExpanded;

    setExpandedRows((prev) => ({
      ...prev,
      [patientGuid]: willBeExpanded,
    }));

    // Fetch when: opening for first time, or explicit forceRefresh
    const shouldFetch =
      willBeExpanded && (forceRefresh || !stimulationsCache[patientGuid]);
    if (shouldFetch) {
      setStimulationsCache((prev) => ({
        ...prev,
        [patientGuid]: { loading: true, data: null, error: null },
      }));
      try {
        const result = await getPatientStimulations(patientGuid);
        setStimulationsCache((prev) => ({
          ...prev,
          [patientGuid]: { loading: false, data: result, error: null },
        }));
      } catch (err) {
        setStimulationsCache((prev) => ({
          ...prev,
          [patientGuid]: {
            loading: false,
            data: null,
            error: "Failed to load stimulations.",
          },
        }));
      }
    }
  };

  const toggleEditStims = () => setIsEditStimsOpen(!isEditStimsOpen);

  const handleEditStimulations = (patient, treatmentGuid, stims) => {
    setEditContext({ patient, treatmentGuid, currentStimulations: stims });
    setIsEditStimsOpen(true);
  };

  const handleEditStimsSuccess = async () => {
    const patientGuid = editContext?.patient?.guid;
    if (!patientGuid) return;

    // Always re-fetch the patient list so active_stimulations_count badge is updated
    try {
      const response = await getMyPatients(currentPage, pageSize, searchTerm);
      setPatients(response?.data || []);
      setPaginationData(response?.pagination || null);
    } catch (err) {
      console.error(
        "Error refreshing patients after stimulations update:",
        err,
      );
    }

    // Always force-refresh the expanded row cache
    toggleRowExpanded(patientGuid, true);
  };

  // Função para buscar todos os pacientes (com ou sem filtro)
  const fetchAllPatientsForExport = async () => {
    try {
      setIsExporting(true);

      let allPatients = [];
      let currentPageFetch = 1;
      const limitPerPage = 1000; // Limite máximo permitido pelo backend
      let hasMorePages = true;

      while (hasMorePages) {
        const response = await getMyPatients(
          currentPageFetch,
          limitPerPage,
          searchTerm || undefined,
        );
        const patientsData = response?.data || [];
        const pagination = response?.pagination || null;

        allPatients = [...allPatients, ...patientsData];

        // Verificar se há mais páginas
        if (pagination && currentPageFetch < pagination.totalPages) {
          currentPageFetch++;
        } else {
          hasMorePages = false;
        }
      }

      return allPatients;
    } catch (error) {
      console.error("Error fetching all patients for export:", error);
      throw error;
    } finally {
      setIsExporting(false);
    }
  };

  const handleExportCsv = async () => {
    try {
      const allPatients = await fetchAllPatientsForExport();

      if (!allPatients || allPatients.length === 0) {
        alert("No patients to export.");
        return;
      }

      const rows = allPatients.map((patient) => {
        const activeTreatment = patient.patient_treatments?.find(
          (t) => !t.disabled,
        );
        const activeStimulations =
          activeTreatment?.intervention_treatment_tes?.length ?? 0;
        const mobilePassword =
          patient.patient_mobile_accesses?.[0]?.credential || "";

        return {
          Name: patient.name || "",
          Email: patient.email || "",
          "Mobile Password": mobilePassword,
          "Active Stimulations": activeStimulations,
          "Active Treatment": activeTreatment ? "Yes" : "No",
          "Created At": patient.createdAt ? formatDate(patient.createdAt) : "",
          "Updated At": patient.updatedAt ? formatDate(patient.updatedAt) : "",
          Status: patient.disabled === false ? "Active" : "Inactive",
        };
      });

      const headers = Object.keys(rows[0])
        .map((k) => `"${k}"`)
        .join(",");
      const body = rows
        .map((r) =>
          Object.values(r)
            .map((v) => `"${v}"`)
            .join(","),
        )
        .join("\n");

      const csvBlob = new Blob([`${headers}\n${body}`], { type: "text/csv" });
      const a = document.createElement("a");
      a.href = URL.createObjectURL(csvBlob);
      const filterSuffix = searchTerm ? "_filtered" : "";
      a.download = `patients${filterSuffix}_${new Date().toISOString().split("T")[0]}.csv`;
      a.click();

      setIsExportModalOpen(false);
    } catch (error) {
      console.error("Error exporting CSV:", error);
      alert("Error exporting CSV. Please try again.");
    }
  };

  const handleExportPdf = async () => {
    try {
      const allPatients = await fetchAllPatientsForExport();

      if (!allPatients || allPatients.length === 0) {
        alert("No patients to export.");
        return;
      }

      // Obter a clínica selecionada
      const selectedClinic = clinics.find((c) => c.guid === selectedClinicId);
      const clinicName = selectedClinic?.name || "Clinic";

      // Gerar o documento PDF usando @react-pdf/renderer
      const blob = await pdf(
        <PatientsPdfDocument
          patients={allPatients}
          clinicName={clinicName}
          totalPatients={allPatients.length}
          isFiltered={!!searchTerm}
          filterTerm={searchTerm}
        />,
      ).toBlob();

      // Criar link de download
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      const filterSuffix = searchTerm ? "_filtered" : "";
      link.download = `patients_${clinicName.replace(/\s+/g, "_")}${filterSuffix}_${new Date().toISOString().split("T")[0]}.pdf`;
      link.click();

      // Limpar URL
      URL.revokeObjectURL(url);

      setIsExportModalOpen(false);
    } catch (error) {
      console.error("Error generating PDF:", error);
      alert("Error generating PDF. Please try again or use CSV export.");
    }
  };

  const toggleExportModal = () => {
    setIsExportModalOpen(!isExportModalOpen);
  };

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  // Called by AddUsersSidebar after all patients are created successfully
  const handleAddUsersSuccess = async () => {
    try {
      const response = await getMyPatients(currentPage, pageSize, searchTerm);
      setPatients(response?.data || []);
      setPaginationData(response?.pagination || null);
    } catch (err) {
      console.error("Error refreshing patients after creation:", err);
    }
  };

  const openStimActionMenu = (e, stim, patientGuid) => {
    e.stopPropagation();
    const rect = e.currentTarget.getBoundingClientRect();
    setStimActionMenu({ stim, patientGuid, x: rect.right, y: rect.bottom });
  };

  const openConfirm = (type) => {
    setStimConfirm({
      type,
      stim: stimActionMenu.stim,
      patientGuid: stimActionMenu.patientGuid,
    });
    setStimActionMenu(null);
  };

  const closeConfirm = () => {
    if (!isStimActionLoading) setStimConfirm(null);
  };

  const handleStimAction = async () => {
    if (!stimConfirm) return;
    const { type, stim, patientGuid } = stimConfirm;
    setIsStimActionLoading(true);
    try {
      if (type === "delete") {
        await removePatientStimulation(stim.guid);
      } else {
        await updatePatientStimulation(stim.guid, {
          disabled: type === "disable",
        });
      }
      setStimConfirm(null);
      // Refresh patients list (badge count) + expanded row
      const response = await getMyPatients(currentPage, pageSize, searchTerm);
      setPatients(response?.data || []);
      setPaginationData(response?.pagination || null);
      toggleRowExpanded(patientGuid, true);
    } catch (err) {
      console.error("Error performing stim action:", err);
    } finally {
      setIsStimActionLoading(false);
    }
  };

  // Define Table Columns
  const columns = useMemo(
    () => [
      {
        Header: "User Name",
        accessor: "email",
        Cell: ({ value }) => (
          <span
            style={{ color: "var(--gate-text-secondary)", fontSize: "0.9rem" }}
          >
            {value || "—"}
          </span>
        ),
      },
      {
        Header: "Password",
        accessor: "patient_mobile_accesses",
        Cell: ({ row }) => {
          const rowKey = row.guid || row.id;
          const password = row.patient_mobile_accesses?.[0]?.credential || "";
          const isVisible = !!visiblePasswords[rowKey];
          const maskedPassword = ".".repeat(Math.max(password.length, 8));

          return (
            <div className="d-flex align-items-center gap-2">
              <span
                style={{
                  fontFamily: "monospace",
                  fontSize: "0.9rem",
                  color: "var(--gate-text-secondary)",
                  minWidth: "88px",
                }}
              >
                {password ? (isVisible ? password : maskedPassword) : "—"}
              </span>

              {password ? (
                <Button
                  color="link"
                  size="sm"
                  className="p-0 text-muted"
                  onClick={() => togglePasswordVisibility(rowKey)}
                  title={isVisible ? "Hide password" : "Show password"}
                  aria-label={isVisible ? "Hide password" : "Show password"}
                >
                  <i
                    className={`mdi ${isVisible ? "mdi-eye-off-outline" : "mdi-eye-outline"}`}
                    style={{ fontSize: "1.1rem" }}
                  />
                </Button>
              ) : null}
            </div>
          );
        },
      },
      {
        Header: "Created At",
        accessor: "createdAt",
        Cell: ({ value }) => (
          <span
            style={{
              fontSize: "0.875rem",
              color: "var(--gate-text-secondary)",
            }}
          >
            {value ? formatDate(value) : "—"}
          </span>
        ),
      },
      {
        Header: "Updated At",
        accessor: "updatedAt",
        Cell: ({ value }) => (
          <span
            style={{
              fontSize: "0.875rem",
              color: "var(--gate-text-secondary)",
            }}
          >
            {value ? formatDate(value) : "—"}
          </span>
        ),
      },
      {
        Header: "User Stimulations",
        accessor: "stimulations",
        Cell: ({ row }) => {
          const stimulationsCount = row.active_stimulations_count ?? 0;
          const hasActiveTreatment = row.patient_treatments?.some(
            (t) => !t.disabled,
          );
          const rowKey = row.guid || row.id;
          const isExpanded = expandedRows[rowKey];

          return (
            <div>
              <Button
                color="light"
                size="sm"
                onClick={() => toggleRowExpanded(rowKey)}
                className="d-flex align-items-center gap-2 px-3 py-1"
                style={{
                  borderRadius: "6px",
                  fontSize: "0.85rem",
                  border: "1px solid var(--gate-border)",
                }}
              >
                <Badge
                  color={hasActiveTreatment ? "primary" : "secondary"}
                  pill
                >
                  {stimulationsCount}
                </Badge>
                <span>active</span>
                <i
                  className={`mdi mdi-chevron-${isExpanded ? "up" : "down"}`}
                  style={{ fontSize: "1rem" }}
                />
              </Button>
            </div>
          );
        },
      },
    ],
    [expandedRows, visiblePasswords],
  );

  return (
    <div className="fade-in" style={{ animation: "fadeIn 0.3s ease-in-out" }}>
      {(isLoading || isPatientsLoading) && (
        <div className="gate-top-loading-bar"></div>
      )}

      {/* Header & Controls */}
      <div className="d-flex align-items-center justify-content-between mb-4 flex-wrap gap-3">
        <div>
          <h2
            className="m-0 font-weight-bold gate-text-primary"
            style={{ fontSize: "1.75rem", fontWeight: 700 }}
          >
            Patients & Usage
          </h2>
          <p className="text-muted m-0">
            Monitor patient activity and treatment usage.
          </p>
        </div>

        <div className="d-flex gap-2 align-items-center">
          {/* Add Users Button */}
          <Button
            color="primary"
            onClick={toggleSidebar}
            className="d-flex align-items-center gap-2 rounded-pill px-4 gate-btn-gradient-primary"
          >
            <i className="mdi mdi-account-plus-outline" />
            Add Users
          </Button>

          <Input
            type="select"
            value={selectedClinicId}
            onChange={handleClinicChange}
            className="form-select hidden"
            style={{
              width: "350px",
              borderRadius: "8px",
              borderColor: "var(--gate-border)",
            }}
          >
            {clinics.map((clinic) => (
              <option key={clinic.guid} value={clinic.guid}>
                {clinic.name}
              </option>
            ))}
          </Input>
        </div>
      </div>

      {error && patients.length === 0 ? (
        <div className="alert alert-danger">{error}</div>
      ) : (
        <GateTablePaginated
          columns={columns}
          data={patients}
          isLoading={isPatientsLoading}
          onExport={toggleExportModal}
          currentPage={currentPage}
          totalPages={paginationData?.totalPages || 1}
          totalRecords={paginationData?.total || 0}
          pageSize={pageSize}
          onPageChange={handlePageChange}
          onPageSizeChange={handlePageSizeChange}
          searchValue={searchTerm}
          onSearchSubmit={handleSearchSubmit}
          searchPlaceholder="Search by name or email..."
          expandedRows={expandedRows}
          renderExpandedRow={(row) => {
            const activeTreatments =
              row.patient_treatments?.filter((t) => !t.disabled) || [];
            const rowKey = row.guid || row.id;
            const cached = stimulationsCache[rowKey];

            if (activeTreatments.length === 0) {
              return (
                <div
                  className="p-4"
                  style={{
                    backgroundColor: "rgba(248, 249, 250, 0.5)",
                    borderTop: "1px solid #eee",
                    borderBottom: "1px solid #eee",
                  }}
                >
                  {/* Treatment Header Info */}
                  <div className="d-flex justify-content-between align-items-center mb-4">
                    <div className="d-flex align-items-center gap-3">
                      <div
                        className="rounded-circle d-flex align-items-center justify-content-center"
                        style={{
                          width: "42px",
                          height: "42px",
                          backgroundColor: "var(--gate-primary-light)",
                          color: "var(--gate-primary)",
                        }}
                      >
                        <i
                          className="mdi mdi-pulse"
                          style={{ fontSize: "1.2rem" }}
                        />
                      </div>
                      <div>
                        <h6
                          className="mb-0 fw-bold"
                          style={{ color: "var(--gate-text-primary)" }}
                        >
                          Active Treatment Details
                        </h6>
                        <div className="text-muted small d-flex gap-3">
                          <span>
                            <i className="mdi mdi-calendar-play-outline me-1" />
                            Started: N/A
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="d-flex gap-2">
                      <Button
                        color="primary"
                        size="sm"
                        className="rounded-pill px-4 shadow-sm gate-btn-primary"
                        onClick={() =>
                          handleEditStimulations(
                            row,
                            "default",
                            DEFAULT_STIMULATIONS,
                          )
                        }
                      >
                        <i className="mdi mdi-pencil-outline me-1" /> Edit
                        Treatment
                      </Button>
                    </div>
                  </div>

                  <div className="bg-white rounded-3 border shadow-sm overflow-hidden">
                    <div className="table-responsive">
                      <table
                        className="table table-hover align-middle mb-0"
                        style={{ fontSize: "0.85rem" }}
                      >
                        <thead className="bg-light">
                          <tr>
                            <th className="ps-4" style={{ width: "80px" }}>
                              Status
                            </th>
                            <th>Protocol Title</th>
                            <th
                              className="text-center"
                              style={{ width: "100px" }}
                            >
                              Montage
                            </th>
                            <th
                              className="text-center"
                              style={{ width: "100px" }}
                            >
                              Current
                            </th>
                            <th
                              className="text-center"
                              style={{ width: "100px" }}
                            >
                              Duration
                            </th>
                            <th
                              className="pe-4 text-end"
                              style={{ width: "50px" }}
                            ></th>
                          </tr>
                        </thead>
                        <tbody>
                          {DEFAULT_STIMULATIONS.map((stim) => (
                            <tr key={stim.guid}>
                              <td className="ps-4">
                                <Badge
                                  color="light"
                                  className="text-muted border"
                                >
                                  Default
                                </Badge>
                              </td>
                              <td>
                                <div className="fw-medium text-dark">
                                  {stim.title}
                                </div>
                              </td>
                              <td className="text-center">
                                <div className="d-flex justify-content-center gap-1">
                                  <Badge
                                    color="light"
                                    className="text-dark border px-2"
                                  >
                                    {stim.anode}
                                  </Badge>
                                  <span className="text-muted">→</span>
                                  <Badge
                                    color="light"
                                    className="text-dark border px-2"
                                  >
                                    {stim.cathode}
                                  </Badge>
                                </div>
                              </td>
                              <td className="text-center fw-bold text-primary">
                                {stim.current}
                              </td>
                              <td className="text-center">{stim.duration}</td>
                              <td className="pe-4 text-end">
                                <Button
                                  color="link"
                                  size="sm"
                                  className="p-0 text-muted gate-btn-hover-danger"
                                >
                                  <i
                                    className="mdi mdi-dots-vertical"
                                    style={{ fontSize: "1.1rem" }}
                                  />
                                </Button>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              );
            }

            // Loading skeleton
            if (!cached || cached.loading) {
              return (
                <div className="p-3" style={{ backgroundColor: "#F9F7F4" }}>
                  <div
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      gap: "8px",
                    }}
                  >
                    <div
                      className="gate-skeleton"
                      style={{ height: "36px", borderRadius: "6px" }}
                    />
                    <div
                      className="gate-skeleton"
                      style={{ height: "36px", borderRadius: "6px" }}
                    />
                    <div
                      className="gate-skeleton"
                      style={{ height: "36px", borderRadius: "6px" }}
                    />
                  </div>
                </div>
              );
            }

            // Error state
            if (cached.error) {
              return (
                <div className="p-4 text-center" style={{ color: "#e63946" }}>
                  <i className="mdi mdi-alert-circle-outline me-2" />
                  {cached.error}
                </div>
              );
            }

            const treatment = cached.data?.treatment || {};
            const stimulations = cached.data?.stimulations || [];

            return (
              <div
                className="p-4"
                style={{
                  backgroundColor: "rgba(248, 249, 250, 0.5)",
                  borderTop: "1px solid #eee",
                  borderBottom: "1px solid #eee",
                }}
              >
                {/* Treatment Header Info */}
                <div className="d-flex justify-content-between align-items-center mb-4">
                  <div className="d-flex align-items-center gap-3">
                    <div
                      className="rounded-circle d-flex align-items-center justify-content-center"
                      style={{
                        width: "42px",
                        height: "42px",
                        backgroundColor: "var(--gate-primary-light)",
                        color: "var(--gate-primary)",
                      }}
                    >
                      <i
                        className="mdi mdi-pulse"
                        style={{ fontSize: "1.2rem" }}
                      />
                    </div>
                    <div>
                      <h6
                        className="mb-0 fw-bold"
                        style={{ color: "var(--gate-text-primary)" }}
                      >
                        Active Treatment Details
                      </h6>
                      <div className="text-muted small d-flex gap-3">
                        <span>
                          <i className="mdi mdi-calendar-play-outline me-1" />
                          Started:{" "}
                          {treatment.started_at
                            ? formatDate(treatment.started_at)
                            : "N/A"}
                        </span>
                        {treatment.research_treatment ? (
                          <Badge color="info" className="rounded-pill px-2">
                            Research Mode
                          </Badge>
                        ) : null}
                      </div>
                    </div>
                  </div>

                  <div className="d-flex gap-2">
                    <Button
                      color="primary"
                      size="sm"
                      className="rounded-pill px-4 shadow-sm gate-btn-primary"
                      onClick={() =>
                        handleEditStimulations(
                          row,
                          treatment.guid,
                          stimulations,
                        )
                      }
                    >
                      <i className="mdi mdi-pencil-outline me-1" /> Edit
                      Treatment
                    </Button>
                  </div>
                </div>

                {stimulations.length === 0 ? (
                  <div className="py-4 text-center text-muted border rounded-3 bg-white">
                    <i
                      className="mdi mdi-flask-empty-outline d-block mb-2"
                      style={{ fontSize: "2rem" }}
                    />
                    No stimulations found for this treatment.
                  </div>
                ) : (
                  <div className="bg-white rounded-3 border shadow-sm overflow-hidden">
                    <div className="table-responsive">
                      <table
                        className="table table-hover align-middle mb-0"
                        style={{ fontSize: "0.85rem" }}
                      >
                        <thead className="bg-light">
                          <tr>
                            <th className="ps-4" style={{ width: "80px" }}>
                              Status
                            </th>
                            <th>Protocol Title</th>
                            <th
                              className="text-center"
                              style={{ width: "100px" }}
                            >
                              Montage
                            </th>
                            <th
                              className="text-center"
                              style={{ width: "100px" }}
                            >
                              Current
                            </th>
                            <th
                              className="text-center"
                              style={{ width: "100px" }}
                            >
                              Duration
                            </th>
                            <th
                              className="text-center"
                              style={{ width: "120px" }}
                            >
                              Control
                            </th>
                            <th
                              className="pe-4 text-end"
                              style={{ width: "50px" }}
                            ></th>
                          </tr>
                        </thead>
                        <tbody>
                          {stimulations.map((stim) => {
                            const tes = stim.tes_stimulation || {};
                            const params =
                              tes.tes_stimulations_tdcs_parameters?.[0]
                                ?.tdcs_parameter || {};
                            const isActive = stim.disabled === false;

                            const currentMA =
                              params.current != null
                                ? (params.current / 100).toFixed(1) + " mA"
                                : "—";
                            const durationMin =
                              params.duration != null
                                ? (params.duration / 60).toFixed(0) + " min"
                                : "—";

                            return (
                              <tr key={stim.guid}>
                                <td className="ps-4">
                                  <Badge
                                    color={isActive ? "success" : "light"}
                                    className={`rounded-pill px-2 ${isActive ? "bg-opacity-10 text-success" : "text-muted border"}`}
                                  >
                                    {isActive ? "Active" : "Disabled"}
                                  </Badge>
                                </td>
                                <td>
                                  <div className="fw-medium text-dark">
                                    {tes.title || "Untitle Protocol"}
                                  </div>
                                  <div
                                    className="text-muted smallest text-truncate"
                                    style={{ maxWidth: "250px" }}
                                  >
                                    {tes.short_description ||
                                      "No description provided"}
                                  </div>
                                </td>
                                <td className="text-center">
                                  <div className="d-flex justify-content-center gap-1">
                                    <Badge
                                      color="light"
                                      className="text-dark border px-2"
                                    >
                                      {params.anode || "?"}
                                    </Badge>
                                    <span className="text-muted">→</span>
                                    <Badge
                                      color="light"
                                      className="text-dark border px-2"
                                    >
                                      {params.cathode || "?"}
                                    </Badge>
                                  </div>
                                </td>
                                <td className="text-center fw-bold text-primary">
                                  {currentMA}
                                </td>
                                <td className="text-center">{durationMin}</td>
                                <td className="text-center">
                                  {stim.slider ? (
                                    <Badge
                                      color="info"
                                      className="bg-opacity-10 text-info border-info border-opacity-25 rounded-pill px-2"
                                    >
                                      <i className="mdi mdi-tune-variant me-1" />{" "}
                                      Slider
                                    </Badge>
                                  ) : (
                                    <span className="text-muted small">
                                      Fixed
                                    </span>
                                  )}
                                </td>
                                <td className="pe-4 text-end">
                                  <Button
                                    color="link"
                                    size="sm"
                                    className="p-0 text-muted gate-btn-hover-danger"
                                    onClick={(e) =>
                                      openStimActionMenu(e, stim, rowKey)
                                    }
                                  >
                                    <i
                                      className="mdi mdi-dots-vertical"
                                      style={{ fontSize: "1.1rem" }}
                                    />
                                  </Button>
                                </td>
                              </tr>
                            );
                          })}
                        </tbody>
                      </table>
                    </div>
                  </div>
                )}
              </div>
            );
          }}
        />
      )}

      {/* Stim Action Dropdown */}
      {stimActionMenu && (
        <div
          ref={menuRef}
          style={{
            position: "fixed",
            top: stimActionMenu.y + 4,
            left: stimActionMenu.x - 160,
            zIndex: 9999,
            background: "#fff",
            border: "1px solid var(--gate-border, #e2e8f0)",
            borderRadius: "8px",
            boxShadow: "0 8px 24px rgba(0,0,0,0.12)",
            minWidth: "160px",
            padding: "4px 0",
          }}
        >
          {stimActionMenu.stim.disabled === false ? (
            <button
              className="dropdown-item d-flex align-items-center gap-2 px-3 py-2"
              style={{
                fontSize: "0.875rem",
                color: "#f59e0b",
                border: "none",
                background: "none",
                width: "100%",
                textAlign: "left",
                cursor: "pointer",
              }}
              onClick={() => openConfirm("disable")}
            >
              <i
                className="mdi mdi-pause-circle-outline"
                style={{ fontSize: "1rem" }}
              />
              Disable
            </button>
          ) : (
            <button
              className="dropdown-item d-flex align-items-center gap-2 px-3 py-2"
              style={{
                fontSize: "0.875rem",
                color: "#22c55e",
                border: "none",
                background: "none",
                width: "100%",
                textAlign: "left",
                cursor: "pointer",
              }}
              onClick={() => openConfirm("enable")}
            >
              <i
                className="mdi mdi-play-circle-outline"
                style={{ fontSize: "1rem" }}
              />
              Enable
            </button>
          )}
          <div
            style={{
              height: "1px",
              background: "var(--gate-border, #e2e8f0)",
              margin: "4px 0",
            }}
          />
          <button
            className="dropdown-item d-flex align-items-center gap-2 px-3 py-2"
            style={{
              fontSize: "0.875rem",
              color: "#e63946",
              border: "none",
              background: "none",
              width: "100%",
              textAlign: "left",
              cursor: "pointer",
            }}
            onClick={() => openConfirm("delete")}
          >
            <i
              className="mdi mdi-trash-can-outline"
              style={{ fontSize: "1rem" }}
            />
            Delete
          </button>
        </div>
      )}

      {/* Stim Action Confirmation Modal */}
      <Modal isOpen={!!stimConfirm} toggle={closeConfirm} centered size="sm">
        <ModalHeader
          toggle={closeConfirm}
          style={{ borderBottom: "none", paddingBottom: 0 }}
        >
          {stimConfirm?.type === "delete" && "Delete Stimulation"}
          {stimConfirm?.type === "disable" && "Disable Stimulation"}
          {stimConfirm?.type === "enable" && "Enable Stimulation"}
        </ModalHeader>
        <ModalBody className="pt-2 pb-3">
          <div className="d-flex align-items-start gap-3">
            <div
              className="rounded-circle d-flex align-items-center justify-content-center flex-shrink-0"
              style={{
                width: "40px",
                height: "40px",
                backgroundColor:
                  stimConfirm?.type === "delete"
                    ? "#fee2e2"
                    : stimConfirm?.type === "disable"
                      ? "#fef3c7"
                      : "#dcfce7",
                color:
                  stimConfirm?.type === "delete"
                    ? "#e63946"
                    : stimConfirm?.type === "disable"
                      ? "#f59e0b"
                      : "#22c55e",
              }}
            >
              <i
                className={`mdi ${stimConfirm?.type === "delete" ? "mdi-trash-can-outline" : stimConfirm?.type === "disable" ? "mdi-pause-circle-outline" : "mdi-play-circle-outline"}`}
                style={{ fontSize: "1.2rem" }}
              />
            </div>
            <div>
              <p
                className="mb-1 fw-medium"
                style={{ color: "var(--gate-text-primary)" }}
              >
                {stimConfirm?.stim?.tes_stimulation?.title ||
                  "this stimulation"}
              </p>
              <p className="mb-0 text-muted small">
                {stimConfirm?.type === "delete" &&
                  "This stimulation will be permanently removed from the treatment. This action cannot be undone."}
                {stimConfirm?.type === "disable" &&
                  "The stimulation will be disabled and won't be available to the patient until re-enabled."}
                {stimConfirm?.type === "enable" &&
                  "The stimulation will be enabled and made available to the patient."}
              </p>
            </div>
          </div>
        </ModalBody>
        <ModalFooter style={{ borderTop: "none", paddingTop: 0, gap: "8px" }}>
          <Button
            color="light"
            size="sm"
            onClick={closeConfirm}
            disabled={isStimActionLoading}
            className="rounded-pill px-3"
          >
            Cancel
          </Button>
          <Button
            color={
              stimConfirm?.type === "delete"
                ? "danger"
                : stimConfirm?.type === "disable"
                  ? "warning"
                  : "success"
            }
            size="sm"
            onClick={handleStimAction}
            disabled={isStimActionLoading}
            className="rounded-pill px-3"
          >
            {isStimActionLoading ? (
              <>
                <Spinner size="sm" className="me-1" /> Loading...
              </>
            ) : (
              <>
                <i
                  className={`mdi ${stimConfirm?.type === "delete" ? "mdi-trash-can-outline" : stimConfirm?.type === "disable" ? "mdi-pause-circle-outline" : "mdi-play-circle-outline"} me-1`}
                />
                {stimConfirm?.type === "delete"
                  ? "Delete"
                  : stimConfirm?.type === "disable"
                    ? "Disable"
                    : "Enable"}
              </>
            )}
          </Button>
        </ModalFooter>
      </Modal>

      {/* Add Users Sidebar */}
      <AddUsersSidebar
        isOpen={isSidebarOpen}
        toggle={toggleSidebar}
        onSuccess={handleAddUsersSuccess}
      />

      {/* Export Modal */}
      <ExportModal
        isOpen={isExportModalOpen}
        toggle={toggleExportModal}
        onExportCsv={handleExportCsv}
        onExportPdf={handleExportPdf}
        isExporting={isExporting}
      />

      {editContext && (
        <EditStimulationsModal
          isOpen={isEditStimsOpen}
          toggle={toggleEditStims}
          patient={editContext.patient}
          clinicId={selectedClinicId}
          treatmentGuid={editContext.treatmentGuid}
          currentStimulations={editContext.currentStimulations}
          onSuccess={handleEditStimsSuccess}
        />
      )}
    </div>
  );
};

export default Patients;
