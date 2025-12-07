-- Add Display Settings columns to products table
ALTER TABLE product ADD COLUMN show_purchase_notifications BOOLEAN DEFAULT TRUE NOT NULL;
ALTER TABLE product ADD COLUMN show_countdown_timer BOOLEAN DEFAULT TRUE NOT NULL;

-- Add indexes for performance
CREATE INDEX idx_show_purchase_notifications ON product(show_purchase_notifications);
CREATE INDEX idx_show_countdown_timer ON product(show_countdown_timer);
