package com.example.demo.repositories;

import com.example.demo.model.CartItem;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface CartItemRepository extends JpaRepository<CartItem, Long> {
    
    /**
     * Find all cart items by product ID
     */
    List<CartItem> findByProductId(Long productId);
    
    /**
     * Find all cart items by cart ID
     */
    List<CartItem> findByCartId(Long cartId);
}
