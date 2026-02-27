import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ChevronLeft, FileText } from 'lucide-react';

const TermsOfService = () => {
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
                            <FileText size={32} />
                        </div>
                        <h1 className="text-4xl font-black gradient-text">Terms of Service</h1>
                    </div>

                    <div className="prose prose-slate dark:prose-invert max-w-none space-y-6 text-slate-600 dark:text-gray-400">
                        <p className="font-bold text-slate-900 dark:text-white">Effective Date: February 25, 2026</p>

                        <section>
                            <h2 className="text-xl font-bold text-slate-900 dark:text-white mt-8 mb-4">1. Acceptance of Terms</h2>
                            <p>By accessing and using WebsiteLelo, you agree to be bound by these Terms of Service and all applicable laws and regulations.</p>
                        </section>

                        <section>
                            <h2 className="text-xl font-bold text-slate-900 dark:text-white mt-8 mb-4">2. Use of Services</h2>
                            <p>You agree to use our services only for lawful purposes and in accordance with these Terms.</p>
                        </section>

                        <section>
                            <h2 className="text-xl font-bold text-slate-900 dark:text-white mt-8 mb-4">3. Intellectual Property</h2>
                            <p>All content and materials available on WebsiteLelo are the property of WebsiteLelo or its licensors and are protected by intellectual property laws.</p>
                        </section>

                        <section>
                            <h2 className="text-xl font-bold text-slate-900 dark:text-white mt-8 mb-4">4. Limitation of Liability</h2>
                            <p>WebsiteLelo shall not be liable for any indirect, incidental, or consequential damages arising out of your use of our services.</p>
                        </section>
                    </div>
                </motion.div>
            </div>
        </div>
    );
};

export default TermsOfService;
