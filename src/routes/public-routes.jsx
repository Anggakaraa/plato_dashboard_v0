import PropTypes from "prop-types";
import React from "react";
import { Navigate } from "react-router-dom";
import { useUser } from "../hooks/user";

const PublicMiddleware = (props) => {
  const { isAuthenticated, isClinician } = useUser();
  
  // Verificar autenticação
  const authenticated = isAuthenticated();
  
  if (authenticated) {
    // Redirecionar baseado no tipo de usuário
    const redirectPath = isClinician() ? "/gate/home" : "/dashboard";
    return <Navigate to={redirectPath} replace />;
  }
  
  return <React.Fragment>{props.children}</React.Fragment>;
};

PublicMiddleware.propTypes = {
  children: PropTypes.any,
  location: PropTypes.any,
};

export default PublicMiddleware;
