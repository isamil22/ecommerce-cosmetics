// Script to create tables and add products
const mysql = require('mysql2/promise');

const dbConfig = {
    host: 'localhost',
    user: 'user',
    password: 'password',
    database: 'sms',
    port: 3307
};

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

async function createTablesAndAddProducts() {
    let connection;
    
    try {
        console.log('🚀 Connecting to database...');
        connection = await mysql.createConnection(dbConfig);
        console.log('✅ Connected to database successfully!');
        
        // Create categories table
        console.log('\n📋 Creating categories table...');
        await connection.execute(`
            CREATE TABLE IF NOT EXISTS categories (
                id BIGINT AUTO_INCREMENT PRIMARY KEY,
                name VARCHAR(255) NOT NULL UNIQUE,
                description TEXT,
                image_url VARCHAR(2048)
            )
        `);
        console.log('✅ Categories table created/verified');
        
        // Create product table
        console.log('\n📋 Creating product table...');
        await connection.execute(`
            CREATE TABLE IF NOT EXISTS product (
                id BIGINT AUTO_INCREMENT PRIMARY KEY,
                name VARCHAR(255),
                description TEXT,
                price DECIMAL(10,2),
                quantity INT,
                brand VARCHAR(255),
                bestseller BOOLEAN DEFAULT FALSE,
                new_arrival BOOLEAN DEFAULT FALSE,
                has_variants BOOLEAN DEFAULT FALSE,
                is_packable BOOLEAN DEFAULT FALSE,
                type VARCHAR(10),
                category_id BIGINT,
                FOREIGN KEY (category_id) REFERENCES categories(id)
            )
        `);
        console.log('✅ Product table created/verified');
        
        // Create product_images table
        console.log('\n📋 Creating product_images table...');
        await connection.execute(`
            CREATE TABLE IF NOT EXISTS product_images (
                id BIGINT AUTO_INCREMENT PRIMARY KEY,
                product_id BIGINT,
                images VARCHAR(2048),
                FOREIGN KEY (product_id) REFERENCES product(id) ON DELETE CASCADE
            )
        `);
        console.log('✅ Product images table created/verified');
        
        // Get or create category
        console.log('\n📂 Setting up category...');
        let categoryId;
        
        try {
            const [categories] = await connection.execute('SELECT id, name FROM categories LIMIT 1');
            if (categories.length > 0) {
                categoryId = categories[0].id;
                console.log(`✅ Using existing category: ${categories[0].name} (ID: ${categoryId})`);
            } else {
                console.log('Creating default category...');
                const [result] = await connection.execute(
                    'INSERT INTO categories (name, description, image_url) VALUES (?, ?, ?)',
                    ['Electronics', 'Default category for test products', '']
                );
                categoryId = result.insertId;
                console.log(`✅ Created new category with ID: ${categoryId}`);
            }
        } catch (error) {
            console.log('❌ Category error:', error.message);
            return;
        }
        
        // Add products
        console.log('\n📦 Adding test products...');
        let successCount = 0;
        
        for (let i = 0; i < testProducts.length; i++) {
            const product = testProducts[i];
            console.log(`\n${i + 1}. Adding: ${product.name}`);
            
            try {
                // Insert product
                const [result] = await connection.execute(`
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
                
                const productId = result.insertId;
                console.log(`   ✅ Product inserted with ID: ${productId}`);
                console.log(`   💰 Price: $${product.price} | Brand: ${product.brand}`);
                
                // Insert images
                if (product.images && product.images.length > 0) {
                    for (const imageUrl of product.images) {
                        await connection.execute(
                            'INSERT INTO product_images (product_id, images) VALUES (?, ?)',
                            [productId, imageUrl]
                        );
                    }
                    console.log(`   🖼️  ${product.images.length} images added`);
                }
                
                successCount++;
            } catch (error) {
                console.log(`   ❌ Error: ${error.message}`);
            }
        }
        
        console.log(`\n🎉 Product addition completed!`);
        console.log(`📊 Results: ${successCount}/${testProducts.length} products added successfully`);
        
        // Verify products
        if (successCount > 0) {
            console.log('\n🔍 Verifying products...');
            const [products] = await connection.execute('SELECT COUNT(*) as total FROM product');
            console.log(`✅ Total products in database: ${products[0].total}`);
            
            // Show our test products
            const testNames = testProducts.map(p => `'${p.name}'`).join(',');
            const [testProductsResult] = await connection.execute(`
                SELECT id, name, price, brand FROM product 
                WHERE name IN (${testNames}) 
                ORDER BY id DESC
            `);
            
            console.log('\n📋 Test products found in database:');
            testProductsResult.forEach((product, index) => {
                console.log(`   ${index + 1}. ${product.name} - $${product.price} (${product.brand})`);
            });
            
            console.log('\n🎯 SUCCESS! 4 test products have been added to the database!');
            console.log('You can now start the Spring Boot application to see the products.');
        }
        
    } catch (error) {
        console.error('💥 Error:', error.message);
    } finally {
        if (connection) {
            await connection.end();
            console.log('\n🔌 Database connection closed.');
        }
    }
}

// Run the script
createTablesAndAddProducts();
