import React from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, Sparkles } from 'lucide-react';
import { Link } from 'react-scroll';

const Hero = () => {
    return (
        <section id="home" className="relative min-h-screen flex items-center pt-20 overflow-hidden">
            {/* Background Orbs */}
            <div className="absolute top-0 right-0 -translate-y-1/2 translate-x-1/2 w-[600px] h-[600px] bg-primary/20 rounded-full blur-[120px] pointer-events-none" />
            <div className="absolute bottom-0 left-0 translate-y-1/2 -translate-x-1/2 w-[500px] h-[500px] bg-secondary/15 rounded-full blur-[100px] pointer-events-none" />

            <div className="container mx-auto px-6 grid md:grid-cols-2 gap-12 items-center relative z-10">
                <motion.div
                    initial={{ opacity: 0, x: -50 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.8 }}
                >
                    <div className="flex items-center space-x-2 text-primary font-medium mb-6">
                        <Sparkles size={18} />
                        <span>Modern Web Solutions for Everyone</span>
                    </div>
                    <h1 className="text-4xl xs:text-5xl md:text-7xl font-bold leading-tight mb-8">
                        Your Vision, <br />
                        <span className="gradient-text">Our Digital Craft</span>
                    </h1>
                    <p className="text-lg md:text-xl text-slate-600 dark:text-gray-400 mb-10 max-w-lg">
                        Make professional websites affordable and accessible. From small shops to large enterprises, we build your online presence with precision.
                    </p>
                    <div className="flex flex-col sm:flex-row gap-4 sm:space-x-4">
                        <Link to="contact" smooth={true} duration={500} offset={-80} className="btn-primary w-full sm:w-auto flex items-center justify-center space-x-2 cursor-pointer py-4 sm:py-3">
                            <span>Get In Touch</span>
                            <ArrowRight size={20} />
                        </Link>
                        <Link to="portfolio" smooth={true} duration={500} offset={-80} className="px-8 py-4 sm:py-3 rounded-xl border border-slate-200 dark:border-white/10 hover:bg-slate-100 dark:hover:bg-white/5 transition-all text-center cursor-pointer font-bold w-full sm:w-auto">
                            View Our Work
                        </Link>
                    </div>
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 1 }}
                    className="relative"
                >
                    <div className="glass-card p-2 relative">
                        <img
                            src="https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&q=80&w=2426"
                            alt="Dashboard Preview"
                            className="rounded-xl shadow-2xl"
                        />
                    </div>
                </motion.div>
            </div>
        </section>
    );
};

export default Hero;
