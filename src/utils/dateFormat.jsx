// src/utils/dateUtils.js

/**
 * 🎯 UTILITÁRIOS DE DATA - Compatível com fuso horário brasileiro
 */

/**
 * Converte string YYYY-MM-DD para Date object no fuso local
 * @param {string} dateString - Data no formato YYYY-MM-DD
 * @returns {Date} - Data no fuso horário local
 */
export const parseLocalDate = (dateString) => {
  if (!dateString) return null;
  const [year, month, day] = dateString.split('-').map(Number);
  return new Date(year, month - 1, day); // Month é 0-based
};

/**
 * Obtém a data de hoje no fuso horário local (com horas zeradas)
 * @returns {Date} - Data de hoje às 00:00:00 no fuso local
 */
export const getTodayLocal = () => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  return today;
};

/**
 * Obtém a data de hoje no formato YYYY-MM-DD para inputs date
 * @returns {string} - Data no formato YYYY-MM-DD
 */
export const getTodayLocalString = () => {
  const today = new Date();
  const year = today.getFullYear();
  const month = String(today.getMonth() + 1).padStart(2, '0');
  const day = String(today.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

/**
 * Formata data para exibição em português (DD/MM/YYYY)
 * @param {string|Date} date - Data para formatar
 * @returns {string} - Data formatada
 */
export const formatDateToDisplay = (date) => {
  if (!date) return 'N/A';
  
  const dateObj = typeof date === 'string' ? parseLocalDate(date) : date;
  
  return dateObj.toLocaleDateString('pt-BR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric'
  });
};

/**
 * Valida se uma data não é no passado
 * @param {string} dateString - Data no formato YYYY-MM-DD
 * @returns {boolean} - True se a data é hoje ou no futuro
 */
export const isDateValid = (dateString) => {
  if (!dateString) return false;
  
  const date = parseLocalDate(dateString);
  date.setHours(0, 0, 0, 0);
  
  const today = getTodayLocal();
  
  return date >= today;
};

/**
 * Compara duas datas no formato YYYY-MM-DD
 * @param {string} date1 - Primeira data
 * @param {string} date2 - Segunda data
 * @returns {number} - -1 se date1 < date2, 0 se iguais, 1 se date1 > date2
 */
export const compareDates = (date1, date2) => {
  const d1 = parseLocalDate(date1);
  const d2 = parseLocalDate(date2);
  
  d1.setHours(0, 0, 0, 0);
  d2.setHours(0, 0, 0, 0);
  
  if (d1 < d2) return -1;
  if (d1 > d2) return 1;
  return 0;
};

/**
 * Calcula a diferença em dias entre duas datas
 * @param {string} startDate - Data inicial
 * @param {string} endDate - Data final
 * @returns {number} - Diferença em dias
 */
export const getDaysDifference = (startDate, endDate) => {
  const start = parseLocalDate(startDate);
  const end = parseLocalDate(endDate);
  
  const diffTime = end - start;
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  
  return diffDays;
};

export default {
  parseLocalDate,
  getTodayLocal,
  getTodayLocalString,
  formatDateToDisplay,
  isDateValid,
  compareDates,
  getDaysDifference
};