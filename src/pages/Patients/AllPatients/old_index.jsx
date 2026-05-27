import React, { useEffect, useState, useRef, useMemo } from "react";
import PropTypes from "prop-types";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import {
  Card,
  CardBody,
  Col,
  Container,
  Row,
  Modal,
  ModalHeader,
  ModalBody,
  Label,
  FormFeedback,
  UncontrolledTooltip,
  Input,
  Form,
  Badge,
  Button,
  ModalFooter,
} from "reactstrap";
import * as Yup from "yup";
import { useFormik } from "formik";
import { withTranslation } from "react-i18next";
import PlatoTableContainer from "../../../components/Common/PlatoTableContainer";

import Breadcrumbs from "../../../components/Common/Breadcrumb";
import DisableItemModal from "../../../components/Common/DisableItemModal";
import EnableItemModal from "../../../components/Common/EnableItemModal";

import {
  addPatient,
  getPatients,
  disablePatient,
  enablePatient,
  updatePatient,
  clearPatientsError,
  addPatientSuccess,
  resetPatientGuid,
} from "../../../store/patients/actions";

import {
  addPatient as addPatientApi,
  getPatients as getPatientsApi,
} from "../../../api/plato";

import { getClinics, cleanClinicsError } from "../../../store/clinics/actions";

import { useSelector, useDispatch } from "react-redux";
import { CreateAt, Id, Email, Name, UpdatedAt } from "../patients-item-list";
import { showToast } from "../../../util/toast";
import getErrorMessage from "../../../api/error";
import { formatDate } from "../../../util/time";
import { getExternal } from "../../../api/managerExternal";

