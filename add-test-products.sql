-- Script to add 4 test products to the database
-- Make sure to run this after the Spring Boot application has created the tables

-- First, ensure we have a category (create one if it doesn't exist)
INSERT IGNORE INTO categories (name, description, image_url) 
VALUES ('Electronics', 'Default category for test products', '');

-- Get the category ID (assuming it's 1, or get the first available category)
SET @category_id = (SELECT id FROM categories LIMIT 1);

-- Insert test products
INSERT INTO product (
    name, 
    description, 
    price, 
    quantity, 
    brand, 
    bestseller, 
    new_arrival, 
    has_variants, 
    is_packable, 
    type, 
    category_id
) VALUES 
(
    'Premium Wireless Headphones',
    'High-quality wireless headphones with noise cancellation and 30-hour battery life. Perfect for music lovers and professionals.',
    199.99,
    50,
    'TechSound',
    true,
    false,
    false,
    true,
    'BOTH',
    @category_id
),
(
    'Classic Denim Jacket',
    'Timeless denim jacket made from premium cotton denim. Available in multiple washes and sizes. Perfect for casual wear.',
    89.99,
    75,
    'DenimCo',
    false,
    true,
    true,
    false,
    'BOTH',
    @category_id
),
(
    'Smart Fitness Watch',
    'Advanced fitness tracking watch with heart rate monitor, GPS, and water resistance. Tracks your workouts and health metrics.',
    299.99,
    30,
    'FitTech',
    true,
    false,
    false,
    true,
    'BOTH',
    @category_id
),
(
    'Organic Cotton T-Shirt',
    'Soft and comfortable organic cotton t-shirt. Eco-friendly and ethically made. Available in various colors and sizes.',
    24.99,
    100,
    'EcoWear',
    false,
    true,
    true,
    true,
    'BOTH',
    @category_id
);

-- Get the product IDs that were just inserted
SET @headphones_id = (SELECT id FROM product WHERE name = 'Premium Wireless Headphones' LIMIT 1);
SET @jacket_id = (SELECT id FROM product WHERE name = 'Classic Denim Jacket' LIMIT 1);
SET @watch_id = (SELECT id FROM product WHERE name = 'Smart Fitness Watch' LIMIT 1);
SET @tshirt_id = (SELECT id FROM product WHERE name = 'Organic Cotton T-Shirt' LIMIT 1);

-- Insert images for the products
INSERT INTO product_images (product_id, images) VALUES 
(@headphones_id, 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500'),
(@headphones_id, 'https://images.unsplash.com/photo-1583394838336-acd977736f90?w=500'),

(@jacket_id, 'https://images.unsplash.com/photo-1544966503-7cc6d8a4a6d7?w=500'),
(@jacket_id, 'https://images.unsplash.com/photo-1551698618-1dfe5d97d256?w=500'),

(@watch_id, 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=500'),
(@watch_id, 'https://images.unsplash.com/photo-1551698618-1dfe5d97d256?w=500'),

(@tshirt_id, 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=500'),
(@tshirt_id, 'https://images.unsplash.com/photo-1503342217505-b0a15ec3261c?w=500');

-- Show the results
SELECT 'Test products added successfully!' as message;
SELECT id, name, price, brand, bestseller, new_arrival FROM product WHERE name IN (
    'Premium Wireless Headphones',
    'Classic Denim Jacket', 
    'Smart Fitness Watch',
    'Organic Cotton T-Shirt'
) ORDER BY id DESC;
