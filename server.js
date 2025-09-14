// server.js
require('dotenv').config();
const express = require('express');
const morgan = require('morgan');
const cors = require('cors');
const swaggerUi = require('swagger-ui-express');
const swaggerDocument = require('./swagger.json');
const contactsRouter = require('./src/routes/contacts.routes');
const { connectToDatabase } = require('./src/db/connection'); // ← Importa apenas connectToDatabase
const { initializeSync } = require('./src/controllers/contacts.controller');

const app = express();

app.use(morgan('dev'));
app.use(cors());
app.use(express.json());

// Initialize database connection and sync
connectToDatabase()
    .then(async () => {
        console.log('✅ Connected to MongoDB successfully');
        // Initialize synchronization between JSON and MongoDB
        await initializeSync();
    })
    .catch((error) => {
        console.error('❌ MongoDB connection failed:', error);
        process.exit(1);
    });

// Swagger setup
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

// Healthcheck
app.get('/', (_req, res) => {
    res.status(200).send('Contacts API - Week 02');
});

// Routes
app.use('/contacts', contactsRouter);

// Error handler
app.use((err, _req, res, _next) => {
    console.error(err);
    res.status(500).json({ error: 'Internal Server Error' });
});

// Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT}`);
    console.log(`📄 Swagger UI available at http://localhost:${PORT}/api-docs`);
});