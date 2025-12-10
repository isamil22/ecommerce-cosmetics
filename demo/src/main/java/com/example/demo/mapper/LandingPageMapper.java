package com.example.demo.mapper;

import com.example.demo.dto.LandingPageDTO;
import com.example.demo.dto.LandingPageRequestDTO;
import com.example.demo.dto.LandingPageResponseDTO;
import com.example.demo.model.LandingPage;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.MappingTarget;

import java.util.List;

/**
 * Mapper for LandingPage entity and DTOs
 */
@Mapper(componentModel = "spring", uses = {LandingPageSectionMapper.class, LandingPageSettingsMapper.class})
public interface LandingPageMapper {

    @Mapping(source = "product.id", target = "productId")
    @Mapping(source = "product.name", target = "productName")
    @Mapping(source = "createdBy.id", target = "createdBy")
    @Mapping(source = "createdBy.fullName", target = "createdByName")
    @Mapping(target = "totalViews", ignore = true) // Will be calculated separately
    LandingPageDTO toDTO(LandingPage landingPage);

    @Mapping(source = "product.id", target = "productId")
    @Mapping(source = "product.name", target = "productName")
    @Mapping(source = "createdBy.id", target = "createdBy")
    @Mapping(source = "createdBy.fullName", target = "createdByName")
    @Mapping(source = "sections", target = "sections")
    @Mapping(source = "settings", target = "settings")
    LandingPageResponseDTO toResponseDTO(LandingPage landingPage);

    @Mapping(target = "id", ignore = true)
    @Mapping(target = "product", ignore = true)
    @Mapping(target = "createdBy", ignore = true)
    @Mapping(target = "publishedAt", ignore = true)
    @Mapping(target = "createdAt", ignore = true)
    @Mapping(target = "updatedAt", ignore = true)
    @Mapping(target = "sections", ignore = true)
    @Mapping(target = "settings", ignore = true)
    LandingPage toEntity(LandingPageRequestDTO dto);

    @Mapping(target = "id", ignore = true)
    @Mapping(target = "product", ignore = true)
    @Mapping(target = "createdBy", ignore = true)
    @Mapping(target = "publishedAt", ignore = true)
    @Mapping(target = "createdAt", ignore = true)
    @Mapping(target = "updatedAt", ignore = true)
    @Mapping(target = "sections", ignore = true)
    @Mapping(target = "settings", ignore = true)
    void updateLandingPageFromDto(LandingPageRequestDTO dto, @MappingTarget LandingPage entity);

    List<LandingPageDTO> toDTOList(List<LandingPage> landingPages);
}

