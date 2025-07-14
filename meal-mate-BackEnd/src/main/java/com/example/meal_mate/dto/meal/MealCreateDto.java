package com.example.meal_mate.dto.meal;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import jakarta.validation.constraints.Size;
import lombok.Data;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Data
public class MealCreateDto {

    @NotNull(message = "사용자 ID는 필수입니다.") // ✅ 추가
    private Long userId;                     // ✅ 추가

    @NotBlank(message = "음식명은 필수입니다.")
    @Size(max = 100, message = "음식명은 100자 이하여야 합니다.")
    private String foodName;
    
    @NotNull(message = "칼로리는 필수입니다.")
    @Positive(message = "칼로리는 양수여야 합니다.")
    private Integer calories;

    private Double protein;
    
    private Double carbs;
    
    private Double fat;
    
    private Double fiber;
    
    private Double sugar;
    
    private Double sodium;
    
    @NotNull(message = "섭취량은 필수입니다.")
    @Positive(message = "섭취량은 양수여야 합니다.")
    private Integer quantity;
    
    @Size(max = 20, message = "단위는 20자 이하여야 합니다.")
    private String unit;
    
    @NotBlank(message = "식사 유형은 필수입니다.")
    @Size(max = 20, message = "식사 유형은 20자 이하여야 합니다.")
    private String mealType;
    
    @NotNull(message = "식사 날짜는 필수입니다.")
    private LocalDate mealDate;
    
    private LocalDateTime mealTime;
    
    @Size(max = 500, message = "메모는 500자 이하여야 합니다.")
    private String memo;
}
