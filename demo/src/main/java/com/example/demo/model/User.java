// demo/src/main/java/com/example/demo/model/User.java

package com.example.demo.model;

import jakarta.persistence.*;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;
import com.fasterxml.jackson.annotation.JsonIgnore;

import java.time.LocalDateTime;
import java.util.Collection;
import java.util.HashSet;
import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor
@Table(name="users")
@lombok.EqualsAndHashCode(exclude = {"cart", "roles"})
@lombok.ToString(exclude = {"cart", "roles"})
public class User implements UserDetails {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotBlank(message = "Full name is required")
    private String fullName;

    @NotBlank
    @Email
    @Column(unique = true)
    private String email;

    @Column(nullable = true) // Allow password to be null
    private String password;

    @Enumerated(EnumType.STRING)
    private Role role; // Kept for backward compatibility - will be deprecated

    @ManyToMany(fetch = FetchType.EAGER)
    @JoinTable(
        name = "user_roles",
        joinColumns = @JoinColumn(name = "user_id"),
        inverseJoinColumns = @JoinColumn(name = "role_id")
    )
    @JsonIgnore
    private Set<com.example.demo.model.Role> roles = new HashSet<>();

    @OneToOne(mappedBy = "user", cascade = CascadeType.ALL, orphanRemoval = true)
    @JsonIgnore // Added to break circular reference
    private Cart cart;

    private boolean emailConfirmation;
    private String confirmationCode;

    private String resetPasswordToken;
    private LocalDateTime resetPasswordTokenExpiry;

    @Transient
    private String recaptchaToken;

    @Override
    public Collection<? extends GrantedAuthority> getAuthorities() {
        Set<GrantedAuthority> authorities = new HashSet<>();
        
        // Add role-based authorities from new RBAC system
        if (roles != null && !roles.isEmpty()) {
            for (com.example.demo.model.Role r : roles) {
                // Add role itself as an authority with ROLE_ prefix for Spring Security
                authorities.add(new SimpleGrantedAuthority("ROLE_" + r.getName()));
                
                // Add all permissions from this role
                if (r.getPermissions() != null) {
                    for (Permission permission : r.getPermissions()) {
                        authorities.add(new SimpleGrantedAuthority(permission.getName()));
                    }
                }
            }
        }
        
        // Fallback to old role enum for backward compatibility
        if (authorities.isEmpty() && role != null) {
            authorities.add(new SimpleGrantedAuthority("ROLE_" + role.name()));
        }
        
        return authorities;
    }
    
    // Utility methods for managing roles
    public void addRole(com.example.demo.model.Role roleToAdd) {
        this.roles.add(roleToAdd);
        roleToAdd.getUsers().add(this);
    }
    
    public void removeRole(com.example.demo.model.Role roleToRemove) {
        this.roles.remove(roleToRemove);
        roleToRemove.getUsers().remove(this);
    }
    
    public boolean hasRole(String roleName) {
        return roles.stream()
            .anyMatch(r -> r.getName().equals(roleName));
    }
    
    public boolean hasPermission(String permissionName) {
        return roles.stream()
            .flatMap(r -> r.getPermissions().stream())
            .anyMatch(p -> p.getName().equals(permissionName));
    }
    
    public Set<Permission> getAllPermissions() {
        return roles.stream()
            .flatMap(r -> r.getPermissions().stream())
            .collect(Collectors.toSet());
    }

    @Override
    public String getUsername() {
        return email;
    }

    @Override
    public boolean isAccountNonExpired() {
        return true;
    }

    @Override
    public boolean isAccountNonLocked() {
        return true;
    }

    @Override
    public boolean isCredentialsNonExpired() {
        return true;
    }

    @Override
    public boolean isEnabled() {
        return this.emailConfirmation;
    }

    public enum Role{
        USER, ADMIN
    }
}