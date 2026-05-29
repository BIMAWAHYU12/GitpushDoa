import React from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';

const Sidebar = ({ isOpen, toggleSidebar }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const role = localStorage.getItem('user_role') || 'Admin';
  const username = localStorage.getItem('username') || 'Admin';

  const handleLogout = () => {
    localStorage.clear();
    navigate('/login');
  };

  const menuClass = (path) => {
    const isActive = location.pathname === path;
    const base = "flex items-center px-6 py-3.5 rounded-2xl font-bold text-[11px] tracking-[0.15em] transition-all duration-300 mb-1.5 mx-4 group relative overflow-hidden";
    
    // Warna aktif: Putih Solid dengan teks Teal Gelap
    return isActive 
      ? `${base} bg-white text-[#0F766E] shadow-xl shadow-black/10 scale-[1.02]` 
      : `${base} text-teal-50/60 hover:bg-white/10 hover:text-white`;
  };

  // Helper untuk merender wrapper icon kotak minimalis (Persis gaya gambar lu)
  const renderMenuIcon = (path, iconName) => {
    const isActive = location.pathname === path;
    return (
      <div className="w-8 flex justify-center mr-3">
        <div className={`w-6 h-6 rounded-lg flex items-center justify-center transition-colors ${isActive ? 'bg-[#0F766E] text-white' : 'bg-white/10 text-teal-200/50 group-hover:text-white group-hover:bg-white/20'}`}>
          <i className={`fas ${iconName} text-[10px]`}></i>
        </div>
      </div>
    );
  };

  return (
    <>
      {/* OVERLAY MOBILE */}
      {isOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[40] lg:hidden" onClick={toggleSidebar}></div>
      )}

      {/* SIDEBAR MAIN: Gradasi Teal-Blue */}
      <div className={`fixed top-0 left-0 h-screen w-72 z-[50] bg-gradient-to-b from-[#0D9488] via-[#0F766E] to-[#1E40AF] text-white flex flex-col transition-transform duration-500 shadow-2xl ${isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}`}>
        
        {/* --- HEADER: BRANDING --- */}
        <div className="px-8 py-10 flex items-center gap-4">
          <div className="w-11 h-11 bg-white/20 backdrop-blur-md rounded-2xl flex items-center justify-center border border-white/20 shadow-lg">
            <i className="fas fa-box-open text-white text-xl"></i>
          </div>
          <div>
            <h1 className="text-2xl font-black tracking-tighter leading-none">iGUDANG</h1>
            <p className="text-[9px] font-bold text-teal-200/50 tracking-[0.4em] mt-1 uppercase">Inventory Pro</p>
          </div>
        </div>

        {/* --- NAVIGATION: CLEAN LIST --- */}
        <nav className="flex-1 px-2 mt-2 overflow-y-auto custom-scrollbar space-y-0.5">
          
          <Link to="/dashboard" className={menuClass('/dashboard')}>
            {renderMenuIcon('/dashboard', 'fa-th-large')}
            <span>DASHBOARD</span>
          </Link>

          {/* MENU DATA UTAMA (Hanya Admin) */}
{role.toLowerCase() === 'admin' && (            <>
              <div className="px-6 pt-4 pb-2 text-[9px] font-black text-teal-200/30 tracking-[0.25em] uppercase">Master Terminal</div>
              
              <Link to="/barang" className={menuClass('/barang')}>
                {renderMenuIcon('/barang', 'fa-box')}
                <span>DATA BARANG</span>
              </Link>

              <Link to="/outlet" className={menuClass('/outlet')}>
                {renderMenuIcon('/outlet', 'fa-shop')}
                <span>DATA OUTLET</span>
              </Link>

            </>
          )}

          {/* MENU LOGISTIK & PROFIL */}
          <div className="px-6 pt-4 pb-2 text-[9px] font-black text-teal-200/30 tracking-[0.25em] uppercase">Logistik & Sistem</div>

          <Link to="/transaksi" className={menuClass('/transaksi')}>
            {renderMenuIcon('/transaksi', 'fa-exchange-alt')}
            <span>TRANSAKSI</span>
          </Link>

          <Link to="/riwayat" className={menuClass('/riwayat')}>
            {renderMenuIcon('/riwayat', 'fa-file-alt')}
            <span>LAPORAN</span>
          </Link>
          
          <Link to="/tentang-kami" className={menuClass('/tentang-kami')}>
            {renderMenuIcon('/about', 'fa-info-circle')}
            <span>TENTANG KAMI</span>
          </Link>
        
        </nav>

        {/* --- FOOTER: USER PROFILE --- */}
        <div className="p-6 bg-black/10 border-t border-white/5">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              {/* Avatar Bulat Mengambil Huruf Depan Nama User */}
              <div className="w-12 h-12 rounded-full bg-white/10 border border-white/20 flex items-center justify-center font-black text-sm text-white shadow-inner uppercase">
                {username.charAt(0)}
              </div>
              <div>
                <p className="text-xs font-black text-white uppercase tracking-tight max-w-[120px] truncate">{username}</p>
                <p className="text-[10px] font-bold text-teal-300 uppercase tracking-widest">{role}</p>
              </div>
            </div>
            
            {/* Logout Icon Button */}
            <button 
              onClick={handleLogout}
              className="w-10 h-10 flex items-center justify-center rounded-xl text-teal-200 hover:text-red-400 hover:bg-red-500/10 transition-all"
              title="Logout Sistem"
            >
              <i className="fas fa-sign-out-alt text-lg"></i>
            </button>
          </div>
        </div>

      </div>
    </>
  );
};

export default Sidebar;