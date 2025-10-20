// src/services/realApi.js
import axios from 'axios';

// Configuração base da API
const API_BASE_URL = 'https://condominio-api-itac.konsilo.online/api';
const API_TIMEOUT = 10000; // 10 segundos

// Instância do axios com configurações padrão
const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: API_TIMEOUT,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor para requests
apiClient.interceptors.request.use(
  (config) => {
    console.log(`🚀 ${config.method?.toUpperCase()} ${config.url}`, config.data);
    // Aqui você pode adicionar headers de autenticação se necessário
    // config.headers.Authorization = `Bearer ${token}`;
    return config;
  },
  (error) => {
    console.error('❌ Erro no request:', error);
    return Promise.reject(error);
  }
);

// Interceptor para responses
apiClient.interceptors.response.use(
  (response) => {
    console.log(`✅ ${response.status} ${response.config.url}`, response.data);
    return response;
  },
  (error) => {
    console.error('❌ Erro na response:', {
      url: error.config?.url,
      status: error.response?.status,
      data: error.response?.data,
      message: error.message
    });
    return Promise.reject(error);
  }
);

// 🆕 Serviços da API Real
export const autorizacoesApi = {
  // Criar autorização
  async criarAutorizacao(dadosAutorizacao) {
    try {
      // 🎯 ADAPTAÇÃO DO PAYLOAD para a API real
      const payload = this.adaptarPayloadCriacao(dadosAutorizacao);
      
      const response = await apiClient.post('/autorizacoes', payload);
      return {
        data: response.data,
        status: response.status
      };
    } catch (error) {
      throw this.tratarErroApi(error, 'criar autorização');
    }
  },

  // Buscar autorização por ID
  async buscarAutorizacaoPorId(id) {
    try {
      const response = await apiClient.get(`/autorizacoes/${id}`);
      return {
        data: response.data,
        status: response.status
      };
    } catch (error) {
      throw this.tratarErroApi(error, 'buscar autorização');
    }
  },

  // Registrar entrada
  async registrarEntrada(dadosEntrada) {
    try {
      const payload = this.adaptarPayloadEntrada(dadosEntrada);
      const id = dadosEntrada.id
      
      const response = await apiClient.post('/checkin', id);
      return {
        data: response.data,
        status: response.status
      };
    } catch (error) {
      throw this.tratarErroApi(error, 'registrar entrada');
    }
  },

  // Upload de documento
  async uploadDocumento(file, autorizacaoId) {
    try {
      const formData = new FormData();
      formData.append('documento', file);
      formData.append('autorizacaoId', autorizacaoId);

      const response = await apiClient.post('/documentos/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      return {
        data: response.data,
        status: response.status
      };
    } catch (error) {
      throw this.tratarErroApi(error, 'upload de documento');
    }
  },

  // 🎯 ADAPTAÇÃO DOS PAYLOADS
  adaptarPayloadCriacao(dados) {
    return {
      // Dados básicos do visitante/prestador
      tipoPessoa: dados.tipo, // 'visitante' ou 'prestador'
      nome: dados.nome,
      email: dados.email || null,
      telefone: dados.telefone,
      cpf: dados.cpf,
      rg: dados.rg,
      
      // Dados específicos para prestador
      empresa: dados.empresa || null,
      cnpj: dados.cnpj || null,
      
      // Período de autorização
      tipoPeriodo: dados.periodo, // 'unico' ou 'intervalo'
      dataInicio: dados.dataInicio,
      dataFim: dados.periodo === 'unico' ? dados.dataInicio : dados.dataFim,
      
      // Dados do autorizador
      autorizador: {
        nome: dados.autorizacao?.nome,
        telefone: dados.autorizacao?.telefone,
        unidade: dados.autorizacao?.codigoDaUnidade,
        dataHoraAutorizacao: dados.autorizacao?.dataHoraAutorizacao || new Date().toISOString()
      },
      
      // Informações do dispositivo (opcional)
      dispositivo: dados.informacoesDispositivo || {
        userAgent: navigator.userAgent,
        linguagem: navigator.language,
        plataforma: navigator.platform
      },
      
      // Status inicial
      status: 'autorizado'
    };
  },

  adaptarPayloadEntrada(dados) {
    return {
      autorizacaoId: dados.autorizacaoId,
      nome: dados.nome,
      tipo: dados.tipo,
      cpf: dados.cpf,
      rg: dados.rg,
      empresa: dados.empresa || null,
      periodo: dados.periodo,
      dataInicio: dados.dataInicio,
      dataFim: dados.dataFim,
      portariaResponsavel: dados.portariaResponsavel,
      dataHoraEntrada: new Date().toISOString(),
      status: 'entrada_registrada'
    };
  },

  tratarErroApi(error, operacao) {
    const status = error.response?.status;
    const mensagem = error.response?.data?.message || error.message;

    switch (status) {
      case 400:
        return { error: `Dados inválidos para ${operacao}`, status: 400, details: error.response?.data };
      case 404:
        return { error: `Recurso não encontrado para ${operacao}`, status: 404 };
      case 409:
        return { error: `Conflito na ${operacao}`, status: 409, details: error.response?.data };
      case 500:
        return { error: `Erro interno do servidor ao ${operacao}`, status: 500 };
      default:
        if (error.code === 'NETWORK_ERROR' || error.code === 'ECONNABORTED') {
          return { error: `Erro de conexão ao ${operacao}. Verifique sua internet.`, status: 0 };
        }
        return { error: `Erro ao ${operacao}: ${mensagem}`, status: status || 500 };
    }
  }
};

// 🆕 Teste de conexão com a API
export const testarConexaoApi = async () => {
  try {
    const response = await apiClient.get('/health'); // ou endpoint de health check
    return {
      conectado: true,
      mensagem: 'API conectada com sucesso',
      data: response.data
    };
  } catch (error) {
    return {
      conectado: false,
      mensagem: 'Falha na conexão com a API',
      erro: error.message
    };
  }
};

export default autorizacoesApi;