import PropTypes from "prop-types";
import React from "react";
import {
  Col,
  Container, Row,
} from "reactstrap";

//i18n
import { withTranslation } from "react-i18next";

//redux
import { useDispatch } from "react-redux";
import Subscribe from "../../components/Subscribe";
import CardUser from "./card-user";
const DashboardUser = props => {
  const dispatch = useDispatch();
  document.title="Dashboard | PlatoScience";
 
  return (
    <React.Fragment>
      <div className="page-content">
      <Container fluid>
        <CardUser />
       </Container>
      </div>
      <Subscribe disabled={true}/>
    </React.Fragment>
  );
};

DashboardUser.propTypes = {
  t: PropTypes.any,
};

export default withTranslation()(DashboardUser);
