-- Add Display Settings columns to product table
ALTER TABLE product ADD COLUMN show_purchase_notifications BOOLEAN DEFAULT TRUE NOT NULL;
ALTER TABLE product ADD COLUMN show_countdown_timer BOOLEAN DEFAULT TRUE NOT NULL;

-- Create indexes for better query performance
CREATE INDEX idx_product_show_purchase_notifications ON product(show_purchase_notifications);
CREATE INDEX idx_product_show_countdown_timer ON product(show_countdown_timer);
