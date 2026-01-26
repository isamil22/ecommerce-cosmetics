// isamil22/ecommerce-basic/ecommerce-basic-de52fb3f9923420c0ceb538f0eea6ad24aa94a25/demo/src/main/java/com/example/demo/service/CouponService.java
package com.example.demo.service;

import com.example.demo.dto.CouponDTO;
import com.example.demo.exception.ResourceNotFoundException;
import com.example.demo.mapper.CouponMapper;
import com.example.demo.model.Coupon;
import com.example.demo.model.Order; // Import Order class
import com.example.demo.repositories.CouponRepository;
import com.example.demo.repositories.OrderRepository; // Import OrderRepository
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class CouponService {

    private final CouponRepository couponRepository;
    private final CouponMapper couponMapper;
    private final OrderRepository orderRepository; // Inject OrderRepository

    @Transactional
    public CouponDTO createCoupon(CouponDTO couponDTO) {
        Coupon coupon = couponMapper.toEntity(couponDTO);
        if (coupon.getTimesUsed() == null) {
            coupon.setTimesUsed(0);
        }
        if (coupon.getType() == null) {
            coupon.setType(Coupon.CouponType.USER);
        }

        // Ensure expiry date in DB captures the end of the day if time is 00:00
        if (coupon.getExpiryDate() != null &&
                coupon.getExpiryDate().getHour() == 0 &&
                coupon.getExpiryDate().getMinute() == 0) {
            coupon.setExpiryDate(coupon.getExpiryDate().withHour(23).withMinute(59).withSecond(59));
        }

        Coupon savedCoupon = couponRepository.save(coupon);
        return couponMapper.toDTO(savedCoupon);
    }

    @Transactional
    public CouponDTO updateCoupon(Long id, CouponDTO couponDTO) {
        Coupon existingCoupon = couponRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Coupon not found with id: " + id));

        // Update fields
        existingCoupon.setCode(couponDTO.getCode());
        existingCoupon.setName(couponDTO.getName());
        existingCoupon.setDiscountType(couponDTO.getDiscountType());
        existingCoupon.setDiscountValue(couponDTO.getDiscountValue());
        existingCoupon.setUsageLimit(couponDTO.getUsageLimit());
        existingCoupon.setExpiryDate(couponDTO.getExpiryDate());
        existingCoupon.setMinPurchaseAmount(couponDTO.getMinPurchaseAmount());
        existingCoupon.setFirstTimeOnly(couponDTO.isFirstTimeOnly());

        // Ensure expiry is set to end of day if it looks like a date-only input
        if (existingCoupon.getExpiryDate() != null &&
                existingCoupon.getExpiryDate().getHour() == 0 &&
                existingCoupon.getExpiryDate().getMinute() == 0) {
            existingCoupon.setExpiryDate(existingCoupon.getExpiryDate().withHour(23).withMinute(59).withSecond(59));
        }

        // Handle Applicable Products/Categories if your DTO/Mapper logic requires it
        // The mapper.toEntity might handle this, or we manual set relationships if DTO
        // passes IDs
        // For simplicity, assuming validation is the main concern here, but detailed
        // mapping might be needed
        // depending on how CouponMapper works. If mapstruct, it usually handles it.

        Coupon savedCoupon = couponRepository.save(existingCoupon);
        return couponMapper.toDTO(savedCoupon);
    }

    public CouponDTO validateCoupon(String code) {
        Coupon coupon = couponRepository.findByCode(code)
                .orElseThrow(() -> new ResourceNotFoundException("Coupon with code " + code + " not found"));

        if (coupon.getExpiryDate().isBefore(LocalDateTime.now())) {
            throw new IllegalStateException("Coupon has expired");
        }

        if (coupon.getUsageLimit() != null && coupon.getUsageLimit() > 0 &&
                coupon.getTimesUsed() != null && coupon.getTimesUsed() >= coupon.getUsageLimit()) {
            throw new IllegalStateException("Coupon has reached its usage limit");
        }

        return couponMapper.toDTO(coupon);
    }

    @Transactional(readOnly = true)
    public List<CouponDTO> getAllCoupons() {
        return couponRepository.findAll().stream()
                .map(couponMapper::toDTO)
                .collect(Collectors.toList());
    }

    @Transactional
    public void deleteCoupon(Long id) {
        Coupon coupon = couponRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Coupon not found with id: " + id));

        // Start: Safeguard Check
        // If coupon has associated orders, we cannot simply delete it because of FK
        // constraints.
        // We should explicitly dissociate it or check if we want to block deletion.
        List<Order> associatedOrders = orderRepository.findByCoupon(coupon);
        if (!associatedOrders.isEmpty()) {
            // Choice A: Dissociate (Unlink coupon from past orders - historical data might
            // change visually)
            // Choice B: Block (Throw error saying 'Cannot delete coupon used in orders')
            // Logic in existing code tried to dissociate:
            for (Order order : associatedOrders) {
                order.setCoupon(null);
                // We purposely do NOT recalc the order price to preserve history, just remove
                // the link
                orderRepository.save(order);
            }
        }
        // End: Safeguard Check

        couponRepository.deleteById(id);
    }

    public List<Map<String, Object>> getCouponUsageStatistics() {
        System.out.println("🔍 CouponService: Fetching general coupon usage statistics...");
        List<Map<String, Object>> result = orderRepository.countByCouponUsageByDay();
        System.out.println("✅ CouponService: General statistics result: " + result);
        return result;
    }

    // --- NEW METHOD START ---
    public List<Map<String, Object>> getCouponUsageStatisticsById(Long couponId) {
        System.out.println("🔍 CouponService: Fetching usage statistics for coupon ID: " + couponId);

        // Validate coupon exists first
        if (couponId == null) {
            System.out.println("❌ CouponService: Coupon ID is null");
            return List.of();
        }

        // Check if coupon exists
        boolean couponExists = couponRepository.existsById(couponId);
        System.out.println("🔍 CouponService: Coupon exists: " + couponExists);

        if (!couponExists) {
            System.out.println("❌ CouponService: Coupon with ID " + couponId + " not found");
            return List.of();
        }

        List<Map<String, Object>> result = orderRepository.countByCouponUsageByDayForCoupon(couponId);
        System.out.println("✅ CouponService: Usage statistics for coupon " + couponId + ": " + result);

        // Log the structure of the returned data
        if (result != null && !result.isEmpty()) {
            System.out.println("📊 CouponService: Sample data structure: " + result.get(0));
            System.out.println("📊 CouponService: Total records returned: " + result.size());
        } else {
            System.out.println("📊 CouponService: No usage data found for coupon " + couponId);
        }

        return result;
    }
    // --- NEW METHOD END ---

    @Transactional(readOnly = true)
    public List<CouponDTO> getActiveCouponsForUser(Long userId) {
        return couponRepository.findActiveCouponsForUser(userId).stream()
                .map(couponMapper::toDTO)
                .collect(Collectors.toList());
    }
}