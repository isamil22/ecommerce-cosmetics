package com.example.demo.repositories;

import com.example.demo.model.LandingPageSettings;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.stereotype.Repository;

import java.util.Optional;

/**
 * Repository for LandingPageSettings entity
 */
@Repository
public interface LandingPageSettingsRepository extends JpaRepository<LandingPageSettings, Long> {

    /**
     * Find settings by landing page ID
     */
    Optional<LandingPageSettings> findByLandingPageId(Long landingPageId);

    /**
     * Delete settings by landing page ID
     */
    @Modifying
    void deleteByLandingPageId(Long landingPageId);
}

