import React from 'react';
import fotoBima from '../assets/bima.jpg';

const TentangKami = () => {
  // 🔥 SILAKAN ISI DATA KELOMPOK LU DI SINI, BIM!
  const timData = [
    {
      id: 1,
      nama: "Bima",
      nim: "0110224059",
      role: "Scrum Master & Fullstack Developer",
      avatar: fotoBima // Lu bisa isi path gambar misal: "/images/bima.jpg"
    },
    {
      id: 2,
      nama: "Muhammad Adrian Rapip",
      nim: "0110224205",
      role: "Backend Developer & DB Designer",
      avatar: null
    },
    {
      id: 3,
      nama: "Ardhika Adfiansyah Setiana",
      nim: "0110224000", // Sesuaikan NIM lu di sini, Dhika
      role: "Frontend Engineer & UI/UX Designer",
      avatar: null
    },
    {
      id: 4,
      nama: "Nama Anggota 4",
      nim: "0110224xxx",
      role: "Quality Assurance & Tester",
      avatar: null
    },
    {
      id: 5,
      nama: "Nama Anggota 5",
      nim: "0110224xxx",
      role: "Technical Writer & Documentator",
      avatar: null
    }
  ];

  return (
    <div className="w-full space-y-8 md:space-y-12 animate-fadeIn text-left pb-12">
      
      {/* 🚀 HEADER HALAMAN */}
      <div className="px-1 space-y-1">
        <h1 className="text-3xl font-black text-slate-800 tracking-tight uppercase">Tentang Kami</h1>
        <p className="text-slate-500 font-medium text-sm">
          Aktor di balik layar pengembangan sistem manajemen inventaris pintar iGUDANG.
        </p>
      </div>

      {/* 🏛️ PROFIL PROJEK CARD */}
      <div className="bg-white rounded-[32px] p-8 md:p-10 border border-slate-100 shadow-[0_10px_40px_rgba(0,0,0,0.02)] relative overflow-hidden">
        <div className="max-w-3xl relative z-10 space-y-3">
          <h4 className="text-xs font-black text-emerald-600 uppercase tracking-[0.25em]">Visi & Pengembangan</h4>
          <h2 className="text-xl md:text-2xl font-black text-slate-800 tracking-tight">iGUDANG Ecosystem v1.0</h2>
          <p className="text-slate-500 text-sm font-medium leading-relaxed">
            Aplikasi ini dirancang sebagai solusi ekosistem digital pergudangan modern untuk memantau aktivitas persediaan barang elektronik secara akurat, aman, dan real-time. Dikembangkan menggunakan stack teknologi <span className="text-[#0D9488] font-bold">React.js</span> pada frontend dan <span className="text-[#1E40AF] font-bold">Express.js</span> dengan database <span className="font-bold text-slate-700">MySQL</span> pada backend demi memenuhi tugas besar praktikum pengembangan aplikasi full-stack web semester 4.
          </p>
        </div>
        <i className="fas fa-laptop-code absolute -bottom-8 -right-8 text-9xl text-slate-50/80 -rotate-12 pointer-events-none"></i>
      </div>

      {/* 📦 KELOMPOK TIM SECTION (GRID 5 SLOT GAMBAR) */}
      <div className="space-y-6">
        <div className="flex items-center justify-between px-1">
          <h3 className="font-black text-slate-800 uppercase tracking-[0.2em] text-xs">Struktur Anggota Kelompok 11</h3>
          <div className="text-[9px] font-bold text-slate-400 uppercase tracking-wider bg-slate-50 px-3 py-1 rounded-full border border-slate-100">STT Terpadu Nurul Fikri</div>
        </div>

        {/* Layout Grid Responsif: 2 Kolom di HP, 3 di Tablet, 5 di Desktop */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4 md:gap-6">
          {timData.map((member) => (
            <div 
              key={member.id} 
              className="bg-white rounded-3xl border border-slate-100 overflow-hidden shadow-sm group hover:border-emerald-200 hover:shadow-md transition-all flex flex-col justify-between"
            >
              {/* RUANG GAMBAR / FOTO */}
              <div className="aspect-[4/5] bg-slate-50 relative p-3">
                <div className="w-full h-full bg-slate-100 rounded-2xl flex flex-col items-center justify-center overflow-hidden border border-slate-200/40 relative">
                  {member.avatar ? (
                    <img 
                      src={member.avatar} 
                      alt={member.nama} 
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  ) : (
                    /* Fallback Icon jika Foto Belum Ada */
                    <div className="text-center space-y-2 p-4">
                      <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center text-slate-300 shadow-sm mx-auto group-hover:text-emerald-500 transition-colors">
                        <i className="fas fa-user text-lg"></i>
                      </div>
                      <p className="text-[9px] font-black text-slate-300 uppercase tracking-widest">No Photo</p>
                    </div>
                  )}
                </div>
                
                {/* Badge Identitas Tim kecil melayang */}
                <div className="absolute top-5 left-5 bg-slate-900/80 backdrop-blur-md px-2 py-0.5 rounded-md text-[7px] font-black uppercase text-white tracking-widest shadow-sm">
                  TIM {member.id}
                </div>
              </div>

              {/* DATA IDENTITAS: NAMA, NIM, ROLE */}
              <div className="p-4 pt-1 flex-1 flex flex-col justify-between bg-white text-left">
                <div className="space-y-1">
                  {/* Nama Anggota */}
                  <h4 className="font-black text-slate-800 text-xs md:text-sm uppercase tracking-tight line-clamp-2 leading-tight group-hover:text-emerald-600 transition-colors">
                    {member.nama}
                  </h4>
                  {/* NIM Anggota */}
                  <p className="text-[10px] font-bold text-slate-400 tracking-wider">
                    NIM: {member.nim}
                  </p>
                </div>

                {/* Role Anggota (Dipisahkan garis border tipis) */}
                <div className="border-t border-slate-50 pt-3 mt-3">
                  <div className="px-2 py-1 bg-gradient-to-r from-slate-50 to-slate-100 rounded-lg border border-slate-200/30">
                    <p className="text-[8px] font-black text-slate-500 uppercase tracking-wide leading-tight text-center truncate">
                      {member.role}
                    </p>
                  </div>
                </div>
              </div>

            </div>
          ))}
        </div>
      </div>

    </div>
  );
};

export default TentangKami;