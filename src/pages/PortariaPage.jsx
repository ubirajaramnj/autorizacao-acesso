// src/pages/PortariaPage.jsx
import React from 'react';
import PortariaLeitorQR from '../components/PortariaLeitorQR/PortariaLeitorQR';
import './PortariaPage.css';

const PortariaPage = () => {
  return (
    <div className="portaria-page">
      <PortariaLeitorQR />
    </div>
  );
};

export default PortariaPage;