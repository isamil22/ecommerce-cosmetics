package com.example.demo.dto;

import com.example.demo.model.CustomPack;
import lombok.Data;

import java.math.BigDecimal;
import java.util.List;

@Data
public class CustomPackDTO {
    private Long id;
    private String name;
    private String description;
    private int minItems;
    private int maxItems;
    private CustomPack.PricingType pricingType;
    private BigDecimal fixedPrice;
    private BigDecimal discountRate;
    private List<ProductDTO> allowedProducts;
    private List<Long> allowedProductIds; // For easier form handling
}