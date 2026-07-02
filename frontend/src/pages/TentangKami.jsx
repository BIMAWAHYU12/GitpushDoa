import fotoAlia from "../assets/alia.jpeg";
import fotoBima from "../assets/bima.jpg";
import fotoFarhan from "../assets/farhan.jpeg";
import fotoRafif from "../assets/rafif.jpeg";
import fotoYuri from "../assets/yuri.jpeg";

const TentangKami = () => {
  const timData = [
    {
      id: 1,
      nama: "Bima",
      nim: "0110224059",
      role: "Lead Project",
      avatar: fotoBima,
      github: "https://github.com/BIMAWAHYU12",
      linkedin: "https://www.linkedin.com/in/bima-wahyu-47414a28a/",
    },
    {
      id: 2,
      nama: "Rapip",
      nim: "0110224205",
      role: "Team",
      avatar: fotoRafif,
      github: "https://github.com/RapipIyaa",
      linkedin: "https://www.linkedin.com/in/muhammad-adrian-rafif-117332344",
    },
    {
      id: 3,
      nama: "Alya",
      nim: "0110224000",
      role: "Team",
      avatar: fotoAlia,
      github: "https://github.com/AliaMaisyarah14",
      linkedin: "https://www.linkedin.com/in/alia-maisyarah-331aba412",
    },
    {
      id: 4,
      nama: "Yurida",
      nim: "0110224xxx",
      role: "Team",
      avatar: fotoYuri,
      github: "https://github.com/Yurida26",
      linkedin: "https://www.linkedin.com/in/yurida-yahsya-740819343",
    },
    {
      id: 5,
      nama: "Farhan",
      nim: "0110224xxx",
      role: "Team",
      avatar: fotoFarhan,
      github: "https://github.com/MuhamadFarhan2912",
      linkedin:
        "https://www.linkedin.com/in/muhamad-farhan-apriliansyah-02525430a",
    },
  ];

  return (
    <div className="w-full min-h-screen bg-[#F6F6F2] text-[#388087] p-4 md:p-8 space-y-12 animate-fadeIn">
      {/* ─── HERO SECTION ─── */}
      <div className="max-w-5xl mx-auto text-center space-y-4 pt-4">
        <span className="text-[10px] font-black tracking-[0.3em] text-[#6FB3B8] uppercase">
          Group 11 Development Team
        </span>
        <h1 className="text-4xl md:text-5xl font-black tracking-tighter text-[#388087] uppercase leading-none">
          About Our Team
        </h1>
        <p className="text-slate-500 font-medium max-w-2xl mx-auto text-xs md:text-sm leading-relaxed">
          Arsitek di balik layar pengembangan iGUDANG. Berdedikasi tinggi
          menciptakan sistem manajemen logistik pintar yang presisi, aman, dan
          efisien.
        </p>
      </div>

      {/* ─── GRID TIM ─── */}
      <div className="max-w-7xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6">
        {timData.map((member) => (
          <div
            key={member.id}
            className="bg-white rounded-[28px] overflow-hidden border border-[#BADFE7]/60 shadow-sm hover:shadow-xl hover:border-[#388087]/30 transition-all duration-300 flex flex-col justify-between group"
          >
            <div className="w-full space-y-4">
              <div className="w-full aspect-square bg-slate-50 overflow-hidden flex items-center justify-center relative border-b border-[#BADFE7]/40 shadow-inner">
                {member.avatar ? (
                  <img
                    src={member.avatar}
                    alt={member.nama}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105 select-none"
                  />
                ) : (
                  <div className="text-center space-y-2">
                    <div className="w-14 h-14 bg-white border border-slate-100 rounded-2xl flex items-center justify-center text-slate-300 shadow-sm mx-auto group-hover:text-[#388087] transition-colors duration-300">
                      <i className="fas fa-user text-xl"></i>
                    </div>
                    <p className="text-[9px] font-black text-slate-300 uppercase tracking-widest">
                      No Photo
                    </p>
                  </div>
                )}
              </div>

              <div className="space-y-1 text-left px-4.5 pb-1">
                <h4 className="font-black text-slate-800 text-xs md:text-sm uppercase tracking-tight line-clamp-2 leading-tight group-hover:text-[#388087] transition-colors duration-300">
                  {member.nama}
                </h4>
                <p className="text-[10px] font-bold text-slate-400 tracking-wider">
                  NIM: {member.nim}
                </p>
              </div>
            </div>

            <div className="px-4.5 pb-5 pt-2 space-y-3 w-full">
              {/* Badge Role Hijau Konsisten */}
              <div className="bg-[#BADFE7]/20 text-[#388087] px-3 py-2 rounded-xl text-center border border-[#BADFE7]/10">
                <p className="text-[9px] font-black uppercase tracking-widest truncate leading-none">
                  {member.role}
                </p>
              </div>

              {/* Ikon GitHub & LinkedIn Warna Hijau */}
              <div className="flex justify-center gap-2 pt-0.5">
                <a
                  href={member.github}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-8 h-8 rounded-full bg-[#BADFE7]/20 text-[#388087] hover:bg-[#388087] hover:text-white transition-all flex items-center justify-center"
                >
                  <i className="fab fa-github text-xs"></i>
                </a>

                <a
                  href={member.linkedin}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-8 h-8 rounded-full bg-[#BADFE7]/20 text-[#388087] hover:bg-[#388087] hover:text-white transition-all flex items-center justify-center"
                >
                  <i className="fab fa-linkedin-in text-xs"></i>
                </a>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* ─── FOOTER SECTION ─── */}
      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-8 pt-4">
        <div className="bg-white p-8 md:p-10 rounded-[32px] border border-[#BADFE7]/60 shadow-sm flex flex-col justify-between text-left">
          <div className="space-y-4">
            <h3 className="font-black text-[#388087] text-base uppercase tracking-wider flex items-center gap-3">
              <i className="fas fa-bullseye text-xs text-[#6FB3B8]"></i> Misi
              Rekayasa Sistem
            </h3>
            <p className="text-slate-600 font-semibold leading-relaxed text-xs md:text-sm">
              iGUDANG dirancang untuk mengeliminasi kesalahan pencatatan
              logistik secara konvensional. Melalui pendekatan arsitektur
              *Full-Stack*, kami menghadirkan modul mutasi digital yang
              responsif, visualisasi matriks stok yang informatif, serta sistem
              label QR otomatis demi memangkas waktu operasional manajemen
              gudang kelontong.
            </p>
          </div>
          <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100 mt-6">
            <p className="text-[11px] text-slate-400 font-medium leading-relaxed">
              Proyek ini dikembangkan penuh secara kolaboratif guna memenuhi
              standarisasi ujian akhir praktikum rekayasa perangkat lunak
              berbasis web.
            </p>
          </div>
        </div>

        <div className="bg-[#388087] p-8 md:p-10 rounded-[32px] text-white shadow-lg shadow-[#388087]/10 text-left relative overflow-hidden">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(186,223,231,0.1),transparent_40%)]"></div>
          <h3 className="font-black text-white text-base uppercase tracking-wider mb-6 flex items-center gap-3 relative z-10">
            <i className="fas fa-code text-xs text-[#BADFE7]"></i> Spesifikasi
            Arsitektur Stack
          </h3>
          <div className="grid grid-cols-2 gap-4 relative z-10">
            {[
              { label: "Frontend Core", val: "React.js Engine" },
              { label: "Backend Core", val: "Express.js Service" },
              { label: "Database Relasional", val: "MySQL Database" },
              { label: "CSS Framework", val: "Tailwind v3.x" },
            ].map((tech, i) => (
              <div
                key={i}
                className="bg-white/10 p-3.5 rounded-xl border border-white/5 backdrop-blur-sm"
              >
                <p className="text-[8px] uppercase tracking-widest text-[#BADFE7] font-black">
                  {tech.label}
                </p>
                <p className="text-xs font-bold text-white mt-1 leading-none">
                  {tech.val}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default TentangKami;
