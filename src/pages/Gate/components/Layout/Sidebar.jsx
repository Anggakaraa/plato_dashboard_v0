import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Modal, ModalHeader, ModalBody } from "reactstrap";
import logoSvg from "../../../../assets/images/logo.svg";
import logoPlato from "../../../../assets/images/platoscience-medical.png";
import patternImg from "../../../../assets/images/pattern.png";

const NAV_ITEMS = [
  { path: "/gate/home", label: "Home", icon: "mdi mdi-home-outline" },
  {
    path: "/gate/patients",
    label: "Patients and Usage",
    icon: "mdi mdi-account-group-outline",
  },
  {
    path: "/gate/stimulations",
    label: "Stimulations",
    icon: "mdi mdi-lightning-bolt-outline",
  },
  {
    path: "/gate/resources",
    label: "Resources",
    icon: "mdi mdi-book-open-outline",
  },
];

const Sidebar = ({ isCollapsed }) => {
  const location = useLocation();
  const [isContactOpen, setIsContactOpen] = useState(false);

  return (
    <aside
      className="gate-sidebar"
      style={{
        backgroundImage: `linear-gradient(to bottom, rgba(158, 169, 243, 0.4) 30%, rgba(238, 240, 253, 0.95) 500px, #ffffff 750px), url(${patternImg})`,
        backgroundSize: "450%",
        backgroundPosition: "top left",
        backgroundRepeat: "no-repeat",
        backgroundColor: "#ffffff",
      }}
    >
      <div className="gate-logo-container">
        <Link to="/gate/home">
          {isCollapsed ? (
            <img
              src={logoSvg}
              alt="PlatoScience Medical"
              className="gate-logo-collapsed"
            />
          ) : (
            <img
              src="https://www.platoscience.com/cdn/shop/files/LogoMedicalSketches-02_360x.png"
              alt="PlatoScience Medical"
              className="gate-logo-expanded"
            />
          )}
        </Link>
      </div>

      <nav className="gate-sidebar-nav">
        {NAV_ITEMS.map((item) => (
          <Link
            key={item.path}
            to={item.path}
            className={`gate-nav-item ${
              location.pathname.startsWith(item.path) ? "active" : ""
            }`}
          >
            <i className={item.icon}></i>
            {!isCollapsed && <span>{item.label}</span>}
          </Link>
        ))}
      </nav>

      <div
        style={{
          padding: "12px 15px",
          borderTop: "1px solid var(--gate-border)",
        }}
      >
        <button
          className="gate-nav-item"
          style={{
            marginBottom: 0,
            width: "100%",
            background: "none",
            border: "none",
            textAlign: "left",
            cursor: "pointer",
          }}
          onClick={() => setIsContactOpen(true)}
        >
          <i className="mdi mdi-email-outline" />
          {!isCollapsed && <span>Contact</span>}
        </button>
      </div>

      {/* Contact Modal */}
      <Modal isOpen={isContactOpen} toggle={() => setIsContactOpen(false)} centered size="md">
        <ModalHeader
          toggle={() => setIsContactOpen(false)}
          style={{ borderBottom: "none", paddingBottom: 0 }}
        >
          Contact Us
        </ModalHeader>
        <ModalBody className="px-4 pb-4 pt-2">
          <p style={{ fontSize: "0.9rem", color: "var(--gate-text-secondary)", marginBottom: "1.5rem" }}>
            We are here to help you with any questions or issues you might have. Please feel free to reach out to us:
          </p>

          {/* Email */}
          <div className="d-flex align-items-center gap-3 mb-4">
            <div
              className="d-flex align-items-center justify-content-center rounded-circle flex-shrink-0"
              style={{
                width: "42px",
                height: "42px",
                backgroundColor: "var(--gate-primary-light)",
                color: "var(--gate-primary)",
              }}
            >
              <i className="mdi mdi-email-outline" style={{ fontSize: "1.2rem" }} />
            </div>
            <div>
              <div style={{ fontSize: "0.85rem", fontWeight: 700, color: "var(--gate-text-primary)", marginBottom: "2px" }}>
                Email
              </div>
              <a
                href="mailto:hi@platoscience.com"
                style={{ fontSize: "0.9rem", color: "var(--gate-primary)", textDecoration: "none", fontWeight: 500 }}
              >
                hi@platoscience.com
              </a>
            </div>
          </div>

          {/* Divider */}
          <div style={{ height: "1px", background: "var(--gate-border)", marginBottom: "1.25rem" }} />

          {/* Phone */}
          <div className="d-flex align-items-center gap-3">
            <div
              className="d-flex align-items-center justify-content-center rounded-circle flex-shrink-0"
              style={{
                width: "42px",
                height: "42px",
                backgroundColor: "var(--gate-primary-light)",
                color: "var(--gate-primary)",
              }}
            >
              <i className="mdi mdi-phone-outline" style={{ fontSize: "1.2rem" }} />
            </div>
            <div>
              <div style={{ fontSize: "0.85rem", fontWeight: 700, color: "var(--gate-text-primary)", marginBottom: "2px" }}>
                Phone
              </div>
              <div style={{ fontSize: "0.9rem", fontWeight: 700, color: "var(--gate-text-primary)" }}>
                (+45) 65 74 64 10
              </div>
              <div style={{ fontSize: "0.8rem", color: "var(--gate-text-secondary)" }}>
                Mon-Fri 08-16 CET
              </div>
            </div>
          </div>
        </ModalBody>
      </Modal>
    </aside>
  );
};

export default Sidebar;
