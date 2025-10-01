-- SQL script to set up frequently bought together relationships
-- This script creates some sample relationships between products

-- First, let's see what products exist
SELECT id, name FROM products LIMIT 10;

-- Create some frequently bought together relationships
-- Note: You'll need to replace these IDs with actual product IDs from your database

-- Example: If product 1 exists, add products 2 and 3 as frequently bought together
INSERT INTO product_frequently_bought_together (product_id, frequently_bought_id) VALUES
(1, 2),
(1, 3),
(2, 1),
(2, 3),
(3, 1),
(3, 2);

-- You can also add more relationships as needed
-- INSERT INTO product_frequently_bought_together (product_id, frequently_bought_id) VALUES
-- (4, 5),
-- (4, 6),
-- (5, 4),
-- (5, 6),
-- (6, 4),
-- (6, 5);

-- To check the relationships after adding them:
-- SELECT 
--     p1.name as main_product,
--     p2.name as frequently_bought_with
-- FROM product_frequently_bought_together pft
-- JOIN products p1 ON pft.product_id = p1.id
-- JOIN products p2 ON pft.frequently_bought_id = p2.id
-- ORDER BY p1.name;
