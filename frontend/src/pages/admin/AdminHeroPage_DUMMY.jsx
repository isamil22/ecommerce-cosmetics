import React, { useState, useEffect } from 'react';
import { getHeroSection, updateHeroSection } from '../../api/apiService';
import {
    FiLayout, FiImage, FiType, FiLink, FiSave,
    FiRefreshCw, FiCheck, FiX, FiLayers, FiEye
} from 'react-icons/fi';

const AdminHeroPage = () => {
    // Simplified version to test build
    const [heroData, setHeroData] = useState({
        title: '',
        subtitle: '',
        buttonText: '',
        buttonLink: '',
        backgroundImage: '',
        overlayColor: '#000000',
        overlayOpacity: 0.5,
    });
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        fetchHeroData();
    }, []);

    const fetchHeroData = async () => {
        try {
            const response = await getHeroSection();
            if (response.data) {
                setHeroData(response.data);
            }
        } catch (err) {
            console.error(err);
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
            <div className="max-w-7xl mx-auto space-y-8">
                <div className="bg-white rounded-2xl shadow-sm p-8 border border-gray-100">
                    <h1 className="text-3xl font-bold text-gray-900">
                        Gestion de la Section Heros (Test)
                    </h1>
                </div>
            </div>
        </div>
    );
};

export default AdminHeroPage;
