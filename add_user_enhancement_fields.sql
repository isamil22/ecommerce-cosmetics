-- Add enhanced user management fields to the users table
-- Run this script to add the new columns for enhanced user management

-- Add new columns to users table
ALTER TABLE users 
ADD COLUMN created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN last_login_at TIMESTAMP NULL,
ADD COLUMN updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
ADD COLUMN is_active BOOLEAN DEFAULT TRUE,
ADD COLUMN phone_number VARCHAR(20) NULL,
ADD COLUMN profile_image_url VARCHAR(500) NULL,
ADD COLUMN notes TEXT NULL;

-- Create indexes for better query performance
CREATE INDEX idx_users_created_at ON users(created_at);
CREATE INDEX idx_users_last_login_at ON users(last_login_at);
CREATE INDEX idx_users_is_active ON users(is_active);
CREATE INDEX idx_users_role ON users(role);
CREATE INDEX idx_users_email_confirmation ON users(email_confirmation);

-- Update existing users to have created_at timestamp (set to a default date)
UPDATE users SET created_at = '2024-01-01 00:00:00' WHERE created_at IS NULL;

-- Update existing users to have updated_at timestamp
UPDATE users SET updated_at = NOW() WHERE updated_at IS NULL;

-- Show the updated table structure
DESCRIBE users;
