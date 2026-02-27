const mongoose = require('mongoose');

const PlanSchema = new mongoose.Schema({
    name: { type: String, required: true },
    price: { type: String, required: true },
    deliveryTime: { type: String, required: true },
    features: [{ type: String }],
    isActive: { type: Boolean, default: true },
}, { timestamps: true });

module.exports = mongoose.model('Plan', PlanSchema);
