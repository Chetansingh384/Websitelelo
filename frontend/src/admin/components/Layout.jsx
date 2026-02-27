import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import { Menu } from 'lucide-react';
import Sidebar from './Sidebar';

const AdminLayout = () => {
    const [sidebarOpen, setSidebarOpen] = useState(false);

    return (
        <div className="flex h-screen bg-[#0a0f1d] text-white overflow-hidden">
            {/* Sidebar — hidden on mobile until toggled */}
            <div className="hidden md:flex flex-shrink-0">
                <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
            </div>

            {/* Mobile sidebar (portal-style, rendered outside flex flow) */}
            <div className="md:hidden">
                <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
            </div>

            {/* Main content area */}
            <div className="flex-1 min-w-0 flex flex-col overflow-hidden">
                {/* Mobile top bar */}
                <div className="md:hidden flex items-center justify-between px-4 py-3 bg-[#111827] border-b border-white/5 sticky top-0 z-30">
                    <button
                        onClick={() => setSidebarOpen(true)}
                        className="p-2.5 rounded-xl bg-white/5 hover:bg-white/10 text-gray-300 hover:text-white transition-all"
                        aria-label="Open menu"
                    >
                        <Menu size={22} />
                    </button>
                    <div className="flex items-center space-x-2">
                        <img src="/assets/logo.png" alt="Logo" className="w-7 h-7 object-contain" />
                        <span className="text-base font-bold gradient-text">WebsiteLelo</span>
                    </div>
                    {/* Spacer to balance hamburger */}
                    <div className="w-10" />
                </div>

                {/* Page content */}
                <div className="flex-1 overflow-y-auto p-4 md:p-10">
                    <Outlet />
                </div>
            </div>
        </div>
    );
};

export default AdminLayout;
