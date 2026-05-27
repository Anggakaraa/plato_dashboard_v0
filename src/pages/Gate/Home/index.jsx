import React, { useEffect, useState } from "react";
import {
  Row,
  Col,
  Card,
  CardBody,
  CardHeader,
  Table,
  Badge,
  Spinner,
  Button,
} from "reactstrap";
import { useUser } from "../../../hooks/user";
import { useClinic } from "../contexts/ClinicContext";
import { getMyPatients } from "../../../api/clinician";
import { getClinicStimulations } from "../../../api";
import { getClinicPatientsAnalytics } from "../../../api/analytics";
import { formatDate } from "../../../util/time";
import CountUp from "react-countup";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

const Home = () => {
  const { user } = useUser();
  const { selectedClinic, isLoading: isLoadingClinic } = useClinic();
  const firstName = user?.username || "Clinician";

  // State
  const [patients, setPatients] = useState([]);
  const [totalPatients, setTotalPatients] = useState(0);
  const [totalStimulations, setTotalStimulations] = useState(0);
  const [analytics, setAnalytics] = useState(null);
  const [isLoadingPatients, setIsLoadingPatients] = useState(true);
  const [isLoadingStimulations, setIsLoadingStimulations] = useState(true);
  const [isLoadingAnalytics, setIsLoadingAnalytics] = useState(true);
  const [chartPeriod, setChartPeriod] = useState("daily");

  // Fetch patients when clinic is selected
  useEffect(() => {
    const fetchPatients = async () => {
      if (!selectedClinic?.guid) return;

      try {
        setIsLoadingPatients(true);
        const response = await getMyPatients(1, 10, "");

        const patientsData = response?.data || [];
        const pagination = response?.pagination || null;

        setPatients(patientsData);
        setTotalPatients(pagination?.total || 0);
      } catch (err) {
        console.error("Error fetching patients:", err);
        setPatients([]);
        setTotalPatients(0);
      } finally {
        setIsLoadingPatients(false);
      }
    };

    fetchPatients();
  }, [selectedClinic]);

  // Fetch stimulations when clinic is selected
  useEffect(() => {
    const fetchStimulations = async () => {
      if (!selectedClinic?.guid) return;

      try {
        setIsLoadingStimulations(true);
        const res = await getClinicStimulations(selectedClinic.guid);
        const rawPayload = res?.data || res;

        let mergedData = [];
        if (rawPayload && typeof rawPayload === "object") {
          const original = rawPayload.original || [];
          const clinic = rawPayload.clinic || [];
          mergedData = [...original, ...clinic];
        } else if (Array.isArray(rawPayload)) {
          mergedData = rawPayload;
        }

        setTotalStimulations(mergedData.length);
      } catch (err) {
        console.error("Error fetching stimulations:", err);
        setTotalStimulations(0);
      } finally {
        setIsLoadingStimulations(false);
      }
    };

    fetchStimulations();
  }, [selectedClinic]);

  // Fetch analytics when clinic is selected
  useEffect(() => {
    const fetchAnalytics = async () => {
      if (!selectedClinic?.guid) return;

      try {
        setIsLoadingAnalytics(true);
        const data = await getClinicPatientsAnalytics(selectedClinic.guid);
        setAnalytics(data);
      } catch (err) {
        console.error("Error fetching analytics:", err);
        setAnalytics(null);
      } finally {
        setIsLoadingAnalytics(false);
      }
    };

    fetchAnalytics();
  }, [selectedClinic]);

  // Get chart data based on selected period
  const getChartData = () => {
    if (!analytics?.charts) return [];
    return analytics.charts[chartPeriod] || [];
  };

  return (
    <div className="fade-in" style={{ animation: "fadeIn 0.5s ease-in-out" }}>
      {/* Welcome Banner */}
      <Row className="mb-4">
        <Col xs="12">
          <Card className="gate-welcome-card">
            <CardBody
              style={{
                padding: "3rem 2rem",
                display: "flex",
                alignItems: "center",
                gap: "2rem",
              }}
            >
              <div className="gate-welcome-icon-box m-0 d-none d-md-flex">
                <i className="mdi mdi-brain"></i>
              </div>
              <div className="flex-grow-1">
                <h1 className="gate-welcome-title mb-2">
                  Welcome, {firstName}!
                </h1>
              </div>
            </CardBody>
          </Card>
        </Col>
      </Row>

      {/* Enhanced KPI Widgets */}
      <Row className="mb-4">
        <Col lg="6" md="6" className="mb-3">
          <div
            className="gate-widget-card"
            style={{ flexDirection: "column", alignItems: "stretch" }}
          >
            <div className="d-flex align-items-center mb-2">
              <div className="gate-widget-icon" style={{ marginRight: "15px" }}>
                {isLoadingPatients ? (
                  <Spinner size="sm" color="primary" />
                ) : (
                  <i className="mdi mdi-account-group-outline"></i>
                )}
              </div>
              <div className="gate-widget-content" style={{ flex: 1 }}>
                <h5>Total Patients</h5>
                <p className="gate-widget-value">
                  {isLoadingPatients ? (
                    "..."
                  ) : (
                    <CountUp end={totalPatients} duration={1.5} />
                  )}
                </p>
              </div>
            </div>
            {!isLoadingAnalytics && analytics?.summary && (
              <div
                className="d-flex justify-content-between align-items-center mt-2 pt-2"
                style={{ borderTop: "1px solid #e9ecef", fontSize: "0.85rem" }}
              >
                <span className="text-muted hidden">
                  <i className="mdi mdi-account-check me-1"></i>
                  {analytics.summary.active} active
                </span>
                <span
                  className={
                    analytics.summary.weeklyGrowth >= 0
                      ? "text-success hidden"
                      : "text-danger hidden"
                  }
                >
                  <i
                    className={`mdi mdi-arrow-${analytics.summary.weeklyGrowth >= 0 ? "up" : "down"} me-1`}
                  ></i>
                  {Math.abs(analytics.summary.weeklyGrowth)}% this week
                </span>
              </div>
            )}
          </div>
        </Col>

        <Col lg="6" md="6" className="mb-3">
          <div
            className="gate-widget-card"
            style={{ flexDirection: "column", alignItems: "stretch" }}
          >
            <div className="d-flex align-items-center mb-2">
              <div className="gate-widget-icon" style={{ marginRight: "15px" }}>
                {isLoadingStimulations ? (
                  <Spinner size="sm" color="primary" />
                ) : (
                  <i className="mdi mdi-lightning-bolt-outline"></i>
                )}
              </div>
              <div className="gate-widget-content" style={{ flex: 1 }}>
                <h5>Stimulations</h5>
                <p className="gate-widget-value">
                  {isLoadingStimulations ? (
                    "..."
                  ) : (
                    <CountUp end={totalStimulations} duration={1.5} />
                  )}
                </p>
              </div>
            </div>
            <div
              className="d-flex justify-content-between align-items-center mt-2 pt-2"
              style={{ borderTop: "1px solid #e9ecef", fontSize: "0.85rem" }}
            >
              <span className="text-muted">Available protocols</span>
            </div>
          </div>
        </Col>

        <Col lg="3" md="6" className="mb-3 hidden">
          <div
            className="gate-widget-card"
            style={{ flexDirection: "column", alignItems: "stretch" }}
          >
            <div className="d-flex align-items-center mb-2">
              <div
                className="gate-widget-icon"
                style={{
                  marginRight: "15px",
                  backgroundColor: "#e8f8f7",
                  color: "#2ec4b6",
                }}
              >
                <i className="mdi mdi-chart-line"></i>
              </div>
              <div className="gate-widget-content" style={{ flex: 1 }}>
                <h5>Active Rate</h5>
                <p className="gate-widget-value">
                  {isLoadingAnalytics ? (
                    "..."
                  ) : (
                    <CountUp
                      end={parseFloat(
                        analytics?.summary?.activePercentage || 0,
                      )}
                      duration={1.5}
                      decimals={1}
                      suffix="%"
                    />
                  )}
                </p>
              </div>
            </div>
            <div
              className="d-flex justify-content-between align-items-center mt-2 pt-2"
              style={{ borderTop: "1px solid #e9ecef", fontSize: "0.85rem" }}
            >
              <span className="text-muted">Patient engagement</span>
            </div>
          </div>
        </Col>

        <Col lg="3" md="6" className="mb-3 hidden">
          <div
            className="gate-widget-card"
            style={{ flexDirection: "column", alignItems: "stretch" }}
          >
            <div className="d-flex align-items-center mb-2">
              <div
                className="gate-widget-icon"
                style={{
                  marginRight: "15px",
                  backgroundColor: "#fff3e0",
                  color: "#f77f00",
                }}
              >
                <i className="mdi mdi-trending-up"></i>
              </div>
              <div className="gate-widget-content" style={{ flex: 1 }}>
                <h5>Growth</h5>
                <p className="gate-widget-value">
                  {isLoadingAnalytics ? (
                    "..."
                  ) : (
                    <span
                      className={
                        analytics?.summary?.monthlyGrowth >= 0
                          ? "text-success"
                          : "text-danger"
                      }
                    >
                      {analytics?.summary?.monthlyGrowth >= 0 ? "+" : ""}
                      <CountUp
                        end={Math.abs(
                          parseFloat(analytics?.summary?.monthlyGrowth || 0),
                        )}
                        duration={1.5}
                        decimals={1}
                        suffix="%"
                      />
                    </span>
                  )}
                </p>
              </div>
            </div>
            <div
              className="d-flex justify-content-between align-items-center mt-2 pt-2"
              style={{ borderTop: "1px solid #e9ecef", fontSize: "0.85rem" }}
            >
              <span className="text-muted">vs. last month</span>
            </div>
          </div>
        </Col>
      </Row>

      {/* Activity Chart */}
      <Row className="mb-4 hidden">
        <Col xs="12">
          <Card className="gate-table-card">
            <CardHeader className="d-flex justify-content-between align-items-center">
              <div>
                <h4 className="mb-1">Patient Activity Timeline</h4>
                <p className="text-muted m-0" style={{ fontSize: "0.85rem" }}>
                  New patient registrations over time
                </p>
              </div>
              <div className="d-flex gap-2">
                <Button
                  color={chartPeriod === "daily" ? "primary" : "light"}
                  size="sm"
                  className="rounded-pill px-3"
                  onClick={() => setChartPeriod("daily")}
                >
                  Daily
                </Button>
                <Button
                  color={chartPeriod === "weekly" ? "primary" : "light"}
                  size="sm"
                  className="rounded-pill px-3"
                  onClick={() => setChartPeriod("weekly")}
                >
                  Weekly
                </Button>
                <Button
                  color={chartPeriod === "monthly" ? "primary" : "light"}
                  size="sm"
                  className="rounded-pill px-3"
                  onClick={() => setChartPeriod("monthly")}
                >
                  Monthly
                </Button>
              </div>
            </CardHeader>
            <CardBody>
              {isLoadingAnalytics ? (
                <div className="text-center py-5">
                  <Spinner color="primary" />
                  <p className="text-muted mt-2">Loading analytics...</p>
                </div>
              ) : (
                <ResponsiveContainer width="100%" height={300}>
                  <AreaChart data={getChartData()}>
                    <defs>
                      <linearGradient
                        id="colorPatients"
                        x1="0"
                        y1="0"
                        x2="0"
                        y2="1"
                      >
                        <stop
                          offset="5%"
                          stopColor="#4361ee"
                          stopOpacity={0.3}
                        />
                        <stop
                          offset="95%"
                          stopColor="#4361ee"
                          stopOpacity={0}
                        />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                    <XAxis
                      dataKey="label"
                      stroke="#6c757d"
                      style={{ fontSize: "0.75rem" }}
                      angle={chartPeriod === "daily" ? -45 : 0}
                      textAnchor={chartPeriod === "daily" ? "end" : "middle"}
                      height={chartPeriod === "daily" ? 80 : 50}
                    />
                    <YAxis stroke="#6c757d" style={{ fontSize: "0.75rem" }} />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "#fff",
                        border: "1px solid #e9ecef",
                        borderRadius: "8px",
                        boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
                      }}
                      labelStyle={{ fontWeight: 600, marginBottom: "4px" }}
                    />
                    <Area
                      type="monotone"
                      dataKey="count"
                      stroke="#4361ee"
                      strokeWidth={2}
                      fillOpacity={1}
                      fill="url(#colorPatients)"
                      name="New Patients"
                    />
                  </AreaChart>
                </ResponsiveContainer>
              )}
            </CardBody>
          </Card>
        </Col>
      </Row>

      {/* Recent Patients Table */}
      <Row>
        <Col xs="12">
          <Card className="gate-table-card">
            <CardHeader className="d-flex justify-content-between align-items-center">
              <h4>Recent Patients</h4>
              {isLoadingPatients && <Spinner size="sm" color="primary" />}
            </CardHeader>
            <div className="table-responsive">
              <Table className="gate-table table-nowrap align-middle">
                <thead>
                  <tr>
                    <th>Name</th>
                    <th>Email</th>
                    <th>Type</th>
                    <th>CreatedAt</th>
                    <th>Active</th>
                  </tr>
                </thead>
                <tbody>
                  {!isLoadingPatients && patients.length > 0 ? (
                    patients.map((patient) => {
                      const isDefaultType = patient.email?.includes(
                        "@platoscience.clinic",
                      );
                      return (
                        <tr key={patient.guid}>
                          <td style={{ fontWeight: 500 }}>
                            {patient.name || "—"}
                          </td>
                          <td className="text-muted">{patient.email || "—"}</td>
                          <td>
                            <Badge
                              color={isDefaultType ? "primary" : "info"}
                              className="fs-6 px-2 py-1"
                            >
                              {isDefaultType ? "Default" : "Regular"}
                            </Badge>
                          </td>
                          <td>
                            {patient.createdAt
                              ? formatDate(patient.createdAt)
                              : "—"}
                          </td>
                          <td>
                            {patient.disabled === false ? (
                              <i className="mdi mdi-check-circle text-success font-size-18"></i>
                            ) : (
                              <i className="mdi mdi-close-circle text-danger font-size-18"></i>
                            )}
                          </td>
                        </tr>
                      );
                    })
                  ) : (
                    <tr>
                      <td colSpan="5" className="text-center py-4 text-muted">
                        {!isLoadingPatients
                          ? "No patients found."
                          : "Loading patients..."}
                      </td>
                    </tr>
                  )}
                </tbody>
              </Table>
            </div>
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default Home;
