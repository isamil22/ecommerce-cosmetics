package com.example.demo.service;

import com.example.demo.dto.CustomPackDTO;
import com.example.demo.exception.ResourceNotFoundException;
import com.example.demo.mapper.CustomPackMapper;
import com.example.demo.model.CustomPack;
import com.example.demo.model.Product;
import com.example.demo.repositories.CustomPackRepository;
import com.example.demo.repositories.ProductRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class CustomPackService {

    private final CustomPackRepository customPackRepository;
    private final ProductRepository productRepository;
    private final CustomPackMapper customPackMapper;
    private final LocalFileService localFileService;

    @Transactional
    public CustomPackDTO createCustomPack(CustomPackDTO customPackDTO) {
        CustomPack customPack = customPackMapper.toEntity(customPackDTO);

        // Handle allowed products if provided
        if (customPackDTO.getAllowedProductIds() != null && !customPackDTO.getAllowedProductIds().isEmpty()) {
            List<Product> allowedProducts = productRepository.findAllById(customPackDTO.getAllowedProductIds());
            customPack.setAllowedProducts(allowedProducts);
        }

        CustomPack savedCustomPack = customPackRepository.save(customPack);
        return customPackMapper.toDTO(savedCustomPack);
    }

    public List<CustomPackDTO> getAllCustomPacks() {
        return customPackRepository.findAll().stream()
                .map(customPackMapper::toDTO)
                .collect(Collectors.toList());
    }

    public CustomPackDTO getCustomPackById(Long id) {
        CustomPack customPack = customPackRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("CustomPack not found with id: " + id));
        return customPackMapper.toDTO(customPack);
    }

    @Transactional
    public CustomPackDTO updateCustomPack(Long id, CustomPackDTO customPackDTO) {
        CustomPack existingPack = customPackRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("CustomPack not found with id: " + id));

        // Update fields from DTO
        existingPack.setName(customPackDTO.getName());
        existingPack.setDescription(customPackDTO.getDescription());
        existingPack.setMinItems(customPackDTO.getMinItems());
        existingPack.setMaxItems(customPackDTO.getMaxItems());
        existingPack.setPricingType(customPackDTO.getPricingType());
        existingPack.setFixedPrice(customPackDTO.getFixedPrice());
        existingPack.setDiscountRate(customPackDTO.getDiscountRate());

        // Update allowed products if provided
        if (customPackDTO.getAllowedProductIds() != null) {
            if (customPackDTO.getAllowedProductIds().isEmpty()) {
                existingPack.getAllowedProducts().clear();
            } else {
                List<Product> allowedProducts = productRepository.findAllById(customPackDTO.getAllowedProductIds());
                existingPack.setAllowedProducts(allowedProducts);
            }
        }

        CustomPack updatedPack = customPackRepository.save(existingPack);
        return customPackMapper.toDTO(updatedPack);
    }

    public void deleteCustomPack(Long id) {
        if (!customPackRepository.existsById(id)) {
            throw new ResourceNotFoundException("CustomPack not found with id: " + id);
        }
        customPackRepository.deleteById(id);
    }

    // New method to get allowed products for a custom pack
    public List<Product> getAllowedProductsForPack(Long customPackId) {
        CustomPack customPack = customPackRepository.findById(customPackId)
                .orElseThrow(() -> new ResourceNotFoundException("CustomPack not found with id: " + customPackId));

        // If no specific products are allowed, return all packable products
        if (customPack.getAllowedProducts() == null || customPack.getAllowedProducts().isEmpty()) {
            return productRepository.findByIsPackableTrue();
        }

        return customPack.getAllowedProducts();
    }

    // Upload custom pack image to custom-packs directory
    public String uploadCustomPackImage(org.springframework.web.multipart.MultipartFile image)
            throws java.io.IOException {
        return localFileService.saveImage(image, "custom-packs");
    }
}