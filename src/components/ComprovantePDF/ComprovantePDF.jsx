// src/components/ComprovantePDF/ComprovantePDF.jsx
import React, { useRef } from 'react';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import './ComprovantePDF.css';

const ComprovantePDF = ({ autorizacao, qrCodeValue }) => {
  const comprovanteRef = useRef();

  const gerarPDF = async () => {
    if (!comprovanteRef.current) return;

    try {
      // Capturar o elemento como imagem
      const canvas = await html2canvas(comprovanteRef.current, {
        scale: 2, // Melhor qualidade
        useCORS: true,
        logging: false,
      });

      // Criar PDF
      const pdf = new jsPDF('p', 'mm', 'a4');
      const imgData = canvas.toDataURL('image/png');
      
      // Dimensões da página A4
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = pdf.internal.pageSize.getHeight();
      
      // Calcular dimensões mantendo proporção
      const imgWidth = canvas.width;
      const imgHeight = canvas.height;
      const ratio = imgHeight / imgWidth;
      const pdfImgHeight = pdfWidth * ratio;

      // Adicionar imagem ao PDF
      pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfImgHeight);
      
      // Salvar PDF
      pdf.save(`comprovante-${autorizacao.nome}-${autorizacao.id}.pdf`);
      
    } catch (error) {
      console.error('Erro ao gerar PDF:', error);
      alert('Erro ao gerar o comprovante. Tente novamente.');
    }
  };

  const formatarData = (dataString) => {
    const data = new Date(dataString);
    return data.toLocaleDateString('pt-BR');
  };

  const formatarDataHora = (dataString) => {
    const data = new Date(dataString);
    return `${data.toLocaleDateString('pt-BR')}, ${data.toLocaleTimeString('pt-BR')}`;
  };

  return (
    <div className="comprovante-container">
      {/* Botão para gerar PDF */}
      <div className="comprovante-actions">
        <button onClick={gerarPDF} className="btn-print-pdf">
          🖨️ Imprimir Comprovante
        </button>
      </div>

      {/* Comprovante que será convertido para PDF */}
      <div ref={comprovanteRef} className="comprovante-pdf">
        {/* Cabeçalho com Logo */}
        <header className="comprovante-header">
          <div className="logo-section">
            <div className="logo">🏢</div>
            <div className="header-text">
              <h1>Autorização de Acesso</h1>
              <p>Sistema de Cadastro - Visitantes e Prestadores</p>
            </div>
          </div>
          <div className="comprovante-id">
            ID: {autorizacao.id}
          </div>
        </header>

        <div className="comprovante-divider"></div>

        {/* Conteúdo Principal */}
        <div className="comprovante-content">
          {/* Dados do Cadastro */}
          <div className="dados-cadastro">
            <h2>Dados do Cadastro</h2>
            
            <div className="dados-lista">
              <div className="dado-item">
                <strong>Nome:</strong> {autorizacao.nome}
              </div>
              
              <div className="dado-item">
                <strong>Tipo:</strong> 
                <span className={`tipo-badge ${autorizacao.tipo.toLowerCase()}`}>
                  {autorizacao.tipo === 'Visitante' ? '👤 Visitante' : '👷 Prestador de Serviço'}
                </span>
              </div>

              {autorizacao.empresa && (
                <div className="dado-item">
                  <strong>Empresa:</strong> {autorizacao.empresa}
                </div>
              )}

              <div className="dado-item">
                <strong>CPF:</strong> {autorizacao.cpf}
              </div>

              <div className="dado-item">
                <strong>RG:</strong> {autorizacao.rg}
              </div>

              <div className="dado-item">
                <strong>Período:</strong>
                {autorizacao.periodo === 'unico' 
                  ? `Dia único: ${formatarData(autorizacao.dataInicio)}`
                  : `De ${formatarData(autorizacao.dataInicio)} até ${formatarData(autorizacao.dataFim)}`
                }
              </div>

              <div className="dado-item">
                <strong>Data do Cadastro:</strong> {formatarDataHora(autorizacao.dataCriacao)}
              </div>

              <div className="dado-item">
                <strong>ID do Cadastro:</strong> {autorizacao.id}
              </div>
            </div>

            {/* Observações */}
            <div className="observacoes">
              <h3>Observações:</h3>
              <ul>
                <li>Este comprovante deve ser apresentado na portaria junto com documento de identificação</li>
                <li>O acesso está sujeito à confirmação dos dados pela portaria</li>
                <li>Em caso de dúvidas, entre em contato com a administração</li>
                <li>ID do comprovante: {autorizacao.id}</li>
                {autorizacao.periodo === 'unico' && (
                  <li>Válido apenas para o dia {formatarData(autorizacao.dataInicio)}</li>
                )}
                {autorizacao.periodo === 'intervalo' && (
                  <li>Válido no período de {formatarData(autorizacao.dataInicio)} a {formatarData(autorizacao.dataFim)}</li>
                )}
              </ul>
            </div>
          </div>

          {/* QR Code */}
          <div className="qr-code-section">
            <div className="qr-code-container">
              <h3>QR Code para Validação</h3>
              <div className="qr-code-image">
                {/* Aqui vai o QR Code - você pode usar o mesmo componente do QRCodeDisplay */}
                <img 
                  src={`https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${qrCodeValue}`}
                  alt="QR Code para validação"
                  className="qr-code-img"
                />
              </div>
              <div className="qr-code-instructions">
                <p><em>Apresente este QR Code na portaria</em></p>
                <p><em>para validação do acesso</em></p>
              </div>
            </div>
          </div>
        </div>

        {/* Rodapé */}
        <footer className="comprovante-footer">
          <div className="footer-divider"></div>
          <p>
            Comprovante gerado em {formatarDataHora(new Date().toISOString())} | 
            Sistema de Acesso Condominial
          </p>
        </footer>
      </div>
    </div>
  );
};

export default ComprovantePDF;