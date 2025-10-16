package com.example.demo.controller;

import com.example.demo.dto.PermissionDTO;
import com.example.demo.dto.PermissionRequestDTO;
import com.example.demo.service.PermissionService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;
import java.util.Set;

@RestController
@RequestMapping("/api/permissions")
@RequiredArgsConstructor
@Tag(name = "Permission Management", description = "APIs for managing permissions in the RBAC system")
public class PermissionController {
    
    private final PermissionService permissionService;
    
    /**
     * Get all permissions
     */
    @GetMapping
    @PreAuthorize("hasAuthority('ROLE_ADMIN') or hasAuthority('ROLE_MANAGER')")
    @Operation(summary = "Get all permissions", description = "Retrieve all permissions in the system")
    public ResponseEntity<List<PermissionDTO>> getAllPermissions() {
        List<PermissionDTO> permissions = permissionService.getAllPermissions();
        return ResponseEntity.ok(permissions);
    }
    
    /**
     * Get a permission by ID
     */
    @GetMapping("/{id}")
    @PreAuthorize("hasAuthority('ROLE_ADMIN') or hasAuthority('ROLE_MANAGER')")
    @Operation(summary = "Get permission by ID", description = "Retrieve a specific permission")
    public ResponseEntity<PermissionDTO> getPermissionById(@PathVariable Long id) {
        PermissionDTO permission = permissionService.getPermissionById(id);
        return ResponseEntity.ok(permission);
    }
    
    /**
     * Get a permission by name
     */
    @GetMapping("/name/{name}")
    @PreAuthorize("hasAuthority('ROLE_ADMIN') or hasAuthority('ROLE_MANAGER')")
    @Operation(summary = "Get permission by name", description = "Retrieve a permission by its name")
    public ResponseEntity<PermissionDTO> getPermissionByName(@PathVariable String name) {
        PermissionDTO permission = permissionService.getPermissionByName(name);
        return ResponseEntity.ok(permission);
    }
    
    /**
     * Create a new permission
     */
    @PostMapping
    @PreAuthorize("hasAuthority('ROLE_ADMIN') or hasAuthority('ROLE_MANAGER')")
    @Operation(summary = "Create new permission", description = "Create a new permission in the system")
    public ResponseEntity<PermissionDTO> createPermission(@Valid @RequestBody PermissionRequestDTO permissionRequestDTO) {
        PermissionDTO createdPermission = permissionService.createPermission(permissionRequestDTO);
        return ResponseEntity.status(HttpStatus.CREATED).body(createdPermission);
    }
    
    /**
     * Update an existing permission
     */
    @PutMapping("/{id}")
    @PreAuthorize("hasAuthority('ROLE_ADMIN') or hasAuthority('ROLE_MANAGER')")
    @Operation(summary = "Update permission", description = "Update an existing permission")
    public ResponseEntity<PermissionDTO> updatePermission(
            @PathVariable Long id,
            @Valid @RequestBody PermissionRequestDTO permissionRequestDTO) {
        PermissionDTO updatedPermission = permissionService.updatePermission(id, permissionRequestDTO);
        return ResponseEntity.ok(updatedPermission);
    }
    
    /**
     * Delete a permission
     */
    @DeleteMapping("/{id}")
    @PreAuthorize("hasAuthority('ROLE_ADMIN') or hasAuthority('ROLE_MANAGER')")
    @Operation(summary = "Delete permission", description = "Delete a permission (only if not assigned to any roles)")
    public ResponseEntity<Void> deletePermission(@PathVariable Long id) {
        permissionService.deletePermission(id);
        return ResponseEntity.noContent().build();
    }
    
    /**
     * Get permissions by resource
     */
    @GetMapping("/resource/{resource}")
    @PreAuthorize("hasAuthority('ROLE_ADMIN') or hasAuthority('ROLE_MANAGER')")
    @Operation(summary = "Get permissions by resource", description = "Get all permissions for a specific resource")
    public ResponseEntity<List<PermissionDTO>> getPermissionsByResource(@PathVariable String resource) {
        List<PermissionDTO> permissions = permissionService.getPermissionsByResource(resource);
        return ResponseEntity.ok(permissions);
    }
    
