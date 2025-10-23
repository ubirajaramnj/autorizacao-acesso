# Sistema de Cadastro - Visitantes e Prestadores de Serviço

## 📋 Descrição do Projeto

Sistema web desenvolvido em React para cadastro de visitantes e prestadores de serviço em condomínios ou empresas. O sistema gera um QR Code para validação na portaria e oferece um comprovante de impressão profissional.

**✨ Destaque:** Sistema completo com frontend, sistema de portaria, upload de documentos e integração completa com API real.

## 🚀 Funcionalidades

### ✨ Principais Características
- **Cadastro Duplo**: Suporte para visitantes e prestadores de serviço
- **Períodos Flexíveis**: Dia único ou intervalo de datas
- **Validação por QR Code**: Geração automática de QR Code para portaria
- **Sistema de Portaria**: Leitor QR Code integrado com registro de entrada
- **Upload de Documentos**: Upload real de imagens e PDFs para o backend
- **Registro Completo**: Entrada registrada com documentação anexada
- **Comprovante de Impressão**: Layout otimizado para impressão
- **Design Responsivo**: Funciona perfeitamente em desktop, tablet e mobile
- **Validações Completa**: Formulário com validações robustas
- **Máscaras Inteligentes**: CPF, CNPJ, telefone e RG formatados automaticamente

### 🎯 Fluxo do Sistema Completo
1. **Cadastro**: Preenchimento do formulário com dados pessoais
2. **Validação**: Verificação automática dos campos obrigatórios
3. **QR Code**: Geração do código com link da API para validação
4. **Portaria**: Leitura do QR Code e verificação dos dados
5. **Upload de Documentos**: Captura e envio real de documentos para o backend
6. **Registro de Entrada**: Check-in com timestamp e documentação
7. **Comprovante**: Registro completo com todos os dados

## 🛠 Tecnologias Utilizadas

### Frontend
- **React 18.2.0** - Biblioteca principal
- **JavaScript (ES6+)** - Linguagem de programação
- **CSS3** - Estilização com design responsivo
- **HTML5** - Estrutura semântica

### Bibliotecas e Dependências
- **axios** ^1.4.0 - Cliente HTTP para APIs
- **qrcode.react** ^3.1.0 - Geração de QR Codes
- **react-input-mask** ^2.0.4 - Máscaras para campos de entrada
- **@yudiel/react-qr-scanner** - Leitor de QR Code para portaria
- **uuid** - Geração de IDs únicos

### Desenvolvimento
- **Vite** ^4.4.0 - Build tool ultrarrápido
- **Docker** - Containerização da aplicação
- **Docker Compose** - Orquestração de containers

## 📁 Estrutura do Projeto

```
form-cadastro/
├── src/
│   ├── components/
│   │   ├── App/
│   │   │   ├── App.jsx
│   │   │   └── App.css
│   │   ├── CadastroForm/
│   │   │   ├── CadastroForm.jsx
│   │   │   └── CadastroForm.css
│   │   ├── QRCodeDisplay/
│   │   │   ├── QRCodeDisplay.jsx
│   │   │   └── QRCodeDisplay.css
│   │   ├── PortariaLeitorQR/
│   │   │   ├── PortariaLeitorQR.jsx
│   │   │   └── PortariaLeitorQR.css
│   │   ├── DocumentUpload/
│   │   │   ├── DocumentUpload.jsx
│   │   │   └── DocumentUpload.css
│   │   ├── ApiStatus/
│   │   │   ├── ApiStatus.jsx
│   │   │   └── ApiStatus.css
│   │   └── Navigation/
│   │       ├── Navigation.jsx
│   │       └── Navigation.css
│   ├── pages/
│   │   ├── CadastroPage.jsx
│   │   └── PortariaPage.jsx
│   ├── services/
│   │   ├── api.js (serviço híbrido mock/real)
│   │   ├── realApi.js (integração com API real)
│   │   ├── autorizacoesApi.js (serviços de autorizações)
│   │   └── apiService.js (gerenciador de serviços)
│   ├── utils/
│   │   └── masks.js (utilitários de máscaras)
│   ├── styles/
│   │   ├── globals.css
│   │   ├── responsive.css
│   │   └── print.css
│   ├── App.jsx (componente raiz com rotas)
│   └── main.jsx (ponto de entrada)
├── public/ (arquivos estáticos)
├── scripts/ (scripts de desenvolvimento)
├── Dockerfile
├── docker-compose.yml
├── vite.config.js (configuração do Vite)
├── .env (configurações de ambiente)
└── README.md
```

## ⚙️ Configuração e Instalação

### Pré-requisitos
- Node.js 16+ ou Docker
- npm ou yarn

### Instalação com npm/yarn

