# Sistema de Cadastro - Visitantes e Prestadores de Serviço

## 📋 Descrição do Projeto

Sistema web desenvolvido em React para cadastro de visitantes e prestadores de serviço em condomínios ou empresas. O sistema gera um QR Code para validação na portaria e oferece um comprovante de impressão profissional.

**✨ Destaque:** Sistema totalmente otimizado para dispositivos móveis com experiência de usuário excepcional.

## 🚀 Funcionalidades

### ✨ Principais Características
- **Cadastro Duplo**: Suporte para visitantes e prestadores de serviço
- **Períodos Flexíveis**: Dia único ou intervalo de datas
- **Validação por QR Code**: Geração automática de QR Code para portaria
- **Comprovante de Impressão**: Layout otimizado para impressão
- **Design Responsivo**: Funciona perfeitamente em desktop, tablet e mobile
- **Validações Completa**: Formulário com validações robustas
- **Máscaras Inteligentes**: CPF, CNPJ, telefone e RG formatados automaticamente
- **Otimização Mobile**: Teclado numérico, áreas de toque ampliadas, UX refinada

### 🎯 Fluxo do Sistema
1. **Cadastro**: Preenchimento do formulário com dados pessoais
2. **Validação**: Verificação automática dos campos obrigatórios
3. **QR Code**: Geração do código para validação na portaria
4. **Comprovante**: Impressão do recibo com todos os dados

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
│   │   └── InputNumero/ (componentes customizados)
│   ├── services/
│   │   └── api.js (mock da API)
│   ├── utils/
│   │   └── masks.js (utilitários de máscaras)
│   ├── styles/
│   │   ├── globals.css
│   │   ├── responsive.css
│   │   └── print.css
│   ├── App.jsx (componente raiz)
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

### 1. Cadastro de Visitante
- Selecione "Visitante"
- Preencha dados pessoais (nome, email opcional, telefone, CPF, RG)
- Escolha data única ou período
- Clique em "Cadastrar"

### 2. Cadastro de Prestador
- Selecione "Prestador de Serviço"
- Preencha dados pessoais + empresa (CNPJ opcional)
- Defina o período de serviço
- Clique em "Cadastrar"

### 3. Validação na Portaria
- Apresente o QR Code gerado
- A portaria valida o código
- Acesso liberado conforme período autorizado

## 📊 Funcionalidades Detalhadas

### Formulário Inteligente
- **Campos Condicionais**: Empresa e CNPJ só aparecem para prestadores
- **Validações em Tempo Real**: Feedback imediato para o usuário
- **Máscaras Automáticas**:
  - Telefone: `(11) 99999-9999`
  - CPF: `000.000.000-00`
  - CNPJ: `00.000.000/0000-00`
  - RG: `000.000.000-0` (9-10 dígitos)

### 📱 Otimização Mobile Avançada
- **Teclado Numérico**: Para CPF, RG e CNPJ
- **Áreas de Toque Ampliadas**: Botões e inputs fáceis de tocar
- **Radio Buttons Customizados**: Visíveis e intuitivos em todos os dispositivos
- **Campos de Data Otimizados**: Ícone claro e área de toque ampliada
- **Prevenção de Cache**: Meta tags e estratégias anti-cache
- **Font Size 16px**: Previne zoom automático no iOS

### Sistema de Períodos
- **Dia Único**: Uma data específica
- **Intervalo**: Data de início e fim
- **Validações**: Não permite datas retroativas

### QR Code e Comprovante
- **QR Code Dinâmico**: Contém todos os dados do cadastro
- **Comprovante Otimizado**: Impressão limpa e profissional
- **Informações Completas**: Todos os dados relevantes para portaria

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
```

### Variáveis de Ambiente

```env
# Porta da aplicação Vite
VITE_PORT=3000

# API URL (para futuras integrações)
VITE_APP_API_URL=http://localhost:3001

# Variáveis para Docker
APP_PORT=3000
```

### Configuração de Portas Flexíveis

O sistema suporta execução em qualquer porta:

```bash
# Desenvolvimento local
VITE_PORT=4000 npm run dev

# Docker com porta customizada
VITE_PORT=4000 APP_PORT=4000 docker-compose up --build

