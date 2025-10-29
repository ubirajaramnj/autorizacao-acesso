// src/components/PortariaDashboard/KanbanCard.jsx
import React from 'react';
import { formatDateToDisplay } from '../../utils/dateFormat';
import './KanbanCard.css';

const KanbanCard = ({ autorizacao, onCancelarAutorizacao, columnId }) => {
  const isVisitante = autorizacao.tipo === 'Visitante';
  const isExpirado = columnId === 'expirado';
  
  // 🆕 CORREÇÃO: Verificar se está expirado
  //const hoje = new Date();
  //const dataFim = new Date(autorizacao.dataFim || autorizacao.dataInicio);
  //const estaExpirado = dataFim < hoje;

  const getCardClassName = () => {
    let className = 'kanban-card';
    if (isVisitante) className += ' visitante';
    if (!isVisitante) className += ' prestador';
    if (isExpirado) className += ' expirado';
    return className;
  };

  const getStatusIcon = () => {
    if (isExpirado) return '⏰';
    if (columnId === 'entrou') return '✅';
    if (columnId === 'saiu') return '🚪';
    return '🟢';
  };

  // 🆕 CORREÇÃO: Formatar telefone
  const formatarTelefone = (telefone) => {
    if (!telefone) return 'N/A';
    const clean = telefone.replace(/\D/g, '');
    if (clean.length === 10) {
      return clean.replace(/(\d{2})(\d{4})(\d{4})/, '($1) $2-$3');
    } else if (clean.length === 11) {
      return clean.replace(/(\d{2})(\d{5})(\d{4})/, '($1) $2-$3');
    }
    return telefone;
  };

  // 🆕 CORREÇÃO: Formatar CPF
  const formatarCPF = (cpf) => {
    if (!cpf) return 'N/A';
    const clean = cpf.replace(/\D/g, '');
    if (clean.length === 11) {
      return clean.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4');
    }
    return cpf;
  };

  return (
    <div className={getCardClassName()}>
      <div className="card-header">
        <span className="status-icon">{getStatusIcon()}</span>
        <span className="card-tipo">
          {isVisitante ? '👤 Visitante' : '👷 Prestador'}
        </span>
        {(isExpirado) && (
          <div className="expirado-badge">
            ⏰ Expirado
          </div>
        )}
      </div>

      <div className="card-content">
        {/* 🆕 CORREÇÃO: Layout melhorado com informações completas */}
        
        {/* Dados do Autorizado */}
        <div className="info-section">
          <div className="section-title">👤 Autorizado</div>
          <div className="info-grid">
            <div className="info-item">
              <span className="info-label">Nome:</span>
              <span className="info-value">{autorizacao.nome}</span>
            </div>
            <div className="info-item">
              <span className="info-label">Telefone:</span>
              <span className="info-value">{formatarTelefone(autorizacao.telefone)}</span>
            </div>
            <div className="info-item">
              <span className="info-label">CPF:</span>
              <span className="info-value">{formatarCPF(autorizacao.cpf)}</span>
            </div>
            <div className="info-item full-width">
              <span className="info-label">Período:</span>
              <span className="info-value">
                {autorizacao.periodo === 'unico'
                  ? `${formatDateToDisplay(autorizacao.dataInicio)}`
                  : `${formatDateToDisplay(autorizacao.dataInicio)} - ${formatDateToDisplay(autorizacao.dataFim)}`}
              </span>
            </div>
          </div>
        </div>

        {/* Dados do Autorizador */}
        <div className="info-section">
          <div className="section-title">🏠 Autorizador</div>
          <div className="info-grid">
            <div className="info-item">
              <span className="info-label">Nome:</span>
              <span className="info-value">{autorizacao.autorizador?.nome}</span>
            </div>
            <div className="info-item">
              <span className="info-label">Telefone:</span>
              <span className="info-value">{formatarTelefone(autorizacao.autorizador?.telefone)}</span>
            </div>
            <div className="info-item">
              <span className="info-label">Unidade:</span>
              <span className="info-value">{autorizacao.autorizador?.codigoDaUnidade}</span>
            </div>
          </div>
        </div>

        {/* Informações da Empresa (para prestadores) */}
        {!isVisitante && autorizacao.empresa && (
          <div className="info-section">
            <div className="section-title">🏢 Empresa</div>
            <div className="info-grid">
              <div className="info-item full-width">
                <span className="info-label">Nome:</span>
                <span className="info-value">{autorizacao.empresa}</span>
              </div>
            </div>
          </div>
        )}

        {/* Informações de Status */}
        <div className="info-section">
          <div className="section-title">📊 Status</div>
          <div className="info-grid">
            <div className="info-item">
              <span className="info-label">Status:</span>
              <span className="info-value status">{autorizacao.status}</span>
            </div>
            <div className="info-item">
              <span className="info-label">Criado em:</span>
              <span className="info-value">
                {new Date(autorizacao.createdAt).toLocaleDateString('pt-BR')}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* 🆕 CORREÇÃO: Botão de cancelamento apenas para autorizações não expiradas e não finalizadas */}
      {!isExpirado && columnId !== 'saiu' && columnId !== 'entrou' && (
        <div className="card-actions">
          <button
            onClick={() => onCancelarAutorizacao(autorizacao.id)}
            className="cancel-btn"
            title="Cancelar autorização"
          >
            ❌ Cancelar
          </button>
        </div>
      )}
    </div>
  );
};

export default KanbanCard;