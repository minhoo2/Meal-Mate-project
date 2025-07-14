package com.example.meal_mate.config;

import io.jsonwebtoken.*;
import org.springframework.stereotype.Service;

import java.util.Date;

@Service
public class JwtTokenProvider {

    private final String secretKey = "yourSecretKey"; // 보안 위해 환경변수로 관리 권장
    private final long validityInMilliseconds = 3600000; // 1시간

    // JWT 토큰 생성 메서드
    public String createToken(String userEmail) {
        Date now = new Date();
        Date validity = new Date(now.getTime() + validityInMilliseconds);

        return Jwts.builder()
                .setSubject(userEmail)          // 토큰 제목 (식별자)
                .setIssuedAt(now)               // 발급 시간
                .setExpiration(validity)        // 만료 시간
                .signWith(SignatureAlgorithm.HS256, secretKey) // 서명 알고리즘 및 키
                .compact();
    }

    // 토큰에서 사용자 이메일(주제) 추출
    public String getUserEmail(String token) {
        return Jwts.parser()
                .setSigningKey(secretKey)
                .parseClaimsJws(token)
                .getBody()
                .getSubject();
    }

    // 토큰 유효성 검증 메서드
    public boolean validateToken(String token) {
        try {
            Jwts.parser().setSigningKey(secretKey).parseClaimsJws(token);
            return true; // 토큰 정상
        } catch (ExpiredJwtException | UnsupportedJwtException | MalformedJwtException |
                 SignatureException | IllegalArgumentException e) {
            // 예외 발생시 토큰 무효
            return false;
        }
    }
}
