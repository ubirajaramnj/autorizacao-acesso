# Sistema de Cadastro - Visitantes e Prestadores de Serviço

## 📋 Descrição do Projeto

Sistema web desenvolvido em React para cadastro de visitantes e prestadores de serviço em condomínios ou empresas. O sistema gera um QR Code para validação na portaria e oferece um comprovante de impressão profissional.

**✨ Destaque:** Sistema completo com frontend, sistema de portaria e integração com API real.

## 🚀 Funcionalidades

### ✨ Principais Características
- **Cadastro Duplo**: Suporte para visitantes e prestadores de serviço
- **Períodos Flexíveis**: Dia único ou intervalo de datas
- **Validação por QR Code**: Geração automática de QR Code para portaria
- **Sistema de Portaria**: Leitor QR Code integrado com registro de entrada
- **Upload de Documentos**: Anexar imagens e PDFs dos visitantes
- **Comprovante de Impressão**: Layout otimizado para impressão
- **Design Responsivo**: Funciona perfeitamente em desktop, tablet e mobile
- **Validações Completa**: Formulário com validações robustas
- **Máscaras Inteligentes**: CPF, CNPJ, telefone e RG formatados automaticamente
- **Otimização Mobile**: Teclado numérico, áreas de toque ampliadas, UX refinada

### 🎯 Fluxo do Sistema
1. **Cadastro**: Preenchimento do formulário com dados pessoais
2. **Validação**: Verificação automática dos campos obrigatórios
3. **QR Code**: Geração do código com link da API para validação
4. **Portaria**: Leitura do QR Code e registro de entrada
5. **Upload**: Captura de documentos na portaria
6. **Comprovante**: Impressão do recibo com todos os dados

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

### 2. Sistema de Portaria
- Acesse: `http://localhost:3000/portaria`
- Clique em "Ler QR Code" ou cole o link manualmente
- **Sistema busca dados** da API real ou mock
- Verifique os dados do visitante
- Faça **upload de documentos** (opcional)
- Clique em "Registrar Entrada"

### 3. Validação na Portaria
- Apresente o QR Code gerado
- A portaria escaneia o código
- Sistema consulta API em tempo real
- Acesso liberado conforme período autorizado

## 🔄 Sistema Híbrido de API

### 🎯 Funcionamento Inteligente
- **Mock Local**: Dados persistem no localStorage para desenvolvimento
- **API Real**: Integração com backend real em produção
- **Fallback Automático**: Se API real falhar, usa mock automaticamente
- **Mesma Interface**: Componentes não precisam de alterações

### 🔧 Configuração de API
```env
# Usar API real (true/false)
VITE_USE_REAL_API=true

# URL da API real
VITE_API_URL=https://condominio-api-itac.konsilo.online/api

# Porta da aplicação
VITE_PORT=3000
```

### 📡 Endpoints da API Real
- `POST /api/autorizacoes` - Criar autorização
- `GET /api/autorizacoes/{id}` - Buscar autorização por ID
- `POST /api/entradas` - Registrar entrada
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

### 📱 Sistema de Portaria
- **Leitor QR Code**: Scanner com câmera traseira
- **Busca Manual**: Input para colar link ou ID
- **Upload de Documentos**: Suporte a imagens e PDF (até 5MB)
- **Registro de Entrada**: Timestamp automático
- **Interface Otimizada**: Design focado em produtividade

### 🔒 Persistência de Dados
- **LocalStorage**: Dados persistem entre recarregamentos
- **UUID**: Identificadores únicos para evitar conflitos
- **Export/Import**: Backup e restauração de dados
- **Dados de Teste**: Geração automática para desenvolvimento

### 📱 Otimização Mobile Avançada
- **Teclado Numérico**: Para CPF, RG e CNPJ
- **Áreas de Toque Ampliadas**: Botões e inputs fáceis de tocar
- **Radio Buttons Customizados**: Visíveis e intuitivos em todos os dispositivos
- **Campos de Data Otimizados**: Ícone claro e área de toque ampliada
- **Prevenção de Cache**: Meta tags e estratégias anti-cache
- **Font Size 16px**: Previne zoom automático no iOS

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

# Utilitários de desenvolvimento
npm run test:api     # Testar conexão com API real
```

### Variáveis de Ambiente

```env
# API Configuration
VITE_USE_REAL_API=false
VITE_API_URL=https://condominio-api-itac.konsilo.online/api

# Application
VITE_PORT=3000
VITE_APP_NAME="Sistema de Acesso"

# Docker
APP_PORT=3000
```

### Configuração de Portas Flexíveis

```bash
# Desenvolvimento local
VITE_PORT=4000 npm run dev

# Docker com porta customizada
VITE_PORT=4000 APP_PORT=4000 docker-compose up --build

# API real em produção
VITE_USE_REAL_API=true VITE_API_URL=https://sua-api.com/api npm run build
```

## 🐛 Solução de Problemas

### Erros Comuns

**Porta ocupada:**
```bash
# Linux/Mac
sudo lsof -t -i tcp:3000 | xargs kill -9

# Windows
netstat -ano | findstr :3000
taskkill /PID <PID> /F
```

**Problemas com QR Scanner:**
- Certifique-se de que o HTTPS está habilitado em produção
- Verifique as permissões da câmera no navegador
- Use o modo de busca manual como alternativa

**API Real Indisponível:**
- Sistema automaticamente usa mock local
- Dados são mantidos no localStorage
- Funcionalidade completa preservada

**Problemas com Docker:**
```bash
docker-compose down
docker system prune -f
docker-compose up --build
```

## 📦 Build para Produção

### Com Vite
```bash
# Build para produção
npm run build

