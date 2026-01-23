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
