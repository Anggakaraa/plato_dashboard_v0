import React, { useEffect, useState, useMemo } from "react";
import PropTypes from "prop-types";
import { useSelector, useDispatch } from "react-redux";
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
  Input,
  Form,
  CardTitle,
  Table,
  Alert,
  UncontrolledTooltip,
} from "reactstrap";
import { map } from "lodash";
import * as Yup from "yup";
import { useFormik } from "formik";
import withRouter from "../../../../components/Common/withRouter";
import { withTranslation } from "react-i18next";

import { 
  activateClinicClinicianBy,
  adminClinicClinicianBy,
  disableClinicianBy, 
  enableClinicianBy,
  getClinicianBy, 
  getClinicianClinicsBy, 
  createClinicClinicianBy, 
  cleanClinicianError
} from "../../../../store/clinician/actions";

import { cleanClinicsError, getClinics } from "../../../../store/clinics/actions";

import { showToast } from "../../../../util/toast";
import getErrorMessage from "../../../../api/error";

import LocalTableContainer from "../../../../components/Common/LocalTableContainer";
import MiniCards from "../mini-card";
import { Link } from "react-router-dom";
import { Name, Country } from "../clinic-clinician-item-list";
import profile from "/src/assets/images/profile-img.png";
import QuestionModal from "../../../../components/Common/QuestionItemModal";

