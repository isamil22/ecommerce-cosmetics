package com.example.demo.controller;

import com.example.demo.dto.LandingPageDTO;
import com.example.demo.dto.LandingPageRequestDTO;
import com.example.demo.dto.LandingPageResponseDTO;
import com.example.demo.model.LandingPage;
import com.example.demo.model.LandingPageView;
import com.example.demo.model.User;
import com.example.demo.service.LandingPageService;
import com.example.demo.service.UserService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

/**
 * REST Controller for Landing Page management
 * Provides APIs for creating, updating, viewing, and managing landing pages
 */
@RestController
@RequestMapping("/api/landing-pages")
@CrossOrigin(origins = "*")
public class LandingPageController {

    @Autowired
    private LandingPageService landingPageService;

    @Autowired
    private UserService userService;

    /**
     * Create a new landing page (Admin only)
     */
    @PostMapping
    @PreAuthorize("hasAuthority('LANDING_PAGE:CREATE') or hasRole('ADMIN') or hasRole('MANAGER')")
    public ResponseEntity<LandingPageResponseDTO> createLandingPage(@Valid @RequestBody LandingPageRequestDTO request) {
        User currentUser = getCurrentUser();
        LandingPageResponseDTO response = landingPageService.createLandingPage(request, currentUser.getId());
        return new ResponseEntity<>(response, HttpStatus.CREATED);
    }

    /**
     * Update an existing landing page (Admin only)
     */
    @PutMapping("/{id}")
    @PreAuthorize("hasAuthority('LANDING_PAGE:UPDATE') or hasRole('ADMIN') or hasRole('MANAGER')")
    public ResponseEntity<LandingPageResponseDTO> updateLandingPage(
            @PathVariable Long id,
            @Valid @RequestBody LandingPageRequestDTO request) {
        LandingPageResponseDTO response = landingPageService.updateLandingPage(id, request);
        return ResponseEntity.ok(response);
    }

    /**
     * Get landing page by ID (Admin only)
     */
    @GetMapping("/{id}")
    @PreAuthorize("hasAuthority('LANDING_PAGE:VIEW') or hasRole('ADMIN') or hasRole('MANAGER')")
    public ResponseEntity<LandingPageResponseDTO> getLandingPageById(@PathVariable Long id) {
        LandingPageResponseDTO response = landingPageService.getLandingPageById(id);
        return ResponseEntity.ok(response);
    }

    /**
     * Get published landing page by slug (Public access)
     * This is the endpoint used by customers to view landing pages
     */
    @GetMapping("/public/{slug}")
    public ResponseEntity<LandingPageResponseDTO> getPublishedLandingPage(@PathVariable String slug) {
        LandingPageResponseDTO response = landingPageService.getPublishedLandingPageBySlug(slug);
        return ResponseEntity.ok(response);
    }

    /**
     * Get all landing pages with pagination (Admin only)
     */
    @GetMapping
    @PreAuthorize("hasAuthority('LANDING_PAGE:VIEW') or hasRole('ADMIN') or hasRole('MANAGER')")
    public ResponseEntity<Page<LandingPageDTO>> getAllLandingPages(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(defaultValue = "createdAt") String sortBy,
            @RequestParam(defaultValue = "DESC") String sortDirection) {

        Sort.Direction direction = sortDirection.equalsIgnoreCase("ASC") ? Sort.Direction.ASC : Sort.Direction.DESC;
        Pageable pageable = PageRequest.of(page, size, Sort.by(direction, sortBy));
        
        Page<LandingPageDTO> landingPages = landingPageService.getAllLandingPages(pageable);
        return ResponseEntity.ok(landingPages);
    }

    /**
     * Get landing pages by status (Admin only)
     */
    @GetMapping("/status/{status}")
    @PreAuthorize("hasAuthority('LANDING_PAGE:VIEW') or hasRole('ADMIN') or hasRole('MANAGER')")
    public ResponseEntity<Page<LandingPageDTO>> getLandingPagesByStatus(
            @PathVariable LandingPage.LandingPageStatus status,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        
        Pageable pageable = PageRequest.of(page, size, Sort.by(Sort.Direction.DESC, "createdAt"));
        Page<LandingPageDTO> landingPages = landingPageService.getLandingPagesByStatus(status, pageable);
        return ResponseEntity.ok(landingPages);
    }

    /**
     * Search landing pages by title (Admin only)
     */
    @GetMapping("/search")
    @PreAuthorize("hasAuthority('LANDING_PAGE:VIEW') or hasRole('ADMIN') or hasRole('MANAGER')")
    public ResponseEntity<Page<LandingPageDTO>> searchLandingPages(
            @RequestParam String query,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        
        Pageable pageable = PageRequest.of(page, size, Sort.by(Sort.Direction.DESC, "createdAt"));
        Page<LandingPageDTO> landingPages = landingPageService.searchLandingPages(query, pageable);
        return ResponseEntity.ok(landingPages);
    }

