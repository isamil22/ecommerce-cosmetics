package com.example.demo.service;

import com.example.demo.model.Order;
import com.example.demo.model.OrderFeedback;
import com.example.demo.model.User;
import com.example.demo.repository.OrderFeedbackRepository;
import com.example.demo.repositories.OrderRepository;
import com.example.demo.repositories.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class OrderFeedbackService {
    
    @Autowired
    private OrderFeedbackRepository orderFeedbackRepository;
    
    @Autowired
    private OrderRepository orderRepository;
    
    @Autowired
    private UserRepository userRepository;
    
    /**
     * Save or update feedback for an order
     */
    public OrderFeedback saveFeedback(Long orderId, String rating, String comment, Long userId) {
        // Validate rating
        if (rating == null || (!rating.equals("Good") && !rating.equals("Okay") && !rating.equals("Bad"))) {
            throw new RuntimeException("Invalid rating. Must be 'Good', 'Okay', or 'Bad'");
        }
        
        // Check if order exists
        Optional<Order> orderOpt = orderRepository.findById(orderId);
        if (orderOpt.isEmpty()) {
            throw new RuntimeException("Order not found with ID: " + orderId);
        }
        
        Order order = orderOpt.get();
        
        // Check if feedback already exists for this order
        Optional<OrderFeedback> existingFeedback = orderFeedbackRepository.findByOrderId(orderId);
        
        OrderFeedback feedback;
        if (existingFeedback.isPresent()) {
            // Update existing feedback
            feedback = existingFeedback.get();
            feedback.setRating(rating);
            feedback.setComment(comment);
        } else {
            // Create new feedback
            feedback = new OrderFeedback();
            feedback.setOrder(order);
            feedback.setRating(rating);
            feedback.setComment(comment);
            
            // Set user if provided
            if (userId != null) {
                Optional<User> userOpt = userRepository.findById(userId);
                userOpt.ifPresent(feedback::setUser);
            }
        }
        
        return orderFeedbackRepository.save(feedback);
    }
    
    /**
     * Get feedback for an order
     */
    public Optional<OrderFeedback> getFeedbackByOrderId(Long orderId) {
        return orderFeedbackRepository.findByOrderId(orderId);
    }
    
    /**
     * Get all feedback for a user
     */
    public List<OrderFeedback> getFeedbackByUserId(Long userId) {
        return orderFeedbackRepository.findByUserId(userId);
    }
    
    /**
     * Get all feedback by rating
     */
    public List<OrderFeedback> getFeedbackByRating(String rating) {
        return orderFeedbackRepository.findByRating(rating);
    }
    
    /**
     * Get all feedback
     */
    public List<OrderFeedback> getAllFeedback() {
        return orderFeedbackRepository.findAll();
    }
    
    /**
     * Delete feedback for an order
     */
    public void deleteFeedback(Long orderId) {
        Optional<OrderFeedback> feedback = orderFeedbackRepository.findByOrderId(orderId);
        if (feedback.isPresent()) {
            orderFeedbackRepository.delete(feedback.get());
        }
    }
    
    /**
     * Check if order has feedback
     */
    public boolean hasFeedback(Long orderId) {
        return orderFeedbackRepository.existsByOrderId(orderId);
    }
}
