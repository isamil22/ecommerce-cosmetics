package com.example.demo.dto;

import jakarta.validation.constraints.Positive;
import lombok.Data;
import java.math.BigDecimal;

@Data
public class CartItemDTO {
    private String id;
    private Long productId;
    private String productName;
    @Positive
    private Integer quantity;
    private BigDecimal price;
    private String imageUrl;
    private String variantName; // Add this field
}