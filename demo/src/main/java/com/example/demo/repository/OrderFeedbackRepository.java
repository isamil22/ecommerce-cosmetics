package com.example.demo.repository;

import com.example.demo.model.OrderFeedback;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface OrderFeedbackRepository extends JpaRepository<OrderFeedback, Long> {
    
    /**
     * Find feedback by order ID
     */
    Optional<OrderFeedback> findByOrderId(Long orderId);
    
    /**
     * Check if feedback exists for an order
     */
    boolean existsByOrderId(Long orderId);
    
    /**
     * Find feedback by user ID
     */
    java.util.List<OrderFeedback> findByUserId(Long userId);
    
    /**
     * Find feedback by rating
     */
    java.util.List<OrderFeedback> findByRating(String rating);
}
