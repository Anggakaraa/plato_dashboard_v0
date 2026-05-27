import React from "react";
import PropTypes from "prop-types";
import withRouter from "../../../components/Common/withRouter";
import { useUser } from "../../../hooks/user";

import NewOriginalStimulation from "./NewOriginalStimulation";
import NewCustomStimulation from "./NewCustomStimulation";

const NewStimulation = (props) => {
  const { guid } = props.router.params;
  
  const { isPlato, isClinician } = useUser();

  const showNewStimulation = () => {
    if (isPlato()) return (<NewOriginalStimulation/>);
    if (isClinician()) return (<NewCustomStimulation guid={guid}/>);
    return <></>
  }
  
  return (
    <>
      {showNewStimulation()}
    </>
  );
};

NewStimulation.propTypes = {
  router: PropTypes.any,
};

export default withRouter(NewStimulation);
