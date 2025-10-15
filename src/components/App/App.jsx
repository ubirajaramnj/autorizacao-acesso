// src/App.js
import React from 'react';
import CadastroForm from '../CadastroForm/CadastroForm';
import './App.css';

function App() {
  return (
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
        <CadastroForm />
      </div>
    </div>
  );
}

export default App;