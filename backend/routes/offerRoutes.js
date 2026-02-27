const express = require('express');
const router = express.Router();
const Offer = require('../models/Offer');
const { protect } = require('../middleware/authMiddleware');
const fs = require('fs');
const path = require('path');
const mongoose = require('mongoose');

const OFFERS_FILE = path.join(__dirname, '../data/offers.json');

router.get('/', async (req, res) => {
    if (mongoose.connection.readyState === 1) {
        try {
            const offers = await Offer.find({ isActive: true });
            return res.json(offers);
        } catch (err) {
            console.error('Mongoose Find Error:', err);
        }
    }

    if (fs.existsSync(OFFERS_FILE)) {
        return res.json(JSON.parse(fs.readFileSync(OFFERS_FILE)).filter(o => o.isActive !== false));
    }
    res.json([]);
});

router.post('/', protect, async (req, res) => {
    const { title, description, discountPercentage, isActive } = req.body;

    if (mongoose.connection.readyState === 1) {
        try {
            const offer = await Offer.create({ title, description, discountPercentage, isActive });
            return res.status(201).json(offer);
        } catch (err) {
            console.error('Mongoose Create Error:', err);
        }
    }

    const newOffer = { _id: Date.now().toString(), title, description, discountPercentage, isActive: isActive !== undefined ? isActive : true, createdAt: new Date().toISOString() };
    let localOffers = [];
    if (fs.existsSync(OFFERS_FILE)) {
        localOffers = JSON.parse(fs.readFileSync(OFFERS_FILE));
    }
    localOffers.push(newOffer);
    fs.writeFileSync(OFFERS_FILE, JSON.stringify(localOffers, null, 2));
    res.status(201).json(newOffer);
});

router.put('/:id', protect, async (req, res) => {
    if (mongoose.connection.readyState === 1) {
        try {
            const offer = await Offer.findById(req.params.id);
            if (offer) {
                offer.title = req.body.title || offer.title;
                offer.description = req.body.description || offer.description;
                offer.discountPercentage = req.body.discountPercentage || offer.discountPercentage;
                offer.isActive = req.body.isActive !== undefined ? req.body.isActive : offer.isActive;
                const updatedOffer = await offer.save();
                return res.json(updatedOffer);
            }
        } catch (err) {
            console.error('Mongoose Update Error:', err);
        }
    }

    if (fs.existsSync(OFFERS_FILE)) {
        let localOffers = JSON.parse(fs.readFileSync(OFFERS_FILE));
        const index = localOffers.findIndex(o => o._id === req.params.id);
        if (index !== -1) {
            localOffers[index] = { ...localOffers[index], ...req.body };
            fs.writeFileSync(OFFERS_FILE, JSON.stringify(localOffers, null, 2));
            return res.json(localOffers[index]);
        }
    }
    res.status(404).json({ message: 'Offer not found' });
});

module.exports = router;
