import React, { useState } from 'react';
import Sidebar from '../components/Sidebar';

const MainLayout = ({ children }) => {
  const [isOpen, setIsOpen] = useState(false);
  const toggleSidebar = () => setIsOpen(!isOpen);

  return (
    // 🔥 FIX 1: Div paling luar dikunci murni warna Cream Satin (#F6F6F2) biar ga bocor ke samping monitor PC
    <div className="min-h-screen bg-[#F6F6F2] overflow-x-hidden text-[#388087]">
      
      {/* 📱 MOBILE TOP BAR */}
      {/* 🔥 FIX 2: Mengubah bg-white menjadi bg-[#F6F6F2] dengan border soft teal tipis (#BADFE7/50) */}
      <div className="lg:hidden flex items-center justify-between px-6 py-4 bg-[#F6F6F2] border-b border-[#BADFE7]/50 sticky top-0 z-[40]">
        <div className="flex items-center gap-3">
          {/* Menggunakan warna Deep Teal (#388087) dari palet lu */}
          <div className="w-9 h-9 bg-[#388087] rounded-xl flex items-center justify-center text-white shadow-md shadow-[#388087]/10">
            <i className="fas fa-box-open text-sm"></i>
          </div>
          <span className="font-black text-[#388087] tracking-tighter text-lg">iGUDANG</span>
        </div>
        <button onClick={toggleSidebar} className="p-2.5 text-[#388087] bg-white/50 border border-[#BADFE7]/40 backdrop-blur-sm rounded-xl active:scale-95 transition-all">
          <i className={`fas ${isOpen ? 'fa-xmark' : 'fa-bars-staggered'} text-base`}></i>
        </button>
      </div>

      {/* Komponen Sidebar dengan warna hijau teal tua lu */}
      <Sidebar isOpen={isOpen} toggleSidebar={toggleSidebar} />

      {/* 📦 CONTENT WRAPPER */}
      {/* 🔥 FIX 3: Memastikan area pembungkus konten PC dan Mobile tetap berada di atas fondasi warna Cream */}
      <div className="transition-all duration-500 lg:ml-72 min-h-screen flex flex-col bg-[#F6F6F2]">
        <main className="flex-1 p-5 md:p-10 lg:p-14 w-full max-w-[1600px] mx-auto bg-[#F6F6F2]">
          {children}
        </main>
      </div>
    </div>
  );
};

export default MainLayout;