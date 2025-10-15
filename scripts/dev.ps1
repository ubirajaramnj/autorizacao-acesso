param(
    [int]$Port = 3000
)

$env:REACT_APP_PORT = $Port
$env:APP_PORT = $Port

Write-Host "🔧 Configurando aplicação na porta $Port..."

docker-compose down
docker-compose up --build