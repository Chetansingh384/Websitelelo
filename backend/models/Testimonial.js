const mongoose = require('mongoose');

const TestimonialSchema = new mongoose.Schema({
    clientName: { type: String, required: true },
    clientRole: { type: String },
    message: { type: String, required: true },
    imageUrl: { type: String },
}, { timestamps: true });

module.exports = mongoose.model('Testimonial', TestimonialSchema);
