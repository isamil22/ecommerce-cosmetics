import React, { useState, useEffect } from 'react';
import AdminLayout from '../../components/AdminLayout';
import { getDiscountSettings, updateDiscountSettings } from '../../api/apiService';

const AdminSettingsPage = () => {
    const [settings, setSettings] = useState({
        highValueThreshold: 500,
        highValueDiscountPercent: 10,
        loyaltyOrderCount: 3,
        loyaltyDiscountPercent: 15
    });
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [message, setMessage] = useState(null);

    useEffect(() => {
        loadSettings();
    }, []);

    const loadSettings = async () => {
        try {
            const response = await getDiscountSettings();
            setSettings(response.data);
            setLoading(false);
        } catch (error) {
            console.error("Failed to load settings", error);
            setLoading(false);
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setSettings(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSaving(true);
        setMessage(null);
        try {
            await updateDiscountSettings(settings);
            setMessage({ type: 'success', text: 'Settings updated successfully!' });
        } catch (error) {
            setMessage({ type: 'error', text: 'Failed to update settings.' });
        } finally {
            setSaving(false);
        }
    };

    return (
        <div className="p-6">
            <div className="admin-page-header">
                <h2>System Settings</h2>
            </div>

            <div className="admin-content-card" style={{ maxWidth: '800px' }}>
                <h3>Confirgure Discount Rules</h3>

                {message && (
                    <div style={{
                        padding: '10px 15px',
                        marginBottom: '20px',
                        borderRadius: '4px',
                        background: message.type === 'success' ? '#dbf6e4' : '#ffebe9',
                        color: message.type === 'success' ? '#1e7e34' : '#c82333'
                    }}>
                        {message.text}
                    </div>
                )}

                <form onSubmit={handleSubmit}>
                    <div style={{ marginBottom: '30px' }}>
                        <h4 style={{ borderBottom: '1px solid #eee', paddingBottom: '10px', marginBottom: '15px' }}>
                            💰 High Value Order Discount
                        </h4>
                        <div className="form-group" style={{ marginBottom: '15px' }}>
                            <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>
                                Minimum Order Amount (MAD)
                            </label>
                            <input
                                type="number"
                                name="highValueThreshold"
                                value={settings.highValueThreshold}
                                onChange={handleChange}
                                className="form-control"
                                style={{ width: '100%', padding: '10px', border: '1px solid #ddd', borderRadius: '4px' }}
                            />
                            <small className="text-muted">Orders above this amount will generate a discount coupon.</small>
                        </div>
                        <div className="form-group">
                            <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>
                                Discount Percentage (%)
                            </label>
                            <input
                                type="number"
                                name="highValueDiscountPercent"
                                value={settings.highValueDiscountPercent}
                                onChange={handleChange}
                                className="form-control"
                                style={{ width: '100%', padding: '10px', border: '1px solid #ddd', borderRadius: '4px' }}
                            />
                        </div>
                    </div>

                    <div style={{ marginBottom: '30px' }}>
                        <h4 style={{ borderBottom: '1px solid #eee', paddingBottom: '10px', marginBottom: '15px' }}>
                            🏆 Customer Loyalty Program
                        </h4>
                        <div className="form-group" style={{ marginBottom: '15px' }}>
                            <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>
                                Reward Every N-th Order
                            </label>
                            <input
                                type="number"
                                name="loyaltyOrderCount"
                                value={settings.loyaltyOrderCount}
                                onChange={handleChange}
                                className="form-control"
                                style={{ width: '100%', padding: '10px', border: '1px solid #ddd', borderRadius: '4px' }}
                            />
                            <small className="text-muted">Example: Set to 3 to reward the 3rd, 6th, 9th order.</small>
                        </div>
                        <div className="form-group">
                            <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>
                                Discount Percentage (%)
                            </label>
                            <input
                                type="number"
                                name="loyaltyDiscountPercent"
                                value={settings.loyaltyDiscountPercent}
                                onChange={handleChange}
                                className="form-control"
                                style={{ width: '100%', padding: '10px', border: '1px solid #ddd', borderRadius: '4px' }}
                            />
                        </div>
                    </div>

                    <button
                        type="submit"
                        disabled={saving}
                        style={{
                            background: '#0a1931',
                            color: 'white',
                            border: 'none',
                            padding: '12px 30px',
                            borderRadius: '4px',
                            cursor: 'pointer',
                            opacity: saving ? 0.7 : 1,
                            fontSize: '1rem'
                        }}
                    >
                        {saving ? 'Saving...' : 'Save Settings'}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default AdminSettingsPage;
