// src/pages/RegisterPage.jsx
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './RegisterPage.css';

export default function RegisterPage() {
  const [form, setForm] = useState({
    email: '',
    password: '',
    nickname: '',
    age: '',
    gender: '',
    height: '',
    weight: '',
    activityLevel: ''
  });

  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleChange = e => {
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    try {
      const res = await fetch('http://localhost:8080/api/users/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.message || '회원가입 실패');
      }

      // 회원가입 성공 후 로그인 페이지로 이동
      navigate('/login');
    } catch (err) {
      setError(err.message);
    }
  };
  
  return (
<div className="register-container">
  <h2>회원가입</h2>
  <form onSubmit={handleSubmit}>
    {/* inputs */}
    <button type="submit">회원가입</button>
  </form>
  {error && <p>{error}</p>}
</div>
  );
}

