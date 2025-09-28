import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
    getPackById, 
    getAllProducts, 
    getAllPacks, 
    updatePackRecommendations,
    updatePackProductRecommendations,
    updatePackPackRecommendations
} from '../../api/apiService';
import Loader from '../../components/Loader';
import { toast } from 'react-toastify';

const AdminPackRecommendationsPage = () => {
    const { packId } = useParams();
    const navigate = useNavigate();
    
    const [pack, setPack] = useState(null);
    const [allProducts, setAllProducts] = useState([]);
    const [allPacks, setAllPacks] = useState([]);
    const [selectedProductIds, setSelectedProductIds] = useState([]);
    const [selectedPackIds, setSelectedPackIds] = useState([]);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        fetchData();
    }, [packId]);

    const fetchData = async () => {
        try {
            setLoading(true);
            
            // Fetch pack details
            const packResponse = await getPackById(packId);
            const packData = packResponse.data;
            setPack(packData);
            
            // Set current recommendations
            setSelectedProductIds(packData.recommendedProducts?.map(p => p.id) || []);
            setSelectedPackIds(packData.recommendedPacks?.map(p => p.id) || []);
            
            // Fetch all products and packs
            const [productsResponse, packsResponse] = await Promise.all([
                getAllProducts(),
                getAllPacks()
            ]);
            
            setAllProducts(productsResponse.data.content || productsResponse.data || []);
            setAllPacks((packsResponse.data || []).filter(p => p.id !== parseInt(packId)));
            
        } catch (error) {
            console.error('Error fetching data:', error);
            toast.error('Failed to load data');
        } finally {
            setLoading(false);
        }
    };

    const handleProductToggle = (productId) => {
        setSelectedProductIds(prev => 
            prev.includes(productId) 
                ? prev.filter(id => id !== productId)
                : [...prev, productId]
        );
    };

    const handlePackToggle = (packId) => {
        setSelectedPackIds(prev => 
            prev.includes(packId) 
                ? prev.filter(id => id !== packId)
                : [...prev, packId]
        );
    };

    const handleSave = async () => {
        try {
            setSaving(true);
            
            await updatePackRecommendations(packId, {
                productIds: selectedProductIds,
                packIds: selectedPackIds
            });
            
            toast.success('Recommendations updated successfully!');
            navigate('/admin/packs');
            
        } catch (error) {
            console.error('Error saving recommendations:', error);
            toast.error('Failed to save recommendations');
        } finally {
            setSaving(false);
        }
    };

    const filteredProducts = allProducts.filter(product =>
        product.name?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const filteredPacks = allPacks.filter(pack =>
        pack.name?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    if (loading) return <Loader />;

    return (
        <div className="p-6 max-w-6xl mx-auto">
            <div className="flex justify-between items-center mb-6">
                <div>
                    <h1 className="text-3xl font-bold text-gray-800">
                        Manage Recommendations
                    </h1>
                    <p className="text-gray-600 mt-1">
                        Pack: {pack?.name}
                    </p>
                </div>
                <div className="space-x-4">
                    <button
                        onClick={() => navigate('/admin/packs')}
                        className="px-4 py-2 text-gray-600 border border-gray-300 rounded-md hover:bg-gray-50"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={handleSave}
                        disabled={saving}
                        className="px-6 py-2 bg-pink-600 text-white rounded-md hover:bg-pink-700 disabled:opacity-50"
                    >
                        {saving ? 'Saving...' : 'Save Changes'}
                    </button>
                </div>
            </div>

            {/* Search */}
            <div className="mb-6">
                <input
                    type="text"
                    placeholder="Search products and packs..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-pink-500 focus:border-pink-500"
                />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Product Recommendations */}
                <div className="bg-white rounded-lg shadow-md p-6">
                    <h2 className="text-xl font-semibold mb-4 text-gray-800">
                        Product Recommendations ({selectedProductIds.length})
                    </h2>
                    <div className="space-y-3 max-h-96 overflow-y-auto">
                        {filteredProducts.map(product => (
                            <label key={product.id} className="flex items-center p-3 border rounded-lg hover:bg-gray-50 cursor-pointer">
                                <input
                                    type="checkbox"
                                    checked={selectedProductIds.includes(product.id)}
                                    onChange={() => handleProductToggle(product.id)}
                                    className="h-4 w-4 text-pink-600 focus:ring-pink-500 border-gray-300 rounded"
                                />
                                <img
                                    src={product.images?.[0] || 'https://placehold.co/60x60/f3f4f6/9ca3af?text=No+Image'}
                                    alt={product.name}
                                    className="w-12 h-12 object-cover rounded-md mx-3"
                                />
                                <div className="flex-1">
                                    <p className="font-medium text-gray-800">{product.name}</p>
                                    <p className="text-sm text-gray-600">${product.price?.toFixed(2)}</p>
                                </div>
                            </label>
                        ))}
                    </div>
                </div>

                {/* Pack Recommendations */}
                <div className="bg-white rounded-lg shadow-md p-6">
                    <h2 className="text-xl font-semibold mb-4 text-gray-800">
                        Pack Recommendations ({selectedPackIds.length})
                    </h2>
                    <div className="space-y-3 max-h-96 overflow-y-auto">
                        {filteredPacks.map(pack => (
                            <label key={pack.id} className="flex items-center p-3 border rounded-lg hover:bg-gray-50 cursor-pointer">
                                <input
                                    type="checkbox"
                                    checked={selectedPackIds.includes(pack.id)}
                                    onChange={() => handlePackToggle(pack.id)}
                                    className="h-4 w-4 text-pink-600 focus:ring-pink-500 border-gray-300 rounded"
                                />
                                <img
                                    src={pack.imageUrl || 'https://placehold.co/60x60/f3f4f6/9ca3af?text=No+Image'}
                                    alt={pack.name}
                                    className="w-12 h-12 object-cover rounded-md mx-3"
                                />
                                <div className="flex-1">
                                    <p className="font-medium text-gray-800">{pack.name}</p>
                                    <p className="text-sm text-gray-600">${pack.price?.toFixed(2)}</p>
                                </div>
                            </label>
                        ))}
                    </div>
                </div>
            </div>

            {/* Current Recommendations Summary */}
            <div className="mt-8 bg-gray-50 rounded-lg p-6">
                <h3 className="text-lg font-semibold mb-4 text-gray-800">Current Selection Summary</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <p className="font-medium text-gray-700 mb-2">
                            Selected Products ({selectedProductIds.length}):
                        </p>
                        <div className="text-sm text-gray-600">
                            {selectedProductIds.length === 0 ? (
                                <span className="italic">No products selected</span>
                            ) : (
                                allProducts
                                    .filter(p => selectedProductIds.includes(p.id))
                                    .map(p => p.name)
                                    .join(', ')
                            )}
                        </div>
                    </div>
                    <div>
                        <p className="font-medium text-gray-700 mb-2">
                            Selected Packs ({selectedPackIds.length}):
                        </p>
                        <div className="text-sm text-gray-600">
                            {selectedPackIds.length === 0 ? (
                                <span className="italic">No packs selected</span>
                            ) : (
                                allPacks
                                    .filter(p => selectedPackIds.includes(p.id))
                                    .map(p => p.name)
                                    .join(', ')
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AdminPackRecommendationsPage;
