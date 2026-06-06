import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const Login = () => {
  // State Input Form
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  
  // State Handling API & Validasi
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isTouched, setIsTouched] = useState({ username: false, password: false });
  
  const navigate = useNavigate();

  // Bersihkan error secara otomatis ketika user mulai mengetik ulang
  useEffect(() => {
    if (error) setError('');
  }, [username, password]);

  const handleLogin = async (e) => {
    e.preventDefault();
    
    // Validasi sederhana di sisi klien sebelum menembak API
    if (username.trim().length < 3) {
      setError('Username harus memiliki minimal 3 karakter!');
      return;
    }

    setError('');
    setIsLoading(true);
    
    try {
      const response = await fetch('http://localhost:5000/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, password }),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || 'Kredensial salah atau server tidak merespon!');
      }

      // SIMPAN DATA KE LOCALSTORAGE
      localStorage.setItem('token', result.token); 
      localStorage.setItem('user_role', result.user.role); 
      localStorage.setItem('username', result.user.username);
      localStorage.setItem('isLoggedIn', 'true');
      
      console.log("[FRONTEND LOG]: Login Sukses.");
      navigate('/dashboard');
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-[#f8fafc] relative overflow-hidden font-sans select-none">
      
      {/* 🔮 BACKGROUND ORNAMENTS: Blur Futuristik */}
      <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] rounded-full bg-gradient-to-br from-emerald-400/20 to-cyan-500/10 blur-[130px] animate-pulse"></div>
      <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] rounded-full bg-gradient-to-tr from-blue-600/20 to-teal-400/10 blur-[130px]"></div>

      {/* 📦 LOGIN CARD CONTAINER */}
      <div className="w-full max-w-[450px] p-8 sm:p-12 bg-white/90 rounded-[40px] shadow-[0_30px_70px_rgba(15,118,110,0.08)] border border-slate-100 z-10 mx-4 backdrop-blur-md transition-all duration-300">
        
        {/* HEADER: Branding iGudang */}
        <div className="text-center mb-10">
          <h1 className="text-4xl font-black tracking-[-0.05em] flex items-center justify-center mb-3">
            <span className="bg-gradient-to-tr from-emerald-500 via-teal-500 to-blue-600 bg-clip-text text-transparent">i</span>
            <span className="text-slate-800 ml-0.5 tracking-tight">GUDANG</span>
            <span className="ml-1.5 h-2.5 w-2.5 rounded-full bg-emerald-500 shadow-[0_0_15px_rgba(52,211,153,1)]"></span>
          </h1>
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.4em] ml-1">
            Digital Inventory Terminal
          </p>
        </div>

        {/* ⚠️ ALERT BOX */}
        {error && (
          <div className="mb-6 p-4 bg-red-50/80 border border-red-100 text-red-600 rounded-2xl text-xs font-semibold flex items-center gap-2 justify-center animate-fade-in shadow-sm">
            <i className="fas fa-exclamation-circle text-sm"></i>
            <span>{error}</span>
          </div>
        )}

        {/* FORM LOGIN */}
        <form onSubmit={handleLogin} className="space-y-6">
          
          {/* USERNAME INPUT */}
          <div className="space-y-2">
            <label className={`block text-[10px] font-black uppercase tracking-[0.15em] ml-1 transition-colors duration-300 ${isTouched.username ? 'text-emerald-600' : 'text-slate-400'}`}>
              Admin Username / ID
            </label>
            <div className="relative">
              <i className={`fas fa-user absolute left-5 top-1/2 -translate-y-1/2 transition-colors duration-300 ${username ? 'text-emerald-500' : 'text-slate-300'}`}></i>
              <input 
                type="text" 
                required
                disabled={isLoading}
                onFocus={() => setIsTouched({ ...isTouched, username: true })}
                onBlur={() => setIsTouched({ ...isTouched, username: false })}
                className="w-full pl-13 pr-5 py-4 bg-slate-50 border border-slate-200/60 rounded-2xl focus:outline-none focus:ring-4 focus:ring-emerald-500/5 focus:border-emerald-500 focus:bg-white transition-all duration-300 text-sm font-bold text-slate-700 placeholder:text-slate-300 disabled:opacity-50"
                placeholder="Ex: admin_dhika"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
              />
            </div>
          </div>

          {/* PASSWORD INPUT */}
          <div className="space-y-2">
            <label className={`block text-[10px] font-black uppercase tracking-[0.15em] ml-1 transition-colors duration-300 ${isTouched.password ? 'text-emerald-600' : 'text-slate-400'}`}>
              Secret Passcode
            </label>
            <div className="relative">
              <i className={`fas fa-lock absolute left-5 top-1/2 -translate-y-1/2 transition-colors duration-300 ${password ? 'text-emerald-500' : 'text-slate-300'}`}></i>
              <input 
                type={showPassword ? "text" : "password"} 
                required
                disabled={isLoading}
                onFocus={() => setIsTouched({ ...isTouched, password: true })}
                onBlur={() => setIsTouched({ ...isTouched, password: false })}
                className="w-full pl-13 pr-12 py-4 bg-slate-50 border border-slate-200/60 rounded-2xl focus:outline-none focus:ring-4 focus:ring-emerald-500/5 focus:border-emerald-500 focus:bg-white transition-all duration-300 text-sm font-medium text-slate-700 placeholder:text-slate-300 disabled:opacity-50 tracking-wide"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              {/* Tombol Intip Password */}
              {password && (
                <button
                  type="button"
                  tabIndex="-1"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 focus:outline-none transition-colors p-1"
                >
                  <i className={`fas ${showPassword ? 'fa-eye-slash' : 'fa-eye'} text-xs`}></i>
                </button>
              )}
            </div>
          </div>

          {/* HELPER LINKS */}
          <div className="flex items-center justify-between px-1 pt-0.5">
            <label className="flex items-center cursor-pointer group">
              <div className="relative flex items-center">
                <input 
                  type="checkbox" 
                  className="peer hidden" 
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                />
                <div className="h-[18px] w-[18px] border-2 border-slate-200 rounded-md peer-checked:bg-emerald-500 peer-checked:border-emerald-500 transition-all duration-200"></div>
                <i className="fas fa-check absolute text-[9px] text-white opacity-0 peer-checked:opacity-100 left-1.5 transition-opacity duration-200"></i>
              </div>
              <span className="ml-2.5 text-xs font-semibold text-slate-400 group-hover:text-slate-600 transition-colors duration-200 select-none">Ingat Sesi</span>
            </label>
            <a href="#" className="text-xs font-bold text-emerald-600 hover:text-blue-600 transition-colors duration-200 tracking-tight">Butuh Bantuan?</a>
          </div>

          {/* BUTTON SUBMIT */}
          <button 
            type="submit"
            disabled={isLoading}
            className="w-full h-[54px] bg-gradient-to-r from-emerald-500 via-teal-500 to-blue-600 hover:opacity-95 active:scale-[0.99] disabled:opacity-50 text-white rounded-2xl font-black text-[11px] tracking-[0.25em] shadow-lg shadow-emerald-500/20 transition-all duration-300 uppercase mt-2 flex items-center justify-center gap-2 cursor-pointer"
          >
            {isLoading ? (
              <div className="flex items-center gap-2.5">
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                <span className="opacity-90">Memverifikasi...</span>
              </div>
            ) : (
              <span>Masuk Terminal</span>
            )}
          </button>
        </form>

        {/* FOOTER: System Status & Version */}
        <div className="mt-10 text-center flex flex-col gap-1">
          <p className="text-[9px] font-black text-slate-300 uppercase tracking-[0.3em]">
            System Terminal v4.0.2
          </p>
          <div className="flex items-center justify-center gap-1.5 text-[9px] font-bold text-emerald-500/80 uppercase tracking-wider">
            <span className="h-1 w-1 rounded-full bg-emerald-400 animate-ping"></span>
            Semua Sistem Operasional
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;