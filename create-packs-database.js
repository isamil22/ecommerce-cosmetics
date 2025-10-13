// Script to create 2 test packs using direct database connection
const mysql = require('mysql2/promise');

const dbConfig = {
    host: 'localhost',
    user: 'user',
    password: 'password',
    database: 'sms',
    port: 3307
};

const testPacks = [
    {
        name: "Tech Essentials Bundle",
        description: "Complete tech starter pack featuring wireless headphones and a smart fitness watch. Perfect for professionals and fitness enthusiasts who want the latest technology.",
        price: 449.98,
        imageUrl: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=500",
        hideCommentForm: false,
        items: [
            {
                defaultProductId: 1, // Premium Wireless Headphones
                variationProductIds: [] // No variations for headphones
            },
            {
                defaultProductId: 3, // Smart Fitness Watch
                variationProductIds: [] // No variations for watch
            }
        ],
        recommendedProductIds: [4] // Recommend Organic Cotton T-Shirt
    },
    {
        name: "Fashion Forward Pack",
        description: "Stylish clothing bundle with a classic denim jacket and comfortable organic cotton t-shirt. Perfect for casual and everyday wear with eco-friendly materials.",
        price: 114.98,
        imageUrl: "https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=500",
        hideCommentForm: true,
        items: [
            {
                defaultProductId: 2, // Classic Denim Jacket
                variationProductIds: [4] // T-shirt as variation option
            },
            {
                defaultProductId: 4, // Organic Cotton T-Shirt
                variationProductIds: [2] // Jacket as variation option
            }
        ],
        recommendedProductIds: [1, 3] // Recommend headphones and watch
    }
];

