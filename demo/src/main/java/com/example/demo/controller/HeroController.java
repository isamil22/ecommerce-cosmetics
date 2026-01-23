package com.example.demo.controller;

import com.example.demo.dto.HeroDTO;
import com.example.demo.exception.ResourceNotFoundException;
import com.example.demo.service.HeroService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.Map;

@RestController
@RequestMapping("/api/hero")
@RequiredArgsConstructor
public class HeroController {

    private final HeroService heroService;

    @GetMapping
    public ResponseEntity<HeroDTO> getHero() {
        return ResponseEntity.ok(heroService.getHero());
    }

    @PutMapping(consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    @PreAuthorize("hasAuthority('HERO:EDIT') or hasAuthority('HERO:UPDATE') or hasAuthority('ROLE_ADMIN') or hasAuthority('ROLE_MANAGER')")
    public ResponseEntity<?> updateHero(@RequestPart("hero") @Valid HeroDTO heroDTO,
                                              @RequestPart(value = "image", required = false) MultipartFile image,
                                              @RequestPart(value = "mobileImage", required = false) MultipartFile mobileImage) {
        try {
            HeroDTO updatedHero = heroService.updateHero(heroDTO, image, mobileImage);
            return ResponseEntity.ok(updatedHero);
        } catch (ResourceNotFoundException e) {
            return ResponseEntity.status(404).body(Map.of("error", "Hero section not found"));
        } catch (IOException e) {
            return ResponseEntity.status(500).body(Map.of("error", "Failed to update hero section: " + e.getMessage()));
        } catch (Exception e) {
            return ResponseEntity.status(500).body(Map.of("error", "An unexpected error occurred: " + e.getMessage()));
        }
    }
}