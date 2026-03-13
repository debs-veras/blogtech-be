# BlogTech Backend (blogtech-be)

> API backend para um sistema de blog moderno, com autenticação JWT, controle de permissões granular, auditoria, rate limit e upload de imagens.

---

## 🚀 Tecnologias

- **Node.js + Express** (Runtime e Framework)
- **TypeScript** (Linguagem)
- **Prisma ORM** (Modelagem de dados)
- **PostgreSQL** (Banco de dados)
- **Docker** (Containerização)
- **JWT Auth** (Segurança)
- **Zod** (Validação de schemas)
- **Multer + Cloudinary** (Upload de imagens)
- **Sharp** (Processamento de imagens)

---

## 📦 Instalação e Execução

### Pré-requisitos
- [Node.js](https://nodejs.org/) (v18+)
- [Docker](https://www.docker.com/) e [Docker Compose](https://docs.docker.com/compose/)
- [pnpm](https://pnpm.io/) (recomendado) ou npm

### Passo a Passo

1. **Clone o repositório:**
   ```bash
   git clone <repo-url>
   cd blogtech-be
   ```

2. **Instale as dependências:**
   ```bash
   pnpm install
   # ou npm install
   ```

3. **Configure as Variáveis de Ambiente:**
   - Copie o arquivo de exemplo:
     ```bash
     cp .env.example .env
     ```
   - Ajuste o `.env` conforme necessário (veja a seção [Variáveis de Ambiente](#-variáveis-de-ambiente)).

4. **Suba o Banco de Dados (Docker):**
   ```bash
   docker-compose up -d
   ```

5. **Prepare o Prisma:**
   - Gere o client:
     ```bash
     pnpm prisma generate
     ```
   - Execute as migrations para criar as tabelas:
     ```bash
     pnpm prisma migrate dev
     ```

6. **Seed do Banco de Dados:**
   - Popule o banco com dados iniciais (usuário admin):
     ```bash
     pnpm seed
     ```

7. **Inicie o Servidor:**
   ```bash
   pnpm dev
   ```
   A API estará disponível em `http://localhost:3000`.

---

## 🔑 Usuário Padrão (Seed)

Após executar o comando `pnpm seed`, o seguinte usuário será criado para acesso inicial:

| Campo | Valor |
| :--- | :--- |
| **Email** | `admin@blogtech.com` |
| **Senha** | `admin123` |
| **Role** | `ADMIN` |

---

## ⚙️ Variáveis de Ambiente

O arquivo `.env` deve conter as seguintes chaves:

- `DATABASE_URL`: URL de conexão com o PostgreSQL (ex: `postgresql://bloguser:blogpassword@localhost:5432/blogdb`).
- `JWT_SECRET`: Chave secreta para geração dos tokens JWT.
- `PORT`: Porta onde o servidor Express será executado (padrão: 3000).
- `CLOUDINARY_*`: Credenciais para o serviço de upload de imagens Cloudinary.

---

## 📚 Principais Rotas

### Autenticação (`/auth`)
- `POST /auth/login` — Autenticação de usuário.
- `POST /auth/logout` — Logout (blacklist de token).

### Usuários (`/user`)
- `GET /user/` — Listar usuários (ADMIN).
- `POST /user/` — Criar novo usuário (ADMIN).
- `GET /user/:id` — Ver detalhe de perfil.
- `PUT /user/:id` — Atualizar perfil.
- `DELETE /user/:id` — Remover usuário (ADMIN).

### Posts (`/post`)
- `GET /post/` — Listar todos os posts.
- `GET /post/:id` — Detalhe do post por ID.
- `GET /post/slug/:slug` — Buscar post pelo slug amigável.
- `POST /post/` — Criar novo post (AUTHOR/ADMIN).
- `PUT /post/:id` — Atualizar post (Dono ou ADMIN).
- `DELETE /post/:id` — Remover post (Dono ou ADMIN).

### Categorias (`/category`)
- Rotas para gerenciamento de categorias (CRUD completo).

### Upload (`/upload`)
- `POST /upload/` — Upload de imagem (form-data, campo `image`).

---

## 📂 Estrutura de Pastas

```
├── src/
│   ├── controller/      # Controladores da API
│   ├── service/         # Camada de serviços (regras de negócio)
│   ├── repositories/    # Camada de persistência (Prisma)
│   ├── middleware/      # Middlewares (auth, roles, error)
│   ├── routes/          # Definição das rotas Express
│   ├── models/          # Tipos e interfaces TypeScript
│   ├── schemas/         # Validações Zod
│   ├── lib/             # Configurações (Prisma, Cloudinary, Seed)
│   └── util/            # Funções utilitárias
├── prisma/              # Schema e Migrations do Prisma
└── docker-compose.yml   # Configuração do banco PostgreSQL
```
