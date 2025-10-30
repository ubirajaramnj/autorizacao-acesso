// src/components/PortariaDashboard/PortariaDashboard.jsx
import React, { useState, useEffect, useCallback } from 'react';
import { autorizacoesApi } from '../../services/autorizacoesApi';
import Loader from '../Loader/Loader';
import KanbanBoard from './KanbanBoard';
import StatsCards from './StatsCards';
import DateFilter from './DateFilter';
import './PortariaDashboard.css';

const PortariaDashboard = () => {
  const [autorizacoes, setAutorizacoes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [stats, setStats] = useState({
    totalAutorizacoes: 0,
    acessosHoje: 0,
    saidasHoje: 0,
    pendentes: 0
  });

  // Buscar autorizações
  const fetchAutorizacoes = async (dataFiltro = null) => {
    const dataParaBuscar = dataFiltro || selectedDate;
    try {
      setLoading(true);
      const response = await autorizacoesApi.buscarAutorizacoesPortaria(dataParaBuscar);
      setAutorizacoes(response.data);
      calcularStats(response.data, dataParaBuscar);
    } catch (err) {
      console.error('Erro ao buscar autorizações:', err);
      setError('Erro ao carregar autorizações');
    } finally {
      setLoading(false);
    }
  };

  // Calcular estatísticas
  const calcularStats = (data, dataFiltro) => {
    const acessosHoje = data.filter(a => 
      a.checkins?.some(checkin => checkin.dataHoraEntrada?.includes(dataFiltro))
    ).length;
    
    const saidasHoje = data.filter(a => 
      a.checkins?.some(checkin => checkin.dataHoraSaida?.includes(dataFiltro))
    ).length;
    
    const pendentes = data.filter(a => a.status === 'autorizado' && !a.checkins?.length).length;

    setStats({
      totalAutorizacoes: data.length,
      acessosHoje,
      saidasHoje,
      pendentes
    });
  };

  // Handler para mudança de data
  const handleDateChange = (novaData) => {
    setSelectedDate(novaData);
    fetchAutorizacoes(novaData); // Busca dados da nova data
  };

  // Cancelar autorização
  const handleCancelarAutorizacao = async (autorizacaoId) => {
    if (!window.confirm('Tem certeza que deseja cancelar esta autorização?')) {
      return;
    }

    try {
      await autorizacoesApi.cancelarAutorizacao(autorizacaoId);
      fetchAutorizacoes(selectedDate);
    } catch (err) {
      console.error('Erro ao cancelar autorização:', err);
      setError('Erro ao cancelar autorização');
    }
  };

  // Atualização automática a cada 30 segundos
  // useEffect para atualizações automáticas
  useEffect(() => {
    fetchAutorizacoes(); // Busca inicial
    
    const interval = setInterval(() => {
      fetchAutorizacoes(); // Atualiza a data atual selecionada
    }, 60000);
    
    return () => clearInterval(interval);
  }, [selectedDate]); // Recria quando selectedDate muda

  if (loading && autorizacoes.length === 0) {
    return <Loader logoSize="large" message="Carregando dashboard..." />;
  }

  return (
    <div className="portaria-dashboard">
      {/* Header do Dashboard */}
      <header className="dashboard-header-global">
        <div className="dashboard-header-content">
          <img 
            src="/LogoSolar.jpg" 
            alt="Logo Solar" 
            className="dashboard-logo"
          />
          <div>
            <h1 className="dashboard-title">🏢 Dashboard Portaria</h1>
            <p className="dashboard-subtitle">Controle de acesso em tempo real</p>
          </div>
        </div>
        
        <div className="dashboard-controls">
          <DateFilter 
            selectedDate={selectedDate}
            onDateChange={handleDateChange}
          />
          <button 
            onClick={() => fetchAutorizacoes()}
            className="refresh-btn"
            disabled={loading}
          >
            🔄 {loading ? 'Atualizando...' : 'Atualizar'}
          </button>
          <span className="last-update">
            Última atualização: {new Date().toLocaleTimeString('pt-BR')}
          </span>
        </div>
      </header>

      <div className="dashboard-content">
        {error && (
          <div className="error-message">
            ❌ {error}
            <button onClick={() => setError('')} className="close-error">×</button>
          </div>
        )}

        {/* Cards de Estatísticas */}
        <StatsCards stats={stats} />

        {/* Board Kanban */}
        <KanbanBoard 
          autorizacoes={autorizacoes}
          onCancelarAutorizacao={handleCancelarAutorizacao}
          loading={loading}
        />
      </div>
    </div>
  );
};

export default PortariaDashboard;