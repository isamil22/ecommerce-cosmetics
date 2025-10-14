package com.example.demo.controller;

import com.example.demo.dto.RoleDTO;
import com.example.demo.dto.RoleRequestDTO;
import com.example.demo.service.RoleService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Set;

@RestController
@RequestMapping("/api/roles")
@RequiredArgsConstructor
@Tag(name = "Role Management", description = "APIs for managing roles in the RBAC system")
public class RoleController {
    
    private final RoleService roleService;
    
    /**
     * Get all roles
     */
    @GetMapping
    @PreAuthorize("hasRole('ADMIN')")
    @Operation(summary = "Get all roles", description = "Retrieve all roles with their permissions")
    public ResponseEntity<List<RoleDTO>> getAllRoles() {
        List<RoleDTO> roles = roleService.getAllRoles();
        return ResponseEntity.ok(roles);
    }
    
    /**
     * Get a role by ID
     */
    @GetMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    @Operation(summary = "Get role by ID", description = "Retrieve a specific role with its permissions")
    public ResponseEntity<RoleDTO> getRoleById(@PathVariable Long id) {
        RoleDTO role = roleService.getRoleById(id);
        return ResponseEntity.ok(role);
    }
    
    /**
     * Get a role by name
     */
    @GetMapping("/name/{name}")
    @PreAuthorize("hasRole('ADMIN')")
    @Operation(summary = "Get role by name", description = "Retrieve a specific role by its name")
    public ResponseEntity<RoleDTO> getRoleByName(@PathVariable String name) {
        RoleDTO role = roleService.getRoleByName(name);
        return ResponseEntity.ok(role);
    }
    
    /**
     * Create a new role
     */
    @PostMapping
    @PreAuthorize("hasRole('ADMIN')")
    @Operation(summary = "Create new role", description = "Create a new role with optional permissions")
    public ResponseEntity<RoleDTO> createRole(@Valid @RequestBody RoleRequestDTO roleRequestDTO) {
        RoleDTO createdRole = roleService.createRole(roleRequestDTO);
        return ResponseEntity.status(HttpStatus.CREATED).body(createdRole);
    }
    
    /**
     * Update an existing role
     */
    @PutMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    @Operation(summary = "Update role", description = "Update an existing role's details and permissions")
    public ResponseEntity<RoleDTO> updateRole(
            @PathVariable Long id,
            @Valid @RequestBody RoleRequestDTO roleRequestDTO) {
        RoleDTO updatedRole = roleService.updateRole(id, roleRequestDTO);
        return ResponseEntity.ok(updatedRole);
    }
    
    /**
     * Delete a role
     */
    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    @Operation(summary = "Delete role", description = "Delete a role (only if not assigned to any users)")
    public ResponseEntity<Void> deleteRole(@PathVariable Long id) {
        roleService.deleteRole(id);
        return ResponseEntity.noContent().build();
    }
    
    /**
     * Assign permissions to a role (replaces existing permissions)
     */
    @PostMapping("/{id}/permissions")
    @PreAuthorize("hasRole('ADMIN')")
    @Operation(summary = "Assign permissions to role", description = "Assign a set of permissions to a role")
    public ResponseEntity<RoleDTO> assignPermissions(
            @PathVariable Long id,
            @RequestBody Set<Long> permissionIds) {
        RoleDTO updatedRole = roleService.assignPermissions(id, permissionIds);
        return ResponseEntity.ok(updatedRole);
    }
    
    /**
     * Add a single permission to a role
     */
    @PostMapping("/{roleId}/permissions/{permissionId}")
    @PreAuthorize("hasRole('ADMIN')")
    @Operation(summary = "Add permission to role", description = "Add a single permission to a role")
    public ResponseEntity<RoleDTO> addPermission(
            @PathVariable Long roleId,
            @PathVariable Long permissionId) {
        RoleDTO updatedRole = roleService.addPermission(roleId, permissionId);
        return ResponseEntity.ok(updatedRole);
    }
    
    /**
     * Remove a permission from a role
     */
    @DeleteMapping("/{roleId}/permissions/{permissionId}")
    @PreAuthorize("hasRole('ADMIN')")
    @Operation(summary = "Remove permission from role", description = "Remove a permission from a role")
    public ResponseEntity<RoleDTO> removePermission(
            @PathVariable Long roleId,
            @PathVariable Long permissionId) {
        RoleDTO updatedRole = roleService.removePermission(roleId, permissionId);
        return ResponseEntity.ok(updatedRole);
    }
    
    /**
     * Get roles for a specific user
     */
    @GetMapping("/user/{userId}")
    @PreAuthorize("hasRole('ADMIN')")
    @Operation(summary = "Get user's roles", description = "Get all roles assigned to a specific user")
    public ResponseEntity<Set<RoleDTO>> getUserRoles(@PathVariable Long userId) {
        Set<RoleDTO> roles = roleService.getUserRoles(userId);
        return ResponseEntity.ok(roles);
    }
    
    /**
     * Search roles by name
     */
    @GetMapping("/search")
    @PreAuthorize("hasRole('ADMIN')")
    @Operation(summary = "Search roles", description = "Search roles by name pattern")
    public ResponseEntity<List<RoleDTO>> searchRoles(@RequestParam String name) {
        List<RoleDTO> roles = roleService.searchRolesByName(name);
        return ResponseEntity.ok(roles);
    }
}

