// src/services/api.js
let database = [];

const simulateApiCall = (data, success = true, delay = 1000) => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      if (success) {
        // Adicionar ID, timestamp e informações completas
        const record = {
          id: Date.now(),
          ...data,
          createdAt: new Date().toISOString(),
          status: 'autorizado'
        };
        database.push(record);
        
        console.log('📝 Dados cadastrados com autorização:', record);
        console.log('💾 Database atual:', database);
        
        // ✅ ALTERAÇÃO AQUI: Retornar o link da API em vez dos dados completos
        const apiLink = `https://minha.api/autorizacoes/${record.id}`;
        
        resolve({ 
          data: {
            ...record,
            apiLink: apiLink // Adiciona o link no response
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

// ✅ NOVA FUNÇÃO: Para simular a busca por ID (como a API real faria)
export const buscarAutorizacaoPorId = async (id) => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      const autorizacao = database.find(item => item.id === parseInt(id));
      if (autorizacao) {
        resolve({ data: autorizacao });
      } else {
        reject({ error: 'Autorização não encontrada', status: 404 });
      }
    }, 500);
  });
};

// 🆕 FUNÇÕES NOVAS PARA PORTARIA:

// Simula o banco de dados de entradas registradas
let entradasRegistradas = [];

// 🆕 NOVA: Registra entrada do visitante
export const registrarEntrada = async (dadosEntrada) => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      try {
        const registro = {
          id: Date.now(),
          ...dadosEntrada,
          dataHoraEntrada: new Date().toISOString(),
          status: 'entrada_registrada'
        };
        
        entradasRegistradas.push(registro);
        console.log('🚪 Entrada registrada:', registro);
        console.log('📊 Total de entradas:', entradasRegistradas);
        
        resolve({ data: registro, status: 201 });
      } catch (error) {
        reject({ error: 'Erro ao registrar entrada', status: 500 });
      }
    }, 500);
  });
};

// 🆕 NOVA: Upload de documento (simulado)
export const uploadDocumento = async (file, autorizacaoId) => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      try {
        const documentoInfo = {
          id: Date.now(),
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

// 🆕 NOVA: Buscar histórico de entradas
export const getEntradasRegistradas = () => {
  return entradasRegistradas;
};

// Funções auxiliares mantidas
export const getDatabase = () => database;
export const clearDatabase = () => {
  database = [];
};