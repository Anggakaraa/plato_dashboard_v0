import React, { useEffect, useMemo } from "react";
import PropTypes from "prop-types";
import { withTranslation } from "react-i18next";
import { Card, CardBody, Container, UncontrolledTooltip } from "reactstrap";
import Breadcrumbs from "../../../components/Common/Breadcrumb";
import LocalTableContainer from "../../../components/Common/LocalTableContainer";
import { useDispatch, useSelector } from "react-redux";
import { getMyClinics } from "../../../store/clinics/actions";
import { Country, CreateAt, Email, Name, UpdatedAt } from "../clinic-item-list";
import { Link } from "react-router-dom";

const MyClinics = (props) => {
  document.title = `${props.t("My Clinics")} | ${props.t("Platoscience")}`;

  const dispatch = useDispatch();

  const { my_clinics, loading } = useSelector((state) => ({
    my_clinics: state.clinics.my_clinics,
    loading: state.clinics.loading,
  }));

  useEffect(() => {
    dispatch(getMyClinics());
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
        Header: "Country",
        accessor: "country",
        Cell: (cellProps) => {
          return <Country {...cellProps} />;
        },
      },
      {
        Header: props.t("Admin"),
        Cell: (cellProps) => {
          const item = cellProps.row.original;
          const relationship = item.clinic_clinicians[0];
          const isAdmin = () => relationship.admin === true;
          const getColor = () => (isAdmin() ? "text-success" : "text-danger");
          const getIcon = () =>
            isAdmin()
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
              <i className={getColor()}>
                <i className={getIcon()} id="adminimage" />
              </i>
            </div>
          );
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
                <UncontrolledTooltip
                 placement="top" target="detailtooltip">
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
            title={props.t("Clinics")}
            breadcrumbItem={props.t("My clinics")}
          />
          <Card>
            <CardBody>
              {loading ? (
                showPlaceholder()
              ) : (
                <LocalTableContainer
                  columns={columns}
                  data={my_clinics}
                  isGlobalFilter={true}
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

MyClinics.propTypes = {
  t: PropTypes.any,
};

export default withTranslation()(MyClinics);
