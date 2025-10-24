// src/components/PortariaLeitorQR/PortariaLeitorQR.jsx
import React, { useState, useRef, useCallback } from "react";
import { Scanner } from "@yudiel/react-qr-scanner";
import { autorizacoesApi } from "../../services/autorizacoesApi";
import DocumentUpload from "../DocumentUpload/DocumentUpload";
import Loader from '../Loader/Loader';
import "./PortariaLeitorQR.css";
import { formatDateToDisplay } from '../../utils/dateFormat';

// 🆕 COMPONENTE DE MODAL DE CONFIRMAÇÃO
const ModalConfirmacao = ({ nome, tipo, onConfirm }) => {
  return (
    <div className="modal-overlay">
      <div className="modal-confirmacao">
        <div className="modal-header">
          <div className="modal-icon">✅</div>
          <h3>Entrada Liberada!</h3>
        </div>
        
        <div className="modal-body">
          <p>
            <strong>{nome}</strong> ({tipo === 'Visitante' ? 'Visitante' : 'Prestador de Serviço'})
          </p>
          <p>Teve a entrada autorizada e registrada no sistema.</p>
          <div className="modal-details">
            <span>📅 {new Date().toLocaleDateString('pt-BR')}</span>
            <span>⏰ {new Date().toLocaleTimeString('pt-BR', { 
              hour: '2-digit', 
              minute: '2-digit' 
            })}</span>
          </div>
        </div>
        
        <div className="modal-footer">
          <button 
            onClick={onConfirm}
            className="modal-confirm-btn"
          >
            OK
          </button>
        </div>
      </div>
    </div>
  );
};



