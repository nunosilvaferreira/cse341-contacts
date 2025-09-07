const express = require('express');
const { getAllContacts, getContactById } = require('../controllers/contacts.controller');


const router = express.Router();


router.get('/', getAllContacts); // GET /contacts
router.get('/:id', getContactById); // GET /contacts/:id


module.exports = router;