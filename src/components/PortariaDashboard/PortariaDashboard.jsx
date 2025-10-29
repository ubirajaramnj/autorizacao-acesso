// src/components/PortariaDashboard/PortariaDashboard.jsx
import React, { useState, useEffect, useCallback } from 'react';
import { autorizacoesApi } from '../../services/autorizacoesApi';
import Loader from '../Loader/Loader';
import KanbanBoard from './KanbanBoard';
import StatsCards from './StatsCards';
import './PortariaDashboard.css';

const PortariaDashboard = () => {
  const [autorizacoes, setAutorizacoes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [stats, setStats] = useState({
    totalAutorizacoes: 0,
    acessosHoje: 0,
    saidasHoje: 0,
    pendentes: 0
  });

  // Buscar autorizações
  const fetchAutorizacoes = useCallback(async () => {
    try {
      setLoading(true);
      const response = await autorizacoesApi.buscarAutorizacoesPortaria();
      setAutorizacoes(response.data);
      calcularStats(response.data);
    } catch (err) {
      console.error('Erro ao buscar autorizações:', err);
      setError('Erro ao carregar autorizações');
    } finally {
      setLoading(false);
    }
  }, []);

  // Calcular estatísticas
  const calcularStats = (data) => {
    const hoje = new Date().toISOString().split('T')[0];
    
    const totalAutorizacoes = data.length;
    const acessosHoje = data.filter(a => 
      a.checkins?.some(checkin => checkin.dataHoraEntrada?.includes(hoje))
    ).length;
    const saidasHoje = data.filter(a => 
      a.checkins?.some(checkin => checkin.dataHoraSaida?.includes(hoje))
    ).length;
    const pendentes = data.filter(a => a.status === 'autorizado' && !a.checkins?.length).length;

    setStats({
      totalAutorizacoes,
      acessosHoje,
      saidasHoje,
      pendentes
    });
  };

  // Cancelar autorização
  const handleCancelarAutorizacao = async (autorizacaoId) => {
    if (!window.confirm('Tem certeza que deseja cancelar esta autorização?')) {
      return;
    }

    try {
      await autorizacoesApi.cancelarAutorizacao(autorizacaoId);
      setAutorizacoes(prev => 
        prev.map(a => 
          a.id === autorizacaoId 
            ? { ...a, status: 'cancelado' } 
            : a
        )
      );
      // Recarregar stats
      calcularStats(autorizacoes.map(a => 
        a.id === autorizacaoId ? { ...a, status: 'cancelado' } : a
      ));
    } catch (err) {
      console.error('Erro ao cancelar autorização:', err);
      setError('Erro ao cancelar autorização');
    }
  };

  // Atualização automática a cada 30 segundos
  useEffect(() => {
    fetchAutorizacoes();
    
    const interval = setInterval(fetchAutorizacoes, 30000);
    return () => clearInterval(interval);
  }, [fetchAutorizacoes]);

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
          <button 
            onClick={fetchAutorizacoes}
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