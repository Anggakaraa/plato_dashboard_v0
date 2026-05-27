import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import Header from "./Header";
import Sidebar from "./Sidebar";
import Footer from "./Footer";
import { ClinicProvider } from "../../contexts/ClinicContext";
import "../../design-system/theme.css"; 

const GateLayout = ({ children }) => {
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const location = useLocation();

  useEffect(() => {
    setIsTransitioning(true);
    const timer = setTimeout(() => {
      setIsTransitioning(false);
    }, 800);
    return () => clearTimeout(timer);
  }, [location.pathname]);

  const toggleSidebar = () => {
    setIsSidebarCollapsed(!isSidebarCollapsed);
  };

  return (
    <ClinicProvider>
      <div className={`gate-container ${isSidebarCollapsed ? "sidebar-collapsed" : ""}`}>
        <Sidebar isCollapsed={isSidebarCollapsed} />
        <div className="gate-main-wrapper">
          <Header toggleSidebar={toggleSidebar} />
          <main className="gate-content-area">
            {isTransitioning && <div className="gate-top-loading-bar"></div>}
            
            {isTransitioning ? (
               <div className="fade-in" style={{ animation: "fadeIn 0.3s ease-in-out" }}>
                 <div className="gate-skeleton" style={{ height: "40px", width: "300px", marginBottom: "30px", borderRadius: "8px" }}></div>
                 <div className="gate-skeleton" style={{ height: "140px", width: "100%", marginBottom: "24px", borderRadius: "12px" }}></div>
                 <div className="gate-skeleton" style={{ height: "250px", width: "100%", borderRadius: "12px" }}></div>
               </div>
            ) : (
              children
            )}
          </main>
          <Footer />
        </div>
      </div>
    </ClinicProvider>
  );
};

export default GateLayout;
