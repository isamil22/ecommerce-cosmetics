package com.example.demo.mapper;

import com.example.demo.dto.CommentDTO;
import com.example.demo.model.Comment;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

@Mapper(componentModel = "spring")
public interface CommentMapper {
    @Mapping(target = "userId", source = "user.id")
    @Mapping(target = "userFullName", source = "user.fullName")
    CommentDTO toDTO(Comment comment);

    @Mapping(target = "user.id", source = "userId")
    @Mapping(target = "product", ignore = true)
    @Mapping(target = "pack", ignore = true)
    Comment toEntity(CommentDTO commentDTO);
}