// src/utils/timezoneConfig.js
export const TIMEZONE = 'America/Sao_Paulo';

// Função para data atual no fuso Brasil
export const getDataAtualBrasil = () => {
  const agora = new Date();
  const dataBrasil = new Date(agora.toLocaleString('en-US', { timeZone: TIMEZONE }));
  const ano = dataBrasil.getFullYear();
  const mes = String(dataBrasil.getMonth() + 1).padStart(2, '0');
  const dia = String(dataBrasil.getDate()).padStart(2, '0');
  return `${ano}-${mes}-${dia}`;
};

// Formatar data para API (YYYY-MM-DD)
export const formatarDataParaAPI = (data) => {
  const dataObj = new Date(data + 'T12:00:00-03:00');
  const ano = dataObj.getFullYear();
  const mes = String(dataObj.getMonth() + 1).padStart(2, '0');
  const dia = String(dataObj.getDate()).padStart(2, '0');
  return `${ano}-${mes}-${dia}`;
};

// Formatar data para exibição
export const formatarDataExibicao = (dataISO) => {
  const data = new Date(dataISO + 'T12:00:00-03:00');
  return data.toLocaleDateString('pt-BR', {
    timeZone: TIMEZONE,
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
};

// Converter qualquer data para fuso Brasil
export const paraFusoBrasil = (data) => {
  return new Date(data.toLocaleString('en-US', { timeZone: TIMEZONE }));
};