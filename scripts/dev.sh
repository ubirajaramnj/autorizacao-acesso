#!/bin/bash

# Configura e inicia o desenvolvimento
export REACT_APP_PORT=${1:-3000}
export APP_PORT=${1:-3000}

echo "🔧 Configurando aplicação na porta $REACT_APP_PORT..."

docker-compose down
docker-compose up --build