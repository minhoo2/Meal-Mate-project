import React, { useState } from 'react';
import { loginUser } from '../api/auth';


function LoginForm() {
  const [form, setForm] = useState({ usernameOrEmail: '', password: '' });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const result = await loginUser(form);
      alert('로그인 성공!');
      console.log(result);
    } catch (err) {
      alert('로그인 실패');
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        name="usernameOrEmail"
        onChange={handleChange}
        placeholder="아이디 또는 이메일"
        required
      />
      <input
        type="password"
        name="password"
        onChange={handleChange}
        placeholder="비밀번호"
        required
      />
      <button type="submit">로그인</button>
    </form>
  );
}

export default LoginForm;
