# 📌 HelpDesk API

API para gerenciamento de chamados de suporte de T.I.

---

## 🚀 Tecnologias

- [x] Node.js
- [X] Typescript
- [x] Express  
- [x] Prisma  
- [x] PostgreSQL
- [X] Zod
- [X] Multer
- [X] Bcrypt
- [X] JWT
- [X] Jest
- [X] Supertest
- [x] Outras...

---

## ⚙️ Instalação

```bash
# Clonar o repositório
git clone https://github.com/ramonvbn/help-desk-backend.git

# Entrar na pasta
cd help-desk-backend

# Instalar dependências
npm install

# Rodar migrations (se houver)
npx prisma migrate dev

# Rodar seeds de desenvolvimento
npm run seed:dev

# Iniciar o servidor
npm run dev

```
---

```bash

# Variáveis de ambiente
DATABASE_URL="..."
JWT_SECRET="..."
```
---

🪪 Cargos

ADMIN - Gerencia toda a aplicação, chamados, serviços, seu próprio perfil e de outros usuários.

TECHNICIAN - Gerencia os chamados atribuídos a ele e seu próprio perfil.

CLIENT - Capaz de criar novos chamados, acompanhá-los e gerenciar o próprio perfil. 

---

📚 Endpoints

🔐 🔑 Sessões

POST /sessions → Faz login e seta cookie HttpOnly.

DELETE /sessions → Remove cookie de sessão, logout.


🎫 Chamados

GET /calleds → Lista chamados. (Todos os usuários, porém com comportamento diferente para cada um)

POST /calleds → Cria chamado. (Apenas cliente)

GET /calleds/:id → Detalhes de um chamado. (Todos os usuários.)

PATCH /calleds/:id → Atualiza status do chamado. (Apenas administrador e técnico)


💰 Serviços

POST /services → Cria serviço. (Apenas administrador)

GET /services → Lista serviços. (Adminstrador e cliente)

PUT /services/:id → Atualiza nome e preço do serviço. (Apenas administrador)

PATCH /services/:id → Atualiza status do serviço. (Apenas administrador)


🤳 Uploads

POST /uploads → Faz upload de uma foto de perfil. (Todos os usuários)

DELETE /uploads → Remove a foto do perfil. (Todos os usuários)


🫏 Usuários

POST /users → Cria uma conta de usuário. (Cliente e administrador)

GET /users/me → Informações do usuário logado. (Todos os usuários)

GET /users/id → Informações de um usuário específico, não sendo o usuário logado. (Apenas administrador)

GET /users?role=ROLE → Lista usuários por role, necessário informá-la. (Apenas administrador)

PUT /users/:id → Atualiza nome, email, senha e carga horário, depende da role do usuário. (Todos os usuários)

DELETE /users/:id → Excluí uma conta de usuário. (Apenas administrador)


💸 Serviços adicionais

POST /additional-services → Cria um serviço adicional.  (Apenas técnico)

DELETE /additional-services → Excluí um serviço adicional. (Apenas técnico)

---

✅ Status

- [X] Em desenvolvimento
- [ ] Em produção

---

🗿 Autor

Ramon Barros – @RamonVBN


