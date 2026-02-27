import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ChevronLeft, Shield } from 'lucide-react';

const PrivacyPolicy = () => {
    return (
        <div className="min-h-screen pt-32 pb-20 bg-slate-50 dark:bg-dark text-slate-900 dark:text-white transition-colors duration-300">
            <div className="container mx-auto px-6 max-w-4xl">
                <Link to="/" className="inline-flex items-center space-x-2 text-primary hover:translate-x-1 transition-transform mb-12 font-bold">
                    <ChevronLeft size={20} />
                    <span>Back to Home</span>
                </Link>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="glass-card p-12"
                >
                    <div className="flex items-center space-x-4 mb-12">
                        <div className="p-3 bg-primary/10 rounded-2xl text-primary">
                            <Shield size={32} />
                        </div>
                        <h1 className="text-4xl font-black gradient-text">Privacy Policy</h1>
                    </div>

                    <div className="prose prose-slate dark:prose-invert max-w-none space-y-6 text-slate-600 dark:text-gray-400">
                        <p className="font-bold text-slate-900 dark:text-white">Effective Date: February 25, 2026</p>

                        <section>
                            <h2 className="text-xl font-bold text-slate-900 dark:text-white mt-8 mb-4">1. Information We Collect</h2>
                            <p>We collect information you provide directly to us through our contact forms, including your name, email address, and phone number.</p>
                        </section>

                        <section>
                            <h2 className="text-xl font-bold text-slate-900 dark:text-white mt-8 mb-4">2. How We Use Your Information</h2>
                            <p>We use the information we collect to communicate with you, provide our services, and improve your user experience on WebsiteLelo.</p>
                        </section>

                        <section>
                            <h2 className="text-xl font-bold text-slate-900 dark:text-white mt-8 mb-4">3. Data Security</h2>
                            <p>We implement appropriate technical and organizational measures to protect your personal data against unauthorized access or disclosure.</p>
                        </section>

                        <section>
                            <h2 className="text-xl font-bold text-slate-900 dark:text-white mt-8 mb-4">4. Contact Us</h2>
                            <p>If you have any questions about our Privacy Policy, please contact us at <span className="text-primary font-bold italic">websitelelo.in@gmail.com</span>.</p>
                        </section>
                    </div>
                </motion.div>
            </div>
        </div>
    );
};

export default PrivacyPolicy;
