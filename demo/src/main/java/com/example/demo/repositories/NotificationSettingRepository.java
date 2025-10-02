package com.example.demo.repositories;

import com.example.demo.model.NotificationSetting;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface NotificationSettingRepository extends JpaRepository<NotificationSetting, Long> {
    
    /**
     * Find the first (and should be only) notification setting.
     * Since we expect only one global notification setting, we'll use this method.
     */
    Optional<NotificationSetting> findFirstByOrderByIdAsc();
    
    /**
     * Check if any notification settings exist
     */
    boolean existsByIdIsNotNull();
}
