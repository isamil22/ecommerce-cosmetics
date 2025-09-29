-- Fix Review table to allow NULL user_id for admin-created reviews
-- Run this SQL command in your MySQL database

USE your_database_name;  -- Replace with your actual database name

ALTER TABLE review 
MODIFY COLUMN user_id BIGINT NULL;

-- Verify the change
DESCRIBE review;
