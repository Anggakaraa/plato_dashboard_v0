import React, { useEffect, useState, useRef, useMemo } from "react";
import PropTypes from "prop-types";
import { Link, useNavigate } from "react-router-dom";
import LocalTableContainer from "../../components/Common/LocalTableContainer";
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
import withRouter from "../../components/Common/withRouter";
import { withTranslation } from "react-i18next";

import Breadcrumbs from "../../components/Common/Breadcrumb";

import { getUserReportsList } from "../../store/reports/actions"

import getErrorMessage from "../../api/error";
import { useSelector, useDispatch } from "react-redux";
import { Name } from "./reports-item-list";
import { showToast } from "../../util/toast";
import { GoBack } from "../../components/Common/GoBack";
import Rating from "react-rating";

const PlatoReports = (props) => {
  document.title = `${props.t("Patient")} | ${props.t("Reports")}`;
  const dispatch = useDispatch();
  const guid = props.router.params.guid;
  const [modal, setModal] = useState(false);


  const { reports_list, loading_reports, error: error_reports} = useSelector((state) => ({
    reports_list: state.Reports.reports_list,
    loading_reports: state.Reports.loading,
  }));

  const [showError, setShowError] = useState(undefined);
  useEffect(() => {
    if (error_reports !== showError) setShowError(error_reports);
  }, [error_reports]);

  const validation = useFormik({
    enableReinitialize: true,
  });

  useEffect(() => {
    if (!modal) validation.resetForm();
  }, [modal]);

  useEffect(() => {
    dispatch(getUserReportsList(guid));
  }, []);

  const columns = useMemo(
    () => [
      {
        Header: "Date",
        accessor: "created_at",
        Cell: (cellProps) => {
          const date = new Date(cellProps.cell.value*1000).toLocaleString();
          return date.split(',')[0];
        },
      },
      {
        Header: "Time",
        Cell: (cellProps) => {
          const item = cellProps.row.original;
          const date = new Date(item.created_at*1000).toLocaleString();
          return date.split(',')[1];
        },
      },
      {
        Header: "Mode",
        accessor: "session_name",
        Cell: (cellProps) => {
          return <Name {...cellProps} />;
        },
      },
      {
        Header: "kΩ",
        accessor: "analysis.resistance_median",
        Cell: (cellProps) => {
          return <Name {...cellProps} />;
        },
      },
      {
        Header: "mA",
        accessor: "analysis.current_median",
        Cell: (cellProps) => {
          return <Name {...cellProps} />;
        },
      },
      {
        Header: "Minutes",
        accessor: "analysis.time_duration",
        Cell: (cellProps) => {
          const item = cellProps.cell.value ;
          const minutes = parseInt(item/60)
          return minutes;
        },
      },
      {
        Header: "Classification",
        accessor: "analysis.classification",
        Cell: (cellProps) => {
            return (
              <Rating
                  stop={5}
                  emptySymbol="mdi mdi-star-outline text-primary "
                  fullSymbol="mdi mdi-star text-success"
                  className="rating-symbol-background"
                  initialRating={cellProps.cell.value}
                  readonly
              />
            )
        },
      },
      {
        Header: "Patient Rating",
        accessor: "post_rating.rating",
        Cell: (cellProps) => {
          return (
            <Rating
                stop={5}
                emptySymbol="mdi mdi-star-outline text-primary "
                fullSymbol="mdi mdi-star text-warning"
                className="rating-symbol-background"
                initialRating={cellProps.cell.value}
                readonly
            />
          )
        },
      },
      /*{
        Header: "Details",
        Cell: (cellProps) => {
          const item = cellProps.row.original;
          const path = `/patient/report/details/${item.session_id}`;
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
                  className="mdi mdi-align-horizontal-left font-size-18"
                  id="reporttooltip"
                />
                <UncontrolledTooltip placement="top" target="reporttooltip">
                  {props.t("Show report Details")}
                </UncontrolledTooltip>
              </Link>
            </div>
          );
        },
      },*/

      
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
    ],
    []
  );

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

  const navigate = useNavigate()

  return (
    <React.Fragment>
      
      <div className="page-content">
        <Container fluid>
          <GoBack/>
          <Breadcrumbs
            title={props.t("Patients")}
            breadcrumbItem={props.t(`Reports (${reports_list.length})`)}
          />
          <Card>
            <CardBody>
              {showError
                ? showToast("Error", getErrorMessage(props.t, error_reports), () => {
                    setShowError(undefined);
                  })
                : null}
              { loading_reports ? (
                showPlaceholder()
              ) : (
                reports_list.length ? <LocalTableContainer
                  columns={columns}
                  data={reports_list}
                  isGlobalFilter={true}
                  customPageSize={30}
                  className="custom-header-css"
                /> : 'No reports found'
              )}
            </CardBody>
          </Card>
        </Container>
      </div>
    </React.Fragment>
  );
};

PlatoReports.propTypes = {
  t: PropTypes.any,
};

export default withRouter(withTranslation()(PlatoReports));
