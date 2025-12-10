package com.example.demo.mapper;

import com.example.demo.dto.LandingPageSectionDTO;
import com.example.demo.model.LandingPageSection;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.MappingTarget;

/**
 * Mapper for LandingPageSection entity and DTO
 */
@Mapper(componentModel = "spring")
public interface LandingPageSectionMapper {

    LandingPageSectionDTO toDTO(LandingPageSection section);

    @Mapping(target = "id", ignore = true)
    @Mapping(target = "landingPage", ignore = true)
    @Mapping(target = "createdAt", ignore = true)
    @Mapping(target = "updatedAt", ignore = true)
    LandingPageSection toEntity(LandingPageSectionDTO dto);

    @Mapping(target = "id", ignore = true)
    @Mapping(target = "landingPage", ignore = true)
    @Mapping(target = "createdAt", ignore = true)
    @Mapping(target = "updatedAt", ignore = true)
    void updateSectionFromDto(LandingPageSectionDTO dto, @MappingTarget LandingPageSection entity);
}