```bash
# Clone o repositório
git clone <url-do-repositorio>
cd form-cadastro

# Instale as dependências
npm install

# Execute em modo desenvolvimento
npm run dev
```

A aplicação estará disponível em: `http://localhost:3000`

### Instalação com Docker

```bash
# Build e execução
docker-compose up --build

# Execução em background
docker-compose up -d

# Com porta customizada
VITE_PORT=4000 APP_PORT=4000 docker-compose up --build
```

## 🎮 Como Usar

### 1. Cadastro de Visitante/Prestador
- Acesse: `http://localhost:3000/cadastro`
- Selecione "Visitante" ou "Prestador de Serviço"
- Preencha dados pessoais (nome, email opcional, telefone, CPF, RG)
- Para prestadores: adicione empresa e CNPJ
- Escolha data única ou período
- Clique em "Cadastrar"
- **QR Code gerado** com link da API

### 2. Sistema de Portaria com Upload de Documentos
- Acesse: `http://localhost:3000/portaria`
- Clique em "Ler QR Code" ou cole o link manualmente
- **Sistema busca dados** da API real
- Verifique os dados do visitante
- **Faça upload de documentos** (obrigatório) - imagens ou PDF
- Clique em "Registrar Entrada"
- **Sistema envia documentos** para o backend e registra check-in

### 3. Validação na Portaria
- Apresente o QR Code gerado
- A portaria escaneia o código
- Sistema consulta API em tempo real
- Documentos são enviados e armazenados no servidor
- Acesso liberado conforme período autorizado

## 🔄 Sistema de Upload de Documentos

### 🎯 Funcionamento do Upload
- **Upload Real**: Arquivos são enviados para o backend via FormData
- **Validação**: Apenas imagens (JPG, PNG) e PDFs, máximo 5MB
- **Obrigatório**: Pelo menos um documento necessário para registro
- **Armazenamento**: URLs reais do servidor no banco de dados
- **Segurança**: Validação de tipo e tamanho no frontend e backend

### 📤 Endpoints de Documentos
- `POST /api/documentos/upload` - Upload de arquivos
- Payload: `FormData` com arquivo + `autorizacaoId`
- Retorno: URL real do arquivo no servidor + ID do documento

## 🔧 Configuração de API

```env
# Usar API real (true/false)
VITE_USE_REAL_API=true

# URL da API real
VITE_API_URL=https://condominio-api-itac.konsilo.online/api

# Porta da aplicação
VITE_PORT=3000

# Configurações de Upload
VITE_MAX_FILE_SIZE=5242880
VITE_ALLOWED_FILE_TYPES=image/jpeg,image/png,image/jpg,application/pdf
```

### 📡 Endpoints da API Real
- `POST /api/autorizacoes` - Criar autorização
- `GET /api/autorizacoes/{id}` - Buscar autorização por ID
- `POST /api/checkins` - Registrar entrada com documentos
- `POST /api/documentos/upload` - Upload de documentos

## 📊 Funcionalidades Detalhadas

### Formulário Inteligente
- **Campos Condicionais**: Empresa e CNPJ só aparecem para prestadores
- **Validações em Tempo Real**: Feedback imediato para o usuário
- **Máscaras Automáticas**:
  - Telefone: `(11) 99999-9999`
  - CPF: `000.000.000-00`
  - CNPJ: `00.000.000/0000-00`
  - RG: `000.000.000-0` (9-10 dígitos)

### 📱 Sistema de Portaria Avançado
- **Leitor QR Code**: Scanner com câmera traseira
- **Busca Manual**: Input para colar link ou ID
- **Upload de Documentos**: Upload real para backend com progresso
- **Validação de Documentos**: Exige pelo menos um documento para registro
- **Registro de Entrada**: Timestamp automático com documentação
- **Interface Otimizada**: Design focado em produtividade da portaria

### 🔒 Sistema de Upload Seguro
- **Validação Dupla**: Frontend e backend
- **Tipos Permitidos**: JPG, PNG, PDF
- **Tamanho Máximo**: 5MB por arquivo
- **Múltiplos Arquivos**: Suporte a vários documentos
- **URLs Reais**: Arquivos armazenados no servidor
- **Progresso Visual**: Feedback durante o upload

## 🔧 Desenvolvimento

### Scripts Disponíveis

```bash
# Desenvolvimento com Vite
npm run dev           # Servidor de desenvolvimento (porta 3000)
npm run dev:3000      # Porta 3000
npm run dev:4000      # Porta 4000
npm run dev:5000      # Porta 5000

# Build e produção
npm run build         # Build para produção
npm run preview       # Preview do build de produção

# Compatibilidade
npm start            # Alias para npm run dev
npm run start:port   # Porta customizada: VITE_PORT=4000 npm run start:port

# Utilitários
npm run test:api     # Testar conexão com API real
npm run test:upload  # Testar funcionalidade de upload
```

