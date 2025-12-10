package com.example.demo.mapper;

import com.example.demo.dto.LandingPageSettingsDTO;
import com.example.demo.model.LandingPageSettings;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.MappingTarget;

/**
 * Mapper for LandingPageSettings entity and DTO
 */
@Mapper(componentModel = "spring")
public interface LandingPageSettingsMapper {

    LandingPageSettingsDTO toDTO(LandingPageSettings settings);

    @Mapping(target = "id", ignore = true)
    @Mapping(target = "landingPage", ignore = true)
    @Mapping(target = "createdAt", ignore = true)
    @Mapping(target = "updatedAt", ignore = true)
    LandingPageSettings toEntity(LandingPageSettingsDTO dto);

    @Mapping(target = "id", ignore = true)
    @Mapping(target = "landingPage", ignore = true)
    @Mapping(target = "createdAt", ignore = true)
    @Mapping(target = "updatedAt", ignore = true)
    void updateSettingsFromDto(LandingPageSettingsDTO dto, @MappingTarget LandingPageSettings entity);
}

