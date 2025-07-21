package com.example.meal_mate.service;

import com.example.meal_mate.dto.user.UserLoginDto;
import com.example.meal_mate.dto.user.UserRegistrationDto;
import com.example.meal_mate.dto.user.UserResponseDto;
import com.example.meal_mate.dto.user.UserUpdateDto;
import com.example.meal_mate.entity.User;
import com.example.meal_mate.exception.DuplicateResourceException;
import com.example.meal_mate.exception.ResourceNotFoundException;
import com.example.meal_mate.repository.UserRepository;
import com.example.meal_mate.config.JwtTokenProvider;  // JwtTokenProvider import 추가
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Slf4j
@Transactional
public class UserService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtTokenProvider jwtTokenProvider;  // JwtTokenProvider 주입 추가

    public UserResponseDto registerUser(UserRegistrationDto registrationDto) {
        log.info("Registering new user with email: {}", registrationDto.getEmail());

        if (userRepository.existsByEmail(registrationDto.getEmail())) {
            throw new DuplicateResourceException("이미 등록된 이메일입니다: " + registrationDto.getEmail());
        }

        User user = User.builder()
                .username(registrationDto.getUsername())
                .email(registrationDto.getEmail())
                .password(passwordEncoder.encode(registrationDto.getPassword()))
                .nickname(registrationDto.getNickname())
                .age(registrationDto.getAge())
                .gender(registrationDto.getGender())
                .height(registrationDto.getHeight())
                .weight(registrationDto.getWeight())
                .activityLevel(registrationDto.getActivityLevel())
                .build();

        User savedUser = userRepository.save(user);
        log.info("User registered successfully with ID: {}", savedUser.getId());

        // ✅ 토큰 생성
        String token = jwtTokenProvider.createToken(savedUser.getEmail());

        // ✅ DTO에 담아서 반환
        return convertToResponseDto(savedUser, token);
    }

    public UserResponseDto loginUser(UserLoginDto loginDto) {
        log.info("User login attempt with usernameOrEmail: {}", loginDto.getUsernameOrEmail());

        // 이메일 또는 사용자명으로 사용자 찾기
        User user = userRepository.findByUsernameOrEmail(loginDto.getUsernameOrEmail())
                .orElseThrow(() -> new ResourceNotFoundException("사용자를 찾을 수 없습니다: " + loginDto.getUsernameOrEmail()));

        if (!passwordEncoder.matches(loginDto.getPassword(), user.getPassword())) {
            throw new RuntimeException("비밀번호가 일치하지 않습니다");
        }

        // JWT 토큰 생성
        String token = jwtTokenProvider.createToken(user.getEmail());

        log.info("User logged in successfully: {}", user.getEmail());

        // 토큰 포함하여 반환 (직접 빌더 사용)
        return UserResponseDto.builder()
                .id(user.getId())
                .email(user.getEmail())
                .nickname(user.getNickname())
                .age(user.getAge())
                .gender(user.getGender())
                .height(user.getHeight())
                .weight(user.getWeight())
                .activityLevel(user.getActivityLevel())
                .createdAt(user.getCreatedAt())
                .updatedAt(user.getUpdatedAt())
                .token(token)  // JWT 토큰 추가 필드
                .build();
    }

    @Transactional(readOnly = true)
    public UserResponseDto getUserById(Long id) {
        log.info("Fetching user with ID: {}", id);

        User user = userRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("User", "id", id));

        return convertToResponseDto(user);
    }

    @Transactional(readOnly = true)
    public List<UserResponseDto> getAllUsers() {
        log.info("Fetching all users");

        return userRepository.findAll().stream()
                .map(this::convertToResponseDto)
                .collect(Collectors.toList());
    }

    public UserResponseDto updateUser(Long id, UserUpdateDto updateDto) {
        log.info("Updating user with ID: {}", id);

        User user = userRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("User", "id", id));

        if (!user.getEmail().equals(updateDto.getEmail()) &&
                userRepository.existsByEmail(updateDto.getEmail())) {
            throw new DuplicateResourceException("이미 등록된 이메일입니다: " + updateDto.getEmail());
        }

        user.setEmail(updateDto.getEmail());
        user.setNickname(updateDto.getNickname());
        user.setAge(updateDto.getAge());
        user.setGender(updateDto.getGender());
        user.setHeight(updateDto.getHeight());
        user.setWeight(updateDto.getWeight());
        user.setActivityLevel(updateDto.getActivityLevel());
        user.setUpdatedAt(LocalDateTime.now());

        User updatedUser = userRepository.save(user);
        log.info("User updated successfully: {}", updatedUser.getEmail());

        return convertToResponseDto(updatedUser);
    }

    public void deleteUser(Long id) {
        log.info("Deleting user with ID: {}", id);

        User user = userRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("User", "id", id));

        userRepository.delete(user);
        log.info("User deleted successfully: {}", user.getEmail());
    }

    @Transactional(readOnly = true)
    public UserResponseDto getUserByEmail(String email) {
        log.info("Fetching user with email: {}", email);

        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("사용자를 찾을 수 없습니다: " + email));

        return convertToResponseDto(user);
    }

    @Transactional(readOnly = true)
    public boolean existsByEmail(String email) {
        log.info("Checking if email exists: {}", email);
        return userRepository.existsByEmail(email);
    }

    private UserResponseDto convertToResponseDto(User user) {
        return UserResponseDto.builder()
                .id(user.getId())
                .email(user.getEmail())
                .nickname(user.getNickname())
                .age(user.getAge())
                .gender(user.getGender())
                .height(user.getHeight())
                .weight(user.getWeight())
                .activityLevel(user.getActivityLevel())
                .createdAt(user.getCreatedAt())
                .updatedAt(user.getUpdatedAt())
                // 토큰은 로그인 시에만 포함하므로 여기서는 제외
                .build();
    }

    private UserResponseDto convertToResponseDto(User user, String token) {
        UserResponseDto dto = convertToResponseDto(user);
        dto.setToken(token); // 혹은 builder 패턴 사용 시 builder.token(token)
        return dto;
    }
}
