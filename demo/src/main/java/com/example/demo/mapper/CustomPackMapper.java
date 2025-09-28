package com.example.demo.mapper;

import com.example.demo.dto.CustomPackDTO;
import com.example.demo.model.CustomPack;
import com.example.demo.model.Product;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.Named;

import java.util.List;
import java.util.stream.Collectors;

@Mapper(componentModel = "spring", uses = {ProductMapper.class})
public interface CustomPackMapper {
    
    @Mapping(target = "allowedProductIds", source = "allowedProducts", qualifiedByName = "productsToIds")
    CustomPackDTO toDTO(CustomPack customPack);
    
    @Mapping(target = "allowedProducts", ignore = true) // Will be handled in service
    CustomPack toEntity(CustomPackDTO customPackDTO);
    
    @Named("productsToIds")
    default List<Long> productsToIds(List<Product> products) {
        if (products == null) return null;
        return products.stream().map(Product::getId).collect(Collectors.toList());
    }
}