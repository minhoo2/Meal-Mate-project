package com.example.meal_mate.repository;

import com.example.meal_mate.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface UserRepository extends JpaRepository<User, Long> {
    
    // 사용자명으로 사용자 찾기
    Optional<User> findByUsername(String username);
    
    // 이메일로 사용자 찾기
    Optional<User> findByEmail(String email);
    
    // 사용자명 중복 검사
    boolean existsByUsername(String username);
    
    // 이메일 중복 검사
    boolean existsByEmail(String email);
    
    // 사용자명 또는 이메일로 사용자 찾기
    @Query("SELECT u FROM User u WHERE u.username = :usernameOrEmail OR u.email = :usernameOrEmail")
    Optional<User> findByUsernameOrEmail(@Param("usernameOrEmail") String usernameOrEmail);
    
    // 활동 레벨별 사용자 수 조회
    @Query("SELECT COUNT(u) FROM User u WHERE u.activityLevel = :activityLevel")
    long countByActivityLevel(@Param("activityLevel") String activityLevel);
    
    // 목표 체중 설정한 사용자 조회
    @Query("SELECT u FROM User u WHERE u.targetWeight IS NOT NULL")
    List<User> findUsersWithTargetWeight();
}
