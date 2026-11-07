import { useEffect, useState } from 'react';
import api from '../api/axios.js';

export default function Dashboard() {
  const [stats, setStats] = useState({ total: 0, categories: 0, recent: [] });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const load = async () => {
      try {
        const { data } = await api.get('/products', { params: { limit: 100 } });
        const products = data.data || [];
        const cats = new Set(products.map((p) => p.category));
        setStats({ total: data.total, categories: cats.size, recent: products.slice(0, 5) });
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to load dashboard.');
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  if (loading) return <div className="empty">Loading...</div>;

  return (
    <>
      <h1 className="page-title">Dashboard</h1>
      {error && <div className="alert alert-error">{error}</div>}
      <div className="grid grid-3" style={{ marginBottom: 24 }}>
        <div className="card stat"><span className="label">Total Products</span><span className="value">{stats.total}</span></div>
        <div className="card stat"><span className="label">Total Categories</span><span className="value">{stats.categories}</span></div>
        <div className="card stat"><span className="label">Recent Products</span><span className="value">{stats.recent.length}</span></div>
      </div>
      <div className="card">
        <h3 style={{ marginTop: 0 }}>Recent Products</h3>
        {stats.recent.length === 0 ? <div className="empty">No products yet.</div> : (
          <table className="table">
            <thead><tr><th>Name</th><th>Category</th><th>Price</th><th>Stock</th></tr></thead>
            <tbody>
              {stats.recent.map((p) => (
                <tr key={p._id}><td>{p.name}</td><td>{p.category}</td><td>Rs. {p.price}</td><td>{p.stock}</td></tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </>
  );
}
