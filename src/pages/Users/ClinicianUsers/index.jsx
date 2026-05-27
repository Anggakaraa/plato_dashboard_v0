import React from "react";
import withRouter from "../../../components/Common/withRouter";
import { useUser } from "../../../hooks/user";

import Clinicians from "./Clinicians";
import MyClinicians from "./MyClinicians";

const ClinicianUsers = props => {
  const { isPlato, isClinician } = useUser();

  const showClinicians = () => {
    if (isPlato()) return (<Clinicians/>);
    if (isClinician()) return (<MyClinicians/>);
    return <></>
  }
  
  return (
    <>
      {showClinicians()}
    </>
  );
};

export default withRouter(ClinicianUsers);
