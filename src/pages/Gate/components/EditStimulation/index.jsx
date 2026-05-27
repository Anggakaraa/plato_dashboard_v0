import React, { useState, useEffect } from "react";
import {
  Offcanvas,
  OffcanvasHeader,
  OffcanvasBody,
  Form,
  FormGroup,
  Label,
  Input,
  Button,
  Spinner,
  Row,
  Col,
} from "reactstrap";
import { updateClinicStimulation, addClinicStimulation } from "../../../../api";
import {
  anodes,
  cathodes,
  currents,
  durations,
  type as STIM_TYPE,
} from "../../../Stimulations/data";

const StimulationSidebar = ({
  isOpen,
  toggle,
  mode = "edit",
  stimulation,
  clinicId,
  onSuccess,
}) => {
  const [formData, setFormData] = useState({
    title: "",
    name: "",
    short_description: "",
    description: "",
    color: "#4361ee",
    anode: anodes[0],
    cathode: cathodes[1],
    current: currents[0],
    duration: durations[0],
  });
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState(null);

  // Format date helper
  const formatDate = (dateString) => {
    if (!dateString) return "—";
    try {
      const date = new Date(dateString);
      return date.toLocaleString("pt-BR", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      });
    } catch {
      return "—";
    }
  };

  // Sync form data when the sidebar opens
  useEffect(() => {
    if (isOpen) {
      if (mode === "edit" && stimulation) {
        setFormData((prev) => ({
          ...prev,
          name: stimulation.name || stimulation.title || "",
          short_description: stimulation.short_description || "",
          color: stimulation.color
            ? stimulation.color.startsWith("#")
              ? stimulation.color
              : `#${stimulation.color}`
            : "#4361ee",
          anode: stimulation.stimulation?.anode || stimulation.anode || anodes[0],
          cathode: stimulation.stimulation?.cathode || stimulation.cathode || cathodes[1],
          current: stimulation.stimulation?.current || stimulation.current || currents[0],
          duration: stimulation.stimulation?.duration || stimulation.duration || durations[0],
        }));
      } else if (mode === "create") {
        // Se há uma stimulation (copy mode), popula com os dados dela
        if (stimulation) {
          setFormData({
            title: "",
            name: stimulation.name || stimulation.title || "",
            short_description: stimulation.short_description || "",
            description: stimulation.description || stimulation.short_description || "",
            color: stimulation.color
              ? stimulation.color.startsWith("#")
                ? stimulation.color
                : `#${stimulation.color}`
              : "#4361ee",
            anode: stimulation.tes_stimulations_tdcs_parameters?.[0]?.tdcs_parameter?.anode || 
                   stimulation.stimulation?.anode || 
                   stimulation.anode || 
                   anodes[0],
            cathode: stimulation.tes_stimulations_tdcs_parameters?.[0]?.tdcs_parameter?.cathode || 
                     stimulation.stimulation?.cathode || 
                     stimulation.cathode || 
                     cathodes[1],
            current: stimulation.tes_stimulations_tdcs_parameters?.[0]?.tdcs_parameter?.current || 
                     stimulation.stimulation?.current || 
                     stimulation.current || 
                     currents[0],
            duration: stimulation.tes_stimulations_tdcs_parameters?.[0]?.tdcs_parameter?.duration || 
                      stimulation.stimulation?.duration || 
                      stimulation.duration || 
                      durations[0],
          });
        } else {
          // Modo create normal (sem cópia)
          const defaultColor = "#4361ee";
          setFormData({
            title: "",
            name: "",
            short_description: "",
            description: "",
            color: defaultColor,
            anode: anodes[0],
            cathode: anodes[1],
            current: currents[0],
            duration: durations[0],
          });
        }
      }
      setError(null);
    }
  }, [isOpen, mode, stimulation]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSave = async (e) => {
    e.preventDefault();
    if (!clinicId) return;

    try {
      setIsSaving(true);
      setError(null);

      if (mode === "edit") {
        if (!stimulation) return;
        const payload = {
          guid: stimulation.guid,
          clinic: clinicId,
          name: formData.name,
          short_description: formData.short_description,
          color: formData.color.replace("#", ""),
        };
        await updateClinicStimulation(payload);
      } else if (mode === "create") {
        const payload = {
          original: false,
          type: STIM_TYPE,
          title: formData.title,
          name: formData.name,
          description: formData.description || formData.short_description,
          short_description: formData.short_description,
          color: formData.color.replace("#", ""),
          category: "default",
          clinic: clinicId,
          stimulation: {
            anode: formData.anode,
            cathode: formData.cathode,
            current: parseInt(formData.current),
            duration: parseInt(formData.duration),
            alias: formData.title,
          },
        };
        await addClinicStimulation(payload);
      }

      if (onSuccess) onSuccess();
      toggle();
    } catch (err) {
      console.error("Failed to process stimulation", err);
      // Try to parse out backend specific message if present
      const errMsg =
        err?.response?.data?.message ||
        err?.message ||
        "An error occurred while attempting to save your changes.";
      setError(errMsg);
    } finally {
      setIsSaving(false);
    }
  };

  if (!isOpen) return null;

  return (
    <Offcanvas
      isOpen={isOpen}
      toggle={toggle}
      direction="end"
      style={{ width: "480px", borderLeft: "1px solid var(--gate-border)" }}
    >
      <OffcanvasHeader
        toggle={toggle}
        className="gate-sidebar-header-gradient text-white"
        style={{ minHeight: "var(--gate-header-height)" }}
      >
        <h5 className="m-0 fw-bold" style={{ marginTop: "5px" }}>
          {mode === "edit" ? "Edit Stimulation" : "Create Custom Stimulation"}
        </h5>
      </OffcanvasHeader>

      <OffcanvasBody className="p-4 bg-white">
        <div className="mb-4">
          {mode === "edit" && stimulation ? (
            <span className="badge bg-light text-dark font-size-12 mb-2 p-2 px-3 rounded-pill border">
              {stimulation.title}
            </span>
          ) : null}
          <p className="text-muted font-size-13 m-0">
            {mode === "edit"
              ? "Modify the visual descriptors for this specific custom clinic stimulation."
              : "Design a new custom stimulation directly inside your clinic library."}
          </p>
        </div>

        {error && (
          <div className="alert alert-danger font-size-13 py-2 px-3 rounded-3 mb-4">
            <i className="mdi mdi-alert-circle-outline me-2"></i> {error}
          </div>
        )}

        <Form onSubmit={handleSave}>
          {mode === "create" && (
            <FormGroup className="mb-4">
              <Label className="fw-medium font-size-13 text-secondary">
                Internal Title *
              </Label>
              <Input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleChange}
                placeholder="E.g., MY-STIMULATION-1"
                required
                maxLength={32}
                className="rounded-3 shadow-none border-light-subtle gate-input-focus"
              />
            </FormGroup>
          )}

          <FormGroup className="mb-4">
            <Label className="fw-medium font-size-13 text-secondary">
              Display Name *
            </Label>
            <Input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="E.g., Depression Stimulation v2"
              required
              maxLength={32}
              className="rounded-3 shadow-none border-light-subtle gate-input-focus"
            />
          </FormGroup>

          {mode === "create" && (
            <Row>
              <Col md={6}>
                <FormGroup className="mb-4">
                  <Label className="fw-medium font-size-13 text-secondary">
                    Anode *
                  </Label>
                  <Input
                    type="select"
                    name="anode"
                    value={formData.anode}
                    onChange={handleChange}
                    className="rounded-3 shadow-none border-light-subtle gate-input-focus"
                  >
                    {anodes.map((val) => (
                      <option key={val} value={val}>
                        {val}
                      </option>
                    ))}
                  </Input>
                </FormGroup>
              </Col>
              <Col md={6}>
                <FormGroup className="mb-4">
                  <Label className="fw-medium font-size-13 text-secondary">
                    Cathode *
                  </Label>
                  <Input
                    type="select"
                    name="cathode"
                    value={formData.cathode}
                    onChange={handleChange}
                    className="rounded-3 shadow-none border-light-subtle gate-input-focus"
                  >
                    {cathodes.map((val) => (
                      <option
                        key={val}
                        value={val}
                        disabled={val === formData.anode}
                      >
                        {val}
                      </option>
                    ))}
                  </Input>
                </FormGroup>
              </Col>
            </Row>
          )}

          {mode === "edit" && (
            <Row>
              <Col md={6}>
                <FormGroup className="mb-4">
                  <Label className="fw-medium font-size-13 text-secondary">
                    Anode *
                  </Label>
                  <Input
                    type="select"
                    name="anode"
                    value={formData.anode}
                    onChange={handleChange}
                    className="rounded-3 shadow-none border-light-subtle gate-input-focus"
                  >
                    {anodes.map((val) => (
                      <option key={val} value={val}>
                        {val}
                      </option>
                    ))}
                  </Input>
                </FormGroup>
              </Col>
              <Col md={6}>
                <FormGroup className="mb-4">
                  <Label className="fw-medium font-size-13 text-secondary">
                    Cathode *
                  </Label>
                  <Input
                    type="select"
                    name="cathode"
                    value={formData.cathode}
                    onChange={handleChange}
                    className="rounded-3 shadow-none border-light-subtle gate-input-focus"
                  >
                    {cathodes.map((val) => (
                      <option
                        key={val}
                        value={val}
                        disabled={val === formData.anode}
                      >
                        {val}
                      </option>
                    ))}
                  </Input>
                </FormGroup>
              </Col>
            </Row>
          )}

          {mode === "create" && (
            <Row>
              <Col md={6}>
                <FormGroup className="mb-4">
                  <Label className="fw-medium font-size-13 text-secondary">
                    Current (mA) *
                  </Label>
                  <Input
                    type="select"
                    name="current"
                    value={formData.current}
                    onChange={handleChange}
                    className="rounded-3 shadow-none border-light-subtle gate-input-focus"
                  >
                    {currents.map((val) => (
                      <option key={val} value={val}>
                        {val / 100} mA
                      </option>
                    ))}
                  </Input>
                </FormGroup>
              </Col>
              <Col md={6}>
                <FormGroup className="mb-4">
                  <Label className="fw-medium font-size-13 text-secondary">
                    Duration (min) *
                  </Label>
                  <Input
                    type="select"
                    name="duration"
                    value={formData.duration}
                    onChange={handleChange}
                    className="rounded-3 shadow-none border-light-subtle gate-input-focus"
                  >
                    {durations.map((val) => (
                      <option key={val} value={val}>
                        {val / 60} min
                      </option>
                    ))}
                  </Input>
                </FormGroup>
              </Col>
            </Row>
          )}

          {mode === "edit" && (
            <Row>
              <Col md={6}>
                <FormGroup className="mb-4">
                  <Label className="fw-medium font-size-13 text-secondary">
                    Current (mA) *
                  </Label>
                  <Input
                    type="select"
                    name="current"
                    value={formData.current}
                    onChange={handleChange}
                    className="rounded-3 shadow-none border-light-subtle gate-input-focus"
                  >
                    {currents.map((val) => (
                      <option key={val} value={val}>
                        {val / 100} mA
                      </option>
                    ))}
                  </Input>
                </FormGroup>
              </Col>
              <Col md={6}>
                <FormGroup className="mb-4">
                  <Label className="fw-medium font-size-13 text-secondary">
                    Duration (min) *
                  </Label>
                  <Input
                    type="select"
                    name="duration"
                    value={formData.duration}
                    onChange={handleChange}
                    className="rounded-3 shadow-none border-light-subtle gate-input-focus"
                  >
                    {durations.map((val) => (
                      <option key={val} value={val}>
                        {val / 60} min
                      </option>
                    ))}
                  </Input>
                </FormGroup>
              </Col>
            </Row>
          )}

          <FormGroup className="mb-4">
            <Label className="fw-medium font-size-13 text-secondary">
              Short Description *
            </Label>
            <Input
              type="textarea"
              name="short_description"
              value={formData.short_description}
              onChange={handleChange}
              rows="3"
              required
              placeholder="Provide a quick overview..."
              className="rounded-3 shadow-none border-light-subtle gate-input-focus"
              style={{ resize: "none" }}
            />
          </FormGroup>

          {mode === "create" && (
            <FormGroup className="mb-4">
              <Label className="fw-medium font-size-13 text-secondary">
                Full Description
              </Label>
              <Input
                type="textarea"
                name="description"
                value={formData.description}
                onChange={handleChange}
                rows="4"
                placeholder="Detailed stimulation parameters or notes..."
                className="rounded-3 shadow-none border-light-subtle gate-input-focus"
                style={{ resize: "none" }}
              />
            </FormGroup>
          )}

          <FormGroup className="mb-4">
            <Label className="fw-medium font-size-13 text-secondary">
              Label Color
            </Label>
            <div className="d-flex align-items-center gap-3">
              <Input
                type="color"
                name="color"
                value={formData.color}
                onChange={handleChange}
                className="p-1 rounded-3"
                style={{ width: "50px", height: "40px", cursor: "pointer" }}
              />
              <span className="text-muted font-size-13 border rounded-3 px-3 py-2 bg-light">
                {formData.color.toUpperCase()}
              </span>
            </div>
          </FormGroup>

          {mode === "edit" && stimulation && (
            <div className="border-top pt-4 mt-4">
              <h6 className="fw-medium font-size-13 text-secondary mb-3">
                <i className="mdi mdi-information-outline me-2"></i>
                Metadata
              </h6>
              <Row>
                <Col md={6}>
                  <FormGroup className="mb-3">
                    <Label className="fw-medium font-size-12 text-muted">
                      Created At
                    </Label>
                    <div className="bg-light rounded-3 px-3 py-2 font-size-13 text-dark border">
                      {formatDate(stimulation.created_at)}
                    </div>
                  </FormGroup>
                </Col>
                <Col md={6}>
                  <FormGroup className="mb-3">
                    <Label className="fw-medium font-size-12 text-muted">
                      Updated At
                    </Label>
                    <div className="bg-light rounded-3 px-3 py-2 font-size-13 text-dark border">
                      {formatDate(stimulation.updated_at)}
                    </div>
                  </FormGroup>
                </Col>
              </Row>
            </div>
          )}

          <div className="d-grid mt-5">
            <Button
              type="submit"
              color="primary"
              disabled={isSaving}
              className="d-flex align-items-center gap-2 rounded-pill px-4 py-2 gate-btn-gradient-primary text-center justify-content-center"
            >
              {isSaving ? (
                <>
                  <Spinner size="sm" className="me-2" /> Saving Changes...
                </>
              ) : (
                "Save Stimulation Settings"
              )}
            </Button>
          </div>
        </Form>
      </OffcanvasBody>
    </Offcanvas>
  );
};

export default StimulationSidebar;
