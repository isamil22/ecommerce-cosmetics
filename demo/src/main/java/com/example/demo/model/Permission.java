package com.example.demo.model;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.HashSet;
import java.util.Set;

@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor
@Table(name = "permissions")
@lombok.EqualsAndHashCode(exclude = {"roles"})
@lombok.ToString(exclude = {"roles"})
public class Permission {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @NotBlank(message = "Permission name is required")
    @Column(unique = true, nullable = false, length = 100)
    private String name;
    
    @Column(length = 255)
    private String description;
    
    @NotBlank(message = "Resource is required")
    @Column(nullable = false, length = 50)
    private String resource;
    
    @NotBlank(message = "Action is required")
    @Column(nullable = false, length = 50)
    private String action;
    
    @ManyToMany(mappedBy = "permissions")
    private Set<Role> roles = new HashSet<>();
    
    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt;
    
    @Column(name = "updated_at")
    private LocalDateTime updatedAt;
    
    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
        updatedAt = LocalDateTime.now();
    }
    
    @PreUpdate
    protected void onUpdate() {
        updatedAt = LocalDateTime.now();
    }
    
    // Utility method to get permission in format RESOURCE:ACTION
    public String getPermissionString() {
        return resource + ":" + action;
    }
}

