const User = require('../models/User');
const bcrypt = require('bcryptjs');

// Configuración del usuario admin por defecto
const ADMIN_CONFIG = {
    name: 'Fran',
    email: 'fran703@pm.me',
    password: 'Headstand3-Negation2-Cruelly2-Commodore8-Sporting8'
};

async function seedAdmin() {
    try {
        // Verificar si ya existe un usuario
        const existingUser = await User.findOne({ email: ADMIN_CONFIG.email });
        
        if (existingUser) {
            console.log('👤 Usuario admin ya existe');
            return;
        }

        // Crear hash de la contraseña
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(ADMIN_CONFIG.password, salt);

        // Crear usuario admin
        const admin = new User({
            name: ADMIN_CONFIG.name,
            email: ADMIN_CONFIG.email,
            password: hashedPassword
        });

        await admin.save();
        console.log('✅ Usuario admin creado:', ADMIN_CONFIG.email);
        console.log('⚠️  Recuerda cambiar la contraseña después del primer login');
    } catch (error) {
        console.error('❌ Error creando usuario admin:', error.message);
    }
}

module.exports = seedAdmin;

