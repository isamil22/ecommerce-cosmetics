package com.example.demo.controller;

import com.example.demo.dto.AddToCartRequest;
import com.example.demo.dto.CartDTO;
import com.example.demo.dto.UpdateQuantityRequest;
import com.example.demo.model.User;
import com.example.demo.service.CartService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/cart")
@RequiredArgsConstructor
public class CartController {
    private final CartService cartService;

    @PostMapping("/add")
    public ResponseEntity<CartDTO> addToCart(@AuthenticationPrincipal UserDetails userDetails,
            @RequestBody AddToCartRequest request) {
        // --- THIS IS THE FIX ---
        // If the user is a guest, userDetails will be null.
        // We return an empty OK response because the frontend handles the guest cart.
        if (userDetails == null) {
            return ResponseEntity.ok().build();
        }

        Long userId = ((User) userDetails).getId();

        // Check if it's a virtual product request (no ID but has details)
        com.example.demo.dto.CartItemDTO virtualItem = null;
        if (request.getProductId() == null && request.getProductName() != null) {
            virtualItem = new com.example.demo.dto.CartItemDTO();
            virtualItem.setProductName(request.getProductName());
            virtualItem.setPrice(request.getPrice());
            virtualItem.setImageUrl(request.getImageUrl());
            virtualItem.setVariantName(request.getVariantName());
        }

        return ResponseEntity
                .ok(cartService.addToCart(userId, request.getProductId(), request.getQuantity(), virtualItem));
    }

    @GetMapping
    public ResponseEntity<CartDTO> getCart(@AuthenticationPrincipal UserDetails userDetails) {
        Long userId = (userDetails != null) ? ((User) userDetails).getId() : null;
        return ResponseEntity.ok(cartService.getCart(userId));
    }

    @DeleteMapping
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<Void> clearCart(@AuthenticationPrincipal UserDetails userDetails) {
        Long userId = ((User) userDetails).getId();
        cartService.clearCart(userId);
        return ResponseEntity.noContent().build();
    }

    @DeleteMapping("/{itemId}")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<Void> removeCartItem(@AuthenticationPrincipal UserDetails userDetails,
            @PathVariable Long itemId) {
        Long userId = ((User) userDetails).getId();
        cartService.removeItemFromCart(userId, itemId);
        return ResponseEntity.noContent().build();
    }

    @PutMapping("/{itemId}")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<CartDTO> updateCartItemQuantity(@AuthenticationPrincipal UserDetails userDetails,
            @PathVariable Long itemId,
            @RequestBody UpdateQuantityRequest request) {
        Long userId = ((User) userDetails).getId();
        return ResponseEntity.ok(cartService.updateItemQuantity(userId, itemId, request.getQuantity()));
    }
}
