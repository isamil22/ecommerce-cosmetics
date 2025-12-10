package com.example.demo.repositories;

import com.example.demo.model.LandingPage;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

/**
 * Repository for LandingPage entity
 */
@Repository
public interface LandingPageRepository extends JpaRepository<LandingPage, Long> {

    /**
     * Find landing page by slug
     */
    Optional<LandingPage> findBySlug(String slug);

    /**
     * Find published landing page by slug (for public access)
     */
    @Query("SELECT lp FROM LandingPage lp WHERE lp.slug = :slug AND lp.status = 'PUBLISHED'")
    Optional<LandingPage> findPublishedBySlug(@Param("slug") String slug);

    /**
     * Find all landing pages by status
     */
    Page<LandingPage> findByStatus(LandingPage.LandingPageStatus status, Pageable pageable);

    /**
     * Find landing pages by product ID
     */
    List<LandingPage> findByProductId(Long productId);

    /**
     * Find landing pages created by specific user
     */
    Page<LandingPage> findByCreatedById(Long userId, Pageable pageable);

    /**
     * Check if slug already exists
     */
    boolean existsBySlug(String slug);

    /**
     * Check if slug exists excluding specific landing page ID (for updates)
     */
    @Query("SELECT CASE WHEN COUNT(lp) > 0 THEN true ELSE false END FROM LandingPage lp WHERE lp.slug = :slug AND lp.id != :id")
    boolean existsBySlugAndIdNot(@Param("slug") String slug, @Param("id") Long id);

    /**
     * Find all published landing pages
     */
    @Query("SELECT lp FROM LandingPage lp WHERE lp.status = 'PUBLISHED' ORDER BY lp.publishedAt DESC")
    List<LandingPage> findAllPublished();

    /**
     * Count landing pages by status
     */
    long countByStatus(LandingPage.LandingPageStatus status);

    /**
     * Search landing pages by title
     */
    @Query("SELECT lp FROM LandingPage lp WHERE LOWER(lp.title) LIKE LOWER(CONCAT('%', :searchTerm, '%'))")
    Page<LandingPage> searchByTitle(@Param("searchTerm") String searchTerm, Pageable pageable);
}

