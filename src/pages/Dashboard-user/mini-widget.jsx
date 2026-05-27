import PropTypes from "prop-types";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Col, Card, CardBody, Row } from "reactstrap";
import { useUser } from "../../hooks/user";
import { getClinicians } from "../../store/users/actions";
import { get } from "../../api/manager";

import { getClinics } from "../../store/clinics/actions";
import { getStimulations } from "../../store/stimulations/actions";

const MiniWidget = () => {
  const dispatch = useDispatch();
  document.title = "Dashboard | PlatoScience";

  const { user, isPlato } = useUser();

  const { clinicians } = useSelector((state) => ({
    clinicians: state.users.clinician_users,
  }));
  const { clinics } = useSelector((state) => ({
    clinics: state.clinics.clinics,
  }));
  const { stimulations } = useSelector((state) => ({
    stimulations: state.stimulations.stimulations,
  }));

  // Fetch patient count directly — avoids overwriting the paginated Redux
  // state used by the /patients page (which breaks its own pagination).
  const [patientCount, setPatientCount] = useState(null);
  useEffect(() => {
    const baseurl = import.meta.env.VITE_APP_API_URL;
    get(`${baseurl}/plato/patients?page=1&limit=1`, true, {})
      .then((data) => setPatientCount(data?.pagination?.total ?? data?.length ?? 0))
      .catch(() => setPatientCount(0));
  }, []);

  const reports = [
    {
      icon: "fas fa-hospital-user",
      title: "Clinics",
      value: clinics.length,
    },
    {
      icon: "fas fa-user-md",
      title: "Clinicians",
      value: clinicians.length,
    },
    {
      icon: "fas fa-user-injured",
      title: "Patients",
      value: patientCount !== null ? patientCount : "—",
    },
    {
      icon: "mdi mdi-waveform",
      title: "Stimulations",
      value: stimulations.length,
    },
  ];

  useEffect(() => {
    dispatch(getClinicians());
    dispatch(getClinics());
    dispatch(getStimulations());
  }, []);

  return (
    <Row>
      {reports.map((report, key) => (
        <Col xs="6" sm="6" lg="3" key={key}>
          <Card className="mini-stats-wid">
            <CardBody>
              <div className="d-flex align-items-center">
                <div className="me-3 flex-grow-1">
                  <p className="mb-1" style={{ fontSize: 11, fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.07em", color: "#AC8599" }}>{report.title}</p>
                  <h4 className="mb-0" style={{ fontSize: 28, fontWeight: 700, color: "#57072F", fontVariantNumeric: "tabular-nums", lineHeight: 1 }}>{report.value}</h4>
                </div>
                <div
                  style={{
                    width: 44,
                    height: 44,
                    borderRadius: 10,
                    background: "rgba(87,7,47,0.07)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    flexShrink: 0,
                  }}
                >
                  <i className={report.icon} style={{ fontSize: 20, color: "#57072F" }}></i>
                </div>
              </div>
            </CardBody>
          </Card>
        </Col>
      ))}
    </Row>
  );
};

MiniWidget.propTypes = {
  reports: PropTypes.array,
};

export default MiniWidget;
