import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ChevronLeft, HelpCircle } from 'lucide-react';

const FAQ = () => {
    const faqs = [
        {
            q: "How long does it take to build a website?",
            a: "Typical landing pages take 3-5 days. Complex multi-page sites can take 2-3 weeks depending on requirements."
        },
        {
            q: "Do I need to provide the hosting?",
            a: "We provide consultation on the best hosting for your needs. We can also manage the deployment for you."
        },
        {
            q: "Is the website mobile-friendly?",
            a: "Absolutely! Every website we build is 100% responsive and optimized for all devices."
        },
        {
            q: "Can I manage the content myself?",
            a: "Yes, we integrate easy-to-use CMS options or custom admin panels if you need frequent updates."
        }
    ];

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
                            <HelpCircle size={32} />
                        </div>
                        <h1 className="text-4xl font-black gradient-text">Frequently Asked Questions</h1>
                    </div>

                    <div className="space-y-8">
                        {faqs.map((faq, index) => (
                            <div key={index} className="border-b border-slate-200 dark:border-white/5 pb-8 last:border-0">
                                <h3 className="text-xl font-bold mb-4">{faq.q}</h3>
                                <p className="text-slate-600 dark:text-gray-400 leading-relaxed italic">
                                    "{faq.a}"
                                </p>
                            </div>
                        ))}
                    </div>
                </motion.div>
            </div>
        </div>
    );
};

export default FAQ;
