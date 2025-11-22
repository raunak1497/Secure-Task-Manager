# TurboVets – Secure Task Management System (Full‑Stack | RBAC | Audit Logging)

This repository contains a **full‑stack secure task management system** built using:

- **NestJS (TypeScript)** for backend  
- **Next.js (React, TypeScript)** for frontend  
- **Nx Monorepo** architecture  
- **SQLite + TypeORM**  
- **Role‑Based Access Control (RBAC)**  
- **Audit Logging System**  
- **JWT Authentication**  
- **Kanban Board UI with Drag & Drop**

---

# 📌 Table of Contents
1. [Setup Instructions](#setup-instructions)
2. [Environment Variables](#environment-variables)
3. [Architecture Overview](#architecture-overview)
4. [Data Model + ERD](#data-model--erd)
5. [Access Control (RBAC) Design](#access-control-rbac-design)
6. [JWT Authentication Flow](#jwt-authentication-flow)
7. [API Documentation](#api-documentation)
8. [Future Improvements](#future-improvements)

---

# 🚀 Setup Instructions

## 1️⃣ Install Dependencies
```sh
npm install
```

## 2️⃣ Run Backend
```sh
npx nx serve api
```
Backend will start at:  
👉 **http://localhost:3000**

## 3️⃣ Run Frontend
```sh
npx nx dev turbovets
```
Frontend will start at:  
👉 **http://localhost:4200** (or port chosen by Nx)

---

# 🔐 Environment Variables

Create **api/.env**:

```
JWT_SECRET=my_super_secret_key
DB_PATH=./database.sqlite
```

(These are already wired into the TypeORM + JWT config.)

---

# 🏗 Architecture Overview

### 🔹 Nx Monorepo Structure

```
/apps
  /api        → NestJS backend
  /turbovets  → Next.js frontend

/libs
  /auth       → Shared auth decorators (`@Roles()`)
```

### Why Nx?

- Shared code between backend & frontend
- Fast incremental builds
- Isolated apps but common libraries
- Great for interviews + scalable for production micro‑frontends

---

# 🗄 Data Model + ERD

### Entities:
- **User** (id, email, name, password, role, organization)
- **Organization**
- **Task** (title, description, status)
- **AuditLog** (user + action + timestamp)

### ERD:

```
Organization 1 ────┐
                    │
                    │
       User *────────────┐
                          │
                          │
                    Task *
```

Audit Log tracks:
```
User --performed--> Action (Task Create/Edit/Delete, Login, etc)
```

---

# 🔒 Access Control (RBAC) Design

### Roles:
| Role   | Capabilities |
|--------|--------------|
| **Owner** | Full access + all audit logs |
| **Admin** | CRUD tasks in org + audit logs |
| **Viewer** | Can only view tasks they created |

### Enforcement occurs at:
✔ **Controller layer** (via `@Roles()`)  
✔ **Service layer** (deep authorization checks)  

Example:
```ts
@Roles(Role.Owner, Role.Admin)
@Post()
createTask() { ... }
```

AND in `TaskService`:
```ts
if (authUser.role === 'VIEWER' && task.createdBy.id !== authUser.id) {
  throw new ForbiddenException();
}
```

---

# 🔑 JWT Authentication Flow

1. User logs in → receives `access_token`
2. Token contains:  
   `{ id, email, role, orgId }`
3. Every request includes:
   `Authorization: Bearer <token>`
4. `JwtAuthGuard` validates token and attaches `req.user`

This powers all RBAC checks.

---

# 📡 API Documentation

## 🔐 AUTH
### Register
```
POST /auth/register
{
  "name": "John",
  "email": "john@example.com",
  "password": "123456"
}
```

### Login
```
POST /auth/login
{
  "email": "john@example.com",
  "password": "123456"
}
```

### Profile
```
GET /auth/me
→ Returns logged-in user info
```

---

## 📝 TASKS API

### Create Task (OWNER / ADMIN)
```
POST /tasks
{
  "title": "Task A",
  "description": "Details..."
}
```

### Get Tasks
```
GET /tasks
```

### Update Task
```
PUT /tasks/:id
```

### Delete Task (OWNER / ADMIN)
```
DELETE /tasks/:id
```

---

## 🧾 Audit Logs API

### Get Logs (OWNER / ADMIN)
```
GET /audit-log?filter=day|week|month
```

---

# 🔮 Future Improvements

### 🚀 1. Advanced Role Delegation
- Allow custom roles
- Permission matrix stored in DB

### 🔄 2. Refresh Tokens
- Access + refresh token pair
- Logout invalidation

### 🛡 3. Production Security
- CSRF protection
- HTTPS enforcement
- Rate limiting
- Brute-force login protection

### ⚡ 4. RBAC Caching
- Cache permissions for speed
- Invalidate on role changes

### 🧩 5. Scaling & Observability
- Redis-based session tracking
- Distributed audit logging

---

# 🎉 Final Notes

This project demonstrates:

- Full-stack architecture
- Secure backend design
- Role-based access control
- Real audit logging
- Kanban UI with drag & drop
- NX monorepo engineering practices
