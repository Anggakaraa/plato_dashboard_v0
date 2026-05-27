import React from "react";
import { Container } from "reactstrap";
import withRouter from "../../components/Common/withRouter";
import { useUser } from "../../hooks/user";

import Clinic from "./Clinic";
import MyClinics from "./MyClinics";

const Clinics = props => {
  const { isPlato, isClinician } = useUser();

  const showClinics = () => {
    if (isPlato()) return (<Clinic/>);
    if (isClinician()) return (<MyClinics/>);
    return <></>
  }
  
  return (
    <React.Fragment>
      {showClinics()}
    </React.Fragment>
  );
};

export default withRouter(Clinics);
