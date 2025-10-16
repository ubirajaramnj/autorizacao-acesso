import React from 'react';
import QRCode from 'qrcode.react';
import { applyDocumentMask, removeMask, detectDocumentType, formatRG, formatCPF } from '../../utils/masks';
import './QRCodeDisplay.css';

const QRCodeDisplay = ({ data, onClose }) => {
  if (!data) return null;

  // Formatar o documento para exibição
  const formatDocumentForDisplay = (document) => {
    const cleanDocument = removeMask(document);
    const documentType = detectDocumentType(document);
    
    if (documentType === 'CPF' && cleanDocument.length === 11) {
      // Aplicar máscara específica para CPF: 000.000.000-00
      return cleanDocument.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4');
    }
    // Para RG, usar a máscara padrão
    return applyDocumentMask(document);
  };

  // No QRCodeDisplay.js - substitua a parte do QR Code:

  // Gerar dados COMPLETOS para o QR Code
  // ✅ NOVA LÓGICA: Usar apenas o link da API ou ID
  const getQRCodeContent = () => {
    // Se tiver apiLink (novo formato), usa apenas o link
    if (data.apiLink) {
      return data.apiLink;
    }
    // Se for o formato antigo com ID, cria o link
    if (data.id) {
      return `https://minha.api/autorizacoes/${data.id}`;
    }
    // Fallback: mantém o formato antigo por segurança
    return JSON.stringify({
      id: data.id,
      nome: data.nome,
      tipo: data.tipo,
      periodo: data.periodo,
      dataInicio: data.dataInicio,
      dataFim: data.dataFim
    });
  };

  const qrData = getQRCodeContent();

  console.log('QR Code gerado:', qrData); // Para debug

  // Função para imprimir apenas o comprovante
  const handlePrint = () => {
    const printContent = document.getElementById('comprovante-impressao');
    const originalContents = document.body.innerHTML;
    
    document.body.innerHTML = printContent.innerHTML;
    window.print();
    document.body.innerHTML = originalContents;
    
    // Recarregar a página para restaurar o estado do React
    window.location.reload();
  };

  return (
    <div className="qr-code-overlay">
      <div className="qr-code-modal">
        <div className="qr-code-header">
          <h2>Cadastro Realizado com Sucesso!</h2>
          <button className="close-btn" onClick={onClose}>×</button>
        </div>
        
        <div className="qr-code-content">
          <div className="qr-code-info">
            <h3>Dados do Cadastro:</h3>
            <p><strong>Nome:</strong> {data.nome}</p>
            <p><strong>Tipo:</strong> {data.tipo === 'visitante' ? 'Visitante' : 'Prestador de Serviço'}</p>
            <p><strong>CPF:</strong> {formatCPF(data.cpf)}</p>
            <p><strong>RG:</strong> {formatRG(data.rg)}</p>
            <p><strong>Período:</strong> {data.periodo === 'unico' 
              ? `Dia único: ${new Date(data.dataInicio).toLocaleDateString('pt-BR')}`
              : `De ${new Date(data.dataInicio).toLocaleDateString('pt-BR')} até ${new Date(data.dataFim).toLocaleDateString('pt-BR')}`
            }</p>
            {data.empresa && <p><strong>Empresa:</strong> {data.empresa}</p>}
            {data.cnpj && <p><strong>CNPJ:</strong> {data.cnpj}</p>}

            {/* ✅ ADICIONE ESTAS LINHAS: */}
            {(data.apiLink || data.id) && (
              <div className="api-link-info">
                <p><strong>ID da Autorização:</strong> {data.id}</p>
                {data.apiLink && (
                  <p><strong>Link da API:</strong> <code>{data.apiLink}</code></p>
                )}
              </div>
            )}
          </div>
          
          <div className="qr-code-container">
            <h3>QR Code para Validação</h3>
            <div className="qr-code-wrapper">
              <QRCode 
                value={qrData} 
                size={200}
                level="H"
                includeMargin={true}
              />
            </div>
            <p className="qr-code-instruction">
              {data.apiLink || data.id 
                ? "Apresente este QR Code na portaria - O sistema consultará os dados via API"
                : "Apresente este QR Code na portaria para validação do acesso"
              }
            </p>

          </div>
        </div>
        
        <div className="qr-code-actions">
          <button className="print-btn" onClick={handlePrint}>
            Imprimir Comprovante
          </button>
          <button className="close-modal-btn" onClick={onClose}>
            Fechar
          </button>
        </div>

        {/* Comprovante para impressão (oculto na tela) */}
        <div id="comprovante-impressao" className="comprovante-impressao">
          <div className="comprovante-header">
            <img src="/LogoSolar.jpg" alt="Logo Solar" className="comprovante-logo" />
            <h1>Comprovante de Cadastro</h1>
          </div>
          
          <div className="comprovante-content">
            <div className="comprovante-info">
              <h2>Dados do Cadastro</h2>
              <table className="comprovante-table">
                <tbody>
                  <tr>
                    <td><strong>Nome:</strong></td>
                    <td>{data.nome}</td>
                  </tr>
                  <tr>
                    <td><strong>Tipo:</strong></td>
                    <td>{data.tipo === 'visitante' ? 'Visitante' : 'Prestador de Serviço'}</td>
                  </tr>
                  <tr>
                    <td><strong>Documento:</strong></td>
                    <td>{formatDocumentForDisplay(data.documento)}</td>
                  </tr>
                  <tr>
                    <td><strong>Período:</strong></td>
                    <td>
                      {data.periodo === 'unico' 
                        ? `Dia único: ${new Date(data.dataInicio).toLocaleDateString('pt-BR')}`
                        : `De ${new Date(data.dataInicio).toLocaleDateString('pt-BR')} até ${new Date(data.dataFim).toLocaleDateString('pt-BR')}`
                      }
                    </td>
                  </tr>
                  {data.empresa && (
                    <tr>
                      <td><strong>Empresa:</strong></td>
                      <td>{data.empresa}</td>
                    </tr>
                  )}
                  {data.cnpj && (
                    <tr>
                      <td><strong>CNPJ:</strong></td>
                      <td>{data.cnpj}</td>
                    </tr>
                  )}
                  <tr>
                    <td><strong>Data do Cadastro:</strong></td>
                    <td>{new Date(data.createdAt).toLocaleString('pt-BR')}</td>
                  </tr>
                  <tr>
                    <td><strong>ID do Cadastro:</strong></td>
                    <td>{data.id}</td>
                  </tr>
                </tbody>
              </table>
            </div>
            
            <div className="comprovante-qrcode">
              <h3>QR Code para Validação</h3>
              <div className="qrcode-print">
                <QRCode 
                  value={qrData} 
                  size={150}
                  level="H"
                  includeMargin={true}
                />
              </div>
              <p className="comprovante-instruction">
                Apresente este QR Code na portaria para validação do acesso
              </p>
            </div>
          </div>
          
          <div className="comprovante-footer">
            <p><strong>Observações:</strong></p>
            <ul>
              <li>Este comprovante deve ser apresentado na portaria junto com documento de identificação</li>
              <li>O acesso está sujeito à confirmação dos dados pela portaria</li>
              <li>Em caso de dúvidas, entre em contato com a administração</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default QRCodeDisplay;