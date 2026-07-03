import React, { useState } from 'react';
import Sidebar from '../components/Sidebar';

const MainLayout = ({ children }) => {
  const [isOpen, setIsOpen] = useState(false);
  const toggleSidebar = () => setIsOpen(!isOpen);

  return (
    <div className="min-h-screen bg-[#F6F6F2] overflow-x-hidden text-[#388087]">
      
      <div className="lg:hidden flex items-center justify-between px-6 py-4 bg-[#F6F6F2] border-b border-[#BADFE7]/50 sticky top-0 z-[40]">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 bg-[#388087] rounded-xl flex items-center justify-center text-white shadow-md shadow-[#388087]/10">
            <i className="fas fa-box-open text-sm"></i>
          </div>
          <span className="font-black text-[#388087] tracking-tighter text-lg">iGUDANG</span>
        </div>
        <button onClick={toggleSidebar} className="p-2.5 text-[#388087] bg-white/50 border border-[#BADFE7]/40 backdrop-blur-sm rounded-xl active:scale-95 transition-all">
          <i className={`fas ${isOpen ? 'fa-xmark' : 'fa-bars-staggered'} text-base`}></i>
        </button>
      </div>

      <Sidebar isOpen={isOpen} toggleSidebar={toggleSidebar} />


      <div className="transition-all duration-500 lg:ml-72 min-h-screen flex flex-col bg-[#F6F6F2]">
        <main className="flex-1 p-5 md:p-10 lg:p-14 w-full max-w-[1600px] mx-auto bg-[#F6F6F2]">
          {children}
        </main>
      </div>
    </div>
  );
};

export default MainLayout;