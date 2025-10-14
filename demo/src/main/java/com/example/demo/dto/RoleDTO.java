package com.example.demo.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.HashSet;
import java.util.Set;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class RoleDTO {
    private Long id;
    private String name;
    private String description;
    private Set<PermissionDTO> permissions = new HashSet<>();
    private Set<Long> userIds = new HashSet<>();
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}

