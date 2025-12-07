-- Add notification toggle columns to packs table
-- Allows admins to enable/disable purchase notifications and countdown timer per pack

ALTER TABLE packs ADD COLUMN show_purchase_notifications BOOLEAN DEFAULT TRUE NOT NULL;
ALTER TABLE packs ADD COLUMN show_countdown_timer BOOLEAN DEFAULT TRUE NOT NULL;

-- Add indexes for better query performance
CREATE INDEX idx_show_purchase_notifications ON packs(show_purchase_notifications);
CREATE INDEX idx_show_countdown_timer ON packs(show_countdown_timer);
