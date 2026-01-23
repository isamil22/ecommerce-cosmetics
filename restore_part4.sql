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
