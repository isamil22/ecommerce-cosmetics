package com.example.demo.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor
public class CartItem {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "cart_id", nullable = false)
    private Cart cart;

    @ManyToOne
    @JoinColumn(name = "product_id", nullable = true) // Changed to nullable
    private Product product;

    private Integer quantity;

    // Virtual product fields (for items not in product catalog)
    @Column(name = "product_name")
    private String productName;

    @Column(name = "price")
    private java.math.BigDecimal price;

    @Column(name = "image_url")
    private String imageUrl;

    @Column(name = "variant_name")
    private String variantName;
}
