// isamil22/ecommerce-basic/ecommerce-basic-7d0cae8be7d6e68651cd7c2fe9fb897e9162ff5e/demo/src/main/java/com/example/demo/model/Product.java
package com.example.demo.model;

import com.fasterxml.jackson.annotation.JsonManagedReference;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.HashSet;
import java.util.List;
import lombok.ToString;
import lombok.EqualsAndHashCode;
import java.util.Set;

@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Product {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String name;

    @Lob
    @Column(columnDefinition = "LONGTEXT")
    private String description;

    private BigDecimal price;
    private Integer quantity;

    @ElementCollection
    @CollectionTable(name = "product_images", joinColumns = @JoinColumn(name = "product_id"))
    @Column(name = "images")
    private List<String> images = new ArrayList<>();

    private String brand;
    private boolean bestseller;
    private boolean newArrival;

    private boolean hasVariants = false;
    private boolean isPackable = false;
    private boolean deleted = false; // Soft delete flag

    @Column(name = "show_purchase_notifications", nullable = false)
    private boolean showPurchaseNotifications = true;

    @Column(name = "show_countdown_timer", nullable = false)
    private boolean showCountdownTimer = true;

    @Enumerated(EnumType.STRING)
    @Column(length = 10)
    private ProductType type;

    @JsonManagedReference
    @OneToMany(mappedBy = "product", cascade = CascadeType.ALL, orphanRemoval = true)
    @ToString.Exclude
    @EqualsAndHashCode.Exclude
    private List<Comment> comments = new ArrayList<>();

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "category_id", nullable = false)
    private Category category;

    @JsonManagedReference
    @OneToMany(mappedBy = "product", cascade = CascadeType.ALL, orphanRemoval = true)
    @ToString.Exclude
    @EqualsAndHashCode.Exclude
    private List<VariantType> variantTypes = new ArrayList<>();

    @JsonManagedReference
    @OneToMany(mappedBy = "product", cascade = CascadeType.ALL, orphanRemoval = true)
    @ToString.Exclude
    @EqualsAndHashCode.Exclude
    private List<ProductVariant> variants = new ArrayList<>();

    @ManyToMany(fetch = FetchType.LAZY)
    @JoinTable(name = "product_frequently_bought_together", joinColumns = @JoinColumn(name = "product_id"), inverseJoinColumns = @JoinColumn(name = "frequently_bought_id"))
    @ToString.Exclude
    @EqualsAndHashCode.Exclude
    private Set<Product> frequentlyBoughtTogether = new HashSet<>();

    public enum ProductType {
        MEN, WOMEN, BOTH, ELECTRONIC
    }
}