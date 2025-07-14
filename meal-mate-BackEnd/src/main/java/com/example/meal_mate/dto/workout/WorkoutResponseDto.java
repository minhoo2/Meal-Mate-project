package com.example.meal_mate.dto.workout;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class WorkoutResponseDto {
    
    private Long id;
    private String name;
    private Integer duration;
    private Integer caloriesBurned;
    private LocalDateTime workoutTime;
    private String notes;
    private Long userId;
    private String userName;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}
