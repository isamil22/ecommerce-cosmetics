// isamil22/ecommerce-basic/ecommerce-basic-7d0cae8be7d6e68651cd7c2fe9fb897e9162ff5e/demo/src/main/java/com/example/demo/dto/FrequentlyBoughtTogetherDTO.java
package com.example.demo.dto;

import lombok.Data;
import java.math.BigDecimal;
import java.util.List;

@Data
public class FrequentlyBoughtTogetherDTO {
    private Long id;
    private String name;
    private BigDecimal price;
    private List<String> images;
}