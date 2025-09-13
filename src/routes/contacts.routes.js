// src/routes/contacts.routes.js

const express = require('express');
const router = express.Router();
const contactsController = require('../controllers/contacts.controller');

// GET all contacts
router.get('/', contactsController.getAll);

// GET one contact by ID
router.get('/:id', contactsController.getSingle);

// POST create a new contact
router.post('/', contactsController.createContact);

// PUT update a contact by ID
router.put('/:id', contactsController.updateContact);

// DELETE a contact by ID
router.delete('/:id', contactsController.deleteContact);

module.exports = router;
