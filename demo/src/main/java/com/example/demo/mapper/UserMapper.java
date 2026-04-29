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
            if ("ADMIN".equals(role.getName()) || "ROLE_ADMIN".equals(role.getName())) {
                return "ADMIN";
            }
        }

        for (com.example.demo.model.Role role : user.getRoles()) {
            if ("MANAGER".equals(role.getName()) || "ROLE_MANAGER".equals(role.getName())) {
                return "MANAGER";
            }
        }

        for (com.example.demo.model.Role role : user.getRoles()) {
            if ("EDITOR".equals(role.getName()) || "ROLE_EDITOR".equals(role.getName())) {
                return "EDITOR";
            }
        }

        for (com.example.demo.model.Role role : user.getRoles()) {
            if ("VIEWER".equals(role.getName()) || "ROLE_VIEWER".equals(role.getName())) {
                return "VIEWER";
            }
        }

        // Check if user has any admin-related permissions
        // Exclude normal user permissions like ORDER:CREATE, ORDER:READ_OWN,
        // USER:READ_OWN, USER:UPDATE_OWN
        boolean hasAdminPermissions = user.getRoles().stream()
                .filter(r -> r.getPermissions() != null)
                .flatMap(r -> r.getPermissions().stream())
                .filter(p -> p != null && p.getName() != null)
                .anyMatch(p -> {
                    String name = p.getName();

                    // Admin/Management permissions that grant dashboard access
                    return name.equals("DASHBOARD:VIEW") ||
                            name.equals("PRODUCT:CREATE") ||
                            name.equals("PRODUCT:UPDATE") ||
                            name.equals("PRODUCT:DELETE") ||
                            name.equals("PRODUCT:MANAGE") ||
                            name.equals("ORDER:UPDATE") ||
                            name.equals("ORDER:DELETE") ||
                            name.equals("ORDER:MANAGE") ||
                            name.equals("USER:CREATE") ||
                            name.equals("USER:DELETE") ||
                            name.equals("USER:MANAGE") ||
                            name.equals("USER:EDIT");
                });

        if (hasAdminPermissions) {
            return "MANAGER"; // Treat as manager if they have admin permissions
        }

        return "USER";
    }

    /**
     * Determines if user should have dashboard access based on their roles and
     * permissions
     */
    @Named("hasDashboardAccess")
    default boolean hasDashboardAccess(User user) {
        if (user.getRoles() == null || user.getRoles().isEmpty()) {
            // Fallback to legacy role check
            return user.getRole() == User.Role.ADMIN;
        }

        // Check for admin/manager/editor/viewer roles
        boolean hasAdminRole = user.getRoles().stream()
                .anyMatch(r -> "ADMIN".equals(r.getName()) || "ROLE_ADMIN".equals(r.getName()) ||
                        "MANAGER".equals(r.getName()) || "ROLE_MANAGER".equals(r.getName()) ||
                        "EDITOR".equals(r.getName()) || "ROLE_EDITOR".equals(r.getName()) ||
                        "VIEWER".equals(r.getName()) || "ROLE_VIEWER".equals(r.getName()));

        if (hasAdminRole) {
            return true;
        }

        // Check if user has any admin-related permissions
        // Only grant dashboard access for explicit admin/management permissions
        boolean hasAdminPermissions = user.getRoles().stream()
                .filter(r -> r.getPermissions() != null)
                .flatMap(r -> r.getPermissions().stream())
                .filter(p -> p != null && p.getName() != null)
                .anyMatch(p -> {
                    String name = p.getName();

                    // Admin/Management permissions that grant dashboard access
                    return name.equals("DASHBOARD:VIEW") ||
                            name.equals("PRODUCT:CREATE") ||
                            name.equals("PRODUCT:UPDATE") ||
                            name.equals("PRODUCT:DELETE") ||
                            name.equals("PRODUCT:MANAGE") ||
                            name.equals("ORDER:UPDATE") ||
                            name.equals("ORDER:DELETE") ||
                            name.equals("ORDER:MANAGE") ||
                            name.equals("USER:CREATE") ||
                            name.equals("USER:DELETE") ||
                            name.equals("USER:MANAGE") ||
                            name.equals("USER:EDIT");
                });

        return hasAdminPermissions;
    }
}