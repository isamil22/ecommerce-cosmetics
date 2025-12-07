-- Fix pack description column to support large HTML content with embedded images
-- Changes column from TEXT to LONGTEXT to handle large descriptions

ALTER TABLE packs MODIFY COLUMN description LONGTEXT;
