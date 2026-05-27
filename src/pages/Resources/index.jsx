import React from "react";
import { Card, CardBody, Col, Container, Row } from "reactstrap";
import { withTranslation } from "react-i18next";

// ─── Data ────────────────────────────────────────────────────────────────────

const CLINICIAN_DOCS = [
  {
    name: "Clinical tDCS info sheet for trained personnel.pdf",
    date: "2/4/22",
  },
  { name: "TES Protocols for clinicians.pdf", date: "28/10/24" },
  { name: "Usage of tDCS in pediatric populations.pdf", date: "2/4/22" },
];

const CLIENT_DOCS = [
  { name: "Information for clients_DK", date: "2/4/22" },
  { name: "Info sheet for clients considering tDCS.pdf", date: "2/4/22" },
  { name: "PlatoWork info sheet for clients.pdf", date: "2/4/22" },
];

const ONLINE_LINKS = [
  { label: "User Manual", icon: "mdi mdi-book-open-variant", href: "#" },
  { label: "Getting Started", icon: "mdi mdi-rocket-launch", href: "#" },
  { label: "Troubleshooting", icon: "mdi mdi-tools", href: "#" },
  { label: "Maintenance", icon: "mdi mdi-wrench-clock", href: "#" },
];

// ─── Sub-components ───────────────────────────────────────────────────────────

const ACCENT = "#2e6da4";

const DocRow = ({ name, date }) => (
  <div
    style={{
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between",
      padding: "10px 14px",
      borderRadius: 8,
      background: "#f7f9fc",
      marginBottom: 8,
      transition: "background 0.18s ease, box-shadow 0.18s ease",
      cursor: "pointer",
    }}
    onMouseEnter={(e) => {
      e.currentTarget.style.background = "#eef4fb";
      e.currentTarget.style.boxShadow = "0 2px 10px rgba(46,109,164,0.12)";
    }}
    onMouseLeave={(e) => {
      e.currentTarget.style.background = "#f7f9fc";
      e.currentTarget.style.boxShadow = "none";
    }}
  >
    <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
      <div
        style={{
          width: 36,
          height: 36,
          borderRadius: 8,
          background: "#e8f0fb",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          flexShrink: 0,
        }}
      >
        <i
          className="mdi mdi-file-pdf-box"
          style={{ fontSize: 20, color: ACCENT }}
        />
      </div>
      <span style={{ fontSize: 13, color: "#343a40", fontWeight: 500 }}>
        {name}
      </span>
    </div>
    <span
      style={{
        fontSize: 11,
        color: "#adb5bd",
        whiteSpace: "nowrap",
        marginLeft: 12,
        fontWeight: 500,
      }}
    >
      {date}
    </span>
  </div>
);

const SectionCard = ({ title, description, docs }) => (
  <Card
    style={{
      borderRadius: 14,
      border: "none",
      boxShadow: "0 2px 16px rgba(0,0,0,0.07)",
      height: "100%",
    }}
  >
    <CardBody style={{ padding: "1.6rem 1.6rem 1.2rem" }}>
      {/* Card header accent bar */}
      <div
        style={{
          width: 36,
          height: 4,
          borderRadius: 4,
          background: `linear-gradient(90deg, ${ACCENT}, #4a9fd4)`,
          marginBottom: 14,
        }}
      />
      <h5 style={{ fontWeight: 700, color: "#1a3a5c", marginBottom: 6 }}>
        {title}
      </h5>
      <p
        style={{
          fontSize: 13,
          color: "#6c757d",
          marginBottom: 20,
          lineHeight: 1.6,
        }}
      >
        {description}
      </p>
      {docs.map((doc) => (
        <DocRow key={doc.name} {...doc} />
      ))}
    </CardBody>
  </Card>
);

