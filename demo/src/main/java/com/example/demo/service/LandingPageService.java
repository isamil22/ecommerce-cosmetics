package com.example.demo.service;

import com.example.demo.dto.*;
import com.example.demo.exception.ResourceNotFoundException;
import com.example.demo.mapper.LandingPageMapper;
import com.example.demo.mapper.LandingPageSectionMapper;
import com.example.demo.mapper.LandingPageSettingsMapper;
import com.example.demo.model.*;
import com.example.demo.repositories.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

/**
 * Service for managing landing pages
 */
@Service
public class LandingPageService {

    @Autowired
    private LandingPageRepository landingPageRepository;

    @Autowired
    private LandingPageSectionRepository sectionRepository;

    @Autowired
    private LandingPageSettingsRepository settingsRepository;

    @Autowired
    private LandingPageViewRepository viewRepository;

    @Autowired
    private ProductRepository productRepository;

    @Autowired
    private CategoryRepository categoryRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private LandingPageMapper landingPageMapper;

    @Autowired
    private LandingPageSectionMapper sectionMapper;

    @Autowired
    private LandingPageSettingsMapper settingsMapper;

    /**
     * Create a new landing page
     */
    @Transactional
    public LandingPageResponseDTO createLandingPage(LandingPageRequestDTO requestDTO, Long userId) {
        // Validate slug uniqueness
        if (landingPageRepository.existsBySlug(requestDTO.getSlug())) {
            throw new IllegalArgumentException("Landing page with slug '" + requestDTO.getSlug() + "' already exists");
        }

        // Create landing page entity
        LandingPage landingPage = landingPageMapper.toEntity(requestDTO);

        // Set creator
        User creator = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with ID: " + userId));
        landingPage.setCreatedBy(creator);

        // Set product if provided, otherwise auto-generate
        if (requestDTO.getProductId() != null) {
            Product product = productRepository.findById(requestDTO.getProductId())
                    .orElseThrow(() -> new ResourceNotFoundException(
                            "Product not found with ID: " + requestDTO.getProductId()));
            landingPage.setProduct(product);
        } else {
            // Auto-generate a dummy product
            Product placeholderProduct = createPlaceholderProduct(landingPage.getTitle());
            landingPage.setProduct(placeholderProduct);
        }

        // Set default status if not provided
        if (landingPage.getStatus() == null) {
            landingPage.setStatus(LandingPage.LandingPageStatus.DRAFT);
        }

        // Save landing page
        landingPage = landingPageRepository.save(landingPage);

        // Create and save sections if provided
        if (requestDTO.getSections() != null && !requestDTO.getSections().isEmpty()) {
            List<LandingPageSection> sections = new ArrayList<>();
            for (LandingPageSectionDTO sectionDTO : requestDTO.getSections()) {
                LandingPageSection section = sectionMapper.toEntity(sectionDTO);
                section.setLandingPage(landingPage);
                sections.add(section);
            }
            sectionRepository.saveAll(sections);
            landingPage.setSections(sections);
        }

        // Create and save settings if provided
        if (requestDTO.getSettings() != null) {
            LandingPageSettings settings = settingsMapper.toEntity(requestDTO.getSettings());
            settings.setLandingPage(landingPage);
            settingsRepository.save(settings);
            landingPage.setSettings(settings);
        } else {
            // Create default settings
            LandingPageSettings defaultSettings = LandingPageSettings.builder()
                    .landingPage(landingPage)
                    .themeColor("#ff69b4")
                    .fontFamily("Arial, sans-serif")
                    .build();
            settingsRepository.save(defaultSettings);
            landingPage.setSettings(defaultSettings);
        }

        return landingPageMapper.toResponseDTO(landingPage);
    }

    private Product createPlaceholderProduct(String landingPageTitle) {
        Product product = new Product();
        product.setName(landingPageTitle + " - Offer");
        product.setDescription("Auto-generated product for landing page: " + landingPageTitle);
        product.setPrice(new java.math.BigDecimal("0.01")); // Minimal positive price
        product.setQuantity(100);

        // Find a default category
        Category category = categoryRepository.findAll().stream().findFirst()
                .orElseThrow(() -> new IllegalStateException("No categories found to create placeholder product"));
        product.setCategory(category);

        product.setType(Product.ProductType.BOTH);
        product.setHasVariants(false);
        product.setPackable(false);
        product.setShowPurchaseNotifications(true);
        product.setShowCountdownTimer(true);

        return productRepository.save(product);
    }

