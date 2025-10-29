// src/components/PortariaDashboard/StatsCards.jsx
import React from 'react';
import './StatsCards.css';

const StatsCards = ({ stats }) => {
  const cards = [
    {
      title: 'Autorizações Hoje',
      value: stats.totalAutorizacoes,
      icon: '📋',
      color: '#3498db',
      description: 'Total de autorizações para hoje'
    },
    {
      title: 'Acessos Registrados',
      value: stats.acessosHoje,
      icon: '✅',
      color: '#27ae60',
      description: 'Entradas registradas hoje'
    },
    {
      title: 'Saídas Registradas',
      value: stats.saidasHoje,
      icon: '🚪',
      color: '#e74c3c',
      description: 'Saídas registradas hoje'
    },
    {
      title: 'Pendentes de Acesso',
      value: stats.pendentes,
      icon: '⏳',
      color: '#f39c12',
      description: 'Aguardando entrada'
    }
  ];

  return (
    <div className="stats-cards">
      {cards.map((card, index) => (
        <div key={index} className="stat-card">
          <div className="stat-icon" style={{ backgroundColor: card.color }}>
            {card.icon}
          </div>
          <div className="stat-content">
            <div className="stat-value">{card.value}</div>
            <div className="stat-title">{card.title}</div>
            <div className="stat-description">{card.description}</div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default StatsCards;