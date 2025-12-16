package com.example.demo.model;

import com.fasterxml.jackson.annotation.JsonManagedReference;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "packs")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class Pack {

        @Id
        @GeneratedValue(strategy = GenerationType.IDENTITY)
        private Long id;

        private String name;

        @Lob
        @Column(columnDefinition = "LONGTEXT")
        private String description;

        private double price;
        private String imageUrl;

        @JsonManagedReference
        @OneToMany(mappedBy = "pack", cascade = CascadeType.ALL, orphanRemoval = true, fetch = FetchType.EAGER)
        private List<PackItem> items = new ArrayList<>();

        @JsonManagedReference
        @OneToMany(mappedBy = "pack", cascade = CascadeType.ALL, orphanRemoval = true)
        private List<Comment> comments = new ArrayList<>();

        @ManyToMany(fetch = FetchType.LAZY)
        @JoinTable(name = "pack_recommended_products", joinColumns = @JoinColumn(name = "pack_id"), inverseJoinColumns = @JoinColumn(name = "product_id"))
        @org.hibernate.annotations.SQLRestriction("deleted = 0")
        private List<Product> recommendedProducts = new ArrayList<>();

        @ManyToMany(fetch = FetchType.LAZY)
        @JoinTable(name = "pack_recommended_packs", joinColumns = @JoinColumn(name = "pack_id"), inverseJoinColumns = @JoinColumn(name = "recommended_pack_id"))
        private List<Pack> recommendedPacks = new ArrayList<>();

        @ManyToMany(fetch = FetchType.LAZY)
        @JoinTable(name = "pack_recommended_custom_packs", joinColumns = @JoinColumn(name = "pack_id"), inverseJoinColumns = @JoinColumn(name = "custom_pack_id"))
        private List<CustomPack> recommendedCustomPacks = new ArrayList<>();

        @Column(name = "hide_comment_form", nullable = false)
        private boolean hideCommentForm = false;

        @Column(name = "show_purchase_notifications", nullable = false)
        private boolean showPurchaseNotifications = true;

        @Column(name = "show_countdown_timer", nullable = false)
        private boolean showCountdownTimer = true;
}