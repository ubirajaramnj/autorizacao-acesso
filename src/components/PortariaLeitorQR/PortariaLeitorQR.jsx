// src/components/PortariaLeitorQR/PortariaLeitorQR.jsx
import React, { useState, useRef, useCallback } from 'react';
import { Scanner } from '@yudiel/react-qr-scanner';
import { buscarAutorizacaoPorId, registrarEntrada, uploadDocumento } from '../../services/api';
import DocumentUpload from '../DocumentUpload/DocumentUpload';
import './PortariaLeitorQR.css';

const PortariaLeitorQR = () => {
  const [scanning, setScanning] = useState(false);
  const [autorizacao, setAutorizacao] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [entradaRegistrada, setEntradaRegistrada] = useState(false);
  const [manualInput, setManualInput] = useState('');

  const qrReaderRef = useRef(null);

    const extractIdFromLink = (link) => {
        // ✅ CORREÇÃO: Regex para capturar UUIDs (letras, números e hífens)
        const match = link.match(/\/([a-fA-F0-9-]+)$/);
        return match ? match[1] : link; // Se não for link, assume que já é o ID
    };

  const buscarDadosAutorizacao = async (id) => {
    setLoading(true);
    setError('');
    setSuccess('');
    setEntradaRegistrada(false);

    try {
        const qrCodeRawValue = id[0].rawValue;

        console.log('Id lido do QR:', qrCodeRawValue);
        const cleanId = extractIdFromLink(qrCodeRawValue);
      console.log('Id tratado:', cleanId);
      const response = await buscarAutorizacaoPorId(cleanId);
      
      console.log('Response do Bd:', response);
      
      setAutorizacao(response.data);
      setSuccess('Autorização encontrada! Verifique os dados abaixo.');
    } catch (err) {
      console.error('Erro ao recuperar autorização:', err);
      setError('Autorização não encontrada ou inválida');
      setAutorizacao(null);
    } finally {
      setLoading(false);
    }
  };

  const handleScan = useCallback((result) => {
    if (result && !loading && !autorizacao) {
      setScanning(false);
      console.error('QR lido:', result);
      buscarDadosAutorizacao(result);
    }
  }, [loading, autorizacao]);

  const handleError = (err) => {
    console.error('Erro no leitor QR:', err);
  };

  const registrarEntradaVisitante = async () => {
    if (!autorizacao) return;

    setLoading(true);
    try {
      const dadosEntrada = {
        autorizacaoId: autorizacao.id,
        nome: autorizacao.nome,
        tipo: autorizacao.tipo,
        cpf: autorizacao.cpf,
        rg: autorizacao.rg,
        empresa: autorizacao.empresa,
        periodo: autorizacao.periodo,
        dataInicio: autorizacao.dataInicio,
        dataFim: autorizacao.dataFim,
        portariaResponsavel: 'Funcionário Portaria' // Em produção, pegar do login
      };

      await registrarEntrada(dadosEntrada);
      setEntradaRegistrada(true);
      setSuccess('✅ Entrada registrada com sucesso!');
    } catch (err) {
      setError('Erro ao registrar entrada');
    } finally {
      setLoading(false);
    }
  };

  const handleManualSubmit = (e) => {
    e.preventDefault();
    if (manualInput.trim()) {
      buscarDadosAutorizacao(manualInput.trim());
    }
  };

  const resetarProcesso = () => {
    setAutorizacao(null);
    setError('');
    setSuccess('');
    setEntradaRegistrada(false);
    setManualInput('');
    setScanning(false);
  };

  const formatarData = (dataString) => {
    return new Date(dataString).toLocaleDateString('pt-BR');
  };

  const formatarDocumento = (doc) => {
    if (!doc) return 'N/A';
    // Aplica formatação básica para CPF/RG
    if (doc.length === 11) {
      return doc.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4');
    }
    return doc;
  };

  return (
    <div className="portaria-leitor">
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
                className={`scan-btn ${scanning ? 'scanning' : ''}`}
                onClick={() => setScanning(!scanning)}
              >
                {scanning ? '🛑 Parar Leitura' : '📷 Ler QR Code'}
              </button>

              {scanning && (
                <div className="qr-reader-container">
                  {/* 🆕 COMPONENTE ATUALIZADO */}
                    <Scanner
                        onScan={handleScan}
                        onError={handleError}
                        constraints={{ 
                        facingMode: 'environment',
                        aspectRatio: 1 
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

        {autorizacao && (
          <button onClick={resetarProcesso} className="new-scan-btn">
            🔄 Nova Leitura
          </button>
        )}
      </div>

      {/* Mensagens de Status */}
      {loading && (
        <div className="status-message loading">
          <div className="spinner"></div>
          Processando...
        </div>
      )}

      {error && (
        <div className="status-message error">
          ❌ {error}
        </div>
      )}

      {success && (
        <div className="status-message success">
          {success}
        </div>
      )}

      {/* Dados da Autorização */}
      {autorizacao && (
        <div className="autorizacao-details">
          <h2>📋 Dados da Autorização</h2>
          
          <div className="dados-grid">
            <div className="dado-item">
              <strong>Nome:</strong> {autorizacao.nome}
            </div>
            <div className="dado-item">
              <strong>Tipo:</strong> {autorizacao.tipo === 'visitante' ? 'Visitante' : 'Prestador de Serviço'}
            </div>
            <div className="dado-item">
              <strong>CPF:</strong> {formatarDocumento(autorizacao.cpf)}
            </div>
            <div className="dado-item">
              <strong>RG:</strong> {formatarDocumento(autorizacao.rg)}
            </div>
            <div className="dado-item">
              <strong>Período:</strong> {autorizacao.periodo === 'unico' 
                ? `Dia único: ${formatarData(autorizacao.dataInicio)}`
                : `De ${formatarData(autorizacao.dataInicio)} até ${formatarData(autorizacao.dataFim)}`
              }
            </div>
            {autorizacao.empresa && (
              <div className="dado-item">
                <strong>Empresa:</strong> {autorizacao.empresa}
              </div>
            )}
            <div className="dado-item">
              <strong>Status:</strong> 
              <span className={`status-badge ${autorizacao.status}`}>
                {autorizacao.status === 'autorizado' ? '✅ Autorizado' : '⏳ Pendente'}
              </span>
            </div>
          </div>

          {/* Upload de Documento */}
          <DocumentUpload 
            autorizacaoId={autorizacao.id}
            onUploadSuccess={(fileInfo) => {
              console.log('Documento enviado:', fileInfo);
              setSuccess('Documento enviado com sucesso!');
            }}
            onUploadError={(errorMsg) => {
              setError(`Erro no upload: ${errorMsg}`);
            }}
          />

          {/* Botão de Registrar Entrada */}
          {!entradaRegistrada && (
            <div className="entrada-actions">
              <button 
                onClick={registrarEntradaVisitante}
                disabled={loading}
                className="entrada-btn"
              >
                {loading ? 'Registrando...' : '✅ Registrar Entrada'}
              </button>
            </div>
          )}

          {entradaRegistrada && (
            <div className="entrada-registrada">
              <h3>🎉 Entrada Registrada com Sucesso!</h3>
              <p>Hora da entrada: {new Date().toLocaleString('pt-BR')}</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default PortariaLeitorQR;