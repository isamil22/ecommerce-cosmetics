package com.example.demo.mapper;

import com.example.demo.dto.PermissionDTO;
import com.example.demo.model.Permission;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

import java.util.HashSet;
import java.util.Set;

@Mapper(componentModel = "spring")
public interface PermissionMapper {
    
    PermissionDTO toDTO(Permission permission);
    
    @Mapping(target = "roles", ignore = true)
    Permission toEntity(PermissionDTO permissionDTO);
    
    default Set<PermissionDTO> toDTOs(Set<Permission> permissions) {
        if (permissions == null) {
            return new HashSet<>();
        }
        Set<PermissionDTO> dtos = new HashSet<>();
        for (Permission permission : permissions) {
            dtos.add(toDTO(permission));
        }
        return dtos;
    }
    
    default Set<Permission> toEntities(Set<PermissionDTO> permissionDTOs) {
        if (permissionDTOs == null) {
            return new HashSet<>();
        }
        Set<Permission> entities = new HashSet<>();
        for (PermissionDTO dto : permissionDTOs) {
            entities.add(toEntity(dto));
        }
        return entities;
    }
}

