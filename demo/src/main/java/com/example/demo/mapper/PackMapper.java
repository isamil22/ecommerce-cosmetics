package com.example.demo.mapper;

import com.example.demo.dto.PackResponseDTO;
import com.example.demo.model.Pack;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

@Mapper(componentModel = "spring", uses = {PackItemMapper.class, CommentMapper.class, ProductMapper.class, PackSummaryMapper.class, CustomPackMapper.class})
public interface PackMapper {
    @Mapping(target = "comments", source = "comments")
    PackResponseDTO toResponseDTO(Pack pack);
}