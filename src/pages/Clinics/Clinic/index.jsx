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
import { withTranslation } from "react-i18next";

import Breadcrumbs from "../../../components/Common/Breadcrumb";
import DisableItemModal from "../../../components/Common/DisableItemModal";
import EnableItemModal from "../../../components/Common/EnableItemModal";

import {
  addClinic,
  getClinics,
  disableClinic,
  enableClinic,
  updateClinic,
} from "../../../store/clinics/actions";

import { useSelector, useDispatch } from "react-redux";
import { getClinicCountries } from "../../../util/countries";
import { Country, CreateAt, Email, Name, UpdatedAt } from "../clinic-item-list";
import { get } from "../../../api/manager";

const Clinic = (props) => {
  document.title = `${props.t("Clinics")} | ${props.t("Platoscience")}`;

  const dispatch = useDispatch();
  const [clinic, setClinic] = useState(undefined);
  const [modal, setModal] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [isLoading, setIsLoading] = useState('hidden');
  const { clinics, loading } = useSelector((state) => ({
    clinics: state.clinics.clinics,
    loading: state.clinics.loading,
  }));

  const checkSignifier = async (signifier) => {
    const baseurl = import.meta.env.VITE_APP_API_URL;
    const [data] = await Promise.all([
      await get(`${baseurl}/plato/clinic/signifier?signifier=${signifier}`, true, {}),
    ])
    return data;
  }

  const validation = useFormik({
    enableReinitialize: true,

    initialValues: {
      name: (clinic && clinic.name) || "",
      email: (clinic && clinic.email) || "",
      country: (clinic && clinic.country) || "",
      signifier: (clinic && clinic.signifier) || "",
      signifier_count: (clinic && clinic.signifier_count) || 0,
    },
    validationSchema: Yup.object({
      name: Yup.string().required(props.t("Please Enter Your Name")),
      email: Yup.string()
        .matches(
          /^[\w-\.]+@([\w-]+\.)+[\w-]{2,20}$/,
          props.t("Please Enter Valid Email")
        )
        .required(props.t("Please Enter Your Email")),
      country: Yup.string().required(props.t("Please Enter Country")),
      signifier: Yup.string().max(12).min(2).required(props.t("Please Enter the Signifier for the Clinic")),
      signifier_count: Yup.number().required(props.t("Please Enter the Signifier Count for the Clinic")),
    }),
    onSubmit: async (values) => {
      setIsLoading('');
      const { name, email, country, signifier } = values;
      const signifier_count = parseInt(values.signifier_count)
      let data = { name, email, country, signifier, signifier_count };
      const allowSignifier = await checkSignifier(signifier);
      if(allowSignifier){
        if(editMode && clinic.guid !== allowSignifier.guid){
          validation.setErrors({ signifier: `The Significant is already in use by ${allowSignifier.name}` });
          setIsLoading('hidden');
          return
        } else if(!editMode){  
          validation.setErrors({ signifier: `The signifier already exists and is being used by ${allowSignifier.name}` });
          setIsLoading('hidden');
          return
        }
      }

      
      if (editMode) {
        data = {
          guid: clinic.guid,
          ...data,
        };
        dispatch(updateClinic(data));
        setIsLoading('hidden');
        validation.resetForm();
        setEditMode(false);
        toggleModal();
        
      }

      dispatch(addClinic(data));
      setIsLoading('hidden');
      validation.resetForm();
      toggleModal();
    },
  });


  useEffect(() => {
    if (!modal){
      validation.resetForm();
    } 
  }, [modal]);

  useEffect(() => {
    dispatch(getClinics());
  }, []);

  const columns = useMemo(
    () => [
      {
        Header: props.t("Name"),
        accessor: "name",
        Cell: (cellProps) => {
          return <Name {...cellProps} />;
        },
      },
      {
        Header: props.t("Email"),
        accessor: "email",
        Cell: (cellProps) => {
          return <Email {...cellProps} />;
        },
      },
      {
        Header: props.t("Country"),
        accessor: "country",
        Cell: (cellProps) => {
          return <Country {...cellProps} />;
        },
      },
      {
        Header: props.t("CreatedAt"),
        accessor: "created_at",
        Cell: (cellProps) => {
          return <CreateAt {...cellProps} />;
        },
      },
      {
        Header: props.t("UpdatedAt"),
        accessor: "updated_at",
        Cell: (cellProps) => {
          return <UpdatedAt {...cellProps} />;
        },
      },
      {
        Header: props.t("Active"),
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
              }}>
              <Link
                to="#"
                className={getColor()}
                onClick={() =>
                  isActive() ? onClickDisable(item) : onClickEnable(item)
                }
              >
                <i className={getIcon()} id="activetooltip" />
                <UncontrolledTooltip placement="top" target="activetooltip">
                  {`${props.t("Enable/Disable")} ${props.t("Clinic")}`}
                </UncontrolledTooltip>
              </Link>
            </div>
          );
        },
      },
      {
        Header: props.t("Update"),
        Cell: (cellProps) => {
          const item = cellProps.row.original;
          return (
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}>
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
      {
        Header: "Patients Summary",
        Cell: (cellProps) => {
          const item = cellProps.row.original;
          const path = `/clinics/patients/summary/${item.guid}`;
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
                params={{ patient: item }}
                onClick={() => {}}
              >
                <i
                  className="mdi mdi-clipboard-text-outline font-size-18"
                  id="detailtooltip"
                />
                <UncontrolledTooltip placement="top" target="detailtooltip">
                  {props.t("Show patients sumary")}
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

  const onClickEdit = (_clinic) => {
    setClinic(_clinic);
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

  const onClickDisable = (_clinic) => {
    setClinic(_clinic);
    setDisableItemModal(true);
  };

  const onClickEnable = (_clinic) => {
    setClinic(_clinic);
    setEnableItemModal(true);
  };

  const handleDisableClinic = () => {
    if (clinic && clinic.guid) {
      dispatch(disableClinic(clinic.guid));
    }

    setClinic(undefined);
    onPaginationPageChange(1);
    setDisableItemModal(false);
  };

  const handleEnableClinic = () => {
    if (clinic && clinic.guid) {
      dispatch(enableClinic(clinic.guid));
    }

    setClinic(undefined);
    onPaginationPageChange(1);
    setEnableItemModal(false);
  };

  const onAddClinic = () => {
    setClinic(undefined);
    setEditMode(false);
    toggleModal();
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

  const showAddEditModal = () => {
    return (
      <Modal isOpen={modal} toggle={toggleModal}>
        <ModalHeader toggle={toggleModal} tag="h4">
          {editMode ? props.t("Edit Clinic") : props.t("Add Clinic")}
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
                  <Label className="form-label">{props.t("Country")}</Label>
                  <Input
                    type="select"
                    name="country"
                    className="form-select"
                    multiple={false}
                    onChange={validation.handleChange}
                    onBlur={validation.handleBlur}
                    value={validation.values.country}
                    invalid={
                      validation.touched.country && validation.errors.country
                        ? true
                        : false
                    }
                  >
                    {getClinicCountries()}
                  </Input>
                  {validation.touched.country && validation.errors.country ? (
                    <FormFeedback type="invalid">
                      {validation.errors.country}
                    </FormFeedback>
                  ) : null}
                </div>
                <div className="mb-3">
                  <Label className="form-label">{props.t("Signifier")}</Label>
                  <Input
                    name="signifier"
                    type="text"
                    placeholder={props.t('Insert Signifier. Ex: "My Clinic Name" will be "mcn"')}
                    value={validation.values.signifier || ""}
                    onChange={validation.handleChange}
                    onBlur={validation.handleBlur}
                    invalid={
                      validation.touched.signifier && validation.errors.signifier
                        ? true
                        : false
                    }
                  />
                  {validation.touched.signifier && validation.errors.signifier ? (
                    <FormFeedback type="invalid">
                      {validation.errors.signifier}
                    </FormFeedback>
                  ) : null}
                </div>

                <div className="mb-3">
                  <Label className="form-label">{props.t("Signifier Count: ")}<Label className="small" > | The next will be ###{validation.values.signifier_count + 1}</Label></Label>
                  <Input
                    name="signifier_count"
                    type="number"
                    placeholder={props.t('Insert Signifier Counter')}
                    value={validation.values.signifier_count || 0}
                    onChange={validation.handleChange}
                    onBlur={validation.handleBlur}
                    invalid={
                      validation.touched.signifier_count && validation.errors.signifier_count
                        ? true
                        : false
                    }
                  />
                  {validation.touched.signifier_count && validation.errors.signifier_count ? (
                    <FormFeedback type="invalid">
                      {validation.errors.signifier_count}
                    </FormFeedback>
                  ) : null}
                </div>
              </Col>
            </Row>
            <Row>
              <Col>
                <div className="text-end">
                <i className={`bx bx-loader-circle bx-spin font-size-24 mb-1 mr-5 mt-5 ${isLoading}`} ></i>
                  <button type="submit" className="btn btn-primary save-user">
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

  return (
    <React.Fragment>
      <DisableItemModal
        show={disableItemModal}
        onDisableClick={handleDisableClinic}
        itemText={"Clinic"}
        onCloseClick={() => setDisableItemModal(false)}
      />
      <EnableItemModal
        show={enableItemModal}
        onEnableClick={handleEnableClinic}
        itemText={"Clinic"}
        onCloseClick={() => setEnableItemModal(false)}
      />
      <div className="page-content">
        <Container fluid>
          <Breadcrumbs
            title={props.t("Clinic")}
            breadcrumbItem={props.t("Clinics List")}
          />
          <Card>
            <CardBody>
              {loading ? (
                showPlaceholder()
              ) : (
                <LocalTableContainer
                  columns={columns}
                  data={clinics}
                  isGlobalFilter={true}
                  onAddItemText={props.t("Add Clinic")}
                  onAddItemClick={onAddClinic}
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

Clinic.propTypes = {
  t: PropTypes.any,
};

export default withTranslation()(Clinic);
