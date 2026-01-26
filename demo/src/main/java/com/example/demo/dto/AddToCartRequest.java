package com.example.demo.dto;

import lombok.Data;

@Data
@lombok.NoArgsConstructor
@lombok.AllArgsConstructor
public class AddToCartRequest {
    private Long productId;
    private Integer quantity;
    private Long productVariantId;

    // Virtual Product Fields
    private String productName;
    private java.math.BigDecimal price;
    private String imageUrl;
    private String variantName;
}
