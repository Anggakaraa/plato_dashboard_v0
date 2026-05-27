import React from "react";
import { Row, Col, Card, CardBody } from "reactstrap";

// Quick-access shortcuts shown on the clinician welcome screen.
// To add/remove cards just edit this array.
const QUICK_LINKS = [
  {
    href: "/patients",
    icon: "mdi mdi-account-group",
    color: "#4361ee",
    bg: "#eef0fd",
    title: "My Patients",
    desc: "View and manage your patients",
  },
  {
    href: "/stimulations",
    icon: "mdi mdi-lightning-bolt",
    color: "#f77f00",
    bg: "#fff3e0",
    title: "Stimulations",
    desc: "Browse stimulation",
  },
  {
    href: "/clinics",
    icon: "mdi mdi-hospital-building",
    color: "#2ec4b6",
    bg: "#e8f8f7",
    title: "Clinics",
    desc: "Manage your clinics",
  },
  {
    href: "/resources",
    icon: "mdi mdi-book-open",
    color: "#2ec4b6",
    bg: "#e8f8f7",
    title: "Resources",
    desc: "All you need to know in one place",
  },
];

const ClinicianWelcome = () => (
  <Row className="mt-2">
    {/* ── Hero banner ── */}
    <Col xl="12">
      <Card
        style={{
          background: "linear-gradient(135deg, #1a3a5c 0%, #2e6da4 100%)",
          border: "none",
          borderRadius: 16,
          color: "#fff",
          overflow: "hidden",
          position: "relative",
        }}
      >
        {/* decorative blobs */}
        <div
          style={{
            position: "absolute",
            width: 280,
            height: 280,
            borderRadius: "50%",
            background: "rgba(255,255,255,0.07)",
            top: -80,
            right: -60,
            pointerEvents: "none",
          }}
        />
        <div
          style={{
            position: "absolute",
            width: 160,
            height: 160,
            borderRadius: "50%",
            background: "rgba(255,255,255,0.05)",
            bottom: -40,
            left: 40,
            pointerEvents: "none",
          }}
        />

        <CardBody style={{ padding: "2.5rem 2rem", position: "relative" }}>
          <Row className="align-items-center">
            <Col md={8}>
              <p
                style={{
                  fontSize: 13,
                  textTransform: "uppercase",
                  letterSpacing: 2,
                  opacity: 0.75,
                  marginBottom: 6,
                }}
              >
                PlatoScience Dashboard
              </p>
              <h2 style={{ fontWeight: 700, marginBottom: 12, color: "#fff" }}>
                Welcome back!
              </h2>
              <p style={{ opacity: 0.85, marginBottom: 0, maxWidth: 480 }}>
                Manage your patients and monitor their neurostimulation
                treatments in one place. Use the menu on the left or the
                shortcuts below to get started.
              </p>
            </Col>
            <Col md={4} className="d-none d-md-flex justify-content-end">
              <i
                className="mdi mdi-brain"
                style={{ fontSize: 96, opacity: 0.18 }}
              />
            </Col>
          </Row>
        </CardBody>
      </Card>
    </Col>

    {/* ── Quick-access cards ── */}
    {QUICK_LINKS.map((item) => (
      <Col xl={4} md={6} key={item.title} className="mt-3">
        <a href={item.href} style={{ textDecoration: "none" }}>
          <Card
            style={{
              borderRadius: 14,
              border: "none",
              boxShadow: "0 2px 12px rgba(0,0,0,0.06)",
              transition: "transform 0.18s, box-shadow 0.18s",
              cursor: "pointer",
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
                gap: 16,
                padding: "1.2rem 1.4rem",
              }}
            >
              <div
                style={{
                  width: 52,
                  height: 52,
                  borderRadius: 14,
                  background: item.bg,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  flexShrink: 0,
                }}
              >
                <i
                  className={item.icon}
                  style={{ fontSize: 26, color: item.color }}
                />
              </div>
              <div>
                <h6
                  style={{ fontWeight: 600, marginBottom: 2, color: "#343a40" }}
                >
                  {item.title}
                </h6>
                <p style={{ fontSize: 13, color: "#6c757d", marginBottom: 0 }}>
                  {item.desc}
                </p>
              </div>
              <i
                className="mdi mdi-chevron-right"
                style={{ marginLeft: "auto", color: "#adb5bd", fontSize: 20 }}
              />
            </CardBody>
          </Card>
        </a>
      </Col>
    ))}

    {/* ── Tip banner ── */}
    <Col xl={12} className="mt-3 mb-2">
      <div
        style={{
          background: "#f0f4ff",
          borderLeft: "4px solid #4361ee",
          borderRadius: 8,
          padding: "12px 18px",
          display: "flex",
          alignItems: "center",
          gap: 10,
          color: "#343a40",
          fontSize: 14,
        }}
      >
        <i
          className="mdi mdi-information-outline"
          style={{ color: "#4361ee", fontSize: 18 }}
        />
        <span>
          <strong>Tip:</strong> You can search and filter patients directly from
          the{" "}
          <a href="/patients" style={{ color: "#4361ee", fontWeight: 600 }}>
            My Patients
          </a>{" "}
          page.
        </span>
      </div>
    </Col>
  </Row>
);

export default ClinicianWelcome;
