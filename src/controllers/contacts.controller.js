const { ObjectId } = require('mongodb');
const { connectToDatabase } = require('../db/connection');


async function getAllContacts(_req, res, next) {
try {
const db = await connectToDatabase();
const contacts = await db.collection('contacts').find().toArray();
res.status(200).json(contacts);
} catch (err) {
next(err);
}
}


async function getContactById(req, res, next) {
try {
const { id } = req.params;
if (!ObjectId.isValid(id)) {
return res.status(400).json({ error: 'Invalid id format' });
}


const db = await connectToDatabase();
const contact = await db.collection('contacts').findOne({ _id: new ObjectId(id) });


if (!contact) {
return res.status(404).json({ error: 'Contact not found' });
}


res.status(200).json(contact);
} catch (err) {
next(err);
}
}


module.exports = { getAllContacts, getContactById };