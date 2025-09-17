
import React, { useState } from 'react';
import { createProduct } from '../services/products';

const AdminPanel = () => {
  const [form, setForm] = useState({ name: '', price: '', description: '', stock: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  const handleChange = e => {
    setForm(f => ({ ...f, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async e => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(null);
    try {
      const { name, price, description, stock } = form;
      if (!name || !price || !description || !stock) throw new Error('All fields required');
      await createProduct({ name, price: parseFloat(price), description, stock: parseInt(stock) });
      setSuccess('Product created!');
      setForm({ name: '', price: '', description: '', stock: '' });
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="card" style={{ maxWidth: 800, margin: '40px auto', padding: 24 }}>
      <h2>Admin Panel</h2>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Name</label>
          <input className="form-control" name="name" value={form.name} onChange={handleChange} required />
        </div>
        <div className="form-group">
          <label>Price</label>
          <input className="form-control" name="price" type="number" value={form.price} onChange={handleChange} required />
        </div>
        <div className="form-group">
          <label>Description</label>
          <input className="form-control" name="description" value={form.description} onChange={handleChange} required />
        </div>
        <div className="form-group">
          <label>Stock</label>
          <input className="form-control" name="stock" type="number" value={form.stock} onChange={handleChange} required />
        </div>
        {error && <div className="error">{error}</div>}
        {success && <div className="success">{success}</div>}
        <button className="btn-primary" type="submit" disabled={loading}>{loading ? 'Creating...' : 'Create Product'}</button>
      </form>
    </div>
  );
}

export default AdminPanel;
