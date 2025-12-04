# 🚀 Task Manager Pro - Full Stack

> **🔴 DEMO EN VIVO:** [Haz clic aquí para ver la App funcionando](https://ibrag1.github.io/task-manager-portfolio/)

Una aplicación web Full Stack moderna para gestionar tareas personales, con sistema de usuarios, categorías y seguridad integrada.

## 🔐 Credenciales de Prueba (Demo)
Para facilitar la revisión del proyecto, puedes usar esta cuenta de prueba ya creada:
- **Usuario:** invitado
- **Contraseña:** 123456

## ✨ Funcionalidades Principales
- **🔐 Autenticación Segura:** Sistema completo de Registro y Login con encriptación.
- **🛡️ Rutas Protegidas:** Implementación de JSON Web Tokens (JWT) para proteger la API.
- **👤 Privacidad de Datos:** Cada usuario accede a su propia base de datos privada (aislamiento de información).
- **🏷️ Categorías Visuales:** Clasificación de tareas (Personal, Trabajo, Estudio, Otro) con indicadores de color.
- **⚡ CRUD Completo:** Crear, Leer, Actualizar estado y Eliminar tareas en tiempo real.
- **🎨 UI Moderna:** Interfaz limpia y responsiva con Tailwind CSS y Dark Mode.

## 🛠 Tecnologías Utilizadas

### Frontend (Cliente)
- **React + Vite:** Para una interfaz rápida y reactiva.
- **Tailwind CSS:** Para el estilizado moderno.
- **Axios:** Para la comunicación HTTP con el servidor.

### Backend (Servidor)
- **Node.js + Express:** Arquitectura del servidor REST API.
- **MongoDB Atlas:** Base de datos NoSQL en la nube.
- **Mongoose:** Modelado de datos (Schemas) y validaciones.
- **Seguridad:**
  - `bcryptjs`: Hashing de contraseñas.
  - `jsonwebtoken` (JWT): Manejo de sesiones seguras sin estado (stateless).
  - `cors`: Gestión de permisos de acceso cruzado.

## 📦 Instalación Local
Si deseas correr este proyecto en tu computadora:

1. Clonar el repositorio.
2. **Backend:**
   - `cd server`
   - `npm install`
   - Crear archivo `.env` con `MONGO_URI` y `JWT_SECRET`.
   - `node index.js`
3. **Frontend:**
   - `cd client`
   - `npm install`
   - `npm run dev`

---
