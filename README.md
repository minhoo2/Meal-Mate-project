# 🏃‍♂️ 핏로그 (FitLog)

**헬스케어 식단 및 운동 기록 웹 애플리케이션**

![Back-End](https://img.shields.io/badge/Back--End-Spring%20Boot-green)
![Front-End](https://img.shields.io/badge/Front--End-React%20%2B%20Vite-blue)
![Database](https://img.shields.io/badge/Database-MySQL-orange)
![Security](https://img.shields.io/badge/Security-JWT-red)

---

## 📌 프로젝트 소개

**핏로그(FitLog)** 는 식단과 운동 기록을 통해 건강한 삶을 도와주는 헬스케어 플랫폼입니다.  
사용자는 자신의 식사 내역과 운동 데이터를 기록하고, 칼로리 섭취/소모 통계를 한눈에 확인할 수 있습니다.

---

## 📂 프로젝트 구조



```
Meal-Mate_project/
├── meal-mate-BackEnd/           # Spring Boot 백엔드
│   ├── src/
│   │   ├── main/
│   │   │   ├── java/com/example/meal_mate/
│   │   │   │   ├── controller/
│   │   │   │   ├── service/
│   │   │   │   ├── repository/
│   │   │   │   ├── dto/
│   │   │   │   ├── entity/
│   │   │   │   └── MealMateApplication.java
│   │   │   └── resources/
│   │   │       ├── application.yml
│   │   │       └── static/
│   └── build.gradle
│
├── meal-mate-FrontEnd/          # React + Vite 프론트엔드
│   ├── public/
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── App.jsx
│   │   └── main.jsx
│   ├── index.html
│   └── vite.config.js
│
└── README.md                    # 프로젝트 설명 파일
```

## 🛠 주요 기능

### ✅ 사용자 인증
- JWT 기반 로그인 / 회원가입
- Access / Refresh Token 관리

### ✅ 식단 기록 (Meal)
- 음식 이름, 칼로리, 날짜 입력
- 사용자별 식사 내역 조회 API 제공

### ✅ 운동 기록 (Workout)
- 운동 이름, 운동 시간, 칼로리 소모량 기록
- 날짜별 운동 기록 조회
- 평균 칼로리 소모량 계산

### ✅ 통계 기능
- 날짜별 섭취 및 소모 칼로리 합산
- 기간별 평균 칼로리 분석

---

## 🔐 기술 스택

| 구분         | 사용 기술                                       |
|--------------|------------------------------------------------|
| **Back-End** | Java 17, Spring Boot, Spring Data JPA, MySQL, JWT |
| **Front-End**| Vite, React, Axios, React Router               |
| **Database** | MySQL                                          |
| **Dev Tools**| IntelliJ, VS Code, Git, GitHub, Postman        |

---



