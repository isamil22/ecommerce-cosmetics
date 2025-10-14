package com.example.demo.repositories;

import com.example.demo.model.Role;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;
import java.util.Set;

@Repository
public interface RoleRepository extends JpaRepository<Role, Long> {
    
    /**
     * Find a role by its name
     * @param name The role name (e.g., "ROLE_ADMIN")
     * @return Optional containing the role if found
     */
    Optional<Role> findByName(String name);
    
    /**
     * Check if a role exists by name
     * @param name The role name
     * @return true if role exists
     */
    boolean existsByName(String name);
    
    /**
     * Find all roles with their permissions eagerly loaded
     * @return List of roles with permissions
     */
    @Query("SELECT DISTINCT r FROM Role r LEFT JOIN FETCH r.permissions")
    List<Role> findAllWithPermissions();
    
    /**
     * Find a role by id with permissions eagerly loaded
     * @param id The role ID
     * @return Optional containing the role with permissions if found
     */
    @Query("SELECT r FROM Role r LEFT JOIN FETCH r.permissions WHERE r.id = :id")
    Optional<Role> findByIdWithPermissions(@Param("id") Long id);
    
    /**
     * Find a role by name with permissions eagerly loaded
     * @param name The role name
     * @return Optional containing the role with permissions if found
     */
    @Query("SELECT r FROM Role r LEFT JOIN FETCH r.permissions WHERE r.name = :name")
    Optional<Role> findByNameWithPermissions(@Param("name") String name);
    
    /**
     * Find roles assigned to a specific user
     * @param userId The user ID
     * @return Set of roles assigned to the user
     */
    @Query("SELECT r FROM Role r JOIN r.users u WHERE u.id = :userId")
    Set<Role> findByUserId(@Param("userId") Long userId);
    
    /**
     * Find all roles that have a specific permission
     * @param permissionId The permission ID
     * @return List of roles that have this permission
     */
    @Query("SELECT r FROM Role r JOIN r.permissions p WHERE p.id = :permissionId")
    List<Role> findByPermissionId(@Param("permissionId") Long permissionId);
    
    /**
     * Search roles by name pattern
     * @param namePattern The name pattern (e.g., "%ADMIN%")
     * @return List of matching roles
     */
    @Query("SELECT r FROM Role r WHERE LOWER(r.name) LIKE LOWER(:namePattern)")
    List<Role> searchByName(@Param("namePattern") String namePattern);
    
    /**
     * Count the number of users assigned to a role
     * @param roleId The role ID
     * @return Number of users with this role
     */
    @Query("SELECT COUNT(u) FROM User u JOIN u.roles r WHERE r.id = :roleId")
    Long countUsersByRoleId(@Param("roleId") Long roleId);
}

