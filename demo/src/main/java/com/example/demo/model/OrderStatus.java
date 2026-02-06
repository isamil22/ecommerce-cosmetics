// demo/src/main/java/com/example/demo/model/Order.java

package com.example.demo.model;

import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;

import com.fasterxml.jackson.annotation.JsonManagedReference;

// ... imports

@OneToMany(mappedBy = "order", cascade = CascadeType.ALL, orphanRemoval = true, fetch = FetchType.EAGER)
@JsonManagedReference
private List<OrderItem>items=new ArrayList<>();

private boolean deleted=false;

private BigDecimal discountAmount;

@ManyToOne(fetch = FetchType.LAZY) @JoinColumn(name = "coupon_id") private Coupon coupon;

// New field for shipping cost
private BigDecimal shippingCost;

public enum OrderStatus {
    PREPARING, DELIVERING, DELIVERED, CANCELED
}}