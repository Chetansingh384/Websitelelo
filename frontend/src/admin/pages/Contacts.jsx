import React, { useState, useEffect } from 'react';
import { db } from '../../firebase';
import { collection, query, orderBy, onSnapshot } from 'firebase/firestore';
import { Mail, Phone, MessageSquare, Clock, CheckCircle, Search, Filter, Trash2, ExternalLink } from 'lucide-react';

const Contacts = () => {
    const [contacts, setContacts] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const q = query(collection(db, 'leads'), orderBy('createdAt', 'desc'));
        const unsubscribe = onSnapshot(q, (snapshot) => {
            const leadsData = snapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data(),
                createdAt: doc.data().createdAt?.toDate() || new Date()
            }));
            setContacts(leadsData);
            setLoading(false);
        });

        return () => unsubscribe();
    }, []);

    return (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div>
                <h1 className="text-3xl font-bold text-slate-900 dark:text-white">Contact Submissions</h1>
                <p className="text-gray-500 dark:text-gray-400">View and manage messages from potential clients</p>
            </div>

            <div className="grid gap-6">
                {contacts.length === 0 ? (
                    <div className="bg-white dark:bg-[#111827] p-12 rounded-[2.5rem] text-center border border-gray-100 dark:border-white/5 shadow-xl">
                        <MessageSquare className="mx-auto text-gray-300 dark:text-gray-700 mb-4" size={48} />
                        <p className="text-gray-400 dark:text-gray-500 font-medium">No new leads yet. Check back later!</p>
                    </div>
                ) : (
                    contacts.map((contact) => (
                        <div key={contact._id} className="bg-white dark:bg-[#111827] p-8 rounded-[2.5rem] border border-gray-100 dark:border-white/5 flex flex-col md:flex-row justify-between items-start gap-6 hover:border-primary/30 transition-all group shadow-lg">
                            <div className="flex-grow">
                                <div className="flex items-center space-x-3 mb-4">
                                    <h3 className="text-xl font-bold text-slate-900 dark:text-white group-hover:text-primary transition-colors">{contact.name}</h3>
                                    <span className={`px-3 py-1 rounded-lg text-[10px] font-black uppercase tracking-widest ${contact.status === 'New' ? 'bg-primary/10 text-primary' : 'bg-emerald-500/10 text-emerald-500'}`}>
                                        {contact.status}
                                    </span>
                                </div>
                                <div className="flex flex-wrap items-center gap-y-2 gap-x-6 text-gray-500 dark:text-gray-500 mb-6 text-xs font-semibold uppercase tracking-wider">
                                    <div className="flex items-center space-x-2">
                                        <Mail size={14} className="text-primary/70" />
                                        <span>{contact.email}</span>
                                    </div>
                                    {contact.phone && (
                                        <div className="flex items-center space-x-2">
                                            <Phone size={14} className="text-primary/70" />
                                            <span>{contact.phone}</span>
                                        </div>
                                    )}
                                    <div className="flex items-center space-x-2">
                                        <Clock size={14} className="text-primary/70" />
                                        <span>{new Date(contact.createdAt).toLocaleDateString()}</span>
                                    </div>
                                </div>
                                <p className="text-slate-600 dark:text-gray-300 leading-relaxed bg-slate-50 dark:bg-[#0a0f1d] p-6 rounded-2xl border border-gray-100 dark:border-white/5 italic text-sm">
                                    "{contact.message}"
                                </p>
                            </div>
                            <div className="flex md:flex-col gap-3">
                                <button className="p-4 bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-500 rounded-2xl transition-all shadow-lg shadow-black/5 dark:shadow-black/20" title="Mark as Resolved">
                                    <CheckCircle size={20} />
                                </button>
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
};

export default Contacts;
