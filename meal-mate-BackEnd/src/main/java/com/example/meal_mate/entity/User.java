package com.example.meal_mate.entity;

import jakarta.persistence.*;
import lombok.*;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.LastModifiedDate;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "users")
@Setter
@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@EntityListeners(AuditingEntityListener.class)
public class User {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(unique = true, nullable = false, length = 50)
    private String username;

    @Column(unique = true, nullable = false, length = 100)
    private String email;

    @Column(nullable = false)
    private String password;

    @Column(length = 30)
    private String nickname;

    @Column
    private Integer age;

    @Column(length = 10)
    private String gender;

    @Column
    private Double height; // cm

    @Column
    private Double weight; // kg

    @Column(name = "target_weight")
    private Double targetWeight; // kg

    @Column(name = "activity_level")
    private String activityLevel; // 활동량 (sedentary, light, moderate, active, very_active)

    @Column(name = "daily_calorie_goal")
    private Integer dailyCalorieGoal;

    @CreatedDate
    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt;

    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
    }

    @LastModifiedDate
    @Column(name = "updated_at")
    private LocalDateTime updatedAt;

    // 연관관계 - User가 여러 Meal을 가질 수 있음
    @OneToMany(mappedBy = "user", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<Meal> meals = new ArrayList<>();

    // 연관관계 - User가 여러 Workout을 가질 수 있음
    @OneToMany(mappedBy = "user", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<Workout> workouts = new ArrayList<>();

    @Builder
    public User(String username, String email, String password, String nickname, 
                Integer age, String gender, Double height, Double weight, 
                Double targetWeight, String activityLevel, Integer dailyCalorieGoal) {
        this.username = username;
        this.email = email;
        this.password = password;
        this.nickname = nickname;
        this.age = age;
        this.gender = gender;
        this.height = height;
        this.weight = weight;
        this.targetWeight = targetWeight;
        this.activityLevel = activityLevel;
        this.dailyCalorieGoal = dailyCalorieGoal;
    }

    // 비즈니스 로직
    public void updateProfile(String nickname, Integer age, String gender, 
                            Double height, Double weight, Double targetWeight, 
                            String activityLevel, Integer dailyCalorieGoal) {
        this.nickname = nickname;
        this.age = age;
        this.gender = gender;
        this.height = height;
        this.weight = weight;
        this.targetWeight = targetWeight;
        this.activityLevel = activityLevel;
        this.dailyCalorieGoal = dailyCalorieGoal;
    }

    public void updatePassword(String password) {
        this.password = password;
    }
}
