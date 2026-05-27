import React from "react";
import withRouter from "../../components/Common/withRouter";
import { useUser } from "../../hooks/user";
import PlatoStimulations from "./PlatoStimulations";
import ClinicStimulations from "./ClinicStimulations";

const Stimulations = props => {
  const { isPlato, isClinician } = useUser();

  const showStimulations = () => {
    if (isPlato()) return (<PlatoStimulations/>);
    if (isClinician()) return (<ClinicStimulations/>);
    return <></>
  }
  
  return (
    <React.Fragment>
      {showStimulations()}
    </React.Fragment>
  );
};

export default withRouter(Stimulations);
