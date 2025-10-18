-- Add default design field to countdown table
ALTER TABLE countdown ADD COLUMN use_default_design BOOLEAN DEFAULT FALSE;
