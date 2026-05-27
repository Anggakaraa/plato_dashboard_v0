import React, { useState, useEffect, useMemo } from "react";
import {
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  Table,
  Badge,
  Spinner,
  Input,
} from "reactstrap";
import {
  getClinicStimulations,
  addPatientStimulation,
  removePatientStimulation,
  updatePatientStimulation,
  createPatientTreatment,
} from "../../../../api/clinician";

// Sentinel value used when the patient has no active treatment yet
const NO_TREATMENT = "default";

const EditStimulationsModal = ({
  isOpen,
  toggle,
  patient,
  clinicId,
  currentStimulations = [],
  treatmentGuid,
  onSuccess,
}) => {
  const [clinicStimulations, setClinicStimulations] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");

  // Local state for the modal's table
  // Each entry: { active, slider, interventionGuid (if active) }
  const [selection, setSelection] = useState({});

  const isNewTreatment = treatmentGuid === NO_TREATMENT;

  useEffect(() => {
    if (isOpen && clinicId) {
      fetchData();
    }
  }, [isOpen, clinicId]);

  // Reset state when modal is closed
  useEffect(() => {
    if (!isOpen) {
      setSearchTerm("");
      setError(null);
    }
  }, [isOpen]);

  const fetchData = async () => {
    try {
      setIsLoading(true);
      setError(null);

      // 1. Get all stimulations available for this clinic
      const res = await getClinicStimulations(clinicId);
      const rawPayload = res?.data || res;

      let stims = [];
      if (rawPayload && typeof rawPayload === "object" && !Array.isArray(rawPayload)) {
        const original = rawPayload.original || [];
        const clinic = rawPayload.clinic || [];
        stims = [...original, ...clinic];
      } else if (Array.isArray(rawPayload)) {
        stims = rawPayload;
      }

      setClinicStimulations(stims || []);

      // 2. Map current patient stimulations to the selection state
      const initialSelection = {};

      // Initialize all with active: false
      stims.forEach(s => {
        initialSelection[s.guid] = {
          active: false,
          slider: false,
          interventionGuid: null,
          title: s.title,
        };
      });

      // Overlay patient's active stimulations (only when editing an existing treatment)
      if (!isNewTreatment) {
        currentStimulations.forEach(cs => {
          const stimGuid = cs.tes_stimulation?.guid;
          if (stimGuid && initialSelection[stimGuid]) {
            initialSelection[stimGuid] = {
              ...initialSelection[stimGuid],
              active: cs.disabled === false,
              slider: !!cs.slider,
              interventionGuid: cs.guid,
            };
          }
        });
      }

      setSelection(initialSelection);
    } catch (err) {
      console.error("Error fetching modal data:", err);
      setError("Failed to load stimulations.");
    } finally {
      setIsLoading(false);
    }
  };

  const filteredStimulations = useMemo(() => {
    if (!searchTerm) return clinicStimulations;
    const term = searchTerm.toLowerCase();
    return clinicStimulations.filter(s =>
      s.title?.toLowerCase().includes(term) ||
      s.short_description?.toLowerCase().includes(term)
    );
  }, [clinicStimulations, searchTerm]);

  const selectedCount = useMemo(() => {
    return Object.values(selection).filter(s => s.active).length;
  }, [selection]);

  const handleToggleActive = (stimGuid) => {
    setSelection(prev => ({
      ...prev,
      [stimGuid]: {
        ...prev[stimGuid],
        active: !prev[stimGuid].active,
        // If deactivating, also clear slider
        slider: prev[stimGuid].active ? false : prev[stimGuid].slider,
      },
    }));
  };

  const handleToggleSlider = (stimGuid) => {
    setSelection(prev => ({
      ...prev,
      [stimGuid]: {
        ...prev[stimGuid],
        slider: !prev[stimGuid].slider,
      },
    }));
  };

  // ─── Save: Create new treatment ────────────────────────────────────────────
  const handleSaveNewTreatment = async () => {
    const activeStimGuids = Object.entries(selection)
      .filter(([, item]) => item.active)
      .map(([guid]) => guid);

    if (activeStimGuids.length === 0) {
      setError("Please select at least one stimulation before saving.");
      return;
    }

    // Build is_sham array so we can also pass slider info through the treatment creation
    const is_sham = activeStimGuids.map(guid => ({
      guid,
      is_sham: false,
      allow_slide: selection[guid]?.slider ?? false,
    }));

    // POST /patient-treatment — creates the treatment AND all interventions in one request
    const treatment = await createPatientTreatment({
      patient: patient.guid,
      clinic: clinicId,
      stimulations: activeStimGuids,
      is_sham,
      allow_update_electric_current: false,
      sessions_by_day: 1,
      research_treatment: false,
    });

    if (!treatment?.guid) {
      throw new Error("Treatment creation returned an invalid response.");
    }
  };

  // ─── Save: Edit existing treatment ─────────────────────────────────────────
  const handleSaveExistingTreatment = async () => {
    const items = Object.entries(selection);
    const safeCurrentStimulations = currentStimulations || [];

    for (const [stimGuid, item] of items) {
      const original = safeCurrentStimulations.find(
        (cs) => cs?.tes_stimulation?.guid === stimGuid
      );

      if (item.active && !original) {
        // 1. New stimulation: POST
        const response = await addPatientStimulation({
          treatmentGuid,
          stimulationGuid: stimGuid,
        });

        // If slider was also enabled, update it right away
        const newGuid = response?.guid || response?.data?.guid;
        if (item.slider && newGuid) {
          await updatePatientStimulation(newGuid, { slider: true });
        }
      } else if (!item.active && original) {
        // 2. Removed stimulation: DELETE
        if (original.guid) {
          await removePatientStimulation(original.guid);
        }
      } else if (item.active && original) {
        // 3. Existing stimulation: update only when something changed
        const currentSlider = !!original.slider;

        if (item.slider !== currentSlider && original.guid) {
          await updatePatientStimulation(original.guid, {
            disabled: false,
            slider: item.slider,
          });
        }
      }
    }
  };

  // ─── Main save handler ──────────────────────────────────────────────────────
  const handleSave = async () => {
    try {
      setIsSaving(true);
      setError(null);

      if (isNewTreatment) {
        await handleSaveNewTreatment();
      } else {
        await handleSaveExistingTreatment();
      }

      if (onSuccess) onSuccess();
      toggle();
    } catch (err) {
      console.error("Error saving stimulations:", err);
      setError(err?.response?.data?.message || err?.message || "Failed to save changes. Please try again.");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <Modal isOpen={isOpen} toggle={toggle} size="lg" centered fade className="gate-modal">
      <ModalHeader toggle={toggle} className="border-bottom pb-3">
        <div className="d-flex align-items-center gap-2">
          <i className="mdi mdi-playlist-edit text-primary" style={{ fontSize: "1.5rem" }} />
          <div>
            <span className="fw-bold">
              {isNewTreatment ? "Create Patient Treatment" : "Edit Patient Stimulations"}
            </span>
            {isNewTreatment && (
              <div className="text-muted small fw-normal mt-1">
                Select the stimulations to assign to{" "}
                <span className="fw-medium text-dark">{patient?.name || "this patient"}</span>
              </div>
            )}
          </div>
        </div>
      </ModalHeader>

      <ModalBody className="p-0">
        {isLoading ? (
          <div className="text-center py-5">
            <Spinner color="primary" />
            <p className="text-muted mt-2">Loading clinic library...</p>
          </div>
        ) : error && clinicStimulations.length === 0 ? (
          <div className="p-4 text-center text-danger">
            <i className="mdi mdi-alert-circle-outline d-block mb-2" style={{ fontSize: "2rem" }} />
            {error}
          </div>
        ) : (
          <>
            {/* Search + info bar */}
            <div className="px-4 py-3 bg-white sticky-top border-bottom" style={{ zIndex: 2 }}>
              <div className="d-flex align-items-center gap-3 flex-wrap">
                <div
                  className="d-flex align-items-center bg-light border rounded-pill px-3 py-2 shadow-sm flex-grow-1"
                  style={{ maxWidth: "450px" }}
                >
                  <i className="mdi mdi-magnify text-muted me-2" style={{ fontSize: "1.2rem" }} />
                  <Input
                    type="text"
                    placeholder="Search stimulations by name..."
                    className="border-0 shadow-none p-0 bg-transparent gate-global-search"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                  {searchTerm && (
                    <button
                      className="btn btn-link p-0 border-0 text-muted ms-2"
                      onClick={() => setSearchTerm("")}
                    >
                      <i className="mdi mdi-close-circle" style={{ fontSize: "1.1rem" }} />
                    </button>
                  )}
                </div>

                {/* Selection counter badge */}
                {selectedCount > 0 && (
                  <Badge color="primary" pill className="px-3 py-2" style={{ fontSize: "0.8rem" }}>
                    <i className="mdi mdi-check-circle-outline me-1" />
                    {selectedCount} selected
                  </Badge>
                )}
              </div>

              <div className="text-muted smallest mt-2 px-1">
                {filteredStimulations.length} stimulations available
                {isNewTreatment && (
                  <span className="ms-2 text-warning">
                    <i className="mdi mdi-information-outline me-1" />
                    Toggle stimulations to include in the new treatment
                  </span>
                )}
              </div>
            </div>

            {/* Inline error (non-fatal, e.g. empty selection on submit) */}
            {error && (
              <div className="mx-4 mt-3 alert alert-danger py-2 d-flex align-items-center gap-2">
                <i className="mdi mdi-alert-outline" />
                {error}
              </div>
            )}

            <div className="table-responsive" style={{ maxHeight: "460px" }}>
              <Table hover align="middle" className="mb-0 gate-modal-table">
                <thead className="bg-light sticky-top" style={{ zIndex: 1 }}>
                  <tr>
                    <th className="ps-4" style={{ width: "80px" }}>Active</th>
                    <th>Title</th>
                    <th className="text-center">Anode</th>
                    <th className="text-center">Cathode</th>
                    <th className="text-center">Current</th>
                    <th className="text-center">Duration</th>
                    <th className="text-center" style={{ width: "120px" }}>Allow Slider</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredStimulations.length === 0 ? (
                    <tr>
                      <td colSpan={7} className="text-center text-muted py-5">
                        <i className="mdi mdi-flask-empty-outline d-block mb-2" style={{ fontSize: "2rem" }} />
                        No stimulations found{searchTerm ? ` for "${searchTerm}"` : ""}
                      </td>
                    </tr>
                  ) : (
                    filteredStimulations.map((stim) => {
                      const sel = selection[stim.guid] || {};
                      const params = stim.tes_stimulations_tdcs_parameters?.[0]?.tdcs_parameter || {};

                      return (
                        <tr key={stim.guid} className={sel.active ? "table-primary" : ""}>
                          <td className="ps-4">
                            <Input
                              type="switch"
                              id={`active-${stim.guid}`}
                              checked={!!sel.active}
                              onChange={() => handleToggleActive(stim.guid)}
                              className="gate-switch"
                            />
                          </td>
                          <td>
                            <div className="fw-medium text-dark">{stim.title}</div>
                            <div className="text-muted smallest text-truncate" style={{ maxWidth: "200px" }}>
                              {stim.short_description}
                            </div>
                          </td>
                          <td className="text-center px-1">
                            <Badge color="light" className="text-dark border px-2">{params.anode || "?"}</Badge>
                          </td>
                          <td className="text-center px-1">
                            <Badge color="light" className="text-dark border px-2">{params.cathode || "?"}</Badge>
                          </td>
                          <td className="text-center fw-bold text-primary">
                            {params.current ? (params.current / 100).toFixed(1) + " mA" : "—"}
                          </td>
                          <td className="text-center">
                            {params.duration ? (params.duration / 60).toFixed(0) + " min" : "—"}
                          </td>
                          <td className="text-center">
                            <Input
                              type="switch"
                              id={`slider-${stim.guid}`}
                              checked={!!sel.slider}
                              onChange={() => handleToggleSlider(stim.guid)}
                              disabled={!sel.active || params.current !== 120}
                              title={
                                params.current !== 120
                                  ? "Slider is only available for 1.2 mA stimulations"
                                  : undefined
                              }
                              className="gate-switch"
                            />
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </Table>
            </div>
          </>
        )}
      </ModalBody>

      <ModalFooter className="border-top gap-2">
        <Button color="light" onClick={toggle} className="rounded-pill px-4" disabled={isSaving}>
          Cancel
        </Button>
        <Button
          color="primary"
          onClick={handleSave}
          className="rounded-pill px-4 gate-btn-primary shadow-sm"
          disabled={isSaving || isLoading}
        >
          {isSaving ? (
            <><Spinner size="sm" className="me-2" />Saving...</>
          ) : isNewTreatment ? (
            <><i className="mdi mdi-plus-circle-outline me-1" />Create Treatment</>
          ) : (
            <><i className="mdi mdi-check me-1" />Save Changes</>
          )}
        </Button>
      </ModalFooter>
    </Modal>
  );
};

export default EditStimulationsModal;
