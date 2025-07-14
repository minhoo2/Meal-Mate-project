package com.example.meal_mate.entity;

import jakarta.persistence.*;
import lombok.*;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.LastModifiedDate;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Entity
@Table(name = "meals")
@Setter
@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@EntityListeners(AuditingEntityListener.class)
public class Meal {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "food_name", nullable = false, length = 100)
    private String foodName;

    @Column(nullable = false)
    private Integer calories;

    @Column
    private String name;

    @Column
    private Double protein; // g

    @Column
    private Double carbs; // g (탄수화물)

    @Column
    private Double fat; // g

    @Column
    private Double fiber; // g (식이섬유)

    @Column
    private Double sugar; // g

    @Column
    private Double sodium; // mg

    @Column(nullable = false)
    private Integer quantity; // 섭취량

    @Column(length = 20)
    private String unit; // 단위 (g, ml, 개, 컵 등)

    @Column(name = "meal_type", nullable = false, length = 20)
    private String mealType; // 식사 유형 (breakfast, lunch, dinner, snack)

    @Column(name = "meal_date", nullable = false)
    private LocalDate mealDate; // 식사 날짜

    @Column(name = "meal_time")
    private LocalDateTime mealTime; // 식사 시간

    @Column(length = 500)
    private String memo; // 메모

    @CreatedDate
    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt;

    @LastModifiedDate
    @Column(name = "updated_at")
    private LocalDateTime updatedAt;

    // 연관관계 - Meal은 한 명의 User에게 속함
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @Builder
    public Meal(String foodName, Integer calories, Double protein, Double carbs,
                Double fat, Double fiber, Double sugar, Double sodium, 
                Integer quantity, String unit, String mealType, LocalDate mealDate, 
                LocalDateTime mealTime, String memo, User user) {
        this.foodName = foodName;
        this.calories = calories;
        this.protein = protein;
        this.carbs = carbs;
        this.fat = fat;
        this.fiber = fiber;
        this.sugar = sugar;
        this.sodium = sodium;
        this.quantity = quantity;
        this.unit = unit;
        this.mealType = mealType;
        this.mealDate = mealDate;
        this.mealTime = mealTime;
        this.memo = memo;
        this.user = user;
    }

    // 비즈니스 로직
    public void updateMeal(String foodName, Integer calories, Double protein, 
                          Double carbs, Double fat, Double fiber, Double sugar, 
                          Double sodium, Integer quantity, String unit, 
                          String mealType, LocalDate mealDate, LocalDateTime mealTime, 
                          String memo) {
        this.foodName = foodName;
        this.calories = calories;
        this.protein = protein;
        this.carbs = carbs;
        this.fat = fat;
        this.fiber = fiber;
        this.sugar = sugar;
        this.sodium = sodium;
        this.quantity = quantity;
        this.unit = unit;
        this.mealType = mealType;
        this.mealDate = mealDate;
        this.mealTime = mealTime;
        this.memo = memo;
    }
}
