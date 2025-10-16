// src/components/CadastroForm/CadastroForm.js
import React, { useState, useEffect } from 'react';
import InputMask from 'react-input-mask';
import { cadastrarVisitante } from '../../services/api';
import { 
  maskTelefone, 
  maskCNPJ, 
  maskCPF,
  maskRG,
  removeMask
} from '../../utils/masks';
import QRCodeDisplay from '../QRCodeDisplay/QRCodeDisplay';
import ConfirmacaoAutorizacao from '../ConfirmacaoAutorizacao/ConfirmacaoAutorizacao';
import './CadastroForm.css';

const CadastroForm = () => {
  const [dadosAutorizador, setDadosAutorizador] = useState({
    nome: '',
    telefone: '',
    codigoDaUnidade: ''
  });

  const [formData, setFormData] = useState({
    tipo: 'visitante',
    nome: '',
    email: '',
    telefone: '',
    cpf: '',
    rg: '',
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

  const [showConfirmacao, setShowConfirmacao] = useState(false);
  const [dadosConfirmacao, setDadosConfirmacao] = useState(null);

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const nome = urlParams.get('nome');
    const telefone = urlParams.get('telefone');
    const codigoDaUnidade = urlParams.get('codigoDaUnidade');

    if (nome && telefone && codigoDaUnidade) {

      const telefoneFormatado = formatarTelefoneAutorizador(telefone);

      setDadosAutorizador({
        nome: decodeURIComponent(nome),
        telefone: telefoneFormatado,
        codigoDaUnidade: decodeURIComponent(codigoDaUnidade)
      });
    }
  }, []);

   const coletarInformacoesDispositivo = () => {
    return {
      dataHora: new Date().toISOString(),
      dispositivo: navigator.userAgent,
      navegador: navigator.userAgent,
      linguagem: navigator.language,
      plataforma: navigator.platform,
      // IP seria coletado via backend na implementação real
      ip: 'A ser coletado pelo backend'
    };
  };

  // Função para formatar telefone do autorizador
  const formatarTelefoneAutorizador = (telefone) => {
    if (!telefone) return '';
    
    // Remove tudo que não é dígito
    const numeros = telefone.replace(/\D/g, '');
    
    // Aplica a máscara baseada no tamanho
    if (numeros.length === 10) {
      return numeros.replace(/(\d{2})(\d{4})(\d{4})/, '($1) $2-$3');
    } else if (numeros.length === 11) {
      return numeros.replace(/(\d{2})(\d{5})(\d{4})/, '($1) $2-$3');
    } else {
      // Se não tiver o formato esperado, retorna o original
      return telefone;
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    
    let formattedValue = value;
    
    // Aplicar máscaras
    if (name === 'telefone') {
      formattedValue = maskTelefone(value);
    } else if (name === 'cnpj') {
      formattedValue = maskCNPJ(value);
    } else if (name === 'cpf') {
      formattedValue = maskCPF(value);
    } else if (name === 'rg') {
      formattedValue = maskRG(value); // Usa a nova máscara flexível
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
    
    // Email é opcional, mas se preenchido deve ser válido
    if (formData.email.trim() && !/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email inválido';
    }
    
    const cleanTelefone = removeMask(formData.telefone);
    if (!cleanTelefone) {
      newErrors.telefone = 'Telefone é obrigatório';
    } else if (cleanTelefone.length < 10) {
      newErrors.telefone = 'Telefone inválido';
    }
    
    // Validações de CPF (obrigatório)
    const cleanCPF = removeMask(formData.cpf);
    if (!cleanCPF) {
      newErrors.cpf = 'CPF é obrigatório';
    } else if (cleanCPF.length !== 11) {
      newErrors.cpf = 'CPF deve ter 11 dígitos';
    }
    
    // Validações de RG (obrigatório)
    const cleanRG = removeMask(formData.rg);
    if (!cleanRG) {
      newErrors.rg = 'RG é obrigatório';
    } else if (cleanRG.length < 9) {
      newErrors.rg = 'RG deve ter pelo menos 9 dígitos';
    } else if (cleanRG.length > 10) {
      newErrors.rg = 'RG deve ter no máximo 10 dígitos';
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

    // Verifica se temos dados do autorizador
    if (!dadosAutorizador.nome || !dadosAutorizador.telefone || !dadosAutorizador.codigoDaUnidade) {
      setMessage('Erro: Dados do autorizador não encontrados. Acesse via link correto.');
      return;
    }

    // Prepara dados para confirmação
    const dadosParaConfirmacao = {
      dadosAutorizacao: {
        ...dadosAutorizador,
        ...coletarInformacoesDispositivo()
      },
      dadosVisitante: {
        ...formData,
        dataFim: formData.periodo === 'unico' ? formData.dataInicio : formData.dataFim
      }
    };

    setDadosConfirmacao(dadosParaConfirmacao);
    setShowConfirmacao(true);
  };

  const handleConfirmarAutorizacao = async () => {
    setIsSubmitting(true);

    try {
      // Preparar dados completos para envio
      const dadosCompletos = {
        ...dadosConfirmacao.dadosVisitante,
        autorizacao: {
          ...dadosConfirmacao.dadosAutorizacao,
          dataHoraAutorizacao: new Date().toISOString()
        },
        // Incluir informações do dispositivo
        informacoesDispositivo: coletarInformacoesDispositivo(),
        telefone: removeMask(dadosConfirmacao.dadosVisitante.telefone),
        cpf: removeMask(dadosConfirmacao.dadosVisitante.cpf),
        rg: removeMask(dadosConfirmacao.dadosVisitante.rg),
        cnpj: removeMask(dadosConfirmacao.dadosVisitante.cnpj)
      };

      const response = await cadastrarVisitante(dadosCompletos);
      
      // ✅ ALTERAÇÃO CRÍTICA AQUI:
      // Em vez de passar todos os dados para o QR Code, passamos apenas o link da API
      const qrCodePayload = {
        apiLink: response.data.apiLink, // Apenas o link da API
        id: response.data.id, // ID para referência
        tipo: 'autorizacao_link' // Tipo para identificar que é um link
      };
      
      setQrCodeData(response.data);
      setMessage('Cadastro realizado com sucesso!');
      setShowConfirmacao(false);
      
      // Limpar formulário após sucesso
      setFormData({
        tipo: 'visitante',
        nome: '',
        email: '',
        telefone: '',
        cpf: '',
        rg: '',
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
      setShowConfirmacao(false);
    }
  };

  const handleCancelarAutorizacao = () => {
    setShowConfirmacao(false);
    setDadosConfirmacao(null);
  };

  const closeQRCode = () => {
    setQrCodeData(null);
  };

  return (
    <div className="cadastro-form">
      {dadosAutorizador.nome && (
        <div className="autorizador-info">
          <h3>Autorização de: {dadosAutorizador.nome}</h3>
          <p>Unidade: {dadosAutorizador.codigoDaUnidade} | Tel: {dadosAutorizador.telefone}</p>
        </div>
      )}

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
          <label htmlFor="email">Email (Opcional)</label>
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

        {/* Documentos - CPF e RG */}
        <div className="form-row">
          <div className="form-group">
            <label htmlFor="cpf">CPF * Atualizado</label>
            <InputMask
              mask="999.999.999-99"
              value={formData.cpf}
              onChange={handleChange}
              onBeforeMask={(value) => {
                // Permite que a máscara funcione mesmo com inputMode numeric
                return value.replace(/\D/g, '');
              }}
            >
              {(inputProps) => (
                <input
                  {...inputProps}
                  type="tel"
                  inputMode="numeric"
                  //pattern="[0-9]*"
                  id="cpf"
                  name="cpf"
                  className={errors.cpf ? 'error' : ''}
                  placeholder="000.000.000-00"
                />
              )}
            </InputMask>
            {errors.cpf && <span className="error-message">{errors.cpf}</span>}
          </div>

          <div className="form-group">
            <label htmlFor="rg">RG *</label>
            <input
              type="tel"
              inputMode="numeric"
              //pattern="[0-9]*"
              id="rg"
              name="rg"
              value={formData.rg}
              onChange={handleChange}
              className={errors.rg ? 'error' : ''}
              placeholder="000.000.000-0"
              maxLength={13} // Permite até 000.000.000-0 (13 caracteres)
            />
            {errors.rg && <span className="error-message">{errors.rg}</span>}
            <small className="field-hint">Formato: 000.000.000-0 (9 até 10 dígitos)</small>
          </div>
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
                    type="tel"
                    inputMode="numeric"
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

      {showConfirmacao && (
        <ConfirmacaoAutorizacao
          dadosAutorizacao={dadosConfirmacao.dadosAutorizacao}
          dadosVisitante={dadosConfirmacao.dadosVisitante}
          onConfirmar={handleConfirmarAutorizacao}
          onCancelar={handleCancelarAutorizacao}
        />
      )}

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