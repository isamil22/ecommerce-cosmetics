package com.example.demo.mapper;

import com.example.demo.dto.CartDTO;
import com.example.demo.dto.CartItemDTO;
import com.example.demo.model.Cart;
import com.example.demo.model.CartItem;
import org.mapstruct.AfterMapping;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.MappingTarget;
import org.mapstruct.Named;

import java.util.List;

@Mapper(componentModel = "spring")
public interface CartMapper {
    @Mapping(target = "userId", source = "user.id")
    CartDTO toDTO(Cart cart);

    @Mapping(target = "user.id", source = "userId")
    Cart toEntity(CartDTO cartDTO);

    @Mapping(target = "id", source = "id")
    @Mapping(target = "productId", source = "product.id")
    @Mapping(target = "productName", expression = "java(cartItem.getProduct() != null ? cartItem.getProduct().getName() : cartItem.getProductName())")
    @Mapping(target = "price", expression = "java(cartItem.getProduct() != null ? cartItem.getProduct().getPrice() : cartItem.getPrice())")
    @Mapping(target = "imageUrl", expression = "java(cartItem.getImageUrl() != null && !cartItem.getImageUrl().isEmpty() ? cartItem.getImageUrl() : (cartItem.getProduct() != null && cartItem.getProduct().getImages() != null && !cartItem.getProduct().getImages().isEmpty() ? cartItem.getProduct().getImages().get(0) : null))")
    @Mapping(target = "variantName", source = "variantName")
    @Mapping(target = "categoryId", source = "product.category.id")
    CartItemDTO toDTO(CartItem cartItem);

    @Mapping(target = "product.id", source = "productId")
    @Mapping(target = "cart", ignore = true)
    CartItem toEntity(CartItemDTO cartItemDTO);

    @Named("getFirstImage")
    default String getFirstImage(List<String> images) {
        return (images != null && !images.isEmpty()) ? images.get(0) : null;
    }

    @AfterMapping
    default void logMapping(CartItem source, @MappingTarget CartItemDTO target) {
        if (source.getId() != null) {
            target.setId(source.getId()); // Force set
        }
        System.out.println("DEBUG MAPPING: Entity ID=" + source.getId() + " -> DTO ID=" + target.getId() + " [Product: "
                + target.getProductName() + "]");
    }
}