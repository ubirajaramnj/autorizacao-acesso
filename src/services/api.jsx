// src/services/api.js
// Mock da API - Simula chamadas HTTP
let database = [];

const simulateApiCall = (data, success = true, delay = 1000) => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      if (success) {
        // Adicionar ID e timestamp
        const record = {
          id: Date.now(),
          ...data,
          createdAt: new Date().toISOString()
        };
        database.push(record);
        resolve({ data: record, status: 201 });
      } else {
        reject({ error: 'Erro na API', status: 500 });
      }
    }, delay);
  });
};

export const cadastrarVisitante = async (data) => {
  try {
    const response = await simulateApiCall(data);
    console.log('Dados cadastrados:', response.data);
    console.log('Database atual:', database);
    return response;
  } catch (error) {
    throw error;
  }
};

// Função para visualizar os dados (útil para desenvolvimento)
export const getDatabase = () => database;

// Função para limpar dados (útil para testes)
export const clearDatabase = () => {
  database = [];
};