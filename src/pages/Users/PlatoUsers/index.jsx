import React, { useEffect, useState, useRef, useMemo } from "react";
import PropTypes from "prop-types";
import { Link } from "react-router-dom";
import LocalTableContainer from "../../../components/Common/LocalTableContainer";
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
import withRouter from "../../../components/Common/withRouter";
import { withTranslation } from "react-i18next";

import Breadcrumbs from "../../../components/Common/Breadcrumb";
import DisableItemModal from "../../../components/Common/DisableItemModal";
import EnableItemModal from "../../../components/Common/EnableItemModal";

import {
  addPlatoUser,
  getPlatoUsers,
  disablePlatoUser,
  enablePlatoUser,
  updatePlatoUser,
} from "../../../store/users/actions";

import getErrorMessage from "../../../api/error";
import { useSelector, useDispatch } from "react-redux";
import { CreateAt, Email, Name, Type, UpdatedAt } from "../user-item-list";
import { showToast } from "../../../util/toast";

const PlatoUsers = (props) => {
  document.title = `${props.t("Plato Users")} | ${props.t("Platoscience")}`;

  const dispatch = useDispatch();
  const [user, setUser] = useState(undefined);

  const [modal, setModal] = useState(false);
  const [editMode, setEditMode] = useState(false);

  const { users, error, loading } = useSelector((state) => ({
    users: state.users.plato_users,
    error: state.users.error,
    loading: state.users.loading,
  }));

  //console.log('>>>>>>>>>>> ERROR <<<<<', error)

  const [showError, setShowError] = useState(undefined);
  useEffect(() => {
    if (error && error !== showError) setShowError(error);
  }, [error]);

  const validation = useFormik({
    enableReinitialize: true,

    initialValues: {
      name: (user && user.name) || "",
      email: (user && user.email) || "",
    },
    validationSchema: Yup.object({
      name: Yup.string().required(props.t("Please Enter Your Name")),
      email: Yup.string()
        .matches(/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/, "Please Enter Valid Email")
        .required(props.t("Please Enter Your Email")),
    }),
    onSubmit: (values) => {
      const { name, email } = values;
      let data = { name, email };
      if (editMode) {
        data = {
          guid: user.guid,
          ...data,
        };
        dispatch(updatePlatoUser(data));
        validation.resetForm();
        setEditMode(false);
        toggleModal();
        return;
      }

      dispatch(addPlatoUser(data));
      validation.resetForm();
      toggleModal();
    },
  });

  useEffect(() => {
    if (!modal) validation.resetForm();
  }, [modal]);

  useEffect(() => {
    dispatch(getPlatoUsers());
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
        Header: "Type",
        accessor: "user_type",
        Cell: (cellProps) => {
          return <Type {...cellProps} />;
        },
      },
      {
        Header: "Active",
        Cell: (cellProps) => {
          const item = cellProps.row.original;
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
                <i className={getIcon()} id="activetooltip" />
                <UncontrolledTooltip placement="top" target="activetooltip">
                  {`${props.t("Enable/Disable")} ${props.t("Admin")}`}
                </UncontrolledTooltip>
              </Link>
            </div>
          );
        },
      },
      {
        Header: "Update",
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
                className="text-primary"
                onClick={() => {
                  onClickEdit(item);
                }}
              >
                <i className="mdi mdi-pencil font-size-18" id="edittooltip" />
                <UncontrolledTooltip placement="top" target="edittooltip">
                  {props.t("Edit")}
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

  const onClickEdit = (_user) => {
    setUser(_user);
    setEditMode(true);

    toggleModal();
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

  const onClickDisable = (_user) => {
    setUser(_user);
    setDisableItemModal(true);
  };

  const onClickEnable = (_user) => {
    setUser(_user);
    setEnableItemModal(true);
  };

  const handleDisableUser = () => {
    if (user && user.guid) {
      dispatch(disablePlatoUser(user.guid));
    }

    setUser(undefined);
    onPaginationPageChange(1);
    setDisableItemModal(false);
  };

  const handleEnableUser = () => {
    if (user && user.guid) {
      dispatch(enablePlatoUser(user.guid));
    }

    setUser(undefined);
    onPaginationPageChange(1);
    setEnableItemModal(false);
  };

  const onAddUser = () => {
    setUser(undefined);
    setEditMode(false);
    toggleModal();
  };

  const showAddEditModal = () => {
    return (
      <Modal isOpen={modal} toggle={toggleModal}>
        <ModalHeader toggle={toggleModal} tag="h4">
          {editMode ? props.t("Edit Admin") : props.t("Add Admin")}
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
      <DisableItemModal
        show={disableItemModal}
        onDisableClick={handleDisableUser}
        itemText={"Admin"}
        onCloseClick={() => setDisableItemModal(false)}
      />
      <EnableItemModal
        show={enableItemModal}
        onEnableClick={handleEnableUser}
        itemText={"Admin"}
        onCloseClick={() => setEnableItemModal(false)}
      />
      <div className="page-content">
        <Container fluid>
          <Breadcrumbs
            title={props.t("Plato Admins")}
            breadcrumbItem={props.t("Plato Admins List")}
          />
          <Card>
            <CardBody>
              {showError
                ? showToast("Error", getErrorMessage(props.t, error), () => {
                    setShowError(undefined);
                  })
                : null}
              { loading ? (
                showPlaceholder()
              ) : (
                <LocalTableContainer
                  columns={columns}
                  data={users}
                  isGlobalFilter={true}
                  onAddItemText={props.t("Add Admin")}
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

PlatoUsers.propTypes = {
  t: PropTypes.any,
};

export default withRouter(withTranslation()(PlatoUsers));
