-- Fix hero table image_url column length issue
-- The current image_url column is too short for long URLs

ALTER TABLE hero MODIFY COLUMN image_url TEXT;

-- Alternative: If you prefer VARCHAR with longer length
-- ALTER TABLE hero MODIFY COLUMN image_url VARCHAR(1000);
