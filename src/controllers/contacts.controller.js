// src/controllers/contacts.controller.js
const mongodb = require('../db/connection');
const { ObjectId } = require('mongodb');
const fs = require('fs').promises;
const path = require('path');

const seedFile = path.join(__dirname, '../../seed/contacts.json');

// Read contacts from JSON file
async function readContactsFile() {
  try {
    const raw = await fs.readFile(seedFile, 'utf8');
    return JSON.parse(raw);
  } catch (err) {
    if (err.code === 'ENOENT') return [];
    throw err;
  }
}

// Write contacts array to JSON file
async function writeContactsFile(arr) {
  await fs.writeFile(seedFile, JSON.stringify(arr, null, 2), 'utf8');
}

// Sync JSON file with MongoDB
async function syncWithMongoDB() {
  try {
    const contacts = await readContactsFile();
    const db = mongodb.getDb();
    const collection = db.collection('contacts');
    
    // Clear existing data in MongoDB
    await collection.deleteMany({});
    
    // Insert all contacts from JSON file
    if (contacts.length > 0) {
      await collection.insertMany(contacts);
    }
    
    console.log('✅ Contacts synchronized with MongoDB');
  } catch (err) {
    console.error('❌ Error syncing with MongoDB:', err);
  }
}

// GET all contacts
const getAll = async (req, res) => {
  try {
    const contacts = await readContactsFile();
    return res.status(200).json(contacts);
  } catch (err) {
    console.error('getAll error:', err);
    return res.status(500).json({ message: 'Error reading contacts file.', error: err.message });
  }
};

// GET a single contact
const getSingle = async (req, res) => {
  try {
    const id = req.params.id;
    const contacts = await readContactsFile();
    const contact = contacts.find(c => String(c._id) === String(id));
    
    if (!contact) {
      return res.status(404).json({ message: 'Contact not found.' });
    }
    
    return res.status(200).json(contact);
  } catch (err) {
    console.error('getSingle error:', err);
    return res.status(500).json({ message: 'Error reading contact.', error: err.message });
  }
};

// CREATE a new contact
const createContact = async (req, res) => {
  try {
    const { firstName, lastName, email, favoriteColor, birthday } = req.body;
    
    if (!firstName || !lastName || !email) {
      return res.status(400).json({ message: 'firstName, lastName and email are required.' });
    }

    const newContact = {
      _id: new ObjectId().toString(),
      firstName,
      lastName,
      email,
      favoriteColor: favoriteColor || null,
      birthday: birthday || null
    };

    // Update JSON file
    const contacts = await readContactsFile();
    contacts.push(newContact);
    await writeContactsFile(contacts);
    
    // Sync with MongoDB
    await syncWithMongoDB();

    return res.status(201).json({ 
      id: newContact._id, 
      message: 'Contact created and synchronized with MongoDB.' 
    });
  } catch (err) {
    console.error('createContact error:', err);
    return res.status(500).json({ message: 'Error creating contact.', error: err.message });
  }
};

// UPDATE an existing contact
const updateContact = async (req, res) => {
  try {
    const id = req.params.id;
    const { firstName, lastName, email, favoriteColor, birthday } = req.body;

    if (!firstName || !lastName || !email) {
      return res.status(400).json({ message: 'firstName, lastName and email are required.' });
    }

    const contacts = await readContactsFile();
    const contactIndex = contacts.findIndex(c => String(c._id) === String(id));
    
    if (contactIndex === -1) {
      return res.status(404).json({ message: 'Contact not found.' });
    }

    // Update contact in array
    contacts[contactIndex] = {
      ...contacts[contactIndex],
      firstName,
      lastName,
      email,
      favoriteColor: favoriteColor || null,
      birthday: birthday || null
    };

    // Update JSON file
    await writeContactsFile(contacts);
    
    // Sync with MongoDB
    await syncWithMongoDB();

    return res.status(200).json({ message: 'Contact updated and synchronized with MongoDB.' });
  } catch (err) {
    console.error('updateContact error:', err);
    return res.status(500).json({ message: 'Error updating contact.', error: err.message });
  }
};

// DELETE a contact
const deleteContact = async (req, res) => {
  try {
    const id = req.params.id;
    const contacts = await readContactsFile();
    const filteredContacts = contacts.filter(c => String(c._id) !== String(id));
    
    if (filteredContacts.length === contacts.length) {
      return res.status(404).json({ message: 'Contact not found.' });
    }

    // Update JSON file
    await writeContactsFile(filteredContacts);
    
    // Sync with MongoDB
    await syncWithMongoDB();

    return res.status(200).json({ message: 'Contact deleted and synchronized with MongoDB.' });
  } catch (err) {
    console.error('deleteContact error:', err);
    return res.status(500).json({ message: 'Error deleting contact.', error: err.message });
  }
};

// Initialize synchronization on server start
async function initializeSync() {
  try {
    await syncWithMongoDB();
  } catch (err) {
    console.error('Initial sync error:', err);
  }
}

module.exports = {
  getAll,
  getSingle,
  createContact,
  updateContact,
  deleteContact,
  initializeSync
};