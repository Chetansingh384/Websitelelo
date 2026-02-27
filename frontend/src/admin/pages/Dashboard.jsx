import React, { useState, useEffect } from 'react';
import { db } from '../../firebase';
import { collection, query, orderBy, onSnapshot } from 'firebase/firestore';
import { AreaChart, Area, XAxis, Tooltip, ResponsiveContainer } from 'recharts';
import { Package, Image, Users, MessageCircle, MessageSquare, TrendingUp, Sun, Moon } from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';

const chartData = [
    { name: 'Mon', value: 4 },
    { name: 'Tue', value: 7 },
    { name: 'Wed', value: 5 },
    { name: 'Thu', value: 12 },
    { name: 'Fri', value: 9 },
    { name: 'Sat', value: 15 },
    { name: 'Sun', value: 10 },
];

const StatCard = ({ title, value, icon, bgColor, iconColor, loading }) => (
    <div className="bg-white dark:bg-[#111827] p-8 rounded-[2.5rem] border border-gray-100 dark:border-white/5 shadow-xl transition-all hover:scale-[1.02] hover:border-primary/20 flex flex-col gap-6">
        <div className="flex items-center justify-between">
            <div className={`w-14 h-14 rounded-2xl ${bgColor} flex items-center justify-center ${iconColor}`}>
                {icon}
            </div>
        </div>
        <div>
            <p className="text-gray-500 dark:text-gray-500 text-[10px] font-black uppercase tracking-widest mb-2">{title}</p>
            {loading ? (
                <div className="h-8 w-12 bg-gray-200 dark:bg-white/10 rounded-lg animate-pulse" />
            ) : (
                <h3 className="text-4xl font-bold text-slate-900 dark:text-white tracking-tight">{value}</h3>
            )}
        </div>
    </div>
);

