import axios from 'axios';

const API_BASE_URL = 'http://localhost:8080/api/users';

export const registerUser = async (userData) => {
  const response = await axios.post(`${API_BASE_URL}/register`, userData);
  return response.data;
};

export const loginUser = async (loginData) => {
  const response = await axios.post(`${API_BASE_URL}/login`, loginData);
  // 토큰 로컬스토리지에 저장
  localStorage.setItem('token', response.data.token);
  return response.data;
};
