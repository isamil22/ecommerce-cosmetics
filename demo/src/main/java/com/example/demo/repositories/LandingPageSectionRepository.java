package com.example.demo.repositories;

import com.example.demo.model.LandingPageSection;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

/**
 * Repository for LandingPageSection entity
 */
@Repository
public interface LandingPageSectionRepository extends JpaRepository<LandingPageSection, Long> {

    /**
     * Find all sections for a landing page, ordered by section_order
     */
    List<LandingPageSection> findByLandingPageIdOrderBySectionOrderAsc(Long landingPageId);

    /**
     * Find all visible sections for a landing page
     */
    @Query("SELECT s FROM LandingPageSection s WHERE s.landingPage.id = :landingPageId AND s.isVisible = true ORDER BY s.sectionOrder ASC")
    List<LandingPageSection> findVisibleByLandingPageId(@Param("landingPageId") Long landingPageId);

    /**
     * Delete all sections for a landing page
     */
    @Modifying
    void deleteByLandingPageId(Long landingPageId);

    /**
     * Count sections in a landing page
     */
    long countByLandingPageId(Long landingPageId);

    /**
     * Find section by landing page ID and section type
     */
    List<LandingPageSection> findByLandingPageIdAndSectionType(Long landingPageId, LandingPageSection.SectionType sectionType);
}