const Dashboard = () => {
    const { isDark, toggleTheme } = useTheme();

    // Real-time counts from Firestore — one for each sidebar section
    const [counts, setCounts] = useState({ plans: 0, portfolio: 0, team: 0, feedback: 0, contacts: 0 });
    const [loadingCounts, setLoadingCounts] = useState(true);
    const [recentContacts, setRecentContacts] = useState([]);
    const [loadingContacts, setLoadingContacts] = useState(true);

    useEffect(() => {
        const unsubs = [];
        let resolved = 0;
        const total = 5;
        const checkDone = () => { resolved++; if (resolved >= total) setLoadingCounts(false); };

        // Plans
        unsubs.push(onSnapshot(collection(db, 'plans'), snap => {
            setCounts(c => ({ ...c, plans: snap.size }));
            checkDone();
        }, () => checkDone()));

        // Portfolio
        unsubs.push(onSnapshot(collection(db, 'portfolio'), snap => {
            setCounts(c => ({ ...c, portfolio: snap.size }));
            checkDone();
        }, () => checkDone()));

        // Team
        unsubs.push(onSnapshot(collection(db, 'team'), snap => {
            setCounts(c => ({ ...c, team: snap.size }));
            checkDone();
        }, () => checkDone()));

        // Feedback / Testimonials (stored in 'testimonials' collection)
        unsubs.push(onSnapshot(collection(db, 'testimonials'), snap => {
            setCounts(c => ({ ...c, feedback: snap.size }));
            checkDone();
        }, () => checkDone()));

        // Contacts / Leads
        unsubs.push(onSnapshot(query(collection(db, 'leads'), orderBy('createdAt', 'desc')), snap => {
            const data = snap.docs.map(d => ({
                _id: d.id,
                ...d.data(),
                createdAt: d.data().createdAt?.toDate() || new Date()
            }));
            setCounts(c => ({ ...c, contacts: snap.size }));
            setRecentContacts(data);
            setLoadingContacts(false);
            checkDone();
        }, () => { setLoadingContacts(false); checkDone(); }));

        return () => unsubs.forEach(u => u());
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

    const statCards = [
        {
            title: 'Plans',
            value: counts.plans,
            icon: <Package size={24} />,
            bgColor: 'bg-emerald-500/10',
            iconColor: 'text-emerald-400',
        },
        {
            title: 'Portfolio',
            value: counts.portfolio,
            icon: <Image size={24} />,
            bgColor: 'bg-purple-500/10',
            iconColor: 'text-purple-400',
        },
        {
            title: 'Team Members',
            value: counts.team,
            icon: <Users size={24} />,
            bgColor: 'bg-blue-500/10',
            iconColor: 'text-blue-400',
        },
        {
            title: 'Feedback',
            value: counts.feedback,
            icon: <MessageCircle size={24} />,
            bgColor: 'bg-pink-500/10',
            iconColor: 'text-pink-400',
        },
        {
            title: 'Contacts',
            value: counts.contacts,
            icon: <MessageSquare size={24} />,
            bgColor: 'bg-orange-500/10',
            iconColor: 'text-orange-400',
        },
    ];

    return (
        <div className="space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-700">
            {/* Header */}
            <header className="flex justify-between items-end">
                <div>
                    <h1 className="text-4xl font-bold text-slate-900 dark:text-white tracking-tight">Dashboard</h1>
                    <p className="text-gray-500 mt-2 font-medium">Welcome back, Administrator</p>
                </div>
                <div className="flex items-center space-x-4">
                    <button
                        onClick={toggleTheme}
                        className="p-3 rounded-2xl bg-white dark:bg-[#111827] border border-gray-100 dark:border-white/5 text-slate-600 dark:text-gray-400 hover:text-primary transition-all shadow-lg"
                    >
                        {isDark ? <Sun size={20} /> : <Moon size={20} />}
                    </button>
                    <div className="bg-primary/10 px-4 py-2 rounded-xl border border-primary/20 flex items-center space-x-2">
                        <div className="w-2 h-2 bg-primary rounded-full animate-pulse" />
                        <span className="text-xs font-bold text-primary uppercase tracking-tighter">System Live</span>
                    </div>
                </div>
            </header>

            {/* Real-time stat cards — one per sidebar section */}
            <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-5 gap-3 md:gap-4">
                {statCards.map((card) => (
                    <StatCard key={card.title} {...card} loading={loadingCounts} />
                ))}
            </div>

            {/* Charts + Recent Activity */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Chart */}
                <div className="bg-white dark:bg-[#111827] p-10 rounded-[2.5rem] border border-gray-100 dark:border-white/5 shadow-2xl">
                    <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-10 tracking-tight">Contact Activity</h3>
                    <div className="h-[300px]">
                        <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={chartData}>
                                <defs>
                                    <linearGradient id="colorVal" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#6366f1" stopOpacity={0.4} />
                                        <stop offset="95%" stopColor="#6366f1" stopOpacity={0} />
                                    </linearGradient>
                                </defs>
                                <XAxis dataKey="name" stroke={isDark ? "#374151" : "#94a3b8"} fontSize={10} fontWeight="bold" tickLine={false} axisLine={false} />
                                <Tooltip
                                    contentStyle={{
                                        backgroundColor: isDark ? '#111827' : '#fff',
                                        border: isDark ? '1px solid rgba(255,255,255,0.05)' : '1px solid rgba(0,0,0,0.05)',
                                        borderRadius: '16px',
                                        color: isDark ? '#fff' : '#000'
                                    }}
                                />
                                <Area type="monotone" dataKey="value" stroke="#6366f1" strokeWidth={3} fillOpacity={1} fill="url(#colorVal)" />
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* Recent Contacts */}
                <div className="bg-white dark:bg-[#111827] p-10 rounded-[2.5rem] border border-gray-100 dark:border-white/5 shadow-2xl">
                    <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-10 tracking-tight">Recent Contacts</h3>
                    <div className="space-y-4 max-h-[340px] overflow-y-auto pr-2 custom-scrollbar">
                        {loadingContacts ? (
                            <p className="text-gray-500 text-center py-4 text-xs">Loading...</p>
                        ) : recentContacts.length === 0 ? (
                            <p className="text-gray-500 text-center py-4 text-xs font-bold uppercase tracking-widest opacity-50">No recent submissions.</p>
                        ) : (
                            recentContacts.map((contact, i) => (
                                <div key={contact._id || i}
                                    className="flex items-center justify-between p-4 bg-slate-50 dark:bg-[#0a0f1d] rounded-2xl border border-gray-100 dark:border-white/5 hover:border-primary/20 transition-colors group"
                                >
                                    <div className="flex items-center space-x-3">
                                        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary/20 to-secondary/20 flex items-center justify-center text-slate-900 dark:text-white font-black text-xs uppercase group-hover:from-primary group-hover:to-secondary transition-all">
                                            {contact.name?.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2) || '??'}
                                        </div>
                                        <div>
                                            <h5 className="font-bold text-sm text-slate-900 dark:text-white">{contact.name}</h5>
                                            <p className="text-[10px] text-gray-400 font-bold uppercase mt-0.5 tracking-widest">{contact.email}</p>
                                        </div>
                                    </div>
                                    <p className="text-[10px] text-primary font-black uppercase tracking-tighter bg-primary/10 px-2 py-1 rounded-lg border border-primary/10 group-hover:bg-primary group-hover:text-white transition-all whitespace-nowrap">
                                        {getTimeAgo(contact.createdAt)}
                                    </p>
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
