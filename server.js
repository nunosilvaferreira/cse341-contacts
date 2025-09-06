const express = require('express');
const app = express();
const connectDB = require('./config/dbConnection');

app.use(express.json());

// Conecta à base de dados e inicia o servidor
async function startServer() {
  try {
    await connectDB();
    const PORT = process.env.PORT || 3000;
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  } catch (err) {
    console.error('Erro ao iniciar o servidor:', err);
    process.exit(1);
  }
}

startServer();

module.exports = app;