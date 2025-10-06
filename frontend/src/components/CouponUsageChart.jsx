import React, { useState, useEffect, useMemo, useRef } from 'react';
import { getCouponUsageStatisticsById } from '../api/apiService';
import { DualAxes, Line, Column, Area, Gauge } from '@ant-design/plots';
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
    Segmented 
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
    RocketOutlined,
    SettingOutlined,
    ShareAltOutlined,
    FullscreenOutlined,
    SyncOutlined,
    CheckCircleOutlined,
    WarningOutlined,
    LineChartOutlined,
    AreaChartOutlined,
    DotChartOutlined
} from '@ant-design/icons';
import dayjs from 'dayjs';

// ============================================================================
// STYLES AND CONSTANTS
// ============================================================================

const styles = {
    container: {
        padding: '16px',
        background: '#f8fafc',
        minHeight: '400px'
    },
    card: {
        borderRadius: '12px',
        boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
        marginBottom: '16px'
    },
    header: {
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        color: 'white',
        padding: '20px',
        borderRadius: '12px',
        marginBottom: '20px'
    },
    metricCard: {
        textAlign: 'center',
        padding: '20px',
        borderRadius: '12px',
        background: 'white',
        boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)'
    },
    chartContainer: {
        padding: '20px',
        background: 'white',
        borderRadius: '12px',
        boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)'
    },
    trendIndicator: {
        display: 'inline-flex',
        alignItems: 'center',
        gap: '4px',
        fontSize: '12px',
        fontWeight: '600',
        padding: '2px 8px',
        borderRadius: '12px'
    }
};

const chartTypes = [
    { value: 'dual', label: 'Dual Axis', icon: <BarChartOutlined /> },
    { value: 'line', label: 'Line Chart', icon: <LineChartOutlined /> },
    { value: 'column', label: 'Column Chart', icon: <BarChartOutlined /> },
    { value: 'area', label: 'Area Chart', icon: <AreaChartOutlined /> }
];


// ============================================================================
// MAIN COMPONENT
// ============================================================================

