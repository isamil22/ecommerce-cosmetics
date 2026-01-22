SET FOREIGN_KEY_CHECKS = 0;
-- phpMyAdmin SQL Dump
-- version 5.2.2
-- https://www.phpmyadmin.net/
--
-- Host: db
-- Generation Time: Jan 05, 2026 at 05:34 PM
-- Server version: 8.0.43
-- PHP Version: 8.2.27

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `sms`
--

-- --------------------------------------------------------

--
-- Table structure for table `announcement`
--

CREATE TABLE `announcement` (
  `id` bigint NOT NULL,
  `text` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `background_color` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `text_color` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `enabled` tinyint(1) DEFAULT '0',
  `animation_type` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `is_sticky` tinyint(1) DEFAULT '0',
  `font_weight` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `show_online_counter` tinyint(1) DEFAULT '1'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `announcement`
--

INSERT INTO `announcement` (`id`, `text`, `background_color`, `text_color`, `enabled`, `animation_type`, `is_sticky`, `font_weight`, `show_online_counter`) VALUES
(1, 'free shipping', '#ec4899', '#ffffff', 1, 'none', 0, 'normal', 1);

-- --------------------------------------------------------

--
-- Table structure for table `cart`
--

CREATE TABLE `cart` (
  `id` bigint NOT NULL,
  `user_id` bigint NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `cart`
--

INSERT INTO `cart` (`id`, `user_id`) VALUES
(1, 1);

-- --------------------------------------------------------

--
-- Table structure for table `cart_item`
--

CREATE TABLE `cart_item` (
  `id` bigint NOT NULL,
  `cart_id` bigint NOT NULL,
  `product_id` bigint DEFAULT NULL,
  `quantity` int NOT NULL,
  `product_name` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `price` decimal(38,2) DEFAULT NULL,
  `image_url` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `variant_name` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `cart_item`
--

INSERT INTO `cart_item` (`id`, `cart_id`, `product_id`, `quantity`, `product_name`, `price`, `image_url`, `variant_name`) VALUES
(37, 1, 7, 1, 'L\'Oreal Paris Elvive ', 70.00, '/api/images/products/deebcb60-d9af-4187-a874-853ebf3f7721-L-Oreal-Paris-Elvive-Dream-Lengths-Restoring-Strengthening-and-Split-End-Repair-Shampoo-Damaged-Hair-13-5-fl-oz_e76d35b8-f9ba-48b9-b8e1-2e83dd5375ee.77a69f884a5fac11e70e6619bf24689d.webp', NULL),
(38, 1, 9, 1, ' Face Sunscreen', 274.00, '/api/images/products/cd6613ef-9121-4f37-88f0-d3e0fa1751e1-81tFDbCX-BL._SL1500_.jpg', NULL);

-- --------------------------------------------------------

--
-- Table structure for table `categories`
--

CREATE TABLE `categories` (
  `id` bigint NOT NULL,
  `name` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `description` varchar(500) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `image_url` varchar(2048) COLLATE utf8mb4_unicode_ci DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `categories`
--

INSERT INTO `categories` (`id`, `name`, `description`, `image_url`) VALUES
(1, 'Skincare', 'Products for skin health.', '/api/images/categories/9b34c17d-3831-4899-b939-2735e27aa22e-61BrEdSP4xL._SX679_.jpg'),
(2, 'Makeup', 'Cosmetics for enhancing appearance.', '/api/images/categories/56d7d556-146f-4ebd-b1d6-844a78ec5477-51-JXpf4WfL._SX679_.jpg'),
(3, 'Haircare', 'Products for hair hygiene.', '/api/images/categories/7084c244-40ac-4259-951b-abf925bba3a3-L-Oreal-Paris-Elvive-Hyaluron-Plump-Hydrating-Shampoo-72H-Intense-Moisture-Squeeze-13-5-fl-oz_e4a2803d-5015-47b8-8643-1ab19af7cd62.23fb920feb98e1c163918cd85a1ae184.webp'),
(4, 'Fragrance', 'Perfumes and scented products.', '/api/images/categories/93dcabde-d4eb-48e3-85e3-ce6713a531d4-s2568350-main-zoom.webp');

-- --------------------------------------------------------

--
-- Table structure for table `comment`
--

CREATE TABLE `comment` (
  `id` bigint NOT NULL,
  `content` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `score` int DEFAULT NULL,
  `user_id` bigint NOT NULL,
  `product_id` bigint DEFAULT NULL,
  `pack_id` bigint DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `comment`
--

INSERT INTO `comment` (`id`, `content`, `score`, `user_id`, `product_id`, `pack_id`) VALUES
(1, 'this  good pack i buy im very happy \r\n ', 5, 3, NULL, 2),
(3, 'great product', 5, 5, 8, NULL),
(5, 'beautiful product', 5, 7, 7, NULL);

-- --------------------------------------------------------

--
-- Table structure for table `comment_images`
--

CREATE TABLE `comment_images` (
  `comment_id` bigint NOT NULL,
  `images` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `comment_images`
--

INSERT INTO `comment_images` (`comment_id`, `images`) VALUES
(5, '/api/images/comments/dbcfc282-07dd-404e-9c5c-2b72b3adce7c-s2568350-main-zoom.webp'),
(5, '/api/images/comments/6bc912d4-2c7b-49a5-80a1-9ad3968ed9b7-68062-20833f.webp'),
(3, '/api/images/comments/1f5b1430-0308-4403-b268-f0047bf4efef-51-JXpf4WfL._SX679_.jpg'),
(3, '/api/images/comments/d97c3f1b-3067-43bd-b61d-650a12413db2-81tFDbCX-BL._SL1500_.jpg'),
(1, '/api/images/comments/0fe6c660-d23c-4fe4-9b49-6e9c410d32f6-L-Oreal-Paris-Elvive-Dream-Lengths-Restoring-Strengthening-and-Split-End-Repair-Shampoo-Damaged-Hair-13-5-fl-oz_e76d35b8-f9ba-48b9-b8e1-2e83dd5375ee.77a69f884a5fac11e70e6619bf24689d.webp');

-- --------------------------------------------------------

--
-- Table structure for table `countdown`
--

CREATE TABLE `countdown` (
  `id` bigint NOT NULL,
  `title` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `end_date` datetime DEFAULT NULL,
  `enabled` tinyint(1) DEFAULT '0',
  `background_color` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `text_color` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `border_color` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `timer_box_color` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `timer_text_color` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `urgent_bg_color` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `urgent_text_color` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `subtitle` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `urgent_message` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `expired_message` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `pack_name` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `show_days` tinyint(1) DEFAULT '0',
  `show_hours` tinyint(1) DEFAULT '1',
  `show_minutes` tinyint(1) DEFAULT '1',
  `show_seconds` tinyint(1) DEFAULT '1',
  `show_pack_name` tinyint(1) DEFAULT '1',
  `show_subtitle` tinyint(1) DEFAULT '1',
  `enable_pulse` tinyint(1) DEFAULT '1',
  `enable_bounce` tinyint(1) DEFAULT '1',
  `urgent_threshold` int DEFAULT '3600',
  `border_radius` int DEFAULT '12',
  `padding` int DEFAULT '16',
  `font_size` int DEFAULT '18',
  `timer_font_size` int DEFAULT '24',
  `use_default_design` tinyint(1) DEFAULT '0'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `coupons`
--

CREATE TABLE `coupons` (
  `id` bigint NOT NULL,
  `name` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `code` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `discount_value` decimal(38,2) DEFAULT NULL,
  `discount_type` varchar(20) COLLATE utf8mb4_unicode_ci NOT NULL,
  `expiry_date` datetime NOT NULL,
  `type` varchar(20) COLLATE utf8mb4_unicode_ci NOT NULL,
  `min_purchase_amount` decimal(38,2) DEFAULT NULL,
  `usage_limit` int DEFAULT NULL,
  `times_used` int DEFAULT NULL,
  `first_time_only` tinyint(1) DEFAULT '0'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `coupons`
--

INSERT INTO `coupons` (`id`, `name`, `code`, `discount_value`, `discount_type`, `expiry_date`, `type`, `min_purchase_amount`, `usage_limit`, `times_used`, `first_time_only`) VALUES
(1, 'offer of the month', '1234', 10.00, 'FIXED_AMOUNT', '2025-12-29 23:00:00', 'USER', NULL, 10, 2, 0);

-- --------------------------------------------------------

--
-- Table structure for table `coupon_categories`
--

CREATE TABLE `coupon_categories` (
  `coupon_id` bigint NOT NULL,
  `category_id` bigint NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `coupon_daily_usage`
--

CREATE TABLE `coupon_daily_usage` (
  `id` bigint NOT NULL,
  `coupon_id` bigint NOT NULL,
  `date` date NOT NULL,
  `usage_count` int NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `coupon_products`
--

CREATE TABLE `coupon_products` (
  `coupon_id` bigint NOT NULL,
  `product_id` bigint NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `custom_pack`
--

CREATE TABLE `custom_pack` (
  `id` bigint NOT NULL,
  `name` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `description` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `min_items` int NOT NULL,
  `max_items` int NOT NULL,
  `pricing_type` varchar(20) COLLATE utf8mb4_unicode_ci NOT NULL,
  `fixed_price` decimal(38,2) DEFAULT NULL,
  `discount_rate` decimal(38,2) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `custom_pack`
--

INSERT INTO `custom_pack` (`id`, `name`, `description`, `min_items`, `max_items`, `pricing_type`, `fixed_price`, `discount_rate`) VALUES
(2, 'Custom Pack ', 'أحببت الاهتمام بالتفاصيل والوصف الدقيق لكل منتج؛ النتائج على بشرتي كانت ممتازة. تجربة شراء سلسة وسأكرر الطلب بالتأكيد.\n', 1, 3, 'FIXED', 200.00, NULL);

-- --------------------------------------------------------

--
-- Table structure for table `custom_pack_allowed_products`
--

CREATE TABLE `custom_pack_allowed_products` (
  `custom_pack_id` bigint NOT NULL,
  `product_id` bigint NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `custom_pack_allowed_products`
--

INSERT INTO `custom_pack_allowed_products` (`custom_pack_id`, `product_id`) VALUES
(2, 7),
(2, 8),
(2, 9),
(2, 10);

-- --------------------------------------------------------

--
-- Table structure for table `enhanced_visitor_counter_settings`
--

CREATE TABLE `enhanced_visitor_counter_settings` (
  `id` bigint NOT NULL,
  `current_viewers_enabled` tinyint(1) DEFAULT '1',
  `current_viewers_min` int DEFAULT '5',
  `current_viewers_max` int DEFAULT '25',
  `total_views_enabled` tinyint(1) DEFAULT '1',
  `total_views_min` int DEFAULT '100',
  `total_views_max` int DEFAULT '500',
  `added_today_enabled` tinyint(1) DEFAULT '1',
  `added_today_min` int DEFAULT '1',
  `added_today_max` int DEFAULT '10',
  `activity_enabled` tinyint(1) DEFAULT '1',
  `activity_min` int DEFAULT '20',
  `activity_max` int DEFAULT '80',
  `show_bilingual_text` tinyint(1) DEFAULT '1',
  `custom_title` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT 'Live Statistics',
  `background_color` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `text_color` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `border_color` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `enable_animations` tinyint(1) DEFAULT '1',
  `animation_speed` int DEFAULT '3000',
  `enable_fade_effect` tinyint(1) DEFAULT '1',
  `global_enabled` tinyint(1) DEFAULT '1',
  `last_updated` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `enhanced_visitor_counter_settings`
--

INSERT INTO `enhanced_visitor_counter_settings` (`id`, `current_viewers_enabled`, `current_viewers_min`, `current_viewers_max`, `total_views_enabled`, `total_views_min`, `total_views_max`, `added_today_enabled`, `added_today_min`, `added_today_max`, `activity_enabled`, `activity_min`, `activity_max`, `show_bilingual_text`, `custom_title`, `background_color`, `text_color`, `border_color`, `enable_animations`, `animation_speed`, `enable_fade_effect`, `global_enabled`, `last_updated`) VALUES
(1, 1, 5, 25, 1, 100, 500, 1, 1, 10, 1, 20, 80, 1, 'Live Statistics', '#f3f4f6', '#374151', '#d1d5db', 1, 3000, 1, 1, '2025-12-07T20:01:56.066206995');

-- --------------------------------------------------------

--
-- Table structure for table `flyway_schema_history`
--

CREATE TABLE `flyway_schema_history` (
  `installed_rank` int NOT NULL,
  `version` varchar(50) DEFAULT NULL,
  `description` varchar(200) NOT NULL,
  `type` varchar(20) NOT NULL,
  `script` varchar(1000) NOT NULL,
  `checksum` int DEFAULT NULL,
  `installed_by` varchar(100) NOT NULL,
  `installed_on` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `execution_time` int NOT NULL,
  `success` tinyint(1) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `flyway_schema_history`
--

INSERT INTO `flyway_schema_history` (`installed_rank`, `version`, `description`, `type`, `script`, `checksum`, `installed_by`, `installed_on`, `execution_time`, `success`) VALUES
(1, '1', 'init schema', 'SQL', 'V1__init_schema.sql', -1821377187, 'user', '2025-12-07 19:50:37', 7170, 1),
(2, '2', 'add rbac system', 'SQL', 'V2__add_rbac_system.sql', -2080641429, 'user', '2025-12-07 19:50:38', 942, 1),
(3, '3', 'add show online counter to announcement', 'SQL', 'V3__add_show_online_counter_to_announcement.sql', 117103500, 'user', '2025-12-07 19:50:38', 305, 1),
(4, '4', 'add countdown enhancement fields', 'SQL', 'V4__add_countdown_enhancement_fields.sql', 1755810258, 'user', '2025-12-07 19:50:45', 6835, 1),
(5, '5', 'add default design field', 'SQL', 'V5__add_default_design_field.sql', 76558964, 'user', '2025-12-07 19:50:45', 277, 1),
(6, '6', 'add order feedback table', 'SQL', 'V6__add_order_feedback_table.sql', 71595621, 'user', '2025-12-07 19:50:46', 340, 1),
(7, '7', 'add deleted column to product', 'SQL', 'V7__add_deleted_column_to_product.sql', -344808569, 'user', '2025-12-07 19:50:46', 548, 1),
(8, '8', 'fix pack description column', 'SQL', 'V8__fix_pack_description_column.sql', 152945087, 'user', '2025-12-07 19:50:47', 547, 1),
(9, '9', 'add notification toggle columns', 'SQL', 'V9__add_notification_toggle_columns.sql', 545576377, 'user', '2025-12-07 19:52:52', 1262, 1),
(10, '10', 'add product display settings', 'SQL', 'V10__add_product_display_settings.sql', -2084079982, 'user', '2025-12-07 23:08:51', 772, 1),
(11, '11', 'create landing pages tables', 'SQL', 'V11__create_landing_pages_tables.sql', 292905776, 'user', '2025-12-09 14:37:54', 242, 1),
(12, '12', 'add landing page permissions', 'SQL', 'V12__add_landing_page_permissions.sql', 0, 'user', '2025-12-09 15:05:00', 0, 1),
(13, '13', 'allow null product id', 'SQL', 'V13__allow_null_product_id.sql', 1639726683, 'user', '2025-12-10 12:41:56', 199, 1),
(14, '14', 'virtual products', 'SQL', 'V14__virtual_products.sql', -1622370870, 'user', '2025-12-13 18:44:47', 1562, 1);
-- --------------------------------------------------------

--
-- Table structure for table `hero`
--

CREATE TABLE `hero` (
  `id` bigint NOT NULL,
  `title` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `subtitle` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `link_text` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `link_url` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `image_url` text COLLATE utf8mb4_unicode_ci
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `hero`
--

INSERT INTO `hero` (`id`, `title`, `subtitle`, `link_text`, `link_url`, `image_url`) VALUES
(1, 'Default Title', 'Default Subtitle', 'Shop Now', '/products', '/api/images/hero/352e267b-caf1-488d-aeee-596b7f9254d0-711w0mQpVXL._SL1500_.jpg');

-- --------------------------------------------------------

--
-- Table structure for table `landing_pages`
--

CREATE TABLE `landing_pages` (
  `id` bigint NOT NULL,
  `product_id` bigint DEFAULT NULL,
  `title` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `slug` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `meta_title` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `meta_description` text COLLATE utf8mb4_unicode_ci,
  `status` enum('DRAFT','PUBLISHED','ARCHIVED') COLLATE utf8mb4_unicode_ci DEFAULT 'DRAFT',
  `published_at` datetime DEFAULT NULL,
  `created_by` bigint NOT NULL,
  `created_at` datetime DEFAULT CURRENT_TIMESTAMP,
  `updated_at` datetime DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='Stores landing page metadata and configuration';

--
-- Dumping data for table `landing_pages`
--

INSERT INTO `landing_pages` (`id`, `product_id`, `title`, `slug`, `meta_title`, `meta_description`, `status`, `published_at`, `created_by`, `created_at`, `updated_at`) VALUES
(1, 6, 'onther test ', 'onther-test', '', '', 'PUBLISHED', NULL, 1, '2025-12-09 18:05:25', '2025-12-13 16:37:54'),
(3, 6, 'onther test  (Copy)', 'duplicate', '', '', 'PUBLISHED', NULL, 1, '2025-12-14 15:00:52', '2025-12-14 15:39:54');

-- --------------------------------------------------------

--
-- Table structure for table `landing_page_sections`
--

CREATE TABLE `landing_page_sections` (
  `id` bigint NOT NULL,
  `landing_page_id` bigint NOT NULL,
  `section_type` varchar(50) COLLATE utf8mb4_unicode_ci NOT NULL,
  `section_order` int NOT NULL,
  `section_data` json NOT NULL,
  `is_visible` tinyint(1) DEFAULT '1',
  `created_at` datetime DEFAULT CURRENT_TIMESTAMP,
  `updated_at` datetime DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='Stores individual sections within each landing page';

--
-- Dumping data for table `landing_page_sections`
--

INSERT INTO `landing_page_sections` (`id`, `landing_page_id`, `section_type`, `section_order`, `section_data`, `is_visible`, `created_at`, `updated_at`) VALUES
(750, 1, 'HERO_PREMIUM', 0, '{\"badge\": \"New Arrival\", \"ctaLink\": \"#shop\", \"ctaText\": \"Shop Now\", \"headline\": \"Love your bits...\", \"textColor\": \"#cf89c6\", \"titleBack\": \"SKIN CARE\", \"subheadline\": \"(and your bod)\", \"productImage\": \"/api/images/products/e60a184a-7a31-4364-9810-fe1be869e3c6-612E3HnCTrL._SL1500_ (1).png\", \"backgroundColor\": \"#e6e6fa\", \"backgroundImage\": \"/api/images/products/b7745e9c-e2d5-4ba3-8857-a80ec667d7f1-71TxeDeprHL._SL1500_.jpg\"}', 1, '2025-12-14 14:05:33', '2025-12-14 14:05:33'),
(751, 1, 'PRODUCT_SHOWCASE', 1, '{\"image\": \"/api/images/products/cb97425b-2f2e-481b-9b32-42d60507ddbc-612E3HnCTrL._SL1500_.jpg\", \"price\": \"50$\", \"title\": \"prosuct Vaslo\", \"ctaText\": \"Buy Now\", \"features\": [\"Premium Quality\", \"Fast Results\", \"Natural Formula\"], \"variants\": [{\"name\": \"Color\", \"options\": [\"purple\", \"orange\"]}, {\"name\": \"size\", \"options\": [\"50ml\", \"100ml\"]}], \"productId\": \"NONE\", \"description\": \"is good product to try jsut for you \", \"imagePosition\": \"left\", \"optionVisuals\": {\"size:50ml\": {\"image\": \"/api/images/products/2a22bef4-a727-4cd2-b1a1-8c55ab089b92-s2356160-main-zoom.png\"}, \"size:100ml\": {\"image\": \"/api/images/products/9cc3c6fe-237b-490f-8b83-ff13dc75f7d9-s2356160-main-zoom.png\"}, \"Color:orange\": {\"color\": \"#ecb25b\", \"image\": \"/api/images/products/e7497235-4ce6-4df3-8891-fbfda079d112-s2356160-main-zoom.png\"}, \"Color:purple\": {\"color\": \"#ba2ba1\", \"image\": \"/api/images/products/ab897f9b-0f3b-4c37-985a-8d23e0bfe2aa-612E3HnCTrL._SL1500_ (1).png\"}, \"New Variant:orange\": {\"color\": \"#eab971\", \"image\": \"/api/images/products/5c117259-df61-43db-b65d-0b277209ce58-s2356160-main-zoom.png\"}, \"New Variant:purple\": {\"color\": \"#b52598\", \"image\": \"/api/images/products/6dc82b7c-cea9-4724-a4e5-d6b355c207cf-612E3HnCTrL._SL1500_ (1).png\"}, \"New Variant:Option 1\": {\"color\": \"#bb2b9d\", \"image\": \"/api/images/products/9bf5f5ca-807c-445a-8611-8f783a80ae8a-612E3HnCTrL._SL1500_ (1).png\"}, \"New Variant:Option 2\": {\"color\": \"#fe990b\", \"image\": \"/api/images/products/359a1731-9e78-4c28-9406-8fdfd3241f8f-s2356160-main-zoom.png\"}}, \"originalPrice\": \"$99\", \"backgroundColor\": \"#fafafa\"}', 1, '2025-12-14 14:05:33', '2025-12-14 14:05:33'),
(752, 1, 'BEFORE_AFTER', 2, '{\"title\": \"See The Transformation\", \"subtitle\": \"Real results from real customers\", \"comparisons\": [{\"caption\": \"Results after 4 weeks\", \"afterImage\": \"/api/images/products/a8692cf7-3620-443e-ae9b-f38b13dd6b9a-711w0mQpVXL._SL1500_.png\", \"afterLabel\": \"After\", \"beforeImage\": \"/api/images/products/32123b03-896f-4c60-96db-8c84f2f1a490-711w0mQpVXL._SL1500_wqfrefewf.png\", \"beforeLabel\": \"Before\"}], \"backgroundColor\": \"#ffffff\"}', 1, '2025-12-14 14:05:33', '2025-12-14 14:05:33'),
(753, 1, 'FEATURES_ZIGZAG', 3, '{\"features\": [{\"image\": \"/api/images/products/73c493fe-3cb2-4329-8eea-42746b18cf8c-71nEZgQp36L._SL1500_.jpg\", \"title\": \"Every Apps you wanted\", \"description\": \"You won\'t just send and receive messages, calls, and mail more easily and efficiently. Your express yourself in unique, fun, and more personal ways.\"}, {\"image\": \"/api/images/products/8baaf494-8e6e-46ec-8c90-d842d22a49b5-71DMWAmP6gL._SL1500_.jpg\", \"title\": \"Health and Fitness\", \"description\": \"Fitness isn\'t just about running, biking, or hitting the gym. It\'s also about being active throughout the day.\"}], \"textColor\": \"#333333\", \"backgroundColor\": \"#ffffff\"}', 1, '2025-12-14 14:05:33', '2025-12-14 14:05:33'),
(754, 1, 'INGREDIENTS', 4, '{\"title\": \"Why Need This \", \"layout\": \"ingredients\", \"benefits\": [{\"icon\": \"⭐\", \"image\": \"/api/images/products/f9d72cc1-ba82-4e2d-97ab-72b88f745778-collagen.png\", \"title\": \"Hydrolyzed Collagen\", \"description\": \"Boosts skin elasticity and hydration by penetrating deeper into the skin.\"}, {\"icon\": \"⭐\", \"image\": \"/api/images/products/76bcb0a2-b079-4d29-a134-ab1c4c530889-pdrn-polydeoxyribonucleotide-serum-skin-care-cosmetic-dna-salmon-free-vector.jpg\", \"title\": \"PDRN Serum\", \"description\": \"A regenerative compound often derived from salmon DNA, used to repair skin and improve texture.\"}, {\"icon\": \"⭐\", \"image\": \"/api/images/products/fb8eeb42-a152-47bd-b050-0165cb7e6dfa-6f516ec6-d997-4b37-9cff-5898c68718e0.jpg\", \"title\": \"Niacinamide (Vitamin B3)\", \"description\": \"Brightens skin tone, reduces inflammation, and strengthens the skin barrier.\"}], \"backgroundStyle\": \"gradient-pink\"}', 1, '2025-12-14 14:05:33', '2025-12-14 14:05:33'),
(755, 1, 'HOW_IT_WORKS', 5, '{\"title\": \"How To Use \", \"layout\": \"ingredients\", \"benefits\": [{\"icon\": \"\", \"image\": \"/api/images/products/564ffc2b-2c4c-47ce-999e-021aa7687350-cleanser.png\", \"title\": \"Cleanse & Prep\", \"description\": \"• \\tWash your face with a gentle cleanser to remove dirt and oil.\\n• \\tPat dry with a clean towel.\\n• \\tOptional: Apply toner to balance your skin’s pH.\"}, {\"icon\": \"⭐\", \"image\": \"/api/images/products/6b578bc6-d8f6-448c-b05a-11043b66c93e-icons8-spa-mask-100.png\", \"title\": \"Apply the Mask\", \"description\": \"• \\tSqueeze a thin, even layer of the mask onto your fingertips.\\n• \\tSpread it across your face, avoiding eyes and lips.\\n• \\tLet it sit for 15–20 minutes or as directed (some versions are overnight masks).\"}, {\"icon\": \"⭐\", \"image\": \"/api/images/products/4524173d-11fe-48df-bade-d4ebd3612431-icons8-cosmetic-skin-treatment-78.png\", \"title\": \"Remove & Moisturize\", \"description\": \"• \\tIf it\'s a peel-off mask: gently peel from the edges.\\n• \\tIf it\'s a rinse-off: wash with lukewarm water.\\n• \\tFinish with a lightweight moisturizer to lock in hydration.\"}], \"backgroundStyle\": \"gradient-gold\"}', 1, '2025-12-14 14:05:33', '2025-12-14 14:05:33'),
(756, 1, 'TESTIMONIALS', 6, '{\"title\": \"What Our Customers Say\", \"subtitle\": \"Real reviews from real customers\", \"testimonials\": [{\"name\": \"Jane Doe\", \"rating\": 5, \"comment\": \"This product changed my life!\", \"productImages\": [\"/api/images/products/3f92ee51-e597-4110-9f77-9b5526a107d8-711XgXFE7GL._SL1500_.jpg\"]}, {\"name\": \"John Smith\", \"rating\": 5, \"comment\": \"Amazing quality and fast shipping.\", \"productImages\": [\"/api/images/products/55a15746-66d8-432a-9e3d-0ef41fa97141-71gvjdiWEBL._SL1500_.jpg\"]}], \"backgroundColor\": \"#ffffff\"}', 1, '2025-12-14 14:05:33', '2025-12-14 14:05:33'),
(757, 1, 'FAQ', 7, '{\"faqs\": [{\"answer\": \"Delivery takes 3-5 business days.\", \"question\": \"How long does shipping take?\"}, {\"answer\": \"We offer a 30-day money-back guarantee.\", \"question\": \"What is your return policy?\"}], \"title\": \"Frequently Asked Questions\", \"backgroundColor\": \"#fafafa\"}', 1, '2025-12-14 14:05:33', '2025-12-14 14:05:33'),
(758, 1, 'URGENCY_BANNER', 8, '{\"title\": \"LIMITED TIME OFFER!\", \"ctaLink\": \"#order\", \"ctaText\": \"Claim Your Discount\", \"message\": \"Offer ends soon\", \"discount\": \"20% OFF\", \"textColor\": \"#ffffff\", \"backgroundColor\": \"#ff69b4\"}', 1, '2025-12-14 14:05:33', '2025-12-14 14:05:33'),
(759, 1, 'FINAL_CTA', 9, '{\"title\": \"Ready to Transform Your Life?\", \"ctaLink\": \"#order\", \"ctaText\": \"Buy Now - $49.99\", \"subtitle\": \"Join thousands of satisfied customers\", \"trustBadges\": [\"Free Shipping\", \"30-Day Money Back\", \"Secure Checkout\"], \"backgroundColor\": \"#ffffff\"}', 1, '2025-12-14 14:05:33', '2025-12-14 14:05:33'),
(760, 1, 'RELATED_PRODUCTS', 10, '{\"title\": \"You Might Also Like\", \"subtitle\": \"Perfect additions to your routine\", \"productIds\": [1, 2, 3, 5], \"backgroundColor\": \"#f9f9f9\"}', 1, '2025-12-14 14:05:33', '2025-12-14 14:05:33'),
(783, 3, 'HERO_PREMIUM', 0, '{\"badge\": \"New Arrival\", \"ctaLink\": \"#shop\", \"ctaText\": \"Shop Now\", \"headline\": \"Love your bits...\", \"textColor\": \"#cf89c6\", \"titleBack\": \"SKIN CARE\", \"subheadline\": \"(and your bod)\", \"productImage\": \"/api/images/products/e60a184a-7a31-4364-9810-fe1be869e3c6-612E3HnCTrL._SL1500_ (1).png\", \"backgroundColor\": \"#e6e6fa\", \"backgroundImage\": \"/api/images/products/b7745e9c-e2d5-4ba3-8857-a80ec667d7f1-71TxeDeprHL._SL1500_.jpg\"}', 1, '2025-12-14 18:55:39', '2025-12-14 18:55:39'),
(784, 3, 'PRODUCT_SHOWCASE', 1, '{\"image\": \"/api/images/products/cb97425b-2f2e-481b-9b32-42d60507ddbc-612E3HnCTrL._SL1500_.jpg\", \"price\": \"50$\", \"title\": \"prosuct Vaslo\", \"ctaText\": \"Buy Now\", \"features\": [\"Premium Quality\", \"Fast Results\", \"Natural Formula\"], \"variants\": [{\"name\": \"Color\", \"options\": [\"purple\", \"orange\"]}, {\"name\": \"size\", \"options\": [\"50ml\", \"100ml\"]}], \"productId\": \"NONE\", \"description\": \"is good product to try jsut for you \", \"imagePosition\": \"left\", \"optionVisuals\": {\"size:50ml\": {\"image\": \"/api/images/products/2a22bef4-a727-4cd2-b1a1-8c55ab089b92-s2356160-main-zoom.png\"}, \"size:100ml\": {\"image\": \"/api/images/products/9cc3c6fe-237b-490f-8b83-ff13dc75f7d9-s2356160-main-zoom.png\"}, \"Color:orange\": {\"color\": \"#ecb25b\", \"image\": \"/api/images/products/e7497235-4ce6-4df3-8891-fbfda079d112-s2356160-main-zoom.png\"}, \"Color:purple\": {\"color\": \"#ba2ba1\", \"image\": \"/api/images/products/ab897f9b-0f3b-4c37-985a-8d23e0bfe2aa-612E3HnCTrL._SL1500_ (1).png\"}, \"New Variant:orange\": {\"color\": \"#eab971\", \"image\": \"/api/images/products/5c117259-df61-43db-b65d-0b277209ce58-s2356160-main-zoom.png\"}, \"New Variant:purple\": {\"color\": \"#b52598\", \"image\": \"/api/images/products/6dc82b7c-cea9-4724-a4e5-d6b355c207cf-612E3HnCTrL._SL1500_ (1).png\"}, \"New Variant:Option 1\": {\"color\": \"#bb2b9d\", \"image\": \"/api/images/products/9bf5f5ca-807c-445a-8611-8f783a80ae8a-612E3HnCTrL._SL1500_ (1).png\"}, \"New Variant:Option 2\": {\"color\": \"#fe990b\", \"image\": \"/api/images/products/359a1731-9e78-4c28-9406-8fdfd3241f8f-s2356160-main-zoom.png\"}}, \"originalPrice\": \"$99\", \"backgroundColor\": \"#fafafa\"}', 1, '2025-12-14 18:55:39', '2025-12-14 18:55:39'),
(785, 3, 'HOW_IT_WORKS', 2, '{\"title\": \"How To Use \", \"layout\": \"ingredients\", \"benefits\": [{\"icon\": \"\", \"image\": \"/api/images/products/564ffc2b-2c4c-47ce-999e-021aa7687350-cleanser.png\", \"title\": \"Cleanse & Prep\", \"description\": \"• \\tWash your face with a gentle cleanser to remove dirt and oil.\\n• \\tPat dry with a clean towel.\\n• \\tOptional: Apply toner to balance your skin’s pH.\"}, {\"icon\": \"⭐\", \"image\": \"/api/images/products/6b578bc6-d8f6-448c-b05a-11043b66c93e-icons8-spa-mask-100.png\", \"title\": \"Apply the Mask\", \"description\": \"• \\tSqueeze a thin, even layer of the mask onto your fingertips.\\n• \\tSpread it across your face, avoiding eyes and lips.\\n• \\tLet it sit for 15–20 minutes or as directed (some versions are overnight masks).\"}, {\"icon\": \"⭐\", \"image\": \"/api/images/products/4524173d-11fe-48df-bade-d4ebd3612431-icons8-cosmetic-skin-treatment-78.png\", \"title\": \"Remove & Moisturize\", \"description\": \"• \\tIf it\'s a peel-off mask: gently peel from the edges.\\n• \\tIf it\'s a rinse-off: wash with lukewarm water.\\n• \\tFinish with a lightweight moisturizer to lock in hydration.\"}], \"backgroundStyle\": \"gradient-gold\"}', 1, '2025-12-14 18:55:39', '2025-12-14 18:55:39'),
(786, 3, 'BEFORE_AFTER', 3, '{\"title\": \"See The Transformation\", \"subtitle\": \"Real results from real customers\", \"comparisons\": [{\"caption\": \"Results after 4 weeks\", \"afterImage\": \"/api/images/products/a8692cf7-3620-443e-ae9b-f38b13dd6b9a-711w0mQpVXL._SL1500_.png\", \"afterLabel\": \"After\", \"beforeImage\": \"/api/images/products/32123b03-896f-4c60-96db-8c84f2f1a490-711w0mQpVXL._SL1500_wqfrefewf.png\", \"beforeLabel\": \"Before\"}], \"backgroundColor\": \"#ffffff\"}', 1, '2025-12-14 18:55:39', '2025-12-14 18:55:39'),
(787, 3, 'FEATURES_ZIGZAG', 4, '{\"features\": [{\"image\": \"/api/images/products/73c493fe-3cb2-4329-8eea-42746b18cf8c-71nEZgQp36L._SL1500_.jpg\", \"title\": \"Every Apps you wanted\", \"description\": \"You won\'t just send and receive messages, calls, and mail more easily and efficiently. Your express yourself in unique, fun, and more personal ways.\"}, {\"image\": \"/api/images/products/8baaf494-8e6e-46ec-8c90-d842d22a49b5-71DMWAmP6gL._SL1500_.jpg\", \"title\": \"Health and Fitness\", \"description\": \"Fitness isn\'t just about running, biking, or hitting the gym. It\'s also about being active throughout the day.\"}], \"textColor\": \"#333333\", \"backgroundColor\": \"#ffffff\"}', 1, '2025-12-14 18:55:39', '2025-12-14 18:55:39'),
(788, 3, 'INGREDIENTS', 5, '{\"title\": \"Why Need This \", \"layout\": \"ingredients\", \"benefits\": [{\"icon\": \"⭐\", \"image\": \"/api/images/products/f9d72cc1-ba82-4e2d-97ab-72b88f745778-collagen.png\", \"title\": \"Hydrolyzed Collagen\", \"description\": \"Boosts skin elasticity and hydration by penetrating deeper into the skin.\"}, {\"icon\": \"⭐\", \"image\": \"/api/images/products/76bcb0a2-b079-4d29-a134-ab1c4c530889-pdrn-polydeoxyribonucleotide-serum-skin-care-cosmetic-dna-salmon-free-vector.jpg\", \"title\": \"PDRN Serum\", \"description\": \"A regenerative compound often derived from salmon DNA, used to repair skin and improve texture.\"}, {\"icon\": \"⭐\", \"image\": \"/api/images/products/fb8eeb42-a152-47bd-b050-0165cb7e6dfa-6f516ec6-d997-4b37-9cff-5898c68718e0.jpg\", \"title\": \"Niacinamide (Vitamin B3)\", \"description\": \"Brightens skin tone, reduces inflammation, and strengthens the skin barrier.\"}], \"backgroundStyle\": \"gradient-pink\"}', 1, '2025-12-14 18:55:39', '2025-12-14 18:55:39'),
(789, 3, 'TESTIMONIALS', 6, '{\"title\": \"What Our Customers Say\", \"subtitle\": \"Real reviews from real customers\", \"testimonials\": [{\"name\": \"Jane Doe\", \"rating\": 5, \"comment\": \"This product changed my life!\", \"productImages\": [\"/api/images/products/3f92ee51-e597-4110-9f77-9b5526a107d8-711XgXFE7GL._SL1500_.jpg\"]}, {\"name\": \"John Smith\", \"rating\": 5, \"comment\": \"Amazing quality and fast shipping.\", \"productImages\": [\"/api/images/products/55a15746-66d8-432a-9e3d-0ef41fa97141-71gvjdiWEBL._SL1500_.jpg\"]}], \"backgroundColor\": \"#ffffff\"}', 1, '2025-12-14 18:55:39', '2025-12-14 18:55:39'),
(790, 3, 'FAQ', 7, '{\"faqs\": [{\"answer\": \"Delivery takes 3-5 business days.\", \"question\": \"How long does shipping take?\"}, {\"answer\": \"We offer a 30-day money-back guarantee.\", \"question\": \"What is your return policy?\"}], \"title\": \"Frequently Asked Questions\", \"backgroundColor\": \"#fafafa\"}', 1, '2025-12-14 18:55:39', '2025-12-14 18:55:39'),
(791, 3, 'URGENCY_BANNER', 8, '{\"title\": \"LIMITED TIME OFFER!\", \"ctaLink\": \"#order\", \"ctaText\": \"Claim Your Discount\", \"message\": \"Offer ends soon\", \"discount\": \"20% OFF\", \"textColor\": \"#ffffff\", \"backgroundColor\": \"#ff69b4\"}', 1, '2025-12-14 18:55:39', '2025-12-14 18:55:39'),
(792, 3, 'RELATED_PRODUCTS', 9, '{\"title\": \"You Might Also Like\", \"subtitle\": \"Perfect additions to your routine\", \"productIds\": [1, 2, 3, 5], \"backgroundColor\": \"#f9f9f9\"}', 1, '2025-12-14 18:55:39', '2025-12-14 18:55:39'),
(793, 3, 'FINAL_CTA', 10, '{\"title\": \"Ready to Transform Your Life?\", \"ctaLink\": \"#order\", \"ctaText\": \"Buy Now - $49.99\", \"subtitle\": \"Join thousands of satisfied customers\", \"trustBadges\": [\"Free Shipping\", \"30-Day Money Back\", \"Secure Checkout\"], \"backgroundColor\": \"#ffffff\"}', 1, '2025-12-14 18:55:39', '2025-12-14 18:55:39');

-- --------------------------------------------------------

--
-- Table structure for table `landing_page_settings`
--

CREATE TABLE `landing_page_settings` (
  `id` bigint NOT NULL,
  `landing_page_id` bigint NOT NULL,
  `theme_color` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `font_family` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `custom_css` text COLLATE utf8mb4_unicode_ci,
  `custom_js` text COLLATE utf8mb4_unicode_ci,
  `favicon_url` varchar(500) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `created_at` datetime DEFAULT CURRENT_TIMESTAMP,
  `updated_at` datetime DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='Stores theme and customization settings for landing pages';

--
-- Dumping data for table `landing_page_settings`
--

INSERT INTO `landing_page_settings` (`id`, `landing_page_id`, `theme_color`, `font_family`, `custom_css`, `custom_js`, `favicon_url`, `created_at`, `updated_at`) VALUES
(1, 1, '#ff69b4', 'Arial, sans-serif', '', '', '', '2025-12-09 18:05:25', '2025-12-09 18:05:25'),
(3, 3, '#ff69b4', 'Arial, sans-serif', '', '', '', '2025-12-14 15:00:52', '2025-12-14 15:00:52');

-- --------------------------------------------------------

--
-- Table structure for table `landing_page_views`
--

CREATE TABLE `landing_page_views` (
  `id` bigint NOT NULL,
  `landing_page_id` bigint NOT NULL,
  `view_date` date NOT NULL,
  `view_count` int DEFAULT '1',
  `unique_visitors` int DEFAULT '1',
  `created_at` datetime DEFAULT CURRENT_TIMESTAMP,
  `updated_at` datetime DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='Tracks analytics for landing page views';

--
-- Dumping data for table `landing_page_views`
--

INSERT INTO `landing_page_views` (`id`, `landing_page_id`, `view_date`, `view_count`, `unique_visitors`, `created_at`, `updated_at`) VALUES
(1, 1, '2025-12-09', 24, 24, '2025-12-09 18:30:59', '2025-12-09 21:57:44'),
(2, 1, '2025-12-10', 16, 16, '2025-12-10 10:59:26', '2025-12-10 23:54:00'),
(3, 1, '2025-12-11', 24, 24, '2025-12-11 00:11:05', '2025-12-11 23:39:56'),
(4, 1, '2025-12-12', 43, 43, '2025-12-12 16:19:39', '2025-12-12 23:02:00'),
(5, 1, '2025-12-13', 31, 31, '2025-12-13 00:12:52', '2025-12-13 18:58:38'),
(7, 1, '2025-12-14', 4, 4, '2025-12-14 00:48:13', '2025-12-14 14:06:23'),
(8, 3, '2025-12-14', 13, 13, '2025-12-14 15:40:01', '2025-12-14 18:35:29'),
(9, 3, '2025-12-17', 3, 3, '2025-12-17 19:49:54', '2025-12-17 19:56:33');
-- --------------------------------------------------------

--
-- Table structure for table `notification_settings`
--

CREATE TABLE `notification_settings` (
  `id` bigint NOT NULL,
  `enabled` tinyint(1) NOT NULL DEFAULT '0',
  `max_notifications` int NOT NULL DEFAULT '5',
  `min_interval_seconds` int NOT NULL DEFAULT '8',
  `max_interval_seconds` int NOT NULL DEFAULT '15',
  `show_purchase_notifications` tinyint(1) NOT NULL DEFAULT '1',
  `show_viewing_notifications` tinyint(1) NOT NULL DEFAULT '1',
  `show_cart_notifications` tinyint(1) NOT NULL DEFAULT '1',
  `position` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `notification_duration_seconds` int NOT NULL DEFAULT '5'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `orders`
--

CREATE TABLE `orders` (
  `id` bigint NOT NULL,
  `user_id` bigint NOT NULL,
  `client_full_name` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `city` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `address` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `phone_number` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `status` varchar(20) COLLATE utf8mb4_unicode_ci NOT NULL,
  `created_at` datetime DEFAULT NULL,
  `deleted` tinyint(1) DEFAULT '0',
  `discount_amount` decimal(38,2) DEFAULT NULL,
  `coupon_id` bigint DEFAULT NULL,
  `shipping_cost` decimal(38,2) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `orders`
--

INSERT INTO `orders` (`id`, `user_id`, `client_full_name`, `city`, `address`, `phone_number`, `status`, `created_at`, `deleted`, `discount_amount`, `coupon_id`, `shipping_cost`) VALUES
(1, 1, 'ismail tabat', 'Casablanca', 'Casablanca   Lissasfa bassatine', '0634062526', 'PREPARING', '2025-12-10 11:39:06', 1, 0.00, NULL, 10.00),
(2, 1, 'ismail tabat', 'Casablanca', 'Casablanca   Lissasfa bassatine', '0634062526', 'PREPARING', '2025-12-10 12:45:17', 1, 0.00, NULL, 10.00),
(3, 1, 'ismail tabat', 'Casablanca', 'Casablanca   Lissasfa bassatine', '0634062526', 'PREPARING', '2025-12-10 23:39:51', 1, 0.00, NULL, 10.00),
(4, 1, 'ismail tabat', 'Casablanca', 'Casablanca   Lissasfa bassatine', '0634062526', 'PREPARING', '2025-12-11 00:14:02', 1, 0.00, NULL, 10.00),
(5, 1, 'ismail tabat', 'Casablanca', 'Casablanca   Lissasfa bassatine', '0634062526', 'PREPARING', '2025-12-11 00:18:26', 1, 0.00, NULL, 10.00),
(6, 1, 'ismail tabat', 'Casablanca', 'Casablanca   Lissasfa bassatine', '0634062526', 'PREPARING', '2025-12-11 19:56:14', 1, 0.00, NULL, 10.00),
(7, 1, 'ismail tabat', 'Casablanca', 'Casablanca   Lissasfa bassatine', '0634062526', 'PREPARING', '2025-12-11 20:50:16', 1, 0.00, NULL, 10.00),
(8, 1, 'ismail tabat', 'Casablanca', 'Casablanca   Lissasfa bassatine', '0634062526', 'PREPARING', '2025-12-12 17:12:38', 1, 0.00, NULL, 10.00),
(9, 1, 'ismail tabat', 'Casablanca', 'Casablanca   Lissasfa bassatine', '0634062526', 'PREPARING', '2025-12-14 15:02:09', 1, 0.00, NULL, 10.00),
(10, 1, 'idfwqe', 'dwfer', 'evrvre', '2342521452152', 'PREPARING', '2025-12-14 15:49:25', 1, 0.00, NULL, 10.00),
(11, 1, 'ismail tabat', 'Casablanca', 'Casablanca   Lissasfa bassatine', '0634062526', 'PREPARING', '2025-12-14 16:07:40', 0, 0.00, NULL, 10.00),
(12, 1, 'ismail tabat', 'Casablanca', 'Casablanca   Lissasfa bassatine', '0634062526', 'PREPARING', '2025-12-14 16:08:21', 0, 0.00, NULL, 10.00),
(13, 1, 'ismail tabat', 'Casablanca', 'Casablanca   Lissasfa bassatine', '0634062526', 'PREPARING', '2025-12-16 18:44:54', 0, 0.00, NULL, 10.00),
(14, 1, 'ismail tabat', 'Casablanca', 'Casablanca   Lissasfa bassatine', '0634062526', 'PREPARING', '2025-12-17 18:21:33', 0, 10.00, 1, 10.00),
(15, 1, 'ismail tabat', 'Casablanca', 'Casablanca   Lissasfa bassatine', '0634062526', 'PREPARING', '2025-12-17 18:22:54', 0, 10.00, 1, 10.00);

-- --------------------------------------------------------

--
-- Table structure for table `order_feedback`
--

CREATE TABLE `order_feedback` (
  `id` bigint NOT NULL,
  `order_id` bigint NOT NULL,
  `user_id` bigint DEFAULT NULL,
  `rating` varchar(20) COLLATE utf8mb4_unicode_ci NOT NULL,
  `comment` text COLLATE utf8mb4_unicode_ci,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `order_feedback`
--

INSERT INTO `order_feedback` (`id`, `order_id`, `user_id`, `rating`, `comment`, `created_at`, `updated_at`) VALUES
(1, 14, 1, 'Good', NULL, '2025-12-17 18:21:38', '2025-12-17 18:21:38'),
(2, 15, 1, 'Good', NULL, '2025-12-17 18:22:57', '2025-12-17 18:22:57');

-- --------------------------------------------------------

--
-- Table structure for table `order_item`
--

CREATE TABLE `order_item` (
  `id` bigint NOT NULL,
  `order_id` bigint NOT NULL,
  `product_id` bigint DEFAULT NULL,
  `quantity` int NOT NULL,
  `price` decimal(38,2) DEFAULT NULL,
  `product_name` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `product_image` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `variant_name` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `order_item`
--

INSERT INTO `order_item` (`id`, `order_id`, `product_id`, `quantity`, `price`, `product_name`, `product_image`, `variant_name`) VALUES
(1, 1, 1, 1, 4.00, 'Porduct 1', '/api/images/products/90e6ae7a-5973-4b5c-b215-4a8afcaceae5-WhatsApp Image 2023-11-23 at 14.33.06 (1).jpeg', NULL),
(2, 2, NULL, 1, 49.99, 'Amazing Product!', '/api/images/products/59600f4e-ce9e-45a4-ad03-84975cb0d5f4-WhatsApp Image 2023-11-23 at 14.33.06.jpeg', NULL),
(3, 3, NULL, 1, 49.99, 'Amazing Product!', '/api/images/products/59600f4e-ce9e-45a4-ad03-84975cb0d5f4-WhatsApp Image 2023-11-23 at 14.33.06.jpeg', NULL),
(4, 4, NULL, 1, 0.00, 'Our Amazing Product', '/api/images/products/5ed98fa5-776f-4771-8480-c6b32b9ffe13-WhatsApp Image 2023-11-23 at 14.33.07 (14).jpeg', 'Color: Red'),
(5, 5, NULL, 1, 0.00, 'Our Amazing Product', '/api/images/products/5ed98fa5-776f-4771-8480-c6b32b9ffe13-WhatsApp Image 2023-11-23 at 14.33.07 (14).jpeg', 'Color: Red'),
(6, 6, NULL, 1, 50.00, 'Our Amazing Product', '/api/images/products/cb97425b-2f2e-481b-9b32-42d60507ddbc-612E3HnCTrL._SL1500_.jpg', 'Size: pruple'),
(7, 7, NULL, 1, 50.00, 'Our Amazing Product', '/api/images/products/cb97425b-2f2e-481b-9b32-42d60507ddbc-612E3HnCTrL._SL1500_.jpg', 'Color: orange'),
(8, 8, NULL, 1, 50.00, 'Our Amazing Product', '/api/images/products/cb97425b-2f2e-481b-9b32-42d60507ddbc-612E3HnCTrL._SL1500_.jpg', 'Color: purple, size: 50ml'),
(9, 9, NULL, 1, 50.00, 'prosuct Vaslo', '/api/images/products/cb97425b-2f2e-481b-9b32-42d60507ddbc-612E3HnCTrL._SL1500_.jpg', 'Color: purple, size: 50ml'),
(10, 10, NULL, 1, 50.00, 'prosuct Vaslo', '/api/images/products/cb97425b-2f2e-481b-9b32-42d60507ddbc-612E3HnCTrL._SL1500_.jpg', 'Color: orange, size: 100ml'),
(11, 11, NULL, 4, 50.00, 'prosuct Vaslo', '/api/images/products/cb97425b-2f2e-481b-9b32-42d60507ddbc-612E3HnCTrL._SL1500_.jpg', 'Color: purple, size: 100ml'),
(12, 12, NULL, 1, 50.00, 'prosuct Vaslo', '/api/images/products/cb97425b-2f2e-481b-9b32-42d60507ddbc-612E3HnCTrL._SL1500_.jpg', 'Color: purple, size: 50ml'),
(13, 13, 7, 1, 70.00, 'L\'Oreal Paris Elvive ', '/api/images/products/deebcb60-d9af-4187-a874-853ebf3f7721-L-Oreal-Paris-Elvive-Dream-Lengths-Restoring-Strengthening-and-Split-End-Repair-Shampoo-Damaged-Hair-13-5-fl-oz_e76d35b8-f9ba-48b9-b8e1-2e83dd5375ee.77a69f884a5fac11e70e6619bf24689d.webp', NULL),
(14, 14, 8, 1, 80.00, ' Glow Blush Beauty', '/api/images/products/e7ab23a0-a86b-4def-8910-1aa3065dc63e-51-JXpf4WfL._SX679_.jpg', NULL),
(15, 15, 9, 1, 274.00, ' Face Sunscreen', '/api/images/products/cd6613ef-9121-4f37-88f0-d3e0fa1751e1-81tFDbCX-BL._SL1500_.jpg', NULL),
(16, 15, 7, 1, 70.00, 'L\'Oreal Paris Elvive ', '/api/images/products/deebcb60-d9af-4187-a874-853ebf3f7721-L-Oreal-Paris-Elvive-Dream-Lengths-Restoring-Strengthening-and-Split-End-Repair-Shampoo-Damaged-Hair-13-5-fl-oz_e76d35b8-f9ba-48b9-b8e1-2e83dd5375ee.77a69f884a5fac11e70e6619bf24689d.webp', NULL);

-- --------------------------------------------------------

--
-- Table structure for table `packs`
--

CREATE TABLE `packs` (
  `id` bigint NOT NULL,
  `name` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `description` longtext COLLATE utf8mb4_unicode_ci,
  `price` double NOT NULL,
  `image_url` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `hide_comment_form` tinyint(1) DEFAULT '0',
  `show_purchase_notifications` tinyint(1) NOT NULL DEFAULT '1',
  `show_countdown_timer` tinyint(1) NOT NULL DEFAULT '1'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `packs`
--

INSERT INTO `packs` (`id`, `name`, `description`, `price`, `image_url`, `hide_comment_form`, `show_purchase_notifications`, `show_countdown_timer`) VALUES
(2, 'Pack beauty', '<ul class=\"a-unordered-list a-vertical a-spacing-mini\">\n<li class=\"a-spacing-mini\"><span class=\"a-list-item\">Protect, Hydrate &amp; Instantly Glow - Our best-selling glow serum is now in SPF! This hydrating Korean sunscreen stick contains broad spectrum SPF 45 and is rated PA+++, to shield against UVA/UVB rays while helping to even tone &amp; prevent dark spots. The translucent, balmy, non-comedogenic formula leaves skin with a dewy glow, never greasy! Perfect for everyday protection &amp; on-the-go reapplication.</span></li>\n<li class=\"a-spacing-mini\"><span class=\"a-list-item\">Translucent, Non-Comedogenic Formula - This dewy, clear sunscreen stick is formulated no differently than all of our other Glow Recipe products. Made with clinically-effective ingredients such as niacinamide to help visibly reduce the appearance of dark spots and pores over time, as well as hyaluronic acid and watermelon to hydrate, soothe and deliver essential vitamins straight to your skin. Don\'t forget squalane, for deep moisture that doesn\'t clog your pores!</span></li>\n<li class=\"a-spacing-mini\"><span class=\"a-list-item\">SPF Protection Anytime, Anywhere - SPF? More like BFF. Our balmy travel sunscreen works for all skin types (even sensitive) and skin tones. It\'s a makeup lovers dream as it also works as a dewy primer for radiant looks that last all day.</span></li>\n<li class=\"a-spacing-mini\"><span class=\"a-list-item\">How Do You Dew? - Before applying, warm the face sunscreen stick on the back of your hand. For each area of skin, apply 4 passes back and forth as the last step of your skincare routine for optimal protection. Continue to apply until you\'ve reached your desired level of glow.</span></li>\n</ul>', 133, '/api/images/packs/0341809d-12ef-4ecb-b07f-329eaeb9fb94-68062-20833f.webp', 1, 1, 1);

-- --------------------------------------------------------

--
-- Table structure for table `pack_items`
--

CREATE TABLE `pack_items` (
  `id` bigint NOT NULL,
  `pack_id` bigint NOT NULL,
  `default_product_id` bigint NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `pack_items`
--

INSERT INTO `pack_items` (`id`, `pack_id`, `default_product_id`) VALUES
(21, 2, 7),
(22, 2, 9);

-- --------------------------------------------------------

--
-- Table structure for table `pack_item_variations`
--

CREATE TABLE `pack_item_variations` (
  `pack_item_id` bigint NOT NULL,
  `product_id` bigint NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `pack_item_variations`
--

INSERT INTO `pack_item_variations` (`pack_item_id`, `product_id`) VALUES
(21, 8),
(22, 10);

-- --------------------------------------------------------

--
-- Table structure for table `pack_recommended_custom_packs`
--

CREATE TABLE `pack_recommended_custom_packs` (
  `pack_id` bigint NOT NULL,
  `custom_pack_id` bigint NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `pack_recommended_packs`
--

CREATE TABLE `pack_recommended_packs` (
  `pack_id` bigint NOT NULL,
  `recommended_pack_id` bigint NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `pack_recommended_products`
--

CREATE TABLE `pack_recommended_products` (
  `pack_id` bigint NOT NULL,
  `product_id` bigint NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `pack_recommended_products`
--

INSERT INTO `pack_recommended_products` (`pack_id`, `product_id`) VALUES
(2, 1),
(2, 2),
(2, 3),
(2, 5),
(2, 7),
(2, 8),
(2, 9),
(2, 10);

-- --------------------------------------------------------

--
-- Table structure for table `permissions`
--

CREATE TABLE `permissions` (
  `id` bigint NOT NULL,
  `name` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL,
  `description` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `resource` varchar(50) COLLATE utf8mb4_unicode_ci NOT NULL,
  `action` varchar(50) COLLATE utf8mb4_unicode_ci NOT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `permissions`
--

INSERT INTO `permissions` (`id`, `name`, `description`, `resource`, `action`, `created_at`, `updated_at`) VALUES
(1, 'PRODUCT:VIEW', 'View products', 'PRODUCT', 'VIEW', '2025-12-07 19:50:38', '2025-12-07 19:50:38'),
(2, 'PRODUCT:CREATE', 'Create new products', 'PRODUCT', 'CREATE', '2025-12-07 19:50:38', '2025-12-07 19:50:38'),
(3, 'PRODUCT:EDIT', 'Edit existing products', 'PRODUCT', 'EDIT', '2025-12-07 19:50:38', '2025-12-07 19:50:38'),
(4, 'PRODUCT:DELETE', 'Delete products', 'PRODUCT', 'DELETE', '2025-12-07 19:50:38', '2025-12-07 19:50:38'),
(5, 'ORDER:VIEW', 'View orders', 'ORDER', 'VIEW', '2025-12-07 19:50:38', '2025-12-07 19:50:38'),
(6, 'ORDER:CREATE', 'Create orders', 'ORDER', 'CREATE', '2025-12-07 19:50:38', '2025-12-07 19:50:38'),
(7, 'ORDER:EDIT', 'Edit orders', 'ORDER', 'EDIT', '2025-12-07 19:50:38', '2025-12-07 19:50:38'),
(8, 'ORDER:DELETE', 'Delete orders', 'ORDER', 'DELETE', '2025-12-07 19:50:38', '2025-12-07 19:50:38'),
(9, 'ORDER:MANAGE', 'Manage order status and fulfillment', 'ORDER', 'MANAGE', '2025-12-07 19:50:38', '2025-12-07 19:50:38'),
(10, 'USER:VIEW', 'View users', 'USER', 'VIEW', '2025-12-07 19:50:38', '2025-12-07 19:50:38'),
(11, 'USER:CREATE', 'Create new users', 'USER', 'CREATE', '2025-12-07 19:50:38', '2025-12-07 19:50:38'),
(12, 'USER:EDIT', 'Edit user information', 'USER', 'EDIT', '2025-12-07 19:50:38', '2025-12-07 19:50:38'),
(13, 'USER:DELETE', 'Delete users', 'USER', 'DELETE', '2025-12-07 19:50:38', '2025-12-07 19:50:38'),
(14, 'USER:PROMOTE', 'Promote users to admin', 'USER', 'PROMOTE', '2025-12-07 19:50:38', '2025-12-07 19:50:38'),
(15, 'ROLE:VIEW', 'View roles', 'ROLE', 'VIEW', '2025-12-07 19:50:38', '2025-12-07 19:50:38'),
(16, 'ROLE:CREATE', 'Create new roles', 'ROLE', 'CREATE', '2025-12-07 19:50:38', '2025-12-07 19:50:38'),
(17, 'ROLE:EDIT', 'Edit roles', 'ROLE', 'EDIT', '2025-12-07 19:50:38', '2025-12-07 19:50:38'),
(18, 'ROLE:DELETE', 'Delete roles', 'ROLE', 'DELETE', '2025-12-07 19:50:38', '2025-12-07 19:50:38'),
(19, 'ROLE:ASSIGN', 'Assign roles to users', 'ROLE', 'ASSIGN', '2025-12-07 19:50:38', '2025-12-07 19:50:38'),
(20, 'PERMISSION:VIEW', 'View permissions', 'PERMISSION', 'VIEW', '2025-12-07 19:50:38', '2025-12-07 19:50:38'),
(21, 'PERMISSION:CREATE', 'Create permissions', 'PERMISSION', 'CREATE', '2025-12-07 19:50:38', '2025-12-07 19:50:38'),
(22, 'PERMISSION:EDIT', 'Edit permissions', 'PERMISSION', 'EDIT', '2025-12-07 19:50:38', '2025-12-07 19:50:38'),
(23, 'PERMISSION:DELETE', 'Delete permissions', 'PERMISSION', 'DELETE', '2025-12-07 19:50:38', '2025-12-07 19:50:38'),
(24, 'PERMISSION:ASSIGN', 'Assign permissions to roles', 'PERMISSION', 'ASSIGN', '2025-12-07 19:50:38', '2025-12-07 19:50:38'),
(25, 'CATEGORY:VIEW', 'View categories', 'CATEGORY', 'VIEW', '2025-12-07 19:50:38', '2025-12-07 19:50:38'),
(26, 'CATEGORY:CREATE', 'Create categories', 'CATEGORY', 'CREATE', '2025-12-07 19:50:38', '2025-12-07 19:50:38'),
(27, 'CATEGORY:EDIT', 'Edit categories', 'CATEGORY', 'EDIT', '2025-12-07 19:50:38', '2025-12-07 19:50:38'),
(28, 'CATEGORY:DELETE', 'Delete categories', 'CATEGORY', 'DELETE', '2025-12-07 19:50:38', '2025-12-07 19:50:38'),
(29, 'PACK:VIEW', 'View packs', 'PACK', 'VIEW', '2025-12-07 19:50:38', '2025-12-07 19:50:38'),
(30, 'PACK:CREATE', 'Create packs', 'PACK', 'CREATE', '2025-12-07 19:50:38', '2025-12-07 19:50:38'),
(31, 'PACK:EDIT', 'Edit packs', 'PACK', 'EDIT', '2025-12-07 19:50:38', '2025-12-07 19:50:38'),
(32, 'PACK:DELETE', 'Delete packs', 'PACK', 'DELETE', '2025-12-07 19:50:38', '2025-12-07 19:50:38'),
(33, 'CUSTOM_PACK:VIEW', 'View custom packs', 'CUSTOM_PACK', 'VIEW', '2025-12-07 19:50:38', '2025-12-07 19:50:38'),
(34, 'CUSTOM_PACK:CREATE', 'Create custom packs', 'CUSTOM_PACK', 'CREATE', '2025-12-07 19:50:38', '2025-12-07 19:50:38'),
(35, 'CUSTOM_PACK:EDIT', 'Edit custom packs', 'CUSTOM_PACK', 'EDIT', '2025-12-07 19:50:38', '2025-12-07 19:50:38'),
(36, 'CUSTOM_PACK:DELETE', 'Delete custom packs', 'CUSTOM_PACK', 'DELETE', '2025-12-07 19:50:38', '2025-12-07 19:50:38'),
(37, 'REVIEW:VIEW', 'View reviews', 'REVIEW', 'VIEW', '2025-12-07 19:50:38', '2025-12-07 19:50:38'),
(38, 'REVIEW:APPROVE', 'Approve reviews', 'REVIEW', 'APPROVE', '2025-12-07 19:50:38', '2025-12-07 19:50:38'),
(39, 'REVIEW:REJECT', 'Reject reviews', 'REVIEW', 'REJECT', '2025-12-07 19:50:38', '2025-12-07 19:50:38'),
(40, 'REVIEW:DELETE', 'Delete reviews', 'REVIEW', 'DELETE', '2025-12-07 19:50:38', '2025-12-07 19:50:38'),
(41, 'COMMENT:VIEW', 'View comments', 'COMMENT', 'VIEW', '2025-12-07 19:50:38', '2025-12-07 19:50:38'),
(42, 'COMMENT:APPROVE', 'Approve comments', 'COMMENT', 'APPROVE', '2025-12-07 19:50:38', '2025-12-07 19:50:38'),
(43, 'COMMENT:REJECT', 'Reject comments', 'COMMENT', 'REJECT', '2025-12-07 19:50:38', '2025-12-07 19:50:38'),
(44, 'COMMENT:DELETE', 'Delete comments', 'COMMENT', 'DELETE', '2025-12-07 19:50:38', '2025-12-07 19:50:38'),
(45, 'COUPON:VIEW', 'View coupons', 'COUPON', 'VIEW', '2025-12-07 19:50:38', '2025-12-07 19:50:38'),
(46, 'COUPON:CREATE', 'Create coupons', 'COUPON', 'CREATE', '2025-12-07 19:50:38', '2025-12-07 19:50:38'),
(47, 'COUPON:EDIT', 'Edit coupons', 'COUPON', 'EDIT', '2025-12-07 19:50:38', '2025-12-07 19:50:38'),
(48, 'COUPON:DELETE', 'Delete coupons', 'COUPON', 'DELETE', '2025-12-07 19:50:38', '2025-12-07 19:50:38'),
(49, 'ANALYTICS:VIEW', 'View analytics dashboard', 'ANALYTICS', 'VIEW', '2025-12-07 19:50:38', '2025-12-07 19:50:38'),
(50, 'ANALYTICS:EXPORT', 'Export analytics data', 'ANALYTICS', 'EXPORT', '2025-12-07 19:50:38', '2025-12-07 19:50:38'),
(51, 'SETTINGS:VIEW', 'View settings', 'SETTINGS', 'VIEW', '2025-12-07 19:50:38', '2025-12-07 19:50:38'),
(52, 'SETTINGS:EDIT', 'Edit settings', 'SETTINGS', 'EDIT', '2025-12-07 19:50:38', '2025-12-07 19:50:38'),
(53, 'HERO:VIEW', 'View hero settings', 'HERO', 'VIEW', '2025-12-07 19:50:38', '2025-12-07 19:50:38'),
(54, 'HERO:EDIT', 'Edit hero settings', 'HERO', 'EDIT', '2025-12-07 19:50:38', '2025-12-07 19:50:38'),
(55, 'ANNOUNCEMENT:VIEW', 'View announcements', 'ANNOUNCEMENT', 'VIEW', '2025-12-07 19:50:38', '2025-12-07 19:50:38'),
(56, 'ANNOUNCEMENT:EDIT', 'Edit announcements', 'ANNOUNCEMENT', 'EDIT', '2025-12-07 19:50:38', '2025-12-07 19:50:38'),
(57, 'DASHBOARD:VIEW', 'View admin dashboard', 'DASHBOARD', 'VIEW', '2025-12-07 19:50:38', '2025-12-07 19:50:38');

-- --------------------------------------------------------

--
-- Table structure for table `product`
--

CREATE TABLE `product` (
  `id` bigint NOT NULL,
  `name` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `description` text COLLATE utf8mb4_unicode_ci,
  `price` decimal(38,2) DEFAULT NULL,
  `quantity` int DEFAULT NULL,
  `brand` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `bestseller` tinyint(1) DEFAULT '0',
  `new_arrival` tinyint(1) DEFAULT '0',
  `has_variants` tinyint(1) DEFAULT '0',
  `is_packable` tinyint(1) DEFAULT '0',
  `type` varchar(10) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `category_id` bigint NOT NULL,
  `deleted` tinyint(1) DEFAULT '0',
  `show_purchase_notifications` tinyint(1) NOT NULL DEFAULT '1',
  `show_countdown_timer` tinyint(1) NOT NULL DEFAULT '1'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `product`
--

INSERT INTO `product` (`id`, `name`, `description`, `price`, `quantity`, `brand`, `bestseller`, `new_arrival`, `has_variants`, `is_packable`, `type`, `category_id`, `deleted`, `show_purchase_notifications`, `show_countdown_timer`) VALUES
(1, 'Porduct 1', '<p>lkadlkmklackl</p>\n<p><img src=\"../../api/images/products/6f404675-d8ca-4849-aea4-82bf571a5f5c-mceclip0.jpg\"></p>', 4.00, 3, 'brand', 1, 1, 0, 1, 'BOTH', 1, 1, 1, 1),
(2, 'Porduct 2', '<p>mklavlmkmklfvlmk</p>\n<p>&nbsp;</p>', 4.00, 4, 'brand', 1, 1, 0, 1, 'BOTH', 1, 1, 0, 0),
(3, 'Porduct 3', '<p>nnweflknkllsd</p>', 4.00, 4, 'brand', 1, 1, 0, 1, 'BOTH', 1, 1, 1, 1),
(4, 'Porduct 4', '<p>szdfxgchjbkml;,</p>', 4.00, 4, 'brand', 1, 1, 0, 1, 'BOTH', 1, 1, 1, 1),
(5, 'Porduct 4', '', 4.00, 4, 'brand', 1, 1, 0, 1, 'BOTH', 1, 1, 1, 1),
(6, 'onther test  - Offer', 'Auto-generated product for landing page: onther test ', 0.01, 100, NULL, 0, 0, 0, 0, 'BOTH', 1, 1, 1, 1),
(7, 'L\'Oreal Paris Elvive ', '<h2 class=\"b mv0 f5 pb2\">About this item</h2>\n<div class=\"expand-collapse-content dangerous-html w_YUC7\">\n<ul>\n<li>L\'Oreal Paris Elvive Hyaluron Plump Hydrating Shampoo, 72H Intense Moisture, Squeeze, 13.5 fl oz</li>\n<li>Achieve shinier, free-flowing strands for dry, dehydrated hair without weigh down</li>\n<li>Paraben-free hydrating formula</li>\n<li>Gently cleanses and instantly hydrates</li>\n<li>Hyaluronic Care Complex provides 72H hydration and replenished moisture</li>\n<li>Indulge in a blend of bright berries, cherry blossom, sweet vanilla, and sandalwood</li>\n<li>Squeeze dispenser for easy use</li>\n</ul>\n</div>\n<p><img src=\"https://i5.walmartimages.com/asr/a2b12dcc-ff7b-433b-8513-aa4e5187c9eb.a93ee5f0fede02050b378a6cdbbbaebb.jpeg?odnHeight=2000&amp;odnWidth=2000&amp;odnBg=FFFFFF\" alt=\"L\'Oreal Paris Elvive Hyaluron Plump Hydrating Shampoo, 72H Intense Moisture, Squeeze, 13.5 fl oz\"></p>', 70.00, 98, 'L\'Oreal ', 1, 1, 1, 1, 'WOMEN', 3, 0, 1, 1),
(8, ' Glow Blush Beauty', '<h1 class=\"a-size-base-plus a-text-bold\">About this item</h1>\n<ul class=\"a-unordered-list a-vertical a-spacing-mini\">\n<li class=\"a-spacing-mini\"><span class=\"a-list-item\">LIQUID BLUSH WAND: Give your cheeks a radiant flush and pretty pop of color with a wave of this magic blush wand.</span></li>\n<li class=\"a-spacing-mini\"><span class=\"a-list-item\">CREATES LUMINOUS &amp; RADIANT DIMENSION: The lightweight liquid formula is infused with hydrating squalane to add instant luminosity and radiant dimension to your complexion.</span></li>\n<li class=\"a-spacing-mini\"><span class=\"a-list-item\">BUILDABLE &amp; BLENDABLE FORMULA: Liquid, buildable blush formula effortlessly blends into skin.</span></li>\n</ul>\n<p><span class=\"a-list-item\"><img src=\"https://m.media-amazon.com/images/I/81omZiJvTsL._SL1500_.jpg\"></span></p>\n<ul class=\"a-unordered-list a-vertical a-spacing-mini\">\n<li class=\"a-spacing-mini\"><span class=\"a-list-item\">CUSHION-TIP APPLICATOR: Use the cushion-tip to apply to the apples and high points of your cheeks for a healthy kiss of color and a precise application.</span></li>\n<li class=\"a-spacing-mini\"><span class=\"a-list-item\">SKIN-LOVING INGREDIENTS: All e.l.f. products are made from skin-loving ingredients you want, minus the toxins you don&rsquo;t&mdash;all at good-for-you prices. All e.l.f. products are 100% cruelty-free and Vegan.</span></li>\n</ul>', 80.00, 67, 'Cream', 1, 1, 0, 1, 'WOMEN', 2, 0, 1, 1),
(9, ' Face Sunscreen', '<ul class=\"a-unordered-list a-vertical a-spacing-mini\">\n<li class=\"a-spacing-mini\"><span class=\"a-list-item\">Protect, Hydrate &amp; Instantly Glow - Our best-selling glow serum is now in SPF! This hydrating Korean sunscreen stick contains broad spectrum SPF 45 and is rated PA+++, to shield against UVA/UVB rays while helping to even tone &amp; prevent dark spots. The translucent, balmy, non-comedogenic formula leaves skin with a dewy glow, never greasy! Perfect for everyday protection &amp; on-the-go reapplication.</span><span class=\"a-list-item\"><img src=\"https://m.media-amazon.com/images/I/71eiK8XBTdL._SL1500_.jpg\" width=\"720\" height=\"720\"></span></li>\n<li class=\"a-spacing-mini\"><span class=\"a-list-item\">Translucent, Non-Comedogenic Formula - This dewy, clear sunscreen stick is formulated no differently than all of our other Glow Recipe products. Made with clinically-effective ingredients such as niacinamide to help visibly reduce the appearance of dark spots and pores over time, as well as hyaluronic acid and watermelon to hydrate, soothe and deliver essential vitamins straight to your skin. Don\'t forget squalane, for deep moisture that doesn\'t clog your pores!</span></li>\n<li class=\"a-spacing-mini\"><span class=\"a-list-item\">SPF Protection Anytime, Anywhere - SPF? More like BFF. Our balmy travel sunscreen works for all skin types (even sensitive) and skin tones. It\'s a makeup lovers dream as it also works as a dewy primer for radiant looks that last all day.</span></li>\n<li class=\"a-spacing-mini\"><span class=\"a-list-item\">How Do You Dew? - Before applying, warm the face sunscreen stick on the back of your hand. For each area of skin, apply 4 passes back and forth as the last step of your skincare routine for optimal protection. Continue to apply until you\'ve reached your desired level of glow.</span></li>\n</ul>', 274.00, 29, '', 1, 1, 0, 1, 'WOMEN', 1, 0, 1, 1),
(10, 'Missing Person Eau de Parfum', '<p><strong>Key Notes:</strong> Skin Musk, Bergamot Nectar, Blonde Wood</p>\n<p><strong>Fragrance Description:</strong> If nude were a perfume, this would be it. Brought to life by comforting accords of white musk, enhanced by sheer floral nuances of jasmine and glowing orange blossom, and fused with a light trail of soft, transparent woods, Missing Person is pure, provocative, and undeniably familiar.</p>\n<p><img style=\"display: block; margin-left: auto; margin-right: auto;\" src=\"https://www.sephora.com/productimages/sku/s2568350-av-3-zoom.jpg?imwidth=375\" alt=\"PHLUR - Missing Person Eau de Parfum 1.7 oz/ 50 mL PHLUR Missing Person Eau de Parfum Clean at Sephora\"></p>\n<p><strong>About the Bottle:</strong> Missing Person is contained in a tinted-amber, translucent glass bottle. PHLUR fragrances are made with no additional dyes. The fragrance bottle features a porcelain cap with magnetic closure.</p>\n<p><strong>About the Fragrance:</strong>&nbsp;\"<em>Missing Person is more than just a fragrance; it\'s a heartfelt journey through love, loss, and longing. Crafted from my personal experience of rediscovering myself after separation, it encapsulates the comforting embrace of skin-to-skin contact and the lingering scent of a loved one\'s presence. It\'s a tribute to the warmth and intimacy we cherish, now bottled for you to experience and connect with those cherished memories.\"&nbsp;</em>- Chriselle Lim</p>', 1000.00, 20, 'PHLUR', 1, 1, 0, 1, 'BOTH', 4, 0, 1, 1);

-- --------------------------------------------------------

--
-- Table structure for table `product_frequently_bought_together`
--

CREATE TABLE `product_frequently_bought_together` (
  `product_id` bigint NOT NULL,
  `frequently_bought_id` bigint NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `product_frequently_bought_together`
--

INSERT INTO `product_frequently_bought_together` (`product_id`, `frequently_bought_id`) VALUES
(8, 7),
(9, 7),
(10, 7),
(7, 8),
(9, 8),
(7, 9),
(10, 9),
(7, 10);

-- --------------------------------------------------------

--
-- Table structure for table `product_images`
--

CREATE TABLE `product_images` (
  `product_id` bigint NOT NULL,
  `images` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `product_images`
--

INSERT INTO `product_images` (`product_id`, `images`) VALUES
(1, '/api/images/products/90e6ae7a-5973-4b5c-b215-4a8afcaceae5-WhatsApp Image 2023-11-23 at 14.33.06 (1).jpeg'),
(2, '/api/images/products/472baec9-6d14-46f0-ba8e-1c6bacb0f5f2-WhatsApp Image 2023-11-23 at 14.33.07 (3).jpeg'),
(3, '/api/images/products/caeac845-993d-4a1e-9066-ff446786d64d-IMG_7588.JPG'),
(4, '/api/images/products/f6e809c2-1127-43cb-af98-b56b9edc680c-IMG_1752 - Copy.dng'),
(5, '/api/images/products/75a1f718-76fc-4f85-83f1-5293c0358241-WhatsApp Image 2023-11-23 at 14.31.33 (4).jpeg'),
(9, '/api/images/products/cd6613ef-9121-4f37-88f0-d3e0fa1751e1-81tFDbCX-BL._SL1500_.jpg'),
(9, '/api/images/products/c288f6e1-e327-4979-bee3-2ed680fc332f-61BrEdSP4xL._SX679_.jpg'),
(10, '/api/images/products/8419d952-7b53-46f1-8b49-8262a1129695-s2568350-main-zoom.webp'),
(10, '/api/images/products/83992794-8d66-4f17-a829-8a3b8fc7ef40-s2568350-av-3-zoom.webp'),
(7, '/api/images/products/deebcb60-d9af-4187-a874-853ebf3f7721-L-Oreal-Paris-Elvive-Dream-Lengths-Restoring-Strengthening-and-Split-End-Repair-Shampoo-Damaged-Hair-13-5-fl-oz_e76d35b8-f9ba-48b9-b8e1-2e83dd5375ee.77a69f884a5fac11e70e6619bf24689d.webp'),
(7, '/api/images/products/554c7c84-9691-4f60-a1ef-12ff44e9b1af-L-Oreal-Paris-Elvive-Hyaluron-Plump-Hydrating-Shampoo-72H-Intense-Moisture-Squeeze-13-5-fl-oz_e4a2803d-5015-47b8-8643-1ab19af7cd62.23fb920feb98e1c163918cd85a1ae184.webp'),
(8, '/api/images/products/e7ab23a0-a86b-4def-8910-1aa3065dc63e-51-JXpf4WfL._SX679_.jpg');
-- --------------------------------------------------------

--
-- Table structure for table `product_variant`
--

CREATE TABLE `product_variant` (
  `id` bigint NOT NULL,
  `product_id` bigint NOT NULL,
  `price` decimal(38,2) DEFAULT NULL,
  `stock` int NOT NULL,
  `image_url` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `product_variant`
--

INSERT INTO `product_variant` (`id`, `product_id`, `price`, `stock`, `image_url`) VALUES
(21, 7, 78.00, 44, '/api/images/products/fa09abf9-0ed0-4101-9d2e-16f54f3ba0d3-L-Oreal-Paris-Elvive-Dream-Lengths-Restoring-Strengthening-and-Split-End-Repair-Shampoo-Damaged-Hair-13-5-fl-oz_e76d35b8-f9ba-48b9-b8e1-2e83dd5375ee.77a69f884a5fac11e70e6619bf24689d.webp'),
(22, 7, 70.00, 66, '/api/images/products/da5be7ca-cc4f-468d-81db-060d7065c7c1-L-Oreal-Paris-Elvive-Hyaluron-Plump-Hydrating-Shampoo-72H-Intense-Moisture-Squeeze-13-5-fl-oz_e4a2803d-5015-47b8-8643-1ab19af7cd62.23fb920feb98e1c163918cd85a1ae184.webp');

-- --------------------------------------------------------

--
-- Table structure for table `product_variant_attributes`
--

CREATE TABLE `product_variant_attributes` (
  `product_variant_id` bigint NOT NULL,
  `attribute_name` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `attribute_value` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `product_variant_attributes`
--

INSERT INTO `product_variant_attributes` (`product_variant_id`, `attribute_name`, `attribute_value`) VALUES
(21, 'Type', 'Dream Lengths'),
(22, 'Type', 'Hyaluron Plump');

-- --------------------------------------------------------

--
-- Table structure for table `review`
--

CREATE TABLE `review` (
  `id` bigint NOT NULL,
  `content` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `rating` int NOT NULL,
  `approved` tinyint(1) DEFAULT '0',
  `created_by_admin` tinyint(1) DEFAULT '0',
  `custom_name` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `user_id` bigint DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `review`
--

INSERT INTO `review` (`id`, `content`, `rating`, `approved`, `created_by_admin`, `custom_name`, `user_id`) VALUES
(1, 'تجربة رائعة من البداية حتى الاستلام؛ جودة المنتجات ممتازة والتغليف أنيق. خدمة العملاء سريعة واستجابتها مفيدة، أنصح به لمن يبحث عن منتجات أصلية وبأسعار مناسبة', 5, 1, 1, 'أسماء ', NULL),
(2, 'أحببت الاهتمام بالتفاصيل والوصف الدقيق لكل منتج؛ النتائج على بشرتي كانت ممتازة. تجربة شراء سلسة وسأكرر الطلب بالتأكيد.\n', 5, 1, 1, 'فاطمة ', NULL),
(3, 'موقع موثوق ومنتجات ذات جودة جيدة، الأسعار تنافسية. خدمة ما بعد البيع تحتاج إلى تحسين طفيف لكن بشكل عام تجربة إيجابية.', 5, 1, 1, 'سارة', NULL),
(4, 'تشكيلة واسعة ومنتجات فعالة، وصلت الطلبية في الوقت المحدد. أتمنى تحسين تفاصيل تتبع الشحنة وتوسيع خيارات الدفع عند الاستلام.', 5, 1, 1, 'جوليا', NULL);

-- --------------------------------------------------------

--
-- Table structure for table `roles`
--

CREATE TABLE `roles` (
  `id` bigint NOT NULL,
  `name` varchar(50) COLLATE utf8mb4_unicode_ci NOT NULL,
  `description` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `roles`
--

INSERT INTO `roles` (`id`, `name`, `description`, `created_at`, `updated_at`) VALUES
(1, 'ROLE_ADMIN', 'Full system access with all permissions', '2025-12-07 19:50:38', '2025-12-07 19:50:38'),
(2, 'ROLE_MANAGER', 'Manager role with limited administrative access', '2025-12-07 19:50:38', '2025-12-07 19:50:38'),
(3, 'ROLE_EDITOR', 'Editor role with content management permissions', '2025-12-07 19:50:38', '2025-12-07 19:50:38'),
(4, 'ROLE_VIEWER', 'Viewer role with read-only access', '2025-12-07 19:50:38', '2025-12-07 19:50:38'),
(5, 'ROLE_USER', 'Standard user role with basic permissions', '2025-12-07 19:50:38', '2025-12-07 19:50:38');

-- --------------------------------------------------------

--
-- Table structure for table `role_permissions`
--

CREATE TABLE `role_permissions` (
  `role_id` bigint NOT NULL,
  `permission_id` bigint NOT NULL,
  `assigned_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `role_permissions`
--

INSERT INTO `role_permissions` (`role_id`, `permission_id`, `assigned_at`) VALUES
(1, 1, '2025-12-07 19:50:38'),
(1, 2, '2025-12-07 19:50:38'),
(1, 3, '2025-12-07 19:50:38'),
(1, 4, '2025-12-07 19:50:38'),
(1, 5, '2025-12-07 19:50:38'),
(1, 6, '2025-12-07 19:50:38'),
(1, 7, '2025-12-07 19:50:38'),
(1, 8, '2025-12-07 19:50:38'),
(1, 9, '2025-12-07 19:50:38'),
(1, 10, '2025-12-07 19:50:38'),
(1, 11, '2025-12-07 19:50:38'),
(1, 12, '2025-12-07 19:50:38'),
(1, 13, '2025-12-07 19:50:38'),
(1, 14, '2025-12-07 19:50:38'),
(1, 15, '2025-12-07 19:50:38'),
(1, 16, '2025-12-07 19:50:38'),
(1, 17, '2025-12-07 19:50:38'),
(1, 18, '2025-12-07 19:50:38'),
(1, 19, '2025-12-07 19:50:38'),
(1, 20, '2025-12-07 19:50:38'),
(1, 21, '2025-12-07 19:50:38'),
(1, 22, '2025-12-07 19:50:38'),
(1, 23, '2025-12-07 19:50:38'),
(1, 24, '2025-12-07 19:50:38'),
(1, 25, '2025-12-07 19:50:38'),
(1, 26, '2025-12-07 19:50:38'),
(1, 27, '2025-12-07 19:50:38'),
(1, 28, '2025-12-07 19:50:38'),
(1, 29, '2025-12-07 19:50:38'),
(1, 30, '2025-12-07 19:50:38'),
(1, 31, '2025-12-07 19:50:38'),
(1, 32, '2025-12-07 19:50:38'),
(1, 33, '2025-12-07 19:50:38'),
(1, 34, '2025-12-07 19:50:38'),
(1, 35, '2025-12-07 19:50:38'),
(1, 36, '2025-12-07 19:50:38'),
(1, 37, '2025-12-07 19:50:38'),
(1, 38, '2025-12-07 19:50:38'),
(1, 39, '2025-12-07 19:50:38'),
(1, 40, '2025-12-07 19:50:38'),
(1, 41, '2025-12-07 19:50:38'),
(1, 42, '2025-12-07 19:50:38'),
(1, 43, '2025-12-07 19:50:38'),
(1, 44, '2025-12-07 19:50:38'),
(1, 45, '2025-12-07 19:50:38'),
(1, 46, '2025-12-07 19:50:38'),
(1, 47, '2025-12-07 19:50:38'),
(1, 48, '2025-12-07 19:50:38'),
(1, 49, '2025-12-07 19:50:38'),
(1, 50, '2025-12-07 19:50:38'),
(1, 51, '2025-12-07 19:50:38'),
(1, 52, '2025-12-07 19:50:38'),
(1, 53, '2025-12-07 19:50:38'),
(1, 54, '2025-12-07 19:50:38'),
(1, 55, '2025-12-07 19:50:38'),
(1, 56, '2025-12-07 19:50:38'),
(1, 57, '2025-12-07 19:50:38'),
(2, 1, '2025-12-07 19:50:38'),
(2, 2, '2025-12-07 19:50:38'),
(2, 3, '2025-12-07 19:50:38'),
(2, 5, '2025-12-07 19:50:38'),
(2, 7, '2025-12-07 19:50:38'),
(2, 9, '2025-12-07 19:50:38'),
(2, 10, '2025-12-07 19:50:38'),
(2, 25, '2025-12-07 19:50:38'),
(2, 26, '2025-12-07 19:50:38'),
(2, 27, '2025-12-07 19:50:38'),
(2, 29, '2025-12-07 19:50:38'),
(2, 30, '2025-12-07 19:50:38'),
(2, 31, '2025-12-07 19:50:38'),
(2, 33, '2025-12-07 19:50:38'),
(2, 34, '2025-12-07 19:50:38'),
(2, 35, '2025-12-07 19:50:38'),
(2, 37, '2025-12-07 19:50:38'),
(2, 38, '2025-12-07 19:50:38'),
(2, 39, '2025-12-07 19:50:38'),
(2, 41, '2025-12-07 19:50:38'),
(2, 42, '2025-12-07 19:50:38'),
(2, 43, '2025-12-07 19:50:38'),
(2, 45, '2025-12-07 19:50:38'),
(2, 46, '2025-12-07 19:50:38'),
(2, 47, '2025-12-07 19:50:38'),
(2, 49, '2025-12-07 19:50:38'),
(2, 57, '2025-12-07 19:50:38'),
(3, 1, '2025-12-07 19:50:38'),
(3, 2, '2025-12-07 19:50:38'),
(3, 3, '2025-12-07 19:50:38'),
(3, 25, '2025-12-07 19:50:38'),
(3, 29, '2025-12-07 19:50:38'),
(3, 30, '2025-12-07 19:50:38'),
(3, 31, '2025-12-07 19:50:38'),
(3, 33, '2025-12-07 19:50:38'),
(3, 34, '2025-12-07 19:50:38'),
(3, 35, '2025-12-07 19:50:38'),
(3, 37, '2025-12-07 19:50:38'),
(3, 38, '2025-12-07 19:50:38'),
(3, 41, '2025-12-07 19:50:38'),
(3, 42, '2025-12-07 19:50:38'),
(3, 53, '2025-12-07 19:50:38'),
(3, 54, '2025-12-07 19:50:38'),
(3, 55, '2025-12-07 19:50:38'),
(3, 56, '2025-12-07 19:50:38'),
(3, 57, '2025-12-07 19:50:38'),
(4, 1, '2025-12-07 19:50:38'),
(4, 5, '2025-12-07 19:50:38'),
(4, 10, '2025-12-07 19:50:38'),
(4, 25, '2025-12-07 19:50:38'),
(4, 29, '2025-12-07 19:50:38'),
(4, 33, '2025-12-07 19:50:38'),
(4, 37, '2025-12-07 19:50:38'),
(4, 41, '2025-12-07 19:50:38'),
(4, 45, '2025-12-07 19:50:38'),
(4, 49, '2025-12-07 19:50:38'),
(4, 57, '2025-12-07 19:50:38'),
(5, 1, '2025-12-07 19:50:38'),
(5, 5, '2025-12-07 19:50:38'),
(5, 6, '2025-12-07 19:50:38');

-- --------------------------------------------------------

--
-- Table structure for table `settings`
--

CREATE TABLE `settings` (
  `setting_key` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `value` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `users`
--

CREATE TABLE `users` (
  `id` bigint NOT NULL,
  `full_name` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `email` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `password` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `role` varchar(20) COLLATE utf8mb4_unicode_ci NOT NULL,
  `email_confirmation` tinyint(1) DEFAULT '0',
  `confirmation_code` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `reset_password_token` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `reset_password_token_expiry` datetime DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `users`
--

INSERT INTO `users` (`id`, `full_name`, `email`, `password`, `role`, `email_confirmation`, `confirmation_code`, `reset_password_token`, `reset_password_token_expiry`) VALUES
(1, 'Admin User', 'admin@example.com', '$2a$10$zL1rdQNh4.1hOrlu8IMiSeyVzgX/ul4P7aZCC9AdAgQdzPSJr93H6', 'ADMIN', 1, '123456', NULL, NULL),
(2, 'User Demo', 'user@example.com', '$2a$10$nyFGY2/tPk4K1T86twNFLuJ/vhRqmylWPe6rdxwkDR9smlRnlRUAK', 'USER', 1, '789101', NULL, NULL),
(3, 'ismail tabat', 'bc89e0a7-71fa-45ca-b473-919ea70b5877@admin-comment.com', '$2a$10$j3IPbQevptLNi6aWXhU5ge7qKxfTptoA7wNf8B/heZBDl0kiV0Yhy', 'USER', 1, NULL, NULL, NULL),
(4, 'Ranya', '783df1e2-27dd-4672-8396-3ed525240670@admin-comment.com', '$2a$10$grzIF1O48Dkh18SjPwspSO34GsufRVDjN5kLx15/F2W/EZeczJH5C', 'USER', 1, NULL, NULL, NULL),
(5, 'Mouna', '926b2f8e-2f7c-443b-8a0e-e721bbcae160@admin-comment.com', '$2a$10$/DB0QeLuENrjGfGV1s2Imuo6IrnVz7VHbGEQdFEB17HnMnH0ZUaKy', 'USER', 1, NULL, NULL, NULL),
(6, 'Dounya', '0cb5daab-1562-4e84-b393-3d45b472d540@admin-comment.com', '$2a$10$AEQiFDvOl5ADpRvTzsTZ1uSu4qtcqaP91McvkA6rmWnproWNlOa8K', 'USER', 1, NULL, NULL, NULL),
(7, 'Ranya', '0ebcd218-093d-4dc4-bbb2-4913ebcb6c1a@admin-comment.com', '$2a$10$T2YybVx./UZQiog16YrsNuXRyjpcHteqgFTHjO2n27GWqTi6fyDaK', 'USER', 1, NULL, NULL, NULL);

-- --------------------------------------------------------

--
-- Table structure for table `user_roles`
--

CREATE TABLE `user_roles` (
  `user_id` bigint NOT NULL,
  `role_id` bigint NOT NULL,
  `assigned_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `variant_option`
--

CREATE TABLE `variant_option` (
  `id` bigint NOT NULL,
  `value` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `variant_type_id` bigint NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `variant_option`
--

INSERT INTO `variant_option` (`id`, `value`, `variant_type_id`) VALUES
(21, 'Dream Lengths', 11),
(22, 'Hyaluron Plump', 11);

-- --------------------------------------------------------

--
-- Table structure for table `variant_type`
--

CREATE TABLE `variant_type` (
  `id` bigint NOT NULL,
  `name` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `product_id` bigint NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `variant_type`
--

INSERT INTO `variant_type` (`id`, `name`, `product_id`) VALUES
(11, 'Type', 7);

--
-- Indexes for dumped tables
--

--
-- Indexes for table `announcement`
--
ALTER TABLE `announcement`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `cart`
--
ALTER TABLE `cart`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `idx_user` (`user_id`);

--
-- Indexes for table `cart_item`
--
ALTER TABLE `cart_item`
  ADD PRIMARY KEY (`id`),
  ADD KEY `idx_cart` (`cart_id`),
  ADD KEY `idx_product` (`product_id`);

--
-- Indexes for table `categories`
--
ALTER TABLE `categories`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `name` (`name`);

--
-- Indexes for table `comment`
--
ALTER TABLE `comment`
  ADD PRIMARY KEY (`id`),
  ADD KEY `idx_user` (`user_id`),
  ADD KEY `idx_product` (`product_id`),
  ADD KEY `idx_pack` (`pack_id`);

--
-- Indexes for table `comment_images`
--
ALTER TABLE `comment_images`
  ADD KEY `idx_comment` (`comment_id`);

--
-- Indexes for table `countdown`
--
ALTER TABLE `countdown`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `coupons`
--
ALTER TABLE `coupons`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `code` (`code`),
  ADD KEY `idx_code` (`code`),
  ADD KEY `idx_type` (`type`);

--
-- Indexes for table `coupon_categories`
--
ALTER TABLE `coupon_categories`
  ADD PRIMARY KEY (`coupon_id`,`category_id`),
  ADD KEY `idx_category` (`category_id`);

--
-- Indexes for table `coupon_daily_usage`
--
ALTER TABLE `coupon_daily_usage`
  ADD PRIMARY KEY (`id`),
  ADD KEY `idx_coupon_date` (`coupon_id`,`date`);

--
-- Indexes for table `coupon_products`
--
ALTER TABLE `coupon_products`
  ADD PRIMARY KEY (`coupon_id`,`product_id`),
  ADD KEY `idx_product` (`product_id`);

--
-- Indexes for table `custom_pack`
--
ALTER TABLE `custom_pack`
  ADD PRIMARY KEY (`id`),
  ADD KEY `idx_name` (`name`);

--
-- Indexes for table `custom_pack_allowed_products`
--
ALTER TABLE `custom_pack_allowed_products`
  ADD PRIMARY KEY (`custom_pack_id`,`product_id`),
  ADD KEY `idx_product` (`product_id`);

--
-- Indexes for table `enhanced_visitor_counter_settings`
--
ALTER TABLE `enhanced_visitor_counter_settings`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `flyway_schema_history`
--
ALTER TABLE `flyway_schema_history`
  ADD PRIMARY KEY (`installed_rank`),
  ADD KEY `flyway_schema_history_s_idx` (`success`);

--
-- Indexes for table `hero`
--
ALTER TABLE `hero`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `landing_pages`
--
ALTER TABLE `landing_pages`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `slug` (`slug`),
  ADD KEY `created_by` (`created_by`),
  ADD KEY `idx_slug` (`slug`),
  ADD KEY `idx_status` (`status`),
  ADD KEY `idx_product_id` (`product_id`);

--
-- Indexes for table `landing_page_sections`
--
ALTER TABLE `landing_page_sections`
  ADD PRIMARY KEY (`id`),
  ADD KEY `idx_landing_page_order` (`landing_page_id`,`section_order`);

--
-- Indexes for table `landing_page_settings`
--
ALTER TABLE `landing_page_settings`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `landing_page_id` (`landing_page_id`);

--
-- Indexes for table `landing_page_views`
--
ALTER TABLE `landing_page_views`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `uk_landing_page_date` (`landing_page_id`,`view_date`);

--
-- Indexes for table `notification_settings`
--
ALTER TABLE `notification_settings`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `orders`
--
ALTER TABLE `orders`
  ADD PRIMARY KEY (`id`),
  ADD KEY `coupon_id` (`coupon_id`),
  ADD KEY `idx_user` (`user_id`),
  ADD KEY `idx_status` (`status`),
  ADD KEY `idx_created_at` (`created_at`),
  ADD KEY `idx_deleted` (`deleted`);

--
-- Indexes for table `order_feedback`
--
ALTER TABLE `order_feedback`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `unique_order_feedback` (`order_id`),
  ADD KEY `idx_order` (`order_id`),
  ADD KEY `idx_user` (`user_id`),
  ADD KEY `idx_rating` (`rating`),
  ADD KEY `idx_created_at` (`created_at`);

--
-- Indexes for table `order_item`
--
ALTER TABLE `order_item`
  ADD PRIMARY KEY (`id`),
  ADD KEY `idx_order` (`order_id`),
  ADD KEY `idx_product` (`product_id`);

--
-- Indexes for table `packs`
--
ALTER TABLE `packs`
  ADD PRIMARY KEY (`id`),
  ADD KEY `idx_name` (`name`),
  ADD KEY `idx_show_purchase_notifications` (`show_purchase_notifications`),
  ADD KEY `idx_show_countdown_timer` (`show_countdown_timer`);

--
-- Indexes for table `pack_items`
--
ALTER TABLE `pack_items`
  ADD PRIMARY KEY (`id`),
  ADD KEY `default_product_id` (`default_product_id`),
  ADD KEY `idx_pack` (`pack_id`);

--
-- Indexes for table `pack_item_variations`
--
ALTER TABLE `pack_item_variations`
  ADD PRIMARY KEY (`pack_item_id`,`product_id`),
  ADD KEY `idx_product` (`product_id`);

--
-- Indexes for table `pack_recommended_custom_packs`
--
ALTER TABLE `pack_recommended_custom_packs`
  ADD PRIMARY KEY (`pack_id`,`custom_pack_id`),
  ADD KEY `idx_custom_pack` (`custom_pack_id`);

--
-- Indexes for table `pack_recommended_packs`
--
ALTER TABLE `pack_recommended_packs`
  ADD PRIMARY KEY (`pack_id`,`recommended_pack_id`),
  ADD KEY `idx_recommended` (`recommended_pack_id`);

--
-- Indexes for table `pack_recommended_products`
--
ALTER TABLE `pack_recommended_products`
  ADD PRIMARY KEY (`pack_id`,`product_id`),
  ADD KEY `idx_product` (`product_id`);

--
-- Indexes for table `permissions`
--
ALTER TABLE `permissions`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `name` (`name`),
  ADD KEY `idx_permission_name` (`name`),
  ADD KEY `idx_resource` (`resource`),
  ADD KEY `idx_action` (`action`);

--
-- Indexes for table `product`
--
ALTER TABLE `product`
  ADD PRIMARY KEY (`id`),
  ADD KEY `idx_category` (`category_id`),
  ADD KEY `idx_bestseller` (`bestseller`),
  ADD KEY `idx_new_arrival` (`new_arrival`),
  ADD KEY `idx_type` (`type`),
  ADD KEY `idx_product_deleted` (`deleted`),
  ADD KEY `idx_show_purchase_notifications` (`show_purchase_notifications`),
  ADD KEY `idx_show_countdown_timer` (`show_countdown_timer`);

--
-- Indexes for table `product_frequently_bought_together`
--
ALTER TABLE `product_frequently_bought_together`
  ADD PRIMARY KEY (`product_id`,`frequently_bought_id`),
  ADD KEY `idx_frequently_bought` (`frequently_bought_id`);

--
-- Indexes for table `product_images`
--
ALTER TABLE `product_images`
  ADD KEY `idx_product` (`product_id`);

--
-- Indexes for table `product_variant`
--
ALTER TABLE `product_variant`
  ADD PRIMARY KEY (`id`),
  ADD KEY `idx_product` (`product_id`);

--
-- Indexes for table `product_variant_attributes`
--
ALTER TABLE `product_variant_attributes`
  ADD KEY `idx_variant` (`product_variant_id`);

--
-- Indexes for table `review`
--
ALTER TABLE `review`
  ADD PRIMARY KEY (`id`),
  ADD KEY `idx_approved` (`approved`),
  ADD KEY `idx_user` (`user_id`);

--
-- Indexes for table `roles`
--
ALTER TABLE `roles`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `name` (`name`),
  ADD KEY `idx_role_name` (`name`);

--
-- Indexes for table `role_permissions`
--
ALTER TABLE `role_permissions`
  ADD PRIMARY KEY (`role_id`,`permission_id`),
  ADD KEY `idx_role_id` (`role_id`),
  ADD KEY `idx_permission_id` (`permission_id`);

--
-- Indexes for table `settings`
--
ALTER TABLE `settings`
  ADD PRIMARY KEY (`setting_key`);

--
-- Indexes for table `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `email` (`email`),
  ADD KEY `idx_email` (`email`),
  ADD KEY `idx_role` (`role`);

--
-- Indexes for table `user_roles`
--
ALTER TABLE `user_roles`
  ADD PRIMARY KEY (`user_id`,`role_id`),
  ADD KEY `idx_user_id` (`user_id`),
  ADD KEY `idx_role_id` (`role_id`);

--
-- Indexes for table `variant_option`
--
ALTER TABLE `variant_option`
  ADD PRIMARY KEY (`id`),
  ADD KEY `idx_variant_type` (`variant_type_id`);

--
-- Indexes for table `variant_type`
--
ALTER TABLE `variant_type`
  ADD PRIMARY KEY (`id`),
  ADD KEY `idx_product` (`product_id`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `cart`
--
ALTER TABLE `cart`
  MODIFY `id` bigint NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT for table `cart_item`
--
ALTER TABLE `cart_item`
  MODIFY `id` bigint NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=39;

--
-- AUTO_INCREMENT for table `categories`
--
ALTER TABLE `categories`
  MODIFY `id` bigint NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=7;

--
-- AUTO_INCREMENT for table `comment`
--
ALTER TABLE `comment`
  MODIFY `id` bigint NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

--
-- AUTO_INCREMENT for table `countdown`
--
ALTER TABLE `countdown`
  MODIFY `id` bigint NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `coupons`
--
ALTER TABLE `coupons`
  MODIFY `id` bigint NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT for table `coupon_daily_usage`
--
ALTER TABLE `coupon_daily_usage`
  MODIFY `id` bigint NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `custom_pack`
--
ALTER TABLE `custom_pack`
  MODIFY `id` bigint NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT for table `hero`
--
ALTER TABLE `hero`
  MODIFY `id` bigint NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT for table `landing_pages`
--
ALTER TABLE `landing_pages`
  MODIFY `id` bigint NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT for table `landing_page_sections`
--
ALTER TABLE `landing_page_sections`
  MODIFY `id` bigint NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=794;

--
-- AUTO_INCREMENT for table `landing_page_settings`
--
ALTER TABLE `landing_page_settings`
  MODIFY `id` bigint NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT for table `landing_page_views`
--
ALTER TABLE `landing_page_views`
  MODIFY `id` bigint NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=10;

--
-- AUTO_INCREMENT for table `notification_settings`
--
ALTER TABLE `notification_settings`
  MODIFY `id` bigint NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `orders`
--
ALTER TABLE `orders`
  MODIFY `id` bigint NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=16;

--
-- AUTO_INCREMENT for table `order_feedback`
--
ALTER TABLE `order_feedback`
  MODIFY `id` bigint NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT for table `order_item`
--
ALTER TABLE `order_item`
  MODIFY `id` bigint NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=17;

--
-- AUTO_INCREMENT for table `packs`
--
ALTER TABLE `packs`
  MODIFY `id` bigint NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT for table `pack_items`
--
ALTER TABLE `pack_items`
  MODIFY `id` bigint NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=23;

--
-- AUTO_INCREMENT for table `permissions`
--
ALTER TABLE `permissions`
  MODIFY `id` bigint NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=58;

--
-- AUTO_INCREMENT for table `product`
--
ALTER TABLE `product`
  MODIFY `id` bigint NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=11;

--
-- AUTO_INCREMENT for table `product_variant`
--
ALTER TABLE `product_variant`
  MODIFY `id` bigint NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=23;

--
-- AUTO_INCREMENT for table `review`
--
ALTER TABLE `review`
  MODIFY `id` bigint NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- AUTO_INCREMENT for table `roles`
--
ALTER TABLE `roles`
  MODIFY `id` bigint NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

--
-- AUTO_INCREMENT for table `users`
--
ALTER TABLE `users`
  MODIFY `id` bigint NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=8;

--
-- AUTO_INCREMENT for table `variant_option`
--
ALTER TABLE `variant_option`
  MODIFY `id` bigint NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=23;

--
-- AUTO_INCREMENT for table `variant_type`
--
ALTER TABLE `variant_type`
  MODIFY `id` bigint NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=12;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `cart`
--
ALTER TABLE `cart`
  ADD CONSTRAINT `cart_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `cart_item`
--
ALTER TABLE `cart_item`
  ADD CONSTRAINT `cart_item_ibfk_1` FOREIGN KEY (`cart_id`) REFERENCES `cart` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `cart_item_ibfk_2` FOREIGN KEY (`product_id`) REFERENCES `product` (`id`);

--
-- Constraints for table `comment`
--
ALTER TABLE `comment`
  ADD CONSTRAINT `comment_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`),
  ADD CONSTRAINT `comment_ibfk_2` FOREIGN KEY (`product_id`) REFERENCES `product` (`id`),
  ADD CONSTRAINT `comment_ibfk_3` FOREIGN KEY (`pack_id`) REFERENCES `packs` (`id`);

--
-- Constraints for table `comment_images`
--
ALTER TABLE `comment_images`
  ADD CONSTRAINT `comment_images_ibfk_1` FOREIGN KEY (`comment_id`) REFERENCES `comment` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `coupon_categories`
--
ALTER TABLE `coupon_categories`
  ADD CONSTRAINT `coupon_categories_ibfk_1` FOREIGN KEY (`coupon_id`) REFERENCES `coupons` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `coupon_categories_ibfk_2` FOREIGN KEY (`category_id`) REFERENCES `categories` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `coupon_daily_usage`
--
ALTER TABLE `coupon_daily_usage`
  ADD CONSTRAINT `coupon_daily_usage_ibfk_1` FOREIGN KEY (`coupon_id`) REFERENCES `coupons` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `coupon_products`
--
ALTER TABLE `coupon_products`
  ADD CONSTRAINT `coupon_products_ibfk_1` FOREIGN KEY (`coupon_id`) REFERENCES `coupons` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `coupon_products_ibfk_2` FOREIGN KEY (`product_id`) REFERENCES `product` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `custom_pack_allowed_products`
--
ALTER TABLE `custom_pack_allowed_products`
  ADD CONSTRAINT `custom_pack_allowed_products_ibfk_1` FOREIGN KEY (`custom_pack_id`) REFERENCES `custom_pack` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `custom_pack_allowed_products_ibfk_2` FOREIGN KEY (`product_id`) REFERENCES `product` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `landing_pages`
--
ALTER TABLE `landing_pages`
  ADD CONSTRAINT `landing_pages_ibfk_1` FOREIGN KEY (`product_id`) REFERENCES `product` (`id`) ON DELETE SET NULL,
  ADD CONSTRAINT `landing_pages_ibfk_2` FOREIGN KEY (`created_by`) REFERENCES `users` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `landing_page_sections`
--
ALTER TABLE `landing_page_sections`
  ADD CONSTRAINT `landing_page_sections_ibfk_1` FOREIGN KEY (`landing_page_id`) REFERENCES `landing_pages` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `landing_page_settings`
--
ALTER TABLE `landing_page_settings`
  ADD CONSTRAINT `landing_page_settings_ibfk_1` FOREIGN KEY (`landing_page_id`) REFERENCES `landing_pages` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `landing_page_views`
--
ALTER TABLE `landing_page_views`
  ADD CONSTRAINT `landing_page_views_ibfk_1` FOREIGN KEY (`landing_page_id`) REFERENCES `landing_pages` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `orders`
--
ALTER TABLE `orders`
  ADD CONSTRAINT `orders_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`),
  ADD CONSTRAINT `orders_ibfk_2` FOREIGN KEY (`coupon_id`) REFERENCES `coupons` (`id`);

--
-- Constraints for table `order_feedback`
--
ALTER TABLE `order_feedback`
  ADD CONSTRAINT `order_feedback_ibfk_1` FOREIGN KEY (`order_id`) REFERENCES `orders` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `order_feedback_ibfk_2` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE SET NULL;

--
-- Constraints for table `order_item`
--
ALTER TABLE `order_item`
  ADD CONSTRAINT `order_item_ibfk_1` FOREIGN KEY (`order_id`) REFERENCES `orders` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `order_item_ibfk_2` FOREIGN KEY (`product_id`) REFERENCES `product` (`id`);

--
-- Constraints for table `pack_items`
--
ALTER TABLE `pack_items`
  ADD CONSTRAINT `pack_items_ibfk_1` FOREIGN KEY (`pack_id`) REFERENCES `packs` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `pack_items_ibfk_2` FOREIGN KEY (`default_product_id`) REFERENCES `product` (`id`);

--
-- Constraints for table `pack_item_variations`
--
ALTER TABLE `pack_item_variations`
  ADD CONSTRAINT `pack_item_variations_ibfk_1` FOREIGN KEY (`pack_item_id`) REFERENCES `pack_items` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `pack_item_variations_ibfk_2` FOREIGN KEY (`product_id`) REFERENCES `product` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `pack_recommended_custom_packs`
--
ALTER TABLE `pack_recommended_custom_packs`
  ADD CONSTRAINT `pack_recommended_custom_packs_ibfk_1` FOREIGN KEY (`pack_id`) REFERENCES `packs` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `pack_recommended_custom_packs_ibfk_2` FOREIGN KEY (`custom_pack_id`) REFERENCES `custom_pack` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `pack_recommended_packs`
--
ALTER TABLE `pack_recommended_packs`
  ADD CONSTRAINT `pack_recommended_packs_ibfk_1` FOREIGN KEY (`pack_id`) REFERENCES `packs` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `pack_recommended_packs_ibfk_2` FOREIGN KEY (`recommended_pack_id`) REFERENCES `packs` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `pack_recommended_products`
--
ALTER TABLE `pack_recommended_products`
  ADD CONSTRAINT `pack_recommended_products_ibfk_1` FOREIGN KEY (`pack_id`) REFERENCES `packs` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `pack_recommended_products_ibfk_2` FOREIGN KEY (`product_id`) REFERENCES `product` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `product`
--
ALTER TABLE `product`
  ADD CONSTRAINT `product_ibfk_1` FOREIGN KEY (`category_id`) REFERENCES `categories` (`id`);

--
-- Constraints for table `product_frequently_bought_together`
--
ALTER TABLE `product_frequently_bought_together`
  ADD CONSTRAINT `product_frequently_bought_together_ibfk_1` FOREIGN KEY (`product_id`) REFERENCES `product` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `product_frequently_bought_together_ibfk_2` FOREIGN KEY (`frequently_bought_id`) REFERENCES `product` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `product_images`
--
ALTER TABLE `product_images`
  ADD CONSTRAINT `product_images_ibfk_1` FOREIGN KEY (`product_id`) REFERENCES `product` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `product_variant`
--
ALTER TABLE `product_variant`
  ADD CONSTRAINT `product_variant_ibfk_1` FOREIGN KEY (`product_id`) REFERENCES `product` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `product_variant_attributes`
--
ALTER TABLE `product_variant_attributes`
  ADD CONSTRAINT `product_variant_attributes_ibfk_1` FOREIGN KEY (`product_variant_id`) REFERENCES `product_variant` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `review`
--
ALTER TABLE `review`
  ADD CONSTRAINT `review_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`);

--
-- Constraints for table `role_permissions`
--
ALTER TABLE `role_permissions`
  ADD CONSTRAINT `role_permissions_ibfk_1` FOREIGN KEY (`role_id`) REFERENCES `roles` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `role_permissions_ibfk_2` FOREIGN KEY (`permission_id`) REFERENCES `permissions` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `user_roles`
--
ALTER TABLE `user_roles`
  ADD CONSTRAINT `user_roles_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `user_roles_ibfk_2` FOREIGN KEY (`role_id`) REFERENCES `roles` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `variant_option`
--
ALTER TABLE `variant_option`
  ADD CONSTRAINT `variant_option_ibfk_1` FOREIGN KEY (`variant_type_id`) REFERENCES `variant_type` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `variant_type`
--
ALTER TABLE `variant_type`
  ADD CONSTRAINT `variant_type_ibfk_1` FOREIGN KEY (`product_id`) REFERENCES `product` (`id`) ON DELETE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
SET FOREIGN_KEY_CHECKS = 1;
