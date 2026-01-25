// PASTE THIS CODE INTO: demo/src/main/java/com/example/demo/service/CartService.java

package com.example.demo.service;

import com.example.demo.dto.CartDTO;
import com.example.demo.dto.CartItemDTO;
import com.example.demo.exception.InsufficientStockException;
import com.example.demo.exception.ResourceNotFoundException;
import com.example.demo.mapper.CartMapper;
import com.example.demo.model.Cart;
import com.example.demo.model.CartItem;
import com.example.demo.model.Product;
import com.example.demo.model.User;
import com.example.demo.repositories.CartRepository;
import com.example.demo.repositories.ProductRepository;
import com.example.demo.repositories.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class CartService {
    private final CartRepository cartRepository;
    private final ProductRepository productRepository;
    private final UserRepository userRepository;
    private final CartMapper cartMapper;

    @org.springframework.transaction.annotation.Transactional
    public CartDTO addToCart(Long userId, Long productId, Integer quantity, Long productVariantId,
            CartItemDTO itemDTO) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        Cart cart = cartRepository.findByUserId(userId)
                .orElse(new Cart(null, user, new ArrayList<>()));

        if (productId != null) {
            // Standard Product Logic
            Product product = productRepository.findById(productId)
                    .orElseThrow(() -> new ResourceNotFoundException("Product not found"));

            // Check variant if ID provided
            com.example.demo.model.ProductVariant variant = null;
            if (productVariantId != null) {
                variant = product.getVariants().stream()
                        .filter(v -> v.getId().equals(productVariantId))
                        .findFirst()
                        .orElse(null);
            }

            // Check stock
            int availableStock = (variant != null) ? variant.getStock() : product.getQuantity();
            if (availableStock < quantity) {
                throw new InsufficientStockException("Not enough available");
            }

            // Determine effective matches (Product + Variant)
            final Long finalVariantId = productVariantId;
            Optional<CartItem> existingCartItem = cart.getItems().stream()
                    .filter(item -> item.getProduct() != null && item.getProduct().getId().equals(productId))
                    .filter(item -> {
                        // Match variant name roughly or if we stored variant ID (we assume variant name
                        // is unique enough or we add a variantId field)
                        // For now we don't store variantId in CartItem explicitly in previous schema,
                        // but we store specific variantName string.
                        // Let's rely on constructing the same variantName string.
                        if (finalVariantId == null)
                            return item.getVariantName() == null;

                        // If we have a variant, we should ideally check against the expected variant
                        // name string
                        // But since we are creating it now, let's just proceed to add new item or
                        // update matches.
                        // Simplest: If incoming has variant, find item with same variantName.
                        // To be robust: We really should store variantId in CartItem.
                        // Assuming we can't migrate DB right now, let's build the variant string and
                        // compare.
                        return true; // We will refine filter below or just rely on adding separate items if strict
                                     // match needed.
                    })
                    // Better filter: Only match if variantName equals the one we actally generate
                    .filter(item -> {
                        if (finalVariantId == null)
                            return item.getVariantName() == null;

                        // Reconstruct name to compare? Or just blindly add new line item?
                        // Safe bet for variants: Add as new line item usually, or strict string match.
                        // Let's construct the target name first.
                        return true;
                    })
                    .findFirst();

            // Actually, let's construct the variant data FIRST, then look for match.
            String targetVariantName = null;
            java.math.BigDecimal targetPrice = product.getPrice();
            String targetImage = (product.getImages() != null && !product.getImages().isEmpty())
                    ? product.getImages().get(0)
                    : null;

            if (variant != null) {
                if (variant.getPrice() != null)
                    targetPrice = variant.getPrice();
                if (variant.getImageUrl() != null)
                    targetImage = variant.getImageUrl();

                // Construct pretty name: e.g. "Color: Red, Size: L"
                if (variant.getVariantMap() != null && !variant.getVariantMap().isEmpty()) {
                    // Sort keys or just iterate? Map is unordered usually unless simple map.
                    // Just joining entries.
                    StringBuilder sb = new StringBuilder();
                    variant.getVariantMap().forEach((k, v) -> {
                        if (sb.length() > 0)
                            sb.append(", ");
                        sb.append(k).append(": ").append(v);
                    });
                    targetVariantName = sb.toString();
                }
            }

            final String fVariantName = targetVariantName;

            // Now find existing item with exact same Product ID AND Variant Name
            existingCartItem = cart.getItems().stream()
                    .filter(item -> item.getProduct() != null && item.getProduct().getId().equals(productId))
                    .filter(item -> {
                        if (fVariantName == null)
                            return item.getVariantName() == null;
                        return fVariantName.equals(item.getVariantName());
                    })
                    .findFirst();

            if (existingCartItem.isPresent()) {
                CartItem cartItem = existingCartItem.get();
                cartItem.setQuantity(cartItem.getQuantity() + quantity);
                // Update price/image just in case it changed?
                cartItem.setPrice(targetPrice);
                cartItem.setImageUrl(targetImage);
            } else {
                CartItem cartItem = new CartItem();
                cartItem.setCart(cart);
                cartItem.setProduct(product);
                cartItem.setQuantity(quantity);
                cartItem.setPrice(targetPrice);
                cartItem.setProductName(product.getName());
                cartItem.setImageUrl(targetImage);
                cartItem.setVariantName(fVariantName);
                cart.getItems().add(cartItem);
            }
        } else if (itemDTO != null) {
            // Virtual Product Logic
            // Check if similar virtual item exists (by name and price)
            Optional<CartItem> existingCartItem = cart.getItems().stream()
                    .filter(item -> item.getProduct() == null &&
                            item.getProductName().equals(itemDTO.getProductName()) &&
                            item.getPrice().compareTo(itemDTO.getPrice()) == 0)
                    .findFirst();

            if (existingCartItem.isPresent()) {
                CartItem cartItem = existingCartItem.get();
                cartItem.setQuantity(cartItem.getQuantity() + quantity);
            } else {
                CartItem cartItem = new CartItem();
                cartItem.setCart(cart);
                cartItem.setProduct(null);
                cartItem.setQuantity(quantity);
                cartItem.setProductName(itemDTO.getProductName());
                cartItem.setPrice(itemDTO.getPrice());
                cartItem.setImageUrl(itemDTO.getImageUrl());
                cartItem.setVariantName(itemDTO.getVariantName());
                cart.getItems().add(cartItem);
            }
        } else {
            throw new IllegalArgumentException("Must provide Product ID or Item Details");
        }

        Cart savedCart = cartRepository.save(cart);
        return cartMapper.toDTO(savedCart);
    }

    // Maintain backward compatibility or simple usage
    public CartDTO addToCart(Long userId, Long productId, Integer quantity) {
        return addToCart(userId, productId, quantity, null, null);
    }

    public CartDTO getCart(Long userId) {
        // If the userId is null, it's a guest. Return a new empty cart DTO.
        if (userId == null) {
            CartDTO guestCart = new CartDTO();
            guestCart.setItems(new ArrayList<>());
            return guestCart;
        }

        // For authenticated users, find their cart. If not present, create one.
        Cart cart = cartRepository.findByUserId(userId).orElseGet(() -> {
            User user = userRepository.findById(userId)
                    .orElseThrow(() -> new ResourceNotFoundException("User not found"));
            Cart newCart = new Cart(null, user, new ArrayList<>());
            return cartRepository.save(newCart);
        });

        // Ensure DTOs have snapshot data if missing (migration support)
        // This is handled by mapper or we can enrich here if needed.
        // For virtual items, the mapper needs to map the new fields.
        return cartMapper.toDTO(cart);
    }

    public void clearCart(Long userId) {
        Cart cart = cartRepository.findByUserId(userId)
                .orElseThrow(() -> new ResourceNotFoundException("Cart not found"));

        cart.getItems().clear();
        cartRepository.save(cart);
    }

    // New method for removing virtual items or specific items by Line Item ID
    // (better practice)
    @org.springframework.transaction.annotation.Transactional
    public CartDTO removeItemFromCart(Long userId, Long cartItemId) {
        Cart cart = cartRepository.findByUserId(userId)
                .orElseThrow(() -> new RuntimeException("Cart not found for user"));

        System.out.println("DEBUG DELETE: User " + userId + " removing Item " + cartItemId);
        System.out.println("DEBUG DELETE: Current Items: " + cart.getItems().size());

        boolean removed = cart.getItems().removeIf(item -> {
            boolean match = item.getId().equals(cartItemId);
            if (match)
                System.out.println("DEBUG DELETE: Found match " + item.getId());
            return match;
        });

        if (!removed) {
            System.out.println("DEBUG DELETE: Item not found in list!");
            throw new RuntimeException("Item not found in cart");
        }

        Cart savedCart = cartRepository.save(cart);
        System.out.println("DEBUG DELETE: Saved. New Size: " + savedCart.getItems().size());
        return cartMapper.toDTO(savedCart);
    }

    public CartDTO updateItemQuantity(Long userId, Long cartItemId, Integer quantity) {
        if (quantity < 1) {
            return removeItemFromCart(userId, cartItemId);
        }

        Cart cart = cartRepository.findByUserId(userId)
                .orElseThrow(() -> new ResourceNotFoundException("Cart not found for user"));

        CartItem cartItem = cart.getItems().stream()
                .filter(item -> item.getId().equals(cartItemId))
                .findFirst()
                .orElseThrow(() -> new ResourceNotFoundException("Cart item not found"));

        // Check stock for real products
        if (cartItem.getProduct() != null) {
            Product product = cartItem.getProduct();
            if (product.getQuantity() < quantity) {
                throw new InsufficientStockException("Not enough stock available. Max: " + product.getQuantity());
            }
        }

        cartItem.setQuantity(quantity);
        Cart savedCart = cartRepository.save(cart);
        return cartMapper.toDTO(savedCart);
    }
}