package com.example.demo.service;

import com.example.demo.model.Order;
import com.example.demo.model.OrderItem;
import com.example.demo.model.Product;
import com.example.demo.repositories.OrderRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.Collections;

import static org.junit.jupiter.api.Assertions.assertDoesNotThrow;
import static org.junit.jupiter.api.Assertions.assertTrue;
import static org.mockito.Mockito.when;

class DirectOrderCsvTest {

    @Mock
    private OrderRepository orderRepository;

    @Mock
    private CartService cartService; // Required for constructor

    @Mock
    private com.example.demo.repositories.ProductRepository productRepository; // Required for constructor

    @Mock
    private com.example.demo.repositories.UserRepository userRepository; // Required for constructor

    @Mock
    private EmailService emailService; // Required for constructor

    @Mock
    private com.example.demo.mapper.OrderMapper orderMapper; // Required for constructor

    @Mock
    private com.example.demo.mapper.CartMapper cartMapper; // Required for constructor

    @Mock
    private com.example.demo.repositories.CouponRepository couponRepository; // Required for constructor

    @Mock
    private SettingService settingService; // Required for constructor

    private OrderService orderService;

    @BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this);
        orderService = new OrderService(
                orderRepository,
                cartService,
                productRepository,
                userRepository,
                emailService,
                orderMapper,
                cartMapper,
                couponRepository,
                settingService);
    }

    @Test
    void testExportOrdersToCsvWithDirectOrder() {
        // Arrange
        Order directOrder = new Order();
        directOrder.setId(1L);
        directOrder.setClientFullName("Direct Buyer");
        directOrder.setCity("Casablanca");
        directOrder.setAddress("Test St");
        directOrder.setPhoneNumber("123");
        directOrder.setStatus(Order.OrderStatus.PREPARING);
        directOrder.setCreatedAt(LocalDateTime.now());
        directOrder.setShippingCost(BigDecimal.TEN);

        OrderItem item = new OrderItem();
        item.setOrder(directOrder);
        item.setProduct(null); // DIRECT ORDER ITEM HAS NO PRODUCT
        item.setProductName("Landing Page Deal");
        item.setPrice(new BigDecimal("99.00"));
        item.setQuantity(1);

        directOrder.setItems(Collections.singletonList(item));

        when(orderRepository.findAllForExportWithRelations()).thenReturn(Collections.singletonList(directOrder));

        // Act & Assert
        String csv = orderService.exportOrdersToCsv();
        System.out.println(csv); // For debug log

        assertTrue(csv.contains("Landing Page Deal"));
        assertTrue(csv.contains("Direct Buyer"));
    }
}
