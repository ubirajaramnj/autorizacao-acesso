import React from 'react';
import './ConfirmacaoAutorizacao.css';
import { formatDateToDisplay } from '../../utils/dateFormat';

const ConfirmacaoAutorizacao = ({ 
  dadosAutorizacao, 
  dadosVisitante, 
  onConfirmar, 
  onCancelar 
}) => {
  if (!dadosAutorizacao || !dadosVisitante) return null;

  const getTipoTexto = (tipo) => {
    return tipo === 'visitante' ? 'visitante' : 'prestador de serviço';
  };

  return (
    <div className="confirmacao-overlay">
      <div className="confirmacao-modal">
        <div className="confirmacao-header">
          <h2>Confirmação de Autorização</h2>
        </div>
        
        <div className="confirmacao-content">
          <div className="autorizacao-texto">
            <p>
              <strong>Eu, {dadosAutorizacao.nome}</strong>, telefone {dadosAutorizacao.telefone}, 
              unidade {dadosAutorizacao.codigoDaUnidade}, autorizo o{" "}
              <strong>{getTipoTexto(dadosVisitante.tipo)}</strong>,{" "}
              <strong>{dadosVisitante.nome}</strong>, CPF {dadosVisitante.cpf}, 
              RG {dadosVisitante.rg}, a entrar no condomínio{" "},
              <p><strong>Período:</strong> {dadosVisitante.periodo === 'unico' 
                  ? `Dia único: ${formatDateToDisplay(dadosVisitante.dataInicio)}`
                  : `De ${formatDateToDisplay(dadosVisitante.dataInicio)} até ${formatDateToDisplay(dadosVisitante.dataFim)}`
                }
              </p>
            </p>
          </div>

          <div className="detalhes-adicionais">
            <h3>Detalhes da Autorização:</h3>
            <div className="detalhes-grid">
              <div className="detalhe-item">
                <strong>Data/Hora da Autorização:</strong>
                <span>{new Date().toLocaleString('pt-BR')}</span>
              </div>
              {/* <div className="detalhe-item">
                <strong>Dispositivo:</strong>
                <span>{dadosAutorizacao.dispositivo}</span>
              </div>
              <div className="detalhe-item">
                <strong>Navegador:</strong>
                <span>{dadosAutorizacao.navegador}</span>
              </div>
              <div className="detalhe-item">
                <strong>IP:</strong>
                <span>{dadosAutorizacao.ip}</span>
              </div> */}
            </div>
          </div>
        </div>

        <div className="confirmacao-actions">
          <button 
            className="btn-confirmar"
            onClick={onConfirmar}
          >
            ✅ Confirmar Autorização
          </button>
          <button 
            className="btn-cancelar"
            onClick={onCancelar}
          >
            ❌ Cancelar
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmacaoAutorizacao;