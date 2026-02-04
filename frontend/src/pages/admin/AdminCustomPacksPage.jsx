import { Link } from 'react-router-dom';
import { useLanguage } from '../../contexts/LanguageContext';
import { getAllCustomPacks, deleteCustomPack } from '../../api/apiService';
import Loader from '../../components/Loader';
import { toast } from 'react-toastify';
import { 
    FiPlus, 
    FiEdit3, 
    FiTrash2, 
    FiPackage, 
    FiDollarSign, 
    FiRefreshCw,
    FiTrendingUp,
    FiSettings,
    FiEye,
    FiCheckCircle,
    FiAlertCircle
} from 'react-icons/fi';

const AdminCustomPacksPage = () => {
    const { t } = useLanguage();
    const [customPacks, setCustomPacks] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [hoveredPackId, setHoveredPackId] = useState(null);
    const [deletingPackId, setDeletingPackId] = useState(null);

    const fetchCustomPacks = async () => {
        try {
            const response = await getAllCustomPacks();
            setCustomPacks(response.data || []);
        } catch (err) {
            setError(t('customPacks.fetchFailed'));
            console.error("Fetch Custom Packs Error:", err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchCustomPacks();
    }, []);

    const handleDelete = async (packId) => {
        if (window.confirm(t('customPacks.deleteConfirm'))) {
            setDeletingPackId(packId);
            try {
                await deleteCustomPack(packId);
                toast.success(t('customPacks.deleteSuccess'));
                fetchCustomPacks(); // Refresh the list
            } catch (err) {
                setError(t('customPacks.deleteFailed'));
                toast.error(t('customPacks.deleteFailed'));
            } finally {
                setDeletingPackId(null);
            }
        }
    };

    const handleRefresh = () => {
        setLoading(true);
        fetchCustomPacks();
    };

    if (loading) {
        return <Loader />;
    }

    if (error) {
        return <p className="text-center mt-10 text-red-500">{error}</p>;
    }

    return (
        <div className="p-6 bg-gray-50 min-h-screen">
            {/* Enhanced Header with Animated Icons */}
            <div className="flex justify-between items-center mb-8">
                <div className="flex items-center space-x-4">
                    <div className="relative">
                        <div className="w-12 h-12 bg-gradient-to-r from-pink-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg">
                            <FiPackage className="w-6 h-6 text-white animate-pulse" />
                        </div>
                        <div className="absolute -top-1 -right-1 w-4 h-4 bg-green-500 rounded-full animate-bounce">
                            <FiCheckCircle className="w-3 h-3 text-white" />
                        </div>
                    </div>
                    <div>
                        <h1 className="text-3xl font-bold text-gray-800 flex items-center space-x-2">
                            <span>{t('customPacks.manageTitle')}</span>
                            <FiTrendingUp className="w-6 h-6 text-green-500 animate-pulse" />
                        </h1>
                        <p className="text-gray-600 mt-1">{t('customPacks.manageSubtitle')}</p>
                    </div>
                </div>
                
                <div className="flex items-center space-x-3">
                    >
                        <FiRefreshCw className={`w-4 h-4 group-hover:rotate-180 transition-transform duration-500 ${loading ? 'animate-spin' : ''}`} />
                        <span>{t('customPacks.refresh')}</span>
                    </button>
                    
                    <Link 
                        to="/admin/custom-packs/new" 
                        className="flex items-center space-x-2 bg-gradient-to-r from-pink-600 to-purple-600 text-white py-3 px-6 rounded-lg hover:from-pink-700 hover:to-purple-700 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-1 group"
                    >
                    >
                        <FiPlus className="w-5 h-5 group-hover:rotate-90 transition-transform duration-300" />
                        <span className="font-medium">{t('customPacks.addNew')}</span>
                    </Link>
                </div>
            </div>
            {customPacks.length > 0 ? (
                <div className="grid gap-6">
                    {customPacks.map((pack, index) => (
                        <div 
                            key={pack.id} 
                            className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 border border-gray-100 overflow-hidden group"
                            onMouseEnter={() => setHoveredPackId(pack.id)}
                            onMouseLeave={() => setHoveredPackId(null)}
                            style={{ animationDelay: `${index * 100}ms` }}
                        >
                            <div className="p-6">
                                <div className="flex items-start justify-between">
                                    <div className="flex items-start space-x-4">
                                        <div className="relative">
                                            <div className="w-16 h-16 bg-gradient-to-br from-pink-100 to-purple-100 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                                                <FiPackage className="w-8 h-8 text-pink-600 group-hover:rotate-12 transition-transform duration-300" />
                                            </div>
                                            <div className="absolute -top-2 -right-2 w-6 h-6 bg-green-500 rounded-full flex items-center justify-center animate-pulse">
                                                <FiCheckCircle className="w-3 h-3 text-white" />
                                            </div>
                                        </div>
                                        
                                        <div className="flex-1">
                                            <div className="flex items-center space-x-2 mb-2">
                                                <h2 className="text-xl font-bold text-gray-800 group-hover:text-pink-600 transition-colors duration-300">
                                                    {pack.name}
                                                </h2>
                                                <FiSettings className="w-4 h-4 text-gray-400 group-hover:text-pink-500 transition-colors duration-300" />
                                            </div>
                                            
                                            <div className="flex items-center space-x-4 mb-3">
                                                <div className="flex items-center space-x-2">
                                                    <FiDollarSign className="w-4 h-4 text-green-600" />
                                                    <span className="text-lg font-semibold text-gray-700">
                                                        {pack.pricingType === 'FIXED' ? `$${pack.fixedPrice}` : `${pack.discountRate * 100}% ${t('customPacks.table.discount')}`}
                                                    </span>
                                                </div>
                                                
                                                <div className="flex items-center space-x-2">
                                                    <FiTrendingUp className="w-4 h-4 text-blue-600" />
                                                    <span className="text-sm text-gray-600">
                                                        {pack.pricingType === 'FIXED' ? t('customPacks.table.fixedPrice') : t('customPacks.table.percentageDiscount')}
                                                    </span>
                                                </div>
                                            </div>
                                            
                                            <div className="flex items-center space-x-2 text-sm text-gray-500">
                                                <FiEye className="w-4 h-4" />
                                                <span>{t('customPacks.table.id')}: {pack.id}</span>
                                            </div>
                                        </div>
                                    </div>
                                    
                                    <div className="flex items-center space-x-2">
                                        <Link
                                            to={`/admin/custom-packs/edit/${pack.id}`}
                                            className="flex items-center space-x-2 bg-blue-50 text-blue-600 px-4 py-2 rounded-lg hover:bg-blue-100 transition-all duration-300 group/edit"
                                        >
                                            <FiEdit3 className="w-4 h-4 group-hover/edit:rotate-12 transition-transform duration-300" />
                                            <span className="font-medium">{t('customPacks.table.edit')}</span>
                                        </Link>
                                        
                                        <button
                                            onClick={() => handleDelete(pack.id)}
                                            disabled={deletingPackId === pack.id}
                                            className="flex items-center space-x-2 bg-red-50 text-red-600 px-4 py-2 rounded-lg hover:bg-red-100 transition-all duration-300 group/delete disabled:opacity-50"
                                        >
                                            {deletingPackId === pack.id ? (
                                                <FiRefreshCw className="w-4 h-4 animate-spin" />
                                            ) : (
                                                <FiTrash2 className="w-4 h-4 group-hover/delete:scale-110 transition-transform duration-300" />
                                            )}
                                            <span className="font-medium">
                                                {deletingPackId === pack.id ? t('customPacks.table.deleting') : t('customPacks.table.delete')}
                                            </span>
                                        </button>
                                    </div>
                                </div>
                            </div>
                            
                            {/* Animated bottom border */}
                            <div className="h-1 bg-gradient-to-r from-pink-500 to-purple-600 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left"></div>
                        </div>
                    ))}
                </div>
            ) : (
                <div className="bg-white rounded-xl shadow-lg p-12 text-center">
                    <div className="flex flex-col items-center space-y-4">
                        <div className="w-20 h-20 bg-gradient-to-br from-gray-100 to-gray-200 rounded-full flex items-center justify-center">
                            <FiPackage className="w-10 h-10 text-gray-400" />
                        </div>
                        <div>
                            <h3 className="text-xl font-semibold text-gray-700 mb-2">{t('customPacks.noPacks')}</h3>
                            <p className="text-gray-500 mb-6">{t('customPacks.noPacksDesc')}</p>
                            <Link 
                                to="/admin/custom-packs/new" 
                                className="inline-flex items-center space-x-2 bg-gradient-to-r from-pink-600 to-purple-600 text-white py-3 px-6 rounded-lg hover:from-pink-700 hover:to-purple-700 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-1 group"
                            >
                                <FiPlus className="w-5 h-5 group-hover:rotate-90 transition-transform duration-300" />
                                <span className="font-medium">{t('customPacks.createFirst')}</span>
                            </Link>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AdminCustomPacksPage;