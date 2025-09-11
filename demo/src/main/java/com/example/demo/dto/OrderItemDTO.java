package com.example.demo.dto;

import jakarta.validation.constraints.Positive;
import lombok.Data;
import java.math.BigDecimal;

@Data
public class OrderItemDTO {
    private Long id;
    private Long productId;
    private String productName;
    @Positive
    private Integer quantity;
    @Positive
    private BigDecimal price;
    private String imageUrl; // <-- Add this line
}