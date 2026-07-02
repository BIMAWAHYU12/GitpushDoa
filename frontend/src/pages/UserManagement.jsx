import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { AreaChart, Area, ResponsiveContainer, Tooltip, XAxis, YAxis, CartesianGrid, ReferenceLine } from 'recharts';

// 1. KUSTOMISASI NODE (TITIK TRANSAKSI EKG)
const CustomNode = (props) => {
  const { cx, cy, payload } = props;
  if (payload.is_empty) return null; 

  const isMasuk = payload.chart_value > 0;
  const dotColor = isMasuk ? '#10b981' : '#f43f5e'; 

  return (
    <g>
      <circle cx={cx} cy={cy} r={12} fill={dotColor} fillOpacity={0.15} className="animate-pulse" />
      <circle cx={cx} cy={cy} r={6} fill={dotColor} stroke="#ffffff" strokeWidth={2.5} className="drop-shadow-md" />
    </g>
  );
};

// 2. KUSTOMISASI TOOLTIP LENGKAP
const CustomTooltip = ({ active, payload }) => {
  if (active && payload && payload.length) {
    const data = payload[0].payload;
    if (data.is_empty) return null;
    
    let tipeLabel = 'MUTASI';
    let textColor = 'text-slate-800';
    let icon = '';
    
    if (data.tipe_mutasi === 'IN' || data.tipe_mutasi === 'MASUK') {
       tipeLabel = 'IN (MASUK)';
       textColor = 'text-emerald-500';
       icon = 'fa-arrow-up text-emerald-500';
    } else if (data.keterangan && data.keterangan.includes('[AUDIT STOK]')) {
       tipeLabel = 'AUDIT / RUSAK';
       textColor = 'text-rose-600';
       icon = 'fa-triangle-exclamation text-rose-600';
    } else {
       tipeLabel = 'OUT (KELUAR)';
       textColor = 'text-amber-500';
       icon = 'fa-arrow-down text-amber-500';
    }

    return (
      <div className="bg-white p-4 border border-slate-200 shadow-2xl rounded-2xl text-xs min-w-[240px] max-w-[300px] z-[9999]">
        <div className="flex justify-between items-start mb-3 border-b border-slate-100 pb-3">
          <div>
            <p className="font-black text-slate-500 mb-1"><i className="far fa-clock mr-1"></i> {data.jam} WIB</p>
            <span className={`font-black uppercase tracking-wider text-[11px] bg-slate-50 px-2 py-0.5 rounded-md border border-slate-100 ${textColor}`}>{tipeLabel}</span>
          </div>
          <div className="text-right">
            <p className="font-black text-slate-800 text-xl leading-none">{Math.abs(data.chart_value)}</p>
            <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">Item</span>
          </div>
        </div>

        <div className="mb-3 px-3 py-2 bg-slate-50 rounded-xl border border-slate-100 flex items-center gap-2">
           <div className="w-5 h-5 rounded-full bg-[#BADFE7]/50 flex items-center justify-center text-[#388087]"><i className="fas fa-user text-[9px]"></i></div>
           <p className="text-[10px] font-black text-slate-500 uppercase tracking-wide">Eksekutor: <span className="text-[#388087]">{data.nama_petugas || 'Sistem'}</span></p>
        </div>

        {data.items && data.items.length > 0 && (
          <div className="space-y-1.5 max-h-32 overflow-y-auto pr-1">
            {data.items.map((it, idx) => (
              <div key={idx} className="flex justify-between items-center gap-3">
                <span className="text-slate-600 font-bold truncate leading-tight"><i className={`fas ${icon} mr-1.5 text-[10px]`}></i>{it.nama_barang}</span>
                <span className="font-black text-slate-800 text-[11px] shrink-0 bg-slate-50 px-2 py-0.5 rounded-lg border border-slate-100">{it.jumlah}</span>
              </div>
            ))}
          </div>
        )}
      </div>
    );
  }
  return null;
};

