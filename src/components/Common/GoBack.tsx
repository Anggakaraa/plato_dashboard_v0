import React from 'react';
import { useNavigate } from 'react-router-dom';

export const GoBack = () => {
  const navigate = useNavigate();

  return (
    <button onClick={() => navigate(-1)} className="btn btn-sm btn-dark mb-3">Back</button>
  );
};