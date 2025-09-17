import React, { useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { UserContext } from '../context/UserContext';

const Navbar = () => {
  const { user, setUser } = useContext(UserContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('authToken');
    setUser(null);
    navigate('/login');
  };

  return (
    <nav style={{ background: '#fff', borderBottom: '1px solid #eee', padding: '10px 20px', marginBottom: 20, display: 'flex', alignItems: 'center', gap: 16 }}>
      <Link className="nav-link" to="/">Home</Link>
      <Link className="nav-link" to="/products">Products</Link>
      {user && <Link className="nav-link" to="/orders">Orders</Link>}
      {user && user.role === 'admin' && <Link className="nav-link" to="/admin">Admin Panel</Link>}
      {user && <Link className="nav-link" to="/dashboard">Dashboard</Link>}
      <div style={{ flex: 1 }} />
      {user ? (
        <button className="btn-secondary" onClick={handleLogout}>Logout</button>
      ) : (
        <Link className="btn-primary" to="/login">Login</Link>
      )}
    </nav>
  );
};

export default Navbar;
