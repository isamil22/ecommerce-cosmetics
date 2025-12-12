package com.example.demo.dto;

import lombok.Data;

import java.math.BigDecimal;

/**
 * Request DTO for landing-page-only direct orders (no catalog product).
 */
@Data
public class LandingDirectOrderRequestDTO {
    private String productName;
    private String variantName;
    private BigDecimal price;
    private Integer quantity;
    private String productImage;

    private String clientFullName;
    private String city;
    private String address;
    private String phoneNumber;
    private String email; // optional but recommended for guest user creation
}

