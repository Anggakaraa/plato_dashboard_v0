import React from 'react';
import PropTypes from 'prop-types';

const DynamicDiv = ({ width, height, bgColor }) => {
    const divStyle = {
        width: width,
        height: height,
        backgroundColor: bgColor,
    };

    return (
        <div className="bordered" style={divStyle}>
            {/* Content goes here */}
        </div>
    );
};

DynamicDiv.propTypes = {
    width: PropTypes.string.isRequired,
    height: PropTypes.string.isRequired,
    bgColor: PropTypes.string.isRequired,
};

export default DynamicDiv;