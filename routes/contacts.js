const express = require('express');
const { getDB } = require('../config/dbConnection');
const router = express.Router();

// Get all contacts
router.get('/', async (req, res) => {
  const db = getDB();
  const contacts = await db.collection('contacts').find().toArray();
  res.json(contacts);
});

// Get contact by ID
router.get('/:id', async (req, res) => {
  const db = getDB();
  const contact = await db.collection('contacts').findOne({ _id: new require('mongodb').ObjectId(req.params.id) });
  if (!contact) return res.status(404).json({ message: 'Contact not found' });
  res.json(contact);
});

module.exports = router;