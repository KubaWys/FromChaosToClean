import React from 'react';
import { fetchProducts } from '../services/products';

const Products = () => {
  const [products, setProducts] = React.useState([]);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState(null);

  React.useEffect(() => {
    fetchProducts()
      .then(setProducts)
      .catch(setError)
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="card" style={{ maxWidth: 800, margin: '40px auto', padding: 24 }}>
      <h2>Products</h2>
      {loading && <div>Loading...</div>}
      {error && <div className="error">{error.message || 'Failed to load products'}</div>}
      {!loading && !error && (
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr>
              <th style={{ textAlign: 'left', borderBottom: '1px solid #eee' }}>Name</th>
              <th style={{ textAlign: 'left', borderBottom: '1px solid #eee' }}>Price</th>
              <th style={{ textAlign: 'left', borderBottom: '1px solid #eee' }}>Description</th>
              <th style={{ textAlign: 'left', borderBottom: '1px solid #eee' }}>Stock</th>
            </tr>
          </thead>
          <tbody>
            {products.map(p => (
              <tr key={p.id}>
                <td>{p.name}</td>
                <td>${p.price}</td>
                <td>{p.description}</td>
                <td>{p.stock}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default Products;
