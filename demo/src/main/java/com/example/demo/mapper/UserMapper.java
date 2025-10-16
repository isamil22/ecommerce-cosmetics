package com.example.demo.mapper;

import com.example.demo.dto.UserDTO;
import com.example.demo.model.User;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.Named;

import java.util.List;

@Mapper(componentModel = "spring")
public interface UserMapper {
    
    @Mapping(target = "effectiveRole", source = "user", qualifiedByName = "determineEffectiveRole")
    @Mapping(target = "hasDashboardAccess", source = "user", qualifiedByName = "hasDashboardAccess")
    UserDTO toDTO(User user);
    
    List<UserDTO> toDTOs(List<User> users);
    
    /**
     * Determines the effective role for frontend behavior based on RBAC roles
     * Priority: ADMIN > MANAGER > EDITOR > VIEWER > USER
     */
    @Named("determineEffectiveRole")
    default String determineEffectiveRole(User user) {
        if (user.getRoles() == null || user.getRoles().isEmpty()) {
            // Fallback to legacy role
            return user.getRole() != null ? user.getRole().name() : "USER";
        }
        
        // Check for roles in priority order
        for (com.example.demo.model.Role role : user.getRoles()) {
            String roleName = role.getName();
            if (roleName.equals("ADMIN")) {
                return "ADMIN";
            }
        }
        
        for (com.example.demo.model.Role role : user.getRoles()) {
            String roleName = role.getName();
            if (roleName.equals("MANAGER")) {
                return "MANAGER";
            }
        }
        
        for (com.example.demo.model.Role role : user.getRoles()) {
            String roleName = role.getName();
            if (roleName.equals("EDITOR")) {
                return "EDITOR";
            }
        }
        
        for (com.example.demo.model.Role role : user.getRoles()) {
            String roleName = role.getName();
            if (roleName.equals("VIEWER")) {
                return "VIEWER";
            }
        }
        
        // If user has any RBAC roles but none of the above, they still get dashboard access
        // Check if they have any admin-related permissions
        boolean hasAdminPermissions = user.getRoles().stream()
            .flatMap(r -> r.getPermissions().stream())
            .anyMatch(p -> p.getName().startsWith("PRODUCT:") || 
                          p.getName().startsWith("ORDER:") || 
                          p.getName().startsWith("USER:") ||
                          p.getName().equals("DASHBOARD:VIEW"));
        
        if (hasAdminPermissions) {
            return "MANAGER"; // Treat as manager if they have admin permissions
        }
        
        return "USER";
    }
    
    /**
     * Determines if user should have dashboard access based on their roles and permissions
     */
    @Named("hasDashboardAccess")
    default boolean hasDashboardAccess(User user) {
        if (user.getRoles() == null || user.getRoles().isEmpty()) {
            // Fallback to legacy role check
            return user.getRole() == User.Role.ADMIN;
        }
        
        // Check for admin/manager/editor/viewer roles
        boolean hasAdminRole = user.getRoles().stream()
            .anyMatch(r -> r.getName().equals("ADMIN") || 
                          r.getName().equals("MANAGER") || 
                          r.getName().equals("EDITOR") || 
                          r.getName().equals("VIEWER"));
        
        if (hasAdminRole) {
            return true;
        }
        
        // Check if user has any admin-related permissions
        boolean hasAdminPermissions = user.getRoles().stream()
            .flatMap(r -> r.getPermissions().stream())
            .anyMatch(p -> p.getName().startsWith("PRODUCT:") || 
                          p.getName().startsWith("ORDER:") || 
                          p.getName().startsWith("USER:") ||
                          p.getName().equals("DASHBOARD:VIEW"));
        
        return hasAdminPermissions;
    }
}