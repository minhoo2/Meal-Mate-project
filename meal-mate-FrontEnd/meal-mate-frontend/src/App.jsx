import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import Profile from './pages/Profile';  

function App() {
  const isLoggedIn = !!localStorage.getItem('accessToken');

  return (
    <Router>
      <Routes>
        <Route path="/" element={isLoggedIn ? <Navigate to="/profile" replace /> : <Navigate to="/login" replace />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/profile" element={isLoggedIn ? <Profile /> : <Navigate to="/login" replace />} />
      </Routes>
    </Router>
  );
}

export default App;
