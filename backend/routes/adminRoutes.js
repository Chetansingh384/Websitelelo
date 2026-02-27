const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const Admin = require('../models/Admin');

// @desc Auth admin & get token
// @route POST /api/admin/login
router.post('/login', async (req, res) => {
    const { email, password } = req.body;

    try {
        const admin = await Admin.findOne({ email });

        if (admin && (await bcrypt.compare(password, admin.password))) {
            return res.json({
                _id: admin._id,
                email: admin.email,
                token: jwt.sign({ id: admin._id }, process.env.JWT_SECRET, { expiresIn: '30d' }),
            });
        }
    } catch (err) {
        console.log('Login working in Demo Mode (Offline)');
    }

    // DEMO MODE FALLBACK: If DB fails or user not found, allow demo login
    if (email === 'websitelelo.in@gmail.com' && password === 'webistelelo@2026') {
        return res.json({
            _id: 'demo_id',
            email: 'websitelelo.in@gmail.com',
            token: jwt.sign({ id: 'demo_id' }, process.env.JWT_SECRET, { expiresIn: '30d' }),
            isDemo: true
        });
    }

    res.status(401).json({ message: 'Invalid email or password' });
});

// Seed admin (Only for setup - should be removed or protected)
router.post('/seed', async (req, res) => {
    const { email, password } = req.body;
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const adminExists = await Admin.findOne({ email });
    if (adminExists) return res.status(400).json({ message: 'Admin already exists' });

    const admin = await Admin.create({ email, password: hashedPassword });
    res.status(201).json(admin);
});

module.exports = router;
