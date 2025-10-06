package com.example.demo.dto;

import com.example.demo.model.User;
import lombok.Data;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;

@Data
public class UpdateUserRequestDTO {
    @NotBlank(message = "Full name is required")
    private String fullName;
    
    @NotBlank(message = "Email is required")
    @Email(message = "Email should be valid")
    private String email;
    
    private User.Role role;
    private boolean emailConfirmation;
    private boolean isActive;
    private String phoneNumber;
    private String profileImageUrl;
    private String notes;
    private String password; // For user creation
}
