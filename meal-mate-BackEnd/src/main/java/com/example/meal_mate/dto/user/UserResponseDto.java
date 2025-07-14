package com.example.meal_mate.dto.user;

import lombok.Builder;
import lombok.Data;

import java.time.LocalDateTime;

@Data
@Builder
public class UserResponseDto {
    
    private Long id;
    private String username;
    private String email;
    private String nickname;
    private Integer age;
    private String gender;
    private Double height;
    private Double weight;
    private Double targetWeight;
    private String activityLevel;
    private Integer dailyCalorieGoal;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
    private String token;
}
