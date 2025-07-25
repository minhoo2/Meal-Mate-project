import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  getWorkoutsByUserId,
  getWorkoutsByUserIdAndDate,
  createWorkout,
  updateWorkout,
  deleteWorkout,
  getTotalCaloriesBurnedByUserAndDate,
  getTotalDurationByUserAndDate
} from '../api/workoutApi';
import './WorkoutPage.css';

const WorkoutPage = () => {
  const navigate = useNavigate();
  const [workouts, setWorkouts] = useState([]);
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [totalCaloriesBurned, setTotalCaloriesBurned] = useState(0);
  const [totalDuration, setTotalDuration] = useState(0);
  const [showForm, setShowForm] = useState(false);
  const [editingWorkout, setEditingWorkout] = useState(null);
  const [loading, setLoading] = useState(false);

  // 폼 데이터 상태
  const [formData, setFormData] = useState({
    name: '',
    duration: '',
    caloriesBurned: '',
    workoutTime: new Date().toISOString().slice(0, 16),
    notes: ''
  });

  // 사용자 ID (실제로는 JWT 토큰에서 가져와야 함)
  const userId = 1;

  // 컴포넌트 마운트 시 데이터 로드
  useEffect(() => {
    loadWorkoutsData();
  }, [selectedDate]);

  // 운동 데이터 로드
  const loadWorkoutsData = async () => {
    setLoading(true);
    try {
      const workoutsData = await getWorkoutsByUserIdAndDate(userId, selectedDate);
      setWorkouts(workoutsData);
      
      const totalCal = await getTotalCaloriesBurnedByUserAndDate(userId, selectedDate);
      setTotalCaloriesBurned(totalCal);

      const totalDur = await getTotalDurationByUserAndDate(userId, selectedDate);
      setTotalDuration(totalDur);
    } catch (error) {
      console.error('데이터 로드 오류:', error);
      alert('데이터를 불러오는데 실패했습니다.');
    } finally {
      setLoading(false);
    }
  };

  // 폼 입력 핸들러
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // 운동 추가/수정
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const workoutData = {
        ...formData,
        userId,
        duration: parseInt(formData.duration),
        caloriesBurned: parseInt(formData.caloriesBurned),
        workoutTime: formData.workoutTime
      };

      if (editingWorkout) {
        await updateWorkout(editingWorkout.id, workoutData);
        alert('운동 기록이 수정되었습니다.');
      } else {
        await createWorkout(workoutData);
        alert('운동 기록이 추가되었습니다.');
      }

      // 폼 초기화 및 데이터 새로고침
      resetForm();
      loadWorkoutsData();
    } catch (error) {
      console.error('운동 기록 저장 오류:', error);
      alert('운동 기록 저장에 실패했습니다.');
    } finally {
      setLoading(false);
    }
  };

  // 운동 삭제
  const handleDelete = async (id) => {
    if (!window.confirm('이 운동 기록을 삭제하시겠습니까?')) {
      return;
    }

    try {
      await deleteWorkout(id);
      alert('운동 기록이 삭제되었습니다.');
      loadWorkoutsData();
    } catch (error) {
      console.error('운동 기록 삭제 오류:', error);
      alert('운동 기록 삭제에 실패했습니다.');
    }
  };

  // 운동 편집
  const handleEdit = (workout) => {
    setEditingWorkout(workout);
    setFormData({
      name: workout.name,
      duration: workout.duration.toString(),
      caloriesBurned: workout.caloriesBurned.toString(),
      workoutTime: workout.workoutTime ? workout.workoutTime.slice(0, 16) : '',
      notes: workout.notes || ''
    });
    setShowForm(true);
  };

  // 폼 초기화
  const resetForm = () => {
    setFormData({
      name: '',
      duration: '',
      caloriesBurned: '',
      workoutTime: new Date().toISOString().slice(0, 16),
      notes: ''
    });
    setEditingWorkout(null);
    setShowForm(false);
  };

  // 시간 포맷팅 함수
  const formatDuration = (minutes) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    if (hours > 0) {
      return `${hours}시간 ${mins}분`;
    }
    return `${mins}분`;
  };

  // 인기 운동 목록
  const popularWorkouts = [
    { name: '런닝', calories: 300, duration: 30 },
    { name: '걷기', calories: 150, duration: 30 },
    { name: '수영', calories: 400, duration: 30 },
    { name: '자전거', calories: 250, duration: 30 },
    { name: '웨이트 트레이닝', calories: 200, duration: 30 },
    { name: '요가', calories: 120, duration: 30 },
    { name: '필라테스', calories: 180, duration: 30 },
    { name: '테니스', calories: 300, duration: 30 },
    { name: '배드민턴', calories: 250, duration: 30 },
    { name: '축구', calories: 350, duration: 30 }
  ];

  // 인기 운동 선택
  const selectPopularWorkout = (workout) => {
    setFormData(prev => ({
      ...prev,
      name: workout.name,
      caloriesBurned: workout.calories.toString(),
      duration: workout.duration.toString()
    }));
  };

  return (
    <div className="workout-page">
      <div className="workout-header">
        <div className="workout-nav">
          <button 
            className="nav-btn"
            onClick={() => navigate('/dashboard')}
          >
            🏠 대시보드
          </button>
          <button 
            className="nav-btn"
            onClick={() => navigate('/profile')}
          >
            👤 프로필
          </button>
          <button 
            className="nav-btn"
            onClick={() => navigate('/meals')}
          >
            🍽️ 식사관리
          </button>
          <button 
            className="nav-btn active"
            onClick={() => navigate('/workouts')}
          >
            💪 운동관리
          </button>
        </div>
        <div className="workout-title-section">
          <h1>운동 관리</h1>
          <div className="date-selector">
            <input
              type="date"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              className="date-input"
            />
          </div>
        </div>
      </div>

      {/* 운동 요약 */}
      <div className="workout-summary">
        <div className="summary-card">
          <h3>총 소모 칼로리</h3>
          <div className="summary-value">{totalCaloriesBurned} kcal</div>
        </div>
        <div className="summary-card">
          <h3>총 운동 시간</h3>
          <div className="summary-value">{formatDuration(totalDuration)}</div>
        </div>
        <div className="summary-card">
          <h3>운동 횟수</h3>
          <div className="summary-value">{workouts.length}회</div>
        </div>
      </div>

      {/* 운동 추가 버튼 */}
      <div className="workout-actions">
        <button
          className="add-workout-btn"
          onClick={() => setShowForm(true)}
          disabled={loading}
        >
          운동 추가
        </button>
      </div>

      {/* 운동 기록 폼 */}
      {showForm && (
        <div className="workout-form-modal">
          <div className="workout-form-container">
            <h3>{editingWorkout ? '운동 기록 수정' : '운동 기록 추가'}</h3>
            
            {/* 인기 운동 선택 */}
            {!editingWorkout && (
              <div className="popular-workouts">
                <h4>인기 운동</h4>
                <div className="popular-workouts-grid">
                  {popularWorkouts.map((workout, index) => (
                    <button
                      key={index}
                      type="button"
                      className="popular-workout-btn"
                      onClick={() => selectPopularWorkout(workout)}
                    >
                      <div className="workout-name">{workout.name}</div>
                      <div className="workout-info">
                        {workout.calories}kcal / {workout.duration}분
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            )}

            <form onSubmit={handleSubmit} className="workout-form">
              <div className="form-row">
                <div className="form-group">
                  <label>운동명 *</label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    required
                    placeholder="운동명을 입력하세요"
                  />
                </div>
                <div className="form-group">
                  <label>운동 시간 (분) *</label>
                  <input
                    type="number"
                    name="duration"
                    value={formData.duration}
                    onChange={handleInputChange}
                    required
                    placeholder="분"
                    min="1"
                  />
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>소모 칼로리 *</label>
                  <input
                    type="number"
                    name="caloriesBurned"
                    value={formData.caloriesBurned}
                    onChange={handleInputChange}
                    required
                    placeholder="소모 칼로리"
                    min="1"
                  />
                </div>
                <div className="form-group">
                  <label>운동 시간</label>
                  <input
                    type="datetime-local"
                    name="workoutTime"
                    value={formData.workoutTime}
                    onChange={handleInputChange}
                  />
                </div>
              </div>

              <div className="form-group">
                <label>메모</label>
                <textarea
                  name="notes"
                  value={formData.notes}
                  onChange={handleInputChange}
                  placeholder="운동에 대한 메모를 입력하세요"
                  rows="3"
                />
              </div>

              <div className="form-actions">
                <button type="submit" className="submit-btn" disabled={loading}>
                  {loading ? '저장 중...' : (editingWorkout ? '수정' : '추가')}
                </button>
                <button type="button" className="cancel-btn" onClick={resetForm}>
                  취소
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 운동 기록 리스트 */}
      <div className="workouts-list">
        {loading ? (
          <div className="loading">데이터를 불러오는 중...</div>
        ) : workouts.length === 0 ? (
          <div className="no-workouts">
            <div className="no-workouts-icon">🏃‍♂️</div>
            <h3>등록된 운동이 없습니다</h3>
            <p>오늘의 첫 운동을 기록해보세요!</p>
          </div>
        ) : (
          <div className="workouts-grid">
            {workouts.map(workout => (
              <div key={workout.id} className="workout-card">
                <div className="workout-info">
                  <h4>{workout.name}</h4>
                  <div className="workout-details">
                    <div className="detail-item">
                      <span className="detail-label">시간</span>
                      <span className="detail-value">{formatDuration(workout.duration)}</span>
                    </div>
                    <div className="detail-item">
                      <span className="detail-label">칼로리</span>
                      <span className="detail-value calories">{workout.caloriesBurned} kcal</span>
                    </div>
                    {workout.workoutTime && (
                      <div className="detail-item">
                        <span className="detail-label">운동 시간</span>
                        <span className="detail-value time">
                          {new Date(workout.workoutTime).toLocaleString('ko-KR', {
                            month: 'short',
                            day: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit'
                          })}
                        </span>
                      </div>
                    )}
                  </div>
                  {workout.notes && (
                    <div className="workout-notes">{workout.notes}</div>
                  )}
                </div>
                <div className="workout-actions">
                  <button
                    className="edit-btn"
                    onClick={() => handleEdit(workout)}
                  >
                    수정
                  </button>
                  <button
                    className="delete-btn"
                    onClick={() => handleDelete(workout.id)}
                  >
                    삭제
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default WorkoutPage;
