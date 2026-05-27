import React, { useState, useEffect, useMemo } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Input, Button } from "reactstrap";
import { pdf } from "@react-pdf/renderer";
import { getMyClinics } from "../../../api/clinician";
import { getClinicStimulations } from "../../../api";
import GateTable from "../components/Table";
import StimulationSidebar from "../components/EditStimulation/index";
import ExportModal from "../components/ExportModal";
import StimulationsPdfDocument from "../components/StimulationsPdfDocument";

const Stimulations = () => {
  const navigate = useNavigate();
  const [clinics, setClinics] = useState([]);
  const [selectedClinicId, setSelectedClinicId] = useState("");
  const [stimulations, setStimulations] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isStimulationsLoading, setIsStimulationsLoading] = useState(false);
  const [error, setError] = useState(null);

  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [sidebarMode, setSidebarMode] = useState("edit");
  const [selectedStimulation, setSelectedStimulation] = useState(null);

  // Export state
  const [isExportModalOpen, setIsExportModalOpen] = useState(false);
  const [isExporting, setIsExporting] = useState(false);
  // Holds the currently-filtered data passed up from GateTable when Export is clicked
  const [exportData, setExportData] = useState([]);
  const [exportSearchTerm, setExportSearchTerm] = useState("");

  const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);

  const openEditSidebar = (row) => {
    setSelectedStimulation(row);
    setSidebarMode("edit");
    setIsSidebarOpen(true);
  };

  const openCreateSidebar = () => {
    setSelectedStimulation(null);
    setSidebarMode("create");
    setIsSidebarOpen(true);
  };

  const openCopySidebar = (row) => {
    setSelectedStimulation(row);
    setSidebarMode("create");
    setIsSidebarOpen(true);
  };

  const fetchStimulations = async () => {
    if (!selectedClinicId) return;
    try {
      setIsStimulationsLoading(true);
      const res = await getClinicStimulations(selectedClinicId);
      const rawPayload = res?.data || res;

      let mergedData = [];
      if (rawPayload && typeof rawPayload === "object") {
        const original = rawPayload.original || [];
        const clinic = rawPayload.clinic || [];
        mergedData = [...original, ...clinic];
      } else if (Array.isArray(rawPayload)) {
        mergedData = rawPayload;
      }

      setStimulations(mergedData.reverse());
      setError(null);
    } catch (err) {
      console.error("Error fetching stimulations:", err);
      setError("Failed to load stimulations.");
      setStimulations([]);
    } finally {
      setIsStimulationsLoading(false);
    }
  };

  // Initialize: Fetch clinics
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

  // Fetch stimulations when selectedClinicId changes
  useEffect(() => {
    fetchStimulations();
  }, [selectedClinicId]);

  const handleClinicChange = (e) => setSelectedClinicId(e.target.value);

  const toggleExportModal = () => setIsExportModalOpen((prev) => !prev);

  // Called by GateTable's Export button — receives the currently filtered rows
  const handleOpenExport = (filteredData, searchTerm = "") => {
    setExportData(filteredData);
    setExportSearchTerm(searchTerm);
    setIsExportModalOpen(true);
  };

  const handleExportCsv = () => {
    if (!exportData || exportData.length === 0) return;

    const rows = exportData.map((stim) => {
      const params = stim.tes_stimulations_tdcs_parameters?.[0]?.tdcs_parameter || {};
      return {
        "Internal Name": stim.title || "",
        "Display Name": stim.name || stim.title || "",
        "Short Description": stim.short_description || "",
        "In Treatments": stim.intervention_treatment_tes?.length ?? 0,
        "Anode": params.anode || "",
        "Cathode": params.cathode || "",
        "Current (mA)": params.current != null ? (params.current / 100).toFixed(1) : "",
        "Duration (min)": params.duration != null ? (params.duration / 60).toFixed(0) : "",
        "Status": stim.disabled === false ? "Active" : "Inactive",
      };
    });

    const headers = Object.keys(rows[0]).map((k) => `"${k}"`).join(",");
    const body = rows.map((r) => Object.values(r).map((v) => `"${v}"`).join(",")).join("\n");

    const csvBlob = new Blob([`${headers}\n${body}`], { type: "text/csv" });
    const a = document.createElement("a");
    a.href = URL.createObjectURL(csvBlob);
    const filterSuffix = exportSearchTerm ? "_filtered" : "";
    a.download = `stimulations${filterSuffix}_${new Date().toISOString().split("T")[0]}.csv`;
    a.click();

    setIsExportModalOpen(false);
  };

  const handleExportPdf = async () => {
    try {
      setIsExporting(true);

      const selectedClinic = clinics.find((c) => c.guid === selectedClinicId);
      const clinicName = selectedClinic?.name || "Clinic";

      const blob = await pdf(
        <StimulationsPdfDocument
          stimulations={exportData}
          clinicName={clinicName}
          totalStimulations={exportData.length}
          isFiltered={!!exportSearchTerm}
          filterTerm={exportSearchTerm}
        />
      ).toBlob();

      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      const filterSuffix = exportSearchTerm ? "_filtered" : "";
      link.download = `stimulations_${clinicName.replace(/\s+/g, "_")}${filterSuffix}_${new Date().toISOString().split("T")[0]}.pdf`;
      link.click();
      URL.revokeObjectURL(url);

      setIsExportModalOpen(false);
    } catch (err) {
      console.error("Error generating stimulations PDF:", err);
      alert("Error generating PDF. Please try again or use CSV export.");
    } finally {
      setIsExporting(false);
    }
  };

  // Define Table Columns Matching Wireframe
  const columns = useMemo(
    () => [
      {
        Header: "Internal Name",
        accessor: "title",
        Cell: ({ value, row }) => (
          <div className="d-flex align-items-center gap-2">
            {/* Display color bar block mapping to protocol */}
            <div
              style={{
                width: "8px",
                height: "24px",
                backgroundColor: row.color
                  ? row.color.startsWith("#")
                    ? row.color
                    : `#${row.color}`
                  : "var(--gate-primary)",
                borderRadius: "2px",
              }}
            />
            <span style={{ fontWeight: 500 }}>{value || "—"}</span>
          </div>
        ),
      },
      {
        Header: "Display Name",
        accessor: "name",
        Cell: ({ value, row }) => value || row.title || "—",
      },
      {
        Header: "Short Description",
        accessor: "short_description",
        width: "250px",
        Cell: ({ value }) => (
          <div
            style={{
              whiteSpace: "normal",
              fontSize: "0.85rem",
              color: "var(--gate-text-secondary)",
            }}
          >
            {value || "—"}
          </div>
        ),
      },
      {
        Header: "In Treatments",
        accessor: "treatmentsCount", // Virtual Accessor
        Cell: ({ row }) => row.intervention_treatment_tes?.length || "0",
      },
      {
        Header: "Duration",
        accessor: "duration",
        Cell: ({ value, row }) =>
          `${row?.tes_stimulations_tdcs_parameters[0].tdcs_parameter.duration / 60 || "0"} min`,
      },
      {
        Header: "Current",
        accessor: "current",
        Cell: ({ value, row }) =>
          `${row?.tes_stimulations_tdcs_parameters[0].tdcs_parameter.current / 100 || "0"} mA`,
      },
      {
        Header: "ANODE",
        accessor: "anode",
        Cell: ({ value, row }) =>
          value ||
          row?.tes_stimulations_tdcs_parameters[0].tdcs_parameter.anode ||
          "Left",
      },
      {
        Header: "CATHODE",
        accessor: "cathode",
        Cell: ({ value, row }) =>
          value ||
          row?.tes_stimulations_tdcs_parameters[0].tdcs_parameter.cathode ||
          "Right",
      },
      /*{
        Header: "Actions",
        accessor: "actions",
        Cell: ({ row }) => {
          const isOriginal = row.original;

          return (
            <div className="d-flex align-items-center gap-2">
              {!isOriginal ? (
                <Button
                  onClick={() => openEditSidebar(row)}
                  color="light"
                  size="sm"
                  className="btn-icon"
                  title="Edit Stimulation"
                >
                  <i className="mdi mdi-pencil" />
                </Button>
              ) : (
                <Button
                  onClick={() => openCopySidebar(row)}
                  color="light"
                  size="sm"
                  className="btn-icon"
                  title="Copy Stimulation"
                >
                  <i className="mdi mdi-content-copy" />
                </Button>
              )}
            </div>
          );
        },
      },*/
    ],
    [],
  );

  return (
    <div className="fade-in" style={{ animation: "fadeIn 0.3s ease-in-out" }}>
      {(isLoading || isStimulationsLoading) && (
        <div className="gate-top-loading-bar"></div>
      )}

      {/* Header & Controls */}
      <div className="d-flex align-items-center justify-content-between mb-4 flex-wrap gap-3">
        <div>
          <h2
            className="m-0 font-weight-bold gate-text-primary"
            style={{ fontSize: "1.75rem", fontWeight: 700 }}
          >
            Stimulations
          </h2>
          <p className="text-muted m-0">Library of distinct stimulations.</p>
        </div>

        <div className="d-flex gap-2 align-items-center">
          <Input
            type="select"
            value={selectedClinicId}
            onChange={handleClinicChange}
            className="form-select hidden"
            style={{
              width: "250px",
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

          {selectedClinicId && (
            <Button
              color="primary"
              onClick={openCreateSidebar}
              className="hidden d-flex align-items-center gap-2 rounded-pill px-4 py-2 gate-btn-gradient-primary"
            >
              <i className="mdi mdi-plus me-1" /> Custom Stimulation
            </Button>
          )}
        </div>
      </div>

      {error && stimulations.length === 0 ? (
        <div className="alert alert-danger">{error}</div>
      ) : (
        <GateTable
          columns={columns}
          data={stimulations}
          isLoading={isLoading || isStimulationsLoading}
          onExport={handleOpenExport}
        />
      )}

      {/* Right Sidebar Editor / Creator */}
      <StimulationSidebar
        isOpen={isSidebarOpen}
        toggle={toggleSidebar}
        mode={sidebarMode}
        stimulation={selectedStimulation}
        clinicId={selectedClinicId}
        onSuccess={fetchStimulations}
      />

      {/* Export Modal */}
      <ExportModal
        isOpen={isExportModalOpen}
        toggle={toggleExportModal}
        isExporting={isExporting}
        onExportCsv={handleExportCsv}
        onExportPdf={handleExportPdf}
      />
    </div>
  );
};

export default Stimulations;
