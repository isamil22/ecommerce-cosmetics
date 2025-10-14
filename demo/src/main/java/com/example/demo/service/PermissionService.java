package com.example.demo.service;

import com.example.demo.dto.PermissionDTO;
import com.example.demo.dto.PermissionRequestDTO;
import com.example.demo.exception.ResourceNotFoundException;
import com.example.demo.mapper.PermissionMapper;
import com.example.demo.model.Permission;
import com.example.demo.repositories.PermissionRepository;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class PermissionService {
    
    private final PermissionRepository permissionRepository;
    private final PermissionMapper permissionMapper;
    
    /**
     * Get all permissions
     */
    public List<PermissionDTO> getAllPermissions() {
        return permissionRepository.findAll().stream()
                .map(permissionMapper::toDTO)
                .collect(Collectors.toList());
    }
    
    /**
     * Get a permission by ID
     */
    public PermissionDTO getPermissionById(Long id) {
        Permission permission = permissionRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Permission not found with id: " + id));
        return permissionMapper.toDTO(permission);
    }
    
    /**
     * Get a permission by name
     */
    public PermissionDTO getPermissionByName(String name) {
        Permission permission = permissionRepository.findByName(name)
                .orElseThrow(() -> new ResourceNotFoundException("Permission not found with name: " + name));
        return permissionMapper.toDTO(permission);
    }
    
    /**
     * Create a new permission
     */
    @Transactional
    public PermissionDTO createPermission(PermissionRequestDTO permissionRequestDTO) {
        // Check if permission already exists
        if (permissionRepository.existsByName(permissionRequestDTO.getName())) {
            throw new IllegalStateException("Permission with name '" + permissionRequestDTO.getName() + "' already exists");
        }
        
        // Check if permission already exists by resource and action
        if (permissionRepository.findByResourceAndAction(
                permissionRequestDTO.getResource(), 
                permissionRequestDTO.getAction()).isPresent()) {
            throw new IllegalStateException("Permission for resource '" + permissionRequestDTO.getResource() + 
                    "' and action '" + permissionRequestDTO.getAction() + "' already exists");
        }
        
        Permission permission = new Permission();
        permission.setName(permissionRequestDTO.getName());
        permission.setDescription(permissionRequestDTO.getDescription());
        permission.setResource(permissionRequestDTO.getResource());
        permission.setAction(permissionRequestDTO.getAction());
        
        Permission savedPermission = permissionRepository.save(permission);
        return permissionMapper.toDTO(savedPermission);
    }
    
    /**
     * Update an existing permission
     */
    @Transactional
    public PermissionDTO updatePermission(Long id, PermissionRequestDTO permissionRequestDTO) {
        Permission permission = permissionRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Permission not found with id: " + id));
        
        // Check if new name already exists (if name is being changed)
        if (!permission.getName().equals(permissionRequestDTO.getName()) && 
            permissionRepository.existsByName(permissionRequestDTO.getName())) {
            throw new IllegalStateException("Permission with name '" + permissionRequestDTO.getName() + "' already exists");
        }
        
        permission.setName(permissionRequestDTO.getName());
        permission.setDescription(permissionRequestDTO.getDescription());
        permission.setResource(permissionRequestDTO.getResource());
        permission.setAction(permissionRequestDTO.getAction());
        
        Permission updatedPermission = permissionRepository.save(permission);
        return permissionMapper.toDTO(updatedPermission);
    }
    
    /**
     * Delete a permission
     */
    @Transactional
    public void deletePermission(Long id) {
        Permission permission = permissionRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Permission not found with id: " + id));
        
        // Check if permission is assigned to any roles
        Long roleCount = permissionRepository.countRolesByPermissionId(id);
        if (roleCount > 0) {
            throw new IllegalStateException("Cannot delete permission. It is assigned to " + roleCount + " role(s)");
        }
        
        permissionRepository.delete(permission);
    }
    
    /**
     * Get all permissions for a specific resource
     */
    public List<PermissionDTO> getPermissionsByResource(String resource) {
        return permissionRepository.findByResource(resource).stream()
                .map(permissionMapper::toDTO)
                .collect(Collectors.toList());
    }
    
    /**
     * Get all permissions with a specific action
     */
    public List<PermissionDTO> getPermissionsByAction(String action) {
        return permissionRepository.findByAction(action).stream()
                .map(permissionMapper::toDTO)
                .collect(Collectors.toList());
    }
    
    /**
     * Get all permissions for a role
     */
    public Set<PermissionDTO> getRolePermissions(Long roleId) {
        Set<Permission> permissions = permissionRepository.findByRoleId(roleId);
        return permissions.stream()
                .map(permissionMapper::toDTO)
                .collect(Collectors.toSet());
    }
    
    /**
     * Get all permissions for a user (through their roles)
     */
    public Set<PermissionDTO> getUserPermissions(Long userId) {
        Set<Permission> permissions = permissionRepository.findByUserId(userId);
        return permissions.stream()
                .map(permissionMapper::toDTO)
                .collect(Collectors.toSet());
    }
    
    /**
     * Search permissions by name
     */
    public List<PermissionDTO> searchPermissionsByName(String namePattern) {
        List<Permission> permissions = permissionRepository.searchByName("%" + namePattern + "%");
        return permissions.stream()
                .map(permissionMapper::toDTO)
                .collect(Collectors.toList());
    }
    
    /**
     * Search permissions by resource
     */
    public List<PermissionDTO> searchPermissionsByResource(String resourcePattern) {
        List<Permission> permissions = permissionRepository.searchByResource("%" + resourcePattern + "%");
        return permissions.stream()
                .map(permissionMapper::toDTO)
                .collect(Collectors.toList());
    }
    
    /**
     * Get all unique resources
     */
    public List<String> getAllResources() {
        return permissionRepository.findAllResources();
    }
    
    /**
     * Get all unique actions
     */
    public List<String> getAllActions() {
        return permissionRepository.findAllActions();
    }
    
    /**
     * Check if a user has a specific permission
     */
    public boolean userHasPermission(Long userId, String permissionName) {
        return permissionRepository.userHasPermission(userId, permissionName);
    }
}

