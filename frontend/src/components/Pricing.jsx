import React, { useState, useEffect } from 'react';
import { Check, Info, Loader2 } from 'lucide-react';
import { db } from '../firebase';
import { collection, query, orderBy, onSnapshot } from 'firebase/firestore';

const Pricing = () => {
    const [plans, setPlans] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const q = query(collection(db, 'plans'), orderBy('createdAt', 'asc'));
        const unsub = onSnapshot(q, (snapshot) => {
            const plansData = snapshot.docs.map(d => ({ id: d.id, ...d.data() }));
            setPlans(plansData.slice(0, 3));
            setLoading(false);
        }, (err) => {
            console.error('Error fetching plans:', err);
            setLoading(false);
        });
        return () => unsub();
    }, []);

    const defaultTiers = [
        { name: 'Basic', price: '₹ 13,999 /-', color: 'bg-white/5', priceBg: 'bg-white/10', priceText: 'text-white', accent: 'text-gray-400', isActive: true },
        { name: 'Standard', price: '₹ 17,999 /-', color: 'bg-primary/20', priceBg: 'bg-primary', priceText: 'text-white', accent: 'text-primary', isActive: true },
        { name: 'Premium', price: '₹ 24,999 /-', color: 'bg-secondary/20', priceBg: 'bg-secondary', priceText: 'text-white', accent: 'text-secondary', isActive: true }
    ];

    // Position 0 = Basic, 1 = Standard, 2 = Premium — always enforce correct names by slot
    const SLOT_NAMES = ['Basic', 'Standard', 'Premium'];
    const tiers = plans.length > 0 ? plans.map((plan, idx) => ({
        name: SLOT_NAMES[idx] || plan.name,  // enforce correct name by position
        price: plan.price || defaultTiers[idx]?.price,
        originalPrice: plan.originalPrice || defaultTiers[idx]?.originalPrice,
        isActive: plan.isActive !== undefined ? plan.isActive : true,
        color: idx === 1 ? 'bg-primary/20' : (idx === 2 ? 'bg-secondary/20' : 'bg-white/5'),
        priceBg: idx === 1 ? 'bg-primary' : (idx === 2 ? 'bg-secondary' : 'bg-white/10'),
        priceText: 'text-white',
        accent: idx === 1 ? 'text-primary' : (idx === 2 ? 'text-secondary' : 'text-gray-400')
    })) : defaultTiers;

    if (plans.length > 0 && plans.length < 3) {
        for (let i = plans.length; i < 3; i++) {
            tiers.push(defaultTiers[i]);
        }
    }

    // Helper to render "Check" or the text
    const renderValue = (val, colIdx) => {
        if (!val) return 'N/A';
        if (typeof val === 'string' && val.toLowerCase() === 'check') {
            const colors = ['text-white/40', 'text-primary', 'text-secondary'];
            return <Check size={18} className={colors[colIdx] || 'text-white'} />;
        }
        return val;
    };

    const featureRows = [
        { label: 'Customized design', key: 'customDesign' },
        { label: 'Payment Method Integration', key: 'paymentIntegration' },
        { label: 'Mobile-friendly and responsive layout.', key: 'responsiveLayout' },
        { label: 'Number of Pages ex: Home, About Us, Contact Us, etc.', key: 'numPages' },
        { label: 'Number of Product Listing', key: 'numProducts' },
        { label: 'Search Engine Optimization (SEO)', key: 'seoOptimization' },
        { label: 'Personalised Admin Dashboard', key: 'adminDashboard' },
        { label: 'Analytics Integration', key: 'analytics' },
        { label: 'Support and Maintenance', key: 'support' },
        { label: 'Blog and Email Marketing Integration', key: 'blogMarketing' },
        { label: 'Animations and Effects', key: 'animations' },
    ];

    // Build the dynamic features array based on plans
    const dynamicFeatures = featureRows.map(row => {
        const rowData = { label: row.label };
        // We look at the first 3 potential plans (from DB or default)
        [0, 1, 2].forEach(idx => {
            const plan = plans[idx];
            const colKey = idx === 0 ? 'basic' : (idx === 1 ? 'standard' : 'premium');

            if (plan && plan.matrixValues && plan.matrixValues[row.key]) {
                rowData[colKey] = renderValue(plan.matrixValues[row.key], idx);
            } else {
                // Fallback to old hardcoded logic if no dynamic matrix values exist
                const oldDefaults = {
                    customDesign: [<Check size={18} />, <Check size={18} />, <Check size={18} />],
                    paymentIntegration: ['Single Payment Method Integration', 'Multiple Payment Integration', 'Multiple Payment Integration'],
                    responsiveLayout: [<Check size={18} />, <Check size={18} />, <Check size={18} />],
                    numPages: ['5 Pages', '10 Pages', 'Unlimited Pages'],
                    numProducts: ['30 Product', '100 Products', 'Unlimited Products'],
                    seoOptimization: ['Basic SEO', 'On-page SEO', 'Comprehensive SEO'],
                    adminDashboard: ['Simple product and order management dashboard', 'Advanced order and product management', 'Full product, customer, and sales management.'],
                    analytics: ['N/A', <Check size={18} />, <Check size={18} />],
                    support: ['1 Month', '3 Month', '6 Month'],
                    blogMarketing: ['N/A', 'N/A', <Check size={18} />],
                    animations: ['N/A', 'N/A', <Check size={18} />],
                };
                const fallbackVal = oldDefaults[row.key] ? oldDefaults[row.key][idx] : 'N/A';
                rowData[colKey] = fallbackVal;
            }
        });
        return rowData;
    });

    if (loading) {
        return (
            <div className="py-24 bg-dark flex items-center justify-center min-h-[400px]">
                <Loader2 className="animate-spin text-primary" size={40} />
            </div>
        );
    }

    return (
        <section id="pricing" className="py-24 bg-dark relative overflow-hidden">
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-primary/5 rounded-full blur-[120px] pointer-events-none" />

            <div className="container mx-auto px-6 max-w-6xl relative z-10">
                <div className="text-center mb-16">
                    <h2 className="text-4xl font-bold mb-4 text-white">Pricing <span className="gradient-text">Packages</span></h2>
                    <p className="text-gray-400">Choose a plan that fits your business scale</p>
                </div>

                <div className="hidden md:block overflow-x-auto rounded-3xl border border-white/10 shadow-2xl backdrop-blur-sm bg-white/5">
                    <table className="w-full text-center border-collapse min-w-[800px]">
                        <thead>
                            <tr className="border-b border-white/10">
                                <th className="p-8 text-left align-middle w-1/4">
                                    <div className="flex items-center space-x-2 text-primary mb-2">
                                        <Info size={16} />
                                        <span className="text-xs font-bold uppercase tracking-widest">Pricing Matrix</span>
                                    </div>
                                    <h3 className="text-2xl font-bold text-white leading-tight">Compare<br />Our Plans</h3>
                                </th>
                                {tiers.map((tier, idx) => (
                                    <th key={idx} className={`${tier.color} p-8 align-top w-1/4 transition-colors duration-500`}>
                                        <h3 className={`text-2xl font-bold mb-6 tracking-tight ${idx === 1 ? 'text-primary' : 'text-white'}`}>{tier.name}</h3>
                                        <div className={`${tier.priceBg} py-3 px-6 rounded-xl shadow-lg shadow-black/20 inline-block w-full max-w-[180px]`}>
                                            <div className="flex flex-col items-center">
                                                {tier.originalPrice && tier.isActive !== false && (
                                                    <span className="text-xs text-white/50 line-through mb-1">{tier.originalPrice}</span>
                                                )}
                                                <span className="text-lg font-bold text-white leading-none">{tier.price}</span>
                                            </div>
                                        </div>
                                    </th>
                                ))}
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-white/5">
                            {dynamicFeatures.map((feature, idx) => (
                                <tr key={idx} className="group hover:bg-white/5 transition-colors">
                                    <td className="p-6 text-left font-medium text-gray-400 whitespace-pre-line border-r border-white/10">
                                        {feature.label}
                                    </td>
                                    <td className="p-6 bg-white/[0.02] text-white text-sm border-x border-white/5 group-hover:bg-white/[0.04] transition-all">
                                        <div className="flex items-center justify-center opacity-70 group-hover:opacity-100 italic font-medium">
                                            {feature.basic}
                                        </div>
                                    </td>
                                    <td className="p-6 bg-primary/5 text-white text-sm border-x border-white/5 group-hover:bg-primary/10 transition-all font-semibold">
                                        <div className="flex items-center justify-center text-primary">
                                            {feature.standard}
                                        </div>
                                    </td>
                                    <td className="p-6 bg-secondary/5 text-white text-sm border-x border-white/5 group-hover:bg-secondary/10 transition-all font-medium">
                                        <div className="flex items-center justify-center text-secondary">
                                            {feature.premium}
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                <div className="md:hidden space-y-8">
                    {tiers.map((tier, idx) => (
                        <div key={idx} className={`rounded-[2.5rem] border border-white/10 overflow-hidden backdrop-blur-sm bg-white/5 shadow-2xl relative`}>
                            {idx === 1 && (
                                <div className="absolute top-0 right-0 bg-primary text-white px-6 py-1 text-xs font-black uppercase rounded-bl-2xl">
                                    Popular
                                </div>
                            )}
                            <div className={`${tier.color} p-8 text-center border-b border-white/5`}>
                                <h3 className={`text-2xl font-black mb-4 tracking-tight ${idx === 1 ? 'text-primary' : 'text-white'}`}>{tier.name}</h3>
                                <div className={`${tier.priceBg} py-4 px-8 rounded-2xl shadow-xl inline-block`}>
                                    <div className="flex flex-col items-center">
                                        {tier.originalPrice && tier.isActive !== false && (
                                            <span className="text-xs text-white/50 line-through mb-1">{tier.originalPrice}</span>
                                        )}
                                        <span className="text-xl font-black text-white leading-none">{tier.price}</span>
                                    </div>
                                </div>
                            </div>
                            <div className="p-8 space-y-6">
                                {dynamicFeatures.map((feature, fIdx) => (
                                    <div key={fIdx} className="flex flex-col space-y-2 pb-4 border-b border-white/5 last:border-0 last:pb-0">
                                        <span className="text-[10px] uppercase font-black tracking-widest text-slate-500">{feature.label}</span>
                                        <div className={`text-sm font-bold ${idx === 0 ? 'text-white/60' : (idx === 1 ? 'text-primary' : (idx === 2 ? 'text-secondary' : 'text-white'))}`}>
                                            {idx === 0 ? feature.basic : (idx === 1 ? feature.standard : feature.premium)}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default Pricing;
