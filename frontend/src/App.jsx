import {
  Navigate,
  Route,
  BrowserRouter as Router,
  Routes,
} from "react-router-dom";
import MainLayout from "./layout/MainLayout";
import Barang from "./pages/Barang";
import Dashboard from "./pages/Dashboard";
import DataOutlet from "./pages/DataOutlet";
import Gudanginfo from "./pages/Gudanginfo";
import Login from "./pages/Login";
import Riwayat from "./pages/Riwayat";
import TentangKami from "./pages/TentangKami";
import Transaksi from "./pages/Transaksi";
import UserManagement from "./pages/UserManagement";
import ProtectedRoute from "./components/ProtectedRoute";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login />} />

        
        {/* --- TRANSAKSI BARANG (Mutasi Stok) --- */}
        <Route
          path="/transaksi"
          element={
            <ProtectedRoute>
              <MainLayout>
                <Transaksi />
              </MainLayout>
            </ProtectedRoute>
          }
        />

        {/* --- DASHBOARD SYSTEM --- */}
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <MainLayout>
                <Dashboard />
              </MainLayout>
            </ProtectedRoute>
          }
        />

        {/* --- DATA MASTER: BARANG --- */}
        <Route
          path="/barang"
          element={
            <ProtectedRoute>
              <MainLayout>
                <Barang />
              </MainLayout>
            </ProtectedRoute>
          }
        />

        {/* --- DATA MASTER: OUTLET --- */}
        <Route
          path="/outlet"
          element={
            <ProtectedRoute>
              <MainLayout>
                <DataOutlet />
              </MainLayout>
            </ProtectedRoute>
          }
        />

        {/* --- LAPORAN / RIWAYAT --- */}
        <Route
          path="/riwayat"
          element={
            <ProtectedRoute>
              <MainLayout>
                <Riwayat />
              </MainLayout>
            </ProtectedRoute>
          }
        />

        {/* --- PROFILE DEVELOPER KELOMPOK --- */}
        <Route
          path="/tentang-kami"
          element={
            <ProtectedRoute>
              <MainLayout>
                <TentangKami />
              </MainLayout>
            </ProtectedRoute>
          }
        />

        {/* --- INFO GUDANG & SOP --- */}
        <Route
          path="/gudanginfo"
          element={
            <ProtectedRoute>
              <MainLayout>
                <Gudanginfo />
              </MainLayout>
            </ProtectedRoute>
          }
        />
        
        {/* --- USER MANAGEMENT --- */}
        <Route
          path="/usermanagement"
          element={
            <ProtectedRoute>
              <MainLayout>
                <UserManagement />
              </MainLayout>
            </ProtectedRoute>
          }
        />

        {/* --- REDIRECTS --- */}
        {/* Redirect root (/) ke Login */}
        <Route path="/" element={<Navigate to="/login" />} />

        <Route path="*" element={<Navigate to="/dashboard" />} />
      </Routes>
    </Router>
  );
}

export default App;