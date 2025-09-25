package com.example.demo.dto;

import lombok.Data;
import java.util.List;

@Data
public class PackResponseDTO {
    private Long id;
    private String name;
    private String description;
    private double price;
    private String imageUrl;
    private List<PackItemResponseDTO> items;
    private List<CommentDTO> comments;
}