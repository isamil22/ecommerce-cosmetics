package com.example.demo.mapper;

import com.example.demo.dto.RoleDTO;
import com.example.demo.model.Permission;
import com.example.demo.model.Role;
import com.example.demo.model.User;
import org.mapstruct.*;

import java.util.HashSet;
import java.util.Set;
import java.util.stream.Collectors;

@Mapper(componentModel = "spring", uses = {PermissionMapper.class})
public interface RoleMapper {
    
    @Mapping(target = "userIds", source = "users", qualifiedByName = "usersToUserIds")
    RoleDTO toDTO(Role role);
    
    @Mapping(target = "users", ignore = true)
    @Mapping(target = "permissions", ignore = true)
    Role toEntity(RoleDTO roleDTO);
    
    @Named("usersToUserIds")
    default Set<Long> usersToUserIds(Set<User> users) {
        if (users == null) {
            return new HashSet<>();
        }
        return users.stream()
                .map(User::getId)
                .collect(Collectors.toSet());
    }
    
    @Named("permissionsToPermissionIds")
    default Set<Long> permissionsToPermissionIds(Set<Permission> permissions) {
        if (permissions == null) {
            return new HashSet<>();
        }
        return permissions.stream()
                .map(Permission::getId)
                .collect(Collectors.toSet());
    }
    
    default Set<Role> toDTOs(Set<Role> roles) {
        if (roles == null) {
            return new HashSet<>();
        }
        return roles;
    }
}

