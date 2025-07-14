import React, { useState } from 'react';
import { registerUser } from '../api/auth';

function RegisterForm() {
  const [form, setForm] = useState({
    username: '',
    email: '',
    password: '',
    nickname: '',
    age: '',
    gender: '',
    height: '',
    weight: '',
    activityLevel: '',
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const result = await registerUser(form);
      alert('회원가입 성공!');
      console.log(result);
    } catch (err) {
      alert('회원가입 실패');
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <input name="username" onChange={handleChange} placeholder="아이디" required />
      <input name="email" onChange={handleChange} placeholder="이메일" required />
      <input type="password" name="password" onChange={handleChange} placeholder="비밀번호" required />
      <input name="nickname" onChange={handleChange} placeholder="닉네임" required />
      <input name="age" type="number" onChange={handleChange} placeholder="나이" />
      <input name="gender" onChange={handleChange} placeholder="성별" />
      <input name="height" type="number" onChange={handleChange} placeholder="키" />
      <input name="weight" type="number" onChange={handleChange} placeholder="몸무게" />
      <input name="activityLevel" onChange={handleChange} placeholder="활동량" />
      <button type="submit">회원가입</button>
    </form>
  );
}

export default RegisterForm;
