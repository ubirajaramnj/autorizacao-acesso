// src/App.js
import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import CadastroForm from '../CadastroForm/CadastroForm';
// import ValidacaoPortaria from '../../components/ValidacaoPortaria/ValidacaoPortaria';
import './App.css';
import '../../styles/globals.css';
import '../../styles/responsive.css';

function App() {
  return (
    <Router>
      <div className="App">
        <div className="container">
          {/* Logo acima do título */}
          <div className="logo-container">
            <img 
              src="/LogoSolar.jpg" 
              alt="Logo Solar" 
              className="logo"
            />
          </div>
          <h1>Sistema de Cadastro</h1>
          <Routes>
            <Route path="/" element={<CadastroForm />} />
            {/* <Route path="/portaria" element={<ValidacaoPortaria />} /> */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </div>
      </div>
    </Router>
  );
}

export default App;