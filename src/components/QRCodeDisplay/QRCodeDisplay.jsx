import React, { useRef, useEffect, useState } from 'react';
import QRCode from 'qrcode.react';
import { 
  applyDocumentMask, 
  removeMask, 
  detectDocumentType, 
  formatRG, 
  formatCPF, 
  formatCNPJ } from '../../utils/masks';
import './QRCodeDisplay.css';
import { formatDateToDisplay } from '../../utils/dateFormat';
import { autorizacoesApi } from "../../services/autorizacoesApi";

const QRCodeDisplay = ({ data, onClose }) => {
  if (!data) return null;

  // 🆕 ESTADO PARA CONTROLE DO SALVAMENTO AUTOMÁTICO
  const [salvamentoStatus, setSalvamentoStatus] = useState({
    salvando: false,
    sucesso: false,
    erro: false,
    mensagem: ''
  });

  // 🆕 EFFECT PARA SALVAR AUTOMATICAMENTE AO MONTAR O COMPONENTE
  useEffect(() => {
    if (data && data.id) {
      salvarPDFAutomaticamente();
    }
  }, [data]);

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
    if (data.link) {
      return data.link;
    }

    // Se for o formato antigo com ID, cria o link
    if (data.id) {
      return data.link;
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

   // 🆕 FUNÇÃO CORRIGIDA PARA GERAR PDF COMO BLOB
  const gerarPDFComoBlob = async () => {
    return new Promise(async (resolve, reject) => {
      try {
        // Importar as bibliotecas necessárias
        const { default: html2canvas } = await import('html2canvas');
        const { default: jsPDF } = await import('jspdf');
        
        // Criar um elemento temporário para renderizar o comprovante
        const tempDiv = document.createElement('div');
        tempDiv.style.position = 'fixed';
        tempDiv.style.left = '-9999px';
        tempDiv.style.top = '0';
        tempDiv.style.width = '800px';
        tempDiv.style.background = 'white';
        tempDiv.style.padding = '20px';
        tempDiv.style.zIndex = '-1000';
        
        // Adicionar o HTML do comprovante ao elemento temporário
        tempDiv.innerHTML = `
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
            <div class="comprovante-header" style="
              display: flex;
              justify-content: space-between;
              align-items: flex-start;
              margin-bottom: 15px;
              padding-bottom: 10px;
              border-bottom: 2px solid #2c3e50;
            ">
              <div class="logo-section" style="display: flex; align-items: center; gap: 10px; flex: 1;">
                <div class="logo-text" style="
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
                ">🏢</div>
                <div class="header-text">
                  <h1 style="margin: 0; color: #2c3e50; font-size: 18px; font-weight: bold; line-height: 1.2;">
                    Autorização de Acesso
                  </h1>
                  <p style="margin: 3px 0 0 0; color: #7f8c8d; font-size: 11px;">
                    Sistema de Cadastro - Visitantes e Prestadores
                  </p>
                </div>
              </div>
              <div class="comprovante-id" style="
                background: #f8f9fa;
                padding: 6px 10px;
                border-radius: 4px;
                font-size: 10px;
                color: #6c757d;
                border: 1px solid #e9ecef;
                white-space: nowrap;
                margin-left: 10px;
              ">
                ID: ${data.id}
              </div>
            </div>
            
            <div class="comprovante-divider" style="
              height: 2px;
              background: linear-gradient(90deg, #3498db, #9b59b6);
              margin: 12px 0;
              border-radius: 1px;
            "></div>

            <div class="comprovante-content" style="
              display: grid;
              grid-template-columns: 1fr 140px;
              gap: 25px;
              margin-bottom: 20px;
              align-items: start;
            ">
              <div class="comprovante-info">
                <h2 style="
                  color: #2c3e50;
                  margin-bottom: 12px;
                  font-size: 14px;
                  border-bottom: 1px solid #3498db;
                  padding-bottom: 3px;
                ">Dados do Cadastro</h2>
                <table class="comprovante-table" style="
                  width: 100%;
                  border-collapse: collapse;
                  margin-bottom: 15px;
                  font-size: 11px;
                ">
                  <tbody>
                    <tr>
                      <td style="padding: 6px 4px; vertical-align: top; border-bottom: 1px solid #eee; line-height: 1.2; width: 120px; font-weight: bold; color: #2c3e50;">
                        <strong>Nome:</strong>
                      </td>
                      <td style="padding: 6px 4px; vertical-align: top; border-bottom: 1px solid #eee; line-height: 1.2;">
                        ${data.nome}
                      </td>
                    </tr>
                    <tr>
                      <td style="padding: 6px 4px; vertical-align: top; border-bottom: 1px solid #eee; line-height: 1.2; width: 120px; font-weight: bold; color: #2c3e50;">
                        <strong>Tipo:</strong>
                      </td>
                      <td style="padding: 6px 4px; vertical-align: top; border-bottom: 1px solid #eee; line-height: 1.2;">
                        <span class="tipo-badge ${data.tipo.toLowerCase()}" style="
                          padding: 3px 6px;
                          border-radius: 8px;
                          font-size: 9px;
                          font-weight: 600;
                          display: inline-block;
                          background: ${data.tipo === 'Visitante' ? '#e8f4fd' : '#f4ecf7'};
                          color: ${data.tipo === 'Visitante' ? '#3498db' : '#8e44ad'};
                        ">
                          ${data.tipo === 'Visitante' ? '👤 Visitante' : '👷 Prestador de Serviço'}
                        </span>
                      </td>
                    </tr>
                    ${data.empresa ? `
                    <tr>
                      <td style="padding: 6px 4px; vertical-align: top; border-bottom: 1px solid #eee; line-height: 1.2; width: 120px; font-weight: bold; color: #2c3e50;">
                        <strong>Empresa:</strong>
                      </td>
                      <td style="padding: 6px 4px; vertical-align: top; border-bottom: 1px solid #eee; line-height: 1.2;">
                        ${data.empresa}
                      </td>
                    </tr>
                    ` : ''}
                    <tr>
                      <td style="padding: 6px 4px; vertical-align: top; border-bottom: 1px solid #eee; line-height: 1.2; width: 120px; font-weight: bold; color: #2c3e50;">
                        <strong>CPF:</strong>
                      </td>
                      <td style="padding: 6px 4px; vertical-align: top; border-bottom: 1px solid #eee; line-height: 1.2;">
                        ${formatCPF(data.cpf)}
                      </td>
                    </tr>
                    <tr>
                      <td style="padding: 6px 4px; vertical-align: top; border-bottom: 1px solid #eee; line-height: 1.2; width: 120px; font-weight: bold; color: #2c3e50;">
                        <strong>RG:</strong>
                      </td>
                      <td style="padding: 6px 4px; vertical-align: top; border-bottom: 1px solid #eee; line-height: 1.2;">
                        ${formatRG(data.rg)}
                      </td>
                    </tr>
                    ${data.cnpj ? `
                    <tr>
                      <td style="padding: 6px 4px; vertical-align: top; border-bottom: 1px solid #eee; line-height: 1.2; width: 120px; font-weight: bold; color: #2c3e50;">
                        <strong>CNPJ:</strong>
                      </td>
                      <td style="padding: 6px 4px; vertical-align: top; border-bottom: 1px solid #eee; line-height: 1.2;">
                        ${formatCNPJ(data.cnpj)}
                      </td>
                    </tr>
                    ` : ''}
                    <tr>
                      <td style="padding: 6px 4px; vertical-align: top; border-bottom: 1px solid #eee; line-height: 1.2; width: 120px; font-weight: bold; color: #2c3e50;">
                        <strong>Período:</strong>
                      </td>
                      <td style="padding: 6px 4px; vertical-align: top; border-bottom: 1px solid #eee; line-height: 1.2;">
                        ${data.periodo === 'unico' 
                          ? `Dia único: ${formatDateToDisplay(data.dataInicio)}`
                          : `De ${formatDateToDisplay(data.dataInicio)} até ${formatDateToDisplay(data.dataFim)}`
                        }
                      </td>
                    </tr>
                    <tr>
                      <td style="padding: 6px 4px; vertical-align: top; border-bottom: 1px solid #eee; line-height: 1.2; width: 120px; font-weight: bold; color: #2c3e50;">
                        <strong>Data do Cadastro:</strong>
                      </td>
                      <td style="padding: 6px 4px; vertical-align: top; border-bottom: 1px solid #eee; line-height: 1.2;">
                        ${new Date().toLocaleString('pt-BR')}
                      </td>
                    </tr>
                  </tbody>
                </table>

                <div class="observacoes-section" style="
                  margin-top: 15px;
                  background: #fff3cd;
                  border: 1px solid #ffeaa7;
                  border-radius: 4px;
                  padding: 12px;
                ">
                  <h3 style="color: #856404; margin: 0 0 8px 0; font-size: 12px;">Observações:</h3>
                  <ul style="margin: 0; padding-left: 12px; color: #856404;">
                    <li style="margin-bottom: 4px; line-height: 1.2; font-size: 10px;">
                      Este comprovante deve ser apresentado na portaria junto com documento de identificação
                    </li>
                    <li style="margin-bottom: 4px; line-height: 1.2; font-size: 10px;">
                      O acesso está sujeito à confirmação dos dados pela portaria
                    </li>
                    <li style="margin-bottom: 4px; line-height: 1.2; font-size: 10px;">
                      Em caso de dúvidas, entre em contato com a administração
                    </li>
                    ${data.periodo === 'unico' ? 
                      `<li style="margin-bottom: 4px; line-height: 1.2; font-size: 10px;">
                        Válido apenas para o dia ${formatDateToDisplay(data.dataInicio)}
                      </li>` : 
                      `<li style="margin-bottom: 4px; line-height: 1.2; font-size: 10px;">
                        Válido no período de ${formatDateToDisplay(data.dataInicio)} a ${formatDateToDisplay(data.dataFim)}
                      </li>`
                    }
                  </ul>
                </div>
              </div>
              
              <div class="comprovante-qrcode" style="
                text-align: center;
                padding: 12px;
                background: #f8f9fa;
                border-radius: 6px;
                border: 1px solid #ddd;
                height: fit-content;
              ">
                <h3 style="margin: 0 0 10px 0; color: #2c3e50; font-size: 12px;">
                  QR Code para Validação
                </h3>
                <div class="qrcode-print" style="margin: 8px 0; display: flex; justify-content: center;">
                  <img src="${`https://api.qrserver.com/v1/create-qr-code/?size=120x120&data=${qrData}`}" 
                      alt="QR Code para validação" 
                      style="width: 120px; height: 120px;" />
                </div>
                <p class="comprovante-instruction" style="
                  font-style: italic;
                  color: #666;
                  margin: 8px 0 0 0;
                  font-size: 9px;
                  line-height: 1.2;
                ">
                  Apresente este QR Code na portaria<br />
                  para validação do acesso
                </p>
              </div>
            </div>
            
            <div class="comprovante-footer" style="
              margin-top: 20px;
              padding-top: 12px;
              border-top: 1px solid #e9ecef;
            ">
              <div class="footer-divider" style="
                height: 1px;
                background: #dee2e6;
                margin: 12px 0 8px 0;
              "></div>
              <p style="text-align: center; color: #6c757d; font-size: 9px; margin: 0;">
                Comprovante gerado em ${new Date().toLocaleString('pt-BR')} | 
                Sistema de Acesso Condominial
              </p>
            </div>
          </div>
        `;
        
        document.body.appendChild(tempDiv);
        
        // Aguardar um pouco para garantir que as imagens carreguem
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        // Capturar como canvas
        const canvas = await html2canvas(tempDiv, {
          scale: 2,
          useCORS: true,
          logging: false,
          backgroundColor: '#ffffff'
        });
        
        // Limpar o elemento temporário
        document.body.removeChild(tempDiv);
        
        // Configurações do PDF
        const pdf = new jsPDF('p', 'mm', 'a4');
        const pdfWidth = pdf.internal.pageSize.getWidth();
        const pdfHeight = pdf.internal.pageSize.getHeight();
        pdf.setProperties({
            name: "comprovante.pdf",
            filename: "comprovante.pdf"
        });
        
        // Calcular dimensões mantendo proporção
        const imgWidth = canvas.width;
        const imgHeight = canvas.height;
        const ratio = imgHeight / imgWidth;
        const pdfImgHeight = pdfWidth * ratio;
        
        // Adicionar imagem ao PDF
        const imgData = canvas.toDataURL('image/jpeg', 0.9);
        pdf.addImage(imgData, 'JPEG', 0, 0, pdfWidth, pdfImgHeight);
        
        // Gerar o Blob do PDF
        const pdfBlob = pdf.output('blob');
        
        resolve(pdfBlob);
        
      } catch (error) {
        console.error('Erro ao gerar PDF:', error);
        reject(error);
      }
    });
  };

  // 🆕 FUNÇÃO PRINCIPAL PARA SALVAR PDF AUTOMATICAMENTE
  const salvarPDFAutomaticamente = async () => {
    // Verificar se já foi salvo recentemente (evitar duplicação)
    const chaveSalvamento = `pdf_salvo_${data.id}`;
    const jaSalvo = localStorage.getItem(chaveSalvamento);
    
    if (jaSalvo) {
      console.log('PDF já foi salvo anteriormente para esta autorização');
      return;
    }

    setSalvamentoStatus({ 
      salvando: true, 
      sucesso: false, 
      erro: false, 
      mensagem: 'Salvando comprovante no sistema...' 
    });

    try {
      // 1. Gerar PDF como Blob
      const pdfBlob = await gerarPDFComoBlob();
      
      // 2. Nome do arquivo
      const nomeArquivo = `comprovante-${data.nome.replace(/\s+/g, '_')}-${data.id}.png`;
      
      // 3. Upload para o backend
      await autorizacoesApi.salvarComprovantePDF(data.id, pdfBlob, nomeArquivo);
      
      // 4. Marcar como salvo no localStorage (válido por 1 hora)
      localStorage.setItem(chaveSalvamento, 'true');
      setTimeout(() => {
        localStorage.removeItem(chaveSalvamento);
      }, 60 * 60 * 1000); // 1 hora
      
      setSalvamentoStatus({ 
        salvando: false, 
        sucesso: true, 
        erro: false, 
        mensagem: '✅ Comprovante salvo automaticamente no sistema' 
      });
      
      console.log('PDF salvo com sucesso no backend');
      
    } catch (error) {
      console.error('Erro ao salvar PDF automaticamente:', error);
      setSalvamentoStatus({ 
        salvando: false, 
        sucesso: false, 
        erro: true, 
        mensagem: '⚠️ Comprovante salvo localmente, mas não foi possível enviar para o sistema' 
      });
    }
  };

  // Função para imprimir apenas o comprovante - QR CODE NA LATERAL
  const handlePrint = () => {
    // Criar um iframe para impressão
    const printFrame = document.createElement('iframe');
    printFrame.style.position = 'fixed';
    printFrame.style.right = '0';
    printFrame.style.bottom = '0';
    printFrame.style.width = '0';
    printFrame.style.height = '0';
    printFrame.style.border = 'none';
    
    document.body.appendChild(printFrame);
    
    const printDocument = printFrame.contentWindow.document;
    
    // Escrever o conteúdo do comprovante no iframe
    printDocument.write(`
      <!DOCTYPE html>
      <html>
        <head>
          <title>Comprovante de Autorização</title>
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
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
              grid-template-columns: 1fr 140px; /* Coluna do QR Code mais estreita */
              gap: 25px;
              margin-bottom: 20px;
              align-items: start;
            }
            
            .comprovante-info {
              /* Coluna dos dados - ocupa o espaço restante */
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
            
            /* 🎯 SEÇÃO DO QR CODE NA LATERAL */
            .comprovante-qrcode {
              text-align: center;
              padding: 12px;
              background: #f8f9fa;
              border-radius: 6px;
              border: 1px solid #ddd;
              height: fit-content;
              position: sticky;
              top: 0;
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
            
            /* Media queries para mobile - MANTEM DUAS COLUNAS */
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
              
              /* 🎯 NO MOBILE MANTEM DUAS COLUNAS MAS MAIS COMPACTAS */
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
              
              /* 🎯 GARANTE QUE O LAYOUT DE DUAS COLUNAS SE MANTENHA NA IMPRESSÃO */
              .comprovante-content {
                display: grid !important;
                grid-template-columns: 1fr 140px !important;
              }
            }
          </style>
        </head>
        <body>
          <div class="comprovante-container">
            <div class="comprovante-header">
              <div class="logo-section">
                <div class="logo-text">🏢</div>
                <div class="header-text">
                  <h1>Autorização de Acesso</h1>
                  <p>Sistema de Cadastro - Visitantes e Prestadores</p>
                </div>
              </div>
              <div class="comprovante-id">
                ID: ${data.id}
              </div>
            </div>
            
            <div class="comprovante-divider"></div>

            <!-- 🎯 LAYOUT COM QR CODE NA LATERAL -->
            <div class="comprovante-content">
              <!-- Coluna dos Dados -->
              <div class="comprovante-info">
                <h2>Dados do Cadastro</h2>
                <table class="comprovante-table">
                  <tbody>
                    <tr>
                      <td><strong>Nome:</strong></td>
                      <td>${data.nome}</td>
                    </tr>
                    <tr>
                      <td><strong>Tipo:</strong></td>
                      <td>
                        <span class="tipo-badge ${data.tipo.toLowerCase()}">
                          ${data.tipo === 'Visitante' ? '👤 Visitante' : '👷 Prestador de Serviço'}
                        </span>
                      </td>
                    </tr>
                    ${data.empresa ? `
                    <tr>
                      <td><strong>Empresa:</strong></td>
                      <td>${data.empresa}</td>
                    </tr>
                    ` : ''}
                    <tr>
                      <td><strong>CPF:</strong></td>
                      <td>${formatCPF(data.cpf)}</td>
                    </tr>
                    <tr>
                      <td><strong>RG:</strong></td>
                      <td>${formatRG(data.rg)}</td>
                    </tr>
                    ${data.cnpj ? `
                    <tr>
                      <td><strong>CNPJ:</strong></td>
                      <td>${formatCNPJ(data.cnpj)}</td>
                    </tr>
                    ` : ''}
                    <tr>
                      <td><strong>Período:</strong></td>
                      <td>
                        ${data.periodo === 'unico' 
                          ? `Dia único: ${formatDateToDisplay(data.dataInicio)}`
                          : `De ${formatDateToDisplay(data.dataInicio)} até ${formatDateToDisplay(data.dataFim)}`
                        }
                      </td>
                    </tr>
                    <tr>
                      <td><strong>Data do Cadastro:</strong></td>
                      <td>${new Date().toLocaleString('pt-BR')}</td>
                    </tr>
                  </tbody>
                </table>

                <!-- Observações -->
                <div class="observacoes-section">
                  <h3>Observações:</h3>
                  <ul>
                    <li>Este comprovante deve ser apresentado na portaria junto com documento de identificação</li>
                    <li>O acesso está sujeito à confirmação dos dados pela portaria</li>
                    <li>Em caso de dúvidas, entre em contato com a administração</li>
                    ${data.periodo === 'unico' ? 
                      `<li>Válido apenas para o dia ${formatDateToDisplay(data.dataInicio)}</li>` : 
                      `<li>Válido no período de ${formatDateToDisplay(data.dataInicio)} a ${formatDateToDisplay(data.dataFim)}</li>`
                    }
                  </ul>
                </div>
              </div>
              
              <!-- 🎯 COLUNA DO QR CODE NA LATERAL -->
              <div class="comprovante-qrcode">
                <h3>QR Code para Validação</h3>
                <div class="qrcode-print">
                  <img src="${`https://api.qrserver.com/v1/create-qr-code/?size=120x120&data=${qrData}`}" 
                      alt="QR Code para validação" 
                      style="width: 120px; height: 120px;" />
                </div>
                <p class="comprovante-instruction">
                  Apresente este QR Code na portaria<br />
                  para validação do acesso
                </p>
              </div>
            </div>
            
            <div class="comprovante-footer">
              <div class="footer-divider"></div>
              <p>
                Comprovante gerado em ${new Date().toLocaleString('pt-BR')} | 
                Sistema de Acesso Condominial
              </p>
            </div>
          </div>
        </body>
      </html>
    `);
    
    printDocument.close();
    
    // Aguardar o conteúdo carregar e então imprimir
    printFrame.onload = function() {
      setTimeout(() => {
        printFrame.contentWindow.focus();
        printFrame.contentWindow.print();
        
        // Remover o iframe após impressão
        setTimeout(() => {
          if (document.body.contains(printFrame)) {
            document.body.removeChild(printFrame);
          }
        }, 1000);
      }, 500);
    };
  };

  return (
    <div className="qr-code-overlay">
      <div className="qr-code-modal">
        <div className="qr-code-header">
          <h2>Cadastro Realizado com Sucesso!</h2>

          {/* 🆕 INDICADOR DE SALVAMENTO AUTOMÁTICO */}
          {salvamentoStatus.salvando && (
            <div className="salvamento-status salvando">
              ⏳ {salvamentoStatus.mensagem}
            </div>
          )}
          {salvamentoStatus.sucesso && (
            <div className="salvamento-status sucesso">
              ✅ {salvamentoStatus.mensagem}
            </div>
          )}
          {salvamentoStatus.erro && (
            <div className="salvamento-status erro">
              ⚠️ {salvamentoStatus.mensagem}
            </div>
          )}

          <button className="close-btn" onClick={onClose}>×</button>
        </div>
        
        <div className="qr-code-content">
          <div className="qr-code-info">
            <h3>Dados do Cadastro:</h3>
            <p><strong>Nome:</strong> {data.nome}</p>
            <p><strong>Tipo:</strong> {data.tipo === 'Visitante' ? 'Visitante' : 'Prestador de Serviço'}</p>
            <p><strong>CPF:</strong> {formatCPF(data.cpf)}</p>
            <p><strong>RG:</strong> {formatRG(data.rg)}</p>
            <p><strong>Período:</strong> {data.periodo === 'unico' 
                ? `Dia único: ${formatDateToDisplay(data.dataInicio)}`
                : `De ${formatDateToDisplay(data.dataInicio)} até ${formatDateToDisplay(data.dataFim)}`
              }
            </p>
            {data.empresa && <p><strong>Empresa:</strong> {data.empresa}</p>}
            {data.cnpj && <p><strong>CNPJ:</strong> {formatCNPJ(data.cnpj)}</p>}

            {/* ✅ ADICIONE ESTAS LINHAS: */}
            {(data.apiLink || data.id) && (
              <div className="api-link-info">
                <p><strong>ID da Autorização:</strong> {data.id}</p>
                {/* {data.link && (
                  <p><strong>Link da API:</strong> <code>{data.link}</code></p>
                )} */}
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

      </div>
    </div>
  );
};

export default QRCodeDisplay;