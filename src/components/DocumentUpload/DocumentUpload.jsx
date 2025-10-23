// src/components/DocumentUpload/DocumentUpload.jsx
import React, { useState } from 'react';
import { autorizacoesApi } from "../../services/autorizacoesApi";
import './DocumentUpload.css';

const DocumentUpload = ({ autorizacaoId, onUploadSuccess, onUploadError, onRemoveDocument }) => {
  const [uploading, setUploading] = useState(false);
  const [uploadedFiles, setUploadedFiles] = useState([]);

  const handleFileChange = async (event) => {
    const files = Array.from(event.target.files);
    
    if (files.length === 0) return;

    setUploading(true);

    try {
      for (const file of files) {
        // Validar tipo de arquivo
        if (!file.type.startsWith('image/') && file.type !== 'application/pdf') {
          throw new Error('Apenas imagens e PDFs são permitidos');
        }

        // Validar tamanho (max 5MB)
        if (file.size > 5 * 1024 * 1024) {
          throw new Error('Arquivo muito grande. Máximo 5MB');
        }

        console.log('📤 Iniciando upload real do arquivo:', file.name);
        // 🆕 UPLOAD REAL PARA O BACKEND
        const uploadResponse = await autorizacoesApi.uploadDocumento(file, autorizacaoId);
        console.log('✅ Upload realizado com sucesso:', uploadResponse);

        // 🆕 CORREÇÃO: Criar fileInfo com ID único
        const fileInfo = {
          id: uploadResponse.data.id || Date.now(),
          name: file.name,
          type: file.type,
          size: file.size,
          url: uploadResponse.data.link, // 🆕 URL REAL do servidor
          uploadDate: new Date().toISOString(),
          // 🆕 Dados adicionais do backend
          documentoId: uploadResponse.data.documentoId,
          path: uploadResponse.data.link
        };

        setUploadedFiles(prev => [...prev, fileInfo]);
        
        // 🆕 CORREÇÃO: Chamar onUploadSuccess com fileInfo
        if (onUploadSuccess) {
          onUploadSuccess(fileInfo);
        }
      }
    } catch (error) {
      console.error('❌ Erro no upload real:', error);
      if (onUploadError) {
        onUploadError(error.message);
      }
    } finally {
      setUploading(false);
    }
  };

   const removeFile = async (fileId) => {
    // 🆕 Opcional: Chamar API para remover arquivo do backend
    try {
      // await autorizacoesApi.removerDocumento(fileId);
    } catch (error) {
      console.error('Erro ao remover documento:', error);
    }
    
    setUploadedFiles(prev => prev.filter(file => file.id !== fileId));
    if (onRemoveDocument) {
      onRemoveDocument(fileId);
    }
  };

  return (
    <div className="document-upload">
      <h4>📄 Upload de Documento</h4>
      
      <div className="upload-area">
        <input
          type="file"
          id="document-upload"
          multiple
          accept="image/*,.pdf"
          onChange={handleFileChange}
          disabled={uploading}
          style={{ display: 'none' }}
        />
        <label 
          htmlFor="document-upload" 
          className={`upload-label ${uploading ? 'uploading' : ''}`}
        >
          {uploading ? (
            <div className="uploading-spinner">
              <div className="spinner"></div>
              <span>Enviando...</span>
            </div>
          ) : (
            <>
              <div className="upload-icon">📤</div>
              <span>Clique para selecionar documentos</span>
              <small>Formatos: JPG, PNG, PDF (Máx. 5MB)</small>
            </>
          )}
        </label>
      </div>

      {uploadedFiles.length > 0 && (
        <div className="uploaded-files">
          <h5>Documentos Enviados:</h5>
          {uploadedFiles.map(file => (
            <div key={file.id} className="uploaded-file">
              <div className="file-info">
                <span className="file-name">{file.name}</span>
                <span className="file-size">({(file.size / 1024 / 1024).toFixed(2)} MB)</span>
                <span className="file-status">✅ Enviado</span>
              </div>
              <div className="file-actions">
                <a 
                  href={file.url} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="view-btn"
                >
                  👁️ Visualizar
                </a>
                <button 
                  onClick={() => removeFile(file.id)}
                  className="remove-btn"
                >
                  🗑️ Remover
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default DocumentUpload;