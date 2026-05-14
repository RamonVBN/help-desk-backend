#  HelpDesk API

API REST para gerenciamento de chamados de suporte de T.I., desenvolvida com **Node.js**, **Express.js** e **TypeScript**, utilizando autenticação via cookies HTTP-only, RBAC (Role-Based Access Control) e Prisma ORM.

A aplicação é responsável por centralizar toda a lógica de negócio do sistema HelpDesk, permitindo gerenciamento de chamados, usuários, serviços, uploads e controle de permissões.

---

## Deploy

https://help-desk-backend-noo8.onrender.com

---

## Frontend
Interface web da aplicação HelpDesk:

https://github.com/ramonvbn/help-desk-frontend

---

# 🚀 Tecnologias

## Backend

* [x] Node.js
* [x] TypeScript
* [x] Express 
* [x] Prisma ORM
* [x] PostgreSQL
* [x] Zod
* [x] Multer
* [x] Bcrypt
* [x] JWT
* [x] Cloudinary
* [x] Day.js

## Testes

* [x] Jest
* [x] Supertest

---

# ⚙️ Variáveis de ambiente

```env
PORT=
NODE_ENV=
BASE_URL="..."
CLIENT_BASE_URL="..."
SECRET="..."
DATABASE_URL="..."

CLOUDINARY_CLOUD_NAME=
CLOUDINARY_API_KEY=
CLOUDINARY_API_SECRET=
```

---

# 🔐 Autenticação e autorização

A API utiliza:

* JWT para autenticação
* Cookies HTTP-only
* Controle de permissões baseado em roles (RBAC)
* Middleware de autenticação
* Hash de senha com bcrypt

---

# 🪪 Cargos

## ADMINISTRADOR

Gerencia toda a aplicação:

* Usuários
* Chamados
* Serviços
* Técnicos
* Perfis de outros usuários

## TÉCNICO

Responsável pelo atendimento técnico:

* Gerencia chamados atribuídos
* Atualiza status de chamados
* Gerencia serviços adicionais
* Atualiza o próprio perfil

## CLIENTE

Usuário cliente da plataforma:

* Cria chamados
* Acompanha chamados
* Gerencia o próprio perfil

---

# 📚 Endpoints

## 🔐 Sessões

| Método | Endpoint    | Descrição                           |
| ------ | ----------- | ----------------------------------- |
| POST   | `/sessions` | Faz login e define cookie HTTP-only |
| DELETE | `/sessions` | Remove cookie de sessão (logout)    |

---

## 🎫 Chamados

| Método | Endpoint       | Descrição                  |
| ------ | -------------- | -------------------------- |
| GET    | `/calleds`     | Lista chamados             |
| POST   | `/calleds`     | Cria novo chamado          |
| GET    | `/calleds/:id` | Detalhes de um chamado     |
| PATCH  | `/calleds/:id` | Atualiza status do chamado |

### Permissões

* CLIENT → Criação e acompanhamento
* TECHNICIAN → Atualização dos chamados atribuídos
* ADMIN → Controle total

---

## 💰 Serviços

| Método | Endpoint        | Descrição                  |
| ------ | --------------- | -------------------------- |
| POST   | `/services`     | Cria serviço               |
| GET    | `/services`     | Lista serviços             |
| PUT    | `/services/:id` | Atualiza nome e preço      |
| PATCH  | `/services/:id` | Atualiza status do serviço |

### Permissões

* ADMIN → Controle total
* CLIENT → Apenas visualização

---

## 🤳 Uploads

| Método | Endpoint   | Descrição                |
| ------ | ---------- | ------------------------ |
| POST   | `/uploads` | Upload de foto de perfil |
| DELETE | `/uploads` | Remove foto de perfil    |

### Recursos

* Upload com Multer
* Integração com Cloudinary
* Validação de tamanho e tipo de arquivo

---

## 🫏 Usuários

| Método | Endpoint           | Descrição                    |
| ------ | ------------------ | ---------------------------- |
| POST   | `/users`           | Cria conta de usuário        |
| GET    | `/users/me`        | Dados do usuário autenticado |
| GET    | `/users/:id`       | Dados de usuário específico  |
| GET    | `/users?role=ROLE` | Lista usuários por role      |
| PUT    | `/users/:id`       | Atualiza dados do usuário    |
| DELETE | `/users/:id`       | Remove conta de usuário      |

### Permissões

* ADMIN → Controle total
* CLIENT → Próprio perfil
* TECHNICIAN → Próprio perfil

---

## 💸 Serviços adicionais

| Método | Endpoint               | Descrição                |
| ------ | ---------------------- | ------------------------ |
| POST   | `/additional-services` | Cria serviço adicional   |
| DELETE | `/additional-services` | Remove serviço adicional |

### Permissões

* Apenas TECHNICIAN

---

# 🏗️ Arquitetura e padrões

O projeto segue padrões como:

* Arquitetura em camadas
* Controllers e Middlewares
* Tipagem forte com TypeScript
* Validação com Zod
* ORM com Prisma
* Separação de responsabilidades

---

# 👨‍💻 Autor

Desenvolvido por **Ramon Victor Barros Nunes**.

* GitHub: [https://github.com/RamonVBN](https://github.com/RamonVBN)
* LinkedIn: [https://linkedin.com/in/ramon-barros-4a107837a](https://linkedin.com/in/ramon-barros-4a107837a)
  
