const API_BASE_URL = 'http://localhost:8080/api';

// JWT 토큰을 가져오는 함수
const getAuthToken = () => {
    return localStorage.getItem('token');
};

// 공통 헤더 생성
const getHeaders = () => {
    const token = getAuthToken();
    return {
        'Content-Type': 'application/json',
        ...(token && { 'Authorization': `Bearer ${token}` })
    };
};

// 새로운 식사 기록 생성
export const createMeal = async (mealData) => {
    try {
        const response = await fetch(`${API_BASE_URL}/meals`, {
            method: 'POST',
            headers: getHeaders(),
            body: JSON.stringify(mealData)
        });
        
        if (!response.ok) {
            throw new Error('식사 기록 생성에 실패했습니다.');
        }
        
        return await response.json();
    } catch (error) {
        console.error('식사 기록 생성 오류:', error);
        throw error;
    }
};

// 모든 식사 기록 조회
export const getAllMeals = async () => {
    try {
        const response = await fetch(`${API_BASE_URL}/meals`, {
            method: 'GET',
            headers: getHeaders()
        });
        
        if (!response.ok) {
            throw new Error('식사 기록 조회에 실패했습니다.');
        }
        
        return await response.json();
    } catch (error) {
        console.error('식사 기록 조회 오류:', error);
        throw error;
    }
};

// 특정 식사 기록 조회
export const getMealById = async (id) => {
    try {
        const response = await fetch(`${API_BASE_URL}/meals/${id}`, {
            method: 'GET',
            headers: getHeaders()
        });
        
        if (!response.ok) {
            throw new Error('식사 기록 조회에 실패했습니다.');
        }
        
        return await response.json();
    } catch (error) {
        console.error('식사 기록 조회 오류:', error);
        throw error;
    }
};

// 사용자별 식사 기록 조회
export const getMealsByUserId = async (userId) => {
    try {
        const response = await fetch(`${API_BASE_URL}/meals/user/${userId}`, {
            method: 'GET',
            headers: getHeaders()
        });
        
        if (!response.ok) {
            throw new Error('사용자 식사 기록 조회에 실패했습니다.');
        }
        
        return await response.json();
    } catch (error) {
        console.error('사용자 식사 기록 조회 오류:', error);
        throw error;
    }
};

// 특정 날짜의 식사 기록 조회
export const getMealsByDate = async (date) => {
    try {
        const response = await fetch(`${API_BASE_URL}/meals/date/${date}`, {
            method: 'GET',
            headers: getHeaders()
        });
        
        if (!response.ok) {
            throw new Error('날짜별 식사 기록 조회에 실패했습니다.');
        }
        
        return await response.json();
    } catch (error) {
        console.error('날짜별 식사 기록 조회 오류:', error);
        throw error;
    }
};

// 사용자와 날짜별 식사 기록 조회
export const getMealsByUserIdAndDate = async (userId, date) => {
    try {
        const response = await fetch(`${API_BASE_URL}/meals/user/${userId}/date/${date}`, {
            method: 'GET',
            headers: getHeaders()
        });
        
        if (!response.ok) {
            throw new Error('사용자별 날짜 식사 기록 조회에 실패했습니다.');
        }
        
        return await response.json();
    } catch (error) {
        console.error('사용자별 날짜 식사 기록 조회 오류:', error);
        throw error;
    }
};

// 식사 기록 수정
export const updateMeal = async (id, mealData) => {
    try {
        const response = await fetch(`${API_BASE_URL}/meals/${id}`, {
            method: 'PUT',
            headers: getHeaders(),
            body: JSON.stringify(mealData)
        });
        
        if (!response.ok) {
            throw new Error('식사 기록 수정에 실패했습니다.');
        }
        
        return await response.json();
    } catch (error) {
        console.error('식사 기록 수정 오류:', error);
        throw error;
    }
};

// 식사 기록 삭제
export const deleteMeal = async (id) => {
    try {
        const response = await fetch(`${API_BASE_URL}/meals/${id}`, {
            method: 'DELETE',
            headers: getHeaders()
        });
        
        if (!response.ok) {
            throw new Error('식사 기록 삭제에 실패했습니다.');
        }
        
        return true;
    } catch (error) {
        console.error('식사 기록 삭제 오류:', error);
        throw error;
    }
};

// 사용자의 일일 총 칼로리 조회
export const getTotalCaloriesByUserAndDate = async (userId, date) => {
    try {
        const response = await fetch(`${API_BASE_URL}/meals/user/${userId}/date/${date}/calories`, {
            method: 'GET',
            headers: getHeaders()
        });
        
        if (!response.ok) {
            throw new Error('일일 칼로리 조회에 실패했습니다.');
        }
        
        return await response.json();
    } catch (error) {
        console.error('일일 칼로리 조회 오류:', error);
        throw error;
    }
};

// 사용자의 기간별 평균 칼로리 조회
export const getAverageCaloriesByUserAndDateRange = async (userId, startDate, endDate) => {
    try {
        const response = await fetch(`${API_BASE_URL}/meals/user/${userId}/average-calories?startDate=${startDate}&endDate=${endDate}`, {
            method: 'GET',
            headers: getHeaders()
        });
        
        if (!response.ok) {
            throw new Error('평균 칼로리 조회에 실패했습니다.');
        }
        
        return await response.json();
    } catch (error) {
        console.error('평균 칼로리 조회 오류:', error);
        throw error;
    }
};
