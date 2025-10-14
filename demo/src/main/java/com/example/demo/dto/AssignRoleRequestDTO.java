package com.example.demo.dto;

import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.HashSet;
import java.util.Set;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class AssignRoleRequestDTO {
    @NotNull(message = "User ID is required")
    private Long userId;
    
    @NotEmpty(message = "At least one role ID is required")
    private Set<Long> roleIds = new HashSet<>();
}

