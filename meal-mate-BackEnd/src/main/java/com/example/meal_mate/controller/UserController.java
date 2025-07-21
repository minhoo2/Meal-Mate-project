package com.example.meal_mate.controller;

import com.example.meal_mate.dto.user.UserLoginDto;
import com.example.meal_mate.dto.user.UserRegistrationDto;
import com.example.meal_mate.dto.user.UserResponseDto;
import com.example.meal_mate.dto.user.UserUpdateDto;
import com.example.meal_mate.service.UserService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api")
@RequiredArgsConstructor
@CrossOrigin(origins = {"http://localhost:3000", "http://localhost:5173"})
public class UserController {

    private final UserService userService;

    /**
     * 사용자 회원가입
     */
    @PostMapping("/users/register")
    public ResponseEntity<UserResponseDto> registerUser(@Valid @RequestBody UserRegistrationDto registrationDto) {
        UserResponseDto userResponse = userService.registerUser(registrationDto);
        return ResponseEntity.status(HttpStatus.CREATED).body(userResponse);
    }

    /**
     * 사용자 로그인 (JWT 토큰 포함된 응답 반환)
     */
    @PostMapping("/users/login")
    public ResponseEntity<UserResponseDto> loginUser(@Valid @RequestBody UserLoginDto loginDto) {
        UserResponseDto userResponse = userService.loginUser(loginDto);
        return ResponseEntity.ok(userResponse); // userResponse.token 에 JWT 토큰 포함됨
    }

    /**
     * 모든 사용자 조회
     */
    @GetMapping("/users")
    public ResponseEntity<List<UserResponseDto>> getAllUsers() {
        List<UserResponseDto> users = userService.getAllUsers();
        return ResponseEntity.ok(users);
    }

    /**
     * 특정 사용자 조회
     */
    @GetMapping("/users/{id}")
    public ResponseEntity<UserResponseDto> getUserById(@PathVariable Long id) {
        UserResponseDto user = userService.getUserById(id);
        return ResponseEntity.ok(user);
    }

    /**
     * 이메일로 사용자 조회
     */
    @GetMapping("/users/email/{email}")
    public ResponseEntity<UserResponseDto> getUserByEmail(@PathVariable String email) {
        UserResponseDto user = userService.getUserByEmail(email);
        return ResponseEntity.ok(user);
    }

    /**
     * 사용자 정보 수정
     */
    @PutMapping("/users/{id}")
    public ResponseEntity<UserResponseDto> updateUser(
            @PathVariable Long id,
            @Valid @RequestBody UserUpdateDto updateDto) {
        UserResponseDto updatedUser = userService.updateUser(id, updateDto);
        return ResponseEntity.ok(updatedUser);
    }

    /**
     * 사용자 삭제
     */
    @DeleteMapping("/users/{id}")
    public ResponseEntity<Void> deleteUser(@PathVariable Long id) {
        userService.deleteUser(id);
        return ResponseEntity.noContent().build();
    }

    /**
     * 사용자 이메일 중복 확인
     */
    @GetMapping("/users/check-email")
    public ResponseEntity<Boolean> checkEmailExists(@RequestParam String email) {
        boolean exists = userService.existsByEmail(email);
        return ResponseEntity.ok(exists);
    }

    /**
     * 사용자 프로필 조회 (JWT 토큰 기반)
     */
    @GetMapping("/user/profile")
    public ResponseEntity<UserResponseDto> getUserProfile(@RequestHeader("Authorization") String token) {
        try {
            // JWT 토큰에서 사용자 ID 추출하여 프로필 조회
            // 임시로 ID 1로 설정 (실제로는 JWT 토큰에서 추출해야 함)
            UserResponseDto user = userService.getUserById(1L);
            return ResponseEntity.ok(user);
        } catch (Exception e) {
            throw new RuntimeException("프로필 조회 중 오류가 발생했습니다: " + e.getMessage(), e);
        }
    }

    /**
     * 사용자 프로필 업데이트 (JWT 토큰 기반)
     */
    @PutMapping("/user/profile")
    public ResponseEntity<UserResponseDto> updateUserProfile(
            @RequestHeader("Authorization") String token,
            @Valid @RequestBody UserUpdateDto updateDto) {
        try {
            // JWT 토큰에서 사용자 ID 추출하여 프로필 업데이트
            // 임시로 ID 1로 설정 (실제로는 JWT 토큰에서 추출해야 함)
            UserResponseDto updatedUser = userService.updateUser(1L, updateDto);
            return ResponseEntity.ok(updatedUser);
        } catch (Exception e) {
            throw new RuntimeException("프로필 업데이트 중 오류가 발생했습니다: " + e.getMessage(), e);
        }
    }
}