    /**
     * Get permissions by action
     */
    @GetMapping("/action/{action}")
    @PreAuthorize("hasAuthority('ROLE_ADMIN') or hasAuthority('ROLE_MANAGER')")
    @Operation(summary = "Get permissions by action", description = "Get all permissions with a specific action")
    public ResponseEntity<List<PermissionDTO>> getPermissionsByAction(@PathVariable String action) {
        List<PermissionDTO> permissions = permissionService.getPermissionsByAction(action);
        return ResponseEntity.ok(permissions);
    }
    
    /**
     * Get permissions for a specific role
     */
    @GetMapping("/role/{roleId}")
    @PreAuthorize("hasAuthority('ROLE_ADMIN') or hasAuthority('ROLE_MANAGER')")
    @Operation(summary = "Get role permissions", description = "Get all permissions assigned to a specific role")
    public ResponseEntity<Set<PermissionDTO>> getRolePermissions(@PathVariable Long roleId) {
        Set<PermissionDTO> permissions = permissionService.getRolePermissions(roleId);
        return ResponseEntity.ok(permissions);
    }
    
    /**
     * Get permissions for a specific user
     */
    @GetMapping("/user/{userId}")
    @PreAuthorize("hasAuthority('ROLE_ADMIN') or hasAuthority('ROLE_MANAGER')")
    @Operation(summary = "Get user permissions", description = "Get all permissions a user has through their roles")
    public ResponseEntity<Set<PermissionDTO>> getUserPermissions(@PathVariable Long userId) {
        Set<PermissionDTO> permissions = permissionService.getUserPermissions(userId);
        return ResponseEntity.ok(permissions);
    }
    
    /**
     * Get all unique resources
     */
    @GetMapping("/resources")
    @PreAuthorize("hasAuthority('ROLE_ADMIN') or hasAuthority('ROLE_MANAGER')")
    @Operation(summary = "Get all resources", description = "Get all unique resource names")
    public ResponseEntity<List<String>> getAllResources() {
        List<String> resources = permissionService.getAllResources();
        return ResponseEntity.ok(resources);
    }
    
    /**
     * Get all unique actions
     */
    @GetMapping("/actions")
    @PreAuthorize("hasAuthority('ROLE_ADMIN') or hasAuthority('ROLE_MANAGER')")
    @Operation(summary = "Get all actions", description = "Get all unique action names")
    public ResponseEntity<List<String>> getAllActions() {
        List<String> actions = permissionService.getAllActions();
        return ResponseEntity.ok(actions);
    }
    
    /**
     * Search permissions by name
     */
    @GetMapping("/search/name")
    @PreAuthorize("hasAuthority('ROLE_ADMIN') or hasAuthority('ROLE_MANAGER')")
    @Operation(summary = "Search permissions by name", description = "Search permissions by name pattern")
    public ResponseEntity<List<PermissionDTO>> searchByName(@RequestParam String name) {
        List<PermissionDTO> permissions = permissionService.searchPermissionsByName(name);
        return ResponseEntity.ok(permissions);
    }
    
    /**
     * Search permissions by resource
     */
    @GetMapping("/search/resource")
    @PreAuthorize("hasAuthority('ROLE_ADMIN') or hasAuthority('ROLE_MANAGER')")
    @Operation(summary = "Search permissions by resource", description = "Search permissions by resource pattern")
    public ResponseEntity<List<PermissionDTO>> searchByResource(@RequestParam String resource) {
        List<PermissionDTO> permissions = permissionService.searchPermissionsByResource(resource);
        return ResponseEntity.ok(permissions);
    }
    
    /**
     * Check if a user has a specific permission
     */
    @GetMapping("/check")
    @PreAuthorize("hasAuthority('ROLE_ADMIN') or hasAuthority('ROLE_MANAGER')")
    @Operation(summary = "Check user permission", description = "Check if a user has a specific permission")
    public ResponseEntity<Map<String, Boolean>> checkUserPermission(
            @RequestParam Long userId,
            @RequestParam String permissionName) {
        boolean hasPermission = permissionService.userHasPermission(userId, permissionName);
        return ResponseEntity.ok(Map.of("hasPermission", hasPermission));
    }
}

