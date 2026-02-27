const mongoose = require('mongoose');

const ContactSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true },
    message: { type: String, required: true },
    status: { type: String, enum: ['New', 'Read', 'Resolved'], default: 'New' },
}, { timestamps: true });

module.exports = mongoose.model('Contact', ContactSchema);
