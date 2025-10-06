package com.example.demo.dto;

import com.example.demo.model.User;
import lombok.Data;

import java.time.LocalDateTime;

@Data
public class UserDTO {
    private Long id;
    private String email;
    private String fullName;
    private User.Role role;
    private boolean emailConfirmation;
    
    // Additional fields for enhanced user management
    private LocalDateTime createdAt;
    private LocalDateTime lastLoginAt;
    private LocalDateTime updatedAt;
    private boolean isActive;
    private String phoneNumber;
    private String profileImageUrl;
    private String notes;
}