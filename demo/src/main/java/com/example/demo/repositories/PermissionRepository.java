package com.example.demo.repositories;

import com.example.demo.model.Permission;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;
import java.util.Set;

@Repository
public interface PermissionRepository extends JpaRepository<Permission, Long> {
    
    /**
     * Find a permission by its name
     * @param name The permission name (e.g., "PRODUCT:VIEW")
     * @return Optional containing the permission if found
     */
    Optional<Permission> findByName(String name);
    
    /**
     * Check if a permission exists by name
     * @param name The permission name
     * @return true if permission exists
     */
    boolean existsByName(String name);
    
    /**
     * Find all permissions for a specific resource
     * @param resource The resource name (e.g., "PRODUCT")
     * @return List of permissions for this resource
     */
    List<Permission> findByResource(String resource);
    
    /**
     * Find all permissions with a specific action
     * @param action The action (e.g., "VIEW", "EDIT")
     * @return List of permissions with this action
     */
    List<Permission> findByAction(String action);
    
    /**
     * Find a permission by resource and action
     * @param resource The resource name
     * @param action The action
     * @return Optional containing the permission if found
     */
    Optional<Permission> findByResourceAndAction(String resource, String action);
    
    /**
     * Find all permissions assigned to a specific role
     * @param roleId The role ID
     * @return Set of permissions assigned to this role
     */
    @Query("SELECT p FROM Permission p JOIN p.roles r WHERE r.id = :roleId")
    Set<Permission> findByRoleId(@Param("roleId") Long roleId);
    
    /**
     * Find all permissions for a specific user (through their roles)
     * @param userId The user ID
     * @return Set of permissions the user has
     */
    @Query("SELECT DISTINCT p FROM Permission p " +
           "JOIN p.roles r " +
           "JOIN r.users u " +
           "WHERE u.id = :userId")
    Set<Permission> findByUserId(@Param("userId") Long userId);
    
    /**
     * Search permissions by name pattern
     * @param namePattern The name pattern (e.g., "%PRODUCT%")
     * @return List of matching permissions
     */
    @Query("SELECT p FROM Permission p WHERE LOWER(p.name) LIKE LOWER(:namePattern)")
    List<Permission> searchByName(@Param("namePattern") String namePattern);
    
    /**
     * Search permissions by resource pattern
     * @param resourcePattern The resource pattern (e.g., "%PRODUCT%")
     * @return List of matching permissions
     */
    @Query("SELECT p FROM Permission p WHERE LOWER(p.resource) LIKE LOWER(:resourcePattern)")
    List<Permission> searchByResource(@Param("resourcePattern") String resourcePattern);
    
    /**
     * Find all unique resources
     * @return List of unique resource names
     */
    @Query("SELECT DISTINCT p.resource FROM Permission p ORDER BY p.resource")
    List<String> findAllResources();
    
    /**
     * Find all unique actions
     * @return List of unique action names
     */
    @Query("SELECT DISTINCT p.action FROM Permission p ORDER BY p.action")
    List<String> findAllActions();
    
    /**
     * Count the number of roles that have this permission
     * @param permissionId The permission ID
     * @return Number of roles with this permission
     */
    @Query("SELECT COUNT(r) FROM Role r JOIN r.permissions p WHERE p.id = :permissionId")
    Long countRolesByPermissionId(@Param("permissionId") Long permissionId);
    
    /**
     * Check if a user has a specific permission
     * @param userId The user ID
     * @param permissionName The permission name
     * @return true if user has the permission
     */
    @Query("SELECT CASE WHEN COUNT(p) > 0 THEN true ELSE false END " +
           "FROM Permission p " +
           "JOIN p.roles r " +
           "JOIN r.users u " +
           "WHERE u.id = :userId AND p.name = :permissionName")
    boolean userHasPermission(@Param("userId") Long userId, @Param("permissionName") String permissionName);
}

