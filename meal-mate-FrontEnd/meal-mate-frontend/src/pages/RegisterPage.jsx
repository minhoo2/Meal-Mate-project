import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './RegisterPage.css';

export default function RegisterPage() {
  const [form, setForm] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    nickname: '',
    age: '',
    gender: '',
    height: '',
    weight: '',
    activityLevel: ''
  });

  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [step, setStep] = useState(1);
  const navigate = useNavigate();

  const handleChange = e => {
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const validateStep1 = () => {
    if (!form.email || !form.password || !form.confirmPassword || !form.nickname) {
      setError('모든 필드를 입력해주세요.');
      return false;
    }
    if (form.password !== form.confirmPassword) {
      setError('비밀번호가 일치하지 않습니다.');
      return false;
    }
    if (form.password.length < 6) {
      setError('비밀번호는 6자 이상이어야 합니다.');
      return false;
    }
    return true;
  };

  const validateStep2 = () => {
    if (!form.age || !form.gender || !form.height || !form.weight || !form.activityLevel) {
      setError('모든 필드를 입력해주세요.');
      return false;
    }
    if (form.age < 1 || form.age > 120) {
      setError('올바른 나이를 입력해주세요.');
      return false;
    }
    if (form.height < 50 || form.height > 300) {
      setError('올바른 키를 입력해주세요.');
      return false;
    }
    if (form.weight < 20 || form.weight > 500) {
      setError('올바른 체중을 입력해주세요.');
      return false;
    }
    return true;
  };

  const handleNext = () => {
    setError('');
    if (validateStep1()) {
      setStep(2);
    }
  };

  const handleBack = () => {
    setStep(1);
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    
    if (!validateStep2()) return;
    
    setIsLoading(true);

    try {
      const { confirmPassword, ...submitData } = form;
      
      const res = await fetch('http://localhost:8080/api/users/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(submitData),
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.message || '회원가입 실패');
      }

      // 회원가입 성공 후 로그인 페이지로 이동
      navigate('/login');
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };
  
  return (
    <div className="register-container">
      <div className="register-background">
        <div className="floating-shapes">
          <div className="shape shape-1"></div>
          <div className="shape shape-2"></div>
          <div className="shape shape-3"></div>
          <div className="shape shape-4"></div>
        </div>
      </div>
      
      <div className="register-card">
        <div className="register-header">
          <div className="logo-container">
            <div className="logo">🍽️</div>
            <h1>핏로그</h1>
          </div>
          <p className="subtitle">새로운 계정을 만들어보세요</p>
        </div>

        <div className="progress-container">
          <div className="progress-bar">
            <div className={`progress-step ${step >= 1 ? 'active' : ''}`}>1</div>
            <div className={`progress-line ${step >= 2 ? 'active' : ''}`}></div>
            <div className={`progress-step ${step >= 2 ? 'active' : ''}`}>2</div>
          </div>
          <div className="progress-labels">
            <span className={step === 1 ? 'active' : ''}>계정 정보</span>
            <span className={step === 2 ? 'active' : ''}>개인 정보</span>
          </div>
        </div>
        
        <form onSubmit={step === 1 ? (e) => { e.preventDefault(); handleNext(); } : handleSubmit} className="register-form">
          {step === 1 ? (
            <>
              <div className="input-group">
                <div className="input-wrapper">
                  <input
                    type="email"
                    name="email"
                    placeholder="이메일"
                    value={form.email}
                    onChange={handleChange}
                    required
                    className="form-input"
                  />
                  <div className="input-icon">📧</div>
                </div>
              </div>
              
              <div className="input-group">
                <div className="input-wrapper">
                  <input
                    type="text"
                    name="nickname"
                    placeholder="닉네임"
                    value={form.nickname}
                    onChange={handleChange}
                    required
                    className="form-input"
                  />
                  <div className="input-icon">👤</div>
                </div>
              </div>
              
              <div className="input-group">
                <div className="input-wrapper">
                  <input
                    type="password"
                    name="password"
                    placeholder="비밀번호"
                    value={form.password}
                    onChange={handleChange}
                    required
                    className="form-input"
                  />
                  <div className="input-icon">🔒</div>
                </div>
              </div>
              
              <div className="input-group">
                <div className="input-wrapper">
                  <input
                    type="password"
                    name="confirmPassword"
                    placeholder="비밀번호 확인"
                    value={form.confirmPassword}
                    onChange={handleChange}
                    required
                    className="form-input"
                  />
                  <div className="input-icon">🔐</div>
                </div>
              </div>
              
              <button type="submit" className="register-button">
                다음 단계
              </button>
            </>
          ) : (
            <>
              <div className="input-row">
                <div className="input-group">
                  <div className="input-wrapper">
                    <input
                      type="number"
                      name="age"
                      placeholder="나이"
                      value={form.age}
                      onChange={handleChange}
                      required
                      className="form-input"
                    />
                    <div className="input-icon">🎂</div>
                  </div>
                </div>
                
                <div className="input-group">
                  <div className="input-wrapper">
                    <select
                      name="gender"
                      value={form.gender}
                      onChange={handleChange}
                      required
                      className="form-input form-select"
                    >
                      <option value="">성별</option>
                      <option value="male">남성</option>
                      <option value="female">여성</option>
                    </select>
                    <div className="input-icon">⚧️</div>
                  </div>
                </div>
              </div>
              
              <div className="input-row">
                <div className="input-group">
                  <div className="input-wrapper">
                    <input
                      type="number"
                      name="height"
                      placeholder="키 (cm)"
                      value={form.height}
                      onChange={handleChange}
                      required
                      className="form-input"
                    />
                    <div className="input-icon">📏</div>
                  </div>
                </div>
                
                <div className="input-group">
                  <div className="input-wrapper">
                    <input
                      type="number"
                      name="weight"
                      placeholder="체중 (kg)"
                      value={form.weight}
                      onChange={handleChange}
                      required
                      className="form-input"
                    />
                    <div className="input-icon">⚖️</div>
                  </div>
                </div>
              </div>
              
              <div className="input-group">
                <div className="input-wrapper">
                  <select
                    name="activityLevel"
                    value={form.activityLevel}
                    onChange={handleChange}
                    required
                    className="form-input form-select"
                  >
                    <option value="">활동 수준</option>
                    <option value="sedentary">좌식 생활 (운동 안함)</option>
                    <option value="light">가벼운 활동 (주 1-3회)</option>
                    <option value="moderate">보통 활동 (주 3-5회)</option>
                    <option value="active">활발한 활동 (주 6-7회)</option>
                    <option value="very_active">매우 활발 (하루 2회)</option>
                  </select>
                  <div className="input-icon">🏃</div>
                </div>
              </div>
              
              <div className="button-group">
                <button type="button" className="back-button" onClick={handleBack}>
                  이전
                </button>
                <button
                  type="submit"
                  className={`register-button ${isLoading ? 'loading' : ''}`}
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <div className="loading-spinner"></div>
                  ) : (
                    '가입하기'
                  )}
                </button>
              </div>
            </>
          )}
        </form>
        
        {error && (
          <div className="error-message">
            <span className="error-icon">⚠️</span>
            {error}
          </div>
        )}
        
        <div className="register-footer">
          <p>이미 계정이 있으신가요? <a href="/login" className="login-link">로그인</a></p>
        </div>
      </div>
    </div>
  );
}
