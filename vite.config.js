import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig(({ mode }) => {
  // Carrega env baseado no mode
  const env = loadEnv(mode, process.cwd(), '')
  
  return {
    plugins: [react()],
    server: {
      port: parseInt(env.VITE_PORT) || 3050,
      host: '0.0.0.0',
      allowedHosts: ['.konsilo.online']
    },
    // Remove completamente a opção define
    // Configuração para garantir compatibilidade
    esbuild: {
      target: 'es2020'
    },
    optimizeDeps: {
      esbuildOptions: {
        target: 'es2020'
      }
    }
  }
})