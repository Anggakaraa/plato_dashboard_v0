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
  addPlatoCountry,
  getPlatoCountries,
  disablePlatoCountry,
  enablePlatoCountry,
  updatePlatoCountry,
} from "../../../store/countries/actions";

import getErrorMessage from "../../../api/error";
import { useSelector, useDispatch } from "react-redux";
import { Name } from "./country-item-list";
import { showToast } from "../../../util/toast";

const PlatoCountries = (props) => {
  document.title = `${props.t("Plato Country")} | ${props.t("Platoscience")}`;

  const dispatch = useDispatch();
  const [country, setCountry] = useState(undefined);

  const [modal, setModal] = useState(false);
  const [editMode, setEditMode] = useState(false);

  const { countries, error, loading } = useSelector((state) => ({
    countries: state.countries.plato_countries || [],
    error: state.countries.error,
    loading: state.countries.loading,
  }));

  const [showError, setShowError] = useState(undefined);
  useEffect(() => {
    if (error !== showError) setShowError(error);
  }, [error]);

  const validation = useFormik({
    enableReinitialize: true,

    initialValues: {
      name: (country && country.name) || "",
    },
    validationSchema: Yup.object({
      name: Yup.string().required(props.t("Please Enter the Country Name")),
    }),
    onSubmit: (values) => {
      const { name } = values;
      let data = { name, disabled: false };
      if (editMode) {
        data = {
          id: country.id,
          ...data,
        };
        dispatch(updatePlatoCountry(data));
        validation.resetForm();
        setEditMode(false);
        toggleModal();
        return;
      }

      dispatch(addPlatoCountry(data));
      validation.resetForm();
      toggleModal();
    },
  });

  useEffect(() => {
    if (!modal) validation.resetForm();
  }, [modal]);

  useEffect(() => {
    dispatch(getPlatoCountries());
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
      /*{
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
                  {`${props.t("Enable/Disable")} ${props.t("Country")}`}
                </UncontrolledTooltip>
              </Link>
            </div>
          );
        },
      },*/
      {
        Header: "Edit",
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

  const onClickEdit = (_country) => {
    setCountry(_country);
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

  const onClickDisable = (_country) => {
    setCountry(_country);
    setDisableItemModal(true);
  };

  const onClickEnable = (_country) => {
    setCountry(_country);
    setEnableItemModal(true);
  };

  const handleDisableUser = () => {
    if (country && country.id) {
      dispatch(disablePlatoCountry(country.id));
    }

    setCountry(undefined);
    onPaginationPageChange(1);
    setDisableItemModal(false);
  };

  const handleEnableCountry = () => {
    if (country && country.id) {
      dispatch(enablePlatoCountry(country.id));
    }

    setCountry(undefined);
    onPaginationPageChange(1);
    setEnableItemModal(false);
  };

  const onAddCountry = () => {
    setCountry(undefined);
    setEditMode(false);
    toggleModal();
  };

  const showAddEditModal = () => {
    return (
      <Modal isOpen={modal} toggle={toggleModal}>
        <ModalHeader toggle={toggleModal} tag="h4">
          {editMode ? props.t("Edit Country") : props.t("Add Country")}
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
        itemText={"User"}
        onCloseClick={() => setDisableItemModal(false)}
      />
      <EnableItemModal
        show={enableItemModal}
        onEnableClick={handleEnableCountry}
        itemText={"User"}
        onCloseClick={() => setEnableItemModal(false)}
      />
      <div className="page-content">
        <Container fluid>
          <Breadcrumbs
            title={props.t("Plato Country")}
            breadcrumbItem={props.t("Plato Country List")}
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
                  data={countries}
                  isGlobalFilter={true}
                  onAddItemText={props.t("Add Country")}
                  onAddItemClick={onAddCountry}
                  customPageSize={20}
                  className="custom-header-css"
                  customOrder={{ name: 'asc' }}
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

PlatoCountries.propTypes = {
  t: PropTypes.any,
};

export default withRouter(withTranslation()(PlatoCountries));
