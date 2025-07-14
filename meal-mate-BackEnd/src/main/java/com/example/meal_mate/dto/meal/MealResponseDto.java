package com.example.meal_mate.dto.meal;

import lombok.Builder;
import lombok.Data;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Builder
@Data
public class MealResponseDto {
    
    private Long id;
    private String foodName;
    private Integer calories;
    private Double protein;
    private Double carbs;
    private Double fat;
    private Double fiber;
    private Double sugar;
    private Double sodium;
    private Integer quantity;
    private String unit;
    private String mealType;
    private LocalDate mealDate;
    private LocalDateTime mealTime;
    private String memo;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
    private Long userId;
    private String userName;
}
