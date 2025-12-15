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
                orderItem.setPrice(product.getPrice());

                // Get first image if available
                if (product.getImages() != null && !product.getImages().isEmpty()) {
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
        order.setShippingCost(new BigDecimal("10.00"));

        List<OrderItem> orderItems = createOrderItemsFromDTO(request.getCartItems(), order);
        order.setItems(orderItems);

        // Apply coupon logic (shared or duplicated - here duplicating for
        // simplicity/safety as previous session)
        BigDecimal subtotal = calculateSubtotalForGuestOrder(request.getCartItems());
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

        Order savedOrder = orderRepository.save(order);
        try {
            emailService.sendOrderConfirmation(savedOrder);
        } catch (MailException e) {
            logger.error("Failed to send order confirmation email", e);
        }
        return orderMapper.toDTO(savedOrder);
    }

    @Transactional
    public OrderDTO createGuestOrder(GuestOrderRequestDTO request) {
        // Find or create a user for the guest
        User guestUser = userRepository.findByEmail(request.getEmail())
                .orElseGet(() -> {
                    User newUser = new User();
                    newUser.setEmail(request.getEmail());
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
        // Set a default shipping cost
        order.setShippingCost(new BigDecimal("10.00"));

        // Create OrderItems using helper
        List<OrderItem> orderItems = createOrderItemsFromDTO(request.getCartItems(), order);

        order.setItems(orderItems);

        // === COUPON PROCESSING LOGIC (same as createOrder method) ===
        BigDecimal subtotal = calculateSubtotalForGuestOrder(request.getCartItems());

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
        order.setShippingCost(new BigDecimal("10.00"));

        BigDecimal subtotal = calculateSubtotal(cart.getItems());

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
        return orderMapper.toDTO(savedOrder);
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
        return orderMapper.toDTOs(orderRepository.findByDeleted(false));
    }

    @Transactional(readOnly = true)
    public OrderDTO getOrderById(Long orderId) {
        Order order = orderRepository.findById(orderId)
                .orElseThrow(() -> new ResourceNotFoundException("Order not found with id: " + orderId));
        return orderMapper.toDTO(order);
    }

    public List<OrderDTO> getUserOrders(Long userId) {
        // Corrected method call from findByUserId to findByUser_Id
        return orderMapper.toDTOs(orderRepository.findByUser_Id(userId));
    }

    public OrderDTO updateOrderStatus(Long orderId, Order.OrderStatus status) {
        Order order = orderRepository.findById(orderId)
                .orElseThrow(() -> new ResourceNotFoundException("Order not found"));
        order.setStatus(status);
        Order updatedOrder = orderRepository.save(order);
        return orderMapper.toDTO(updatedOrder);
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
}
