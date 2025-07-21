import React, { useState, useEffect } from 'react';
import { getUserProfile, updateUserProfile, createUserProfile } from '../api/userApi';
import { useNavigate } from 'react-router-dom';
import './ProfilePage.css';

const ProfilePage = () => {
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

  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const [hasProfile, setHasProfile] = useState(false);
  const [originalUser, setOriginalUser] = useState(null);

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

  // 사용자 프로필 불러오기
  const fetchUserProfile = async () => {
    setLoading(true);
    setError('');
    setSuccess('');
    
    try {
      console.log('프로필 불러오기 시작...');
      
      // 서버 상태 확인
      const serverCheck = await fetch('http://localhost:8080/api/health', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      }).catch(() => null);
      
      if (!serverCheck || !serverCheck.ok) {
        throw new Error('서버에 연결할 수 없습니다. 서버가 실행 중인지 확인해주세요.');
      }
      
      const userData = await getUserProfile();
      setUser(userData);
      setOriginalUser(userData);
      setHasProfile(true);
    } catch (error) {
      console.error('프로필 불러오기 실패:', error);
      
      if (error.message.includes('서버에 연결할 수 없습니다')) {
        setError('서버에 연결할 수 없습니다. 서버가 실행 중인지 확인해주세요.');
      } else if (error.message.includes('인증이 만료')) {
        setError('인증이 만료되었습니다. 다시 로그인해주세요.');
        handleLogout();
      } else if (error.message.includes('404') || error.message.includes('프로필을 찾을 수 없습니다')) {
        // 프로필이 없는 경우 - 새로 생성해야 함
        setHasProfile(false);
        setIsEditing(true);
        setError('프로필 정보를 입력해주세요.');
      } else {
        setError(error.message || '프로필을 불러오는데 실패했습니다.');
      }
    } finally {
      setLoading(false);
    }
  };

  // 사용자 프로필 저장
  const saveUserProfile = async () => {
    setLoading(true);
    setError('');
    setSuccess('');

    try {
      let updatedUser;
      if (hasProfile) {
        // 기존 프로필 업데이트
        updatedUser = await updateUserProfile(user);
      } else {
        // 새 프로필 생성
        updatedUser = await createUserProfile(user);
        setHasProfile(true);
      }
      
      setUser(updatedUser);
      setOriginalUser(updatedUser);
      setIsEditing(false);
      setSuccess('프로필이 성공적으로 저장되었습니다!');
      
      // 성공 메시지 3초 후 자동 제거
      setTimeout(() => {
        setSuccess('');
      }, 3000);
    } catch (error) {
      console.error('프로필 저장 실패:', error);
      if (error.message.includes('인증이 만료')) {
        setError('인증이 만료되었습니다. 다시 로그인해주세요.');
        handleLogout();
      } else {
        setError(error.message || '프로필 저장에 실패했습니다.');
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

  useEffect(() => {
    fetchUserProfile();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setUser(prev => ({
      ...prev,
      [name]: value
    }));
    setError(''); // 입력 시 오류 메시지 제거
  };

  const handleSave = () => {
    // 필수 필드 검증
    if (!user.name || !user.email) {
      setError('이름과 이메일은 필수 항목입니다.');
      return;
    }

    // 이메일 형식 검증
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(user.email)) {
      setError('올바른 이메일 형식을 입력해주세요.');
      return;
    }

    // 숫자 필드 검증
    if (user.age && (user.age < 1 || user.age > 120)) {
      setError('나이는 1세에서 120세 사이여야 합니다.');
      return;
    }

    if (user.height && (user.height < 50 || user.height > 250)) {
      setError('키는 50cm에서 250cm 사이여야 합니다.');
      return;
    }

    if (user.weight && (user.weight < 20 || user.weight > 300)) {
      setError('체중은 20kg에서 300kg 사이여야 합니다.');
      return;
    }

    saveUserProfile();
  };

  const handleEdit = () => {
    setIsEditing(true);
    setError('');
    setSuccess('');
  };

  const handleCancel = () => {
    // 원래 데이터로 복원
    if (originalUser) {
      setUser(originalUser);
    } else {
      setUser({
        name: '',
        email: '',
        age: '',
        height: '',
        weight: '',
        activityLevel: '',
        dietaryRestrictions: '',
        profileImage: ''
      });
    }
    setIsEditing(false);
    setError('');
    setSuccess('');
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setUser(prev => ({
          ...prev,
          profileImage: e.target.result
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  // 계산된 값들
  const bmi = calculateBMI(user.height, user.weight);
  const bmiCategory = getBMICategory(bmi);
  const bmr = calculateBMR(user.age, user.height, user.weight);
  const recommendedCalories = calculateRecommendedCalories(bmr, user.activityLevel);

  if (loading) {
    return (
      <div className="profile-container">
        <div className="profile-card">
          <div className="loading">데이터를 불러오는 중...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="profile-container">
      <div className="profile-card">
        <div className="profile-header">
          <h2>프로필</h2>
          <button onClick={handleLogout} className="logout-btn">
            로그아웃
          </button>
        </div>
        
        {error && (
          <div className="error-message">
            {error}
          </div>
        )}
        
        {success && (
          <div className="success-message">
            {success}
          </div>
        )}
        
        {!hasProfile && !isEditing && (
          <div className="info-message">
            프로필 정보를 입력해주세요.
          </div>
        )}

        {/* 프로필 이미지 */}
        <div className="profile-image-section">
          <div className="profile-image-container">
            {user.profileImage ? (
              <img src={user.profileImage} alt="프로필" className="profile-image" />
            ) : (
              <div className="profile-image-placeholder">
                <span>📷</span>
              </div>
            )}
          </div>
          {isEditing && (
            <input
              type="file"
              accept="image/*"
              onChange={handleImageUpload}
              className="image-upload-input"
            />
          )}
        </div>
        
        <div className="profile-item">
          <label>이름: *</label>
          <input
            type="text"
            name="name"
            value={user.name}
            onChange={handleInputChange}
            disabled={!isEditing}
            placeholder="이름을 입력하세요"
            required
          />
        </div>

        <div className="profile-item">
          <label>이메일: *</label>
          <input
            type="email"
            name="email"
            value={user.email}
            onChange={handleInputChange}
            disabled={!isEditing}
            placeholder="이메일을 입력하세요"
            required
          />
        </div>

        <div className="profile-item">
          <label>나이:</label>
          <input
            type="number"
            name="age"
            value={user.age}
            onChange={handleInputChange}
            disabled={!isEditing}
            placeholder="나이를 입력하세요"
            min="1"
            max="120"
          />
        </div>

        <div className="profile-item">
          <label>키 (cm):</label>
          <input
            type="number"
            name="height"
            value={user.height}
            onChange={handleInputChange}
            disabled={!isEditing}
            placeholder="키를 입력하세요"
            min="50"
            max="250"
          />
        </div>

        <div className="profile-item">
          <label>체중 (kg):</label>
          <input
            type="number"
            name="weight"
            value={user.weight}
            onChange={handleInputChange}
            disabled={!isEditing}
            placeholder="체중을 입력하세요"
            min="20"
            max="300"
          />
        </div>

        <div className="profile-item">
          <label>활동 수준:</label>
          <select
            name="activityLevel"
            value={user.activityLevel}
            onChange={handleInputChange}
            disabled={!isEditing}
          >
            <option value="">선택하세요</option>
            <option value="SEDENTARY">좌식 생활 (운동 안함)</option>
            <option value="LIGHTLY_ACTIVE">가벼운 활동 (주 1-3회 운동)</option>
            <option value="MODERATELY_ACTIVE">보통 활동 (주 3-5회 운동)</option>
            <option value="VERY_ACTIVE">활발한 활동 (주 6-7회 운동)</option>
            <option value="EXTREMELY_ACTIVE">매우 활발한 활동 (하루 2회 운동)</option>
          </select>
        </div>

        <div className="profile-item">
          <label>식단 제한사항:</label>
          <textarea
            name="dietaryRestrictions"
            value={user.dietaryRestrictions}
            onChange={handleInputChange}
            disabled={!isEditing}
            placeholder="알레르기나 특별한 식단 요구사항을 입력하세요"
            rows="3"
          />
        </div>

        {/* 건강 정보 표시 */}
        {user.height && user.weight && (
          <div className="health-info">
            <h3>건강 정보</h3>
            <div className="health-stats">
              <div className="health-stat">
                <label>BMI:</label>
                <span className="bmi-value">
                  {bmi}
                  {bmiCategory && (
                    <span 
                      className="bmi-category" 
                      style={{ color: bmiCategory.color }}
                    >
                      ({bmiCategory.category})
                    </span>
                  )}
                </span>
              </div>
              
              {user.age && (
                <div className="health-stat">
                  <label>기초대사율:</label>
                  <span>{bmr} kcal/일</span>
                </div>
              )}
              
              {recommendedCalories && (
                <div className="health-stat">
                  <label>권장 칼로리:</label>
                  <span>{recommendedCalories} kcal/일</span>
                </div>
              )}
            </div>
          </div>
        )}

        <div className="profile-buttons">
          {!isEditing ? (
            <button onClick={handleEdit} className="edit-btn" disabled={loading}>
              편집
            </button>
          ) : (
            <div className="edit-buttons">
              <button onClick={handleSave} className="save-btn" disabled={loading}>
                {loading ? '저장 중...' : '저장'}
              </button>
              <button onClick={handleCancel} className="cancel-btn" disabled={loading}>
                취소
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;