const mongoose = require('mongoose');

const OfferSchema = new mongoose.Schema({
    title: { type: String, required: true },
    description: { type: String },
    discountPercentage: { type: Number },
    isActive: { type: Boolean, default: false },
}, { timestamps: true });

module.exports = mongoose.model('Offer', OfferSchema);
