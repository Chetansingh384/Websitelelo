const mongoose = require('mongoose');
const dotenv = require('dotenv');
const bcrypt = require('bcryptjs');
const Plan = require('./models/Plan');
const Admin = require('./models/Admin');
const Contact = require('./models/Contact');
const connectDB = require('./config/db');

dotenv.config();
connectDB();

const plans = [
    {
        name: 'Basic',
        price: '₹ 13,999 /-',
        deliveryTime: '7-10 Days',
        features: ['Customized design', 'Single Payment Integration', 'Mobile Responsive', '5 Pages', '30 Product Listing', 'Basic SEO', 'Simple Admin Dashboard', '1 Month Support']
    },
    {
        name: 'Standard',
        price: '₹ 17,999 /-',
        deliveryTime: '14-21 Days',
        features: ['Customized design', 'Multiple Payment Integration', 'Mobile Responsive', '10 Pages', '100 Product Listing', 'On-page SEO', 'Advanced Admin Dashboard', 'Analytics Integration', '3 Month Support']
    },
    {
        name: 'Premium',
        price: '₹ 24,999 /-',
        deliveryTime: '30 Days',
        features: ['Customized design', 'Multiple Payment Integration', 'Mobile Responsive', 'Unlimited Pages', 'Unlimited Product Listing', 'Comprehensive SEO', 'Full Admin Dashboard', 'Analytics Integration', '6 Month Support', 'Animations & Effects']
    }
];

const seedData = async () => {
    try {
        // Clear existing
        await Plan.deleteMany();
        await Admin.deleteMany();
        await Contact.deleteMany();

        // Seed Plans
        await Plan.insertMany(plans);

        // Seed Admin
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash('webistelelo@2026', salt);
        await Admin.create({
            email: 'websitelelo.in@gmail.com',
            password: hashedPassword
        });

        // Seed Sample Contacts
        await Contact.create({
            name: 'Sample Lead',
            email: 'client@example.com',
            phone: '+91 74183 33256',
            message: 'I am interested in your Standard Plan for my e-commerce business.',
            status: 'New'
        });

        console.log('Database Seeded Successfully!');
        console.log('Admin Email: websitelelo.in@gmail.com');
        console.log('Admin Password: webistelelo@2026');
        process.exit();
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
};

seedData();
