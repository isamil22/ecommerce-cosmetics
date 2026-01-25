package com.example.demo.dto;

import jakarta.validation.constraints.Positive;
import lombok.Data;
import com.fasterxml.jackson.annotation.JsonProperty;
import java.math.BigDecimal;

@Data
public class CartItemDTO {
    private Long id;
    private Long productId;
    private String productName;
    @Positive
    private Integer quantity;
    private BigDecimal price;
    private String imageUrl;
    @JsonProperty("variantName")
    private String variantName;
    private Long categoryId;
}