package com.example.demo.repositories;

import com.example.demo.model.OrderItem;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface OrderItemRepository extends JpaRepository<OrderItem, Long> {
    
    /**
     * Find all order items by product ID
     */
    List<OrderItem> findByProductId(Long productId);
    
    /**
     * Find all order items by order ID
     */
    List<OrderItem> findByOrderId(Long orderId);
}
