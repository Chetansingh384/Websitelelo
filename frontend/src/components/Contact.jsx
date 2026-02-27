import React, { useState } from 'react';
import { Mail, Phone, MessageSquare, CheckCircle, ArrowRight, MapPin } from 'lucide-react';
import axios from 'axios';
import { db } from '../firebase';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import Toast from './Toast';
import { useAuth } from '../context/AuthContext';
import { motion, AnimatePresence } from 'framer-motion';

const Contact = () => {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phone: '',
        message: ''
    });
    const [loading, setLoading] = useState(false);
    const [toast, setToast] = useState({ isVisible: false, message: '', type: 'success' });
    const [showSuccess, setShowSuccess] = useState(false);

    const showToast = (message, type) => {
        setToast({ isVisible: true, message, type });
    };

    const hideToast = () => {
        setToast((prev) => ({ ...prev, isVisible: false }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            // 1. Save to Firebase Firestore
            const leadData = {
                ...formData,
                status: 'New',
                createdAt: serverTimestamp()
            };
            await addDoc(collection(db, 'leads'), leadData);

            // 2. Send to Basin (for email notifications)
            try {
                await axios.post('https://usebasin.com/f/2151b5dfa8b1', formData);
            } catch (basinErr) {
                console.error("Basin Notification Failed:", basinErr.response?.data || basinErr.message);
                // We don't throw here so the user still gets the success message since Firestore saved the lead
            }

            setShowSuccess(true);
            setFormData({ name: '', email: '', phone: '', message: '' });
        } catch (err) {
            console.error("Firestore Submission Exception:", err);
            showToast('Error saving your request. Please try again.', 'error');
        } finally {
            setLoading(false);
        }
    };

    return (
        <>
            <section id="contact" className="py-24 relative overflow-hidden">
                <div className="container mx-auto px-6 relative z-10">
                    <div className="max-w-5xl mx-auto glass-card p-0 overflow-hidden flex flex-col md:flex-row shadow-2xl">
                        <div className="bg-primary p-8 md:p-12 md:w-2/5 text-white">
                            <h2 className="text-3xl font-bold mb-8">Get In Touch</h2>
                            <p className="mb-12 text-blue-100 opacity-80 leading-relaxed font-medium">
                                Ready to take your business online? Fill out the form and we'll get back to you within 24 hours.
                            </p>
                            <div className="space-y-6">
                                <div className="flex items-start space-x-4 group cursor-pointer hover:translate-x-2 transition-transform">
                                    <div className="w-10 h-10 bg-white/10 rounded-full flex items-center justify-center flex-shrink-0">
                                        <Mail size={20} />
                                    </div>
                                    <span className="pt-2 text-sm md:text-base">websitelelo.in@gmail.com</span>
                                </div>
                                <a
                                    href="tel:+917418333256"
                                    className="flex items-start space-x-4 group cursor-pointer hover:translate-x-2 transition-transform"
                                >
                                    <div className="w-10 h-10 bg-white/10 rounded-full flex items-center justify-center flex-shrink-0">
                                        <Phone size={20} />
                                    </div>
                                    <div className="flex flex-col pt-1 text-white text-sm md:text-base">
                                        <span>+91 74183 33256</span>
                                        <span>+91 94067 16007</span>
                                    </div>
                                </a>
                                <a
                                    href="https://wa.me/917418333256?text=Hi!%20I'm%20interested%20in%20WebsiteLelo's%20services.%20Can%20we%20have%20a%20chat?"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="flex items-start space-x-4 group cursor-pointer hover:translate-x-2 transition-transform"
                                >
                                    <div className="w-10 h-10 bg-white/10 rounded-full flex items-center justify-center flex-shrink-0">
                                        <MessageSquare size={20} />
                                    </div>
                                    <span className="pt-2 font-bold text-white/90 text-sm md:text-base">WhatsApp Support Available</span>
                                </a>
                                <div className="flex items-start space-x-4 group cursor-pointer hover:translate-x-2 transition-transform">
                                    <div className="w-10 h-10 bg-white/10 rounded-full flex items-center justify-center flex-shrink-0">
                                        <MapPin size={20} />
                                    </div>
                                    <div className="pt-1 text-sm leading-relaxed opacity-90 max-w-xs text-white">
                                        SP-1 Kant Kalwar, NH11C, <br />
                                        RIICO Industrial Area, Rajasthan 303002 <br />
                                        <span className="font-bold">Amity University Jaipur</span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="p-8 md:p-12 md:w-3/5 bg-white/5 backdrop-blur-sm">
                            <form onSubmit={handleSubmit} className="space-y-6 text-slate-800 dark:text-white">
                                <div className="grid md:grid-cols-2 gap-6">
                                    <div className="space-y-2">
                                        <label className="text-sm font-bold text-slate-700 dark:text-slate-400">Name</label>
                                        <input
                                            type="text"
                                            value={formData.name}
                                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                            className="w-full bg-slate-50/50 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-xl px-4 py-4 dark:text-white text-slate-900 focus:border-primary outline-none transition-all placeholder:text-slate-400 dark:placeholder:text-gray-500"
                                            placeholder="Your Name"
                                            required
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-sm font-bold text-slate-700 dark:text-slate-400">Email</label>
                                        <input
                                            type="email"
                                            value={formData.email}
                                            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                            className="w-full bg-slate-50/50 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-xl px-4 py-4 dark:text-white text-slate-900 focus:border-primary outline-none transition-all placeholder:text-slate-400 dark:placeholder:text-gray-500"
                                            placeholder="Your Email"
                                            required
                                        />
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-bold text-slate-700 dark:text-slate-400">Phone Number</label>
                                    <input
                                        type="text"
                                        value={formData.phone}
                                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                                        className="w-full bg-slate-50/50 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-xl px-4 py-4 dark:text-white text-slate-900 focus:border-primary outline-none transition-all placeholder:text-slate-400 dark:placeholder:text-gray-500"
                                        placeholder="+91 74183 33256"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-bold text-slate-700 dark:text-slate-400">Message</label>
                                    <textarea
                                        rows="4"
                                        value={formData.message}
                                        onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                                        className="w-full bg-slate-50/50 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-xl px-4 py-4 dark:text-white text-slate-900 focus:border-primary outline-none transition-all placeholder:text-slate-400 dark:placeholder:text-gray-500"
                                        placeholder="Tell us about your project..."
                                        required
                                    ></textarea>
                                </div>
                                <button
                                    type="submit"
                                    disabled={loading}
                                    className="btn-primary w-full py-4 text-lg font-bold flex items-center justify-center space-x-2 active:scale-95 disabled:opacity-50"
                                >
                                    {loading ? 'Sending...' : 'Send Message'}
                                </button>
                            </form>
                        </div>
                    </div>
                </div>

                <Toast
                    isVisible={toast.isVisible}
                    message={toast.message}
                    type={toast.type}
                    onClose={hideToast}
                />
            </section>

            {/* Success Modal */}
            <AnimatePresence>
                {showSuccess && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-[200] flex items-center justify-center p-6 bg-dark/90 backdrop-blur-xl"
                    >
                        <motion.div
                            initial={{ scale: 0.8, y: 20 }}
                            animate={{ scale: 1, y: 0 }}
                            exit={{ scale: 0.8, y: 20 }}
                            className="bg-white dark:bg-[#111827] w-full max-w-md rounded-[3rem] p-12 text-center shadow-2xl border border-white/5 relative overflow-hidden"
                        >
                            <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-primary to-secondary" />

                            <motion.div
                                initial={{ scale: 0 }}
                                animate={{ scale: 1 }}
                                transition={{ type: 'spring', damping: 12, delay: 0.2 }}
                                className="w-24 h-24 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-8"
                            >
                                <CheckCircle size={48} className="text-primary" />
                            </motion.div>

                            <h2 className="text-3xl font-black text-slate-900 dark:text-white mb-4 tracking-tight">Success!</h2>
                            <p className="text-slate-600 dark:text-gray-400 text-lg leading-relaxed mb-10">
                                Thank you for reaching out! <br />
                                <span className="font-bold text-primary italic">Our team will connect with you soon.</span>
                            </p>

                            <button
                                onClick={() => setShowSuccess(false)}
                                className="w-full bg-slate-900 dark:bg-white dark:text-dark text-white py-5 rounded-2xl font-black text-sm uppercase tracking-widest hover:scale-105 transition-all active:scale-95 flex items-center justify-center space-x-2"
                            >
                                <span>Got It</span>
                            </button>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </>

    );
};

export default Contact;
