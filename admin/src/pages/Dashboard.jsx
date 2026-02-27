import React, { useState, useEffect } from 'react';
import { db } from '../firebase';
import { collection, query, orderBy, onSnapshot } from 'firebase/firestore';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area, Clock } from 'recharts';
import { Users, CreditCard, Image, MessageSquare, ExternalLink } from 'lucide-react';

const data = [
    { name: 'Mon', leads: 4 },
    { name: 'Tue', leads: 7 },
    { name: 'Wed', leads: 5 },
    { name: 'Thu', leads: 12 },
    { name: 'Fri', leads: 9 },
    { name: 'Sat', leads: 15 },
    { name: 'Sun', leads: 10 },
];

const StatCard = ({ title, value, icon, color }) => (
    <div className="bg-surface p-6 rounded-3xl border border-white/5 shadow-xl transition-transform hover:scale-[1.02]">
        <div className="flex items-center justify-between mb-4">
            <div className={`p-3 rounded-2xl ${color} bg-opacity-10 text-${color.split('-')[1]}-500`}>
                {icon}
            </div>
        </div>
        <p className="text-gray-400 text-sm mb-1">{title}</p>
        <h3 className="text-3xl font-bold">{value}</h3>
    </div>
);

const Dashboard = () => {
    const [contacts, setContacts] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const q = query(collection(db, 'leads'), orderBy('createdAt', 'desc'));
        const unsubscribe = onSnapshot(q, (snapshot) => {
            const leadsData = snapshot.docs.map(doc => ({
                _id: doc.id,
                ...doc.data(),
                createdAt: doc.data().createdAt?.toDate() || new Date()
            }));
            setContacts(leadsData);
            setLoading(false);
        });

        return () => unsubscribe();
    }, []);

    const getTimeAgo = (date) => {
        const seconds = Math.floor((new Date() - new Date(date)) / 1000);
        if (seconds < 60) return `${seconds}s ago`;
        const minutes = Math.floor(seconds / 60);
        if (minutes < 60) return `${minutes}m ago`;
        const hours = Math.floor(minutes / 60);
        if (hours < 24) return `${hours}h ago`;
        return new Date(date).toLocaleDateString();
    };

    return (
        <div className="space-y-10">
            <header>
                <h1 className="text-3xl font-bold mb-2">Dashboard Overview</h1>
                <p className="text-gray-400">Welcome back, Admin. Here's what's happening today.</p>
            </header>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <StatCard title="Total Leads" value="48" icon={<Users size={24} />} color="bg-blue-500" />
                <StatCard title="Active Plans" value="3" icon={<CreditCard size={24} />} color="bg-emerald-500" />
                <StatCard title="Portfolio Items" value="12" icon={<Image size={24} />} color="bg-purple-500" />
                <StatCard title="New Contacts" value={contacts.length} icon={<MessageSquare size={24} />} color="bg-orange-500" />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div className="bg-surface p-8 rounded-3xl border border-white/5">
                    <h3 className="text-xl font-bold mb-8">Lead Generation (Weekly)</h3>
                    <div className="h-[300px]">
                        <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={data}>
                                <defs>
                                    <linearGradient id="colorLeads" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#6366f1" stopOpacity={0.3} />
                                        <stop offset="95%" stopColor="#6366f1" stopOpacity={0} />
                                    </linearGradient>
                                </defs>
                                <XAxis dataKey="name" stroke="#64748b" fontSize={12} tickLine={false} axisLine={false} />
                                <Tooltip
                                    contentStyle={{ backgroundColor: '#1e293b', border: 'none', borderRadius: '12px', color: '#fff' }}
                                    itemStyle={{ color: '#6366f1' }}
                                />
                                <Area type="monotone" dataKey="leads" stroke="#6366f1" fillOpacity={1} fill="url(#colorLeads)" />
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                <div className="bg-surface p-8 rounded-3xl border border-white/5">
                    <h3 className="text-xl font-bold mb-8">Recent Submissions</h3>
                    <div className="space-y-6">
                        {loading ? (
                            <p className="text-gray-500 text-center py-4">Loading submissions...</p>
                        ) : contacts.length === 0 ? (
                            <p className="text-gray-500 text-center py-4">No recent submissions.</p>
                        ) : (
                            contacts.slice(0, 4).map((contact, i) => (
                                <div key={contact._id || i} className="flex items-center justify-between p-4 bg-dark/40 rounded-2xl border border-white/5">
                                    <div className="flex items-center space-x-4">
                                        <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center text-primary font-bold">
                                            {contact.name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)}
                                        </div>
                                        <div>
                                            <h5 className="font-medium text-sm">{contact.name}</h5>
                                            <p className="text-xs text-gray-500">{getTimeAgo(contact.createdAt)}</p>
                                        </div>
                                    </div>
                                    <button
                                        onClick={() => window.location.href = '/admin/contacts'}
                                        className="text-xs text-primary font-bold hover:underline"
                                    >
                                        View details
                                    </button>
                                </div>
                            ))
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};


export default Dashboard;
