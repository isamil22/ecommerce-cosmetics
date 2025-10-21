const mysql = require('mysql2/promise');

async function testDatabase() {
    try {
        console.log('Testing database connection...');
        
        const connection = await mysql.createConnection({
            host: 'localhost',
            port: 3307,
            user: 'user',
            password: 'password',
            database: 'sms'
        });
        
        console.log('Connected to database successfully!');
        
        // Check if the deleted column exists
        const [columns] = await connection.execute(`
            SELECT COLUMN_NAME 
            FROM INFORMATION_SCHEMA.COLUMNS 
            WHERE TABLE_SCHEMA = 'sms' 
            AND TABLE_NAME = 'product' 
            AND COLUMN_NAME = 'deleted'
        `);
        
        console.log('Deleted column exists:', columns.length > 0);
        
        // Check if there are any products
        const [products] = await connection.execute('SELECT COUNT(*) as count FROM product');
        console.log('Total products:', products[0].count);
        
        // Check if there are any bestsellers
        const [bestsellers] = await connection.execute('SELECT COUNT(*) as count FROM product WHERE bestseller = true');
        console.log('Bestseller products:', bestsellers[0].count);
        
        // Check if there are any non-deleted bestsellers
        const [nonDeletedBestsellers] = await connection.execute('SELECT COUNT(*) as count FROM product WHERE bestseller = true AND deleted = false');
        console.log('Non-deleted bestseller products:', nonDeletedBestsellers[0].count);
        
        await connection.end();
        
    } catch (error) {
        console.error('Database connection error:', error.message);
    }
}

testDatabase();