const UserManagement = () => {
  const navigate = useNavigate();
  const [users, setUsers] = useState([]);
  const [activities, setActivities] = useState({});
  
  // State Pisah untuk Tambah Form vs Edit Form biar UI/UX rapi gak bentrok
  const [showAddForm, setShowAddForm] = useState(false);
  const [addForm, setAddForm] = useState({ username: '', password: '', role: 'staff' });
  
  const [editId, setEditId] = useState(null);
  const [editForm, setEditForm] = useState({ username: '', password: '', role: 'staff' });

  useEffect(() => {
    if (localStorage.getItem('user_role') !== 'admin') navigate('/dashboard');
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const res = await fetch('http://localhost:5000/api/users', {
        headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
      });
      const result = await res.json();
      setUsers(result.data || []);
      
      result.data.forEach(u => u.role === 'staff' && fetchIntensitas(u.username));
    } catch (err) { console.error(err); }
  };

  const fetchIntensitas = async (username) => {
    try {
      const res = await fetch('http://localhost:5000/api/riwayat', {
        headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
      });
      const response = await res.json();
      
      const now = new Date();
      const todayStr = now.toDateString();

      let todayHistory = response.data.filter(item => {
        return item.nama_petugas === username && new Date(item.tanggal).toDateString() === todayStr;
      });
      
      const groupedData = {};
      todayHistory.forEach(item => {
        const exactTime = new Date(item.tanggal).getTime();
        if (!groupedData[exactTime]) {
          groupedData[exactTime] = {
            raw_date: new Date(item.tanggal),
            jumlah_total: 0,
            tipe: item.tipe,
            keterangan: item.keterangan,
            nama_petugas: item.nama_petugas, 
            items: [] 
          };
        }
        groupedData[exactTime].jumlah_total += parseInt(item.jumlah);
        groupedData[exactTime].items.push({
          nama_barang: item.nama_barang,
          jumlah: item.jumlah
        });
      });

      const sortedGroups = Object.values(groupedData).sort((a, b) => a.raw_date - b.raw_date);

      const timeMap = {};
      const anchors = [0, 6, 12, 18, 23.99]; 
      
      anchors.forEach(h => {
        const d = new Date(now.getFullYear(), now.getMonth(), now.getDate(), Math.floor(h), Math.floor((h % 1) * 60), 0);
        const t = d.getTime();
        const jamStr = h === 23.99 ? '23:59' : `${Math.floor(h).toString().padStart(2, '0')}:00`;
        timeMap[t] = { timestamp: t, jam: jamStr, chart_value: 0, is_empty: true, is_anchor: true };
      });

      sortedGroups.forEach(g => {
        const t = g.raw_date.getTime();
        const jamStr = `${g.raw_date.getHours().toString().padStart(2, '0')}:${g.raw_date.getMinutes().toString().padStart(2, '0')}`;
        
        const isMasuk = g.tipe === 'IN' || g.tipe === 'MASUK';
        const finalValue = isMasuk ? g.jumlah_total : -g.jumlah_total; 

        if (!timeMap[t - 60000]) {
          const dMin = new Date(t - 60000);
          timeMap[t - 60000] = { timestamp: t - 60000, jam: `${dMin.getHours().toString().padStart(2, '0')}:${dMin.getMinutes().toString().padStart(2, '0')}`, chart_value: 0, is_empty: true };
        }

        timeMap[t] = {
          timestamp: t, 
          jam: jamStr,
          chart_value: finalValue,
          tipe_mutasi: g.tipe,
          keterangan: g.keterangan,
          nama_petugas: g.nama_petugas,
          items: g.items
        };

        if (!timeMap[t + 60000]) {
          const dPlus = new Date(t + 60000);
          timeMap[t + 60000] = { timestamp: t + 60000, jam: `${dPlus.getHours().toString().padStart(2, '0')}:${dPlus.getMinutes().toString().padStart(2, '0')}`, chart_value: 0, is_empty: true };
        }
      });

      const chartData = Object.values(timeMap).sort((a, b) => a.timestamp - b.timestamp);
      setActivities(prev => ({ ...prev, [username]: chartData }));
    } catch (err) { console.error(err); }
  };

  // Handler Submit untuk TAMBAH USER BARU
  const handleAddSubmit = async (e) => {
    e.preventDefault();
    await fetch('http://localhost:5000/api/users', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${localStorage.getItem('token')}` },
      body: JSON.stringify(addForm)
    });
    setAddForm({ username: '', password: '', role: 'staff' });
    setShowAddForm(false);
    fetchUsers();
  };

  // Handler Submit untuk EDIT USER INLINE
  const handleEditSubmit = async (e) => {
    e.preventDefault();
    await fetch(`http://localhost:5000/api/users/${editId}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${localStorage.getItem('token')}` },
      body: JSON.stringify(editForm)
    });
    setEditId(null);
    fetchUsers();
  };

  const startEditClick = (u) => {
    setEditId(u.id_user);
    setEditForm({ username: u.username, role: u.role, password: '' });
  };

  const deleteUser = async (id) => {
    if (!window.confirm("Yakin ingin menghapus akun ini?")) return;
    await fetch(`http://localhost:5000/api/users/${id}`, {
      method: 'DELETE',
      headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
    });
    fetchUsers();
  };

  const checkIsOnline = (lastSeen) => {
    if (!lastSeen) return false;
    const diffInMinutes = (new Date() - new Date(lastSeen)) / 1000 / 60;
    return diffInMinutes < 15;
  };

  return (
    <div className="min-h-screen bg-[#F6F6F2] p-6 sm:p-8 text-[#388087] text-left">
      <div className="max-w-5xl mx-auto space-y-6">
        
        {/* HEADER TERMINAL + LOGO LOG IN / TAMBAH USER SLEEK */}
        <div className="flex justify-between items-center bg-white px-8 py-6 rounded-[24px] border border-[#BADFE7]/50 shadow-sm">
          <div>
            <h1 className="text-2xl font-black tracking-tight text-[#388087]">ADMIN CONTROL CENTER</h1>
            <p className="text-[11px] font-bold text-slate-400 uppercase tracking-widest mt-0.5">iGUDANG Node & Staff Credentials Panel</p>
          </div>
          
          {/* 🔥 LOGO / TOMBOL TAMBAH AKUN MINIMALIS */}
          <button 
            onClick={() => setShowAddForm(!showAddForm)}
            className={`w-12 h-12 rounded-full flex items-center justify-center text-sm shadow-md transition-all duration-300 ${showAddForm ? 'bg-rose-500 text-white rotate-45' : 'bg-[#388087] text-white hover:bg-[#2a636b]'}`}
            title="Tambah Akun Staff/Admin"
          >
            <i className="fas fa-plus text-base"></i>
          </button>
        </div>

        {/* 🔥 COLLAPSIBLE FORM: Muncul dengan efek transisi rapi saat logo plus diklik */}
        {showAddForm && (
          <div className="bg-white p-6 rounded-[24px] shadow-md border border-[#BADFE7]/80 animate-fadeIn space-y-4">
            <div className="flex items-center gap-2 border-b pb-3 mb-2">
              <i className="fas fa-user-plus text-sm"></i>
              <h3 className="text-xs font-black uppercase tracking-wider text-slate-700">Registrasi Kredensial Baru</h3>
            </div>
            <form onSubmit={handleAddSubmit} className="flex flex-col sm:flex-row gap-4">
              <input className="flex-1 p-3.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold focus:outline-none focus:border-[#388087] shadow-inner text-slate-700 placeholder-slate-400" placeholder="Masukkan Username" value={addForm.username} onChange={e => setAddForm({...addForm, username: e.target.value})} required />
              <input type="password" className="flex-1 p-3.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold focus:outline-none focus:border-[#388087] shadow-inner text-slate-700 placeholder-slate-400" placeholder="Masukkan Password Akun" value={addForm.password} onChange={e => setAddForm({...addForm, password: e.target.value})} required />
              <select className="p-3.5 bg-white border border-slate-200 rounded-xl text-xs font-black tracking-wider text-slate-600 focus:outline-none focus:border-[#388087] cursor-pointer" value={addForm.role} onChange={e => setAddForm({...addForm, role: e.target.value})}>
                <option value="staff">🛡️ STAFF</option>
                <option value="admin">👑 ADMIN</option>
              </select>
              <button className="px-8 py-3.5 bg-[#388087] hover:bg-[#2a636b] text-white rounded-xl font-black text-[10px] tracking-widest uppercase transition-all shadow-md">BUAT AKUN</button>
            </form>
          </div>
        )}

        {/* LIST & GRAFIK CONTAINER */}
        <div className="space-y-4">
          {users.map(u => {
            const isOnline = checkIsOnline(u.last_seen);
            const isEditingThisUser = editId === u.id_user;
            
            return (
              <div key={u.id_user} className={`bg-white rounded-[28px] border transition-all duration-300 shadow-sm ${isEditingThisUser ? 'border-[#388087] shadow-md ring-4 ring-[#BADFE7]/20' : 'border-slate-100/70 hover:shadow-md'}`}>
                
                {/* PROFIL CARD */}
                <div className="p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div className="flex items-center gap-5">
                    <div className="flex flex-col items-center gap-1 shrink-0">
                      <div className={`w-3.5 h-3.5 rounded-full border-2 border-white shadow-sm ${isOnline ? 'bg-emerald-500 shadow-emerald-500/50 animate-pulse' : 'bg-slate-300'}`}></div>
                      <span className="text-[7px] font-black text-slate-400 uppercase tracking-wide">{isOnline ? 'Online' : 'Offline'}</span>
                    </div>
                    <div className="w-12 h-12 rounded-full bg-[#F6F6F2] border border-[#BADFE7]/40 flex items-center justify-center font-black text-lg text-[#388087] shadow-inner">{u.username[0].toUpperCase()}</div>
                    <div>
                      <p className="font-black text-lg text-slate-800 leading-tight">{u.username}</p>
                      <span className={`inline-block text-[8px] font-black tracking-widest px-2 py-0.5 rounded-md mt-1 border ${u.role === 'admin' ? 'bg-rose-50 border-rose-200 text-rose-500' : 'bg-slate-50 border-slate-200 text-slate-500'}`}>{u.role.toUpperCase()}</span>
                    </div>
                  </div>
                  
                  <div className="flex gap-2.5 self-end sm:self-center">
                    <button onClick={() => isEditingThisUser ? setEditId(null) : startEditClick(u)} className={`px-5 py-2 text-[10px] font-black rounded-xl tracking-wider transition-colors ${isEditingThisUser ? 'bg-slate-100 text-slate-500' : 'bg-slate-50 text-slate-600 hover:bg-slate-100'}`}>{isEditingThisUser ? 'BATAL' : 'EDIT'}</button>
                    <button onClick={() => deleteUser(u.id_user)} className="px-5 py-2 bg-slate-50 hover:bg-rose-50 text-[10px] font-black rounded-xl tracking-wider text-rose-500 transition-colors">HAPUS</button>
                  </div>
                </div>

                {/* 🔥 UX UPGRADE: INLINE EDIT FORM (Muncul geser ke bawah saat tombol EDIT diklik) */}
                {isEditingThisUser && (
                  <div className="mx-6 p-5 bg-slate-50/70 border border-slate-100 rounded-[20px] animate-fadeIn space-y-3 mb-6">
                    <p className="text-[9px] font-black uppercase text-slate-400 tracking-wider"><i className="fas fa-user-gear mr-1"></i> Panel Modifikasi Akun</p>
                    <form onSubmit={handleEditSubmit} className="grid grid-cols-1 sm:grid-cols-4 gap-3 items-center">
                      <div className="space-y-1"><input className="w-full p-2.5 bg-white border border-slate-200 rounded-xl text-xs font-bold focus:outline-none focus:border-[#388087]" placeholder="Username" value={editForm.username} onChange={e => setEditForm({...editForm, username: e.target.value})} required /></div>
                      <div className="space-y-1"><input type="password" className="w-full p-2.5 bg-white border border-slate-200 rounded-xl text-xs font-bold focus:outline-none focus:border-[#388087]" placeholder="Password Baru (Kosongkan jika tidak diubah)" value={editForm.password} onChange={e => setEditForm({...editForm, password: e.target.value})} /></div>
                      <div className="space-y-1">
                        <select className="w-full p-2.5 bg-white border border-slate-200 rounded-xl text-xs font-bold text-slate-600" value={editForm.role} onChange={e => setEditForm({...editForm, role: e.target.value})}>
                          <option value="staff">Staff</option>
                          <option value="admin">Admin</option>
                        </select>
                      </div>
                      <button className="w-full p-2.5 bg-emerald-500 hover:bg-emerald-600 text-white rounded-xl font-black text-[10px] tracking-widest uppercase transition-all shadow-sm">SIMPAN PERUBAHAN</button>
                    </form>
                  </div>
                )}

                {/* GRAFIK RUMPUT EKG (Hanya Staff) */}
                {u.role === 'staff' && (
                  <div className="mx-6 pb-6 pt-4 border-t border-dashed border-slate-100">
                    <div className="flex justify-between items-end mb-4">
                      <div>
                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Intensitas Transaksi (Live Hari Ini)</p>
                        <p className="text-[9px] font-bold text-slate-400 mt-0.5">
                          Node <span className="text-emerald-500 font-extrabold">Hijau = Masuk</span> | Node <span className="text-rose-500 font-extrabold">Merah = Keluar/Audit</span>
                        </p>
                      </div>
                    </div>
                    
                    <div className="w-full h-64 bg-slate-50/40 rounded-[20px] p-4 border border-slate-100/80">
                      <ResponsiveContainer width="100%" height="100%">
                        <AreaChart data={activities[u.username] || [{jam: '00:00', chart_value: 0, is_empty: true}]} margin={{ top: 40, right: 20, left: -20, bottom: 40 }}>
                          <CartesianGrid strokeDasharray="3 3" vertical={true} horizontal={false} stroke="#e2e8f0" />
                          <XAxis 
                            dataKey="jam" 
                            tick={{ fontSize: 10, fill: '#64748b', fontWeight: '900' }} 
                            axisLine={{ stroke: '#cbd5e1' }} 
                            tickLine={false} 
                            interval="preserveStartEnd"
                            tickFormatter={(jam) => ['00:00', '06:00', '12:00', '18:00', '23:59'].includes(jam) ? jam : ''}
                          />
                          <YAxis 
                            tick={{ fontSize: 10, fill: '#94a3b8', fontWeight: 'bold' }} 
                            axisLine={false} 
                            tickLine={false} 
                            tickFormatter={(val) => Math.abs(val)}
                            domain={[
                              dataMin => Math.floor(dataMin * 1.5) - 10, 
                              dataMax => Math.ceil(dataMax * 1.5) + 10   
                            ]}
                          />
                          <Tooltip content={<CustomTooltip />} cursor={{ stroke: '#94a3b8', strokeWidth: 1.5, strokeDasharray: '4 4' }} isAnimationActive={false} />
                          <ReferenceLine y={0} stroke="#94a3b8" strokeWidth={1.5} />
                          <Area type="linear" dataKey="chart_value" stroke="#388087" fill="#BADFE7" fillOpacity={0.3} strokeWidth={2} activeDot={{ r: 8, strokeWidth: 0 }} dot={<CustomNode />} />
                        </AreaChart>
                      </ResponsiveContainer>
                    </div>
                  </div>
                )}

              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default UserManagement;