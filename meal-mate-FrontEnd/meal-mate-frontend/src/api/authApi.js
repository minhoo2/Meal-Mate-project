import axios from 'axios';

const API_BASE_URL = 'http://localhost:8080/api/users';

// Axios 인스턴스 생성
const authApi = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// 요청 인터셉터 추가
authApi.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('accessToken');
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
authApi.interceptors.response.use(
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

export const registerUser = async (userData) => {
  try {
    const response = await authApi.post('/register', userData);
    return response.data;
  } catch (error) {
    if (error.response?.status === 400) {
      throw new Error('잘못된 요청입니다. 입력 정보를 확인해주세요.');
    } else if (error.response?.status === 409) {
      throw new Error('이미 존재하는 사용자입니다.');
    } else if (error.response?.status === 500) {
      throw new Error('서버 오류가 발생했습니다. 잠시 후 다시 시도해주세요.');
    } else {
      throw new Error(error.response?.data?.message || '회원가입에 실패했습니다.');
    }
  }
};

export const loginUser = async (loginData) => {
  try {
    const response = await authApi.post('/login', loginData);
    
    // 토큰 저장 (기존 token과 새로운 accessToken 둘 다 저장)
    if (response.data.token) {
      localStorage.setItem('token', response.data.token);
    }
    if (response.data.accessToken) {
      localStorage.setItem('accessToken', response.data.accessToken);
    }
    
    return response.data;
  } catch (error) {
    if (error.response?.status === 401) {
      throw new Error('아이디 또는 비밀번호가 틀렸습니다.');
    } else if (error.response?.status === 404) {
      throw new Error('존재하지 않는 사용자입니다.');
    } else if (error.response?.status === 500) {
      throw new Error('서버 오류가 발생했습니다. 잠시 후 다시 시도해주세요.');
    } else {
      throw new Error(error.response?.data?.message || '로그인에 실패했습니다.');
    }
  }
};

export const logoutUser = () => {
  localStorage.removeItem('token');
  localStorage.removeItem('accessToken');
  window.location.href = '/login';
};

export const checkTokenValidity = () => {
  const token = localStorage.getItem('accessToken') || localStorage.getItem('token');
  return !!token;
};
