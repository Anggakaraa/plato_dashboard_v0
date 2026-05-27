import PropTypes from "prop-types";
import React from "react";
import { Container } from "reactstrap";

//i18n
import { withTranslation } from "react-i18next";

//redux
import { useDispatch } from "react-redux";
import Subscribe from "../../components/Subscribe";
import { useUser } from "../../hooks/user";
import { Navigate } from "react-router-dom";
import PlatoDashboard from "./plato-dashboard";

// Import CSS de transições
import "../../components/Common/PageTransition.css";

const DashboardUser = (props) => {
  const dispatch = useDispatch();
  document.title = "Dashboard | PlatoScience";

  const { isPlato } = useUser();

  if (!isPlato()) {
    return <Navigate to="/gate/home" replace />;
  }

  return (
    <React.Fragment>
      <div className="page-content dashboard-content-wrapper">
        <Container fluid>
          <div className="fade-in-item">
            <PlatoDashboard />
          </div>
        </Container>
      </div>
      <Subscribe disabled={true} />
    </React.Fragment>
  );
};

DashboardUser.propTypes = {
  t: PropTypes.any,
};

export default withTranslation()(DashboardUser);
