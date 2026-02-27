import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { db } from '../../firebase';
import { collection, query, orderBy, onSnapshot, addDoc, updateDoc, deleteDoc, doc, serverTimestamp } from 'firebase/firestore';
import { Plus, Trash2, X, User, Linkedin, Twitter, Github, ImageIcon, Edit2, Search, Link } from 'lucide-react';

const AdminTeam = () => {
    const [members, setMembers] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        name: '',
        role: '',
        bio: '',
        image: '',
        socials: { linkedin: '', twitter: '', github: '' }
    });
    const [editMode, setEditMode] = useState(false);
    const [selectedId, setSelectedId] = useState(null);
    const [loadingMembers, setLoadingMembers] = useState(true);
    const [fetchingProfile, setFetchingProfile] = useState(false);
    const [error, setError] = useState(null);

    const rolePriority = {
        'founder': 1,
        'co-founder': 2,
        'full stack developer': 3
    };

    const sortMembers = (members) => {
        return [...members].sort((a, b) => {
            const priorityA = rolePriority[a.role?.toLowerCase()] || 99;
            const priorityB = rolePriority[b.role?.toLowerCase()] || 99;
            if (priorityA !== priorityB) return priorityA - priorityB;
            return (b.createdAt?.seconds || 0) - (a.createdAt?.seconds || 0);
        });
    };

    useEffect(() => {
        if (!import.meta.env.VITE_FIREBASE_API_KEY) {
            setError('Firebase configuration is missing. Please check your environment variables.');
            setLoadingMembers(false);
            return;
        }

        const q = collection(db, 'team');
        const unsubscribe = onSnapshot(q,
            (snapshot) => {
                const teamData = snapshot.docs.map(doc => ({
                    _id: doc.id,
                    ...doc.data()
                }));
                const sortedData = sortMembers(teamData);
                setMembers(sortedData);
                setLoadingMembers(false);
                setError(null);
            },
            (err) => {
                console.error('Firestore Error:', err);
                setError('Failed to connect to database. Check your internet or Firebase permissions.');
                setLoadingMembers(false);
            }
        );
        return () => unsubscribe();
    }, []);

    const resetForm = () => {
        setFormData({ name: '', role: '', bio: '', image: '', socials: { linkedin: '', twitter: '', github: '' } });
        setEditMode(false);
        setSelectedId(null);
        setShowModal(false);
    };

    const handleEdit = (member) => {
        setEditMode(true);
        setSelectedId(member._id);
        setFormData({
            name: member.name,
            role: member.role,
            bio: member.bio || '',
            image: member.image,
            socials: member.socials || { linkedin: '', twitter: '', github: '' }
        });
        setShowModal(true);
    };

    const fetchGitHubData = async (githubRef) => {
        if (!githubRef) return null;
        let username = githubRef;
        if (githubRef.includes('github.com/')) {
            username = githubRef.split('github.com/')[1].split('/')[0];
        }
        try {
            const { data } = await axios.get(`https://api.github.com/users/${username}`);
            return {
                name: data.name || data.login,
                bio: data.bio,
                avatar_url: data.avatar_url,
                profile_url: `https://github.com/${data.login}`
            };
        } catch (err) {
            console.error('GitHub Fetch Error:', err);
            return null;
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!formData.image) {
            alert('Please provide an image URL or fetch from GitHub first!');
            return;
        }
        setLoading(true);
        try {
            let finalData = { ...formData };

            // Auto-fetch/Refresh GitHub data during save to ensure we have the latest
            if (formData.socials.github) {
                const gitData = await fetchGitHubData(formData.socials.github);
                if (gitData) {
                    finalData = {
                        ...finalData,
                        name: finalData.name || gitData.name,
                        bio: finalData.bio || gitData.bio,
                        image: finalData.image || gitData.avatar_url,
                        socials: { ...finalData.socials, github: gitData.profile_url }
                    };
                }
            }

            if (!finalData.image) {
                alert('Please provide a photo or a GitHub profile!');
                setLoading(false);
                return;
            }

            const teamData = {
                ...finalData,
                createdAt: serverTimestamp()
            };

            if (editMode) {
                await updateDoc(doc(db, 'team', selectedId), teamData);
            } else {
                await addDoc(collection(db, 'team'), teamData);
            }
            resetForm();
        } catch (err) {
            console.error('Save Member Error:', err);
            alert('Error saving team member.');
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm('Remove this team member?')) return;
        try {
            await deleteDoc(doc(db, 'team', id));
        } catch (err) {
            console.error('Delete Member Error:', err);
        }
    };

    return (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="flex flex-wrap gap-3 justify-between items-start">
                <div>
                    <h1 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white">Team Management</h1>
                    <p className="text-gray-500 dark:text-gray-400 text-sm">Manage your company creative minds</p>
                </div>
                <button
                    onClick={() => { resetForm(); setShowModal(true); }}
                    className="bg-primary hover:bg-primary-dark text-white px-5 py-3 rounded-2xl font-bold flex items-center space-x-2 shadow-xl shadow-primary/20 transition-all text-sm"
                >
                    <Plus size={18} />
                    <span>Add Member</span>
                </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {loadingMembers ? (
                    <div className="col-span-full py-20 text-center bg-white dark:bg-[#111827] rounded-[2.5rem] border border-gray-100 dark:border-white/5 w-full">
                        <div className="loader mx-auto mb-4"></div>
                        <p className="text-gray-500">Loading team members...</p>
                    </div>
                ) : error ? (
                    <div className="col-span-full py-20 text-center bg-white dark:bg-[#111827] rounded-[2.5rem] border border-red-100 dark:border-red-900/20 w-full">
                        <X size={48} className="mx-auto text-red-500 mb-4" />
                        <p className="text-red-500 font-medium">{error}</p>
                    </div>
                ) : members.length === 0 ? (
                    <div className="col-span-full py-20 text-center bg-white dark:bg-[#111827] rounded-[2.5rem] border border-gray-100 dark:border-white/5 w-full">
                        <User size={48} className="mx-auto text-gray-300 dark:text-gray-700 mb-4" />
                        <p className="text-gray-500 font-medium">No team members found. Click "Add Member" to start.</p>
                    </div>
                ) : (
                    members.map((member) => (
                        <div key={member._id} className="bg-white dark:bg-[#111827] p-6 rounded-[2.5rem] border border-gray-100 dark:border-white/5 shadow-lg group relative">
                            <div className="absolute top-4 right-4 flex space-x-2 opacity-0 group-hover:opacity-100 transition-all">
                                <button
                                    onClick={() => handleEdit(member)}
                                    className="p-2 text-primary hover:bg-primary/10 rounded-lg transition-colors"
                                >
                                    <Edit2 size={18} />
                                </button>
                                <button
                                    onClick={() => handleDelete(member._id)}
                                    className="p-2 text-gray-400 hover:text-red-500 transition-colors"
                                >
                                    <Trash2 size={18} />
                                </button>
                            </div>
                            <div className="flex flex-col items-center text-center">
                                <img
                                    src={member.image || 'https://i.pravatar.cc/150?u=' + (member.name || member._id)}
                                    alt={member.name}
                                    className="w-24 h-24 rounded-full object-cover mb-4 border-2 border-primary/20"
                                    onError={(e) => { e.target.src = 'https://i.pravatar.cc/150?u=' + (member.name || member._id); }}
                                />
                                <h3 className="font-bold text-slate-900 dark:text-white line-clamp-1">{member.name}</h3>
                                <p className="text-xs text-primary font-black mb-3 uppercase tracking-tighter">{member.role}</p>
                                <p className="text-[10px] text-gray-500 line-clamp-2 mb-4 leading-relaxed">{member.bio}</p>
                                <div className="flex space-x-3 text-gray-400">
                                    {member.socials?.linkedin && <Linkedin size={14} className="hover:text-primary transition-colors cursor-pointer" />}
                                    {member.socials?.twitter && <Twitter size={14} className="hover:text-primary transition-colors cursor-pointer" />}
                                    {member.socials?.github && <Github size={14} className="hover:text-primary transition-colors cursor-pointer" />}
                                </div>
                            </div>
                        </div>
                    ))
                )}
            </div>

            {/* Modal */}
            {showModal && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-dark/80 backdrop-blur-sm animate-in fade-in duration-300">
                    <div className="bg-white dark:bg-[#111827] w-full max-w-lg rounded-[2rem] p-6 md:p-10 shadow-2xl border border-white/5 relative max-h-[90vh] overflow-y-auto">
                        <button onClick={resetForm} className="absolute top-8 right-8 text-gray-400 hover:text-white"><X size={24} /></button>
                        <h2 className="text-2xl font-bold mb-8 text-slate-900 dark:text-white">
                            {editMode ? 'Edit Team Member' : 'Add Team Member'}
                        </h2>
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div className="space-y-1">
                                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Full Name</label>
                                <input type="text" required value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} className="w-full bg-slate-50 dark:bg-[#0a0f1d] border border-gray-100 dark:border-white/10 rounded-2xl px-4 py-3 dark:text-white outline-none" />
                            </div>
                            <div className="space-y-1">
                                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Role / Designation</label>
                                <input type="text" required value={formData.role} onChange={(e) => setFormData({ ...formData, role: e.target.value })} className="w-full bg-slate-50 dark:bg-[#0a0f1d] border border-gray-100 dark:border-white/10 rounded-2xl px-4 py-3 dark:text-white outline-none" placeholder="ex: Lead Developer" />
                            </div>

                            <div className="space-y-1">
                                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">GitHub Username (Auto-fill)</label>
                                <div className="flex space-x-2">
                                    <input
                                        type="text"
                                        value={formData.socials.github}
                                        onChange={(e) => setFormData({ ...formData, socials: { ...formData.socials, github: e.target.value } })}
                                        onBlur={async () => {
                                            const githubRef = formData.socials.github;
                                            if (!githubRef) return;
                                            setFetchingProfile(true);
                                            const gitData = await fetchGitHubData(githubRef);
                                            if (gitData) {
                                                setFormData(prev => ({
                                                    ...prev,
                                                    name: prev.name || gitData.name,
                                                    bio: prev.bio || gitData.bio,
                                                    image: prev.image || gitData.avatar_url,
                                                    socials: { ...prev.socials, github: gitData.profile_url }
                                                }));
                                            }
                                            setFetchingProfile(false);
                                        }}
                                        className={`w-full bg-slate-50 dark:bg-[#0a0f1d] border rounded-2xl px-4 py-3 dark:text-white outline-none transition-all ${fetchingProfile ? 'border-primary/50 opacity-70' : 'border-gray-100 dark:border-white/10'}`}
                                        placeholder="GitHub username or profile URL"
                                    />
                                </div>
                            </div>
                            <div className="space-y-1">
                                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Photo URL (Direct Link)</label>
                                <div className="flex items-center space-x-4">
                                    <div className="w-16 h-16 rounded-2xl bg-slate-50 dark:bg-[#0a0f1d] border border-gray-100 dark:border-white/10 flex items-center justify-center overflow-hidden flex-shrink-0">
                                        {formData.image ? (
                                            <img src={formData.image} alt="Preview" className="w-full h-full object-cover" onError={(e) => { e.target.src = 'https://i.pravatar.cc/150?u=preview'; }} />
                                        ) : (
                                            <ImageIcon size={24} className="text-gray-500" />
                                        )}
                                    </div>
                                    <div className="flex-grow">
                                        <div className="flex items-center bg-slate-50 dark:bg-[#0a0f1d] border border-gray-100 dark:border-white/10 rounded-2xl px-4 py-3 group">
                                            <Link size={16} className="text-gray-400 mr-2 group-focus-within:text-primary transition-colors" />
                                            <input
                                                type="text"
                                                value={formData.image}
                                                onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                                                className="w-full bg-transparent dark:text-white outline-none text-xs"
                                                placeholder="Paste any direct image URL"
                                            />
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="space-y-1">
                                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">LinkedIn Profile</label>
                                <div className="flex space-x-2">
                                    <input
                                        type="text"
                                        value={formData.socials.linkedin}
                                        onChange={(e) => setFormData({ ...formData, socials: { ...formData.socials, linkedin: e.target.value } })}
                                        className="w-full bg-slate-50 dark:bg-[#0a0f1d] border border-gray-100 dark:border-white/10 rounded-2xl px-4 py-3 dark:text-white outline-none focus:border-primary/50 transition-colors"
                                        placeholder="https://linkedin.com/in/username"
                                    />
                                </div>
                            </div>
                            <div className="space-y-1">
                                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Short Bio</label>
                                <textarea rows="2" value={formData.bio} onChange={(e) => setFormData({ ...formData, bio: e.target.value })} className="w-full bg-slate-50 dark:bg-[#0a0f1d] border border-gray-100 dark:border-white/10 rounded-2xl px-4 py-3 dark:text-white outline-none" placeholder="Brief description of the team member..."></textarea>
                            </div>
                            <button type="submit" disabled={loading} className="w-full bg-primary text-white py-4 rounded-2xl font-bold shadow-xl shadow-primary/20 mt-4 disabled:opacity-50 transition-all active:scale-[0.98]">
                                {loading ? 'Saving...' : 'Save Member'}
                            </button>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AdminTeam;
