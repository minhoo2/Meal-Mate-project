import React, { useState, useEffect } from 'react';
import { getUserProfile } from '../api/userApi';
import { useNavigate } from 'react-router-dom';
import './ProfileViewPage.css';

const ProfileViewPage = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState({
    name: '',
    email: '',
    age: '',
    height: '',
    weight: '',
    activityLevel: '',
    dietaryRestrictions: '',
    profileImage: ''
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // BMI 계산 함수
  const calculateBMI = (height, weight) => {
    if (!height || !weight) return null;
    const heightInMeters = height / 100;
    const bmi = weight / (heightInMeters * heightInMeters);
    return bmi.toFixed(1);
  };

  // BMI 상태 분류
  const getBMICategory = (bmi) => {
    if (!bmi) return '';
    const bmiValue = parseFloat(bmi);
    if (bmiValue < 18.5) return { category: '저체중', color: '#17a2b8' };
    if (bmiValue < 25) return { category: '정상', color: '#28a745' };
    if (bmiValue < 30) return { category: '과체중', color: '#ffc107' };
    return { category: '비만', color: '#dc3545' };
  };

  // 기초대사율 계산 (Harris-Benedict 공식)
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

  // 활동 수준 텍스트 변환
  const getActivityLevelText = (level) => {
    const levels = {
      'SEDENTARY': '좌식 생활',
      'LIGHTLY_ACTIVE': '가벼운 활동',
      'MODERATELY_ACTIVE': '보통 활동',
      'VERY_ACTIVE': '활발한 활동',
      'EXTREMELY_ACTIVE': '매우 활발한 활동'
    };
    return levels[level] || level;
  };

  // 사용자 프로필 불러오기
  const fetchUserProfile = async () => {
    setLoading(true);
    setError('');
    
    try {
      const userData = await getUserProfile();
      setUser(userData);
    } catch (error) {
      console.error('프로필 불러오기 실패:', error);
      if (error.message.includes('인증이 만료')) {
        setError('인증이 만료되었습니다. 다시 로그인해주세요.');
        handleLogout();
      } else if (error.message.includes('404') || error.message.includes('프로필을 찾을 수 없습니다')) {
        setError('프로필 정보가 없습니다. 프로필을 먼저 생성해주세요.');
        setTimeout(() => {
          navigate('/profile');
        }, 2000);
      } else {
        setError(error.message || '프로필을 불러오는데 실패했습니다.');
      }
    } finally {
      setLoading(false);
    }
  };

  // 로그아웃 처리
  const handleLogout = () => {
    localStorage.removeItem('accessToken');
    navigate('/login');
  };

  // 프로필 편집 페이지로 이동
  const handleEditProfile = () => {
    navigate('/profile');
  };

  // 메인 페이지로 이동
  const handleGoToMain = () => {
    navigate('/main'); // 메인 페이지 경로에 맞게 수정
  };

  useEffect(() => {
    fetchUserProfile();
  }, []);

  // 계산된 값들
  const bmi = calculateBMI(user.height, user.weight);
  const bmiCategory = getBMICategory(bmi);
  const bmr = calculateBMR(user.age, user.height, user.weight);
  const recommendedCalories = calculateRecommendedCalories(bmr, user.activityLevel);

  if (loading) {
    return (
      <div className="profile-view-container">
        <div className="profile-view-card">
          <div className="loading">데이터를 불러오는 중...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="profile-view-container">
      <div className="profile-view-card">
        <div className="profile-view-header">
          <h2>내 프로필</h2>
          <div className="header-buttons">
            <button onClick={handleEditProfile} className="edit-profile-btn">
              프로필 편집
            </button>
            <button onClick={handleLogout} className="logout-btn">
              로그아웃
            </button>
          </div>
        </div>
        
        {error && (
          <div className="error-message">
            {error}
          </div>
        )}

        {/* 프로필 이미지 */}
        <div className="profile-image-section">
          <div className="profile-image-container">
            {user.profileImage ? (
              <img src={user.profileImage} alt="프로필" className="profile-image" />
            ) : (
              <div className="profile-image-placeholder">
                <span>👤</span>
              </div>
            )}
          </div>
        </div>

        {/* 기본 정보 */}
        <div className="profile-info-section">
          <div className="profile-info-item">
            <label>이름</label>
            <span>{user.name || '정보 없음'}</span>
          </div>

          <div className="profile-info-item">
            <label>이메일</label>
            <span>{user.email || '정보 없음'}</span>
          </div>

          {user.age && (
            <div className="profile-info-item">
              <label>나이</label>
              <span>{user.age}세</span>
            </div>
          )}

          {user.height && (
            <div className="profile-info-item">
              <label>키</label>
              <span>{user.height}cm</span>
            </div>
          )}

          {user.weight && (
            <div className="profile-info-item">
              <label>체중</label>
              <span>{user.weight}kg</span>
            </div>
          )}

          {user.activityLevel && (
            <div className="profile-info-item">
              <label>활동 수준</label>
              <span>{getActivityLevelText(user.activityLevel)}</span>
            </div>
          )}

          {user.dietaryRestrictions && (
            <div className="profile-info-item full-width">
              <label>식단 제한사항</label>
              <p className="dietary-restrictions">{user.dietaryRestrictions}</p>
            </div>
          )}
        </div>

        {/* 건강 정보 */}
        {user.height && user.weight && (
          <div className="health-info-section">
            <h3>건강 정보</h3>
            <div className="health-stats-grid">
              <div className="health-stat-card">
                <div className="stat-icon">⚖️</div>
                <div className="stat-content">
                  <div className="stat-label">BMI</div>
                  <div className="stat-value">
                    {bmi}
                    {bmiCategory && (
                      <span 
                        className="bmi-category" 
                        style={{ color: bmiCategory.color }}
                      >
                        {bmiCategory.category}
                      </span>
                    )}
                  </div>
                </div>
              </div>

              {bmr && (
                <div className="health-stat-card">
                  <div className="stat-icon">🔥</div>
                  <div className="stat-content">
                    <div className="stat-label">기초대사율</div>
                    <div className="stat-value">{bmr} kcal/일</div>
                  </div>
                </div>
              )}

              {recommendedCalories && (
                <div className="health-stat-card">
                  <div className="stat-icon">🍽️</div>
                  <div className="stat-content">
                    <div className="stat-label">권장 칼로리</div>
                    <div className="stat-value">{recommendedCalories} kcal/일</div>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* 액션 버튼 */}
        <div className="action-buttons">
          <button onClick={handleGoToMain} className="main-btn">
            메인으로 가기
          </button>
          <button onClick={handleEditProfile} className="edit-btn">
            프로필 수정
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProfileViewPage;
