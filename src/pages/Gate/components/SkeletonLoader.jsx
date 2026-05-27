import React, { useState, useEffect } from "react";

const SkeletonLoader = ({ title }) => {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate fetching data for the skeleton transition
    const timer = setTimeout(() => {
      setLoading(false);
    }, 800);
    return () => clearTimeout(timer);
  }, []);

  if (loading) {
    return (
      <React.Fragment>
        <div className="gate-top-loading-bar"></div>
        <div className="fade-in" style={{ animation: "fadeIn 0.3s ease-in-out" }}>
          <div className="gate-skeleton" style={{ height: "40px", width: "250px", marginBottom: "30px", borderRadius: "8px" }}></div>
          <div className="gate-skeleton" style={{ height: "120px", width: "100%", marginBottom: "20px", borderRadius: "12px" }}></div>
          <div className="gate-skeleton" style={{ height: "200px", width: "100%", borderRadius: "12px" }}></div>
        </div>
      </React.Fragment>
    );
  }

  return (
    <div className="fade-in" style={{ animation: "fadeIn 0.3s ease-in-out" }}>
      <h2>{title}</h2>
      <p>Working on this page based on the next wireframes...</p>
    </div>
  );
};

export default SkeletonLoader;
