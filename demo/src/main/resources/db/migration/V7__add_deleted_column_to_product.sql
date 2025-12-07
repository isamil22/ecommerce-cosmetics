-- V7__add_deleted_column_to_product.sql
-- Add deleted column to product table for soft delete functionality

ALTER TABLE product ADD COLUMN deleted BOOLEAN DEFAULT FALSE;

-- Add index for better query performance on deleted status
CREATE INDEX idx_product_deleted ON product(deleted);

