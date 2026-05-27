import React, { useEffect, useState } from "react";
import {
  Offcanvas,
  OffcanvasHeader,
  OffcanvasBody,
  Form,
  FormGroup,
  Label,
  Input,
  Button,
  FormFeedback,
  Spinner,
} from "reactstrap";
import { useClinic } from "../../contexts/ClinicContext";
import { addMyPatient as addMyPatientApi } from "../../../../api/clinician";

// Status for each user row: "idle" | "loading" | "success" | "error"
const ROW_IDLE = "idle";
const ROW_LOADING = "loading";
const ROW_SUCCESS = "success";
const ROW_ERROR = "error";

const AddUsersSidebar = ({ isOpen, toggle, onSuccess }) => {
  const { selectedClinic, setSelectedClinic } = useClinic();
  const [formData, setFormData] = useState({
    signifier: selectedClinic?.signifier || "",
    numberOfUsers: 1,
  });
  const [errors, setErrors] = useState({});
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState(null);

  // Per-row creation statuses: array of { username, status, message }
  const [rowStatuses, setRowStatuses] = useState([]);
  const [creationDone, setCreationDone] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
    // Reset statuses when form changes
    setRowStatuses([]);
    setCreationDone(false);
    setError(null);
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.signifier.trim()) {
      newErrors.signifier = "User name signifier is required";
    } else if (formData.signifier.trim().length < 2) {
      newErrors.signifier = "Signifier must be at least 2 characters";
    }

    const numUsers = parseInt(formData.numberOfUsers);
    if (!formData.numberOfUsers || isNaN(numUsers)) {
      newErrors.numberOfUsers = "Number of users is required";
    } else if (numUsers < 1) {
      newErrors.numberOfUsers = "Must be at least 1 user";
    } else if (numUsers > 100) {
      newErrors.numberOfUsers = "Cannot create more than 100 users at once";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Build the list of usernames to create
  const buildUserList = () => {
    if (!selectedClinic) return [];
    const count = parseInt(formData.numberOfUsers) || 1;
    return Array.from({ length: count }).map((_, index) => {
      const userNumber = (selectedClinic.signifier_count || 0) + index + 1;
      const username = `${selectedClinic.signifier}${String(userNumber).padStart(4, "0")}`;
      return { username, status: ROW_IDLE, message: "" };
    });
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setError(null);

    if (!validateForm()) return;
    if (!selectedClinic) {
      setError("No clinic selected. Please select a clinic first.");
      return;
    }

    const count = parseInt(formData.numberOfUsers) || 1;

    // Initialize row statuses
    const initial = buildUserList().map((u) => ({ ...u, status: ROW_IDLE }));
    setRowStatuses(initial);
    setIsSaving(true);
    setCreationDone(false);

    let hasError = false;

    // Create patients one by one
    for (let i = 0; i < count; i++) {
      // Mark current row as loading
      setRowStatuses((prev) =>
        prev.map((row, idx) =>
          idx === i ? { ...row, status: ROW_LOADING } : row,
        ),
      );

      try {
        await addMyPatientApi({
          totalPatient: 1,
          clinic: selectedClinic.guid,
          type: "custom",
          signifier: selectedClinic.signifier,
        });

        // Mark as success
        setRowStatuses((prev) =>
          prev.map((row, idx) =>
            idx === i ? { ...row, status: ROW_SUCCESS } : row,
          ),
        );

        // Increment signifier_count in context so next preview is correct
        setSelectedClinic((prev) => ({
          ...prev,
          signifier_count: (prev?.signifier_count || 0) + 1,
        }));
      } catch (err) {
        hasError = true;
        const msg =
          err?.response?.data?.message ||
          err?.message ||
          "Failed to create user.";
        setRowStatuses((prev) =>
          prev.map((row, idx) =>
            idx === i ? { ...row, status: ROW_ERROR, message: msg } : row,
          ),
        );
      }
    }

    setIsSaving(false);
    setCreationDone(true);

    if (!hasError) {
      // Notify parent to refresh the list
      if (onSuccess) onSuccess();
    }
  };

  const handleClose = () => {
    if (isSaving) return; // block closing during creation
    setFormData({
      signifier: "",
      numberOfUsers: 1,
    });
    setErrors({});
    setError(null);
    setRowStatuses([]);
    setCreationDone(false);
    toggle();
  };

  useEffect(() => {
    if (selectedClinic) {
      setFormData((prev) => ({
        ...prev,
        signifier: selectedClinic.signifier,
      }));
    }
  }, [selectedClinic]);

  // Reset state when sidebar opens
  useEffect(() => {
    if (isOpen) {
      setRowStatuses([]);
      setCreationDone(false);
      setError(null);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  // Build preview list: use rowStatuses if they exist, otherwise compute from form
  const previewCount = Math.min(parseInt(formData.numberOfUsers) || 0, 10);
  const previewRows =
    rowStatuses.length > 0
      ? rowStatuses
      : Array.from({ length: previewCount }).map((_, index) => {
          const userNumber =
            (selectedClinic?.signifier_count || 0) + index + 1;
          const username = `${selectedClinic?.signifier || ""}${String(userNumber).padStart(4, "0")}`;
          return { username, status: ROW_IDLE, message: "" };
        });

  return (
    <Offcanvas
      isOpen={isOpen}
      toggle={handleClose}
      direction="end"
      style={{ width: "480px", borderLeft: "1px solid var(--gate-border)" }}
    >
      <OffcanvasHeader
        toggle={handleClose}
        className="gate-sidebar-header-gradient text-white"
        style={{ minHeight: "var(--gate-header-height)" }}
      >
        <h5 className="m-0 fw-bold" style={{ marginTop: "5px" }}>
          Add New Users
        </h5>
      </OffcanvasHeader>

      <OffcanvasBody className="p-4 bg-white">
        <div className="mb-4">
          <p className="text-muted font-size-13 m-0">
            Create multiple patient accounts with sequential usernames and
            unique passwords.
          </p>
        </div>

        {error && (
          <div className="alert alert-danger font-size-13 py-2 px-3 rounded-3 mb-4">
            <i className="mdi mdi-alert-circle-outline me-2"></i> {error}
          </div>
        )}

        {creationDone && !rowStatuses.some((r) => r.status === ROW_ERROR) && (
          <div className="alert alert-success font-size-13 py-2 px-3 rounded-3 mb-4">
            <i className="mdi mdi-check-circle-outline me-2"></i>
            All users created successfully!
          </div>
        )}

        <Form onSubmit={handleSave}>
          {/* User Name Signifier */}
          <FormGroup className="mb-4">
            <Label className="fw-medium font-size-13 text-secondary">
              User Name Signifier *
            </Label>
            <Input
              type="text"
              id="signifier"
              name="signifier"
              placeholder="e.g. patient"
              value={formData.signifier}
              onChange={handleChange}
              invalid={!!errors.signifier}
              className="rounded-3 shadow-none border-light-subtle gate-input-focus"
              autoComplete="off"
              disabled
            />
            {errors.signifier && (
              <FormFeedback>{errors.signifier}</FormFeedback>
            )}
            <small className="text-muted d-block mt-2 font-size-12">
              This will be the prefix for the generated user names
            </small>
          </FormGroup>

          {/* Number of Users */}
          <FormGroup className="mb-4">
            <Label className="fw-medium font-size-13 text-secondary">
              Number of Users *
            </Label>
            <Input
              type="number"
              id="numberOfUsers"
              name="numberOfUsers"
              placeholder="1"
              min="1"
              max="10"
              value={formData.numberOfUsers}
              onChange={handleChange}
              invalid={!!errors.numberOfUsers}
              className="rounded-3 shadow-none border-light-subtle gate-input-focus"
              disabled={isSaving}
            />
            {errors.numberOfUsers && (
              <FormFeedback>{errors.numberOfUsers}</FormFeedback>
            )}
          </FormGroup>

          {/* Preview with live status */}
          {previewCount > 0 &&
            !errors.numberOfUsers &&
            selectedClinic && (
              <div className="border rounded-3 mb-4 bg-light">
                <div className="border-bottom px-3 py-2 bg-white rounded-top">
                  <h6 className="m-0 fw-medium font-size-13 text-secondary">
                    <i className="mdi mdi-eye-outline me-2"></i>
                    Preview
                  </h6>
                </div>
                <div className="p-3">
                  <p className="mb-2 font-size-13 text-muted">
                    <strong>Generated usernames:</strong>
                  </p>
                  <div className="d-flex flex-column gap-2">
                    {previewRows.map((row, index) => (
                      <div
                        key={index}
                        className="bg-white rounded-3 px-3 py-2 font-size-13 border d-flex align-items-center justify-content-between"
                        style={{
                          fontFamily: "Monaco, Courier New, monospace",
                          borderColor:
                            row.status === ROW_SUCCESS
                              ? "#28a745"
                              : row.status === ROW_ERROR
                                ? "#dc3545"
                                : undefined,
                          transition: "border-color 0.3s ease",
                        }}
                      >
                        <div className="d-flex align-items-center gap-2 text-dark">
                          <i className="mdi mdi-account-outline text-primary"></i>
                          {row.username}
                        </div>

                        {/* Status indicator */}
                        <div className="ms-2 d-flex align-items-center">
                          {row.status === ROW_LOADING && (
                            <Spinner
                              size="sm"
                              color="primary"
                              title="Creating..."
                            />
                          )}
                          {row.status === ROW_SUCCESS && (
                            <i
                              className="mdi mdi-check-circle text-success"
                              style={{ fontSize: "1.1rem" }}
                              title="Created successfully"
                            ></i>
                          )}
                          {row.status === ROW_ERROR && (
                            <i
                              className="mdi mdi-alert-circle text-danger"
                              style={{ fontSize: "1.1rem" }}
                              title={row.message || "Error"}
                            ></i>
                          )}
                        </div>
                      </div>
                    ))}

                    {parseInt(formData.numberOfUsers) > 10 && (
                      <div className="text-muted font-size-13 px-3">
                        ... and {parseInt(formData.numberOfUsers) - 10} more
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}

          <div className="d-grid mt-5">
            <Button
              type="submit"
              color="primary"
              disabled={isSaving || creationDone}
              className="d-flex align-items-center gap-2 rounded-pill px-4 py-2 gate-btn-gradient-primary text-center justify-content-center"
            >
              {isSaving ? (
                <>
                  <Spinner size="sm" className="me-2" /> Creating Users...
                </>
              ) : creationDone ? (
                <>
                  <i className="mdi mdi-check me-2"></i> Done
                </>
              ) : (
                "Create Users"
              )}
            </Button>
          </div>
          <div className="d-grid mt-3">
            <Button
              color="secondary"
              onClick={handleClose}
              disabled={isSaving}
              className="d-flex align-items-center gap-2 rounded-pill px-4 py-2 border-secondary text-center justify-content-center"
            >
              {creationDone ? "Close" : "Cancel"}
            </Button>
          </div>
        </Form>
      </OffcanvasBody>
    </Offcanvas>
  );
};

export default AddUsersSidebar;
