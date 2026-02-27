import React, { useState, useEffect } from 'react';
import { db } from '../firebase';
import { collection, query, orderBy, onSnapshot, addDoc, updateDoc, deleteDoc, doc, serverTimestamp } from 'firebase/firestore';
import { Plus, Edit2, Trash2 } from 'lucide-react';

const Plans = () => {
    const [plans, setPlans] = useState([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingPlan, setEditingPlan] = useState(null);
    const [formData, setFormData] = useState({ name: '', price: '', deliveryTime: '', features: '' });

    useEffect(() => {
        const q = query(collection(db, 'plans'), orderBy('createdAt', 'desc'));
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
        const featuresArray = formData.features.split(',').map(f => f.trim());
        const planData = { ...formData, features: featuresArray, createdAt: serverTimestamp() };

        try {
            if (editingPlan) {
                await updateDoc(doc(db, 'plans', editingPlan._id), planData);
            } else {
                await addDoc(collection(db, 'plans'), planData);
            }
            setIsModalOpen(false);
            setEditingPlan(null);
            setFormData({ name: '', price: '', deliveryTime: '', features: '' });
        } catch (err) {
            console.error('Save Plan Error:', err);
            alert('Error saving plan');
        }
    };

    const deletePlan = async (id) => {
        if (!window.confirm('Delete this plan?')) return;
        try {
            await deleteDoc(doc(db, 'plans', id));
        } catch (err) {
            console.error('Delete Plan Error:', err);
            alert('Error deleting plan');
        }
    };

    return (
        <div className="space-y-8">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-3xl font-bold">Pricing Plans</h1>
                    <p className="text-gray-400">Manage your website service packages</p>
                </div>
                <button
                    onClick={() => { setIsModalOpen(true); setEditingPlan(null); }}
                    className="bg-primary hover:bg-primary-dark text-white px-6 py-3 rounded-2xl font-bold flex items-center space-x-2 shadow-lg shadow-primary/20"
                >
                    <Plus size={20} />
                    <span>Add New Plan</span>
                </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {plans.map((plan) => (
                    <div key={plan._id} className="bg-surface p-8 rounded-3xl border border-white/5 relative">
                        <div className="absolute top-6 right-6 flex space-x-2">
                            <button
                                onClick={() => {
                                    setEditingPlan(plan);
                                    setFormData({ name: plan.name, price: plan.price, deliveryTime: plan.deliveryTime, features: plan.features.join(', ') });
                                    setIsModalOpen(true);
                                }}
                                className="p-2 bg-white/5 hover:bg-white/10 rounded-lg text-blue-400"
                            >
                                <Edit2 size={16} />
                            </button>
                            <button
                                onClick={() => deletePlan(plan._id)}
                                className="p-2 bg-white/5 hover:bg-white/10 rounded-lg text-red-400"
                            >
                                <Trash2 size={16} />
                            </button>
                        </div>
                        <h3 className="text-xl font-bold mb-2">{plan.name}</h3>
                        <p className="text-3xl font-bold text-primary mb-4">{plan.price}</p>
                        <p className="text-sm text-gray-500 mb-6 font-medium">Delivery: {plan.deliveryTime}</p>
                        <ul className="space-y-3">
                            {plan.features.map((f, i) => (
                                <li key={i} className="text-sm text-gray-400 flex items-center space-x-2">
                                    <div className="w-1.5 h-1.5 bg-primary rounded-full" />
                                    <span>{f}</span>
                                </li>
                            ))}
                        </ul>
                    </div>
                ))}
            </div>

            {isModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-dark/80 backdrop-blur-sm p-4">
                    <div className="bg-surface w-full max-w-lg p-10 rounded-3xl border border-white/10">
                        <h2 className="text-2xl font-bold mb-8">{editingPlan ? 'Edit Plan' : 'Create New Plan'}</h2>
                        <form onSubmit={handleSubmit} className="space-y-6">
                            <div className="grid grid-cols-2 gap-4">
                                <input
                                    className="w-full bg-dark border border-white/10 rounded-xl px-4 py-3 outline-none"
                                    placeholder="Plan Name"
                                    value={formData.name}
                                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                    required
                                />
                                <input
                                    className="w-full bg-dark border border-white/10 rounded-xl px-4 py-3 outline-none"
                                    placeholder="Price (e.g. $199)"
                                    value={formData.price}
                                    onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                                    required
                                />
                            </div>
                            <input
                                className="w-full bg-dark border border-white/10 rounded-xl px-4 py-3 outline-none"
                                placeholder="Delivery Time (e.g. 5-7 Days)"
                                value={formData.deliveryTime}
                                onChange={(e) => setFormData({ ...formData, deliveryTime: e.target.value })}
                                required
                            />
                            <textarea
                                className="w-full bg-dark border border-white/10 rounded-xl px-4 py-3 outline-none"
                                placeholder="Features (comma separated)"
                                rows="4"
                                value={formData.features}
                                onChange={(e) => setFormData({ ...formData, features: e.target.value })}
                                required
                            />
                            <div className="flex space-x-4">
                                <button type="submit" className="flex-grow btn-primary py-3">Save Plan</button>
                                <button
                                    type="button"
                                    onClick={() => setIsModalOpen(false)}
                                    className="px-6 py-3 bg-white/5 rounded-xl hover:bg-white/10"
                                >
                                    Cancel
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Plans;
