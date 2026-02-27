import React, { useState, useEffect } from 'react';
import { db } from '../firebase';
import { collection, query, orderBy, onSnapshot, addDoc, deleteDoc, doc, serverTimestamp } from 'firebase/firestore';
import { Plus, Trash2, ExternalLink } from 'lucide-react';

const Portfolio = () => {
    const [items, setItems] = useState([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [formData, setFormData] = useState({ title: '', description: '', imageUrl: '', projectUrl: '', category: 'Business' });

    useEffect(() => {
        const q = query(collection(db, 'portfolio'), orderBy('createdAt', 'desc'));
        const unsubscribe = onSnapshot(q, (snapshot) => {
            const portfolioData = snapshot.docs.map(doc => ({
                _id: doc.id,
                ...doc.data()
            }));
            setItems(portfolioData);
        });
        return () => unsubscribe();
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const portfolioData = { ...formData, createdAt: serverTimestamp() };
            await addDoc(collection(db, 'portfolio'), portfolioData);
            setIsModalOpen(false);
            setFormData({ title: '', description: '', imageUrl: '', projectUrl: '', category: 'Business' });
        } catch (err) {
            console.error('Save Portfolio Error:', err);
            alert('Error saving portfolio item');
        }
    };

    const deleteItem = async (id) => {
        if (!window.confirm('Delete this project?')) return;
        try {
            await deleteDoc(doc(db, 'portfolio', id));
        } catch (err) {
            console.error('Delete Portfolio Error:', err);
            alert('Error deleting item');
        }
    };

    return (
        <div className="space-y-8">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-3xl font-bold">Portfolio Items</h1>
                    <p className="text-gray-400">Manage your showcase projects</p>
                </div>
                <button
                    onClick={() => setIsModalOpen(true)}
                    className="bg-primary hover:bg-primary-dark text-white px-6 py-3 rounded-2xl font-bold flex items-center space-x-2"
                >
                    <Plus size={20} />
                    <span>Add Project</span>
                </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {items.map((item) => (
                    <div key={item._id} className="bg-surface rounded-3xl overflow-hidden border border-white/5 group">
                        <div className="relative h-48">
                            <img src={item.imageUrl} alt={item.title} className="w-full h-full object-cover" />
                            <div className="absolute inset-0 bg-dark/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center space-x-4">
                                <button
                                    onClick={() => deleteItem(item._id)}
                                    className="p-3 bg-red-500 rounded-full text-white"
                                >
                                    <Trash2 size={20} />
                                </button>
                                {item.projectUrl && (
                                    <a href={item.projectUrl} target="_blank" rel="noreferrer" className="p-3 bg-white rounded-full text-dark">
                                        <ExternalLink size={20} />
                                    </a>
                                )}
                            </div>
                        </div>
                        <div className="p-6">
                            <span className="text-primary text-xs font-bold uppercase tracking-wider">{item.category}</span>
                            <h3 className="text-xl font-bold mt-1 mb-2">{item.title}</h3>
                            <p className="text-gray-400 text-sm line-clamp-2">{item.description}</p>
                        </div>
                    </div>
                ))}
            </div>

            {isModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-dark/80 backdrop-blur-sm p-4">
                    <div className="bg-surface w-full max-w-lg p-10 rounded-3xl border border-white/10">
                        <h2 className="text-2xl font-bold mb-8">Add New Project</h2>
                        <form onSubmit={handleSubmit} className="space-y-6">
                            <input
                                className="w-full bg-dark border border-white/10 rounded-xl px-4 py-3 outline-none"
                                placeholder="Project Title"
                                value={formData.title}
                                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                                required
                            />
                            <select
                                className="w-full bg-dark border border-white/10 rounded-xl px-4 py-3 outline-none"
                                value={formData.category}
                                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                            >
                                <option>Business</option>
                                <option>E-commerce</option>
                                <option>Portfolio</option>
                                <option>Custom</option>
                            </select>
                            <textarea
                                className="w-full bg-dark border border-white/10 rounded-xl px-4 py-3 outline-none"
                                placeholder="Description"
                                rows="3"
                                value={formData.description}
                                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                required
                            />
                            <input
                                className="w-full bg-dark border border-white/10 rounded-xl px-4 py-3 outline-none"
                                placeholder="Image URL"
                                value={formData.imageUrl}
                                onChange={(e) => setFormData({ ...formData, imageUrl: e.target.value })}
                                required
                            />
                            <input
                                className="w-full bg-dark border border-white/10 rounded-xl px-4 py-3 outline-none"
                                placeholder="Project Link (Optional)"
                                value={formData.projectUrl}
                                onChange={(e) => setFormData({ ...formData, projectUrl: e.target.value })}
                            />
                            <div className="flex space-x-4">
                                <button type="submit" className="flex-grow btn-primary py-3">Add Project</button>
                                <button type="button" onClick={() => setIsModalOpen(false)} className="px-6 py-3 bg-white/5 rounded-xl">Cancel</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Portfolio;
