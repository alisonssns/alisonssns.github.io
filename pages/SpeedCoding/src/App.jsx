import { BrowserRouter, Routes, Route, Navigate, Outlet } from "react-router-dom";
import "./index.css"; 

import Landing from "./pages/Landing"; 
import LoginPage from "./pages/LoginPage"; 
import ArenaPage from "./pages/ArenaPage";
import History from "./pages/History";
import Ranking from "./pages/Ranking";
import Profile from "./pages/Profile";
import Home from "./pages/Home";
import Games from "./pages/Games";
import Admin from "./pages/Admin";
import Header from "./components/layout/Header";
import { AuthProvider, useAuth } from "./contexts/AuthContext";

const PrivateLayout = () => {
  const { isAuthenticated, loading } = useAuth();

  if (loading) return <div className="loading-screen">Carregando Sistema...</div>;
  
  if (!isAuthenticated) return <Navigate to="/login" replace />;
  return (
    <>
      <Header />
      <div className="main-content">
        <Outlet />
      </div>
    </>
  );
};

const PublicLayout = () => {
  const { isAuthenticated, loading } = useAuth();

  if (loading) return null;
  if (isAuthenticated) return <Navigate to="/home" replace />;

  return (
    <div className="auth-content">
      <Outlet />
    </div>
  );
};

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route element={<PublicLayout />}>
            <Route path="/" element={<Landing />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/admin" element={<Admin />} />
          </Route>

          <Route element={<PrivateLayout />}>
            <Route path="/" element={<Home />} />
            <Route path="/home" element={<Home />} />
            <Route path="/arena" element={<ArenaPage />} />
            <Route path="/games" element={<Games />} />
            <Route path="/history" element={<History />} />
            <Route path="/ranking" element={<Ranking />} />
            <Route path="/profile" element={<Profile />} />
          </Route>

          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}