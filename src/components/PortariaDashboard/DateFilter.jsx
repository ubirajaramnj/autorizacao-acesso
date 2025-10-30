import React from 'react';
import './DateFilter.css';

const DateFilter = ({ selectedDate, onDateChange }) => {
  const hoje = new Date().toISOString().split('T')[0];
  
  const handleDateChange = (event) => {
    onDateChange(event.target.value);
  };

  const irParaHoje = () => {
    onDateChange(hoje);
  };

  const avancarDia = () => {
    const data = new Date(selectedDate);
    data.setDate(data.getDate() + 1);
    onDateChange(data.toISOString().split('T')[0]);
  };

  const retrocederDia = () => {
    const data = new Date(selectedDate);
    data.setDate(data.getDate() - 1);
    onDateChange(data.toISOString().split('T')[0]);
  };

  const formatarDataExibicao = (dataISO) => {
    const data = new Date(dataISO);
    return data.toLocaleDateString('pt-BR', {
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