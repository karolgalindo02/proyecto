# Dashboard de Proyectos y Tareas

Sistema de gestión de proyectos y tareas con roles de usuario (Admin y Usuario).

## 🚀 Características

### Admin
- ✅ Crear, editar y eliminar proyectos
- ✅ Crear, editar y eliminar tareas
- ✅ Asignar tareas a usuarios
- ✅ Ver todos los proyectos y tareas
- ✅ Gestionar usuarios

### Usuario
- ✅ Ver todos los proyectos (solo lectura)
- ✅ Ver sus tareas asignadas
- ✅ Editar el progreso y estado de sus propias tareas

## 📋 Requisitos Previos

- Node.js (v14 o superior)
- MySQL (v5.7 o superior)
- Expo CLI (para React Native)
- Android Studio o Xcode (para emuladores)

## 🛠️ Instalación

### 1. Configurar la Base de Datos

Ejecuta el script SQL para crear la base de datos:

```bash
mysql -u root -p < /app/database/db_node.sql
```

Luego, crea los usuarios de prueba:

```bash
mysql -u root -p < /app/database/seed_users.sql
```

### 2. Configurar Backend

```bash
cd /app/backend
npm install
```

Edita `/app/backend/config/config.js` con tus credenciales de MySQL:

```javascript
const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: 'tu_password',
  database: 'db_node',
  port: 3306
});
```

Inicia el backend:

```bash
npm start
```

El backend correrá en `http://localhost:8001`

### 3. Configurar Frontend

```bash
cd /app/frontend
npm install
```

Edita `/app/frontend/src/data/sources/remote/api/ApiDelivery.tsx` y cambia la URL:

```typescript
const API_URL = 'http://TU_IP_LOCAL:8001';
```

**Nota:** Si estás usando un dispositivo físico, usa tu IP local. Si usas el emulador de Android, puedes usar `http://10.0.2.2:8001`.

Inicia la app:

```bash
npm start
```

## 👤 Usuarios de Prueba

### Admin
- **Email:** admin@test.com
- **Password:** admin123

### Usuario 1
- **Email:** usuario1@test.com
- **Password:** user123

### Usuario 2
- **Email:** usuario2@test.com
- **Password:** user123

## 📱 Estructura del Proyecto

```
/app
├── backend/                 # Backend Node.js + Express
│   ├── config/             # Configuración de DB y JWT
│   ├── controllers/        # Controladores de la API
│   ├── middlewares/        # Middlewares de autenticación
│   ├── models/            # Modelos de datos
│   ├── routes/            # Rutas de la API
│   ├── scripts/           # Scripts de utilidad
│   └── server.js          # Servidor principal
│
├── frontend/               # Frontend React Native
│   ├── src/
│   │   ├── data/          # Capa de datos
│   │   │   ├── services/  # Servicios API
│   │   │   └── sources/   # Fuentes de datos
│   │   ├── domain/        # Lógica de negocio
│   │   │   └── useCases/  # Casos de uso
│   │   └── presentation/  # Capa de presentación
│   │       ├── components/ # Componentes reutilizables
│   │       └── views/     # Vistas/Pantallas
│   │           ├── home/          # Login
│   │           ├── register/      # Registro
│   │           └── dashboard/     # Dashboards
│   │               ├── admin/     # Dashboard Admin
│   │               └── user/      # Dashboard Usuario
│   └── App.tsx            # Componente principal
│
└── database/              # Scripts SQL
    ├── db_node.sql       # Esquema de base de datos
    └── seed_users.sql    # Usuarios de prueba
```

## 🔐 API Endpoints

### Autenticación
- `POST /api/users/login` - Iniciar sesión
- `POST /api/users/create` - Registrar usuario

### Usuarios (Requiere token)
- `GET /api/users` - Listar usuarios (admin)
- `GET /api/users/:id` - Obtener usuario (admin)

### Proyectos (Requiere token)
- `GET /api/projects` - Listar proyectos (admin, user)
- `POST /api/projects` - Crear proyecto (admin)
- `PUT /api/projects/:id` - Actualizar proyecto (admin)
- `DELETE /api/projects/:id` - Eliminar proyecto (admin)

### Tareas (Requiere token)
- `GET /api/tasks` - Listar tareas (admin, user)
- `POST /api/tasks` - Crear tarea (admin)
- `PUT /api/tasks/:id` - Actualizar tarea (admin, user)
- `DELETE /api/tasks/:id` - Eliminar tarea (admin)

## 🎨 Capturas de Pantalla

### Login
Los usuarios ingresan con su email y contraseña.

### Dashboard Admin
- Vista de proyectos con progreso
- Vista de tareas con prioridades
- Botón flotante para crear nuevos elementos
- Modales para crear proyectos y tareas

### Dashboard Usuario
- Vista de proyectos (solo lectura)
- Vista de tareas propias
- Edición de progreso y estado de tareas

## 🐛 Solución de Problemas

### El backend no conecta con MySQL
- Verifica que MySQL esté corriendo
- Revisa las credenciales en `/app/backend/config/config.js`

### La app no conecta con el backend
- Verifica que el backend esté corriendo en el puerto 8001
- Asegúrate de usar la IP correcta en `ApiDelivery.tsx`
- Si usas emulador Android, usa `10.0.2.2` en lugar de `localhost`

### Error de token inválido
- Los tokens JWT expiran en 1 hora
- Cierra sesión y vuelve a iniciar sesión

## 📝 Notas

- Los usuarios normales solo pueden editar el progreso y estado de sus propias tareas
- Los administradores tienen acceso completo a todo el sistema
- Las contraseñas se almacenan hasheadas con bcrypt
- La autenticación usa JWT (JSON Web Tokens)

## 🔄 Próximas Mejoras

- [ ] Agregar paginación a las listas
- [ ] Implementar búsqueda y filtros
- [ ] Agregar notificaciones push
- [ ] Implementar chat entre usuarios
- [ ] Agregar dashboard con estadísticas
- [ ] Implementar subida de archivos
