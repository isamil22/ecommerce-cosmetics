import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { createCustomPack, getCustomPackById, updateCustomPack, getPackableProducts } from '../../api/apiService';
import { toast } from 'react-toastify';
import Loader from '../../components/Loader';

const AdminCustomPackForm = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        name: '',
        description: '',
        minItems: '',
        maxItems: '',
        pricingType: 'FIXED',
        fixedPrice: '',
        discountRate: '',
        allowedProductIds: []
    });
    const [loading, setLoading] = useState(false);
    const [packableProducts, setPackableProducts] = useState([]);
    const [selectedProducts, setSelectedProducts] = useState([]);
    const isEditing = Boolean(id);

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            try {
                // Always fetch packable products
                const productsResponse = await getPackableProducts();
                setPackableProducts(productsResponse.data);

                // If editing, fetch pack data
                if (isEditing) {
                    const packResponse = await getCustomPackById(id);
                    const packData = packResponse.data;
                    setFormData(packData);
                    setSelectedProducts(packData.allowedProductIds || []);
                }
            } catch (error) {
                toast.error('Failed to fetch data.');
                console.error(error);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, [id, isEditing]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleProductToggle = (productId) => {
        setSelectedProducts(prev => {
            const newSelected = prev.includes(productId)
                ? prev.filter(id => id !== productId)
                : [...prev, productId];
            
            setFormData(prevForm => ({ ...prevForm, allowedProductIds: newSelected }));
            return newSelected;
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const submitData = { ...formData, allowedProductIds: selectedProducts };
            
            if (isEditing) {
                await updateCustomPack(id, submitData);
                toast.success('Custom pack updated successfully!');
            } else {
                await createCustomPack(submitData);
                toast.success('Custom pack created successfully!');
            }
            navigate('/admin/custom-packs');
        } catch (error) {
            toast.error('Failed to save custom pack.');
            console.error(error);
        }
    };

    if (loading) {
        return <Loader />;
    }

    return (
        <div className="p-6">
            <h1 className="text-3xl font-bold mb-6">{isEditing ? 'Edit Custom Pack' : 'Create Custom Pack'}</h1>
            <form onSubmit={handleSubmit} className="space-y-6 max-w-2xl mx-auto bg-white p-8 rounded-lg shadow-md">
                {/* Your form fields remain the same */}
                <div>
                    <label htmlFor="name" className="block text-sm font-medium text-gray-700">Pack Name</label>
                    <input type="text" name="name" id="name" value={formData.name} onChange={handleChange} required className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-pink-500 focus:ring-pink-500" />
                </div>
                <div>
                    <label htmlFor="description" className="block text-sm font-medium text-gray-700">Description</label>
                    <textarea name="description" id="description" value={formData.description} onChange={handleChange} rows="3" required className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-pink-500 focus:ring-pink-500"></textarea>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                        <label htmlFor="minItems" className="block text-sm font-medium text-gray-700">Min Items</label>
                        <input type="number" name="minItems" id="minItems" value={formData.minItems} onChange={handleChange} required className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-pink-500 focus:ring-pink-500" />
                    </div>
                    <div>
                        <label htmlFor="maxItems" className="block text-sm font-medium text-gray-700">Max Items</label>
                        <input type="number" name="maxItems" id="maxItems" value={formData.maxItems} onChange={handleChange} required className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-pink-500 focus:ring-pink-500" />
                    </div>
                </div>
                <div>
                    <label htmlFor="pricingType" className="block text-sm font-medium text-gray-700">Pricing Type</label>
                    <select name="pricingType" id="pricingType" value={formData.pricingType} onChange={handleChange} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-pink-500 focus:ring-pink-500">
                        <option value="FIXED">Fixed Price</option>
                        <option value="DYNAMIC">Dynamic Discount</option>
                    </select>
                </div>
                {formData.pricingType === 'FIXED' ? (
                    <div>
                        <label htmlFor="fixedPrice" className="block text-sm font-medium text-gray-700">Fixed Price</label>
                        <input type="number" step="0.01" name="fixedPrice" id="fixedPrice" value={formData.fixedPrice} onChange={handleChange} required className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-pink-500 focus:ring-pink-500" />
                    </div>
                ) : (
                    <div>
                        <label htmlFor="discountRate" className="block text-sm font-medium text-gray-700">Discount Rate (e.g., 0.20 for 20%)</label>
                        <input type="number" step="0.01" name="discountRate" id="discountRate" value={formData.discountRate} onChange={handleChange} required className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-pink-500 focus:ring-pink-500" />
                    </div>
                )}
                
                {/* Product Selection Section */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-4">
                        Select Products for This Pack (Leave empty to allow all packable products)
                    </label>
                    <div className="max-h-96 overflow-y-auto border border-gray-300 rounded-md p-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                            {packableProducts.map(product => (
                                <div
                                    key={product.id}
                                    onClick={() => handleProductToggle(product.id)}
                                    className={`border-2 p-3 rounded-lg cursor-pointer transition-all duration-200 ${
                                        selectedProducts.includes(product.id)
                                            ? 'border-pink-500 bg-pink-50 shadow-md'
                                            : 'border-gray-300 hover:border-gray-400'
                                    }`}
                                >
                                    <div className="flex items-center space-x-3">
                                        <input
                                            type="checkbox"
                                            checked={selectedProducts.includes(product.id)}
                                            onChange={() => handleProductToggle(product.id)}
                                            className="h-4 w-4 text-pink-600 focus:ring-pink-500 border-gray-300 rounded"
                                        />
                                        <div className="flex-1">
                                            {product.images && product.images.length > 0 && (
                                                <img
                                                    src={product.images[0]}
                                                    alt={product.name}
                                                    className="w-12 h-12 object-cover rounded mb-2"
                                                />
                                            )}
                                            <h4 className="font-medium text-sm text-gray-900">{product.name}</h4>
                                            <p className="text-sm text-gray-600">${product.price}</p>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                        {packableProducts.length === 0 && (
                            <p className="text-gray-500 text-center py-4">No packable products found.</p>
                        )}
                    </div>
                    <p className="text-sm text-gray-500 mt-2">
                        Selected: {selectedProducts.length} products
                    </p>
                </div>

                <div>
                    <button type="submit" className="w-full bg-pink-600 text-white py-2 px-4 rounded-md hover:bg-pink-700">
                        {isEditing ? 'Update Pack' : 'Create Pack'}
                    </button>
                </div>
            </form>
        </div>
    );
};

export default AdminCustomPackForm;