const ResourcesPage = () => {
  document.title = "Resources | PlatoScience";

  return (
    <div className="page-content">
      <Container fluid>
        <Row className="mb-4">
          <Col xl={12}>
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
              <div
                style={{
                  position: "absolute",
                  width: 260,
                  height: 260,
                  borderRadius: "50%",
                  background: "rgba(255,255,255,0.06)",
                  top: -80,
                  right: -60,
                  pointerEvents: "none",
                }}
              />
              <CardBody style={{ padding: "2rem 2rem", position: "relative" }}>
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
                      PlatoScience
                    </p>
                    <h2
                      style={{
                        fontWeight: 700,
                        color: "#fff",
                        marginBottom: 8,
                      }}
                    >
                      Resources
                    </h2>
                    <p
                      style={{ opacity: 0.82, marginBottom: 0, maxWidth: 500 }}
                    >
                      All the documents and tools you need — for you and your
                      patients — in one place.
                    </p>
                  </Col>
                  <Col md={4} className="d-none d-md-flex justify-content-end">
                    <i
                      className="mdi mdi-folder-open"
                      style={{ fontSize: 88, opacity: 0.15 }}
                    />
                  </Col>
                </Row>
              </CardBody>
            </Card>
          </Col>
        </Row>

        {/* ── Document cards ─────────────────────────────────────────── */}
        <Row className="mb-4">
          <Col lg={6} className="mb-4 mb-lg-0">
            <SectionCard
              title="Resources for clinicians"
              description="Here are the most crucial resources you will need — with the latest updated data. As always, please reach out to us if you have any questions!"
              docs={CLINICIAN_DOCS}
            />
          </Col>
          <Col lg={6}>
            <SectionCard
              title="Information for clients"
              description="Here you will find information sheets for your clients to help them decide about tDCS, as well as specific information about including the PlatoWork headset in their treatment."
              docs={CLIENT_DOCS}
            />
          </Col>
        </Row>

        {/* ── Clinician support ──────────────────────────────────────── */}
        <Row>
          <Col xl={12}>
            <Card
              style={{
                borderRadius: 14,
                border: "none",
                boxShadow: "0 2px 16px rgba(0,0,0,0.07)",
              }}
            >
              <CardBody style={{ padding: "1.6rem 2rem" }}>
                {/* Title */}
                <div style={{ textAlign: "center", marginBottom: 24 }}>
                  <div
                    style={{
                      display: "inline-block",
                      width: 36,
                      height: 4,
                      borderRadius: 4,
                      background: `linear-gradient(90deg, ${ACCENT}, #4a9fd4)`,
                      marginBottom: 12,
                    }}
                  />
                  <h5
                    style={{
                      fontWeight: 700,
                      color: "#1a3a5c",
                      marginBottom: 0,
                    }}
                  >
                    Clinician support
                  </h5>
                </div>

                {/* Contact + Onboarding row */}
                <Row className="mb-4 align-items-stretch">
                  {/* Contact us */}
                  <Col md={6} className="mb-3 mb-md-0">
                    <div
                      style={{
                        background: "#f7f9fc",
                        borderRadius: 12,
                        padding: "20px 24px",
                        height: "100%",
                        borderLeft: `4px solid ${ACCENT}`,
                      }}
                    >
                      <p
                        style={{
                          fontSize: 12,
                          textTransform: "uppercase",
                          letterSpacing: 1,
                          color: "#adb5bd",
                          marginBottom: 12,
                        }}
                      >
                        Contact us directly
                      </p>
                      <div
                        style={{
                          display: "flex",
                          gap: 10,
                          flexWrap: "wrap",
                          alignItems: "center",
                          marginBottom: 10,
                        }}
                      >
                        <a
                          href="mailto:support@platoscience.com"
                          style={{
                            background: ACCENT,
                            color: "#fff",
                            padding: "8px 20px",
                            borderRadius: 8,
                            fontWeight: 600,
                            fontSize: 13,
                            textDecoration: "none",
                            display: "inline-flex",
                            alignItems: "center",
                            gap: 6,
                          }}
                        >
                          <i className="mdi mdi-email-outline" />
                          Email us
                        </a>
                        <span
                          style={{
                            background: "#fff",
                            border: "1px solid #dee2e6",
                            borderRadius: 8,
                            padding: "8px 16px",
                            fontSize: 13,
                            color: "#495057",
                            fontWeight: 500,
                          }}
                        >
                          <i
                            className="mdi mdi-phone-outline"
                            style={{ marginRight: 4 }}
                          />
                          (+45) 65 74 64 10
                        </span>
                      </div>
                      <p
                        style={{
                          fontSize: 12,
                          color: "#adb5bd",
                          marginBottom: 0,
                        }}
                      >
                        <i
                          className="mdi mdi-clock-outline"
                          style={{ marginRight: 4 }}
                        />
                        Mon–Fri, 08:00–16:00 CET
                      </p>
                    </div>
                  </Col>

                  {/* Onboarding */}
                  <Col md={6}>
                    <div
                      style={{
                        background: "#f7f9fc",
                        borderRadius: 12,
                        padding: "20px 24px",
                        height: "100%",
                        display: "flex",
                        flexDirection: "column",
                        justifyContent: "center",
                        borderLeft: `4px solid #2ec4b6`,
                      }}
                    >
                      <p
                        style={{
                          fontSize: 12,
                          textTransform: "uppercase",
                          letterSpacing: 1,
                          color: "#adb5bd",
                          marginBottom: 10,
                        }}
                      >
                        Personal onboarding support
                      </p>
                      <p
                        style={{
                          fontSize: 13,
                          color: "#6c757d",
                          marginBottom: 14,
                          lineHeight: 1.5,
                        }}
                      >
                        Book a 1-on-1 session with a PlatoScience specialist to
                        get you up and running.
                      </p>
                      <div>
                        <a
                          href="#"
                          style={{
                            background: "#2ec4b6",
                            color: "#fff",
                            padding: "9px 22px",
                            borderRadius: 8,
                            fontWeight: 600,
                            fontSize: 13,
                            textDecoration: "none",
                            display: "inline-flex",
                            alignItems: "center",
                            gap: 6,
                          }}
                        >
                          <i className="mdi mdi-calendar-check" />
                          Book a support session
                        </a>
                      </div>
                    </div>
                  </Col>
                </Row>

                {/* Online resources */}
                <div
                  style={{
                    background: "#f0f4ff",
                    borderRadius: 12,
                    padding: "20px 24px",
                  }}
                >
                  <p
                    style={{
                      fontSize: 12,
                      textTransform: "uppercase",
                      letterSpacing: 1,
                      color: "#adb5bd",
                      textAlign: "center",
                      marginBottom: 16,
                    }}
                  >
                    Online resources
                  </p>
                  <Row className="g-3 justify-content-center">
                    {ONLINE_LINKS.map((link) => (
                      <Col xs={6} sm={3} key={link.label}>
                        <a href={link.href} style={{ textDecoration: "none" }}>
                          <div
                            style={{
                              background: "#fff",
                              borderRadius: 10,
                              padding: "14px 10px",
                              textAlign: "center",
                              boxShadow: "0 2px 8px rgba(0,0,0,0.06)",
                              transition:
                                "transform 0.18s ease, box-shadow 0.18s ease",
                              cursor: "pointer",
                            }}
                            onMouseEnter={(e) => {
                              e.currentTarget.style.transform =
                                "translateY(-3px)";
                              e.currentTarget.style.boxShadow =
                                "0 6px 18px rgba(46,109,164,0.15)";
                            }}
                            onMouseLeave={(e) => {
                              e.currentTarget.style.transform = "translateY(0)";
                              e.currentTarget.style.boxShadow =
                                "0 2px 8px rgba(0,0,0,0.06)";
                            }}
                          >
                            <i
                              className={link.icon}
                              style={{
                                fontSize: 28,
                                color: ACCENT,
                                marginBottom: 8,
                                display: "block",
                              }}
                            />
                            <span
                              style={{
                                fontSize: 12,
                                fontWeight: 600,
                                color: "#343a40",
                              }}
                            >
                              {link.label}
                            </span>
                          </div>
                        </a>
                      </Col>
                    ))}
                  </Row>
                </div>
              </CardBody>
            </Card>
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default withTranslation()(ResourcesPage);
