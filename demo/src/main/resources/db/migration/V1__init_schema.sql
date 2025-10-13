-- V1__init_schema.sql
-- Initial schema creation for ecommerce application

-- ============================================
-- Core Tables
-- ============================================

-- Categories Table
CREATE TABLE IF NOT EXISTS categories (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL UNIQUE,
    description VARCHAR(500),
    image_url VARCHAR(2048)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Users Table
CREATE TABLE IF NOT EXISTS users (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    full_name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL UNIQUE,
    password VARCHAR(255),
    role VARCHAR(20) NOT NULL,
    email_confirmation BOOLEAN DEFAULT FALSE,
    confirmation_code VARCHAR(255),
    reset_password_token VARCHAR(255),
    reset_password_token_expiry DATETIME,
    INDEX idx_email (email),
    INDEX idx_role (role)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Products Table
CREATE TABLE IF NOT EXISTS product (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    price DECIMAL(19,2),
    quantity INT,
    brand VARCHAR(255),
    bestseller BOOLEAN DEFAULT FALSE,
    new_arrival BOOLEAN DEFAULT FALSE,
    has_variants BOOLEAN DEFAULT FALSE,
    is_packable BOOLEAN DEFAULT FALSE,
    type VARCHAR(10),
    category_id BIGINT NOT NULL,
    FOREIGN KEY (category_id) REFERENCES categories(id),
    INDEX idx_category (category_id),
    INDEX idx_bestseller (bestseller),
    INDEX idx_new_arrival (new_arrival),
    INDEX idx_type (type)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Product Images (ElementCollection)
CREATE TABLE IF NOT EXISTS product_images (
    product_id BIGINT NOT NULL,
    images VARCHAR(2048),
    FOREIGN KEY (product_id) REFERENCES product(id) ON DELETE CASCADE,
    INDEX idx_product (product_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================
-- Product Variants
-- ============================================

-- Variant Types Table
CREATE TABLE IF NOT EXISTS variant_type (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    product_id BIGINT NOT NULL,
    FOREIGN KEY (product_id) REFERENCES product(id) ON DELETE CASCADE,
    INDEX idx_product (product_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Variant Options Table
CREATE TABLE IF NOT EXISTS variant_option (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    value VARCHAR(255) NOT NULL,
    variant_type_id BIGINT NOT NULL,
    FOREIGN KEY (variant_type_id) REFERENCES variant_type(id) ON DELETE CASCADE,
    INDEX idx_variant_type (variant_type_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Product Variants Table
CREATE TABLE IF NOT EXISTS product_variant (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    product_id BIGINT NOT NULL,
    price DECIMAL(19,2),
    stock INT NOT NULL,
    image_url VARCHAR(2048),
    FOREIGN KEY (product_id) REFERENCES product(id) ON DELETE CASCADE,
    INDEX idx_product (product_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Product Variant Attributes (Map)
CREATE TABLE IF NOT EXISTS product_variant_attributes (
    product_variant_id BIGINT NOT NULL,
    attribute_name VARCHAR(255) NOT NULL,
    attribute_value VARCHAR(255),
    FOREIGN KEY (product_variant_id) REFERENCES product_variant(id) ON DELETE CASCADE,
    INDEX idx_variant (product_variant_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================
-- Cart System
-- ============================================

-- Cart Table
CREATE TABLE IF NOT EXISTS cart (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    user_id BIGINT NOT NULL,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    UNIQUE INDEX idx_user (user_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Cart Items Table
CREATE TABLE IF NOT EXISTS cart_item (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    cart_id BIGINT NOT NULL,
    product_id BIGINT NOT NULL,
    quantity INT NOT NULL,
    FOREIGN KEY (cart_id) REFERENCES cart(id) ON DELETE CASCADE,
    FOREIGN KEY (product_id) REFERENCES product(id),
    INDEX idx_cart (cart_id),
    INDEX idx_product (product_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================
-- Coupon System
-- ============================================

-- Coupons Table
CREATE TABLE IF NOT EXISTS coupons (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255),
    code VARCHAR(255) NOT NULL UNIQUE,
    discount_value DECIMAL(19,2),
    discount_type VARCHAR(20) NOT NULL,
    expiry_date DATETIME NOT NULL,
    type VARCHAR(20) NOT NULL,
    min_purchase_amount DECIMAL(19,2),
    usage_limit INT,
    times_used INT,
    first_time_only BOOLEAN DEFAULT FALSE,
    INDEX idx_code (code),
    INDEX idx_type (type)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Coupon Products Join Table
CREATE TABLE IF NOT EXISTS coupon_products (
    coupon_id BIGINT NOT NULL,
    product_id BIGINT NOT NULL,
    FOREIGN KEY (coupon_id) REFERENCES coupons(id) ON DELETE CASCADE,
    FOREIGN KEY (product_id) REFERENCES product(id) ON DELETE CASCADE,
    PRIMARY KEY (coupon_id, product_id),
    INDEX idx_product (product_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Coupon Categories Join Table
CREATE TABLE IF NOT EXISTS coupon_categories (
    coupon_id BIGINT NOT NULL,
    category_id BIGINT NOT NULL,
    FOREIGN KEY (coupon_id) REFERENCES coupons(id) ON DELETE CASCADE,
    FOREIGN KEY (category_id) REFERENCES categories(id) ON DELETE CASCADE,
    PRIMARY KEY (coupon_id, category_id),
    INDEX idx_category (category_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Coupon Daily Usage Table
CREATE TABLE IF NOT EXISTS coupon_daily_usage (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    coupon_id BIGINT NOT NULL,
    date DATE NOT NULL,
    usage_count INT NOT NULL,
    FOREIGN KEY (coupon_id) REFERENCES coupons(id) ON DELETE CASCADE,
    INDEX idx_coupon_date (coupon_id, date)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================
-- Order System
-- ============================================

-- Orders Table
CREATE TABLE IF NOT EXISTS orders (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    user_id BIGINT NOT NULL,
    client_full_name VARCHAR(255),
    city VARCHAR(255),
    address VARCHAR(500),
    phone_number VARCHAR(50),
    status VARCHAR(20) NOT NULL,
    created_at DATETIME,
    deleted BOOLEAN DEFAULT FALSE,
    discount_amount DECIMAL(19,2),
    coupon_id BIGINT,
    shipping_cost DECIMAL(19,2),
    FOREIGN KEY (user_id) REFERENCES users(id),
    FOREIGN KEY (coupon_id) REFERENCES coupons(id),
    INDEX idx_user (user_id),
    INDEX idx_status (status),
    INDEX idx_created_at (created_at),
    INDEX idx_deleted (deleted)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Order Items Table
CREATE TABLE IF NOT EXISTS order_item (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    order_id BIGINT NOT NULL,
    product_id BIGINT NOT NULL,
    quantity INT NOT NULL,
    price DECIMAL(19,2),
    FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE CASCADE,
    FOREIGN KEY (product_id) REFERENCES product(id),
    INDEX idx_order (order_id),
    INDEX idx_product (product_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================
-- Pack System
-- ============================================

-- Packs Table
CREATE TABLE IF NOT EXISTS packs (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    price DOUBLE NOT NULL,
    image_url VARCHAR(2048),
    hide_comment_form BOOLEAN DEFAULT FALSE,
    INDEX idx_name (name)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Pack Items Table
CREATE TABLE IF NOT EXISTS pack_items (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    pack_id BIGINT NOT NULL,
    default_product_id BIGINT NOT NULL,
    FOREIGN KEY (pack_id) REFERENCES packs(id) ON DELETE CASCADE,
    FOREIGN KEY (default_product_id) REFERENCES product(id),
    INDEX idx_pack (pack_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Pack Item Variations Join Table
CREATE TABLE IF NOT EXISTS pack_item_variations (
    pack_item_id BIGINT NOT NULL,
    product_id BIGINT NOT NULL,
    FOREIGN KEY (pack_item_id) REFERENCES pack_items(id) ON DELETE CASCADE,
    FOREIGN KEY (product_id) REFERENCES product(id) ON DELETE CASCADE,
    PRIMARY KEY (pack_item_id, product_id),
    INDEX idx_product (product_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Pack Recommended Products Join Table
CREATE TABLE IF NOT EXISTS pack_recommended_products (
    pack_id BIGINT NOT NULL,
    product_id BIGINT NOT NULL,
    FOREIGN KEY (pack_id) REFERENCES packs(id) ON DELETE CASCADE,
    FOREIGN KEY (product_id) REFERENCES product(id) ON DELETE CASCADE,
    PRIMARY KEY (pack_id, product_id),
    INDEX idx_product (product_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Pack Recommended Packs Join Table
CREATE TABLE IF NOT EXISTS pack_recommended_packs (
    pack_id BIGINT NOT NULL,
    recommended_pack_id BIGINT NOT NULL,
    FOREIGN KEY (pack_id) REFERENCES packs(id) ON DELETE CASCADE,
    FOREIGN KEY (recommended_pack_id) REFERENCES packs(id) ON DELETE CASCADE,
    PRIMARY KEY (pack_id, recommended_pack_id),
    INDEX idx_recommended (recommended_pack_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================
-- Custom Pack System
-- ============================================

-- Custom Packs Table
CREATE TABLE IF NOT EXISTS custom_pack (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    description VARCHAR(500),
    min_items INT NOT NULL,
    max_items INT NOT NULL,
    pricing_type VARCHAR(20) NOT NULL,
    fixed_price DECIMAL(19,2),
    discount_rate DECIMAL(19,2),
    INDEX idx_name (name)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Custom Pack Allowed Products Join Table
CREATE TABLE IF NOT EXISTS custom_pack_allowed_products (
    custom_pack_id BIGINT NOT NULL,
    product_id BIGINT NOT NULL,
    FOREIGN KEY (custom_pack_id) REFERENCES custom_pack(id) ON DELETE CASCADE,
    FOREIGN KEY (product_id) REFERENCES product(id) ON DELETE CASCADE,
    PRIMARY KEY (custom_pack_id, product_id),
    INDEX idx_product (product_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Pack Recommended Custom Packs Join Table
CREATE TABLE IF NOT EXISTS pack_recommended_custom_packs (
    pack_id BIGINT NOT NULL,
    custom_pack_id BIGINT NOT NULL,
    FOREIGN KEY (pack_id) REFERENCES packs(id) ON DELETE CASCADE,
    FOREIGN KEY (custom_pack_id) REFERENCES custom_pack(id) ON DELETE CASCADE,
    PRIMARY KEY (pack_id, custom_pack_id),
    INDEX idx_custom_pack (custom_pack_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================
-- Reviews and Comments
-- ============================================

-- Reviews Table
CREATE TABLE IF NOT EXISTS review (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    content TEXT,
    rating INT NOT NULL,
    approved BOOLEAN DEFAULT FALSE,
    created_by_admin BOOLEAN DEFAULT FALSE,
    custom_name VARCHAR(255),
    user_id BIGINT,
    FOREIGN KEY (user_id) REFERENCES users(id),
    INDEX idx_approved (approved),
    INDEX idx_user (user_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Comments Table
CREATE TABLE IF NOT EXISTS comment (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    content TEXT,
    score INT,
    user_id BIGINT NOT NULL,
    product_id BIGINT,
    pack_id BIGINT,
    FOREIGN KEY (user_id) REFERENCES users(id),
    FOREIGN KEY (product_id) REFERENCES product(id),
    FOREIGN KEY (pack_id) REFERENCES packs(id),
    INDEX idx_user (user_id),
    INDEX idx_product (product_id),
    INDEX idx_pack (pack_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Comment Images (ElementCollection)
CREATE TABLE IF NOT EXISTS comment_images (
    comment_id BIGINT NOT NULL,
    images VARCHAR(2048),
    FOREIGN KEY (comment_id) REFERENCES comment(id) ON DELETE CASCADE,
    INDEX idx_comment (comment_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================
-- Frequently Bought Together
-- ============================================

-- Product Frequently Bought Together Join Table
CREATE TABLE IF NOT EXISTS product_frequently_bought_together (
    product_id BIGINT NOT NULL,
    frequently_bought_id BIGINT NOT NULL,
    FOREIGN KEY (product_id) REFERENCES product(id) ON DELETE CASCADE,
    FOREIGN KEY (frequently_bought_id) REFERENCES product(id) ON DELETE CASCADE,
    PRIMARY KEY (product_id, frequently_bought_id),
    INDEX idx_frequently_bought (frequently_bought_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================
-- Settings and Configuration
-- ============================================

-- Settings Table
CREATE TABLE IF NOT EXISTS settings (
    setting_key VARCHAR(255) PRIMARY KEY,
    value TEXT
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Announcement Table
CREATE TABLE IF NOT EXISTS announcement (
    id BIGINT PRIMARY KEY,
    text VARCHAR(500),
    background_color VARCHAR(50),
    text_color VARCHAR(50),
    enabled BOOLEAN DEFAULT FALSE,
    animation_type VARCHAR(50),
    is_sticky BOOLEAN DEFAULT FALSE,
    font_weight VARCHAR(20)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Hero Table
CREATE TABLE IF NOT EXISTS hero (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(255),
    subtitle VARCHAR(500),
    link_text VARCHAR(100),
    link_url VARCHAR(2048),
    image_url VARCHAR(2048)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Countdown Table
CREATE TABLE IF NOT EXISTS countdown (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(255),
    end_date DATETIME,
    enabled BOOLEAN DEFAULT FALSE,
    background_color VARCHAR(50),
    text_color VARCHAR(50)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Notification Settings Table
CREATE TABLE IF NOT EXISTS notification_settings (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    enabled BOOLEAN NOT NULL DEFAULT FALSE,
    max_notifications INT NOT NULL DEFAULT 5,
    min_interval_seconds INT NOT NULL DEFAULT 8,
    max_interval_seconds INT NOT NULL DEFAULT 15,
    show_purchase_notifications BOOLEAN NOT NULL DEFAULT TRUE,
    show_viewing_notifications BOOLEAN NOT NULL DEFAULT TRUE,
    show_cart_notifications BOOLEAN NOT NULL DEFAULT TRUE,
    position VARCHAR(20) NOT NULL DEFAULT 'bottom-left',
    notification_duration_seconds INT NOT NULL DEFAULT 5
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Enhanced Visitor Counter Settings Table
CREATE TABLE IF NOT EXISTS enhanced_visitor_counter_settings (
    id BIGINT PRIMARY KEY,
    current_viewers_enabled BOOLEAN DEFAULT TRUE,
    current_viewers_min INT DEFAULT 5,
    current_viewers_max INT DEFAULT 25,
    total_views_enabled BOOLEAN DEFAULT TRUE,
    total_views_min INT DEFAULT 100,
    total_views_max INT DEFAULT 500,
    added_today_enabled BOOLEAN DEFAULT TRUE,
    added_today_min INT DEFAULT 1,
    added_today_max INT DEFAULT 10,
    activity_enabled BOOLEAN DEFAULT TRUE,
    activity_min INT DEFAULT 20,
    activity_max INT DEFAULT 80,
    show_bilingual_text BOOLEAN DEFAULT TRUE,
    custom_title VARCHAR(255) DEFAULT 'Live Statistics',
    background_color VARCHAR(50) DEFAULT '#f3f4f6',
    text_color VARCHAR(50) DEFAULT '#374151',
    border_color VARCHAR(50) DEFAULT '#d1d5db',
    enable_animations BOOLEAN DEFAULT TRUE,
    animation_speed INT DEFAULT 3000,
    enable_fade_effect BOOLEAN DEFAULT TRUE,
    global_enabled BOOLEAN DEFAULT TRUE,
    last_updated VARCHAR(255)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================
-- Flyway Schema History (created automatically)
-- ============================================

