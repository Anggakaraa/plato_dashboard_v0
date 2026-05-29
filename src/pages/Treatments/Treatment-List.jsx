import React, { useEffect, useMemo, useRef, useState } from "react"
import PropTypes from "prop-types";

import { withTranslation } from "react-i18next";
import {
  Badge,
  Card,
  CardBody,
  Col,
  Container,
  Row
} from "reactstrap"
//Import Breadcrumb
import Breadcrumbs from "../../components/Common/Breadcrumb"
import LocalTableContainer from "../../components/Common/LocalTableContainer";
import { useNavigate } from "react-router-dom";
import { get } from "../../api/manager";
import { useDispatch, useSelector } from "react-redux";
import { getClinics } from "../../store/actions";

const TreatmentList = (props) => {

  const navigate = useNavigate();

  //meta title
  document.title = "Treatment Protocols | Plato Dashboard";

  const [treatments, setTreatments] = useState([]);
  const { clinics, loading } = useSelector((state) => ({
    clinics: state.clinics.clinics,
    loading: state.clinics.loading,
  }));

  async function getTreatments() {
    const baseurl = (import.meta).env.VITE_APP_API_URL;
    const [data] = await Promise.all([
        await get(`${baseurl}/treatments-group`, true, {
          headers: {
            "Content-Type": "application/json",
          },
        })
    ])
    const treatmentWithClinic = []
    if(data){
      for (const treatment of data) {
        treatment.clinic = clinics.find(clinic => clinic.id === treatment.clinic_id);
        treatmentWithClinic.push(treatment)
      }
    }
    setTreatments(treatmentWithClinic);
  }

  const dispatch = useDispatch();

  // Fetch clinics first, then enrich treatments once clinics are available.
  // Both run on mount; getTreatments re-runs whenever clinics loads/updates.
  useEffect(() => {
    dispatch(getClinics());
  }, []);

  useEffect(() => {
    if (clinics.length > 0) getTreatments();
  }, [clinics]);


  const columns = useMemo(
    () => [
      {
        Header: props.t("Name"),
        accessor: "name",
        Cell: (cellProps) => {
          return cellProps.value ? cellProps.value : "";
        },
      },
      {
        Header: props.t("Clinic"),
        accessor: "clinic.name",
        Cell: (cellProps) => {
          return cellProps.value ? cellProps.value : "";
        },
      },
      {
        Header: props.t("Description"),
        accessor: "description",
        Cell: (cellProps) => {
          return cellProps.value ? cellProps.value : "";
        },
      },
      {
        Header: props.t("Stimulations"),
        id: "stimulations",
        Cell: (cellProps) => {
          const stims = cellProps.row.original.interventions ?? [];
          if (stims.length === 0) return <span className="text-muted">—</span>;
          return (
            <div className="d-flex flex-wrap gap-1">
              {stims.map((iv) => (
                <Badge key={iv.guid} color="light" className="text-dark border">
                  {iv.tes_stimulation?.name ?? iv.stimulation_guid}
                </Badge>
              ))}
            </div>
          );
        },
      },
      {
        Header: props.t("Details"),
        id: "details",
        Cell: (cellProps) => {
          const item = cellProps.row.original;
          return (
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}>
              <button
                className="btn btn-primary btn-sm"
                onClick={() => {
                  navigate(`/treatments-by-steps/details/${item.guid}`);
                }}
              >
                <i className="fas fa-list"></i>
              </button>
            </div>
          );
        },
      },
          
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
 

  return (
    <React.Fragment>
      <div className="page-content">
        <Container fluid>
          <Breadcrumbs
            title={props.t("Treatment Management")}
            breadcrumbItem={props.t("Treatment Protocols")}
          />
          <Card>
            <CardBody>
              <LocalTableContainer
                columns={columns}
                data={treatments}
                isGlobalFilter={true}
                onAddItemText={props.t("Add Treatment")}
                onAddItemClick={() => {
                  navigate("/treatments-by-steps/new");
                }}
                customPageSize={10}
                className="custom-header-css"
                emptyStateTitle={props.t("No treatment protocols yet")}
                emptyStateMessage={props.t("Create your first protocol to start assigning treatments to patients.")}
              />
            </CardBody>
          </Card>
        </Container>
      </div>
    </React.Fragment>
  )
}

TreatmentList.propTypes = {
  t: PropTypes.any,
};

export default withTranslation()(TreatmentList);
