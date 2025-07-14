import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Profile.css'; 

export default function Profile() {
  const [user, setUser] = useState(null);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('accessToken');
    const userId = localStorage.getItem('userId');

    if (!token || !userId) {
      navigate('/login');
      return;
    }

    const fetchUser = async () => {
      try {
        const res = await fetch(`http://localhost:8080/api/users/${userId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (!res.ok) {
          throw new Error('사용자 정보를 불러오는 데 실패했습니다.');
        }

        const data = await res.json();
        setUser(data);
      } catch (err) {
        setError(err.message);
      }
    };

    fetchUser();
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('userId');
    navigate('/login');
  };

  if (error) return <p className="error">{error}</p>;
  if (!user) return <p className="loading">사용자 정보를 불러오는 중...</p>;

  return (
    <div className="profile-container">
      <h2>🏋️‍♂️ 내 프로필</h2>
      <div className="profile-info">
        <p>📧 이메일: {user.email}</p>
        <p>💬 닉네임: {user.nickname}</p>
        <p>🎂 나이: {user.age}</p>
        <p>🚻 성별: {user.gender}</p>
        <p>📏 키: {user.height} cm</p>
        <p>⚖️ 몸무게: {user.weight} kg</p>
        <p>🔥 활동량: {user.activityLevel}</p>
      </div>
      <button className="logout-button" onClick={handleLogout}>로그아웃</button>
    </div>
  );
}