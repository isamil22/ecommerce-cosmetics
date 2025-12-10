-- Fix Flyway Failed Migration Issue
-- Run this script using your MySQL client (MySQL Workbench, phpMyAdmin, etc.)
-- Database: sms
-- Port: 3307

USE sms;

-- Step 1: Remove the failed migration entry
DELETE FROM flyway_schema_history WHERE version = '7' AND success = 0;

-- Step 2: Mark V7-V10 as completed (since they're already applied to your database)
-- Only insert if they don't already exist
INSERT IGNORE INTO flyway_schema_history (installed_rank, version, description, type, script, checksum, installed_by, execution_time, success)
VALUES
  (7, '7', 'add deleted column to product', 'SQL', 'V7__add_deleted_column_to_product.sql', 0, 'user', 0, 1),
  (8, '8', 'fix pack description column', 'SQL', 'V8__fix_pack_description_column.sql', 0, 'user', 0, 1),
  (9, '9', 'add notification toggle columns', 'SQL', 'V9__add_notification_toggle_columns.sql', 0, 'user', 0, 1),
  (10, '10', 'add product display settings', 'SQL', 'V10__add_product_display_settings.sql', 0, 'user', 0, 1);

-- Step 3: Verify
SELECT * FROM flyway_schema_history ORDER BY installed_rank;

