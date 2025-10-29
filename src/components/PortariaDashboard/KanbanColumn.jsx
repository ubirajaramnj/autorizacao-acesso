// src/components/PortariaDashboard/KanbanColumn.jsx
import React from 'react';
import KanbanCard from './KanbanCard';
import './KanbanColumn.css';

const KanbanColumn = ({ column, onCancelarAutorizacao }) => {
  return (
    <div className="kanban-column" style={{ borderLeftColor: column.color }}>
      <div className="column-header">
        <h3 className="column-title">{column.title}</h3>
        <span className="column-count">{column.count}</span>
      </div>

      <div className="column-cards">
        {column.autorizacoes.length === 0 ? (
          <div className="empty-column">
            <div className="empty-icon">📭</div>
            <p>Nenhuma autorização</p>
          </div>
        ) : (
          column.autorizacoes.map(autorizacao => (
            <KanbanCard
              key={autorizacao.id}
              autorizacao={autorizacao}
              onCancelarAutorizacao={onCancelarAutorizacao}
              columnId={column.id}
            />
          ))
        )}
      </div>
    </div>
  );
};

export default KanbanColumn;