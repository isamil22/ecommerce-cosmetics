package com.example.demo.service;

import com.example.demo.dto.HeroDTO;
import com.example.demo.exception.ResourceNotFoundException;
import com.example.demo.mapper.HeroMapper;
import com.example.demo.model.Hero;
import com.example.demo.repositories.HeroRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;

@Service
@RequiredArgsConstructor
public class HeroService {
    private final HeroRepository heroRepository;
    private final HeroMapper heroMapper;
    private final LocalFileService localFileService; // Injected LocalFileService

    public HeroDTO getHero() {
        Hero hero = heroRepository.findById(1L).orElseGet(() -> {
            Hero newHero = new Hero();
            newHero.setId(1L);
            newHero.setTitle("Default Title");
            newHero.setSubtitle("Default Subtitle");
            newHero.setLinkText("Shop Now");
            newHero.setLinkUrl("/products");
            newHero.setTitleFont("sans-serif");
            newHero.setImageUrl("https://placehold.co/1200x400/E91E63/FFFFFF?text=Beauty+Cosmetics");
            return heroRepository.save(newHero);
        });
        return heroMapper.toDTO(hero);
    }

    public HeroDTO updateHero(HeroDTO heroDTO, MultipartFile image, MultipartFile mobileImage) throws IOException {
        Hero hero = heroRepository.findById(1L)
                .orElseThrow(() -> new ResourceNotFoundException("Hero section not found"));

        hero.setTitle(heroDTO.getTitle());
        hero.setSubtitle(heroDTO.getSubtitle());
        hero.setLinkText(heroDTO.getLinkText());
        hero.setLinkUrl(heroDTO.getLinkUrl());
        hero.setTitleFont(heroDTO.getTitleFont());

        if (image != null && !image.isEmpty()) {
            try {
                // Delete old image if it exists
                if (hero.getImageUrl() != null && !hero.getImageUrl().isEmpty()) {
                    localFileService.deleteImage(hero.getImageUrl());
                }

                // Save new image
                String imageUrl = localFileService.saveImage(image, "hero");
                hero.setImageUrl(imageUrl);
            } catch (IOException e) {
                System.err.println("File service error for desktop image: " + e.getMessage());
                e.printStackTrace();
            }
        } else if (heroDTO.getImageUrl() == null || heroDTO.getImageUrl().isEmpty()) {
            // Explicit removal: Only delete if there was an image previously
            if (hero.getImageUrl() != null && !hero.getImageUrl().isEmpty()) {
                localFileService.deleteImage(hero.getImageUrl());
                hero.setImageUrl(null);
            }
        }

        if (mobileImage != null && !mobileImage.isEmpty()) {
            try {
                // Delete old mobile image if it exists
                if (hero.getMobileImageUrl() != null && !hero.getMobileImageUrl().isEmpty()) {
                    localFileService.deleteImage(hero.getMobileImageUrl());
                }

                // Save new mobile image
                String mobileImageUrl = localFileService.saveImage(mobileImage, "hero");
                hero.setMobileImageUrl(mobileImageUrl);
            } catch (IOException e) {
                System.err.println("File service error for mobile image: " + e.getMessage());
                e.printStackTrace();
            }
        } else if (heroDTO.getMobileImageUrl() == null || heroDTO.getMobileImageUrl().isEmpty()) {
            // Explicit removal: Only delete if there was an image previously
            if (hero.getMobileImageUrl() != null && !hero.getMobileImageUrl().isEmpty()) {
                localFileService.deleteImage(hero.getMobileImageUrl());
                hero.setMobileImageUrl(null);
            }
        }

        Hero updatedHero = heroRepository.save(hero);
        return heroMapper.toDTO(updatedHero);
    }
}