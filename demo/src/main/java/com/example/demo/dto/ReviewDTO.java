package com.example.demo.dto;

import lombok.Data;

@Data
public class ReviewDTO {
    private Long id;
    private String content;
    private int rating;
    private boolean approved;
    private Long userId;
    private String userEmail;
    private boolean createdByAdmin;
    private String customName; // Custom name for admin-created reviews
    // The productId and productName fields have been removed as they are no longer needed.
}