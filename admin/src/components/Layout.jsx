import React from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';

const Layout = () => {
    return (
        <div className="flex h-screen bg-dark text-white overflow-hidden">
            <Sidebar />
            <div className="flex-grow overflow-y-auto p-10">
                <Outlet />
            </div>
        </div>
    );
};

export default Layout;
