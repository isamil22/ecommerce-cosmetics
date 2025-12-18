-- Make product_id nullable to support direct orders
ALTER TABLE order_item MODIFY product_id BIGINT NULL;

-- Add snapshot columns for direct orders (and historical accuracy for normal orders)
ALTER TABLE order_item ADD COLUMN product_name VARCHAR(255);
ALTER TABLE order_item ADD COLUMN product_image VARCHAR(255);
ALTER TABLE order_item ADD COLUMN variant_name VARCHAR(255);

-- Backfill existing orders with data from the product table to avoid nulls
UPDATE order_item oi
JOIN product p ON oi.product_id = p.id
SET oi.product_name = p.name,
    oi.product_image = (SELECT images FROM product_images pi WHERE pi.product_id = p.id LIMIT 1);
