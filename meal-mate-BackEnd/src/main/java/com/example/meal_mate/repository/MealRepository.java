package com.example.meal_mate.repository;

import com.example.meal_mate.entity.Meal;
import com.example.meal_mate.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface MealRepository extends JpaRepository<Meal, Long> {
    
    // 사용자별 식사 기록 조회
    List<Meal> findByUser(User user);
    
    // 사용자별 특정 날짜의 식사 기록 조회
    List<Meal> findByUserAndMealDate(User user, LocalDate mealDate);
    
    // 사용자별 특정 기간의 식사 기록 조회
    List<Meal> findByUserAndMealDateBetween(User user, LocalDate startDate, LocalDate endDate);
    
    // 사용자별 식사 유형별 조회
    List<Meal> findByUserAndMealType(User user, String mealType);
    
    // 사용자별 특정 날짜의 식사 유형별 조회
    List<Meal> findByUserAndMealDateAndMealType(User user, LocalDate mealDate, String mealType);
    
    // 특정 날짜의 총 칼로리 계산
    @Query("SELECT COALESCE(SUM(m.calories), 0) FROM Meal m WHERE m.user = :user AND m.mealDate = :mealDate")
    Integer getTotalCaloriesByUserAndDate(@Param("user") User user, @Param("mealDate") LocalDate mealDate);
    
    // 특정 기간의 총 칼로리 계산
    @Query("SELECT COALESCE(SUM(m.calories), 0) FROM Meal m WHERE m.user = :user AND m.mealDate BETWEEN :startDate AND :endDate")
    Integer getTotalCaloriesByUserAndDateRange(@Param("user") User user, @Param("startDate") LocalDate startDate, @Param("endDate") LocalDate endDate);
    
    // 특정 날짜의 영양소 합계 조회
    @Query("SELECT COALESCE(SUM(m.protein), 0) as protein, COALESCE(SUM(m.carbs), 0) as carbs, COALESCE(SUM(m.fat), 0) as fat FROM Meal m WHERE m.user = :user AND m.mealDate = :mealDate")
    Object[] getNutritionSummaryByUserAndDate(@Param("user") User user, @Param("mealDate") LocalDate mealDate);
    
    // 가장 많이 섭취한 음식 조회
    @Query("SELECT m.foodName, COUNT(m) as count FROM Meal m WHERE m.user = :user GROUP BY m.foodName ORDER BY count DESC")
    List<Object[]> getMostConsumedFoodsByUser(@Param("user") User user);
    
    // 특정 음식명으로 검색
    List<Meal> findByUserAndFoodNameContaining(User user, String foodName);
    
    // 최근 식사 기록 조회 (최신 N개)
    List<Meal> findTop10ByUserOrderByCreatedAtDesc(User user);
    
    // 사용자별 식사 기록 수 조회
    long countByUser(User user);
    
    // 날짜별 식사 횟수 조회
    @Query("SELECT m.mealDate, COUNT(m) FROM Meal m WHERE m.user = :user GROUP BY m.mealDate ORDER BY m.mealDate DESC")
    List<Object[]> getMealCountByDate(@Param("user") User user);

    // 사용자별 전체 식사 기록 + 시간순 정렬
    List<Meal> findByUserOrderByMealTimeDesc(User user);

    // 사용자별 식사 유형별 기록 + 시간순 정렬
    List<Meal> findByUserAndMealTypeOrderByMealTimeDesc(User user, String mealType);

    List<Meal> findByMealTimeBetween(LocalDateTime start, LocalDateTime end);

    List<Meal> findByUserAndMealTimeBetween(User user, LocalDateTime start, LocalDateTime end);


}
