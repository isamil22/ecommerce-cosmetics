package com.example.demo.controller;

import com.example.demo.dto.AddToCartRequest;
import com.example.demo.dto.CartDTO;
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

    /**
     * Handles adding a product to the cart.
     * This method now accepts data from the request body.
     */
    @PostMapping("/add")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<CartDTO> addToCart(@AuthenticationPrincipal UserDetails userDetails,
                                             @RequestBody AddToCartRequest request) {
        Long userId = ((User) userDetails).getId();
        return ResponseEntity.ok(cartService.addToCart(userId, request.getProductId(), request.getQuantity()));
    }

    /**
     * Retrieves the current user's cart.
     */
    @GetMapping
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<CartDTO> getCart(@AuthenticationPrincipal UserDetails userDetails) {
        Long userId = ((User) userDetails).getId();
        return ResponseEntity.ok(cartService.getCart(userId));
    }

    /**
     * Clears all items from the user's cart.
     */
    @DeleteMapping
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<Void> clearCart(@AuthenticationPrincipal UserDetails userDetails) {
        Long userId = ((User) userDetails).getId();
        cartService.clearCart(userId);
        return ResponseEntity.noContent().build();
    }

    /**
     * Removes a specific item from the user's cart.
     */
    @DeleteMapping("/{productId}")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<Void> removeCartItem(@AuthenticationPrincipal UserDetails userDetails,
                                               @PathVariable Long productId) {
        Long userId = ((User) userDetails).getId();
        cartService.removeCartItem(userId, productId);
        return ResponseEntity.noContent().build();
    }
}

//fgdrgr