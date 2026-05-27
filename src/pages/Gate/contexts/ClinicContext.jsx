import React, { createContext, useContext, useState, useEffect } from 'react';
import { getMyClinics } from '../../../api/clinician';

const ClinicContext = createContext();

export const useClinic = () => {
  const context = useContext(ClinicContext);
  if (!context) {
    throw new Error('useClinic must be used within a ClinicProvider');
  }
  return context;
};

export const ClinicProvider = ({ children }) => {
  const [clinics, setClinics] = useState([]);
  const [selectedClinic, setSelectedClinic] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchClinics = async () => {
      try {
        setIsLoading(true);
        const res = await getMyClinics();
        const clinicData = res?.data || res || [];
        
        setClinics(clinicData);
        
        // Set first clinic as selected by default
        if (clinicData.length > 0) {
          setSelectedClinic(clinicData[0]);
        }
        
        setError(null);
      } catch (err) {
        console.error("Error fetching clinics:", err);
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    };

    fetchClinics();
  }, []);

  const value = {
    clinics,
    selectedClinic,
    setSelectedClinic,
    isLoading,
    error,
  };

  return (
    <ClinicContext.Provider value={value}>
      {children}
    </ClinicContext.Provider>
  );
};