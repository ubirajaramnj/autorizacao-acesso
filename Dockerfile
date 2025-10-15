# Dockerfile
FROM node:22-alpine

WORKDIR /app

# Instala wait-for-it para esperar dependências (útil para futuras APIs)
RUN wget -O /usr/local/bin/wait-for-it.sh https://raw.githubusercontent.com/vishnubob/wait-for-it/master/wait-for-it.sh \
    && chmod +x /usr/local/bin/wait-for-it.sh

# Copia os arquivos de dependências primeiro
COPY package.json package-lock.json ./
RUN npm install

# Copia o restante dos arquivos
COPY . .

# Cria diretório para scripts
RUN mkdir -p scripts

# Expõe a porta (será sobrescrita pelo docker-compose se necessário)
EXPOSE 3000

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD curl -f http://localhost:3000 || exit 1

# Usa o script customizado ou o padrão
CMD ["npm", "run", "start:port"]