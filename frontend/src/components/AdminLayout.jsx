import React, { useEffect, useState } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import DynamicAdminSidebar from './DynamicAdminSidebar';
import { getUserProfile } from '../api/apiService';

const AdminLayout = () => {
    const navigate = useNavigate();
    const [isCheckingAccess, setIsCheckingAccess] = useState(true);
    const [hasAccess, setHasAccess] = useState(false);

    useEffect(() => {
        const checkDashboardAccess = async () => {
            try {
                const response = await getUserProfile();
                if (response.data.hasDashboardAccess) {
                    setHasAccess(true);
                } else {
                    // Redirect to profile page if user doesn't have dashboard access
                    navigate('/profile');
                }
            } catch (error) {
                console.error('Error checking dashboard access:', error);
                // Redirect to login if there's an error (likely not authenticated)
                navigate('/auth');
            } finally {
                setIsCheckingAccess(false);
            }
        };

        checkDashboardAccess();
    }, [navigate]);

    if (isCheckingAccess) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto mb-4"></div>
                    <p className="text-gray-600">Checking access permissions...</p>
                </div>
            </div>
        );
    }

    if (!hasAccess) {
        return null; // Will redirect, so don't render anything
    }

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