import React, { useState, useEffect } from 'react';
import { db } from '../../firebase';
import {
    collection, query, orderBy, onSnapshot,
    addDoc, deleteDoc, doc, serverTimestamp, updateDoc
} from 'firebase/firestore';
import { Plus, Trash2, X, Quote, Check, Save, User, Briefcase, MessageSquare, FolderOpen, Eye } from 'lucide-react';

const AdminTestimonials = () => {
    const [testimonials, setTestimonials] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [loading, setLoading] = useState(false);
    const [editingId, setEditingId] = useState(null);
    const [formData, setFormData] = useState({
        clientName: '', clientRole: '', message: '', imageFilename: ''
    });

    // Firestore real-time sync
    useEffect(() => {
        const q = query(collection(db, 'testimonials'), orderBy('createdAt', 'desc'));
        const unsubscribe = onSnapshot(q, (snapshot) => {
            const data = snapshot.docs.map(d => ({ _id: d.id, ...d.data() }));
            setTestimonials(data);
        });
        return () => unsubscribe();
    }, []);

    // Strip any path prefix, keep only the filename (e.g. feedback/rahul.jpg → rahul.jpg)
    const cleanFilename = (raw) => {
        if (!raw) return '';
        return raw.split('/').pop().split('\\').pop().trim();
    };

    const getImageUrl = (t) => {
        const fn = cleanFilename(t.imageFilename);
        if (fn) return `/images/feedback/${encodeURIComponent(fn)}`;
        if (t.imageUrl && !t.imageUrl.startsWith('https://i.pravatar')) return t.imageUrl;
        return null;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        const fn = cleanFilename(formData.imageFilename);
        const imageUrl = fn ? `/images/feedback/${fn}` : '';
        try {
            if (editingId) {
                await updateDoc(doc(db, 'testimonials', editingId), {
                    clientName: formData.clientName,
                    clientRole: formData.clientRole,
                    message: formData.message,
                    imageUrl,
                    imageFilename: fn,
                    updatedAt: serverTimestamp()
                });
            } else {
                await addDoc(collection(db, 'testimonials'), {
                    clientName: formData.clientName,
                    clientRole: formData.clientRole,
                    message: formData.message,
                    imageUrl,
                    imageFilename: fn,
                    createdAt: serverTimestamp()
                });
            }
            closeModal();
        } catch (err) {
            console.error('Error saving testimonial:', err);
            alert('Error saving feedback.');
        } finally {
            setLoading(false);
        }
    };

    const handleEdit = (t) => {
        setEditingId(t._id);
        setFormData({
            clientName: t.clientName || '',
            clientRole: t.clientRole || '',
            message: t.message || '',
            imageFilename: t.imageFilename || ''
        });
        setShowModal(true);
    };

    const handleDelete = async (id) => {
        if (!window.confirm('Remove this feedback?')) return;
        try {
            await deleteDoc(doc(db, 'testimonials', id));
        } catch (err) {
            console.error('Error deleting testimonial:', err);
        }
    };

    const closeModal = () => {
        setShowModal(false);
        setEditingId(null);
        setFormData({ clientName: '', clientRole: '', message: '', imageFilename: '' });
    };

    return (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500 pb-10">

            {/* Header */}
            <div className="flex justify-between items-start gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-slate-900 dark:text-white">Client Feedback</h1>
                    <p className="text-gray-500 dark:text-gray-400 mt-1 text-sm">
                        Add client photos to{' '}
                        <code className="text-primary bg-primary/10 px-2 py-0.5 rounded-lg">/public/images/feedback/</code>{' '}
                        then click <strong className="text-white">Add Feedback</strong> and type the filename to link the photo.
                    </p>
                </div>
                <button
                    onClick={() => { setEditingId(null); setShowModal(true); }}
                    className="flex-shrink-0 bg-primary hover:bg-primary/90 text-white px-6 py-3.5 rounded-2xl font-bold flex items-center space-x-2 shadow-xl shadow-primary/20 transition-all"
                >
                    <Plus size={18} />
                    <span>Add Feedback</span>
                </button>
            </div>

            {/* Instruction Banner */}
            <div className="bg-primary/5 border border-primary/20 rounded-2xl p-5 flex items-start gap-4">
                <FolderOpen size={24} className="text-primary flex-shrink-0 mt-0.5" />
                <div>
                    <p className="font-bold text-slate-900 dark:text-white text-sm mb-1">How to add client photos</p>
                    <ol className="text-gray-500 dark:text-gray-400 text-sm list-decimal list-inside space-y-0.5">
                        <li>Drop client photo into <code className="text-primary">/public/images/feedback/</code> (e.g. <code>rahul.jpg</code>)</li>
                        <li>Click <strong>"Add Feedback"</strong> and type <code>rahul.jpg</code> in the filename field</li>
                        <li>Fill in their name, role, and their feedback text → Save</li>
                        <li>It instantly appears live on the public site ✅</li>
                    </ol>
                </div>
            </div>

            {/* Cards Grid */}
            {testimonials.length === 0 ? (
                <div className="text-center py-20 text-gray-400">
                    <Quote size={48} className="mx-auto mb-4 text-gray-200 dark:text-white/10" />
                    <p className="font-bold text-lg mb-1">No feedback yet</p>
                    <p className="text-sm">Click "Add Feedback" to post your first client review</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {testimonials.map((t) => (
                        <div
                            key={t._id}
                            className="bg-white dark:bg-[#111827] rounded-[2rem] border border-gray-100 dark:border-white/5 shadow-lg group relative overflow-hidden flex flex-col"
                        >
                            {/* Client Photo */}
                            <div className="relative h-40 bg-slate-100 dark:bg-white/5 overflow-hidden flex-shrink-0">
                                {getImageUrl(t) ? (
                                    <img
                                        src={getImageUrl(t)}
                                        alt={t.clientName}
                                        className="w-full h-full object-cover object-top group-hover:scale-105 transition-transform duration-700"
                                        onError={(e) => { e.target.style.display = 'none'; }}
                                    />
                                ) : (
                                    <div className="w-full h-full flex items-center justify-center text-gray-400">
                                        <User size={32} />
                                    </div>
                                )}
                                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                                {t.imageFilename && (
                                    <div className="absolute bottom-2 left-3 text-[10px] text-white/50 font-bold">
                                        📁 {t.imageFilename}
                                    </div>
                                )}

                                {/* Action Buttons */}
                                <div className="absolute top-3 right-3 flex gap-2 opacity-0 group-hover:opacity-100 transition-all">
                                    <button
                                        onClick={() => handleEdit(t)}
                                        className="p-2 rounded-xl bg-white/20 text-white hover:bg-primary hover:text-white backdrop-blur-sm transition-all"
                                        title="Edit"
                                    >
                                        <Save size={13} />
                                    </button>
                                    <button
                                        onClick={() => handleDelete(t._id)}
                                        className="p-2 rounded-xl bg-red-500/20 text-red-400 hover:bg-red-500 hover:text-white backdrop-blur-sm transition-all"
                                        title="Delete"
                                    >
                                        <Trash2 size={13} />
                                    </button>
                                </div>
                            </div>

                            {/* Card Content */}
                            <div className="p-6 flex flex-col flex-1">
                                <Quote className="text-primary/10 mb-3" size={32} />
                                <p className="text-slate-600 dark:text-gray-300 italic text-sm leading-relaxed mb-5 flex-1 line-clamp-4">
                                    "{t.message || <span className="text-red-400">No message added yet — click edit</span>}"
                                </p>
                                <div className="flex items-center gap-3 border-t border-gray-100 dark:border-white/5 pt-4">
                                    <img
                                        src={getImageUrl(t)}
                                        alt={t.clientName}
                                        className="w-10 h-10 rounded-xl object-cover"
                                        onError={(e) => { e.target.src = `https://i.pravatar.cc/150?u=${t.clientName}`; }}
                                    />
                                    <div>
                                        <h4 className="font-bold text-sm text-slate-900 dark:text-white">{t.clientName}</h4>
                                        <p className="text-[10px] text-primary font-black uppercase tracking-widest">{t.clientRole}</p>
                                    </div>
                                    <div className="ml-auto flex gap-0.5">
                                        {[1, 2, 3, 4, 5].map(s => <span key={s} className="text-amber-400 text-xs">★</span>)}
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* ── Add / Edit Modal ── */}
            {showModal && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-dark/80 backdrop-blur-sm animate-in fade-in duration-300">
                    <div className="bg-white dark:bg-[#111827] w-full max-w-lg rounded-[2.5rem] p-10 shadow-2xl border border-white/5 relative max-h-[90vh] overflow-y-auto">
                        <button onClick={closeModal} className="absolute top-8 right-8 text-gray-400 hover:text-white">
                            <X size={24} />
                        </button>
                        <h2 className="text-2xl font-bold mb-8 text-slate-900 dark:text-white">
                            {editingId ? 'Edit Feedback' : 'Add Client Feedback'}
                        </h2>
                        <form onSubmit={handleSubmit} className="space-y-5">

                            {/* Photo Filename */}
                            <div className="space-y-2">
                                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">
                                    Client Photo (from /images/feedback/)
                                </label>
                                <div className="flex gap-4 items-center">
                                    {/* Preview */}
                                    <div className="w-16 h-16 rounded-2xl overflow-hidden bg-slate-100 dark:bg-white/5 border border-white/10 flex-shrink-0">
                                        {(() => {
                                            const cleanedFn = formData.imageFilename.split('/').pop().split('\\').pop().trim();
                                            return cleanedFn ? (
                                                <img
                                                    src={`/images/feedback/${cleanedFn}`}
                                                    alt="Preview"
                                                    className="w-full h-full object-cover object-top"
                                                    onError={(e) => { e.target.style.display = 'none'; e.target.nextSibling.style.display = 'flex'; }}
                                                />
                                            ) : null;
                                        })()}
                                        {(!formData.imageFilename || !formData.imageFilename.trim()) && (
                                            <div className="w-full h-full flex items-center justify-center text-gray-400">
                                                <User size={20} />
                                            </div>
                                        )}
                                    </div>
                                    <div className="flex-1">
                                        <input
                                            type="text"
                                            value={formData.imageFilename}
                                            onChange={(e) => setFormData({ ...formData, imageFilename: e.target.value })}
                                            className="w-full bg-slate-50 dark:bg-[#0a0f1d] border border-gray-100 dark:border-white/10 rounded-2xl px-4 py-3 dark:text-white outline-none focus:border-primary/50 transition-colors font-mono text-sm"
                                            placeholder="rahul.jpg"
                                        />
                                        <p className="text-[10px] text-gray-400 mt-1 ml-1">
                                            Type only the filename, e.g. <code className="text-primary">rahul.jpg</code>
                                        </p>
                                    </div>
                                </div>
                            </div>

                            {/* Name */}
                            <div className="space-y-1">
                                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1 flex items-center gap-1">
                                    <User size={9} /> Client Name *
                                </label>
                                <input
                                    type="text"
                                    required
                                    value={formData.clientName}
                                    onChange={(e) => setFormData({ ...formData, clientName: e.target.value })}
                                    className="w-full bg-slate-50 dark:bg-[#0a0f1d] border border-gray-100 dark:border-white/10 rounded-2xl px-4 py-3 dark:text-white outline-none focus:border-primary/50 transition-colors"
                                    placeholder="e.g. Rahul Sharma"
                                />
                            </div>

                            {/* Role */}
                            <div className="space-y-1">
                                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1 flex items-center gap-1">
                                    <Briefcase size={9} /> Role / Company
                                </label>
                                <input
                                    type="text"
                                    value={formData.clientRole}
                                    onChange={(e) => setFormData({ ...formData, clientRole: e.target.value })}
                                    className="w-full bg-slate-50 dark:bg-[#0a0f1d] border border-gray-100 dark:border-white/10 rounded-2xl px-4 py-3 dark:text-white outline-none focus:border-primary/50 transition-colors"
                                    placeholder="Founder at Sihali Jageer"
                                />
                            </div>

                            {/* Message */}
                            <div className="space-y-1">
                                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1 flex items-center gap-1">
                                    <MessageSquare size={9} /> Feedback Message *
                                </label>
                                <textarea
                                    rows="4"
                                    required
                                    value={formData.message}
                                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                                    className="w-full bg-slate-50 dark:bg-[#0a0f1d] border border-gray-100 dark:border-white/10 rounded-2xl px-4 py-3 dark:text-white outline-none resize-none focus:border-primary/50 transition-colors"
                                    placeholder="Write what this client said about WebsiteLelo..."
                                />
                            </div>

                            <button
                                type="submit"
                                disabled={loading}
                                className="w-full bg-primary text-white py-4 rounded-2xl font-bold shadow-xl shadow-primary/20 disabled:opacity-50 transition-all active:scale-[0.98] flex items-center justify-center gap-2"
                            >
                                {loading ? (
                                    <><span className="animate-spin">⟳</span> Saving...</>
                                ) : (
                                    <><Check size={16} /> {editingId ? 'Update Feedback' : 'Publish to Site'}</>
                                )}
                            </button>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AdminTestimonials;
