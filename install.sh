#!/bin/bash

echo "🚀 Instalando Portfolio Profesional..."
echo ""

# Check if npm is installed
if ! command -v npm &> /dev/null; then
    echo "❌ npm no está instalado."
    echo "📦 Instalando Node.js y npm..."
    sudo apt update
    sudo apt install -y nodejs npm
    echo "✅ Node.js y npm instalados"
fi

# Check if MongoDB is installed
if ! command -v mongod &> /dev/null; then
    echo "⚠️  MongoDB no está instalado localmente."
    echo "Puedes:"
    echo "  1. Instalar MongoDB localmente: sudo apt install -y mongodb"
    echo "  2. Usar MongoDB Atlas (cloud): https://www.mongodb.com/cloud/atlas"
    echo ""
fi

# Install backend dependencies
echo "📦 Instalando dependencias del backend..."
cd server
npm install
cd ..

echo ""
echo "✅ Instalación completada!"
echo ""
echo "📝 Próximos pasos:"
echo "  1. Asegúrate de que MongoDB esté corriendo (mongod) o configura MongoDB Atlas"
echo "  2. Revisa el archivo server/.env y ajusta las configuraciones"
echo "  3. Inicia el servidor: cd server && npm start"
echo "  4. Abre http://localhost:3000 en tu navegador"
echo ""
echo "🔐 Para crear un usuario administrador, consulta el README.md"
