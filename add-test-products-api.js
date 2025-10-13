// Script to add test products using the REST API
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
    const baseUrl = 'http://localhost:8080/api';
    
    try {
        console.log('Starting to add test products via API...\n');
        
        // First, let's check if the API is available
        console.log('Checking API availability...');
        try {
            const response = await fetch(`${baseUrl}/products`);
            if (!response.ok && response.status !== 404) {
                throw new Error(`API not available: ${response.status}`);
            }
            console.log('✓ API is available');
        } catch (error) {
            console.log('❌ API not available. Make sure the Spring Boot application is running on port 8080');
            console.log('Error:', error.message);
            return;
        }
        
        // Get or create a category
        console.log('\nChecking categories...');
        let categoryId;
        try {
            const categoriesResponse = await fetch(`${baseUrl}/categories`);
            if (categoriesResponse.ok) {
                const categories = await categoriesResponse.json();
                if (categories.length > 0) {
                    categoryId = categories[0].id;
                    console.log(`✓ Using existing category: ${categories[0].name} (ID: ${categoryId})`);
                } else {
                    // Create a default category
                    const newCategory = {
                        name: "Electronics",
                        description: "Default category for test products",
                        imageUrl: ""
                    };
                    
                    const categoryResponse = await fetch(`${baseUrl}/categories`, {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                        },
                        body: JSON.stringify(newCategory)
                    });
                    
                    if (categoryResponse.ok) {
                        const createdCategory = await categoryResponse.json();
                        categoryId = createdCategory.id;
                        console.log(`✓ Created new category: ${createdCategory.name} (ID: ${categoryId})`);
                    } else {
                        console.log('❌ Failed to create category');
                        return;
                    }
                }
            } else {
                console.log('❌ Failed to fetch categories');
                return;
            }
        } catch (error) {
            console.log('❌ Error with categories:', error.message);
            return;
        }
        
        // Add test products
        console.log('\nAdding test products...');
        
        for (let i = 0; i < testProducts.length; i++) {
            const product = testProducts[i];
            console.log(`\nAdding product ${i + 1}: ${product.name}`);
            
            try {
                const productData = {
                    ...product,
                    categoryId: categoryId
                };
                
                const response = await fetch(`${baseUrl}/products`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(productData)
                });
                
                if (response.ok) {
                    const createdProduct = await response.json();
                    console.log(`  ✓ Product added successfully with ID: ${createdProduct.id}`);
                } else {
                    const errorText = await response.text();
                    console.log(`  ❌ Failed to add product: ${response.status} - ${errorText}`);
                }
            } catch (error) {
                console.log(`  ❌ Error adding product: ${error.message}`);
            }
        }
        
        console.log('\n🎉 Test products addition completed!');
        console.log('\nProducts added:');
        testProducts.forEach((product, index) => {
            console.log(`  ${index + 1}. ${product.name} - $${product.price} (${product.brand})`);
        });
        
        // Verify products were added
        console.log('\nVerifying products...');
        try {
            const verifyResponse = await fetch(`${baseUrl}/products`);
            if (verifyResponse.ok) {
                const products = await verifyResponse.json();
                console.log(`✓ Total products in database: ${products.length}`);
                
                // Show the last 4 products (should be our test products)
                const recentProducts = products.slice(-4);
                console.log('\nRecent products:');
                recentProducts.forEach((product, index) => {
                    console.log(`  ${index + 1}. ${product.name} - $${product.price} (${product.brand})`);
                });
            }
        } catch (error) {
            console.log('❌ Error verifying products:', error.message);
        }
        
    } catch (error) {
        console.error('Error:', error);
    }
}

// Add a delay to ensure the application is fully started
console.log('Waiting for application to start...');
setTimeout(() => {
    addTestProducts();
}, 10000); // Wait 10 seconds for the application to start
