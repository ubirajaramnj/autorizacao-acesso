// src/utils/comprovanteTemplate.js
import { formatCPF, formatRG, formatCNPJ } from './masks';
import { formatDateToDisplay } from './dateFormat';

export const comprovanteTemplate = {
  // 🎯 GERAR HTML DO COMPROVANTE (CSS INLINE - para PDF)
  generateHTML(data, qrData, useInlineCSS = true) {
    const currentDate = new Date().toLocaleString('pt-BR');
    
    if (useInlineCSS) {
      return this.generateHTMLWithInlineCSS(data, qrData, currentDate);
    } else {
      return this.generateHTMLWithExternalCSS(data, qrData, currentDate);
    }
  },

  // 🎯 VERSÃO COM CSS INLINE (para PDF)
  generateHTMLWithInlineCSS(data, qrData, currentDate) {
    return `
      <div class="comprovante-container" style="
        max-width: 100%;
        margin: 0 auto;
        border: 2px solid #2c3e50;
        border-radius: 8px;
        padding: 15px;
        background: white;
        font-family: Arial, sans-serif;
        color: #000;
        font-size: 12px;
      ">
        ${this.generateHeader(data, true)}
        ${this.generateDivider(true)}
        ${this.generateContent(data, qrData, currentDate, true)}
        ${this.generateFooter(currentDate, true)}
      </div>
    `;
  },

  // 🎯 VERSÃO COM CSS EXTERNO (para impressão)
  generateHTMLWithExternalCSS(data, qrData, currentDate) {
    return `
      <div class="comprovante-container">
        ${this.generateHeader(data, false)}
        ${this.generateDivider(false)}
        ${this.generateContent(data, qrData, currentDate, false)}
        ${this.generateFooter(currentDate, false)}
      </div>
    `;
  },

  // 🎯 CABEÇALHO
  generateHeader(data, inlineCSS) {
    const headerStyles = inlineCSS ? `style="
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
      margin-bottom: 15px;
      padding-bottom: 10px;
      border-bottom: 2px solid #2c3e50;
    "` : '';

    const logoStyles = inlineCSS ? `style="
      display: flex;
      align-items: center;
      gap: 10px;
      flex: 1;
    "` : '';

    const logoTextStyles = inlineCSS ? `style="
      font-size: 36px;
      background: #3498db;
      color: white;
      width: 60px;
      height: 60px;
      border-radius: 8px;
      display: flex;
      align-items: center;
      justify-content: center;
      flex-shrink: 0;
    "` : '';

    const headerTextStyles = inlineCSS ? '' : '';

    const titleStyles = inlineCSS ? `style="
      margin: 0;
      color: #2c3e50;
      font-size: 18px;
      font-weight: bold;
      line-height: 1.2;
    "` : '';

    const subtitleStyles = inlineCSS ? `style="
      margin: 3px 0 0 0;
      color: #7f8c8d;
      font-size: 11px;
    "` : '';

    const idStyles = inlineCSS ? `style="
      background: #f8f9fa;
      padding: 6px 10px;
      border-radius: 4px;
      font-size: 10px;
      color: #6c757d;
      border: 1px solid #e9ecef;
      white-space: nowrap;
      margin-left: 10px;
    "` : '';

    return `
      <div class="comprovante-header" ${headerStyles}>
        <div class="logo-section" ${logoStyles}>
          <div class="logo-text" ${logoTextStyles}>🏢</div>
          <div class="header-text" ${headerTextStyles}>
            <h1 ${titleStyles}>Autorização de Acesso</h1>
            <p ${subtitleStyles}>Sistema de Cadastro - Visitantes e Prestadores</p>
          </div>
        </div>
        <div class="comprovante-id" ${idStyles}>
          ID: ${data.id}
        </div>
      </div>
    `;
  },

  // 🎯 DIVISOR
  generateDivider(inlineCSS) {
    const styles = inlineCSS ? `style="
      height: 2px;
      background: linear-gradient(90deg, #3498db, #9b59b6);
      margin: 12px 0;
      border-radius: 1px;
    "` : '';

    return `<div class="comprovante-divider" ${styles}></div>`;
  },

  // 🎯 CONTEÚDO PRINCIPAL - CORRIGIDO: adicionado currentDate como parâmetro
  generateContent(data, qrData, currentDate, inlineCSS) {
    const contentStyles = inlineCSS ? `style="
      display: grid;
      grid-template-columns: 1fr 140px;
      gap: 25px;
      margin-bottom: 20px;
      align-items: start;
    "` : '';

    return `
      <div class="comprovante-content" ${contentStyles}>
        ${this.generateDataSection(data, currentDate, inlineCSS)}
        ${this.generateQRCodeSection(data, qrData, inlineCSS)}
      </div>
    `;
  },

  // 🎯 SEÇÃO DE DADOS - CORRIGIDO: adicionado currentDate como parâmetro
  generateDataSection(data, currentDate, inlineCSS) {
    const titleStyles = inlineCSS ? `style="
      color: #2c3e50;
      margin-bottom: 12px;
      font-size: 14px;
      border-bottom: 1px solid #3498db;
      padding-bottom: 3px;
    "` : '';

    const tableStyles = inlineCSS ? `style="
      width: 100%;
      border-collapse: collapse;
      margin-bottom: 15px;
      font-size: 11px;
    "` : '';

    const tdStyles = inlineCSS ? `style="
      padding: 6px 4px;
      vertical-align: top;
      border-bottom: 1px solid #eee;
      line-height: 1.2;
    "` : '';

    const tdFirstStyles = inlineCSS ? `style="
      padding: 6px 4px;
      vertical-align: top;
      border-bottom: 1px solid #eee;
      line-height: 1.2;
      width: 120px;
      font-weight: bold;
      color: #2c3e50;
    "` : '';

    const badgeStyles = (tipo) => inlineCSS ? `style="
      padding: 3px 6px;
      border-radius: 8px;
      font-size: 9px;
      font-weight: 600;
      display: inline-block;
      background: ${tipo === 'Visitante' ? '#e8f4fd' : '#f4ecf7'};
      color: ${tipo === 'Visitante' ? '#3498db' : '#8e44ad'};
    "` : '';

    const observacoesStyles = inlineCSS ? `style="
      margin-top: 15px;
      background: #fff3cd;
      border: 1px solid #ffeaa7;
      border-radius: 4px;
      padding: 12px;
    "` : '';

    const obsTitleStyles = inlineCSS ? `style="
      color: #856404;
      margin: 0 0 8px 0;
      font-size: 12px;
    "` : '';

    const obsListStyles = inlineCSS ? `style="
      margin: 0;
      padding-left: 12px;
      color: #856404;
    "` : '';

    const obsItemStyles = inlineCSS ? `style="
      margin-bottom: 4px;
      line-height: 1.2;
      font-size: 10px;
    "` : '';

    return `
      <div class="comprovante-info">
        <h2 ${titleStyles}>Dados do Cadastro</h2>
        <table class="comprovante-table" ${tableStyles}>
          <tbody>
            <tr>
              <td ${tdFirstStyles}><strong>Nome:</strong></td>
              <td ${tdStyles}>${data.nome}</td>
            </tr>
            <tr>
              <td ${tdFirstStyles}><strong>Tipo:</strong></td>
              <td ${tdStyles}>
                <span class="tipo-badge ${data.tipo.toLowerCase()}" ${badgeStyles(data.tipo)}>
                  ${data.tipo === 'Visitante' ? '👤 Visitante' : '👷 Prestador de Serviço'}
                </span>
              </td>
            </tr>
            ${data.empresa ? `
            <tr>
              <td ${tdFirstStyles}><strong>Empresa:</strong></td>
              <td ${tdStyles}>${data.empresa}</td>
            </tr>
            ` : ''}
            <tr>
              <td ${tdFirstStyles}><strong>CPF:</strong></td>
              <td ${tdStyles}>${formatCPF(data.cpf)}</td>
            </tr>
            <tr>
              <td ${tdFirstStyles}><strong>RG:</strong></td>
              <td ${tdStyles}>${formatRG(data.rg)}</td>
            </tr>
            ${data.cnpj ? `
            <tr>
              <td ${tdFirstStyles}><strong>CNPJ:</strong></td>
              <td ${tdStyles}>${formatCNPJ(data.cnpj)}</td>
            </tr>
            ` : ''}
            <tr>
              <td ${tdFirstStyles}><strong>Período:</strong></td>
              <td ${tdStyles}>
                ${data.periodo === 'unico' 
                  ? `Dia único: ${formatDateToDisplay(data.dataInicio)}`
                  : `De ${formatDateToDisplay(data.dataInicio)} até ${formatDateToDisplay(data.dataFim)}`
                }
              </td>
            </tr>
            <tr>
              <td ${tdFirstStyles}><strong>Data do Cadastro:</strong></td>
              <td ${tdStyles}>${currentDate}</td>
            </tr>
          </tbody>
        </table>

        <div class="observacoes-section" ${observacoesStyles}>
          <h3 ${obsTitleStyles}>Observações:</h3>
          <ul ${obsListStyles}>
            <li ${obsItemStyles}>Este comprovante deve ser apresentado na portaria junto com documento de identificação</li>
            <li ${obsItemStyles}>O acesso está sujeito à confirmação dos dados pela portaria</li>
            <li ${obsItemStyles}>Em caso de dúvidas, entre em contato com a administração</li>
            ${data.periodo === 'unico' ? 
              `<li ${obsItemStyles}>Válido apenas para o dia ${formatDateToDisplay(data.dataInicio)}</li>` : 
              `<li ${obsItemStyles}>Válido no período de ${formatDateToDisplay(data.dataInicio)} a ${formatDateToDisplay(data.dataFim)}</li>`
            }
          </ul>
        </div>
      </div>
    `;
  },

  // 🎯 SEÇÃO DO QR CODE
  generateQRCodeSection(data, qrData, inlineCSS) {
    const qrContainerStyles = inlineCSS ? `style="
      text-align: center;
      padding: 12px;
      background: #f8f9fa;
      border-radius: 6px;
      border: 1px solid #ddd;
      height: fit-content;
    "` : '';

    const titleStyles = inlineCSS ? `style="
      margin: 0 0 10px 0;
      color: #2c3e50;
      font-size: 12px;
    "` : '';

    const qrPrintStyles = inlineCSS ? `style="
      margin: 8px 0;
      display: flex;
      justify-content: center;
    "` : '';

    const instructionStyles = inlineCSS ? `style="
      font-style: italic;
      color: #666;
      margin: 8px 0 0 0;
      font-size: 9px;
      line-height: 1.2;
    "` : '';

    return `
      <div class="comprovante-qrcode" ${qrContainerStyles}>
        <h3 ${titleStyles}>QR Code para Validação</h3>
        <div class="qrcode-print" ${qrPrintStyles}>
          <img src="${`https://api.qrserver.com/v1/create-qr-code/?size=120x120&data=${qrData}`}" 
              alt="QR Code para validação" 
              style="width: 120px; height: 120px;" />
        </div>
        <p class="comprovante-instruction" ${instructionStyles}>
          Apresente este QR Code na portaria<br />
          para validação do acesso
        </p>
      </div>
    `;
  },

  // 🎯 RODAPÉ
  generateFooter(currentDate, inlineCSS) {
    const footerStyles = inlineCSS ? `style="
      margin-top: 20px;
      padding-top: 12px;
      border-top: 1px solid #e9ecef;
    "` : '';

    const dividerStyles = inlineCSS ? `style="
      height: 1px;
      background: #dee2e6;
      margin: 12px 0 8px 0;
    "` : '';

    const textStyles = inlineCSS ? `style="
      text-align: center;
      color: #6c757d;
      font-size: 9px;
      margin: 0;
    "` : '';

    return `
      <div class="comprovante-footer" ${footerStyles}>
        <div class="footer-divider" ${dividerStyles}></div>
        <p ${textStyles}>
          Comprovante gerado em ${currentDate} | 
          Sistema de Acesso Condominial
        </p>
      </div>
    `;
  },

  // 🎯 CSS EXTERNO PARA IMPRESSÃO
  getExternalCSS() {
    return `
      <style>
        /* ESTILOS DO COMPROVANTE - QR CODE NA LATERAL */
        body {
          font-family: Arial, sans-serif;
          margin: 0;
          padding: 15px;
          color: #000;
          background: white;
          font-size: 12px;
        }
        
        .comprovante-container {
          max-width: 100%;
          margin: 0 auto;
          border: 2px solid #2c3e50;
          border-radius: 8px;
          padding: 15px;
          background: white;
          page-break-inside: avoid;
        }
        
        .comprovante-header {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          margin-bottom: 15px;
          padding-bottom: 10px;
          border-bottom: 2px solid #2c3e50;
        }
        
        .logo-section {
          display: flex;
          align-items: center;
          gap: 10px;
          flex: 1;
        }
        
        .logo-text {
          font-size: 36px;
          background: #3498db;
          color: white;
          width: 60px;
          height: 60px;
          border-radius: 8px;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
        }
        
        .header-text h1 {
          margin: 0;
          color: #2c3e50;
          font-size: 18px;
          font-weight: bold;
          line-height: 1.2;
        }
        
        .header-text p {
          margin: 3px 0 0 0;
          color: #7f8c8d;
          font-size: 11px;
        }
        
        .comprovante-id {
          background: #f8f9fa;
          padding: 6px 10px;
          border-radius: 4px;
          font-size: 10px;
          color: #6c757d;
          border: 1px solid #e9ecef;
          white-space: nowrap;
          margin-left: 10px;
        }
        
        .comprovante-divider {
          height: 2px;
          background: linear-gradient(90deg, #3498db, #9b59b6);
          margin: 12px 0;
          border-radius: 1px;
        }
        
        /* 🎯 QR CODE NA LATERAL - LAYOUT DE DUAS COLUNAS */
        .comprovante-content {
          display: grid;
          grid-template-columns: 1fr 140px;
          gap: 25px;
          margin-bottom: 20px;
          align-items: start;
        }
        
        .comprovante-info h2 {
          color: #2c3e50;
          margin-bottom: 12px;
          font-size: 14px;
          border-bottom: 1px solid #3498db;
          padding-bottom: 3px;
        }
        
        .comprovante-table {
          width: 100%;
          border-collapse: collapse;
          margin-bottom: 15px;
          font-size: 11px;
        }
        
        .comprovante-table td {
          padding: 6px 4px;
          vertical-align: top;
          border-bottom: 1px solid #eee;
          line-height: 1.2;
        }
        
        .comprovante-table td:first-child {
          width: 120px;
          font-weight: bold;
          color: #2c3e50;
        }
        
        .tipo-badge {
          padding: 3px 6px;
          border-radius: 8px;
          font-size: 9px;
          font-weight: 600;
          display: inline-block;
        }
        
        .tipo-badge.visitante {
          background: #e8f4fd;
          color: #3498db;
        }
        
        .tipo-badge.prestador {
          background: #f4ecf7;
          color: #8e44ad;
        }
        
        .observacoes-section {
          margin-top: 15px;
          background: #fff3cd;
          border: 1px solid #ffeaa7;
          border-radius: 4px;
          padding: 12px;
        }
        
        .observacoes-section h3 {
          color: #856404;
          margin: 0 0 8px 0;
          font-size: 12px;
        }
        
        .observacoes-section ul {
          margin: 0;
          padding-left: 12px;
          color: #856404;
        }
        
        .observacoes-section li {
          margin-bottom: 4px;
          line-height: 1.2;
          font-size: 10px;
        }
        
        .comprovante-qrcode {
          text-align: center;
          padding: 12px;
          background: #f8f9fa;
          border-radius: 6px;
          border: 1px solid #ddd;
          height: fit-content;
        }
        
        .comprovante-qrcode h3 {
          margin: 0 0 10px 0;
          color: #2c3e50;
          font-size: 12px;
        }
        
        .qrcode-print {
          margin: 8px 0;
          display: flex;
          justify-content: center;
        }
        
        .comprovante-instruction {
          font-style: italic;
          color: #666;
          margin: 8px 0 0 0;
          font-size: 9px;
          line-height: 1.2;
        }
        
        .comprovante-footer {
          margin-top: 20px;
          padding-top: 12px;
          border-top: 1px solid #e9ecef;
        }
        
        .footer-divider {
          height: 1px;
          background: #dee2e6;
          margin: 12px 0 8px 0;
        }
        
        .comprovante-footer p {
          text-align: center;
          color: #6c757d;
          font-size: 9px;
          margin: 0;
        }
        
        /* Media queries para mobile */
        @media (max-width: 480px) {
          body {
            padding: 10px;
            font-size: 11px;
          }
          
          .comprovante-container {
            padding: 12px;
          }
          
          .comprovante-header {
            flex-direction: column;
            gap: 10px;
            text-align: center;
          }
          
          .logo-section {
            justify-content: center;
          }
          
          .comprovante-id {
            margin-left: 0;
            align-self: center;
          }
          
          .comprovante-content {
            grid-template-columns: 1fr 120px;
            gap: 15px;
          }
          
          .comprovante-table {
            font-size: 10px;
          }
          
          .comprovante-table td:first-child {
            width: 100px;
          }
          
          .comprovante-qrcode {
            padding: 8px;
          }
          
          .comprovante-qrcode h3 {
            font-size: 11px;
          }
        }
        
        /* Remove margens padrão da impressão */
        @media print {
          @page {
            margin: 10mm;
            size: portrait;
          }
          
          body {
            margin: 0;
            padding: 0;
            font-size: 11px;
          }
          
          .comprovante-container {
            border: none;
            box-shadow: none;
            padding: 0;
          }
          
          .comprovante-content {
            display: grid !important;
            grid-template-columns: 1fr 140px !important;
          }
        }
      </style>
    `;
  }
};