# Usando arquivo .env
cp .env.example .env
# Edite as portas no .env e execute:
docker-compose --env-file .env up --build
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

**Dependências corrompidas:**
```bash
rm -rf node_modules package-lock.json
npm install
```

**Problemas de cache no mobile:**
- O sistema inclui meta tags anti-cache
- Força reload em navegação por cache

**Problemas com Docker:**
```bash
docker-compose down
docker system prune -f
docker-compose up --build
```

## 📦 Build para Produção

### Com Vite
```bash
npm run build
```

### Com Docker
```bash
docker-compose up --build
```

## 🚀 Deploy

### Opção 1: Servidor Web Estático
- Execute `npm run build`
- Sirva a pasta `dist/` com seu servidor web

### Opção 2: Container Docker
- Build da imagem Docker
- Deploy em qualquer serviço de containers

### Opção 3: Plataformas Cloud
- Netlify, Vercel, AWS S3, etc.

## 🔒 Segurança e Validações

- Validação de formato de email
- Verificação de CPF/CNPJ (formato)
- Prevenção de datas retroativas
- Sanitização de entradas
- Validação de períodos lógicos
- Campos obrigatórios: Nome, Telefone, CPF, RG

## 📱 Responsividade

O sistema é totalmente responsivo e foi otimizado para:

### ✅ Desktop (1920x1080+)
- Layout tradicional com formulário centralizado
- Campos lado a lado quando apropriado

### ✅ Tablet (768x1024)
- Layout adaptativo
- Radio buttons em coluna
- Áreas de toque adequadas

### ✅ Mobile (375x667)
- **Teclado numérico** para campos de documento
- **Áreas de toque ampliadas** (min-height: 44px)
- **Radio buttons customizados** visíveis e claros
- **Campos de data** com ícone e placeholder intuitivos
- **Prevenção de zoom** automático no iOS
- **Otimização de performance** para conexões móveis

### ✅ Impressão (layout otimizado)
- Comprovante profissional
- QR Code incluído
- Informações completas

## ⚡ Migração para Vite - Benefícios

### 🚀 Performance Melhorada
- **Inicialização ultrarrápida** do servidor de desenvolvimento
- **HMR (Hot Module Replacement)** instantâneo
- **Build otimizado** para produção com Rollup

### 🔧 Configuração Simplificada
- **Configuração zero** para a maioria dos projetos
- **Plugin system** extensível
- **Variáveis de ambiente** prefixadas com `VITE_`

### 📦 Desenvolvimento Moderno
- **Suporte nativo** para ES modules
- **TypeScript** integrado
- **CSS** e **assets** otimizados

## 🔄 Melhorias Recentes

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

### 🎯 Versão 1.0.0 - Funcionalidades Base
- ✅ Cadastro de visitantes e prestadores
- ✅ Geração de QR Code
- ✅ Comprovante de impressão
- ✅ Validações de formulário
- ✅ Máscaras automáticas

## 👥 Próximas Melhorias

- [ ] **Listagem de Cadastros** - Visualizar todos os registros
- [ ] **Sistema de Validação** - Página para portaria validar QR Codes
- [ ] **Dashboard Administrativo** - Estatísticas e relatórios
- [ ] **API Real** - Substituir mock por backend
- [ ] **Notificações** - Alertas por email/whatsapp
- [ ] **Upload de Documentos** - Anexar imagens/documentos

## 👥 Contribuição

1. Fork o projeto
2. Crie uma branch para sua feature (`git checkout -b feature/AmazingFeature`)
3. Commit suas mudanças (`git commit -m 'Add some AmazingFeature'`)
4. Push para a branch (`git push origin feature/AmazingFeature`)
5. Abra um Pull Request

## 📄 Licença

Este projeto está sob a licença MIT. Veja o arquivo `LICENSE` para mais detalhes.

## 📞 Suporte

Para dúvidas ou problemas:
1. Verifique a seção de troubleshooting
2. Consulte os issues abertos
3. Crie um novo issue com detalhes do problema

---

**Desenvolvido com ❤️ para simplificar o cadastro e controle de acesso em condomínios e empresas.**

**🎉 Sistema 100% funcional e otimizado para mobile com performance Vite!**