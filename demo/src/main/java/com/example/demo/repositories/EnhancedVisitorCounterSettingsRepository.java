package com.example.demo.repositories;

import com.example.demo.model.EnhancedVisitorCounterSettings;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface EnhancedVisitorCounterSettingsRepository extends JpaRepository<EnhancedVisitorCounterSettings, Long> {
}
