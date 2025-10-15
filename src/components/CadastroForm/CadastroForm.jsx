import React, { useState } from 'react';
import InputMask from 'react-input-mask';
import { cadastrarVisitante } from '../../services/api';
import { 
  maskTelefone, 
  maskCNPJ, 
  applyDocumentMask, 
  removeMask,
  detectDocumentType 
} from '../../utils/masks';
import QRCodeDisplay from '../QRCodeDisplay/QRCodeDisplay';
import './CadastroForm.css';

const CadastroForm = () => {
  const [formData, setFormData] = useState({
    tipo: 'visitante',
    nome: '',
    email: '',
    telefone: '',
    documento: '',
    empresa: '',
    cnpj: '',
    periodo: 'unico',
    dataInicio: '',
    dataFim: ''
  });

  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState('');
  const [qrCodeData, setQrCodeData] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    
    let formattedValue = value;
    
    // Aplicar máscaras
    if (name === 'telefone') {
      formattedValue = maskTelefone(value);
    } else if (name === 'cnpj') {
      formattedValue = maskCNPJ(value);
    } else if (name === 'documento') {
      formattedValue = applyDocumentMask(value);
    }
    
    setFormData(prev => ({
      ...prev,
      [name]: formattedValue
    }));
    
    // Limpar erro do campo quando usuário começar a digitar
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    // Validações básicas
    if (!formData.nome.trim()) newErrors.nome = 'Nome é obrigatório';
    
    if (!formData.email.trim()) {
      newErrors.email = 'Email é obrigatório';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email inválido';
    }
    
    const cleanTelefone = removeMask(formData.telefone);
    if (!cleanTelefone) {
      newErrors.telefone = 'Telefone é obrigatório';
    } else if (cleanTelefone.length < 10) {
      newErrors.telefone = 'Telefone inválido';
    }
    
    const cleanDocumento = removeMask(formData.documento);
    if (!cleanDocumento) {
      newErrors.documento = 'Documento é obrigatório';
    } else {
      const documentType = detectDocumentType(formData.documento);
      if (documentType === 'CPF' && cleanDocumento.length !== 11) {
        newErrors.documento = 'CPF deve ter 11 dígitos';
      } else if (documentType === 'RG' && cleanDocumento.length < 5) {
        newErrors.documento = 'RG deve ter pelo menos 5 dígitos';
      }
    }

    // Validações específicas para prestador de serviço
    if (formData.tipo === 'prestador' && !formData.empresa.trim()) {
      newErrors.empresa = 'Nome da empresa é obrigatório para prestadores';
    }

    // Validação de CNPJ (se preenchido)
    const cleanCnpj = removeMask(formData.cnpj);
    if (cleanCnpj && cleanCnpj.length !== 14) {
      newErrors.cnpj = 'CNPJ deve ter 14 dígitos';
    }

    // Validações de datas
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    if (formData.periodo === 'unico') {
      if (!formData.dataInicio) {
        newErrors.dataInicio = 'Data é obrigatória';
      } else if (new Date(formData.dataInicio) < today) {
        newErrors.dataInicio = 'Data não pode ser no passado';
      }
    } else {
      if (!formData.dataInicio) {
        newErrors.dataInicio = 'Data de início é obrigatória';
      } else if (new Date(formData.dataInicio) < today) {
        newErrors.dataInicio = 'Data de início não pode ser no passado';
      }
      
      if (!formData.dataFim) {
        newErrors.dataFim = 'Data de fim é obrigatória';
      } else if (formData.dataInicio && new Date(formData.dataFim) < new Date(formData.dataInicio)) {
        newErrors.dataFim = 'Data de fim deve ser maior que data de início';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage('');
    setQrCodeData(null);

    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);

    try {
      // Preparar dados para envio (remover máscaras)
      const dadosEnvio = {
        ...formData,
        telefone: removeMask(formData.telefone),
        documento: removeMask(formData.documento),
        cnpj: removeMask(formData.cnpj),
        // Para período único, usar a mesma data para início e fim
        dataFim: formData.periodo === 'unico' ? formData.dataInicio : formData.dataFim
      };

      const response = await cadastrarVisitante(dadosEnvio);
      
      setQrCodeData(response.data);
      setMessage('Cadastro realizado com sucesso!');
      
      // Limpar formulário após sucesso (mas manter o QR Code aberto)
      setFormData({
        tipo: 'visitante',
        nome: '',
        email: '',
        telefone: '',
        documento: '',
        empresa: '',
        cnpj: '',
        periodo: 'unico',
        dataInicio: '',
        dataFim: ''
      });
      
    } catch (error) {
      setMessage('Erro ao realizar cadastro. Tente novamente.');
      console.error('Erro no cadastro:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const closeQRCode = () => {
    setQrCodeData(null);
  };

  return (
    <div className="cadastro-form">
      <form onSubmit={handleSubmit}>
        {/* Tipo de Cadastro */}
        <div className="form-group">
          <label>Tipo de Cadastro *</label>
          <div className="radio-group">
            <label>
              <input
                type="radio"
                name="tipo"
                value="visitante"
                checked={formData.tipo === 'visitante'}
                onChange={handleChange}
              />
              Visitante
            </label>
            <label>
              <input
                type="radio"
                name="tipo"
                value="prestador"
                checked={formData.tipo === 'prestador'}
                onChange={handleChange}
              />
              Prestador de Serviço
            </label>
          </div>
        </div>

        {/* Dados Pessoais */}
        <div className="form-group">
          <label htmlFor="nome">Nome Completo *</label>
          <input
            type="text"
            id="nome"
            name="nome"
            value={formData.nome}
            onChange={handleChange}
            className={errors.nome ? 'error' : ''}
            placeholder="Digite seu nome completo"
          />
          {errors.nome && <span className="error-message">{errors.nome}</span>}
        </div>

        <div className="form-group">
          <label htmlFor="email">Email *</label>
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            className={errors.email ? 'error' : ''}
            placeholder="seu@email.com"
          />
          {errors.email && <span className="error-message">{errors.email}</span>}
        </div>

        <div className="form-group">
          <label htmlFor="telefone">Telefone *</label>
          <InputMask
            mask="(99) 99999-9999"
            value={formData.telefone}
            onChange={handleChange}
          >
            {(inputProps) => (
              <input
                {...inputProps}
                type="tel"
                id="telefone"
                name="telefone"
                className={errors.telefone ? 'error' : ''}
                placeholder="(11) 99999-9999"
              />
            )}
          </InputMask>
          {errors.telefone && <span className="error-message">{errors.telefone}</span>}
        </div>

        <div className="form-group">
          <label htmlFor="documento">CPF ou RG *</label>
          <input
            type="text"
            id="documento"
            name="documento"
            value={formData.documento}
            onChange={handleChange}
            className={errors.documento ? 'error' : ''}
            placeholder="000.000.000-00 ou 00.000.000-0"
            maxLength={18}
          />
          {errors.documento && <span className="error-message">{errors.documento}</span>}
        </div>

        {/* Campos específicos para Prestador */}
        {formData.tipo === 'prestador' && (
          <>
            <div className="form-group">
              <label htmlFor="empresa">Nome da Empresa *</label>
              <input
                type="text"
                id="empresa"
                name="empresa"
                value={formData.empresa}
                onChange={handleChange}
                className={errors.empresa ? 'error' : ''}
                placeholder="Nome da empresa"
              />
              {errors.empresa && <span className="error-message">{errors.empresa}</span>}
            </div>

            <div className="form-group">
              <label htmlFor="cnpj">CNPJ (Opcional)</label>
              <InputMask
                mask="99.999.999/9999-99"
                value={formData.cnpj}
                onChange={handleChange}
              >
                {(inputProps) => (
                  <input
                    {...inputProps}
                    type="text"
                    id="cnpj"
                    name="cnpj"
                    className={errors.cnpj ? 'error' : ''}
                    placeholder="00.000.000/0000-00"
                  />
                )}
              </InputMask>
              {errors.cnpj && <span className="error-message">{errors.cnpj}</span>}
            </div>
          </>
        )}

        {/* Período */}
        <div className="form-group">
          <label>Período *</label>
          <div className="radio-group">
            <label>
              <input
                type="radio"
                name="periodo"
                value="unico"
                checked={formData.periodo === 'unico'}
                onChange={handleChange}
              />
              Dia Único
            </label>
            <label>
              <input
                type="radio"
                name="periodo"
                value="intervalo"
                checked={formData.periodo === 'intervalo'}
                onChange={handleChange}
              />
              Período
            </label>
          </div>
        </div>

        {/* Datas */}
        <div className="form-row">
          <div className="form-group">
            <label htmlFor="dataInicio">
              {formData.periodo === 'unico' ? 'Data *' : 'Data Início *'}
            </label>
            <input
              type="date"
              id="dataInicio"
              name="dataInicio"
              value={formData.dataInicio}
              onChange={handleChange}
              className={errors.dataInicio ? 'error' : ''}
              min={new Date().toISOString().split('T')[0]}
            />
            {errors.dataInicio && <span className="error-message">{errors.dataInicio}</span>}
          </div>

          {formData.periodo === 'intervalo' && (
            <div className="form-group">
              <label htmlFor="dataFim">Data Fim *</label>
              <input
                type="date"
                id="dataFim"
                name="dataFim"
                value={formData.dataFim}
                onChange={handleChange}
                className={errors.dataFim ? 'error' : ''}
                min={formData.dataInicio || new Date().toISOString().split('T')[0]}
              />
              {errors.dataFim && <span className="error-message">{errors.dataFim}</span>}
            </div>
          )}
        </div>

        {/* Mensagem de feedback */}
        {message && !qrCodeData && (
          <div className={`message ${message.includes('Erro') ? 'error' : 'success'}`}>
            {message}
          </div>
        )}

        {/* Botão de submit */}
        <button 
          type="submit" 
          className="submit-btn"
          disabled={isSubmitting}
        >
          {isSubmitting ? 'Cadastrando...' : 'Cadastrar'}
        </button>
      </form>

      {/* Modal do QR Code */}
      {qrCodeData && (
        <QRCodeDisplay 
          data={qrCodeData} 
          onClose={closeQRCode}
        />
      )}
    </div>
  );
};

export default CadastroForm;