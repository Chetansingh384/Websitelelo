const mongoose = require('mongoose');

const PortfolioSchema = new mongoose.Schema({
    title: { type: String, required: true },
    description: { type: String, required: true },
    imageUrl: { type: String, required: true },
    projectUrl: { type: String },
    category: { type: String }, // e.g., E-commerce, Portfolio, Business
}, { timestamps: true });

module.exports = mongoose.model('Portfolio', PortfolioSchema);
