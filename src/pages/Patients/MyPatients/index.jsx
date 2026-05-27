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
import PatientsTable from "./MyPatientsTable";

import {
  addMyPatient,
  getMyPatients,
  disableMyPatient,
  enableMyPatient,
  updateMyPatient,
  clearPatientsError,
  resetPatientGuid,
} from "../../../store/patients/actions";

import { addMyPatient as addMyPatientApi } from "../../../api/clinician";

import {
  getMyClinics,
  cleanClinicsError,
} from "../../../store/clinics/actions";

import { showToast } from "../../../util/toast";
import getErrorMessage from "../../../api/error";
import { formatDate } from "../../../util/time";

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

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

const MyPatients = (props) => {
  document.title = `${props.t("My Patients")} | ${props.t("Platoscience")}`;

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

  // Safe table data — commit only on loading true→false transition
  const [tableData, setTableData] = useState([]);
  const [tablePagination, setTablePagination] = useState(undefined);
  const wasLoading = useRef(false);

  // Patient selected for modal actions
  const [selectedPatient, setSelectedPatient] = useState(null);
  const [editMode, setEditMode] = useState(false);

  // Modal visibility
  const [addModal, setAddModal] = useState(false);
  const [addCustomModal, setAddCustomModal] = useState(false);
  const [disableModal, setDisableModal] = useState(false);
  const [enableModal, setEnableModal] = useState(false);

  // Navigation guard after patient creation
  const [hasNavigated, setHasNavigated] = useState(false);
  const [pendingNav, setPendingNav] = useState(false);

  // Loading spinner for modals
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Redux
  const { my_clinics, clinics_error } = useSelector((state) => ({
    my_clinics: state.clinics.my_clinics,
    clinics_error: state.clinics.error,
  }));

  const { my_patients, my_pagination, patient_guid, loading, patients_error } =
    useSelector((state) => ({
      my_patients: state.patients.my_patients,
      my_pagination: state.patients.my_pagination,
      patient_guid: state.patients.guid_sucess,
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
    dispatch(getMyClinics());
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Fetch patients when pagination/search changes
  useEffect(() => {
    dispatch(getMyPatients(currentPage, pageSize, searchTerm));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentPage, pageSize, searchTerm]);

  // Commit to table on loading true→false transition
  useEffect(() => {
    if (loading) {
      wasLoading.current = true;
      return;
    }
    if (!loading && wasLoading.current) {
      wasLoading.current = false;
      setTableData(my_patients ?? []);
      setTablePagination(my_pagination);
    }
  }, [loading, my_patients, my_pagination]);

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
      setIsSubmitting(false);
      setTimeout(() => {
        navigate(`/patient/${patient_guid}`);
        dispatch(resetPatientGuid());
      }, 1000);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [patient_guid, hasNavigated, pendingNav]);

  // Reset form when add modal closes
  useEffect(() => {
    if (!addModal) {
      addFormik.resetForm();
      setEditMode(false);
      setSelectedPatient(null);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [addModal]);

  // Reset custom form when custom modal closes
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
    if (selectedPatient?.guid) dispatch(disableMyPatient(selectedPatient.guid));
    setSelectedPatient(null);
    setDisableModal(false);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedPatient]);

  const handleEnablePatient = useCallback(() => {
    if (selectedPatient?.guid) dispatch(enableMyPatient(selectedPatient.guid));
    setSelectedPatient(null);
    setEnableModal(false);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedPatient]);

  // ── No-clinic string ─────────────────────────────────────────────────────

  const NO_CLINIC = props.t("THERE IS NO CLINIC!");

  // ── Formik: Add / Edit Patient ────────────────────────────────────────────
  const addFormik = useFormik({
    enableReinitialize: true,
    initialValues: {
      name: selectedPatient?.name ?? "",
      email: selectedPatient?.email ?? "",
      clinic: selectedPatient?.clinic ?? "",
    },
    validationSchema: Yup.object({
      name: Yup.string().required(props.t("Please Enter Your Name")),
      email: Yup.string()
        .matches(
          /^[\w-\.]+@([\w-]+\.)+[\w-]{2,8}$/,
          props.t("Please Enter Valid Email"),
        )
        .required(props.t("Please Enter Your Email")),
    }),
    onSubmit: (values) => {
      if (editMode && selectedPatient) {
        dispatch(
          updateMyPatient({
            guid: selectedPatient.guid,
            name: values.name,
            email: values.email,
          }),
        );
        setAddModal(false);
        return;
      }
      setIsSubmitting(true);
      setPendingNav(true);
      dispatch(addMyPatient(values));
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
      setIsSubmitting(true);
      const clinicObj = my_clinics.find((c) => c.guid === values.clinic);
      const signifier =
        clinicObj?.signifier || slugSignifier(clinicObj?.name || "");
      const response = await addMyPatientApi({
        totalPatient: parseInt(values.totalPatient) || 1,
        clinic: values.clinic,
        type: "custom",
        signifier,
      });
      setIsSubmitting(false);
      if (response) {
        setAddCustomModal(false);
        dispatch(getMyPatients(currentPage, pageSize, searchTerm));
      }
    },
  });

  // ── Clinics dropdown options ───────────────────────────────────────────────
  const clinicOptions = useMemo(() => {
    if (!my_clinics?.length) return <option value="">{NO_CLINIC}</option>;
    return my_clinics.map((c) => (
      <option key={c.guid} value={c.guid}>{`${c.name} | ${c.country}`}</option>
    ));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [my_clinics]);

  // ── Number of patients selector ───────────────────────────────────────────
  const patientCountOptions = useMemo(() => {
    const options = [];
    for (let i = 1; i <= 10; i++) {
      if (i % 2 === 0 || i === 1) {
        options.push(
          <option key={i} value={i}>
            {i}
          </option>,
        );
      }
    }
    return options;
  }, []);

  // ── Table columns ─────────────────────────────────────────────────────────
  const columns = useMemo(
    () => [
      {
        key: "name",
        header: props.t("Name"),
        render: (row) => row.name || "—",
      },
      {
        key: "email",
        header: props.t("Username"),
        render: (row) => row.email || "—",
      },
      {
        key: "activeTreatment",
        header: props.t("Active Treatment"),
        render: (row) => {
          const treatments = row.patient_treatments ?? [];
          const hasActive = treatments.some((t) => t.disabled === false);
          return hasActive ? (
            <span className="badge ps-badge-active">Active</span>
          ) : (
            <span className="badge ps-badge-inactive">None</span>
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
    [handleOpenDisable, handleOpenEnable],
  );

  // Table action buttons
  const tableActions = (
    <>
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
            breadcrumbItem={props.t("My Patients")}
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
                    placeholder={props.t("Insert Name")}
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
                    placeholder={props.t("Insert Email")}
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
                  {isSubmitting && (
                    <i className="bx bx-loader-circle bx-spin font-size-24 mb-1 me-2" />
                  )}
                  <button type="submit" className="btn btn-success">
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
                    {patientCountOptions}
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
                  {isSubmitting && (
                    <i className="bx bx-loader-circle bx-spin font-size-24 mb-1 me-2" />
                  )}
                  <button type="submit" className="btn btn-success">
                    {props.t("Save")}
                  </button>
                </div>
              </Col>
            </Row>
          </Form>
        </ModalBody>
      </Modal>
    </React.Fragment>
  );
};

MyPatients.propTypes = {
  t: PropTypes.any,
};

export default withTranslation()(MyPatients);
