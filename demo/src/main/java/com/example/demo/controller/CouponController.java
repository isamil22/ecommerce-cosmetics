// isamil22/ecommerce-basic/ecommerce-basic-de52fb3f9923420c0ceb538f0eea6ad24aa94a25/demo/src/main/java/com/example/demo/controller/CouponController.java
package com.example.demo.controller;

import com.example.demo.dto.CouponDTO;
import com.example.demo.service.CouponService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/coupons")
@RequiredArgsConstructor
public class CouponController {

    private final CouponService couponService;

    @PostMapping
    @PreAuthorize("hasAuthority('COUPON:CREATE') or hasAuthority('COUPON:EDIT') or hasAuthority('ROLE_ADMIN') or hasAuthority('ROLE_MANAGER')")
    public ResponseEntity<CouponDTO> createCoupon(@RequestBody CouponDTO couponDTO) {
        CouponDTO createdCoupon = couponService.createCoupon(couponDTO);
        return new ResponseEntity<>(createdCoupon, HttpStatus.CREATED);
    }

    @GetMapping("/validate/{code}")
    public ResponseEntity<CouponDTO> validateCoupon(@PathVariable String code) {
        try {
            CouponDTO validatedCoupon = couponService.validateCoupon(code);
            return ResponseEntity.ok(validatedCoupon);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(null); // Or a custom error response
        }
    }

    @GetMapping
    @PreAuthorize("hasAuthority('COUPON:VIEW') or hasAuthority('COUPON:EDIT') or hasAuthority('ROLE_ADMIN') or hasAuthority('ROLE_MANAGER')")
    public ResponseEntity<List<CouponDTO>> getAllCoupons() {
        List<CouponDTO> coupons = couponService.getAllCoupons();
        return ResponseEntity.ok(coupons);
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasAuthority('COUPON:DELETE') or hasAuthority('COUPON:EDIT') or hasAuthority('ROLE_ADMIN') or hasAuthority('ROLE_MANAGER')")
    public ResponseEntity<Void> deleteCoupon(@PathVariable Long id) {
        couponService.deleteCoupon(id);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/usage-statistics")
    @PreAuthorize("hasAuthority('COUPON:VIEW') or hasAuthority('COUPON:ANALYTICS') or hasAuthority('ROLE_ADMIN') or hasAuthority('ROLE_MANAGER')")
    public ResponseEntity<List<Map<String, Object>>> getCouponUsageStatistics() {
        System.out.println("🔍 CouponController: GET /usage-statistics endpoint called");
        try {
            List<Map<String, Object>> result = couponService.getCouponUsageStatistics();
            System.out.println("✅ CouponController: Returning general usage statistics: " + result);
            return ResponseEntity.ok(result);
        } catch (Exception e) {
            System.out.println("❌ CouponController: Error in general usage statistics: " + e.getMessage());
            e.printStackTrace();
            return ResponseEntity.status(500).body(List.of());
        }
    }

    // --- NEW ENDPOINT START ---
    @GetMapping("/{id}/usage-statistics")
    @PreAuthorize("hasAuthority('COUPON:VIEW') or hasAuthority('COUPON:ANALYTICS') or hasAuthority('ROLE_ADMIN') or hasAuthority('ROLE_MANAGER')")
    public ResponseEntity<List<Map<String, Object>>> getCouponUsageStatisticsById(@PathVariable Long id) {
        System.out.println("🔍 CouponController: GET /" + id + "/usage-statistics endpoint called");
        try {
            List<Map<String, Object>> result = couponService.getCouponUsageStatisticsById(id);
            System.out.println("✅ CouponController: Returning usage statistics for coupon " + id + ": " + result);
            return ResponseEntity.ok(result);
        } catch (Exception e) {
            System.out.println("❌ CouponController: Error in usage statistics for coupon " + id + ": " + e.getMessage());
            e.printStackTrace();
            return ResponseEntity.status(500).body(List.of());
        }
    }
    // --- NEW ENDPOINT END ---
}