-- Fix product images
UPDATE product_images SET images = REPLACE(images, 'http://localhost:8080/api/images/', '/api/images/') WHERE images LIKE 'http://localhost:8080%';
UPDATE product_images SET images = REPLACE(images, 'api/images/', '/api/images/') WHERE images LIKE 'api/images/%' AND images NOT LIKE '/api/images/%';

-- Fix category images
UPDATE categories SET image_url = REPLACE(image_url, 'http://localhost:8080/api/images/', '/api/images/') WHERE image_url LIKE 'http://localhost:8080%';
UPDATE categories SET image_url = REPLACE(image_url, 'api/images/', '/api/images/') WHERE image_url LIKE 'api/images/%' AND image_url NOT LIKE '/api/images/%';

-- Fix pack images
UPDATE packs SET image_url = REPLACE(image_url, 'http://localhost:8080/api/images/', '/api/images/') WHERE image_url LIKE 'http://localhost:8080%';
UPDATE packs SET image_url = REPLACE(image_url, 'api/images/', '/api/images/') WHERE image_url LIKE 'api/images/%' AND image_url NOT LIKE '/api/images/%';

-- Fix any hero section images if they exist (assuming table name 'hero_sections' or similar, check usage if failure)
-- Skipping hero for now to avoid errors if table doesn't exist, user can check manually or we can add later.
