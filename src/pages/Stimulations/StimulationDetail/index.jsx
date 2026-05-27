import React from "react";
import PropTypes from "prop-types";
import withRouter from "../../../components/Common/withRouter";
import { useUser } from "../../../hooks/user";

import OriginalStimulationDetail from "./OriginalStimulationDetail";
import CustomStimulationDetail from "./CustomStimulationDetail";
import ClinicStimulationDetail from "./ClinicStimulationDetail";

const StimulationDetail = (props) => {
  const { guid } = props.router.params;
  const { isPlato, isClinician } = useUser();

  const showStimulationDetail = () => {
    if (isPlato()) return (<OriginalStimulationDetail guid={guid}/>);
    if (isClinician()) return (<ClinicStimulationDetail guid={guid}/>);
    return <></>
  }
  
  return (
    <>
      {showStimulationDetail()}
    </>
  );
};

StimulationDetail.propTypes = {
  router: PropTypes.any,
  clone: PropTypes.bool,
};

export default withRouter(StimulationDetail);
