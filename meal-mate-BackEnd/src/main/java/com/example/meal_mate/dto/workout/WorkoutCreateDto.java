package com.example.meal_mate.dto.workout;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class WorkoutCreateDto {
    
    @NotBlank(message = "운동 이름은 필수입니다")
    private String name;
    
    @NotNull(message = "운동 시간은 필수입니다")
    @Positive(message = "운동 시간은 0보다 커야 합니다")
    private Integer duration; // 분 단위
    
    @NotNull(message = "칼로리 소모량은 필수입니다")
    @Positive(message = "칼로리 소모량은 0보다 커야 합니다")
    private Integer caloriesBurned;
    
    @NotNull(message = "운동 시간은 필수입니다")
    private LocalDateTime workoutTime;
    
    private String notes;
    
    @NotNull(message = "사용자 ID는 필수입니다")
    private Long userId;
}
