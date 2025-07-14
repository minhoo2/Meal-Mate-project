package com.example.meal_mate.dto.user;

import jakarta.validation.constraints.Size;
import lombok.Data;

@Data
public class UserUpdateDto {
    
    @Size(max = 30, message = "닉네임은 30자 이하여야 합니다.")
    private String nickname;
    
    private Integer age;

    private String email;
    
    private String gender;
    
    private Double height;
    
    private Double weight;
    
    private Double targetWeight;
    
    private String activityLevel;
    
    private Integer dailyCalorieGoal;
}
