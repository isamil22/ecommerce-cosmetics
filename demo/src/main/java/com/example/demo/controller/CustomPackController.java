package com.example.demo.controller;

import com.example.demo.dto.CustomPackDTO;
import com.example.demo.dto.ProductDTO;
import com.example.demo.mapper.ProductMapper;
import com.example.demo.service.CustomPackService;
import com.example.demo.service.ProductService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/custom-packs")
@RequiredArgsConstructor
public class CustomPackController {

    private final CustomPackService customPackService;
    private final ProductMapper productMapper;
    private final ProductService productService;

    @PostMapping
    @PreAuthorize("hasAuthority('CUSTOM_PACK:CREATE') or hasAuthority('CUSTOM_PACK:EDIT') or hasAuthority('ROLE_ADMIN') or hasAuthority('ROLE_MANAGER')")
    public ResponseEntity<CustomPackDTO> createCustomPack(@RequestBody CustomPackDTO customPackDTO) {
        return ResponseEntity.ok(customPackService.createCustomPack(customPackDTO));
    }

    @GetMapping
    public ResponseEntity<List<CustomPackDTO>> getAllCustomPacks() {
        return ResponseEntity.ok(customPackService.getAllCustomPacks());
    }

    @GetMapping("/{id}")
    public ResponseEntity<CustomPackDTO> getCustomPackById(@PathVariable Long id) {
        return ResponseEntity.ok(customPackService.getCustomPackById(id));
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasAuthority('CUSTOM_PACK:EDIT') or hasAuthority('CUSTOM_PACK:UPDATE') or hasAuthority('ROLE_ADMIN') or hasAuthority('ROLE_MANAGER') or hasAuthority('ROLE_EDITOR')")
    public ResponseEntity<CustomPackDTO> updateCustomPack(@PathVariable Long id,
            @RequestBody CustomPackDTO customPackDTO) {
        return ResponseEntity.ok(customPackService.updateCustomPack(id, customPackDTO));
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasAuthority('CUSTOM_PACK:DELETE') or hasAuthority('CUSTOM_PACK:EDIT') or hasAuthority('ROLE_ADMIN') or hasAuthority('ROLE_MANAGER')")
    public ResponseEntity<Void> deleteCustomPack(@PathVariable Long id) {
        customPackService.deleteCustomPack(id);
        return ResponseEntity.noContent().build();
    }

    // New endpoint to get allowed products for a custom pack
    @GetMapping("/{id}/allowed-products")
    public ResponseEntity<List<ProductDTO>> getAllowedProducts(@PathVariable Long id) {
        return ResponseEntity.ok(
                customPackService.getAllowedProductsForPack(id).stream()
                        .map(productMapper::toDTO)
                        .collect(Collectors.toList()));
    }

    // Image upload endpoint for custom packs
    @PostMapping("/upload-image")
    @PreAuthorize("hasAuthority('CUSTOM_PACK:CREATE') or hasAuthority('CUSTOM_PACK:EDIT') or hasAuthority('ROLE_ADMIN') or hasAuthority('ROLE_MANAGER')")
    public ResponseEntity<?> uploadCustomPackImage(@RequestParam("image") MultipartFile image) {
        try {
            String imageUrl = productService.uploadAndGetImageUrl(image);
            return ResponseEntity.ok(Map.of("url", imageUrl));
        } catch (IOException e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Failed to upload image");
        }
    }
}