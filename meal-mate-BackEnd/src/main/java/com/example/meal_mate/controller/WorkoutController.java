package com.example.meal_mate.controller;

import com.example.meal_mate.dto.workout.WorkoutCreateDto;
import com.example.meal_mate.dto.workout.WorkoutResponseDto;
import com.example.meal_mate.dto.workout.WorkoutUpdateDto;
import com.example.meal_mate.service.WorkoutService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;

@RestController
@RequestMapping("/api/workouts")
@RequiredArgsConstructor
@CrossOrigin(origins = "http://localhost:5173")
public class WorkoutController {

    private final WorkoutService workoutService;

    /**
     * 새로운 운동 기록 생성
     */
    @PostMapping
    public ResponseEntity<WorkoutResponseDto> createWorkout(@Valid @RequestBody WorkoutCreateDto workoutCreateDto) {
        WorkoutResponseDto workoutResponse = workoutService.createWorkout(workoutCreateDto);
        return ResponseEntity.status(HttpStatus.CREATED).body(workoutResponse);
    }

    /**
     * 모든 운동 기록 조회
     */
    @GetMapping
    public ResponseEntity<List<WorkoutResponseDto>> getAllWorkouts() {
        List<WorkoutResponseDto> workouts = workoutService.getAllWorkouts();
        return ResponseEntity.ok(workouts);
    }

    /**
     * 특정 운동 기록 조회
     */
    @GetMapping("/{id}")
    public ResponseEntity<WorkoutResponseDto> getWorkoutById(@PathVariable Long id) {
        WorkoutResponseDto workout = workoutService.getWorkoutById(id);
        return ResponseEntity.ok(workout);
    }

    /**
     * 사용자별 운동 기록 조회
     */
    @GetMapping("/user/{userId}")
    public ResponseEntity<List<WorkoutResponseDto>> getWorkoutsByUserId(@PathVariable Long userId) {
        List<WorkoutResponseDto> workouts = workoutService.getWorkoutsByUserId(userId);
        return ResponseEntity.ok(workouts);
    }

    /**
     * 특정 날짜의 운동 기록 조회
     */
    @GetMapping("/date/{date}")
    public ResponseEntity<List<WorkoutResponseDto>> getWorkoutsByDate(@PathVariable LocalDate date) {
        List<WorkoutResponseDto> workouts = workoutService.getWorkoutsByDate(date);
        return ResponseEntity.ok(workouts);
    }

    /**
     * 사용자와 날짜별 운동 기록 조회
     */
    @GetMapping("/user/{userId}/date/{date}")
    public ResponseEntity<List<WorkoutResponseDto>> getWorkoutsByUserIdAndDate(
            @PathVariable Long userId,
            @PathVariable LocalDate date) {
        List<WorkoutResponseDto> workouts = workoutService.getWorkoutsByUserIdAndDate(userId, date);
        return ResponseEntity.ok(workouts);
    }

    /**
     * 운동 기록 수정
     */
    @PutMapping("/{id}")
    public ResponseEntity<WorkoutResponseDto> updateWorkout(
            @PathVariable Long id,
            @Valid @RequestBody WorkoutUpdateDto workoutUpdateDto) {
        WorkoutResponseDto updatedWorkout = workoutService.updateWorkout(id, workoutUpdateDto);
        return ResponseEntity.ok(updatedWorkout);
    }

    /**
     * 운동 기록 삭제
     */
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteWorkout(@PathVariable Long id) {
        workoutService.deleteWorkout(id);
        return ResponseEntity.noContent().build();
    }

    /**
     * 사용자의 일일 총 소모 칼로리 조회
     */
    @GetMapping("/user/{userId}/date/{date}/calories")
    public ResponseEntity<Double> getTotalCaloriesBurnedByUserAndDate(
            @PathVariable Long userId, 
            @PathVariable LocalDate date) {
        double totalCalories = workoutService.getTotalCaloriesBurnedByUserAndDate(userId, date);
        return ResponseEntity.ok(totalCalories);
    }

    /**
     * 사용자의 기간별 평균 소모 칼로리 조회
     */
    @GetMapping("/user/{userId}/average-calories")
    public ResponseEntity<Double> getAverageCaloriesBurnedByUserAndDateRange(
            @PathVariable Long userId,
            @RequestParam LocalDate startDate,
            @RequestParam LocalDate endDate) {
        double averageCalories = workoutService.getAverageCaloriesBurnedByUserAndDateRange(userId, startDate, endDate);
        return ResponseEntity.ok(averageCalories);
    }

    /**
     * 운동 유형별 기록 조회
     */
    @GetMapping("/user/{userId}/type/{workoutType}")
    public ResponseEntity<List<WorkoutResponseDto>> getWorkoutsByUserIdAndType(
            @PathVariable Long userId,
            @PathVariable String workoutType) {
        List<WorkoutResponseDto> workouts = workoutService.getWorkoutsByUserIdAndType(userId, workoutType);
        return ResponseEntity.ok(workouts);
    }

    /**
     * 사용자의 일일 총 운동 시간 조회
     */
    @GetMapping("/user/{userId}/date/{date}/duration")
    public ResponseEntity<Integer> getTotalDurationByUserAndDate(
            @PathVariable Long userId, 
            @PathVariable LocalDate date) {
        int totalDuration = workoutService.getTotalDurationByUserAndDate(userId, date);
        return ResponseEntity.ok(totalDuration);
    }
}
