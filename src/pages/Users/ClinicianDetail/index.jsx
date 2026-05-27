import React from "react";
import PropTypes from "prop-types";
import withRouter from "../../../components/Common/withRouter";
import { useUser } from "../../../hooks/user";

import AdminClinicianDetail from "./AdminClinicianDetail";
import PlatoClinicianDetail from "./PlatoClinicianDetail";

const ClinicianDetail = (props) => {
  const { guid } = props.router.params;
  const { isPlato, isClinician } = useUser();

  const showClinicians = () => {
    if (isPlato()) return (<PlatoClinicianDetail guid={guid}/>);
    if (isClinician()) return (<AdminClinicianDetail guid={guid}/>);
    return <></>
  }
  
  return (
    <>
      {showClinicians()}
    </>
  );
};

ClinicianDetail.propTypes = {
  router: PropTypes.any,
};

export default withRouter(ClinicianDetail);
