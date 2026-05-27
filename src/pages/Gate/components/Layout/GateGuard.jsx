import React, { useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { getToken, removeToken } from "../../../../storage/token";
import GateLayout from "./index";
import { ClinicProvider } from "../../contexts/ClinicContext";

// Create a completely isolated Axios instance for the Gate Ecosystem
export const gateAxios = axios.create({
  baseURL: import.meta.env.VITE_APP_API_URL,
  timeout: 60000,
});

// Add request interceptor to ensure token is always fresh on every request
gateAxios.interceptors.request.use(
  (config) => {
    const token = getToken();
    if (token) {
      config.headers.Authorization = token;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

/**
 * GateGuard
 * 
 * A specialized wrapper prioritizing the Gate UI (Clinician view).
 * Its main job is to mount an interceptor on `gateAxios` to watch for 401 Unauthorized
 * server responses. When a token dies or an endpoint refuses access, 
 * this Guard immediately destroys the local credentials and forcibly throws
 * the user back to `/login` with an instantaneous cache bypass.
 */
const GateGuard = ({ children }) => {
  const navigate = useNavigate();

  useEffect(() => {
    // Intercept response to catch 401 globally within the Gate context
    const interceptor = gateAxios.interceptors.response.use(
      (response) => response,
      (error) => {
        if (error.response && error.response.status === 401) {
          console.warn("[GateGuard]: 401 Unauthorized captured. Redirecting to login...");
          removeToken(); // Eradicate current session
          window.location.href = '/login'; // Force total mount reset vs `navigate('/login')`
        }
        return Promise.reject(error);
      }
    );

    // Cleanup: Remove interceptor on unmount to avoid memory leaks
    return () => {
      gateAxios.interceptors.response.eject(interceptor);
    };
  }, [navigate]);

  // We wrap the standard GateLayout with ClinicProvider
  return (
    <ClinicProvider>
      <GateLayout>
        {children}
      </GateLayout>
    </ClinicProvider>
  );
};

export default GateGuard;
