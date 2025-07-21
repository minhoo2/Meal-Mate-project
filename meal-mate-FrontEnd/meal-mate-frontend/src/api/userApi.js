import axios from 'axios';

const API_BASE_URL = '/api';

// 개발 환경에서는 프록시를 사용하고, 프로덕션에서는 전체 URL 사용
const getApiBaseUrl = () => {
  if (import.meta.env.DEV) {
    return '/api'; // 개발 환경에서는 프록시 사용
  }
  return 'http://localhost:8080/api'; // 프로덕션 환경
};

// Axios 인스턴스 생성
const userApi = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// 요청 인터셉터 추가
userApi.interceptors.request.use(
  (config) => {
    const token = getAuthToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// 응답 인터셉터 추가
userApi.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    if (error.response?.status === 401) {
      // 토큰이 만료되었거나 유효하지 않은 경우
      localStorage.removeItem('accessToken');
      localStorage.removeItem('token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// 토큰 가져오기 (우선순위: accessToken > token)
const getAuthToken = () => {
  return localStorage.getItem('accessToken') || localStorage.getItem('token');
};

// 에러 처리 함수
const handleApiError = (error, defaultMessage) => {
  if (error.response?.status === 401) {
    throw new Error('인증이 만료되었습니다. 다시 로그인해주세요.');
  } else if (error.response?.status === 403) {
    throw new Error('접근 권한이 없습니다.');
  } else if (error.response?.status === 404) {
    throw new Error('요청한 리소스를 찾을 수 없습니다.');
  } else if (error.response?.status === 500) {
    throw new Error('서버 오류가 발생했습니다. 잠시 후 다시 시도해주세요.');
  } else {
    const errorMessage = error.response?.data?.message || defaultMessage;
    throw new Error(errorMessage);
  }
};

// 사용자 정보 가져오기
export async function getUser(userId) {
  try {
    const token = getAuthToken();
    
    if (!token) {
      throw new Error('인증 토큰이 없습니다.');
    }

    const response = await userApi.get(`/users/${userId}`);
    return response.data;
  } catch (error) {
    handleApiError(error, '사용자 정보를 불러오는 데 실패했습니다.');
  }
}

// 사용자 프로필 가져오기
export async function getUserProfile() {
  try {
    const token = getAuthToken();

    if (!token) {
      throw new Error('인증 토큰이 없습니다.');
    }

    console.log('API 요청 시작: /user/profile');
    console.log('사용 중인 토큰:', token ? '토큰 존재' : '토큰 없음');
    
    const response = await userApi.get('/user/profile');
    console.log('API 응답:', response.data);
    return response.data;
  } catch (error) {
    console.error('API 오류 상세:', {
      status: error.response?.status,
      statusText: error.response?.statusText,
      data: error.response?.data,
      message: error.message
    });
    handleApiError(error, '프로필을 불러오는 데 실패했습니다.');
  }
}

// 사용자 프로필 업데이트
export async function updateUserProfile(profileData) {
  try {
    const token = getAuthToken();

    if (!token) {
      throw new Error('인증 토큰이 없습니다.');
    }

    // 데이터 유효성 검사
    if (!profileData || typeof profileData !== 'object') {
      throw new Error('유효하지 않은 프로필 데이터입니다.');
    }

    const response = await userApi.put('/user/profile', profileData);
    return response.data;
  } catch (error) {
    handleApiError(error, '프로필 업데이트에 실패했습니다.');
  }
}

// 사용자 프로필 생성 (첫 등록)
export async function createUserProfile(profileData) {
  try {
    const token = getAuthToken();

    if (!token) {
      throw new Error('인증 토큰이 없습니다.');
    }

    // 데이터 유효성 검사
    if (!profileData || typeof profileData !== 'object') {
      throw new Error('유효하지 않은 프로필 데이터입니다.');
    }

    const response = await userApi.post('/user/profile', profileData);
    return response.data;
  } catch (error) {
    handleApiError(error, '프로필 생성에 실패했습니다.');
  }
}

// 사용자 계정 삭제
export async function deleteUser() {
  try {
    const token = getAuthToken();

    if (!token) {
      throw new Error('인증 토큰이 없습니다.');
    }

    const response = await userApi.delete('/user/account');
    
    // 성공 시 로컬 스토리지 정리
    localStorage.removeItem('accessToken');
    localStorage.removeItem('token');
    
    return response.data;
  } catch (error) {
    handleApiError(error, '계정 삭제에 실패했습니다.');
  }
}

// 토큰 유효성 검사
export async function validateToken() {
  try {
    const token = getAuthToken();

    if (!token) {
      return false;
    }

    const response = await userApi.get('/user/validate-token');
    return response.status === 200;
  } catch (error) {
    console.error('토큰 검증 실패:', error);
    return false;
  }
}
