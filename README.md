# Portfolio Profesional - Proyectos de Automatización

Portafolio web profesional tipo SaaS para mostrar proyectos de automatización, con backend completo, autenticación JWT, y panel de administración para gestionar proyectos.

## 🚀 Tecnologías Utilizadas

### Backend
- **Node.js** - Runtime de JavaScript
- **Express** - Framework web
- **MongoDB** - Base de datos NoSQL
- **Mongoose** - ODM para MongoDB
- **JWT** - Autenticación con JSON Web Tokens
- **Bcrypt** - Hash de contraseñas
- **Multer** - Manejo de uploads de archivos

### Frontend
- **HTML5** - Estructura semántica
- **CSS3** - Diseño moderno con gradientes y animaciones
- **JavaScript (Vanilla)** - Lógica de aplicación
- **SPA** - Single Page Application con navegación hash

## 📋 Requisitos Previos

- Node.js (v14 o superior)
- MongoDB (local o MongoDB Atlas)
- npm o yarn

> **💡 Para Linux Mint**: Consulta [INSTALL_LINUX_MINT.md](INSTALL_LINUX_MINT.md) para una guía de instalación completa y optimizada.

## 🔧 Instalación

### 1. Clonar el repositorio
```bash
git clone <repository-url>
cd radiant-trifid
```

### 2. Instalar dependencias del backend
```bash
cd server
npm install
```

### 3. Configurar variables de entorno
Crea un archivo `.env` en la carpeta `server/` basado en `.env.example`:

```env
MONGODB_URI=mongodb://localhost:27017/portfolio
JWT_SECRET=tu-secreto-super-seguro-cambiar-en-produccion
PORT=3000
NODE_ENV=development
```

### 4. Iniciar MongoDB
Si usas MongoDB local:
```bash
mongod
```

Si usas MongoDB Atlas, asegúrate de tener la URI de conexión correcta en `.env`.

### 5. Iniciar el servidor
```bash
cd server
npm start
```

Para desarrollo con auto-reload:
```bash
npm run dev
```

El servidor estará disponible en `http://localhost:3000`

## 👤 Crear Usuario Administrador

Para acceder al panel de administración, primero necesitas crear un usuario. Puedes hacerlo de dos formas:

### Opción 1: Usando la API directamente
```bash
curl -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "admin@example.com",
    "password": "tu-password-seguro",
    "name": "Administrador"
  }'
```

### Opción 2: Usando el navegador
1. Abre las DevTools del navegador (F12)
2. Ve a la consola
3. Ejecuta:
```javascript
fetch('/api/auth/register', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    email: 'admin@example.com',
    password: 'tu-password-seguro',
    name: 'Administrador'
  })
}).then(r => r.json()).then(console.log)
```

## 📱 Uso de la Aplicación

### Página Pública
- **Inicio**: Hero section con presentación
- **Proyectos**: Galería de todos los proyectos
- **Contacto**: Enlaces a redes sociales

### Panel de Administración
1. Haz clic en "Admin" en la navegación
2. Inicia sesión con tus credenciales
3. Gestiona proyectos:
   - ➕ Crear nuevos proyectos
   - ✏️ Editar proyectos existentes
   - 🗑️ Eliminar proyectos
   - 📁 Subir imágenes y videos

## 📁 Estructura del Proyecto

```
radiant-trifid/
├── server/                 # Backend
│   ├── config/            # Configuración de DB
│   ├── controllers/       # Controladores de rutas
│   ├── middleware/        # Middleware (auth, upload)
│   ├── models/           # Modelos de MongoDB
│   ├── routes/           # Definición de rutas
│   ├── uploads/          # Archivos subidos
│   ├── server.js         # Servidor principal
│   ├── package.json      # Dependencias
│   └── .env              # Variables de entorno
│
└── public/               # Frontend
    ├── css/
    │   └── styles.css    # Estilos
    ├── js/
    │   ├── api.js        # Cliente API
    │   ├── auth.js       # Autenticación
    │   ├── ui.js         # Componentes UI
    │   ├── projects.js   # Gestión de proyectos
    │   └── app.js        # App principal
    └── index.html        # HTML principal
```

## 🔐 API Endpoints

### Autenticación
- `POST /api/auth/register` - Registrar usuario
- `POST /api/auth/login` - Iniciar sesión
- `GET /api/auth/me` - Obtener usuario actual (protegido)

### Proyectos
- `GET /api/projects` - Listar todos los proyectos
- `GET /api/projects/:id` - Obtener proyecto por ID
- `POST /api/projects` - Crear proyecto (protegido)
- `PUT /api/projects/:id` - Actualizar proyecto (protegido)
- `DELETE /api/projects/:id` - Eliminar proyecto (protegido)

## 🎨 Características de Diseño

- ✨ Diseño moderno tipo SaaS
- 🌈 Gradientes y efectos glassmorphism
- 🎭 Animaciones suaves y micro-interacciones
- 📱 Totalmente responsive
- 🌙 Tema oscuro profesional
- ⚡ Transiciones fluidas

## 🔒 Seguridad

- Contraseñas hasheadas con bcrypt
- Autenticación JWT con tokens de 30 días
- Validación de tipos de archivo en uploads
- Límite de tamaño de archivos (50MB)
- Protección de rutas de administración

## 📝 Notas de Desarrollo

- Los archivos se almacenan en `server/uploads/`
- Las imágenes y videos se sirven estáticamente desde `/uploads`
- El frontend es una SPA con navegación hash
- Los tokens JWT se almacenan en localStorage

## 🚀 Despliegue en Producción

1. Configura `NODE_ENV=production` en `.env`
2. Usa un secreto JWT fuerte y único
3. Configura MongoDB Atlas para la base de datos
4. Considera usar un servicio de almacenamiento en la nube (Cloudinary, AWS S3) para archivos
5. Configura HTTPS
6. Usa un proceso manager como PM2

## 📄 Licencia

MIT

## 👨‍💻 Autor

Tu nombre - [LinkedIn](https://linkedin.com) - [GitHub](https://github.com)
