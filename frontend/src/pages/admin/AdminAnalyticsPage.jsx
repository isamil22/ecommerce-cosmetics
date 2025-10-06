import React, { useState, useEffect } from 'react';
import { Card, Row, Col, Statistic, Typography, Spin, Alert, Button, Space, Divider, message } from 'antd';
import { 
    BarChartOutlined, 
    LineChartOutlined, 
    PieChartOutlined,
    TrophyOutlined,
    ArrowUpOutlined,
    UserOutlined,
    DollarOutlined,
    ShoppingCartOutlined,
    ReloadOutlined
} from '@ant-design/icons';
import { getAllCoupons } from '../../api/apiService';

const { Title, Text } = Typography;

const AdminAnalyticsPage = () => {
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);
    const [lastUpdated, setLastUpdated] = useState(null);
    const [coupons, setCoupons] = useState([]);
    const [analytics, setAnalytics] = useState({
        totalCoupons: 0,
        activeCoupons: 0,
        totalUses: 0,
        totalSavings: 0
    });

    const fetchAnalytics = async () => {
        try {
            setLoading(true);
            console.log('🔄 Fetching analytics data...');
            const response = await getAllCoupons();
            const couponsData = response.data || [];
            
            console.log('📊 Raw coupons data:', couponsData);
            setCoupons(couponsData);
            
            // Calculate analytics
            const totalUses = couponsData.reduce((sum, coupon) => sum + (coupon.timesUsed || 0), 0);
            const totalSavings = couponsData.reduce((sum, coupon) => {
                const discountValue = coupon.discountType === 'PERCENTAGE' 
                    ? (coupon.discountValue || 0) 
                    : (coupon.discountValue || 0);
                return sum + (discountValue * (coupon.timesUsed || 0));
            }, 0);
            
            const calculatedAnalytics = {
                totalCoupons: couponsData.length,
                activeCoupons: couponsData.filter(c => c.timesUsed > 0).length,
                totalUses,
                totalSavings
            };
            
            console.log('📈 Calculated analytics:', calculatedAnalytics);
            setAnalytics(calculatedAnalytics);
            setLastUpdated(new Date());
        } catch (error) {
            console.error('❌ Failed to fetch analytics:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchAnalytics();
        
        // Auto-refresh every 30 seconds
        const interval = setInterval(() => {
            fetchAnalytics();
        }, 30000);
        
        return () => clearInterval(interval);
    }, []);

    const handleRefresh = async () => {
        if (refreshing) return;
        
        setRefreshing(true);
        try {
            await fetchAnalytics();
            message.success('Analytics data refreshed successfully!');
        } catch (error) {
            console.error('Refresh failed:', error);
            message.error('Failed to refresh analytics data');
        } finally {
            setRefreshing(false);
        }
    };

    if (loading) {
        return (
            <div style={{ textAlign: 'center', padding: '50px' }}>
                <Spin size="large" />
                <p style={{ marginTop: '20px' }}>Loading Analytics Dashboard...</p>
            </div>
        );
    }

    return (
        <div style={{ padding: '24px' }}>
            <div style={{ marginBottom: '32px', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <div>
                    <Title level={2} style={{ margin: 0, background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
                        📊 Analytics Dashboard
                    </Title>
                    <Text type="secondary" style={{ fontSize: '16px' }}>
                        Comprehensive insights into your coupon performance and business metrics
                    </Text>
                    {lastUpdated && (
                        <Text type="secondary" style={{ fontSize: '12px', display: 'block', marginTop: '4px' }}>
                            Last updated: {lastUpdated.toLocaleTimeString()}
                        </Text>
                    )}
                </div>
                <Button 
                    type="primary" 
                    icon={<ReloadOutlined />}
                    loading={refreshing}
                    onClick={handleRefresh}
                    style={{ 
                        borderRadius: '8px',
                        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                        border: 'none'
                    }}
                >
                    Refresh Data
                </Button>
            </div>

            {/* Key Metrics */}
            <Row gutter={[24, 24]} style={{ marginBottom: '32px' }}>
                <Col xs={24} sm={12} lg={6}>
                    <Card 
                        style={{ 
                            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                            color: 'white',
                            borderRadius: '16px',
                            border: 'none'
                        }}
                    >
                        <Statistic
                            title={<span style={{ color: 'rgba(255,255,255,0.8)' }}>Total Coupons</span>}
                            value={analytics.totalCoupons}
                            prefix={<TrophyOutlined />}
                            valueStyle={{ color: 'white', fontSize: '32px', fontWeight: 'bold' }}
                        />
                    </Card>
                </Col>
                <Col xs={24} sm={12} lg={6}>
                    <Card 
                        style={{ 
                            background: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
                            color: 'white',
                            borderRadius: '16px',
                            border: 'none'
                        }}
                    >
                        <Statistic
                            title={<span style={{ color: 'rgba(255,255,255,0.8)' }}>Active Coupons</span>}
                            value={analytics.activeCoupons}
                            prefix={<ArrowUpOutlined />}
                            valueStyle={{ color: 'white', fontSize: '32px', fontWeight: 'bold' }}
                        />
                    </Card>
                </Col>
                <Col xs={24} sm={12} lg={6}>
                    <Card 
                        style={{ 
                            background: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
                            color: 'white',
                            borderRadius: '16px',
                            border: 'none'
                        }}
                    >
                        <Statistic
                            title={<span style={{ color: 'rgba(255,255,255,0.8)' }}>Total Uses</span>}
                            value={analytics.totalUses}
                            prefix={<UserOutlined />}
                            valueStyle={{ color: 'white', fontSize: '32px', fontWeight: 'bold' }}
                        />
                    </Card>
                </Col>
                <Col xs={24} sm={12} lg={6}>
                    <Card 
                        style={{ 
                            background: 'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)',
                            color: 'white',
                            borderRadius: '16px',
                            border: 'none'
                        }}
                    >
                        <Statistic
                            title={<span style={{ color: 'rgba(255,255,255,0.8)' }}>Total Savings</span>}
                            value={analytics.totalSavings}
                            prefix={<DollarOutlined />}
                            valueStyle={{ color: 'white', fontSize: '32px', fontWeight: 'bold' }}
                        />
                    </Card>
                </Col>
            </Row>

            {/* Analytics Features */}
            <Row gutter={[24, 24]}>
                <Col xs={24} lg={12}>
                    <Card 
                        title={
                            <Space>
                                <BarChartOutlined style={{ color: '#667eea' }} />
                                <span>Coupon Performance</span>
                            </Space>
                        }
                        style={{ borderRadius: '16px', boxShadow: '0 8px 32px rgba(0,0,0,0.1)' }}
                    >
                        <div style={{ textAlign: 'center', padding: '40px 20px' }}>
                            <ShoppingCartOutlined style={{ fontSize: '48px', color: '#667eea', marginBottom: '16px' }} />
                            <Title level={4} style={{ color: '#667eea' }}>Detailed Analytics Available</Title>
                            <Text type="secondary">
                                Click on any coupon in the Coupons page to view detailed usage analytics, 
                                performance metrics, and AI-powered insights.
                            </Text>
                            <div style={{ marginTop: '24px' }}>
                                <Button 
                                    type="primary" 
                                    size="large"
                                    style={{ 
                                        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                                        border: 'none',
                                        borderRadius: '8px'
                                    }}
                                    onClick={() => window.location.href = '/admin/coupons'}
                                >
                                    View Coupons
                                </Button>
                            </div>
                        </div>
                    </Card>
                </Col>
                <Col xs={24} lg={12}>
                    <Card 
                        title={
                            <Space>
                                <LineChartOutlined style={{ color: '#f093fb' }} />
                                <span>Analytics Features</span>
                            </Space>
                        }
                        style={{ borderRadius: '16px', boxShadow: '0 8px 32px rgba(0,0,0,0.1)' }}
                    >
                        <div style={{ padding: '20px 0' }}>
                            <Space direction="vertical" size="large" style={{ width: '100%' }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                                    <BarChartOutlined style={{ color: '#667eea', fontSize: '20px' }} />
                                    <div>
                                        <Text strong>10+ Chart Types</Text>
                                        <br />
                                        <Text type="secondary">Dual-axis, radar, funnel, heatmap, and more</Text>
                                    </div>
                                </div>
                                <Divider style={{ margin: '8px 0' }} />
                                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                                    <PieChartOutlined style={{ color: '#f093fb', fontSize: '20px' }} />
                                    <div>
                                        <Text strong>AI-Powered Insights</Text>
                                        <br />
                                        <Text type="secondary">Smart recommendations and performance analysis</Text>
                                    </div>
                                </div>
                                <Divider style={{ margin: '8px 0' }} />
                                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                                    <ArrowUpOutlined style={{ color: '#4facfe', fontSize: '20px' }} />
                                    <div>
                                        <Text strong>Real-Time Analytics</Text>
                                        <br />
                                        <Text type="secondary">Live updates and performance monitoring</Text>
                                    </div>
                                </div>
                            </Space>
                        </div>
                    </Card>
                </Col>
            </Row>

            {/* Quick Actions */}
            <Card 
                title="Quick Actions"
                style={{ marginTop: '24px', borderRadius: '16px', boxShadow: '0 8px 32px rgba(0,0,0,0.1)' }}
            >
                <Row gutter={[16, 16]}>
                    <Col xs={24} sm={8}>
                        <Button 
                            block 
                            size="large"
                            style={{ 
                                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                                border: 'none',
                                borderRadius: '8px',
                                color: 'white'
                            }}
                            onClick={() => window.location.href = '/admin/coupons'}
                        >
                            Manage Coupons
                        </Button>
                    </Col>
                    <Col xs={24} sm={8}>
                        <Button 
                            block 
                            size="large"
                            style={{ 
                                background: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
                                border: 'none',
                                borderRadius: '8px',
                                color: 'white'
                            }}
                            onClick={() => window.location.href = '/admin/orders'}
                        >
                            View Orders
                        </Button>
                    </Col>
                    <Col xs={24} sm={8}>
                        <Button 
                            block 
                            size="large"
                            style={{ 
                                background: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
                                border: 'none',
                                borderRadius: '8px',
                                color: 'white'
                            }}
                            onClick={() => window.location.href = '/admin/dashboard'}
                        >
                            Dashboard
                        </Button>
                    </Col>
                </Row>
            </Card>
        </div>
    );
};

export default AdminAnalyticsPage;
