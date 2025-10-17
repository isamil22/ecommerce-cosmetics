-- V3__add_show_online_counter_to_announcement.sql
-- Add show_online_counter field to announcement table

-- Add the new column to the announcement table
ALTER TABLE announcement 
ADD COLUMN show_online_counter BOOLEAN DEFAULT TRUE;

-- Update existing records to have the default value
UPDATE announcement 
SET show_online_counter = TRUE 
WHERE show_online_counter IS NULL;
