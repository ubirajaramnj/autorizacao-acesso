// src/components/PortariaDashboard/KanbanBoard.jsx
import React from 'react';
import KanbanColumn from './KanbanColumn';
import './KanbanBoard.css';

const KanbanBoard = ({ autorizacoes, onCancelarAutorizacao, loading }) => {
  // Classificar autorizações por status
  const autorizadas = autorizacoes.filter(a => 
    a.status === 'Autorizado' && !a.checkins?.length
  );
  
  const comAcesso = autorizacoes.filter(a => 
    a.status === 'Utilizado' && !a.checkins?.length
  );
  
  const finalizadas = autorizacoes.filter(a => 
    a.status === 'Finalizado' && !a.checkins?.length
  );
  
  const expiradas = autorizacoes.filter(a =>
    a.status === 'Expirado' && !a.checkins?.length
  );

  const columns = [
    {
      id: 'autorizado',
      title: '🟢 Autorizado',
      count: autorizadas.length,
      autorizacoes: autorizadas,
      color: '#e8f5e8'
    },
    {
      id: 'entrou',
      title: '🔵 Entrou',
      count: comAcesso.length,
      autorizacoes: comAcesso,
      color: '#e8f4fd'
    },
    {
      id: 'saiu',
      title: '🟣 Saiu',
      count: finalizadas.length,
      autorizacoes: finalizadas,
      color: '#f3e8fd'
    },
    {
      id: 'expirado',
      title: '🔴 Expirado',
      count: expiradas.length,
      autorizacoes: expiradas,
      color: '#fde8e8'
    }
  ];

  return (
    <div className="kanban-board">
      <div className="kanban-header">
        <h2>Controle de Acessos</h2>
        <div className="board-stats">
          Total: {autorizacoes.length} autorizações
        </div>
      </div>

      <div className="kanban-columns">
        {columns.map(column => (
          <KanbanColumn
            key={column.id}
            column={column}
            onCancelarAutorizacao={onCancelarAutorizacao}
          />
        ))}
      </div>

      {loading && (
        <div className="kanban-loading">
          <div className="loading-spinner"></div>
          Atualizando dados...
        </div>
      )}
    </div>
  );
};

export default KanbanBoard;