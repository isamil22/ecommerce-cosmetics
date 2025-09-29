package com.example.demo.mapper;

import com.example.demo.dto.ReviewDTO;
import com.example.demo.model.Review;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

import org.mapstruct.NullValuePropertyMappingStrategy;

@Mapper(componentModel = "spring", nullValuePropertyMappingStrategy = NullValuePropertyMappingStrategy.IGNORE)
public interface ReviewMapper {
    /**
     * Maps a Review entity to a ReviewDTO.
     * It includes user information but omits the product details, as they are no longer part of the model.
     * For admin-created reviews, user fields may be null.
     */
    @Mapping(source = "user.id", target = "userId")
    @Mapping(source = "user.email", target = "userEmail")
    ReviewDTO toDTO(Review review);

    /**
     * Maps a ReviewDTO back to a Review entity.
     * The product mapping has been removed.
     * User mapping is handled manually in the service layer.
     */
    @Mapping(target = "user", ignore = true)
    Review toEntity(ReviewDTO reviewDTO);
}