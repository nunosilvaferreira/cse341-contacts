require('dotenv').config();
const express = require('express');
const morgan = require('morgan');
const cors = require('cors');
const swaggerUi = require('swagger-ui-express');
const swaggerDocument = require('./swagger.json');
const contactsRouter = require('./src/routes/contacts.routes');

const app = express();


app.use(morgan('dev'));
app.use(cors());
app.use(express.json());

// Swagger setup (deve vir antes das rotas)
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