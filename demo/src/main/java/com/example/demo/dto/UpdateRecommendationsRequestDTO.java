package com.example.demo.dto;

import lombok.Data;
import java.util.List;

@Data
public class UpdateRecommendationsRequestDTO {
    private List<Long> productIds;
    private List<Long> packIds;
}

