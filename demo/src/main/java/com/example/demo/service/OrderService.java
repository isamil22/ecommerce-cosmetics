package com.example.demo.service;

import com.example.demo.dto.CartDTO;
import com.example.demo.dto.CartItemDTO;
import com.example.demo.dto.GuestOrderRequestDTO;
import com.example.demo.dto.OrderDTO;
import com.example.demo.exception.InsufficientStockException;
import com.example.demo.exception.ResourceNotFoundException;
import com.example.demo.mapper.CartMapper;
import com.example.demo.mapper.OrderMapper;
import com.example.demo.model.*;
import com.example.demo.repositories.CouponRepository;
import com.example.demo.repositories.OrderRepository;
import com.example.demo.repositories.ProductRepository;
import com.example.demo.repositories.UserRepository;
import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.mail.MailException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.io.PrintWriter;
import java.io.StringWriter;
import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class OrderService {
    private final Logger logger = LoggerFactory.getLogger(OrderService.class);

    private final OrderRepository orderRepository;
    private final CartService cartService;
    private final ProductRepository productRepository;
    private final UserRepository userRepository;
    private final EmailService emailService;
    private final OrderMapper orderMapper;
    private final CartMapper cartMapper;
    private final CouponRepository couponRepository;
    private final SettingService settingService;

    private List<OrderItem> createOrderItemsFromDTO(List<CartItemDTO> itemDTOs, Order order) {
        return itemDTOs.stream().map(itemDTO -> {
            OrderItem orderItem = new OrderItem();
            orderItem.setOrder(order);
            orderItem.setQuantity(itemDTO.getQuantity());

            if (itemDTO.getProductId() != null) {
                // Standard Product
                Product product = productRepository.findById(itemDTO.getProductId())
                        .orElseThrow(() -> new ResourceNotFoundException(
                                "Product not found with id: " + itemDTO.getProductId()));

                if (product.getQuantity() < itemDTO.getQuantity()) {
                    throw new InsufficientStockException("Not enough stock for product " + product.getName());
                }

                // Decrease product stock
                product.setQuantity(product.getQuantity() - itemDTO.getQuantity());
                productRepository.save(product);

                orderItem.setProduct(product);
                orderItem.setProductName(product.getName());

                // Fix for Admin Panel Price: Use price from DTO if provided (for
                // packs/overrides), else use DB price
                if (itemDTO.getPrice() != null) {
                    orderItem.setPrice(itemDTO.getPrice());
                } else {
                    orderItem.setPrice(product.getPrice());
                }

                // Set Image: Use DTO image if available (from Variant selection), else Product
                // Default
                if (itemDTO.getImageUrl() != null && !itemDTO.getImageUrl().isEmpty()) {
                    orderItem.setProductImage(itemDTO.getImageUrl());
                } else if (product.getImages() != null && !product.getImages().isEmpty()) {
                    orderItem.setProductImage(product.getImages().get(0));
                }
            } else {
                // Direct product (no DB record)
                if (itemDTO.getProductName() == null || itemDTO.getPrice() == null) {
                    throw new IllegalArgumentException("Direct orders must have product name and price");
                }
                orderItem.setProductName(itemDTO.getProductName());
                orderItem.setPrice(itemDTO.getPrice());
                orderItem.setProductImage(itemDTO.getImageUrl());
                orderItem.setProduct(null);
            }

            // Set Variant Name
            System.out.println("DEBUG: Saving OrderItem. Product: " + orderItem.getProductName() + ", Variant: "
                    + itemDTO.getVariantName());
            orderItem.setVariantName(itemDTO.getVariantName());

            return orderItem;
        }).collect(Collectors.toList());
    }

    @Transactional
    public OrderDTO createDirectOrder(Long userId, GuestOrderRequestDTO request) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        if (request.getCartItems() == null || request.getCartItems().isEmpty()) {
            throw new IllegalStateException("Cannot create an order with an empty cart");
        }

        Order order = new Order();
        order.setUser(user);
        order.setClientFullName(request.getClientFullName());
        order.setCity(request.getCity());
        order.setAddress(request.getAddress());
        order.setPhoneNumber(request.getPhoneNumber());
        order.setStatus(Order.OrderStatus.PREPARING);
        order.setCreatedAt(LocalDateTime.now());
        // Apply coupon logic (shared or duplicated - here duplicating for
        // simplicity/safety as previous session)
        BigDecimal subtotal = calculateSubtotalForGuestOrder(request.getCartItems());

        // Calculate Shipping
        int totalQuantity = request.getCartItems().stream().mapToInt(CartItemDTO::getQuantity).sum();
        order.setShippingCost(calculateShippingCost(request.getCity(), totalQuantity, subtotal));
        if (request.getCouponCode() != null && !request.getCouponCode().trim().isEmpty()) {
            Coupon coupon = couponRepository.findByCode(request.getCouponCode())
                    .orElseThrow(() -> new ResourceNotFoundException("Coupon not found: " + request.getCouponCode()));

            // Validation (simplified for direct order - copy from guest)
            if (coupon.getExpiryDate().isBefore(LocalDateTime.now())) {
                throw new IllegalStateException("Coupon has expired.");
            }
            if (coupon.getUsageLimit() > 0
                    && (coupon.getTimesUsed() != null ? coupon.getTimesUsed() : 0) >= coupon.getUsageLimit()) {
                throw new IllegalStateException("Coupon has reached its usage limit.");
            }
            if (coupon.getMinPurchaseAmount() != null && subtotal.compareTo(coupon.getMinPurchaseAmount()) < 0) {
                throw new IllegalStateException("Order total does not meet the minimum purchase amount.");
            }
            if (coupon.isFirstTimeOnly() && orderRepository.existsByUser_Id(userId)) {
                throw new IllegalStateException("This coupon is for first-time customers only.");
            }
            if (!isCouponApplicableToGuestCart(coupon, request.getCartItems())) { // Use DTO check
                throw new IllegalStateException("This coupon is not valid for these items.");
            }

            // Discount
            BigDecimal discountAmount = BigDecimal.ZERO;
            if (coupon.getDiscountType() == Coupon.DiscountType.FIXED_AMOUNT) {
                discountAmount = coupon.getDiscountValue();
            } else if (coupon.getDiscountType() == Coupon.DiscountType.PERCENTAGE) {
                BigDecimal applicableSubtotal = getApplicableSubtotalForGuestCart(coupon, request.getCartItems());
                discountAmount = applicableSubtotal.multiply(coupon.getDiscountValue().divide(new BigDecimal("100")));
            }
            if (coupon.getDiscountType() == Coupon.DiscountType.FREE_SHIPPING) {
                order.setShippingCost(BigDecimal.ZERO);
            }
            order.setCoupon(coupon);
            order.setDiscountAmount(discountAmount);
            coupon.setTimesUsed((coupon.getTimesUsed() != null ? coupon.getTimesUsed() : 0) + 1);
            couponRepository.save(coupon);
        } else {
            order.setDiscountAmount(BigDecimal.ZERO);
        }

        List<OrderItem> items = createOrderItemsFromDTO(request.getCartItems(), order);
        order.setItems(items);

        Order savedOrder = orderRepository.save(order);
        try {
            emailService.sendOrderConfirmation(savedOrder);
        } catch (MailException e) {
            logger.error("Failed to send order confirmation email", e);
        }

        OrderDTO orderDTO = orderMapper.toDTO(savedOrder);

        // Generate Next Purchase Coupon if eligible
        // REMOVED: Now happens on Delivery due to COD model

        return orderDTO;
    }

    @Transactional
    public OrderDTO createGuestOrder(GuestOrderRequestDTO request) {
        // Generate synthetic email if missing (using phone number)
        String email = request.getEmail();
        if (email == null || email.trim().isEmpty()) {
            email = request.getPhoneNumber().replaceAll("\\s+", "") + "@guest.local";
        }
        final String finalEmail = email;

        // Find or create a user for the guest
        User guestUser = userRepository.findByEmail(finalEmail)
                .orElseGet(() -> {
                    User newUser = new User();
                    newUser.setEmail(finalEmail);
                    newUser.setFullName(request.getClientFullName());
                    // Guests don't have a password until they register
                    newUser.setPassword(null);
                    newUser.setRole(User.Role.USER); // Or a dedicated GUEST role
                    newUser.setEmailConfirmation(true); // Or handle confirmation separately
                    return userRepository.save(newUser);
                });

        if (request.getCartItems() == null || request.getCartItems().isEmpty()) {
            throw new IllegalStateException("Cannot create an order with an empty cart");
        }

        Order order = new Order();
        order.setUser(guestUser);
        order.setClientFullName(request.getClientFullName());
        order.setCity(request.getCity());
        order.setAddress(request.getAddress());
        order.setPhoneNumber(request.getPhoneNumber());
        order.setStatus(Order.OrderStatus.PREPARING);
        order.setCreatedAt(LocalDateTime.now());
        // === COUPON PROCESSING LOGIC (same as createOrder method) ===
        BigDecimal subtotal = calculateSubtotalForGuestOrder(request.getCartItems());

        // Set a default shipping cost
        // Calculate Shipping
        int totalQuantity = request.getCartItems().stream().mapToInt(CartItemDTO::getQuantity).sum();
        order.setShippingCost(calculateShippingCost(request.getCity(), totalQuantity, subtotal));

        if (request.getCouponCode() != null && !request.getCouponCode().trim().isEmpty()) {
            Coupon coupon = couponRepository.findByCode(request.getCouponCode())
                    .orElseThrow(() -> new ResourceNotFoundException("Coupon not found: " + request.getCouponCode()));

            // === Start of Validation Logic ===
            if (coupon.getExpiryDate().isBefore(LocalDateTime.now())) {
                throw new IllegalStateException("Coupon has expired.");
            }
            if (coupon.getUsageLimit() > 0
                    && (coupon.getTimesUsed() != null ? coupon.getTimesUsed() : 0) >= coupon.getUsageLimit()) {
                throw new IllegalStateException("Coupon has reached its usage limit.");
            }
            if (coupon.getMinPurchaseAmount() != null && subtotal.compareTo(coupon.getMinPurchaseAmount()) < 0) {
                throw new IllegalStateException(
                        "Order total does not meet the minimum purchase amount for this coupon.");
            }

            // First-Time Customer Validation for guest orders
            if (coupon.isFirstTimeOnly() && orderRepository.existsByUser_Id(guestUser.getId())) {
                throw new IllegalStateException("This coupon is for first-time customers only.");
            }

            // Product/Category Specific Validation for guest orders
            boolean isApplicable = isCouponApplicableToGuestCart(coupon, request.getCartItems());
            if (!isApplicable) {
                throw new IllegalStateException("This coupon is not valid for the items in your cart.");
            }
            // === End of Validation Logic ===

            // === Start of Discount Calculation ===
            BigDecimal discountAmount = BigDecimal.ZERO;
            if (coupon.getDiscountType() == Coupon.DiscountType.FIXED_AMOUNT) {
                discountAmount = coupon.getDiscountValue();
            } else if (coupon.getDiscountType() == Coupon.DiscountType.PERCENTAGE) {
                // Apply percentage discount only on applicable items
                BigDecimal applicableSubtotal = getApplicableSubtotalForGuestCart(coupon, request.getCartItems());
                discountAmount = applicableSubtotal.multiply(coupon.getDiscountValue().divide(new BigDecimal("100")));
            }

            // Handle Free Shipping
            if (coupon.getDiscountType() == Coupon.DiscountType.FREE_SHIPPING) {
                order.setShippingCost(BigDecimal.ZERO);
            }
            // === End of Discount Calculation ===

            order.setCoupon(coupon);
            order.setDiscountAmount(discountAmount);

            // Fix: Handle null timesUsed field
            int currentUsage = coupon.getTimesUsed() != null ? coupon.getTimesUsed() : 0;
            coupon.setTimesUsed(currentUsage + 1);
            couponRepository.save(coupon);
        } else {
            order.setDiscountAmount(BigDecimal.ZERO);
        }
        // === END COUPON PROCESSING LOGIC ===

        List<OrderItem> items = createOrderItemsFromDTO(request.getCartItems(), order);
        order.setItems(items);

        Order savedOrder = orderRepository.save(order);

        try {
            emailService.sendOrderConfirmation(savedOrder);
        } catch (MailException e) {
            logger.error("Failed to send guest order confirmation email for order ID " + savedOrder.getId(), e);
        }

        return orderMapper.toDTO(savedOrder);
    }

    @Transactional
    public OrderDTO createOrder(Long userId, String address, String phoneNumber, String clientFullName, String city,
            String couponCode) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));
        if (!user.isEmailConfirmation()) {
            throw new IllegalStateException("Email not confirmed. Please confirm email before placing order");
        }
        CartDTO cartDTO = cartService.getCart(userId);
        Cart cart = cartMapper.toEntity(cartDTO);

        if (cart.getItems().isEmpty()) {
            throw new IllegalStateException("Cannot create an order with an empty cart");
        }

        // ======================= FIX START =======================
        // The cart object from the mapper has products with only an ID.
        // We need to load the full product details for each cart item.
        for (CartItem item : cart.getItems()) {
            if (item.getProduct() != null && item.getProduct().getId() != null) {
                Product fullProduct = productRepository.findById(item.getProduct().getId())
                        .orElseThrow(() -> new ResourceNotFoundException(
                                "Product not found in cart with ID: " + item.getProduct().getId()));
                item.setProduct(fullProduct);
            } else {
                item.setProduct(null);
            }
        }
        // ======================== FIX END ========================

        Order order = new Order();
        order.setUser(user);
        order.setClientFullName(clientFullName);
        order.setCity(city);
        order.setAddress(address);
        order.setPhoneNumber(phoneNumber);
        order.setStatus(Order.OrderStatus.PREPARING);
        order.setCreatedAt(LocalDateTime.now());
        // Set a default shipping cost
        BigDecimal subtotal = calculateSubtotal(cart.getItems());

        // Calculate Shipping
        int totalQuantity = cart.getItems().stream().mapToInt(CartItem::getQuantity).sum();
        order.setShippingCost(calculateShippingCost(city, totalQuantity, subtotal));

        if (couponCode != null && !couponCode.trim().isEmpty()) {
            Coupon coupon = couponRepository.findByCode(couponCode)
                    .orElseThrow(() -> new ResourceNotFoundException("Coupon not found: " + couponCode));

            // === Start of Validation Logic ===

            if (coupon.getExpiryDate().isBefore(LocalDateTime.now())) {
                throw new IllegalStateException("Coupon has expired.");
            }
            if (coupon.getUsageLimit() > 0
                    && (coupon.getTimesUsed() != null ? coupon.getTimesUsed() : 0) >= coupon.getUsageLimit()) {
                throw new IllegalStateException("Coupon has reached its usage limit.");
            }
            if (coupon.getMinPurchaseAmount() != null && subtotal.compareTo(coupon.getMinPurchaseAmount()) < 0) {
                throw new IllegalStateException(
                        "Order total does not meet the minimum purchase amount for this coupon.");
            }

            // New: First-Time Customer Validation
            // Corrected method call from existsByUserId to existsByUser_Id
            if (coupon.isFirstTimeOnly() && orderRepository.existsByUser_Id(userId)) {
                throw new IllegalStateException("This coupon is for first-time customers only.");
            }

            // New: Product/Category Specific Validation
            boolean isApplicable = isCouponApplicableToCart(coupon, cart);
            if (!isApplicable) {
                throw new IllegalStateException("This coupon is not valid for the items in your cart.");
            }

            // === End of Validation Logic ===

            // === Start of Discount Calculation ===
            BigDecimal discountAmount = BigDecimal.ZERO;
            if (coupon.getDiscountType() == Coupon.DiscountType.FIXED_AMOUNT) {
                discountAmount = coupon.getDiscountValue();
            } else if (coupon.getDiscountType() == Coupon.DiscountType.PERCENTAGE) {
                // Apply percentage discount only on applicable items
                BigDecimal applicableSubtotal = getApplicableSubtotal(coupon, cart);
                discountAmount = applicableSubtotal.multiply(coupon.getDiscountValue().divide(new BigDecimal("100")));
            }

            // Handle Free Shipping
            if (coupon.getDiscountType() == Coupon.DiscountType.FREE_SHIPPING) {
                order.setShippingCost(BigDecimal.ZERO);
            }
            // === End of Discount Calculation ===

            order.setCoupon(coupon);
            order.setDiscountAmount(discountAmount);

            // Fix: Handle null timesUsed field
            int currentUsage = coupon.getTimesUsed() != null ? coupon.getTimesUsed() : 0;
            coupon.setTimesUsed(currentUsage + 1);
            couponRepository.save(coupon);
        } else {
            order.setDiscountAmount(BigDecimal.ZERO);
        }

        List<OrderItem> orderItems = createOrderItems(cart, order);
        order.setItems(orderItems);

        Order savedOrder = orderRepository.save(order);
        cartService.clearCart(userId);

        try {
            emailService.sendOrderConfirmation(savedOrder);
        } catch (MailException e) {
            logger.error("Failed to send order confirmation email for order ID " + savedOrder.getId(), e);
        }

        OrderDTO orderDTO = orderMapper.toDTO(savedOrder);

        // Generate Next Purchase Coupon if eligible
        // REMOVED: Now happens on Delivery due to COD model

        return orderDTO;
    }

    private List<OrderItem> createOrderItems(Cart cart, Order order) {
        return cart.getItems().stream().map(cartItem -> {
            OrderItem orderItem = new OrderItem();
            orderItem.setOrder(order);
            orderItem.setQuantity(cartItem.getQuantity());

            Product product = cartItem.getProduct();
            if (product != null) {
                // Standard Product Logic
                if (product.getQuantity() < cartItem.getQuantity()) {
                    throw new InsufficientStockException("Not enough stock for product " + product.getName());
                }

                // Decrease stock
                product.setQuantity(product.getQuantity() - cartItem.getQuantity());
                productRepository.save(product);

                orderItem.setProduct(product);
                orderItem.setProductName(product.getName());
                orderItem.setPrice(product.getPrice());
                if (product.getImages() != null && !product.getImages().isEmpty()) {
                    orderItem.setProductImage(product.getImages().get(0));
                }
            } else {
                // Virtual Product Logic
                if (cartItem.getProductName() == null || cartItem.getPrice() == null) {
                    throw new IllegalStateException("Cart item missing product details");
                }
                orderItem.setProduct(null);
                orderItem.setProductName(cartItem.getProductName());
                orderItem.setPrice(cartItem.getPrice());
                orderItem.setProductImage(cartItem.getImageUrl());
            }

            // Copy Variant Name
            orderItem.setVariantName(cartItem.getVariantName());

            return orderItem;
        }).collect(Collectors.toList());
    }

    private boolean isCouponApplicableToCart(Coupon coupon, Cart cart) {
        boolean productSpecific = coupon.getApplicableProducts() != null && !coupon.getApplicableProducts().isEmpty();
        boolean categorySpecific = coupon.getApplicableCategories() != null
                && !coupon.getApplicableCategories().isEmpty();

        // If not restricted by product or category, it's applicable to the whole cart
        if (!productSpecific && !categorySpecific) {
            return true;
        }

        return cart.getItems().stream().anyMatch(item -> {
            boolean matchesProduct = productSpecific && item.getProduct() != null
                    && coupon.getApplicableProducts().contains(item.getProduct());
            boolean matchesCategory = categorySpecific && item.getProduct() != null
                    && item.getProduct().getCategory() != null
                    && coupon.getApplicableCategories().contains(item.getProduct().getCategory());
            return matchesProduct || matchesCategory;
        });
    }

    private BigDecimal getApplicableSubtotal(Coupon coupon, Cart cart) {
        boolean productSpecific = coupon.getApplicableProducts() != null && !coupon.getApplicableProducts().isEmpty();
        boolean categorySpecific = coupon.getApplicableCategories() != null
                && !coupon.getApplicableCategories().isEmpty();

        if (!productSpecific && !categorySpecific) {
            return calculateSubtotal(cart.getItems()); // Apply to whole cart if no restrictions
        }

        return cart.getItems().stream()
                .filter(item -> {
                    boolean matchesProduct = productSpecific
                            && item.getProduct() != null
                            && coupon.getApplicableProducts().contains(item.getProduct());
                    boolean matchesCategory = categorySpecific && item.getProduct() != null
                            && item.getProduct().getCategory() != null
                            && coupon.getApplicableCategories().contains(item.getProduct().getCategory());
                    return matchesProduct || matchesCategory;
                })
                .map(item -> {
                    BigDecimal price = item.getProduct() != null ? item.getProduct().getPrice() : item.getPrice();
                    return price.multiply(new BigDecimal(item.getQuantity()));
                })
                .reduce(BigDecimal.ZERO, BigDecimal::add);
    }

    private BigDecimal calculateSubtotal(List<CartItem> items) {
        return items.stream()
                .map(item -> {
                    BigDecimal price = item.getProduct() != null ? item.getProduct().getPrice() : item.getPrice();
                    return price.multiply(new BigDecimal(item.getQuantity()));
                })
                .reduce(BigDecimal.ZERO, BigDecimal::add);
    }

    private BigDecimal calculateSubtotalForGuestOrder(List<CartItemDTO> cartItems) {
        return cartItems.stream()
                .map(itemDTO -> {
                    if (itemDTO.getProductId() != null) {
                        Product product = productRepository.findById(itemDTO.getProductId())
                                .orElseThrow(() -> new ResourceNotFoundException(
                                        "Product not found with id: " + itemDTO.getProductId()));

                        // Fix: Use price from DTO if available (for packs/variants), else use DB price
                        if (itemDTO.getPrice() != null) {
                            return itemDTO.getPrice().multiply(new BigDecimal(itemDTO.getQuantity()));
                        }
                        return product.getPrice().multiply(new BigDecimal(itemDTO.getQuantity()));
                    } else {
                        // Direct order item
                        if (itemDTO.getPrice() == null) {
                            throw new IllegalArgumentException("Price is missing for direct order item");
                        }
                        return itemDTO.getPrice().multiply(new BigDecimal(itemDTO.getQuantity()));
                    }
                })
                .reduce(BigDecimal.ZERO, BigDecimal::add);
    }

    private boolean isCouponApplicableToGuestCart(Coupon coupon, List<CartItemDTO> cartItems) {
        boolean productSpecific = coupon.getApplicableProducts() != null && !coupon.getApplicableProducts().isEmpty();
        boolean categorySpecific = coupon.getApplicableCategories() != null
                && !coupon.getApplicableCategories().isEmpty();

        // If not restricted by product or category, it's applicable to the whole cart
        if (!productSpecific && !categorySpecific) {
            return true;
        }

        return cartItems.stream().anyMatch(itemDTO -> {
            if (itemDTO.getProductId() != null) {
                Product product = productRepository.findById(itemDTO.getProductId())
                        .orElseThrow(() -> new ResourceNotFoundException(
                                "Product not found with id: " + itemDTO.getProductId()));

                boolean matchesProduct = productSpecific && coupon.getApplicableProducts().contains(product);
                boolean matchesCategory = categorySpecific
                        && coupon.getApplicableCategories().contains(product.getCategory());
                return matchesProduct || matchesCategory;
            } else {
                // Direct items cannot match specific products/categories in this implementation
                // unless we map variant names or titles to categories, which is complex.
                // For now, assume Not Applicable if restricted.
                return false;
            }
        });
    }

    private BigDecimal getApplicableSubtotalForGuestCart(Coupon coupon, List<CartItemDTO> cartItems) {
        boolean productSpecific = coupon.getApplicableProducts() != null && !coupon.getApplicableProducts().isEmpty();
        boolean categorySpecific = coupon.getApplicableCategories() != null
                && !coupon.getApplicableCategories().isEmpty();

        if (!productSpecific && !categorySpecific) {
            return calculateSubtotalForGuestOrder(cartItems); // Apply to whole cart if no restrictions
        }

        return cartItems.stream()
                .filter(itemDTO -> {
                    if (itemDTO.getProductId() != null) {
                        Product product = productRepository.findById(itemDTO.getProductId())
                                .orElseThrow(() -> new ResourceNotFoundException(
                                        "Product not found with id: " + itemDTO.getProductId()));

                        boolean matchesProduct = productSpecific && coupon.getApplicableProducts().contains(product);
                        boolean matchesCategory = categorySpecific && product.getCategory() != null
                                && coupon.getApplicableCategories().contains(product.getCategory());
                        return matchesProduct || matchesCategory;
                    } else {
                        return false;
                    }
                })
                .map(itemDTO -> {
                    // We already fetched product in filter, but clean code:
                    if (itemDTO.getProductId() != null) {
                        // Fix: Use price from DTO if available
                        if (itemDTO.getPrice() != null) {
                            return itemDTO.getPrice().multiply(new BigDecimal(itemDTO.getQuantity()));
                        }

                        Product product = productRepository.findById(itemDTO.getProductId())
                                .orElseThrow(() -> new ResourceNotFoundException(
                                        "Product not found with id: " + itemDTO.getProductId()));
                        return product.getPrice().multiply(new BigDecimal(itemDTO.getQuantity()));
                    }
                    return BigDecimal.ZERO;
                })
                .reduce(BigDecimal.ZERO, BigDecimal::add);
    }

    @Transactional(readOnly = true)
    public List<OrderDTO> getAllOrders() {
        return orderMapper.toDTOs(orderRepository.findByDeletedFalseOrderByCreatedAtDesc());
    }

    @Transactional(readOnly = true)
    public OrderDTO getOrderById(Long orderId) {
        Order order = orderRepository.findByIdWithItems(orderId)
                .orElseThrow(() -> new ResourceNotFoundException("Order not found with id: " + orderId));
        OrderDTO dto = orderMapper.toDTO(order);
        populateCouponInfo(dto);
        return dto;
    }

    public List<OrderDTO> getUserOrders(Long userId) {
        // Corrected method call from findByUserId to findByUser_Id
        return orderMapper.toDTOs(orderRepository.findByUser_Id(userId));
    }

    public OrderDTO updateOrderStatus(Long orderId, Order.OrderStatus status) {
        Order order = orderRepository.findById(orderId)
                .orElseThrow(() -> new ResourceNotFoundException("Order not found"));

        Order.OrderStatus oldStatus = order.getStatus();
        order.setStatus(status);
        // FORCE FLUSH to ensure the countByUser query sees this order as DELIVERED
        Order updatedOrder = orderRepository.saveAndFlush(order);

        // Check if status changed to DELIVERED
        if (oldStatus != Order.OrderStatus.DELIVERED && status == Order.OrderStatus.DELIVERED) {
            // Generate coupon if eligible
            Coupon nextCoupon = generateNextPurchaseCoupon(updatedOrder);
            if (nextCoupon != null) {
                // Send email with coupon
                try {
                    logger.info("Generated Reward Coupon {} for Order {}", nextCoupon.getCode(), order.getId());
                } catch (Exception e) {
                    logger.error("Failed to send reward email", e);
                }
            }
        }

        OrderDTO dto = orderMapper.toDTO(updatedOrder);
        populateCouponInfo(dto);
        return dto;
    }

    // ==========================================
    // SHIPPING COST CALCULATION (SMART LOGIC)
    // ==========================================
    private BigDecimal calculateShippingCost(String city, int totalQuantity, BigDecimal subtotal) {
        if (totalQuantity <= 0)
            return BigDecimal.ZERO;

        // FREE SHIPPING THRESHOLD: 500 DH
        BigDecimal freeShippingThreshold = new BigDecimal("500.00");
        if (subtotal != null && subtotal.compareTo(freeShippingThreshold) >= 0) {
            return BigDecimal.ZERO;
        }

        // 1. Identify Zone (Remote vs Standard)
        boolean isRemote = isRemoteCity(city);

        // Define Rates
        BigDecimal basePrice = isRemote ? new BigDecimal("50.00") : new BigDecimal("35.00");
        BigDecimal extraItemCost = new BigDecimal("5.00");
        BigDecimal maxShipping = new BigDecimal("50.00"); // Cap defined by user

        // Logic: Base + ((Qty - 1) * 5)
        BigDecimal quantityFactor = new BigDecimal(Math.max(0, totalQuantity - 1));
        BigDecimal calculatedCost = basePrice.add(quantityFactor.multiply(extraItemCost));

        // Apply Cap (Shipping never exceeds 50 DH)
        // Note: For Remote cities (Base 50), this means it will always simply be 50.
        if (calculatedCost.compareTo(maxShipping) > 0) {
            return maxShipping;
        }
        return calculatedCost;
    }

    private boolean isRemoteCity(String city) {
        if (city == null)
            return false;
        String normalizedCity = city.trim().toLowerCase();
        // Common southern/remote cities in Morocco
        return normalizedCity.contains("laayoune") ||
                normalizedCity.contains("dakhla") ||
                normalizedCity.contains("boujdour") ||
                normalizedCity.contains("smara") ||
                normalizedCity.contains("guerguerat") ||
                normalizedCity.contains("aousserd") ||
                normalizedCity.contains("bir gandouz");
    }

    private void populateCouponInfo(OrderDTO dto) {
        if (dto == null || dto.getId() == null)
            return;

        // Search for coupons generated for this order
        // Prefix is NEXT-{orderId}- or LOYALTY-{orderId}-
        String nextPrefix = "NEXT-" + dto.getId() + "-";
        String loyaltyPrefix = "LOYALTY-" + dto.getId() + "-";

        List<Coupon> coupons = couponRepository.findByCodeStartingWith(nextPrefix);
        if (coupons.isEmpty()) {
            coupons = couponRepository.findByCodeStartingWith(loyaltyPrefix);
        }

        if (!coupons.isEmpty()) {
            // Pick the first one (most recent?)
            Coupon coupon = coupons.get(0);
            dto.setNextPurchaseCouponCode(coupon.getCode());
            dto.setNextPurchaseCouponPercent(coupon.getDiscountValue());
        }
    }

    public void softDeleteOrder(Long orderId) {
        Order order = orderRepository.findById(orderId)
                .orElseThrow(() -> new ResourceNotFoundException("Order not found with id: " + orderId));

        order.setDeleted(true);
        orderRepository.save(order);
    }

    public void restoreOrder(Long orderId) {
        Order order = orderRepository.findById(orderId)
                .orElseThrow(() -> new ResourceNotFoundException("Order not found with id: " + orderId));

        order.setDeleted(false);
        orderRepository.save(order);
    }

    public List<OrderDTO> getDeletedOrders() {
        return orderMapper.toDTOs(orderRepository.findByDeleted(true));
    }

    public void deleteAllOrders() {
        orderRepository.deleteAll();
    }

    public String exportOrdersToCsv() {
        List<Order> orders = orderRepository.findAllForExportWithRelations();
        StringWriter sw = new StringWriter();
        PrintWriter pw = new PrintWriter(sw);

        // Enhanced CSV header with comprehensive order information
        pw.println("Order ID,User ID,Customer Name,City,Address,Phone Number,Status,Created At," +
                "Coupon Code,Discount Amount,Shipping Cost,Total Items,Total Quantity," +
                "Order Items Details,Total Amount");

        for (Order order : orders) {
            // Calculate order totals
            int totalItems = order.getItems().size();
            int totalQuantity = order.getItems().stream()
                    .mapToInt(OrderItem::getQuantity)
                    .sum();

            // Calculate total amount from items
            BigDecimal itemsTotal = order.getItems().stream()
                    .map(item -> item.getPrice().multiply(BigDecimal.valueOf(item.getQuantity())))
                    .reduce(BigDecimal.ZERO, BigDecimal::add);

            // Calculate final total (items total - discount + shipping)
            BigDecimal discountAmount = order.getDiscountAmount() != null ? order.getDiscountAmount() : BigDecimal.ZERO;
            BigDecimal shippingCost = order.getShippingCost() != null ? order.getShippingCost() : BigDecimal.ZERO;
            BigDecimal finalTotal = itemsTotal.subtract(discountAmount).add(shippingCost);

            // Format order items details
            StringBuilder itemsDetails = new StringBuilder();
            for (OrderItem item : order.getItems()) {
                if (itemsDetails.length() > 0) {
                    itemsDetails.append("; ");
                }
                String pName = item.getProductName() != null ? item.getProductName()
                        : (item.getProduct() != null ? item.getProduct().getName() : "Unknown Product");
                itemsDetails.append(pName)
                        .append(" (Qty: ").append(item.getQuantity())
                        .append(", Price: $").append(item.getPrice())
                        .append(")");
            }

            // Escape CSV values that contain commas or quotes
            String escapedItemsDetails = "\"" + itemsDetails.toString().replace("\"", "\"\"") + "\"";
            String escapedAddress = "\"" + order.getAddress().replace("\"", "\"\"") + "\"";

            pw.println(String.join(",",
                    String.valueOf(order.getId()),
                    order.getUser() != null ? String.valueOf(order.getUser().getId()) : "N/A",
                    "\"" + order.getClientFullName().replace("\"", "\"\"") + "\"",
                    "\"" + order.getCity().replace("\"", "\"\"") + "\"",
                    escapedAddress,
                    "\"" + order.getPhoneNumber().replace("\"", "\"\"") + "\"",
                    String.valueOf(order.getStatus()),
                    String.valueOf(order.getCreatedAt()),
                    order.getCoupon() != null ? "\"" + order.getCoupon().getCode().replace("\"", "\"\"") + "\"" : "N/A",
                    discountAmount.toString(),
                    shippingCost.toString(),
                    String.valueOf(totalItems),
                    String.valueOf(totalQuantity),
                    escapedItemsDetails,
                    finalTotal.toString()));
        }
        return sw.toString();
    }

    /**
     * Generates a coupon for the next purchase if the order total exceeds a
     * threshold.
     * Rule: If Total > 500, Generate 10% OFF coupon.
     */
    private Coupon generateNextPurchaseCoupon(Order order) {
        // --- 0. REGISTERED USER CHECK ---
        // Only generate for users who have an account (password is not null)
        if (order.getUser().getPassword() == null) {
            return null;
        }

        // --- 1. LOYALTY PROGRAM CHECK ---
        // Get configured loyalty count (default 3)
        int loyaltyCount = settingService.getIntSetting(com.example.demo.constant.SettingKeys.LOYALTY_ORDER_COUNT, 3);

        // Count previous DELIVERED orders for this user
        long orderCount = orderRepository.countByUser_IdAndStatus(order.getUser().getId(), Order.OrderStatus.DELIVERED);
        // Note: The current order is just now DELIVERED, so it is included in the
        // count.

        if (orderCount > 0 && orderCount % loyaltyCount == 0) {
            // Generate Loyalty Coupon
            BigDecimal discountPercent = settingService
                    .getBigDecimalSetting(com.example.demo.constant.SettingKeys.LOYALTY_DISCOUNT_PERCENT, "15");

            return createCoupon(order, "LOYALTY", discountPercent, "Loyalty Reward for Order #" + order.getId());
        }

        // --- 2. HIGH VALUE ORDER CHECK ---
        // Only if it's a paid/delivered order (which it is, since we are in DELIVERED
        // hook)
        BigDecimal total = BigDecimal.ZERO;
        for (OrderItem item : order.getItems()) {
            BigDecimal price = item.getPrice();
            total = total.add(price.multiply(BigDecimal.valueOf(item.getQuantity())));
        }
        if (order.getDiscountAmount() != null) {
            total = total.subtract(order.getDiscountAmount());
        }

        BigDecimal highValueThreshold = settingService
                .getBigDecimalSetting(com.example.demo.constant.SettingKeys.HIGH_VALUE_THRESHOLD, "500");

        if (total.compareTo(highValueThreshold) > 0) {
            BigDecimal discountPercent = settingService
                    .getBigDecimalSetting(com.example.demo.constant.SettingKeys.HIGH_VALUE_DISCOUNT_PERCENT, "10");

            return createCoupon(order, "NEXT", discountPercent, "Thank you reward for Order #" + order.getId());
        }

        return null;
    }

    private Coupon createCoupon(Order order, String prefix, BigDecimal percent, String name) {
        Coupon coupon = new Coupon();
        String code = prefix + "-" + order.getId() + "-"
                + java.util.UUID.randomUUID().toString().substring(0, 4).toUpperCase();
        coupon.setCode(code);
        coupon.setName(name);
        coupon.setDiscountType(Coupon.DiscountType.PERCENTAGE);
        coupon.setDiscountValue(percent);
        coupon.setExpiryDate(LocalDateTime.now().plusDays(30));
        coupon.setType(Coupon.CouponType.USER);
        coupon.setUser(order.getUser());
        coupon.setUsageLimit(1);
        coupon.setTimesUsed(0);
        coupon.setFirstTimeOnly(false);
        coupon.setMinPurchaseAmount(BigDecimal.ZERO);

        return couponRepository.save(coupon);
    }
}
