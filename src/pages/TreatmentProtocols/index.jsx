import React, { useEffect, useMemo, useState } from "react";
import PropTypes from "prop-types";
import { withTranslation } from "react-i18next";
import { Card, CardBody, Col, Container, Row } from "reactstrap";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";

import Breadcrumbs from "../../components/Common/Breadcrumb";
import LocalTableContainer from "../../components/Common/LocalTableContainer";
import { get } from "../../api/manager";
import { getClinics } from "../../store/actions";

const TreatmentProtocols = (props) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  document.title = "Treatment Protocols | Plato Dashboard";

  const [protocols, setProtocols] = useState([]);
  const { clinics } = useSelector((state) => ({
    clinics: state.clinics.clinics,
  }));

  async function fetchProtocols() {
    const baseurl = import.meta.env.VITE_APP_API_URL;
    const data = await get(`${baseurl}/treatments-group`, true, {});
    if (data) {
      const enriched = data.map((p) => ({
        ...p,
        clinic: clinics.find((c) => c.id === p.clinic_id),
        stimulation_count: p.interventions?.length ?? 0,
        patient_count: p.patient_treatment?.length ?? 0,
      }));
      setProtocols(enriched);
    }
  }

  useEffect(() => {
    dispatch(getClinics());
  }, []);

  useEffect(() => {
    if (clinics.length > 0) fetchProtocols();
  }, [clinics]);

  const columns = useMemo(
    () => [
      {
        Header: props.t("Protocol Name"),
        accessor: "name",
        Cell: ({ value }) => value || "—",
      },
      {
        Header: props.t("Clinic"),
        accessor: "clinic.name",
        Cell: ({ value }) => value || "—",
      },
      {
        Header: props.t("Description"),
        accessor: "description",
        Cell: ({ value }) => value || "—",
      },
      {
        Header: props.t("Stimulations"),
        accessor: "stimulation_count",
        Cell: ({ value }) => value,
      },
      {
        Header: props.t("Patients Assigned"),
        accessor: "patient_count",
        Cell: ({ value }) => value,
      },
      {
        Header: "",
        id: "actions",
        Cell: ({ row }) => (
          <button
            className="btn btn-primary btn-sm"
            onClick={() =>
              navigate(`/treatments-by-steps/details/${row.original.guid}`)
            }
          >
            {props.t("Edit Protocol")}
          </button>
        ),
      },
    ],
    [clinics]
  );

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
                data={protocols}
                isGlobalFilter={true}
                onAddItemText={props.t("New Protocol")}
                onAddItemClick={() => navigate("/treatments-by-steps/new")}
                customPageSize={10}
                className="custom-header-css"
              />
            </CardBody>
          </Card>
        </Container>
      </div>
    </React.Fragment>
  );
};

TreatmentProtocols.propTypes = {
  t: PropTypes.any,
};

export default withTranslation()(TreatmentProtocols);
