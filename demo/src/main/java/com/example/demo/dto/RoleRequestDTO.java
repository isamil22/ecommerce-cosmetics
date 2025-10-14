package com.example.demo.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.HashSet;
import java.util.Set;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class RoleRequestDTO {
    @NotBlank(message = "Role name is required")
    private String name;
    
    private String description;
    
    private Set<Long> permissionIds = new HashSet<>();
}

