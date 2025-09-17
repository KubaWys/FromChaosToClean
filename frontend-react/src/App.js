// TODO: This React app is a typing nightmare!
// Missing TypeScript types everywhere, poor component structure,
// inconsistent patterns, and integration issues. Use Copilot to help!

import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import './App.css';

// FIXME: No type definitions anywhere!
const API_BASE = 'http://localhost:3001/api';
const PYTHON_API = 'http://localhost:5000';

// Global state management - should use Context or Redux
let globalUser = null;
let globalToken = null;

// Utility functions - should be in separate files
function saveToStorage(key, value) {
  localStorage.setItem(key, JSON.stringify(value));
}

function getFromStorage(key) {
  const item = localStorage.getItem(key);
  return item ? JSON.parse(item) : null;
}

// Login Component - missing prop types and proper error handling
function Login({ onLogin }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    
    try {
      // TODO: Add form validation
      const response = await axios.post(`${API_BASE}/login`, {
        username,
        password
      });
      
      const { token, user } = response.data;
      
      // Poor global state management
      globalUser = user;
      globalToken = token;
      
      saveToStorage('token', token);
      saveToStorage('user', user);
      
      onLogin(user, token);
      navigate('/dashboard');
      
    } catch (err) {
      console.log(err); // Poor error logging
      setError('Login failed');
    }
  };

  return (
    <div style={{padding: '20px'}}> {/* Inline styles - should use CSS classes */}
      <h2>Login</h2>
      {error && <div style={{color: 'red'}}>{error}</div>}
      <form onSubmit={handleLogin}>
        <div>
          <input
            type="text"
            placeholder="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            style={{margin: '5px', padding: '8px'}}
          />
        </div>
        <div>
          <input
            type="password"
            placeholder="Password"
            value={password}  
            onChange={(e) => setPassword(e.target.value)}
            style={{margin: '5px', padding: '8px'}}
          />
        </div>
        <button type="submit" style={{margin: '5px', padding: '8px 16px'}}>
          Login
        </button>
      </form>
      <p>Try: username=admin, password=password123</p>
    </div>
  );
}

