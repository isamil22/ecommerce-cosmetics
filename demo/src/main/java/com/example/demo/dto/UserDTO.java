package com.example.demo.dto;

import com.example.demo.model.User;
import lombok.Data;

@Data
public class UserDTO {
    private Long id;
    private String email;
    private String fullName; // ADDED
    private User.Role role; // Legacy role field - kept for backward compatibility
    private String effectiveRole; // The role that determines frontend behavior (ADMIN, MANAGER, USER, etc.)
    private boolean hasDashboardAccess; // Whether user can access admin dashboard
    private boolean emailConfirmation;
}