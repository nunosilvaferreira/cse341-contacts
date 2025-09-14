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

// Helper: convert id for Mongo query (ObjectId if valid, else keep string)
function mongoQueryId(id) {
  return ObjectId.isValid(id) ? new ObjectId(id) : id;
}

// GET all contacts (ensures each has an _id)
const getAll = async (req, res) => {
  try {
    const contacts = await readContactsFile();
    let updated = false;

    contacts.forEach(contact => {
      if (!contact._id) {
        contact._id = new ObjectId().toString();
        updated = true;
      }
    });

    if (updated) {
      await writeContactsFile(contacts);
    }

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
    if (!contact) return res.status(404).json({ message: 'Contact not found.' });
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

    const newId = new ObjectId().toString();
    const contact = {
      _id: newId,
      firstName,
      lastName,
      email,
      favoriteColor: favoriteColor || null,
      birthday: birthday || null
    };

    const contacts = await readContactsFile();
    contacts.push(contact);
    await writeContactsFile(contacts);

    const dbContact = { ...contact, _id: new ObjectId(newId) };
    const result = await mongodb.getDb().db().collection('contacts').insertOne(dbContact);

    if (result.acknowledged) {
      return res.status(201).json({ id: newId, message: 'Contact created (file + Mongo).' });
    } else {
      return res.status(500).json({ message: 'Created in file but failed to insert into Mongo.' });
    }
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
    const idx = contacts.findIndex(c => String(c._id) === String(id));
    if (idx === -1) return res.status(404).json({ message: 'Contact not found.' });

    const updated = {
      _id: id,
      firstName,
      lastName,
      email,
      favoriteColor: favoriteColor || null,
      birthday: birthday || null
    };

    contacts[idx] = updated;
    await writeContactsFile(contacts);

    // Update Mongo using string _id for consistency
    const collection = mongodb.getDb().db().collection('contacts');
    await collection.updateOne(
      { _id: id }, // filter by string
      { $set: { ...updated, _id: id } }, // keep _id as string
      { upsert: true }
    );

    return res.status(200).json({ message: 'Contact updated (file + Mongo).' });
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
    const newContacts = contacts.filter(c => String(c._id) !== String(id));
    if (newContacts.length === contacts.length) {
      return res.status(404).json({ message: 'Contact not found.' });
    }
    await writeContactsFile(newContacts);

    const collection = mongodb.getDb().db().collection('contacts');
    await collection.deleteOne({ _id: id });

    return res.status(200).json({ message: 'Contact deleted (file + Mongo).' });
  } catch (err) {
    console.error('deleteContact error:', err);
    return res.status(500).json({ message: 'Error deleting contact.', error: err.message });
  }
};

module.exports = {
  getAll,
  getSingle,
  createContact,
  updateContact,
  deleteContact
};
