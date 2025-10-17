-- Add new fields to countdown table for full control
ALTER TABLE countdown ADD COLUMN border_color VARCHAR(7);
ALTER TABLE countdown ADD COLUMN timer_box_color VARCHAR(7);
ALTER TABLE countdown ADD COLUMN timer_text_color VARCHAR(7);
ALTER TABLE countdown ADD COLUMN urgent_bg_color VARCHAR(7);
ALTER TABLE countdown ADD COLUMN urgent_text_color VARCHAR(7);

-- Text settings
ALTER TABLE countdown ADD COLUMN subtitle VARCHAR(255);
ALTER TABLE countdown ADD COLUMN urgent_message VARCHAR(255);
ALTER TABLE countdown ADD COLUMN expired_message VARCHAR(255);
ALTER TABLE countdown ADD COLUMN pack_name VARCHAR(255);

-- Display settings
ALTER TABLE countdown ADD COLUMN show_days BOOLEAN DEFAULT FALSE;
ALTER TABLE countdown ADD COLUMN show_hours BOOLEAN DEFAULT TRUE;
ALTER TABLE countdown ADD COLUMN show_minutes BOOLEAN DEFAULT TRUE;
ALTER TABLE countdown ADD COLUMN show_seconds BOOLEAN DEFAULT TRUE;
ALTER TABLE countdown ADD COLUMN show_pack_name BOOLEAN DEFAULT TRUE;
ALTER TABLE countdown ADD COLUMN show_subtitle BOOLEAN DEFAULT TRUE;

-- Animation settings
ALTER TABLE countdown ADD COLUMN enable_pulse BOOLEAN DEFAULT TRUE;
ALTER TABLE countdown ADD COLUMN enable_bounce BOOLEAN DEFAULT TRUE;
ALTER TABLE countdown ADD COLUMN urgent_threshold INTEGER DEFAULT 3600;

-- Layout settings
ALTER TABLE countdown ADD COLUMN border_radius INTEGER DEFAULT 12;
ALTER TABLE countdown ADD COLUMN padding INTEGER DEFAULT 16;
ALTER TABLE countdown ADD COLUMN font_size INTEGER DEFAULT 18;
ALTER TABLE countdown ADD COLUMN timer_font_size INTEGER DEFAULT 24;
