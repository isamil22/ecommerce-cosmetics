package com.example.demo.controller;

import com.example.demo.dto.AssignRoleRequestDTO;
import com.example.demo.dto.PermissionDTO;
import com.example.demo.dto.RoleDTO;
import com.example.demo.dto.UserDTO;
import com.example.demo.model.User;
import com.example.demo.service.PermissionService;
import com.example.demo.service.RoleService;
import com.example.demo.service.UserService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Set;

@RestController
@RequestMapping("/api/users")
@RequiredArgsConstructor
@Tag(name = "User Management", description = "APIs for managing users and their role assignments")
public class UserController {

    private final UserService userService;
    private final RoleService roleService;
    private final PermissionService permissionService;

    @GetMapping
    @PreAuthorize("hasAuthority('ROLE_ADMIN') or hasAuthority('ROLE_MANAGER')")
    @Operation(summary = "Get all users", description = "Retrieve all users in the system")
    public ResponseEntity<List<UserDTO>> getAllUsers() {
        return ResponseEntity.ok(userService.getAllUsers());
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasAuthority('ROLE_ADMIN')")
    @Operation(summary = "Delete user", description = "Delete a user from the system")
    public ResponseEntity<Void> deleteUser(@PathVariable Long id) {
        userService.deleteUser(id);
        return ResponseEntity.noContent().build();
    }

    @PutMapping("/{id}/role")
    @PreAuthorize("hasAuthority('ROLE_ADMIN')")
    @Operation(summary = "Update user role (legacy)", description = "Update user role using old enum (deprecated, use /roles endpoint instead)")
    public ResponseEntity<UserDTO> updateUserRole(@PathVariable Long id, @RequestParam("role") User.Role role) {
        UserDTO updatedUser = userService.updateUserRole(id, role);
        return ResponseEntity.ok(updatedUser);
    }
    
    // ========================================
    // RBAC Endpoints
    // ========================================
    
    /**
     * Assign roles to a user (replaces existing roles)
     */
    @PostMapping("/{id}/roles")
    @PreAuthorize("hasAuthority('ROLE_ADMIN') or hasAuthority('ROLE_MANAGER')")
    @Operation(summary = "Assign roles to user", description = "Assign one or more roles to a user (replaces existing roles)")
    public ResponseEntity<UserDTO> assignRoles(
            @PathVariable Long id,
            @RequestBody Set<Long> roleIds) {
        UserDTO updatedUser = userService.assignRoles(id, roleIds);
        return ResponseEntity.ok(updatedUser);
    }
    
    /**
     * Add a single role to a user
     */
    @PostMapping("/{userId}/roles/{roleId}")
    @PreAuthorize("hasAuthority('ROLE_ADMIN') or hasAuthority('ROLE_MANAGER')")
    @Operation(summary = "Add role to user", description = "Add a single role to a user (keeps existing roles)")
    public ResponseEntity<UserDTO> addRoleToUser(
            @PathVariable Long userId,
            @PathVariable Long roleId) {
        UserDTO updatedUser = userService.addRole(userId, roleId);
        return ResponseEntity.ok(updatedUser);
    }
    
    /**
     * Remove a role from a user
     */
    @DeleteMapping("/{userId}/roles/{roleId}")
    @PreAuthorize("hasAuthority('ROLE_ADMIN') or hasAuthority('ROLE_MANAGER')")
    @Operation(summary = "Remove role from user", description = "Remove a specific role from a user")
    public ResponseEntity<UserDTO> removeRoleFromUser(
            @PathVariable Long userId,
            @PathVariable Long roleId) {
        UserDTO updatedUser = userService.removeRole(userId, roleId);
        return ResponseEntity.ok(updatedUser);
    }
    
    /**
     * Get all roles assigned to a user
     */
    @GetMapping("/{id}/roles")
    @PreAuthorize("hasAuthority('ROLE_ADMIN') or hasAuthority('ROLE_MANAGER')")
    @Operation(summary = "Get user roles", description = "Get all roles assigned to a specific user")
    public ResponseEntity<Set<RoleDTO>> getUserRoles(@PathVariable Long id) {
        Set<RoleDTO> roles = roleService.getUserRoles(id);
        return ResponseEntity.ok(roles);
    }
    
    /**
     * Get all permissions a user has (through their roles)
     * Users can access their own permissions, admins/managers can access any user's permissions
     */
    @GetMapping("/{id}/permissions")
    @Operation(summary = "Get user permissions", description = "Get all permissions a user has through their assigned roles")
    public ResponseEntity<Set<PermissionDTO>> getUserPermissions(@PathVariable Long id) {
        // Check if user can access these permissions
        if (!canAccessUserPermissions(id)) {
            return ResponseEntity.status(403).build();
        }
        
        Set<PermissionDTO> permissions = permissionService.getUserPermissions(id);
        return ResponseEntity.ok(permissions);
    }
    
    /**
     * Check if the current user can access the specified user's permissions
     */
    private boolean canAccessUserPermissions(Long userId) {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication == null || !authentication.isAuthenticated()) {
            return false;
        }
        
        // Check if user has admin/manager role
        if (authentication.getAuthorities().stream()
                .anyMatch(auth -> auth.getAuthority().equals("ROLE_ADMIN") || 
                                auth.getAuthority().equals("ROLE_MANAGER"))) {
            return true;
        }
        
        // Check if user is accessing their own permissions
        try {
            User currentUser = (User) authentication.getPrincipal();
            return currentUser.getId().equals(userId);
        } catch (Exception e) {
            return false;
        }
    }
}