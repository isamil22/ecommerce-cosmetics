-- =====================================================
-- Landing Pages System
-- This migration creates tables for the landing page builder feature
-- =====================================================

-- Landing Pages Table (main table)
CREATE TABLE landing_pages (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    product_id BIGINT NULL,  -- Optional: link to a specific product
    title VARCHAR(255) NOT NULL,
    slug VARCHAR(255) NOT NULL UNIQUE,  -- URL-friendly identifier (e.g., 'summer-serum-2024')
    meta_title VARCHAR(255),
    meta_description TEXT,
    status ENUM('DRAFT', 'PUBLISHED', 'ARCHIVED') DEFAULT 'DRAFT',
    published_at DATETIME NULL,
    created_by BIGINT NOT NULL,  -- User ID who created this
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (product_id) REFERENCES product(id) ON DELETE SET NULL,
    -- CASCADE will delete landing pages when the user is deleted
    FOREIGN KEY (created_by) REFERENCES users(id) ON DELETE CASCADE,
    INDEX idx_slug (slug),
    INDEX idx_status (status),
    INDEX idx_product_id (product_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Landing Page Sections Table (sections within a landing page)
CREATE TABLE landing_page_sections (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    landing_page_id BIGINT NOT NULL,
    section_type VARCHAR(50) NOT NULL,  -- e.g., 'HERO', 'BENEFITS', 'TESTIMONIALS', etc.
    section_order INT NOT NULL,  -- Order of appearance (0, 1, 2...)
    section_data JSON NOT NULL,  -- Stores all configuration for this section
    is_visible BOOLEAN DEFAULT TRUE,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (landing_page_id) REFERENCES landing_pages(id) ON DELETE CASCADE,
    INDEX idx_landing_page_order (landing_page_id, section_order)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Landing Page Settings Table (global settings for each landing page)
CREATE TABLE landing_page_settings (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    landing_page_id BIGINT NOT NULL UNIQUE,
    theme_color VARCHAR(50) DEFAULT '#ff69b4',  -- Primary brand color
    font_family VARCHAR(100) DEFAULT 'Arial, sans-serif',
    custom_css TEXT,  -- Allow advanced users to add custom CSS
    custom_js TEXT,   -- Allow advanced users to add custom JavaScript
    favicon_url VARCHAR(500),
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (landing_page_id) REFERENCES landing_pages(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Landing Page Views/Analytics (track page views)
CREATE TABLE landing_page_views (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    landing_page_id BIGINT NOT NULL,
    view_date DATE NOT NULL,
    view_count INT DEFAULT 1,
    unique_visitors INT DEFAULT 1,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (landing_page_id) REFERENCES landing_pages(id) ON DELETE CASCADE,
    UNIQUE KEY uk_landing_page_date (landing_page_id, view_date)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Add comment for documentation
ALTER TABLE landing_pages COMMENT = 'Stores landing page metadata and configuration';
ALTER TABLE landing_page_sections COMMENT = 'Stores individual sections within each landing page';
ALTER TABLE landing_page_settings COMMENT = 'Stores theme and customization settings for landing pages';
ALTER TABLE landing_page_views COMMENT = 'Tracks analytics for landing page views';

