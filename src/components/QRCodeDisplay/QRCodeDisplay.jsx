import React, { useRef, useEffect, useState } from 'react';
import QRCode from 'qrcode.react';
import { 
  applyDocumentMask, 
  removeMask, 
  detectDocumentType, 
  formatRG, 
  formatCPF, 
  formatCNPJ } from '../../utils/masks';
import Loader from '../Loader/Loader';
import './QRCodeDisplay.css';
import { formatDateToDisplay } from '../../utils/dateFormat';
import { comprovanteTemplate } from '../../utils/comprovanteTeamplate';
import { autorizacoesApi } from "../../services/autorizacoesApi";

const QRCodeDisplay = ({ data, onClose }) => {
  if (!data) return null;

  // 🆕 ESTADO PARA CONTROLE DO SALVAMENTO AUTOMÁTICO
  const [salvamentoStatus, setSalvamentoStatus] = useState({
    salvando: false,
    sucesso: false,
    erro: false,
    mensagem: '',
    bloqueado: false // 🆕 NOVO ESTADO PARA BLOQUEAR A TELA
  });

  // 🆕 REFS PARA CONTROLAR SALVAMENTO
  const hasSavedRef = useRef(false);
  const isSavingRef = useRef(false);

  // 🆕 EFFECT PARA SALVAR AUTOMATICAMENTE AO MONTAR O COMPONENTE
  useEffect(() => {
    if (data && data.id && !hasSavedRef.current && !isSavingRef.current) {
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
        // 🎯 USAR O TEMPLATE COMPARTILHADO
        tempDiv.innerHTML = comprovanteTemplate.generateHTML(data, qrData, true);
        
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
    
    // 🆕 VERIFICAÇÕES ADICIONAIS
    if (jaSalvo || hasSavedRef.current || isSavingRef.current) {
      console.log('📝 PDF já foi salvo anteriormente para esta autorização');
      return;
    }

    // 🆕 MARCAR COMO SALVANDO
    isSavingRef.current = true;

    setSalvamentoStatus({ 
      salvando: true, 
      sucesso: false, 
      erro: false, 
      mensagem: 'Salvando comprovante no sistema...',
      bloqueado: true // 🆕 BLOQUEIA A TELA 
    });

    try {
      console.log("🔄 Iniciando geração e salvamento do PDF...");

      // 1. Gerar PDF como Blob
      const pdfBlob = await gerarPDFComoBlob();
      
      // 2. Nome do arquivo
      const nomeArquivo = `comprovante-${data.nome.replace(/\s+/g, '_')}-${data.id}.png`;
      
      // 3. Upload para o backend
      console.log("📤 Enviando PDF para o servidor...");
      await autorizacoesApi.salvarComprovantePDF(data.id, pdfBlob, nomeArquivo);
      
      // 4. Marcar como salvo no localStorage (válido por 1 hora)
      localStorage.setItem(chaveSalvamento, 'true');
      hasSavedRef.current = true;

      setTimeout(() => {
        localStorage.removeItem(chaveSalvamento);
      }, 60 * 60 * 1000); // 1 hora
      
      setSalvamentoStatus({ 
        salvando: false, 
        sucesso: true, 
        erro: false, 
        mensagem: '✅ Comprovante salvo automaticamente no sistema',
        bloqueado: false // 🆕 DESBLOQUEIA A TELA
      });
      
      console.log('PDF salvo com sucesso no backend');
      
    } catch (error) {
      console.error('Erro ao salvar PDF automaticamente:', error);
      setSalvamentoStatus({ 
        salvando: false, 
        sucesso: false, 
        erro: true, 
        mensagem: '⚠️ Comprovante salvo localmente, mas não foi possível enviar para o sistema',
        bloqueado: false // 🆕 DESBLOQUEIA A TELA MESMO COM ERRO
      });
    } finally {
      // 🆕 SEMPRE LIBERAR O ESTADO DE SALVAMENTO
      isSavingRef.current = false;
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
          ${comprovanteTemplate.getExternalCSS()}
        </head>
        <body>
          ${comprovanteTemplate.generateHTML(data, qrData, false)}
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
      {/* 🆕 LOADER BLOQUEANTE - SOBREPÕE TODA A TELA */}
      {salvamentoStatus.bloqueado && (
        <Loader logoSize="large" message={salvamentoStatus.mensagem} />
      )}

      <div className="qr-code-modal">
        <div className="qr-code-header">
          <h2>Autorização Criada com Sucesso!</h2>
          {/* <button className="close-btn" onClick={onClose}>×</button> */}
          
          {/* 🆕 INDICADOR DE SALVAMENTO AUTOMÁTICO */}
          {/* {salvamentoStatus.salvando && (
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
          )} */}

          
        </div>
        
        <div className="qr-code-content">
          <div className="qr-code-info">
            <h4>{data.tipo === 'Visitante' ? 'Visitante' : 'Prestador de Serviço'}</h4>
            <p><strong>Nome:</strong> {data.nome}</p>
            
            {/* 🆕 CPF e RG na mesma linha */}
            <div className="documentos-line">
              <p><strong>CPF:</strong> {formatCPF(data.cpf)}</p>
              <p><strong>RG:</strong> {formatRG(data.rg)}</p>
            </div>
            
            <p><strong>Período:</strong> {data.periodo === 'unico' 
                ? `${formatDateToDisplay(data.dataInicio)}`
                : `${formatDateToDisplay(data.dataInicio)} até ${formatDateToDisplay(data.dataFim)}`
              }
            </p>
            {data.empresa && <p><strong>Empresa:</strong> {data.empresa}</p>}
            {data.cnpj && <p><strong>CNPJ:</strong> {formatCNPJ(data.cnpj)}</p>}

            {/* ✅ ADICIONE ESTAS LINHAS: */}
            {(data.apiLink || data.id) && (
              <div className="api-link-info">
                {/* <p><strong>ID da Autorização:</strong> {data.id}</p> */}
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