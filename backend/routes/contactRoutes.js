const express = require('express');
const router = express.Router();
const Contact = require('../models/Contact');
const { protect } = require('../middleware/authMiddleware');
const fs = require('fs');
const path = require('path');
const mongoose = require('mongoose');

const CONTACTS_FILE = path.join(__dirname, '../data/contacts.json');

// Ensure data directory exists
if (!fs.existsSync(path.join(__dirname, '../data'))) {
    fs.mkdirSync(path.join(__dirname, '../data'));
}

router.post('/', async (req, res) => {
    const { name, email, phone, message } = req.body;

    // Check if MongoDB is connected
    if (mongoose.connection.readyState === 1) {
        try {
            const contact = await Contact.create({ name, email, phone, message });
            return res.status(201).json(contact);
        } catch (err) {
            console.error('Mongoose Create Error:', err);
        }
    }

    // FALLBACK: Save to local JSON file if DB is offline
    console.log('DB Offline: Saving contact to local JSON fallback');
    const newContact = {
        _id: Date.now().toString(),
        name,
        email,
        phone,
        message,
        status: 'New',
        createdAt: new Date().toISOString()
    };

    let localContacts = [];
    if (fs.existsSync(CONTACTS_FILE)) {
        localContacts = JSON.parse(fs.readFileSync(CONTACTS_FILE));
    }
    localContacts.unshift(newContact);
    fs.writeFileSync(CONTACTS_FILE, JSON.stringify(localContacts, null, 2));

    res.status(201).json(newContact);
});

router.get('/', protect, async (req, res) => {
    // Check if MongoDB is connected
    if (mongoose.connection.readyState === 1) {
        try {
            const contacts = await Contact.find({}).sort({ createdAt: -1 });
            return res.json(contacts);
        } catch (err) {
            console.error('Mongoose Find Error:', err);
        }
    }

    // FALLBACK: Read from local JSON file
    if (fs.existsSync(CONTACTS_FILE)) {
        const localContacts = JSON.parse(fs.readFileSync(CONTACTS_FILE));
        return res.json(localContacts);
    }

    res.json([]);
});

module.exports = router;
