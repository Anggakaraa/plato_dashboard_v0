import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import PropTypes from "prop-types";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import {
  Badge,
  Button,
  Card,
  CardBody,
  Col,
  Container,
  Form,
  FormFeedback,
  Input,
  Label,
  Modal,
  ModalBody,
  ModalFooter,
  ModalHeader,
  Row,
} from "reactstrap";
import * as Yup from "yup";
import { useFormik } from "formik";
import { withTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";

import Breadcrumbs from "../../../components/Common/Breadcrumb";
import DisableItemModal from "../../../components/Common/DisableItemModal";
import EnableItemModal from "../../../components/Common/EnableItemModal";
import PatientsTable from "./PatientsTable";

import {
  addPatient,
  clearPatientsError,
  disablePatient,
  enablePatient,
  getPatients,
  resetPatientGuid,
  updatePatient,
} from "../../../store/patients/actions";

import {
  addPatient as addPatientApi,
  getPatients as getPatientsApi,
} from "../../../api/plato";

import { cleanClinicsError, getClinics } from "../../../store/clinics/actions";
import { Name, Email, CreateAt, UpdatedAt } from "../patients-item-list";
import { showToast } from "../../../util/toast";
import getErrorMessage from "../../../api/error";
import { formatDate } from "../../../util/time";
import { getExternal } from "../../../api/managerExternal";

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

const getUrlInt = (searchParams, key, fallback) => {
  const val = searchParams.get(key);
  const parsed = parseInt(val, 10);
  return isNaN(parsed) ? fallback : parsed;
};

const slugSignifier = (name) =>
  name
    .split(" ")
    .map((w) => w.charAt(0).toLowerCase())
    .join("");

const buildCsvBlob = (patients) => {
  const rows = patients.map((item) => ({
    Name: item.name || "",
    Email: item.email || "",
    Type: item.email?.includes("@plato.dashboard") ? "Default" : "Regular",
    Clinic: item.clinic_patients?.[0]?.clinic?.name || "N/A",
    AppCredential: item.patient_mobile_accesses?.[0]?.credential || "123456",
    Disable: item.disabled ? "Yes" : "No",
    CreatedAt: item.createdAt ? formatDate(item.createdAt) : "",
    UpdatedAt: item.updatedAt ? formatDate(item.updatedAt) : "",
  }));
  const headers = Object.keys(rows[0])
    .map((k) => `"${k}"`)
    .join(",");
  const body = rows
    .map((row) =>
      Object.values(row)
        .map((v) => `"${v}"`)
        .join(","),
    )
    .join("\n");
  return `${headers}\n${body}`;
};

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

const AllPatients = (props) => {
  document.title = `${props.t("All Patients")} | ${props.t("Platoscience")}`;

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();

  // URL-driven pagination state
  const [currentPage, setCurrentPage] = useState(() =>
    getUrlInt(searchParams, "page", 1),
  );
  const [pageSize] = useState(() => getUrlInt(searchParams, "limit", 10));
  const [searchTerm, setSearchTerm] = useState(
    () => searchParams.get("search") || "",
  );

  // Safe table data — never exposes stale Redux patients to the table until
  // a real fetch completes. Prevents react-table from processing thousands of
  // stale rows on SPA navigation.
  const [tableData, setTableData] = useState([]);
  const [tablePagination, setTablePagination] = useState(undefined);
  const wasLoading = useRef(false); // tracks loading true→false transition

  // UI state
  const [isExporting, setIsExporting] = useState(false);

  // Patient selected for modal actions
  const [selectedPatient, setSelectedPatient] = useState(null);
  const [editMode, setEditMode] = useState(false);

  // Modal visibility
  const [addModal, setAddModal] = useState(false);
  const [addCustomModal, setAddCustomModal] = useState(false);
  const [disableModal, setDisableModal] = useState(false);
  const [enableModal, setEnableModal] = useState(false);
  const [linkModal, setLinkModal] = useState(false);

  // Firebase link check state
  const [linkPatient, setLinkPatient] = useState(null);
  const [linkAuthStatus, setLinkAuthStatus] = useState(null); // null | true | false
  const [linkRealtimeStatus, setLinkRealtimeStatus] = useState(null);
  const [linkAuthMsg, setLinkAuthMsg] = useState("");
  const [linkRealtimeMsg, setLinkRealtimeMsg] = useState("");
  const [linkChecking, setLinkChecking] = useState(false);
  const [isMigrating, setIsMigrating] = useState(false);

  // Navigation guard after patient creation
  const [hasNavigated, setHasNavigated] = useState(false);
  const [pendingNav, setPendingNav] = useState(false);

  // Redux
  const { clinics, clinics_error } = useSelector((state) => ({
    clinics: state.clinics.clinics,
    clinics_error: state.clinics.error,
  }));

  const { patients, patient_guid, loading, patients_error, pagination } =
    useSelector((state) => ({
      patient_guid: state.patients.guid_sucess,
      patients: state.patients.patients,
      pagination: state.patients.pagination,
      loading: state.patients.loading,
      patients_error: state.patients.error,
    }));

  // ── Effects ───────────────────────────────────────────────────────────────

  // Sync URL params
  useEffect(() => {
    const params = new URLSearchParams();
    params.set("page", currentPage.toString());
    params.set("limit", pageSize.toString());
    if (searchTerm) params.set("search", searchTerm);
    setSearchParams(params, { replace: true });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentPage, pageSize, searchTerm]);

  // Load clinics once on mount
  useEffect(() => {
    dispatch(getClinics());
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Fetch patients when pagination/search changes
  useEffect(() => {
    dispatch(getPatients(currentPage, pageSize, searchTerm));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentPage, pageSize, searchTerm]);

  // Commit patients to table ONLY on loading true→false transition.
  // Using wasLoading ref prevents committing stale Redux data on mount
  // (when loading starts as false but patients may have thousands of rows
  // from a previous SPA session).
  useEffect(() => {
    if (loading) {
      wasLoading.current = true;
      return;
    }
    if (!loading && wasLoading.current) {
      wasLoading.current = false;
      setTableData(patients ?? []);
      setTablePagination(pagination);
    }
  }, [loading, patients, pagination]);

  // Error toasts
  useEffect(() => {
    if (clinics_error) {
      showToast("Error", getErrorMessage(props.t, clinics_error), () => {
        dispatch(cleanClinicsError());
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [clinics_error]);

  useEffect(() => {
    if (patients_error) {
      showToast("Error", getErrorMessage(props.t, patients_error), () => {
        dispatch(clearPatientsError());
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [patients_error]);

  // Navigate to patient detail after creation
  useEffect(() => {
    if (patient_guid && !hasNavigated && pendingNav) {
      setHasNavigated(true);
      addFormik.resetForm();
      setAddModal(false);
      setTimeout(() => {
        navigate(`/patient/${patient_guid}`);
        dispatch(resetPatientGuid());
      }, 1000);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [patient_guid, hasNavigated, pendingNav]);

  // Reset form when modal closes
  useEffect(() => {
    if (!addModal) {
      addFormik.resetForm();
      setEditMode(false);
      setSelectedPatient(null);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [addModal]);

  useEffect(() => {
    if (!addCustomModal) customFormik.resetForm();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [addCustomModal]);

  // ── Handlers ─────────────────────────────────────────────────────────────

  const handlePageChange = useCallback((page) => setCurrentPage(page), []);

  const handleSearch = useCallback((search) => {
    setSearchTerm(search);
    setCurrentPage(1);
  }, []);

  const handleOpenAdd = useCallback(() => {
    setSelectedPatient(null);
    setEditMode(false);
    setAddModal(true);
  }, []);

  const handleOpenAddCustom = useCallback(() => setAddCustomModal(true), []);

  const handleOpenDisable = useCallback((patient) => {
    setSelectedPatient(patient);
    setDisableModal(true);
  }, []);

  const handleOpenEnable = useCallback((patient) => {
    setSelectedPatient(patient);
    setEnableModal(true);
  }, []);

  const handleDisablePatient = useCallback(() => {
    if (selectedPatient?.guid) dispatch(disablePatient(selectedPatient.guid));
    setSelectedPatient(null);
    setDisableModal(false);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedPatient]);

  const handleEnablePatient = useCallback(() => {
    if (selectedPatient?.guid) dispatch(enablePatient(selectedPatient.guid));
    setSelectedPatient(null);
    setEnableModal(false);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedPatient]);

  // Firebase link check
  const runLinkCheck = useCallback(async (patient) => {
    const uid = patient.firebase_patients?.[0]?.firebase_uid;
    if (!uid) return;
    setLinkAuthStatus(null);
    setLinkRealtimeStatus(null);
    setLinkAuthMsg("");
    setLinkRealtimeMsg("");
    setLinkChecking(true);
    try {
      const [authRes, realtimeRes] = await Promise.all([
        getExternal(`/firebase/check/user-authentication/${uid}`, true),
        getExternal(`/firebase/check/user-realtime/${uid}`, true),
      ]);
      setLinkAuthStatus(authRes.exist);
      setLinkRealtimeStatus(realtimeRes.exist);
      setLinkAuthMsg(authRes.message);
      setLinkRealtimeMsg(realtimeRes.message);
    } finally {
      setLinkChecking(false);
    }
  }, []);

  const handleOpenFirebaseLink = useCallback(
    (patient) => {
      setLinkPatient(patient);
      setLinkModal(true);
      setTimeout(() => runLinkCheck(patient), 1500);
    },
    [runLinkCheck],
  );

  const handleStartMigration = useCallback(async () => {
    if (!linkPatient) return;
    setIsMigrating(true);
    let treatment = "default";
    if (linkPatient.patient_treatments?.length > 0) {
      const active = linkPatient.patient_treatments.find((t) => !t.disabled);
      if (active) {
        const clinicId = linkPatient.clinic_patients?.[0]?.clinic_id;
        const clinicianId =
          linkPatient.clinic_patients?.[0]?.clinic?.clinic_clinicians?.[0]
            ?.clinician_id;
        treatment = `clinic-${clinicId}-clinician-${clinicianId}-patient-${linkPatient.id}-treatment-${active.id}`;
      }
    }
    const uid = linkPatient.firebase_patients?.[0]?.firebase_uid;
    await getExternal(
      `/firebase/sync/prod-to-legacy/${uid}/${treatment}`,
      true,
    );
    setIsMigrating(false);
    runLinkCheck(linkPatient);
  }, [linkPatient, runLinkCheck]);

  // Export CSV
  const handleExportCsv = useCallback(async () => {
    setIsExporting(true);
    try {
      const response = await getPatientsApi(
        undefined,
        undefined,
        undefined,
        searchTerm,
      );
      const all = response?.data || response || [];
      if (!all.length) {
        showToast("Warning", props.t("No patients to export"), () => {});
        return;
      }
      const csv = buildCsvBlob(all);
      const a = document.createElement("a");
      a.href = URL.createObjectURL(new Blob([csv], { type: "text/csv" }));
      const filename = searchTerm
        ? `patients_search_${searchTerm.substring(0, 20)}.csv`
        : "patients.csv";
      a.setAttribute("download", filename);
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      showToast(
        props.t("Success"),
        props.t(`Exported ${all.length} patients`),
        () => {},
        "success",
      );
    } catch {
      showToast(
        props.t("Error"),
        props.t("Failed to export patients"),
        () => {},
        "error",
      );
    } finally {
      setIsExporting(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchTerm]);

  // ── Formik: Add / Edit Patient ────────────────────────────────────────────
  const addFormik = useFormik({
    enableReinitialize: true,
    initialValues: {
      name: selectedPatient?.name ?? "",
      email: selectedPatient?.email ?? "",
      password: "",
      clinic: selectedPatient?.clinic ?? "",
    },
    validationSchema: Yup.object({
      name: Yup.string().required(props.t("Please Enter Your Name")),
      password: Yup.string().min(
        6,
        props.t("Password must be at least 6 characters long"),
      ),
      email: Yup.string()
        .matches(
          /^[\w-+.]+@([\w-]+\.)+[\w-]{2,8}$/,
          props.t("Please Enter Valid Email"),
        )
        .required(props.t("Please Enter Your Email")),
    }),
    onSubmit: async (values) => {
      if (editMode && selectedPatient) {
        dispatch(
          updatePatient({
            guid: selectedPatient.guid,
            name: values.name,
            email: values.email,
            password: values.password,
          }),
        );
        setAddModal(false);
        return;
      }
      setPendingNav(true);
      dispatch(addPatient(values));
    },
  });

  // ── Formik: Add Default (Custom) Patients ─────────────────────────────────
  const customFormik = useFormik({
    enableReinitialize: true,
    initialValues: { totalPatient: 1, clinic: "" },
    validationSchema: Yup.object({
      totalPatient: Yup.number().required(
        props.t("Please Enter the total of patients"),
      ),
      clinic: Yup.string().required(props.t("Please Select a Clinic")),
    }),
    onSubmit: async (values) => {
      const clinicObj = clinics.find((c) => c.guid === values.clinic);
      const signifier =
        clinicObj?.signifier || slugSignifier(clinicObj?.name || "");
      const response = await addPatientApi({
        totalPatient: parseInt(values.totalPatient) || 1,
        clinic: values.clinic,
        type: "custom",
        signifier,
      });
      if (response) {
        setAddCustomModal(false);
        dispatch(getPatients(currentPage, pageSize, searchTerm));
      }
    },
  });

  // ── Clinics dropdown options ───────────────────────────────────────────────
  const clinicOptions = useMemo(() => {
    if (!clinics?.length)
      return <option value="">{props.t("THERE IS NO CLINIC!")}</option>;
    return clinics.map((c) => (
      <option key={c.guid} value={c.guid}>{`${c.name} | ${c.country}`}</option>
    ));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [clinics]);

  // ── Table columns ─────────────────────────────────────────────────────────
  // Each column has: key (unique), header, render(row, rowIdx)
  // Using plain HTML title attribute instead of UncontrolledTooltip to avoid
  // the Reactstrap popper.js overhead that was crashing the browser.
  const columns = useMemo(
    () => [
      {
        key: "name",
        header: props.t("Name"),
        render: (row) => row.name || "—",
      },
      {
        key: "email",
        header: props.t("Email"),
        render: (row) => row.email || "—",
      },
      {
        key: "type",
        header: props.t("Type"),
        render: (row) =>
          row.email?.includes("@platoscience.clinic") ? (
            <Badge color="secondary" className="fs-6">Default</Badge>
          ) : (
            <Badge color="info" className="fs-6">Regular</Badge>
          ),
      },
      {
        key: "clinic",
        header: props.t("Clinic"),
        render: (row) => row.clinic_patients?.[0]?.clinic?.name ?? "No Clinic",
      },
      {
        key: "activeTreatments",
        header: props.t("Active Treatment"),
        render: (row) => {
          const active = row.patient_treatments?.find(
            (t) => !t.disabled && !t.completed
          );
          const name = active?.treatment_group?.name ?? active?.name ?? null;
          return name ? (
            <Badge color="success" className="fs-6">{name}</Badge>
          ) : (
            <span className="text-muted">—</span>
          );
        },
      },
      {
        key: "createdAt",
        header: props.t("CreatedAt"),
        render: (row) => (row.createdAt ? formatDate(row.createdAt) : "—"),
      },
      {
        key: "updatedAt",
        header: props.t("UpdatedAt"),
        render: (row) => (row.updatedAt ? formatDate(row.updatedAt) : "—"),
      },
      {
        key: "firebaseLink",
        header: props.t("Check RN Link"),
        render: (row) => {
          const uid = row.firebase_patients?.[0]?.firebase_uid;
          if (!uid)
            return (
              <Badge color="primary" className="fs-6">
                Creating...
              </Badge>
            );
          return (
            <div className="d-flex align-items-center justify-content-center">
              <Link
                to="#"
                className="text-info"
                title={props.t("Check React/firebase link")}
                onClick={() => handleOpenFirebaseLink(row)}
              >
                <i className="mdi mdi-react font-size-18" />
              </Link>
            </div>
          );
        },
      },
      {
        key: "active",
        header: props.t("Active"),
        render: (row) => {
          const isActive = row.disabled === false;
          return (
            <div className="d-flex align-items-center justify-content-center">
              <Link
                to="#"
                className={isActive ? "text" : "text-danger"}
                title={`${props.t("Enable/Disable")} ${props.t("Patient")}`}
                onClick={() =>
                  isActive ? handleOpenDisable(row) : handleOpenEnable(row)
                }
              >
                <i
                  className={
                    isActive
                      ? "mdi mdi-check-circle font-size-18"
                      : "mdi mdi-close-circle font-size-18"
                  }
                />
              </Link>
            </div>
          );
        },
      },
      {
        key: "detail",
        header: "Detail",
        render: (row) => (
          <div className="d-flex align-items-center justify-content-center">
            <Link
              to={`/patient/${row.guid}`}
              className="text-primary"
              title={props.t("Show patient details")}
            >
              <i className="mdi mdi-clipboard-text-outline font-size-18" />
            </Link>
          </div>
        ),
      },
      {
        key: "reports",
        header: "Reports",
        render: (row) => (
          <div className="d-flex align-items-center justify-content-center">
            <Link
              to={`/patient/reports/${row.id * 99}-${row.guid}`}
              className="text-primary"
              title={props.t("Show patient reports")}
            >
              <i className="mdi mdi-chart-bar font-size-18" />
            </Link>
          </div>
        ),
      },
    ],
    [handleOpenFirebaseLink, handleOpenDisable, handleOpenEnable],
  );

  // Table action buttons (toolbar)
  const tableActions = (
    <>
      <Button
        color="secondary"
        onClick={handleExportCsv}
        disabled={isExporting}
      >
        <i className="mdi mdi-download me-1" />
        {props.t("Export")}
      </Button>
      <Button color="secondary" onClick={handleOpenAddCustom}>
        <i className="mdi mdi-plus me-1" />
        {props.t("Add Default Patient")}
      </Button>
      <Button color="primary" onClick={handleOpenAdd}>
        <i className="mdi mdi-plus me-1" />
        {props.t("Add Patient")}
      </Button>
    </>
  );

  // ── Render ────────────────────────────────────────────────────────────────
  return (
    <React.Fragment>
      <DisableItemModal
        show={disableModal}
        itemText="Patient"
        onDisableClick={handleDisablePatient}
        onCloseClick={() => setDisableModal(false)}
      />
      <EnableItemModal
        show={enableModal}
        itemText="Patient"
        onEnableClick={handleEnablePatient}
        onCloseClick={() => setEnableModal(false)}
      />

      <div className="page-content">
        <Container fluid>
          <Breadcrumbs
            title={props.t("Patient")}
            breadcrumbItem={props.t("All Patients")}
          />
          <Card>
            <CardBody>
              <PatientsTable
                columns={columns}
                data={tableData}
                isLoading={
                  loading || (!wasLoading.current && tableData.length === 0)
                }
                pageSize={pageSize}
                paginationData={tablePagination}
                onPageChange={handlePageChange}
                onSearch={handleSearch}
                actions={tableActions}
              />
            </CardBody>
          </Card>
        </Container>
      </div>

      {/* ── Add / Edit Patient Modal ───────────────────────────────── */}
      <Modal isOpen={addModal} toggle={() => setAddModal((v) => !v)}>
        <ModalHeader toggle={() => setAddModal((v) => !v)} tag="h4">
          {editMode ? props.t("Edit Patient") : props.t("Add Patient")}
        </ModalHeader>
        <ModalBody>
          <Form
            onSubmit={(e) => {
              e.preventDefault();
              addFormik.handleSubmit();
            }}
          >
            <Row>
              <Col xs={12}>
                <div className="mb-3">
                  <Label className="form-label">{props.t("Name")}</Label>
                  <Input
                    name="name"
                    type="text"
                    onChange={addFormik.handleChange}
                    onBlur={addFormik.handleBlur}
                    value={addFormik.values.name}
                    invalid={
                      !!(addFormik.touched.name && addFormik.errors.name)
                    }
                  />
                  {addFormik.touched.name && addFormik.errors.name && (
                    <FormFeedback type="invalid">
                      {addFormik.errors.name}
                    </FormFeedback>
                  )}
                </div>
                <div className="mb-3">
                  <Label className="form-label">{props.t("Email")}</Label>
                  <Input
                    name="email"
                    type="email"
                    onChange={addFormik.handleChange}
                    onBlur={addFormik.handleBlur}
                    value={addFormik.values.email}
                    invalid={
                      !!(addFormik.touched.email && addFormik.errors.email)
                    }
                  />
                  {addFormik.touched.email && addFormik.errors.email && (
                    <FormFeedback type="invalid">
                      {addFormik.errors.email}
                    </FormFeedback>
                  )}
                </div>
                <div className="mb-3">
                  <Label className="form-label">{props.t("Password")}</Label>
                  <Input
                    name="password"
                    type="password"
                    onChange={addFormik.handleChange}
                    onBlur={addFormik.handleBlur}
                    value={addFormik.values.password}
                    invalid={
                      !!(
                        addFormik.touched.password && addFormik.errors.password
                      )
                    }
                  />
                  {addFormik.touched.password && addFormik.errors.password && (
                    <FormFeedback type="invalid">
                      {addFormik.errors.password}
                    </FormFeedback>
                  )}
                </div>
                {!editMode && (
                  <div className="mb-3">
                    <Label className="form-label">{props.t("Clinic")}</Label>
                    <Input
                      type="select"
                      name="clinic"
                      className="form-select"
                      onChange={addFormik.handleChange}
                      onBlur={addFormik.handleBlur}
                      value={addFormik.values.clinic}
                      invalid={
                        !!(addFormik.touched.clinic && addFormik.errors.clinic)
                      }
                    >
                      <option value="" hidden />
                      {clinicOptions}
                    </Input>
                    {addFormik.touched.clinic && addFormik.errors.clinic && (
                      <FormFeedback type="invalid">
                        {addFormik.errors.clinic}
                      </FormFeedback>
                    )}
                  </div>
                )}
              </Col>
            </Row>
            <Row>
              <Col>
                <div className="text-end">
                  <button type="submit" className="btn btn-primary">
                    {props.t("Save")}
                  </button>
                </div>
              </Col>
            </Row>
          </Form>
        </ModalBody>
      </Modal>

      {/* ── Add Default Patients Modal ─────────────────────────────── */}
      <Modal
        isOpen={addCustomModal}
        toggle={() => setAddCustomModal((v) => !v)}
      >
        <ModalHeader toggle={() => setAddCustomModal((v) => !v)} tag="h4">
          {props.t("Add Default Patients")}
        </ModalHeader>
        <ModalBody>
          <Form
            onSubmit={(e) => {
              e.preventDefault();
              customFormik.handleSubmit();
            }}
          >
            <Row>
              <Col xs={12}>
                <div className="mb-3">
                  <Label className="form-label">
                    {props.t("How many patients do you want to create?")}
                  </Label>
                  <Input
                    name="totalPatient"
                    type="select"
                    className="form-select"
                    onChange={customFormik.handleChange}
                    onBlur={customFormik.handleBlur}
                    value={customFormik.values.totalPatient}
                    invalid={
                      !!(
                        customFormik.touched.totalPatient &&
                        customFormik.errors.totalPatient
                      )
                    }
                  >
                    {[1, 2, 4, 6, 8, 10].map((n) => (
                      <option key={n} value={n}>
                        {n}
                      </option>
                    ))}
                  </Input>
                  {customFormik.touched.totalPatient &&
                    customFormik.errors.totalPatient && (
                      <FormFeedback type="invalid">
                        {customFormik.errors.totalPatient}
                      </FormFeedback>
                    )}
                </div>
                <div className="mb-3">
                  <Label className="form-label">{props.t("Clinic")}</Label>
                  <Input
                    type="select"
                    name="clinic"
                    className="form-select"
                    onChange={customFormik.handleChange}
                    onBlur={customFormik.handleBlur}
                    value={customFormik.values.clinic}
                    invalid={
                      !!(
                        customFormik.touched.clinic &&
                        customFormik.errors.clinic
                      )
                    }
                  >
                    <option value="" hidden />
                    {clinicOptions}
                  </Input>
                  {customFormik.touched.clinic &&
                    customFormik.errors.clinic && (
                      <FormFeedback type="invalid">
                        {customFormik.errors.clinic}
                      </FormFeedback>
                    )}
                </div>
              </Col>
            </Row>
            <Row>
              <Col>
                <div className="text-end">
                  <button type="submit" className="btn btn-primary">
                    {props.t("Save")}
                  </button>
                </div>
              </Col>
            </Row>
          </Form>
        </ModalBody>
      </Modal>

      {/* ── Firebase Link Modal ────────────────────────────────────── */}
      <Modal
        isOpen={linkModal}
        toggle={() => setLinkModal((v) => !v)}
        backdrop="static"
        size="lg"
      >
        <ModalHeader toggle={() => setLinkModal((v) => !v)} tag="h4">
          Check Firebase Link for {linkPatient?.name}
        </ModalHeader>
        <ModalBody>
          <Row>
            <Col>
              <div className="p-2">
                Checking Firebase Auth:{" "}
                {linkChecking ? (
                  <i className="bx bx-loader-circle bx-spin text-primary font-size-24" />
                ) : (
                  <i
                    className={`bx font-size-24 ${linkAuthStatus ? "bxs-user-check text-success" : "bxs-error-alt text-danger"}`}
                  />
                )}
              </div>
              {!linkChecking && linkAuthMsg && (
                <p
                  className={`p-2 alert alert-${linkAuthStatus ? "success" : "danger"}`}
                >
                  {linkAuthMsg}
                </p>
              )}
            </Col>
            <Col>
              <div className="p-2">
                Checking Firebase Realtime DB:{" "}
                {linkChecking ? (
                  <i className="bx bx-loader-circle bx-spin text-primary font-size-24" />
                ) : (
                  <i
                    className={`bx font-size-24 ${linkRealtimeStatus ? "bxs-user-check text-success" : "bxs-error-alt text-danger"}`}
                  />
                )}
              </div>
              {!linkChecking && linkRealtimeMsg && (
                <p
                  className={`p-2 alert alert-${linkRealtimeStatus ? "success" : "danger"}`}
                >
                  {linkRealtimeMsg}
                </p>
              )}
            </Col>
          </Row>
          {!linkChecking &&
            linkAuthStatus === true &&
            linkRealtimeStatus === true && (
              <Row>
                <Col>
                  <p className="p-2 alert alert-info">
                    Everything is fine here!
                  </p>
                </Col>
              </Row>
            )}
          {!linkChecking &&
            linkAuthStatus !== null &&
            !(linkAuthStatus && linkRealtimeStatus) && (
              <Row>
                <Col>
                  <div className="p-2">
                    Do you want to link right now?{" "}
                    {isMigrating ? (
                      <i className="bx bx-loader-circle bx-spin text-primary font-size-24" />
                    ) : (
                      <Button
                        color="info"
                        size="sm"
                        onClick={handleStartMigration}
                      >
                        Start link
                      </Button>
                    )}
                  </div>
                </Col>
              </Row>
            )}
        </ModalBody>
        <ModalFooter>
          <Button color="secondary" onClick={() => setLinkModal(false)}>
            Close
          </Button>
        </ModalFooter>
      </Modal>
    </React.Fragment>
  );
};

AllPatients.propTypes = { t: PropTypes.any };

export default withTranslation()(AllPatients);
