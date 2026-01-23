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
