-- Make product_id nullable
ALTER TABLE cart_item MODIFY COLUMN product_id BIGINT NULL;

-- Add columns for virtual product details
ALTER TABLE cart_item ADD COLUMN product_name VARCHAR(255);
ALTER TABLE cart_item ADD COLUMN price DECIMAL(19,2);
ALTER TABLE cart_item ADD COLUMN image_url VARCHAR(255);
