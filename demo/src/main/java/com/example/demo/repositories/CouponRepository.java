package com.example.demo.repositories;

import com.example.demo.model.Coupon;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface CouponRepository extends JpaRepository<Coupon, Long> {
    Optional<Coupon> findByCode(String code);

    java.util.List<Coupon> findByCodeStartingWith(String prefix);

    @org.springframework.data.jpa.repository.Query("SELECT c FROM Coupon c WHERE c.user.id = :userId AND c.expiryDate > CURRENT_TIMESTAMP AND (c.usageLimit IS NULL OR c.timesUsed < c.usageLimit)")
    java.util.List<Coupon> findActiveCouponsForUser(Long userId);
}