package com.example.demo.service;

import com.example.demo.dto.RoleDTO;
import com.example.demo.dto.RoleRequestDTO;
import com.example.demo.exception.ResourceNotFoundException;
import com.example.demo.mapper.RoleMapper;
import com.example.demo.model.Permission;
import com.example.demo.model.Role;
import com.example.demo.model.User;
import com.example.demo.repositories.PermissionRepository;
import com.example.demo.repositories.RoleRepository;
import com.example.demo.repositories.UserRepository;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.HashSet;
import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class RoleService {
    
    private final RoleRepository roleRepository;
    private final PermissionRepository permissionRepository;
    private final UserRepository userRepository;
    private final RoleMapper roleMapper;
    
    /**
     * Get all roles
     */
    public List<RoleDTO> getAllRoles() {
        return roleRepository.findAllWithPermissions().stream()
                .map(roleMapper::toDTO)
                .collect(Collectors.toList());
    }
    
    /**
     * Get a role by ID
     */
    public RoleDTO getRoleById(Long id) {
        Role role = roleRepository.findByIdWithPermissions(id)
                .orElseThrow(() -> new ResourceNotFoundException("Role not found with id: " + id));
        return roleMapper.toDTO(role);
    }
    
    /**
     * Get a role by name
     */
    public RoleDTO getRoleByName(String name) {
        Role role = roleRepository.findByNameWithPermissions(name)
                .orElseThrow(() -> new ResourceNotFoundException("Role not found with name: " + name));
        return roleMapper.toDTO(role);
    }
    
    /**
     * Create a new role
     */
    @Transactional
    public RoleDTO createRole(RoleRequestDTO roleRequestDTO) {
        // Check if role already exists
        if (roleRepository.existsByName(roleRequestDTO.getName())) {
            throw new IllegalStateException("Role with name '" + roleRequestDTO.getName() + "' already exists");
        }
        
        Role role = new Role();
        role.setName(roleRequestDTO.getName());
        role.setDescription(roleRequestDTO.getDescription());
        
        // Assign permissions if provided
        if (roleRequestDTO.getPermissionIds() != null && !roleRequestDTO.getPermissionIds().isEmpty()) {
            Set<Permission> permissions = new HashSet<>(permissionRepository.findAllById(roleRequestDTO.getPermissionIds()));
            role.setPermissions(permissions);
        }
        
        Role savedRole = roleRepository.save(role);
        return roleMapper.toDTO(savedRole);
    }
    
    /**
     * Update an existing role
     */
    @Transactional
    public RoleDTO updateRole(Long id, RoleRequestDTO roleRequestDTO) {
        Role role = roleRepository.findByIdWithPermissions(id)
                .orElseThrow(() -> new ResourceNotFoundException("Role not found with id: " + id));
        
        // Check if new name already exists (if name is being changed)
        if (!role.getName().equals(roleRequestDTO.getName()) && 
            roleRepository.existsByName(roleRequestDTO.getName())) {
            throw new IllegalStateException("Role with name '" + roleRequestDTO.getName() + "' already exists");
        }
        
        role.setName(roleRequestDTO.getName());
        role.setDescription(roleRequestDTO.getDescription());
        
        // Update permissions
        if (roleRequestDTO.getPermissionIds() != null) {
            Set<Permission> permissions = new HashSet<>(permissionRepository.findAllById(roleRequestDTO.getPermissionIds()));
            role.setPermissions(permissions);
        } else {
            role.getPermissions().clear();
        }
        
        Role updatedRole = roleRepository.save(role);
        return roleMapper.toDTO(updatedRole);
    }
    
    /**
     * Delete a role
     */
    @Transactional
    public void deleteRole(Long id) {
        Role role = roleRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Role not found with id: " + id));
        
        // Check if role is assigned to any users
        Long userCount = roleRepository.countUsersByRoleId(id);
        if (userCount > 0) {
            throw new IllegalStateException("Cannot delete role. It is assigned to " + userCount + " user(s)");
        }
        
        roleRepository.delete(role);
    }
    
    /**
     * Assign permissions to a role
     */
    @Transactional
    public RoleDTO assignPermissions(Long roleId, Set<Long> permissionIds) {
        Role role = roleRepository.findByIdWithPermissions(roleId)
                .orElseThrow(() -> new ResourceNotFoundException("Role not found with id: " + roleId));
        
        Set<Permission> permissions = new HashSet<>(permissionRepository.findAllById(permissionIds));
        role.setPermissions(permissions);
        
        Role updatedRole = roleRepository.save(role);
        return roleMapper.toDTO(updatedRole);
    }
    
    /**
     * Add a permission to a role
     */
    @Transactional
    public RoleDTO addPermission(Long roleId, Long permissionId) {
        Role role = roleRepository.findByIdWithPermissions(roleId)
                .orElseThrow(() -> new ResourceNotFoundException("Role not found with id: " + roleId));
        
        Permission permission = permissionRepository.findById(permissionId)
                .orElseThrow(() -> new ResourceNotFoundException("Permission not found with id: " + permissionId));
        
        role.addPermission(permission);
        
        Role updatedRole = roleRepository.save(role);
        return roleMapper.toDTO(updatedRole);
    }
    
    /**
     * Remove a permission from a role
     */
    @Transactional
    public RoleDTO removePermission(Long roleId, Long permissionId) {
        Role role = roleRepository.findByIdWithPermissions(roleId)
                .orElseThrow(() -> new ResourceNotFoundException("Role not found with id: " + roleId));
        
        Permission permission = permissionRepository.findById(permissionId)
                .orElseThrow(() -> new ResourceNotFoundException("Permission not found with id: " + permissionId));
        
        role.removePermission(permission);
        
        Role updatedRole = roleRepository.save(role);
        return roleMapper.toDTO(updatedRole);
    }
    
    /**
     * Get roles assigned to a user
     */
    public Set<RoleDTO> getUserRoles(Long userId) {
        Set<Role> roles = roleRepository.findByUserId(userId);
        return roles.stream()
                .map(roleMapper::toDTO)
                .collect(Collectors.toSet());
    }
    
    /**
     * Search roles by name
     */
    public List<RoleDTO> searchRolesByName(String namePattern) {
        List<Role> roles = roleRepository.searchByName("%" + namePattern + "%");
        return roles.stream()
                .map(roleMapper::toDTO)
                .collect(Collectors.toList());
    }
}

