import React, { useEffect, useState, useRef, useMemo } from "react";
import PropTypes from "prop-types";
import { Link } from "react-router-dom";
import {
  Card,
  CardBody,
  Col,
  Container,
  UncontrolledTooltip,
} from "reactstrap";
import { withTranslation } from "react-i18next";
import LocalTableContainer from "../../../components/Common/LocalTableContainer";

import Breadcrumbs from "../../../components/Common/Breadcrumb";
import DisableItemModal from "../../../components/Common/DisableItemModal";
import EnableItemModal from "../../../components/Common/EnableItemModal";

import {
  getClinicStimulations,
  disableClinicStimulation,
  enableClinicStimulation,
  clearStimulationsError,
} from "../../../store/stimulations/actions";
import { getMyClinics } from "../../../store/clinics/actions";
import withRouter from "../../../components/Common/withRouter";
import { useSelector, useDispatch } from "react-redux";
import {
  Title,
  Color,
  CreateAt,
  ShortDescription,
  UpdatedAt,
  Original,
  Duration,
  Current,
  Anode,
  Cathode,
  Name,
} from "../stimulations-item-list";
import { showToast } from "../../../util/toast";
import getErrorMessage from "../../../api/error";

const ClinicStimulations = (props) => {
  document.title = `${props.t("Clinic Stimulations")} | ${props.t(
    "Platoscience"
  )}`;

  const dispatch = useDispatch();

  const [stimulation, setStimulation] = useState(undefined);
  const [selectedClinic, setSelectedClinic] = useState(undefined);

  const { clinic_stimulations, loading, error } = useSelector((state) => ({
    clinic_stimulations: state.stimulations.clinic_stimulations,
    loading: state.stimulations.loading,
    error: state.stimulations.error,
  }));

  const { my_clinics, clinics_error } = useSelector((state) => ({
    my_clinics: state.clinics.my_clinics,
    clinics_error: state.clinics.error,
  }));

  useEffect(() => {
    dispatch(getMyClinics());
  }, []);

  useEffect(() => {
    if (!my_clinics || my_clinics.length == 0) return;
    setSelectedClinic(my_clinics[0]);
  }, [my_clinics]);

  

  useEffect(() => {
    if (!selectedClinic) return;
    dispatch(getClinicStimulations(selectedClinic.guid));
  }, [selectedClinic]);

  const columns = useMemo(
    () => [
      {
        Header: props.t("Title"),
        accessor: "title",
        Cell: (cellProps) => {
          return <Title {...cellProps} />;
        },
      },
      {
        Header: props.t("Display Name"),
        accessor: "name",
        Cell: (cellProps) => {
          return cellProps.row.original.name? cellProps.row.original.name : cellProps.row.original.title
        },
      },
      {
        Header: props.t("Short Description"),
        accessor: "short_description",
        Cell: (cellProps) => {
          return <ShortDescription {...cellProps} />;
        },
      },
      {
        Header: props.t("Duration"),
        Cell: (cellProps) => {
          return <Duration {...cellProps} />;
        },
      },
      {
        Header: props.t("Current"),
        Cell: (cellProps) => {
          return <Current {...cellProps} />;
        },
      },
      {
        Header: props.t("Anode"),
        Cell: (cellProps) => {
          return <Anode {...cellProps} />;
        },
      },
      {
        Header: props.t("Cathode"),
        Cell: (cellProps) => {
          return <Cathode {...cellProps} />;
        },
      },
      /*{
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
      },*/
      {
        Header: props.t("Color"),
        Cell: (cellProps) => {
          return <Color {...cellProps} />;
        },
      },
      {
        Header: props.t("type"),
        Cell: (cellProps) => {
          return <Original {...cellProps} />;
        },
      },
      {
        Header: props.t("Active"),
        Cell: (cellProps) => {
          const item = cellProps.row.original;
          const isOriginal = () => item.original;
          const isActive = () => item.disabled == false;

          const getColor = () => (isActive() ? "text" : "text-danger");
          const getIcon = () =>
            isActive()
              ? "mdi mdi-check-circle font-size-18"
              : "mdi mdi-close-circle font-size-18";

          if (isOriginal()) {
            return (
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <i className={getIcon()} />
              </div>
            );
          }

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
                  {`${props.t("Enable/Disable")} ${props.t(
                    "Clinic Stimulation"
                  )}`}
                </UncontrolledTooltip>
              </Link>
            </div>
          );
        },
      },
      {
        Header: "Actions",
        Cell: (cellProps) => {
          const item = cellProps.row.original;
          if (item.original == false) {
            return (
              <div style={{ display: "flex", alignItems: "center", justifyContent: "center"}}>
                <Link to={`/stimulation/clinic/detail/${item.guid}`} className={`text-primary ${item.intervention_treatment_tes.length > 0 ? 'hidden' : ''} `} params={{ stimulation: item }} onClick={() => { }}>
                  <i className="mdi mdi-pencil font-size-18" id="edittooltip" />
                </Link>
              </div>
            );
          } else {
            return (
              <div style={{ display: "flex", alignItems: "center", justifyContent: "center"}}>
                <Link to={`/stimulation/new/${item.guid}`} className={`text-success`} params={{ stimulation: item }} onClick={() => { }}>
                  <i className="mdi mdi-content-copy font-size-18" id="edittooltip" />
                </Link>
              </div>
            )
          }

        }
      },
    ],
    []
  );

  const [disableItemModal, setDisableItemModal] = useState(false);
  const [enableItemModal, setEnableItemModal] = useState(false);

  const onClickDisable = (_stimulation) => {
    setStimulation(_stimulation);
    setDisableItemModal(true);
  };

  const onClickEnable = (_stimulation) => {
    setStimulation(_stimulation);
    setEnableItemModal(true);
  };

  const handleDisableStimulation = () => {
    if (stimulation && stimulation.guid) {
      dispatch(disableClinicStimulation(stimulation.guid, selectedClinic.guid));
    }

    setStimulation(undefined);
    setDisableItemModal(false);
  };

  const handleEnableStimulation = () => {
    if (stimulation && stimulation.guid) {
      dispatch(enableClinicStimulation(stimulation.guid, selectedClinic.guid));
    }

    setStimulation(undefined);
    setEnableItemModal(false);
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

  const showClinicSelector = () => {
    return (
      <Col md={2}>
        <select
          className="form-select"
          defaultValue={selectedClinic}
          onChange={(e) => setSelectedClinic(JSON.parse(e.target.value))}
        >
          {my_clinics.map((_clinic) => (
            <option key={_clinic.guid} value={JSON.stringify(_clinic)}>
              {_clinic.name}
            </option>
          ))}
        </select>
      </Col>
    );
  };

  //const originalId = "custom";

  const onAddStimulation = () => {
    const path = `/stimulation/clinic/new/${my_clinics[0].guid}`;
    props.router.navigate(path);
  };

  return (
    <React.Fragment>
      <DisableItemModal
        show={disableItemModal}
        onDisableClick={handleDisableStimulation}
        itemText={"Stimulation"}
        onCloseClick={() => setDisableItemModal(false)}
      />
      <EnableItemModal
        show={enableItemModal}
        onEnableClick={handleEnableStimulation}
        itemText={"Stimulation"}
        onCloseClick={() => setEnableItemModal(false)}
      />
      <div className="page-content">
        <Container fluid>
          <Breadcrumbs
            title={props.t("Stimulation")}
            breadcrumbItem={props.t("Clinic Stimulations")}
          />
          <Card>
            <CardBody>
              {!showClinicSelector()}
              {error
                ? showToast("Error", getErrorMessage(props.t, error), () => {
                  dispatch(clearStimulationsError());
                })
                : null}
              {loading ? (
                showPlaceholder()
              ) : (
                <LocalTableContainer
                  columns={columns}
                  data={clinic_stimulations}
                  isGlobalFilter={true}
                  onAddItemText={props.t("Add Stimulation")}
                  onAddItemClick={onAddStimulation}
                  customPageSize={10}
                  className="custom-header-css"
                />
              )}
            </CardBody>
          </Card>
        </Container>
      </div>
    </React.Fragment>
  );
};

ClinicStimulations.propTypes = {
  router: PropTypes.any,
  t: PropTypes.any,
};

export default withRouter(withTranslation()(ClinicStimulations));
