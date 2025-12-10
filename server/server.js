require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require('path');
const connectDB = require('./config/db');
const seedAdmin = require('./config/seed');

// Import routes
const authRoutes = require('./routes/auth.routes');
const projectRoutes = require('./routes/project.routes');
const contactRoutes = require('./routes/contact.routes');
const cvRoutes = require('./routes/cv.routes');

// Initialize express app
const app = express();

// Connect to MongoDB and seed admin user
connectDB().then(() => {
    seedAdmin();
}).catch(err => {
    console.error('Error en la inicialización:', err);
});

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve uploaded files statically
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Serve frontend static files
app.use(express.static(path.join(__dirname, '../public')));

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/projects', projectRoutes);
app.use('/api/contact', contactRoutes);
app.use('/api/cv', cvRoutes);

// Health check endpoint
app.get('/api/health', (req, res) => {
    res.json({
        success: true,
        message: 'Server is running',
        timestamp: new Date().toISOString()
    });
});

// Serve HTML pages for known routes
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '../public/index.html'));
});

app.get('/projects.html', (req, res) => {
    res.sendFile(path.join(__dirname, '../public/projects.html'));
});

app.get('/contact.html', (req, res) => {
    res.sendFile(path.join(__dirname, '../public/contact.html'));
});

app.get('/cv.html', (req, res) => {
    res.sendFile(path.join(__dirname, '../public/cv.html'));
});

app.get('/admin.html', (req, res) => {
    res.sendFile(path.join(__dirname, '../public/admin.html'));
});

// Fallback to index.html for unknown routes
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '../public/index.html'));
});

// Error handling middleware
app.use((err, req, res, next) => {
    console.error('Error:', err.stack);

    res.status(err.status || 500).json({
        success: false,
        message: err.message || 'Internal server error',
        ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
    });
});

// Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT}`);
    console.log(`📁 Environment: ${process.env.NODE_ENV || 'development'}`);
    console.log(`🌐 Access at: http://localhost:${PORT}`);
});
