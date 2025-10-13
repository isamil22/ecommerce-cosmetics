-- Flyway Migration Validation Script
-- This script verifies all tables will be created correctly

-- Test the migration can be executed
USE sms;

-- Check table existence after migration
SHOW TABLES;

-- Verify critical tables structure
DESCRIBE users;
DESCRIBE product;
DESCRIBE categories;
DESCRIBE orders;
DESCRIBE coupons;
DESCRIBE packs;
DESCRIBE custom_pack;

-- Check foreign key constraints
SELECT 
    TABLE_NAME,
    COLUMN_NAME,
    CONSTRAINT_NAME,
    REFERENCED_TABLE_NAME,
    REFERENCED_COLUMN_NAME
FROM
    INFORMATION_SCHEMA.KEY_COLUMN_USAGE
WHERE
    REFERENCED_TABLE_SCHEMA = 'sms'
    AND TABLE_SCHEMA = 'sms'
ORDER BY
    TABLE_NAME, COLUMN_NAME;

-- Check indexes
SELECT 
    TABLE_NAME,
    INDEX_NAME,
    COLUMN_NAME,
    NON_UNIQUE
FROM
    INFORMATION_SCHEMA.STATISTICS
WHERE
    TABLE_SCHEMA = 'sms'
ORDER BY
    TABLE_NAME, INDEX_NAME, SEQ_IN_INDEX;

-- Verify Flyway history
SELECT * FROM flyway_schema_history;

