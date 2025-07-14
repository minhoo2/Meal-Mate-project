package com.example.meal_mate.service;

import com.example.meal_mate.dto.meal.MealCreateDto;
import com.example.meal_mate.dto.meal.MealResponseDto;
import com.example.meal_mate.dto.meal.MealUpdateDto;
import com.example.meal_mate.dto.user.UserResponseDto;
import com.example.meal_mate.entity.Meal;
import com.example.meal_mate.entity.User;
import com.example.meal_mate.exception.ResourceNotFoundException;
import com.example.meal_mate.repository.MealRepository;
import com.example.meal_mate.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Slf4j
@Transactional
public class MealService {
    
    private final MealRepository mealRepository;
    private final UserRepository userRepository;
    
    public MealResponseDto createMeal(MealCreateDto createDto) {
        log.info("Creating new meal for user ID: {}", createDto.getUserId());
        
        User user = userRepository.findById(createDto.getUserId())
                .orElseThrow(() -> new ResourceNotFoundException("User", "id", createDto.getUserId()));
        
        Meal meal = Meal.builder()
                .foodName(createDto.getFoodName())
                .calories(createDto.getCalories())
                .protein(createDto.getProtein())
                .carbs(createDto.getCarbs())
                .fat(createDto.getFat())
                .mealTime(createDto.getMealTime())
                .mealType(createDto.getMealType())
                .user(user)
                .build();
        
        Meal savedMeal = mealRepository.save(meal);
        log.info("Meal created successfully with ID: {}", savedMeal.getId());
        
        return convertToResponseDto(savedMeal);
    }
    
    @Transactional(readOnly = true)
    public MealResponseDto getMealById(Long id) {
        log.info("Fetching meal with ID: {}", id);
        
        Meal meal = mealRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Meal", "id", id));
        
        return convertToResponseDto(meal);
    }
    
    @Transactional(readOnly = true)
    public List<MealResponseDto> getAllMeals() {
        log.info("Fetching all meals");
        
        return mealRepository.findAll().stream()
                .map(this::convertToResponseDto)
                .collect(Collectors.toList());
    }
    
    @Transactional(readOnly = true)
    public List<MealResponseDto> getMealsByUserId(Long userId) {
        log.info("Fetching meals for user ID: {}", userId);
        
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User", "id", userId));
        
        return mealRepository.findByUserOrderByMealTimeDesc(user).stream()
                .map(this::convertToResponseDto)
                .collect(Collectors.toList());
    }
    
    @Transactional(readOnly = true)
    public List<MealResponseDto> getMealsByUserIdAndMealType(Long userId, String mealType) {
        log.info("Fetching meals for user ID: {} and meal type: {}", userId, mealType);
        
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User", "id", userId));
        
        return mealRepository.findByUserAndMealTypeOrderByMealTimeDesc(user, mealType).stream()
                .map(this::convertToResponseDto)
                .collect(Collectors.toList());
    }
    
    public MealResponseDto updateMeal(Long id, MealUpdateDto updateDto) {
        log.info("Updating meal with ID: {}", id);
        
        Meal meal = mealRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Meal", "id", id));
        
        meal.setName(updateDto.getFoodName());
        meal.setCalories(updateDto.getCalories());
        meal.setProtein(updateDto.getProtein());
        meal.setCarbs(updateDto.getCarbs());
        meal.setFat(updateDto.getFat());
        meal.setMealTime(updateDto.getMealTime());
        meal.setMealType(updateDto.getMealType());
        meal.setUpdatedAt(LocalDateTime.now());
        
        Meal updatedMeal = mealRepository.save(meal);
        log.info("Meal updated successfully: {}", updatedMeal.getName());
        
        return convertToResponseDto(updatedMeal);
    }
    
    public void deleteMeal(Long id) {
        log.info("Deleting meal with ID: {}", id);
        
        Meal meal = mealRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Meal", "id", id));
        
        mealRepository.delete(meal);
        log.info("Meal deleted successfully: {}", meal.getName());
    }

