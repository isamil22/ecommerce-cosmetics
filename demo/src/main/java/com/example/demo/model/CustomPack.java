package com.example.demo.model;

import jakarta.persistence.*;
import lombok.Data;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.List;

@Entity
@Data
public class CustomPack {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String name;
    private String description;
    private int minItems;
    private int maxItems;

    @Enumerated(EnumType.STRING)
    private PricingType pricingType;

    private BigDecimal fixedPrice; // For FIXED pricing type
    private BigDecimal discountRate; // For DYNAMIC pricing type (e.g., 0.2 for 20%)

    @ManyToMany(fetch = FetchType.LAZY)
    @JoinTable(
            name = "custom_pack_allowed_products",
            joinColumns = @JoinColumn(name = "custom_pack_id"),
            inverseJoinColumns = @JoinColumn(name = "product_id")
    )
    private List<Product> allowedProducts = new ArrayList<>();

    public enum PricingType {
        FIXED, DYNAMIC
    }
}
