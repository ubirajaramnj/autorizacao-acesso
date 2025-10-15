// src/index.js
import React from 'react';
import ReactDOM from 'react-dom/client';
import './styles/globals.css';
import './styles/responsive.css';
import './styles/print.css';
import App from './components/App/App';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);