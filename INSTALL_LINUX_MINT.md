# 🚀 Guía de Instalación - Linux Mint

Esta guía te ayudará a instalar el portafolio profesional en tu laptop con Linux Mint.

## 📋 Requisitos Previos

- Linux Mint (cualquier versión reciente)
- Conexión a internet
- Permisos de sudo

## 🔧 Instalación Completa (Paso a Paso)

### 1️⃣ Clonar o Copiar el Proyecto

Si tienes el proyecto en un repositorio Git:
```bash
git clone <url-del-repositorio>
cd portafolio
```

Si lo copias manualmente, asegúrate de estar en la carpeta del proyecto:
```bash
cd /ruta/a/portafolio
```

### 2️⃣ Instalar Node.js y npm

Ejecuta el script de instalación:
```bash
chmod +x install.sh
./install.sh
```

Este script:
- ✅ Instala Node.js y npm si no los tienes
- ✅ Instala todas las dependencias del backend
- ✅ Te indica los próximos pasos

### 3️⃣ Instalar y Configurar MongoDB

Ejecuta el script de MongoDB:
```bash
chmod +x setup-mongodb.sh
./setup-mongodb.sh
```

Este script:
- ✅ Instala MongoDB 7.0
- ✅ Inicia el servicio automáticamente
- ✅ Lo configura para que inicie con el sistema

> **Nota**: El script pedirá tu contraseña de sudo para instalar MongoDB.

### 4️⃣ Verificar la Configuración

El archivo `server/.env` ya está configurado con valores por defecto:
```env
MONGODB_URI=mongodb://localhost:27017/portfolio
JWT_SECRET=mi-super-secreto-jwt-cambiar-en-produccion-2024
PORT=3000
NODE_ENV=development
```

> **⚠️ IMPORTANTE**: Para producción, cambia el `JWT_SECRET` por un valor único y seguro.

### 5️⃣ Iniciar el Servidor

```bash
cd server
npm run dev
```

Deberías ver:
```
✅ MongoDB Connected: localhost
🚀 Server running on port 3000
🌐 Access at: http://localhost:3000
```

### 6️⃣ Crear Usuario Administrador

Abre una **nueva terminal** (deja el servidor corriendo) y ejecuta:

```bash
curl -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "admin@example.com",
    "password": "TuPasswordSeguro123",
    "name": "Administrador"
  }'
```

Deberías recibir una respuesta como:
```json
{
  "success": true,
  "data": {
    "id": "...",
    "name": "Administrador",
    "email": "admin@example.com",
    "token": "..."
  }
}
```

### 7️⃣ Acceder a la Aplicación

Abre tu navegador y ve a:
```
http://localhost:3000
```

Para acceder al panel de administración:
1. Haz clic en "Admin" en la navegación
2. Inicia sesión con:
   - Email: `admin@example.com`
   - Password: `TuPasswordSeguro123`

---

## 🎯 Instalación Rápida (Un Solo Comando)

Si prefieres hacerlo todo de una vez, ejecuta:

```bash
chmod +x install.sh setup-mongodb.sh && \
./install.sh && \
./setup-mongodb.sh && \
cd server && \
npm run dev
```

Luego, en otra terminal, crea el usuario admin con el comando del paso 6.

---

## ✅ Verificación de Instalación

### Verificar Node.js y npm
```bash
node --version  # Debería mostrar v14 o superior
npm --version   # Debería mostrar 6 o superior
```

### Verificar MongoDB
```bash
sudo systemctl status mongod
```

Debería mostrar: `Active: active (running)`

### Verificar que el servidor funciona
```bash
curl http://localhost:3000/api/health
```

Debería responder:
```json
{
  "success": true,
  "message": "Server is running",
  "timestamp": "..."
}
```

---

## 🔧 Solución de Problemas

### Problema: "npm: command not found"
**Solución**: Ejecuta `./install.sh` nuevamente o instala manualmente:
```bash
sudo apt update
sudo apt install -y nodejs npm
```

### Problema: "MongoDB connection failed"
**Solución**: Verifica que MongoDB esté corriendo:
```bash
sudo systemctl start mongod
sudo systemctl status mongod
```

### Problema: "Port 3000 already in use"
**Solución**: Mata el proceso que usa el puerto:
```bash
sudo lsof -ti:3000 | xargs kill -9
```

O cambia el puerto en `server/.env`:
```env
PORT=3001
```

### Problema: Scripts sin permisos de ejecución
**Solución**:
```bash
chmod +x install.sh setup-mongodb.sh
```

---

## 📱 Comandos Útiles

### Iniciar el servidor en desarrollo
```bash
cd server
npm run dev
```

### Iniciar el servidor en producción
```bash
cd server
npm start
```

### Ver logs de MongoDB
```bash
sudo journalctl -u mongod -f
```

### Reiniciar MongoDB
```bash
sudo systemctl restart mongod
```

### Detener el servidor
Presiona `Ctrl + C` en la terminal donde corre el servidor

---

## 🎨 Próximos Pasos

Una vez que todo esté funcionando:

1. ✅ Accede al panel de administración
2. ✅ Crea tu primer proyecto con imágenes
3. ✅ Personaliza los enlaces de redes sociales en `public/index.html`
4. ✅ Cambia el `JWT_SECRET` en `server/.env` para producción

---

## 📚 Recursos Adicionales

- [README.md](README.md) - Documentación completa del proyecto
- [Walkthrough](../../../.gemini/antigravity/brain/00934b1b-1f07-451a-bd19-0998132a7c0a/walkthrough.md) - Guía detallada de características

---

## 💡 Consejos

- **Desarrollo**: Usa `npm run dev` para auto-reload al hacer cambios
- **Producción**: Usa `npm start` y considera usar PM2 para gestión de procesos
- **Backup**: Haz backup regular de tu base de datos MongoDB
- **Seguridad**: Cambia el JWT_SECRET antes de desplegar en producción

---

¡Listo! Tu portafolio profesional debería estar funcionando perfectamente en Linux Mint 🚀
