package com.example.demo.repositories;

import com.example.demo.model.Product;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import java.util.List;
import java.util.Optional;

public interface ProductRepository extends JpaRepository<Product, Long>, JpaSpecificationExecutor<Product> {

    // Regular queries (exclude deleted products)
    Page<Product> findByCategoryIdAndDeletedFalse(Long categoryId, Pageable pageable);
    Page<Product> findByBestsellerIsTrueAndDeletedFalse(Pageable pageable);
    Page<Product> findByNewArrivalIsTrueAndDeletedFalse(Pageable pageable);
    List<Product> findByNameContainingIgnoreCaseAndDeletedFalse(String name);
    List<Product> findByIsPackableTrueAndDeletedFalse();
    
    // Include deleted products for admin operations
    Page<Product> findByCategoryId(Long categoryId, Pageable pageable);
    Page<Product> findByBestsellerIsTrue(Pageable pageable);
    Page<Product> findByNewArrivalIsTrue(Pageable pageable);
    List<Product> findByNameContainingIgnoreCase(String name);
    List<Product> findByIsPackableTrue();
    
    // Soft delete specific queries
    List<Product> findByDeletedTrue();
    List<Product> findByDeletedFalse();
    Optional<Product> findByIdAndDeletedFalse(Long id);
    
    // Custom query to find all products (including deleted) for admin
    @Query("SELECT p FROM Product p WHERE p.deleted = :deleted")
    Page<Product> findByDeletedStatus(@Param("deleted") boolean deleted, Pageable pageable);
}