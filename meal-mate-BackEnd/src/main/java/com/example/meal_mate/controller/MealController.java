package com.example.meal_mate.controller;

import com.example.meal_mate.dto.meal.MealCreateDto;
import com.example.meal_mate.dto.meal.MealResponseDto;
import com.example.meal_mate.dto.meal.MealUpdateDto;
import com.example.meal_mate.service.MealService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;

@RestController
@RequestMapping("/api/meals")
@RequiredArgsConstructor
@CrossOrigin(origins = {"http://localhost:3000", "http://localhost:5173"})
public class MealController {

    private final MealService mealService;

    /**
     * 새로운 식사 기록 생성
     */
    @PostMapping
    public ResponseEntity<MealResponseDto> createMeal(@Valid @RequestBody MealCreateDto mealCreateDto) {
        MealResponseDto mealResponse = mealService.createMeal(mealCreateDto);
        return ResponseEntity.status(HttpStatus.CREATED).body(mealResponse);
    }

    /**
     * 모든 식사 기록 조회
     */
    @GetMapping
    public ResponseEntity<List<MealResponseDto>> getAllMeals() {
        List<MealResponseDto> meals = mealService.getAllMeals();
        return ResponseEntity.ok(meals);
    }

    /**
     * 특정 식사 기록 조회
     */
    @GetMapping("/{id}")
    public ResponseEntity<MealResponseDto> getMealById(@PathVariable Long id) {
        MealResponseDto meal = mealService.getMealById(id);
        return ResponseEntity.ok(meal);
    }

    /**
     * 사용자별 식사 기록 조회
     */
    @GetMapping("/user/{userId}")
    public ResponseEntity<List<MealResponseDto>> getMealsByUserId(@PathVariable Long userId) {
        List<MealResponseDto> meals = mealService.getMealsByUserId(userId);
        return ResponseEntity.ok(meals);
    }

    /**
     * 특정 날짜의 식사 기록 조회
     */
    @GetMapping("/date/{date}")
    public ResponseEntity<List<MealResponseDto>> getMealsByDate(@PathVariable LocalDate date) {
        List<MealResponseDto> meals = mealService.getMealsByDate(date);
        return ResponseEntity.ok(meals);
    }

    /**
     * 사용자와 날짜별 식사 기록 조회
     */
    @GetMapping("/user/{userId}/date/{date}")
    public ResponseEntity<List<MealResponseDto>> getMealsByUserIdAndDate(
            @PathVariable Long userId, 
            @PathVariable LocalDate date) {
        List<MealResponseDto> meals = mealService.getMealsByUserIdAndDate(userId, date);
        return ResponseEntity.ok(meals);
    }

    /**
     * 식사 기록 수정
     */
    @PutMapping("/{id}")
    public ResponseEntity<MealResponseDto> updateMeal(
            @PathVariable Long id, 
            @Valid @RequestBody MealUpdateDto mealUpdateDto) {
        MealResponseDto updatedMeal = mealService.updateMeal(id, mealUpdateDto);
        return ResponseEntity.ok(updatedMeal);
    }

    /**
     * 식사 기록 삭제
     */
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteMeal(@PathVariable Long id) {
        mealService.deleteMeal(id);
        return ResponseEntity.noContent().build();
    }

    /**
     * 사용자의 일일 총 칼로리 조회
     */
    @GetMapping("/user/{userId}/date/{date}/calories")
    public ResponseEntity<Double> getTotalCaloriesByUserAndDate(
            @PathVariable Long userId, 
            @PathVariable LocalDate date) {
        double totalCalories = mealService.getTotalCaloriesByUserAndDate(userId, date);
        return ResponseEntity.ok(totalCalories);
    }

    /**
     * 사용자의 기간별 평균 칼로리 조회
     */
    @GetMapping("/user/{userId}/average-calories")
    public ResponseEntity<Double> getAverageCaloriesByUserAndDateRange(
            @PathVariable Long userId,
            @RequestParam LocalDate startDate,
            @RequestParam LocalDate endDate) {
        double averageCalories = mealService.getAverageCaloriesByUserAndDateRange(userId, startDate, endDate);
        return ResponseEntity.ok(averageCalories);
    }
}
