// src/db/connection.js
const { MongoClient } = require('mongodb');

const uri = process.env.MONGODB_URI;
let client;
let db;

async function connectToDatabase() {
    if (db) return db;
    if (!uri) throw new Error('MONGODB_URI is not set');

    client = new MongoClient(uri);
    await client.connect();

    // Uses database from the URI (e.g., /cse341)
    db = client.db();
    return db;
}

// Function to get the database instance
function getDb() {
    if (!db) {
        throw new Error('Database not initialized. Call connectToDatabase first.');
    }
    return db;
}

module.exports = { 
    connectToDatabase, 
    getDb 
};