// Product List Component - no proper state management
function ProductList() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const response = await axios.get(`${API_BASE}/products`);
      setProducts(response.data);
      setLoading(false);
    } catch (error) {
      console.error('Failed to fetch products:', error);
      setLoading(false);
    }
  };

  if (loading) return <div>Loading products...</div>;

  return (
    <div style={{padding: '20px'}}>
      <h2>Products</h2>
      {products.length === 0 ? (
        <p>No products available</p>
      ) : (
        <div>
          {products.map((product) => (
            <div key={product.id} style={{
              border: '1px solid #ccc',
              margin: '10px',
              padding: '10px',
              borderRadius: '5px'
            }}>
              <h3>{product.name}</h3>
              <p>Price: ${product.price}</p>
              <p>{product.description}</p>
              <p>Stock: {product.stock}</p>
              <button onClick={() => createOrder(product.id)}>
                Order Now
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// Order function - global function, should be in a service
async function createOrder(productId) {
  if (!globalToken) {
    alert('Please login first');
    return;
  }
  
  try {
    const response = await axios.post(`${API_BASE}/orders`, {
      productIds: [productId],
      quantities: [1]
    }, {
      headers: {
        'Authorization': `Bearer ${globalToken}`
      }
    });
    
    alert('Order created successfully!');
    
    // Track the order event in Python service
    axios.post(`${PYTHON_API}/analytics/track`, {
      event_type: 'order_created',
      user_id: globalUser?.id,
      data: { product_id: productId }
    }).catch(err => console.log('Analytics tracking failed:', err));
    
  } catch (error) {
    console.error('Order creation failed:', error);
    alert('Order failed');
  }
}

// Dashboard Component - mixed responsibilities
function Dashboard() {
  const [notifications, setNotifications] = useState([]);
  const [stats, setStats] = useState(null);
  
  useEffect(() => {
    if (globalUser) {
      fetchNotifications();
      fetchStats();
    }
  }, []);
  
  const fetchNotifications = async () => {
    try {
      const response = await axios.get(`${PYTHON_API}/notifications/${globalUser.id}`);
      setNotifications(response.data);
    } catch (error) {
      console.log('Failed to fetch notifications:', error);
    }
  };
  
  const fetchStats = async () => {
    try {
      const response = await axios.get(`${PYTHON_API}/analytics/stats/${globalUser.id}`);
      setStats(response.data);
    } catch (error) {
      console.log('Failed to fetch stats:', error);
    }
  };
  
  const markAsRead = async (notificationId) => {
    try {
      await axios.put(`${PYTHON_API}/notifications/${notificationId}/read`);
      fetchNotifications(); // Refetch all - inefficient
    } catch (error) {
      console.log('Failed to mark as read:', error);
    }
  };

  return (
    <div style={{padding: '20px'}}>
      <h2>Dashboard</h2>
      <p>Welcome back, {globalUser?.username}!</p>
      
      {/* Notifications Section */}
      <div style={{marginBottom: '30px'}}>
        <h3>Notifications</h3>
        {notifications.length === 0 ? (
          <p>No notifications</p>
        ) : (
          notifications.map((notif) => (
            <div key={notif.id} style={{
              backgroundColor: notif.read ? '#f9f9f9' : '#fff3cd',
              padding: '10px',
              margin: '5px 0',
              border: '1px solid #ccc',
              borderRadius: '3px'
            }}>
              <p>{notif.message}</p>
              <small>Type: {notif.type} | Created: {notif.created_at}</small>
              {!notif.read && (
                <button 
                  onClick={() => markAsRead(notif.id)}
                  style={{marginLeft: '10px', fontSize: '12px'}}
                >
                  Mark as Read
                </button>
              )}
            </div>
          ))
        )}
      </div>
      
      {/* Stats Section */}
      <div>
        <h3>Your Stats</h3>
        {stats ? (
          <div>
            <p>Total Events: {stats.total_events}</p>
            <div>
              <h4>Events by Type:</h4>
              {Object.entries(stats.events_by_type).map(([type, count]) => (
                <p key={type}>{type}: {count}</p>
              ))}
            </div>
          </div>
        ) : (
          <p>Loading stats...</p>
        )}
      </div>
    </div>
  );
}

// Admin Panel Component - no permission checks!
function AdminPanel() {
  const [newProduct, setNewProduct] = useState({
    name: '',
    price: '',
    description: '',
    stock: ''
  });
  
  // FIXME: No admin role verification!
  
  const createProduct = async (e) => {
    e.preventDefault();
    
    if (!globalToken) {
      alert('Not authenticated');
      return;
    }
    
    try {
      await axios.post(`${API_BASE}/products`, {
        name: newProduct.name,
        price: parseFloat(newProduct.price),
        description: newProduct.description,
        stock: parseInt(newProduct.stock)
      }, {
        headers: {
          'Authorization': `Bearer ${globalToken}`
        }
      });
      
      alert('Product created!');
      setNewProduct({ name: '', price: '', description: '', stock: '' });
      
    } catch (error) {
      console.error('Product creation failed:', error);
      alert('Failed to create product');
    }
  };
  
  return (
    <div style={{padding: '20px'}}>
      <h2>Admin Panel</h2>
      <form onSubmit={createProduct}>
        <div>
          <input
            type="text"
            placeholder="Product Name"
            value={newProduct.name}
            onChange={(e) => setNewProduct({...newProduct, name: e.target.value})}
            style={{margin: '5px', padding: '8px', width: '200px'}}
          />
        </div>
        <div>
          <input
            type="number"
            placeholder="Price"
            value={newProduct.price}
            onChange={(e) => setNewProduct({...newProduct, price: e.target.value})}
            style={{margin: '5px', padding: '8px', width: '200px'}}
          />
        </div>
        <div>
          <textarea
            placeholder="Description"
            value={newProduct.description}
            onChange={(e) => setNewProduct({...newProduct, description: e.target.value})}
            style={{margin: '5px', padding: '8px', width: '200px'}}
          />
        </div>
        <div>
          <input
            type="number"
            placeholder="Stock"
            value={newProduct.stock}
            onChange={(e) => setNewProduct({...newProduct, stock: e.target.value})}
            style={{margin: '5px', padding: '8px', width: '200px'}}
          />
        </div>
        <button type="submit" style={{margin: '5px', padding: '8px 16px'}}>
          Create Product
        </button>
      </form>
    </div>
  );
}

// Navigation Component - should be separate
function Navigation({ user, onLogout }) {
  return (
    <nav style={{
      backgroundColor: '#f0f0f0',
      padding: '10px',
      borderBottom: '1px solid #ccc'
    }}>
      <Link to="/" style={{margin: '0 10px', textDecoration: 'none'}}>Home</Link>
      <Link to="/products" style={{margin: '0 10px', textDecoration: 'none'}}>Products</Link>
      
      {user ? (
        <>
          <Link to="/dashboard" style={{margin: '0 10px', textDecoration: 'none'}}>Dashboard</Link>
          {user.role === 'admin' && (
            <Link to="/admin" style={{margin: '0 10px', textDecoration: 'none'}}>Admin</Link>
          )}
          <span style={{margin: '0 10px'}}>Welcome, {user.username}</span>
          <button onClick={onLogout} style={{margin: '0 10px'}}>Logout</button>
        </>
      ) : (
        <Link to="/login" style={{margin: '0 10px', textDecoration: 'none'}}>Login</Link>
      )}
    </nav>
  );
}

// Home Component - minimal
function Home() {
  return (
    <div style={{padding: '20px'}}>
      <h1>Welcome to the Chaotic E-commerce Site</h1>
      <p>This React app has many problems that need fixing:</p>
      <ul>
        <li>No TypeScript types defined</li>
        <li>Poor component organization</li>
        <li>Inline styles everywhere</li>
        <li>Global state management mess</li>
        <li>No proper error handling</li>
        <li>Missing form validations</li>
        <li>No loading states</li>
        <li>Poor accessibility</li>
      </ul>
      <p>Use Copilot to help clean this up!</p>
    </div>
  );
}

// Main App Component - everything mixed together
function App() {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  
  useEffect(() => {
    // Check for saved authentication
    const savedToken = getFromStorage('token');
    const savedUser = getFromStorage('user');
    
    if (savedToken && savedUser) {
      setUser(savedUser);
      setToken(savedToken);
      globalUser = savedUser;
      globalToken = savedToken;
    }
  }, []);
  
  const handleLogin = (userData, userToken) => {
    setUser(userData);
    setToken(userToken);
  };
  
  const handleLogout = () => {
    setUser(null);
    setToken(null);
    globalUser = null;
    globalToken = null;
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  };

  return (
    <Router>
      <div className="App">
        <Navigation user={user} onLogout={handleLogout} />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login onLogin={handleLogin} />} />
          <Route path="/products" element={<ProductList />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/admin" element={<AdminPanel />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;

// TODO List for participants:
// 1. Add proper TypeScript types for all components and data
// 2. Implement proper state management (Context API or Redux)
// 3. Create separate component files with proper structure
// 4. Add comprehensive error handling and loading states
// 5. Replace inline styles with proper CSS/styled-components
// 6. Add form validation and user feedback
// 7. Implement proper authentication flow
// 8. Add accessibility features (ARIA labels, keyboard navigation)
// 9. Create custom hooks for API calls
// 10. Add comprehensive tests