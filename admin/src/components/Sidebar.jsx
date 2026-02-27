import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { Home, Package, Image, MessageSquare, LogOut } from 'lucide-react';

const Sidebar = () => {
    const navigate = useNavigate();
    const menuItems = [
        { name: 'Overview', path: '/dashboard', icon: <Home size={20} /> },
        { name: 'Plans', path: '/dashboard/plans', icon: <Package size={20} /> },
        { name: 'Portfolio', path: '/dashboard/portfolio', icon: <Image size={20} /> },
        { name: 'Contacts', path: '/dashboard/contacts', icon: <MessageSquare size={20} /> },
    ];

    const handleLogout = () => {
        localStorage.removeItem('adminToken');
        navigate('/login');
    };

    return (
        <div className="w-64 bg-surface h-full flex flex-col border-r border-white/5">
            <div className="p-8">
                <div className="flex items-center space-x-3 mb-2">
                    <img src="/assets/logo.png" alt="Logo" className="w-10 h-10 object-contain drop-shadow-lg" />
                    <div className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary to-secondary">
                        AdminLelo
                    </div>
                </div>
            </div>

            <nav className="flex-grow px-4 space-y-2">
                {menuItems.map((item) => (
                    <NavLink
                        key={item.path}
                        to={item.path}
                        end={item.path === '/dashboard'}
                        className={({ isActive }) =>
                            `flex items-center space-x-4 px-4 py-4 rounded-xl transition-all ${isActive ? 'bg-primary text-white shadow-lg shadow-primary/20' : 'text-gray-400 hover:bg-white/5 hover:text-white'
                            }`
                        }
                    >
                        {item.icon}
                        <span className="font-medium">{item.name}</span>
                    </NavLink>
                ))}
            </nav>

            <div className="p-4 border-t border-white/5">
                <button
                    onClick={handleLogout}
                    className="w-full flex items-center space-x-4 px-4 py-4 rounded-xl text-red-400 hover:bg-red-500/10 transition-all"
                >
                    <LogOut size={20} />
                    <span className="font-medium">Logout</span>
                </button>
            </div>
        </div>
    );
};

export default Sidebar;
