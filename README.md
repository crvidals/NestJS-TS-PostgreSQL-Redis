# To-Do API - NestJS + PostgreSQL + Redis

## Descripción

API REST para gestión de tareas desarrollada con NestJS.

Permite a los usuarios registrarse, autenticarse y gestionar sus tareas con soporte de cache, paginación y logging.

---

## Tecnologías

* NestJS
* TypeScript
* PostgreSQL
* Prisma ORM
* Redis (ioredis)
* Swagger (OpenAPI)
* Docker

---

## Features

### Autenticación

* Registro de usuario
* Login con JWT
* Endpoints protegidos con AuthGuard

---

### Gestión de tareas (CRUD)

* Crear tarea
* Listar tareas del usuario
* Actualizar tarea (solo dueño)
* Eliminar tarea (solo dueño)

---

### Cache con Redis

* Cache por usuario
* Cache por filtros y paginación
* TTL: 60 segundos
* Invalidación automática en:

  * creación
  * actualización
  * eliminación

---

### Paginación

* Soporte de `page` y `limit`
* Límite máximo de resultados
* Respuesta estructurada:

```json
{
  "data": [...],
  "meta": {
    "total": 10,
    "page": 1,
    "lastPage": 5
  }
}
```

---

### Logging estructurado

* Logs en operaciones CRUD
* Logs de cache:

  * Cache HIT
  * Cache MISS
  * Cache SET
* Logs de seguridad (accesos no autorizados)

---

### Documentación API

* Swagger UI disponible en:

```
http://localhost:3000/api
```

---

## Requisitos

* Node.js (>= 18)
* Docker y Docker Compose

---

## Levantar servicios

```bash
docker-compose up -d
```

Servicios:

* PostgreSQL → puerto 5432
* Redis → puerto 6379

---

## Configuración

Crear archivo `.env`:

```env
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/tasks_db"
JWT_SECRET="super_secret_key"
```

---

## Instalación

```bash
npm install
```

---

## Migraciones

```bash
npx prisma migrate dev
```

---

## Ejecutar proyecto

```bash
npm run start:dev
```

---

## Autenticación

### Registro

```
POST /auth/register
```

```json
{
  "email": "test@test.com",
  "password": "123456"
}
```

---

### Login

```
POST /auth/login
```

Respuesta:

```json
{
  "access_token": "..."
}
```

---

## Uso del token

Header:

```
Authorization: Bearer TU_TOKEN
```

---

## Endpoints

### Crear tarea

```
POST /tasks
```

---

### Listar tareas (con paginación y filtro)

```
GET /tasks?page=1&limit=10
GET /tasks?status=PENDING&page=1&limit=5
```

---

### Actualizar tarea

```
PATCH /tasks/:id
```

---

### Eliminar tarea

```
DELETE /tasks/:id
```

---

## 🧪 Ejemplo de respuesta

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

## Decisiones técnicas

* Prisma por tipado fuerte y facilidad de uso
* Redis para mejorar performance en lecturas
* Cache invalidado en mutaciones para mantener consistencia
* Paginación para escalabilidad
* Logging para observabilidad y debugging

---

## Mejoras futuras

* Tests e2e
* Paginación avanzada (cursor-based)
* Rate limiting
* Refresh tokens
* Logging persistente (Winston / ELK)

---

## Autor

Cristian Vidal
