import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { Home, Package, Image, MessageSquare, LogOut, ExternalLink, Users, X, MessageCircle } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

const Sidebar = ({ isOpen, onClose }) => {
    const navigate = useNavigate();
    const { logout } = useAuth();

    const menuItems = [
        { name: 'Overview', path: '/admin/dashboard', icon: <Home size={20} /> },
        { name: 'Plans', path: '/admin/dashboard/plans', icon: <Package size={20} /> },
        { name: 'Portfolio', path: '/admin/dashboard/portfolio', icon: <Image size={20} /> },
        { name: 'Team', path: '/admin/dashboard/team', icon: <Users size={20} /> },
        { name: 'Feedback', path: '/admin/dashboard/testimonials', icon: <MessageCircle size={20} /> },
        { name: 'Contacts', path: '/admin/dashboard/contacts', icon: <MessageSquare size={20} /> },
    ];

    const handleLogout = () => {
        logout();
        navigate('/admin');
    };

    const handleNavClick = () => {
        // Close sidebar on mobile after navigation
        if (onClose) onClose();
    };

    return (
        <>
            {/* Mobile backdrop */}
            {isOpen && (
                <div
                    className="fixed inset-0 bg-black/60 z-40 md:hidden backdrop-blur-sm"
                    onClick={onClose}
                />
            )}

            {/* Sidebar panel */}
            <div className={`
                fixed top-0 left-0 h-full z-50 w-72
                bg-white dark:bg-[#111827]
                border-r border-gray-100 dark:border-white/5
                flex flex-col
                transition-transform duration-300 ease-in-out
                ${isOpen ? 'translate-x-0' : '-translate-x-full'}
                md:translate-x-0 md:static md:w-64 md:z-auto
            `}>
                {/* Logo + close button */}
                <div className="p-6 flex items-start justify-between">
                    <div>
                        <div className="flex items-center space-x-3 mb-1">
                            <img src="/assets/logo.png" alt="Logo" className="w-9 h-9 object-contain drop-shadow-lg" />
                            <div className="text-xl font-bold gradient-text">WebsiteLelo</div>
                        </div>
                        <p className="text-[10px] text-gray-500 uppercase tracking-widest">Management Portal</p>
                    </div>
                    {/* Close button — only visible on mobile */}
                    <button
                        onClick={onClose}
                        className="md:hidden p-2 rounded-xl text-gray-400 hover:text-white hover:bg-white/10 transition-all mt-1"
                    >
                        <X size={20} />
                    </button>
                </div>

                {/* Nav links */}
                <nav className="flex-grow px-4 space-y-1 overflow-y-auto">
                    {menuItems.map((item) => (
                        <NavLink
                            key={item.path}
                            to={item.path}
                            end={item.path === '/admin/dashboard'}
                            onClick={handleNavClick}
                            className={({ isActive }) =>
                                `flex items-center space-x-3 px-4 py-3.5 rounded-xl transition-all text-sm font-medium ${isActive
                                    ? 'bg-primary text-white shadow-lg shadow-primary/20'
                                    : 'text-gray-500 dark:text-gray-400 hover:bg-slate-50 dark:hover:bg-white/5 hover:text-primary dark:hover:text-white'
                                }`
                            }
                        >
                            {item.icon}
                            <span>{item.name}</span>
                        </NavLink>
                    ))}

                    <a
                        href="/"
                        target="_blank"
                        rel="noreferrer"
                        onClick={handleNavClick}
                        className="flex items-center space-x-3 px-4 py-3.5 rounded-xl text-gray-500 dark:text-gray-400 hover:bg-slate-50 dark:hover:bg-white/5 hover:text-primary dark:hover:text-white transition-all mt-4 text-sm font-medium"
                    >
                        <ExternalLink size={20} />
                        <span>View Site</span>
                    </a>
                </nav>

                {/* Logout */}
                <div className="p-4 border-t border-gray-100 dark:border-white/5">
                    <button
                        onClick={handleLogout}
                        className="w-full flex items-center space-x-3 px-4 py-3.5 rounded-xl text-red-500 hover:bg-red-500/10 transition-all font-semibold text-sm"
                    >
                        <LogOut size={20} />
                        <span>Logout</span>
                    </button>
                </div>
            </div>
        </>
    );
};

export default Sidebar;
