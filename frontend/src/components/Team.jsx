import React, { useState, useEffect } from 'react';
import { Github, Twitter, Linkedin } from 'lucide-react';
import { db } from '../firebase';
import { collection, query, orderBy, getDocs } from 'firebase/firestore';

const Team = () => {
    const [team, setTeam] = useState([]);
    const [loading, setLoading] = useState(true);

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
        const fetchTeam = async () => {
            setLoading(true);
            if (!import.meta.env.VITE_FIREBASE_API_KEY) {
                console.warn('Firebase API Key missing. Showing dummy fallback data.');
                // Trigger fallback immediately
                setTeam([]);
                setLoading(false);
                return;
            }
            try {
                const q = query(collection(db, 'team'));
                const snapshot = await getDocs(q);
                const teamData = snapshot.docs.map(doc => ({
                    _id: doc.id,
                    ...doc.data()
                }));

                if (teamData && teamData.length > 0) {
                    setTeam(sortMembers(teamData));
                } else {
                    // Fallback dummy data if collection is empty
                    setTeam([]);
                }
            } catch (err) {
                console.error('Error fetching team:', err);
                // Fallback dummy data on error
                setTeam([]);
            } finally {
                setLoading(false);
            }
        };
        fetchTeam();
    }, []);

    const SkeletonCard = () => (
        <div className="glass-card flex flex-col items-center text-center group w-full max-w-[320px] min-h-[420px] animate-pulse">
            <div className="relative mb-6">
                <div className="w-32 h-32 rounded-full bg-slate-200 dark:bg-slate-700/50" />
            </div>
            <div className="h-6 w-3/4 bg-slate-200 dark:bg-slate-700/50 rounded-lg mb-4" />
            <div className="h-4 w-1/2 bg-slate-200 dark:bg-slate-700/50 rounded-lg mb-6" />
            <div className="space-y-2 w-full px-4 mb-6">
                <div className="h-3 w-full bg-slate-200 dark:bg-slate-700/50 rounded" />
                <div className="h-3 w-5/6 bg-slate-200 dark:bg-slate-700/50 rounded mx-auto" />
            </div>
            <div className="flex space-x-4 mt-auto">
                <div className="w-5 h-5 bg-slate-200 dark:bg-slate-700/50 rounded" />
                <div className="w-5 h-5 bg-slate-200 dark:bg-slate-700/50 rounded" />
            </div>
        </div>
    );

    return (
        <section id="team" className="py-24 bg-dark/50">
            <div className="container mx-auto px-6">
                <div className="text-center mb-16">
                    <h2 className="text-4xl font-bold mb-4 text-slate-900 dark:text-white">Meet <span className="gradient-text">Our Team</span></h2>
                    <p className="text-slate-600 dark:text-gray-400">The creative minds behind WebsiteLelo</p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 max-w-5xl mx-auto justify-items-center">
                    {loading ? (
                        <>
                            <SkeletonCard />
                            <SkeletonCard />
                            <SkeletonCard />
                        </>
                    ) : team.map((member, index) => (
                        <div key={index} className="glass-card flex flex-col items-center text-center group w-full max-w-[320px] min-h-[420px]">
                            <div className="relative mb-6">
                                <div className="absolute inset-0 bg-primary/20 rounded-full blur-xl opacity-0 group-hover:opacity-100 transition-opacity" />
                                <img
                                    src={member.image || 'https://i.pravatar.cc/150?u=' + member.name}
                                    alt={member.name}
                                    className="w-32 h-32 rounded-full border-2 border-primary/30 relative z-10 grayscale hover:grayscale-0 transition-all duration-500 object-cover"
                                    onError={(e) => { e.target.src = 'https://i.pravatar.cc/150?u=' + member.name; }}
                                />
                            </div>
                            <h3 className="text-xl font-bold mb-1">{member.name}</h3>
                            <p className="text-primary text-sm font-medium mb-4">{member.role}</p>
                            <p className="text-slate-600 dark:text-gray-500 text-xs mb-6 px-4 flex-grow">{member.bio}</p>
                            <div className="flex space-x-4 mt-auto">
                                {member.socials?.linkedin && (
                                    <a href={member.socials.linkedin} target="_blank" rel="noopener noreferrer">
                                        <Linkedin size={18} className="text-slate-500 dark:text-gray-400 hover:text-primary transition-colors cursor-pointer" />
                                    </a>
                                )}
                                {member.socials?.twitter && (
                                    <a href={member.socials.twitter} target="_blank" rel="noopener noreferrer">
                                        <Twitter size={18} className="text-slate-500 dark:text-gray-400 hover:text-primary transition-colors cursor-pointer" />
                                    </a>
                                )}
                                {member.socials?.github && (
                                    <a href={member.socials.github} target="_blank" rel="noopener noreferrer">
                                        <Github size={18} className="text-slate-500 dark:text-gray-400 hover:text-primary transition-colors cursor-pointer" />
                                    </a>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default Team;
