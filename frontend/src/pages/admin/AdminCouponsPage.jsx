// isamil22/ecommerce-basic/ecommerce-basic-de52fb3f9923420c0ceb538f0eea6ad24aa94a25/frontend/src/pages/admin/AdminCouponsPage.jsx
import {
    Button,
    DatePicker,
    Form,
    Input,
    InputNumber,
    Select,
    Table,
    message,
    Popconfirm,
    Switch,
    Card,
    Row,
    Col,
    Statistic,
    Progress,
    Badge,
    Tag,
    Tooltip,
    Space,
    Divider,
    Typography,
    Alert,
    Spin
} from "antd";
import { useEffect, useState } from "react";
import { createCoupon, getAllCoupons as fetchAllCoupons, deleteCoupon, getAllProducts, getAllCategories } from "../../api/apiService";
import dayjs from "dayjs";
import CouponUsageChart from "../../components/CouponUsageChart";
import {
    FiGift,
    FiPlus,
    FiEdit,
    FiTrash2,
    FiEye,
    FiTrendingUp,
    FiUsers,
    FiDollarSign,
    FiPercent,
    FiTruck,
    FiClock,
    FiTarget,
    FiZap,
    FiStar,
    FiShield,
    FiCheckCircle,
    FiAlertCircle,
    FiCalendar,
    FiTag,
    FiPackage,
    FiRefreshCw,
    FiSettings,
    FiMaximize2,
    FiMinimize2,
    FiCopy,
    FiDownload,
    FiUpload,
    FiSave,
    FiSend,
    FiThumbsUp,
    FiThumbsDown,
    FiMessageCircle,
    FiShare2,
    FiBookmark,
    FiFlag,
    FiAlertTriangle,
    FiInfo,
    FiHelpCircle,
    FiExternalLink,
    FiLink,
    FiLock,
    FiUnlock,
    FiKey,
    FiUser,
    FiUserCheck,
    FiUserX,
    FiUserPlus,
    FiBell,
    FiBellOff,
    FiMail,
    FiPhone,
    FiMapPin,
    FiGlobe,
    FiWifi,
    FiWifiOff,
    FiBluetooth,
    FiBattery,
    FiBatteryCharging,
    FiVolume2,
    FiVolumeX,
    FiVolume1,
    FiVolume,
    FiMic,
    FiMicOff,
    FiVideo,
    FiVideoOff,
    FiCamera,
    FiCameraOff,
    FiImage,
    FiMusic,
    FiPlay,
    FiPause,
    FiSkipBack,
    FiSkipForward,
    FiRepeat,
    FiShuffle,
    FiRewind,
    FiFastForward,
    FiRotateCcw,
    FiRotateCw,
    FiCrop,
    FiScissors,
    FiPenTool,
    FiType,
    FiBold,
    FiItalic,
    FiUnderline,
    FiAlignLeft,
    FiAlignCenter,
    FiAlignRight,
    FiAlignJustify,
    FiList,
    FiGrid,
    FiLayers,
    FiSquare,
    FiCircle,
    FiTriangle,
    FiHexagon,
    FiOctagon,
    FiStar as FiStarShape,
    FiHeart as FiHeartShape,
    FiSmile,
    FiFrown,
    FiMeh,
    FiThumbsUp as FiLike,
    FiThumbsDown as FiDislike,
    FiDroplet,
    FiUmbrella,
    FiCloud,
    FiCloudRain,
    FiCloudSnow,
    FiCloudLightning,
    FiCloudOff,
    FiSun as FiSunny,
    FiMoon as FiMoon2,
    FiSunrise,
    FiSunset,
    FiWind as FiWind2,
    FiThermometer,
    FiActivity,
    FiHeart,
    FiX,
    FiAward,
    FiSun,
    FiMoon,
    FiWind,
    FiBarChart,
    FiPieChart
} from "react-icons/fi";

import { useLanguage } from '../../contexts/LanguageContext';

const { Option } = Select;

const { Title, Text, Paragraph } = Typography;

