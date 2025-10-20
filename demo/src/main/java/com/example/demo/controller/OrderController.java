package com.example.demo.controller;

import com.example.demo.dto.GuestOrderRequestDTO;
import com.example.demo.dto.OrderDTO;
import com.example.demo.dto.OrderFeedbackDTO;
import com.example.demo.model.Order;
import com.example.demo.model.OrderFeedback;
import com.example.demo.model.User;
import com.example.demo.service.OrderService;
import com.example.demo.service.OrderFeedbackService;
import com.example.demo.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpHeaders;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/orders")
@RequiredArgsConstructor
public class OrderController {
    private final OrderService orderService;
    private final UserService userService;
    private final OrderFeedbackService orderFeedbackService;

    @PostMapping
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<OrderDTO> createOrder(@AuthenticationPrincipal UserDetails userDetails,
                                                @RequestParam String clientFullName,
                                                @RequestParam String city,
                                                @RequestParam String address,
                                                @RequestParam String phoneNumber,
                                                @RequestParam(required = false) String couponCode) {
        Long userId = ((User) userDetails).getId();
        OrderDTO orderDTO = orderService.createOrder(userId, address, phoneNumber, clientFullName, city, couponCode);
        return ResponseEntity.ok(orderDTO);
    }

    @PostMapping("/guest")
    public ResponseEntity<OrderDTO> createGuestOrder(@RequestBody GuestOrderRequestDTO guestOrderRequest) {
        OrderDTO orderDTO = orderService.createGuestOrder(guestOrderRequest);
        return ResponseEntity.ok(orderDTO);
    }

    @GetMapping
    @PreAuthorize("hasAuthority('ORDER:VIEW') or hasAuthority('ORDER:EDIT') or hasAuthority('ROLE_ADMIN') or hasAuthority('ROLE_MANAGER') or hasAuthority('ROLE_EDITOR')")
    public ResponseEntity<List<OrderDTO>> getAllOrders() {
        List<OrderDTO> orders = orderService.getAllOrders();
        return ResponseEntity.ok(orders);
    }

    @GetMapping("/user")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<List<OrderDTO>> getUserOrders(@AuthenticationPrincipal UserDetails userDetails) {
        Long userId = ((User) userDetails).getId();
        List<OrderDTO> orders = orderService.getUserOrders(userId);
        return ResponseEntity.ok(orders);
    }

    @PutMapping("/{orderId}/status")
    @PreAuthorize("hasAuthority('ORDER:EDIT') or hasAuthority('ORDER:UPDATE') or hasAuthority('ROLE_ADMIN') or hasAuthority('ROLE_MANAGER')")
    public ResponseEntity<OrderDTO> updateOrderStatus(@PathVariable Long orderId,
                                                      @RequestParam Order.OrderStatus status) {
        OrderDTO updatedOrder = orderService.updateOrderStatus(orderId, status);
        return ResponseEntity.ok(updatedOrder);
    }

    @DeleteMapping("/{orderId}")
    @PreAuthorize("hasAuthority('ORDER:DELETE') or hasAuthority('ORDER:EDIT') or hasAuthority('ROLE_ADMIN') or hasAuthority('ROLE_MANAGER')")
    public ResponseEntity<Void> deleteOrder(@PathVariable Long orderId) {
        orderService.softDeleteOrder(orderId);
        return ResponseEntity.noContent().build();
    }

