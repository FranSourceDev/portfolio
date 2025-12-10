require('dotenv').config();
const mongoose = require('mongoose');
const User = require('../models/User');
const bcrypt = require('bcryptjs');

const MONGODB_URI = process.env.MONGODB_URI;

async function updatePassword() {
    try {
        // Connect to MongoDB
        await mongoose.connect(MONGODB_URI);
        console.log('✅ Connected to MongoDB');

        // Find user
        const user = await User.findOne({ email: 'fran703@pm.me' });
        
        if (!user) {
            console.log('❌ User not found');
            process.exit(1);
        }

        // New password
        const newPassword = 'Admin123456';
        
        // Hash password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(newPassword, salt);

        // Update password directly in database to bypass pre-save hook
        await User.updateOne(
            { email: 'fran703@pm.me' },
            { $set: { password: hashedPassword } }
        );

        // Verify the password was updated correctly
        const verifyUser = await User.findOne({ email: 'fran703@pm.me' });
        const testPassword = await bcrypt.compare('Admin123456', verifyUser.password);
        
        if (testPassword) {
            console.log('✅ Password updated and verified successfully');
            console.log('📧 Email: fran703@pm.me');
            console.log('🔑 New Password: Admin123456');
        } else {
            console.log('❌ Password update failed verification');
        }
        
        await mongoose.connection.close();
        process.exit(0);
    } catch (error) {
        console.error('❌ Error:', error);
        process.exit(1);
    }
}

updatePassword();

