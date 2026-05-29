import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const Login = () => {
  // State Input Form
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  
  // State Handling API Connection
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);
    
    try {
      // Tembak langsung ke Endpoint Backend Node.js lu
      const response = await fetch('http://localhost:5000/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, password }),
      });

      const result = await response.json();

      // Jika status code bukan 200 (misal: 400, 401, 500)
      if (!response.ok) {
        throw new Error(result.message || 'Login gagal, periksa jaringan Anda!');
      }

      // 🔥 AMBIL DATA ASLI DARI BACKEND & SIMPAN KE LOCALSTORAGE
      localStorage.setItem('token', result.token); 
      localStorage.setItem('user_role', result.user.role); // Otomatis 'admin' / 'staff' sesuai DB
      localStorage.setItem('username', result.user.username);
      localStorage.setItem('isLoggedIn', 'true');
      
      console.log("[FRONTEND LOG]: Login Sukses, Token disimpan.");
      
      // Redirect ke halaman Dashboard utama
      navigate('/dashboard');
    } catch (err) {
      // Tampilkan pesan error dari backend ke komponen UI
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-[#f8fafc] relative overflow-hidden font-sans">
      
      {/* 🔮 BACKGROUND ORNAMENTS: Efek Blur Futuristik */}
      <div className="absolute top-[-10%] left-[-10%] w-[45%] h-[45%] rounded-full bg-gradient-to-br from-emerald-400/20 to-cyan-500/10 blur-[120px] animate-pulse"></div>
      <div className="absolute bottom-[-10%] right-[-10%] w-[45%] h-[45%] rounded-full bg-gradient-to-tr from-blue-600/20 to-teal-400/10 blur-[120px]"></div>

      {/* 📦 LOGIN CARD CONTAINER */}
      <div className="w-full max-w-[440px] p-10 sm:p-14 bg-white rounded-[48px] shadow-[0_25px_60px_rgba(15,118,110,0.1)] border border-white/50 z-10 mx-4 backdrop-blur-sm">
        
        {/* HEADER: Branding iGudang (Typography Only) */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-black tracking-[-0.05em] flex items-center justify-center mb-4">
            <span className="bg-gradient-to-tr from-emerald-500 to-blue-600 bg-clip-text text-transparent">i</span>
            <span className="text-slate-800 ml-0.5">GUDANG</span>
            <span className="ml-1.5 h-2.5 w-2.5 rounded-full bg-emerald-500 shadow-[0_0_15px_rgba(52,211,153,1)]"></span>
          </h1>
          <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.5em] ml-1">
            Digital Inventory Terminal
          </p>
        </div>

        {/* ⚠️ ALERT BOX: Muncul otomatis jika username/password salah */}
        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 text-red-600 rounded-2xl text-xs font-bold text-center animate-shake">
            ⚠️ {error}
          </div>
        )}

        {/* FORM LOGIN */}
        <form onSubmit={handleLogin} className="space-y-7">
          
          {/* USERNAME INPUT */}
          <div className="space-y-2.5">
            <label className="block text-[11px] font-black text-slate-500 uppercase tracking-[0.2em] ml-1">
              Admin Username / ID
            </label>
            <div className="relative group">
              <i className="fas fa-user absolute left-6 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-emerald-500 transition-colors"></i>
              <input 
                type="text" 
                required
                disabled={isLoading}
                className="w-full pl-14 pr-6 py-4.5 bg-slate-50 border border-slate-100 rounded-2xl focus:outline-none focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-500 transition-all duration-300 text-sm font-bold text-slate-700 placeholder:text-slate-300 disabled:opacity-50"
                placeholder="Masukkan Username..."
                value={username}
                onChange={(e) => setUsername(e.target.value)}
              />
            </div>
          </div>

          {/* PASSWORD INPUT */}
          <div className="space-y-2.5">
            <label className="block text-[11px] font-black text-slate-500 uppercase tracking-[0.2em] ml-1">
              Secret Passcode
            </label>
            <div className="relative group">
              <i className="fas fa-lock absolute left-6 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-emerald-500 transition-colors"></i>
              <input 
                type="password" 
                required
                disabled={isLoading}
                className="w-full pl-14 pr-6 py-4.5 bg-slate-50 border border-slate-100 rounded-2xl focus:outline-none focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-500 transition-all duration-300 text-sm font-medium text-slate-700 placeholder:text-slate-300 disabled:opacity-50"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
          </div>

          {/* HELPER LINKS */}
          <div className="flex items-center justify-between px-1 pt-1">
            <label className="flex items-center cursor-pointer group">
              <div className="relative flex items-center">
                <input type="checkbox" className="peer hidden" />
                <div className="h-5 w-5 border-2 border-slate-200 rounded-lg peer-checked:bg-emerald-500 peer-checked:border-emerald-500 transition-all"></div>
                <i className="fas fa-check absolute text-[10px] text-white opacity-0 peer-checked:opacity-100 left-1.5 transition-opacity"></i>
              </div>
              <span className="ml-3 text-[12px] font-bold text-slate-400 group-hover:text-slate-600 transition-colors">Ingat Saya</span>
            </label>
            <a href="#" className="text-[12px] font-black text-emerald-600 hover:text-blue-700 transition-colors tracking-wide">Bantuan Akses?</a>
          </div>

          {/* BUTTON SUBMIT: Gradasi Vibrant dengan Status Loading */}
          <button 
            type="submit"
            disabled={isLoading}
            className="w-full py-5 bg-gradient-to-r from-emerald-500 via-teal-500 to-blue-600 hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 text-white rounded-2xl font-black text-[12px] tracking-[0.3em] shadow-xl shadow-emerald-500/30 transition-all duration-500 uppercase mt-4 flex items-center justify-center gap-2"
          >
            {isLoading ? (
              <span>AUTHENTICATING...</span>
            ) : (
              <span>AUTHENTICATE ACCESS</span>
            )}
          </button>
        </form>

        {/* FOOTER: System Version */}
        <div className="mt-14 text-center">
          <p className="text-[10px] font-black text-slate-300 uppercase tracking-[0.4em]">
            System Terminal v4.0.2 • Secured
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;