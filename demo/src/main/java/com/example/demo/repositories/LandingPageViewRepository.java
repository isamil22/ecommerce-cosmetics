package com.example.demo.repositories;

import com.example.demo.model.LandingPageView;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

/**
 * Repository for LandingPageView entity
 */
@Repository
public interface LandingPageViewRepository extends JpaRepository<LandingPageView, Long> {

    /**
     * Find view record by landing page ID and date
     */
    Optional<LandingPageView> findByLandingPageIdAndViewDate(Long landingPageId, LocalDate viewDate);

    /**
     * Find all views for a landing page
     */
    List<LandingPageView> findByLandingPageIdOrderByViewDateDesc(Long landingPageId);

    /**
     * Get total views for a landing page
     */
    @Query("SELECT COALESCE(SUM(v.viewCount), 0) FROM LandingPageView v WHERE v.landingPage.id = :landingPageId")
    Long getTotalViewsByLandingPageId(@Param("landingPageId") Long landingPageId);

    /**
     * Get total unique visitors for a landing page
     */
    @Query("SELECT COALESCE(SUM(v.uniqueVisitors), 0) FROM LandingPageView v WHERE v.landingPage.id = :landingPageId")
    Long getTotalUniqueVisitorsByLandingPageId(@Param("landingPageId") Long landingPageId);

    /**
     * Get views for a landing page within a date range
     */
    @Query("SELECT v FROM LandingPageView v WHERE v.landingPage.id = :landingPageId AND v.viewDate BETWEEN :startDate AND :endDate ORDER BY v.viewDate ASC")
    List<LandingPageView> findByLandingPageIdAndDateRange(
            @Param("landingPageId") Long landingPageId,
            @Param("startDate") LocalDate startDate,
            @Param("endDate") LocalDate endDate
    );

    /**
     * Delete all views for a landing page
     */
    @Modifying
    void deleteByLandingPageId(Long landingPageId);
}

