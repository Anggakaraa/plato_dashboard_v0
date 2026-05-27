import PropTypes from "prop-types";
import React, { useEffect, useState, useRef, useMemo } from "react";
import { Link } from "react-router-dom";
import LocalTableContainer from "../../../../components/Common/LocalTableContainer";
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
} from "reactstrap";
import * as Yup from "yup";
import { useFormik } from "formik";
import withRouter from "../../../../components/Common/withRouter";
import { withTranslation } from "react-i18next";

import Breadcrumbs from "../../../../components/Common/Breadcrumb";

import {
  addMyClinician,
  getMyClinicians,
  clearUsersError,
} from "../../../../store/users/actions";
import {
  getMyClinics,
  cleanClinicsError,
} from "../../../../store/clinics/actions";

import getErrorMessage from "../../../../api/error";
import { useSelector, useDispatch } from "react-redux";
import { CreateAt, Email, Name, UpdatedAt } from "../../user-item-list";
import { showToast } from "../../../../util/toast";

const MyClinicians = (props) => {
  document.title = `${props.t("My Clinicians")} | ${props.t("Platoscience")}`;

  const dispatch = useDispatch();

  const [clinician, setClinician] = useState(undefined);

  const [modal, setModal] = useState(false);

  const NO_CLINIC = props.t("THERE IS NO CLINIC!");
  const isValidClinic = (value) => value !== NO_CLINIC;

  const { my_clinics, clinics_error } = useSelector((state) => ({
    my_clinics: state.clinics.my_clinics,
    clinics_error: state.clinics.error,
  }));
  const { my_clinicians, user_error, loading } = useSelector((state) => ({
    my_clinicians: state.users.my_clinicians,
    user_error: state.users.error,
    loading: state.users.loading,
  }));

  const validation = useFormik({
    enableReinitialize: true,

    initialValues: {
      name: (clinician && clinician.name) || undefined,
      email: (clinician && clinician.email) || undefined,
      clinic: (clinician && clinician.clinic) || undefined,
    },

    validationSchema: Yup.object({
      name: Yup.string().required(props.t("Please Enter Your Name")),
      email: Yup.string()
        .matches(/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/, "Please Enter Valid Email")
        .required(props.t("Please Enter Your Email")),
      clinic: Yup.string().required(props.t("Please enter the clinic")),
    }),

    onSubmit: (values) => {
      const { name, email, clinic } = values;
      const data = { name, email, clinic };
      dispatch(addMyClinician(data));
      validation.resetForm();
      toggleModal();
    },
  });

  useEffect(() => {
    if (!modal) validation.resetForm();
  }, [modal]);

  useEffect(() => {
    dispatch(getMyClinics());
    dispatch(getMyClinicians());
  }, []);

  const columns = useMemo(
    () => [
      {
        Header: "Name",
        accessor: "name",
        Cell: (cellProps) => {
          return <Name {...cellProps} />;
        },
      },
      {
        Header: "Email",
        accessor: "email",
        Cell: (cellProps) => {
          return <Email {...cellProps} />;
        },
      },
      {
        Header: "CreatedAt",
        accessor: "created_at",
        Cell: (cellProps) => {
          return <CreateAt {...cellProps} />;
        },
      },
      {
        Header: "UpdatedAt",
        accessor: "updated_at",
        Cell: (cellProps) => {
          return <UpdatedAt {...cellProps} />;
        },
      },
      {
        Header: "Clinics",
        Cell: (cellProps) => {
          const item = cellProps.row.original;
          const path = `/clinician/${item.guid}`;
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
                className="text-primary"
                params={{ clinician: item }}
                onClick={() => {}}
              >
                <i
                  className="mdi mdi-hospital-box-outline font-size-18"
                  id="edittooltip"
                />
                <UncontrolledTooltip placement="top" target="edittooltip">
                  {props.t("Show clinics relationships")}
                </UncontrolledTooltip>
              </Link>
            </div>
          );
        },
      },
    ],
    []
  );

  const toggleModal = () => setModal(!modal);

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

  const onAddUser = () => {
    setClinician(undefined);
    toggleModal();
  };

  const getClinicsLabels = () => {
    const availableClinics = my_clinics.filter((clinic) => {
      return clinic.clinic_clinicians[0]?.admin === true;
    });
    return (
      <>
        <option value="" hidden></option>
        {availableClinics.length > 0 ? (
          availableClinics.map((clinic) => (
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

  const showAddEditModal = () => {
    return (
      <Modal isOpen={modal} toggle={toggleModal}>
        <ModalHeader toggle={toggleModal} tag="h4">
          {props.t("Add Clinician")}
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
                    type="email"
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
              </Col>
            </Row>
            <Row>
              <Col>
                <div className="text-end">
                  <button type="submit" className="btn btn-success save-user">
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

  return (
    <React.Fragment>
      <div className="page-content">
        <Container fluid>
          <Breadcrumbs
            title={props.t("Clinician")}
            breadcrumbItem={props.t("Clinicians User")}
          />
          <Card>
            <CardBody>
              {user_error
                ? showToast(
                    "Error",
                    getErrorMessage(props.t, user_error),
                    () => {
                      dispatch(clearUsersError());
                    }
                  )
                : null}
              {clinics_error
                ? showToast(
                    "Error",
                    getErrorMessage(props.t, clinics_error),
                    () => {
                      dispatch(cleanClinicsError());
                    }
                  )
                : null}
              {loading ? (
                showPlaceholder()
              ) : (
                <LocalTableContainer
                  columns={columns}
                  data={my_clinicians}
                  isGlobalFilter={true}
                  onAddItemText={props.t("Add Clinician")}
                  onAddItemClick={onAddUser}
                  customPageSize={10}
                  className="custom-header-css"
                />
              )}
            </CardBody>
          </Card>
          {showAddEditModal()}
        </Container>
      </div>
    </React.Fragment>
  );
};

MyClinicians.propTypes = {
  t: PropTypes.any,
};

export default withRouter(withTranslation()(MyClinicians));
