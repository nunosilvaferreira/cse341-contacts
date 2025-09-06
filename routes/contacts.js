const express = require('express');
const { getDb } = require('../config/dbConnection.js');
const router = express.Router();

// Get all contacts
router.get('/', async (req, res) => {
  const db = getDb();
  const contacts = await db.collection('contacts').find().toArray();
  res.json(contacts);
});

// Get contact by ID
router.get('/:id', async (req, res) => {
  const db = getDb();
  const contact = await db.collection('contacts').findOne({ _id: new require('mongodb').ObjectId(req.params.id) });
  if (!contact) return res.status(404).json({ message: 'Contact not found' });
  res.json(contact);
});

module.exports = router;