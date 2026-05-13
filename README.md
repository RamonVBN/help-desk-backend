# 📌 HelpDesk API

API REST para gerenciamento de chamados de suporte de T.I., desenvolvida com **Node.js**, **Express.js** e **TypeScript**, utilizando autenticação via cookies HTTP-only, RBAC (Role-Based Access Control) e Prisma ORM.

A aplicação é responsável por centralizar toda a lógica de negócio do sistema HelpDesk, permitindo gerenciamento de chamados, usuários, serviços, uploads e controle de permissões.

---

# 🚀 Tecnologias

## Backend

* [x] Node.js
* [x] TypeScript
* [x] Express 5
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

# ⚙️ Instalação e uso

## Clonar repositório

```bash
git clone https://github.com/ramonvbn/help-desk-backend.git
```

## Entrar na pasta do projeto

```bash
cd help-desk-backend
```

## Instalar dependências

```bash
npm install
```

## Rodar migrations

```bash
npx prisma migrate dev
```

## Executar seeds de desenvolvimento

```bash
npm run seed:dev
```

## Iniciar servidor

```bash
npm run dev
```

Servidor disponível em:

```bash
http://localhost:3333
```

---

# ⚙️ Variáveis de ambiente

Crie um arquivo `.env`:

```env
NODE_ENV=
PORT=
DATABASE_URL="..."
JWT_SECRET="..."
BASE_URL="..."
CLIENT_BASE_URL="..."

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

## ADMIN

Gerencia toda a aplicação:

* Usuários
* Chamados
* Serviços
* Técnicos
* Perfis de outros usuários

## TECHNICIAN

Responsável pelo atendimento técnico:

* Gerencia chamados atribuídos
* Atualiza status de chamados
* Gerencia serviços adicionais
* Atualiza o próprio perfil

## CLIENT

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

# 🌱 Seeds

## Seed padrão

```bash
npm run seed
```

## Seed de desenvolvimento

```bash
npm run seed:dev
```

## Seed de produção

```bash
npm run seed:prod
```

---

# 🧪 Testes

## Executar testes

```bash
npm run test
```

A aplicação utiliza:

* Jest
* Supertest

---

# 📦 Scripts disponíveis

| Script              | Descrição                           |
| ------------------- | ----------------------------------- |
| `npm run dev`       | Executa servidor em desenvolvimento |
| `npm run build`     | Gera build da aplicação             |
| `npm run start`     | Executa build de produção           |
| `npm run test`      | Executa testes                      |
| `npm run seed`      | Executa seed padrão                 |
| `npm run seed:dev`  | Executa seed de desenvolvimento     |
| `npm run seed:prod` | Executa seed de produção            |

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

Desenvolvido por Ramon Victor Barros Nunes.

* GitHub: [https://github.com/RamonVBN](https://github.com/RamonVBN)
* LinkedIn: [https://linkedin.com/in/ramon-barros-4a107837a](https://linkedin.com/in/ramon-barros-4a107837a)
  
