import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getUserProfile } from '../api/userApi';
import { getMealsByUserIdAndDate, getTotalCaloriesByUserAndDate } from '../api/mealApi';
import { getWorkoutsByUserIdAndDate, getTotalCaloriesBurnedByUserAndDate, getTotalDurationByUserAndDate } from '../api/workoutApi';
import './DashboardPage.css';

const DashboardPage = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [todayMeals, setTodayMeals] = useState([]);
  const [todayWorkouts, setTodayWorkouts] = useState([]);
  const [todayCaloriesIntake, setTodayCaloriesIntake] = useState(0);
  const [todayCaloriesBurned, setTodayCaloriesBurned] = useState(0);
  const [todayWorkoutDuration, setTodayWorkoutDuration] = useState(0);
  const [weeklyStats, setWeeklyStats] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const userId = 1; // 실제로는 JWT 토큰에서 가져와야 함
  const today = new Date().toISOString().split('T')[0];

  // 컴포넌트 마운트 시 데이터 로드
  useEffect(() => {
    loadDashboardData();
  }, []);

  // 대시보드 데이터 로드
  const loadDashboardData = async () => {
    setLoading(true);
    setError('');

    try {
      // 사용자 프로필 로드
      const userData = await getUserProfile();
      setUser(userData);

      // 오늘 식사 데이터 로드
      const mealsData = await getMealsByUserIdAndDate(userId, today);
      setTodayMeals(mealsData);

      // 오늘 칼로리 섭취량
      const caloriesIntake = await getTotalCaloriesByUserAndDate(userId, today);
      setTodayCaloriesIntake(caloriesIntake);

      // 오늘 운동 데이터 로드
      const workoutsData = await getWorkoutsByUserIdAndDate(userId, today);
      setTodayWorkouts(workoutsData);

      // 오늘 칼로리 소모량
      const caloriesBurned = await getTotalCaloriesBurnedByUserAndDate(userId, today);
      setTodayCaloriesBurned(caloriesBurned);

      // 오늘 운동 시간
      const workoutDuration = await getTotalDurationByUserAndDate(userId, today);
      setTodayWorkoutDuration(workoutDuration);

      // 주간 통계 로드
      await loadWeeklyStats();

    } catch (error) {
      console.error('대시보드 데이터 로드 실패:', error);
      setError('데이터를 불러오는데 실패했습니다.');
    } finally {
      setLoading(false);
    }
  };

  // 주간 통계 로드
  const loadWeeklyStats = async () => {
    try {
      const stats = [];
      const currentDate = new Date();
      
      for (let i = 6; i >= 0; i--) {
        const date = new Date(currentDate);
        date.setDate(date.getDate() - i);
        const dateString = date.toISOString().split('T')[0];
        
        const caloriesIntake = await getTotalCaloriesByUserAndDate(userId, dateString);
        const caloriesBurned = await getTotalCaloriesBurnedByUserAndDate(userId, dateString);
        const workoutDuration = await getTotalDurationByUserAndDate(userId, dateString);
        
        stats.push({
          date: dateString,
          dayName: date.toLocaleDateString('ko-KR', { weekday: 'short' }),
          caloriesIntake,
          caloriesBurned,
          workoutDuration,
          netCalories: caloriesIntake - caloriesBurned
        });
      }
      
      setWeeklyStats(stats);
    } catch (error) {
      console.error('주간 통계 로드 실패:', error);
    }
  };

  // 기초대사율 계산
  const calculateBMR = (age, height, weight, gender = 'male') => {
    if (!age || !height || !weight) return null;
    let bmr;
    if (gender === 'male') {
      bmr = 88.362 + (13.397 * weight) + (4.799 * height) - (5.677 * age);
    } else {
      bmr = 447.593 + (9.247 * weight) + (3.098 * height) - (4.330 * age);
    }
    return Math.round(bmr);
  };

  // 권장 칼로리 계산
  const calculateRecommendedCalories = (bmr, activityLevel) => {
    if (!bmr || !activityLevel) return null;
    
    const activityMultipliers = {
      'SEDENTARY': 1.2,
      'LIGHTLY_ACTIVE': 1.375,
      'MODERATELY_ACTIVE': 1.55,
      'VERY_ACTIVE': 1.725,
      'EXTREMELY_ACTIVE': 1.9
    };
    
    const multiplier = activityMultipliers[activityLevel] || 1.2;
    return Math.round(bmr * multiplier);
  };

  // BMI 계산
  const calculateBMI = (height, weight) => {
    if (!height || !weight) return null;
    const heightInMeters = height / 100;
    const bmi = weight / (heightInMeters * heightInMeters);
    return bmi.toFixed(1);
  };

  // BMI 상태 분류
  const getBMICategory = (bmi) => {
    if (!bmi) return { category: '', color: '#6c757d' };
    const bmiValue = parseFloat(bmi);
    if (bmiValue < 18.5) return { category: '저체중', color: '#17a2b8' };
    if (bmiValue < 25) return { category: '정상', color: '#28a745' };
    if (bmiValue < 30) return { category: '과체중', color: '#ffc107' };
    return { category: '비만', color: '#dc3545' };
  };

  // 네비게이션 핸들러
  const handleNavigate = (path) => {
    navigate(path);
  };

  // 로그아웃 처리
  const handleLogout = () => {
    localStorage.removeItem('accessToken');
    navigate('/login');
  };

  // 시간 포맷팅
  const formatDuration = (minutes) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    if (hours > 0) {
      return `${hours}시간 ${mins}분`;
    }
    return `${mins}분`;
  };

  // 칼로리 진행률 계산
  const getCaloriesProgress = () => {
    if (!user) return 0;
    const bmr = calculateBMR(user.age, user.height, user.weight);
    const recommended = calculateRecommendedCalories(bmr, user.activityLevel);
    if (!recommended) return 0;
    return Math.min((todayCaloriesIntake / recommended) * 100, 100);
  };

  if (loading) {
    return (
      <div className="dashboard-container">
        <div className="loading">데이터를 불러오는 중...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="dashboard-container">
        <div className="error-message">{error}</div>
      </div>
    );
  }

  const bmr = user ? calculateBMR(user.age, user.height, user.weight) : null;
  const recommendedCalories = user ? calculateRecommendedCalories(bmr, user.activityLevel) : null;
  const bmi = user ? calculateBMI(user.height, user.weight) : null;
  const bmiCategory = getBMICategory(bmi);
  const netCalories = todayCaloriesIntake - todayCaloriesBurned;

  return (
    <div className="dashboard-container">
      {/* 헤더 */}
      <div className="dashboard-header">
        <div className="header-content">
          <h1>대시보드</h1>
          <div className="user-info">
            {user && (
              <div className="user-welcome">
                안녕하세요, {user.name}님! 👋
              </div>
            )}
            <button onClick={handleLogout} className="logout-btn">
              로그아웃
            </button>
          </div>
        </div>
        <div className="date-info">
          {new Date().toLocaleDateString('ko-KR', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            weekday: 'long'
          })}
        </div>
      </div>

      {/* 네비게이션 메뉴 */}
      <div className="dashboard-nav">
        <button 
          className="nav-btn active"
          onClick={() => handleNavigate('/dashboard')}
        >
          🏠 대시보드
        </button>
        <button 
          className="nav-btn"
          onClick={() => handleNavigate('/profile')}
        >
          👤 프로필
        </button>
        <button 
          className="nav-btn"
          onClick={() => handleNavigate('/meals')}
        >
          🍽️ 식사관리
        </button>
        <button 
          className="nav-btn"
          onClick={() => handleNavigate('/workouts')}
        >
          💪 운동관리
        </button>
      </div>

      {/* 오늘의 요약 */}
      <div className="today-summary">
        <h2>오늘의 요약</h2>
        <div className="summary-cards">
          <div className="summary-card calories-intake">
            <div className="card-icon">🍽️</div>
            <div className="card-content">
              <h3>섭취 칼로리</h3>
              <div className="card-value">{todayCaloriesIntake} kcal</div>
              {recommendedCalories && (
                <div className="card-subtitle">
                  권장: {recommendedCalories} kcal
                </div>
              )}
              <div className="progress-bar">
                <div 
                  className="progress-fill"
                  style={{ width: `${getCaloriesProgress()}%` }}
                />
              </div>
            </div>
          </div>

          <div className="summary-card calories-burned">
            <div className="card-icon">🔥</div>
            <div className="card-content">
              <h3>소모 칼로리</h3>
              <div className="card-value">{todayCaloriesBurned} kcal</div>
              <div className="card-subtitle">운동 {todayWorkouts.length}회</div>
            </div>
          </div>

          <div className="summary-card net-calories">
            <div className="card-icon">⚖️</div>
            <div className="card-content">
              <h3>순 칼로리</h3>
              <div className={`card-value ${netCalories > 0 ? 'positive' : 'negative'}`}>
                {netCalories > 0 ? '+' : ''}{netCalories} kcal
              </div>
              <div className="card-subtitle">
                {netCalories > 0 ? '칼로리 잉여' : '칼로리 부족'}
              </div>
            </div>
          </div>

          <div className="summary-card workout-time">
            <div className="card-icon">⏱️</div>
            <div className="card-content">
              <h3>운동 시간</h3>
              <div className="card-value">{formatDuration(todayWorkoutDuration)}</div>
              <div className="card-subtitle">총 운동시간</div>
            </div>
          </div>
        </div>
      </div>

      {/* 건강 정보 */}
      {user && user.height && user.weight && (
        <div className="health-info">
          <h2>건강 정보</h2>
          <div className="health-cards">
            <div className="health-card">
              <h3>BMI</h3>
              <div className="health-value">
                <span className="value">{bmi}</span>
                <span 
                  className="category"
                  style={{ color: bmiCategory.color }}
                >
                  {bmiCategory.category}
                </span>
              </div>
            </div>
            
            {bmr && (
              <div className="health-card">
                <h3>기초대사율</h3>
                <div className="health-value">
                  <span className="value">{bmr}</span>
                  <span className="unit">kcal/일</span>
                </div>
              </div>
            )}
            
            {recommendedCalories && (
              <div className="health-card">
                <h3>권장 칼로리</h3>
                <div className="health-value">
                  <span className="value">{recommendedCalories}</span>
                  <span className="unit">kcal/일</span>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* 주간 통계 */}
      <div className="weekly-stats">
        <h2>주간 통계</h2>
        <div className="stats-chart">
          <div className="chart-labels">
            <span>섭취</span>
            <span>소모</span>
            <span>순칼로리</span>
          </div>
          <div className="chart-bars">
            {weeklyStats.map((stat, index) => (
              <div key={index} className="day-stat">
                <div className="day-label">{stat.dayName}</div>
                <div className="bars">
                  <div 
                    className="bar intake"
                    style={{ height: `${Math.max((stat.caloriesIntake / 3000) * 100, 5)}px` }}
                    title={`섭취: ${stat.caloriesIntake} kcal`}
                  />
                  <div 
                    className="bar burned"
                    style={{ height: `${Math.max((stat.caloriesBurned / 1000) * 100, 5)}px` }}
                    title={`소모: ${stat.caloriesBurned} kcal`}
                  />
                </div>
                <div className={`net-calories ${stat.netCalories >= 0 ? 'positive' : 'negative'}`}>
                  {stat.netCalories >= 0 ? '+' : ''}{stat.netCalories}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* 최근 활동 */}
      <div className="recent-activities">
        <div className="recent-meals">
          <h2>오늘의 식사</h2>
          {todayMeals.length > 0 ? (
            <div className="activity-list">
              {todayMeals.slice(0, 5).map((meal, index) => (
                <div key={meal.id} className="activity-item meal-item">
                  <div className="activity-info">
                    <span className="activity-name">{meal.foodName}</span>
                    <span className="activity-type">{meal.mealType}</span>
                  </div>
                  <div className="activity-value">{meal.calories} kcal</div>
                </div>
              ))}
            </div>
          ) : (
            <div className="no-activity">
              <p>오늘 등록된 식사가 없습니다</p>
              <button 
                className="add-btn"
                onClick={() => handleNavigate('/meals')}
              >
                식사 추가하기
              </button>
            </div>
          )}
        </div>

        <div className="recent-workouts">
          <h2>오늘의 운동</h2>
          {todayWorkouts.length > 0 ? (
            <div className="activity-list">
              {todayWorkouts.slice(0, 5).map((workout, index) => (
                <div key={workout.id} className="activity-item workout-item">
                  <div className="activity-info">
                    <span className="activity-name">{workout.name}</span>
                    <span className="activity-type">{formatDuration(workout.duration)}</span>
                  </div>
                  <div className="activity-value">{workout.caloriesBurned} kcal</div>
                </div>
              ))}
            </div>
          ) : (
            <div className="no-activity">
              <p>오늘 등록된 운동이 없습니다</p>
              <button 
                className="add-btn"
                onClick={() => handleNavigate('/workouts')}
              >
                운동 추가하기
              </button>
            </div>
          )}
        </div>
      </div>

      {/* 빠른 액션 */}
      <div className="quick-actions">
        <h2>빠른 액션</h2>
        <div className="action-buttons">
          <button 
            className="action-btn meal-btn"
            onClick={() => handleNavigate('/meals')}
          >
            <span className="action-icon">🍽️</span>
            <span>식사 기록</span>
          </button>
          <button 
            className="action-btn workout-btn"
            onClick={() => handleNavigate('/workouts')}
          >
            <span className="action-icon">💪</span>
            <span>운동 기록</span>
          </button>
          <button 
            className="action-btn profile-btn"
            onClick={() => handleNavigate('/profile')}
          >
            <span className="action-icon">👤</span>
            <span>프로필 수정</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;