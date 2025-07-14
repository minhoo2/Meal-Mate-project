package com.example.meal_mate.service;

import com.example.meal_mate.dto.workout.WorkoutCreateDto;
import com.example.meal_mate.dto.workout.WorkoutResponseDto;
import com.example.meal_mate.dto.workout.WorkoutUpdateDto;
import com.example.meal_mate.entity.User;
import com.example.meal_mate.entity.Workout;
import com.example.meal_mate.exception.ResourceNotFoundException;
import com.example.meal_mate.repository.UserRepository;
import com.example.meal_mate.repository.WorkoutRepository;
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
public class WorkoutService {
    
    private final WorkoutRepository workoutRepository;
    private final UserRepository userRepository;
    
    public WorkoutResponseDto createWorkout(WorkoutCreateDto createDto) {
        log.info("Creating new workout for user ID: {}", createDto.getUserId());
        
        User user = userRepository.findById(createDto.getUserId())
                .orElseThrow(() -> new ResourceNotFoundException("User", "id", createDto.getUserId()));
        
        Workout workout = Workout.builder()
                .exerciseName(createDto.getName())
                .duration(createDto.getDuration())
                .caloriesBurned(createDto.getCaloriesBurned())
                .workoutTime(createDto.getWorkoutTime())
                .memo(createDto.getNotes())
                .user(user)
                .build();
        
        Workout savedWorkout = workoutRepository.save(workout);
        log.info("Workout created successfully with ID: {}", savedWorkout.getId());
        
        return convertToResponseDto(savedWorkout);
    }
    
    @Transactional(readOnly = true)
    public WorkoutResponseDto getWorkoutById(Long id) {
        log.info("Fetching workout with ID: {}", id);
        
        Workout workout = workoutRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Workout", "id", id));
        
        return convertToResponseDto(workout);
    }
    
    @Transactional(readOnly = true)
    public List<WorkoutResponseDto> getAllWorkouts() {
        log.info("Fetching all workouts");
        
        return workoutRepository.findAll().stream()
                .map(this::convertToResponseDto)
                .collect(Collectors.toList());
    }
    
    @Transactional(readOnly = true)
    public List<WorkoutResponseDto> getWorkoutsByUserId(Long userId) {
        log.info("Fetching workouts for user ID: {}", userId);
        
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User", "id", userId));
        
        return workoutRepository.findByUserOrderByWorkoutTimeDesc(user).stream()
                .map(this::convertToResponseDto)
                .collect(Collectors.toList());
    }
    
    public WorkoutResponseDto updateWorkout(Long id, WorkoutUpdateDto updateDto) {
        log.info("Updating workout with ID: {}", id);
        
        Workout workout = workoutRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Workout", "id", id));
        
        workout.setExerciseName(updateDto.getName());
        workout.setDuration(updateDto.getDuration());
        workout.setCaloriesBurned(updateDto.getCaloriesBurned());
        workout.setWorkoutTime(updateDto.getWorkoutTime());
        workout.setMemo(updateDto.getNotes());
        workout.setUpdatedAt(LocalDateTime.now());
        
        Workout updatedWorkout = workoutRepository.save(workout);
        log.info("Workout updated successfully: {}", updatedWorkout.getExerciseName());
        
        return convertToResponseDto(updatedWorkout);
    }
    
    public void deleteWorkout(Long id) {
        log.info("Deleting workout with ID: {}", id);
        
        Workout workout = workoutRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Workout", "id", id));
        
        workoutRepository.delete(workout);
        log.info("Workout deleted successfully: {}", workout.getExerciseName());
    }
    
    @Transactional(readOnly = true)
    public List<WorkoutResponseDto> getWorkoutsByDate(LocalDate date) {
        log.info("Fetching workouts for date: {}", date);
        
        return workoutRepository.findByWorkoutTimeBetweenOrderByWorkoutTimeDesc(
                date.atStartOfDay(),
                date.atTime(23, 59, 59)
        ).stream()
                .map(this::convertToResponseDto)
                .collect(Collectors.toList());
    }
    
    @Transactional(readOnly = true)
    public List<WorkoutResponseDto> getWorkoutsByUserIdAndDate(Long userId, LocalDate date) {
        log.info("Fetching workouts for user ID: {} on date: {}", userId, date);
        
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User", "id", userId));
        
        return workoutRepository.findByUserAndWorkoutTimeBetweenOrderByWorkoutTimeDesc(
                user,
                date.atStartOfDay(),
                date.atTime(23, 59, 59)
        ).stream()
                .map(this::convertToResponseDto)
                .collect(Collectors.toList());
    }
    
    @Transactional(readOnly = true)
    public double getTotalCaloriesBurnedByUserAndDate(Long userId, LocalDate date) {
        log.info("Calculating total calories burned for user ID: {} on date: {}", userId, date);
        
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User", "id", userId));
        
        return workoutRepository.findByUserAndWorkoutTimeBetweenOrderByWorkoutTimeDesc(
                user,
                date.atStartOfDay(),
                date.atTime(23, 59, 59)
        ).stream()
                .mapToDouble(Workout::getCaloriesBurned)
                .sum();
    }
    
    @Transactional(readOnly = true)
    public double getAverageCaloriesBurnedByUserAndDateRange(Long userId, LocalDate startDate, LocalDate endDate) {
        log.info("Calculating average calories burned for user ID: {} from {} to {}", userId, startDate, endDate);
        
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User", "id", userId));
        
        List<Workout> workouts = workoutRepository.findByUserAndWorkoutTimeBetweenOrderByWorkoutTimeDesc(
                user,
                startDate.atStartOfDay(),
                endDate.atTime(23, 59, 59)
        );
        
        return workouts.stream()
                .mapToDouble(Workout::getCaloriesBurned)
                .average()
                .orElse(0.0);
    }
    
    @Transactional(readOnly = true)
    public List<WorkoutResponseDto> getWorkoutsByUserIdAndType(Long userId, String workoutType) {
        log.info("Fetching workouts for user ID: {} with type: {}", userId, workoutType);
        
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User", "id", userId));
        
        return workoutRepository.findByUserAndExerciseNameContainingIgnoreCaseOrderByWorkoutTimeDesc(
                user, workoutType
        ).stream()
                .map(this::convertToResponseDto)
                .collect(Collectors.toList());
    }
    
    @Transactional(readOnly = true)
    public int getTotalDurationByUserAndDate(Long userId, LocalDate date) {
        log.info("Calculating total workout duration for user ID: {} on date: {}", userId, date);
        
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User", "id", userId));
        
        return workoutRepository.findByUserAndWorkoutTimeBetweenOrderByWorkoutTimeDesc(
                user,
                date.atStartOfDay(),
                date.atTime(23, 59, 59)
        ).stream()
                .mapToInt(Workout::getDuration)
                .sum();
    }
    
    private WorkoutResponseDto convertToResponseDto(Workout workout) {
        return WorkoutResponseDto.builder()
                .id(workout.getId())
                .name(workout.getExerciseName())
                .duration(workout.getDuration())
                .caloriesBurned(workout.getCaloriesBurned())
                .workoutTime(workout.getWorkoutTime())
                .notes(workout.getMemo())
                .userId(workout.getUser().getId())
                .userName(workout.getUser().getNickname())
                .createdAt(workout.getCreatedAt())
                .updatedAt(workout.getUpdatedAt())
                .build();
    }
}
