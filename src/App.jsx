import PropTypes from "prop-types";
import React from "react";

import { Routes, Route, Navigate } from "react-router-dom";
import { connect, useSelector } from "react-redux";

// Import Routes all
import { sharedAuthRoutes, adminProtectedRoutes, clinicianProtectedRoutes, publicRoutes } from "./routes";

// Import all middleware
import AuthMiddleware from "./routes/auth-routes";
import PublicMiddleware from "./routes/public-routes";

// layouts Format
import VerticalLayout from "./components/VerticalLayout/";
import HorizontalLayout from "./components/HorizontalLayout/";
import NonAuthLayout from "./components/NonAuthLayout";
import GateGuard from "./pages/Gate/components/Layout/GateGuard";

// Import transition components
import LoadingOverlay from "./components/Common/LoadingOverlay";

// Import scss
import "./assets/scss/theme.scss";

import { useUser } from "./hooks/user";

const authRoutesWithNoAuthLayout = ["/create-password"];

const App = (props) => {
  const { layoutType } = useSelector((state) => ({
    layoutType: state.Layout.layoutType,
  }));
  
  const { loading, verificationStep } = useSelector((state) => ({
    loading: state.Login.loading,
    verificationStep: state.Login.verificationStep,
  }));
  
  const { isPlato, isClinician } = useUser();
  const isAdmin = isPlato();

  const authProtectedRoutes = isAdmin 
    ? [...sharedAuthRoutes, ...adminProtectedRoutes] 
    : [...sharedAuthRoutes, ...clinicianProtectedRoutes];

  function getLayout(layoutType) {
    let layoutCls = VerticalLayout;
    switch (layoutType) {
      case "horizontal":
        layoutCls = HorizontalLayout;
        break;
      default:
        layoutCls = VerticalLayout;
        break;
    }
    return layoutCls;
  }

  const Layout = getLayout(layoutType);

  const getAuthRoute = (route, idx) => {
    if (authRoutesWithNoAuthLayout.includes(route.path)) {
      return (
        <Route
          path={route.path}
          element={
            <AuthMiddleware check={false}>
              {route.component}
            </AuthMiddleware>
          }
          key={idx}
          exact={true}
        />
      );
    }

    const CurrentLayout = isAdmin ? getLayout(layoutType) : GateGuard;

    return (
      <Route
        path={route.path}
        element={
          <AuthMiddleware check={true}>
            <CurrentLayout>
              {route.component}
            </CurrentLayout>
          </AuthMiddleware>
        }
        key={idx}
        exact={true}
      />
    );
  };

  const getPublicRoute = (route, idx) => {
    return (
      <Route
        path={route.path}
        element={
          route.noLayout ? (
            route.component
          ) : (
            <PublicMiddleware>
              <NonAuthLayout>
                {route.component}
              </NonAuthLayout>
            </PublicMiddleware>
          )
        }
        key={idx}
        exact={true}
      />
    );
  };

  return (
    <React.Fragment>
      {/* Loading overlay during login — with verification steps */}
      <LoadingOverlay
        isLoading={loading}
        message="Signing in..."
        verificationStep={verificationStep}
      />
      
      <Routes>
        {publicRoutes.map((route, idx) => getPublicRoute(route, idx))}
        {authProtectedRoutes.map((route, idx) => getAuthRoute(route, idx))}
        
        {/* Explicit root redirect to the correct home by user type */}
        <Route
          path="/"
          element={<Navigate to={isAdmin ? "/dashboard" : "/gate/home"} replace />}
        />

        {/* Wildcard fallback for unknown routes */}
        <Route 
          path="*" 
          element={<Navigate to={isAdmin ? "/dashboard" : "/gate/home"} replace />} 
        />
      </Routes>
    </React.Fragment>
  );
};

App.propTypes = {
  layout: PropTypes.any,
};

const mapStateToProps = (state) => {
  return {
    layout: state.Layout,
  };
};

export default connect(mapStateToProps, null)(App);
