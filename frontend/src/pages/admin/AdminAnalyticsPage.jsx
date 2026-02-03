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
import { useLanguage } from '../../contexts/LanguageContext';
import { getAllCoupons, getCouponUsageStatistics } from '../../api/apiService';

const { Title, Text } = Typography;

const AdminAnalyticsPage = () => {
    const { t } = useLanguage();
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
    const [usageStatistics, setUsageStatistics] = useState([]);
    const [usageLoading, setUsageLoading] = useState(false);

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

            // Fetch usage statistics
            await fetchUsageStatistics();
        } catch (error) {
            console.error('❌ Failed to fetch analytics:', error);
        } finally {
            setLoading(false);
        }
    };

    const fetchUsageStatistics = async () => {
        try {
            setUsageLoading(true);
            console.log('🔄 Fetching usage statistics...');
            const response = await getCouponUsageStatistics();
            const data = response.data || [];

            console.log('📊 Usage statistics response:', data);

            // Process and transform the data
            let processedData = [];
            if (Array.isArray(data)) {
                processedData = data.map(item => ({
                    date: item.date || item.created_at || new Date().toISOString().split('T')[0],
                    count: item.count || item.usage_count || item.times_used || 0
                }));
            } else if (data && typeof data === 'object') {
                processedData = [{
                    date: data.date || new Date().toISOString().split('T')[0],
                    count: data.count || data.usage_count || data.times_used || 0
                }];
            }

            console.log('📊 Processed usage statistics:', processedData);
            setUsageStatistics(processedData);
        } catch (error) {
            console.error('❌ Failed to fetch usage statistics:', error);
            setUsageStatistics([]);
        } finally {
            setUsageLoading(false);
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
            message.success(t('analyticsPage.messages.refreshSuccess'));
        } catch (error) {
            console.error('Refresh failed:', error);
            message.error(t('analyticsPage.messages.refreshError'));
        } finally {
            setRefreshing(false);
        }
    };

    if (loading) {
        return (
            <div style={{ textAlign: 'center', padding: '50px' }}>
                <Spin size="large" />
                <p style={{ marginTop: '20px' }}>{t('analyticsPage.loading')}</p>
            </div>
        );
    }

    return (
        <div style={{ padding: '24px' }}>
            <div style={{ marginBottom: '32px', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <div>
                    <Title level={2} style={{ margin: 0, background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
                        📊 {t('analyticsPage.title')}
                    </Title>
                    <Text type="secondary" style={{ fontSize: '16px' }}>
                        {t('analyticsPage.subtitle')}
                    </Text>
                    {lastUpdated && (
                        <Text type="secondary" style={{ fontSize: '12px', display: 'block', marginTop: '4px' }}>
                            {t('analyticsPage.lastUpdated')} {lastUpdated.toLocaleTimeString()}
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
                    {t('analyticsPage.actions.refresh')}
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
                            title={<span style={{ color: 'rgba(255,255,255,0.8)' }}>{t('analyticsPage.stats.totalCoupons')}</span>}
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
                            title={<span style={{ color: 'rgba(255,255,255,0.8)' }}>{t('analyticsPage.stats.activeCoupons')}</span>}
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
                            title={<span style={{ color: 'rgba(255,255,255,0.8)' }}>{t('analyticsPage.stats.totalUses')}</span>}
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
                            title={<span style={{ color: 'rgba(255,255,255,0.8)' }}>{t('analyticsPage.stats.totalSavings')}</span>}
                            value={analytics.totalSavings}
                            prefix={<DollarOutlined />}
                            valueStyle={{ color: 'white', fontSize: '32px', fontWeight: 'bold' }}
                        />
                    </Card>
                </Col>
            </Row>

            {/* Usage Statistics Section */}
            <Row gutter={[24, 24]} style={{ marginBottom: '32px' }}>
                <Col xs={24}>
                    <Card
                        title={
                            <Space>
                                <BarChartOutlined style={{ color: '#667eea' }} />
                                <span>{t('analyticsPage.usage.title')}</span>
                            </Space>
                        }
                        style={{ borderRadius: '16px', boxShadow: '0 8px 32px rgba(0,0,0,0.1)' }}
                        loading={usageLoading}
                    >
                        {usageStatistics.length > 0 ? (
                            <div>
                                <Row gutter={[16, 16]}>
                                    <Col xs={24} md={12}>
                                        <div style={{ textAlign: 'center', padding: '20px' }}>
                                            <Title level={4} style={{ color: '#667eea', marginBottom: '16px' }}>
                                                {t('analyticsPage.usage.dailyTrend')}
                                            </Title>
                                            <div style={{ height: '200px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                                <div>
                                                    <Text style={{ fontSize: '24px', fontWeight: 'bold', color: '#667eea' }}>
                                                        {usageStatistics.reduce((sum, item) => sum + item.count, 0)}
                                                    </Text>
                                                    <br />
                                                    <Text type="secondary">{t('analyticsPage.usage.totalDaily')}</Text>
                                                </div>
                                            </div>
                                        </div>
                                    </Col>
                                    <Col xs={24} md={12}>
                                        <div style={{ textAlign: 'center', padding: '20px' }}>
                                            <Title level={4} style={{ color: '#f093fb', marginBottom: '16px' }}>
                                                {t('analyticsPage.usage.recentActivity')}
                                            </Title>
                                            <div style={{ maxHeight: '200px', overflowY: 'auto' }}>
                                                {usageStatistics.slice(-5).map((item, index) => (
                                                    <div key={index} style={{
                                                        display: 'flex',
                                                        justifyContent: 'space-between',
                                                        alignItems: 'center',
                                                        padding: '8px 0',
                                                        borderBottom: index < 4 ? '1px solid #f0f0f0' : 'none'
                                                    }}>
                                                        <Text>{new Date(item.date).toLocaleDateString()}</Text>
                                                        <Text strong style={{ color: '#667eea' }}>{item.count} {t('analyticsPage.usage.uses')}</Text>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    </Col>
                                </Row>
                            </div>
                        ) : (
                            <div style={{ textAlign: 'center', padding: '40px 20px' }}>
                                <ShoppingCartOutlined style={{ fontSize: '48px', color: '#d9d9d9', marginBottom: '16px' }} />
                                <Title level={4} style={{ color: '#d9d9d9' }}>{t('analyticsPage.usage.noDataTitle')}</Title>
                                <Text type="secondary">
                                    {t('analyticsPage.usage.noDataDesc')}
                                </Text>
                            </div>
                        )}
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
                                <span>{t('analyticsPage.performance.title')}</span>
                            </Space>
                        }
                        style={{ borderRadius: '16px', boxShadow: '0 8px 32px rgba(0,0,0,0.1)' }}
                    >
                        <div style={{ textAlign: 'center', padding: '40px 20px' }}>
                            <ShoppingCartOutlined style={{ fontSize: '48px', color: '#667eea', marginBottom: '16px' }} />
                            <Title level={4} style={{ color: '#667eea' }}>{t('analyticsPage.performance.detailTitle')}</Title>
                            <Text type="secondary">
                                {t('analyticsPage.performance.detailDesc')}
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
                                    {t('analyticsPage.actions.viewCoupons')}
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
                                <span>{t('analyticsPage.features.title')}</span>
                            </Space>
                        }
                        style={{ borderRadius: '16px', boxShadow: '0 8px 32px rgba(0,0,0,0.1)' }}
                    >
                        <div style={{ padding: '20px 0' }}>
                            <Space direction="vertical" size="large" style={{ width: '100%' }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                                    <BarChartOutlined style={{ color: '#667eea', fontSize: '20px' }} />
                                    <div>
                                        <Text strong>{t('analyticsPage.features.chartsTitle')}</Text>
                                        <br />
                                        <Text type="secondary">{t('analyticsPage.features.chartsDesc')}</Text>
                                    </div>
                                </div>
                                <Divider style={{ margin: '8px 0' }} />
                                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                                    <PieChartOutlined style={{ color: '#f093fb', fontSize: '20px' }} />
                                    <div>
                                        <Text strong>{t('analyticsPage.features.aiTitle')}</Text>
                                        <br />
                                        <Text type="secondary">{t('analyticsPage.features.aiDesc')}</Text>
                                    </div>
                                </div>
                                <Divider style={{ margin: '8px 0' }} />
                                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                                    <ArrowUpOutlined style={{ color: '#4facfe', fontSize: '20px' }} />
                                    <div>
                                        <Text strong>{t('analyticsPage.features.realTimeTitle')}</Text>
                                        <br />
                                        <Text type="secondary">{t('analyticsPage.features.realTimeDesc')}</Text>
                                    </div>
                                </div>
                            </Space>
                        </div>
                    </Card>
                </Col>
            </Row>

            {/* Quick Actions */}
            <Card
                title={t('analyticsPage.quickActions.title')}
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
                            {t('analyticsPage.actions.manageCoupons')}
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
                            {t('analyticsPage.actions.viewOrders')}
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
                            {t('analyticsPage.actions.dashboard')}
                        </Button>
                    </Col>
                </Row>
            </Card>
        </div>
    );
};

export default AdminAnalyticsPage;
