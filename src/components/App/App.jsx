// src/App.js
import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import CadastroForm from '../CadastroForm/CadastroForm';
import PortariaPage from '../../pages/PortariaPage';
import PortariaDashboard from '../PortariaDashboard/PortariaDashboard';

// import ValidacaoPortaria from '../../components/ValidacaoPortaria/ValidacaoPortaria';
import './App.css';
import '../../styles/globals.css';
import '../../styles/responsive.css';

// Componente para controlar o layout condicional
function AppContent() {
  const location = useLocation();
  const isDashboard = location.pathname === '/portaria-dashboard';
  
  return (
    <div className={`App ${isDashboard ? 'app-dashboard' : 'app-mobile'}`}>
      <div className={`container ${isDashboard ? 'container-dashboard' : 'container-mobile'}`}>
        {/* Mostrar header apenas em páginas mobile */}
        {!isDashboard && (
          <>
            <div className="logo-container">
              <div className="logo-wrapper">
                <img 
                  src="/LogoSolar.jpg" 
                  alt="Logo Solar" 
                  className="logo"
                />
              </div>
            </div>
            <h1>Autorização de Acesso</h1>
          </>
        )}
        
        <Routes>
          <Route path="/" element={<CadastroForm />} />
          <Route path="/portaria" element={<PortariaPage />} />
          <Route path="/portaria-dashboard" element={<PortariaDashboard />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </div>
    </div>
  );
}

function App() {
  return (
    <Router>
      <AppContent />
    </Router>
  );
}

export default App;