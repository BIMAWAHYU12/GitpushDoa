import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import MainLayout from "./layout/MainLayout";

// --- 📂 IMPORT PAGES ---
import Login from "./pages/Login"; 
import Transaksi from "./pages/Transaksi"; 
import Dashboard from "./pages/Dashboard";
import Barang from "./pages/Barang";

function App() {
  return (
    <Router>
      <Routes>
        
        {/* 1️⃣ AUTHENTICATION: Jalur Login (Tanpa Sidebar) */}
        <Route path="/login" element={<Login />} />
        
        
        {/* --- TRANSAKSI BARANG (Mutasi Stok) --- */}
        <Route path="/transaksi" element={
          <MainLayout>
            <Transaksi />
          </MainLayout>
        } />
      
        {/* --- TRANSAKSI BARANG (Mutasi Stok) --- */}
        <Route path="/dashboard" element={
          <MainLayout>
            <Dashboard />
          </MainLayout>
        } />

        {/* --- TRANSAKSI BARANG (Mutasi Stok) --- */}
        <Route path="/barang" element={
          <MainLayout>
            <Barang />
          </MainLayout>
        } />
      

        {/* 3️⃣ ROUTING LOGIC: Pengalihan Alamat */}
        
        {/* Redirect root (/) ke Login */}
        <Route path="/" element={<Navigate to="/login" />} />
        
        {/* Redirect alamat ngasal ke Dashboard */}
        <Route path="*" element={<Navigate to="/dashboard" />} />

      </Routes>
    </Router>
  );
}

export default App;