const AllPatients = (props) => {
  document.title = `${props.t("All Patients")} | ${props.t("Platoscience")}`;

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();

  const [patient, setPatient] = useState(undefined);

  const [hasNavigate, setHasNavigate] = useState(false);
  const [isLoading, setIsLoading] = useState("hidden");
  const [isDefault, setDefault] = useState(true);

  const [modal, setModal] = useState(false);
  const [customModal, setCustomModal] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [linkModal, setLinkModal] = useState(false);
  const [dataLink, setDataLink] = useState(undefined);

  const [linkLoading, setLinkLoading] = useState("");
  const [checkMessage, setCheckMessage] = useState("");
  const [showStartMigranting, setShowStartMigranting] = useState("hidden");
  const [showMessage, setShowMessage] = useState("hidden");
  const [messageType, setMessageType] = useState("success");

  const [linkLoading2, setLinkLoading2] = useState("");
  const [checkMessage2, setCheckMessage2] = useState("");
  const [showStartMigranting2, setShowStartMigranting2] = useState("hidden");
  const [showMessage2, setShowMessage2] = useState("hidden");
  const [messageType2, setMessageType2] = useState("success");

  const [hasAuth, setHasAuth] = useState(false);
  const [hasRealtime, setHasRealtime] = useState(false);

  const [isOk, setIsOk] = useState("hidden");
  const [isMigrating, setIsMigrating] = useState(false);

  // Get initial values from URL or use defaults
  const getInitialPage = () => {
    const pageParam = searchParams.get("page");
    return pageParam ? parseInt(pageParam) : 1;
  };

  const getInitialPageSize = () => {
    const limitParam = searchParams.get("limit");
    return limitParam ? parseInt(limitParam) : 10;
  };

  const getInitialSearch = () => {
    return searchParams.get("search") || "";
  };

  // Pagination state - initialized from URL
  const [currentPage, setCurrentPage] = useState(getInitialPage());
  const [pageSize, setPageSize] = useState(getInitialPageSize());
  const [searchTerm, setSearchTerm] = useState(getInitialSearch());

  // Update URL when state changes
  useEffect(() => {
    const params = new URLSearchParams();
    params.set("page", currentPage.toString());
    params.set("limit", pageSize.toString());
    if (searchTerm) {
      params.set("search", searchTerm);
    }
    setSearchParams(params, { replace: true });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentPage, pageSize, searchTerm]);

  const NO_CLINIC = props.t("THERE IS NO CLINIC!");
  const isValidClinic = (value) => value !== NO_CLINIC;

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

  const startLinkcheck = async (item) => {
    const [request, request2] = await Promise.all([
      await getExternal(
        `/firebase/check/user-authentication/${item.firebase_patients[0].firebase_uid}`,
        true,
      ),
      await getExternal(
        `/firebase/check/user-realtime/${item.firebase_patients[0].firebase_uid}`,
        true,
      ),
    ]);

    if (request.exist == true) {
      setLinkLoading("bxs-user-check text-success");
      setMessageType("success");
      setShowMessage("");
    } else {
      setLinkLoading("bxs-error-alt text-danger");
      setShowStartMigranting("");
      setMessageType("danger");
      setShowMessage("");
    }
    if (request2.exist == false) {
      setLinkLoading2("bxs-error-alt text-danger");
      setShowStartMigranting2("");
      setMessageType2("danger");
      setShowMessage2("");
    } else {
      setLinkLoading2("bxs-user-check text-success");
      setMessageType2("success");
      setShowMessage2("");
    }
    setCheckMessage(request.message);
    setCheckMessage2(request2.message);
    console.log(request.exist);
    setHasAuth(request.exist);
    setHasRealtime(request2.exist);

    if (request.exist === true && request2.exist === true) {
      setIsOk("");
    } else if (request.exist === true && request2.exist === false) {
      setShowStartMigranting("hidden");
    } else {
      setShowStartMigranting("");
    }
  };

  const startLinkMigration = async (item) => {
    setIsMigrating(true);
    let treatment = "default";
    if (item.patient_treatments.length > 0) {
      const activeTreatment = item.patient_treatments.find(
        (treatment) => treatment.disabled === false,
      );
      treatment = `clinic-${item.clinic_patients[0].clinic_id}-clinician-${item.clinic_patients[0].clinic.clinic_clinicians[0].clinician_id}-patient-${item.id}-treatment-${activeTreatment.id}`;
    }
    const request = await getExternal(
      `/firebase/sync/prod-to-legacy/${item.firebase_patients[0].firebase_uid}/${treatment}`,
      true,
    );
    resetOptionsforLinkcheck();
    setIsMigrating(false);
    startLinkcheck(item);
  };

  const validation = useFormik({
    enableReinitialize: true,

    initialValues: {
      name: (patient && patient.name) || undefined,
      email: (patient && patient.email) || undefined,
      password: (patient && patient.password) || undefined,
      clinic: (patient && patient.clinic) || undefined,
    },
    validationSchema: Yup.object({
      name: Yup.string().required(props.t("Please Enter Your Name")),
      password: Yup.string().min(
        6,
        props.t("Password must be at least 6 characters long"),
      ),
      email: Yup.string()
        .matches(
          /^[\w-+\.]+@([\w-]+\.)+[\w-]{2,8}$/,
          props.t("Please Enter Valid Email"),
        )
        .required(props.t("Please Enter Your Email")),
    }),
    onSubmit: async (values) => {
      setIsLoading("");
      setDefault(false);
      const { name, email, password, clinic } = values;
      let data = { name, email, password, clinic };

      if (editMode) {
        data = {
          guid: patient.guid,
          name: data.name,
          email: data.email,
          password: data.password,
        };
        dispatch(updatePatient(data));
        validation.resetForm();
        setEditMode(false);
        toggleModal();
        return;
      }

      dispatch(addPatient(data));
    },
  });

  const slugSignifier = (name) => {
    return name
      .split(" ")
      .map((word) => word.charAt(0).toLowerCase())
      .join("");
  };

  const validationCustom = useFormik({
    enableReinitialize: true,
    initialValues: {
      totalPatient: 0,
      clinic: undefined,
    },
    validationSchema: Yup.object({
      totalPatient: Yup.number().required(
        props.t("Please Enter the total of patients"),
      ),
      clinic: Yup.string().required(props.t("Please Select a Clinic")),
    }),
    onSubmit: async (values) => {
      setDefault(true);
      setIsLoading("");
      const { totalPatient, clinic } = values;
      let signifier = clinics.find((c) => c.guid === clinic).signifier;
      const clinicName = clinics.find((c) => c.guid === clinic).name;
      if (!signifier) {
        signifier = slugSignifier(clinicName);
      }
      let data = {
        totalPatient: parseInt(totalPatient == 0 ? 1 : totalPatient),
        clinic,
        type: "custom",
        signifier,
      };

      await addPatientApi(data).then((response) => {
        if (response) {
          setIsLoading("hidden");
          setCustomModal(false);
          toggleCustomModal();
          dispatch(getPatients(currentPage, pageSize, searchTerm));
        }
      });
    },
  });

  useEffect(() => {
    if (!modal) validation.resetForm();
  }, [modal]);

  useEffect(() => {
    if (!customModal) validationCustom.resetForm();
  }, [customModal]);

  /**
   * Redirect user to the patient details
   */
  useEffect(() => {
    if (patient_guid && !hasNavigate && !isDefault) {
      validation.resetForm();
      toggleModal();
      setIsLoading("hidden");
      setTimeout(() => {
        navigate(`/patient/${patient_guid}`);
        dispatch(resetPatientGuid());
      }, 1000);
    }
  }, [patient_guid, hasNavigate]);

  // Load clinics only once on mount
  useEffect(() => {
    dispatch(getClinics());
  }, []);

  // Load patients when pagination/search changes
  useEffect(() => {
    dispatch(getPatients(currentPage, pageSize, searchTerm));
  }, [currentPage, pageSize, searchTerm]);

  useEffect(() => {
    if (clinics_error) {
      showToast("Error", getErrorMessage(props.t, clinics_error), () => {
        dispatch(cleanClinicsError());
      });
    }
  }, [clinics_error]);

  useEffect(() => {
    if (patients_error) {
      showToast("Error", getErrorMessage(props.t, patients_error), () => {
        dispatch(clearPatientsError());
      });
    }
  }, [patients_error]);

  // Handler for page change
  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  // Handler for search
  const handleSearch = (search) => {
    setSearchTerm(search);
    setCurrentPage(1);
  };

  const columns = useMemo(
    () => [
      {
        Header: props.t("Name"),
        accessor: "name",
        Cell: (cellProps) => {
          if (cellProps.row.original.name) {
            return <Name {...cellProps} />;
          }
        },
      },
      {
        Header: props.t("Email"),
        accessor: "email",
        Cell: (cellProps) => {
          if (cellProps.row.original.email) {
            return <Email {...cellProps} />;
          }
        },
      },
      {
        Header: props.t("Type"),
        Cell: (cellProps) => {
          return cellProps.row.original.email?.includes(
            "@platoscience.clinic",
          ) ? (
            <Badge color="primary" className="fs-6 text">
              Default
            </Badge>
          ) : (
            <Badge color="info" className="fs-6 text">
              Regular{" "}
              {cellProps.row.original.legacy ? (
                <Link className="text-primary">
                  <i className="mdi mdi-react" />
                </Link>
              ) : (
                ""
              )}
            </Badge>
          );
        },
      },
      {
        Header: props.t("Clinic"),
        accessor: "clinic_patients[0].clinic.name",
        Cell: (cellProps) => {
          return cellProps.row.original.clinic_patients &&
            cellProps.row.original.clinic_patients[0]
            ? cellProps.row.original?.clinic_patients[0].clinic.name
            : "No Clinic";
        },
      },
      {
        Header: props.t("Active Treatments"),
        Cell: (cellProps) => {
          const patient = cellProps.row.original;

          const hasActiveCustomTreatment = patient.patient_treatments?.some(
            (treatment) => !treatment.disabled && treatment.started_at !== null,
          );

          if (hasActiveCustomTreatment) {
            return (
              <Badge color="primary" className="fs-6 text">
                Custom
              </Badge>
            );
          }

          const isLearnCreate =
            patient.native || patient.legacy || patient.migrated;

          if (isLearnCreate) {
            return (
              <Badge color="success" className="fs-6 text">
                Learn/Create
              </Badge>
            );
          }
          // If no active custom treatment and not Learn/Create, it's Left/Right
          return (
            <Badge color="info" className="fs-6 text">
              Left/Right
            </Badge>
          );
        },
      },
      {
        Header: props.t("CreatedAt"),
        accessor: "createdAt",
        Cell: (cellProps) => {
          if (cellProps.row.original.createdAt) {
            return <CreateAt {...cellProps} />;
          }
        },
      },
      {
        Header: props.t("UpdatedAt"),
        accessor: "updatedAt",

        Cell: (cellProps) => {
          if (cellProps.row.original.updatedAt) {
            return <UpdatedAt {...cellProps} />;
          }
        },
      },
      {
        Header: props.t("Check RN Link"),

        Cell: (cellProps) => {
          const item = cellProps.row.original;
          const rowIdx = cellProps.row.index;
          if (
            cellProps.row.original?.firebase_patients &&
            cellProps.row.original?.firebase_patients[0]?.firebase_uid
          ) {
            return (
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <Link
                  to="#"
                  className="text-info"
                  onClick={() => {
                    onClickFirebaseLink(item);
                  }}
                >
                  <i
                    className="mdi mdi-react font-size-18"
                    id={`firebasetooltip-${rowIdx}`}
                  />
                  <UncontrolledTooltip
                    placement="top"
                    target={`firebasetooltip-${rowIdx}`}
                  >
                    {props.t("Check React/firebase link")}
                  </UncontrolledTooltip>
                </Link>
              </div>
            );
          } else {
            return (
              <Badge color="primary" className="fs-6 text">
                Creating...
              </Badge>
            );
          }
        },
      },

      {
        Header: props.t("Active"),
        Cell: (cellProps) => {
          const item = cellProps.row.original;
          const rowIdx = cellProps.row.index;
          const isActive = () => item.disabled == false;

          const getColor = () => (isActive() ? "text" : "text-danger");
          const getIcon = () =>
            isActive()
              ? "mdi mdi-check-circle font-size-18"
              : "mdi mdi-close-circle font-size-18";

          return (
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Link
                to="#"
                className={getColor()}
                onClick={() =>
                  isActive() ? onClickDisable(item) : onClickEnable(item)
                }
              >
                <i className={getIcon()} id={`activetooltip-${rowIdx}`} />
                <UncontrolledTooltip
                  placement="top"
                  target={`activetooltip-${rowIdx}`}
                >
                  {`${props.t("Enable/Disable")} ${props.t("Patient")}`}
                </UncontrolledTooltip>
              </Link>
            </div>
          );
        },
      },
      /*{
        Header: props.t("Update"),
        Cell: (cellProps) => {
          const item = cellProps.row.original;
          return (
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Link
                to="#"
                className="text-success"
                onClick={() => {
                  onClickEdit(item);
                }}
              >
                <i className="mdi mdi-pencil font-size-18" id="edittooltip" />
                <UncontrolledTooltip placement="top" target="edittooltip">
                  {props.t("Edit Patient")}
                </UncontrolledTooltip>
              </Link>
            </div>
          );
        },
      },*/
      {
        Header: "Detail",
        Cell: (cellProps) => {
          const item = cellProps.row.original;
          const rowIdx = cellProps.row.index;
          const path = `/patient/${item.guid}`;
          return (
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Link
                to={path}
                className="text-success"
                params={{ patient: item }}
                onClick={() => {}}
              >
                <i
                  className="mdi mdi-clipboard-text-outline font-size-18"
                  id={`detailtooltip-${rowIdx}`}
                />
                <UncontrolledTooltip
                  placement="top"
                  target={`detailtooltip-${rowIdx}`}
                >
                  {props.t("Show patient details")}
                </UncontrolledTooltip>
              </Link>
            </div>
          );
        },
      },
      {
        Header: "Reports",
        Cell: (cellProps) => {
          const item = cellProps.row.original;
          const rowIdx = cellProps.row.index;
          const path = `/patient/reports/${item.id * 99}-${item.guid}`;
          return (
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Link
                to={path}
                className="text-success"
                params={{ patient: item }}
                onClick={() => {}}
              >
                <i
                  className="mdi mdi-chart-bar font-size-18"
                  id={`reporttooltip-${rowIdx}`}
                />
                <UncontrolledTooltip
                  placement="top"
                  target={`reporttooltip-${rowIdx}`}
                >
                  {props.t("Show patient reports")}
                </UncontrolledTooltip>
              </Link>
            </div>
          );
        },
      },
    ],
    [],
  );

  const toggleModal = () => setModal(!modal);
  const toggleCustomModal = () => setCustomModal(!customModal);
  const toggleLinkModal = () => setLinkModal(!linkModal);

  const onClickEdit = (_patient) => {
    setPatient(_patient);
    setEditMode(true);

    toggleModal();
  };

  const resetOptionsforLinkcheck = () => {
    setIsOk("hidden");
    setShowStartMigranting("hidden");
    setShowStartMigranting2("hidden");
    setCheckMessage("");
    setCheckMessage2("");
    setShowMessage("hidden");
    setShowMessage2("hidden");
    setLinkLoading("bx-loader-circle bx-spin text-primary");
    setLinkLoading2("bx-loader-circle bx-spin text-primary");
  };

  const onClickFirebaseLink = (item) => {
    resetOptionsforLinkcheck();
    setDataLink(item);
    setLinkModal(true);
    toggleLinkModal();
    setTimeout(() => {
      startLinkcheck(item);
    }, 1500);
  };

  var node = useRef();
  const onPaginationPageChange = (page) => {
    if (
      node &&
      node.current &&
      node.current.props &&
      node.current.props.pagination &&
      node.current.props.pagination.options
    ) {
      node.current.props.pagination.options.onPageChange(page);
    }
  };

  const [disableItemModal, setDisableItemModal] = useState(false);
  const [enableItemModal, setEnableItemModal] = useState(false);

  const onClickDisable = (_patient) => {
    setPatient(_patient);
    setDisableItemModal(true);
  };

  const onClickEnable = (_patient) => {
    setPatient(_patient);
    setEnableItemModal(true);
  };

  const handleDisablePatient = () => {
    if (patient && patient.guid) {
      dispatch(disablePatient(patient.guid));
    }
    setPatient(undefined);
    onPaginationPageChange(1);
    setDisableItemModal(false);
  };

  const handleEnablePatient = () => {
    if (patient && patient.guid) {
      dispatch(enablePatient(patient.guid));
    }

    setPatient(undefined);
    onPaginationPageChange(1);
    setEnableItemModal(false);
  };

  const onAddPatient = () => {
    setPatient(undefined);
    setEditMode(false);
    toggleModal();
  };

  const onAddCustomPatient = () => {
    setPatient(undefined);
    setEditMode(false);
    toggleCustomModal();
  };

  const getClinicsLabels = () => {
    return (
      <>
        <option value="" hidden></option>
        {clinics.length > 0 ? (
          clinics.map((clinic) => (
            <option
              key={clinic.guid}
              value={isValidClinic(clinic) ? clinic.guid : undefined}
            >{`${clinic.name} | ${clinic.country}`}</option>
          ))
        ) : (
          <option value={undefined}>{NO_CLINIC}</option>
        )}
      </>
    );
  };

  const selectNumPatients = () => {
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

    return <>{options}</>;
  };

  const showAddCustomModal = () => {
    return (
      <Modal isOpen={customModal} toggle={toggleCustomModal}>
        <ModalHeader toggle={toggleCustomModal} tag="h4">
          {props.t("Add Default Patients")}
        </ModalHeader>
        <ModalBody>
          <Form
            onSubmit={(e) => {
              e.preventDefault();
              validationCustom.handleSubmit();
              return false;
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
                    min="1"
                    max="10"
                    step="1"
                    length="2"
                    placeholder={props.t("Insert number")}
                    onChange={validationCustom.handleChange}
                    onBlur={validationCustom.handleBlur}
                    value={validationCustom.values.totalPatient || 0}
                    invalid={
                      validationCustom.touched.totalPatient &&
                      validationCustom.errors.totalPatient
                        ? true
                        : false
                    }
                  >
                    {selectNumPatients()}
                  </Input>
                  {validationCustom.touched.totalPatient &&
                  validationCustom.errors.totalPatient ? (
                    <FormFeedback type="invalid">
                      {validationCustom.errors.totalPatient}
                    </FormFeedback>
                  ) : null}
                </div>

                {!editMode ? (
                  <div className="mb-3">
                    <Label className="form-label">{props.t("Clinic")}</Label>
                    <Input
                      type="select"
                      name="clinic"
                      className="form-select"
                      multiple={false}
                      onChange={validationCustom.handleChange}
                      onBlur={validationCustom.handleBlur}
                      value={validationCustom.values.clinic}
                      invalid={
                        validationCustom.touched.clinic &&
                        validationCustom.errors.clinic
                          ? true
                          : false
                      }
                    >
                      {getClinicsLabels()}
                    </Input>
                    {validationCustom.touched.clinic &&
                    validationCustom.errors.clinic ? (
                      <FormFeedback type="invalid">
                        {validationCustom.errors.clinic}
                      </FormFeedback>
                    ) : null}
                  </div>
                ) : null}
              </Col>
            </Row>
            <Row>
              <Col>
                <div className="text-end">
                  <i
                    className={`bx bx-loader-circle bx-spin font-size-24 mb-1 mr-5 mt-5 ${isLoading}`}
                  ></i>
                  <button
                    type="submit"
                    className="btn btn-success save-user ml-10 mtn-10"
                  >
                    {props.t("Save")}
                  </button>
                </div>
              </Col>
            </Row>
          </Form>
        </ModalBody>
      </Modal>
    );
  };

  const showAddEditModal = () => {
    return (
      <Modal isOpen={modal} toggle={toggleModal}>
        <ModalHeader toggle={toggleModal} tag="h4">
          {editMode ? props.t("Edit Patient") : props.t("Add Patient")}
        </ModalHeader>
        <ModalBody>
          <Form
            onSubmit={(e) => {
              e.preventDefault();
              validation.handleSubmit();
              return false;
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
                    onChange={validation.handleChange}
                    onBlur={validation.handleBlur}
                    value={validation.values.name || ""}
                    invalid={
                      validation.touched.name && validation.errors.name
                        ? true
                        : false
                    }
                  />
                  {validation.touched.name && validation.errors.name ? (
                    <FormFeedback type="invalid">
                      {validation.errors.name}
                    </FormFeedback>
                  ) : null}
                </div>
                <div className="mb-3">
                  <Label className="form-label">{props.t("Email")}</Label>
                  <Input
                    name="email"
                    label="Email"
                    type="text"
                    placeholder={props.t("Insert Email")}
                    onChange={validation.handleChange}
                    onBlur={validation.handleBlur}
                    value={validation.values.email || ""}
                    invalid={
                      validation.touched.email && validation.errors.email
                        ? true
                        : false
                    }
                  />
                  {validation.touched.email && validation.errors.email ? (
                    <FormFeedback type="invalid">
                      {validation.errors.email}
                    </FormFeedback>
                  ) : null}
                </div>
                <div className="mb-3">
                  <Label className="form-label">{props.t("Password")}</Label>
                  <Input
                    name="password"
                    label="Type Password"
                    type="text"
                    maxLength="30"
                    minLength="6"
                    placeholder={props.t("Insert Password")}
                    value={validation.values.password}
                    onChange={validation.handleChange}
                    onBlur={validation.handleBlur}
                    invalid={
                      validation.touched.password && validation.errors.password
                        ? true
                        : false
                    }
                  />
                  {validation.touched.password && validation.errors.password ? (
                    <FormFeedback type="invalid">
                      {validation.errors.password}
                    </FormFeedback>
                  ) : null}
                </div>
                {!editMode ? (
                  <div className="mb-3">
                    <Label className="form-label">{props.t("Clinics")}</Label>
                    <Input
                      type="select"
                      name="clinic"
                      className="form-select"
                      multiple={false}
                      onChange={validation.handleChange}
                      onBlur={validation.handleBlur}
                      value={validation.values.clinic}
                      invalid={
                        validation.touched.clinic && validation.errors.clinic
                          ? true
                          : false
                      }
                    >
                      {getClinicsLabels()}
                    </Input>
                    {validation.touched.clinic && validation.errors.clinic ? (
                      <FormFeedback type="invalid">
                        {validation.errors.clinic}
                      </FormFeedback>
                    ) : null}
                  </div>
                ) : null}
              </Col>
            </Row>
            <Row>
              <Col>
                <div className="text-end">
                  <i
                    className={`bx bx-loader-circle bx-spin font-size-24 mb-1 mr-5 mt-5 ${isLoading}`}
                  ></i>
                  <button
                    type="submit"
                    className="btn btn-success save-user ml-10 mtn-10"
                  >
                    {props.t("Save")}
                  </button>
                </div>
              </Col>
            </Row>
          </Form>
        </ModalBody>
      </Modal>
    );
  };

  const showLinkModal = () => {
    return (
      <Modal
        isOpen={linkModal}
        toggle={toggleLinkModal}
        backdrop="static"
        size="lg"
      >
        <ModalHeader toggle={toggleLinkModal} tag="h4">
          Check Firebase Link for {dataLink?.name}
        </ModalHeader>
        <ModalBody>
          <Row>
            <Col>
              <div className="p-2">
                Checking Firebase Auth:{" "}
                <i
                  className={`bx ${linkLoading} font-size-24 position-absolute ml-5`}
                ></i>
              </div>
              <p className={`p-2 alert alert-${messageType} ${showMessage}`}>
                {checkMessage}
              </p>
            </Col>
            <Col>
              <div className="p-2">
                Checking Firebase User :{" "}
                <i
                  className={`bx ${linkLoading2} font-size-24 position-absolute ml-5`}
                ></i>
              </div>
              <p className={`p-2 alert alert-${messageType2} ${showMessage2}`}>
                {checkMessage2}
              </p>
            </Col>
          </Row>
          <Row>
            <Col>
              <p className={`p-2 alert alert-info ${isOk}`}>
                everything is fine here!
              </p>
            </Col>
          </Row>
          <Row className={`${showStartMigranting}`}>
            <Col>
              <div className="p-2">
                Do you want to link right now?{" "}
                <i
                  className={`bx bx-loader-circle bx-spin ${isMigrating ? "" : "hidden"} text-primary font-size-24 position-absolute ml-5`}
                ></i>{" "}
                <Button
                  className={`btn btn-sm ${isMigrating ? "hidden" : ""}`}
                  color="info"
                  onClick={() => startLinkMigration(dataLink)}
                >
                  Start link
                </Button>
              </div>
            </Col>
          </Row>
        </ModalBody>
        <ModalFooter>
          <Button color="secondary" onClick={toggleLinkModal}>
            Close
          </Button>
        </ModalFooter>
      </Modal>
    );
  };

  const showPlaceholder = () => {
    return (
      <>
        <div>
          <p className="placeholder-glow mb-0">
            <span className="placeholder col-12"></span>
          </p>
          <p className="placeholder-glow mb-0">
            <span className="placeholder col-12"></span>
          </p>
          <p className="placeholder-glow mb-0">
            <span className="placeholder col-12"></span>
          </p>
          <p className="placeholder-glow mb-0">
            <span className="placeholder col-12"></span>
          </p>
        </div>
      </>
    );
  };

  //Create a function export the patients to csv file
  const exportToCsv = async () => {
    try {
      // Show loading state
      setIsLoading("");

      console.log("Export - searchTerm:", searchTerm);

      // Fetch all patients without pagination
      // If there's a search term, it will be included in the filter
      const response = await getPatientsApi(
        undefined,
        undefined,
        undefined,
        searchTerm,
      );

      console.log("Export - response:", response);

      // Handle both paginated and non-paginated responses
      const allPatients = response?.data || response || [];

      if (!allPatients || allPatients.length === 0) {
        showToast("Warning", props.t("No patients to export"), () => {});
        setIsLoading("hidden");
        return;
      }

      const csv = allPatients.map((item) => {
        return {
          Name: item.name || "",
          Email: item.email || "",
          Type: item.email?.includes("@plato.dashboard")
            ? "Default"
            : "Regular",
          Clinic: item.clinic_patients?.[0]?.clinic?.name || "N/A",
          AppCredential:
            item.patient_mobile_accesses?.[0]?.credential || "123456",
          Disable: item.disabled ? "Yes" : "No",
          CreatedAt: item.createdAt ? formatDate(item.createdAt) : "",
          UpdatedAt: item.updatedAt ? formatDate(item.updatedAt) : "",
        };
      });

      const csvData = csv.map((row) =>
        Object.values(row)
          .map((value) => `"${value}"`)
          .join(","),
      );

      csvData.unshift(
        Object.keys(csv[0])
          .map((key) => `"${key}"`)
          .join(","),
      );

      const csvArray = csvData.join("\n");
      const a = document.createElement("a");
      a.href = URL.createObjectURL(new Blob([csvArray], { type: "text/csv" }));

      // Include search term in filename if present
      const filename = searchTerm
        ? `patients_search_${searchTerm.substring(0, 20)}.csv`
        : "patients.csv";
      a.setAttribute("download", filename);

      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);

      showToast(
        props.t("Success"),
        props.t(`Exported ${allPatients.length} patients`),
        () => {},
        "success",
      );
    } catch (error) {
      showToast(
        props.t("Error"),
        props.t("Failed to export patients"),
        () => {},
        "error",
      );
      console.error("Export error:", error);
    } finally {
      setIsLoading("hidden");
    }
  };

  return (
    <React.Fragment>
      <DisableItemModal
        show={disableItemModal}
        onDisableClick={handleDisablePatient}
        itemText={"Patient"}
        onCloseClick={() => setDisableItemModal(false)}
      />
      <EnableItemModal
        show={enableItemModal}
        onEnableClick={handleEnablePatient}
        itemText={"Patient"}
        onCloseClick={() => setEnableItemModal(false)}
      />
      <div className="page-content">
        <Container fluid>
          <Breadcrumbs
            title={props.t("Patient")}
            breadcrumbItem={props.t("All Patients")}
          />
          <Card>
            <CardBody>
              <PlatoTableContainer
                columns={columns}
                alignItems="center"
                data={patients}
                isGlobalFilter={false}
                onAddCustomItemText={props.t("Add Default Patient")}
                onAddCustomItemClick={onAddCustomPatient}
                onAddItemText={props.t("Add Patient")}
                onAddItemClick={onAddPatient}
                onAddExportButtonText={props.t("Export")}
                onAddExportButtonClick={exportToCsv}
                customPageSize={pageSize}
                isPaginated={true}
                paginationData={pagination}
                onPageChange={handlePageChange}
                onSearch={handleSearch}
                isLoading={loading}
                className="custom-header-css"
              />
            </CardBody>
          </Card>
          {showAddEditModal()}
          {showAddCustomModal()}
          {showLinkModal()}
        </Container>
      </div>
    </React.Fragment>
  );
};

AllPatients.propTypes = {
  t: PropTypes.any,
};

export default withTranslation()(AllPatients);
