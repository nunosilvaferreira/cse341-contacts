const express = require('express');
const dotenv = require('dotenv').config();
const { connectDB } = require('./config/dbConnection');

const app = express();
const port = process.env.PORT || 3000;

connectDB();

app.use(express.json());
app.use('/api/contacts', require('./routes/contacts'));

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});