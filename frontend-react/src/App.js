import React, { useContext } from 'react';
import './App.css';
import { UserProvider, UserContext } from './context/UserContext';


import Home from './pages/Home';
import Products from './pages/Products';
import Orders from './pages/Orders';
import AdminPanel from './pages/AdminPanel';
import Navbar from './components/Navbar';
import LoginPage from './pages/LoginPage';
import Dashboard from './pages/Dashboard';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';

function AppRoutes() {
  const { user } = useContext(UserContext);
  return (
    <>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/products" element={<Products />} />
        <Route path="/orders" element={user ? <Orders /> : <Navigate to="/login" replace />} />
        <Route path="/admin" element={user && user.role === 'admin' ? <AdminPanel /> : <Navigate to="/login" replace />} />
        <Route path="/dashboard" element={user ? <Dashboard /> : <Navigate to="/login" replace />} />
      </Routes>
    </>
  );
}

function App() {
  return (
    <UserProvider>
      <Router>
        <AppRoutes />
      </Router>
    </UserProvider>
  );
}

export default App;