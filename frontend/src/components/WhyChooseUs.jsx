import React from 'react';
import { DollarSign, Zap, Palette, Search, Smartphone } from 'lucide-react';

const reasons = [
    { icon: <DollarSign />, title: 'Affordable', text: 'Premium design without the premium price tag.' },
    { icon: <Zap />, title: 'Fast Delivery', text: 'Get your website up and running in days, not months.' },
    { icon: <Palette />, title: 'Professional Design', text: 'Tailored aesthetics that match your brand identity.' },
    { icon: <Search />, title: 'SEO Friendly', text: 'Optimized for search engines right from the start.' },
    { icon: <Smartphone />, title: 'Mobile Responsive', text: 'Flawless experience on all devices and screen sizes.' }
];

const WhyChooseUs = () => {
    return (
        <section className="py-24">
            <div className="container mx-auto px-6">
                <div className="grid md:grid-cols-2 gap-16 items-center">
                    <div>
                        <h2 className="text-4xl font-bold mb-8">Why Choose <span className="gradient-text">WebsiteLelo</span>?</h2>
                        <div className="space-y-8">
                            {reasons.map((reason, index) => (
                                <div key={index} className="flex space-x-4">
                                    <div className="flex-shrink-0 w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center text-primary">
                                        {reason.icon}
                                    </div>
                                    <div>
                                        <h3 className="text-lg font-bold mb-1">{reason.title}</h3>
                                        <p className="text-slate-500 dark:text-slate-400 text-sm">{reason.text}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                    <div className="relative">
                        <div className="absolute inset-0 bg-primary/20 blur-[100px] rounded-full" />
                        <div className="glass-card p-12 relative z-10 border-primary/20">
                            <h3 className="text-3xl font-bold mb-6">Our Motto</h3>
                            <p className="text-xl italic text-slate-600 dark:text-slate-300 leading-relaxed">
                                "Make professional websites affordable and accessible for everyone. We believe every business, no matter the size, deserves a powerful digital presence."
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default WhyChooseUs;
