// src/controllers/contacts.controller.js

const mongodb = require('../db/connect');  // MongoDB
const { ObjectId } = require('mongodb');

// GET all contacts
const getAll = async (req, res) => {
  try {
    const result = await mongodb.getDb().db().collection('contacts').find();
    const contacts = await result.toArray();
    res.status(200).json(contacts);
  } catch (err) {
    console.error('Error in getAll:', err);
    res.status(500).json({ message: 'Error retrieving contacts.', error: err.message });
  }
};

// GET single contact by ID
const getSingle = async (req, res) => {
  const id = req.params.id;
  if (!ObjectId.isValid(id)) {
    return res.status(400).json({ message: 'Invalid ID format.' });
  }
  try {
    const userId = new ObjectId(id);
    const result = await mongodb.getDb().db().collection('contacts').find({ _id: userId });
    const contacts = await result.toArray();
    if (contacts.length === 0) {
      return res.status(404).json({ message: 'Contact not found.' });
    }
    res.status(200).json(contacts[0]);
  } catch (err) {
    console.error('Error in getSingle:', err);
    res.status(500).json({ message: 'Error retrieving the contact.', error: err.message });
  }
};

// POST create a new contact
const createContact = async (req, res) => {
  const { firstName, lastName, email, favoriteColor, birthday } = req.body;
  // You can use status 200 or 204. If you use 204, you generally do not return a body.
  if (!firstName || !lastName || !email) {
    return res.status(400).json({ message: 'firstName, lastName and email are required.' });
  }
  const contact = {
    firstName,
    lastName,
    email,
    favoriteColor: favoriteColor || null,
    birthday: birthday || null
  };
  try {
    const response = await mongodb.getDb().db().collection('contacts').insertOne(contact);
    if (response.acknowledged) {
      res.status(201).json({ id: response.insertedId, message: 'Contact created.' });
    } else {
      res.status(500).json({ message: 'Failed to create contact.' });
    }
  } catch (err) {
    console.error('Error in createContact:', err);
    res.status(500).json({ message: 'Error creating contact.', error: err.message });
  }
};

// PUT update a contact by ID
const updateContact = async (req, res) => {
  const id = req.params.id;
  if (!ObjectId.isValid(id)) {
    return res.status(400).json({ message: 'Invalid ID format.' });
  }
  const { firstName, lastName, email, favoriteColor, birthday } = req.body;
  if (!firstName || !lastName || !email) {
    return res.status(400).json({ message: 'firstName, lastName and email are required.' });
  }
  const contact = {
    firstName,
    lastName,
    email,
    favoriteColor: favoriteColor || null,
    birthday: birthday || null
  };
  try {
    const userId = new ObjectId(id);
    const response = await mongodb.getDb().db().collection('contacts').replaceOne({ _id: userId }, contact);
    if (response.matchedCount === 0) {
      return res.status(404).json({ message: 'Contact not found.' });
    }
    // You can use status 200 or 204. If you use 204, you generally do not return a body.
    res.status(200).json({ message: 'Contact updated.' });
  } catch (err) {
    console.error('Error in updateContact:', err);
    res.status(500).json({ message: 'Error updating contact.', error: err.message });
  }
};

// DELETE a contact by ID
const deleteContact = async (req, res) => {
  const id = req.params.id;
  if (!ObjectId.isValid(id)) {
    return res.status(400).json({ message: 'Invalid ID format.' });
  }
  try {
    const userId = new ObjectId(id);
    const response = await mongodb.getDb().db().collection('contacts').deleteOne({ _id: userId });
    if (response.deletedCount === 0) {
      return res.status(404).json({ message: 'Contact not found.' });
    }
    res.status(200).json({ message: 'Contact deleted.' });
  } catch (err) {
    console.error('Error in deleteContact:', err);
    res.status(500).json({ message: 'Error deleting contact.', error: err.message });
  }
};

module.exports = {
  getAll,
  getSingle,
  createContact,
  updateContact,
  deleteContact
};
