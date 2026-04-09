import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const Login = () => {
  // State diubah dari email ke username biar lebih taktis buat admin gudang
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleLogin = (e) => {
    e.preventDefault();
    
    // Logic Simulasi Login
    // Kita set role Admin di localStorage biar menu Inventory Control kebuka
    console.log("Authenticating User:", username);
    localStorage.setItem('user_role', 'Admin'); 
    localStorage.setItem('isLoggedIn', 'true');
    
    // Redirect ke Dashboard setelah login berhasil
    navigate('/dashboard');
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
                className="w-full pl-14 pr-6 py-4.5 bg-slate-50 border border-slate-100 rounded-2xl focus:outline-none focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-500 transition-all duration-300 text-sm font-bold text-slate-700 placeholder:text-slate-300"
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
                className="w-full pl-14 pr-6 py-4.5 bg-slate-50 border border-slate-100 rounded-2xl focus:outline-none focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-500 transition-all duration-300 text-sm font-medium text-slate-700 placeholder:text-slate-300"
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

          {/* BUTTON SUBMIT: Gradasi Vibrant */}
          <button 
            type="submit"
            className="w-full py-5 bg-gradient-to-r from-emerald-500 via-teal-500 to-blue-600 hover:scale-[1.02] active:scale-[0.98] text-white rounded-2xl font-black text-[12px] tracking-[0.3em] shadow-xl shadow-emerald-500/30 transition-all duration-500 uppercase mt-4"
          >
            Authenticate Access
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