    @PostMapping("/{orderId}/restore")
    @PreAuthorize("hasAuthority('ORDER:EDIT') or hasAuthority('ORDER:RESTORE') or hasAuthority('ROLE_ADMIN') or hasAuthority('ROLE_MANAGER')")
    public ResponseEntity<Void> restoreOrder(@PathVariable Long orderId) {
        orderService.restoreOrder(orderId);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/deleted")
    @PreAuthorize("hasAuthority('ORDER:VIEW') or hasAuthority('ORDER:EDIT') or hasAuthority('ROLE_ADMIN') or hasAuthority('ROLE_MANAGER') or hasAuthority('ROLE_EDITOR')")
    public ResponseEntity<List<OrderDTO>> getDeletedOrders() {
        List<OrderDTO> orders = orderService.getDeletedOrders();
        return ResponseEntity.ok(orders);
    }

    @DeleteMapping("/all")
    @PreAuthorize("hasAuthority('ORDER:DELETE') or hasAuthority('ORDER:EDIT') or hasAuthority('ROLE_ADMIN') or hasAuthority('ROLE_MANAGER')")
    public ResponseEntity<Void> deleteAllOrders() {
        orderService.deleteAllOrders();
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/export")
    @PreAuthorize("hasAuthority('ORDER:VIEW') or hasAuthority('ORDER:EXPORT') or hasAuthority('ROLE_ADMIN') or hasAuthority('ROLE_MANAGER')")
    public ResponseEntity<String> exportOrders() {
        String csv = orderService.exportOrdersToCsv();
        return ResponseEntity.ok()
                .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=\"orders.csv\"")
                .contentType(org.springframework.http.MediaType.TEXT_PLAIN)
                .body(csv);
    }

    // ===== ORDER FEEDBACK ENDPOINTS =====

    @PostMapping("/{orderId}/feedback")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<OrderFeedback> submitOrderFeedback(@PathVariable Long orderId,
                                                           @RequestParam String rating,
                                                           @RequestParam(required = false) String comment,
                                                           @AuthenticationPrincipal UserDetails userDetails) {
        try {
            Long userId = ((User) userDetails).getId();
            OrderFeedback feedback = orderFeedbackService.saveFeedback(orderId, rating, comment, userId);
            return ResponseEntity.ok(feedback);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().build();
        }
    }

    @PostMapping("/{orderId}/feedback/guest")
    public ResponseEntity<OrderFeedback> submitGuestOrderFeedback(@PathVariable Long orderId,
                                                                @RequestParam String rating,
                                                                @RequestParam(required = false) String comment) {
        try {
            OrderFeedback feedback = orderFeedbackService.saveFeedback(orderId, rating, comment, null);
            return ResponseEntity.ok(feedback);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().build();
        }
    }

    @GetMapping("/{orderId}/feedback")
    // @PreAuthorize("hasAuthority('ORDER:VIEW') or hasAuthority('ORDER:EDIT') or hasAuthority('ROLE_ADMIN') or hasAuthority('ROLE_MANAGER') or hasAuthority('ROLE_EDITOR')")
    public ResponseEntity<String> getOrderFeedback(@PathVariable Long orderId) {
        try {
            return orderFeedbackService.getFeedbackByOrderId(orderId)
                    .map(feedback -> {
                        String response = "{\"id\":" + feedback.getId() + 
                                        ",\"rating\":\"" + feedback.getRating() + 
                                        "\",\"comment\":\"" + (feedback.getComment() != null ? feedback.getComment() : "") + 
                                        "\",\"createdAt\":\"" + feedback.getCreatedAt() + "\"}";
                        return ResponseEntity.ok(response);
                    })
                    .orElse(ResponseEntity.notFound().build());
        } catch (Exception e) {
            return ResponseEntity.internalServerError().build();
        }
    }

    @GetMapping("/feedback")
    @PreAuthorize("hasAuthority('ORDER:VIEW') or hasAuthority('ORDER:EDIT') or hasAuthority('ROLE_ADMIN') or hasAuthority('ROLE_MANAGER') or hasAuthority('ROLE_EDITOR')")
    public ResponseEntity<List<OrderFeedback>> getAllOrderFeedback() {
        try {
            List<OrderFeedback> feedback = orderFeedbackService.getAllFeedback();
            return ResponseEntity.ok(feedback);
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }

    @GetMapping("/feedback/rating/{rating}")
    @PreAuthorize("hasAuthority('ORDER:VIEW') or hasAuthority('ORDER:EDIT') or hasAuthority('ROLE_ADMIN') or hasAuthority('ROLE_MANAGER') or hasAuthority('ROLE_EDITOR')")
    public ResponseEntity<List<OrderFeedback>> getOrderFeedbackByRating(@PathVariable String rating) {
        try {
            List<OrderFeedback> feedback = orderFeedbackService.getFeedbackByRating(rating);
            return ResponseEntity.ok(feedback);
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }
}