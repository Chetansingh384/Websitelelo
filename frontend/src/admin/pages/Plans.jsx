import React, { useState, useEffect } from 'react';
import { db } from '../../firebase';
import { collection, query, orderBy, onSnapshot, addDoc, deleteDoc, doc, serverTimestamp, updateDoc } from 'firebase/firestore';
import { Plus, Trash2, Package, X, CheckCircle, Edit2, Info, Check } from 'lucide-react';

const AdminPlans = () => {
    const [plans, setPlans] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [loading, setLoading] = useState(false);
    const [editId, setEditId] = useState(null);
    const [viewMode, setViewMode] = useState('cards'); // 'cards' or 'matrix'
    const [formData, setFormData] = useState({
        name: '',
        price: '',
        deliveryTime: '',
        features: '', // For backward compatibility/simple list
        matrixValues: {
            customDesign: 'Check',
            paymentIntegration: 'Single Integration',
            responsiveLayout: 'Check',
            numPages: '5 Pages',
            numProducts: '30 Products',
            seoOptimization: 'Basic SEO',
            adminDashboard: 'Simple Management',
            analytics: 'N/A',
            support: '1 Month',
            blogMarketing: 'N/A',
            animations: 'N/A'
        }
    });

    const matrixFields = [
        { key: 'customDesign', label: 'Customized design' },
        { key: 'paymentIntegration', label: 'Payment Method Integration' },
        { key: 'responsiveLayout', label: 'Mobile-friendly Responsive Layout' },
        { key: 'numPages', label: 'Number of Pages\n(Home, About, Contact, etc.)' },
        { key: 'numProducts', label: 'Number of Product Listing' },
        { key: 'seoOptimization', label: 'SEO Optimization' },
        { key: 'adminDashboard', label: 'Personalised Admin Dashboard' },
        { key: 'analytics', label: 'Analytics Integration' },
        { key: 'support', label: 'Support and Maintenance' },
        { key: 'blogMarketing', label: 'Blog & Email Marketing' },
        { key: 'animations', label: 'Animations and Effects' }
    ];

    useEffect(() => {
        const q = query(collection(db, 'plans'), orderBy('createdAt', 'asc'));
        const unsubscribe = onSnapshot(q, (snapshot) => {
            const plansData = snapshot.docs.map(doc => ({
                _id: doc.id,
                ...doc.data()
            }));
            setPlans(plansData);
        });
        return () => unsubscribe();
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        const planData = {
            ...formData,
            features: formData.features ? formData.features.split(',').map(f => f.trim()) : [],
            updatedAt: serverTimestamp()
        };

        if (!editId) {
            planData.createdAt = serverTimestamp();
        }

        try {
            if (editId) {
                await updateDoc(doc(db, 'plans', editId), planData);
            } else {
                await addDoc(collection(db, 'plans'), planData);
            }
            handleCloseModal();
        } catch (err) {
            console.error('Error saving plan:', err);
            alert('Error saving plan.');
        } finally {
            setLoading(false);
        }
    };

    const handleEdit = (plan) => {
        setEditId(plan._id);
        setFormData({
            name: plan.name || '',
            price: plan.price || '',
            deliveryTime: plan.deliveryTime || '',
            features: plan.features?.join(', ') || '',
            matrixValues: plan.matrixValues || {
                customDesign: 'Check',
                paymentIntegration: '',
                responsiveLayout: 'Check',
                numPages: '',
                numProducts: '',
                seoOptimization: '',
                adminDashboard: '',
                analytics: '',
                support: '',
                blogMarketing: '',
                animations: ''
            }
        });
        setShowModal(true);
    };

    const handleCloseModal = () => {
        setShowModal(false);
        setEditId(null);
        setFormData({
            name: '', price: '', deliveryTime: '', features: '',
            matrixValues: {
                customDesign: 'Check',
                paymentIntegration: 'Single Integration',
                responsiveLayout: 'Check',
                numPages: '5 Pages',
                numProducts: '30 Products',
                seoOptimization: 'Basic SEO',
                adminDashboard: 'Simple Management',
                analytics: 'N/A',
                support: '1 Month',
                blogMarketing: 'N/A',
                animations: 'N/A'
            }
        });
    };

    const handleDelete = async (id) => {
        if (!window.confirm('Delete this plan?')) return;
        try {
            await deleteDoc(doc(db, 'plans', id));
        } catch (err) {
            console.error('Error deleting plan:', err);
        }
    };

    const defaultMatrix = {
        customDesign: ['Check', 'Check', 'Check'],
        paymentIntegration: ['Single Payment Method Integration', 'Multiple Payment Integration', 'Multiple Payment Integration'],
        responsiveLayout: ['Check', 'Check', 'Check'],
        numPages: ['5 Pages', '10 Pages', 'Unlimited Pages'],
        numProducts: ['30 Product', '100 Products', 'Unlimited Products'],
        seoOptimization: ['Basic SEO', 'On-page SEO', 'Comprehensive SEO'],
        adminDashboard: ['Simple product and order management dashboard', 'Advanced order and product management', 'Full product, customer, and sales management.'],
        analytics: ['N/A', 'Check', 'Check'],
        support: ['1 Month', '3 Month', '6 Month'],
        blogMarketing: ['N/A', 'N/A', 'Check'],
        animations: ['N/A', 'N/A', 'Check'],
    };

    // Seed default plans into Firestore (wipes existing and writes correct data)
    const seedDefaultPlans = async () => {
        if (!window.confirm('This will reset ALL plans to the default values from the reference chart. Continue?')) return;
        try {
            // Delete existing plans
            for (const plan of plans) {
                await deleteDoc(doc(db, 'plans', plan._id));
            }
            // Insert 3 correct plans in order
            const planDefs = [
                { name: 'Basic', price: '₹ 13,999 /-', deliveryTime: '15 Days', idx: 0 },
                { name: 'Standard', price: '₹ 17,999 /-', deliveryTime: '25 Days', idx: 1 },
                { name: 'Premium', price: '₹ 24,999 /-', deliveryTime: '45 Days', idx: 2 },
            ];
            for (const p of planDefs) {
                await addDoc(collection(db, 'plans'), {
                    name: p.name,
                    price: p.price,
                    deliveryTime: p.deliveryTime,
                    features: [],
                    matrixValues: matrixFields.reduce((acc, f) => ({ ...acc, [f.key]: defaultMatrix[f.key]?.[p.idx] || '' }), {}),
                    createdAt: serverTimestamp(),
                });
                // small delay to preserve order
                await new Promise(r => setTimeout(r, 300));
            }
            alert('Plans reset to defaults successfully!');
        } catch (err) {
            console.error('Error seeding plans:', err);
            alert('Error resetting plans.');
        }
    };

    const handleNameUpdate = async (planId, value, idx) => {
        try {
            if (planId) {
                await updateDoc(doc(db, 'plans', planId), { name: value, updatedAt: serverTimestamp() });
            } else {
                // Auto-create plan from default
                const base = defaultTiers[idx] || { name: 'New Plan', price: '₹ 0 /-' };
                await addDoc(collection(db, 'plans'), {
                    name: value,
                    price: base.price,
                    createdAt: serverTimestamp(),
                    matrixValues: matrixFields.reduce((acc, f) => ({ ...acc, [f.key]: defaultMatrix[f.key]?.[idx] || '' }), {})
                });
            }
        } catch (err) {
            console.error('Error updating name:', err);
        }
    };

    const handlePriceUpdate = async (planId, value, idx) => {
        try {
            if (planId) {
                await updateDoc(doc(db, 'plans', planId), { price: value, updatedAt: serverTimestamp() });
            } else {
                const base = defaultTiers[idx] || { name: 'New Plan', price: '₹ 0 /-' };
                await addDoc(collection(db, 'plans'), {
                    name: base.name,
                    price: value,
                    createdAt: serverTimestamp(),
                    matrixValues: matrixFields.reduce((acc, f) => ({ ...acc, [f.key]: defaultMatrix[f.key]?.[idx] || '' }), {})
                });
            }
        } catch (err) {
            console.error('Error updating price:', err);
        }
    };

    const handleInlineUpdate = async (planId, fieldKey, value, idx) => {
        try {
            if (planId) {
                await updateDoc(doc(db, 'plans', planId), {
                    [`matrixValues.${fieldKey}`]: value,
                    updatedAt: serverTimestamp()
                });
            } else {
                const base = defaultTiers[idx] || { name: 'New Plan', price: '₹ 0 /-' };
                const initialMatrix = matrixFields.reduce((acc, f) => ({ ...acc, [f.key]: defaultMatrix[f.key]?.[idx] || '' }), {});
                initialMatrix[fieldKey] = value;
                await addDoc(collection(db, 'plans'), {
                    name: base.name,
                    price: base.price,
                    createdAt: serverTimestamp(),
                    matrixValues: initialMatrix
                });
            }
        } catch (err) {
            console.error('Error updating matrix value:', err);
        }
    };

    const defaultTiers = [
        { name: 'Basic', price: '₹ 13,999 /-' },
        { name: 'Standard', price: '₹ 17,999 /-' },
        { name: 'Premium', price: '₹ 24,999 /-' }
    ];

    // Ensure at least 3 columns: Merge DB plans with defaults, but allow growth
    const totalCols = Math.max(3, plans.length);
    const displayPlans = Array(totalCols).fill(null).map((_, idx) => {
        const plan = plans[idx];
        if (plan) return { ...plan, _isDefault: false };
        return { ...defaultTiers[idx], _isDefault: true };
    });

    return (
        <div className="p-8 pb-32 min-h-screen bg-white dark:bg-[#0a0f1d] overflow-hidden">
            <div className="mb-12 flex items-center justify-between flex-wrap gap-4">
                <div>
                    <h1 className="text-4xl font-black text-slate-900 dark:text-white tracking-tight mb-2">Pricing <span className="text-primary">Plans</span></h1>
                    <p className="text-gray-500 font-medium tracking-wide">Edit Matrix directly - Changes sync instantly to site</p>
                </div>
                <button
                    onClick={seedDefaultPlans}
                    className="flex items-center gap-2 px-5 py-3 rounded-2xl border border-amber-500/40 text-amber-400 text-sm font-bold hover:bg-amber-500/10 transition-all"
                    title="Reset all plans to the reference chart defaults"
                >
                    ↺ Restore Defaults
                </button>
            </div>

            <div className="overflow-x-auto rounded-[2.5rem] border border-white/10 shadow-2xl backdrop-blur-sm bg-white/5 max-w-full">
                <table className="w-full text-center border-collapse min-w-[900px]">
                    <thead>
                        <tr className="border-b border-white/10">
                            <th className="p-8 text-left align-middle w-1/4">
                                <div className="flex items-center space-x-2 text-primary mb-2">
                                    <Info size={16} />
                                    <span className="text-xs font-bold uppercase tracking-widest">Pricing Matrix</span>
                                </div>
                                <h3 className="text-2xl font-bold text-white leading-tight">Compare<br />Our Plans</h3>
                            </th>
                            {displayPlans.map((plan, idx) => {
                                const styles = [
                                    { color: 'bg-white/5', priceBg: 'bg-white/10', accentTask: 'text-white' },
                                    { color: 'bg-primary/20', priceBg: 'bg-primary', accentTask: 'text-primary' },
                                    { color: 'bg-secondary/20', priceBg: 'bg-secondary', accentTask: 'text-secondary' }
                                ];
                                // Use neutral style for columns beyond 3
                                const style = idx < 3 ? styles[idx] : styles[0];
                                return (
                                    <th key={plan._id || idx} className={`${style.color} p-8 align-top w-1/4 group transition-all duration-500 relative`}>
                                        <div className="flex flex-col items-center">
                                            <input
                                                type="text"
                                                defaultValue={plan.name}
                                                onBlur={(e) => handleNameUpdate(plan._id, e.target.value, idx)}
                                                className={`bg-transparent border-none text-center text-2xl font-bold mb-4 tracking-tight w-full outline-none focus:ring-1 focus:ring-white/20 rounded ${style.accentTask}`}
                                            />
                                            <div className={`${style.priceBg} py-3 px-6 rounded-xl shadow-lg shadow-black/20 inline-block w-full max-w-[180px]`}>
                                                <input
                                                    type="text"
                                                    defaultValue={plan.price}
                                                    onBlur={(e) => handlePriceUpdate(plan._id, e.target.value, idx)}
                                                    className="bg-transparent border-none text-center text-lg font-bold text-white w-full outline-none focus:ring-1 focus:ring-white/30 rounded"
                                                />
                                            </div>
                                            {plan._id && (
                                                <button
                                                    onClick={() => handleDelete(plan._id)}
                                                    className="mt-6 p-2 text-white/20 hover:text-red-500 transition-colors opacity-0 group-hover:opacity-100"
                                                    title="Delete Plan"
                                                >
                                                    <Trash2 size={16} />
                                                </button>
                                            )}
                                        </div>
                                    </th>
                                );
                            })}
                            <th className="p-8 align-middle bg-white/5 border-l border-white/10 w-20">
                                <button
                                    onClick={async () => {
                                        const name = prompt('Enter Plan Name:');
                                        if (!name) return;
                                        const price = prompt('Enter Price:');
                                        if (!price) return;
                                        try {
                                            await addDoc(collection(db, 'plans'), {
                                                name,
                                                price,
                                                createdAt: serverTimestamp(),
                                                matrixValues: matrixFields.reduce((acc, f) => ({ ...acc, [f.key]: '' }), {})
                                            });
                                        } catch (err) {
                                            console.error(err);
                                        }
                                    }}
                                    className="p-3 rounded-full bg-primary/10 hover:bg-primary text-primary hover:text-white transition-all shadow-lg hover:rotate-90 duration-300 mx-auto"
                                    title="Add New Column"
                                >
                                    <Plus size={24} />
                                </button>
                            </th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-white/5">
                        {matrixFields.map((field) => (
                            <tr key={field.key} className="group hover:bg-white/5 transition-colors">
                                <td className="p-6 text-left font-medium text-gray-400 whitespace-pre-line border-r border-white/10 uppercase tracking-widest text-[10px]">
                                    {field.label}
                                </td>
                                {displayPlans.map((plan, idx) => {
                                    const cellColors = ['bg-white/[0.02]', 'bg-primary/5', 'bg-secondary/5'];
                                    const textStyles = ['text-white/40', 'text-primary', 'text-secondary'];
                                    const fontWeights = ['font-medium', 'font-semibold', 'font-medium'];
                                    const cellColor = cellColors[idx] || cellColors[idx % 3];
                                    const textStyle = textStyles[idx] || textStyles[idx % 3];
                                    const fontWeight = fontWeights[idx] || fontWeights[idx % 3];
                                    const val = plan.matrixValues?.[field.key] || defaultMatrix[field.key][idx] || '';
                                    const isCheck = val.toLowerCase() === 'check';

                                    return (
                                        <td key={`${plan._id || idx}-${field.key}`} className={`p-6 ${cellColor} text-sm border-x border-white/5 transition-all font-semibold relative group/cell hover:bg-white/[0.04] transition-all`}>
                                            <div className={`flex items-center justify-center ${textStyle} relative ${idx === 0 ? 'opacity-70 group-hover/cell:opacity-100 transition-opacity' : ''}`}>
                                                {isCheck && (
                                                    <div className="absolute pointer-events-none group-focus-within/cell:opacity-0 transition-opacity">
                                                        <Check size={18} />
                                                    </div>
                                                )}
                                                <input
                                                    type="text"
                                                    defaultValue={val}
                                                    onBlur={(e) => handleInlineUpdate(plan._id, field.key, e.target.value, idx)}
                                                    className={`bg-transparent border-none text-center w-full outline-none focus:bg-white/5 py-3 rounded transition-all italic ${fontWeight} ${isCheck ? 'text-transparent focus:text-white' : ''}`}
                                                />
                                            </div>
                                        </td>
                                    );
                                })}
                                <td className="bg-white/5 border-l border-white/10 opacity-20"></td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default AdminPlans;
