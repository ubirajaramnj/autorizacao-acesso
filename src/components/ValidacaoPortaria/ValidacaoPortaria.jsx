import React, { useState, useRef, useCallback } from 'react';
import QrReader from 'react-qr-reader';
import './ValidacaoPortaria.css';

const ValidacaoPortaria = () => {
  const [qrData, setQrData] = useState(null);
  const [etapa, setEtapa] = useState('leitura'); // leitura, validacao, finalizado
  const [documentos, setDocumentos] = useState({
    identificacao: null,
    documento: null
  });
  const [isValidando, setIsValidando] = useState(false);
  const [errorCamera, setErrorCamera] = useState(null);
  const [cameraFacing, setCameraFacing] = useState('environment');
  const fileInputRef = useRef(null);

  // Função para processar o QR Code lido
  const handleScan = useCallback((result) => {
    if (result) {
      try {
        console.log('QR Code raw:', result); // Debug
        
        const dados = JSON.parse(result);
        console.log('QR Code parsed:', dados); // Debug
        
        // 🔧 VALIDAÇÃO ROBUSTA dos dados
        if (!dados || typeof dados !== 'object') {
          throw new Error('QR Code inválido: dados não encontrados');
        }
        
        // 🔧 VERIFICAÇÃO DOS CAMPOS OBRIGATÓRIOS
        if (!dados.nome) {
          throw new Error('QR Code inválido: campo "nome" não encontrado');
        }
        
        // 🔧 GARANTIR que campos essenciais existam
        const dadosCompletos = {
          ...dados,
          cpf: dados.cpf || 'Não informado',
          rg: dados.rg || 'Não informado',
          telefone: dados.telefone || 'Não informado',
          periodo: dados.periodo || 'unico',
          dataInicio: dados.dataInicio || new Date().toISOString(),
          autorizacao: dados.autorizacao || {
            nome: 'Não informado',
            codigoDaUnidade: 'Não informado',
            dataHoraAutorizacao: new Date().toISOString()
          }
        };
        
        setQrData(dadosCompletos);
        setEtapa('validacao');
        setErrorCamera(null);
        
      } catch (error) {
        console.error('Erro ao processar QR Code:', error);
        setErrorCamera(`QR Code inválido: ${error.message}`);
      }
    }
  }, []);

  // Função para erro na câmera
  const handleError = useCallback((error) => {
    console.error('Erro na câmera:', error);
    if (error.name === 'NotAllowedError') {
      setErrorCamera('Permissão da câmera negada. Por favor, permita o acesso à câmera.');
    } else if (error.name === 'NotFoundError') {
      setErrorCamera('Nenhuma câmera encontrada no dispositivo.');
    } else if (error.name === 'NotSupportedError') {
      setErrorCamera('Navegador não suporta acesso à câmera.');
    } else if (error.name === 'NotReadableError') {
      setErrorCamera('Câmera já está em uso por outro aplicativo.');
    } else {
      setErrorCamera(`Erro na câmera: ${error.message || 'Erro desconhecido'}`);
    }
  }, []);

  // Alternar entre câmera traseira e frontal
  const alternarCamera = () => {
    setCameraFacing(prev => prev === 'environment' ? 'user' : 'environment');
  };

  // Manipular upload de arquivos
  const handleFileUpload = (tipo, event) => {
    const file = event.target.files[0];
    if (file) {
      // Validar tipo de arquivo
      const validTypes = ['image/jpeg', 'image/png', 'image/jpg', 'application/pdf'];
      if (!validTypes.includes(file.type)) {
        alert('Por favor, selecione um arquivo JPG, PNG ou PDF.');
        return;
      }

      // Validar tamanho (5MB max)
      if (file.size > 5 * 1024 * 1024) {
        alert('Arquivo muito grande. Tamanho máximo: 5MB.');
        return;
      }

      setDocumentos(prev => ({
        ...prev,
        [tipo]: file
      }));
    }
  };

  // Validar entrada
  const handleValidarEntrada = async () => {
    setIsValidando(true);
    
    try {
      // Simular upload e processamento
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Registrar a validação
      const registroValidacao = {
        ...qrData,
        validacao: {
          dataHora: new Date().toISOString(),
          documentos: {
            identificacao: documentos.identificacao?.name || 'N/A',
            documento: documentos.documento?.name || 'N/A'
          },
          funcionario: "Funcionário Portaria",
          status: "autorizado",
          ip: await getIPAddress()
        }
      };
      
      console.log('Registro de validação:', registroValidacao);
      setEtapa('finalizado');
      
    } catch (error) {
      console.error('Erro na validação:', error);
      setErrorCamera('Erro ao processar validação. Tente novamente.');
    } finally {
      setIsValidando(false);
    }
  };

  // Função para obter IP (simulação)
  const getIPAddress = async () => {
    try {
      const response = await fetch('https://api.ipify.org?format=json');
      const data = await response.json();
      return data.ip;
    } catch (error) {
      return 'IP não disponível';
    }
  };

  // Reiniciar processo
  const reiniciarProcesso = () => {
    setQrData(null);
    setEtapa('leitura');
    setDocumentos({ identificacao: null, documento: null });
    setErrorCamera(null);
  };

  return (
    <div className="validacao-portaria">
      <div className="portaria-header">
        <h1>🏢 Validação de Acesso - Portaria</h1>
        <p>Sistema de controle de visitantes e prestadores</p>
      </div>

      {etapa === 'leitura' && (
        <div className="leitura-qr">
          <div className="qr-scanner-area">
            {errorCamera ? (
              <div className="camera-error">
                <div className="error-icon">❌</div>
                <h3>Erro na Câmera</h3>
                <p>{errorCamera}</p>
                <div className="error-actions">
                  <button 
                    className="btn-tentar-novamente"
                    onClick={() => setErrorCamera(null)}
                  >
                    🔄 Tentar Novamente
                  </button>
                  <button 
                    className="btn-simular"
                    onClick={() => {
                      // Dados de exemplo para teste
                      const dadosExemplo = {
                        id: Date.now(),
                        nome: "Carlos Silva",
                        tipo: "visitante",
                        cpf: "123.456.789-00",
                        rg: "12.345.678-9",
                        periodo: "unico",
                        dataInicio: "2024-01-15",
                        dataFim: "2024-01-15",
                        autorizacao: {
                          nome: "Maria Santos",
                          telefone: "(11) 99999-9999",
                          codigoDaUnidade: "Bloco A - Ap 101",
                          dataHoraAutorizacao: "2024-01-15T10:30:00.000Z"
                        }
                      };
                      setQrData(dadosExemplo);
                      setEtapa('validacao');
                    }}
                  >
                    🧪 Continuar em Modo de Teste
                  </button>
                </div>
              </div>
            ) : (
              <>
                <div className="scanner-container">
                  <QrReader
                    delay={300}
                    onError={handleError}
                    onScan={handleScan}
                    facingMode={cameraFacing}
                    style={{
                      width: '100%',
                      height: '400px',
                      objectFit: 'cover'
                    }}
                  />
                  <div className="scanner-overlay">
                    <div className="scan-frame"></div>
                    <div className="scan-line"></div>
                  </div>
                </div>
                
                <div className="scanner-instructions">
                  <p>📱 Posicione o QR Code dentro do quadro</p>
                  <p>💡 Certifique-se de que há boa iluminação</p>
                  <p>⚡ A leitura é automática</p>
                </div>
              </>
            )}
          </div>
          
          <div className="controles-camera">
            <button 
              className="btn-alternar-camera"
              onClick={alternarCamera}
            >
              🔄 Alternar para Câmera {cameraFacing === 'environment' ? 'Frontal' : 'Traseira'}
            </button>
          </div>
        </div>
      )}

      {etapa === 'validacao' && qrData && (
        <div className="detalhes-validacao">
          <div className="dados-visitante">
            <h2>Dados do Visitante</h2>
              <div className="info-grid">
                <div className="info-item">
                  <strong>Nome:</strong>
                  <span>{qrData.nome || 'Não informado'}</span>
                </div>
                <div className="info-item">
                  <strong>Tipo:</strong>
                  <span>{qrData.tipo === 'visitante' ? 'Visitante' : 'Prestador'}</span>
                </div>
                <div className="info-item">
                  <strong>CPF:</strong>
                  <span>{qrData.cpf || 'Não informado'}</span>
                </div>
                <div className="info-item">
                  <strong>RG:</strong>
                  <span>{qrData.rg || 'Não informado'}</span>
                </div>
                <div className="info-item">
                  <strong>Telefone:</strong>
                  <span>{qrData.telefone || 'Não informado'}</span>
                </div>
                <div className="info-item">
                  <strong>Período:</strong>
                  <span>
                    {qrData.periodo === 'unico' 
                      ? `Dia único: ${new Date(qrData.dataInicio).toLocaleDateString('pt-BR')}`
                      : `De ${new Date(qrData.dataInicio).toLocaleDateString('pt-BR')} até ${new Date(qrData.dataFim).toLocaleDateString('pt-BR')}`
                    }
                  </span>
                </div>
                {qrData.empresa && (
                  <div className="info-item">
                    <strong>Empresa:</strong>
                    <span>{qrData.empresa}</span>
                  </div>
                )}
              </div>
          </div>

          <div className="dados-autorizacao">
            <h2>Autorização</h2>
            <div className="info-grid">
              <div className="info-item">
                <strong>Autorizado por:</strong>
                <span>{qrData.autorizacao?.nome || 'Não informado'}</span>
              </div>
              <div className="info-item">
                <strong>Unidade:</strong>
                <span>{qrData.autorizacao?.codigoDaUnidade || 'Não informado'}</span>
              </div>
              <div className="info-item">
                <strong>Data/Hora Autorização:</strong>
                <span>
                  {qrData.autorizacao?.dataHoraAutorizacao 
                    ? new Date(qrData.autorizacao.dataHoraAutorizacao).toLocaleString('pt-BR')
                    : 'Não informado'
                  }
                </span>
              </div>
            </div>
          </div>

          <div className="upload-documentos">
            <h2>Documentação Apresentada</h2>
            
            <div className="upload-area">
              <div className="upload-item">
                <label>📷 Foto do Rosto / Identificação</label>
                <input
                  type="file"
                  accept="image/*,.pdf"
                  onChange={(e) => handleFileUpload('identificacao', e)}
                  ref={fileInputRef}
                />
                {documentos.identificacao && (
                  <span className="file-name">✅ {documentos.identificacao.name}</span>
                )}
              </div>

              <div className="upload-item">
                <label>📄 Documento de Identidade</label>
                <input
                  type="file"
                  accept="image/*,.pdf"
                  onChange={(e) => handleFileUpload('documento', e)}
                />
                {documentos.documento && (
                  <span className="file-name">✅ {documentos.documento.name}</span>
                )}
              </div>
            </div>

            <div className="validacao-actions">
              <button 
                className="btn-autorizar"
                onClick={handleValidarEntrada}
                disabled={!documentos.identificacao || !documentos.documento || isValidando}
              >
                {isValidando ? '🔄 Validando...' : '✅ Autorizar Entrada'}
              </button>
              
              <button 
                className="btn-rejeitar"
                onClick={reiniciarProcesso}
              >
                ❌ Rejeitar
              </button>
            </div>
          </div>
        </div>
      )}

      {etapa === 'finalizado' && (
        <div className="resultado-validacao">
          <div className="sucesso-message">
            <div className="icon">✅</div>
            <h2>Entrada Autorizada com Sucesso!</h2>
            <p>Visitante: <strong>{qrData.nome}</strong></p>
            <p>Data/Hora: <strong>{new Date().toLocaleString('pt-BR')}</strong></p>
            <p>Documentação registrada para auditoria.</p>
          </div>
          
          <button 
            className="btn-nova-validacao"
            onClick={reiniciarProcesso}
          >
            🔄 Nova Validação
          </button>
        </div>
      )}
    </div>
  );
};

export default ValidacaoPortaria;