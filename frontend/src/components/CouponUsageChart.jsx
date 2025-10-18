import React, { useState, useEffect, useMemo } from 'react';
import { getCouponUsageStatisticsById } from '../api/apiService';
import { DualAxes, Line, Column, Area, Gauge, Radar, Funnel, Heatmap, Pie, Scatter, Rose } from '@ant-design/plots';
import { 
    message, 
    Card, 
    Statistic, 
    Spin, 
    Row, 
    Col, 
    Table, 
    Empty, 
    Button, 
    Select, 
    DatePicker, 
    Space, 
    Progress, 
    Tag, 
    Tooltip, 
    Switch, 
    Badge, 
    Modal, 
    Segmented,
    Typography,
    Divider,
    Alert,
    Affix,
    FloatButton,
    Drawer,
    Tabs,
    Timeline,
    Avatar,
    Rate,
    Slider,
    Input,
    AutoComplete
} from 'antd';
import { 
    RiseOutlined, 
    TrophyOutlined, 
    BarChartOutlined, 
    DownloadOutlined, 
    FilterOutlined,
    ArrowUpOutlined,
    ArrowDownOutlined,
    CalendarOutlined,
    StarOutlined,
    ThunderboltOutlined,
    BulbOutlined,
    RobotOutlined,
    EyeOutlined,
    SoundOutlined,
    CloudDownloadOutlined,
    ShareAltOutlined as ShareIcon,
    LikeOutlined,
    CommentOutlined,
    RetweetOutlined,
    StarOutlined as BookmarkOutlined,
    FlagOutlined,
    BellOutlined,
    SearchOutlined,
    PlusOutlined,
    MinusOutlined,
    ReloadOutlined,
    LoadingOutlined,
    SyncOutlined as SyncIcon,
    RedoOutlined,
    UndoOutlined,
    SaveOutlined,
    EditOutlined,
    DeleteOutlined,
    CopyOutlined,
    ScissorOutlined,
    PrinterOutlined,
    MailOutlined,
    PhoneOutlined,
    MessageOutlined,
    TeamOutlined,
    UserOutlined,
    UsergroupAddOutlined,
    UserAddOutlined,
    UserDeleteOutlined,
    UserSwitchOutlined,
    SafetyOutlined,
    SecurityScanOutlined,
    SafetyOutlined as ShieldOutlined,
    LockOutlined,
    UnlockOutlined,
    KeyOutlined,
    SafetyCertificateOutlined,
    VerifiedOutlined,
    LineChartOutlined,
    AreaChartOutlined,
    DotChartOutlined,
    BarChartOutlined as RoseChartOutlined,
    FireOutlined,
    CrownOutlined,
    StarOutlined as DiamondOutlined,
    HeartOutlined,
    StarOutlined as MagicOutlined,
    StarOutlined as SparklesOutlined
} from '@ant-design/icons';
import dayjs from 'dayjs';

const { Title, Text } = Typography;
const { RangePicker } = DatePicker;
const { TabPane } = Tabs;