const CouponUsageChart = ({ couponId }) => {
    // Core state
    const [usageData, setUsageData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    
    // UI state
    const [chartType, setChartType] = useState('dual');
    const [showAdvanced, setShowAdvanced] = useState(false);
    const [dateRange, setDateRange] = useState([dayjs().subtract(30, 'days'), dayjs()]);
    
    // Refs
    const chartRef = useRef(null);

    // ============================================================================
    // DATA FETCHING
    // ============================================================================
    
    useEffect(() => {
        const fetchUsageData = async () => {
            if (!couponId) return;
            
            try {
                setLoading(true);
                setError(null);
                
                const response = await getCouponUsageStatisticsById(couponId);
                
                if (!response?.data || !Array.isArray(response.data)) {
                    setUsageData([]);
                    return;
                }

                // Process and format data
                const formattedData = response.data
                    .map(item => ({
                        ...item,
                        date: dayjs(item.date).format('YYYY-MM-DD'),
                        count: item.count || 0
                    }))
                    .sort((a, b) => dayjs(a.date).unix() - dayjs(b.date).unix());

                // Calculate cumulative usage
                let cumulative = 0;
                const processedData = formattedData.map(item => {
                    cumulative += item.count;
                    return { ...item, cumulative };
                });

                setUsageData(processedData);
            } catch (err) {
                console.error('Error fetching usage data:', err);
                setError('Failed to load usage data');
                message.error('Failed to load usage data for this coupon');
            } finally {
                setLoading(false);
            }
        };

        fetchUsageData();
    }, [couponId]);

    // ============================================================================
    // ANALYTICS CALCULATION
    // ============================================================================
    
    const analytics = useMemo(() => {
        if (!usageData?.length) {
            return {
                totalUses: 0,
                peakUsage: 0,
                averageUses: 0,
                growthRate: 0,
                trend: 'neutral',
                performanceScore: 0
            };
        }

        const total = usageData.reduce((sum, item) => sum + item.count, 0);
        const peak = Math.max(...usageData.map(item => item.count));
        const average = total / usageData.length;
        
        // Calculate growth rate
        const midPoint = Math.floor(usageData.length / 2);
        const firstHalf = usageData.slice(0, midPoint);
        const secondHalf = usageData.slice(midPoint);
        
        const firstHalfAvg = firstHalf.reduce((sum, item) => sum + item.count, 0) / firstHalf.length;
        const secondHalfAvg = secondHalf.reduce((sum, item) => sum + item.count, 0) / secondHalf.length;
        const growthRate = firstHalfAvg > 0 ? ((secondHalfAvg - firstHalfAvg) / firstHalfAvg) * 100 : 0;
        
        // Calculate performance score
        const performanceScore = Math.min(100, Math.max(0, 
            (total * 0.4) + (peak * 0.3) + (average * 0.2) + (Math.max(0, growthRate) * 0.1)
        ));

        return {
            totalUses: total,
            peakUsage: peak,
            averageUses: average.toFixed(1),
            growthRate: growthRate.toFixed(1),
            trend: growthRate > 5 ? 'positive' : growthRate < -5 ? 'negative' : 'neutral',
            performanceScore: Math.round(performanceScore)
        };
    }, [usageData]);

    // ============================================================================
    // HELPER FUNCTIONS
    // ============================================================================
    
    const getTrendColor = (trend) => {
        switch (trend) {
            case 'positive': return '#52c41a';
            case 'negative': return '#ff4d4f';
            default: return '#8c8c8c';
        }
    };

    const getTrendIcon = (trend) => {
        switch (trend) {
            case 'positive': return <ArrowUpOutlined />;
            case 'negative': return <ArrowDownOutlined />;
            default: return null;
        }
    };

    // ============================================================================
    // RENDER FUNCTIONS
    // ============================================================================
    
    if (loading) {
        return (
            <div style={styles.container}>
                <Card style={styles.card}>
                    <div style={{ textAlign: 'center', padding: '40px 0' }}>
                        <Spin size="large" />
                        <p style={{ marginTop: '16px', color: '#666' }}>Loading analytics...</p>
                    </div>
                </Card>
            </div>
        );
    }

    if (error || !usageData?.length) {
        return (
            <div style={styles.container}>
                <Card style={styles.card}>
                    <Empty
                        image={Empty.PRESENTED_IMAGE_SIMPLE}
                        description="No usage data available for this coupon"
                    />
                </Card>
            </div>
        );
    }

    // ============================================================================
    // CHART CONFIGURATIONS
    // ============================================================================
    
    const chartConfigs = {
        dual: {
            data: [usageData, usageData],
            xField: 'date',
            yField: ['count', 'cumulative'],
            geometryOptions: [
                {
                    geometry: 'column',
                    color: '#667eea',
                    columnStyle: { radius: [4, 4, 0, 0] }
                },
                {
                    geometry: 'line',
                    color: '#52c41a',
                    lineStyle: { lineWidth: 3 }
                }
            ],
            xAxis: { tickCount: 5 },
            yAxis: {
                count: { title: { text: 'Daily Usage' } },
                cumulative: { title: { text: 'Total Usage' } }
            }
        },
        line: {
            data: usageData,
            xField: 'date',
            yField: 'count',
            smooth: true,
            color: '#667eea',
            lineStyle: { lineWidth: 3 },
            point: { size: 4, shape: 'circle' }
        },
        column: {
            data: usageData,
            xField: 'date',
            yField: 'count',
            color: '#667eea',
            columnStyle: { radius: [4, 4, 0, 0] }
        },
        area: {
            data: usageData,
            xField: 'date',
            yField: 'count',
            smooth: true,
            color: '#667eea',
            areaStyle: { fillOpacity: 0.6 }
        }
    };

    // ============================================================================
    // CHART RENDERING
    // ============================================================================
    
    const renderChart = () => {
        const config = chartConfigs[chartType];
        const commonProps = {
            ...config,
            ref: chartRef,
            style: { height: '300px' }
        };

        switch (chartType) {
            case 'line': return <Line {...commonProps} />;
            case 'column': return <Column {...commonProps} />;
            case 'area': return <Area {...commonProps} />;
            default: return <DualAxes {...commonProps} />;
        }
    };

    // ============================================================================
    // MAIN RENDER
    // ============================================================================
    
    return (
        <div style={styles.container}>
            {/* Header */}
            <div style={styles.header}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                        <ThunderboltOutlined style={{ fontSize: '24px' }} />
                        <div>
                            <h2 style={{ margin: 0, fontSize: '20px', fontWeight: '600' }}>
                                Coupon Analytics
                            </h2>
                            <p style={{ margin: '4px 0 0 0', opacity: 0.9, fontSize: '14px' }}>
                                Usage statistics and performance metrics
                            </p>
                        </div>
                    </div>
                    <Space>
                        <Button 
                            icon={<SettingOutlined />} 
                            type="primary" 
                            ghost
                            size="small"
                            onClick={() => setShowAdvanced(!showAdvanced)}
                        >
                            Settings
                        </Button>
                    </Space>
                </div>
            </div>

            {/* Key Metrics */}
            <Row gutter={[16, 16]} style={{ marginBottom: '20px' }}>
                <Col xs={12} sm={6}>
                    <Card style={styles.metricCard}>
                        <Statistic
                            title="Total Uses"
                            value={analytics.totalUses}
                            prefix={<RiseOutlined />}
                            suffix={
                                <div style={{
                                    ...styles.trendIndicator,
                                    color: getTrendColor(analytics.trend),
                                    background: `${getTrendColor(analytics.trend)}20`
                                }}>
                                    {getTrendIcon(analytics.trend)}
                                    {analytics.growthRate}%
                                </div>
                            }
                        />
                    </Card>
                </Col>
                <Col xs={12} sm={6}>
                    <Card style={styles.metricCard}>
                        <Statistic
                            title="Peak Usage"
                            value={analytics.peakUsage}
                            prefix={<TrophyOutlined />}
                        />
                    </Card>
                </Col>
                <Col xs={12} sm={6}>
                    <Card style={styles.metricCard}>
                        <Statistic
                            title="Average Daily"
                            value={analytics.averageUses}
                            prefix={<BarChartOutlined />}
                        />
                    </Card>
                </Col>
                <Col xs={12} sm={6}>
                    <Card style={styles.metricCard}>
                        <div style={{ textAlign: 'center' }}>
                            <div style={{ fontSize: '16px', color: '#666', marginBottom: '8px' }}>
                                Performance Score
                            </div>
                            <Gauge
                                percent={analytics.performanceScore / 100}
                                range={{ color: '#52c41a' }}
                                indicator={{ pointer: { style: { stroke: '#52c41a' } } }}
                                statistic={{ content: { formatter: () => `${analytics.performanceScore}` } }}
                            />
                        </div>
                    </Card>
                </Col>
            </Row>

            {/* Chart Controls */}
            {showAdvanced && (
                <Card style={styles.card} title="Chart Settings">
                    <Row gutter={[16, 16]}>
                        <Col span={12}>
                            <div style={{ marginBottom: '16px' }}>
                                <label style={{ display: 'block', marginBottom: '8px', fontWeight: '600' }}>
                                    Chart Type
                                </label>
                                <Segmented
                                    options={chartTypes}
                                    value={chartType}
                                    onChange={setChartType}
                                    style={{ width: '100%' }}
                                />
                            </div>
                        </Col>
                        <Col span={12}>
                            <div style={{ marginBottom: '16px' }}>
                                <label style={{ display: 'block', marginBottom: '8px', fontWeight: '600' }}>
                                    Date Range
                                </label>
                                <DatePicker.RangePicker
                                    value={dateRange}
                                    onChange={setDateRange}
                                    style={{ width: '100%' }}
                                />
                            </div>
                        </Col>
                    </Row>
                </Card>
            )}

            {/* Chart Section */}
            <Card style={styles.card} title="Usage Chart">
                <div style={styles.chartContainer}>
                    {renderChart()}
                </div>
            </Card>

            {/* Data Table */}
            <Card style={styles.card} title="Usage Data">
                <Table 
                    columns={[
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
                            render: (count, record, index) => (
                                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                    <span>{count}</span>
                                    {index > 0 && (
                                        <div style={{
                                            ...styles.trendIndicator,
                                            color: count > usageData[index - 1].count ? '#52c41a' : 
                                                   count < usageData[index - 1].count ? '#ff4d4f' : '#8c8c8c',
                                            background: `${count > usageData[index - 1].count ? '#52c41a' : 
                                                       count < usageData[index - 1].count ? '#ff4d4f' : '#8c8c8c'}20`
                                        }}>
                                            {count > usageData[index - 1].count ? <ArrowUpOutlined /> : 
                                             count < usageData[index - 1].count ? <ArrowDownOutlined /> : null}
                                        </div>
                                    )}
                                </div>
                            )
                        },
                        {
                            title: 'Cumulative',
                            dataIndex: 'cumulative',
                            key: 'cumulative',
                            render: (cumulative) => (
                                <Progress 
                                    percent={Math.min(100, (cumulative / analytics.totalUses) * 100)} 
                                    size="small"
                                    showInfo={false}
                                />
                            )
                        }
                    ]} 
                    dataSource={usageData} 
                    rowKey="date" 
                    pagination={{ 
                        pageSize: 10,
                        showSizeChanger: true,
                        showTotal: (total, range) => `${range[0]}-${range[1]} of ${total} records`
                    }}
                />
            </Card>
        </div>
    );
};

export default CouponUsageChart;