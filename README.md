# BlogTech Backend (blogtech-be)

> API backend para um sistema de blog moderno, com autenticação JWT, controle de permissões granular, auditoria, rate limit e upload de imagens.

---

## 🚀 Tecnologias

- Node.js + Express
- TypeScript
- Prisma ORM
- PostgreSQL (via Docker)
- JWT Auth
- Zod (validação)
- Multer (upload)

## 📦 Instalação

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
3. **Configure o banco de dados:**
   - Renomeie `.env.example` para `.env` e ajuste as variáveis (ex: `DATABASE_URL`)
   - Suba o banco com Docker:
     ```bash
     docker-compose up -d
     ```
4. **Gere o client Prisma:**
   ```bash
   pnpm prisma generate
   ```
5. **Rode as migrations:**
   ```bash
   pnpm prisma migrate deploy
   ```
6. **Inicie o servidor:**
   ```bash
   pnpm dev
   ```

---

## 🔑 Autenticação & Permissões

- JWT obrigatório para rotas protegidas
- Permissões granulares (ex: `post:update:own`, `user:list`)
- Middleware de ownership: só edita/deleta o que é seu (exceto ADMIN)
- Auditoria de acessos e rate limit

## 📚 Principais Rotas

### Auth

- `POST /auth/login` — Login (retorna token)
- `POST /auth/logout` — Logout (token blacklist)

### Usuários

- `GET /user/` — Listar usuários (ADMIN)
- `GET /user/:id` — Ver perfil
- `POST /user/` — Criar usuário (ADMIN)
- `PUT /user/:id` — Atualizar
- `DELETE /user/:id` — Remover (ADMIN)

### Posts

- `GET /post/` — Listar posts
- `GET /post/:id` — Detalhe
- `GET /post/slug/:slug` — Por slug
- `POST /post/` — Criar (AUTHOR/ADMIN)
- `PUT /post/:id` — Atualizar (dono ou ADMIN)
- `DELETE /post/:id` — Remover (dono ou ADMIN)

### Categorias

- `GET /category/` — Listar
- `GET /category/:id` — Detalhe
- `POST /category/` — Criar (ADMIN)
- `PUT /category/:id` — Atualizar (ADMIN)
- `DELETE /category/:id` — Remover (ADMIN)

### Upload

- `POST /upload/` — Upload de imagem (form-data, campo `image`)

---

## 🛡️ Segurança

- Veja detalhes em [SECURITY.md](SECURITY.md)
- Permissões, ownership, auditoria, rate limit, blacklist de tokens

## 🛠️ Desenvolvimento

- Estrutura modular: `controller/`, `service/`, `repository/`, `middleware/`
- Prisma Client gerado em `src/generated/prisma/`
- Scripts úteis: `pnpm dev`, `pnpm prisma ...`

## 📂 Estrutura de Pastas

```
├── src/
│   ├── controller/      # Lógica dos endpoints
│   ├── service/         # Regras de negócio
│   ├── repositories/    # Acesso ao banco
│   ├── middleware/      # Middlewares globais
│   ├── routes/          # Rotas Express
│   ├── models/          # Tipos e interfaces
│   ├── schemas/         # Validações Zod
│   ├── lib/             # Prisma, seed, etc
│   └── util/            # Helpers
├── prisma/              # Migrations e schema
├── uploads/             # Imagens enviadas
```
