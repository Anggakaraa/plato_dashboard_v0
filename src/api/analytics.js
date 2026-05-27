import { gateAxios } from "../pages/Gate/components/Layout/GateGuard";

/**
 * Get analytics data for patients by clinic
 * Returns aggregated data for charts and visualizations
 */
export const getClinicPatientsAnalytics = async (clinicGuid) => {
  const resp = await gateAxios.get(
    `${import.meta.env.VITE_APP_API_URL}/clinician/analytics/patients?clinic=${clinicGuid}`
  );
  return resp.data;
};

/**
 * Get growth trends comparison for patients
 * Compares current period with previous period
 */
export const getClinicPatientsGrowth = async (clinicGuid, period = 'month') => {
  const resp = await gateAxios.get(
    `${import.meta.env.VITE_APP_API_URL}/clinician/analytics/patients/growth?clinic=${clinicGuid}&period=${period}`
  );
  return resp.data;
};