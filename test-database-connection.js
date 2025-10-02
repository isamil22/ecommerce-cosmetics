#!/usr/bin/env node

/**
 * Database Connection Test
 * Tests if the visitor counter database is working correctly
 */

const mysql = require('mysql2/promise');

const dbConfig = {
    host: 'localhost',
    port: 3307,
    user: 'user',
    password: 'password',
    database: 'sms'
};

async function testDatabaseConnection() {
    console.log('🔍 Testing Database Connection...');
    
    let connection;
    
    try {
        // Test connection
        console.log('📡 Connecting to database...');
        connection = await mysql.createConnection(dbConfig);
        console.log('✅ Database connection successful!');
        
        // Test visitor counter table
        console.log('\n📊 Testing Visitor Counter Table...');
        
        // Check if table exists
        const [tables] = await connection.execute(
            "SHOW TABLES LIKE 'visitor_count_setting'"
        );
        
        if (tables.length > 0) {
            console.log('✅ visitor_count_setting table exists');
            
            // Get current settings
            const [rows] = await connection.execute(
                'SELECT * FROM visitor_count_setting WHERE id = 1'
            );
            
            if (rows.length > 0) {
                console.log('✅ Current settings found:');
                console.log(`   - ID: ${rows[0].id}`);
                console.log(`   - Enabled: ${rows[0].enabled}`);
                console.log(`   - Min: ${rows[0].min}`);
                console.log(`   - Max: ${rows[0].max}`);
                
                // Validate data
                if (typeof rows[0].enabled === 'boolean') {
                    console.log('✅ Enabled field is boolean');
                } else {
                    console.log('❌ Enabled field should be boolean');
                }
                
                if (typeof rows[0].min === 'number' && typeof rows[0].max === 'number') {
                    console.log('✅ Min/Max fields are numbers');
                    
                    if (rows[0].min <= rows[0].max) {
                        console.log('✅ Min <= Max (valid range)');
                    } else {
                        console.log('❌ Min > Max (invalid range)');
                    }
                    
                    if (rows[0].min >= 0 && rows[0].max >= 0) {
                        console.log('✅ Values are non-negative');
                    } else {
                        console.log('❌ Negative values detected');
                    }
                } else {
                    console.log('❌ Min/Max should be numbers');
                }
                
            } else {
                console.log('⚠️  No settings found (table is empty)');
                console.log('💡 This is normal for first-time setup');
            }
            
        } else {
            console.log('❌ visitor_count_setting table does not exist');
            console.log('💡 Table should be created automatically by Spring Boot');
        }
        
        // Test table structure
        console.log('\n🏗️ Testing Table Structure...');
        try {
            const [columns] = await connection.execute(
                'DESCRIBE visitor_count_setting'
            );
            
            console.log('✅ Table structure:');
            columns.forEach(col => {
                console.log(`   - ${col.Field}: ${col.Type} ${col.Null === 'NO' ? '(NOT NULL)' : '(NULL)'}`);
            });
            
        } catch (error) {
            console.log('❌ Could not describe table structure');
        }
        
        // Test insert/update operations
        console.log('\n✏️ Testing Database Operations...');
        
        try {
            // Try to insert/update settings
            await connection.execute(
                `INSERT INTO visitor_count_setting (id, enabled, min, max) 
                 VALUES (1, true, 10, 50) 
                 ON DUPLICATE KEY UPDATE 
                 enabled = VALUES(enabled), 
                 min = VALUES(min), 
                 max = VALUES(max)`
            );
            console.log('✅ Insert/Update operation successful');
            
            // Verify the update
            const [updatedRows] = await connection.execute(
                'SELECT * FROM visitor_count_setting WHERE id = 1'
            );
            
            if (updatedRows[0].enabled === true && 
                updatedRows[0].min === 10 && 
                updatedRows[0].max === 50) {
                console.log('✅ Data update verified');
            } else {
                console.log('❌ Data update verification failed');
            }
            
        } catch (error) {
            console.log('❌ Database operation failed:', error.message);
        }
        
        console.log('\n🎉 Database test completed successfully!');
        
    } catch (error) {
        console.error('❌ Database test failed:', error.message);
        
        if (error.code === 'ECONNREFUSED') {
            console.log('💡 Database connection refused. Make sure MySQL is running on port 3307');
        } else if (error.code === 'ER_ACCESS_DENIED_ERROR') {
            console.log('💡 Access denied. Check username/password');
        } else if (error.code === 'ER_BAD_DB_ERROR') {
            console.log('💡 Database "sms" does not exist');
        }
    } finally {
        if (connection) {
            await connection.end();
            console.log('🔌 Database connection closed');
        }
    }
}

// Test database if this file is run directly
if (require.main === module) {
    testDatabaseConnection().catch(console.error);
}

module.exports = { testDatabaseConnection };
