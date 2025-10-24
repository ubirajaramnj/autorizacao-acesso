// src/components/Loader/Loader.jsx
import React from 'react';
import './Loader.css';

// src/components/Loader/Loader.jsx
const Loader = ({ 
  size = 'large',
  logoSize = 'large', // 'small', 'medium', 'large'
  message = 'Processando...',
  showLogo = true 
}) => {
  return (
    <div className="loader-overlay">
      <div className={`loader-container ${size}`}>
        <div className="loader-circle">
          <div className="loader-spinner"></div>
          {showLogo && (
            <div className={`loader-logo logo-${logoSize}`}>
              <img 
                src="/LogoSolar.jpg" 
                alt="Logo" 
                className="logo-image"
              />
            </div>
          )}
        </div>
        {message && <div className="loader-message">{message}</div>}
      </div>
    </div>
  );
};

export default Loader;