#!/usr/bin/env node

const fs = require('fs');
const { spawn } = require('child_process');

// Lê a porta do environment ou usa 3000 como padrão
const port = process.env.REACT_APP_PORT || process.env.PORT || 3000;

console.log(`🚀 Iniciando aplicação React na porta ${port}...`);

// Configura a porta para o React Scripts
process.env.PORT = port;

// Inicia o React Scripts
const reactScriptsStart = spawn('react-scripts', ['start'], {
  stdio: 'inherit',
  env: { ...process.env, PORT: port }
});

reactScriptsStart.on('error', (error) => {
  console.error('❌ Erro ao iniciar a aplicação:', error);
});

reactScriptsStart.on('close', (code) => {
  console.log(`✅ Aplicação finalizada com código: ${code}`);
});