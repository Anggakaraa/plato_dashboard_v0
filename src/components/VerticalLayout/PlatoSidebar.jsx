import PropTypes from "prop-types";
import React from "react";
import { connect } from "react-redux";
import withRouter from "../Common/withRouter";

//i18n
import { withTranslation } from "react-i18next";

import { Link } from "react-router-dom";

import logoLightSvg from "../../assets/images/plato-icon-white.svg";
import PlatoSidebarContent from "./PlatoSidebarContent";
import ClinicianSidebarContent from "./ClinicianSidebarContent";
import { useUser } from "../../hooks/user";

const PlatoSidebar = (props) => {
  const { isPlato } = useUser();

  return (
    <React.Fragment>
      <div className="vertical-menu">
        <div className="navbar-brand-box" style={{
          background: "transparent",
          display: "flex",
          alignItems: "center",
          padding: "20px 20px",
          borderBottom: "1px solid rgba(234,228,218,0.1)",
        }}>
          <Link to="/" style={{ textDecoration: "none", display: "flex", alignItems: "center", gap: 10 }}>
            <img src={logoLightSvg} alt="PlatoScience" height="36" style={{ flexShrink: 0 }} />
            <div style={{ lineHeight: 1.2 }}>
              <div style={{
                color: "#FFFFFF",
                fontFamily: "'Raleway', sans-serif",
                fontWeight: 600,
                fontSize: 15,
                letterSpacing: "0.01em",
              }}>
                PlatoScience
              </div>
              <div style={{
                color: "rgba(234,228,218,0.6)",
                fontFamily: "'Raleway', sans-serif",
                fontWeight: 500,
                fontSize: 11,
                letterSpacing: "0.08em",
                textTransform: "uppercase",
              }}>
                Medical
              </div>
            </div>
          </Link>
        </div>
        <div data-simplebar className="h-100" style={{ marginTop: 24 }}>
          {isPlato() ? <PlatoSidebarContent /> : <ClinicianSidebarContent />}
        </div>
        <div className="sidebar-background"></div>
      </div>
    </React.Fragment>
  );
};

PlatoSidebar.propTypes = {
  type: PropTypes.string,
};

const mapStatetoProps = (state) => {
  return {
    layout: state.Layout,
  };
};
export default connect(
  mapStatetoProps,
  {},
)(withRouter(withTranslation()(PlatoSidebar)));
