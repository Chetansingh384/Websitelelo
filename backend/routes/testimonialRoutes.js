const express = require('express');
const router = express.Router();
const Testimonial = require('../models/Testimonial');
const { protect } = require('../middleware/authMiddleware');
const fs = require('fs');
const path = require('path');
const mongoose = require('mongoose');

const TESTIMONIALS_FILE = path.join(__dirname, '../data/testimonials.json');

router.get('/', async (req, res) => {
    if (mongoose.connection.readyState === 1) {
        try {
            const items = await Testimonial.find({});
            return res.json(items);
        } catch (err) {
            console.error('Mongoose Find Error:', err);
        }
    }

    if (fs.existsSync(TESTIMONIALS_FILE)) {
        return res.json(JSON.parse(fs.readFileSync(TESTIMONIALS_FILE)));
    }
    res.json([]);
});

router.post('/', protect, async (req, res) => {
    const { clientName, clientRole, message, imageUrl } = req.body;

    if (mongoose.connection.readyState === 1) {
        try {
            const item = await Testimonial.create({ clientName, clientRole, message, imageUrl });
            return res.status(201).json(item);
        } catch (err) {
            console.error('Mongoose Create Error:', err);
        }
    }

    const newItem = { _id: Date.now().toString(), clientName, clientRole, message, imageUrl, createdAt: new Date().toISOString() };
    let localItems = [];
    if (fs.existsSync(TESTIMONIALS_FILE)) {
        localItems = JSON.parse(fs.readFileSync(TESTIMONIALS_FILE));
    }
    localItems.unshift(newItem);
    fs.writeFileSync(TESTIMONIALS_FILE, JSON.stringify(localItems, null, 2));
    res.status(201).json(newItem);
});

router.delete('/:id', protect, async (req, res) => {
    if (mongoose.connection.readyState === 1) {
        try {
            await Testimonial.findByIdAndDelete(req.params.id);
            return res.json({ message: 'Testimonial removed' });
        } catch (err) {
            console.error('Mongoose Delete Error:', err);
        }
    }

    if (fs.existsSync(TESTIMONIALS_FILE)) {
        let localItems = JSON.parse(fs.readFileSync(TESTIMONIALS_FILE));
        localItems = localItems.filter(item => item._id !== req.params.id);
        fs.writeFileSync(TESTIMONIALS_FILE, JSON.stringify(localItems, null, 2));
        return res.json({ message: 'Testimonial removed (Local)' });
    }
    res.status(404).json({ message: 'Not found' });
});

module.exports = router;
