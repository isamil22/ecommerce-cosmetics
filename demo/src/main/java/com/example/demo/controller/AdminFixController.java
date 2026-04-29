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
    
    @Autowired
    private org.springframework.security.crypto.password.PasswordEncoder passwordEncoder;

    @PostMapping("/fix-admin-role")
    public ResponseEntity<Map<String, Object>> fixAdminRole() {
        Map<String, Object> response = new HashMap<>();
        
        try {
            // Find admin user
            User adminUser = userRepository.findByEmail("admin@example.com").orElse(null);
            
            // Find ROLE_ADMIN
            Role adminRole = roleRepository.findByName("ROLE_ADMIN").orElse(null);
            if (adminRole == null) {
                adminRole = new Role();
                adminRole.setName("ROLE_ADMIN");
                adminRole = roleRepository.save(adminRole);
            }

            if (adminUser == null) {
                adminUser = new User();
                adminUser.setFullName("Admin User");
                adminUser.setEmail("admin@example.com");
                adminUser.setPassword(passwordEncoder.encode("adminpassword")); 
                adminUser.setRole(com.example.demo.model.User.Role.ADMIN);
                adminUser.setEmailConfirmation(true);
                adminUser.setConfirmationCode("123456");
                adminUser.addRole(adminRole);
                userRepository.save(adminUser);
                
                response.put("success", true);
                response.put("message", "Admin user created successfully with password 'adminpassword'");
                return ResponseEntity.ok(response);
            } else {
                // Force reset password if user exists
                adminUser.setPassword(passwordEncoder.encode("adminpassword"));
                // Add ROLE_ADMIN if missing
                if (!adminUser.hasRole("ROLE_ADMIN")) {
                    adminUser.addRole(adminRole);
                }
                userRepository.save(adminUser);
                
                response.put("success", true);
                response.put("message", "Admin user found. Password forced to 'adminpassword' and ROLE_ADMIN ensured.");
                return ResponseEntity.ok(response);
            }
            
        } catch (Exception e) {
            response.put("success", false);
            response.put("message", "Error: " + e.getMessage());
            return ResponseEntity.internalServerError().body(response);
        }
    }
}
