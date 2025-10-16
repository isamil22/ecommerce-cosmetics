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
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Set;

@RestController
@RequestMapping("/api/users")
@RequiredArgsConstructor
@PreAuthorize("hasAuthority('ROLE_ADMIN') or hasAuthority('ROLE_MANAGER')")
@Tag(name = "User Management", description = "APIs for managing users and their role assignments")
public class UserController {

    private final UserService userService;
    private final RoleService roleService;
    private final PermissionService permissionService;

    @GetMapping
    @Operation(summary = "Get all users", description = "Retrieve all users in the system")
    public ResponseEntity<List<UserDTO>> getAllUsers() {
        return ResponseEntity.ok(userService.getAllUsers());
    }

    @DeleteMapping("/{id}")
    @Operation(summary = "Delete user", description = "Delete a user from the system")
    public ResponseEntity<Void> deleteUser(@PathVariable Long id) {
        userService.deleteUser(id);
        return ResponseEntity.noContent().build();
    }

    @PutMapping("/{id}/role")
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
    @Operation(summary = "Get user roles", description = "Get all roles assigned to a specific user")
    public ResponseEntity<Set<RoleDTO>> getUserRoles(@PathVariable Long id) {
        Set<RoleDTO> roles = roleService.getUserRoles(id);
        return ResponseEntity.ok(roles);
    }
    
    /**
     * Get all permissions a user has (through their roles)
     */
    @GetMapping("/{id}/permissions")
    @Operation(summary = "Get user permissions", description = "Get all permissions a user has through their assigned roles")
    public ResponseEntity<Set<PermissionDTO>> getUserPermissions(@PathVariable Long id) {
        Set<PermissionDTO> permissions = permissionService.getUserPermissions(id);
        return ResponseEntity.ok(permissions);
    }
}