import React from "react";

const Footer = (props) => {
    return (
        <React.Fragment>
            <div className="mt-2 text-center">
                <p>
                © {new Date().getFullYear()} PlatoScience
                </p>
            </div>
        </React.Fragment>
    );
  };
  
export default Footer;
