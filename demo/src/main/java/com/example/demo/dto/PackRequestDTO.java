package com.example.demo.dto;


import lombok.Data;
import java.util.List;

@Data
public class PackRequestDTO {
    private String name;
    private String description;
    private double price;
    private List<PackItemRequestDTO> items;
    private List<Long> recommendedProductIds;
    private List<Long> recommendedPackIds;
    private boolean hideCommentForm = false;
}