const CouponUsageChart = ({ couponId, couponName }) => {
    const [loading, setLoading] = useState(true);
    const [usageData, setUsageData] = useState([]);
    const [selectedChartType, setSelectedChartType] = useState('dualAxes');
    const [dateRange, setDateRange] = useState([dayjs().subtract(30, 'day'), dayjs()]);
    const [showDrawer, setShowDrawer] = useState(false);
    const [aiInsights, setAiInsights] = useState([]);
    const [realTimeMode, setRealTimeMode] = useState(false);
    const [animationSpeed, setAnimationSpeed] = useState(1);
    const [showFullscreen, setShowFullscreen] = useState(false);
    const [selectedMetric, setSelectedMetric] = useState('usage');

    // Chart types configuration
    const chartTypes = [
        { key: 'dualAxes', label: 'Dual Axis', icon: <BarChartOutlined />, color: '#667eea' },
        { key: 'line', label: 'Line Chart', icon: <LineChartOutlined />, color: '#f093fb' },
        { key: 'column', label: 'Column Chart', icon: <BarChartOutlined />, color: '#4facfe' },
        { key: 'area', label: 'Area Chart', icon: <AreaChartOutlined />, color: '#43e97b' },
        { key: 'radar', label: 'Radar Chart', icon: <DotChartOutlined />, color: '#fa709a' },
        { key: 'funnel', label: 'Funnel Chart', icon: <BarChartOutlined />, color: '#ffecd2' },
        { key: 'heatmap', label: 'Heatmap', icon: <BarChartOutlined />, color: '#a8edea' },
        { key: 'pie', label: 'Pie Chart', icon: <BarChartOutlined />, color: '#d299c2' },
        { key: 'scatter', label: 'Scatter Plot', icon: <DotChartOutlined />, color: '#fad0c4' },
        { key: 'rose', label: 'Rose Chart', icon: <RoseChartOutlined />, color: '#ff9a9e' }
    ];

    // Fetch usage data
    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true);
                const data = await getCouponUsageStatisticsById(couponId);
                setUsageData(data || []);
            } catch (error) {
                console.error('Error fetching coupon usage data:', error);
                message.error('Failed to load coupon usage data');
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [couponId]);

    // Generate AI insights
    const generateAIInsights = useMemo(() => {
        if (!usageData || !Array.isArray(usageData) || usageData.length === 0) return [];

        // Validate data structure
        const validData = usageData.filter(item => item && typeof item.count === 'number');
        if (validData.length === 0) return [];

        const totalUsage = validData.reduce((sum, item) => sum + (item.count || 0), 0);
        const avgUsage = totalUsage / validData.length;
        const maxUsage = Math.max(...validData.map(item => item.count || 0));
        const growthRate = validData.length > 1 ? 
            ((validData[validData.length - 1].count - validData[0].count) / validData[0].count) * 100 : 0;

        const insights = [];

        if (growthRate > 20) {
            insights.push({
                type: 'success',
                title: 'Excellent Growth',
                description: `Your coupon shows ${growthRate.toFixed(1)}% growth rate. This indicates strong customer engagement.`,
                icon: <RiseOutlined />
            });
        }

        if (maxUsage > avgUsage * 2) {
            insights.push({
                type: 'info',
                title: 'Peak Performance Detected',
                description: `Your coupon had a peak usage of ${maxUsage} on ${usageData.find(item => item.count === maxUsage)?.date}. Consider analyzing what drove this success.`,
                icon: <TrophyOutlined />
            });
        }

        if (totalUsage > 100) {
            insights.push({
                type: 'warning',
                title: 'High Usage Volume',
                description: `Your coupon has been used ${totalUsage} times. Consider monitoring for potential abuse or creating usage limits.`,
                icon: <BellOutlined />
            });
        }

        return insights;
    }, [usageData]);

    // Calculate analytics
    const analytics = useMemo(() => {
        // Ensure usageData is an array and has data
        if (!usageData || !Array.isArray(usageData) || usageData.length === 0) {
            return {
                totalUses: 0,
                peakUsage: 0,
                averageDaily: 0,
                growthRate: 0,
                consistency: 0,
                engagement: 0
            };
        }

        // Validate that each item has a count property
        const validData = usageData.filter(item => item && typeof item.count === 'number');
        
        if (validData.length === 0) {
            return {
                totalUses: 0,
                peakUsage: 0,
                averageDaily: 0,
                growthRate: 0,
                consistency: 0,
                engagement: 0
            };
        }

        const totalUses = validData.reduce((sum, item) => sum + (item.count || 0), 0);
        const peakUsage = Math.max(...validData.map(item => item.count || 0));
        const averageDaily = totalUses / validData.length;
        const growthRate = validData.length > 1 ? 
            ((validData[validData.length - 1].count - validData[0].count) / validData[0].count) * 100 : 0;
        
        // Calculate consistency (lower variance = higher consistency)
        const variance = validData.reduce((sum, item) => sum + Math.pow((item.count || 0) - averageDaily, 2), 0) / validData.length;
        const consistency = Math.max(0, 100 - (variance / averageDaily) * 100);
        
        // Calculate engagement (based on usage frequency and growth)
        const engagement = Math.min(100, (totalUses / 10) + (growthRate / 2));

        return {
            totalUses,
            peakUsage,
            averageDaily,
            growthRate,
            consistency: Math.round(consistency),
            engagement: Math.round(engagement)
        };
    }, [usageData]);

    // Chart configurations
    const chartConfigs = {
        dualAxes: {
            xField: 'date',
            yField: ['count'],
            data: usageData,
            geometryOptions: [
                {
                    geometry: 'column',
                    color: '#667eea'
                }
            ]
        },
        line: {
            xField: 'date',
            yField: 'count',
            data: usageData,
            smooth: true,
            color: '#f093fb'
        },
        column: {
            xField: 'date',
            yField: 'count',
            data: usageData,
            color: '#4facfe'
        },
        area: {
            xField: 'date',
            yField: 'count',
            data: usageData,
            smooth: true,
            color: '#43e97b'
        },
        radar: {
            xField: 'date',
            yField: 'count',
            data: usageData,
            color: '#fa709a'
        },
        funnel: {
            xField: 'date',
            yField: 'count',
            data: usageData,
            color: '#ffecd2'
        },
        heatmap: {
            xField: 'date',
            yField: 'count',
            data: usageData,
            color: '#a8edea'
        },
        pie: {
            angleField: 'count',
            colorField: 'date',
            data: usageData,
            color: '#d299c2'
        },
        scatter: {
            xField: 'date',
            yField: 'count',
            data: usageData,
            color: '#fad0c4'
        },
        rose: {
            xField: 'date',
            yField: 'count',
            data: usageData,
            color: '#ff9a9e'
        }
    };

    // Render chart based on selected type
    const renderChart = () => {
        if (!usageData || !Array.isArray(usageData) || usageData.length === 0) {
            return <Empty description="No usage data available" />;
        }

        // Validate data structure for charts
        const validData = usageData.filter(item => item && typeof item.count === 'number');
        if (validData.length === 0) {
            return <Empty description="No valid usage data available" />;
        }

        const config = chartConfigs[selectedChartType];
        if (!config) return null;

        const commonProps = {
            ...config,
            data: validData,
            animation: {
                appear: {
                    animation: 'path-in',
                    duration: animationSpeed * 1000
                }
            }
        };

        switch (selectedChartType) {
            case 'dualAxes':
                return <DualAxes {...commonProps} />;
            case 'line':
                return <Line {...commonProps} />;
            case 'column':
                return <Column {...commonProps} />;
            case 'area':
                return <Area {...commonProps} />;
            case 'radar':
                return <Radar {...commonProps} />;
            case 'funnel':
                return <Funnel {...commonProps} />;
            case 'heatmap':
                return <Heatmap {...commonProps} />;
            case 'pie':
                return <Pie {...commonProps} />;
            case 'scatter':
                return <Scatter {...commonProps} />;
            case 'rose':
                return <Rose {...commonProps} />;
            default:
                return <DualAxes {...commonProps} />;
        }
    };

    // Table columns
    const columns = [
        {
            title: 'Date',
            dataIndex: 'date',
            key: 'date',
            render: (date) => dayjs(date).format('MMM DD, YYYY')
        },
        {
            title: 'Usage Count',
            dataIndex: 'count',
            key: 'count',
            render: (count) => (
                <Badge count={count} style={{ backgroundColor: '#52c41a' }} />
            )
        },
        {
            title: 'Cumulative Usage',
            key: 'cumulative',
            render: (_, record, index) => {
                if (!usageData || !Array.isArray(usageData)) return <Progress percent={0} size="small" strokeColor="#52c41a" />;
                const validData = usageData.filter(item => item && typeof item.count === 'number');
                const cumulative = validData.slice(0, index + 1).reduce((sum, item) => sum + (item.count || 0), 0);
                return (
                    <Progress 
                        percent={analytics.totalUses > 0 ? Math.round((cumulative / analytics.totalUses) * 100) : 0} 
                        size="small" 
                        strokeColor="#52c41a"
                    />
                );
            }
        }
    ];

    if (loading) {
        return (
            <div style={{ textAlign: 'center', padding: '50px' }}>
                <Spin size="large" />
                <div style={{ marginTop: '16px' }}>Loading coupon usage data...</div>
            </div>
        );
    }

    return (
        <div style={{ 
            padding: '24px', 
            background: 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)',
            minHeight: '100vh',
            position: 'relative'
        }}>
            {/* Header */}
            <Card style={{
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                color: 'white',
                marginBottom: '24px',
                borderRadius: '20px',
                border: 'none'
            }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div>
                        <Title level={2} style={{ color: 'white', margin: 0 }}>
                            📊 Coupon Usage Analytics
                        </Title>
                        <Text style={{ color: 'rgba(255,255,255,0.8)', fontSize: '16px' }}>
                            {couponName} - Advanced Analytics Dashboard
                        </Text>
                    </div>
                    <Space>
                        <Button 
                            type="primary" 
                            icon={<RobotOutlined />}
                            onClick={() => setShowDrawer(true)}
                            style={{ background: 'rgba(255,255,255,0.2)', border: '1px solid rgba(255,255,255,0.3)' }}
                        >
                            AI Insights
                        </Button>
                        <Button 
                            type="primary" 
                            icon={<DownloadOutlined />}
                            style={{ background: 'rgba(255,255,255,0.2)', border: '1px solid rgba(255,255,255,0.3)' }}
                        >
                            Export
                        </Button>
                    </Space>
                </div>
            </Card>

            {/* Key Metrics */}
            <Row gutter={[16, 16]} style={{ marginBottom: '24px' }}>
                <Col xs={24} sm={12} md={6}>
                    <Card style={{ 
                        background: 'rgba(255, 255, 255, 0.9)',
                        backdropFilter: 'blur(20px)',
                        border: '1px solid rgba(255, 255, 255, 0.3)',
                        borderRadius: '20px',
                        textAlign: 'center'
                    }}>
                        <Statistic
                            title="Total Uses"
                            value={analytics.totalUses}
                            prefix={<TrophyOutlined style={{ color: '#52c41a' }} />}
                            valueStyle={{ color: '#52c41a' }}
                        />
                    </Card>
                </Col>
                <Col xs={24} sm={12} md={6}>
                    <Card style={{ 
                        background: 'rgba(255, 255, 255, 0.9)',
                        backdropFilter: 'blur(20px)',
                        border: '1px solid rgba(255, 255, 255, 0.3)',
                        borderRadius: '20px',
                        textAlign: 'center'
                    }}>
                        <Statistic
                            title="Peak Usage"
                            value={analytics.peakUsage}
                            prefix={<RiseOutlined style={{ color: '#1890ff' }} />}
                            valueStyle={{ color: '#1890ff' }}
                        />
                    </Card>
                </Col>
                <Col xs={24} sm={12} md={6}>
                    <Card style={{ 
                        background: 'rgba(255, 255, 255, 0.9)',
                        backdropFilter: 'blur(20px)',
                        border: '1px solid rgba(255, 255, 255, 0.3)',
                        borderRadius: '20px',
                        textAlign: 'center'
                    }}>
                        <Statistic
                            title="Average Daily"
                            value={analytics.averageDaily.toFixed(1)}
                            prefix={<BarChartOutlined style={{ color: '#722ed1' }} />}
                            valueStyle={{ color: '#722ed1' }}
                        />
                    </Card>
                </Col>
                <Col xs={24} sm={12} md={6}>
                    <Card style={{ 
                        background: 'rgba(255, 255, 255, 0.9)',
                        backdropFilter: 'blur(20px)',
                        border: '1px solid rgba(255, 255, 255, 0.3)',
                        borderRadius: '20px',
                        textAlign: 'center'
                    }}>
                        <Statistic
                            title="Growth Rate"
                            value={analytics.growthRate.toFixed(1)}
                            suffix="%"
                            prefix={analytics.growthRate > 0 ? <ArrowUpOutlined style={{ color: '#52c41a' }} /> : <ArrowDownOutlined style={{ color: '#ff4d4f' }} />}
                            valueStyle={{ color: analytics.growthRate > 0 ? '#52c41a' : '#ff4d4f' }}
                        />
                    </Card>
                </Col>
            </Row>

            {/* Additional Metrics */}
            <Row gutter={[16, 16]} style={{ marginBottom: '24px' }}>
                <Col xs={24} sm={8}>
                    <Card style={{ 
                        background: 'rgba(255, 255, 255, 0.9)',
                        backdropFilter: 'blur(20px)',
                        border: '1px solid rgba(255, 255, 255, 0.3)',
                        borderRadius: '20px',
                        textAlign: 'center'
                    }}>
                        <Statistic
                            title="Consistency"
                            value={analytics.consistency}
                            suffix="%"
                            prefix={<StarOutlined style={{ color: '#faad14' }} />}
                            valueStyle={{ color: '#faad14' }}
                        />
                    </Card>
                </Col>
                <Col xs={24} sm={8}>
                    <Card style={{ 
                        background: 'rgba(255, 255, 255, 0.9)',
                        backdropFilter: 'blur(20px)',
                        border: '1px solid rgba(255, 255, 255, 0.3)',
                        borderRadius: '20px',
                        textAlign: 'center'
                    }}>
                        <Statistic
                            title="Engagement"
                            value={analytics.engagement}
                            suffix="%"
                            prefix={<HeartOutlined style={{ color: '#eb2f96' }} />}
                            valueStyle={{ color: '#eb2f96' }}
                        />
                    </Card>
                </Col>
                <Col xs={24} sm={8}>
                    <Card style={{ 
                        background: 'rgba(255, 255, 255, 0.9)',
                        backdropFilter: 'blur(20px)',
                        border: '1px solid rgba(255, 255, 255, 0.3)',
                        borderRadius: '20px',
                        textAlign: 'center'
                    }}>
                        <Statistic
                            title="Real-time Status"
                            value={realTimeMode ? "Live" : "Static"}
                            prefix={realTimeMode ? <SyncIcon spin style={{ color: '#52c41a' }} /> : <BellOutlined style={{ color: '#8c8c8c' }} />}
                            valueStyle={{ color: realTimeMode ? '#52c41a' : '#8c8c8c' }}
                        />
                    </Card>
                </Col>
            </Row>

            {/* Chart Controls */}
            <Card style={{ 
                background: 'rgba(255, 255, 255, 0.9)',
                backdropFilter: 'blur(20px)',
                border: '1px solid rgba(255, 255, 255, 0.3)',
                borderRadius: '20px',
                marginBottom: '24px'
            }}>
                <Tabs defaultActiveKey="visualization">
                    <TabPane tab="Visualization" key="visualization">
                        <Row gutter={[16, 16]}>
                            <Col xs={24} md={12}>
                                <div style={{ marginBottom: '16px' }}>
                                    <Text strong>Chart Type:</Text>
                                    <Segmented
                                        options={chartTypes}
                                        value={selectedChartType}
                                        onChange={setSelectedChartType}
                                        style={{ marginTop: '8px' }}
                                    />
                                </div>
                            </Col>
                            <Col xs={24} md={12}>
                                <div style={{ marginBottom: '16px' }}>
                                    <Text strong>Date Range:</Text>
                                    <RangePicker
                                        value={dateRange}
                                        onChange={setDateRange}
                                        style={{ marginTop: '8px', width: '100%' }}
                                    />
                                </div>
                            </Col>
                        </Row>
                        <Row gutter={[16, 16]}>
                            <Col xs={24} md={8}>
                                <div style={{ marginBottom: '16px' }}>
                                    <Text strong>Animation Speed:</Text>
                                    <Slider
                                        min={0.5}
                                        max={3}
                                        step={0.5}
                                        value={animationSpeed}
                                        onChange={setAnimationSpeed}
                                        style={{ marginTop: '8px' }}
                                    />
                                </div>
                            </Col>
                            <Col xs={24} md={8}>
                                <div style={{ marginBottom: '16px' }}>
                                    <Text strong>Real-time Mode:</Text>
                                    <Switch
                                        checked={realTimeMode}
                                        onChange={setRealTimeMode}
                                        style={{ marginTop: '8px' }}
                                    />
                                </div>
                            </Col>
                            <Col xs={24} md={8}>
                                <div style={{ marginBottom: '16px' }}>
                                    <Text strong>Fullscreen:</Text>
                                    <Button
                                        icon={<EyeOutlined />}
                                        onClick={() => setShowFullscreen(!showFullscreen)}
                                        style={{ marginTop: '8px' }}
                                    >
                                        Toggle
                                    </Button>
                                </div>
                            </Col>
                        </Row>
                    </TabPane>
                    <TabPane tab="Filters" key="filters">
                        <Row gutter={[16, 16]}>
                            <Col xs={24} md={12}>
                                <div style={{ marginBottom: '16px' }}>
                                    <Text strong>Metric:</Text>
                                    <Select
                                        value={selectedMetric}
                                        onChange={setSelectedMetric}
                                        style={{ width: '100%', marginTop: '8px' }}
                                        options={[
                                            { value: 'usage', label: 'Usage Count' },
                                            { value: 'growth', label: 'Growth Rate' },
                                            { value: 'consistency', label: 'Consistency' }
                                        ]}
                                    />
                                </div>
                            </Col>
                            <Col xs={24} md={12}>
                                <div style={{ marginBottom: '16px' }}>
                                    <Text strong>Export Format:</Text>
                                    <Select
                                        defaultValue="png"
                                        style={{ width: '100%', marginTop: '8px' }}
                                        options={[
                                            { value: 'png', label: 'PNG Image' },
                                            { value: 'pdf', label: 'PDF Document' },
                                            { value: 'csv', label: 'CSV Data' }
                                        ]}
                                    />
                                </div>
                            </Col>
                        </Row>
                    </TabPane>
                </Tabs>
            </Card>

            {/* Chart Section */}
            <Card style={{ 
                background: 'rgba(255, 255, 255, 0.95)',
                backdropFilter: 'blur(20px)',
                border: '1px solid rgba(255, 255, 255, 0.3)',
                borderRadius: '20px',
                marginBottom: '24px'
            }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                    <Title level={3} style={{ margin: 0 }}>
                        📈 Usage Analytics Chart
                    </Title>
                    <Space>
                        <Button icon={<DownloadOutlined />}>Export</Button>
                        <Button icon={<ShareIcon />}>Share</Button>
                    </Space>
                </div>
                <div style={{ height: '400px' }}>
                    {renderChart()}
                </div>
            </Card>

            {/* Data Table */}
            <Card style={{ 
                background: 'rgba(255, 255, 255, 0.9)',
                backdropFilter: 'blur(20px)',
                border: '1px solid rgba(255, 255, 255, 0.3)',
                borderRadius: '20px'
            }}>
                <Title level={3} style={{ marginBottom: '16px' }}>
                    📋 Detailed Usage Data
                </Title>
                <Table
                    columns={columns}
                    dataSource={usageData && Array.isArray(usageData) ? usageData.filter(item => item && typeof item.count === 'number') : []}
                    rowKey="date"
                    pagination={{ pageSize: 10 }}
                    scroll={{ x: 400 }}
                />
            </Card>

            {/* AI Insights Drawer */}
            <Drawer
                title="🤖 AI-Powered Insights"
                placement="right"
                width={400}
                open={showDrawer}
                onClose={() => setShowDrawer(false)}
            >
                <Timeline>
                    {generateAIInsights.map((insight, index) => (
                        <Timeline.Item
                            key={index}
                            dot={insight.icon}
                            color={insight.type === 'success' ? 'green' : insight.type === 'warning' ? 'orange' : 'blue'}
                        >
                            <Alert
                                message={insight.title}
                                description={insight.description}
                                type={insight.type}
                                showIcon
                                style={{ marginBottom: '16px' }}
                            />
                        </Timeline.Item>
                    ))}
                </Timeline>
            </Drawer>

            {/* Floating Action Buttons */}
            <FloatButton.Group
                trigger="hover"
                type="primary"
                style={{ right: 24 }}
                icon={<PlusOutlined />}
            >
                <FloatButton
                    icon={<EyeOutlined />}
                    tooltip="Fullscreen"
                    onClick={() => setShowFullscreen(!showFullscreen)}
                />
                <FloatButton
                    icon={<SyncIcon />}
                    tooltip="Real-time"
                    onClick={() => setRealTimeMode(!realTimeMode)}
                />
                <FloatButton
                    icon={<RobotOutlined />}
                    tooltip="AI Insights"
                    onClick={() => setShowDrawer(true)}
                />
            </FloatButton.Group>
        </div>
    );
};

export default CouponUsageChart;