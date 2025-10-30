import React from 'react';
import './DateFilter.css';

const DateFilter = ({ selectedDate, onDateChange }) => {
  // Função para obter data atual no fuso horário de São Paulo
  const getDataAtualBrasil = () => {
    const agora = new Date();
    // Ajusta para o fuso horário do Brasil (UTC-3)
    const offset = -3 * 60; // UTC-3 em minutos
    const dataBrasil = new Date(agora.getTime() + offset * 60 * 1000);
    return dataBrasil.toISOString().split('T')[0];
  };

  const hoje = getDataAtualBrasil();
  
  // Função para converter qualquer data para o formato YYYY-MM-DD no fuso Brasil
  const formatarDataParaAPI = (data) => {
    const dataObj = new Date(data);
    // Garante que a data seja tratada como local, não UTC
    const ano = dataObj.getFullYear();
    const mes = String(dataObj.getMonth() + 1).padStart(2, '0');
    const dia = String(dataObj.getDate()).padStart(2, '0');
    return `${ano}-${mes}-${dia}`;
  };

  const handleDateChange = (event) => {
    onDateChange(event.target.value);
  };

  const irParaHoje = () => {
    onDateChange(hoje);
  };

  const avancarDia = () => {
    const data = new Date(selectedDate);
    data.setDate(data.getDate() + 1);
    onDateChange(formatarDataParaAPI(data));
  };

  const retrocederDia = () => {
    const data = new Date(selectedDate);
    data.setDate(data.getDate() - 1);
    onDateChange(formatarDataParaAPI(data));
  };

  const formatarDataExibicao = (dataISO) => {
    const data = new Date(dataISO + 'T12:00:00-03:00'); // Força fuso horário Brasil
    return data.toLocaleDateString('pt-BR', {
      timeZone: 'America/Sao_Paulo',
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  return (
    <div className="date-filter">
      <div className="date-navigation">
        <button onClick={retrocederDia} className="nav-button" title="Dia anterior">
          ◀
        </button>
        
        <div className="date-display">
          <span className="selected-date">
            {formatarDataExibicao(selectedDate)}
          </span>
          {selectedDate !== hoje && (
            <button onClick={irParaHoje} className="today-button" title="Ir para hoje">
              Hoje
            </button>
          )}
        </div>
        
        <button onClick={avancarDia} className="nav-button" title="Próximo dia">
          ▶
        </button>
      </div>

      <div className="date-picker">
        <input
          type="date"
          value={selectedDate}
          onChange={handleDateChange}
          className="date-input"
          max={hoje}
        />
      </div>
    </div>
  );
};

export default DateFilter;