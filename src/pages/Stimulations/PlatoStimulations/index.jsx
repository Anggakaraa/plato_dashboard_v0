import React, { useEffect, useState, useRef, useMemo } from "react";
import PropTypes from "prop-types";
import { Link } from "react-router-dom";
import { Card, CardBody, Container, UncontrolledTooltip } from "reactstrap";
import { withTranslation } from "react-i18next";
import LocalTableContainer from "../../../components/Common/LocalTableContainer";

import Breadcrumbs from "../../../components/Common/Breadcrumb";
import DisableItemModal from "../../../components/Common/DisableItemModal";
import EnableItemModal from "../../../components/Common/EnableItemModal";

import {
  getStimulations,
  disableStimulation,
  enableStimulation,
  clearStimulationsError,
} from "../../../store/stimulations/actions";
import withRouter from "../../../components/Common/withRouter";
import { useSelector, useDispatch } from "react-redux";
import {
  Title,
  Color,
  CreateAt,
  ShortDescription,
  UpdatedAt,
  Original,
  Anode,
  Cathode,
  Current,
  Duration,
  Name,
} from "../stimulations-item-list";
import { showToast } from "../../../util/toast";
import getErrorMessage from "../../../api/error";
import { useUserContext } from "../../../context/user-access.context";

const PlatoStimulations = (props) => {
  document.title = `${props.t("All Stimulations")} | ${props.t(
    "Platoscience",
  )}`;

  const { isSuperAccess } = useUserContext();

  const dispatch = useDispatch();
  const [stimulation, setStimulation] = useState(undefined);

  const originalId = "original";

  const { stimulations, loading, error } = useSelector((state) => ({
    stimulations: state.stimulations.stimulations,
    loading: state.stimulations.loading,
    error: state.stimulations.error,
  }));

  useEffect(() => {
    dispatch(getStimulations());
  }, []);

  const superUserAccess = useMemo(() => {
    return isSuperAccess();
  }, [isSuperAccess()]);

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
          return cellProps.row.original.name
            ? cellProps.row.original.name
            : cellProps.row.original.title;
        },
      },
      {
        Header: props.t("Short Description"),
        //accessor: "short_description",
        Cell: (cellProps) => {
          return <ShortDescription {...cellProps} />;
        },
      },
      {
        Header: props.t("In Treatments"),
        Cell: (cellProps) => {
          return (
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              {cellProps.row.original.intervention_treatment_tes}
            </div>
          );
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
        Header: props.t("Type"),
        Cell: (cellProps) => {
          return <Original {...cellProps} />;
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
                  {`${props.t("Enable/Disable")} ${props.t("Stimulation")}`}
                </UncontrolledTooltip>
              </Link>
            </div>
          );
        },
      },
      {
        Header: "Edit",
        Cell: (cellProps) => {
          const item = cellProps.row.original;
          const path = `/stimulation/${item.guid}`;
          if (
            (item.intervention_treatment_tes > 0 && superUserAccess) ||
            item.intervention_treatment_tes === 0
          ) {
            return (
              <Link to={path} className="text-primary">
                <i
                  className="mdi mdi-pencil font-size-18"
                  id="edittip-danger"
                />
                <UncontrolledTooltip placement="top" target="edittip-danger">
                  {props.t("Edit Stimulation")}
                </UncontrolledTooltip>
              </Link>
            );
          }
        },
      },
    ],
    [],
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
      dispatch(disableStimulation(stimulation.guid));
    }

    setStimulation(undefined);
    setDisableItemModal(false);
  };

  const handleEnableStimulation = () => {
    if (stimulation && stimulation.guid) {
      dispatch(enableStimulation(stimulation.guid));
    }

    setStimulation(undefined);
    setEnableItemModal(false);
  };

  const onAddStimulation = () => {
    const path = `/stimulation/new/${originalId}`;
    props.router.navigate(path);
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
            breadcrumbItem={props.t("All Stimulations here")}
          />
          <Card>
            <CardBody>
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
                  data={stimulations}
                  isGlobalFilter={true}
                  onAddItemText={props.t("Add Stimulation")}
                  onAddItemClick={onAddStimulation}
                  customPageSize={10}
                  className="custom-header-css"
                  emptyStateTitle="No stimulations yet."
                  emptyStateMessage="Create your first stimulation protocol to get started."
                />
              )}
            </CardBody>
          </Card>
        </Container>
      </div>
    </React.Fragment>
  );
};

PlatoStimulations.propTypes = {
  router: PropTypes.any,
  t: PropTypes.any,
};

export default withRouter(withTranslation()(PlatoStimulations));
