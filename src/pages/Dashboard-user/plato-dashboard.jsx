import React from "react";
import { Row, Col, Card, CardBody } from "reactstrap";
import MiniWidget from "./mini-widget";
import { Link } from "react-router-dom";
import { useUser } from "../../hooks/user";

// Admin quick-access links
const ADMIN_LINKS = [
  {
    href: "/patients",
    icon: "mdi mdi-account-group",
    color: "#57072F",
    bg: "rgba(87,7,47,0.08)",
    title: "All Patients",
    desc: "Browse and manage every patient",
  },
  {
    href: "/clinicians",
    icon: "mdi mdi-doctor",
    color: "#053146",
    bg: "rgba(5,49,70,0.08)",
    title: "Clinicians",
    desc: "View and manage clinicians",
  },
  {
    href: "/clinics",
    icon: "mdi mdi-hospital-building",
    color: "#57072F",
    bg: "rgba(87,7,47,0.06)",
    title: "Clinics",
    desc: "Manage clinics & countries",
  },
  {
    href: "/stimulations",
    icon: "mdi mdi-lightning-bolt",
    color: "#053146",
    bg: "rgba(5,49,70,0.06)",
    title: "Stimulations",
    desc: "Browse stimulation protocols",
  },
];

const PlatoDashboard = () => {
  const { user } = useUser();
  const displayName = user?.username || user?.email?.split("@")[0] || "Admin";

  return <div>
    {/* ── Hero banner ── */}
    <Row className="mt-2">
      <Col xl="12">
        <Card
          style={{
            background: "linear-gradient(135deg, #57072F 0%, #7a1a46 100%)",
            border: "none",
            borderRadius: 12,
            color: "#fff",
            overflow: "hidden",
            position: "relative",
          }}
        >
          {/* dot matrix texture */}
          <div
            style={{
              position: "absolute",
              right: 0,
              top: 0,
              bottom: 0,
              width: "40%",
              backgroundImage: "radial-gradient(circle, rgba(234,228,218,0.15) 1px, transparent 1px)",
              backgroundSize: "12px 12px",
              pointerEvents: "none",
            }}
          />

          <CardBody style={{ padding: "2.5rem 2rem", position: "relative" }}>
            <Row className="align-items-center">
              <Col md={8}>
                <p
                  style={{
                    fontSize: 12,
                    textTransform: "uppercase",
                    letterSpacing: 2,
                    opacity: 0.7,
                    marginBottom: 6,
                  }}
                >
                  PlatoScience — Admin Panel
                </p>
                <h2
                  style={{ fontWeight: 700, marginBottom: 10, color: "#fff" }}
                >
                  Welcome back, {displayName}!
                </h2>
                <p style={{ opacity: 0.82, marginBottom: 0, maxWidth: 500 }}>
                  Here is a quick overview of the platform. Use the stats below
                  or the shortcuts to navigate to any section.
                </p>
              </Col>
              <Col md={4} className="d-none d-lg-flex justify-content-end">
                <i
                  className="mdi mdi-shield-account"
                  style={{ fontSize: 96, opacity: 0.15 }}
                />
              </Col>
            </Row>
          </CardBody>
        </Card>
      </Col>
    </Row>

    {/* ── Stats row (MiniWidget already wraps its Cols in a Row) ── */}
    <Row className="mt-3">
      <Col xl={12}>
        <p className="ps-section-label">Platform overview</p>
      </Col>
    </Row>
    <MiniWidget />

    {/* ── Quick-access cards ── */}
    <Row className="mt-4 mb-1">
      <Col xl={12}>
        <p className="ps-section-label">Quick access</p>
      </Col>
      {ADMIN_LINKS.map((item) => (
        <Col xs={12} sm={6} xl={3} key={item.title} className="mb-3 d-flex">
          <Link to={item.href} style={{ textDecoration: "none", width: "100%" }}>
            <Card
              style={{
                borderRadius: 8,
                border: "none",
                boxShadow: "0 1px 3px rgba(87,7,47,0.06), 0 4px 12px rgba(87,7,47,0.03)",
                transition: "transform 0.18s, box-shadow 0.18s",
                cursor: "pointer",
                height: "100%",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = "translateY(-3px)";
                e.currentTarget.style.boxShadow = "0 6px 20px rgba(0,0,0,0.1)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = "translateY(0)";
                e.currentTarget.style.boxShadow = "0 2px 12px rgba(0,0,0,0.06)";
              }}
            >
              <CardBody
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 14,
                  padding: "1.1rem 1.3rem",
                }}
              >
                <div
                  style={{
                    width: 48,
                    height: 48,
                    borderRadius: 12,
                    background: item.bg,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    flexShrink: 0,
                  }}
                >
                  <i
                    className={item.icon}
                    style={{ fontSize: 24, color: item.color }}
                  />
                </div>
                <div>
                  <h6
                    style={{
                      fontWeight: 600,
                      marginBottom: 2,
                      color: "#343a40",
                    }}
                  >
                    {item.title}
                  </h6>
                  <p
                    style={{ fontSize: 12, color: "#6c757d", marginBottom: 0 }}
                  >
                    {item.desc}
                  </p>
                </div>
                <i
                  className="mdi mdi-chevron-right"
                  style={{ marginLeft: "auto", color: "#adb5bd", fontSize: 18 }}
                />
              </CardBody>
            </Card>
          </Link>
        </Col>
      ))}
    </Row>
  </div>;
};

export default PlatoDashboard;
