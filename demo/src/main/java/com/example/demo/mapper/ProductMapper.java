package com.example.demo.mapper;

import com.example.demo.dto.FrequentlyBoughtTogetherDTO;
import com.example.demo.dto.ProductDTO;
import com.example.demo.dto.ProductVariantDto;
import com.example.demo.dto.VariantOptionDto;
import com.example.demo.dto.VariantTypeDto;
import com.example.demo.model.Product;
import com.example.demo.model.ProductVariant;
import com.example.demo.model.VariantOption;
import com.example.demo.model.VariantType;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.MappingTarget;

import java.math.BigDecimal;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Mapper(componentModel = "spring")
public interface ProductMapper {

    @Mapping(source = "category.name", target = "categoryName")
    @Mapping(source = "category.id", target = "categoryId")
    @Mapping(source = "packable", target = "isPackable")
    ProductDTO toDTO(Product product);

    @Mapping(target = "id", ignore = true)
    @Mapping(target = "category", ignore = true)
    @Mapping(target = "comments", ignore = true)
    @Mapping(target = "variantTypes", ignore = true)
    @Mapping(target = "variants", ignore = true)
    @Mapping(target = "frequentlyBoughtTogether", ignore = true)
    @Mapping(source = "isPackable", target = "packable")
    Product toEntity(ProductDTO productDTO);

    @Mapping(target = "id", ignore = true)
    @Mapping(target = "category", ignore = true)
    @Mapping(target = "comments", ignore = true)
    // @Mapping(target = "images", ignore = true) // REMOVED to allow updating
    // images list from DTO
    @Mapping(target = "variantTypes", ignore = true)
    @Mapping(target = "variants", ignore = true)
    @Mapping(target = "frequentlyBoughtTogether", ignore = true)
    @Mapping(source = "isPackable", target = "packable")
    void updateProductFromDto(ProductDTO dto, @MappingTarget Product entity);

    default List<VariantTypeDto> mapVariantTypes(List<VariantType> variantTypes) {
        if (variantTypes == null) {
            return null;
        }
        return variantTypes.stream()
                .map(this::variantTypeToVariantTypeDto)
                .collect(Collectors.toList());
    }

    default VariantTypeDto variantTypeToVariantTypeDto(VariantType variantType) {
        if (variantType == null) {
            return null;
        }
        VariantTypeDto variantTypeDto = new VariantTypeDto();
        variantTypeDto.setName(variantType.getName());
        variantTypeDto.setOptions(variantType.getOptions().stream()
                .map(this::variantOptionToVariantOptionDto)
                .collect(Collectors.toList()));
        return variantTypeDto;
    }

    default VariantOptionDto variantOptionToVariantOptionDto(VariantOption variantOption) {
        if (variantOption == null) return null;
        VariantOptionDto dto = new VariantOptionDto();
        dto.setValue(variantOption.getValue());
        dto.setColorCode(variantOption.getColorCode());
        dto.setImageUrl(variantOption.getImageUrl());
        return dto;
    }

    default List<ProductVariantDto> mapProductVariants(List<ProductVariant> productVariants) {
        if (productVariants == null) {
            return null;
        }
        return productVariants.stream()
                .map(this::productVariantToProductVariantDto)
                .collect(Collectors.toList());
    }

    default ProductVariantDto productVariantToProductVariantDto(ProductVariant productVariant) {
        if (productVariant == null) {
            return null;
        }
        ProductVariantDto dto = new ProductVariantDto();
        Map<String, String> variantMap = productVariant.getVariantMap();
        dto.setVariantMap(variantMap != null ? variantMap : new HashMap<>());
        dto.setPrice(productVariant.getPrice() != null ? productVariant.getPrice() : BigDecimal.ZERO);
        dto.setStock(productVariant.getStock());
        dto.setImageUrl(productVariant.getImageUrl());
        dto.setId(productVariant.getId());
        return dto;
    }

    default List<FrequentlyBoughtTogetherDTO> mapFrequentlyBoughtTogether(java.util.Set<Product> products) {
        if (products == null) {
            return null;
        }
        return products.stream()
                .map(this::toFrequentlyBoughtTogetherDTO)
                .collect(Collectors.toList());
    }

    default FrequentlyBoughtTogetherDTO toFrequentlyBoughtTogetherDTO(Product product) {
        if (product == null) {
            return null;
        }
        FrequentlyBoughtTogetherDTO dto = new FrequentlyBoughtTogetherDTO();
        dto.setId(product.getId());
        dto.setName(product.getName());
        dto.setPrice(product.getPrice());
        dto.setImages(product.getImages());
        return dto;
    }
}