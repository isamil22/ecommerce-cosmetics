package com.example.demo.controller;

import com.example.demo.model.User;
import com.example.demo.repositories.UserRepository;
import com.example.demo.repositories.RoleRepository;
import com.example.demo.model.Role;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/admin-fix")
public class AdminFixController {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private RoleRepository roleRepository;

    @PostMapping("/fix-admin-role")
    public ResponseEntity<Map<String, Object>> fixAdminRole() {
        Map<String, Object> response = new HashMap<>();
        
        try {
            // Find admin user
            User adminUser = userRepository.findByEmail("admin@example.com").orElse(null);
            if (adminUser == null) {
                response.put("success", false);
                response.put("message", "Admin user not found");
                return ResponseEntity.badRequest().body(response);
            }
            
            // Find ROLE_ADMIN
            Role adminRole = roleRepository.findByName("ROLE_ADMIN").orElse(null);
            if (adminRole == null) {
                response.put("success", false);
                response.put("message", "ROLE_ADMIN not found");
                return ResponseEntity.badRequest().body(response);
            }
            
            // Check if admin user already has ROLE_ADMIN
            boolean hasAdminRole = adminUser.hasRole("ROLE_ADMIN");
            
            if (!hasAdminRole) {
                // Add ROLE_ADMIN to admin user
                adminUser.addRole(adminRole);
                userRepository.save(adminUser);
                response.put("success", true);
                response.put("message", "ROLE_ADMIN assigned to admin user");
            } else {
                response.put("success", true);
                response.put("message", "Admin user already has ROLE_ADMIN");
            }
            
            response.put("adminUserId", adminUser.getId());
            response.put("adminRoleId", adminRole.getId());
            
            return ResponseEntity.ok(response);
            
        } catch (Exception e) {
            response.put("success", false);
            response.put("message", "Error: " + e.getMessage());
            return ResponseEntity.internalServerError().body(response);
        }
    }
}