async function createPacksDirectly() {
    let connection;
    
    try {
        console.log('🚀 Connecting to database...');
        connection = await mysql.createConnection(dbConfig);
        console.log('✅ Connected to database successfully!');
        
        // Check if we have products
        console.log('\n📋 Checking existing products...');
        const [products] = await connection.execute('SELECT id, name FROM product ORDER BY id');
        console.log(`Found ${products.length} products:`);
        products.forEach(product => {
            console.log(`  - ${product.name} (ID: ${product.id})`);
        });
        
        if (products.length < 4) {
            console.log('❌ Need at least 4 products to create packs. Please add more products first.');
            return;
        }
        
        // Create pack tables if they don't exist
        console.log('\n📋 Creating pack tables...');
        
        // Create packs table
        await connection.execute(`
            CREATE TABLE IF NOT EXISTS packs (
                id BIGINT AUTO_INCREMENT PRIMARY KEY,
                name VARCHAR(255),
                description TEXT,
                price DECIMAL(10,2),
                image_url VARCHAR(2048),
                hide_comment_form BOOLEAN DEFAULT FALSE
            )
        `);
        console.log('✅ Packs table created/verified');
        
        // Create pack_items table
        await connection.execute(`
            CREATE TABLE IF NOT EXISTS pack_items (
                id BIGINT AUTO_INCREMENT PRIMARY KEY,
                pack_id BIGINT,
                default_product_id BIGINT,
                FOREIGN KEY (pack_id) REFERENCES packs(id) ON DELETE CASCADE,
                FOREIGN KEY (default_product_id) REFERENCES product(id)
            )
        `);
        console.log('✅ Pack items table created/verified');
        
        // Create pack_item_variations table
        await connection.execute(`
            CREATE TABLE IF NOT EXISTS pack_item_variations (
                pack_item_id BIGINT,
                product_id BIGINT,
                PRIMARY KEY (pack_item_id, product_id),
                FOREIGN KEY (pack_item_id) REFERENCES pack_items(id) ON DELETE CASCADE,
                FOREIGN KEY (product_id) REFERENCES product(id)
            )
        `);
        console.log('✅ Pack item variations table created/verified');
        
        // Create pack_recommended_products table
        await connection.execute(`
            CREATE TABLE IF NOT EXISTS pack_recommended_products (
                pack_id BIGINT,
                product_id BIGINT,
                PRIMARY KEY (pack_id, product_id),
                FOREIGN KEY (pack_id) REFERENCES packs(id) ON DELETE CASCADE,
                FOREIGN KEY (product_id) REFERENCES product(id)
            )
        `);
        console.log('✅ Pack recommended products table created/verified');
        
        // Add packs
        console.log('\n📦 Adding test packs...');
        let successCount = 0;
        
        for (let i = 0; i < testPacks.length; i++) {
            const pack = testPacks[i];
            console.log(`\n${i + 1}. Adding pack: ${pack.name}`);
            
            try {
                // Insert pack
                const [packResult] = await connection.execute(`
                    INSERT INTO packs (name, description, price, image_url, hide_comment_form)
                    VALUES (?, ?, ?, ?, ?)
                `, [
                    pack.name,
                    pack.description,
                    pack.price,
                    pack.imageUrl,
                    pack.hideCommentForm
                ]);
                
                const packId = packResult.insertId;
                console.log(`   ✅ Pack inserted with ID: ${packId}`);
                console.log(`   💰 Price: $${pack.price}`);
                
                // Add pack items
                for (const item of pack.items) {
                    const [itemResult] = await connection.execute(`
                        INSERT INTO pack_items (pack_id, default_product_id)
                        VALUES (?, ?)
                    `, [packId, item.defaultProductId]);
                    
                    const itemId = itemResult.insertId;
                    console.log(`   📦 Pack item added (ID: ${itemId}) for product ID: ${item.defaultProductId}`);
                    
                    // Add variations if any
                    if (item.variationProductIds && item.variationProductIds.length > 0) {
                        for (const variationId of item.variationProductIds) {
                            await connection.execute(`
                                INSERT INTO pack_item_variations (pack_item_id, product_id)
                                VALUES (?, ?)
                            `, [itemId, variationId]);
                        }
                        console.log(`   🔄 Added ${item.variationProductIds.length} variations`);
                    }
                }
                
                // Add recommended products
                if (pack.recommendedProductIds && pack.recommendedProductIds.length > 0) {
                    for (const recProductId of pack.recommendedProductIds) {
                        await connection.execute(`
                            INSERT INTO pack_recommended_products (pack_id, product_id)
                            VALUES (?, ?)
                        `, [packId, recProductId]);
                    }
                    console.log(`   ⭐ Added ${pack.recommendedProductIds.length} recommended products`);
                }
                
                successCount++;
            } catch (error) {
                console.log(`   ❌ Error: ${error.message}`);
            }
        }
        
        console.log(`\n🎉 Pack creation completed!`);
        console.log(`📊 Results: ${successCount}/${testPacks.length} packs created successfully`);
        
        // Verify packs
        if (successCount > 0) {
            console.log('\n🔍 Verifying packs...');
            const [packs] = await connection.execute('SELECT COUNT(*) as total FROM packs');
            console.log(`✅ Total packs in database: ${packs[0].total}`);
            
            // Show our test packs with details
            const [testPacksResult] = await connection.execute(`
                SELECT p.id, p.name, p.price, p.description, 
                       COUNT(pi.id) as item_count,
                       COUNT(prp.product_id) as recommended_count
                FROM packs p
                LEFT JOIN pack_items pi ON p.id = pi.pack_id
                LEFT JOIN pack_recommended_products prp ON p.id = prp.pack_id
                GROUP BY p.id, p.name, p.price, p.description
                ORDER BY p.id DESC
            `);
            
            console.log('\n📋 Test packs found in database:');
            testPacksResult.forEach((pack, index) => {
                console.log(`   ${index + 1}. ${pack.name} - $${pack.price}`);
                console.log(`      Items: ${pack.item_count} | Recommended: ${pack.recommended_count}`);
            });
            
            // Show pack items details
            console.log('\n📦 Pack items breakdown:');
            const [packItemsResult] = await connection.execute(`
                SELECT p.name as pack_name, pr.name as product_name, pi.id as item_id
                FROM pack_items pi
                JOIN packs p ON pi.pack_id = p.id
                JOIN product pr ON pi.default_product_id = pr.id
                ORDER BY p.id, pi.id
            `);
            
            packItemsResult.forEach(item => {
                console.log(`   - ${item.pack_name}: ${item.product_name}`);
            });
            
            console.log('\n🎯 SUCCESS! 2 test packs have been created!');
            console.log('You can now start the Spring Boot application to see the packs.');
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
createPacksDirectly();
