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