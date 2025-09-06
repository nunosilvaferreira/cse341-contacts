const { MongoClient } = require('mongodb');

let database;

const connectDB = async () => {
  const client = new MongoClient(process.env.MONGODB_URI);
  try {
    await client.connect();
    database = client.db('contactsDB');
    console.log('Connected to MongoDB');
  } catch (error) {
    console.error('Error connecting to MongoDB:', error);
  }
};

const getDB = () => {
  if (!database) throw new Error('Database not connected');
  return database;
};

module.exports = { connectDB, getDB };