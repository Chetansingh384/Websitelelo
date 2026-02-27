const express = require('express');
const router = express.Router();
const Portfolio = require('../models/Portfolio');
const { protect } = require('../middleware/authMiddleware');
const fs = require('fs');
const path = require('path');
const mongoose = require('mongoose');

const PORTFOLIO_FILE = path.join(__dirname, '../data/portfolio.json');

// @desc Get all portfolio items
router.get('/', async (req, res) => {
    if (mongoose.connection.readyState === 1) {
        try {
            const items = await Portfolio.find({});
            return res.json(items);
        } catch (err) {
            console.error('Mongoose Find Error:', err);
        }
    }

    if (fs.existsSync(PORTFOLIO_FILE)) {
        return res.json(JSON.parse(fs.readFileSync(PORTFOLIO_FILE)));
    }
    res.json([]);
});

// @desc Add new portfolio item
router.post('/', protect, async (req, res) => {
    const { title, description, imageUrl, link, category } = req.body;

    if (mongoose.connection.readyState === 1) {
        try {
            const item = await Portfolio.create({
                title,
                description,
                imageUrl,
                projectUrl: link,
                category
            });
            return res.status(201).json(item);
        } catch (err) {
            console.error('Mongoose Create Error:', err);
        }
    }

    const newItem = {
        _id: Date.now().toString(),
        title,
        description,
        imageUrl,
        projectUrl: link,
        category,
        createdAt: new Date().toISOString()
    };
    let localItems = [];
    if (fs.existsSync(PORTFOLIO_FILE)) {
        localItems = JSON.parse(fs.readFileSync(PORTFOLIO_FILE));
    }
    localItems.unshift(newItem);
    fs.writeFileSync(PORTFOLIO_FILE, JSON.stringify(localItems, null, 2));
    res.status(201).json(newItem);
});

// @desc Update portfolio item
router.put('/:id', protect, async (req, res) => {
    const { title, description, imageUrl, link, category } = req.body;

    if (mongoose.connection.readyState === 1) {
        try {
            const item = await Portfolio.findById(req.params.id);
            if (item) {
                item.title = title || item.title;
                item.description = description || item.description;
                item.imageUrl = imageUrl || item.imageUrl;
                item.projectUrl = link || item.projectUrl;
                item.category = category || item.category;

                const updatedItem = await item.save();
                return res.json(updatedItem);
            }
        } catch (err) {
            console.error('Mongoose Update Error:', err);
        }
    }

    if (fs.existsSync(PORTFOLIO_FILE)) {
        let localItems = JSON.parse(fs.readFileSync(PORTFOLIO_FILE));
        const index = localItems.findIndex(i => i._id === req.params.id);
        if (index !== -1) {
            localItems[index] = { ...localItems[index], ...req.body, projectUrl: link || localItems[index].projectUrl };
            fs.writeFileSync(PORTFOLIO_FILE, JSON.stringify(localItems, null, 2));
            return res.json(localItems[index]);
        }
    }
    res.status(404).json({ message: 'Item not found' });
});

// @desc Delete portfolio item
router.delete('/:id', protect, async (req, res) => {
    if (mongoose.connection.readyState === 1) {
        try {
            const item = await Portfolio.findById(req.params.id);
            if (item) {
                await item.deleteOne();
                return res.json({ message: 'Portfolio item removed' });
            }
        } catch (err) {
            console.error('Mongoose Delete Error:', err);
        }
    }

    if (fs.existsSync(PORTFOLIO_FILE)) {
        let localItems = JSON.parse(fs.readFileSync(PORTFOLIO_FILE));
        localItems = localItems.filter(i => i._id !== req.params.id);
        fs.writeFileSync(PORTFOLIO_FILE, JSON.stringify(localItems, null, 2));
        return res.json({ message: 'Portfolio item removed (Local)' });
    }
    res.status(404).json({ message: 'Portfolio item not found' });
});

module.exports = router;
