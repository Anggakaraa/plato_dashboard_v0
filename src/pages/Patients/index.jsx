import React from "react";
import withRouter from "../../components/Common/withRouter";
import { useUser } from "../../hooks/user";
import AllPatients from "./AllPatients";
import MyPatients from "./MyPatients";

const Patients = props => {
  const { isPlato, isClinician } = useUser();

  const showPatients = () => {
    if (isPlato()) return (<AllPatients/>);
    if (isClinician()) return (<MyPatients/>);
    return <></>
  }
  
  return (
    <React.Fragment>
      {showPatients()}
    </React.Fragment>
  );
};

export default withRouter(Patients);
