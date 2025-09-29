// src/main/java/com/example/demo/model/Review.java
package com.example.demo.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Review {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String content;

    private int rating; // e.g., 1 to 5 stars

    private boolean approved = false;

    private boolean createdByAdmin = false; // Flag to identify admin-created reviews

    private String customName; // Custom name for admin-created reviews (optional)

    @ManyToOne
    @JoinColumn(name = "user_id", nullable = true) // Nullable for admin-created reviews
    private User user;

    // The relationship to a specific Product has been removed
}

