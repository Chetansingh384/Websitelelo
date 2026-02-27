import React, { useState, useEffect } from 'react';
import { db } from '../firebase';
import { collection, query, orderBy, onSnapshot } from 'firebase/firestore';
import { X, ExternalLink, ZoomIn } from 'lucide-react';

// Resolve the correct image URL whether stored as filename or full URL
const resolveImgSrc = (project) => {
    if (project.imageFilename) {
        return `/images/portfolio/${encodeURIComponent(project.imageFilename)}`;
    }
    if (project.imageUrl) {
        // Handle old hardcoded paths like /portfolio/... → /images/portfolio/...
        if (project.imageUrl.startsWith('/portfolio/')) {
            const filename = project.imageUrl.replace('/portfolio/', '');
            return `/images/portfolio/${encodeURIComponent(filename)}`;
        }
        if (project.imageUrl.startsWith('/images/portfolio/')) {
            // Re-encode in case spaces are not encoded
            const filename = decodeURIComponent(project.imageUrl.replace('/images/portfolio/', ''));
            return `/images/portfolio/${encodeURIComponent(filename)}`;
        }
        return project.imageUrl;
    }
    return null;
};

const Portfolio = () => {
    const [projects, setProjects] = useState([]);
    const [selectedProject, setSelectedProject] = useState(null);

    useEffect(() => {
        const q = query(collection(db, 'portfolio'), orderBy('createdAt', 'desc'));
        const unsub = onSnapshot(q, (snap) => {
            const data = snap.docs.map(d => ({ _id: d.id, ...d.data() }));
            setProjects(data);
        });
        return () => unsub();
    }, []);

    return (
        <section id="portfolio" className="py-24 bg-slate-50 dark:bg-dark/50 transition-colors duration-300">
            <div className="container mx-auto px-6">
                <div className="text-center mb-16">
                    <h2 className="text-4xl font-bold mb-4">Our <span className="gradient-text">Recent Work</span></h2>
                    <p className="text-gray-500 dark:text-gray-400">Click on any project to view full screen</p>
                </div>

                {projects.length === 0 ? (
                    <div className="text-center py-20 bg-white/50 dark:bg-white/5 rounded-[3rem] border border-dashed border-gray-200 dark:border-white/10">
                        <p className="text-gray-400 font-medium italic">No work has been added to our portfolio yet. Check back soon!</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
                        {projects.map((project, index) => {
                            const imgSrc = resolveImgSrc(project);
                            return (
                                <div key={project._id || index} className="flex flex-col space-y-4 animate-in fade-in duration-700">
                                    <div
                                        onClick={() => setSelectedProject(project)}
                                        className="group relative cursor-pointer overflow-hidden rounded-[2.5rem] aspect-[4/3] shadow-2xl border border-gray-100 dark:border-white/5 bg-white dark:bg-dark"
                                    >
                                        {imgSrc ? (
                                            <img
                                                src={imgSrc}
                                                alt={project.title}
                                                className="w-full h-full object-cover transition-all duration-700 group-hover:scale-105"
                                                onError={(e) => { e.target.style.display = 'none'; }}
                                            />
                                        ) : (
                                            <div className="w-full h-full flex items-center justify-center text-gray-300 dark:text-gray-700">
                                                <ZoomIn size={40} />
                                            </div>
                                        )}
                                        <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                            <div className="bg-white/20 backdrop-blur-md p-4 rounded-full text-white scale-75 group-hover:scale-100 transition-transform">
                                                <ZoomIn size={32} />
                                            </div>
                                        </div>
                                    </div>

                                    <div className="px-4 min-h-[6rem]">
                                        {project.category && (
                                            <span className="text-primary text-[10px] font-black uppercase tracking-widest">{project.category}</span>
                                        )}
                                        <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-1 mt-1">{project.title}</h3>
                                        <p className="text-sm text-gray-500 dark:text-gray-400 mb-2">{project.description}</p>
                                        {project.projectUrl && (
                                            <a
                                                href={project.projectUrl}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="inline-flex items-center space-x-2 text-primary font-bold hover:text-primary/80 transition-colors group"
                                            >
                                                <span className="text-sm">Visit Live Website</span>
                                                <ExternalLink size={14} className="group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                                            </a>
                                        )}
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )}
            </div>

            {/* Full Screen Lightbox Modal */}
            {selectedProject && (
                <div
                    className="fixed inset-0 z-[100] bg-dark/95 backdrop-blur-xl flex items-center justify-center p-4 md:p-12 animate-in fade-in duration-300"
                    onClick={() => setSelectedProject(null)}
                >
                    <button
                        className="absolute top-8 right-8 text-white/50 hover:text-white transition-colors z-[110]"
                        onClick={() => setSelectedProject(null)}
                    >
                        <X size={48} strokeWidth={1.5} />
                    </button>

                    <div className="relative max-w-7xl w-full h-full flex flex-col items-center justify-center gap-4" onClick={e => e.stopPropagation()}>
                        <img
                            src={resolveImgSrc(selectedProject)}
                            alt={selectedProject.title}
                            className="max-w-full max-h-[80vh] object-contain rounded-xl shadow-2xl animate-in zoom-in-95 duration-500"
                        />
                        {selectedProject.title && (
                            <div className="text-center">
                                <h3 className="text-white text-xl font-bold">{selectedProject.title}</h3>
                                {selectedProject.category && <p className="text-primary text-xs font-black uppercase tracking-widest mt-1">{selectedProject.category}</p>}
                            </div>
                        )}
                    </div>
                </div>
            )}
        </section>
    );
};

export default Portfolio;
