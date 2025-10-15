# Sistema de Cadastro - Visitantes e Prestadores de Serviço

## 📋 Descrição do Projeto

Sistema web desenvolvido em React para cadastro de visitantes e prestadores de serviço em condomínios ou empresas. O sistema gera um QR Code para validação na portaria e oferece um comprovante de impressão profissional.

## 🚀 Funcionalidades

### ✨ Principais Características
- **Cadastro Duplo**: Suporte para visitantes e prestadores de serviço
- **Períodos Flexíveis**: Dia único ou intervalo de datas
- **Validação por QR Code**: Geração automática de QR Code para portaria
- **Comprovante de Impressão**: Layout otimizado para impressão
- **Design Responsivo**: Funciona em desktop, tablet e mobile
- **Validações Completa**: Formulário com validações robustas
- **Máscaras Inteligentes**: CPF, CNPJ, telefone e RG formatados automaticamente

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
- **react-scripts** 5.0.1 - Ferramentas de build e desenvolvimento
- **Docker** - Containerização da aplicação
- **Docker Compose** - Orquestração de containers

## 📁 Estrutura do Projeto

```
form-cadastro/
├── public/
│   ├── index.html
│   ├── manifest.json
│   ├── robots.txt
│   └── LogoSolar.jpg (logo da empresa)
├── src/
│   ├── components/
│   │   ├── CadastroForm.js (formulário principal)
│   │   └── QRCodeDisplay.js (modal do QR Code)
│   ├── services/
│   │   └── api.js (mock da API)
│   ├── utils/
│   │   └── masks.js (utilitários de máscaras)
│   ├── styles/
│   │   └── App.css (estilos principais)
│   ├── App.js (componente raiz)
│   └── index.js (ponto de entrada)
├── Dockerfile
├── docker-compose.yml
├── package.json
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
npm start
```

A aplicação estará disponível em: `http://localhost:3000`

### Instalação com Docker

```bash
# Build e execução
docker-compose up --build

# Execução em background
docker-compose up -d
```

## 🎮 Como Usar

### 1. Cadastro de Visitante
- Selecione "Visitante"
- Preencha dados pessoais (nome, email, telefone, CPF/RG)
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
  - RG: `00.000.000-0`

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
# Desenvolvimento
npm start          # Servidor de desenvolvimento
npm test           # Executa testes
npm run build      # Build para produção
npm run eject      # Ejetar configurações (irreversível)
```

### Variáveis de Ambiente
O projeto utiliza `process.env.PUBLIC_URL` para recursos estáticos.

### Estrutura de Componentes

#### CadastroForm.js
- Gerencia o estado do formulário
- Aplica validações
- Controla máscaras e formatações
- Comunica com a API

#### QRCodeDisplay.js
- Exibe modal com resumo
- Gera QR Code
- Controla impressão do comprovante

## 🐛 Solução de Problemas

### Erros Comuns

**Porta 3000 ocupada:**
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

**Problemas com Docker:**
```bash
docker-compose down
docker system prune -f
docker-compose up --build
```

## 📦 Build para Produção

### Com npm
```bash
npm run build
```

### Com Docker
```bash
docker-compose -f docker-compose.prod.yml up --build
```

## 🚀 Deploy

### Opção 1: Servidor Web Estático
- Execute `npm run build`
- Sirva a pasta `build/` com seu servidor web

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

## 📱 Responsividade

O sistema é totalmente responsivo e foi testado em:
- ✅ Desktop (1920x1080+)
- ✅ Tablet (768x1024)
- ✅ Mobile (375x667)
- ✅ Impressão (layout otimizado)

## 🔄 Próximas Melhorias

- [ ] Integração com API real
- [ ] Sistema de autenticação
- [ ] Listagem de cadastros
- [ ] Relatórios e estatísticas
- [ ] Notificações por email
- [ ] Validação de CPF/CNPJ real
- [ ] Backup automático de dados
- [ ] Múltiplos idiomas

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