const PlatoClinicianDetail = (props) => {
  document.title = props.t("Clinician") + " | " + props.t("Platoscience");
  const dispatch = useDispatch();
  const { guid } = props;

  const NO_CLINIC = props.t("THERE IS NO CLINIC!");
  const isValidClinic = (value) => value !== NO_CLINIC;
  
  const { clinics } = useSelector((state) => ({ clinics: state.clinics.clinics }));
  const { errorClinics } = useSelector((state) => ({errorClinics: state.clinics.error }));
  
  /** MOCK */
  const { patients } = useSelector((state) => ({ patients: state.clinician.patients }));
  const { treatments } = useSelector((state) => ({ treatments: state.clinician.treatments }));
  const { others } = useSelector((state) => ({ others: state.clinician.others }));
  /** MOCK */

  const { clinician } = useSelector((state) => ({ clinician : state.clinician.clinician }));
  const { clinician_clinics } = useSelector((state) => ({ clinician_clinics : state.clinician.clinician_clinics }));
  const { error } = useSelector((state) => ({ error : state.clinician.error }));
  
  const [relationship, setRelationship] = useState(undefined);

  const [addRelationshipModal, setAddRelationshipModal] = useState(false);
  const toggleRelationshipModal = () => setAddRelationshipModal(!addRelationshipModal);

  const [disableClinicianModal, setDisableClinicianModal] = useState(false);
  const [enableClinicianModal, setEnableClinicianModal] = useState(false);

  const [disableRelationshipModal, setDisableRelationshipModal] = useState(false);
  const [enableRelationshipModal, setEnableRelationshipModal] = useState(false);

  const [adminRelationshipModal, setAdminRelationshipModal] = useState(false);
  const [noAdminRelationshipModal, setNoAdminRelationshipModal] = useState(false);
  
  const validation = useFormik({
    enableReinitialize: true,

    initialValues: {
      clinic: "",
      admin: false,
    },

    validationSchema: Yup.object({
      clinic: Yup.string().required(props.t("Please enter the clinic")),
      admin: Yup.bool().required(props.t("Please enter the relationship type")),
    }),

    onSubmit: (values) => {
      const { clinic, admin } = values;
      if (isValidClinic(clinic)) {
        const data = { 
          clinic, 
          clinician: clinician.guid, 
          admin 
        };
      
        dispatch(createClinicClinicianBy(data));  
      }

      validation.resetForm();
      toggleRelationshipModal();
    },
  });

  useEffect(() => {
    if (!addRelationshipModal) validation.resetForm();
  }, [addRelationshipModal]);

  useEffect(() => {
    dispatch(getClinics(false));
    dispatch(getClinicianBy(guid));
    dispatch(getClinicianClinicsBy({guid, disabled: false}));
  }, []);
  
  const [miniCards, setMiniCards] = useState([
    { title: props.t("Patients"), iconClass: "dripicons-user-id", text: `${patients}` },
    { title: props.t("Treatments"), iconClass: "bx bx-file", text: `${treatments}` },
    { title: props.t("Others"), iconClass: "bx-hourglass", text: `${others}` }
  ]);

  const columns = useMemo(
    () => [
      {
        Header: props.t("Name"),
        accessor: "name",
        disableFilters: true,
        filterable: true,
        Cell: (cellProps) => {
          return <Name {...cellProps} />;
        },
      },
      {
        Header: props.t("Country"),
        accessor: "country",
        disableFilters: true,
        filterable: true,
        Cell: (cellProps) => {
          return <Country {...cellProps} />;
        },
      },
      {
        Header: props.t("Active"),
        Cell: (cellProps) => {
          const item = cellProps.row.original;
          const clinicRelationship = item.clinic_clinicians[0];
          const isActive = () => clinicRelationship.disabled === false;
          
          const getColor = () => isActive() ? "text" : "text-danger";
          const getIcon = () => isActive() ? "mdi mdi-check-circle font-size-18" : "mdi mdi-close-circle font-size-18";
          
          return (
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Link
                to="#"
                className={getColor()}
                onClick={() => isActive() ? onClickDisableRelationship(item) : onClickEnableRelationship(item)}>
                <i className={getIcon()} id="activetooltip" />
                <UncontrolledTooltip placement="top" target="activetooltip">
                  {`${props.t("Enable/Disable")} ${props.t("Relationship")}`}
                </UncontrolledTooltip>
              </Link>
            </div>
          );
        },
      },
      {
        Header: props.t("Admin"),
        Cell: (cellProps) => {
          const item = cellProps.row.original;
          const clinicRelationship = item.clinic_clinicians[0];
          const isAdmin = () => clinicRelationship.admin === true;
          const getClass = () => isAdmin() ? "text-success" : "text-danger";
          return (
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Link
                to="#"
                className={getClass()}
                onClick={() => onClickAdmin(item)}
              >
                <i className="mdi mdi-pencil font-size-18" id="edittooltip" /> {isAdmin().toString()}
                <UncontrolledTooltip placement="top" target="edittooltip">
                  {props.t("Change Admin")}
                </UncontrolledTooltip>
              </Link>
            </div>
          );
        },
      },
    ],
    []
  );

  const onAddRelationship = () => {
    setRelationship(undefined);
    toggleRelationshipModal();
  }

  const onClickAdmin = (_relationship) => {
    setRelationship(_relationship);
    if (_relationship.clinic_clinicians[0].admin) {
      setNoAdminRelationshipModal(true);
      return;
    }
    setAdminRelationshipModal(true);
  }

  const onClickDisableRelationship = (_relationship) => {
    setRelationship(_relationship);
    setDisableRelationshipModal(true);
  };

  const onClickEnableRelationship = (_relationship) => {
    setRelationship(_relationship);
    setEnableRelationshipModal(true);
  }

  const handleDisableRelationship = () => {
    if (relationship) {
      dispatch(activateClinicClinicianBy({ 
        guid: relationship.clinic_clinicians[0].guid,
        disabled: !relationship.clinic_clinicians[0].disabled
      }));
    }

    setDisableRelationshipModal(false);
  };

  const handleEnableRelationship = () => {
    if (relationship) {
      dispatch(activateClinicClinicianBy({ 
        guid: relationship.clinic_clinicians[0].guid,
        disabled: !relationship.clinic_clinicians[0].disabled
      }));
    }

    setEnableRelationshipModal(false);
  }

  const onClickEnable = () => {
    setEnableClinicianModal(true);
  }

  const onClickDisable = () => {
    setDisableClinicianModal(true);
  };

  const handleDisableClinician = () => {
    if (clinician && clinician.guid) {
      dispatch(disableClinicianBy(clinician.guid));
    }

    setDisableClinicianModal(false);
  };

  const handleEnableClinician = () => {
    if (clinician && clinician.guid) {
      dispatch(enableClinicianBy(clinician.guid));
    }

    setEnableClinicianModal(false);
  };

  const handleNoAdminRelationship = () => {
    if (relationship) {
      dispatch(adminClinicClinicianBy({ 
        guid: relationship.clinic_clinicians[0].guid,
        admin: !relationship.clinic_clinicians[0].admin
      }));
    }

    setNoAdminRelationshipModal(false);
  };

  const handleAdminRelationship = () => {
    if (relationship) {
      dispatch(adminClinicClinicianBy({ 
        guid: relationship.clinic_clinicians[0].guid,
        admin: !relationship.clinic_clinicians[0].admin
      }));
    }

    setAdminRelationshipModal(false);
  }

  const showActions = () => {
    const active = clinician?.disabled == false;
    if (active) {
      return (
        <>
          <Alert color="success" role="alert">{props.t("This clinician is enabled!")}</Alert>
          <button
            type="button"
            onClick={onClickDisable}
            className="btn btn-danger ">
            <i className="bx bx-block font-size-16 align-middle me-2"></i>{" "}
            {props.t("Disable")}
          </button>
        </>
      );
    }

    return (
      <>
        <Alert color="danger" role="alert">
          {props.t("This clinician is disabled!")}
        </Alert>
        <button
          type="button"
          onClick={onClickEnable}
          className="btn btn-success ">
          <i className="bx bx-check-double font-size-16 align-middle me-2"></i>{" "}
          {props.t("Enable")}
        </button>
      </>
    );
  }

  const getClinicsLabels = () => {
    const availableClinics = clinics.filter(clinic => {
      return clinician_clinics.filter(clinician_clinic => {
        return clinic.guid === clinician_clinic.guid;
      }).length == 0;
    });
    
    return (
      <>
        <option value="" hidden></option>
        {
          availableClinics.length > 0 
          ? availableClinics.map((clinic) => <option key={clinic.guid} value={isValidClinic(clinic) ? clinic.guid : undefined }>{`${clinic.name} | ${clinic.country}`}</option>) 
          : <option value={undefined}>{NO_CLINIC}</option>
        }
      </>
    );
  }

  const showAddRelationshipModal = () => {
    return (
      <Modal isOpen={addRelationshipModal} toggle={toggleRelationshipModal}>
        <ModalHeader toggle={toggleRelationshipModal} tag="h4">
          {props.t("Add Relationship")}
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
                    }>
                    {getClinicsLabels()}
                  </Input>
                  {validation.touched.clinic && validation.errors.clinic ? (
                    <FormFeedback type="invalid">
                      {validation.errors.clinic}
                    </FormFeedback>
                  ) : null}
                </div>
                <div className="mb-3">
                  <Label className="form-label">{props.t("Admin")}</Label>
                  <Input
                    name="admin"
                    type="switch"
                    onChange={validation.handleChange}
                    onBlur={validation.handleBlur}
                    value={validation.values.admin || ""}
                    invalid={
                      validation.touched.admin && validation.errors.admin
                        ? true
                        : false
                    }
                  />
                  {validation.touched.admin && validation.errors.admin ? (
                    <FormFeedback type="invalid">
                      {validation.errors.admin}
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

  return (
    <React.Fragment>
      <QuestionModal
        visible={disableClinicianModal}
        positive={false}
        questionText={`${props.t("Are you sure you want to disable the clinician")}: ${clinician?.email}`}
        onPositiveText={props.t("Disable Now")}
        onPositiveClick={handleDisableClinician}
        onNegativeText={props.t("Close")}
        onNegativeClick={() => setDisableClinicianModal(false)}
      />
      <QuestionModal
        visible={enableClinicianModal}
        positive={true}
        questionText={`${props.t("Are you sure you want to enable the clinician")}: ${clinician?.email}`}
        onPositiveText={props.t("Enable Now")}
        onPositiveClick={handleEnableClinician}
        onNegativeText={props.t("Close")}
        onNegativeClick={() => setEnableClinicianModal(false)}
      />
      <QuestionModal
        visible={disableRelationshipModal}
        positive={false}
        questionText={`${props.t("Are you sure you want to disable the relationship")}: ${clinician?.email} - ${relationship?.name}`}
        onPositiveText={props.t("Disable Now")}
        onPositiveClick={handleDisableRelationship}
        onNegativeText={props.t("Close")}
        onNegativeClick={() => setDisableRelationshipModal(false)}
      />
      <QuestionModal
        visible={enableRelationshipModal}
        positive={true}
        questionText={`${props.t("Are you sure you want to enable the relationship")}: ${clinician?.email} - ${relationship?.name}`}
        onPositiveText={props.t("Enable Now")}
        onPositiveClick={handleEnableRelationship}
        onNegativeText={props.t("Close")}
        onNegativeClick={() => setEnableRelationshipModal(false)}
      />
      <QuestionModal
        visible={noAdminRelationshipModal}
        positive={false}
        questionText={`${props.t("Would you like to alter the relationship to NO ADMIN?")}: ${clinician?.email} - ${relationship?.name}`}
        onPositiveText={props.t("Yes")}
        onPositiveClick={handleNoAdminRelationship}
        onNegativeText={props.t("No")}
        onNegativeClick={() => setNoAdminRelationshipModal(false)}
      />
      <QuestionModal
        positive={true}
        visible={adminRelationshipModal}
        questionText={`${props.t("Would you like to alter the relationship to ADMIN?")}: ${clinician?.email} - ${relationship?.name}`}
        onPositiveText={props.t("Yes")}
        onPositiveClick={handleAdminRelationship}
        onNegativeText={props.t("No")}
        onNegativeClick={() => setAdminRelationshipModal(false)}
      />
      <div className="page-content">
        <Container fluid>
          { error ? showToast(props.t("Error"), getErrorMessage(props.t, error), () => { dispatch(cleanClinicianError()) }) : null }
          { errorClinics ? showToast(props.t("Error"), getErrorMessage(props.t, errorClinics), () => { dispatch(cleanClinicsError()) }) : null }
          <Row>
            <Col xl="4">
              <Card className="overflow-hidden">
                <div className="bg-primary bg-soft">
                  <Row>
                    <Col xs="7">
                      <div className="text-primary p-3">
                        <h5 className="text-primary">{props.t("Clinician details")}</h5>
                      </div>
                    </Col>
                    <Col xs="5" className="align-self-end">
                      <img src={profile} alt="" className="img-fluid" />
                    </Col>
                  </Row>
                </div>
              </Card>

              <Card>
                <CardBody>
                  <CardTitle className="mb-4">{props.t("Information")}</CardTitle>
                  <div className="table-responsive">
                    <Table className="table-nowrap mb-0">
                      <tbody>
                        <tr>
                          <th scope="row">{props.t("Name")}</th>
                          <td>{clinician?.name}</td>
                        </tr>
                        <tr>
                          <th scope="row">{props.t("Email")}</th>
                          <td>{clinician?.email}</td>
                        </tr>
                      </tbody>
                    </Table>
                  </div>
                </CardBody>
                <CardBody>
                  {showActions()}
                </CardBody>
              </Card>
            </Col>

            <Col xl="8">
              <Row>
                {map(miniCards, (card, key) => (
                  <MiniCards
                    title={card.title}
                    text={card.text}
                    iconClass={card.iconClass}
                    key={"_card_" + key}
                  />
                ))}
              </Row>
              <Card>
                <CardBody>
                  <CardTitle className="mb-4">{props.t("Clinics Relationships")}</CardTitle>
                  <LocalTableContainer
                    columns={columns}
                    data={clinician_clinics}
                    onAddItemClick={onAddRelationship}
                    onAddItemText={props.t("Add relationship")}
                    isGlobalFilter={false}
                    customPageSize={5}
                    customPageSizeOptions={true}
                  />
                </CardBody>
              </Card>
            </Col>
          </Row>
          {showAddRelationshipModal()}
        </Container>
      </div>
    </React.Fragment>
  );
};

PlatoClinicianDetail.propTypes = {
  router: PropTypes.any,
  t: PropTypes.any,
  guid: PropTypes.string,
};

export default withRouter(withTranslation()(PlatoClinicianDetail));
