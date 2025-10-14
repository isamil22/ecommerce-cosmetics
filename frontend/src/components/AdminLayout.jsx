import React from 'react';
import { Outlet } from 'react-router-dom';
import DynamicAdminSidebar from './DynamicAdminSidebar';

const AdminLayout = () => {
    return (
        <div className="flex min-h-screen bg-gray-50">
            <DynamicAdminSidebar />
            <main className="flex-1 min-h-screen overflow-x-hidden">
                <Outlet />
            </main>
        </div>
    );
};

export default AdminLayout;