const express = require('express');
const router = express.Router();
const TeamMember = require('../models/TeamMember');
const { protect } = require('../middleware/authMiddleware');
const fs = require('fs');
const path = require('path');
const mongoose = require('mongoose');

const TEAM_FILE = path.join(__dirname, '../data/team.json');

// Get all team members
router.get('/', async (req, res) => {
    if (mongoose.connection.readyState === 1) {
        try {
            const members = await TeamMember.find({});
            return res.json(members);
        } catch (err) {
            console.error('Mongoose Find Error:', err);
        }
    }

    if (fs.existsSync(TEAM_FILE)) {
        return res.json(JSON.parse(fs.readFileSync(TEAM_FILE)));
    }
    res.json([]);
});

// Add new team member
router.post('/', protect, async (req, res) => {
    const { name, role, image, bio, socials } = req.body;

    if (mongoose.connection.readyState === 1) {
        try {
            const member = await TeamMember.create({ name, role, image, bio, socials });
            return res.status(201).json(member);
        } catch (err) {
            console.error('Mongoose Create Error:', err);
        }
    }

    const newMember = { _id: Date.now().toString(), name, role, image, bio, socials, createdAt: new Date().toISOString() };
    let localMembers = [];
    if (fs.existsSync(TEAM_FILE)) {
        localMembers = JSON.parse(fs.readFileSync(TEAM_FILE));
    }
    localMembers.push(newMember);
    fs.writeFileSync(TEAM_FILE, JSON.stringify(localMembers, null, 2));
    res.status(201).json(newMember);
});

// Update team member
router.put('/:id', protect, async (req, res) => {
    if (mongoose.connection.readyState === 1) {
        try {
            const member = await TeamMember.findById(req.params.id);
            if (member) {
                member.name = req.body.name || member.name;
                member.role = req.body.role || member.role;
                member.image = req.body.image || member.image;
                member.bio = req.body.bio || member.bio;
                member.socials = req.body.socials || member.socials;

                const updatedMember = await member.save();
                return res.json(updatedMember);
            }
        } catch (err) {
            console.error('Mongoose Update Error:', err);
        }
    }

    if (fs.existsSync(TEAM_FILE)) {
        let localMembers = JSON.parse(fs.readFileSync(TEAM_FILE));
        const index = localMembers.findIndex(m => m._id === req.params.id);
        if (index !== -1) {
            localMembers[index] = { ...localMembers[index], ...req.body };
            fs.writeFileSync(TEAM_FILE, JSON.stringify(localMembers, null, 2));
            return res.json(localMembers[index]);
        }
    }
    res.status(404).json({ message: 'Member not found' });
});

// Delete team member
router.delete('/:id', protect, async (req, res) => {
    if (mongoose.connection.readyState === 1) {
        try {
            await TeamMember.findByIdAndDelete(req.params.id);
            return res.json({ message: 'Member removed' });
        } catch (err) {
            console.error('Mongoose Delete Error:', err);
        }
    }

    if (fs.existsSync(TEAM_FILE)) {
        let localMembers = JSON.parse(fs.readFileSync(TEAM_FILE));
        localMembers = localMembers.filter(m => m._id !== req.params.id);
        fs.writeFileSync(TEAM_FILE, JSON.stringify(localMembers, null, 2));
        return res.json({ message: 'Member removed (Local)' });
    }
    res.status(404).json({ message: 'Member not found' });
});

module.exports = router;
