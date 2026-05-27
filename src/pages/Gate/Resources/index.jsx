import React from "react";

// Converts a Google Drive share URL to a direct download URL
const toDownloadUrl = (url) => {
  if (!url || url === "#") return url;
  const match = url.match(/[?&]id=([^&]+)/);
  if (match) {
    return `https://drive.google.com/uc?export=download&id=${match[1]}`;
  }
  return url;
};
import { Row, Col, Card, CardBody, CardHeader, Button } from "reactstrap";

const CLINICIAN_RESOURCES = [
  {
    id: 1,
    title: "Clinical tDCS info sheet for trained personnel.pdf",
    date: "2/4/22",
    url: "https://drive.google.com/open?id=1DYkgn6fDDhkDADwivYz8n7Eas-2BKJ7N&usp=drive_copy",
  },
  {
    id: 2,
    title: "TES Protocols for clinicians.pdf",
    date: "25/10/24",
    url: "https://drive.google.com/open?id=19OcqeidHrKSnGNL8FL2Rg4mEIqrfH9Cy&usp=drive_copy",
  },
  {
    id: 3,
    title: "Usage of tDCS in pediatric populations.pdf",
    date: "2/4/22",
    url: "https://drive.google.com/open?id=1U-UpLj55wi1-yp5_U8LjVn1cWIiWzvSt&usp=drive_copy",
  },
];

const CLIENT_RESOURCES = [
  {
    id: 1,
    title: "Information for clients_DK",
    date: "2/4/22",
    url: "https://drive.google.com/open?id=1KwM__ZADEitYbPoAw9lTyg4qD8I7T58_&usp=drive_copy",
  },
  {
    id: 2,
    title: "Info sheet for clients considering tDCS.pdf",
    date: "2/4/22",
    url: "https://drive.google.com/open?id=184Mbads3fD0ApcR_FVjyUyykNX9Ej8pv&usp=drive_copy",
  },
  {
    id: 3,
    title: "PlatoWork info sheet for clients.pdf",
    date: "2/4/22",
    url: "https://drive.google.com/open?id=16C-U5xIYUSzgQZrVMTI_UiH4UsxBQEIF&usp=drive_copy",
  },
];

const GateResources = () => {
  return (
    <div className="fade-in" style={{ animation: "fadeIn 0.3s ease-in-out" }}>
      <Row>
        {/* Clinician Resources Column */}
        <Col lg="6" className="mb-4">
          <Card className="gate-card-border">
            <CardHeader className="bg-white border-bottom-0 pt-4 pb-0">
              <h4 className="mb-0" style={{ fontWeight: 600 }}>
                Resources for clinicians
              </h4>
            </CardHeader>
            <CardBody>
              <p className="text-muted mb-4">
                Here are the most crucial resources you will need - with the
                latest updated data. As always, please reach out to us if you
                have any questions.
              </p>

              <ul className="gate-doc-list">
                {CLINICIAN_RESOURCES.map((doc) => (
                  <li key={doc.id} className="gate-doc-item">
                    <a
                      href={toDownloadUrl(doc.url)}
                      className="gate-doc-item-title"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <i className="mdi mdi-file-pdf-box text-danger font-size-24"></i>
                      {doc.title}
                    </a>
                    <span className="gate-doc-item-date">{doc.date}</span>
                  </li>
                ))}
              </ul>
            </CardBody>
          </Card>
        </Col>

        {/* Client Resources Column */}
        <Col lg="6" className="mb-4">
          <Card className="gate-card-border">
            <CardHeader className="bg-white border-bottom-0 pt-4 pb-0">
              <h4 className="mb-0" style={{ fontWeight: 600 }}>
                Information for clients
              </h4>
            </CardHeader>
            <CardBody>
              <p className="text-muted mb-4">
                Here you will find information sheets for your clients to help
                them decide about tDCS, as well as specific information about
                including the PlatoWork headset in their treatment.
              </p>

              <ul className="gate-doc-list">
                {CLIENT_RESOURCES.map((doc) => (
                  <li key={doc.id} className="gate-doc-item">
                    <a
                      href={toDownloadUrl(doc.url)}
                      className="gate-doc-item-title"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <i className="mdi mdi-file-pdf-box text-danger font-size-24"></i>
                      {doc.title}
                    </a>
                    <span className="gate-doc-item-date">{doc.date}</span>
                  </li>
                ))}
              </ul>
            </CardBody>
          </Card>
        </Col>
      </Row>

      {/* Support Section */}
      <Row>
        <Col lg="12">
          <Card className="gate-card-border">
            <CardHeader className="bg-white border-bottom-0 pt-4 pb-0 text-center">
              <h4 className="mb-0" style={{ fontWeight: 600 }}>
                Clinician support
              </h4>
            </CardHeader>
            <CardBody>
              <Row className="mb-5 mt-4 justify-content-center">
                <Col md="4" className="text-center mb-4 mb-md-0">
                  <div className="mb-2 text-muted">Contact us directly:</div>
                  <div
                    className="gate-support-contact-box d-flex justify-content-center align-items-center mx-auto"
                    style={{ maxWidth: "300px" }}
                  >
                    <div
                      className="p-3 border-end bg-info"
                      style={{ flex: 1, fontWeight: 600 }}
                    >
                      EMAIL US
                    </div>
                    <div className="p-3 bg-light" style={{ flex: 1 }}>
                      <span style={{ fontWeight: 500 }}>(+45) 65 74 64 10</span>
                    </div>
                  </div>
                  <div className="mt-2 text-muted font-size-12">
                    Mon-Fri 08-16 CET
                  </div>
                </Col>

                <Col md="4" className="text-center">
                  <div className="mb-2 text-muted">
                    Personal onboarding support:
                  </div>
                  <a
                    href="https://calendly.com/platosciencebooking/onboarding"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="gate-support-btn w-100 mx-auto d-flex align-items-center justify-content-center"
                    style={{ maxWidth: "250px" }}
                  >
                    BOOK A SUPPORT SESSION
                  </a>
                </Col>
              </Row>

              <hr className="my-4" />

              <div className="text-center">
                <div className="mb-4 text-muted">Online resources:</div>
                <div className="d-flex flex-wrap justify-content-center gap-3">
                  <a
                    href="https://www.platoscience.com/pages/ifu"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="gate-support-btn w-100 mx-auto d-flex align-items-center justify-content-center"
                    style={{ maxWidth: "250px" }}
                  >
                    USER MANUAL
                  </a>
                  <a
                    href="https://www.platoscience.com/pages/getting-started"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="gate-support-btn w-100 mx-auto d-flex align-items-center justify-content-center"
                    style={{ maxWidth: "250px" }}
                  >
                    GETTING STARTED
                  </a>
                  <a
                    href="https://www.platoscience.com/pages/troubleshooting"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="gate-support-btn w-100 mx-auto d-flex align-items-center justify-content-center"
                    style={{ maxWidth: "250px" }}
                  >
                    TROUBLESHOOTING
                  </a>
                  <a
                    href="https://www.platoscience.com/pages/maintenance"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="gate-support-btn w-100 mx-auto d-flex align-items-center justify-content-center"
                    style={{ maxWidth: "250px" }}
                  >
                    MAINTENANCE
                  </a>
                </div>
              </div>
            </CardBody>
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default GateResources;
