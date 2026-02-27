import React, { useState, useEffect, useRef } from 'react';
import { Quote, Star, ChevronLeft, ChevronRight, Shield, Award, Zap } from 'lucide-react';
import { db } from '../firebase';
import { collection, query, orderBy, onSnapshot } from 'firebase/firestore';

const TRUST_STATS = [
    { icon: Shield, value: '100%', label: 'Client Satisfaction' },
    { icon: Award, value: '50+', label: 'Projects Delivered' },
    { icon: Zap, value: '48hr', label: 'Avg. Response Time' },
];

const Testimonials = () => {
    const [testimonials, setTestimonials] = useState([]);
    const [activeIdx, setActiveIdx] = useState(0);
    const intervalRef = useRef(null);

    useEffect(() => {
        const q = query(collection(db, 'testimonials'), orderBy('createdAt', 'desc'));
        const unsub = onSnapshot(q, (snap) => {
            const data = snap.docs.map(d => ({ id: d.id, ...d.data() }));
            setTestimonials(data);
        });
        return () => unsub();
    }, []);

    // Auto-rotate carousel
    useEffect(() => {
        if (testimonials.length <= 1) return;
        intervalRef.current = setInterval(() => {
            setActiveIdx(i => (i + 1) % testimonials.length);
        }, 5000);
        return () => clearInterval(intervalRef.current);
    }, [testimonials.length]);

    const goTo = (idx) => {
        setActiveIdx(idx);
        clearInterval(intervalRef.current);
    };

    const prev = () => goTo((activeIdx - 1 + testimonials.length) % testimonials.length);
    const next = () => goTo((activeIdx + 1) % testimonials.length);

    if (testimonials.length === 0) return null;

    // Handle imageUrls with spaces by encoding just the filename part
    const getImgSrc = (imageUrl) => {
        if (!imageUrl) return null;
        // If it's a /images/feedback/ path, encode the filename portion
        if (imageUrl.startsWith('/images/feedback/')) {
            const filename = imageUrl.replace('/images/feedback/', '');
            return `/images/feedback/${encodeURIComponent(filename)}`;
        }
        return imageUrl;
    };

    // Split into featured (large card) + rest (smaller grid)
    const featured = testimonials[activeIdx];
    const sideCards = testimonials.filter((_, i) => i !== activeIdx).slice(0, 4);

    return (
        <section id="testimonials" className="py-28 bg-slate-50 dark:bg-[#07091a] overflow-hidden relative transition-colors duration-300">

            {/* Background blobs */}
            <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-primary/5 rounded-full blur-[120px] -translate-y-1/2 translate-x-1/4 pointer-events-none" />
            <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-secondary/5 rounded-full blur-[100px] translate-y-1/3 -translate-x-1/4 pointer-events-none" />

            <div className="container mx-auto px-6 relative z-10 max-w-7xl">

                {/* Section Header */}
                <div className="text-center mb-20">
                    <div className="inline-flex items-center gap-2 bg-primary/10 text-primary text-xs font-black uppercase tracking-widest px-4 py-2 rounded-full mb-6 border border-primary/20">
                        ★ Trusted by Real Clients
                    </div>
                    <h2 className="text-5xl font-black text-slate-900 dark:text-white mb-6 leading-tight">
                        What Our <span className="gradient-text">Clients Say</span>
                    </h2>
                    <p className="text-slate-500 dark:text-gray-400 max-w-xl mx-auto text-lg">
                        Don't take our word for it — hear directly from the businesses we've helped grow online.
                    </p>
                </div>

                {/* Trust Stats Bar */}
                <div className="flex justify-center gap-8 mb-16 flex-wrap">
                    {TRUST_STATS.map(({ icon: Icon, value, label }) => (
                        <div key={label} className="flex items-center gap-3 bg-white dark:bg-white/5 border border-gray-100 dark:border-white/10 rounded-2xl px-6 py-4 shadow-sm">
                            <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                                <Icon size={18} className="text-primary" />
                            </div>
                            <div>
                                <div className="text-xl font-black text-slate-900 dark:text-white">{value}</div>
                                <div className="text-xs text-gray-500 font-medium">{label}</div>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Main Layout */}
                <div className="grid lg:grid-cols-3 gap-6 items-start">

                    {/* Featured Large Card */}
                    <div className="lg:col-span-2">
                        <div
                            key={featured.id}
                            className="bg-white dark:bg-gradient-to-br dark:from-[#111827] dark:to-[#0d1020] border border-gray-100 dark:border-white/10 rounded-[2.5rem] p-10 shadow-2xl shadow-black/10 relative overflow-hidden transition-all duration-500 min-h-[380px] flex flex-col justify-between"
                        >
                            {/* Decorative quote */}
                            <Quote className="absolute top-8 right-10 text-primary/10" size={100} strokeWidth={1} />

                            {/* Stars */}
                            <div className="flex gap-1 mb-6">
                                {[1, 2, 3, 4, 5].map(s => (
                                    <Star key={s} size={18} className="fill-amber-400 text-amber-400" />
                                ))}
                            </div>

                            {/* Message */}
                            <p className="text-slate-700 dark:text-gray-200 text-xl leading-relaxed font-medium mb-10 relative z-10 flex-1">
                                "{featured.message}"
                            </p>

                            {/* Author */}
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-4">
                                    <div className="w-16 h-16 rounded-2xl overflow-hidden border-2 border-primary/30 shadow-lg flex-shrink-0">
                                        <img
                                            src={getImgSrc(featured.imageUrl)}
                                            alt={featured.clientName}
                                            className="w-full h-full object-cover object-top"
                                            onError={(e) => { e.target.style.display = 'none'; }}
                                        />
                                    </div>
                                    <div>
                                        <h4 className="font-black text-slate-900 dark:text-white text-lg">{featured.clientName}</h4>
                                        <p className="text-primary font-bold text-xs uppercase tracking-widest">{featured.clientRole}</p>
                                    </div>
                                </div>

                                {/* Navigation */}
                                {testimonials.length > 1 && (
                                    <div className="flex gap-3">
                                        <button
                                            onClick={prev}
                                            className="w-11 h-11 rounded-full border border-gray-200 dark:border-white/10 flex items-center justify-center text-slate-500 dark:text-gray-400 hover:border-primary hover:text-primary transition-all"
                                        >
                                            <ChevronLeft size={18} />
                                        </button>
                                        <button
                                            onClick={next}
                                            className="w-11 h-11 rounded-full border border-gray-200 dark:border-white/10 flex items-center justify-center text-slate-500 dark:text-gray-400 hover:border-primary hover:text-primary transition-all"
                                        >
                                            <ChevronRight size={18} />
                                        </button>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Dots */}
                        {testimonials.length > 1 && (
                            <div className="flex gap-2 mt-5 justify-center">
                                {testimonials.map((_, i) => (
                                    <button
                                        key={i}
                                        onClick={() => goTo(i)}
                                        className={`h-2 rounded-full transition-all duration-300 ${i === activeIdx ? 'bg-primary w-8' : 'bg-gray-300 dark:bg-white/20 w-2'
                                            }`}
                                    />
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Side Cards: 2x2 grid — stays compact beside featured card */}
                    <div className="grid grid-cols-2 gap-3">
                        {sideCards.length > 0 ? sideCards.map((t) => (
                            <button
                                key={t.id}
                                onClick={() => goTo(testimonials.indexOf(t))}
                                className="text-left bg-white dark:bg-white/5 border border-gray-100 dark:border-white/10 rounded-2xl p-4 shadow-sm hover:border-primary/40 hover:shadow-md transition-all duration-300 group flex flex-col gap-2"
                            >
                                <div className="flex gap-0.5">
                                    {[1, 2, 3, 4, 5].map(s => <Star key={s} size={9} className="fill-amber-400 text-amber-400" />)}
                                </div>
                                <p className="text-slate-500 dark:text-gray-400 text-[11px] italic line-clamp-3 leading-relaxed flex-1 group-hover:text-slate-700 dark:group-hover:text-gray-200 transition-colors">
                                    "{t.message}"
                                </p>
                                <div className="flex items-center gap-2 pt-2 border-t border-gray-100 dark:border-white/5 mt-auto">
                                    {getImgSrc(t.imageUrl) && (
                                        <img
                                            src={getImgSrc(t.imageUrl)}
                                            alt={t.clientName}
                                            className="w-7 h-7 rounded-lg object-cover object-top flex-shrink-0"
                                            onError={(e) => { e.target.style.display = 'none'; }}
                                        />
                                    )}
                                    <div className="min-w-0">
                                        <p className="text-[10px] font-black text-slate-900 dark:text-white truncate">{t.clientName}</p>
                                        <p className="text-[9px] text-primary font-bold uppercase tracking-widest truncate">{t.clientRole}</p>
                                    </div>
                                </div>
                            </button>
                        )) : (
                            <div className="col-span-2 flex items-center justify-center py-8">
                                <p className="text-gray-400 text-sm text-center">More reviews coming soon...</p>
                            </div>
                        )}
                    </div>
                </div>

                {/* Bottom CTA Banner */}
                <div className="mt-16 bg-gradient-to-r from-primary/10 to-secondary/10 border border-primary/20 rounded-[2rem] p-8 flex flex-col md:flex-row items-center justify-between gap-6">
                    <div>
                        <h3 className="text-xl font-black text-slate-900 dark:text-white mb-1">Ready to be our next success story?</h3>
                        <p className="text-slate-500 dark:text-gray-400 text-sm">Join 50+ happy clients who trusted WebsiteLelo.</p>
                    </div>
                    <a
                        href="#contact"
                        className="bg-primary text-white px-8 py-4 rounded-2xl font-bold shadow-xl shadow-primary/20 hover:bg-primary/90 transition-all whitespace-nowrap"
                    >
                        Get Your Website →
                    </a>
                </div>
            </div>
        </section>
    );
};

export default Testimonials;
