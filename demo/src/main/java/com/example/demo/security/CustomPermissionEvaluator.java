package com.example.demo.security;

import com.example.demo.model.User;
import com.example.demo.repositories.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.access.PermissionEvaluator;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.stereotype.Component;

import java.io.Serializable;
import java.util.Collection;

/**
 * Custom permission evaluator for fine-grained access control
 * Allows using hasPermission() in @PreAuthorize annotations
 */
@Component
@RequiredArgsConstructor
public class CustomPermissionEvaluator implements PermissionEvaluator {
    
    private final UserRepository userRepository;
    
    /**
     * Check if the current user has a specific permission on a target object
     * 
     * @param authentication The authentication object
     * @param targetDomainObject The target object (can be null)
     * @param permission The permission to check (e.g., "PRODUCT:CREATE")
     * @return true if user has the permission
     */
    @Override
    public boolean hasPermission(Authentication authentication, Object targetDomainObject, Object permission) {
        if (authentication == null || !authentication.isAuthenticated()) {
            return false;
        }
        
        return hasPrivilege(authentication, permission.toString());
    }
    
    /**
     * Check if the current user has a specific permission on a target object identified by ID
     * 
     * @param authentication The authentication object
     * @param targetId The target object ID
     * @param targetType The target object type
     * @param permission The permission to check
     * @return true if user has the permission
     */
    @Override
    public boolean hasPermission(Authentication authentication, Serializable targetId, String targetType, Object permission) {
        if (authentication == null || !authentication.isAuthenticated()) {
            return false;
        }
        
        return hasPrivilege(authentication, permission.toString());
    }
    
    /**
     * Check if user has a specific privilege (permission)
     * 
     * @param authentication The authentication object
     * @param permission The permission to check
     * @return true if user has the permission
     */
    private boolean hasPrivilege(Authentication authentication, String permission) {
        // Get all authorities (roles + permissions) from the authentication
        Collection<? extends GrantedAuthority> authorities = authentication.getAuthorities();
        
        // Check if user has the specific permission
        boolean hasPermission = authorities.stream()
                .anyMatch(auth -> auth.getAuthority().equals(permission));
        
        // Also check if user has ROLE_ADMIN (admin has all permissions)
        boolean isAdmin = authorities.stream()
                .anyMatch(auth -> auth.getAuthority().equals("ROLE_ADMIN"));
        
        return hasPermission || isAdmin;
    }
}

