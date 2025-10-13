// Direct script to add 4 test products
const API_BASE = 'http://localhost:8080/api';

const testProducts = [
    {
        name: "Premium Wireless Headphones",
        description: "High-quality wireless headphones with noise cancellation and 30-hour battery life. Perfect for music lovers and professionals.",
        price: 199.99,
        quantity: 50,
        brand: "TechSound",
        bestseller: true,
        newArrival: false,
        hasVariants: false,
        isPackable: true,
        type: "BOTH",
        images: ["https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500"]
    },
    {
        name: "Classic Denim Jacket",
        description: "Timeless denim jacket made from premium cotton denim. Available in multiple washes and sizes. Perfect for casual wear.",
        price: 89.99,
        quantity: 75,
        brand: "DenimCo",
        bestseller: false,
        newArrival: true,
        hasVariants: true,
        isPackable: false,
        type: "BOTH",
        images: ["https://images.unsplash.com/photo-1544966503-7cc6d8a4a6d7?w=500"]
    },
    {
        name: "Smart Fitness Watch",
        description: "Advanced fitness tracking watch with heart rate monitor, GPS, and water resistance. Tracks your workouts and health metrics.",
        price: 299.99,
        quantity: 30,
        brand: "FitTech",
        bestseller: true,
        newArrival: false,
        hasVariants: false,
        isPackable: true,
        type: "BOTH",
        images: ["https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=500"]
    },
    {
        name: "Organic Cotton T-Shirt",
        description: "Soft and comfortable organic cotton t-shirt. Eco-friendly and ethically made. Available in various colors and sizes.",
        price: 24.99,
        quantity: 100,
        brand: "EcoWear",
        bestseller: false,
        newArrival: true,
        hasVariants: true,
        isPackable: true,
        type: "BOTH",
        images: ["https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=500"]
    }
];

async function addTestProducts() {
    console.log('🚀 Starting to add 4 test products...\n');
    
    try {
        // First, get or create a category
        console.log('📂 Setting up category...');
        let categoryId;
        
        try {
            const categoriesResponse = await fetch(`${API_BASE}/categories`);
            if (categoriesResponse.ok) {
                const categories = await categoriesResponse.json();
                if (categories.length > 0) {
                    categoryId = categories[0].id;
                    console.log(`✅ Using existing category: ${categories[0].name} (ID: ${categoryId})`);
                } else {
                    // Create a default category
                    const newCategory = {
                        name: "Electronics",
                        description: "Default category for test products",
                        imageUrl: ""
                    };
                    
                    const categoryResponse = await fetch(`${API_BASE}/categories`, {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                        },
                        body: JSON.stringify(newCategory)
                    });
                    
                    if (categoryResponse.ok) {
                        const createdCategory = await categoryResponse.json();
                        categoryId = createdCategory.id;
                        console.log(`✅ Created new category: ${createdCategory.name} (ID: ${categoryId})`);
                    } else {
                        throw new Error('Failed to create category');
                    }
                }
            } else {
                throw new Error(`Categories API error: ${categoriesResponse.status}`);
            }
        } catch (error) {
            console.error('❌ Category setup failed:', error.message);
            return;
        }
        
        // Add each test product
        console.log('\n📦 Adding test products...');
        let successCount = 0;
        
        for (let i = 0; i < testProducts.length; i++) {
            const product = testProducts[i];
            console.log(`\n${i + 1}. Adding: ${product.name}`);
            
            try {
                const productData = {
                    ...product,
                    categoryId: categoryId
                };
                
                const response = await fetch(`${API_BASE}/products`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(productData)
                });
                
                if (response.ok) {
                    const createdProduct = await response.json();
                    console.log(`   ✅ Success! ID: ${createdProduct.id}`);
                    console.log(`   💰 Price: $${product.price} | Brand: ${product.brand}`);
                    successCount++;
                } else {
                    const errorText = await response.text();
                    console.log(`   ❌ Failed: ${response.status} - ${errorText}`);
                }
            } catch (error) {
                console.log(`   ❌ Error: ${error.message}`);
            }
        }
        
        console.log(`\n🎉 Product addition completed!`);
        console.log(`📊 Results: ${successCount}/${testProducts.length} products added successfully`);
        
        // Verify by loading all products
        console.log('\n🔍 Verifying products...');
        try {
            const verifyResponse = await fetch(`${API_BASE}/products`);
            if (verifyResponse.ok) {
                const products = await verifyResponse.json();
                console.log(`✅ Total products in database: ${products.length}`);
                
                // Show our test products
                const testProductNames = testProducts.map(p => p.name);
                const addedProducts = products.filter(p => testProductNames.includes(p.name));
                
                console.log('\n📋 Test products found in database:');
                addedProducts.forEach((product, index) => {
                    console.log(`   ${index + 1}. ${product.name} - $${product.price} (${product.brand})`);
                });
            }
        } catch (error) {
            console.log('❌ Error verifying products:', error.message);
        }
        
    } catch (error) {
        console.error('💥 Script error:', error);
    }
}

// Run the script
addTestProducts();
