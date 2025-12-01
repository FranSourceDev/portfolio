#!/bin/bash

echo "🔧 Configurando MongoDB para el Portfolio..."
echo ""

# Verificar si MongoDB ya está instalado
if command -v mongod &> /dev/null; then
    echo "✅ MongoDB ya está instalado"
    mongod --version
else
    echo "📦 Instalando MongoDB..."
    
    # Importar la clave pública de MongoDB
    sudo apt-get install -y gnupg curl
    curl -fsSL https://www.mongodb.org/static/pgp/server-7.0.asc | \
       sudo gpg -o /usr/share/keyrings/mongodb-server-7.0.gpg --dearmor
    
    # Agregar el repositorio de MongoDB
    echo "deb [ arch=amd64,arm64 signed-by=/usr/share/keyrings/mongodb-server-7.0.gpg ] https://repo.mongodb.org/apt/ubuntu jammy/mongodb-org/7.0 multiverse" | \
       sudo tee /etc/apt/sources.list.d/mongodb-org-7.0.list
    
    # Actualizar e instalar
    sudo apt-get update
    sudo apt-get install -y mongodb-org
    
    echo "✅ MongoDB instalado"
fi

echo ""
echo "🚀 Iniciando MongoDB..."

# Iniciar el servicio de MongoDB
sudo systemctl start mongod
sudo systemctl enable mongod

# Verificar el estado
if sudo systemctl is-active --quiet mongod; then
    echo "✅ MongoDB está corriendo"
    echo ""
    echo "📊 Información de MongoDB:"
    echo "   - Puerto: 27017"
    echo "   - URI: mongodb://localhost:27017/portfolio"
    echo ""
    echo "✅ Tu base de datos está lista!"
    echo ""
    echo "📝 Próximos pasos:"
    echo "   1. El servidor ya está configurado para usar MongoDB local"
    echo "   2. Asegúrate de que el servidor esté corriendo: cd server && npm run dev"
    echo "   3. Crea tu usuario administrador (ver README.md)"
else
    echo "❌ Error al iniciar MongoDB"
    echo "Intenta manualmente: sudo systemctl start mongod"
fi
