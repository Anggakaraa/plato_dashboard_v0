import React, { useEffect, useMemo, useState } from "react";
import PropTypes from "prop-types";
import { withTranslation } from "react-i18next";
import {
  Badge,
  Card,
  CardBody,
  Col,
  Container,
  FormFeedback,
  Input,
  Label,
  Modal,
  ModalBody,
  ModalHeader,
  Nav,
  NavItem,
  NavLink,
  Row,
  TabContent,
  TabPane,
  Form,
} from "reactstrap";
import classnames from "classnames";
import { useNavigate } from "react-router-dom";
import withRouter from "../../../components/Common/withRouter";

import Breadcrumbs from "../../../components/Common/Breadcrumb";
import LocalTableContainer from "../../../components/Common/LocalTableContainer";
import { get, post } from "../../../api/manager";

const ClinicDetail = (props) => {
  const guid = props.router.params.guid;
  const navigate = useNavigate();
  document.title = "Clinic Detail | Plato Dashboard";

  const [clinic, setClinic] = useState(null);
  const [clinicians, setClinicians] = useState([]);
  const [patients, setPatients] = useState([]);
  const [activeTab, setActiveTab] = useState("clinicians");
  const [loading, setLoading] = useState(true);

  // Add Patient modal
  const [patientModal, setPatientModal] = useState(false);
  const [newPatient, setNewPatient] = useState({ name: "", email: "" });
  const [patientErrors, setPatientErrors] = useState({});
  const [saving, setSaving] = useState(false);

  const baseurl = import.meta.env.VITE_APP_API_URL;

  // ─── Fetch ────────────────────────────────────────────────────────────────

  async function fetchClinic() {
    const data = await get(`${baseurl}/plato/clinic?guid=${guid}`, true, {});
    if (data) setClinic(data);
  }

  async function fetchClinicians() {
    const data = await get(
      `${baseurl}/plato/clinicians/clinic?guid=${guid}`,
      true,
      {}
    );
    if (data) setClinicians(data);
  }

  async function fetchPatients() {
    const data = await get(
      `${baseurl}/plato/patients?clinic_guid=${guid}`,
      true,
      {}
    );
    if (data) {
      // handle both paginated { data: [...] } and plain array
      setPatients(Array.isArray(data) ? data : data.data ?? []);
    }
  }

  useEffect(() => {
    (async () => {
      setLoading(true);
      await Promise.all([fetchClinic(), fetchClinicians(), fetchPatients()]);
      setLoading(false);
    })();
  }, [guid]);

  // ─── Add Patient ──────────────────────────────────────────────────────────

  const togglePatientModal = () => {
    setPatientModal(!patientModal);
    setNewPatient({ name: "", email: "" });
    setPatientErrors({});
  };

  const validatePatient = () => {
    const errs = {};
    if (!newPatient.name.trim()) errs.name = "Name is required";
    if (!newPatient.email.trim()) errs.email = "Email is required";
    else if (!/^[\w-.]+@([\w-]+\.)+[\w-]{2,}$/.test(newPatient.email))
      errs.email = "Enter a valid email";
    return errs;
  };

  const handleAddPatient = async (e) => {
    e.preventDefault();
    const errs = validatePatient();
    if (Object.keys(errs).length) {
      setPatientErrors(errs);
      return;
    }
    setSaving(true);
    try {
      const created = await post(
        `${baseurl}/plato/patient`,
        { name: newPatient.name, email: newPatient.email, clinic: guid },
        true,
        {}
      );
      // Optimistic update: add directly to list, then refresh for consistency
      if (created) {
        setPatients((prev) => [...prev, created]);
      }
      await fetchPatients();
    } catch (err) {
      console.error("Failed to add patient:", err);
    } finally {
      setSaving(false);
      togglePatientModal();
    }
  };

  // ─── Table columns ────────────────────────────────────────────────────────

  const clinicianColumns = useMemo(
    () => [
      {
        Header: props.t("Name"),
        accessor: "name",
        Cell: ({ value }) => value || "—",
      },
      {
        Header: props.t("Email"),
        accessor: "email",
        Cell: ({ value }) => value || "—",
      },
      {
        Header: props.t("Role"),
        id: "role",
        Cell: ({ row }) => {
          const isAdmin = row.original.clinic_clinicians?.some(
            (rel) => rel.clinic_id === guid && rel.admin
          );
          return isAdmin ? (
            <Badge color="primary">Admin</Badge>
          ) : (
            <Badge color="secondary" className="bg-secondary">Clinician</Badge>
          );
        },
      },
      {
        Header: props.t("Status"),
        accessor: "disabled",
        Cell: ({ value }) =>
          value ? (
            <Badge color="danger">Inactive</Badge>
          ) : (
            <Badge color="success">Active</Badge>
          ),
      },
      {
        Header: "",
        id: "actions",
        Cell: ({ row }) => (
          <button
            className="btn btn-outline-primary btn-sm"
            onClick={() => navigate(`/clinician/${row.original.guid}`)}
          >
            {props.t("View")}
          </button>
        ),
      },
    ],
    [guid]
  );

  const patientColumns = useMemo(
    () => [
      {
        Header: props.t("Name"),
        accessor: "name",
        Cell: ({ value }) => value || "—",
      },
      {
        Header: props.t("Email"),
        accessor: "email",
        Cell: ({ value }) => value || "—",
      },
      {
        Header: props.t("Status"),
        accessor: "disabled",
        Cell: ({ value }) =>
          value ? (
            <Badge color="danger">Inactive</Badge>
          ) : (
            <Badge color="success">Active</Badge>
          ),
      },
      {
        Header: props.t("Active Treatment"),
        id: "treatment",
        Cell: ({ row }) => {
          const treatments = row.original.patient_treatments ?? [];
          const active = treatments.find((t) => !t.disabled && !t.completed);
          return active ? (
            <span className="text-body">{active.treatment_group?.name ?? "Assigned"}</span>
          ) : (
            <span className="text-muted">—</span>
          );
        },
      },
      {
        Header: "",
        id: "actions",
        Cell: ({ row }) => (
          <button
            className="btn btn-outline-primary btn-sm"
            onClick={() => navigate(`/patient/${row.original.guid}`)}
          >
            {props.t("View")}
          </button>
        ),
      },
    ],
    []
  );

  // ─── Render ───────────────────────────────────────────────────────────────

  if (loading) {
    return (
      <div className="page-content">
        <Container fluid>
          <div className="text-center mt-5">
            <div className="spinner-border text-primary" role="status" />
          </div>
        </Container>
      </div>
    );
  }

  return (
    <React.Fragment>
      <div className="page-content">
        <Container fluid>
          <Breadcrumbs
            title={props.t("User Management")}
            breadcrumbItem={clinic?.name ?? props.t("Clinic Detail")}
          />

          {/* Clinic info card */}
          <Card className="mb-4">
            <CardBody>
              <Row className="align-items-center">
                <Col md={8}>
                  <h4 className="mb-1">{clinic?.name}</h4>
                  <p className="text-muted mb-0">{clinic?.email}</p>
                </Col>
                <Col md={4} className="text-md-end mt-3 mt-md-0">
                  <span className="me-3 text-muted">
                    <i className="bx bx-globe me-1" />
                    {clinic?.country}
                  </span>
                  <span className="text-muted">
                    <i className="bx bx-tag me-1" />
                    {clinic?.signifier?.toUpperCase()}
                  </span>
                </Col>
              </Row>
            </CardBody>
          </Card>

          {/* Tabs */}
          <Card>
            <CardBody>
              <Nav tabs className="nav-tabs-custom mb-4">
                <NavItem>
                  <NavLink
                    className={classnames({ active: activeTab === "clinicians" })}
                    onClick={() => setActiveTab("clinicians")}
                    style={{ cursor: "pointer" }}
                  >
                    <i className="mdi mdi-doctor me-1" />
                    {props.t("Clinicians")}
                    <Badge color="light" className="ms-2 text-dark">
                      {clinicians.length}
                    </Badge>
                  </NavLink>
                </NavItem>
                <NavItem>
                  <NavLink
                    className={classnames({ active: activeTab === "patients" })}
                    onClick={() => setActiveTab("patients")}
                    style={{ cursor: "pointer" }}
                  >
                    <i className="bx bx-user me-1" />
                    {props.t("Patients")}
                    <Badge color="light" className="ms-2 text-dark">
                      {patients.length}
                    </Badge>
                  </NavLink>
                </NavItem>
              </Nav>

              <TabContent activeTab={activeTab}>
                {/* Clinicians tab */}
                <TabPane tabId="clinicians">
                  <LocalTableContainer
                    columns={clinicianColumns}
                    data={clinicians}
                    isGlobalFilter={true}
                    customPageSize={10}
                    className="custom-header-css"
                  />
                </TabPane>

                {/* Patients tab */}
                <TabPane tabId="patients">
                  <LocalTableContainer
                    columns={patientColumns}
                    data={patients}
                    isGlobalFilter={true}
                    onAddItemText={props.t("Add Patient")}
                    onAddItemClick={togglePatientModal}
                    customPageSize={10}
                    className="custom-header-css"
                  />
                </TabPane>
              </TabContent>
            </CardBody>
          </Card>
        </Container>
      </div>

      {/* Add Patient modal */}
      <Modal isOpen={patientModal} toggle={togglePatientModal}>
        <ModalHeader toggle={togglePatientModal} tag="h4">
          {props.t("Add Patient")}
        </ModalHeader>
        <ModalBody>
          <Form onSubmit={handleAddPatient}>
            <div className="mb-3">
              <Label>{props.t("Name")}</Label>
              <Input
                type="text"
                placeholder={props.t("Patient full name")}
                value={newPatient.name}
                onChange={(e) =>
                  setNewPatient({ ...newPatient, name: e.target.value })
                }
                invalid={!!patientErrors.name}
              />
              {patientErrors.name && (
                <FormFeedback>{patientErrors.name}</FormFeedback>
              )}
            </div>
            <div className="mb-3">
              <Label>{props.t("Email")}</Label>
              <Input
                type="email"
                placeholder={props.t("patient@email.com")}
                value={newPatient.email}
                onChange={(e) =>
                  setNewPatient({ ...newPatient, email: e.target.value })
                }
                invalid={!!patientErrors.email}
              />
              {patientErrors.email && (
                <FormFeedback>{patientErrors.email}</FormFeedback>
              )}
            </div>
            <p className="text-muted small mb-3">
              <i className="bx bx-info-circle me-1" />
              The patient will be assigned to <strong>{clinic?.name}</strong>.
            </p>
            <div className="text-end">
              <button
                type="button"
                className="btn btn-light me-2"
                onClick={togglePatientModal}
              >
                {props.t("Cancel")}
              </button>
              <button
                type="submit"
                className="btn btn-primary"
                disabled={saving}
              >
                {saving ? (
                  <i className="bx bx-loader-circle bx-spin me-1" />
                ) : null}
                {props.t("Add Patient")}
              </button>
            </div>
          </Form>
        </ModalBody>
      </Modal>
    </React.Fragment>
  );
};

ClinicDetail.propTypes = {
  t: PropTypes.any,
  router: PropTypes.any,
};

export default withRouter(withTranslation()(ClinicDetail));