    /**
     * Update existing landing page
     */
    @Transactional
    public LandingPageResponseDTO updateLandingPage(Long id, LandingPageRequestDTO requestDTO) {
        LandingPage landingPage = landingPageRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Landing page not found with ID: " + id));

        // Validate slug uniqueness (excluding current landing page)
        if (!landingPage.getSlug().equals(requestDTO.getSlug()) &&
                landingPageRepository.existsBySlug(requestDTO.getSlug())) {
            throw new IllegalArgumentException("Landing page with slug '" + requestDTO.getSlug() + "' already exists");
        }

        // Update basic fields
        landingPageMapper.updateLandingPageFromDto(requestDTO, landingPage);

        // Update product if provided
        if (requestDTO.getProductId() != null) {
            Product product = productRepository.findById(requestDTO.getProductId())
                    .orElseThrow(() -> new ResourceNotFoundException(
                            "Product not found with ID: " + requestDTO.getProductId()));
            landingPage.setProduct(product);
        }
        // If ProductId is null in request, we DO NOT remove the existing product,
        // unlike the previous logic which set it to null.
        // This preserves the auto-generated product if the user edits the page but
        // doesn't touch the product field.
        // If they EXPLICITLY want to disconnect, they might need a specific flag, but
        // for now this is safer.
        else if (landingPage.getProduct() == null) {
            // If existing product is null AND none provided in update, generate one now?
            // Yes, consistent with "ensure it has an ID".
            Product placeholderProduct = createPlaceholderProduct(landingPage.getTitle());
            landingPage.setProduct(placeholderProduct);
        }

        // Update sections - must clear and add to existing collection to preserve
        // Hibernate's orphanRemoval tracking
        if (requestDTO.getSections() != null) {
            // Clear existing sections (Hibernate will delete them due to
            // orphanRemoval=true)
            landingPage.getSections().clear();

            // Add new sections to the existing collection
            for (LandingPageSectionDTO sectionDTO : requestDTO.getSections()) {
                LandingPageSection section = sectionMapper.toEntity(sectionDTO);
                section.setLandingPage(landingPage);
                landingPage.getSections().add(section);
            }
        }

        // Update settings
        if (requestDTO.getSettings() != null) {
            LandingPageSettings settings = settingsRepository.findByLandingPageId(id)
                    .orElse(LandingPageSettings.builder()
                            .landingPage(landingPage)
                            .build());
            settingsMapper.updateSettingsFromDto(requestDTO.getSettings(), settings);
            settingsRepository.save(settings);
            landingPage.setSettings(settings);
        }

        landingPage = landingPageRepository.save(landingPage);
        return landingPageMapper.toResponseDTO(landingPage);
    }

    /**
     * Get landing page by ID (admin view)
     */
    @Transactional(readOnly = true)
    public LandingPageResponseDTO getLandingPageById(Long id) {
        LandingPage landingPage = landingPageRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Landing page not found with ID: " + id));
        return landingPageMapper.toResponseDTO(landingPage);
    }

    /**
     * Get published landing page by slug (public view)
     */
    @Transactional
    public LandingPageResponseDTO getPublishedLandingPageBySlug(String slug) {
        LandingPage landingPage = landingPageRepository.findPublishedBySlug(slug)
                .orElseThrow(
                        () -> new ResourceNotFoundException("Published landing page not found with slug: " + slug));

        // Track view
        trackView(landingPage.getId());

        return landingPageMapper.toResponseDTO(landingPage);
    }

    /**
     * Get all landing pages with pagination
     */
    @Transactional(readOnly = true)
    public Page<LandingPageDTO> getAllLandingPages(Pageable pageable) {
        Page<LandingPage> landingPages = landingPageRepository.findAll(pageable);

        // Convert to DTO and add view counts
        List<LandingPageDTO> dtos = landingPages.getContent().stream()
                .map(lp -> {
                    LandingPageDTO dto = landingPageMapper.toDTO(lp);
                    dto.setTotalViews(getTotalViews(lp.getId()).intValue());
                    return dto;
                })
                .collect(Collectors.toList());

        return new PageImpl<>(dtos, pageable, landingPages.getTotalElements());
    }

    /**
     * Get landing pages by status
     */
    @Transactional(readOnly = true)
    public Page<LandingPageDTO> getLandingPagesByStatus(LandingPage.LandingPageStatus status, Pageable pageable) {
        Page<LandingPage> landingPages = landingPageRepository.findByStatus(status, pageable);

        List<LandingPageDTO> dtos = landingPages.getContent().stream()
                .map(lp -> {
                    LandingPageDTO dto = landingPageMapper.toDTO(lp);
                    dto.setTotalViews(getTotalViews(lp.getId()).intValue());
                    return dto;
                })
                .collect(Collectors.toList());

        return new PageImpl<>(dtos, pageable, landingPages.getTotalElements());
    }

    /**
     * Search landing pages by title
     */
    @Transactional(readOnly = true)
    public Page<LandingPageDTO> searchLandingPages(String searchTerm, Pageable pageable) {
        Page<LandingPage> landingPages = landingPageRepository.searchByTitle(searchTerm, pageable);

        List<LandingPageDTO> dtos = landingPages.getContent().stream()
                .map(lp -> {
                    LandingPageDTO dto = landingPageMapper.toDTO(lp);
                    dto.setTotalViews(getTotalViews(lp.getId()).intValue());
                    return dto;
                })
                .collect(Collectors.toList());

        return new PageImpl<>(dtos, pageable, landingPages.getTotalElements());
    }

    /**
     * Publish landing page
     */
    @Transactional
    public LandingPageDTO publishLandingPage(Long id) {
        LandingPage landingPage = landingPageRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Landing page not found with ID: " + id));

        landingPage.setStatus(LandingPage.LandingPageStatus.PUBLISHED);
        landingPage.setPublishedAt(LocalDateTime.now());

        landingPage = landingPageRepository.save(landingPage);
        return landingPageMapper.toDTO(landingPage);
    }

