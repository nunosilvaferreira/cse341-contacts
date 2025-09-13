require('dotenv').config();
const express = require('express');
const morgan = require('morgan');
const cors = require('cors');


const contactsRouter = require('./src/routes/contacts.routes');


const app = express();


app.use(morgan('dev'));
app.use(cors());
app.use(express.json());


// Healthcheck / root
app.get('/', (_req, res) => {
res.status(200).send('Contacts API - Week 01');
});


// Routes
app.use('/contacts', contactsRouter);


// Basic error handler (Week 01 scope)
app.use((err, _req, res, _next) => {
console.error(err);
res.status(500).json({ error: 'Internal Server Error' });
});


const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
console.log(`Server listening on port ${PORT}`);
});

// Swagger setup
const swaggerUi = require('swagger-ui-express');
const swaggerDocument = require('./swagger.json');

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));