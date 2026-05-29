import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import MainLayout from "./layout/MainLayout";
import Login from "./pages/Login"; 
import Transaksi from "./pages/Transaksi"; 
import Dashboard from "./pages/Dashboard";
import Barang from "./pages/Barang";
import Riwayat from "./pages/Riwayat";
import DataOutlet from "./pages/DataOutlet"; 
import TentangKami from "./pages/TentangKami"; // 🔥 1. IMPORT HALAMAN TENTANG KAMI DI SINI Dhika

function App() {
  return (
    <Router>
      <Routes>
        
        <Route path="/login" element={<Login />} />
        
        {/* --- TRANSAKSI BARANG (Mutasi Stok) --- */}
        <Route path="/transaksi" element={
          <MainLayout>
            <Transaksi />
          </MainLayout>
        } />
      
        {/* --- DASHBOARD SYSTEM --- */}
        <Route path="/dashboard" element={
          <MainLayout>
            <Dashboard />
          </MainLayout>
        } />

        {/* --- DATA MASTER: BARANG --- */}
        <Route path="/barang" element={
          <MainLayout>
            <Barang />
          </MainLayout>
        } />

        {/* --- DATA MASTER: OUTLET --- */}
        <Route path="/outlet" element={
          <MainLayout>
            <DataOutlet />
          </MainLayout>
        } />
        
        {/* --- LAPORAN / RIWAYAT --- */}
        <Route path="/riwayat" element={
          <MainLayout>
            <Riwayat />
          </MainLayout>
        } />

        {/* --- PROFILE DEVELOPER KELOMPOK --- */}
        {/* 🔥 2. DAFTARKAN JALUR RUTENYA DI SINI */}
        <Route path="/tentang-kami" element={
          <MainLayout>
            <TentangKami />
          </MainLayout>
        } />
      
        {/* Redirect root (/) ke Login */}
        <Route path="/" element={<Navigate to="/login" />} />
        
        {/* Redirect alamat ngasal ke Dashboard */}
        <Route path="*" element={<Navigate to="/dashboard" />} />
      </Routes>
      
    </Router>
  );
}

export default App;