    /**
     * Publish a landing page (Admin only)
     */
    @PatchMapping("/{id}/publish")
    @PreAuthorize("hasAuthority('LANDING_PAGE:PUBLISH') or hasRole('ADMIN') or hasRole('MANAGER')")
    public ResponseEntity<LandingPageDTO> publishLandingPage(@PathVariable Long id) {
        LandingPageDTO response = landingPageService.publishLandingPage(id);
        return ResponseEntity.ok(response);
    }

    /**
     * Unpublish a landing page (set to draft) (Admin only)
     */
    @PatchMapping("/{id}/unpublish")
    @PreAuthorize("hasAuthority('LANDING_PAGE:PUBLISH') or hasRole('ADMIN') or hasRole('MANAGER')")
    public ResponseEntity<LandingPageDTO> unpublishLandingPage(@PathVariable Long id) {
        LandingPageDTO response = landingPageService.unpublishLandingPage(id);
        return ResponseEntity.ok(response);
    }

    /**
     * Archive a landing page (Admin only)
     */
    @PatchMapping("/{id}/archive")
    @PreAuthorize("hasAuthority('LANDING_PAGE:DELETE') or hasRole('ADMIN') or hasRole('MANAGER')")
    public ResponseEntity<LandingPageDTO> archiveLandingPage(@PathVariable Long id) {
        LandingPageDTO response = landingPageService.archiveLandingPage(id);
        return ResponseEntity.ok(response);
    }

    /**
     * Delete a landing page (Admin only)
     */
    @DeleteMapping("/{id}")
    @PreAuthorize("hasAuthority('LANDING_PAGE:DELETE') or hasRole('ADMIN') or hasRole('MANAGER')")
    public ResponseEntity<Map<String, String>> deleteLandingPage(@PathVariable Long id) {
        landingPageService.deleteLandingPage(id);
        Map<String, String> response = new HashMap<>();
        response.put("message", "Landing page deleted successfully");
        return ResponseEntity.ok(response);
    }

    /**
     * Duplicate a landing page (Admin only)
     */
    @PostMapping("/{id}/duplicate")
    @PreAuthorize("hasAuthority('LANDING_PAGE:CREATE') or hasRole('ADMIN') or hasRole('MANAGER')")
    public ResponseEntity<LandingPageResponseDTO> duplicateLandingPage(
            @PathVariable Long id,
            @RequestParam String newSlug) {
        User currentUser = getCurrentUser();
        LandingPageResponseDTO response = landingPageService.duplicateLandingPage(id, newSlug, currentUser.getId());
        return new ResponseEntity<>(response, HttpStatus.CREATED);
    }

    /**
     * Get analytics for a landing page (Admin only)
     */
    @GetMapping("/{id}/analytics")
    @PreAuthorize("hasAuthority('LANDING_PAGE:VIEW') or hasRole('ADMIN') or hasRole('MANAGER')")
    public ResponseEntity<Map<String, Object>> getLandingPageAnalytics(
            @PathVariable Long id,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate startDate,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate endDate) {
        
        // Default to last 30 days if not provided
        if (startDate == null) {
            startDate = LocalDate.now().minusDays(30);
        }
        if (endDate == null) {
            endDate = LocalDate.now();
        }

        Long totalViews = landingPageService.getTotalViews(id);
        List<LandingPageView> viewData = landingPageService.getAnalytics(id, startDate, endDate);

        Map<String, Object> analytics = new HashMap<>();
        analytics.put("totalViews", totalViews);
        analytics.put("viewData", viewData);
        analytics.put("startDate", startDate);
        analytics.put("endDate", endDate);

        return ResponseEntity.ok(analytics);
    }

    /**
     * Get summary statistics for all landing pages (Admin only)
     */
    @GetMapping("/stats/summary")
    @PreAuthorize("hasAuthority('LANDING_PAGE:VIEW') or hasRole('ADMIN') or hasRole('MANAGER')")
    public ResponseEntity<Map<String, Object>> getSummaryStats() {
        Map<String, Object> stats = new HashMap<>();
        
        // You can enhance this with more statistics
        Page<LandingPageDTO> allPages = landingPageService.getAllLandingPages(PageRequest.of(0, Integer.MAX_VALUE));
        
        long totalPages = allPages.getTotalElements();
        long publishedPages = allPages.getContent().stream()
                .filter(lp -> lp.getStatus() == LandingPage.LandingPageStatus.PUBLISHED)
                .count();
        long draftPages = allPages.getContent().stream()
                .filter(lp -> lp.getStatus() == LandingPage.LandingPageStatus.DRAFT)
                .count();

        stats.put("totalPages", totalPages);
        stats.put("publishedPages", publishedPages);
        stats.put("draftPages", draftPages);

        return ResponseEntity.ok(stats);
    }

    /**
     * Helper method to get current authenticated user
     */
    private User getCurrentUser() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String email = authentication.getName();
        return userService.getUserByEmail(email);
    }
}