const AdminCouponsPage = () => {
    const { t } = useLanguage();
    const [form] = Form.useForm();
    const [coupons, setCoupons] = useState([]);
    const [loading, setLoading] = useState(false);
    const [refreshing, setRefreshing] = useState(false);
    const [products, setProducts] = useState([]);
    const [categories, setCategories] = useState([]);
    const [showCreateForm, setShowCreateForm] = useState(false);
    const [editingCoupon, setEditingCoupon] = useState(null); // New State for Editing
    const [selectedDiscountType, setSelectedDiscountType] = useState('PERCENTAGE');
    const [previewMode, setPreviewMode] = useState(false);
    const [formData, setFormData] = useState({});
    const [stats, setStats] = useState({
        totalCoupons: 0,
        activeCoupons: 0,
        totalUsage: 0,
        totalSavings: 0
    });

    useEffect(() => {
        getAllCoupons();
        fetchProductsAndCategories();
    }, []);

    useEffect(() => {
        if (coupons.length >= 0) {
            calculateStats();
        }
    }, [coupons]);

    const fetchProductsAndCategories = async () => {
        try {
            const [productsRes, categoriesRes] = await Promise.all([
                getAllProducts({ page: 0, size: 9999, sort: 'name,asc' }),
                getAllCategories(),
            ]);
            setProducts(productsRes.data.content || productsRes.data);
            setCategories(categoriesRes.data);
        } catch (error) {
            message.error("Failed to fetch products or categories.");
            console.error("Error fetching products/categories:", error);
        }
    };

    const getAllCoupons = async () => {
        try {
            setLoading(true);
            const couponsRes = await fetchAllCoupons();
            setCoupons(couponsRes.data);
        } catch (error) {
            message.error(error.response?.data?.message || "Something went wrong fetching coupons!");
        } finally {
            setLoading(false);
        }
    };

    const handleRefresh = async () => {
        if (refreshing) return;

        setRefreshing(true);
        try {
            await getAllCoupons();
            message.success("Coupons refreshed successfully!");
        } catch (error) {
            console.error("Refresh failed:", error);
        } finally {
            setRefreshing(false);
        }
    };

    const calculateStats = () => {
        const now = dayjs();
        const activeCoupons = coupons.filter(coupon =>
            dayjs(coupon.expiryDate).isAfter(now) &&
            (coupon.usageLimit === 0 || coupon.timesUsed < coupon.usageLimit)
        );

        const totalUsage = coupons.reduce((sum, coupon) => sum + (coupon.timesUsed || 0), 0);
        const totalSavings = coupons.reduce((sum, coupon) => {
            if (coupon.discountType === 'FIXED_AMOUNT') {
                return sum + (coupon.discountValue * (coupon.timesUsed || 0));
            } else if (coupon.discountType === 'PERCENTAGE') {
                const avgOrderValue = 50;
                return sum + ((coupon.discountValue / 100) * avgOrderValue * (coupon.timesUsed || 0));
            }
            return sum;
        }, 0);

        setStats({
            totalCoupons: coupons.length,
            activeCoupons: activeCoupons.length,
            totalUsage,
            totalSavings: Math.round(totalSavings * 100) / 100
        });
    };

    // Prepare form for editing
    const handleEdit = (coupon) => {
        setEditingCoupon(coupon);
        setSelectedDiscountType(coupon.discountType);

        form.setFieldsValue({
            ...coupon,
            expiryDate: coupon.expiryDate ? dayjs(coupon.expiryDate) : null,
            // Ensure array fields are handled correctly
            applicableProducts: coupon.applicableProducts ? coupon.applicableProducts.map(p => p.id) : [],
            applicableCategories: coupon.applicableCategories ? coupon.applicableCategories.map(c => c.id) : [],
        });

        setShowCreateForm(true);
    };

    const onFinish = async (values) => {
        try {
            setLoading(true);
            const payload = {
                ...values,
                expiryDate: values.expiryDate ? dayjs(values.expiryDate).toISOString() : null,
                // Ensure we send IDs for relationships if backend expects generic list, 
                // but checking `createCoupon` implementation, it likely expects just IDs or list of objects
                // Ideally, backend DTO should handle basic ID lists if possible, 
                // but if backend DTO expects full objects, we might need mapping.
                // Assuming backend DTO handles the list of IDs if mapped correctly or List<Product> from just IDs?
                // Wait, frontend form sends IDs from Select/MultiSelect. Backend DTO has `List<Product> applicableProducts`.
                // Spring Boot + Jackson often needs ID wrapping `{id: 1}` if strictly typed as Entity list,
                // unless custom deserializer. 
                // Let's assume the previous `create` worked. If it worked before, we keep it same.
                applicableProducts: values.applicableProducts && values.applicableProducts.length > 0 ? values.applicableProducts.map(id => ({ id })) : null,
                applicableCategories: values.applicableCategories && values.applicableCategories.length > 0 ? values.applicableCategories.map(id => ({ id })) : null,
            };

            let res;
            if (editingCoupon) {
                // Update implementation needed in apiService first (assuming Added in previous step)
                const { updateCoupon } = await import("../../api/apiService");
                res = await updateCoupon(editingCoupon.id, payload);
                message.success({
                    content: (
                        <div className="flex items-center space-x-2">
                            <FiCheckCircle className="w-5 h-5 text-green-500" />
                            <span>Coupon "{res.data.name}" updated successfully!</span>
                        </div>
                    ),
                    duration: 4
                });
            } else {
                res = await createCoupon(payload);
                message.success({
                    content: (
                        <div className="flex items-center space-x-2">
                            <FiCheckCircle className="w-5 h-5 text-green-500" />
                            <span>Coupon "{res.data.name}" created successfully!</span>
                        </div>
                    ),
                    duration: 4
                });
            }

            getAllCoupons();
            form.resetFields();
            setShowCreateForm(false);
            setEditingCoupon(null); // Reset editing state
            setPreviewMode(false);
        } catch (error) {
            message.error({
                content: (
                    <div className="flex items-center space-x-2">
                        <FiAlertCircle className="w-5 h-5 text-red-500" />
                        <span>{error.response?.data?.message || `Something went wrong ${editingCoupon ? 'updating' : 'creating'} the coupon!`}</span>
                    </div>
                ),
                duration: 4
            });
        } finally {
            setLoading(false);
        }
    };

    const handleFormChange = (changedValues, allValues) => {
        setFormData(allValues);
        if (changedValues.discountType) {
            setSelectedDiscountType(changedValues.discountType);
        }
    };

    const generateCouponCode = () => {
        const adjectives = ['SUPER', 'MEGA', 'ULTRA', 'EPIC', 'AMAZING', 'FANTASTIC', 'INCREDIBLE', 'WONDERFUL', 'SPECTACULAR', 'PHENOMENAL'];
        const nouns = ['SAVE', 'DEAL', 'OFFER', 'SALE', 'DISCOUNT', 'BONUS', 'GIFT', 'REWARD', 'TREAT', 'PRIZE'];
        const numbers = Math.floor(Math.random() * 100);

        const adjective = adjectives[Math.floor(Math.random() * adjectives.length)];
        const noun = nouns[Math.floor(Math.random() * nouns.length)];

        return `${adjective}${noun}${numbers}`;
    };

    const copyCouponCode = (code) => {
        navigator.clipboard.writeText(code);
        message.success({
            content: (
                <div className="flex items-center space-x-2">
                    <FiCopy className="w-4 h-4 text-blue-500" />
                    <span>Coupon code copied to clipboard!</span>
                </div>
            ),
            duration: 2
        });
    };

    const handleDelete = async (couponId) => {
        try {
            await deleteCoupon(couponId);
            message.success("Coupon deleted successfully!");
            getAllCoupons();
        } catch (error) {
            // Improved Error Handling from Backend
            const errorMsg = error.response?.data?.message || "Failed to delete coupon.";
            message.error(errorMsg);
        }
    };

    const columns = [
        {
            title: (
                <div className="flex items-center space-x-2">
                    <FiTag className="w-4 h-4 text-purple-500" />
                    <span>{t('couponsPage.table.id')}</span>
                </div>
            ),
            dataIndex: "id",
            key: "id",
            sorter: (a, b) => a.id - b.id,
            width: 80,
            render: (id) => (
                <Badge count={id} style={{ backgroundColor: '#8b5cf6' }} />
            )
        },
        {
            title: (
                <div className="flex items-center space-x-2">
                    <FiGift className="w-4 h-4 text-green-500" />
                    <span>{t('couponsPage.table.name')}</span>
                </div>
            ),
            dataIndex: "name",
            key: "name",
            render: (name, record) => (
                <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-blue-500 rounded-xl flex items-center justify-center">
                        <FiGift className="w-5 h-5 text-white" />
                    </div>
                    <div>
                        <div className="font-semibold text-gray-800">{name}</div>
                        <div className="text-sm text-gray-500 font-mono">{record.code}</div>
                    </div>
                </div>
            )
        },
        {
            title: (
                <div className="flex items-center space-x-2">
                    <FiPercent className="w-4 h-4 text-blue-500" />
                    <span>{t('couponsPage.table.discount')}</span>
                </div>
            ),
            key: "discount",
            render: (_, record) => {
                let discountDisplay, icon, color;
                if (record.discountType === 'PERCENTAGE') {
                    discountDisplay = `${record.discountValue}%`;
                    icon = <FiPercent className="w-4 h-4" />;
                    color = 'green';
                } else if (record.discountType === 'FIXED_AMOUNT') {
                    discountDisplay = `$${record.discountValue.toFixed(2)}`;
                    icon = <FiDollarSign className="w-4 h-4" />;
                    color = 'blue';
                } else {
                    discountDisplay = t('couponsPage.form.freeShipping');
                    icon = <FiTruck className="w-4 h-4" />;
                    color = 'purple';
                }
                return (
                    <Tag
                        icon={icon}
                        color={color}
                        className="px-3 py-1 rounded-full text-sm font-semibold"
                    >
                        {discountDisplay}
                    </Tag>
                );
            },
        },
        {
            title: (
                <div className="flex items-center space-x-2">
                    <FiCalendar className="w-4 h-4 text-orange-500" />
                    <span>{t('couponsPage.table.expiry')}</span>
                </div>
            ),
            dataIndex: "expiryDate",
            key: "expiryDate",
            render: (date, record) => {
                const isExpired = dayjs(date).isBefore(dayjs());
                const isExpiringSoon = dayjs(date).isBefore(dayjs().add(7, 'days'));

                return (
                    <div className="flex items-center space-x-2">
                        <div className={`w-3 h-3 rounded-full ${isExpired ? 'bg-red-500' : isExpiringSoon ? 'bg-yellow-500' : 'bg-green-500'}`}></div>
                        <span className={`text-sm ${isExpired ? 'text-red-600' : isExpiringSoon ? 'text-yellow-600' : 'text-gray-600'}`}>
                            {dayjs(date).format("MMM DD, YYYY")}
                        </span>
                    </div>
                );
            },
        },
        {
            title: (
                <div className="flex items-center space-x-2">
                    <FiUsers className="w-4 h-4 text-red-500" />
                    <span>{t('couponsPage.table.usage')}</span>
                </div>
            ),
            key: "usage",
            render: (_, record) => {
                const usagePercent = record.usageLimit > 0 ? (record.timesUsed / record.usageLimit) * 100 : 0;
                const isNearLimit = usagePercent > 80;

                return (
                    <div className="space-y-2">
                        <div className="flex items-center justify-between text-sm">
                            <span className="font-semibold">{record.timesUsed || 0}</span>
                            <span className="text-gray-500">
                                {record.usageLimit === 0 ? '∞' : record.usageLimit}
                            </span>
                        </div>
                        {record.usageLimit > 0 && (
                            <Progress
                                percent={usagePercent}
                                size="small"
                                status={isNearLimit ? 'exception' : 'active'}
                                strokeColor={isNearLimit ? '#ef4444' : '#3b82f6'}
                                className="text-xs"
                            />
                        )}
                    </div>
                );
            },
        },
        {
            title: (
                <div className="flex items-center space-x-2">
                    <FiTarget className="w-4 h-4 text-indigo-500" />
                    <span>{t('couponsPage.table.scope')}</span>
                </div>
            ),
            key: "appliesTo",
            render: (_, record) => {
                const productCount = record.applicableProducts?.length || 0;
                const categoryCount = record.applicableCategories?.length || 0;

                if (productCount === 0 && categoryCount === 0) {
                    return (
                        <Tag color="blue" icon={<FiGlobe className="w-3 h-3" />}>
                            {t('couponsPage.table.allItems')}
                        </Tag>
                    );
                }

                return (
                    <div className="space-y-1">
                        {productCount > 0 && (
                            <Tag color="green" icon={<FiPackage className="w-3 h-3" />}>
                                {productCount} {t('couponsPage.table.products')}
                            </Tag>
                        )}
                        {categoryCount > 0 && (
                            <Tag color="purple" icon={<FiGrid className="w-3 h-3" />}>
                                {categoryCount} {t('couponsPage.table.categories')}
                            </Tag>
                        )}
                    </div>
                );
            },
        },
        {
            title: (
                <div className="flex items-center space-x-2">
                    <FiSettings className="w-4 h-4 text-gray-500" />
                    <span>{t('couponsPage.table.actions')}</span>
                </div>
            ),
            key: "action",
            width: 150,
            render: (_, record) => (
                <Space size="small">
                    <Tooltip title={t('couponsPage.table.copy')}>
                        <Button
                            type="text"
                            icon={<FiCopy className="w-4 h-4" />}
                            onClick={() => copyCouponCode(record.code)}
                            className="hover:bg-blue-50 hover:text-blue-600"
                        />
                    </Tooltip>
                    <Tooltip title={t('couponsPage.table.edit')}>
                        <Button
                            type="text"
                            icon={<FiEdit className="w-4 h-4" />}
                            onClick={() => handleEdit(record)}
                            className="hover:bg-yellow-50 hover:text-yellow-600"
                        />
                    </Tooltip>
                    <Tooltip title={t('couponsPage.table.analytics')}>
                        <Button
                            type="text"
                            icon={<FiBarChart className="w-4 h-4" />}
                            className="hover:bg-green-50 hover:text-green-600"
                        />
                    </Tooltip>
                    <Popconfirm
                        title={t('couponsPage.messages.deleteConfirmTitle')}
                        description={
                            <div>
                                <p>{t('couponsPage.messages.deleteConfirm')}</p>
                                <p className="text-red-600 font-semibold">"{record.name}"</p>
                            </div>
                        }
                        onConfirm={() => handleDelete(record.id)}
                        okText={t('couponsPage.messages.yesDelete')}
                        cancelText={t('couponsPage.form.cancel')}
                        okButtonProps={{ danger: true }}
                        icon={<FiAlertTriangle className="w-4 h-4 text-red-500" />}
                    >
                        <Tooltip title={t('couponsPage.table.delete')}>
                            <Button
                                type="text"
                                icon={<FiTrash2 className="w-4 h-4" />}
                                className="hover:bg-red-50 hover:text-red-600"
                            />
                        </Tooltip>
                    </Popconfirm>
                </Space>
            )
        }
    ];

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
            {/* Header Section */}
            {/* Header Section */}
            <div className="relative overflow-hidden bg-gradient-to-r from-purple-600 via-blue-600 to-indigo-700">
                <div className="absolute inset-0 bg-black opacity-10"></div>
                <div className="relative max-w-7xl mx-auto px-6 py-12">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-6">
                            <div className="relative">
                                <div className="w-20 h-20 bg-white bg-opacity-20 rounded-3xl flex items-center justify-center backdrop-blur-sm border border-white border-opacity-30">
                                    <FiGift className="w-10 h-10 text-white animate-pulse" />
                                </div>
                                <div className="absolute -top-2 -right-2 w-8 h-8 bg-yellow-400 rounded-full flex items-center justify-center animate-bounce">
                                    <FiStar className="w-4 h-4 text-white" />
                                </div>
                            </div>
                            <div>
                                <Title level={1} className="!text-white !mb-2 flex items-center space-x-3">
                                    <span>🎫 {t('couponsPage.title')}</span>
                                    <FiAward className="w-8 h-8 text-yellow-400 animate-pulse" />
                                </Title>
                                <Paragraph className="!text-blue-100 !text-lg !mb-0">
                                    {t('couponsPage.subtitle')}
                                </Paragraph>
                            </div>
                        </div>
                        <div className="flex items-center space-x-4">
                            <Button
                                type="primary"
                                size="large"
                                icon={<FiPlus className="w-5 h-5" />}
                                onClick={() => {
                                    setEditingCoupon(null);
                                    form.resetFields();
                                    setShowCreateForm(true);
                                }}
                                className="bg-gradient-to-r from-pink-500 to-rose-500 border-none hover:from-pink-600 hover:to-rose-600 shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300 rounded-xl px-8 py-4 h-auto"
                            >
                                <span className="text-lg font-semibold">{t('couponsPage.create')}</span>
                            </Button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Stats Section */}
            <div className="max-w-7xl mx-auto px-6 -mt-8 relative z-10">
                <Row gutter={[24, 24]}>
                    <Col xs={24} sm={12} lg={6}>
                        <Card className="bg-white rounded-2xl shadow-xl border-0 hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1">
                            <Statistic
                                title={
                                    <div className="flex items-center space-x-2 text-gray-600">
                                        <FiGift className="w-5 h-5 text-purple-500" />
                                        <span>{t('couponsPage.stats.total')}</span>
                                    </div>
                                }
                                value={stats.totalCoupons}
                                valueStyle={{ color: '#8b5cf6', fontSize: '2rem', fontWeight: 'bold' }}
                                prefix={<FiTrendingUp className="w-6 h-6 text-green-500" />}
                            />
                        </Card>
                    </Col>
                    <Col xs={24} sm={12} lg={6}>
                        <Card className="bg-white rounded-2xl shadow-xl border-0 hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1">
                            <Statistic
                                title={
                                    <div className="flex items-center space-x-2 text-gray-600">
                                        <FiZap className="w-5 h-5 text-green-500" />
                                        <span>{t('couponsPage.stats.active')}</span>
                                    </div>
                                }
                                value={stats.activeCoupons}
                                valueStyle={{ color: '#10b981', fontSize: '2rem', fontWeight: 'bold' }}
                                prefix={<FiActivity className="w-6 h-6 text-green-500" />}
                            />
                        </Card>
                    </Col>
                    <Col xs={24} sm={12} lg={6}>
                        <Card className="bg-white rounded-2xl shadow-xl border-0 hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1">
                            <Statistic
                                title={
                                    <div className="flex items-center space-x-2 text-gray-600">
                                        <FiUsers className="w-5 h-5 text-blue-500" />
                                        <span>{t('couponsPage.stats.usage')}</span>
                                    </div>
                                }
                                value={stats.totalUsage}
                                valueStyle={{ color: '#3b82f6', fontSize: '2rem', fontWeight: 'bold' }}
                                prefix={<FiTarget className="w-6 h-6 text-blue-500" />}
                            />
                        </Card>
                    </Col>
                    <Col xs={24} sm={12} lg={6}>
                        <Card className="bg-white rounded-2xl shadow-xl border-0 hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1">
                            <Statistic
                                title={
                                    <div className="flex items-center space-x-2 text-gray-600">
                                        <FiDollarSign className="w-5 h-5 text-yellow-500" />
                                        <span>{t('couponsPage.stats.savings')}</span>
                                    </div>
                                }
                                value={stats.totalSavings}
                                precision={2}
                                valueStyle={{ color: '#f59e0b', fontSize: '2rem', fontWeight: 'bold' }}
                                prefix={<FiHeart className="w-6 h-6 text-red-500" />}
                            />
                        </Card>
                    </Col>
                </Row>
            </div>

            {/* Main Content */}
            <div className="max-w-7xl mx-auto px-6 py-8">
                {/* Create Form Modal */}
                {showCreateForm && (
                    <Card className="mb-8 bg-white rounded-3xl shadow-2xl border-0 overflow-hidden">
                        <div className="bg-gradient-to-r from-purple-600 to-blue-600 p-8 text-white">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center space-x-4">
                                    <div className="w-16 h-16 bg-white bg-opacity-20 rounded-2xl flex items-center justify-center backdrop-blur-sm">
                                        <FiZap className="w-8 h-8 text-white" />
                                    </div>
                                    <div>
                                        <Title level={2} className="!text-white !mb-2">
                                            {editingCoupon ? t('couponsPage.form.title_edit') : t('couponsPage.form.title_create')}
                                        </Title>
                                        <Text className="text-blue-100 text-lg">
                                            {t('couponsPage.form.subtitle')}
                                        </Text>
                                    </div>
                                </div>
                                <Button
                                    type="text"
                                    icon={<FiX className="w-6 h-6" />}
                                    onClick={() => setShowCreateForm(false)}
                                    className="text-white hover:bg-white hover:bg-opacity-20 rounded-xl"
                                />
                            </div>
                        </div>

                        <div className="p-8">
                            <Form
                                layout="vertical"
                                form={form}
                                onFinish={onFinish}
                                onValuesChange={handleFormChange}
                                className="space-y-6"
                            >
                                <Row gutter={[24, 24]}>
                                    <Col xs={24} lg={12}>
                                        <Form.Item
                                            label={
                                                <div className="flex items-center space-x-2">
                                                    <FiTag className="w-5 h-5 text-purple-500" />
                                                    <span className="text-lg font-semibold">{t('couponsPage.form.name')}</span>
                                                </div>
                                            }
                                            name="name"
                                            rules={[{ required: true, message: 'Please enter coupon name!' }]}
                                        >
                                            <Input
                                                size="large"
                                                placeholder={t('couponsPage.form.namePlaceholder')}
                                                className="rounded-xl border-2 hover:border-purple-300 focus:border-purple-500 transition-colors"
                                            />
                                        </Form.Item>
                                    </Col>
                                    <Col xs={24} lg={12}>
                                        <Form.Item
                                            label={
                                                <div className="flex items-center space-x-2">
                                                    <FiKey className="w-5 h-5 text-blue-500" />
                                                    <span className="text-lg font-semibold">{t('couponsPage.form.code')}</span>
                                                    <Tooltip title={t('couponsPage.form.generate')}>
                                                        <Button
                                                            type="link"
                                                            icon={<FiRefreshCw className="w-4 h-4" />}
                                                            onClick={() => form.setFieldsValue({ code: generateCouponCode() })}
                                                            className="p-0 h-auto"
                                                        />
                                                    </Tooltip>
                                                </div>
                                            }
                                            name="code"
                                            rules={[{ required: true, message: 'Please enter coupon code!' }]}
                                        >
                                            <Input
                                                size="large"
                                                placeholder="e.g., SUMMER2024"
                                                className="rounded-xl border-2 hover:border-blue-300 focus:border-blue-500 transition-colors font-mono text-center"
                                            />
                                        </Form.Item>
                                    </Col>
                                </Row>

                                <Row gutter={[24, 24]}>
                                    <Col xs={24} lg={8}>
                                        <Form.Item
                                            label={
                                                <div className="flex items-center space-x-2">
                                                    <FiPercent className="w-5 h-5 text-green-500" />
                                                    <span className="text-lg font-semibold">{t('couponsPage.form.discountType')}</span>
                                                </div>
                                            }
                                            name="discountType"
                                            rules={[{ required: true, message: 'Please select discount type!' }]}
                                        >
                                            <Select
                                                size="large"
                                                placeholder="Select discount type"
                                                className="rounded-xl"
                                                onChange={(value) => setSelectedDiscountType(value)}
                                            >
                                                <Option value="PERCENTAGE">
                                                    <div className="flex items-center space-x-2">
                                                        <FiPercent className="w-4 h-4 text-green-500" />
                                                        <span>{t('couponsPage.form.percentage')}</span>
                                                    </div>
                                                </Option>
                                                <Option value="FIXED_AMOUNT">
                                                    <div className="flex items-center space-x-2">
                                                        <FiDollarSign className="w-4 h-4 text-blue-500" />
                                                        <span>{t('couponsPage.form.fixed')}</span>
                                                    </div>
                                                </Option>
                                                <Option value="FREE_SHIPPING">
                                                    <div className="flex items-center space-x-2">
                                                        <FiTruck className="w-4 h-4 text-purple-500" />
                                                        <span>{t('couponsPage.form.freeShipping')}</span>
                                                    </div>
                                                </Option>
                                            </Select>
                                        </Form.Item>
                                    </Col>
                                    <Col xs={24} lg={8}>
                                        <Form.Item
                                            label={
                                                <div className="flex items-center space-x-2">
                                                    {selectedDiscountType === 'PERCENTAGE' && <FiPercent className="w-5 h-5 text-green-500" />}
                                                    {selectedDiscountType === 'FIXED_AMOUNT' && <FiDollarSign className="w-5 h-5 text-blue-500" />}
                                                    {selectedDiscountType === 'FREE_SHIPPING' && <FiTruck className="w-5 h-5 text-purple-500" />}
                                                    <span className="text-lg font-semibold">{t('couponsPage.form.discountValue')}</span>
                                                </div>
                                            }
                                            name="discountValue"
                                            rules={[{ required: true, message: 'Please enter discount value!' }]}
                                        >
                                            <InputNumber
                                                size="large"
                                                min={0}
                                                className="w-full rounded-xl border-2 hover:border-green-300 focus:border-green-500 transition-colors"
                                                placeholder={selectedDiscountType === 'PERCENTAGE' ? '25 for 25%' : selectedDiscountType === 'FIXED_AMOUNT' ? '10 for $10' : '0'}
                                                disabled={selectedDiscountType === 'FREE_SHIPPING'}
                                            />
                                        </Form.Item>
                                    </Col>
                                    <Col xs={24} lg={8}>
                                        <Form.Item
                                            label={
                                                <div className="flex items-center space-x-2">
                                                    <FiCalendar className="w-5 h-5 text-orange-500" />
                                                    <span className="text-lg font-semibold">{t('couponsPage.form.expiry')}</span>
                                                </div>
                                            }
                                            name="expiryDate"
                                            rules={[{ required: true, message: 'Please select expiry date!' }]}
                                        >
                                            <DatePicker
                                                size="large"
                                                className="w-full rounded-xl border-2 hover:border-orange-300 focus:border-orange-500 transition-colors"
                                                placeholder="Select expiry date"
                                                showTime
                                                format="YYYY-MM-DD HH:mm"
                                            />
                                        </Form.Item>
                                    </Col>
                                </Row>

                                <Row gutter={[24, 24]}>
                                    <Col xs={24} lg={12}>
                                        <Form.Item
                                            label={
                                                <div className="flex items-center space-x-2">
                                                    <FiDollarSign className="w-5 h-5 text-yellow-500" />
                                                    <span className="text-lg font-semibold">{t('couponsPage.form.minPurchase')}</span>
                                                    <Tooltip title="Leave empty for no minimum">
                                                        <FiInfo className="w-4 h-4 text-gray-400" />
                                                    </Tooltip>
                                                </div>
                                            }
                                            name="minPurchaseAmount"
                                        >
                                            <InputNumber
                                                size="large"
                                                min={0}
                                                className="w-full rounded-xl border-2 hover:border-yellow-300 focus:border-yellow-500 transition-colors"
                                                placeholder="e.g., 50 for $50 minimum"
                                            />
                                        </Form.Item>
                                    </Col>
                                    <Col xs={24} lg={12}>
                                        <Form.Item
                                            label={
                                                <div className="flex items-center space-x-2">
                                                    <FiUsers className="w-5 h-5 text-red-500" />
                                                    <span className="text-lg font-semibold">{t('couponsPage.form.usageLimit')}</span>
                                                    <Tooltip title={t('couponsPage.form.usageLimitHelp')}>
                                                        <FiInfo className="w-4 h-4 text-gray-400" />
                                                    </Tooltip>
                                                </div>
                                            }
                                            name="usageLimit"
                                            rules={[{ required: true, message: 'Please enter usage limit!' }]}
                                        >
                                            <InputNumber
                                                size="large"
                                                min={0}
                                                className="w-full rounded-xl border-2 hover:border-red-300 focus:border-red-500 transition-colors"
                                                placeholder={t('couponsPage.form.usageLimitHelp')}
                                            />
                                        </Form.Item>
                                    </Col>
                                </Row>

                                <Row gutter={[24, 24]}>
                                    <Col xs={24} lg={12}>
                                        <Form.Item
                                            label={
                                                <div className="flex items-center space-x-2">
                                                    <FiPackage className="w-5 h-5 text-indigo-500" />
                                                    <span className="text-lg font-semibold">{t('couponsPage.form.applicableProducts')}</span>
                                                    <Tooltip title={t('couponsPage.form.scopeHelp')}>
                                                        <FiInfo className="w-4 h-4 text-gray-400" />
                                                    </Tooltip>
                                                </div>
                                            }
                                            name="applicableProducts"
                                        >
                                            <Select
                                                mode="multiple"
                                                size="large"
                                                placeholder={t('couponsPage.form.scopeHelp')}
                                                className="rounded-xl"
                                                showSearch
                                                filterOption={(input, option) =>
                                                    (option?.children ?? '').toLowerCase().includes(input.toLowerCase())
                                                }
                                            >
                                                {products.map(product => (
                                                    <Option key={product.id} value={product.id}>
                                                        {product.name}
                                                    </Option>
                                                ))}
                                            </Select>
                                        </Form.Item>
                                    </Col>
                                    <Col xs={24} lg={12}>
                                        <Form.Item
                                            label={
                                                <div className="flex items-center space-x-2">
                                                    <FiGrid className="w-5 h-5 text-teal-500" />
                                                    <span className="text-lg font-semibold">{t('couponsPage.form.applicableCategories')}</span>
                                                    <Tooltip title={t('couponsPage.form.scopeHelp')}>
                                                        <FiInfo className="w-4 h-4 text-gray-400" />
                                                    </Tooltip>
                                                </div>
                                            }
                                            name="applicableCategories"
                                        >
                                            <Select
                                                mode="multiple"
                                                size="large"
                                                placeholder={t('couponsPage.form.scopeHelp')}
                                                className="rounded-xl"
                                                showSearch
                                                filterOption={(input, option) =>
                                                    (option?.children ?? '').toLowerCase().includes(input.toLowerCase())
                                                }
                                            >
                                                {categories.map(category => (
                                                    <Option key={category.id} value={category.id}>
                                                        {category.name}
                                                    </Option>
                                                ))}
                                            </Select>
                                        </Form.Item>
                                    </Col>
                                </Row>

                                <div className="flex items-center justify-between pt-6 border-t border-gray-200">
                                    <Button
                                        size="large"
                                        icon={<FiEye className="w-5 h-5" />}
                                        onClick={() => setPreviewMode(!previewMode)}
                                        className="rounded-xl px-6 py-3 h-auto"
                                    >
                                        {previewMode ? 'Hide Preview' : 'Show Preview'}
                                    </Button>
                                    <Space size="large">
                                        <Button
                                            size="large"
                                            onClick={() => {
                                                setShowCreateForm(false);
                                                form.resetFields();
                                            }}
                                            className="rounded-xl px-8 py-3 h-auto"
                                        >
                                            {t('couponsPage.form.cancel')}
                                        </Button>
                                        <Button
                                            type="primary"
                                            htmlType="submit"
                                            size="large"
                                            loading={loading}
                                            icon={<FiZap className="w-5 h-5" />}
                                            className="bg-gradient-to-r from-purple-600 to-blue-600 border-none hover:from-purple-700 hover:to-blue-700 shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300 rounded-xl px-8 py-3 h-auto"
                                        >
                                            <span className="text-lg font-semibold">
                                                {editingCoupon ? t('couponsPage.form.submit_update') : t('couponsPage.form.submit_create')}
                                            </span>
                                        </Button>
                                    </Space>
                                </div>
                            </Form>
                        </div>
                    </Card>
                )}

                {/* Coupons Table */}
                <Card className="bg-white rounded-3xl shadow-xl border-0 overflow-hidden">
                    <div className="bg-gradient-to-r from-slate-50 to-gray-100 p-6 border-b border-gray-200">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-4">
                                <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl flex items-center justify-center">
                                    <FiBarChart className="w-6 h-6 text-white" />
                                </div>
                                <div>
                                    <Title level={3} className="!mb-1">
                                        {t('couponsPage.title')}
                                    </Title>
                                    <Text className="text-gray-600">
                                        {t('couponsPage.subtitle')}
                                    </Text>
                                </div>
                            </div>
                            <div className="flex items-center space-x-3">
                                <Button
                                    icon={<FiRefreshCw className="w-4 h-4" />}
                                    onClick={handleRefresh}
                                    loading={refreshing}
                                    className="rounded-xl"
                                >
                                    {t('couponsPage.refresh')}
                                </Button>
                            </div>
                        </div>
                    </div>

                    <div className="p-6">
                        <Table
                            columns={columns}
                            dataSource={coupons}
                            rowKey="id"
                            loading={loading}
                            scroll={{ x: true }}
                            className="rounded-xl"
                            pagination={{
                                pageSize: 10,
                                showSizeChanger: true,
                                showQuickJumper: true,
                                showTotal: (total, range) => `${range[0]}-${range[1]} of ${total} coupons`,
                                className: "mt-6"
                            }}
                            expandable={{
                                expandedRowRender: (record) => (
                                    <div className="p-6 bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl">
                                        <div className="flex items-center space-x-3 mb-4">
                                            <FiTrendingUp className="w-6 h-6 text-blue-600" />
                                            <Title level={4} className="!mb-0">
                                                Usage Analytics for: {record.name}
                                            </Title>
                                        </div>
                                        <CouponUsageChart couponId={record.id} />
                                    </div>
                                ),
                                rowExpandable: (record) => record.timesUsed > 0,
                                expandIcon: ({ expanded, onExpand, record }) => (
                                    <Button
                                        type="text"
                                        icon={expanded ? <FiMinimize2 className="w-4 h-4" /> : <FiMaximize2 className="w-4 h-4" />}
                                        onClick={(e) => onExpand(record, e)}
                                        className="hover:bg-blue-50 hover:text-blue-600"
                                    />
                                )
                            }}
                        />
                    </div>
                </Card>
            </div>
        </div>
    );
};

export default AdminCouponsPage;