    /**
     * Unpublish landing page (set to draft)
     */
    @Transactional
    public LandingPageDTO unpublishLandingPage(Long id) {
        LandingPage landingPage = landingPageRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Landing page not found with ID: " + id));

        landingPage.setStatus(LandingPage.LandingPageStatus.DRAFT);

        landingPage = landingPageRepository.save(landingPage);
        return landingPageMapper.toDTO(landingPage);
    }

    /**
     * Archive landing page
     */
    @Transactional
    public LandingPageDTO archiveLandingPage(Long id) {
        LandingPage landingPage = landingPageRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Landing page not found with ID: " + id));

        landingPage.setStatus(LandingPage.LandingPageStatus.ARCHIVED);

        landingPage = landingPageRepository.save(landingPage);
        return landingPageMapper.toDTO(landingPage);
    }

    /**
     * Delete landing page
     */
    @Transactional
    public void deleteLandingPage(Long id) {
        if (!landingPageRepository.existsById(id)) {
            throw new ResourceNotFoundException("Landing page not found with ID: " + id);
        }

        // Cascade delete will handle sections, settings, and views
        landingPageRepository.deleteById(id);
    }

    /**
     * Track a view for a landing page
     */
    @Transactional
    public void trackView(Long landingPageId) {
        LocalDate today = LocalDate.now();

        LandingPage landingPage = landingPageRepository.findById(landingPageId)
                .orElseThrow(() -> new ResourceNotFoundException("Landing page not found with ID: " + landingPageId));

        LandingPageView view = viewRepository.findByLandingPageIdAndViewDate(landingPageId, today)
                .orElse(LandingPageView.builder()
                        .landingPage(landingPage)
                        .viewDate(today)
                        .viewCount(0)
                        .uniqueVisitors(0)
                        .build());

        view.setViewCount(view.getViewCount() + 1);
        // Note: In production, you'd want to track unique visitors via session/cookie
        view.setUniqueVisitors(view.getUniqueVisitors() + 1);

        viewRepository.save(view);
    }

    /**
     * Get total views for a landing page
     */
    @Transactional(readOnly = true)
    public Long getTotalViews(Long landingPageId) {
        return viewRepository.getTotalViewsByLandingPageId(landingPageId);
    }

    /**
     * Get analytics for a landing page
     */
    @Transactional(readOnly = true)
    public List<LandingPageView> getAnalytics(Long landingPageId, LocalDate startDate, LocalDate endDate) {
        return viewRepository.findByLandingPageIdAndDateRange(landingPageId, startDate, endDate);
    }

    /**
     * Duplicate a landing page
     */
    @Transactional
    public LandingPageResponseDTO duplicateLandingPage(Long id, String newSlug, Long userId) {
        // Validate new slug
        if (landingPageRepository.existsBySlug(newSlug)) {
            throw new IllegalArgumentException("Landing page with slug '" + newSlug + "' already exists");
        }

        // Get original landing page
        LandingPage original = landingPageRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Landing page not found with ID: " + id));

        // Create duplicate
        LandingPage duplicate = LandingPage.builder()
                .product(original.getProduct())
                .title(original.getTitle() + " (Copy)")
                .slug(newSlug)
                .metaTitle(original.getMetaTitle())
                .metaDescription(original.getMetaDescription())
                .status(LandingPage.LandingPageStatus.DRAFT)
                .createdBy(userRepository.findById(userId)
                        .orElseThrow(() -> new ResourceNotFoundException("User not found with ID: " + userId)))
                .build();

        LandingPage savedDuplicate = landingPageRepository.save(duplicate);

        // Duplicate sections
        List<LandingPageSection> originalSections = sectionRepository.findByLandingPageIdOrderBySectionOrderAsc(id);
        List<LandingPageSection> duplicateSections = new ArrayList<>();
        for (LandingPageSection originalSection : originalSections) {
            LandingPageSection section = LandingPageSection.builder()
                    .landingPage(savedDuplicate)
                    .sectionType(originalSection.getSectionType())
                    .sectionOrder(originalSection.getSectionOrder())
                    .sectionData(originalSection.getSectionData())
                    .isVisible(originalSection.getIsVisible())
                    .build();
            duplicateSections.add(section);
        }
        sectionRepository.saveAll(duplicateSections);

        // Duplicate settings
        final LandingPage finalDuplicate = savedDuplicate;
        settingsRepository.findByLandingPageId(id).ifPresent(originalSettings -> {
            LandingPageSettings settings = LandingPageSettings.builder()
                    .landingPage(finalDuplicate)
                    .themeColor(originalSettings.getThemeColor())
                    .fontFamily(originalSettings.getFontFamily())
                    .customCss(originalSettings.getCustomCss())
                    .customJs(originalSettings.getCustomJs())
                    .faviconUrl(originalSettings.getFaviconUrl())
                    .build();
            settingsRepository.save(settings);
        });

        return getLandingPageById(savedDuplicate.getId());
    }
}
