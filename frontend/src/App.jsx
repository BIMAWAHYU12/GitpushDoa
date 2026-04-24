import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import MainLayout from "./layout/MainLayout";
import Login from "./pages/Login"; 
import Transaksi from "./pages/Transaksi"; 
import Dashboard from "./pages/Dashboard";
import Barang from "./pages/Barang";
import Riwayat from "./pages/Riwayat";

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
        {/* --- TRANSAKSI BARANG (Mutasi Stok) --- */}
        <Route path="/riwayat" element={
          <MainLayout>
            <Riwayat />
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