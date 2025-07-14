package com.example.meal_mate.entity;

import jakarta.persistence.*;
import lombok.*;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.LastModifiedDate;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Entity
@Table(name = "workouts")
@Getter
@Setter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@EntityListeners(AuditingEntityListener.class)
public class Workout {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "exercise_name", nullable = false, length = 100)
    private String exerciseName;

    @Column(name = "exercise_type", nullable = false, length = 50)
    private String exerciseType; // 운동 유형 (cardio, strength, flexibility, sports 등)

    @Column(nullable = false)
    private Integer duration; // 운동 시간 (분)

    @Column(name = "calories_burned", nullable = false)
    private Integer caloriesBurned; // 소모 칼로리

    @Column
    private Double distance; // 거리 (km) - 유산소 운동의 경우

    @Column
    private Integer sets; // 세트 수 - 웨이트 트레이닝의 경우

    @Column
    private Integer reps; // 반복 횟수 - 웨이트 트레이닝의 경우

    @Column
    private Double weight; // 중량 (kg) - 웨이트 트레이닝의 경우

    @Column
    private Integer intensity; // 운동 강도 (1-10)

    @Column(name = "workout_date", nullable = false)
    private LocalDate workoutDate; // 운동 날짜

    @Column(name = "workout_time")
    private LocalDateTime workoutTime; // 운동 시간

    @Column(length = 500)
    private String memo; // 메모

    @CreatedDate
    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt;

    @LastModifiedDate
    @Column(name = "updated_at")
    private LocalDateTime updatedAt;

    // 연관관계 - Workout은 한 명의 User에게 속함
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @Builder
    public Workout(String exerciseName, String exerciseType, Integer duration, 
                   Integer caloriesBurned, Double distance, Integer sets, Integer reps, 
                   Double weight, Integer intensity, LocalDate workoutDate, 
                   LocalDateTime workoutTime, String memo, User user) {
        this.exerciseName = exerciseName;
        this.exerciseType = exerciseType;
        this.duration = duration;
        this.caloriesBurned = caloriesBurned;
        this.distance = distance;
        this.sets = sets;
        this.reps = reps;
        this.weight = weight;
        this.intensity = intensity;
        this.workoutDate = workoutDate;
        this.workoutTime = workoutTime;
        this.memo = memo;
        this.user = user;
    }

    // 비즈니스 로직
    public void updateWorkout(String exerciseName, String exerciseType, Integer duration, 
                             Integer caloriesBurned, Double distance, Integer sets, 
                             Integer reps, Double weight, Integer intensity, 
                             LocalDate workoutDate, LocalDateTime workoutTime, String memo) {
        this.exerciseName = exerciseName;
        this.exerciseType = exerciseType;
        this.duration = duration;
        this.caloriesBurned = caloriesBurned;
        this.distance = distance;
        this.sets = sets;
        this.reps = reps;
        this.weight = weight;
        this.intensity = intensity;
        this.workoutDate = workoutDate;
        this.workoutTime = workoutTime;
        this.memo = memo;
    }
}
