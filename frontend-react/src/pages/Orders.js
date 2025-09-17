
import React, { useState, useEffect, useContext } from 'react';
import { fetchOrders, createOrder } from '../services/orders';
import { fetchProducts } from '../services/products';
import { UserContext } from '../context/UserContext';

const Orders = () => {
  const { user } = useContext(UserContext);
  const [orders, setOrders] = useState([]);
  const [products, setProducts] = useState([]);
  const [selected, setSelected] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [creating, setCreating] = useState(false);
  const [success, setSuccess] = useState(null);

  useEffect(() => {
    setLoading(true);
    Promise.all([fetchOrders(), fetchProducts()])
      .then(([orders, products]) => {
        setOrders(orders);
        setProducts(products);
      })
      .catch(setError)
      .finally(() => setLoading(false));
  }, []);

  const handleSelect = (id, checked) => {
    setSelected(s => ({ ...s, [id]: checked ? 1 : 0 }));
  };

  const handleCreateOrder = async (e) => {
    e.preventDefault();
    setCreating(true);
    setError(null);
    setSuccess(null);
    try {
      const productIds = Object.keys(selected).filter(pid => selected[pid]);
      const quantities = productIds.map(pid => selected[pid]);
      if (productIds.length === 0) throw new Error('Select at least one product');
      const res = await createOrder(productIds, quantities);
      setSuccess('Order created!');
      setOrders([...orders, { orderId: res.orderId, total: res.total }]);
      setSelected({});
    } catch (err) {
      setError(err.message);
    } finally {
      setCreating(false);
    }
  };

  return (
    <div className="card" style={{ maxWidth: 800, margin: '40px auto', padding: 24 }}>
      <h2>Orders</h2>
      {loading && <div>Loading...</div>}
      {error && <div className="error">{error.message || error}</div>}
      {success && <div className="success">{success}</div>}
      {!loading && (
        <>
          <form onSubmit={handleCreateOrder} style={{ marginBottom: 24 }}>
            <h3>Create New Order</h3>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr>
                  <th></th>
                  <th>Name</th>
                  <th>Price</th>
                  <th>Stock</th>
                </tr>
              </thead>
              <tbody>
                {products.map(p => (
                  <tr key={p.id}>
                    <td><input type="checkbox" checked={!!selected[p.id]} onChange={e => handleSelect(p.id, e.target.checked)} /></td>
                    <td>{p.name}</td>
                    <td>${p.price}</td>
                    <td>{p.stock}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            <button className="btn-primary" type="submit" disabled={creating}>Create Order</button>
          </form>
          <h3>Your Orders</h3>
          <ul>
            {orders.length === 0 && <li>No orders yet.</li>}
            {orders.map((o, i) => (
              <li key={o.orderId || i}>Order #{o.orderId || o.id} - Total: ${o.total || o.amount || 0}</li>
            ))}
          </ul>
        </>
      )}
    </div>
  );
}

export default Orders;