    private UserResponseDto convertToResponseDto(User user) {
        return UserResponseDto.builder()
                .id(user.getId())
                .username(user.getUsername())
                .email(user.getEmail())
                .nickname(user.getNickname())
                .age(user.getAge())
                .gender(user.getGender())
                .height(user.getHeight())
                .weight(user.getWeight())
                .targetWeight(user.getTargetWeight())
                .activityLevel(user.getActivityLevel())
                .dailyCalorieGoal(user.getDailyCalorieGoal())
                .createdAt(user.getCreatedAt())
                .updatedAt(user.getUpdatedAt())
                // 토큰은 null로 두거나, 회원가입시 토큰 생성해서 넣어줄 수 있음
                .build();
    }

    
    private MealResponseDto convertToResponseDto(Meal meal) {
        return MealResponseDto.builder()
                .id(meal.getId())
                .foodName(meal.getName())
                .calories(meal.getCalories())
                .protein(meal.getProtein())
                .carbs(meal.getCarbs())
                .fat(meal.getFat())
                .mealTime(meal.getMealTime())
                .mealType(meal.getMealType())
                .userId(meal.getUser().getId())
                .userName(meal.getUser().getUsername())
                .createdAt(meal.getCreatedAt())
                .updatedAt(meal.getUpdatedAt())
                .build();
    }

    @Transactional(readOnly = true)
    public List<MealResponseDto> getMealsByDate(LocalDate date) {
        log.info("Fetching meals for date: {}", date);

        // 하루의 시작과 끝
        LocalDateTime startOfDay = date.atStartOfDay();
        LocalDateTime endOfDay = date.atTime(23, 59, 59);

        List<Meal> meals = mealRepository.findByMealTimeBetween(startOfDay, endOfDay);

        return meals.stream()
                .map(this::convertToResponseDto)
                .collect(Collectors.toList());
    }

    /**
     * 특정 사용자의 특정 날짜에 해당하는 식사 기록들을 조회합니다.
     *
     * @param userId 조회할 사용자 ID
     * @param date 조회할 날짜 (예: 2025-07-09)
     * @return 해당 날짜에 먹은 식사 목록 (MealResponseDto 리스트 형태)
     */
    @Transactional(readOnly = true)
    public List<MealResponseDto> getMealsByUserIdAndDate(Long userId, LocalDate date) {
        log.info("Fetching meals for user ID: {} on date: {}", userId, date);

        // 사용자 정보 조회 (존재하지 않으면 예외 발생)
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User", "id", userId));

        // 하루의 시작 시간과 끝 시간 설정
        LocalDateTime startOfDay = date.atStartOfDay(); // 00:00:00
        LocalDateTime endOfDay = date.atTime(23, 59, 59); // 23:59:59

        // 해당 사용자에 대해 하루 동안 등록된 식사 조회
        List<Meal> meals = mealRepository.findByUserAndMealTimeBetween(user, startOfDay, endOfDay);

        // Meal 엔티티 리스트를 응답 DTO로 변환하여 반환
        return meals.stream()
                .map(this::convertToResponseDto)
                .collect(Collectors.toList());
    }

    /**
     * 특정 사용자가 특정 날짜에 섭취한 총 칼로리를 계산합니다.
     *
     * @param userId 사용자 ID
     * @param date 조회할 날짜 (예: 2025-07-09)
     * @return 총 칼로리 (double 형)
     */
    @Transactional(readOnly = true)
    public double getTotalCaloriesByUserAndDate(Long userId, LocalDate date) {
        log.info("Calculating total calories for user ID: {} on date: {}", userId, date);

        // 사용자 정보 조회
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User", "id", userId));

        // 하루 범위 설정
        LocalDateTime startOfDay = date.atStartOfDay();
        LocalDateTime endOfDay = date.atTime(23, 59, 59);

        // 해당 사용자, 해당 날짜의 식사 기록 조회
        List<Meal> meals = mealRepository.findByUserAndMealTimeBetween(user, startOfDay, endOfDay);

        // 칼로리 합산
        return meals.stream()
                .mapToDouble(Meal::getCalories)
                .sum();
    }

    /**
     * 특정 사용자의 기간별 평균 칼로리를 계산합니다.
     *
     * @param userId 사용자 ID
     * @param startDate 시작 날짜
     * @param endDate 끝 날짜
     * @return 평균 칼로리 (double 형)
     */
    @Transactional(readOnly = true)
    public double getAverageCaloriesByUserAndDateRange(Long userId, LocalDate startDate, LocalDate endDate) {
        log.info("Calculating average calories for user ID: {} from {} to {}", userId, startDate, endDate);

        // 사용자 정보 확인
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User", "id", userId));

        // 날짜 범위를 LocalDateTime으로 변환
        LocalDateTime start = startDate.atStartOfDay();
        LocalDateTime end = endDate.atTime(23, 59, 59);

        // 해당 범위의 식사 기록 조회
        List<Meal> meals = mealRepository.findByUserAndMealTimeBetween(user, start, end);

        if (meals.isEmpty()) {
            return 0.0;
        }

        // 평균 칼로리 계산
        return meals.stream()
                .mapToDouble(Meal::getCalories)
                .average()
                .orElse(0.0);
    }

}
