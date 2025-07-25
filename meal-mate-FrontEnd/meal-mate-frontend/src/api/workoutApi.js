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

// 새로운 운동 기록 생성
export const createWorkout = async (workoutData) => {
    try {
        const response = await fetch(`${API_BASE_URL}/workouts`, {
            method: 'POST',
            headers: getHeaders(),
            body: JSON.stringify(workoutData)
        });
        
        if (!response.ok) {
            throw new Error('운동 기록 생성에 실패했습니다.');
        }
        
        return await response.json();
    } catch (error) {
        console.error('운동 기록 생성 오류:', error);
        throw error;
    }
};

// 모든 운동 기록 조회
export const getAllWorkouts = async () => {
    try {
        const response = await fetch(`${API_BASE_URL}/workouts`, {
            method: 'GET',
            headers: getHeaders()
        });
        
        if (!response.ok) {
            throw new Error('운동 기록 조회에 실패했습니다.');
        }
        
        return await response.json();
    } catch (error) {
        console.error('운동 기록 조회 오류:', error);
        throw error;
    }
};

// 특정 운동 기록 조회
export const getWorkoutById = async (id) => {
    try {
        const response = await fetch(`${API_BASE_URL}/workouts/${id}`, {
            method: 'GET',
            headers: getHeaders()
        });
        
        if (!response.ok) {
            throw new Error('운동 기록 조회에 실패했습니다.');
        }
        
        return await response.json();
    } catch (error) {
        console.error('운동 기록 조회 오류:', error);
        throw error;
    }
};

// 사용자별 운동 기록 조회
export const getWorkoutsByUserId = async (userId) => {
    try {
        const response = await fetch(`${API_BASE_URL}/workouts/user/${userId}`, {
            method: 'GET',
            headers: getHeaders()
        });
        
        if (!response.ok) {
            throw new Error('사용자 운동 기록 조회에 실패했습니다.');
        }
        
        return await response.json();
    } catch (error) {
        console.error('사용자 운동 기록 조회 오류:', error);
        throw error;
    }
};

// 특정 날짜의 운동 기록 조회
export const getWorkoutsByDate = async (date) => {
    try {
        const response = await fetch(`${API_BASE_URL}/workouts/date/${date}`, {
            method: 'GET',
            headers: getHeaders()
        });
        
        if (!response.ok) {
            throw new Error('날짜별 운동 기록 조회에 실패했습니다.');
        }
        
        return await response.json();
    } catch (error) {
        console.error('날짜별 운동 기록 조회 오류:', error);
        throw error;
    }
};

// 사용자와 날짜별 운동 기록 조회
export const getWorkoutsByUserIdAndDate = async (userId, date) => {
    try {
        const response = await fetch(`${API_BASE_URL}/workouts/user/${userId}/date/${date}`, {
            method: 'GET',
            headers: getHeaders()
        });
        
        if (!response.ok) {
            throw new Error('사용자별 날짜 운동 기록 조회에 실패했습니다.');
        }
        
        return await response.json();
    } catch (error) {
        console.error('사용자별 날짜 운동 기록 조회 오류:', error);
        throw error;
    }
};

// 운동 기록 수정
export const updateWorkout = async (id, workoutData) => {
    try {
        const response = await fetch(`${API_BASE_URL}/workouts/${id}`, {
            method: 'PUT',
            headers: getHeaders(),
            body: JSON.stringify(workoutData)
        });
        
        if (!response.ok) {
            throw new Error('운동 기록 수정에 실패했습니다.');
        }
        
        return await response.json();
    } catch (error) {
        console.error('운동 기록 수정 오류:', error);
        throw error;
    }
};

// 운동 기록 삭제
export const deleteWorkout = async (id) => {
    try {
        const response = await fetch(`${API_BASE_URL}/workouts/${id}`, {
            method: 'DELETE',
            headers: getHeaders()
        });
        
        if (!response.ok) {
            throw new Error('운동 기록 삭제에 실패했습니다.');
        }
        
        return true;
    } catch (error) {
        console.error('운동 기록 삭제 오류:', error);
        throw error;
    }
};

// 사용자의 일일 총 소모 칼로리 조회
export const getTotalCaloriesBurnedByUserAndDate = async (userId, date) => {
    try {
        const response = await fetch(`${API_BASE_URL}/workouts/user/${userId}/date/${date}/calories`, {
            method: 'GET',
            headers: getHeaders()
        });
        
        if (!response.ok) {
            throw new Error('일일 소모 칼로리 조회에 실패했습니다.');
        }
        
        return await response.json();
    } catch (error) {
        console.error('일일 소모 칼로리 조회 오류:', error);
        throw error;
    }
};

// 사용자의 기간별 평균 소모 칼로리 조회
export const getAverageCaloriesBurnedByUserAndDateRange = async (userId, startDate, endDate) => {
    try {
        const response = await fetch(`${API_BASE_URL}/workouts/user/${userId}/average-calories?startDate=${startDate}&endDate=${endDate}`, {
            method: 'GET',
            headers: getHeaders()
        });
        
        if (!response.ok) {
            throw new Error('평균 소모 칼로리 조회에 실패했습니다.');
        }
        
        return await response.json();
    } catch (error) {
        console.error('평균 소모 칼로리 조회 오류:', error);
        throw error;
    }
};

// 운동 유형별 기록 조회
export const getWorkoutsByUserIdAndType = async (userId, workoutType) => {
    try {
        const response = await fetch(`${API_BASE_URL}/workouts/user/${userId}/type/${workoutType}`, {
            method: 'GET',
            headers: getHeaders()
        });
        
        if (!response.ok) {
            throw new Error('운동 유형별 기록 조회에 실패했습니다.');
        }
        
        return await response.json();
    } catch (error) {
        console.error('운동 유형별 기록 조회 오류:', error);
        throw error;
    }
};

// 사용자의 일일 총 운동 시간 조회
export const getTotalDurationByUserAndDate = async (userId, date) => {
    try {
        const response = await fetch(`${API_BASE_URL}/workouts/user/${userId}/date/${date}/duration`, {
            method: 'GET',
            headers: getHeaders()
        });
        
        if (!response.ok) {
            throw new Error('일일 운동 시간 조회에 실패했습니다.');
        }
        
        return await response.json();
    } catch (error) {
        console.error('일일 운동 시간 조회 오류:', error);
        throw error;
    }
};
