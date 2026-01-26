package com.example.demo.service;

import com.example.demo.dto.GuestOrderRequestDTO;
import com.example.demo.dto.CartItemDTO;
import com.example.demo.dto.OrderDTO;
import com.example.demo.dto.OrderItemDTO;
import com.example.demo.model.Order;
import com.example.demo.model.Product;
import com.example.demo.model.User;
import com.example.demo.repositories.CouponRepository;
import com.example.demo.repositories.OrderRepository;
import com.example.demo.repositories.ProductRepository;
import com.example.demo.repositories.UserRepository;
import com.example.demo.mapper.OrderMapper;
import com.example.demo.mapper.CartMapper; // Add
import com.example.demo.service.CartService; // Add
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;
import org.springframework.mail.MailException;

import java.math.BigDecimal;
import java.util.Collections;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

class OrderServiceVariantTest {

    @Mock
    private OrderRepository orderRepository;

    @Mock
    private UserRepository userRepository;

    @Mock
    private ProductRepository productRepository;

    @Mock
    private CouponRepository couponRepository;

    @Mock
    private EmailService emailService;

    @Mock
    private OrderMapper orderMapper;

    @Mock
    private CartService cartService;

    @Mock
    private CartMapper cartMapper;

    @Mock
    private SettingService settingService;

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
    void testCreateGuestOrderWithVariant() {
        // Arrange
        GuestOrderRequestDTO request = new GuestOrderRequestDTO();
        request.setEmail("guest@example.com");
        request.setClientFullName("Guest User");
        request.setCity("Casablanca");
        request.setAddress("123 Street");
        request.setPhoneNumber("0600000000");

        CartItemDTO item = new CartItemDTO();
        item.setProductId(null); // Direct Order
        item.setProductName("Landing Page Product");
        item.setPrice(new BigDecimal("199.00"));
        item.setQuantity(1);
        item.setVariantName("Size: Large, Color: Red"); // The Variant!

        request.setCartItems(Collections.singletonList(item));

        when(userRepository.findByEmail(anyString())).thenReturn(Optional.empty());
        when(userRepository.save(any(User.class))).thenAnswer(i -> i.getArguments()[0]);
        when(orderRepository.save(any(Order.class))).thenAnswer(i -> {
            Order o = (Order) i.getArguments()[0];
            o.setId(1L);
            return o;
        });

        // Mock Mapper to return DTO with variant
        when(orderMapper.toDTO(any(Order.class))).thenAnswer(i -> {
            Order o = (Order) i.getArguments()[0];
            OrderDTO dto = new OrderDTO();
            dto.setId(o.getId());
            OrderItemDTO itemDTO = new OrderItemDTO();
            itemDTO.setProductName(o.getItems().get(0).getProductName());
            itemDTO.setVariantName(o.getItems().get(0).getVariantName());
            dto.setOrderItems(Collections.singletonList(itemDTO));
            return dto;
        });

        // Act
        OrderDTO result = orderService.createGuestOrder(request);

        // Assert
        assertNotNull(result);
        assertEquals("Landing Page Product", result.getOrderItems().get(0).getProductName());
        assertEquals("Size: Large, Color: Red", result.getOrderItems().get(0).getVariantName());

        verify(orderRepository).save(any(Order.class));
    }
}
