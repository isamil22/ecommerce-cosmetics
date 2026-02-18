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
    const [selectedChartType, setSelectedChartType] = useState('area');

    // Debug selectedChartType changes
    useEffect(() => {
        console.log('🎨 CouponUsageChart: selectedChartType changed to:', selectedChartType);
    }, [selectedChartType]);
    const [dateRange, setDateRange] = useState([dayjs().subtract(30, 'day'), dayjs()]);
    const [showDrawer, setShowDrawer] = useState(false);
    const [aiInsights, setAiInsights] = useState([]);
    const [realTimeMode, setRealTimeMode] = useState(false);
    const [animationSpeed, setAnimationSpeed] = useState(1);
    const [showFullscreen, setShowFullscreen] = useState(false);
    const [selectedMetric, setSelectedMetric] = useState('usage');

    // Chart types configuration for Segmented component
    const chartTypes = [
        { value: 'column', label: 'Column Chart', icon: <BarChartOutlined /> },
        { value: 'area', label: 'Area Chart', icon: <AreaChartOutlined /> },
        { value: 'funnel', label: 'Funnel Chart', icon: <BarChartOutlined /> },
        { value: 'heatmap', label: 'Heatmap', icon: <BarChartOutlined /> },
        { value: 'pie', label: 'Pie Chart', icon: <BarChartOutlined /> },
        { value: 'scatter', label: 'Scatter Plot', icon: <DotChartOutlined /> },
        { value: 'rose', label: 'Rose Chart', icon: <RoseChartOutlined /> }
    ];

    // Fetch usage data
    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true);
                console.log(`📊 CouponUsageChart: Fetching data for coupon ID: ${couponId}`);

                const response = await getCouponUsageStatisticsById(couponId);
                const data = response.data || [];

                console.log(`📊 CouponUsageChart: Received raw response:`, response);
                console.log(`📊 CouponUsageChart: Received data:`, data);
                console.log(`📊 CouponUsageChart: Data type:`, typeof data, 'Array?', Array.isArray(data));
                console.log(`📊 CouponUsageChart: Data length:`, data.length);

                // Validate and transform data if needed
                let processedData = [];
                if (Array.isArray(data)) {
                    processedData = data.map(item => {
                        console.log(`📊 CouponUsageChart: Processing item:`, item);
                        // Ensure the data has the expected structure
                        return {
                            date: item.date || item.created_at || new Date().toISOString().split('T')[0],
                            count: item.count || item.usage_count || item.times_used || 0
                        };
                    });
                } else if (data && typeof data === 'object') {
                    // Handle single object response
                    processedData = [{
                        date: data.date || new Date().toISOString().split('T')[0],
                        count: data.count || data.usage_count || data.times_used || 0
                    }];
                }

                console.log(`📊 CouponUsageChart: Processed data:`, processedData);
                setUsageData(processedData);

                if (processedData.length === 0) {
                    console.log('📊 CouponUsageChart: No usage data found for this coupon');
                    message.info('No usage data available for this coupon yet');
                } else {
                    console.log('📊 CouponUsageChart: Successfully loaded usage data');
                }
            } catch (error) {
                console.error('❌ CouponUsageChart: Error fetching coupon usage data:', error);

                // Show more specific error messages
                if (error.response?.status === 403) {
                    message.error('Access denied. You need proper permissions to view usage statistics.');
                } else if (error.response?.status === 404) {
                    message.error('Coupon not found or usage statistics not available.');
                } else if (error.response?.status === 400) {
                    message.error('Invalid request. Please check the coupon ID.');
                } else {
                    message.error(`Failed to load coupon usage data: ${error.message}`);
                }

                setUsageData([]);
            } finally {
                setLoading(false);
            }
        };

        if (couponId) {
            fetchData();
        } else {
            console.log('📊 CouponUsageChart: No coupon ID provided');
            setUsageData([]);
            setLoading(false);
        }
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
            smooth: true,
            color: '#f093fb',
            point: {
                size: 5,
                shape: 'circle'
            }
        },
        column: {
            xField: 'date',
            yField: 'count',
            color: '#4facfe',
            columnWidthRatio: 0.8
        },
        area: {
            xField: 'date',
            yField: 'count',
            smooth: true,
            color: 'l(270) 0:#ffffff 0.5:#7ec2f3 1:#1890ff',
            areaStyle: {
                fill: 'l(270) 0:#ffffff 0.5:#7ec2f3 1:#1890ff',
                fillOpacity: 0.6,
            },
            line: {
                color: '#1890ff',
                size: 2
            },
            point: {
                size: 5,
                shape: 'circle',
                style: {
                    fill: 'white',
                    stroke: '#1890ff',
                    lineWidth: 2,
                },
            },
            tooltip: {
                showMarkers: true,
                customContent: (title, data) => {
                    return (
                        <div style={{ padding: '12px 16px', borderRadius: '12px', background: 'rgba(255,255,255,0.95)', boxShadow: '0 4px 20px rgba(0,0,0,0.1)' }}>
                            <div style={{ fontSize: '14px', color: '#666', marginBottom: '8px' }}>{dayjs(title).format('MMMM DD, YYYY')}</div>
                            {data.map((item, index) => (
                                <div key={index} style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '16px', fontWeight: 'bold', color: '#1890ff' }}>
                                    <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#1890ff' }}></div>
                                    <span>{item.value} Uses</span>
                                </div>
                            ))}
                        </div>
                    );
                }
            },
            slider: {
                start: 0,
                end: 1,
                formatter: (v) => dayjs(usageData[Math.floor(v * (usageData.length - 1))]?.date).format('MMM DD')
            },
            xAxis: {
                range: [0, 1],
                tickCount: 5,
                label: {
                    style: {
                        fill: '#aaa',
                        fontSize: 12
                    }
                },
                grid: {
                    line: {
                        style: {
                            stroke: '#eee',
                            lineDash: [4, 4]
                        }
                    }
                }
            },
            yAxis: {
                label: {
                    style: {
                        fill: '#aaa',
                        fontSize: 12
                    }
                },
                grid: {
                    line: {
                        style: {
                            stroke: '#f0f0f0'
                        }
                    }
                }
            }
        },
        radar: {
            xField: 'date',
            yField: 'count',
            color: '#fa709a',
            point: {
                size: 5
            }
        },
        funnel: {
            xField: 'date',
            yField: 'count',
            color: '#ffecd2',
            dynamicHeight: true
        },
        heatmap: {
            xField: 'date',
            yField: 'count',
            color: '#a8edea',
            cell: {
                style: {
                    stroke: '#fff',
                    lineWidth: 2
                }
            }
        },
        pie: {
            angleField: 'count',
            colorField: 'date',
            color: '#d299c2',
            radius: 0.8,
            label: {
                type: 'inner',
                offset: '-30%',
                content: ({ percent }) => `${(percent * 100).toFixed(0)}%`,
                style: {
                    fontSize: 14,
                    textAlign: 'center'
                }
            }
        },
        scatter: {
            xField: 'date',
            yField: 'count',
            color: '#fad0c4',
            size: 10,
            shape: 'circle'
        },
        rose: {
            xField: 'date',
            yField: 'count',
            color: '#ff9a9e',
            radius: 0.8,
            label: {
                type: 'inner',
                offset: '-30%',
                content: '{count}',
                style: {
                    fontSize: 14,
                    textAlign: 'center'
                }
            }
        }
    };

    // Render chart based on selected type
    const renderChart = () => {
        console.log('🎨 CouponUsageChart: renderChart called');
        console.log('🎨 CouponUsageChart: usageData:', usageData);
        console.log('🎨 CouponUsageChart: selectedChartType:', selectedChartType);

        // Ensure selectedChartType has a valid value
        const chartType = selectedChartType || 'dualAxes';
        console.log('🎨 CouponUsageChart: Using chart type:', chartType);
        console.log('🎨 CouponUsageChart: Available chart types:', chartTypes.map(c => c.value));

        if (!usageData || !Array.isArray(usageData) || usageData.length === 0) {
            console.log('🎨 CouponUsageChart: No usage data, showing empty state');
            return <Empty description="No usage data available" />;
        }

        // Validate data structure for charts
        const validData = usageData.filter(item => item && typeof item.count === 'number');
        console.log('🎨 CouponUsageChart: validData:', validData);

        if (validData.length === 0) {
            console.log('🎨 CouponUsageChart: No valid data, showing empty state');
            return <Empty description="No valid usage data available" />;
        }

        // For single data point, enhance the data to make other chart types work better
        let chartData = validData;
        if (validData.length === 1 && ['line', 'area', 'radar', 'funnel', 'heatmap', 'pie', 'scatter', 'rose'].includes(chartType)) {
            console.log('🎨 CouponUsageChart: Single data point detected, enhancing data for', chartType, 'chart');
            // For single data point, create a simple visualization
            chartData = validData;
        }

        const config = chartConfigs[chartType];
        console.log('🎨 CouponUsageChart: config:', config);
        if (!config) {
            console.log('🎨 CouponUsageChart: No config found for chart type:', chartType);
            return null;
        }

        const commonProps = {
            ...config,
            data: chartData,
            autoFit: true,
            animation: {
                appear: {
                    animation: 'path-in',
                    duration: animationSpeed * 1000
                }
            }
        };

        console.log('🎨 CouponUsageChart: commonProps:', commonProps);

        console.log('🎨 CouponUsageChart: Rendering chart type:', chartType);
        console.log('🎨 CouponUsageChart: Chart data being used:', chartData);

        try {
            // Try to render the chart component
            let chartComponent;
            switch (chartType) {
                case 'dualAxes':
                    console.log('🎨 CouponUsageChart: Rendering DualAxes chart');
                    chartComponent = <DualAxes {...commonProps} />;
                    break;
                case 'line':
                    console.log('🎨 CouponUsageChart: Rendering Line chart');
                    chartComponent = <Line {...commonProps} />;
                    break;
                case 'column':
                    console.log('🎨 CouponUsageChart: Rendering Column chart');
                    chartComponent = <Column {...commonProps} />;
                    break;
                case 'area':
                    console.log('🎨 CouponUsageChart: Rendering Area chart');
                    chartComponent = <Area {...commonProps} />;
                    break;
                case 'radar':
                    console.log('🎨 CouponUsageChart: Rendering Radar chart');
                    chartComponent = <Radar {...commonProps} />;
                    break;
                case 'funnel':
                    console.log('🎨 CouponUsageChart: Rendering Funnel chart');
                    chartComponent = <Funnel {...commonProps} />;
                    break;
                case 'heatmap':
                    console.log('🎨 CouponUsageChart: Rendering Heatmap chart');
                    chartComponent = <Heatmap {...commonProps} />;
                    break;
                case 'pie':
                    console.log('🎨 CouponUsageChart: Rendering Pie chart');
                    chartComponent = <Pie {...commonProps} />;
                    break;
                case 'scatter':
                    console.log('🎨 CouponUsageChart: Rendering Scatter chart');
                    chartComponent = <Scatter {...commonProps} />;
                    break;
                case 'rose':
                    console.log('🎨 CouponUsageChart: Rendering Rose chart');
                    chartComponent = <Rose {...commonProps} />;
                    break;
                default:
                    console.log('🎨 CouponUsageChart: Rendering default DualAxes chart');
                    chartComponent = <DualAxes {...commonProps} />;
                    break;
            }

            console.log('🎨 CouponUsageChart: Chart component created successfully');

            // Add a debug div to verify the component is being rendered
            return (
                <div>
                    <div style={{
                        padding: '10px',
                        background: '#f0f0f0',
                        margin: '10px 0',
                        borderRadius: '4px',
                        fontSize: '12px',
                        color: '#666'
                    }}>
                        🎨 Debug: Rendering {chartType} chart with {chartData.length} data points
                    </div>
                    {chartComponent}
                </div>
            );
        } catch (error) {
            console.error('🎨 CouponUsageChart: Chart rendering error:', error);
            return (
                <div style={{ padding: '20px', textAlign: 'center' }}>
                    <div style={{ marginBottom: '16px', fontSize: '18px', fontWeight: 'bold', color: '#667eea' }}>
                        📊 Usage Data Available
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', alignItems: 'center' }}>
                        {validData.map((item, index) => (
                            <div key={index} style={{
                                display: 'flex',
                                justifyContent: 'space-between',
                                alignItems: 'center',
                                padding: '8px 16px',
                                background: '#f8f9fa',
                                borderRadius: '4px',
                                minWidth: '200px'
                            }}>
                                <span>{new Date(item.date).toLocaleDateString()}</span>
                                <span style={{ fontWeight: 'bold', color: '#667eea' }}>{item.count} uses</span>
                            </div>
                        ))}
                    </div>
                    <div style={{ marginTop: '16px', fontSize: '12px', color: '#666' }}>
                        Chart rendering failed, showing data in table format
                    </div>
                </div>
            );
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
            position: 'relative'
        }}>
            {/* Header */}
            <Card style={{
                background: 'linear-gradient(135deg, #1A2980 0%, #26D0CE 100%)',
                color: 'white',
                marginBottom: '24px',
                borderRadius: '24px',
                border: 'none',
                boxShadow: '0 10px 30px rgba(38, 208, 206, 0.3)'
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
                                        onChange={(value) => {
                                            console.log('🎨 CouponUsageChart: Chart type changed to:', value);
                                            setSelectedChartType(value);
                                        }}
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

            <Card style={{
                background: 'rgba(255, 255, 255, 0.95)',
                backdropFilter: 'blur(20px)',
                border: '1px solid rgba(255, 255, 255, 0.3)',
                borderRadius: '20px',
                marginBottom: '24px'
            }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                    <Title level={3} style={{ margin: 0 }}>
                        Usage Analytics Chart
                    </Title>
                    <Space>
                        <Button icon={<DownloadOutlined />}>Export</Button>
                        <Button icon={<ShareIcon />}>Share</Button>
                    </Space>
                </div>
                <div style={{ height: '400px', width: '100%' }}>
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