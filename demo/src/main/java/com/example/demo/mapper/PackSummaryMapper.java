package com.example.demo.mapper;

import com.example.demo.dto.PackSummaryDTO;
import com.example.demo.model.Pack;
import org.mapstruct.Mapper;

@Mapper(componentModel = "spring")
public interface PackSummaryMapper {
    PackSummaryDTO toSummaryDTO(Pack pack);
}
