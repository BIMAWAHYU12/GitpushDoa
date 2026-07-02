import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const response = await fetch('http://localhost:5000/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }),
      });
      const result = await response.json();
      if (!response.ok) throw new Error(result.message || 'Login gagal!');
      
      localStorage.setItem('token', result.token);
      localStorage.setItem('username', result.user.username);
      localStorage.setItem('user_role', result.user.role);
      navigate('/dashboard');
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-[#F6F6F2] p-4 relative overflow-hidden">
      {/* Background Animated Blobs */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden z-0">
        <div className="absolute -top-[10%] -right-[10%] w-[500px] h-[500px] bg-[#BADFE7]/30 rounded-full blur-[100px] animate-pulse"></div>
        <div className="absolute -bottom-[10%] -left-[10%] w-[600px] h-[600px] bg-[#C2EDCE]/30 rounded-full blur-[120px] animate-pulse delay-1000"></div>
      </div>

      {/* Login Card */}
      <div className="relative z-10 w-full max-w-sm bg-white/70 backdrop-blur-xl border border-white/50 p-8 sm:p-10 rounded-[3rem] shadow-[0_20px_50px_rgba(56,128,135,0.1)]">
        <div className="text-center mb-10">
          <div className="w-20 h-20 bg-[#388087] rounded-3xl mx-auto mb-6 flex items-center justify-center shadow-xl shadow-[#388087]/20 transform transition-transform hover:scale-105">
            <i className="fas fa-warehouse text-white text-3xl"></i>
          </div>
          <h1 className="text-2xl font-black text-[#388087] tracking-tight">iGUDANG</h1>
          <p className="text-[9px] font-black text-[#6FB3B8] uppercase tracking-[0.3em] mt-1">Terminal Logistik</p>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-rose-50 border border-rose-100 rounded-2xl text-rose-600 text-[10px] font-black uppercase tracking-wider text-center">
            {error}
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-4">
          <div className="relative">
            <i className="fas fa-user absolute left-5 top-1/2 -translate-y-1/2 text-[#388087]/40 text-xs"></i>
            <input 
              type="text" required value={username} onChange={(e) => setUsername(e.target.value)}
              className="w-full pl-14 pr-6 py-4 bg-white/60 border border-[#BADFE7]/30 rounded-2xl focus:outline-none focus:ring-2 focus:ring-[#388087]/30 text-xs font-bold text-[#388087] transition-all"
              placeholder="Username"
            />
          </div>

          <div className="relative">
            <i className="fas fa-lock absolute left-5 top-1/2 -translate-y-1/2 text-[#388087]/40 text-xs"></i>
            <input 
              type={showPassword ? "text" : "password"} required value={password} onChange={(e) => setPassword(e.target.value)}
              className="w-full pl-14 pr-14 py-4 bg-white/60 border border-[#BADFE7]/30 rounded-2xl focus:outline-none focus:ring-2 focus:ring-[#388087]/30 text-xs font-bold text-[#388087] transition-all"
              placeholder="••••••••"
            />
            <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-5 top-1/2 -translate-y-1/2 text-[#388087]/40">
              <i className={`fas ${showPassword ? 'fa-eye-slash' : 'fa-eye'} text-[10px]`}></i>
            </button>
          </div>

          <button 
            type="submit" disabled={isLoading}
            className="w-full py-4 mt-2 bg-[#388087] hover:bg-[#2c666c] text-white rounded-2xl font-black text-[10px] uppercase tracking-[0.25em] transition-all active:scale-[0.98]"
          >
            {isLoading ? <i className="fas fa-spinner animate-spin"></i> : "Masuk Terminal"}
          </button>
        </form>

        <p className="mt-8 text-center text-[9px] font-black text-[#388087]/30 uppercase tracking-[0.2em]">
          &copy; 2026 iGUDANG SUITE
        </p>
      </div>
    </div>
  );
};

export default Login;