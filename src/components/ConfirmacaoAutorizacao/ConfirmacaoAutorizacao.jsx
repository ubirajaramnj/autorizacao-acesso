import React from 'react';
import './ConfirmacaoAutorizacao.css';

const ConfirmacaoAutorizacao = ({ 
  dadosAutorizacao, 
  dadosVisitante, 
  onConfirmar, 
  onCancelar 
}) => {
  if (!dadosAutorizacao || !dadosVisitante) return null;

  const formatarData = (data) => {
    return new Date(data).toLocaleDateString('pt-BR');
  };

  const getTipoTexto = (tipo) => {
    return tipo === 'visitante' ? 'visitante' : 'prestador de serviço';
  };

  const getPeriodoTexto = (periodo, dataInicio, dataFim) => {
    if (periodo === 'unico') {
      return `na data ${formatarData(dataInicio)}`;
    } else {
      return `no período de ${formatarData(dataInicio)} até ${formatarData(dataFim)}`;
    }
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
              RG {dadosVisitante.rg}, a entrar no condomínio{" "}
              {getPeriodoTexto(
                dadosVisitante.periodo, 
                dadosVisitante.dataInicio, 
                dadosVisitante.dataFim
              )}.
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