# 🏦 Lab1 Arquisoft — Guía de ejecución (Backend + Frontend)

Laboratorio realizado por:

Ana María Granada Rodas  
Jesus Estiven Torres Quintero   
Juan Pablo Ramos Vélez 

Este repositorio contiene:

- **Backend:** Spring Boot (Java 21, Maven, JPA, MySQL, MapStruct, Lombok)  
- **Frontend:** React + Vite (app separada en `frontend/`) que consume la API del backend

---

## ✅ Requisitos

- **Java 21**
- **Maven 3.9+** (`mvn -v`)
- **Node.js 18+ y npm** (`node -v`, `npm -v`)
- **MySQL 8+** (o compatible)

---

## 🗄️ Base de datos

1. Crea una base de datos (ej. `bankdb`):
   ```sql
   CREATE DATABASE bankdb CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
   ```
2. Configura `src/main/resources/application.properties`:
   ```properties
   spring.datasource.url=jdbc:mysql://localhost:3306/bankdb?useSSL=false&serverTimezone=UTC
   spring.datasource.username=TU_USUARIO
   spring.datasource.password=TU_PASSWORD

   spring.jpa.hibernate.ddl-auto=update
   spring.jpa.show-sql=true

   # Zona horaria recomendada
   spring.jackson.time-zone=America/Bogota
   ```
---

## 🌳 Estructura (resumen)

```
backend/
  pom.xml
  src/main/java/com/udea/lab1arquisoft/...
  src/main/resources/
    application.properties
    static/                
frontend/
  package.json
  vite.config.js
  index.html
  src/
    main.jsx
    App.jsx
    api/client.js
    pages/
      CustomersList.jsx
      CustomerNew.jsx
      CustomerEdit.jsx
      TransactionsList.jsx
      TransactionNew.jsx
```

---

## 🚀 Modo Dev (Front + Back separados con proxy)

### 1) Backend
```bash
# Linux/Mac
./mvnw spring-boot:run
# Windows
mvnw spring-boot:run
# Backend en http://localhost:8080
```

### 2) Frontend
Asegúrate de tener proxy en `frontend/vite.config.js`:
```js
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    proxy: {
      '/api': { target: 'http://localhost:8080', changeOrigin: true },
    },
  },
})
```

Luego:
```bash
cd frontend
npm install
npm run dev
```

---

## 🧪 Pruebas rápidas (E2E)

### Crear clientes (UI o cURL)
**UI:** `Customers → Nuevo customer`

**API:**
```bash
curl -X POST http://localhost:8080/api/customers   -H "Content-Type: application/json"   -d '{"firstName":"Ana","lastName":"Pérez","accountNumber":"123-456","balance":1000000}'

curl -X POST http://localhost:8080/api/customers   -H "Content-Type: application/json"   -d '{"firstName":"Luis","lastName":"Gómez","accountNumber":"987-654","balance":500000}'
```

### Listar clientes
```bash
curl http://localhost:8080/api/customers
```
En la UI deben verse en **Customers**.

### Actualizar / Borrar clientes (UI o cURL)
**Actualizar (PUT):**
```bash
curl -X PUT http://localhost:8080/api/customers/1   -H "Content-Type: application/json"   -d '{"firstName":"Ana","lastName":"Pérez","accountNumber":"123-456","balance":1200000}'
```
**Borrar (DELETE):**
```bash
curl -X DELETE http://localhost:8080/api/customers/2
```
En la UI verás **Editar** y **Eliminar** en el listado.

### Crear transacción (UI o cURL)
**UI:** `Transacciones → Nueva transacción`  
Remitente `123-456`, Receptor `987-654`, Monto `150000`.

**API:**
```bash
curl -X POST http://localhost:8080/api/transactions   -H "Content-Type: application/json"   -d '{"senderAccountNumber":"123-456","receiverAccountNumber":"987-654","amount":150000}'
```

### Consultar transacciones por cuenta
```bash
curl http://localhost:8080/api/transactions/123-456
```
En la UI, abre **Transacciones** y busca por `123456` o `987654`.

---

## 📚 Endpoints principales

**Customers**
- `GET /api/customers` — Listar
- `GET /api/customers/{id}` — Detalle
- `POST /api/customers` — Crear
- `PUT /api/customers/{id}` — Actualizar
- `DELETE /api/customers/{id}` — Borrar

**Transactions**
- `POST /api/transactions` — Transferir
- `GET /api/transactions/{accountNumber}` — Movimientos por cuenta

> Reglas: `accountNumber` **único**, `balance ≥ 0`, `amount > 0`, `sender ≠ receiver`, `transactionDate` asignado.

---
