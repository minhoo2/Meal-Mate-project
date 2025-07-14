package com.example.meal_mate.repository;

import com.example.meal_mate.entity.Workout;
import com.example.meal_mate.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface WorkoutRepository extends JpaRepository<Workout, Long> {
    
    // 사용자별 운동 기록 조회
    List<Workout> findByUser(User user);
    
    // 사용자별 특정 날짜의 운동 기록 조회
    List<Workout> findByUserAndWorkoutDate(User user, LocalDate workoutDate);
    
    // 사용자별 특정 기간의 운동 기록 조회
    List<Workout> findByUserAndWorkoutDateBetween(User user, LocalDate startDate, LocalDate endDate);
    
    // 사용자별 운동 유형별 조회
    List<Workout> findByUserAndExerciseType(User user, String exerciseType);
    
    // 사용자별 특정 날짜의 운동 유형별 조회
    List<Workout> findByUserAndWorkoutDateAndExerciseType(User user, LocalDate workoutDate, String exerciseType);
    
    // 특정 날짜의 총 소모 칼로리 계산
    @Query("SELECT COALESCE(SUM(w.caloriesBurned), 0) FROM Workout w WHERE w.user = :user AND w.workoutDate = :workoutDate")
    Integer getTotalCaloriesBurnedByUserAndDate(@Param("user") User user, @Param("workoutDate") LocalDate workoutDate);
    
    // 특정 기간의 총 소모 칼로리 계산
    @Query("SELECT COALESCE(SUM(w.caloriesBurned), 0) FROM Workout w WHERE w.user = :user AND w.workoutDate BETWEEN :startDate AND :endDate")
    Integer getTotalCaloriesBurnedByUserAndDateRange(@Param("user") User user, @Param("startDate") LocalDate startDate, @Param("endDate") LocalDate endDate);
    
    // 특정 날짜의 총 운동 시간 계산
    @Query("SELECT COALESCE(SUM(w.duration), 0) FROM Workout w WHERE w.user = :user AND w.workoutDate = :workoutDate")
    Integer getTotalDurationByUserAndDate(@Param("user") User user, @Param("workoutDate") LocalDate workoutDate);
    
    // 특정 기간의 총 운동 시간 계산
    @Query("SELECT COALESCE(SUM(w.duration), 0) FROM Workout w WHERE w.user = :user AND w.workoutDate BETWEEN :startDate AND :endDate")
    Integer getTotalDurationByUserAndDateRange(@Param("user") User user, @Param("startDate") LocalDate startDate, @Param("endDate") LocalDate endDate);
    
    // 가장 많이 한 운동 조회
    @Query("SELECT w.exerciseName, COUNT(w) as count FROM Workout w WHERE w.user = :user GROUP BY w.exerciseName ORDER BY count DESC")
    List<Object[]> getMostFrequentExercisesByUser(@Param("user") User user);
    
    // 운동 유형별 통계
    @Query("SELECT w.exerciseType, COUNT(w) as count, COALESCE(SUM(w.duration), 0) as totalDuration, COALESCE(SUM(w.caloriesBurned), 0) as totalCalories FROM Workout w WHERE w.user = :user GROUP BY w.exerciseType")
    List<Object[]> getExerciseTypeStatsByUser(@Param("user") User user);
    
    // 특정 운동명으로 검색
    List<Workout> findByUserAndExerciseNameContaining(User user, String exerciseName);
    
    // 최근 운동 기록 조회 (최신 N개)
    List<Workout> findTop10ByUserOrderByCreatedAtDesc(User user);
    
    // 사용자별 운동 기록 수 조회
    long countByUser(User user);
    
    // 날짜별 운동 횟수 조회
    @Query("SELECT w.workoutDate, COUNT(w) FROM Workout w WHERE w.user = :user GROUP BY w.workoutDate ORDER BY w.workoutDate DESC")
    List<Object[]> getWorkoutCountByDate(@Param("user") User user);
    
    // 월별 운동 통계
    @Query("SELECT YEAR(w.workoutDate), MONTH(w.workoutDate), COUNT(w), COALESCE(SUM(w.duration), 0), COALESCE(SUM(w.caloriesBurned), 0) FROM Workout w WHERE w.user = :user GROUP BY YEAR(w.workoutDate), MONTH(w.workoutDate) ORDER BY YEAR(w.workoutDate) DESC, MONTH(w.workoutDate) DESC")
    List<Object[]> getMonthlyWorkoutStatsByUser(@Param("user") User user);

    List<Workout> findByUserOrderByWorkoutTimeDesc(User user);
    
    // 특정 날짜 범위의 운동 기록 조회 (DateTime 기반)
    List<Workout> findByWorkoutTimeBetweenOrderByWorkoutTimeDesc(LocalDateTime startTime, LocalDateTime endTime);
    
    // 사용자별 특정 날짜 범위의 운동 기록 조회 (DateTime 기반)
    List<Workout> findByUserAndWorkoutTimeBetweenOrderByWorkoutTimeDesc(User user, LocalDateTime startTime, LocalDateTime endTime);
    
    // 사용자별 운동명 검색 (대소문자 구분 없이)
    List<Workout> findByUserAndExerciseNameContainingIgnoreCaseOrderByWorkoutTimeDesc(User user, String exerciseName);

}
