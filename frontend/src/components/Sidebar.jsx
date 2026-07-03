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
    const base = "flex items-center px-5 py-3 rounded-xl font-bold text-[11px] tracking-widest transition-all duration-300 mb-1 mx-4 group relative overflow-hidden active:scale-[0.98]";
    
    return isActive 
      ? `${base} bg-[#F6F6F2] text-[#388087] shadow-lg shadow-black/10 font-black scale-[1.01]` 
      : `${base} text-[#BADFE7]/60 hover:bg-white/10 hover:text-white`;
  };

  const renderMenuIcon = (path, iconName) => {
    const isActive = location.pathname === path;
    return (
      <div className="w-7 flex justify-center mr-2.5">
        <div className={`w-6 h-6 rounded-md flex items-center justify-center transition-all ${
          isActive 
            ? 'bg-[#388087] text-white shadow-sm' 
            : 'bg-white/10 text-[#BADFE7]/50 group-hover:text-white group-hover:bg-white/20'
        }`}>
          <i className={`fas ${iconName} text-[10px]`}></i>
        </div>
      </div>
    );
  };

  return (
    <>
      {isOpen && (
        <div className="fixed inset-0 bg-slate-950/40 backdrop-blur-sm z-[40] lg:hidden" onClick={toggleSidebar}></div>
      )}

      <div className={`fixed top-0 left-0 h-screen w-72 z-[50] bg-[#388087] border-r border-[#6FB3B8]/20 text-white flex flex-col transition-transform duration-500 shadow-2xl ${isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}`}>
        
        <div className="px-8 py-8 flex items-center gap-3.5">
          <div className="w-10 h-10 bg-[#F6F6F2] rounded-xl flex items-center justify-center shadow-md shadow-black/5">
            <i className="fas fa-cubes text-[#388087] text-base"></i>
          </div>
          <div>
            <h1 className="text-xl font-black tracking-tight leading-none text-white">iGUDANG</h1>
            <p className="text-[8px] font-black text-[#BADFE7]/70 tracking-[0.3em] mt-1.5 uppercase">Logistic Suite</p>
          </div>
        </div>

        <nav className="flex-1 px-1 mt-4 overflow-y-auto custom-scrollbar space-y-0.5">
          
          <Link to="/dashboard" className={menuClass('/dashboard')}>
            {renderMenuIcon('/dashboard', 'fa-th-large')}
            <span>Dashboard Utama</span>
          </Link>

            <>
              <div className="px-6 pt-5 pb-2 text-[9px] font-black text-[#BADFE7]/40 tracking-[0.2em] uppercase">Master Terminal</div>
              
              <Link to="/barang" className={menuClass('/barang')}>
                {renderMenuIcon('/barang', 'fa-barcode')}
                <span>Data Barang Logistik</span>
              </Link>

              <Link to="/outlet" className={menuClass('/outlet')}>
                {renderMenuIcon('/outlet', 'fa-store')}
                <span>Jaringan Outlet</span>
              </Link>
            </>

          <div className="px-6 pt-5 pb-2 text-[9px] font-black text-[#BADFE7]/40 tracking-[0.2em] uppercase">Sirkulasi & Informasi</div>

          <Link to="/transaksi" className={menuClass('/transaksi')}>
            {renderMenuIcon('/transaksi', 'fa-exchange-alt')}
            <span>Form Mutasi Stok</span>
          </Link>

          <Link to="/riwayat" className={menuClass('/riwayat')}>
            {renderMenuIcon('/riwayat', 'fa-file-lines')}
            <span>Laporan Audit Log</span>
          </Link>

          <Link to="/gudanginfo" className={menuClass('/gudanginfo')}>
            {renderMenuIcon('/gudanginfo', 'fa-map-location-dot')}
            <span>Manual & Denah Gudang</span>
          </Link>

          {role.toLowerCase() === 'admin' && (
            <Link to="/usermanagement" className={menuClass('/usermanagement')}>
              {renderMenuIcon('/usermanagement', 'fa-user-gear')}
              <span>User Management</span>
            </Link>
          )}
          
          <Link to="/tentang-kami" className={menuClass('/tentang-kami')}>
            {renderMenuIcon('/tentang-kami', 'fa-circle-info')}
            <span>Tentang iGUDANG</span>
          </Link>
        </nav>

        <div className="p-5 bg-black/10 border-t border-white/5">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3 min-w-0">
              <div className="w-10 h-10 rounded-xl bg-[#F6F6F2] border border-[#BADFE7]/20 flex items-center justify-center font-black text-xs text-[#388087] shadow-inner uppercase flex-shrink-0">
                {username.charAt(0)}
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-xs font-bold text-white tracking-tight truncate">{username}</p>
                <p className="text-[9px] font-black text-[#BADFE7] uppercase tracking-widest mt-0.5">{role}</p>
              </div>
            </div>
            
            <button 
              onClick={handleLogout}
              className="w-9 h-9 flex items-center justify-center rounded-xl text-[#BADFE7]/70 hover:text-red-300 hover:bg-white/10 transition-all flex-shrink-0"
              title="Keluar dari Sistem"
            >
              <i className="fas fa-power-off text-sm"></i>
            </button>
          </div>
        </div>

      </div>
    </>
  );
};

export default Sidebar;