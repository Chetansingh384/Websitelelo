import React, { useState, useEffect } from 'react';
import { db } from '../../firebase';
import {
    collection, query, orderBy, onSnapshot,
    addDoc, deleteDoc, doc, serverTimestamp, updateDoc, setDoc, getDoc
} from 'firebase/firestore';
import { Plus, Trash2, X, Save, ImageIcon, ExternalLink, Edit2, Check, Link } from 'lucide-react';

// ─── Local portfolio images (from /public/images/portfolio/) ───────────────
// These are the actual project screenshots placed in the public folder.
const LOCAL_IMAGES = [
    { filename: 'SIHALI JAGEER.jpg', defaultTitle: 'Sihali Jageer', defaultCategory: 'Fashion E-Commerce' },
    { filename: 'Indigo Amour.jpg', defaultTitle: 'Indigo Amour', defaultCategory: 'Sustainable Fashion' },
    { filename: 'Poshak.jpg', defaultTitle: 'Poshak Chikan Studio', defaultCategory: 'Ethnic Wear Store' },
];

const cleanFilename = (raw) => {
    if (!raw) return '';
    return raw.split('/').pop().split('\\').pop().trim();
};

const getProjectImageUrl = (item) => {
    // local portfolio images take priority
    const fn = cleanFilename(item.imageFilename);
    if (fn) return `/images/portfolio/${encodeURIComponent(fn)}`;
    if (item.imageUrl) return item.imageUrl;
    return null;
};

