import React, { useState } from 'react';
import Sidebar from '../components/Sidebar';

const MainLayout = ({ children }) => {
  const [isOpen, setIsOpen] = useState(false);
  const toggleSidebar = () => setIsOpen(!isOpen);

  return (
    <div className="min-h-screen bg-[#f8fafc] overflow-x-hidden">
      {/* 📱 MOBILE TOP BAR (Tetap Sticky biar gampang navigasi) */}
      <div className="lg:hidden flex items-center justify-between px-6 py-4 bg-white border-b border-slate-100 sticky top-0 z-[40] shadow-sm">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 bg-emerald-500 rounded-xl flex items-center justify-center text-white shadow-lg shadow-emerald-500/20">
            <i className="fas fa-box-open text-sm"></i>
          </div>
          <span className="font-black text-slate-800 tracking-tighter text-lg">iGUDANG</span>
        </div>
        <button onClick={toggleSidebar} className="p-2.5 text-slate-500 bg-slate-50 rounded-xl active:scale-95 transition-all">
          <i className={`fas ${isOpen ? 'fa-xmark' : 'fa-bars-staggered'} text-xl`}></i>
        </button>
      </div>

      <Sidebar isOpen={isOpen} toggleSidebar={toggleSidebar} />

      {/* 📦 CONTENT WRAPPER */}
      {/* lg:ml-72 buat PC, ml-0 buat HP. px-4 buat HP biar gak terlalu pojok */}
      <div className={`transition-all duration-500 lg:ml-72 min-h-screen flex flex-col`}>
        <main className="flex-1 p-5 md:p-10 lg:p-14 w-full max-w-[1600px] mx-auto">
          {children}
        </main>
      </div>
    </div>
  );
};

export default MainLayout;