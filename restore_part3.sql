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
