require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const authRoutes = require('./routes/auth');
const listingRoutes = require('./routes/listings');
const authMiddleware = require('./middleware/auth');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware básico
app.use(cors());
app.use(express.json());

// Conexión a MongoDB
mongoose.connect(process.env.MONGODB_URI)
.then(() => console.log('✅ Conectado a MongoDB'))
.catch(err => console.error('❌ Error conectando a MongoDB:', err));

// Rutas públicas
app.use('/api/users', authRoutes);

// Rutas protegidas (requieren autenticación)
app.use('/api/listings', authMiddleware, listingRoutes);

// Ruta de prueba para verificar que funciona
app.get('/', (req, res) => {
    res.json({ 
        message: '🚀 ¡Bienvenido a la API de Tecnoshare!',
        status: 'Funcionando correctamente',
        database: 'Conectado a MongoDB',
        endpoints: {
            auth: {
                register: 'POST /api/users/register',
                login: 'POST /api/users/login',
                getUsers: 'GET /api/users (requiere autenticación)'
            },
            listings: {
                getAll: 'GET /api/listings (requiere autenticación)',
                getById: 'GET /api/listings/:id (requiere autenticación)',
                byPropertyType: 'GET /api/listings/property-type/:type (requiere autenticación)',
                withTotalPrice: 'GET /api/listings/with-total-price (requiere autenticación)',
                byHost: 'GET /api/listings/host/:host_id (requiere autenticación)',
                updateAvailability: 'PATCH /api/listings/:id/availability (requiere autenticación)',
                topHosts: 'GET /api/listings/top-hosts (requiere autenticación)'
            }
        }
    });
});

// Ruta de prueba para la base de datos
app.get('/api/test-db', async (req, res) => {
    try {
        const db = mongoose.connection.db;
        const collections = await db.listCollections().toArray();
        res.json({
            message: 'Conexión a MongoDB exitosa',
            collections: collections.map(col => col.name)
        });
    } catch (error) {
        res.status(500).json({ error: 'Error conectando a la base de datos' });
    }
});

app.listen(PORT, () => {
    console.log(`🎯 Servidor ejecutándose en http://localhost:${PORT}`);
    console.log(`📊 Puerto: ${PORT}`);
    console.log(`🗄️  Base de datos: ${process.env.MONGODB_URI ? 'Configurada' : 'No configurada'}`);
});