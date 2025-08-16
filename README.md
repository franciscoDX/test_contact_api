# Backend - API de Contatos

API RESTful desenvolvida em Node.js com Express para gerenciamento de contatos (CRUD).Integração com banco de dados relacional (MySQL/MariaDB) e suporte a upload de arquivos.

## 🚀 Tecnologias Utilizadas

- **Node.js**: 20.x
- **Express**: 4.18
- **MySQL2**: 3.6
- **Multer**: Upload de arquivos
- **Dotenv**: Variáveis de ambiente
- **CORS**: Habilitação de CORS

## 📋 Pré-requisitos

- Node.js 22.x ou superior
- NPM

## Banco de dados MySQL/MariaDB configurado

## ▶️ Instalação e Execução

# Clonar o repositório
git clone url-repo
cd contacts-backend

# Instalar dependências
npm install

# Criar arquivo .env com configuração do banco
cp .env.example .env

# Rodar em desenvolvimento
npm run dev

# Rodar em produção
npm start

## 📌 Endpoints Principais

- GET /contacts → Listar todos os contatos

- GET /contacts/:id → Obter contato por ID

- POST /contacts → Criar novo contato

- PUT /contacts/:id → Atualizar contato

- DELETE /contacts/:id → Remover contato

## 📝 Scripts Disponíveis

npm run dev # Executa com nodemon

⚡ Nota: Este backend foi desenvolvido como parte de um teste técnico para demonstrar habilidades em desenvolvimento de APIs REST com Node.js e Express.