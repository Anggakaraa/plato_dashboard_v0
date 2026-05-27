import React from "react";
import PropTypes from "prop-types";
import withRouter from "../../../components/Common/withRouter";
import { useUser } from "../../../hooks/user";

import PlatoPatientDetail from "./PlatoPatientDetail";
import AdminPatientDetail from "./AdminPatientDetail";

const PatientDetail = (props) => {
  const { guid } = props.router.params;
  const { isPlato, isClinician } = useUser();

  const showPatienDetails = () => {
    if (isPlato()) return (<PlatoPatientDetail guid={guid}/>);
    if (isClinician()) return (<AdminPatientDetail guid={guid}/>);
    return <></>
  }
  
  return (
    <>
      {showPatienDetails()}
    </>
  );
};

PatientDetail.propTypes = {
  router: PropTypes.any,
};

export default withRouter(PatientDetail);
