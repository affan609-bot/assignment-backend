import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../api/axios.js';

export default function Products() {
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const load = async () => {
    setLoading(true);
    try {
      const { data } = await api.get('/products', { params: { search, category, limit: 50 } });
      setProducts(data.data || []);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load products.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, []);

  const remove = async (id) => {
    if (!confirm('Delete this product?')) return;
    try {
      await api.delete(`/products/${id}`);
      load();
    } catch (err) {
      alert(err.response?.data?.message || 'Delete failed.');
    }
  };

  return (
    <>
      <h1 className="page-title">Products</h1>
      <div className="toolbar">
        <input className="input" placeholder="Search products..." value={search} onChange={(e) => setSearch(e.target.value)} />
        <input className="input" placeholder="Category filter" value={category} onChange={(e) => setCategory(e.target.value)} />
        <button className="btn btn-primary" onClick={load}>Search</button>
        <button className="btn btn-ghost" onClick={() => navigate('/products/new')}>+ Add Product</button>
      </div>
      {error && <div className="alert alert-error">{error}</div>}
      {loading ? <div className="empty">Loading...</div> : products.length === 0 ? <div className="empty">No products found.</div> : (
        <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
          <table className="table">
            <thead><tr><th>Image</th><th>Name</th><th>Category</th><th>Price</th><th>Stock</th><th>Actions</th></tr></thead>
            <tbody>
              {products.map((p) => (
                <tr key={p._id}>
                  <td>{p.images?.[0] ? <img src={p.images[0].url} alt={p.name} /> : <div style={{ width: 48, height: 48, background: '#f1f5f9', borderRadius: 6 }} />}</td>
                  <td>{p.name}</td>
                  <td>{p.category}</td>
                  <td>Rs. {p.price}</td>
                  <td>{p.stock}</td>
                  <td>
                    <button className="btn btn-ghost btn-sm" onClick={() => navigate(`/products/${p._id}/edit`)}>Edit</button>{' '}
                    <button className="btn btn-danger btn-sm" onClick={() => remove(p._id)}>Delete</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </>
  );
}
