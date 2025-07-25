import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  getMealsByUserId,
  getMealsByUserIdAndDate,
  createMeal,
  updateMeal,
  deleteMeal,
  getTotalCaloriesByUserAndDate
} from '../api/mealApi';
import './MealPage.css';

const MealPage = () => {
  const navigate = useNavigate();
  const [meals, setMeals] = useState([]);
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [totalCalories, setTotalCalories] = useState(0);
  const [showForm, setShowForm] = useState(false);
  const [editingMeal, setEditingMeal] = useState(null);
  const [loading, setLoading] = useState(false);

  // 폼 데이터 상태
  const [formData, setFormData] = useState({
    foodName: '',
    calories: '',
    protein: '',
    carbs: '',
    fat: '',
    fiber: '',
    sugar: '',
    sodium: '',
    quantity: '',
    unit: 'g',
    mealType: '아침',
    mealDate: new Date().toISOString().split('T')[0],
    mealTime: new Date().toISOString().slice(0, 16),
    memo: ''
  });

  // 사용자 ID (실제로는 JWT 토큰에서 가져와야 함)
  const userId = 1;

  // 컴포넌트 마운트 시 데이터 로드
  useEffect(() => {
    loadMealsData();
  }, [selectedDate]);

  // 식사 데이터 로드
  const loadMealsData = async () => {
    setLoading(true);
    try {
      const mealsData = await getMealsByUserIdAndDate(userId, selectedDate);
      setMeals(mealsData);
      
      const totalCal = await getTotalCaloriesByUserAndDate(userId, selectedDate);
      setTotalCalories(totalCal);
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

  // 식사 추가/수정
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const mealData = {
        ...formData,
        userId,
        calories: parseInt(formData.calories),
        protein: formData.protein ? parseFloat(formData.protein) : null,
        carbs: formData.carbs ? parseFloat(formData.carbs) : null,
        fat: formData.fat ? parseFloat(formData.fat) : null,
        fiber: formData.fiber ? parseFloat(formData.fiber) : null,
        sugar: formData.sugar ? parseFloat(formData.sugar) : null,
        sodium: formData.sodium ? parseFloat(formData.sodium) : null,
        quantity: parseInt(formData.quantity)
      };

      if (editingMeal) {
        await updateMeal(editingMeal.id, mealData);
        alert('식사 기록이 수정되었습니다.');
      } else {
        await createMeal(mealData);
        alert('식사 기록이 추가되었습니다.');
      }

      // 폼 초기화 및 데이터 새로고침
      resetForm();
      loadMealsData();
    } catch (error) {
      console.error('식사 기록 저장 오류:', error);
      alert('식사 기록 저장에 실패했습니다.');
    } finally {
      setLoading(false);
    }
  };

  // 식사 삭제
  const handleDelete = async (id) => {
    if (!window.confirm('이 식사 기록을 삭제하시겠습니까?')) {
      return;
    }

    try {
      await deleteMeal(id);
      alert('식사 기록이 삭제되었습니다.');
      loadMealsData();
    } catch (error) {
      console.error('식사 기록 삭제 오류:', error);
      alert('식사 기록 삭제에 실패했습니다.');
    }
  };

  // 식사 편집
  const handleEdit = (meal) => {
    setEditingMeal(meal);
    setFormData({
      foodName: meal.foodName,
      calories: meal.calories.toString(),
      protein: meal.protein?.toString() || '',
      carbs: meal.carbs?.toString() || '',
      fat: meal.fat?.toString() || '',
      fiber: meal.fiber?.toString() || '',
      sugar: meal.sugar?.toString() || '',
      sodium: meal.sodium?.toString() || '',
      quantity: meal.quantity.toString(),
      unit: meal.unit || 'g',
      mealType: meal.mealType,
      mealDate: meal.mealDate,
      mealTime: meal.mealTime ? meal.mealTime.slice(0, 16) : '',
      memo: meal.memo || ''
    });
    setShowForm(true);
  };

  // 폼 초기화
  const resetForm = () => {
    setFormData({
      foodName: '',
      calories: '',
      protein: '',
      carbs: '',
      fat: '',
      fiber: '',
      sugar: '',
      sodium: '',
      quantity: '',
      unit: 'g',
      mealType: '아침',
      mealDate: selectedDate,
      mealTime: new Date().toISOString().slice(0, 16),
      memo: ''
    });
    setEditingMeal(null);
    setShowForm(false);
  };

  // 식사 유형별 필터링
  const getMealsByType = (type) => {
    return meals.filter(meal => meal.mealType === type);
  };

  // 식사 유형별 칼로리 계산
  const getCaloriesByType = (type) => {
    return getMealsByType(type).reduce((total, meal) => total + meal.calories, 0);
  };

  return (
    <div className="meal-page">
      <div className="meal-header">
        <div className="meal-nav">
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
            className="nav-btn active"
            onClick={() => navigate('/meals')}
          >
            🍽️ 식사관리
          </button>
          <button 
            className="nav-btn"
            onClick={() => navigate('/workouts')}
          >
            💪 운동관리
          </button>
        </div>
        <div className="meal-title-section">
          <h1>식사 관리</h1>
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

      {/* 칼로리 요약 */}
      <div className="calorie-summary">
        <div className="total-calories">
          <h2>총 섭취 칼로리: {totalCalories} kcal</h2>
        </div>
        <div className="calories-by-meal">
          <div className="meal-type-summary">
            <span>아침: {getCaloriesByType('아침')} kcal</span>
            <span>점심: {getCaloriesByType('점심')} kcal</span>
            <span>저녁: {getCaloriesByType('저녁')} kcal</span>
            <span>간식: {getCaloriesByType('간식')} kcal</span>
          </div>
        </div>
      </div>

      {/* 식사 추가 버튼 */}
      <div className="meal-actions">
        <button
          className="add-meal-btn"
          onClick={() => setShowForm(true)}
          disabled={loading}
        >
          식사 추가
        </button>
      </div>

      {/* 식사 기록 폼 */}
      {showForm && (
        <div className="meal-form-modal">
          <div className="meal-form-container">
            <h3>{editingMeal ? '식사 기록 수정' : '식사 기록 추가'}</h3>
            <form onSubmit={handleSubmit} className="meal-form">
              <div className="form-row">
                <div className="form-group">
                  <label>음식명 *</label>
                  <input
                    type="text"
                    name="foodName"
                    value={formData.foodName}
                    onChange={handleInputChange}
                    required
                    placeholder="음식명을 입력하세요"
                  />
                </div>
                <div className="form-group">
                  <label>칼로리 *</label>
                  <input
                    type="number"
                    name="calories"
                    value={formData.calories}
                    onChange={handleInputChange}
                    required
                    placeholder="칼로리"
                  />
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>섭취량 *</label>
                  <input
                    type="number"
                    name="quantity"
                    value={formData.quantity}
                    onChange={handleInputChange}
                    required
                    placeholder="섭취량"
                  />
                </div>
                <div className="form-group">
                  <label>단위</label>
                  <select
                    name="unit"
                    value={formData.unit}
                    onChange={handleInputChange}
                  >
                    <option value="g">g</option>
                    <option value="ml">ml</option>
                    <option value="개">개</option>
                    <option value="그릇">그릇</option>
                    <option value="컵">컵</option>
                  </select>
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>식사 유형 *</label>
                  <select
                    name="mealType"
                    value={formData.mealType}
                    onChange={handleInputChange}
                    required
                  >
                    <option value="아침">아침</option>
                    <option value="점심">점심</option>
                    <option value="저녁">저녁</option>
                    <option value="간식">간식</option>
                  </select>
                </div>
                <div className="form-group">
                  <label>식사 시간</label>
                  <input
                    type="datetime-local"
                    name="mealTime"
                    value={formData.mealTime}
                    onChange={handleInputChange}
                  />
                </div>
              </div>

              {/* 영양소 정보 */}
              <div className="nutrition-section">
                <h4>영양소 정보 (선택사항)</h4>
                <div className="form-row">
                  <div className="form-group">
                    <label>단백질 (g)</label>
                    <input
                      type="number"
                      step="0.1"
                      name="protein"
                      value={formData.protein}
                      onChange={handleInputChange}
                      placeholder="단백질"
                    />
                  </div>
                  <div className="form-group">
                    <label>탄수화물 (g)</label>
                    <input
                      type="number"
                      step="0.1"
                      name="carbs"
                      value={formData.carbs}
                      onChange={handleInputChange}
                      placeholder="탄수화물"
                    />
                  </div>
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label>지방 (g)</label>
                    <input
                      type="number"
                      step="0.1"
                      name="fat"
                      value={formData.fat}
                      onChange={handleInputChange}
                      placeholder="지방"
                    />
                  </div>
                  <div className="form-group">
                    <label>식이섬유 (g)</label>
                    <input
                      type="number"
                      step="0.1"
                      name="fiber"
                      value={formData.fiber}
                      onChange={handleInputChange}
                      placeholder="식이섬유"
                    />
                  </div>
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label>당류 (g)</label>
                    <input
                      type="number"
                      step="0.1"
                      name="sugar"
                      value={formData.sugar}
                      onChange={handleInputChange}
                      placeholder="당류"
                    />
                  </div>
                  <div className="form-group">
                    <label>나트륨 (mg)</label>
                    <input
                      type="number"
                      step="0.1"
                      name="sodium"
                      value={formData.sodium}
                      onChange={handleInputChange}
                      placeholder="나트륨"
                    />
                  </div>
                </div>
              </div>

              <div className="form-group">
                <label>메모</label>
                <textarea
                  name="memo"
                  value={formData.memo}
                  onChange={handleInputChange}
                  placeholder="식사에 대한 메모를 입력하세요"
                  rows="3"
                />
              </div>

              <div className="form-actions">
                <button type="submit" className="submit-btn" disabled={loading}>
                  {loading ? '저장 중...' : (editingMeal ? '수정' : '추가')}
                </button>
                <button type="button" className="cancel-btn" onClick={resetForm}>
                  취소
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 식사 기록 리스트 */}
      <div className="meals-list">
        {loading ? (
          <div className="loading">데이터를 불러오는 중...</div>
        ) : (
          ['아침', '점심', '저녁', '간식'].map(mealType => {
            const typeMeals = getMealsByType(mealType);
            return (
              <div key={mealType} className="meal-type-section">
                <h3 className="meal-type-title">
                  {mealType} ({getCaloriesByType(mealType)} kcal)
                </h3>
                {typeMeals.length === 0 ? (
                  <div className="no-meals">등록된 식사가 없습니다.</div>
                ) : (
                  <div className="meals-grid">
                    {typeMeals.map(meal => (
                      <div key={meal.id} className="meal-card">
                        <div className="meal-info">
                          <h4>{meal.foodName}</h4>
                          <div className="meal-details">
                            <span className="calories">{meal.calories} kcal</span>
                            <span className="quantity">{meal.quantity}{meal.unit}</span>
                            {meal.mealTime && (
                              <span className="time">
                                {new Date(meal.mealTime).toLocaleTimeString('ko-KR', {
                                  hour: '2-digit',
                                  minute: '2-digit'
                                })}
                              </span>
                            )}
                          </div>
                          {(meal.protein || meal.carbs || meal.fat) && (
                            <div className="nutrition-info">
                              {meal.protein && <span>단백질: {meal.protein}g</span>}
                              {meal.carbs && <span>탄수화물: {meal.carbs}g</span>}
                              {meal.fat && <span>지방: {meal.fat}g</span>}
                            </div>
                          )}
                          {meal.memo && (
                            <div className="meal-memo">{meal.memo}</div>
                          )}
                        </div>
                        <div className="meal-actions">
                          <button
                            className="edit-btn"
                            onClick={() => handleEdit(meal)}
                          >
                            수정
                          </button>
                          <button
                            className="delete-btn"
                            onClick={() => handleDelete(meal.id)}
                          >
                            삭제
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};

export default MealPage;
