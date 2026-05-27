import React from "react";
import { Offcanvas, OffcanvasHeader, OffcanvasBody } from "reactstrap";
import PropTypes from "prop-types";
import DebugPayloadDisplay from "./DebugPayloadDisplay";

const DebugSidebar = ({ isOpen, toggle, data }) => {
  return (
    <Offcanvas
      isOpen={isOpen}
      direction="end"
      toggle={toggle}
      style={{ width: "400px" }}
      backdrop={false}
      scrollable={true}
      className="offcanvas-end"
    >
      <OffcanvasHeader toggle={toggle}>Debug Information</OffcanvasHeader>
      <OffcanvasBody>
        <DebugPayloadDisplay data={data} />
      </OffcanvasBody>
    </Offcanvas>
  );
};

DebugSidebar.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  toggle: PropTypes.func.isRequired,
  data: PropTypes.object.isRequired,
};

export default DebugSidebar;