# Preview do build
npm run preview
```

### Com Docker
```bash
# Build e execução
docker-compose up --build

# Apenas build
docker-compose build
```

## 🚀 Deploy

### Opção 1: Servidor Web Estático
- Execute `npm run build`
- Sirva a pasta `dist/` com seu servidor web (Nginx, Apache)

### Opção 2: Container Docker
- Build da imagem Docker
- Deploy em qualquer serviço de containers (Kubernetes, ECS)

### Opção 3: Plataformas Cloud
- **Netlify/Vercel**: Deploy automático do build estático
- **AWS S3 + CloudFront**: Hospedagem estática com CDN
- **Heroku**: Deploy com container Docker

### Configuração de Produção
```env
VITE_USE_REAL_API=true
VITE_API_URL=https://sua-api-real.com/api
VITE_PORT=443
NODE_ENV=production
```

## 🔒 Segurança e Validações

- Validação de formato de email
- Verificação de CPF/CNPJ (formato)
- Prevenção de datas retroativas
- Sanitização de entradas
- Validação de períodos lógicos
- Campos obrigatórios: Nome, Telefone, CPF, RG
- Upload seguro de documentos com validação de tipo e tamanho

## 📱 Responsividade

O sistema é totalmente responsivo e foi otimizado para:

### ✅ Desktop (1920x1080+)
- Layout tradicional com formulário centralizado
- Campos lado a lado quando apropriado
- Navegação por abas entre cadastro/portaria

### ✅ Tablet (768x1024)
- Layout adaptativo
- Radio buttons em coluna
- Áreas de toque adequadas
- Scanner QR em tamanho otimizado

### ✅ Mobile (375x667)
- **Teclado numérico** para campos de documento
- **Áreas de toque ampliadas** (min-height: 44px)
- **Radio buttons customizados** visíveis e claros
- **Campos de data** com ícone e placeholder intuitivos
- **Scanner QR** em tela cheia quando ativado
- **Prevenção de zoom** automático no iOS

### ✅ Impressão (layout otimizado)
- Comprovante profissional
- QR Code incluído
- Informações completas
- Design limpo e legível

## 🔄 Melhorias Recentes

### 🎯 Versão 3.0.0 - Sistema Completo
- ✅ **Sistema de Portaria** - Leitor QR Code integrado
- ✅ **Upload de Documentos** - Suporte a imagens e PDF
- ✅ **API Híbrida** - Mock local + API real com fallback
- ✅ **Persistência de Dados** - LocalStorage com UUID
- ✅ **Interface Unificada** - Navegação entre cadastro/portaria

### 🎯 Versão 2.0.0 - Migração para Vite
- ✅ **Migração de react-scripts para Vite** - Performance drasticamente melhorada
- ✅ **Builds mais rápidos** - Desenvolvimento e produção
- ✅ **HMR instantâneo** - Atualizações em tempo real sem refresh
- ✅ **Configuração simplificada** - Vite config mais enxuto

### 🎯 Versão 1.1.0 - Otimização Mobile
- ✅ Teclado numérico para CPF, RG e CNPJ
- ✅ Radio buttons visíveis em todos os dispositivos
- ✅ Campos de data com UX melhorada
- ✅ Prevenção de cache em mobile
- ✅ Áreas de toque ampliadas
- ✅ Validações compatíveis com máscaras

## 👥 Próximas Melhorias

- [ ] **Dashboard Administrativo** - Estatísticas e relatórios
- [ ] **Notificações em Tempo Real** - WebSocket para atualizações
- [ ] **Biometria Facial** - Reconhecimento facial na portaria
- [ ] **Relatórios Avançados** - Analytics e métricas de acesso
- [ ] **Sistema Multi-Condomínio** - Suporte a múltiplas unidades
- [ ] **App Mobile** - Versão nativa para iOS e Android
- [ ] **Integração com Câmeras** - Captura automática na entrada

## 🛠 API e Desenvolvimento

### Para Desenvolvedores

**Estrutura de Serviços:**
```javascript
// Uso nos componentes
import { apiService } from './services/apiService';

// O serviço decide automaticamente entre mock e API real
const response = await apiService.cadastrarVisitante(dados);
const autorizacao = await apiService.buscarAutorizacaoPorId(id);
```

**Extensão da API:**
```javascript
// Adicione novos endpoints em realApi.js
async novoEndpoint(dados) {
  const response = await apiClient.post('/novo-endpoint', dados);
  return response.data;
}
```

## 👥 Contribuição

1. Fork o projeto
2. Crie uma branch para sua feature (`git checkout -b feature/AmazingFeature`)
3. Commit suas mudanças (`git commit -m 'Add some AmazingFeature'`)
4. Push para a branch (`git push origin feature/AmazingFeature`)
5. Abra um Pull Request

### Guidelines de Contribuição
- Mantenha a compatibilidade com o sistema híbrido de API
- Adicione testes para novas funcionalidades
- Documente novas variáveis de ambiente
- Mantenha a responsividade mobile

## 📄 Licença

Este projeto está sob a licença MIT. Veja o arquivo `LICENSE` para mais detalhes.

## 📞 Suporte

Para dúvidas ou problemas:
1. Verifique a seção de troubleshooting
2. Consulte os issues abertos no repositório
3. Crie um novo issue com detalhes do problema
4. Para suporte técnico: [email/contato]

---

**Desenvolvido com ❤️ para simplificar o cadastro e controle de acesso em condomínios e empresas.**

**🎉 Sistema 100% funcional com frontend, portaria e integração API real!**

**🏗️ Arquitetura escalável preparada para produção**