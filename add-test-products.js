const mysql = require('mysql2/promise');

// Database configuration
const dbConfig = {
    host: 'localhost',
    user: 'user',
    password: 'password',
    database: 'sms'
};

// Test products data
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
        images: ["https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500", "https://images.unsplash.com/photo-1583394838336-acd977736f90?w=500"]
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
        images: ["https://images.unsplash.com/photo-1544966503-7cc6d8a4a6d7?w=500", "https://images.unsplash.com/photo-1551698618-1dfe5d97d256?w=500"]
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
        images: ["https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=500", "https://images.unsplash.com/photo-1551698618-1dfe5d97d256?w=500"]
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
        images: ["https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=500", "https://images.unsplash.com/photo-1503342217505-b0a15ec3261c?w=500"]
    }
];

async function addTestProducts() {
    let connection;
    
    try {
        console.log('Connecting to database...');
        connection = await mysql.createConnection(dbConfig);
        
        // First, let's check if categories exist
        console.log('Checking existing categories...');
        const [categories] = await connection.execute('SELECT id, name FROM categories LIMIT 1');
        
        let categoryId;
        if (categories.length > 0) {
            categoryId = categories[0].id;
            console.log(`Using existing category: ${categories[0].name} (ID: ${categoryId})`);
        } else {
            // Create a default category if none exists
            console.log('No categories found. Creating a default category...');
            const [result] = await connection.execute(
                'INSERT INTO categories (name, description, image_url) VALUES (?, ?, ?)',
                ['Electronics', 'Default category for test products', '']
            );
            categoryId = result.insertId;
            console.log(`Created default category with ID: ${categoryId}`);
        }
        
        // Add test products
        console.log('\nAdding test products...');
        
        for (let i = 0; i < testProducts.length; i++) {
            const product = testProducts[i];
            console.log(`\nAdding product ${i + 1}: ${product.name}`);
            
            // Insert product
            const [productResult] = await connection.execute(`
                INSERT INTO product (
                    name, description, price, quantity, brand, 
                    bestseller, new_arrival, has_variants, is_packable, 
                    type, category_id
                ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
            `, [
                product.name,
                product.description,
                product.price,
                product.quantity,
                product.brand,
                product.bestseller,
                product.newArrival,
                product.hasVariants,
                product.isPackable,
                product.type,
                categoryId
            ]);
            
            const productId = productResult.insertId;
            console.log(`  ✓ Product inserted with ID: ${productId}`);
            
            // Insert images
            if (product.images && product.images.length > 0) {
                console.log(`  Adding ${product.images.length} images...`);
                for (const imageUrl of product.images) {
                    await connection.execute(
                        'INSERT INTO product_images (product_id, images) VALUES (?, ?)',
                        [productId, imageUrl]
                    );
                }
                console.log(`  ✓ Images added`);
            }
            
            console.log(`  ✓ Product ${i + 1} completed`);
        }
        
        console.log('\n🎉 Successfully added 4 test products!');
        console.log('\nTest Products Added:');
        testProducts.forEach((product, index) => {
            console.log(`  ${index + 1}. ${product.name} - $${product.price} (${product.brand})`);
        });
        
    } catch (error) {
        console.error('Error adding test products:', error);
        
        if (error.code === 'ER_NO_SUCH_TABLE') {
            console.log('\n❌ Database tables not found. Make sure the application has been started to create the tables.');
        } else if (error.code === 'ECONNREFUSED') {
            console.log('\n❌ Cannot connect to database. Make sure MySQL is running and the database exists.');
        }
    } finally {
        if (connection) {
            await connection.end();
            console.log('\nDatabase connection closed.');
        }
    }
}

// Run the script
addTestProducts();