### Variáveis de Ambiente

```env
# API Configuration
VITE_USE_REAL_API=true
VITE_API_URL=https://condominio-api-itac.konsilo.online/api

# Upload Configuration
VITE_MAX_FILE_SIZE=5242880
VITE_ALLOWED_FILE_TYPES=image/jpeg,image/png,image/jpg,application/pdf

# Application
VITE_PORT=3000
VITE_APP_NAME="Sistema de Acesso"

# Docker
APP_PORT=3000
```

## 🐛 Solução de Problemas

### Problemas Comuns de Upload

**Upload falha:**
- Verifique tamanho do arquivo (máx. 5MB)
- Confirme tipo do arquivo (apenas JPG, PNG, PDF)
- Verifique conexão com a internet

**Documento não anexado:**
- Certifique-se de que pelo menos um documento foi enviado
- Verifique se o upload foi concluído com sucesso
- Confirme permissões da câmera/documentos no navegador

**Problemas com QR Scanner:**
- Certifique-se de que o HTTPS está habilitado em produção
- Verifique as permissões da câmera no navegador
- Use o modo de busca manual como alternativa

## 🔄 Melhorias Recentes

### 🎯 Versão 4.0.0 - Upload Real de Documentos
- ✅ **Upload Real** - Arquivos enviados para backend via FormData
- ✅ **Validação Avançada** - Tipos e tamanhos de arquivo
- ✅ **URLs Reais** - Documentos armazenados no servidor
- ✅ **Registro Completo** - Check-in com documentação anexada
- ✅ **Progresso de Upload** - Feedback visual durante envio
- ✅ **Validação Obrigatória** - Exige documentos para registro

### 🎯 Versão 3.0.0 - Sistema Completo
- ✅ **Sistema de Portaria** - Leitor QR Code integrado
- ✅ **Upload de Documentos** - Suporte a imagens e PDF
- ✅ **API Híbrida** - Mock local + API real com fallback
- ✅ **Persistência de Dados** - LocalStorage com UUID

### 🎯 Versão 2.0.0 - Migração para Vite
- ✅ **Migração para Vite** - Performance drasticamente melhorada
- ✅ **Builds mais rápidos** - Desenvolvimento e produção
- ✅ **HMR instantâneo** - Atualizações em tempo real

## 📊 Payload de Check-in com Documentos

```json
{
  "autorizacaoId": "d0a7fd1e-76da-45a7-870f-22c56958dfc1",
  "nome": "UBIRAJARA JR",
  "tipo": "Visitante",
  "cpf": "10706404769",
  "rg": "3424332432",
  "periodo": "Unico",
  "dataInicio": "2025-10-24",
  "dataFim": "2025-10-24",
  "portariaResponsavel": "Funcionário Portaria",
  "documentos": [
    {
      "documentoId": "12345",
      "nomeArquivo": "documento.png",
      "tipoArquivo": "image/png",
      "tamanho": 144731,
      "url": "https://api.com/documentos/12345.png",
      "dataUpload": "2025-10-22T21:24:33.064Z"
    }
  ],
  "dataHoraEntrada": "2025-10-22T21:24:54.089Z",
  "tipoRegistro": "entrada_com_documentacao"
}
```

## 👥 Próximas Melhorias

- [ ] **Dashboard Administrativo** - Estatísticas e relatórios
- [ ] **Visualização de Documentos** - Preview integrado
- [ ] **OCR de Documentos** - Leitura automática de dados
- [ ] **Assinatura Digital** - Captura de assinatura na portaria
- [ ] **Relatórios Avançados** - Analytics de acesso e documentos
- [ ] **Sistema de Backup** - Backup automático de documentos

## 🛠 Para Desenvolvedores

### Estrutura de Serviços de Upload
```javascript
// Upload real de documentos
const response = await autorizacoesApi.uploadDocumentoReal(file, autorizacaoId);

// Registro de entrada com documentos
const checkinResponse = await autorizacoesApi.registrarEntradaComDocumentos(payload);
```

### Extensão da API
```javascript
// Adicione novos endpoints em autorizacoesApi.js
async uploadDocumentoReal(file, autorizacaoId) {
  const formData = new FormData();
  formData.append('documento', file);
  formData.append('autorizacaoId', autorizacaoId);
  
  const response = await apiClient.post('/documentos/upload', formData, {
    headers: { 'Content-Type': 'multipart/form-data' }
  });
  
  return response.data;
}
```

---

**Desenvolvido com ❤️ para simplificar o cadastro e controle de acesso em condomínios e empresas.**

**🎉 Sistema 100% funcional com upload real de documentos e integração completa com API!**

**📁 Documentos seguros e acessíveis via URLs reais do servidor**