// ─── Inline card for a LOCAL image ────────────────────────────────────────
const LocalImageCard = ({ img, existingDoc }) => {
    const [editing, setEditing] = useState(!existingDoc); // open by default if no doc yet
    const [saving, setSaving] = useState(false);
    const [fields, setFields] = useState({
        title: existingDoc?.title || img.defaultTitle,
        category: existingDoc?.category || img.defaultCategory,
        description: existingDoc?.description || '',
        projectUrl: existingDoc?.projectUrl || '',
    });

    const docId = `local_${img.filename.replace(/[^a-zA-Z0-9]/g, '_')}`;

    const handleSave = async () => {
        setSaving(true);
        try {
            await setDoc(doc(db, 'portfolio', docId), {
                title: fields.title,
                category: fields.category,
                description: fields.description,
                projectUrl: fields.projectUrl,
                imageFilename: img.filename,
                imageUrl: `/images/portfolio/${encodeURIComponent(img.filename)}`,
                isLocal: true,
                createdAt: serverTimestamp(),
            }, { merge: true });
            setEditing(false);
        } catch (err) {
            console.error('Error saving project:', err);
            alert('Error saving project.');
        } finally {
            setSaving(false);
        }
    };

    const handleDelete = async () => {
        if (!window.confirm('Remove this project from the website?')) return;
        try {
            await deleteDoc(doc(db, 'portfolio', docId));
            setFields({
                title: img.defaultTitle,
                category: img.defaultCategory,
                description: '',
                projectUrl: '',
            });
            setEditing(true);
        } catch (err) {
            console.error('Error deleting:', err);
        }
    };

    const imgSrc = `/images/portfolio/${encodeURIComponent(img.filename)}`;
    const isPublished = !!existingDoc;

    return (
        <div className="bg-white dark:bg-[#111827] rounded-[2rem] overflow-hidden border border-gray-100 dark:border-white/5 hover:border-primary/30 transition-all shadow-lg group flex flex-col">
            {/* Image */}
            <div className="relative h-48 bg-slate-100 dark:bg-white/5 flex-shrink-0 overflow-hidden">
                <img
                    src={imgSrc}
                    alt={fields.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                    onError={(e) => { e.target.style.display = 'none'; }}
                />
                {/* Published badge */}
                <div className={`absolute top-3 left-3 px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest ${isPublished ? 'bg-green-500/90 text-white' : 'bg-amber-500/90 text-white'}`}>
                    {isPublished ? '✓ Published' : '● Draft'}
                </div>
                {/* Actions on hover */}
                <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-3">
                    <button
                        onClick={() => setEditing(e => !e)}
                        className="p-3 bg-primary/80 text-white rounded-xl hover:bg-primary transition-all"
                        title="Edit"
                    >
                        <Edit2 size={18} />
                    </button>
                    {isPublished && (
                        <button
                            onClick={handleDelete}
                            className="p-3 bg-red-500/80 text-white rounded-xl hover:bg-red-600 transition-all"
                            title="Remove from site"
                        >
                            <Trash2 size={18} />
                        </button>
                    )}
                </div>
            </div>

            {/* Edit Form */}
            {editing ? (
                <div className="p-5 space-y-3 flex-1 flex flex-col">
                    <input
                        type="text"
                        value={fields.title}
                        onChange={e => setFields({ ...fields, title: e.target.value })}
                        className="w-full bg-slate-50 dark:bg-[#0a0f1d] border border-gray-100 dark:border-white/10 rounded-xl px-3 py-2.5 text-sm dark:text-white outline-none focus:border-primary/50 font-bold transition-colors"
                        placeholder="Project title"
                    />
                    <input
                        type="text"
                        value={fields.category}
                        onChange={e => setFields({ ...fields, category: e.target.value })}
                        className="w-full bg-slate-50 dark:bg-[#0a0f1d] border border-gray-100 dark:border-white/10 rounded-xl px-3 py-2.5 text-xs dark:text-white outline-none focus:border-primary/50 transition-colors"
                        placeholder="Category (e.g. E-Commerce)"
                    />
                    <textarea
                        rows={3}
                        value={fields.description}
                        onChange={e => setFields({ ...fields, description: e.target.value })}
                        className="w-full bg-slate-50 dark:bg-[#0a0f1d] border border-gray-100 dark:border-white/10 rounded-xl px-3 py-2.5 text-xs dark:text-white outline-none focus:border-primary/50 transition-colors resize-none flex-1"
                        placeholder="Describe this project..."
                    />
                    <input
                        type="text"
                        value={fields.projectUrl}
                        onChange={e => setFields({ ...fields, projectUrl: e.target.value })}
                        className="w-full bg-slate-50 dark:bg-[#0a0f1d] border border-gray-100 dark:border-white/10 rounded-xl px-3 py-2.5 text-xs dark:text-white outline-none focus:border-primary/50 transition-colors"
                        placeholder="Live URL (optional)"
                    />
                    <button
                        onClick={handleSave}
                        disabled={saving}
                        className="w-full bg-primary text-white py-2.5 rounded-xl font-bold text-sm flex items-center justify-center gap-2 shadow-lg shadow-primary/20 hover:bg-primary/90 transition-all disabled:opacity-60 mt-auto"
                    >
                        {saving ? (
                            <span className="animate-spin w-4 h-4 border-2 border-white border-t-transparent rounded-full" />
                        ) : (
                            <><Check size={15} /> Publish to Site</>
                        )}
                    </button>
                </div>
            ) : (
                <div className="p-5 flex-1 flex flex-col">
                    <span className="text-primary text-[9px] font-black uppercase tracking-widest">{fields.category}</span>
                    <h3 className="text-base font-bold mt-1 mb-1 text-slate-900 dark:text-white">{fields.title}</h3>
                    <p className="text-gray-500 text-xs line-clamp-2 leading-relaxed mb-3 flex-1">{fields.description || <span className="italic opacity-50">No description yet — click edit to add</span>}</p>
                    {fields.projectUrl && (
                        <div className="flex items-center gap-1.5 text-[10px] font-bold text-gray-400 truncate">
                            <ExternalLink size={10} />
                            <span className="truncate">{fields.projectUrl}</span>
                        </div>
                    )}
                    <button
                        onClick={() => setEditing(true)}
                        className="mt-3 w-full text-xs text-primary border border-primary/30 rounded-xl py-2 hover:bg-primary/5 transition-all font-bold"
                    >
                        Edit Details
                    </button>
                </div>
            )}
        </div>
    );
};

// ─── Extra URL-based card (for projects not in the local folder) ────────────
const ExtraProjectCard = ({ item, onEdit, onDelete }) => {
    const imgSrc = getProjectImageUrl(item);
    return (
        <div className="bg-white dark:bg-[#111827] rounded-[2rem] overflow-hidden border border-gray-100 dark:border-white/5 hover:border-primary/30 transition-all shadow-lg group flex flex-col">
            <div className="relative h-48 bg-slate-100 dark:bg-white/5 overflow-hidden">
                {imgSrc ? (
                    <img src={imgSrc} alt={item.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" onError={(e) => { e.target.style.display = 'none'; }} />
                ) : (
                    <div className="w-full h-full flex items-center justify-center text-gray-400">
                        <ImageIcon size={40} />
                    </div>
                )}
                <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-3">
                    <button onClick={() => onEdit(item)} className="p-3 bg-primary/80 text-white rounded-xl hover:bg-primary transition-all"><Edit2 size={18} /></button>
                    <button onClick={() => onDelete(item._id)} className="p-3 bg-red-500/80 text-white rounded-xl hover:bg-red-600 transition-all"><Trash2 size={18} /></button>
                </div>
            </div>
            <div className="p-5 flex-1 flex flex-col">
                <span className="text-primary text-[9px] font-black uppercase tracking-widest">{item.category}</span>
                <h3 className="text-base font-bold mt-1 mb-1 text-slate-900 dark:text-white">{item.title}</h3>
                <p className="text-gray-500 text-xs line-clamp-2 leading-relaxed mb-2 flex-1">{item.description}</p>
                {item.projectUrl && (
                    <div className="flex items-center gap-1.5 text-[10px] font-bold text-gray-400 truncate">
                        <ExternalLink size={10} />
                        <span className="truncate">{item.projectUrl}</span>
                    </div>
                )}
            </div>
        </div>
    );
};

// ─── Main Admin Portfolio Component ─────────────────────────────────────────
const AdminPortfolio = () => {
    const [firestoreDocs, setFirestoreDocs] = useState({});
    const [extraItems, setExtraItems] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [editMode, setEditMode] = useState(false);
    const [selectedId, setSelectedId] = useState(null);
    const [formData, setFormData] = useState({ title: '', category: '', description: '', imageUrl: '', link: '' });
    const [loading, setLoading] = useState(false);

    // Real-time Firestore listener
    useEffect(() => {
        const q = query(collection(db, 'portfolio'), orderBy('createdAt', 'desc'));
        const unsub = onSnapshot(q, (snap) => {
            const docsMap = {};
            const extras = [];
            snap.docs.forEach(d => {
                const data = { _id: d.id, ...d.data() };
                if (data.isLocal) {
                    docsMap[data.imageFilename] = data;
                } else {
                    extras.push(data);
                }
            });
            setFirestoreDocs(docsMap);
            setExtraItems(extras);
        });
        return () => unsub();
    }, []);

    const resetForm = () => {
        setShowModal(false);
        setEditMode(false);
        setSelectedId(null);
        setFormData({ title: '', category: '', description: '', imageUrl: '', link: '' });
    };

    const handleEdit = (item) => {
        setEditMode(true);
        setSelectedId(item._id);
        setFormData({ title: item.title, category: item.category, description: item.description, imageUrl: item.imageUrl || '', link: item.projectUrl || '' });
        setShowModal(true);
    };

    const handleDelete = async (id) => {
        if (!window.confirm('Delete this project?')) return;
        try { await deleteDoc(doc(db, 'portfolio', id)); }
        catch (err) { console.error(err); }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const data = { title: formData.title, category: formData.category, description: formData.description, imageUrl: formData.imageUrl, projectUrl: formData.link, isLocal: false, createdAt: serverTimestamp() };
            if (editMode) {
                await updateDoc(doc(db, 'portfolio', selectedId), data);
            } else {
                await addDoc(collection(db, 'portfolio'), data);
            }
            resetForm();
        } catch (err) {
            console.error(err);
            alert('Error saving project.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
            {/* Header */}
            <div className="flex flex-wrap gap-3 justify-between items-start">
                <div>
                    <h1 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white">Portfolio</h1>
                    <p className="text-gray-500 dark:text-gray-400 text-sm mt-1">Click any project card to edit its title, description and publish it to the site</p>
                </div>
                <button
                    onClick={() => { resetForm(); setShowModal(true); }}
                    className="bg-primary hover:bg-primary/90 text-white px-5 py-3 rounded-2xl font-bold flex items-center gap-2 shadow-xl shadow-primary/20 transition-all text-sm flex-shrink-0"
                >
                    <Plus size={18} />
                    <span>Add Extra Project</span>
                </button>
            </div>

            {/* Section: Local Images */}
            <div>
                <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-4 ml-1">📁 From Your Previous Work Folder</p>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {LOCAL_IMAGES.map(img => (
                        <LocalImageCard
                            key={img.filename}
                            img={img}
                            existingDoc={firestoreDocs[img.filename] || null}
                        />
                    ))}
                </div>
            </div>

            {/* Section: Extra Projects (URL-based) */}
            {extraItems.length > 0 && (
                <div>
                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-4 ml-1">🔗 Extra Projects (URL-based)</p>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {extraItems.map(item => (
                            <ExtraProjectCard key={item._id} item={item} onEdit={handleEdit} onDelete={handleDelete} />
                        ))}
                    </div>
                </div>
            )}

            {/* Add Extra Project Modal */}
            {showModal && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-black/80 backdrop-blur-sm">
                    <div className="bg-white dark:bg-[#111827] w-full max-w-lg rounded-[2rem] p-8 shadow-2xl border border-white/5 relative max-h-[90vh] overflow-y-auto">
                        <button onClick={resetForm} className="absolute top-6 right-6 text-gray-400 hover:text-white"><X size={22} /></button>
                        <h2 className="text-xl font-bold mb-6 text-slate-900 dark:text-white">
                            {editMode ? 'Edit Project' : 'Add Extra Project'}
                        </h2>
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div className="grid md:grid-cols-2 gap-4">
                                <div className="space-y-1">
                                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Project Title</label>
                                    <input type="text" required value={formData.title} onChange={e => setFormData({ ...formData, title: e.target.value })} className="w-full bg-slate-50 dark:bg-[#0a0f1d] border border-gray-100 dark:border-white/10 rounded-xl px-4 py-3 dark:text-white outline-none text-sm" />
                                </div>
                                <div className="space-y-1">
                                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Category</label>
                                    <input type="text" required value={formData.category} onChange={e => setFormData({ ...formData, category: e.target.value })} className="w-full bg-slate-50 dark:bg-[#0a0f1d] border border-gray-100 dark:border-white/10 rounded-xl px-4 py-3 dark:text-white outline-none text-sm" />
                                </div>
                            </div>
                            <div className="space-y-1">
                                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Image URL</label>
                                <div className="flex items-center gap-3 bg-slate-50 dark:bg-[#0a0f1d] border border-gray-100 dark:border-white/10 rounded-xl px-4 py-3">
                                    <Link size={14} className="text-gray-400 flex-shrink-0" />
                                    <input type="text" value={formData.imageUrl} onChange={e => setFormData({ ...formData, imageUrl: e.target.value })} className="w-full bg-transparent dark:text-white outline-none text-xs" placeholder="Paste direct image URL" />
                                </div>
                                {formData.imageUrl && (
                                    <img src={formData.imageUrl} alt="preview" className="mt-2 w-full h-32 object-cover rounded-xl" onError={e => e.target.style.display = 'none'} />
                                )}
                            </div>
                            <div className="space-y-1">
                                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Live URL (optional)</label>
                                <input type="text" value={formData.link} onChange={e => setFormData({ ...formData, link: e.target.value })} className="w-full bg-slate-50 dark:bg-[#0a0f1d] border border-gray-100 dark:border-white/10 rounded-xl px-4 py-3 dark:text-white outline-none text-xs" placeholder="https://yourwebsite.com" />
                            </div>
                            <div className="space-y-1">
                                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Description</label>
                                <textarea rows={3} required value={formData.description} onChange={e => setFormData({ ...formData, description: e.target.value })} className="w-full bg-slate-50 dark:bg-[#0a0f1d] border border-gray-100 dark:border-white/10 rounded-xl px-4 py-3 dark:text-white outline-none text-sm resize-none" placeholder="Describe this project..." />
                            </div>
                            <button type="submit" disabled={loading} className="w-full bg-primary text-white py-3.5 rounded-xl font-bold shadow-xl shadow-primary/20 disabled:opacity-50 transition-all text-sm">
                                {loading ? 'Saving...' : 'Save Project'}
                            </button>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AdminPortfolio;