const PortariaLeitorQR = () => {
  const [scanning, setScanning] = useState(false);
  const [autorizacao, setAutorizacao] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [entradaRegistrada, setEntradaRegistrada] = useState(false);
  const [manualInput, setManualInput] = useState("");
  const [documentosUploaded, setDocumentosUploaded] = useState([]);

  // 🆕 NOVO ESTADO PARA O MODAL
  const [showModalConfirmacao, setShowModalConfirmacao] = useState(false);

  const qrReaderRef = useRef(null);

  // 🆕 FUNÇÃO DEBUG - adicione esta função
  const debugEstado = () => {
    console.log('=== DEBUG ESTADO ===');
    console.log('autorizacao:', autorizacao);
    console.log('documentosUploaded:', documentosUploaded);
    console.log('Quantidade de documentos:', documentosUploaded.length);
    console.log('Botão habilitado?', documentosUploaded.length > 0);
    console.log('====================');
  };

  const extractIdFromLink = (link) => {
    // ✅ CORREÇÃO: Regex para capturar UUIDs (letras, números e hífens)
    const match = link.match(/\/([a-fA-F0-9-]+)$/);
    return match ? match[1] : link; // Se não for link, assume que já é o ID
  };

  const buscarDadosAutorizacao = async (id) => {
    setLoading(true);
    setError("");
    setSuccess("");
    setEntradaRegistrada(false);
    setDocumentosUploaded([]);

    try {
      const qrCodeRawValue = id[0].rawValue;

      console.log("Id lido do QR:", qrCodeRawValue);
      const cleanId = extractIdFromLink(qrCodeRawValue);
      console.log("Id tratado:", cleanId);
      const response = await autorizacoesApi.buscarAutorizacaoPorId(cleanId);

      console.log("Response do Bd:", response);

      setAutorizacao(response.data);
      setSuccess("Autorização encontrada! Verifique os dados abaixo.");
    } catch (err) {
      console.error("Erro ao recuperar autorização:", err);
      setError("Autorização não encontrada ou inválida");
      setAutorizacao(null);
    } finally {
      setLoading(false);
    }
  };

  const handleScan = useCallback(
    (result) => {
      if (result && !loading && !autorizacao) {
        setScanning(false);
        console.error("QR lido:", result);
        buscarDadosAutorizacao(result);
      }
    },
    [loading, autorizacao]
  );

  const handleError = (err) => {
    console.error("Erro no leitor QR:", err);
  };

  // 🆕 ATUALIZADA: Função para lidar com upload de documentos
  const handleDocumentUpload = (fileInfo) => {
    setLoading(true);
    console.log('📄 Documento recebido no handleDocumentUpload:', fileInfo);
    
    // 🆕 CORREÇÃO: Usar função de atualização de estado correta
    setDocumentosUploaded(prev => {
      const novosDocumentos = [...prev, fileInfo];
      console.log('📋 Nova lista de documentos:', novosDocumentos);
      setLoading(false);
      return novosDocumentos;
    });
    
    setSuccess('Documento enviado com sucesso!');
    
    // 🆕 Chamar debug para verificar estado
    setTimeout(debugEstado, 100);
  };

  // 🆕 ATUALIZADA: Função para remover documento
  const handleRemoveDocument = (fileId) => {
    console.log('🗑️ Removendo documento ID:', fileId);
    
    setDocumentosUploaded(prev => {
      const novosDocumentos = prev.filter(doc => doc.id !== fileId);
      console.log('📋 Lista após remoção:', novosDocumentos);
      return novosDocumentos;
    });
    
    setSuccess('Documento removido!');
    setTimeout(debugEstado, 100);
  };

  const registrarEntradaVisitante = async () => {
    console.log('Iniciando registro de entrada.');
    if (!autorizacao) return;

    console.log('Autorizaçao OK.');

    console.log(documentosUploaded);
    if (documentosUploaded.length === 0) {
      setError('⚠️ É necessário enviar pelo menos um documento de identificação');
      return;
    }

    setLoading(true);
    try {
      // 🆕 Payload atualizado com informações dos documentos
      const checkIn = {
        autorizacaoId: autorizacao.id,
        portariaResponsavel: 'Funcionário Portaria', // Em produção, pegar do login
        documentoId: documentosUploaded[0].documentoId
      };

      console.log('📤 Enviando dados de entrada:', checkIn);
      const response = await autorizacoesApi.registrarEntrada(checkIn);
      console.log('✅ Resposta do backend:', response);

      setEntradaRegistrada(true);
      setSuccess("✅ Entrada registrada com sucesso!");
      
      // 🆕 MOSTRAR MODAL DE CONFIRMAÇÃO
      setShowModalConfirmacao(true);
    } catch (err) {
      setError("Erro ao registrar entrada");
    } finally {
      setLoading(false);
    }
  };

  // 🆕 FUNÇÃO PARA CONFIRMAR MODAL E VOLTAR AO INÍCIO
  const handleConfirmarModal = () => {
    setShowModalConfirmacao(false);
    resetarProcesso();
  };

  const handleManualSubmit = (e) => {
    e.preventDefault();
    if (manualInput.trim()) {
      buscarDadosAutorizacao(manualInput.trim());
    }
  };

  const resetarProcesso = () => {
    setAutorizacao(null);
    setError("");
    setSuccess("");
    setEntradaRegistrada(false);
    setManualInput("");
    setScanning(false);
    setDocumentosUploaded([]);
    setShowModalConfirmacao(false);
  };

  const formatarDocumento = (doc) => {
    if (!doc) return "N/A";
    // Aplica formatação básica para CPF/RG
    if (doc.length === 11) {
      return doc.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, "$1.$2.$3-$4");
    }
    return doc;
  };

  return (
    <div className="portaria-leitor">
      {/* 🆕 MODAL DE CONFIRMAÇÃO */}
      {showModalConfirmacao && autorizacao && (
        <ModalConfirmacao 
          nome={autorizacao.nome}
          tipo={autorizacao.tipo}
          onConfirm={handleConfirmarModal}
        />
      )}

      {/* 🆕 BOTÃO DEBUG - adicione temporariamente */}
      {/* {autorizacao && (
        <button 
          onClick={debugEstado}
          style={{
            position: 'fixed',
            top: '10px',
            right: '10px',
            background: '#ffc107',
            color: '#000',
            border: 'none',
            padding: '5px 10px',
            borderRadius: '5px',
            fontSize: '12px',
            zIndex: 1000
          }}
        >
          🐛 Debug
        </button>
      )} */}
      
      {loading && <Loader logoSize="large" message="Realizando cadastro..." />}

      <header className="portaria-header">
        <h1>🏢 Sistema de Portaria</h1>
        <p>Leia o QR Code ou digite o ID manualmente</p>
      </header>

      {/* Controles Principais */}
      <div className="controles-portaria">
        {!autorizacao && (
          <>
            <div className="qr-section">
              <button
                className={`scan-btn ${scanning ? "scanning" : ""}`}
                onClick={() => setScanning(!scanning)}
              >
                {scanning ? "🛑 Parar Leitura" : "📷 Ler QR Code"}
              </button>

              {scanning && (
                <div className="qr-reader-container">
                  {/* 🆕 COMPONENTE ATUALIZADO */}
                  <Scanner
                    onScan={handleScan}
                    onError={handleError}
                    constraints={{
                      facingMode: "environment",
                      aspectRatio: 1,
                    }}
                    scanDelay={300}
                    className="qr-scanner"
                  />
                  <div className="scan-overlay">
                    <div className="scan-frame"></div>
                    <p>Posicione o QR Code dentro do quadro</p>
                  </div>
                </div>
              )}
            </div>

            <div className="manual-input-section">
              <form onSubmit={handleManualSubmit}>
                <input
                  type="text"
                  value={manualInput}
                  onChange={(e) => setManualInput(e.target.value)}
                  placeholder="Digite o ID ou link da autorização"
                  className="manual-input"
                />
                <button type="submit" className="search-btn">
                  🔍 Buscar
                </button>
              </form>
            </div>
          </>
        )}

        {/* Botão Nova Leitura - SÓ MOSTRA SE TIVER AUTORIZAÇÃO E NÃO ESTIVER NO MODAL */}
        {autorizacao && !showModalConfirmacao && (
          <div className="controles-portaria">
            <button onClick={resetarProcesso} className="new-scan-btn">
              🔄 Nova Leitura
            </button>
          </div>
        )}

      </div>

      {/* Mensagens de Status */}
      {loading && (
        <div className="status-message loading">
          <div className="spinner"></div>
          Processando...
        </div>
      )}

      {/* Mensagens de Status */}
      {error && !showModalConfirmacao && (
        <div className="status-message error">❌ {error}</div>
      )}

      {success && !showModalConfirmacao && (
        <div className="status-message success">{success}</div>
      )}

      {/* Dados da Autorização */}
      {autorizacao && !showModalConfirmacao && (
        <div className="autorizacao-details">
          <h2>📋 Dados da Autorização</h2>

          <div className="dados-grid">
            <div className="dado-item">
              <strong>Nome:</strong> {autorizacao.nome}
            </div>
            <div className="dado-item">
              <strong>Tipo:</strong>{" "}
              {autorizacao.tipo === "Visitante"
                ? "Visitante"
                : "Prestador de Serviço"}
            </div>
            <div className="dado-item">
              <strong>CPF:</strong> {formatarDocumento(autorizacao.cpf)}
            </div>
            <div className="dado-item">
              <strong>RG:</strong> {formatarDocumento(autorizacao.rg)}
            </div>
            <div className="dado-item">
              <p><strong>Período:</strong> {autorizacao.periodo === 'unico' 
                  ? `Dia único: ${formatDateToDisplay(autorizacao.dataInicio)}`
                  : `De ${formatDateToDisplay(autorizacao.dataInicio)} até ${formatDateToDisplay(autorizacao.dataFim)}`
                }
              </p>
            </div>
            {autorizacao.empresa && (
              <div className="dado-item">
                <strong>Empresa:</strong> {autorizacao.empresa}
              </div>
            )}
            <div className="dado-item">
              <strong>Status:</strong>
              <span className={`status-badge ${autorizacao.status}`}>
                {autorizacao.status === "autorizado"
                  ? "✅ Autorizado"
                  : "⏳ Pendente"}
              </span>
            </div>
          </div>

          {/* Upload de Documento - CORRIGIDO */}
          <DocumentUpload 
            autorizacaoId={autorizacao.id}
            onUploadSuccess={handleDocumentUpload} // 🆕 Agora usando a função correta
            onUploadError={(errorMsg) => {
              setError(`Erro no upload: ${errorMsg}`);
            }}
            onRemoveDocument={handleRemoveDocument} // 🆕 E esta também se precisar
          />

          {/* 🆕 Lista de Documentos Enviados */}
          {documentosUploaded.length > 0 && (
            <div className="documentos-enviados">
              <h3>📄 Documentos Enviados:</h3>
              <div className="documentos-lista">
                {documentosUploaded.map((doc, index) => (
                  <div key={doc.id || index} className="documento-item">
                    <div className="documento-info">
                      <span className="documento-nome">{doc.name}</span>
                      <span className="documento-tamanho">
                        ({(doc.size / 1024 / 1024).toFixed(2)} MB)
                      </span>
                    </div>
                    <div className="documento-acoes">
                      <a 
                        href={doc.url} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="visualizar-btn"
                      >
                        👁️ Visualizar
                      </a>
                    </div>
                  </div>
                ))}
              </div>
              <p className="documentos-count">
                {documentosUploaded.length} documento(s) pronto(s) para registro
              </p>
            </div>
          )}

          {/* 🆕 Botão de Registrar Entrada - ATUALIZADO */}
          {!entradaRegistrada && (
            <div className="entrada-actions">
              <button 
                onClick={registrarEntradaVisitante}
                disabled={loading || documentosUploaded.length === 0} // 🆕 Desabilita se não houver documentos
                className={`entrada-btn ${documentosUploaded.length === 0 ? 'disabled' : ''}`}
                style={{
                  // 🆕 Debug visual temporário
                  border: documentosUploaded.length === 0 ? '2px solid red' : '2px solid green'
                }}
              >
                {loading ? (
                  <>⏳ Registrando...</>
                ) : (
                  <>
                    ✅ Registrar Entrada 
                    {documentosUploaded.length > 0 && ` (${documentosUploaded.length} doc)`}
                  </>
                )}
              </button>
              
              {/* 🆕 Mensagem de debug */}
              {documentosUploaded.length === 0 && (
                <p className="entrada-info">
                  ⚠️ Envie pelo menos um documento de identificação para registrar a entrada
                  <br />
                  <small style={{color: 'red'}}>
                    Debug: documentosUploaded.length = {documentosUploaded.length}
                  </small>
                </p>
              )}
            </div>
          )}

          {entradaRegistrada && !showModalConfirmacao && (
            <div className="entrada-registrada">
              <h3>🎉 Entrada Registrada com Sucesso!</h3>
              <p>Hora da entrada: {new Date().toLocaleString("pt-BR")}</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default PortariaLeitorQR;
