const express = require('express');
const router = express.Router();
const Plan = require('../models/Plan');
const { protect } = require('../middleware/authMiddleware');
const fs = require('fs');
const path = require('path');
const mongoose = require('mongoose');

const PLANS_FILE = path.join(__dirname, '../data/plans.json');

// Get all plans
router.get('/', async (req, res) => {
    if (mongoose.connection.readyState === 1) {
        try {
            const plans = await Plan.find({ isActive: true });
            return res.json(plans);
        } catch (err) {
            console.error('Mongoose Find Error:', err);
        }
    }

    if (fs.existsSync(PLANS_FILE)) {
        return res.json(JSON.parse(fs.readFileSync(PLANS_FILE)).filter(p => p.isActive !== false));
    }
    res.json([]);
});

// Create plan (Admin)
router.post('/', protect, async (req, res) => {
    const { name, price, deliveryTime, features } = req.body;

    if (mongoose.connection.readyState === 1) {
        try {
            const plan = await Plan.create({ name, price, deliveryTime, features });
            return res.status(201).json(plan);
        } catch (err) {
            console.error('Mongoose Create Error:', err);
        }
    }

    const newPlan = { _id: Date.now().toString(), name, price, deliveryTime, features, isActive: true, createdAt: new Date().toISOString() };
    let localPlans = [];
    if (fs.existsSync(PLANS_FILE)) {
        localPlans = JSON.parse(fs.readFileSync(PLANS_FILE));
    }
    localPlans.push(newPlan);
    fs.writeFileSync(PLANS_FILE, JSON.stringify(localPlans, null, 2));
    res.status(201).json(newPlan);
});

// Update plan (Admin)
router.put('/:id', protect, async (req, res) => {
    if (mongoose.connection.readyState === 1) {
        try {
            const plan = await Plan.findById(req.params.id);
            if (plan) {
                plan.name = req.body.name || plan.name;
                plan.price = req.body.price || plan.price;
                plan.deliveryTime = req.body.deliveryTime || plan.deliveryTime;
                plan.features = req.body.features || plan.features;
                plan.isActive = req.body.isActive !== undefined ? req.body.isActive : plan.isActive;
                const updatedPlan = await plan.save();
                return res.json(updatedPlan);
            }
        } catch (err) {
            console.error('Mongoose Update Error:', err);
        }
    }

    if (fs.existsSync(PLANS_FILE)) {
        let localPlans = JSON.parse(fs.readFileSync(PLANS_FILE));
        const index = localPlans.findIndex(p => p._id === req.params.id);
        if (index !== -1) {
            localPlans[index] = { ...localPlans[index], ...req.body };
            fs.writeFileSync(PLANS_FILE, JSON.stringify(localPlans, null, 2));
            return res.json(localPlans[index]);
        }
    }
    res.status(404).json({ message: 'Plan not found' });
});

// Delete plan (Admin)
router.delete('/:id', protect, async (req, res) => {
    if (mongoose.connection.readyState === 1) {
        try {
            const plan = await Plan.findById(req.params.id);
            if (plan) {
                await plan.deleteOne();
                return res.json({ message: 'Plan removed' });
            }
        } catch (err) {
            console.error('Mongoose Delete Error:', err);
        }
    }

    if (fs.existsSync(PLANS_FILE)) {
        let localPlans = JSON.parse(fs.readFileSync(PLANS_FILE));
        localPlans = localPlans.filter(p => p._id !== req.params.id);
        fs.writeFileSync(PLANS_FILE, JSON.stringify(localPlans, null, 2));
        return res.json({ message: 'Plan removed (Local)' });
    }
    res.status(404).json({ message: 'Plan not found' });
});

module.exports = router;
