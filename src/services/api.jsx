// src/services/api.js
import { v4 as uuidv4 } from 'uuid';

// 🆕 Funções para gerenciar o JSON file storage
const STORAGE_KEY = 'autorizacoes_db';
const ENTRADAS_KEY = 'entradas_db';

// 🆕 Carregar dados do localStorage
const loadFromStorage = (key) => {
  try {
    const data = localStorage.getItem(key);
    return data ? JSON.parse(data) : [];
  } catch (error) {
    console.error('Erro ao carregar dados:', error);
    return [];
  }
};

// 🆕 Salvar dados no localStorage
const saveToStorage = (key, data) => {
  try {
    localStorage.setItem(key, JSON.stringify(data));
    return true;
  } catch (error) {
    console.error('Erro ao salvar dados:', error);
    return false;
  }
};

// 🆕 Carregar database inicial
let database = loadFromStorage(STORAGE_KEY);
let entradasRegistradas = loadFromStorage(ENTRADAS_KEY);

// 🆕 Função para gerar ID único
const generateId = () => {
  return uuidv4();
};

// 🆕 Função para salvar automaticamente
const saveDatabase = () => {
  saveToStorage(STORAGE_KEY, database);
};

const saveEntradas = () => {
  saveToStorage(ENTRADAS_KEY, entradasRegistradas);
};

const simulateApiCall = (data, success = true, delay = 1000) => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      if (success) {
        // Adicionar ID único, timestamp e informações completas
        const record = {
          id: generateId(),
          ...data,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          status: 'autorizado'
        };
        
        database.push(record);
        saveDatabase(); // 🆕 Salva automaticamente no storage
        
        console.log('📝 Dados cadastrados com autorização:', record);
        console.log('💾 Database atual:', database);
        console.log('💾 Total de registros:', database.length);
        
        // Retornar o link da API
        const apiLink = `https://minha.api/autorizacoes/${record.id}`;
        
        resolve({ 
          data: {
            ...record,
            apiLink: apiLink
          }, 
          status: 201 
        });
      } else {
        reject({ error: 'Erro na API', status: 500 });
      }
    }, delay);
  });
};

export const cadastrarVisitante = async (data) => {
  try {
    const response = await simulateApiCall(data);
    return response;
  } catch (error) {
    throw error;
  }
};

// ✅ Função para buscar por ID
export const buscarAutorizacaoPorId = async (id) => {
  console.log('🔍 id:', id);
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      // 🆕 Carrega dados atualizados do storage
      database = loadFromStorage(STORAGE_KEY);
      
      const autorizacao = database.find(item => item.id === id);
      if (autorizacao) {
        console.log('🔍 Autorização encontrada:', autorizacao);
        resolve({ data: autorizacao });
      } else {
        console.log('❌ Autorização não encontrada para ID:', id);
        console.log('📋 IDs disponíveis:', database.map(item => item.id));
        reject({ error: 'Autorização não encontrada', status: 404 });
      }
    }, 500);
  });
};

// 🆕 Registra entrada do visitante
export const registrarEntrada = async (dadosEntrada) => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      try {
        const registro = {
          id: generateId(),
          ...dadosEntrada,
          dataHoraEntrada: new Date().toISOString(),
          status: 'entrada_registrada'
        };
        
        entradasRegistradas.push(registro);
        saveEntradas(); // 🆕 Salva automaticamente
        
        console.log('🚪 Entrada registrada:', registro);
        console.log('📊 Total de entradas:', entradasRegistradas.length);
        
        resolve({ data: registro, status: 201 });
      } catch (error) {
        reject({ error: 'Erro ao registrar entrada', status: 500 });
      }
    }, 500);
  });
};

// 🆕 Upload de documento (simulado)
export const uploadDocumento = async (file, autorizacaoId) => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      try {
        const documentoInfo = {
          id: generateId(),
          autorizacaoId,
          nomeArquivo: file.name,
          tipo: file.type,
          tamanho: file.size,
          dataUpload: new Date().toISOString(),
          url: URL.createObjectURL(file)
        };
        
        resolve({ data: documentoInfo, status: 200 });
      } catch (error) {
        reject({ error: 'Erro no upload', status: 500 });
      }
    }, 1000);
  });
};

// 🆕 Buscar histórico de entradas
export const getEntradasRegistradas = () => {
  return loadFromStorage(ENTRADAS_KEY);
};

// 🆕 NOVAS FUNÇÕES PARA GERENCIAMENTO
export const getDatabase = () => {
  return loadFromStorage(STORAGE_KEY);
};

export const clearDatabase = () => {
  database = [];
  entradasRegistradas = [];
  localStorage.removeItem(STORAGE_KEY);
  localStorage.removeItem(ENTRADAS_KEY);
  console.log('🗑️ Database limpo!');
  return true;
};

// 🆕 Função para adicionar dados de teste
export const addTestData = () => {
  const testData = {
    tipo: 'visitante',
    nome: 'João Silva (Teste)',
    email: 'joao@teste.com',
    telefone: '11999999999',
    cpf: '12345678901',
    rg: '123456789',
    empresa: '',
    cnpj: '',
    periodo: 'unico',
    dataInicio: new Date().toISOString().split('T')[0],
    dataFim: '',
    autorizacao: {
      nome: 'Maria Autorizadora',
      telefone: '11988888888',
      codigoDaUnidade: 'UNIDADE-TESTE-001',
      dataHoraAutorizacao: new Date().toISOString()
    }
  };

  return simulateApiCall(testData);
};

// 🆕 Função para exportar dados
export const exportData = () => {
  const data = {
    autorizacoes: getDatabase(),
    entradas: getEntradasRegistradas(),
    exportDate: new Date().toISOString()
  };
  
  const dataStr = JSON.stringify(data, null, 2);
  const dataBlob = new Blob([dataStr], { type: 'application/json' });
  
  const url = URL.createObjectURL(dataBlob);
  const link = document.createElement('a');
  link.href = url;
  link.download = `backup-autorizacoes-${new Date().toISOString().split('T')[0]}.json`;
  link.click();
  
  URL.revokeObjectURL(url);
  
  return data;
};

// 🆕 Função para importar dados
export const importData = (jsonData) => {
  try {
    const data = typeof jsonData === 'string' ? JSON.parse(jsonData) : jsonData;
    
    if (data.autorizacoes) {
      database = data.autorizacoes;
      saveDatabase();
    }
    
    if (data.entradas) {
      entradasRegistradas = data.entradas;
      saveEntradas();
    }
    
    console.log('📥 Dados importados com sucesso!');
    return true;
  } catch (error) {
    console.error('❌ Erro ao importar dados:', error);
    return false;
  }
};