import PropTypes from "prop-types";
import React from "react";
import { Navigate } from "react-router-dom";
import { useUser } from "../hooks/user";

const AuthMiddleware = (props) => {
  const { isAuthenticated, isFirstAccess } = useUser();
  
  // Verificar autenticação
  const authenticated = isAuthenticated();
  
  if (!authenticated) {
    return <Navigate to="/login" replace />;
  }
  
  // Verificar primeiro acesso
  if (props.check) {
    const firstAccess = isFirstAccess();
    if (firstAccess) {
      return <Navigate to="/create-password" replace />;
    }
  }
  
  return <React.Fragment>{props.children}</React.Fragment>;
};

AuthMiddleware.propTypes = {
  children: PropTypes.any,
  location: PropTypes.any,
  check: PropTypes.bool,
};

export default AuthMiddleware;
