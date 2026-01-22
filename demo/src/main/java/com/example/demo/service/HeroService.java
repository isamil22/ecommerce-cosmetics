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
                String imageUrl = localFileService.saveImage(image, "hero");
                hero.setImageUrl(imageUrl);
            } catch (IOException e) {
                // If file service fails, skip image update but continue with other updates
                System.err.println("File service error, skipping image update: " + e.getMessage());
                // Keep existing image URL if file service fails
            }
        }

        if (mobileImage != null && !mobileImage.isEmpty()) {
            try {
                String mobileImageUrl = localFileService.saveImage(mobileImage, "hero");
                hero.setMobileImageUrl(mobileImageUrl);
            } catch (IOException e) {
                System.err.println("File service error, skipping mobile image update: " + e.getMessage());
            }
        }

        Hero updatedHero = heroRepository.save(hero);
        return heroMapper.toDTO(updatedHero);
    }
}