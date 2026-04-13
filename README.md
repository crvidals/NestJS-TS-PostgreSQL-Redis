# 🚀 To-Do API - NestJS + PostgreSQL + Redis

## 📌 Descripción

API REST para gestión de tareas desarrollada con NestJS.

Permite a los usuarios registrarse, autenticarse y gestionar tareas con soporte de:
- 🔐 JWT Authentication
- 📄 Paginación
- ⚡ Cache con Redis
- 📊 Logging estructurado

---

## 🧰 Tecnologías

- NestJS
- TypeScript
- PostgreSQL
- Prisma ORM
- Redis (ioredis)
- Swagger (OpenAPI)
- Docker

---

## ✨ Features

### 🔐 Autenticación
- Registro de usuario
- Login con JWT
- Protección de rutas con Guards

---

### 📋 Gestión de tareas (CRUD)
- Crear tarea
- Listar tareas del usuario autenticado
- Actualizar tarea (solo propietario)
- Eliminar tarea (solo propietario)

---

### ⚡ Cache con Redis
- Cache por usuario
- Cache por filtros y paginación
- TTL: 60 segundos
- Invalidación automática en:
  - creación
  - actualización
  - eliminación

---

### 📄 Paginación
- Parámetros: `page` y `limit`
- Límite máximo de resultados
- Respuesta estructurada:

```json
{
  "data": [],
  "meta": {
    "total": 0,
    "page": 1,
    "lastPage": 1
  }
}
```

---

### 📊 Logging estructurado
- Logs en operaciones CRUD
- Cache logs:
  - Cache HIT
  - Cache MISS
  - Cache SET
- Logs de seguridad (accesos no autorizados)

---

### 📚 Documentación API (Swagger)

http://localhost:3000/api

---

## 🔄 Flujo de uso

### 1. Registrar usuario

POST /auth/register

```json
{
  "email": "test@test.com",
  "password": "123456"
}
```

---

### 2. Login

POST /auth/login

```json
{
  "email": "test@test.com",
  "password": "123456"
}
```

Respuesta:

```json
{
  "access_token": "JWT_TOKEN"
}
```

---

### 3. Usar token

Authorization:
Bearer JWT_TOKEN

---

### 4. Crear tarea

POST /tasks

```json
{
  "title": "Mi tarea",
  "description": "Opcional",
  "status": "PENDING"
}
```

---

### 5. Listar tareas

GET /tasks?page=1&limit=10

GET /tasks?status=PENDING&page=1&limit=5

---

### 6. Actualizar tarea

PATCH /tasks/:id

```json
{
  "title": "Tarea actualizada",
  "status": "IN_PROGRESS"
}
```

---

### 7. Eliminar tarea

DELETE /tasks/:id

---

## ⚡ Cache

- TTL: 60 segundos
- Invalidación en create/update/delete

---

## 📊 Respuesta ejemplo

```json
{
  "data": [
    {
      "id": "uuid",
      "title": "Mi tarea",
      "status": "PENDING"
    }
  ],
  "meta": {
    "total": 10,
    "page": 1,
    "lastPage": 5
  }
}
```

---

## ⚙️ Requisitos

- Node.js >= 18
- Docker
- Docker Compose

---

## 🐳 Docker

docker-compose up -d

---

## ⚙️ .env

DATABASE_URL="postgresql://postgres:postgres@localhost:5432/tasks_db"
JWT_SECRET="super_secret_key"

---

## 📦 Instalación

npm install

---

## 🧱 Migraciones

npx prisma migrate dev

---

## ▶️ Ejecutar

npm run start:dev

---

## 📡 Endpoints

Auth:
- POST /auth/register
- POST /auth/login

Tasks:
- POST /tasks
- GET /tasks
- PATCH /tasks/:id
- DELETE /tasks/:id

---

## 🧠 Decisiones técnicas

- Prisma por tipado fuerte
- Redis para cache
- Paginación para escalabilidad
- Logging para observabilidad
- Invalidación de cache en mutaciones

---

## 🚀 Mejoras futuras

- Tests e2e
- Cursor pagination
- Rate limiting
- Refresh tokens
- Logging con ELK / Winston

---

## 👨‍💻 Autor

Cristian Vidal