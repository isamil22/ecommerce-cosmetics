package com.example.demo.repositories;

import com.example.demo.model.PackItem;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface PackItemRepository extends JpaRepository<PackItem, Long> {
    
    /**
     * Find all pack items by default product ID
     */
    List<PackItem> findByDefaultProductId(Long productId);
}